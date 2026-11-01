# Student Council — current design baseline

Frozen: 2026-10-16. Source baseline: `4e8f37d` (Diyor's redesign plus backend
foundation). This describes the implementation, not a replacement brandbook.
Source files remain authoritative; values below are references, not new tokens.

## Ownership and page grammar

Read this before substantial UI work. The current site is an intentional design,
not scaffolding. A feature is not permission to redesign unrelated sections.

- `src/app/page.tsx` composes Header → Hero → About → Directions → Sectors →
  Join → optional Team → Feedback → Footer (chapters 01–06). PageTab and Effects supply
  progressive enhancements; BrandDefs supplies shared SVG filters.
- `src/app/globals.css` imports section-specific styles, with tokens first.
- `src/styles/tokens.css` owns CSS tokens; `src/lib/brand.ts` owns SVG geometry,
  image-route colors and approved logo tones. Keep their shared palette aligned.
- `src/data/site.ts` owns verified content, external destinations and team data.
  Missing destinations stay unavailable; do not invent people or official claims.
- No API-backed content or Documents page belongs to this freeze.

## Brand and assets

The current `Logo` (`src/components/Logo.tsx`) renders the five vector pieces
from `src/lib/brand.ts`, using viewBox `10 1.4 320 420`. Reuse this implementation;
do not substitute the older exported lockup or redraw the symbol. Back pieces
precede the front tower. A supplied title makes it a named image; otherwise it is
decorative. `BrandDefs.tsx` provides existing paper-cut shadow variants.

Approved `logoTones` pairs (back/front) are blue (deep blue/blue), light
(`#E7EAF6`/white), red (red/red-soft), ink (ink/graphite), ash (ash/paper).
Use a tone for the actual background, not an arbitrary recoloring. CSS overrides
already used by sector compositions are part of those compositions, not a license
to add new global variants.

`Emblem` in `src/components/BrandShapes.tsx` renders the branch emblem via a
currentColor CSS mask of `public/brand/emblem.webp`. It is separate from the
Student Council logo. Hero uses both; the footer uses the existing brand forms.
`Star`, `Chevron` and `PageTabShape` reuse the paths in `brand.ts`. Arrows and
social icons use existing components, not a second icon family.

Image routes are `src/app/icon.svg`, `apple-icon.tsx`, `opengraph-image.tsx`;
their local assets are `src/assets/og-emblem.png` and `src/assets/og-fonts/`.
Preserve existing paths, SVG geometry and licensed font assets unchanged.

### Palette

Actual values from `tokens.css` (brand.ts mirrors the nine core colors):

| Token                                    | Value                                      | Current role                             |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `--blue`                                 | `#3a53d1`                                  | Main brand fields, links, buttons        |
| `--blue-deep`                            | `#132fc1`                                  | Depth, paired logo pieces, darker fields |
| `--red` / `--red-soft`                   | `#c11316` / `#d13a3d`                      | Emphasis and dark-section accents        |
| `--ink` / `--graphite`                   | `#101010` / `#2a2a2a`                      | Text and dark fields                     |
| `--paper` / `--white`                    | `#eeeeee` / `#ffffff`                      | Page and inverse surfaces                |
| `--ash` / `--muted`                      | `#a6a4a4` / `#4b4b4b`                      | Secondary text                           |
| `--surface`                              | `#f6f6f7`                                  | Subtle supporting surface                |
| `--blue-100` … `--blue-400`              | `#e7eaf6`, `#d3d7e9`, `#afb8e4`, `#7989db` | Existing blue tints                      |
| `--kmts` / `--kmts-deep` / `--kmts-dark` | `#e98217` / `#a94f0c` / `#7a3608`          | КМТС sector                              |
| `--kmts-peach` / `--kmts-cream`          | `#f6c98e` / `#fff3e2`                      | КМТС supporting fields                   |
| `--osps` / `--osps-deep` / `--osps-mid`  | `#31b79b` / `#075e51` / `#078a72`          | ОСПС sector                              |
| `--osps-mint` / `--osps-paper`           | `#b9e7dc` / `#f7fcfa`                      | ОСПС supporting fields                   |

