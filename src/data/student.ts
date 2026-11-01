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
  usageTitle: "Когда используется",
  downloadTitle: "Скачать образец DOCX",
  backToDocuments: "Все документы",
  openDocument: "Подробнее",
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
      "Раздел для материалов по практике. Подтверждённые материалы пока не добавлены.",
    href: null,
    action: "Скоро",
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

/** Fields in the order they appear in each original. Not a form schema. */
export const documentGuidance: Record<string, readonly string[]> = {
  "missed-classes-explanation": [
    "Курс и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Дата пропуска занятий",
    "Дата и подпись",
    "Телефон",
  ],
  "absence-certificate-acceptance": [
    "Курс и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Даты начала и окончания отсутствия",
    "Причина отсутствия",
    "Дата и подпись",
    "Телефон",
  ],
  "class-release-application": [
    "Курс и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Даты начала и окончания освобождения",
    "Причина освобождения",
    "Дата и подпись",
    "Телефон",
  ],
  "tuition-payment-deferment": [
    "Курс и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Первая или вторая половина оплаты",
    "Дата, до которой нужна отсрочка",
    "Причина отсрочки",
    "Дата и подпись",
    "Телефон",
  ],
  "graduation-certificate": [
    "Год выпуска и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Магистратура, в которую вы поступаете",
    "Подпись и дата",
    "Мобильный телефон",
  ],
  "student-status-certificate": [
    "Курс и направление подготовки",
    "Фамилия, имя и отчество полностью",
    "Место, куда нужна справка",
    "Подпись и дата",
    "Мобильный телефон",
  ],
};
