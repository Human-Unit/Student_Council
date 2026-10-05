import type { CSSProperties } from "react";
import { site } from "@/data/site";
import { tie } from "@/lib/typography";
import { ActionLink } from "./ActionLink";
import { Emblem } from "./BrandShapes";
import { Logo } from "./Logo";

const lines = ["Студенческий", "совет филиала", "МГУ в Душанбе"];

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-backdrop" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-swoosh" />
      </div>

      <div className="hero-inner shell">
        <div className="hero-copy">
          <div className="hero-emblem">
            <Emblem />
            <p>
              {"Филиал МГУ имени М.\xa0В.\xa0Ломоносова"}
              <br />в городе Душанбе
            </p>
          </div>

          <h1 className="hero-title" id="hero-title">
            {lines.map((line, index) => (
              <span className="hero-line" key={line}>
                <span style={{ "--i": index } as CSSProperties}>
                  {tie(line)}
                </span>{" "}
              </span>
            ))}
          </h1>

          <p className="hero-lead">{tie(site.tagline)}</p>

          <div className="hero-actions">
            <ActionLink href="#idea" tone="paper">
              Предложить идею
            </ActionLink>
            <ActionLink href="#join" tone="ghost">
              Стать частью команды
            </ActionLink>
          </div>
        </div>

        <div className="hero-logo">
          <Logo
            tone="light"
            shadow="blue"
            title="Логотип Студенческого совета"
          />
        </div>
      </div>

      <a className="hero-scroll" href="#about">
        <span>Листайте</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