`--line` is ink at 14% alpha; `--line-inverse` is paper at 28%.
`--glass-fill`, `--glass-line`, `--glass-highlight` are white at 10%, 24%, 42%.
The existing scoped glass, radial glow, layered shadows and cut-paper effects are
intentional. Preserve them; do not erase them under a generic "no glass" rule.
Use `--text-shadow-paper`, `--text-shadow-blue`, `--text-shadow-ink` and existing
component styles instead of inventing another shadow scale.

## Typography

`src/app/layout.tsx` loads local NT Somic VF via next/font/local, declares
400–700, uses swap, and exposes `--font-sans`. `--font-brand` adds system sans
fallbacks. The packaged font is licensed under `src/app/fonts/OFL.txt`. No
replacement font or remote font service is needed. OG generation has separate
local Regular/Semibold TTF assets; these do not change the page's font family.

Actual patterns:

- Body (`base.css`): 17px, weight 420, line-height 1.5.
- Hero (`hero.css`): `clamp(46px, 7.2vw, 124px)`, weight 660, line-height 1,
  tracking -0.035em. Its three editorial lines have clipping masks with explicit
  room for Cyrillic descenders; do not remove that room.
- Section headings (`components.css`): `clamp(40px, 5.6vw, 96px)`, weight 640,
  line-height 1.02, tracking -0.03em, max-width 17ch, balanced wrapping.
- Section leads: `clamp(18px, 1.6vw, 26px)`, weight 430, max-width 44ch.
- Small labels: 15px/620 with +0.02em tracking; sector HUD labels use wider
  tracking and capitals. Plates use capitals intentionally;
  prose and most headings retain Russian sentence case.
- `em` is upright, not italic; emphasis uses existing color/weight treatments.

`src/lib/typography.ts` exports `tie()`: short Russian words bind to the next
word with NBSP; em dashes bind to the preceding text. Keep this for new Russian
prose; retain NBSP in initials and explicit hero line composition. Do not force
all headings uppercase or use arbitrary per-component typefaces.

## Layout and spacing

The grammar is editorial: full-width color chapters, large headings, numbered
tabs, wide rules, asymmetry, an architectural symbol, and substantial whitespace.
It is not a dashboard made from a uniform card grid. Sector visual/body panels,
participation steps and form cards are deliberate exceptions with specific roles.

`tokens.css` defines gutter `clamp(16px, 3.4vw, 48px)`, shell
`min(100% - var(--gutter) * 2, 1440px)`, grid gap `clamp(12px, 1.7vw, 24px)` and
section space `clamp(96px, 11vw, 176px)`. `.shell` centers that width. Reuse the
12-column editorial grids, existing section wrappers and page rhythm rather
than adding an unrelated max-width, spacing scale or container component.
Borders and rules separate chapters/content; they are not all card outlines.

Radius tokens are `--radius-xl` 26–40px, `--radius-lg` 20–28px and
`--radius-md` 18px. Rounded CTAs and selected visual panels already belong here;
do not apply rounded containers indiscriminately to every paragraph/section.

## Components and recurring patterns

| Component/source                                 | Preserve/reuse                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `Header.tsx`, `header.css`                       | Fixed logo/wordmark, desktop links, active-section observation, scrolled glass bar, hide-on-downscroll and mobile menu    |
| `Hero.tsx`, `hero.css`                           | Full blue opening, branch emblem, three display lines, paired CTAs, oversized light logo, deep-blue swoosh; no scroll cue |
| `SectionHeading.tsx`                             | Numbered pentagonal tab, eyebrow, h2, optional lead; paper/blue/ink tones                                                 |
| `ActionLink.tsx`, `ArrowIcon.tsx`                | Rounded text + arrow tile; existing blue/paper/ink/red/ghost/kmts/osps tones and md/sm sizes; external links open safely  |
| `About.tsx`, `ScrollText.tsx`                    | Scroll-lit statement, roles with roof-chevron bullets, students/logo/university bridge                                    |
| `Directions.tsx`, `about.css`                    | Labels linked to specific logo pieces; narrow layout stacks without connector lines                                       |
| `Sectors.tsx`, `SectorVisual.tsx`, `sectors.css` | ИПОС/КМТС/ОСПС full-width chapters, alternating editorial visual/body layouts and sector-specific colors/HUDs             |
| `Join.tsx`, `join.css`                           | One chapter: participation staircase and the freshman form cards (the only place forms are linked)                        |
| `Team.tsx`, `team.css`                           | Conditional verified members only; empty data hides the section, not fake profiles                                        |
| `Feedback.tsx`, `feedback.css`                   | Plans and the idea/contact CTA; not an API submission form yet                                                            |
| `Footer.tsx`, `footer.css`                       | Contact groups, sections, branch, back-to-top control and brand line                                                      |
| `PageTab.tsx`, `components.css`                  | Fixed pentagonal current-section marker, themed from existing section data                                                |
| `BrandShapes.tsx`, `BrandDefs.tsx`, `brand.ts`   | Shared geometry, currentColor icons and cut-paper filters                                                                 |

