import { feedbackUrl } from "@/data/site";
import { ArrowIcon } from "./ArrowIcon";

export function Feedback() {
  return (
    <section
      className="feedback"
      id="feedback"
      aria-labelledby="feedback-title"
    >
      <div className="feedback-inner shell">
        <div className="feedback-meta">
          <span>04</span>
          <span>Студенческий голос</span>
        </div>
        <h2 id="feedback-title">Есть идея?</h2>
        <div className="feedback-lower">
          <p>
            Есть идея для университета? Нашёл проблему? Хочешь предложить
            мероприятие, клуб или проект? <strong>Расскажи нам.</strong>
          </p>
          <div className="feedback-action">
            {feedbackUrl ? (
              <a
                className="button button--light"
                href={feedbackUrl}
                target="_blank"
                rel="noreferrer"
              >
                Предложить идею <ArrowIcon />
              </a>
            ) : (
              <span
                className="button button--pending"
                aria-label="Форма обратной связи ещё не подключена"
              >
                Форма скоро появится
              </span>
            )}
            {!feedbackUrl && (
              <small>
                Нужна ссылка на Google Form — место подключения уже
                подготовлено.
              </small>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
