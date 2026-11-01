# Documents v2: approved DOCX originals

Date: 2026-11-01 (Asia/Dushanbe). Baseline: f6db95a on main.

## Implemented

- Six approved DOCX originals copied unchanged into
  `public/documents/templates/` under the names from
  [the architecture doc](../DOCUMENTS_ARCHITECTURE.md); `SHA256SUMS` beside them.
  Five match the existing catalog; the sixth («Заявление о принятии справки об
  отсутствии на занятиях») was supplied with them and is added as a new entry.
- `template_url` set for all six; the «DOCX пока недоступен» state remains for
  any future entry without an original.
- Downloads are saved under the Russian title: `download` attribute plus a
  `Content-Disposition` header from `next.config.ts` for in-app browsers.
- Detail pages show page 1 of the original, rendered by
  `scripts/render-document-previews.sh`, instead of the empty preview frame.
- Summaries and field lists aligned with what each file actually asks for.
- `scripts/verify-document-templates.mjs <site-url>` checks a deployment.
- Pre-existing `format:check`/`lint` failures on main fixed separately
  (formatting of `Header.tsx`, two unused eslint-disable directives).

## Source files

| File                                | Bytes  | SHA-256                                                          |
| ----------------------------------- | ------ | ---------------------------------------------------------------- |
| missed-classes-explanation.docx     | 13 636 | 985bd04d7a3fe0889377d404cf9762eccdf5b44470df79b9aec366d8fe4e6813 |
| absence-certificate-acceptance.docx | 13 674 | 675b930e8e2484191ba84943ee5c12abd3fad3d9f4f362f141c75a47b8496578 |
| class-release-application.docx      | 13 228 | 137fac33edddd0a1591ac08342b1576e64ef91479e7b28392659b4e05b3cd3dc |
| tuition-payment-deferment.docx      | 13 526 | b6ce646965e5dd9ded0de00491f64408d53a41be27826d4123f8f21976eb8188 |
| graduation-certificate.docx         | 17 992 | 6a9f1f71676e691f5664820e5a293b1d405480195d54aad307736ac73fc3fe36 |
| student-status-certificate.docx     | 13 609 | cb0d36301e0c54009f2a8e35c9fb59e0d83ce8378b7fc480d6c8dca900280a7e |

Source and copy compared with `cmp` and SHA-256: identical. Each file passes a
ZIP integrity test, opens in python-docx and LibreOffice, is one A4 page, and
has no macros, comments, tracked changes, hidden text or external relationships.

## Checks run

| Check                          | Result                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `npm run format:check`         | Passed                                                                                           |
| `npm run lint`                 | Passed, 0 warnings                                                                               |
| `npm run typecheck`            | Passed                                                                                           |
| `npm run build`                | Passed; six static detail pages                                                                  |
| `node --test tests/*.test.cjs` | 10/10 passed; changing one byte of a template fails the suite (checked)                          |
| HTTP, local `next start`       | All six: 200, DOCX MIME type, attachment header, SHA-256 equal to the originals                  |
| Browser downloads              | 24 real clicks (catalog + detail, 1440×900 and 390×844 touch): SHA-256 equal, Russian names      |
| Downloaded content             | Each saved file opened with python-docx; heading and first sentence match its card               |
| Layout                         | /student/documents and two detail pages at 360/390/768/1024/1440: no overflow, no console errors |

Browser checks used Playwright with Chromium. In a C locale Chromium saves
non-ASCII names as `download`; with a UTF-8 locale it uses the Russian name
from the header, also for links without the `download` attribute.

## Not verified here

- Production: the sandbox cannot reach `*.vercel.app`, and the change is not
  deployed. After merge and deploy, run
  `node scripts/verify-document-templates.mjs https://student-council-ecru.vercel.app`
  and open /student/documents on a phone once.
- Real iOS Safari and Telegram/Instagram in-app browsers.
- How the forms look in Microsoft Word on Windows (previews use LibreOffice).

## Remaining decisions

- Whether to seed these six records into the documents API (paths already pass
  the backend validator).
- The original explanation is titled «Объяснительное» and the forms name the
  current executive director; corrections belong in the source files, made by
  their owner.
