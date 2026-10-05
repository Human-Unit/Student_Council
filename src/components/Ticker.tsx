import { Star } from "./BrandShapes";

const tags = [
  "Инициативы",
  "Мероприятия",
  "Reels",
  "Интервью",
  "Кружки",
  "Конкурсы",
  "Фото",
  "Форумы",
  "Дизайн",
  "Проекты",
];

// Each row holds the list twice so it stays wider than ultra-wide screens;
// the track moves by exactly one row for a seamless loop.
const rowItems = [...tags, ...tags];

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((row) => (
          <ul className="ticker-row" key={row}>
            {rowItems.map((tag, index) => (
              <li key={index}>
                <b>#</b>
                {tag}
                <Star className="ticker-star" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
