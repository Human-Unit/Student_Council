# AGENTS.md

Repository instructions for AI coding agents and automated development tools.

These rules apply to the whole repository unless a more specific `AGENTS.md` exists in a subdirectory. A nested file overrides this one only for files in its subtree.

## 1. Project snapshot

Student Council website for the MSU branch in Dushanbe.

Current frontend:

- Next.js 16.3.6, App Router
- React 19.3
- TypeScript 5.9
- Tailwind CSS 4 is installed, but the current visual system also uses section-specific CSS
- Brand implementation lives in `src/lib/brand.ts`, `src/styles/tokens.css`, `src/styles/*`, and brand assets under `public/`
- User-facing content is centralized primarily in `src/data/site.ts`

Planned backend:

- must live under `backend/`
- FastAPI
- PostgreSQL
- SQLAlchemy 2
- Alembic
- Pydantic Settings
- JWT authentication
- RBAC
- pytest

Root-level orchestration files such as Docker Compose, README, `.env.example`, and CI configuration may coordinate frontend, backend, and database.

## 2. Start every task by inspecting, not guessing

Before editing:

1. Read this file.
2. Read any more-specific `AGENTS.md` in the target subtree.
3. Inspect `git status` and the active branch.
4. Read the files that own the behavior you are changing.
5. Check existing patterns before introducing new abstractions, dependencies, tokens, helpers, or components.
6. For non-trivial changes, write down the intended scope before implementation and keep the diff inside it.

Do not infer repository state from old prompts, training data, or memory when the code can answer the question.

## 3. Use version-matched framework guidance

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This project uses Next.js 16.3.6. APIs, conventions, and file structure may differ from older training data. Before changing framework behavior, read the relevant bundled documentation under `node_modules/next/dist/docs/` when dependencies are installed. Heed deprecation notices and prefer the patterns supported by the installed version.

<!-- END:nextjs-agent-rules -->

For FastAPI, SQLAlchemy, Alembic, Pydantic, and other backend libraries, prefer the installed-version documentation and existing project configuration over remembered APIs.

## 4. Preserve ownership boundaries

Keep responsibilities clear and one-directional.

Frontend:

- `src/app/` owns App Router entry points, metadata, generated icons, and route composition.
- `src/components/` owns reusable UI and page sections.
- `src/data/site.ts` owns editable site content and external links unless the backend later becomes the source of truth for that data.
- `src/lib/brand.ts` and `src/styles/tokens.css` are the source of truth for brand primitives.
- `src/styles/` owns the current section-specific styling system.

Backend, once added:

- routers translate HTTP to application calls; keep them thin
- schemas validate API input/output
- services own business rules and use cases
- models describe persistence
- database/session code owns engine and transaction setup
- migrations own schema evolution
- parsers/adapters own external-source normalization

Preferred backend flow:

`router -> service -> persistence`

Do not let API routers accumulate database/business logic. Do not let frontend components talk directly to PostgreSQL. Do not put scraping/parser code inside HTTP route handlers.

## 5. Keep one authoritative path for each concern

Prefer a single path instead of parallel implementations.

Examples:

- one brand-token source, not repeated hex values across components
- one site-content configuration source until content is intentionally moved to the backend
- one database migration history through Alembic
- one authentication/authorization dependency path for protected backend endpoints
- one Compose stack for normal full-stack startup
- one canonical API prefix, planned as `/api/v1`

If a new implementation supersedes an old one, remove or migrate the old path when safe instead of leaving two competing systems.

## 6. Scope discipline

Make the smallest coherent change that satisfies the request.

Do not silently expand scope into:

- a redesign when the task is backend/infrastructure
- a CMS/admin UI when only APIs are requested
- microservices
- Redis, Celery, queues, WebSockets, or background workers without a real requirement
- new frontend state-management libraries without need
- new animation libraries for effects already achievable with the current stack
- broad refactors unrelated to the requested change

For architectural changes, dependency additions, auth model changes, database model redesigns, or large cross-cutting refactors: explain the need first and keep the implementation reviewable.

## 7. Dependency discipline

Reuse the standard library and existing dependencies when reasonable.

Before adding a dependency:

1. verify the platform/framework does not already solve the problem
2. verify an existing dependency does not already solve it
3. justify the new dependency by concrete value
4. prefer maintained, mainstream libraries with clear licensing
5. avoid overlapping libraries that solve the same problem

Do not change dependency files only for convenience or style preference.

Never add copied binaries, unknown vendor assets, or unlicensed font files.

## 8. Frontend rules

Preserve the existing Student Council brand system.

- Reuse `Logo`, brand helpers, semantic tokens, and existing visual primitives before creating replacements.
- Do not hardcode new brand colors when a token exists.
- Do not redraw approved logos unless the task explicitly requires an authorized variant.
- Keep Russian user-facing copy truthful; do not invent team members, contacts, statistics, university claims, project statuses, or external links.
- `null`/missing external destinations must remain visibly unavailable or be hidden according to existing behavior; never point users to guessed URLs.
- Respect `prefers-reduced-motion`.
- Preserve keyboard navigation, visible focus, semantic HTML, ARIA state, and mobile usability.
- Avoid unnecessary client components; keep static/server-rendered code static when possible.
- Before introducing a new component, check whether an existing component or pattern already fits.

