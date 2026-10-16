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
    "Заявления, объяснительные и справки. Назначение документов и данные, которые понадобятся для заполнения.",
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
  previewNote:
    "Предпросмотр появится после проверки исходного DOCX. Это не официальный бланк.",
  informationTitle: "Что понадобится",
  informationNote:
    "Перечень — ориентир по описанию документа. Точный текст и поля нужно сверить с оригиналом образца.",
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

/** Titles/purposes supplied by the owner. No official template wording or files fabricated. */
export const documentCatalog: readonly StudentDocument[] = [
  {
    slug: "missed-classes-explanation",
    title: "Объяснительная о пропуске занятий",
    short_title: null,
    summary:
      "Для объяснения пропуска занятий: указываются дата и причина отсутствия.",
    category: "EXPLANATION",
    sort_order: 0,
    is_published: true,
    template_url: null,
  },
  {
    slug: "class-release-application",
    title: "Заявление об освобождении от занятий",
    short_title: null,
    summary:
      "Для обращения об освобождении от занятий на определённый период с указанием причины.",
    category: "APPLICATION",
    sort_order: 1,
    is_published: true,
    template_url: null,
  },
  {
    slug: "tuition-payment-deferment",
    title: "Заявление об отсрочке выплаты за обучение",
    short_title: null,
    summary:
      "Для обращения об отсрочке выплаты за обучение с указанием части оплаты, даты и причины.",
    category: "APPLICATION",
    sort_order: 2,
    is_published: true,
    template_url: null,
  },
  {
    slug: "graduation-certificate",
    title: "Заявление о выдаче справки об окончании",
    short_title: null,
    summary:
      "Для запроса справки об окончании с указанием года выпуска и места предоставления, в том числе для поступления в магистратуру.",
    category: "CERTIFICATE",
    sort_order: 3,
    is_published: true,
    template_url: null,
  },
  {
    slug: "student-status-certificate",
    title: "Заявление о выдаче справки о том, что является студентом",
    short_title: null,
    summary:
      "Для запроса справки о статусе студента с указанием места её предоставления.",
    category: "CERTIFICATE",
    sort_order: 4,
    is_published: true,
    template_url: null,
  },
];

/** Guidance from the supplied brief, not a form schema or replacement official text. */
export const documentGuidance: Record<string, readonly string[]> = {
  "missed-classes-explanation": [
    "Курс и направление",
    "Фамилия, имя и отчество",
    "Дата пропуска занятий",
    "Причина пропуска",
    "Телефон",
    "Дата и подпись",
  ],
  "class-release-application": [
    "Курс и направление",
    "Фамилия, имя и отчество",
    "Дата начала и окончания периода",
    "Причина освобождения",
    "Телефон",
    "Дата и подпись",
  ],
  "tuition-payment-deferment": [
    "Курс и направление",
    "Фамилия, имя и отчество",
    "Первая или вторая половина оплаты",
    "Дата, до которой нужна отсрочка",
    "Причина отсрочки",
    "Телефон",
    "Дата и подпись",
  ],
  "graduation-certificate": [
    "Год окончания и направление",
    "Фамилия, имя и отчество",
    "Место предоставления или поступления в магистратуру",
    "Телефон",
    "Дата и подпись",
  ],
  "student-status-certificate": [
    "Курс и направление",
    "Фамилия, имя и отчество",
    "Место предоставления справки",
    "Телефон",
    "Дата и подпись",
  ],
};
