# Student Council API

For production Vercel preparation, project roots, secure environment setup and
the explicit migration gate, see [../docs/VERCEL_DEPLOYMENT.md](../docs/VERCEL_DEPLOYMENT.md).
Compose below remains the local full-stack workflow.

## Stack

FastAPI supplies HTTP routing and generated Swagger/OpenAPI. PostgreSQL stores
records; SQLAlchemy 2 provides typed models and async sessions using asyncpg.
Alembic is the only application schema migration path. Pydantic Settings reads
environment variables. pwdlib hashes passwords with Argon2; PyJWT signs access
and refresh tokens. ADMIN and EDITOR permissions use shared dependencies.

Python 3.13 or newer is required. All application code, migrations and tests live
here; the Next.js frontend remains at the repository root.

## Full stack

From the repository root:

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Windows PowerShell: `Copy-Item backend/.env.example backend/.env`, or copy the
file manually. Development defaults also work when `backend/.env` is absent.

Edit `backend/.env` before deployment: replace the example DB/JWT credentials,
set `APP_ENV=production`, and supply explicit CORS origins. Production rejects
the example JWT secret. Secrets and feedback must never be committed.

Compose reads the example followed by the optional local file for both database
and backend. If changing POSTGRES credentials, update DATABASE_URL accordingly;
URL-encode any reserved characters in URL credentials. Existing PostgreSQL
volumes retain their original credentials; environment changes do not reset them.

The backend waits for PostgreSQL health, runs `alembic upgrade head`, optionally
bootstraps the first admin, then starts Uvicorn without reload. Ports bind to
127.0.0.1; the DB is accessible only within the Compose network.

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- Versioned health: http://localhost:8000/api/v1/health
- Swagger in development: http://localhost:8000/docs

`docker compose down` retains the named `postgres_data` volume.
`docker compose down -v` deletes its database content.