When changing content, prefer editing `src/data/site.ts` instead of scattering text through JSX unless the text is structural to a component.

## 9. Backend rules

When `backend/` is created, keep all backend application code there. Root-level files may orchestrate the stack, but Python application packages, tests, migrations, and backend dependency metadata belong in `backend/`.

Required baseline:

- FastAPI
- PostgreSQL for the real application
- SQLAlchemy 2-style APIs
- Alembic migrations
- environment-based configuration with Pydantic Settings
- async database access if the chosen driver/session setup is async
- JWT access/refresh tokens if authentication is implemented
- reusable RBAC dependencies instead of inline role checks
- pytest tests

Security rules:

- never store plaintext passwords
- never implement custom cryptography
- never commit real secrets
- validate token type, expiry, active-user state, and authorization separately
- parameterize database access through the ORM/driver; do not build SQL from untrusted string concatenation
- keep admin-only actions explicitly protected
- public visitors should not need accounts unless product requirements change

Database rules:

- Alembic is authoritative for schema evolution
- do not rely on `Base.metadata.create_all()` as the production migration strategy
- every persistent model change must include an intentional migration
- tests must not point at production data
- migrations should be reversible where practical and deterministic

API rules:

- use explicit request/response schemas
- use normal HTTP status semantics
- do not expose stack traces or secrets in production responses
- add pagination to unbounded collection endpoints
- keep OpenAPI/Swagger usable rather than hand-maintaining a separate API specification

## 10. Docker and environment rules

The intended full-stack development topology is:

`browser -> Next.js -> FastAPI -> PostgreSQL`

Use Docker Compose as the normal one-command stack once backend work begins.

Expected services:

- `frontend`
- `backend`
- `db`

Conventions:

- browser-facing URLs use host-accessible addresses such as `http://localhost:8000`
- container-to-container connections use Compose service names such as `db:5432`
- do not confuse browser URLs with Docker-internal DNS names
- PostgreSQL data must use a named volume
- add health checks where startup ordering depends on service readiness
- keep development defaults separate from deployment secrets
- `.env.example` may contain safe example values only
- document any required environment variable when introducing it

Do not claim Docker verification passed unless the stack was actually built and started.

## 11. Testing and verification are part of implementation

Do not stop at code generation. Verify the smallest relevant surface first, then the full required surface.

Current frontend checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

When backend exists, its documented checks become mandatory for backend changes. The expected baseline is equivalent to:

```bash
pytest
alembic upgrade head
```

and any configured formatter/linter/type checker added by the backend foundation.

For Docker/integration changes, also verify the Compose configuration and, when Docker is available, the running services and health endpoints.

For UI changes, source inspection alone is not visual QA. Use an actual browser/runtime when available and state clearly when visual testing could not be performed.

Never report a check as passed if it was skipped, unavailable, or only inferred.

## 12. Tests follow behavior changes

If behavior changes, add or update tests at the same time when the project has a suitable test layer.

Prefer tests that verify public behavior and contracts rather than implementation details.

Backend foundation tests should at minimum cover:

- health endpoint
- authentication success/failure
- unauthorized protected access
- role boundaries
- public feedback submission
- one public content endpoint

Keep tests deterministic and independent of live university services.

## 13. Generated and derived files

Do not hand-edit generated output when a source file or generator exists.

Examples include framework build output, generated OpenAPI clients (if introduced), generated route/type artifacts, and build caches.

If generated API clients are introduced later, document the generation command next to the source schema and regenerate them as part of the same change.

## 14. Documentation is part of the contract

Keep documentation synchronized with significant code changes.

Update the relevant README when changing:

- startup commands
- required tools/runtime versions
- environment variables
- service ports
- Docker workflow
- database migrations
- public API behavior
- project structure

If a subsystem becomes complex enough to need local rules, add a nested `AGENTS.md` in that subsystem instead of bloating the root file with implementation detail.

Treat `AGENTS.md` as a living specification: update it when architectural ownership, mandatory commands, or development workflow materially changes.

## 15. Git safety

Before editing, inspect the active branch and working tree.

- do not discard another contributor's uncommitted work
- do not rewrite history
- do not force-push
- do not merge unrelated branches as part of a coding task
- do not commit or push unless the user explicitly asks
- keep commits focused if a commit is requested
- never use destructive cleanup commands just to make verification easier

If the working tree is unexpectedly dirty, stop and understand why before modifying overlapping files.

## 16. Public-repository hygiene

This is a public repository. Never commit:

- passwords, API keys, JWT secrets, private tokens
- private student data or feedback content
- internal credentials
- personal information that is not intentionally public
- temporary Figma/MCP asset URLs or other short-lived signed URLs

Use placeholders and environment variables instead.

## 17. Agent completion report

At the end of a task, report concise evidence:

1. what changed
2. important files changed
3. commands/checks actually run and their exact result
4. anything not verified and why
5. remaining manual inputs or decisions

Do not pad the report with hypothetical work or claim success from static inspection alone.

## 18. Decision principle

Optimize for code that the Student Council team can understand, review, and continue maintaining.

Prefer clear ownership, conventional structure, explicit configuration, small diffs, and verifiable behavior over clever abstractions or maximum feature count.
