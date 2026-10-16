# Backend Production Deployment

Date: 2026-10-16 (Asia/Tashkent)

## Result and scope

**PASS: production FastAPI backend is deployed and reaches Neon PostgreSQL.**

- Stable backend URL: https://student-council-backend.vercel.app
- Verified deployment: https://student-council-backend-7v54xn3o4-diamond-dogs2.vercel.app
- Deployment ID: dpl_6Mdke7tNpVWjSM1k6rT4XA1g5n9r; Vercel state READY.
- Scope: diamond-dogs2.
- Backend project: student-council-backend,
  prj_2tZFlmGYSqCeyPLAEguge8d0wskn.
- Frontend remains https://student-council-ecru.vercel.app.
- Migration revision: 0001 (head).
- Remaining deployment blocker: none.

This continuation started from clean main at ed23809, following the earlier
47ca33f baseline. The previous Marketplace consent blocker is resolved: the
owner completed acceptance, and the CLI now sees the Neon installation.
No new legal agreement was accepted by the agent.

Only production infrastructure, a required shared TLS connection policy, its
tests and deployment documentation changed. No frontend behavior/API wiring,
feedback submission, invented content, administrator bootstrap, dependency
upgrade, documents feature, downgrade or stash operation was performed.

## Neon: Free only

- Resource/project name: student-council.
- Resource ID: store_C1ddOyEjDoNvJqmX.
- Installation: icfg_Yk0vDn1ByyqOM4gAYRM3uJQj.
- Live resource state: available.
- Live installation/resource plan: free_v3, Free.
- Installation cost: Free; paymentMethodRequired: false.
- Requested region: iad1; backend build/function region: iad1.
- Neon Auth and Realtime were explicitly disabled during provisioning.
- PostgreSQL database inside the named Neon project: provider default neondb.
- Resource connection: student-council-backend, Production only.
- No paid tier, card, trial, billing activation, upgrade or spend threshold
  was accepted/configured.

Inventory was checked before provisioning to avoid duplicates. Provisioning used
--no-connect and --no-env-pull so the locally linked frontend could not receive
database credentials. The resource was then explicitly connected only to the
dedicated backend's Production environment.

The integration initially supplied 16 provider variables. Its unused aliases,
password copies, direct URL and project-ID variable were removed from the backend
environment; the final inventory contains exactly the seven names below.
No database credentials were added to frontend settings.

## Secure production environment

Values are deliberately omitted, including all database URLs and signing secrets.

| Variable                    | Backend Production state           |
| --------------------------- | ---------------------------------- |
| DATABASE_URL                | Configured as sensitive/write-only |
| JWT_SECRET_KEY              | Configured as sensitive/write-only |
| JWT_ALGORITHM               | Configured                         |
| ACCESS_TOKEN_EXPIRE_MINUTES | Configured                         |
| REFRESH_TOKEN_EXPIRE_DAYS   | Configured                         |
| CORS_ORIGINS                | Configured                         |
| APP_ENV                     | Configured                         |

JWT generation used Python's cryptographically secure secrets module
(token_urlsafe with 64 random bytes). Secret values traveled through process
memory and stdin, never shell arguments, source, reports, examples or Git.
The database URL was adapted in memory to SQLAlchemy's asyncpg scheme while
retaining the actual provider credentials, database and pooled endpoint.

The existing algorithm, expiry durations and explicit frontend origin were
configured as requested. APP_ENV is production. No FIRST_ADMIN variables,
additional application variables or preview/development DB binding were added.

A CLI-created local OIDC environment file and automatically downloaded Neon
agent-skill artifacts were removed rather than published. They were generated
during this attempt, not pre-existing user files; skills can be obtained again
from their upstream package. The temporary helper scripts contain logic only,
live under ignored backend/.vercel and are removed after verification.

## Required TLS compatibility change

The provider's URL includes libpq-only sslmode/channel_binding parameters.
The installed SQLAlchemy dialect forwards query keys directly to asyncpg, so
these parameters cannot simply be copied into the application's URL.

An initial read-only probe with the string ssl=verify-full failed because
asyncpg looked for a user PostgreSQL CA file instead of system trust roots.
No migration had run at that point. Verification was not weakened.

app/db/connection.py now creates the production SSLContext with
ssl.create_default_context(): CERT_REQUIRED and hostname checking are enabled.
Both application sessions and Alembic use that single helper.
The deployed URL has the asyncpg scheme without incompatible query parameters.
Development/test connectivity remains unchanged; existing pooling/pre-ping
behavior is retained.

Direct and pooled connections both completed verified TLS 1.3 handshakes and
reached the same database/schema. Client transport inspection confirmed an SSL
object and verified peer certificate. pg_stat_ssl reported false on the database
side; it was not used as proof of client transport because the Neon endpoint
sits between the client and PostgreSQL. The actual client TLS handshake is the
transport evidence here.

The Postgres best-practices review informed use of the provider's pooled
application endpoint and a matching direct migration endpoint. No global
connection-limit or database-server setting was changed.

