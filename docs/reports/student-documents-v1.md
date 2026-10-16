# Student area and Documents v1

Date: 2026-10-16 (Asia/Tashkent). Baseline: 49136b3 on main.

## Implemented

- /student: editorial navigation to documents; practice explicitly coming soon;
  schedule destination explicitly unavailable because no verified URL exists.
- /student/documents: reusable, numbered, ruled document list.
- /student/documents/[slug]: five static detail pages with purpose, preparation
  notes, breadcrumbs, unavailable-source preview and download state.
- Utility-specific 404 without a nested main landmark.
- Shared desktop/mobile/footer navigation now includes Студенту. Homepage Hero
  and all existing chapters remain untouched; no new homepage marketing block.
- FastAPI documents resource with public published-only reads and existing
  ADMIN/EDITOR create/PATCH/delete permissions; no second authentication path.
- Conservative metadata model, intentional Alembic 0002 migration and tests.
- [Documents architecture](../DOCUMENTS_ARCHITECTURE.md), backend README and a
  bounded utility-pattern addition to the design baseline.

## Data and admin readiness

UI consumes StudentDocument data, not five handwritten JSX blocks.
src/lib/documents.ts is a server-only adapter with React cache for metadata/page
read deduplication. It currently reads the owner-provided descriptions from
src/data/student.ts, with publication filtering and stable ordering.
Unused persistence UUID/audit fields are not passed into presentation components.

API integration is intentionally deferred until the separate production migration
and backend release. No API base URL, auth token, client fetch, silent API-to-static
fallback or production data insertion was added. The adapter is the cutover point;
a future API adapter must handle configured URL, pagination and real empty/error
states rather than resurrecting local data after an unpublish or request failure.

Backend owns UUID, unique slug, title, nullable short_title, summary, category,
nullable template_url, nonnegative sort_order, is_published and timestamps.
Public lists use existing bounded pagination and sort_order/slug ordering.
The composite publication/order index follows the actual query; unique slugs
support public lookup. Shared persistence helpers retain conflict rollback/409.

Future admin can build metadata editing, publishing, reordering and template
attachment on this same resource. Protected draft/list/detail reads will still
need to be added for an admin UI. Unpublish is a non-destructive archive boundary;
delete currently removes metadata only. Full contract and extension points are
documented without speculative storage/generator implementation.

## Design fidelity

Read AGENTS.md and the complete DESIGN_SYSTEM.md before UI implementation.
Opened all six frozen reference PNGs and captured/viewed the actual pre-change
local production build at the four requested dimensions.

Reused NT Somic, tie(), shell/gutter/grid tokens, blue/paper/ink, existing rules,
SectionHeading and its pentagonal numbering, ActionLink/ArrowIcon, Star/Chevron,
Logo through the unchanged Header/Footer, PageTab, BrandDefs and Effects.
SectionHeading gained an optional h1 tag; ActionLink gained optional download and
accessible-label support. Their existing defaults are unchanged.

New CSS is scoped to student utility classes and loaded by the student layout.
Composition uses asymmetrical ruled rows and a paper-proportioned preview state,
not a rounded card grid. No font, color palette, gradient, icon family, animation
library or new visual system was introduced. No reference screenshots or approved
brand/font assets were modified.

Graphify's 189-node index was queried for navigation/header/footer/layout links;
its own correction marks it stale. It was used only as a navigation aid, with
current files authoritative. No graph rebuild/semantic extraction was performed.
React guidance kept document rendering server-side and reads deduplicated;
Postgres guidance informed the conservative matching composite index.

## Source documents

**No approved original DOCX files were present in the repository/worktree.**
No files were rewritten, generated, copied from elsewhere, or claimed as inspected.
No official body text was recreated. All five template_url values are null.

Titles/purposes and preparation notes come only from the supplied task. Notes
are explicitly labelled as guidance to check against the original, not a form
schema or verified verbatim DOCX content. Unavailable downloads are text rather
than fake links; the paper area explicitly says the source is absent and that
it is not an official form.

Originals still required:

1. Объяснительная о пропуске занятий.
2. Заявление об освобождении от занятий.
3. Заявление об отсрочке выплаты за обучение.
4. Заявление о выдаче справки об окончании.
5. Заявление о выдаче справки о том, что является студентом.

