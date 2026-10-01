import { SectionHeading } from "./SectionHeading";

const pillars = [
  {
    title: "Инициативы",
    text: "Помогаем студентам превращать идеи в реальные проекты.",
  },
  {
    title: "Студенческая жизнь",
    text: "Мероприятия, медиа и проекты вне учебных занятий.",
  },
  {
    title: "Развитие",
    text: "Возможность получить опыт, попробовать себя в команде и создать что-то полезное.",
  },
];

export function About() {
  return (
    <section
      className="section section--about"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="О нас"
          title="Что такое Студенческий совет?"
          titleId="about-title"
        />

        <div className="about-intro">
          <p>
            Студенческий совет — команда студентов, которая помогает
            реализовывать инициативы, развивать университетскую жизнь и
            создавать проекты для студентов филиала.
          </p>
        </div>

        <ol className="pillar-list">
          {pillars.map((pillar, index) => (
            <li key={pillar.title}>
              <span className="pillar-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
