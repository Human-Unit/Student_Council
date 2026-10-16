import type { Metadata } from "next";
import { ActionLink } from "@/components/ActionLink";
import { StudentIntro } from "@/components/student/StudentIntro";
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
            <li className="student-row" key={service.title}>
              <span className="student-row-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="student-row-body">
                <h2>{service.title}</h2>
                <p>{tie(service.summary)}</p>
              </div>
              <div className="student-row-actions">
                {service.href ? (
                  <ActionLink href={service.href}>{service.action}</ActionLink>
                ) : (
                  <p className="student-unavailable">{service.action}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
