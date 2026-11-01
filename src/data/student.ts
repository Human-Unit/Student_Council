import type { FieldKey } from "@/data/fields";

export type DocumentCategory =
  "EXPLANATION" | "APPLICATION" | "CERTIFICATE" | "OTHER";

/** Public view fields align with the backend; persistence audit fields stay there. */
export type StudentDocument = {
  slug: string;
  title: string;
  short_title: string | null;
  summary: string;
  category: DocumentCategory;
  sort_order: number;
  is_published: boolean;
  template_url: string | null;
};

export const studentCopy = {
  title: "Студенту",
  heading: "Бланки и памятки",
  lead: "Заявления, справки и объяснительные в DOCX и памятка по дневнику практики.",
  documentsTitle: "Документы",
  documentsLead:
    "Бланки заявлений, справок и объяснительных. На странице каждого — что в него вписать и как он выглядит.",
  sourceNotice: "Оригиналы некоторых бланков пока не добавлены.",
  emptyTitle: "Пока нет опубликованных документов",
  emptyText: "Здесь появятся бланки документов.",
  unavailableDownload: "DOCX пока недоступен",
  previewTitle: "Как выглядит бланк",
  previewUnavailable: "Оригинал пока не добавлен",
  previewPending: "Предпросмотр пока недоступен",
  previewDownloadNote: "Бланк можно скачать в формате DOCX.",
  previewOpen: "Открыть бланк целиком",
  previewNote: "Предпросмотр появится, когда будет добавлен оригинал.",
  informationTitle: "Что вписать",
  informationNote:
    "Поля перечислены в том порядке, в котором они идут в бланке.",
  exampleLabel: "Пример",
  downloadTitle: "Скачать бланк DOCX",
  downloadShort: "Скачать DOCX",
  backToDocuments: "Все документы",
  notFoundTitle: "Документ не найден",
  notFoundText: "Проверьте ссылку или вернитесь к списку документов.",
};

/** Sections of /student. Entries without `href` are hidden until they exist. */
export const studentServices: readonly {
  title: string;
  summary: string;
  href: string | null;
}[] = [
  {
    title: "Документы",
    summary: "Бланки заявлений, справок и объяснительных.",
    href: "/student/documents",
  },
  {
    title: "Практика",
    summary: "Как вести дневник практики: титульный лист и примеры записей.",
    href: "/student/practice",
  },
  {
    title: "Расписание",
    summary: "Студенческий проект для проверки расписания.",
    href: null,
  },
];

/**
 * Titles and purposes supplied by the owner, aligned with the approved DOCX
 * originals in public/documents/templates (byte-identical, see SHA256SUMS).
 */
export const documentCatalog: readonly StudentDocument[] = [
  {
    slug: "missed-classes-explanation",
    title: "Объяснительная о пропуске занятий",
    short_title: null,
    summary:
      "Для пропуска занятий по болезни, если вы лечились дома: указывается дата пропуска.",
    category: "EXPLANATION",
    sort_order: 0,
    is_published: true,
    template_url: "/documents/templates/missed-classes-explanation.docx",
  },
  {
    slug: "absence-certificate-acceptance",
    title: "Заявление о принятии справки об отсутствии на занятиях",
    short_title: "Заявление о принятии справки",
    summary:
      "Для пропуска занятий, подтверждённого справкой: указываются период отсутствия и причина.",
    category: "APPLICATION",
    sort_order: 1,
    is_published: true,
    template_url: "/documents/templates/absence-certificate-acceptance.docx",
  },
  {
    slug: "class-release-application",
    title: "Заявление об освобождении от занятий",
    short_title: null,
    summary:
      "Для обращения об освобождении от занятий на определённый период с указанием причины.",
    category: "APPLICATION",
    sort_order: 2,
    is_published: true,
    template_url: "/documents/templates/class-release-application.docx",
  },
  {
    slug: "tuition-payment-deferment",
    title: "Заявление об отсрочке выплаты за обучение",
    short_title: null,
    summary:
      "Для обращения об отсрочке выплаты за обучение с указанием части оплаты, даты и причины.",
    category: "APPLICATION",
    sort_order: 3,
    is_published: true,
    template_url: "/documents/templates/tuition-payment-deferment.docx",
  },
  {
    slug: "graduation-certificate",
    title: "Заявление о выдаче справки об окончании",
    short_title: null,
    summary:
      "Для выпускников, поступающих в магистратуру: указываются год выпуска, направление и место поступления.",
    category: "CERTIFICATE",
    sort_order: 4,
    is_published: true,
    template_url: "/documents/templates/graduation-certificate.docx",
  },
  {
    slug: "student-status-certificate",
    title: "Заявление о выдаче справки о том, что является студентом",
    short_title: null,
    summary:
      "Для запроса справки о статусе студента с указанием места её предоставления.",
    category: "CERTIFICATE",
    sort_order: 5,
    is_published: true,
    template_url: "/documents/templates/student-status-certificate.docx",
  },
];

/**
 * Fields in the order they appear on each original, by key into
 * `studentFields`. Checked against the DOCX files; still not a form schema.
 */
export const documentGuidance: Record<string, readonly FieldKey[]> = {
  "missed-classes-explanation": [
    "course",
    "direction",
    "fullName",
    "absenceDate",
    "date",
    "signature",
    "phone",
  ],
  "absence-certificate-acceptance": [
    "course",
    "direction",
    "fullName",
    "periodStart",
    "periodEnd",
    "absenceReason",
    "date",
    "signature",
    "phone",
  ],
  "class-release-application": [
    "course",
    "direction",
    "fullName",
    "periodStart",
    "periodEnd",
    "releaseReason",
    "date",
    "signature",
    "phone",
  ],
  "tuition-payment-deferment": [
    "course",
    "direction",
    "fullName",
    "paymentPart",
    "deferUntil",
    "deferReason",
    "date",
    "signature",
    "phone",
  ],
  "graduation-certificate": [
    "graduationYear",
    "direction",
    "fullName",
    "masterProgram",
    "signature",
    "date",
    "phone",
  ],
  "student-status-certificate": [
    "course",
    "direction",
    "fullName",
    "recipient",
    "signature",
    "date",
    "phone",
  ],
};
