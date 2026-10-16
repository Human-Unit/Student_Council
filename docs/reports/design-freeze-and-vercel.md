# Design freeze and Vercel deployment

Date: 2026-10-16 (Asia/Tashkent)

## Scope and baseline

Baseline: clean `main` at `4e8f37d`. Preserve current frontend, backend behavior,
local Docker workflow, and the named legacy v0.3 stash without modifying it.
Document the actual design, extend the existing agent rules, capture real
screenshots if possible, verify the baseline, then prepare two Vercel projects
against current official documentation. No Documents module or API integration.

The checkout is now `D:\Workshop\Student Council\Website`. The existing Graphify
index covers the older landing, not Diyor's current components; it is not a
source of truth for this freeze. Source inspection takes precedence.

## Deployment topology decision (before configuration)

Use two projects: frontend at repository root (Next.js) and backend at `backend/`
(native FastAPI/Python), plus separately managed PostgreSQL. This follows current
official Vercel support and keeps Python dependencies, secrets, CORS and migration
ownership separate. Compose/PostgreSQL containers remain local only. No legacy
`builds`/catch-all routes or app-import migrations are necessary.

Official sources checked on 2026-10-16:

- [Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Native FastAPI, including app/main.py discovery](https://vercel.com/docs/frameworks/backend/fastapi)
- [Python runtime/version and bundle limits](https://vercel.com/docs/functions/runtimes/python)
- [Monorepo project root directories](https://vercel.com/docs/monorepos)
- [Environment scopes and secrets](https://vercel.com/docs/environment-variables)
- [Managed PostgreSQL via Marketplace](https://vercel.com/docs/storage)
- [Read-only runtime filesystem](https://vercel.com/docs/functions/runtimes)

CLI 64.3.1 is authenticated. The team `diamond-dogs2` has three existing projects;
their Git repositories are IPOS.Plan, Apologiser and Nasbi-Noqil, not
Human-Unit/Student_Council. No existing Student Council deployment is linked in
the checkout. Any newly created frontend project must have one stable explicit
name, not a random duplicate. Backend creation/deployment waits for a confirmed
managed database and secure environment configuration.

## Design freeze

Inspected root AGENTS/README/package scripts; src/app page/layout/globals and
image routes; src/data/site.ts; src/lib/brand.ts and typography.ts; CSS tokens,
base/component and all section responsive rules; Header, Logo, BrandDefs,
BrandShapes, Hero, About, Directions, Sectors/SectorVisual, Join, Team, Feedback,
Footer, ActionLink, SectionHeading, Ticker, ScrollText, Effects and PageTab.
Backend Settings, app/session setup, pyproject, README and Compose were also
checked to preserve deployment/local-runtime boundaries.

`docs/DESIGN_SYSTEM.md` documents the actual palette/sector colors, local NT
Somic, shared vectors, editorial composition, scoped glass/shadows, motion,
breakpoints, reusable components and anti-patterns. It explicitly distinguishes
current assets from older exported logos. Root AGENTS section 8 now makes reading
the document and preserving this intentional baseline mandatory. A scoped
src/AGENTS.md was unnecessary: the compact root addition covers frontend work
without duplicating rules. Design-only commit: `3b77cdf`.

Six real reference screenshots in docs/design-reference: desktop-home (1440×900),
landscape-home (1024×768), tablet-home (768×1024), mobile-home and mobile-menu
(390×844), desktop-about (1440×900). All were opened and inspected; none are mockups
or full-page composites. UI was not changed to improve screenshots.

## Current architecture and preservation

Next.js frontend remains static, with existing metadata/icon/OG routes. FastAPI
provides the existing authenticated/content APIs; PostgreSQL remains its only
real application database. No Documents module, frontend API integration,
parser, auth change, schema change or migration was added.

`git diff 4e8f37d -- src public package.json package-lock.json backend/app
backend/tests backend/alembic backend/pyproject.toml docker-compose.yml` is empty.
Backend changes are deployment metadata/upload exclusions and a README link only.
Local Docker startup/service definitions are unchanged; Docker ignore files now
also exclude local Vercel artifacts. Root git/format ignore rules protect those
artifacts from source control and checks.

The legacy stash name is unchanged, with object
`5c6cfb9594cc93bcf7380c57495b31676d9b0f31`; it was not applied, popped, deleted
or modified. No reset, force push, history rewrite or destructive database QA ran.

## Environment variables

Frontend: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_API_URL,
VERCEL_PROJECT_PRODUCTION_URL (system-provided fallback).

Backend: APP_ENV, APP_NAME, DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM,
ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, CORS_ORIGINS.
Optional explicit bootstrap: FIRST_ADMIN_EMAIL, FIRST_ADMIN_PASSWORD.

No custom frontend production environment variables were needed: the existing
system URL fallback generated a correct absolute production OG URL. The API
variable is intentionally unset until a real backend exists. No production
JWT/database secret was generated, logged, committed or guessed. Vercel link
downloaded a local .env.local OIDC credential; it and .vercel/ are ignored and
excluded from upload, and its content was not printed.

## Vercel

Frontend project: `diamond-dogs2/student-council`, ID
`prj_FtkbCPAMcNokdgNFmuqfsSxgZwLB`, Root Directory repository root, Next.js,
Node 24.x, npm ci / npm run build. The authenticated project inventory was
checked first; there was no existing project for this Git repository.

Production deployment `dpl_93VzXRk1DGLP7cUoxHzksM8ewURx` reached READY using
`npx vercel@64.3.1 deploy --prod --yes --scope diamond-dogs2 --project
student-council --logs`.

- Verified public production URL: https://student-council-ecru.vercel.app
- Deployment URL: https://student-council-qljamwkw2-diamond-dogs2.vercel.app
- Inspector: https://vercel.com/diamond-dogs2/student-council/93VzXRk1DGLP7cUoxHzksM8ewURx

Public homepage returned 200 without authentication. The generated OG image URL
uses the verified production origin. Versioned deployment URLs can be protected;
the public production alias is the acceptance target.

Root vercel.json explicitly selects native Next.js. Backend vercel.json selects
native FastAPI; existing app/main.py is a supported entrypoint. Backend
.python-version selects supported 3.13. Native support means no legacy route/build
wrapper, relocation, app-import migration or production Compose startup.
Backend Vercel project was deliberately not created/deployed without a DB.
Backend CLI dry inspection stopped at "Project is not linked"; no backend cloud
build/runtime validation is claimed. Configuration JSON parses, but that is not
equivalent to a cloud build.

Deployment was uploaded directly through CLI; automatic GitHub deployments are
not configured. No push was needed for this deployment. The design commit and
deployment-preparation commit remain local unless publication is requested later.

## Database and migrations

`vercel integration list --all --json --scope diamond-dogs2` returned an empty
resource list. No managed production database or target credentials are
configured. No provider was invented, no other project's DB reused, no production
schema migration/bootstrap performed, and no backend health claimed.

The documented release gate is owner confirmation of target provider/project/DB,
secure environment injection, explicit `alembic upgrade head` from backend,
then deployment and DB-backed health verification. No migration in build/imports.
Provider-specific TLS/pooling/asyncpg connection compatibility must be validated
against the actual chosen provider. See docs/VERCEL_DEPLOYMENT.md.

## Verification

| Check/command                                                       | Result                                                                                                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run lint`                                                      | PASS, no warnings                                                                                         |
| `npm run typecheck`                                                 | PASS                                                                                                      |
| `npm run build`                                                     | PASS: Next 16.3.6 production build, six static outputs                                                    |
| `npm run format:check` before scoped AGENTS formatting              | FAIL: 45 pre-existing files                                                                               |
| Final `npm run format:check`                                        | FAIL: 44 untouched existing files; changed AGENTS is formatted, no src mass-formatting                    |
| Targeted Prettier checks for modified/new supported files           | PASS                                                                                                      |
| `git diff --check`                                                  | PASS                                                                                                      |
| Backend `pytest -q --basetemp=.pytest_cache/design-freeze-20261016` | PASS: 36 tests in 7.99s                                                                                   |
| Backend `ruff check .`, `ruff format --check .`                     | PASS: 49 Python files                                                                                     |
| `docker compose config --quiet`                                     | PASS                                                                                                      |
| New Docker runtime run                                              | BLOCKED: Docker Desktop Linux engine pipe unavailable; no previous run is claimed as current verification |
| Vercel CLI whoami, team/project inventory                           | PASS, authenticated team inspected before creation                                                        |
| Frontend `vercel deploy --dry --json`                               | PASS: Next.js, 69 upload entries; backend/docs/.env.local/.vercel/node_modules excluded                   |
| Vercel production build                                             | PASS: cloud npm ci + Next.js build and static output generation; deployment READY                         |
| Cloud npm audit during install                                      | Six existing high-severity findings; dependencies unchanged, no forced audit fix                          |
| Backend live deployment/DB health                                   | BLOCKED: no confirmed managed PostgreSQL target/secrets                                                   |

### Local browser QA

Used existing Playwright + Chromium, because Browser plugin runtime/skill was
not listed. No package or browser installation was needed. Tested local
production server at http://127.0.0.1:3104. Temporary QA harness lives outside
committed source; requested reference screenshots are inside docs/design-reference.

| Check                                                   | 1440×900       | 1024×768           | 768×1024           | 390×844            |
| ------------------------------------------------------- | -------------- | ------------------ | ------------------ | ------------------ |
| Russian title/H1, meaningful content, fonts loaded      | PASS           | PASS               | PASS               | PASS               |
| Framework error overlay absent                          | PASS           | PASS               | PASS               | PASS               |
| Console errors/warnings and failed requests             | 0 / 0 / 0      | 0 / 0 / 0          | 0 / 0 / 0          | 0 / 0 / 0          |
| Maximum horizontal document overflow during full scroll | 0px            | 0px                | 0px                | 0px                |
| Screenshot opened/visually inspected                    | PASS           | PASS               | PASS               | PASS               |
| Navigation interaction                                  | Desktop anchor | Menu/Escape/anchor | Menu/Escape/anchor | Menu/Escape/anchor |

Narrow-menu checks included expanded state, main inertness, initial link focus,
Escape close and menu-close/inert removal after section navigation. Reduced
motion at 390×844 passed: scroll behavior auto, zero hidden reveal elements,
ticker animation none. Emblem, SVG icon, Apple icon and OG image returned 200
with expected image MIME types. Local metadata retains the unchanged localhost
fallback; production metadata was checked separately.

The first harness attempt used a dynamic accessible name after toggling the menu;
it timed out because the name correctly changed. The test locator was corrected
to the stable menu toggle, not the UI; the complete rerun passed.

### Production browser QA

Repeated the same full Playwright flow on the public production alias at all
four requested sizes. Each returned 200, loaded NT Somic, rendered the expected
Russian title/H1 and meaningful content, and had no framework overlay. Console
errors, warnings, failed requests and measured document overflow were zero at
every size. Desktop anchor navigation and narrow-menu open/focus/inert/Escape/
anchor-close passed. Reduced-motion behavior also passed in production.

Production desktop/mobile screenshots were opened and compared with the frozen
local references; the composition matched, with only expected timing variation
in the existing animated decoration. No visual fixes or app-source changes were
needed. Production screenshots remain outside the repo in the local temporary
QA directory to avoid duplicating the curated baseline.

HTTP checks also independently verified all nine referenced CSS/JS/font assets,
the emblem, SVG icon, Apple icon, and the exact absolute OG image URL from the
production metadata: all 200 with the relevant image types. These are actual
anonymous production HTTP/browser checks, not authenticated CLI bypass checks.
Browser scope is Chromium, not a cross-browser/accessibility certification.

## Blockers and next action

Backend production deployment requires the owner to select/confirm a managed
PostgreSQL target and configure its secure DATABASE_URL/JWT environment, then
approve that target for the explicit migration step. No credentials need to be
pasted into chat or committed. Configure exact CORS origins once the real backend
and frontend origins are known. Backend `/health` and `/api/v1/health` must query
that DB successfully; production `/docs` and `/openapi.json` are expected 404.

Docker Desktop must be running to repeat full local Compose runtime verification;
Compose configuration passed, but the daemon was not started as a side effect.
Existing formatting/security dependency debt is recorded, not silently rewritten.
No unrelated contributors' work was modified.