## Safe migration and data state

Before any schema change, a read-only probe confirmed the matching direct/pooled
provider identity, database neondb, verified TLS and an empty public schema.
The direct URL was injected only into the migration child process.

Commands actually run against the new production target:

```bash
alembic upgrade head
alembic current
```

Results:

- Upgrade succeeded transactionally from an empty schema to 0001.
- alembic current returned 0001 (head).
- Both direct and pooled checks found alembic_version plus users, feedback,
  news, events and projects.
- Read-only counts were zero in all five application tables.
- No create_all, downgrade, seed, production pytest/smoke cleanup, synthetic
  feedback or administrator bootstrap was run.
- Imports, builds, request handling and lifespan do not run migrations.

Health executes SELECT 1 through the configured application database session.
The deployed app's DATABASE_URL came from this new Neon resource; both real
HTTPS health routes returned the expected JSON after querying that database.
This is production runtime evidence, not an inference from unit tests.

## Deployment and HTTPS verification

The backend was uploaded from backend/ using its own .vercelignore and native
FastAPI configuration. Vercel selected Python 3.13 and installed pyproject.toml
runtime dependencies. No legacy wrapper, route rewrite, frontend source upload,
automatic migration command or authentication-model change was added.

The backend has its own ignored local project link. The repository-root link
still points to frontend student-council. The new backend's default Vercel SSO
deployment protection was disabled for its public API; existing application JWT
authorization remains intact. No other project's protection was changed.

| Production check                          | Actual result                             |
| ----------------------------------------- | ----------------------------------------- |
| GET /health                               | 200, status ok, database-backed           |
| GET /api/v1/health                        | 200, status ok, database-backed           |
| GET /docs                                 | 404, intentionally disabled in production |
| GET /openapi.json                         | 404, intentionally disabled in production |
| GET /api/v1/news                          | 200, empty JSON list                      |
| GET /api/v1/events                        | 200, empty JSON list                      |
| GET /api/v1/projects                      | 200, empty JSON list                      |
| Anonymous GET /api/v1/feedback            | 401; protected read remains protected     |
| GET health with the exact frontend Origin | Correct Access-Control-Allow-Origin       |
| GET health with an unrelated Origin       | No Access-Control-Allow-Origin            |
| OPTIONS feedback preflight from frontend  | 200; no POST/data submission              |
| Existing frontend HTTPS                   | 200                                       |

The temporary collection verifier initially expected an envelope; source
inspection confirmed the existing list response contract. The verifier was
corrected to assert an empty list, and the full read-only check then passed.
No API response contract was changed to satisfy the verifier.

Backend deployment currently uses the explicit CLI release workflow; automatic
Git deployment was not connected. Deploy from backend/, whose local project root
is the backend itself. If Git auto-deployment is later enabled for this monorepo,
first set that project's Git Root Directory to backend and adjust the CLI upload
workflow accordingly; do not replace the frontend's root project link.

## Local verification during this continuation

| Check                                                         | Actual result                                       |
| ------------------------------------------------------------- | --------------------------------------------------- |
| Backend pytest with isolated repository-local basetemp        | 40 passed in 7.67s                                  |
| Backend Ruff check                                            | PASS                                                |
| Backend Ruff format check                                     | PASS, 51 Python files                               |
| npm run lint                                                  | PASS                                                |
| npm run typecheck                                             | PASS                                                |
| npm run build                                                 | PASS, six static outputs                            |
| npm run format:check                                          | FAIL: 44 pre-existing untouched formatting findings |
| docker compose config --quiet                                 | PASS; not a Docker runtime test                     |
| Changed Markdown formatting                                   | Checked before commit                               |
| git diff --check / staged scope and credential-pattern checks | Checked before commit                               |

Four TLS-related tests were added. Existing frontend formatting and the previously
recorded six high-severity frontend dependency findings remain separate debt;
no broad formatting or dependency remediation was attempted. No new Docker
runtime verification or rendered frontend/browser QA is claimed.

## Repository and preservation

Commit scope: shared backend production TLS helper, its application/Alembic use,
four isolated tests, backend README, deployment guide and this report. The final
handoff records the commit SHA and confirmed push result after publication.

Frontend source/assets/dependencies/configuration have no tracked diff. No
frontend settings or environment values were changed, and no frontend CLI
deployment was requested. Secret-bearing local files are not staged.

Preserved stash: stash@{0},
5c6cfb9594cc93bcf7380c57495b31676d9b0f31,
preserve-local-v0.3-before-backend-foundation-2026-10-11.
It was never applied, popped, dropped or otherwise modified.

Next product work remains a separate request: connect the existing feedback form
to FastAPI/PostgreSQL, then consider Documents v1. Neither is part of this release.

## Official references checked

- https://vercel.com/docs/frameworks/backend/fastapi
- https://neon.com/docs/guides/vercel-managed-integration
- https://magicstack.github.io/asyncpg/current/api/index.html
