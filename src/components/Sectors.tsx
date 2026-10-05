import type { CSSProperties } from "react";
import { links, sectors, type Sector } from "@/data/site";
import { tie } from "@/lib/typography";
import { ActionLink, type ActionTone } from "./ActionLink";
import { ArrowIcon } from "./ArrowIcon";
import { SectionHeading } from "./SectionHeading";
import { SectorVisual } from "./SectorVisual";

const formTone: Record<Sector["id"], ActionTone> = {
  ipos: "red",
  kmts: "kmts",
  osps: "osps",
};

function SectorCard({ sector, index }: { sector: Sector; index: number }) {
  return (
    <article
      className={`sector sector--${sector.id}`}
      aria-labelledby={`sector-${sector.id}`}
      data-reveal
      style={{ "--d": index % 2 } as CSSProperties}
    >
      <div className="sector-body">
        <p className="sector-badge">
          <span className="badge">{sector.short}</span>
          <span>{sector.name}</span>
        </p>
        <h3 id={`sector-${sector.id}`}>{tie(sector.title)}</h3>
        <p className="sector-text">{tie(sector.text)}</p>
        <ul className="sector-tags" aria-label="Чем занимается сектор">
          {sector.tags.map((tag) => (
            <li key={tag}>
              {sector.id === "ipos" && <b aria-hidden="true">#</b>}
              {tag}
            </li>
          ))}
        </ul>
        <div className="sector-actions">
          {sector.form && (
            <ActionLink href={sector.form} tone={formTone[sector.id]}>
              Анкета для первокурсников
            </ActionLink>
          )}
          {sector.id === "ipos" && links.councilInstagram && (
            <a
              className="text-link"
              href={links.councilInstagram}
              target="_blank"
              rel="noreferrer"
            >
              Наши работы в Instagram <ArrowIcon direction="up-right" />
            </a>
          )}
        </div>
        {sector.lead && (
          <p className="sector-lead">
            <span>{sector.lead.role}</span>
            <b>{sector.lead.name}</b>
            {sector.lead.href ? (
              <a href={sector.lead.href} target="_blank" rel="noreferrer">
                {sector.lead.handle}
              </a>
            ) : (
              <span>{sector.lead.handle}</span>
            )}
          </p>
        )}
      </div>
      <SectorVisual id={sector.id} />
    </article>
  );
}

export function Sectors() {
  return (
    <section
      className="section sectors"
      id="sectors"
      aria-labelledby="sectors-title"
      data-index="03"
      data-theme="paper"
    >
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Секторы"
          title={
            <>
              Три сектора — <em>одна команда</em>
            </>
          }
          titleId="sectors-title"
          lead={tie(
            "Выбирай, что тебе ближе: медиа и съёмки, события и праздники или знания за пределами пар.",
          )}
        />
        <div className="sector-list">
          {sectors.map((sector, index) => (
            <SectorCard key={sector.id} sector={sector} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
