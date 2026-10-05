# Student Council Landing — Visual QA & Refinement v0.2

Date: 2026-10-01

## Visual problems found

The browser-control runtime was checked after the local development server was
available, but it reported no in-app or connected browser instances. Consequently,
the findings below come from the rendered HTML contract and a focused source/CSS
audit, not from screenshots. No claim of completed visual browser QA is made.

- Projects used three tall bordered panels with unequal column spans. Despite the
  restrained styling, their structure still read like product cards rather than a
  continuous editorial list of student initiatives.
- Large Cyrillic headings used very tight tracking (`-0.075em` in the hero and
  `-0.06em` in section headings), increasing the risk of cramped Russian letterforms.
- The hero artwork could occupy up to 260 px and retained relatively high opacity on
  mobile, giving decoration more visual weight than necessary.
- The empty team state repeated the word “Команда” as a very large outlined graphic,
  which could read as filler rather than an intentional publishing state.
- The mobile menu locked body scrolling and exposed ARIA state, but did not move
  focus into the open menu, handle Escape, return focus, or close itself after the
  layout changed to desktop.
- There was no keyboard skip link to bypass the repeated header navigation.
- The temporary text identity was embedded directly in the header and had no single
  configuration point for a future approved logo.
- The v0.1 report contained two accidental filename-like suffixes in its TODO list;
  these were corrected.

## Changes made

### Projects

- Reworked the project presentation from a multi-column card grid into three full-
  width editorial rows.
- Each project now has a stable number, category, large title, readable serif
  description, and dedicated action column.
- Unavailable destinations preserve the intended CTA label while explicitly stating
  “Ссылка уточняется”; no URL or project status was invented.
- Reduced title tracking and introduced more disciplined responsive stacking at
  laptop and mobile widths.

### Hero and typography

- Made all three hero title lines explicit so their alignment can be controlled
  independently.
- Reduced aggressive heading letter spacing for better Cyrillic readability.
- Added balanced heading wrapping and prettier paragraph wrapping where supported.
- Reduced the maximum scale and opacity of the CSS orbit artwork; mobile opacity is
  deliberately quieter so content remains primary.

### Team empty state

- Replaced the oversized repeated word with a restrained numbered circular marker.
- Clarified that the updated team composition is being prepared, while retaining the
  existing typed member model for future real data.

### Header and accessibility

- Added focus movement to the first mobile navigation item when the menu opens.
- Added Escape-to-close with focus return to the menu button.
- Added desktop-resize cleanup so an open mobile menu cannot leave body scrolling
  locked.
- Added `aria-hidden` and `inert` to the closed mobile menu.
- Added a visible-on-focus “Перейти к содержимому” skip link.
- Added a single `brandLogoSrc` configuration value. Setting it to an approved file
  under `public/brand/` replaces the temporary initials without restructuring the
  header.

### Design tokens and continuity

- Kept the existing warm white, near-black, and blue palette.
- Added reusable strong-line and section-spacing tokens instead of adding more blue
  surfaces or component-specific values.
- Preserved the numbered section system, rules, asymmetric alignment, and static
  server-rendered page structure.

## Reference comparison

The refinement follows the reference page's principles of numbered sections,
editorial scale, long rules, sparse navigation, and projects presented as part of a
continuous institutional composition. The full-width project rows and stronger
alignment relationships move the page closer to that editorial rhythm without
copying the reference's assets, text, organization claims, or exact layout.

The landing retains its own deep-blue Student Council identity and remains careful
not to present itself as the central MSU website.

Reference reviewed: <https://studmsu.ru/about>

## Responsive verification

The browser connection was unavailable, so the required screenshot-based pass is
still outstanding. No files were written to `docs/reports/screenshots/`.

| Viewport   | Result                                                                                |
| ---------- | ------------------------------------------------------------------------------------- |
| 1440 × 900 | Not visually executed; desktop source rules and fluid bounds audited                  |
| 1024 × 768 | Not visually executed; compact header and project-row source rules audited            |
| 768 × 1024 | Not visually executed; tablet stacking and typography source rules audited            |
| 390 × 844  | Not visually executed; narrow mobile rules, touch sizing, and overflow guards audited |

Source/runtime checks completed:

- Global horizontal overflow protection remains enabled.
- All internal anchors resolve to rendered IDs.
- The skip-link target exists.
- The initial mobile menu renders collapsed with matching ARIA state.
- Missing project and feedback URLs remain visibly disclosed.
- The local page responds with HTTP 200.

Mobile menu clicking, focus traversal, Escape behavior, and actual horizontal
overflow measurements still require a connected browser session before responsive
QA can be marked complete.

## Verification

| Check        | Command                                  | Result                                             |
| ------------ | ---------------------------------------- | -------------------------------------------------- |
| Format       | `npm run format:check`                   | Passed — all files match Prettier style            |
| Lint         | `npm run lint`                           | Passed — zero warnings/errors                      |
| Typecheck    | `npm run typecheck`                      | Passed — zero TypeScript errors                    |
| Build        | `npm run build`                          | Passed — Next.js 16.3.6 generated static route `/` |
| Runtime      | HTTP request to local development server | Passed — HTTP 200                                  |
| Anchor audit | Rendered HTML inspection                 | Passed — no missing targets                        |

## Remaining content TODO

- Approved Student Council logo
- Favicon
- Google Form URL
- Instagram URL
- Telegram URL
- Email address
- Schedule application URL
- Verified team information and photos
- Final approved imagery
- Deployment domain
- Open Graph image
- Final approved brand-blue value
- Connected-browser QA and four requested viewport screenshots

## Scope

No backend, database, authentication, CMS, analytics, custom feedback storage,
schedule integration, new route, or animation dependency was added. The repository
still has no Git metadata, so no commit or push was performed.
