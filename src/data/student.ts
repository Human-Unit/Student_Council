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
  heading: "Полезное",
  headingAccent: "без поиска по старым чатам",
  lead: "Документы, практика и студенческие сервисы — в одном разделе.",
  documentsTitle: "Документы",
  documentsLead:
    "Заявления, объяснительные и справки: образцы в DOCX и данные, которые понадобятся для заполнения.",
  sourceNotice:
    "Оригиналы образцов пока не добавлены. Скачивание и предпросмотр недоступны.",
  emptyTitle: "Пока нет опубликованных документов",
  emptyText: "Здесь появятся описания и доступные образцы документов.",
  unavailableDownload: "DOCX пока недоступен",
  previewTitle: "Образец документа",
  previewUnavailable: "Оригинал пока не добавлен",
  previewPending: "Предпросмотр пока недоступен",
  previewDownloadNote:
    "Оригинал можно скачать в формате DOCX. Встроенный предпросмотр не подготовлен.",
  previewOpen: "Открыть образец целиком",
  previewNote:
    "Предпросмотр появится после проверки исходного DOCX. Это не официальный бланк.",
  informationTitle: "Что понадобится",
  informationNote:
    "Поля перечислены в том порядке, в котором они идут в бланке.",
  exampleLabel: "Пример",
  usageTitle: "Когда используется",
  downloadTitle: "Скачать образец DOCX",
  backToDocuments: "Все документы",
  preparationLabel: "Перед заполнением",
  sourceLabel: "Исходный файл",
  notFoundTitle: "Документ не найден",
  notFoundText: "Проверьте ссылку или вернитесь в каталог документов.",
};

export const studentServices = [
  {
    title: "Документы",
    summary: "Заявления, объяснительные и справки.",
    href: "/student/documents",
    action: "Открыть",
  },
  {
    title: "Практика",
    summary:
      "Как вести дневник практики: титульный лист, примеры записей и шаблоны.",
    href: "/student/practice",
    action: "Открыть",
  },
  {
    title: "Расписание",
    summary: "Студенческий проект для проверки расписания.",
    href: null,
    action: "Ссылка пока недоступна",
  },
] as const;

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  EXPLANATION: "Объяснительная",
  APPLICATION: "Заявление",
  CERTIFICATE: "Справка",
  OTHER: "Документ",
};

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
