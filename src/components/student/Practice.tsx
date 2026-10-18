import { ArrowIcon } from "@/components/ArrowIcon";
import { studentFields } from "@/data/fields";
import {
  diaryColumns,
  practiceCopy,
  type DiaryEntry,
  type TitlePageLine,
} from "@/data/practice";
import { site } from "@/data/site";
import { parseTemplate, type FieldValues } from "@/lib/templates";
import { tie } from "@/lib/typography";

/** Values that are verified facts, not student input. */
const constants: FieldValues = { institution: site.branch };

function labelFor(key: string): string {
  return key in studentFields
    ? studentFields[key as keyof typeof studentFields].label
    : key;
}

/**
 * Paper-proportioned map of a title page. Empty fields render as highlighted
 * labels; pass `values` later to show a student's own filled copy.
 */
export function TitlePagePreview({
  lines,
  values = {},
}: {
  lines: readonly TitlePageLine[];
  values?: FieldValues;
}) {
  const merged = { ...constants, ...values };
  return (
    <figure className="practice-paper-figure">
      <div className="practice-paper">
        {lines.map((line, index) => (
          <p
            key={index}
            className={`practice-line practice-line--${line.role ?? "body"}${
              line.align === "start" ? " practice-line--start" : ""
            }`}
          >
            {parseTemplate(line.text).map((segment, position) =>
              segment.kind === "text" ? (
                segment.value
              ) : merged[segment.key] ? (
                <span key={position}>{merged[segment.key]}</span>
              ) : (
                <mark key={position} className="practice-tag">
                  {labelFor(segment.key)}
                </mark>
              ),
            )}
          </p>
        ))}
      </div>
      <figcaption>{tie(practiceCopy.previewCaption)}</figcaption>
    </figure>
  );
}

/** Real table semantics; narrow screens restyle each row as a stacked entry. */
export function DiaryTable({ entries }: { entries: readonly DiaryEntry[] }) {
  return (
    <div className="practice-table-wrap">
      <table className="practice-table">
        <caption>{practiceCopy.entriesCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{diaryColumns.date}</th>
            <th scope="col">{diaryColumns.work}</th>
            <th scope="col">{diaryColumns.mark}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.date}>
              <th scope="row" data-label={diaryColumns.date}>
                {entry.date}
              </th>
              <td data-label={diaryColumns.work}>{tie(entry.work)}</td>
              <td data-label={diaryColumns.mark}>
                <span className="practice-mark">{entry.mark}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PracticeToc({
  sections,
  firstIndex = 1,
}: {
  sections: readonly { id: string; title: string }[];
  /** Number of the first chapter, so the list matches the section tabs. */
  firstIndex?: number;
}) {
  return (
    <nav className="practice-toc" aria-label={practiceCopy.tocLabel}>
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span aria-hidden="true">
                {String(index + firstIndex).padStart(2, "0")}
              </span>
              {section.title}
              <ArrowIcon direction="down" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
