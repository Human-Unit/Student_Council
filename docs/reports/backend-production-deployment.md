# Backend Production Deployment

Date: 2026-10-16 (Asia/Tashkent)

## Resumed attempt after reported terms acceptance

Status: **BLOCKED**. The user reported accepting Neon Marketplace terms and
authorized continuation. Retrying the exact Free-only provisioning command still
exited 1 with `integration_terms_acceptance_required` for `diamond-dogs2`.
The authenticated CLI account remains `ahmadsho240480-8400`.

Read-only checks after that failure:

- `integration installations --scope diamond-dogs2 --json`: empty installations.
- `integration list --all --scope diamond-dogs2 --json`: empty resources.
- The browser opened the scope-specific acceptance URL but redirected to Vercel
  login. This browser session is unauthenticated; it cannot establish whether
  acceptance occurred in another account/scope or whether a confirmation remains.
- The CLI still advertises `free_v3` as Free (Free). No card, payment, trial,
  billing activation or upgrade was accepted. No resource was created.

The exact cause of the missing acceptance is not established. No repeated
creation request or new legal acceptance was attempted after these checks.
In particular, `integration accept-terms neon --yes` was **not** run: it would
record a new legal acceptance, not merely check the acceptance the user reported.
No backend project, production environment variables or migration was created
while the first prerequisite remains blocked.

## Scope and baseline

Start from clean main at 47ca33f, matching origin/main. Provision only Neon Free
under diamond-dogs2, reuse/create student-council-backend, configure secrets only
through secure Vercel environment, explicitly migrate only the confirmed new DB,
then verify real HTTPS database-backed health and read-only public API responses.
No frontend behavior/integration, content seed, admin bootstrap, dependency
upgrades or destructive production migration tests. Keep the legacy stash intact.

## Vercel

Status: BLOCKED before resource provisioning. CLI 64.3.1 is authenticated as
ahmadsho240480-8400; scope diamond-dogs2 exists. The current project inventory
contains student-council, ipos-plan, apologiser and nasbi-noqil. No backend project
or backend local project link exists, so no duplicate was created.

The frontend link still points to student-council. Its existing public production
URL https://student-council-ecru.vercel.app returned HTTP 200 and was not redeployed
or reconfigured. The desired backend project is student-council-backend, but it
has not been created/deployed while the database prerequisite is blocked.
There is no actual production backend URL yet.

Current official Vercel FastAPI guidance confirms existing app/main.py is a
supported entrypoint. Existing backend/vercel.json and .python-version remain
unchanged. No wrapper or source relocation is needed.

## PostgreSQL

- Provider selected: Neon through Vercel Marketplace.
- Requested resource/project name: student-council.
- Available free plan confirmed by CLI: free_v3, displayed as Free (Free).
- Region requested: iad1, near the default Vercel function region.
- Neon Auth and Realtime requested disabled; existing FastAPI JWT remains the
  application auth mechanism.
- Resource created: no. Rechecked resource inventory returned an empty list.
- Connection configured: no. No connection string or database credentials exist
  for this attempt; no unrelated database was selected.
- No paid plan, card, trial, billing activation or upgrade was accepted.

The provisioning attempt deliberately used no-connect/no-env-pull so it could
not attach database secrets to the existing frontend project:

```bash
npx vercel@64.3.1 integration add neon --name student-council \
  --plan free_v3 --metadata region=iad1 --metadata auth=false \
  --metadata realtime=false --no-connect --no-env-pull \
  --scope diamond-dogs2 --json
```

Both the original attempt and this resumed attempt exited 1 with reason
`integration_terms_acceptance_required`. The add command provides a browser URL
and does not wait for acceptance in non-interactive mode. A separate CLI
`integration accept-terms` command exists, but it was not used to record new
consent on the owner's behalf or bypass this unresolved gate.

## Environment

| Variable                                 | Production backend status                                |
| ---------------------------------------- | -------------------------------------------------------- |
| APP_ENV                                  | Not configured; backend project not created              |
| DATABASE_URL                             | Not configured; database not created                     |
| JWT_SECRET_KEY                           | Not generated/configured; no secret persisted or printed |
| JWT_ALGORITHM                            | Not configured                                           |
| ACCESS_TOKEN_EXPIRE_MINUTES              | Not configured                                           |
| REFRESH_TOKEN_EXPIRE_DAYS                | Not configured                                           |
| CORS_ORIGINS                             | Not configured; intended origin is the existing frontend |
| FIRST_ADMIN_EMAIL / FIRST_ADMIN_PASSWORD | Intentionally disabled; no fake admin                    |

Settings currently requires the PostgreSQL asyncpg scheme and does not normalize
provider URLs. Actual Neon connection parameters/TLS must be inspected after
creation, not guessed. The Postgres best-practices review covered pooling and
connection limits, but no application/DB settings were changed without a real
target. Development defaults and Compose configuration are untouched.

## Alembic and database health

- Local migration head inspected: 0001, with down_revision None and the five
  expected application tables.
- Previous production revision: unavailable; no production DB exists.
- Production migration command: NOT RUN.
- Resulting production revision: unavailable.
- Production DB/table/content inspection: NOT RUN.
- No create_all, downgrade, seed, synthetic feedback or admin bootstrap ran.