New pages should share the typography, shell, chapter hierarchy, brand primitives
and ActionLink behavior. Do not copy the entire landing's spectacle into every
utility screen, and do not replace shared components just to ship a feature.

## Motion and interaction

This baseline includes cinematic detail, not just tiny fades. Preserve its
existing intensity and scope; do not add another animation library or decorative
motion without a functional reason.

`Effects.tsx` observes `[data-reveal]`, adds `.is-in` once, and tracks mouse
positions for `[data-spotlight]`. Base reveals move 40px, with 0.9s opacity /
1.15s translation and optional 100ms stagger. `ScrollText.tsx` uses passive
scroll listeners + requestAnimationFrame to set word progress; reduced motion
sets it to 1. Header/PageTab use their own observers for navigation/section state.

Hover/focus CTAs rise 2px, sweep a fill upward and exchange arrow glyphs. Existing
easing tokens are ease-out `(0.16,1,0.3,1)`, ease-in-out `(0.76,0,0.24,1)` and
ease-pop `(0.34,1.5,0.64,1)`. Hero glow/swoosh drift for 28s/24s;
sector HUDs and timecodes have scoped effects. Reuse, do not multiply these.

`base.css` disables smooth scrolling and reduces animation/transition durations
to 0.01ms with one iteration for reduced motion. Reveals only hide content under
scripting-enabled + no-preference media queries. New sections must remain visible
without scripting and with reduced motion; preserve focus outlines and skip link.

## Responsive behavior

There is no single Tailwind breakpoint scheme: section CSS uses content-driven
breakpoints. Preserve those relationships rather than choosing a new framework.

| Width/state     | Actual behavior                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| Desktop >1080px | Desktop navigation and header CTA; header token 88px; multi-column editorial layouts                                 |
| ≤1080px         | Full-screen mobile menu and 48×48 toggle; header token 80px; roles and form blocks simplify                          |
| ≤1040px         | Directions stack as a list; the logo and connectors are hidden (without lines the logo labels nothing)               |
| ≤960px          | Sectors become one column with the visual above the text                                                             |
| ≤900px          | Hero logo above copy; About stacks and hides the students↔university diagram; feedback/footer and Join layouts stack |
| ≤760px          | Team grid follows its narrow layout (team remains hidden when empty); fixed PageTab hidden on every page             |
| ≤640px          | Header token 72px, compact logo/bar                                                                                  |
| ≤560px          | Hero title `clamp(38px,11.6vw,64px)`; stacked CTAs; sector scene illustrations hidden (cards keep sector colour)     |

Fluid clamp sizing/gutters apply between breakpoints. Oversized decorative shapes
are clipped by their section, not allowed to widen the document. Body uses
overflow-x:clip.
Do not hide genuine content overflow to conceal layout bugs. Primary ActionLink
minimum height is 60px; the mobile toggle is 48px square and arrow tile 44px.
These are existing primary controls, not a claim that every link is 44px high.

Mobile navigation locks body scrolling and makes main/footer inert. It focuses
the first link; Escape closes and restores toggle focus; selecting a section or
returning to desktop closes it. Preserve aria-expanded/controls and focus states.

## Anti-patterns and extension rules

- No generic SaaS dashboard, Bootstrap-like defaults or unrelated uniform cards.
- No neon palette, new global gradients, random icons, stock illustration system,
  arbitrary shadows or replacement typography.
- No blanket ban/removal of the existing scoped glass, rounds, gradients or
  cinematic brand details: freeze means preserving this site, not sanitizing it.
