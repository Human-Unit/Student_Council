import type { CSSProperties } from "react";
import { teamMembers, type TeamMember } from "@/data/site";
import { ArrowIcon } from "./ArrowIcon";
import { SectionHeading } from "./SectionHeading";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="member">
      <div className="member-photo">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- configurable external/local team media
          <img
            src={member.photo}
            alt={`Фотография: ${member.name}`}
            loading="lazy"
          />
        ) : (
          <span className="member-initials" aria-hidden="true">
            {initials(member.name)}
          </span>
        )}
      </div>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      {member.contactUrl && (
        <a
          className="text-link"
          href={member.contactUrl}
          target="_blank"
          rel="noreferrer"
        >
          Связаться <ArrowIcon direction="up-right" />
        </a>
      )}
    </article>
  );
}

/** Rendered only once verified team members are added to the data file. */
export function Team() {
  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="section team" id="team" aria-labelledby="team-title">
      <div className="shell">
        <SectionHeading
          index="—"
          eyebrow="Люди"
          title="Команда Студсовета"
          titleId="team-title"
        />
        <ul className="team-grid">
          {teamMembers.map((member, index) => (
            <li
              key={member.name}
              data-reveal
              style={{ "--d": index % 4 } as CSSProperties}
            >
              <TeamCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
