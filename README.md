# Студенческий совет филиала МГУ в Душанбе

Одностраничный сайт Студсовета, оформленный по брендбуку Студенческого совета
(Student Council Brandbook, апрель 2025): фирменная палитра, шрифт NT Somic,
логотип и графические элементы. Тексты и ссылки взяты из презентации Студсовета.
Next.js 16 (App Router), TypeScript, собственные стили (Tailwind v4 подключён).

## Запуск

Нужен Node.js 20.9 или новее.

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:3000.

| Команда             | Что делает                         |
| ------------------- | ---------------------------------- |
| `npm run dev`       | dev-сервер с горячей перезагрузкой |
| `npm run build`     | production-сборка                  |
| `npm start`         | запуск собранной версии            |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | проверка типов TypeScript          |
| `npm run format`    | форматирование Prettier            |

## Где менять контент

Весь контент лежит в одном файле — [`src/data/site.ts`](src/data/site.ts).

- **`links`** — все внешние ссылки: Instagram Студсовета и филиала, Telegram,
  анкеты для первокурсников (Google Forms). Значение `null` скрывает ссылку.
- **`ideaUrl`** — куда ведёт кнопка «Предложить идею» (сейчас — директ Instagram
  Студсовета). Если появится отдельная форма, укажите её здесь.
- **`sectors`** — ИПОС, КМТС, ОСПС: тексты, теги, анкета и глава сектора.
- **`directions`** — пять направлений вокруг логотипа. Поле `piece` — деталь
  логотипа, на которую указывает линия (`left`, `band`, `right`, `tower`,
  `base`); координаты точек лежат в
  [`src/styles/about.css`](src/styles/about.css).
- **`participationSteps`**, **`benefits`**, **`plans`** — разделы «Участие» и
  «Что планируем дальше».
- **`contactGroups`** — каналы в подвале.
- **`teamMembers`** — состав команды. Раздел «Команда» появится сам, как только
  массив не пустой. Фото кладите в `public/team/` (портрет 4:5).

## Брендбук в коде

- Цвета и размеры — [`src/styles/tokens.css`](src/styles/tokens.css).
- Логотип (векторы сетки 320×420 из брендбука), цветовые версии, звезда, шеврон
  и «ярлык» с номером страницы — [`src/lib/brand.ts`](src/lib/brand.ts),
  компонент [`Logo`](src/components/Logo.tsx).
- Шрифт NT Somic — [`src/app/fonts`](src/app/fonts) (SIL Open Font License,
  исходник: github.com/nnttttyyppee/NT-Somic).
- Эмблема филиала — `public/brand/emblem.webp`.

## Деплой

Проще всего — [Vercel](https://vercel.com): импортировать репозиторий, сборка
настроится автоматически. После подключения домена задайте переменную окружения
`NEXT_PUBLIC_SITE_URL` (например, `https://studsovet.example`) — от неё строятся
ссылки на превью для соцсетей.

## Full stack with Docker

The backend foundation lives under [backend/](backend/README.md). The existing
frontend remains at the repository root with its current design and content.

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Windows PowerShell: `Copy-Item backend/.env.example backend/.env`, or copy the
example manually. Replace development secrets before deploying. To create the
first administrator, set both `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` in
`backend/.env`; bootstrap is idempotent and does not overwrite an existing user.

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger (development): http://localhost:8000/docs
- Health: http://localhost:8000/health

`docker compose down` stops the stack and preserves PostgreSQL data.
`docker compose down -v` also deletes the named database volume and its contents.
The backend uses `db:5432` within Docker. Browser-facing
`NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000/api/v1` and is passed at
frontend build time. The current frontend remains static; API integration is a
separate task.

See the [backend verification report](docs/reports/backend-foundation.md) for
test results, isolated PostgreSQL smoke checks, and current local QA ports.

## Устройство

```
src/
  app/            layout, страница, 404, иконки и OG-превью (генерируются)
  components/     секции страницы и фирменные компоненты
  data/site.ts    контент и ссылки
  lib/            брендбук (логотип, формы), типографика
  styles/         стили по секциям; токены — в tokens.css
  assets/         шрифты и эмблема для генерации OG-картинки
```

Анимации сделаны на CSS и IntersectionObserver, без сторонних библиотек. При
включённой в системе настройке «уменьшить движение» анимации отключаются, а весь
контент виден сразу.
