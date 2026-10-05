import type { CSSProperties } from "react";
import { ideaHandle, ideaUrl, plans } from "@/data/site";
import { tie } from "@/lib/typography";
import { ActionLink } from "./ActionLink";
import { Chevron, Star } from "./BrandShapes";
import { Logo } from "./Logo";
import { SectionHeading } from "./SectionHeading";

/** Plans for the year and the invitation to bring an idea. */
export function Feedback() {
  return (
    <section
      className="section idea"
      id="idea"
      aria-labelledby="plans-title"
      data-index="06"
      data-theme="deep"
    >
      <div className="idea-super" aria-hidden="true">
        <Logo className="idea-super-a" tone="light" shadow="blue" />
        <Logo className="idea-super-b" tone="light" shadow="blue" />
      </div>

      <div className="shell">
        <SectionHeading
          tone="blue"
          index="06"
          eyebrow="Дальше"
          title="Что планируем дальше"
          titleId="plans-title"
        />

        <div className="plans">
          {plans.map((plan, index) => (
            <div
              className="plan"
              key={plan.title}
              data-reveal
              style={{ "--d": index } as CSSProperties}
            >
              <h3>{plan.title}</h3>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>
                    <Chevron />
                    {tie(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="idea-cta" data-reveal>
          <h2 className="idea-title">
            Есть идея,
            <br />
            проблема или проект?
          </h2>
          <div className="idea-row">
            <span className="plate plate--paper plate--xl">Расскажи нам</span>
            <Star className="idea-star" />
            <Star className="idea-star idea-star--small" />
          </div>
          <p className="idea-note">
            {tie("Следующий пункт в планах может быть твоим. Пиши в директ")}{" "}
            <b>{ideaHandle}</b>
          </p>
          {ideaUrl && (
            <ActionLink href={ideaUrl} tone="paper">
              Написать в Instagram
            </ActionLink>
          )}
        </div>
      </div>
    </section>
  );
}
