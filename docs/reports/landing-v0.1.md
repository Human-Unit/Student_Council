# Student Council Landing — MVP v0.1

Date: 2026-10-01

## Context

The repository was empty and was not initialized as a Git repository. No existing
frontend foundation, logo, social links, team data, photos, fonts, or design tokens
were available to reuse. The MVP therefore uses the requested fallback stack:
Next.js, TypeScript, App Router, and Tailwind CSS.

The implementation does not claim to be the central MSU website and does not use or
copy assets from the visual reference. The header uses a temporary text-based
Student Council identifier until an approved logo is supplied.

## Implemented

- Single statically rendered Russian landing page.
- Fixed responsive header with working desktop anchors and an accessible mobile
  burger menu.
- Editorial hero with responsive oversized typography and original geometric
  university-inspired artwork made in CSS.
- About section with three numbered editorial pillars.
- Typed, data-driven project section using a reusable `ProjectCard` component.
- Visually distinct Student Voice / feedback section.
- Team section supporting photo, name, role, and optional contact URL, with a
  truthful empty state while verified team data is unavailable.
- Contact footer with explicit unavailable states for unconfirmed links.
- Central editable content configuration in `src/data/site.ts`.
- Russian page language, title, description, and Open Graph basics.
- Keyboard focus states, semantic section structure, reduced-motion handling, and
  comfortable mobile touch targets.
- Responsive layouts for desktop, laptop, tablet, and mobile breakpoints, including
  dedicated adjustments at 1180 px, 768 px, and 420 px.
- Global horizontal overflow protection and fluid typography/sizing.

## Visual decisions

The reference page informed the composition through large editorial headings,
numbered section cues, ruled dividers, sparse navigation, asymmetric type placement,
and generous vertical rhythm. The result uses a separate identity: warm white,
near-black, and deep Student Council blue; original CSS linework; restrained hover
transitions; and no copied text, images, logos, or illustrations.

Projects and content pillars use borders, scale, whitespace, and uneven grid spans
instead of rounded cards, shadows, gradients, or generic startup UI patterns.

## Content and external integrations

The configurable values live in `src/data/site.ts`:

- `feedbackUrl` is `null` until the real Google Form URL is supplied.
- `teamMembers` is an empty typed array until verified member data is supplied.
- Instagram, Telegram, and Email values are `null` until verified contacts are
  supplied.
- Schedule and Instagram project URLs are `null` until their real destinations are
  supplied.

The UI never sends users to an invented or incorrect URL. Missing destinations are
shown as “Ссылка скоро”, “Форма скоро появится”, or “скоро”. Header and hero idea
buttons scroll to the feedback section until the external form is configured.

## Verification

Executed from the repository root:

| Check              | Command                    | Result                                             |
| ------------------ | -------------------------- | -------------------------------------------------- |
| Formatter          | `npm run format:check`     | Passed — all files match Prettier style            |
| Lint               | `npm run lint`             | Passed — zero warnings/errors                      |
| Typecheck          | `npm run typecheck`        | Passed — zero TypeScript errors                    |
| Production build   | `npm run build`            | Passed — Next.js 16.3.6 static route `/` generated |
| Runtime smoke test | `npm start` + HTTP request | Passed — HTTP 200                                  |
| Anchor audit       | Rendered HTML inspection   | Passed — all internal href targets exist           |
| Placeholder audit  | Rendered HTML inspection   | Passed — missing URLs are disclosed                |

The responsive source was audited for the requested viewport ranges, touch targets,
fluid type, grid collapse, and overflow protection. True rendered visual inspection
at 1440, 1024, 768, and 390 px was not performed because no in-app or connected
browser session was available in this environment. This limitation should be closed
with a manual browser pass before public deployment.

## Manual TODO

- Supply the approved Student Council logo and favicon assets.
- Supply the Google Form URL for student ideas and feedback.
- Supply verified Instagram, Telegram, and email destinations.
- Supply the real Schedule and media project URLs.
- Supply verified team names, roles, photos, and optional contact links.
- Confirm the final Student Council blue against the approved brand palette.
- Run a final visual QA pass at 1440, 1024, 768, and 390 px in a browser.
- Confirm deployment-domain metadata and add a final Open Graph image when the
  domain and approved visual asset are available.

## Scope notes

No authentication, accounts, backend, database, CMS, custom form storage, analytics,
or heavy animation dependency was added. No commit or push was performed.
