import type { Metadata } from "next";
import { StudentIntro } from "@/components/student/StudentIntro";
import { rowNumber, StudentRow } from "@/components/student/StudentRows";
import { studentCopy, studentServices } from "@/data/student";
import { tie } from "@/lib/typography";

const title = "Студенту | Студенческий совет";
export const metadata: Metadata = {
  title,
  description: studentCopy.lead,
  alternates: { canonical: "/student" },
  openGraph: { title, description: studentCopy.lead, url: "/student" },
  twitter: { title, description: studentCopy.lead },
};

export default function StudentPage() {
  return (
    <>
      <StudentIntro
        eyebrow={studentCopy.title}
        title={
          <>
            {studentCopy.heading}
            <br />
            <em>{tie(studentCopy.headingAccent)}</em>
          </>
        }
        lead={studentCopy.lead}
        breadcrumbs={[{ label: studentCopy.title }]}
      />
      <section
        className="student-content shell"
        aria-label="Разделы для студентов"
        data-index="02"
        data-theme="paper"
      >
        <ol className="student-rows">
          {studentServices.map((service, index) => (
            <StudentRow
              key={service.title}
              number={rowNumber(index)}
              href={service.href}
              title={service.title}
              summary={tie(service.summary)}
              meta={service.href ? [] : [service.action]}
            />
          ))}
        </ol>
      </section>
    </>
  );
}