The architecture document maps each required original to a proposed stable
public/documents/templates/*.docx target. Those are proposed filenames, not
discovered originals. Verify source bytes/wording/fields and actual download
responses before enabling template_url. No source file directory of fake
placeholders was created.

## Not implemented

Admin/auth UI, uploads/object storage, online filling/DOCX generation, practice
diaries, invented schedule links, feedback integration, news/events integration,
search, notifications, analytics and multilingual support are not implemented.

No startup/import/build seed exists. With no verified originals/URLs, no database
initialization of the five records was appropriate or executed. Production
migration, deployment and data initialization remain separate approved steps.

## QA environment and commands

Local production build: http://127.0.0.1:3104.
Browser runtime/skill is unavailable in this session, so existing cached
Playwright/Chromium was used. The package's default revision was absent; the
already installed Chromium headless-shell 1248 executable was selected explicitly.
No browser/package dependencies were installed.

| Check                                                   | Actual result                                                                                              |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| npm run lint                                            | PASS                                                                                                       |
| npm run typecheck                                       | PASS                                                                                                       |
| npm run build                                           | PASS; 13 static outputs, including all five slug pages                                                     |
| Node built-in frontend tests                            | PASS: 7/7, no skips                                                                                        |
| Backend pytest                                          | PASS: 67 tests in 15.19s, no skips                                                                         |
| Ruff check / format check                               | PASS; 58 Python files                                                                                      |
| New frontend files and changed documentation formatting | PASS                                                                                                       |
| npm run format:check                                    | FAIL: same 44 pre-existing formatting findings; no mass-format                                             |
| git diff --check                                        | PASS                                                                                                       |
| docker compose config --quiet                           | PASS                                                                                                       |
| Docker/PostgreSQL runtime                               | BLOCKED: desktop-linux daemon pipe unavailable                                                             |
| Isolated Alembic verification                           | PASS: upgrade twice/current/check, downgrade to 0001 and re-upgrade only in a new pytest-local SQLite file |
| PostgreSQL offline migration SQL                        | PASS: documents table, category constraint and ordering index compiled                                     |
| Existing production /api/v1/health                      | 200, status ok; read-only verification                                                                     |
| Existing production /api/v1/documents                   | 404, expected until backend release                                                                        |

Backend tests cover published-only lists/detail, hidden drafts, anonymous writes,
ADMIN/EDITOR creation/update/delete, slug create/update conflicts, ordering/ties,
pagination, required/null fields, enum/length/integer constraints and safe nullable
DOCX URLs. The migration test uses a fresh local path and a separate working
directory; it cannot read a real .env or use the production database.

Node tests use the existing TypeScript compiler and Node's built-in runner, not
a new testing framework. They render 0/1/5/20 records and verify empty/unavailable
states, download markup, server catalog lookup and homepage-anchor resolution.
A test-only DOCX URL checks markup, not an actual or official downloadable file.

No new live PostgreSQL migration verification is claimed. The previously recorded
six high-severity frontend dependency findings were not remediated; no new
dependency audit/upgrade was part of this task.

## Browser checks and visual regression

| Viewport | Routes inspected                                       | Result |
| -------- | ------------------------------------------------------ | ------ |
| 1440x900 | /, /student, /student/documents, one detail            | PASS   |
| 1024x768 | same four routes                                       | PASS   |
| 768x1024 | same four routes                                       | PASS   |
| 390x844  | same four routes, plus all five detail titles/metadata | PASS   |

For all 16 primary route/viewport combinations: correct URL/title, meaningful
content and one h1, no framework overlay, no relevant console errors/warnings,
no failed requests and zero document horizontal overflow through full-page
scrolling. New breadcrumb touch targets and mobile action stacking were checked.
All five mobile detail headings fit, and canonical paths match their slugs.

Interaction proof: homepage menu -> Студенту -> Открыть -> Подробнее -> detail ->
Все документы passed at all three narrow widths. Menu focus/inert/Escape/restore
behavior passed. Desktop navigation to Студенту and back to /#about passed.
Reduced motion kept reveals visible; keyboard skip-link focused the new main.
Unknown document slug returned HTTP 404.

Self-review found and fixed: main needed a focus target for the skip-link, a
ghost-tone back CTA lacked contrast on paper, and inherited mobile flex wrapping
split the actions into columns. Final browser QA was rerun after these fixes.

Homepage h1 geometry and every main section's position/height exactly match
pre-change measurements at all four sizes. The only footer height change is the
new navigation row: +33.5px at 1440/768/390 and +19.890625px at 1024.
This is an intentional navigation-entry effect, not a footer/chapter redesign.
Hero, About, Sectors, Join, Feedback, footer brand/contact language and frozen
reference files were not restyled.

Visual self-review: same designer/brand language; no generic cards or new visual
tokens; composition relies on type, numbering, rules and whitespace; utility
screens are quieter and easier to scan than the landing.

Local screenshots, baseline measurements and JSON results are outside the repo:
C:/Users/ahmad/AppData/Local/Temp/student-documents-qa-20261016/.
Examples: after-student-1440.png, after-rows-1440.png, after-rows-390.png,
after-preview-1440.png, after-menu-390.png and after-long-title-390.png.
Evidence is local/temporary, not committed frozen references.
QA covers Chromium, these dimensions and the described states, not every browser,
future remote storage provider, actual DOCX download or an admin/generator flow.

## Production impact and Git

No production migration, seeding, deployment or environment update was executed.
The existing backend remains healthy; the new documents endpoint is not deployed.
A future API release requires confirmed-target alembic upgrade head to 0002,
backend deployment, health verification, approved metadata and a deliberate public
adapter cutover. Static utility pages do not require that database migration.

Feature checks passed with the explicitly recorded inherited formatting/runtime
limitations. Only the requested implementation/tests/docs are intended for the
focused commit and normal main push. Final handoff records the resulting SHA
and remote/worktree verification after publication.

Preserved stash@{0}: 5c6cfb9594cc93bcf7380c57495b31676d9b0f31,
preserve-local-v0.3-before-backend-foundation-2026-10-11.
It was never applied, popped, dropped or modified. No secrets or student inputs
were added; no force push or history rewrite.
