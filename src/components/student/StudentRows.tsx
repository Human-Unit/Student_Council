import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";

type StudentRowProps = {
  number: string;
  title: ReactNode;
  summary: ReactNode;
  /** Internal destination. The whole row becomes its tap target. */
  href?: string | null;
  /** Accessible name when the visible title is shortened. */
  label?: string;
  /** Short facts: category, availability. Rendered after the summary. */
  meta?: readonly string[];
  /** Extra real actions (a download) that sit above the row link. */
  children?: ReactNode;
};

/** Ruled editorial row shared by the student hub, documents and templates. */
export function StudentRow({
  number,
  title,
  summary,
  href,
  label,
  meta = [],
  children,
}: StudentRowProps) {
  return (
    <li className="student-row" data-linked={href ? "" : undefined}>
      <span className="student-row-number" aria-hidden="true">
        {number}
      </span>
      <div className="student-row-body">
        <h2>
          {href ? (
            <a className="student-row-link" href={href} aria-label={label}>
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
        <p>{summary}</p>
        {meta.length > 0 ? (
          <ul className="student-row-meta">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {href || children ? (
        <div className="student-row-actions">
          {href ? (
            <span className="student-row-arrow" aria-hidden="true">
              <ArrowIcon />
              <ArrowIcon />
            </span>
          ) : null}
          {children}
        </div>
      ) : null}
    </li>
  );
}

export function rowNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
