# Backend foundation

Date: 2026-10-11

## Scope and baseline

Implement the backend exclusively under `backend/`, plus root Docker, environment
ignore rules and documentation required to run the stack. Preserve Diyor's frontend
at current remote main `3892709`; do not connect static UI content to APIs yet.

The checkout moved to `D:\Workshop\Studen Council\Website`. A required
`git pull --ff-only` initially lacked tracking information, and the explicit
`git pull --ff-only origin main` then detected overlapping legacy v0.3 changes.
Those changes (including untracked assets/docs) were preserved in the named stash
`preserve-local-v0.3-before-backend-foundation-2026-10-11`. The fast-forward
succeeded afterward. The stash was deliberately retained rather than applying old
frontend changes over the current redesign.

Frontend lint now ignores `backend/**`; Prettier ignores local Python tooling
artifacts. No files in `src/`, `public/`, or frontend dependency metadata changed.

## Architecture

Thin HTTP routers -> focused services -> async SQLAlchemy sessions -> PostgreSQL.
Pydantic validates API inputs/outputs; Alembic owns schema evolution. Content
configuration and frontend interactions remain unchanged.

## Implemented

Health at `/health` and `/api/v1/health`; JWT login, refresh, me; ADMIN user
management; public feedback submission and protected feedback review; news,
events, and projects with published-only public reads and protected CRUD.
Collections use limit/offset (20 by default, maximum 100).

| Prefix/resource             | Public                                   | Protected                                       |
| --------------------------- | ---------------------------------------- | ----------------------------------------------- |
| `/health`, `/api/v1/health` | GET database readiness                   | None                                            |
| `/api/v1/auth`              | POST `/login`, POST `/refresh`           | GET `/me`                                       |
| `/api/v1/users`             | None                                     | ADMIN: GET list, POST; GET/PATCH/DELETE `/{id}` |
| `/api/v1/feedback`          | POST (id/status receipt)                 | ADMIN/EDITOR: GET list; GET/PATCH `/{id}`       |
| `/api/v1/news`              | GET list, GET `/{slug}` (published only) | ADMIN/EDITOR: POST; PATCH/DELETE `/{id}`        |
| `/api/v1/events`            | GET list, GET `/{id}` (published only)   | ADMIN/EDITOR: POST; PATCH/DELETE `/{id}`        |
| `/api/v1/projects`          | GET list, GET `/{slug}` (published only) | ADMIN/EDITOR: POST; PATCH/DELETE `/{id}`        |

Feedback PATCH permission follows the explicit administrative-endpoint rules in
section 11 of the brief. No parser or admin UI was implemented.

## Database

Five tables: users, feedback, news, events, projects. UUID keys, timestamps,
unique email/slugs, explicit enum constraints, and a reversible initial migration.
No invented Student Council content is seeded.

## Authentication

Argon2 via pwdlib; PyJWT with restricted algorithms, expiry, issuer, required
claims and separate access/refresh types. Every authenticated request rechecks
the user's current activity and database role. Secrets come from environment.
Optional admin bootstrap creates only a missing user and never overwrites it.

## Docker

Frontend: Next.js production container on 3000. Backend: FastAPI on 8000, with
Alembic and optional bootstrap before Uvicorn. DB: PostgreSQL 17, default Compose
network, named volume and readiness healthchecks. Host ports bind to loopback by
default; PostgreSQL is not exposed to the host.

Runtime QA used the separate `student-council-foundation-qa` project and its own
`student-council-foundation-qa_postgres_data` volume. The existing Paykar stack
already owns host port 3000. The initial default-port startup correctly reported
a bind conflict; no unrelated container was stopped. Setting FRONTEND_PORT=3104
allowed the full stack to start. Defaults remain 3000/8000 for a free host.

## Tests

Unit/API tests use dedicated in-memory SQLite sessions with an explicit test
configuration; real application sessions require PostgreSQL. No test uses a
development or production database. Runtime integration uses the isolated QA
Compose project above.

