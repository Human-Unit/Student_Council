import type { Metadata } from "next";
import { Chevron } from "@/components/BrandShapes";
import { SectionHeading } from "@/components/SectionHeading";
import { DocumentDownload } from "@/components/student/DocumentList";
import { FieldList } from "@/components/student/FieldList";
import {
  DiaryTable,
  PracticeToc,
  TitlePagePreview,
} from "@/components/student/Practice";
import { StudentIntro } from "@/components/student/StudentIntro";
import { rowNumber, StudentRow } from "@/components/student/StudentRows";
import { fieldsFor } from "@/data/fields";
import {
  diaryExample,
  practiceComparison,
  practiceCopy,
  practiceGuide,
  practiceSections,
  practiceTemplates,
  titlePageFieldKeys,
  titlePageLines,
} from "@/data/practice";
import { studentCopy } from "@/data/student";
import { tie } from "@/lib/typography";

const title = "Дневник практики | Студенческий совет";
export const metadata: Metadata = {
  title,
  description: practiceCopy.lead,
  alternates: { canonical: "/student/practice" },
  openGraph: {
    title,
    description: practiceCopy.lead,
    url: "/student/practice",
  },
  twitter: { title, description: practiceCopy.lead },
};

// The templates chapter appears only once an approved original exists.
const hasTemplates = practiceTemplates.some(
  (template) => template.template_url,
);
const sections = practiceSections.filter(
  (section) => hasTemplates || section.id !== "practice-templates",
);
const FIRST_CHAPTER = 2;
const chapter = (id: (typeof practiceSections)[number]["id"]) => {
  const position = sections.findIndex((section) => section.id === id);
  return String(position + FIRST_CHAPTER).padStart(2, "0");
};

export default function PracticePage() {
  return (
    <>
      <StudentIntro
        eyebrow={studentCopy.title}
        title={practiceCopy.heading}
        lead={practiceCopy.lead}
        breadcrumbs={[
          { label: studentCopy.title, href: "/student" },
          { label: practiceCopy.title },
        ]}
      >
        <PracticeToc sections={sections} firstIndex={FIRST_CHAPTER} />
      </StudentIntro>

      <section
        className="practice-section shell"
        id="practice-guide"
        data-index={chapter("practice-guide")}
        data-theme="paper"
        aria-labelledby="practice-guide-title"
      >
        <p className="practice-disclaimer" role="note">
          {tie(practiceCopy.disclaimer)}
          {hasTemplates ? null : <> {tie(practiceCopy.templatesPending)}</>}
        </p>
        <SectionHeading
          index={chapter("practice-guide")}
          eyebrow={practiceCopy.title}
          title={practiceCopy.guideTitle}
          titleId="practice-guide-title"
          lead={tie(practiceCopy.guideLead)}
        />
        <div className="practice-guide">
          <ol className="practice-rules">
            {practiceGuide.map((rule) => (
              <li key={rule.title}>
                <Chevron />
                <div>
                  <h3>{rule.title}</h3>
                  <p>{tie(rule.text)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="practice-compare">
            <figure className="practice-quote practice-quote--weak">
              <figcaption>{practiceCopy.compareWeak}</figcaption>
              <blockquote>
                <p>{tie(practiceComparison.weak)}</p>
              </blockquote>
            </figure>
            <figure className="practice-quote practice-quote--strong">
              <figcaption>{practiceCopy.compareStrong}</figcaption>
              <blockquote>
                <p>{tie(practiceComparison.strong)}</p>
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section
        className="practice-section shell"
        id="practice-title-page"
        data-index={chapter("practice-title-page")}
        data-theme="paper"
        aria-labelledby="practice-title-page-title"
      >
        <SectionHeading
          index={chapter("practice-title-page")}
          eyebrow={practiceCopy.title}
          title={practiceCopy.titlePageTitle}
          titleId="practice-title-page-title"
          lead={tie(practiceCopy.titlePageLead)}
        />
        <div className="practice-title-page">
          <TitlePagePreview lines={titlePageLines} />
          <div className="practice-title-fields">
            <h3>{practiceCopy.titlePageFieldsTitle}</h3>
            <FieldList fields={fieldsFor(titlePageFieldKeys)} />
          </div>
        </div>
      </section>

      <section
        className="practice-section shell"
        id="practice-entries"
        data-index={chapter("practice-entries")}
        data-theme="paper"
        aria-labelledby="practice-entries-title"
      >
        <SectionHeading
          index={chapter("practice-entries")}
          eyebrow={practiceCopy.title}
          title={practiceCopy.entriesTitle}
          titleId="practice-entries-title"
          lead={tie(practiceCopy.entriesLead)}
        />
        <DiaryTable entries={diaryExample} />
      </section>

      {hasTemplates ? (
        <section
          className="practice-section shell"
          id="practice-templates"
          data-index={chapter("practice-templates")}
          data-theme="paper"
          aria-labelledby="practice-templates-title"
        >
          <SectionHeading
            index={chapter("practice-templates")}
            eyebrow={practiceCopy.title}
            title={practiceCopy.templatesTitle}
            titleId="practice-templates-title"
            lead={tie(practiceCopy.templatesLead)}
          />
          <ol className="student-rows practice-templates">
            {practiceTemplates
              .filter((template) => template.template_url)
              .map((template, index) => (
                <StudentRow
                  key={template.slug}
                  number={rowNumber(index)}
                  title={template.title}
                  summary={tie(template.summary)}
                >
                  <DocumentDownload document={template} />
                </StudentRow>
              ))}
          </ol>
        </section>
      ) : null}
    </>
  );
}
