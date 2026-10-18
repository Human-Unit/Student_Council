# Student documents: one resource, multiple future clients

## Implemented boundary

Public routes: `/student`, `/student/documents`, `/student/documents/[slug]`.
Public URLs use stable English slugs; visible content is Russian. Utility pages
reuse the frozen brand system; the homepage gets a navigation entry only.

`src/lib/documents.ts` is the server-only data boundary. It currently reads the
six titles/purposes supplied by the owner from `src/data/student.ts`,
filters publication and sorts by order/slug. React cache deduplicates reads for
page rendering and metadata. UI components accept document data, not a fixed
count. No client-side fetch, database credentials or auth token is needed.

**Frontend API integration is deliberately deferred.** Production currently has
migration 0001 and no deployed documents API. There is no silent fallback from
API errors to static data, and no new environment variable until fetching is
actually implemented. A later release can replace this single adapter with
server-side API calls using a configured base URL, bounded pagination, explicit
empty/error handling and the same public view fields. Layouts need not change.
Treat an API failure as unavailable, not as a successful empty catalog.

The local catalog is a temporary public source adapter, not a second CMS, seed
system or future admin datastore. On API cutover remove its metadata role; do
not merge stale local records back into an API's empty/draft/unpublished result.

## Backend contract

Ownership: `api/v1/documents.py` -> `services/documents.py` -> SQLAlchemy
`models/document.py`. Schemas live in `schemas/document.py`. This does not extend
or collapse the unrelated news/events/projects services.

Persistent fields: UUID id, unique slug, title, nullable short_title, summary,
category, nullable template_url, nonnegative sort_order, is_published,
created_at and updated_at. Categories are EXPLANATION, APPLICATION, CERTIFICATE
and OTHER. No binary/base64 files, HTML preview blob or speculative form schema
is stored in PostgreSQL. The frontend view omits unused persistence audit fields.

- Public `GET /api/v1/documents`: published only, order by sort_order then slug.
- Public `GET /api/v1/documents/{slug}`: published only; draft/missing -> 404.
- Protected `POST /api/v1/documents`, `PATCH /api/v1/documents/{id}` and
  `DELETE /api/v1/documents/{id}`: existing ADMIN/EDITOR dependency and JWT flow.
- Existing collection contract: JSON arrays, limit 1-100, default 20, offset >= 0.
- Duplicate slugs -> 409; invalid payloads -> 422; anonymous writes -> 401.
- Nullable fields can be cleared; mandatory fields cannot be patched to null.

A unique slug index and `(is_published, sort_order, slug)` composite index support
the public lookups and stable ordering. Alembic revision 0002 adds only schema,
not mutable content. It leaves 0001 untouched and contains a reversible downgrade
for isolated/dev recovery, never a production verification step.

Future ADMIN/EDITOR can create/edit metadata, publish/unpublish, reorder and
attach/replace a template_url using this resource. A future admin UI will also
need protected draft/list/detail reads; those read endpoints are not implemented
yet. Extend this model/service instead of introducing a second document system.
Unpublishing is the current non-destructive archive boundary. DELETE removes
metadata only, not files or other resources; future upload ownership needs its
own explicit lifecycle before file deletion is implemented.

## Approved originals and storage

The owner supplied six approved DOCX originals (2026-11-01). They are copied
**byte for byte** into `public/documents/templates/`; nothing inside them was
edited, re-saved or re-encoded. `SHA256SUMS` in that folder records the hash of
each original, and `tests/student-documents.test.cjs` fails if a file changes,
disappears, stops being a DOCX package, or a published document points anywhere
else. Check by hand with `cd public/documents/templates && sha256sum -c SHA256SUMS`.

| Original (as supplied)                                    | File under public/documents/templates/ | SHA-256 (first 12) |
| --------------------------------------------------------- | -------------------------------------- | ------------------ |
| Объяснительная о пропуске занятий                         | missed-classes-explanation.docx        | 985bd04d7a3f       |
| Заявление о принятии справки об отсутствии на занятиях \* | absence-certificate-acceptance.docx    | 675b930e8e24       |
| Заявление об освобождении от занятий                      | class-release-application.docx         | 137fac33eddd       |
| Заявление об отсрочке выплаты за обучение                 | tuition-payment-deferment.docx         | b6ce646965e5       |
| Заявление о выдаче справки об окончании                   | graduation-certificate.docx            | 6a9f1f71676e       |
| Заявление о выдаче справки о том, что является студентом  | student-status-certificate.docx        | cb0d36301e0c       |

\* Sixth document, not in the original brief: "Прошу Вас принять мою справку,
согласно которой я отсутствовал(а) на занятиях…". Its title and summary are
taken from its own text.