| Command/check                                                                   | Result                                                                                                                                                                  |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                                  | PASS, zero warnings                                                                                                                                                     |
| `npm run typecheck`                                                             | PASS                                                                                                                                                                    |
| `npm run build`                                                                 | PASS, all six static pages generated                                                                                                                                    |
| `npm run format:check`                                                          | FAIL: 45 existing files on remote main; no frontend formatting changes made                                                                                             |
| Targeted `prettier --check` for all added/changed supported files               | PASS                                                                                                                                                                    |
| `git diff --check`                                                              | PASS                                                                                                                                                                    |
| `pytest -q --basetemp=.pytest_cache/tmp-foundation-final-20261011` from backend | PASS: 36 tests, 6.29 seconds                                                                                                                                            |
| `ruff check .` and `ruff format --check .` from backend                         | PASS: 49 Python files formatted                                                                                                                                         |
| `docker compose -p student-council-foundation-qa config --quiet`                | PASS                                                                                                                                                                    |
| `docker compose -p student-council-foundation-qa build`                         | PASS: both production images built                                                                                                                                      |
| Compose `up --build -d --wait --wait-timeout 180` with FRONTEND_PORT=3104       | PASS: frontend/backend/db running, DB/backend healthy                                                                                                                   |
| PostgreSQL `alembic current`                                                    | PASS: `0001 (head)`                                                                                                                                                     |
| PostgreSQL `alembic downgrade base` then `upgrade head`                         | PASS: reversible roundtrip on verified empty QA database                                                                                                                |
| PostgreSQL `alembic check`                                                      | PASS: no new upgrade operations detected                                                                                                                                |
| `tests/postgres_smoke.py` against running QA backend/PostgreSQL                 | PASS: bootstrap idempotence, login/refresh/token types, RBAC, inactive users, private feedback, all content CRUD, drafts and slug conflicts; synthetic fixtures removed |
| QA Compose `down` then `up -d --wait`                                           | PASS: volume retained and synthetic feedback persisted; fixture then removed by its exact UUID                                                                          |
| Final QA database contents                                                      | Zero application rows; no invented public content/admin credentials retained                                                                                            |
| `npm audit --json`                                                              | Reports six existing high-severity vulnerable packages, including Next.js; dependency changes outside this task were not made                                           |

The initial pytest run passed 31 tests but failed bootstrap fixture setup because
Windows denied access to the shared user temp directory. Rerunning with an unused
repository-local basetemp resolved this environment problem. Additional tests
cover current-role changes, database outages and production docs disabling.

HTTP checks returned 200 for `http://localhost:3104`,
`http://localhost:8000/health`, `/api/v1/health`, `/docs`, and `/openapi.json`.
Health executes a database query, not just a process-liveness response. These are
HTTP/runtime checks, not a rendered-browser visual inspection.

Reproduce the isolated smoke test on Windows, with an empty QA database:

```powershell
$env:FRONTEND_PORT='3104'
docker compose -p student-council-foundation-qa up --build -d --wait
docker compose -p student-council-foundation-qa run --rm --no-deps `
  -v "${PWD}/backend/tests:/qa:ro" -e SMOKE_ISOLATED_DATABASE=1 `
  backend python /qa/postgres_smoke.py
```

The smoke script refuses any nonempty database. Never run downgrade/cleanup
checks against a real application database. The QA stack was left running on
3104/8000; use `docker compose -p student-council-foundation-qa down` to stop it
without deleting its volume. No commit or push was performed during implementation;
the user subsequently authorized publication in a separate request.

## Remaining work

Frontend API integration, admin UI, approved real content, and parser source
requirements are future tasks. Production deployment must supply unique secrets,
HTTPS and approved CORS origins.

Review/update the existing frontend dependency vulnerabilities in a separate
approved scope before production deployment. Existing frontend formatting debt
is also outside this backend task. Stateless refresh-token revocation and a
password-change flow are not included in the requested foundation.
