# Site density and copy pass v1

Date: 2026-11-01 (Asia/Dushanbe). Baseline: the practice commit on top of
Documents v2.

## Why

Asked for: pages that are not overloaded, a phone layout that fits, and copy
that does not read as generated. Rule used: every block either tells the
visitor something new or lets them act; repeats and pure decoration go first,
on phones before desktop.

## Removed

| Element                                            | Reason                                                      |
| -------------------------------------------------- | ----------------------------------------------------------- |
| Hashtag ticker under the hero                      | Moving decoration repeating words from Directions/Sectors   |
| «Листайте» scroll cue                              | Collided with the second CTA on phones; the page is obvious |
| Benefits chapter («Не должность, а реальный опыт») | Six generic statements; the participation ladder says more  |
| Form buttons inside sector cards                   | Duplicated the freshman forms in «Участие»                  |
| «Расскажи нам» plate with stars                    | Looked like a button, was not one; the real CTA stays       |
| Live «Сейчас в Душанбе» clock                      | Not information a student needs from the council            |

Hidden on narrow screens only (desktop unchanged): the students↔university
diagram (≤900px), the Directions logo without its connector lines (≤1040px),
sector scene illustrations (≤560px), the fixed page tab (≤760px).

## Copy

Kept facts, names and the «ты» voice of the landing; replaced slogans:
«Создаём проекты, события и возможности» → «Мероприятия, медиа и студенческие
инициативы»; «Работаем как небольшая creative studio» → «Рассказываем, как живёт
филиал»; «Три сектора — одна команда» and «Пять направлений — одна команда»
→ «Три сектора» and no slogan; «Создаём пространство, где…» → «Для тех, кому
мало пар…»; «Слышим студентов и доносим их голос» → «Собираем вопросы и
предложения студентов». /student: «Полезное без поиска по старым чатам» →
«Бланки и памятки»; practice: «без угадываний» removed.

## Result

Home page height, local production build:

| Width | Before    | After     |
| ----- | --------- | --------- |
| 390   | 13 821 px | 9 936 px  |
| 1440  | 12 070 px | 10 200 px |

`/`, `/student`, `/student/documents`, a document page, `/student/practice`
and the 404 page at 360/390/768/1024/1440: no horizontal overflow, no console
errors, no visible text under 12px. Captured screen by screen (full-page
captures repeat content past 8192px in headless Chromium), with reduced motion
and again with motion on at 390px. Reference images in `docs/design-reference/`
re-captured.

Checks: `npm run format:check`, `npm run lint`, `npm run typecheck`,
`npm run build`, `node --test tests/*.test.cjs` — all passed.

## For the owner to confirm

- The ОСПС notebook illustration (desktop) names clubs «Программирование»,
  «Языки», «Математика», «Дебаты». Keep only if these clubs exist.
- Real devices (iOS Safari, Android Chrome, Telegram in-app browser) were not
  available here; Chromium emulation only.