Facts about the originals that the site does not change: all are one A4 page,
addressed to the branch's executive director by name (replace the files when
that changes); the explanation's heading reads «Объяснительное» and its reason
is pre-filled («в связи с плохим самочувствием, лечился(ась) дома»); the
graduation certificate is worded for admission to a master's programme only.
Summaries and field lists in `src/data/student.ts` follow the files, in the
order fields appear on the form. The package metadata names the staff member
who last edited the forms; files contain no macros, comments, tracked changes,
hidden text or external relationships.

URLs keep stable ASCII slugs; downloads are saved under the Russian title.
`src/lib/template-files.ts` builds both the `download` attribute and an
`attachment; filename*=UTF-8''…` header that `next.config.ts` sets for every
template path. The header matters in in-app browsers (Telegram, Instagram),
which ignore the `download` attribute.

Current URLs may be stable `/documents/templates/*.docx` paths or validated HTTPS
DOCX URLs without embedded credentials, fragments or traversal. Relative paths
outside that static directory and nested encoding are rejected. The application
does not fetch, proxy, upload or render remote template content.

Previews are derived files: `scripts/render-document-previews.sh` renders page 1
of each original with LibreOffice (Liberation Serif stands in for Times New
Roman with identical metrics), trims the empty part of the sheet and writes
`public/documents/previews/<slug>.png` plus their sizes in
`src/data/document-previews.json`. Do not edit either by hand; re-run the script
after replacing a template. A document without an original keeps the explicit
unavailable state and never shows a preview.

To replace or add a template: copy the approved file unchanged to
`public/documents/templates/<slug>.docx`, regenerate `SHA256SUMS` with
`sha256sum *.docx > SHA256SUMS`, set `template_url`, re-run the preview script,
then run the tests. After deploying, check what production actually serves:
`node scripts/verify-document-templates.mjs https://student-council-ecru.vercel.app`.

Storage boundary: metadata -> template_url -> current approved static file.
Later uploads may replace the storage implementation without changing public
page semantics. No S3/MinIO integration, upload service or binary DB columns exist.

## Initialization and production release

No startup/import/build seeding and no production insertion were performed.
The originals and their paths are now verified, so the remaining decision is
whether to initialize these six records idempotently or create them through the
protected resource; the paths already pass the backend `template_url` validator.
Mutable publication state must not be reset by startup.

This task does not deploy or migrate production. To release the API later:

1. Confirm the intended Neon target/backup and inject credentials securely.
2. Serialize an approved `alembic upgrade head` from 0001 to 0002; verify current.
3. Deploy the updated backend and verify both DB-backed health routes.
4. Verify published/draft reads without destructive production test data.
5. Approve/initialize real document metadata; then implement the public API adapter
   with explicit server-side configuration, pagination and error behavior.

The static student pages can be released independently of the API. Pushing
source does not authorize production migration or seeding.

## Field registry and the future generator

`src/data/fields.ts` is the single registry of student input: key, label, type,
required, hint, optional neutral example, options, maxLength and `manual` for
hand-written parts (signatures). Document guidance (`documentGuidance`) and the
practice title page reference fields by key; tests fail on unknown keys.

`src/lib/templates.ts` holds pure helpers shared by previews and a generator:
`parseTemplate`, `templateKeys`, `fillTemplate` and `validateValues`. Tags use
`{fieldKey}`, the default delimiter of DOCX templating tools, so approved DOCX
originals can be tagged with the same keys. The planned flow:

1. a form built from `FieldSpec[]` (no new schema format);
2. `validateValues` on the client and again on the server;
3. a backend endpoint fills a copy of the approved DOCX and returns it;
4. no student input is stored unless that is decided and documented separately.

`TitlePagePreview` already accepts `values`, so the same component can show a
student's filled title page. `{institution}` is the verified branch name from
`site.ts`, not input.

## Practice diary (`/student/practice`)

Content lives in `src/data/practice.ts`: guide rules, a weak/strong example, the
title-page layout (`titlePageLines` with `{key}` tags), an illustrative diary
table and the template list. The page says it is an example, not an official
form. Both templates have `template_url: null` until approved originals exist;
the same unavailable state as documents is shown, never a guessed path.

## Explicit exclusions and verification

**Admin UI, authentication UI, uploads and online DOCX generator are not
implemented.** Practice has guidance pages without downloadable originals; no
schedule URL is invented.
Feedback/news/events frontend integrations are untouched.

A later generator should add a verified form schema, fill a copy of an approved
DOCX and return that copy. It must reuse document identity/storage semantics;
never overwrite the source template. No student inputs are collected now.

Run frontend state tests with the existing compiler and Node's built-in runner:
`node --test tests/*.test.cjs`. They cover 0/1/5/20 records, byte-identical
originals and previews, download names and response headers, the unavailable
state, the field registry, template helpers and the server/navigation
boundary without adding a test framework. Backend pytest covers publication/RBAC/validation/conflicts/order
and isolated migration round-trip/offline PostgreSQL SQL generation. Browser QA
and actual runtime limitations are recorded in the implementation reports
([v1](reports/student-documents-v1.md), [v2](reports/student-documents-v2.md)).
