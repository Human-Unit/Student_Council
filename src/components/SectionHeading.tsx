import type { ReactNode } from "react";
import { PageTabShape } from "./BrandShapes";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead?: ReactNode;
  /** Background the heading sits on. */
  tone?: "paper" | "blue" | "ink";
  as?: "h1" | "h2";
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  titleId,
  lead,
  tone = "paper",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${tone}`} data-reveal>
      <p className="section-label">
        <span className="section-tab" aria-hidden="true">
          <PageTabShape />
          <span>{index}</span>
        </span>
        <span>{eyebrow}</span>
      </p>
      <Heading id={titleId}>{title}</Heading>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}