- No new palette outside existing brand/sector tokens without an explicit brief.
- No excessive extra animation, inaccessible masked copy or hover-only actions.
- No fictional contacts, team records, URLs, statistics, university claims or
  project statuses. A missing record remains missing.
- No visual redesign or API integration hidden inside infrastructure work.

## Utility/detail page extension (Documents v1)

The `/student` family extends this freeze without changing the landing chapters.
Use the same shell, NT Somic, palette and rules, with a quieter blue opening,
breadcrumbs and `SectionHeading` rendered as h1. Existing numbered pentagonal
tabs, Star, Chevron, ActionLink, header/menu, footer, PageTab and reduced-motion
behavior are reused. Do not replace shared primitives with utility-only copies.

Utility navigation and document catalogs use asymmetric 12-column ruled rows:
large number, editorial title/summary and actions; narrow layouts stack these in
reading order. There is no card grid or new radius/color/shadow/font system.
Document titles remain readable on mobile, including Cyrillic descenders.

Detail pages pair preparation notes with a preview area using existing
white/paper/line/shadow tokens. With an approved original it shows page 1
rendered from that file (trimmed sheet, linked to the full image); a missing
original gets an explicitly unavailable state, not reconstructed official text
or a fake generator. Existing
homepage chapters remain unchanged; only shared navigation gains `Студенту`.

### Rows, practice page and narrow screens (Practice v1)

- Ruled rows are one tap target: the title link is stretched over the row, an
  arrow tile replaces separate "Подробнее" buttons, and facts (category, DOCX
  availability) are small meta chips above the title. Real downloads sit above
  the stretched link. Row focus is outlined on the whole row.
- ≤760: rows become number + arrow on one line, then meta, title and summary.
  The fixed PageTab is hidden on narrow screens site-wide because it covers
  running text; the preview frame is hidden when no original exists.
- ≤640: the breadcrumb trail becomes one "← parent" link.
- ≤560: intro star hidden, tighter intro, h1 `clamp(32px, 9.4vw, 44px)`.
- Practice: in-intro contents (4 → 2 → 1 columns), guide rules with the roof
  chevron, weak/strong example cards, a paper title-page map with highlighted
  fields (A4 ratio from 561px up), and a real `<table>` of diary entries that
  restyles to stacked entries at ≤760. No new tokens, fonts or icon family.

## Density pass (2026-11-01)

Removed as decoration without information, or as duplicates: the hashtag
ticker, the "Листайте" scroll cue, the live Dushanbe clock in the footer, the
non-clickable «Расскажи нам» plate and its stars, the benefits chapter
(«Не должность, а реальный опыт» + six generic benefits) and the form buttons
inside sector cards (forms stay in Join). Phone and tablet layouts hide what
only repeats the text next to it (see the responsive table). Copy avoids
slogans and "X, а не Y" constructions; a heading names what follows.

On the documents detail page the download is the intro's primary action; the
body lists what to write in and shows the original. Catalog rows are one tap
target with a «Скачать DOCX» text link; categories are not repeated as chips
because titles already say «Заявление»/«Объяснительная».

## Reference evidence and QA

Captured from the actual local production build at 1440×900, 1024×768,
768×1024 and 390×844, using the installed Playwright/Chromium fallback. Browser
plugin runtime/skill was not available. All four had loaded fonts, meaningful
Russian content, no framework overlay, no console errors/warnings, no failed
requests and zero measured document horizontal overflow during a full-page scroll.
Desktop anchor navigation and narrow-menu open/focus/inert/Escape/anchor-close
passed; reduced motion left all reveal content visible and stopped the ticker.

References in `docs/design-reference/` (re-captured 2026-11-01 after the
density pass, same viewports, local production build):

- `desktop-home.png` — 1440×900, opening composition.
- `landscape-home.png` — 1024×768, compact navigation and heading scaling.
- `tablet-home.png` — 768×1024, stacked hero.
- `mobile-home.png` — 390×844, stacked CTAs and compact mark.
- `desktop-about.png` — 1440×900, numbered chapter and editorial body composition.
- `mobile-menu.png` — 390×844, open mobile navigation.

These were opened and inspected, not generated mockups. No UI code was changed
to capture them. QA covers Chromium and these representative states, not every
browser, every external destination, contrast certification or all future content.
Runtime details and deployment verification are recorded separately in
`docs/reports/design-freeze-and-vercel.md`.
