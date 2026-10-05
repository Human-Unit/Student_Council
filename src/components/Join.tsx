import type { CSSProperties } from "react";
import { benefits, participationSteps, sectors } from "@/data/site";
import { tie } from "@/lib/typography";
import { ActionLink, type ActionTone } from "./ActionLink";
import { Chevron } from "./BrandShapes";
import { Logo } from "./Logo";
import { SectionHeading } from "./SectionHeading";

const formTone: Record<string, ActionTone> = {
  ipos: "red",
  kmts: "kmts",
  osps: "osps",
};

export function Join() {
  return (
    <>
      <section
        className="section join"
        id="join"
        aria-labelledby="join-title"
        data-index="04"
        data-theme="blue"
      >
        <div className="join-super" aria-hidden="true">
          <Logo tone="light" />
        </div>
        <div className="shell">
          <SectionHeading
            tone="blue"
            index="04"
            eyebrow="Участие"
            title={
              <>
                Не должность,
                <br />а реальный опыт
              </>
            }
            titleId="join-title"
            lead={tie(
              "Студенческий совет — это место, где можно предложить идею, собрать команду, получить опыт и сделать что-то полезное для студенческой жизни.",
            )}
          />
          <ul className="benefits">
            {benefits.map((benefit, index) => (
              <li
                className="benefit"
                key={benefit.title}
                data-reveal
                style={{ "--d": index % 3 } as CSSProperties}
              >
                <h3>
                  <Chevron />
                  {benefit.title}
                </h3>
                <p>{tie(benefit.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="section participate"
        id="participate"
        aria-labelledby="participate-title"
        data-index="05"
        data-theme="paper"
      >
        <div className="shell">
          <SectionHeading
            index="05"
            eyebrow="Как участвовать"
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
    </>
  );
}
