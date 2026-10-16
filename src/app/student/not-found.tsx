import { ActionLink } from "@/components/ActionLink";
import { StudentIntro } from "@/components/student/StudentIntro";
import { studentCopy } from "@/data/student";

export default function StudentNotFound() {
  return (
    <>
      <StudentIntro
        title={studentCopy.notFoundTitle}
        lead={studentCopy.notFoundText}
        index="404"
        eyebrow={studentCopy.title}
        breadcrumbs={[
          { label: studentCopy.title, href: "/student" },
          { label: studentCopy.notFoundTitle },
        ]}
      />
      <div className="student-content shell">
        <ActionLink href="/student/documents">
          {studentCopy.backToDocuments}
        </ActionLink>
      </div>
    </>
  );
}
