import type { SectorId } from "@/data/site";
import { Logo } from "./Logo";
import { Timecode } from "./Timecode";

/** ИПОС: a camera viewfinder recording the red Student Council mark. */
function Viewfinder() {
  return (
    <div className="cam">
      <div className="cam-scene" />
      <Logo className="cam-logo" tone="red" shadow="dark" />
      <div className="cam-hud">
        <span className="cam-rec">
          <i />
          REC
        </span>
        <Timecode />
      </div>
      <span className="cam-corner cam-corner--tl" />
      <span className="cam-corner cam-corner--tr" />
      <span className="cam-corner cam-corner--bl" />
      <span className="cam-corner cam-corner--br" />
      <span className="cam-af" />
      <div className="cam-modes">
        <span>Фото</span>
        <span className="is-on">Видео</span>
        <span>Reels</span>
      </div>
    </div>
  );
}

/** КМТС: an invitation ticket under a stage spotlight. */
function Ticket() {
  return (
    <div className="ticket-stage">
      <span className="ticket-beam" />
      <span className="ticket-pool" />
      <div className="ticket">
        <div className="ticket-main">
          <span className="ticket-label">Пригласительный</span>
          <b className="ticket-title">
            Студенческая
            <br />
            жизнь
          </b>
          <div className="ticket-row">
            <span>
              <em>Ряд</em>любой
            </span>
            <span>
              <em>Место</em>твоё
            </span>
            <span>
              <em>Вход</em>свободный
            </span>
          </div>
        </div>
        <div className="ticket-stub">
          <b>КМТС</b>
          <i className="ticket-bars" />
        </div>
      </div>
    </div>
  );
}

/** ОСПС: an open squared notebook with the club topics. */
function Notebook() {
  return (
    <div className="book">
      <div className="book-inner">
        <span className="book-cover" />
        <span className="book-edge" />
        <div className="book-page book-page--left">
          <span className="book-glyph">&lt;/&gt;</span>
          <b>Кружки</b>
          <span>листай и выбирай тему</span>
          <span className="book-topics">
            <i>Программирование</i>
            <i>Языки</i>
            <i>Математика</i>
            <i>Дебаты</i>
          </span>
        </div>
        <div className="book-page book-page--right">
          <b>Твоя тема?</b>
          <span className="book-plus" />
          <span>Предложи свой кружок</span>
        </div>
        <span className="book-spine" />
      </div>
    </div>
  );
}

export function SectorVisual({ id }: { id: SectorId }) {
  return (
    <div className={`sector-visual sector-visual--${id}`} aria-hidden="true">
      {id === "ipos" && <Viewfinder />}
      {id === "kmts" && <Ticket />}
      {id === "osps" && <Notebook />}
    </div>
  );
}
