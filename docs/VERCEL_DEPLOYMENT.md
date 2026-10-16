# Production deployment: Vercel

Checked against official documentation on 2026-10-16. This is not the local
Docker runtime. See root README for `docker compose up --build` and local ports.

## Topology and project selection

Use two Vercel projects connected to the same Git repository:

| Project  | Root Directory | Framework | Persistent storage          |
| -------- | -------------- | --------- | --------------------------- |
| Frontend | `.`            | Next.js   | None                        |
| Backend  | `backend`      | FastAPI   | External managed PostgreSQL |

Select existing projects before creating anything. In CLI, run from repository
root: `npx vercel whoami`, `npx vercel teams ls`, `npx vercel project ls`, then
`npx vercel link --repo` to select the intended linked project. If it is not
Git-linked yet, use the dashboard to import Human-Unit/Student_Council, set the
correct Root Directory, and use a stable project name. Do not link an unrelated
project or create duplicate projects on retries. The implementation report records
the actual project names, deployment URLs and remaining blockers.

`.vercel/` is local/ignored. Do not commit downloaded environment files or tokens.
Root `.vercelignore` excludes backend, docs, local builds and secrets from frontend
CLI uploads. Backend has its own upload exclusions and Python version file.
Keep those ignore boundaries when using separate project roots.

## Frontend

Root `vercel.json` pins the native Next.js framework; npm scripts/package-lock
remain unchanged. Use `npm ci` and the standard `npm run build`, with no custom
output directory or static export. Keep App Router icons, OG route, local fonts,
metadata and existing UI unchanged.

Frontend environment names:

- `NEXT_PUBLIC_SITE_URL`: actual production HTTPS origin, once verified.
- `NEXT_PUBLIC_API_URL`: actual backend origin plus `/api/v1`, only after backend
  exists. Leave unset rather than inventing a URL; current UI does not call it.
- `VERCEL_PROJECT_PRODUCTION_URL`: Vercel-provided fallback already used by
  `src/app/layout.tsx`; do not replace the source with a hardcoded URL.

These public variables must never contain secrets. Metadata is generated during
build, and NEXT_PUBLIC variables are bundled at build time; redeploy after edits.
Set Preview and Production scopes deliberately. Do not let a preview use the
production database. After linking the correct frontend project:

```bash
npx vercel deploy --prod
```

Do not blindly copy a project link for the frontend into the backend directory.
For repeated CLI deployment of a monorepo, select the appropriate project from
root with `vercel link --repo`; its project setting owns the Root Directory.

## Backend

`backend/vercel.json` selects native FastAPI. Existing `backend/app/main.py`
exports `app` at an officially supported entrypoint, so no proxy wrapper, root
Python file, legacy `builds` mapping or route rewrite is needed. `.python-version`
selects supported Python 3.13, consistent with local Docker. Dependencies remain
in pyproject.toml, without the test extra in production.

No application module or database behavior is changed for deployment. In
particular, imports/lifespan do not run migrations or bootstrap users. Docker's
startup command is not Vercel's startup mechanism.

Configure these environment names securely in the backend project's Production
environment before deploying:

- `APP_ENV` (production)
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `REFRESH_TOKEN_EXPIRE_DAYS`
- `CORS_ORIGINS`
- Optional `APP_NAME`
- Optional one-time `FIRST_ADMIN_EMAIL`, `FIRST_ADMIN_PASSWORD` for the explicit
  bootstrap command only; remove after use, do not leave in frontend settings.

Use Vercel Secret/write-only settings for credentials. Generate a strong unique
JWT signing secret directly in secure environment configuration; do not place it
in commands/history, examples, source, reports or logs. Production validation
rejects the bundled development JWT placeholder. Keep token durations appropriate
to the existing Settings fields; no session/RBAC behavior changes here.

Production currently disables `/docs` and `/openapi.json`: 404 is expected, not
a failed deployment. Do not set APP_ENV=development merely to expose Swagger.

## PostgreSQL and explicit migration gate

Provision/select an approved managed PostgreSQL database through an existing
Marketplace integration or supply credentials through secure environment setup.
Do not reuse another application's database or invent a production URL. The
function runtime has a read-only filesystem and temporary scratch storage, not
durable SQLite/PostgreSQL storage. Compose does not run on Vercel.

Before any write/migration, have the owner confirm the target provider, project,
database, region and intended environment. Do not log credentials to confirm it.
Use a distinct preview/test database; never run smoke/downgrade tests on production.

The current app expects a SQLAlchemy asyncpg URL (`postgresql+asyncpg` scheme).
Marketplace connection strings may need provider-specific adaptation: preserve
credentials and required TLS; do not pass libpq-only parameters such as sslmode
blindly to asyncpg. Confirm the driver's supported TLS settings and certificate
verification with the chosen provider before deployment. Do not disable TLS just
to make connectivity pass.

Use the provider's supported pooling endpoint for scalable functions, and place
the backend near its database. Existing SQLAlchemy sessions already pool per
function instance; they do not impose a global connection cap across scaled
instances. Confirm connection limits, TLS, asyncpg prepared-statement compatibility
and pooler mode for the actual provider. This preparation is not proof of live
provider compatibility; no database provider has been assumed.

Migrations are a manual serialized release step from a trusted environment with
the backend dependencies and the confirmed production secrets injected securely:

```bash
cd backend
alembic current
alembic upgrade head
alembic current
alembic check
```

Do not put migrations in Vercel's build command, imports or every request: previews
and concurrent builds must not mutate production. Take the provider's normal
backup/snapshot precautions before applying future migrations. Never run
`alembic downgrade base` or `tests/postgres_smoke.py` against real data.

If first-admin bootstrap is needed, run `python -m app.db.init_db` once with
securely injected bootstrap environment after upgrade; it never overwrites an
existing user. Vercel will not automatically execute Docker bootstrap.

## CORS and verification

Once real origins exist, set CORS_ORIGINS to a comma-separated exact frontend
origin list (no paths or trailing slash). Do not wildcard all Vercel previews.
Localhost may remain a separate development setting; do not mix all environments
into one production DB. Redeploy backend after environment changes.

Frontend release checks: homepage HTTP 200; rendered desktop/mobile; static
CSS/JS/font/emblem/icon assets load; absolute OG image and proper Russian metadata;
menu open/Escape/anchor close; no relevant console/hydration errors or horizontal
overflow. Existing frontend data stays static.

Backend release checks: `/health` and `/api/v1/health` return 200 after actually
querying PostgreSQL. Production `/docs` and `/openapi.json` should return 404.
An HTTP 200 homepage cannot substitute for backend/DB health. Do not declare a
backend deployed or healthy until these checks pass against its real URL.

## Official references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [FastAPI entrypoint, lifecycle and native deployment](https://vercel.com/docs/frameworks/backend/fastapi)
- [Python versions and dependencies](https://vercel.com/docs/functions/runtimes/python)
- [Monorepo project Root Directory](https://vercel.com/docs/monorepos)
- [Environment variables and secret scopes](https://vercel.com/docs/environment-variables)
- [Marketplace managed databases](https://vercel.com/docs/storage)
- [Function filesystem/runtime limits](https://vercel.com/docs/functions/runtimes)