NEXT_PUBLIC_API_URL is browser-facing (default http://localhost:8000/api/v1).
Next.js bundles it at build time. Rebuild when changing it. The backend database
host is `db`, not localhost; browser requests must not use Docker service names.

If host ports are occupied, set FRONTEND_PORT/BACKEND_PORT in the invoking shell
or root `.env` before startup. Update NEXT_PUBLIC_API_URL and CORS_ORIGINS when
using different browser addresses. For example, PowerShell:
`$env:FRONTEND_PORT='3104'`. Compose 2.24 or newer is required for the optional
local environment file configuration.

## Local setup

Run a separate PostgreSQL database first. Then:

```bash
cd backend
python -m venv .venv
```

Windows: `.venv\Scripts\activate`.
Linux/macOS: `source .venv/bin/activate`.

```bash
pip install -e ".[test]"
cp .env.example .env
```

For local Python execution change DATABASE_URL to use `localhost` and the port
of your local PostgreSQL instance instead of the Compose-only `db` hostname.
The standard Compose database is deliberately not published to the host.

```bash
alembic upgrade head
python -m app.db.init_db
uvicorn app.main:app --reload
```

`/health` actually queries PostgreSQL and returns 503 if the DB is unavailable.
Docs and OpenAPI are disabled in production.

Production PostgreSQL connections require TLS with certificate and hostname
verification using system trust roots. Both the application and Alembic use
`app/db/connection.py`; local development/test connections are unchanged. With
Neon, securely configure a `postgresql+asyncpg` URL without libpq-only query
parameters, using the pooled host for the application and the matching direct
host for manual migrations. See the deployment guide above for details.

## First administrator

Uncomment and set BOTH FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD in the local
environment file. Use a unique password of at least 12 characters in production.
Run `python -m app.db.init_db` after migrations, or let Compose startup run it.
It inserts only a missing email as ADMIN. An existing user is never promoted,
reactivated, or given a new password on restart. Missing values skip bootstrap.
Remove the bootstrap values after creating your admin.

There is no public signup. ADMIN can create EDITOR or ADMIN accounts through
`POST /api/v1/users`. Email is normalized to lowercase, unique, and never returned
with its password hash. The last active admin cannot be demoted/deleted.

## Authentication and permissions

`POST /api/v1/auth/login` accepts JSON email/password; refresh accepts JSON
`refresh_token`. Both return access_token, refresh_token, token_type.
Use `Authorization: Bearer <access_token>` for protected requests and Swagger's
Authorize button. Refresh tokens cannot access protected endpoints; access tokens
cannot refresh. Expiry, issuer, type, subject, active user and current DB role
are checked. Tokens are stateless: there is no logout/revocation list yet. Password
changes are not provided in this foundation.

ADMIN manages users. ADMIN/EDITOR manage content and access feedback review
endpoints, including PATCH status as specified in the brief. Public visitors only
see published content and can submit feedback without accounts.

## Endpoints

| Resource  | Public                                 | Protected                                |
| --------- | -------------------------------------- | ---------------------------------------- |
| Auth      | POST login, POST refresh               | GET me                                   |
| Users     | None                                   | ADMIN list/get/create/patch/delete       |
| Feedback  | POST submission (receipt only)         | ADMIN/EDITOR list/get/PATCH status       |
| News      | GET list, GET by slug (published only) | ADMIN/EDITOR create/PATCH/delete by UUID |
| Events    | GET list, GET by UUID (published only) | ADMIN/EDITOR create/PATCH/delete by UUID |
| Projects  | GET list, GET by slug (published only) | ADMIN/EDITOR create/PATCH/delete by UUID |
| Documents | GET list, GET by slug (published only) | ADMIN/EDITOR create/PATCH/delete by UUID |

All resource routes use `/api/v1`. Collections return arrays and accept
`limit=20&offset=0` (limit 1–100; offset >=0). No private feedback or drafts are
included in public lists. Feedback message length is 10–5000 trimmed characters.
Content uses plain text/Markdown; URLs must be HTTP(S), event timestamps must have
a timezone, and end time cannot precede start time.

Errors use `{"detail": ...}` with 401/403/404/409/422 and generic 500 responses.
Validation errors omit raw input to avoid reflecting secrets/private text.

Documents use revision `0002` and sort by nonnegative `sort_order`, then slug.
They store metadata and an optional stable DOCX URL, never file binaries.
There is no startup seed, upload service, admin UI or generator. Public frontend
integration is deferred; its current server catalog contains descriptions with
unavailable originals. See [documents architecture](../docs/DOCUMENTS_ARCHITECTURE.md)
before changing that boundary. Production still requires an approved migration
and updated backend deployment; local tests do not mutate Neon.

## Tests and quality

```bash
pytest
ruff check .
ruff format --check .
```

Tests explicitly use APP_ENV=test and a fresh in-memory SQLite async engine for
each test, injected via FastAPI's session dependency. They never read development
.env or connect to the application DB. Test-only create_all is used for the
isolated fixtures; the real application uses PostgreSQL and Alembic exclusively.
PostgreSQL migrations/DB integration require a separate Compose smoke run. For
tests requiring all production dependencies inside Linux, install `.[test]` in
a disposable container; never run test cleanup against a development database.

If Windows blocks pytest's shared temporary folder, pass a new unused directory,
for example `pytest --basetemp=.pytest_cache/local-qa-1`.

An opt-in PostgreSQL/HTTP smoke script lives in `tests/postgres_smoke.py`. It
requires `SMOKE_ISOLATED_DATABASE=1`, refuses a nonempty database, and exercises
bootstrap, auth, RBAC, feedback and all content CRUD through the running API.
Run it only in a fresh isolated Compose project, with the script mounted read-only
into the backend container; it removes its synthetic records on success. If it
fails midway, inspect the disposable QA database before rerunning.

Useful database checks:

```bash
alembic current
alembic check
```

`app/parsers/README.md` describes the future normalization boundary. No parser
source or real Student Council records are invented.

## Primary implementation references

- [FastAPI JWT and password hashing](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
- [SQLAlchemy async sessions](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Alembic asyncio migrations](https://alembic.sqlalchemy.org/en/latest/cookbook.html#using-asyncio-with-alembic)
- [Docker Compose environment files](https://docs.docker.com/reference/compose-file/services/#env_file)
