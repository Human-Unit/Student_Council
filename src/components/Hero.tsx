import { ArrowIcon } from "./ArrowIcon";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid shell">
        <div className="hero-kicker">
          <span>Студенческое сообщество</span>
          <span>Душанбе · 2026</span>
        </div>

        <div className="hero-heading-wrap">
          <p className="hero-index" aria-hidden="true">
            01
          </p>
          <h1 id="hero-title">
            <span className="hero-title-primary">Студенческий совет</span>
            <span className="hero-title-branch">филиала МГУ</span>
            <em className="hero-title-city">в Душанбе</em>
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-copy">
            Инициативы студентов. Проекты. Возможности. Университетская жизнь.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#feedback">
              Предложить идею <ArrowIcon />
            </a>
            <a className="button button--text" href="#projects">
              Наши проекты <ArrowIcon />
            </a>
          </div>
        </div>

        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit orbit--one" />
          <span className="orbit orbit--two" />
          <span className="orbit-dot" />
          <span className="orbit-label">МГУ</span>
        </div>
      </div>
    </section>
  );
}