Source check confirms health awaits `session.execute(text("SELECT 1"))` and
returns 503 on SQLAlchemy database errors. That verifies implementation intent,
not production connectivity. DB-backed production health is NOT VERIFIED.

| Production backend endpoint          | Result                                                       |
| ------------------------------------ | ------------------------------------------------------------ |
| GET /health                          | NOT RUN: no deployed backend/DB                              |
| GET /api/v1/health                   | NOT RUN: no deployed backend/DB                              |
| GET /docs                            | NOT RUN; current production config is designed to return 404 |
| GET /openapi.json                    | NOT RUN; current production config is designed to return 404 |
| GET /api/v1/news, /events, /projects | NOT RUN: no deployed backend/DB                              |

## Verification from the earlier preflight

The application checks below were completed before this resumed attempt. They
were not rerun or represented as new production verification: the resumed
attempt changes only this report, not application code or configuration.

| Check                                                                              | Actual result                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| Remote/local main after fetch                                                      | Match at 47ca33f; ahead/behind 0/0               |
| Vercel whoami and project inventory                                                | PASS, authenticated, no backend duplicate        |
| `integration add neon --help`                                                      | Confirms free_v3 and iad1 metadata option        |
| Provision Neon Free command above                                                  | BLOCKED: integration_terms_acceptance_required   |
| `integration list --all --json --scope diamond-dogs2` after attempt                | Empty resources                                  |
| `npm run lint`                                                                     | PASS                                             |
| `npm run typecheck`                                                                | PASS                                             |
| `npm run build`                                                                    | PASS, six static outputs                         |
| Backend `pytest -q --basetemp=.pytest_cache/backend-production-preflight-20261016` | PASS: 36 tests in 8.61s                          |
| Backend `ruff check .` and `ruff format --check .`                                 | PASS, 49 Python files formatted                  |
| `docker compose config --quiet`                                                    | PASS; no new Docker runtime verification claimed |
| `git diff --check`                                                                 | PASS                                             |
| Existing public frontend HTTPS                                                     | HTTP 200                                         |

Existing 44 frontend formatting findings and six high-severity frontend dependency
findings remain previously recorded debt; no upgrade or mass-format was done.
Neither static/source checks nor unit tests are reported as a production DB test.

## Resumed-attempt verification

| Check                                                       | Actual result                                       |
| ----------------------------------------------------------- | --------------------------------------------------- |
| Fresh remote fetch and main comparison before report commit | Match at 47ca33f; ahead/behind 0/0                  |
| CLI account                                                 | ahmadsho240480-8400                                 |
| Existing backend project                                    | Absent; no duplicate created                        |
| Exact Free-only provisioning retry                          | Exit 1: integration_terms_acceptance_required       |
| Scope-level integration installations                       | Empty                                               |
| Scope-wide resource inventory after retry                   | Empty                                               |
| Browser acceptance-page inspection                          | Redirected to login; consent state unverified       |
| Production migration / alembic current                      | NOT RUN: no confirmed database target               |
| HTTPS backend endpoints / DB-backed health                  | NOT RUN: no backend deployment or database          |
| Targeted report formatting and staged whitespace checks     | Verified before the report-only commit              |
| Stash object                                                | Unchanged: 5c6cfb9594cc93bcf7380c57495b31676d9b0f31 |

## Repository

Only docs/reports/backend-production-deployment.md was added for this attempt.
No application/config/dependency or README change was needed before the external
gate. No production values entered source, examples, reports, shell arguments or
Git. No frontend API wiring or other feature was added.

The original blocked attempt left this report untracked. The resumed request
explicitly authorizes committing/pushing repository changes, so this report alone
is the intended commit scope. The final handoff records the resulting commit and
remote synchronization after publication. Preserved stash remains unchanged at object
5c6cfb9594cc93bcf7380c57495b31676d9b0f31; it was never applied/popped/deleted.

## Remaining blocker and exact continuation

The reported terms acceptance is not reflected by the authenticated CLI for
`diamond-dogs2`. The account owner needs to resolve/confirm the final installation
consent in that exact scope while signed into the intended account:

https://vercel.com/diamond-dogs2/~/integrations/accept-terms/neon?source=cli

Alternatively, the owner can review and confirm the CLI's interactive legal
acceptance flow themselves:

```bash
npx vercel@64.3.1 integration accept-terms neon --scope diamond-dogs2
```

If the browser or CLI requires card details, billing activation, a paid tier,
trial or upgrade, stop without accepting those steps. Once installation/consent
is reflected, first recheck inventory to avoid duplication, then rerun the exact
Free provisioning command if still needed. Verify the created plan and identity,
link the dedicated backend project only, configure secure production environment,
confirm the new target, run explicit alembic upgrade head, and verify real HTTPS
DB-backed health. No production migration is safe before there is a confirmed
target. Any request for the agent to perform a new legal acceptance needs explicit
owner direction.

Only after successful infrastructure deployment: connect the existing Student
Voice frontend to POST /api/v1/feedback in a separate task.

## Official references checked

- https://vercel.com/docs/frameworks/backend/fastapi
- https://neon.com/docs/guides/vercel-managed-integration
- https://neon.com/pricing
