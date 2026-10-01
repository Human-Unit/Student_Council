import { teamMembers } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export function Team() {
  return (
    <section
      className="section section--team"
      id="team"
      aria-labelledby="team-title"
    >
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Люди"
          title="Команда"
          titleId="team-title"
        />

        {teamMembers.length > 0 ? (
          <div className="team-grid">
            {teamMembers.map((member) => (
              <article className="team-member" key={member.name}>
                {/* eslint-disable-next-line @next/next/no-img-element -- configurable external/local team media */}
                <img src={member.photo} alt={`Фотография: ${member.name}`} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                {member.contactUrl && (
                  <a href={member.contactUrl} target="_blank" rel="noreferrer">
                    Связаться
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="team-empty">
            <div className="team-empty-marker" aria-hidden="true">
              <span>05</span>
              <span>Обновление</span>
            </div>
            <div className="team-empty-copy">
              <p className="team-empty-title">
                Обновлённый состав команды готовится к публикации.
              </p>
              <p>
                Здесь появятся только подтверждённые имена, роли, фотографии и
                контакты.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
