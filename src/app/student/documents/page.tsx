import type { Metadata } from "next";
import { DocumentList } from "@/components/student/DocumentList";
import { StudentIntro } from "@/components/student/StudentIntro";
import { studentCopy } from "@/data/student";
import { getDocuments } from "@/lib/documents";
import { tie } from "@/lib/typography";

const title = "Документы студенту | Студенческий совет";
export const metadata: Metadata = {
  title,
  description: studentCopy.documentsLead,
  alternates: { canonical: "/student/documents" },
  openGraph: {
    title,
    description: studentCopy.documentsLead,
    url: "/student/documents",
  },
  twitter: { title, description: studentCopy.documentsLead },
};

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return (
    <>
      <StudentIntro
        title={studentCopy.documentsTitle}
        lead={studentCopy.documentsLead}
        eyebrow={studentCopy.title}
        breadcrumbs={[
          { label: studentCopy.title, href: "/student" },
          { label: studentCopy.documentsTitle },
        ]}
      />
      <section
        className="student-content shell"
        aria-label="Каталог документов"
        data-index="02"
        data-theme="paper"
      >
        {documents.some((document) => !document.template_url) ? (
          <p className="student-source-note">{tie(studentCopy.sourceNotice)}</p>
        ) : null}
        <DocumentList documents={documents} />
      </section>
    </>
  );
}
