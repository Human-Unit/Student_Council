import type { CSSProperties } from "react";
import { roles } from "@/data/site";
import { tie } from "@/lib/typography";
import { Chevron } from "./BrandShapes";
import { Logo } from "./Logo";
import { ScrollText, type ScrollTextPart } from "./ScrollText";
import { SectionHeading } from "./SectionHeading";

const statement: ScrollTextPart[] = [
  "Команда студентов, которая участвует в организации",
  { em: "студенческой жизни," },
  "помогает запускать",
  { em: "инициативы" },
  "и создаёт",
  { em: "связь" },
  "между студентами и университетом.",
];

function Bridge() {
  return (
    <figure className="bridge" data-reveal>
      <figcaption className="sr-only">
        Студенческий совет передаёт идеи, вопросы и инициативы студентов
        университету, а предложения и обратную связь — студентам.
      </figcaption>
      <span className="plate">Студенты</span>
      <span className="bridge-line" aria-hidden="true">
        <span>{tie("идеи, вопросы и инициативы")}</span>
      </span>
      <Logo className="bridge-logo" shadow="soft" />
      <span className="bridge-line bridge-line--second" aria-hidden="true">
        <span>{tie("предложения и обратная связь")}</span>
      </span>
      <span className="plate plate--deep">Университет</span>
    </figure>
  );
}

export function About() {
  return (
    <section
      className="section about"
      id="about"
      aria-labelledby="about-title"
      data-index="01"
      data-theme="paper"
    >
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="О нас"
          title={
            <>
              Что такое <em>Студенческий совет?</em>
            </>
          }
          titleId="about-title"
        />

        <div className="about-grid">
          <div className="about-main">
            <ScrollText parts={statement} />
            <ul className="roles">
              {roles.map((role, index) => (
                <li
                  className="role"
                  key={role.title}
                  data-reveal
                  style={{ "--d": index } as CSSProperties}
                >
                  <h3>
                    <Chevron />
                    {role.title}
                  </h3>
                  <p>{tie(role.text)}</p>
                </li>
              ))}
            </ul>
          </div>
          <Bridge />
        </div>
      </div>
    </section>
  );
}
