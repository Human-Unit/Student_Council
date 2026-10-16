# Student documents: one resource, multiple future clients

## Implemented boundary

Public routes: `/student`, `/student/documents`, `/student/documents/[slug]`.
Public URLs use stable English slugs; visible content is Russian. Utility pages
reuse the frozen brand system; the homepage gets a navigation entry only.

`src/lib/documents.ts` is the server-only data boundary. It currently reads the
five titles/purposes supplied in the approved task from `src/data/student.ts`,
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

**No original DOCX files were present in the repository/worktree.** Every current
template_url is null. Downloads are plain unavailable text (not fake links), and
the paper-shaped preview explicitly says it is not an official form. No official
body was reconstructed, generated or edited. Field guidance is from the brief,
not a validated DOCX form schema; this limitation is visible on detail pages.

Ask the owner to copy the actual approved files to these proposed stable paths:

| Source document required                                 | Target under public/documents/templates/ |
| -------------------------------------------------------- | ---------------------------------------- |
| Объяснительная о пропуске занятий                        | missed-classes-explanation.docx          |
| Заявление об освобождении от занятий                     | class-release-application.docx           |
| Заявление об отсрочке выплаты за обучение                | tuition-payment-deferment.docx           |
| Заявление о выдаче справки об окончании                  | graduation-certificate.docx              |
| Заявление о выдаче справки о том, что является студентом | student-status-certificate.docx          |

These target names are proposed mappings, not a claim that the original filenames
or files were inspected. Preserve approved source bytes when copying. Verify
wording, fields, ownership and download response before setting each template_url.
Do not enable an action simply because a guessed path looks plausible.

Current URLs may be stable `/documents/templates/*.docx` paths or validated HTTPS
DOCX URLs without embedded credentials, fragments or traversal. Relative paths
outside that static directory and nested encoding are rejected. The application
does not fetch, proxy, upload or render remote template content.

An attached DOCX is not itself a prepared image/PDF preview. A future preview
asset/metadata can be added when approved source files exist; until then use the
explicit unavailable-preview state. `DocumentDownload` supports real supplied
URLs, but markup tests are not proof a file exists.

Storage boundary: metadata -> template_url -> current approved static file.
Later uploads may replace the storage implementation without changing public
page semantics. No S3/MinIO integration, upload service or binary DB columns exist.

## Initialization and production release

No startup/import/build seeding and no production insertion were performed.
With missing originals/verified URLs, a five-row DB seed would falsely imply a
verified set of templates; no seed mechanism is installed for this state.
When originals are supplied, verify their titles/paths and decide explicitly
whether to initialize approved metadata idempotently or create it through the
protected resource. Mutable publication state must not be reset by startup.

This task does not deploy or migrate production. To release the API later:

1. Confirm the intended Neon target/backup and inject credentials securely.
2. Serialize an approved `alembic upgrade head` from 0001 to 0002; verify current.
3. Deploy the updated backend and verify both DB-backed health routes.
4. Verify published/draft reads without destructive production test data.
5. Approve/initialize real document metadata; then implement the public API adapter
   with explicit server-side configuration, pagination and error behavior.

The static student pages can be released independently, with truthful unavailable
file states. Pushing source does not authorize production migration or seeding.

## Explicit exclusions and verification

**Admin UI, authentication UI, uploads and online DOCX generator are not
implemented.** Practice remains coming soon; no schedule URL is invented.
Feedback/news/events frontend integrations are untouched.

A later generator should add a verified form schema, fill a copy of an approved
DOCX and return that copy. It must reuse document identity/storage semantics;
never overwrite the source template. No student inputs are collected now.

Run frontend state tests with the existing compiler and Node's built-in runner:
`node --test tests/student-documents.test.cjs`. They cover 0/1/5/20 records,
unavailable/download markup and the server/navigation boundary without adding a
test framework. Backend pytest covers publication/RBAC/validation/conflicts/order
and isolated migration round-trip/offline PostgreSQL SQL generation. Browser QA
and actual runtime limitations are recorded in
[the implementation report](reports/student-documents-v1.md).
