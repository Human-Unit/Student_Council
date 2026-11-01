import { ActionLink, type ActionTone } from "@/components/ActionLink";
import { ArrowIcon } from "@/components/ArrowIcon";
import { studentCopy, type StudentDocument } from "@/data/student";
import { downloadName } from "@/lib/template-files";
import { tie } from "@/lib/typography";
import { rowNumber, StudentRow } from "./StudentRows";

type Downloadable = { title: string; template_url: string | null };

/** Primary download button; a document without an original says so. */
export function DocumentDownload({
  document,
  tone = "blue",
  size = "sm",
}: {
  document: Downloadable;
  tone?: ActionTone;
  size?: "md" | "sm";
}) {
  return document.template_url ? (
    <ActionLink
      href={document.template_url}
      download={downloadName(document)}
      tone={tone}
      size={size}
      label={`${studentCopy.downloadTitle}: ${document.title}`}
    >
      {studentCopy.downloadTitle}
    </ActionLink>
  ) : (
    <p className="student-unavailable">{studentCopy.unavailableDownload}</p>
  );
}

export function DocumentList({
  documents,
}: {
  documents: readonly StudentDocument[];
}) {
  if (documents.length === 0)
    return (
      <div className="student-empty" role="status">
        <h2>{studentCopy.emptyTitle}</h2>
        <p>{tie(studentCopy.emptyText)}</p>
      </div>
    );

  return (
    <ol className="student-rows document-list">
      {documents.map((document, index) => (
        <StudentRow
          key={document.slug}
          number={rowNumber(index)}
          href={`/student/documents/${document.slug}`}
          label={document.short_title ? document.title : undefined}
          title={tie(document.short_title ?? document.title)}
          summary={tie(document.summary)}
          meta={document.template_url ? [] : [studentCopy.unavailableDownload]}
        >
          {document.template_url ? (
            <a
              className="text-link student-row-download"
              href={document.template_url}
              download={downloadName(document)}
              aria-label={`${studentCopy.downloadTitle}: ${document.title}`}
            >
              {studentCopy.downloadShort}
              <ArrowIcon direction="down" />
            </a>
          ) : null}
        </StudentRow>
      ))}
    </ol>
  );
}
