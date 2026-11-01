import type { CSSProperties } from "react";
import { participationSteps, sectors } from "@/data/site";
import { tie } from "@/lib/typography";
import { ActionLink, type ActionTone } from "./ActionLink";
import { SectionHeading } from "./SectionHeading";

const formTone: Record<string, ActionTone> = {
  ipos: "red",
  kmts: "kmts",
  osps: "osps",
};

export function Join() {
  return (
    <section
      className="section participate"
      id="join"
      aria-labelledby="participate-title"
      data-index="04"
      data-theme="paper"
    >
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Участие"
          title={
            <>
              От одного вечера <em>до своего проекта</em>
            </>
          }
          titleId="participate-title"
          lead={tie(
            "Начни с малого: помоги один раз и посмотри, как всё устроено. Дальше — столько, сколько захочешь.",
          )}
        />

        <ol className="stairs" data-reveal>
          {participationSteps.map((step, index) => (
            <li
              className={`step step--${index + 1}`}
              key={step.title}
              style={{ "--i": index } as CSSProperties}
            >
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{tie(step.title)}</h3>
              <p className="step-tag">{step.tag}</p>
              <p className="step-text">{tie(step.text)}</p>
            </li>
          ))}
        </ol>

        <div className="forms" id="forms">
          <div className="forms-head" data-reveal>
            <h3>Анкеты для первокурсников</h3>
            <p>
              {tie(
                "По анкетам мы принимаем первокурсников в Студсовет и распределяем по секторам. Выбери тот, что тебе ближе.",
              )}
            </p>
          </div>
          <ul className="form-cards">
            {sectors.map((sector, index) => (
              <li
                className={`form-card form-card--${sector.id}`}
                key={sector.id}
                data-reveal
                style={{ "--d": index } as CSSProperties}
              >
                <span className="badge">{sector.short}</span>
                <p>{tie(sector.focus)}</p>
                {sector.form && (
                  <ActionLink
                    href={sector.form}
                    tone={formTone[sector.id]}
                    size="sm"
                  >
                    Заполнить анкету
                  </ActionLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
