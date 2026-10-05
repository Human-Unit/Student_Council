# Student Council Landing — Brand Redesign v0.3

Date: 2026-10-05

## Sources

- **Student Council Brandbook** (April 2025, PDF export of the Figma file):
  logo on the 320×420 grid, wordmark, colour lockups, palette, NT Somic
  typography and application examples. The Figma file itself was not reachable
  from the build environment; the PDF export was used instead.
- **Student Council presentation** (HTML, prepared by ИПОС): content, links,
  sector colours and the graphic language built on the brandbook — pills,
  plates, roof chevrons, the four-point star, the deep-blue swoosh and the
  exploded logo.

## Brand implementation

- Palette exactly as in the brandbook: `#132FC1`, `#3A53D1`, `#C11316`,
  `#D13A3D`, `#101010`, `#2A2A2A`, `#EEEEEE`, `#A6A4A4` (`src/styles/tokens.css`).
  Sector colours for КМТС and ОСПС follow the presentation.
- NT Somic variable font (400–700, SIL OFL 1.1) self-hosted through
  `next/font/local`; static instances render the Open Graph image.
- The logo is the exact vector mark (`src/lib/brand.ts`) in the approved
  colourways: blue on light, white on blue, red on black, black-on-black for the
  footer watermark. Every piece carries the brandbook's paper-cut shadow.
- Brandbook page tabs (pentagons) number every section and a fixed tab in the
  corner follows the reader, switching colour with the background.
- Section dividers use the brandbook supergraphic — the logo rotated and cropped
  by the corner.
- The English wordmark exists only as a low-resolution raster in the PDF, so it
  is not reproduced; the header follows the presentation (mark + «Студсовет»).

## Content

Hero (emblem of the branch, tagline), about with the students ↔ council ↔
university bridge, five directions around the exploded logo (each leader line
ends on its own piece of the mark, as in the presentation), the three sectors
(ИПОС, КМТС, ОСПС) with their visuals and freshman forms, "not a position but
real experience", the participation stairs, plans, the idea call to action
(Instagram direct) and every contact channel from the presentation.

The «Что уже делали» section (past-work covers and digital projects) was
removed on request, together with its components, styles and data. Sections are
numbered 01–07.

## Verification

Checked in Chrome at 1440 × 900, 820 × 1180 and 390 × 844: section screenshots,
header hide/show and active section, mobile menu (focus, inert, Escape), page
tab colours, 404 page, Open Graph image and Apple icon, and horizontal overflow
while scrolling.

| Check     | Command                | Result                              |
| --------- | ---------------------- | ----------------------------------- |
| Format    | `npm run format:check` | Passed for every file changed here¹ |
| Lint      | `npm run lint`         | Passed                              |
| Typecheck | `npm run typecheck`    | Passed                              |
| Build     | `npm run build`        | Passed — all routes static          |

¹ On a Windows checkout with `core.autocrlf=true`, seven untouched files
(configs and the v0.1/v0.2 reports) are checked out with CRLF and fail the
check on line endings only. A `.gitattributes` with `* text=auto eol=lf` would
fix this for everyone.

## Remaining content TODO

- Verified team members and photos (the section appears automatically)
- Production domain (`NEXT_PUBLIC_SITE_URL`)
- Vector export of the English wordmark, if it should appear on the site
