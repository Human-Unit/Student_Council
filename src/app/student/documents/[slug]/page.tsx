import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/ActionLink";
import { Chevron, Star } from "@/components/BrandShapes";
import { DocumentDownload } from "@/components/student/DocumentList";
import { StudentIntro } from "@/components/student/StudentIntro";
import { studentCopy } from "@/data/student";
import { getDocument, getDocuments } from "@/lib/documents";
import { tie } from "@/lib/typography";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getDocuments()).map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getDocument((await params).slug);
  if (!result) notFound();
  const { document } = result;
  const title = `${document.title} | Студенческий совет`;
  return {
    title,
    description: document.summary,
    alternates: { canonical: `/student/documents/${document.slug}` },
    openGraph: {
      title,
      description: document.summary,
      url: `/student/documents/${document.slug}`,
    },
    twitter: { title, description: document.summary },
  };
}

export default async function DocumentPage({ params }: Props) {
  const result = await getDocument((await params).slug);
  if (!result) notFound();
  const { document, number, information } = result;
  return (
    <>
      <StudentIntro
        title={tie(document.title)}
        lead={document.summary}
        index={number}
        eyebrow={studentCopy.documentsTitle}
        breadcrumbs={[
          { label: studentCopy.title, href: "/student" },
          { label: studentCopy.documentsTitle, href: "/student/documents" },
          { label: document.short_title ?? document.title },
        ]}
      />
      <section
        className="student-content shell student-detail"
        data-index={number}
        data-theme="paper"
        aria-label="О документе"
      >
        <div className="student-detail-copy">
          <p className="section-label">{studentCopy.preparationLabel}</p>
          <h2>{studentCopy.usageTitle}</h2>
          <p>{tie(document.summary)}</p>
          {information.length > 0 ? (
            <>
              <h2>{studentCopy.informationTitle}</h2>
              <ul className="student-information">
                {information.map((field) => (
                  <li key={field}>
                    <Chevron />
                    {tie(field)}
                  </li>
                ))}
              </ul>
              <p className="student-note">{tie(studentCopy.informationNote)}</p>
            </>
          ) : null}
          <div className="student-detail-download">
            <DocumentDownload document={document} />
          </div>
          <ActionLink href="/student/documents" tone="ink">
            {studentCopy.backToDocuments}
          </ActionLink>
        </div>
        <figure className="student-preview">
          <figcaption className="section-label">
            {studentCopy.previewTitle}
          </figcaption>
          <div className="student-paper">
            <Star className="student-paper-star" />
            <p className="section-label">{studentCopy.sourceLabel}</p>
            <p className="student-paper-title">
              {document.template_url
                ? studentCopy.previewPending
                : studentCopy.previewUnavailable}
            </p>
            <p>
              {tie(
                document.template_url
                  ? studentCopy.previewDownloadNote
                  : studentCopy.previewNote,
              )}
            </p>
          </div>
        </figure>
      </section>
    </>
  );
}
