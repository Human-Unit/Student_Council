import { ActionLink } from "@/components/ActionLink";
import {
  documentCategoryLabels,
  studentCopy,
  type StudentDocument,
} from "@/data/student";
import { tie } from "@/lib/typography";

export function DocumentDownload({ document }: { document: StudentDocument }) {
  return document.template_url ? (
    <ActionLink
      href={document.template_url}
      download
      size="sm"
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
        <li className="student-row" key={document.slug}>
          <span className="student-row-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="student-row-body">
            <h2>
              <a href={`/student/documents/${document.slug}`}>
                {tie(document.short_title ?? document.title)}
              </a>
            </h2>
            <p>{tie(document.summary)}</p>
          </div>
          <div className="student-row-actions">
            <span className="section-label">
              {documentCategoryLabels[document.category]}
            </span>
            <ActionLink
              href={`/student/documents/${document.slug}`}
              size="sm"
              label={`${studentCopy.openDocument}: ${document.title}`}
            >
              {studentCopy.openDocument}
            </ActionLink>
            <DocumentDownload document={document} />
          </div>
        </li>
      ))}
    </ol>
  );
}
