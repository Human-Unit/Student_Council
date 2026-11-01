import type { FieldKey } from "@/data/fields";

/**
 * Practice diary guidance. Everything here is an illustration of a typical
 * diary, not the department's official form: the copy says so on the page.
 * Exact requirements come from the practice programme of each department.
 */

export const practiceCopy = {
  title: "Практика",
  heading: "Дневник практики",
  lead: "Что писать каждый день и как оформить титульный лист.",
  disclaimer:
    "Это пример оформления, а не официальный бланк. Точные требования — в программе практики вашей кафедры.",
  tocLabel: "На этой странице",

  guideTitle: "Что писать в дневнике",
  guideLead: "Дневник показывает, что вы делали каждый день практики.",
  compareWeak: "Слабо",
  compareStrong: "Хорошо",

  titlePageTitle: "Титульный лист",
  titlePageLead:
    "Где на листе стоят ваши данные. Выделенные поля заполняются своими значениями.",
  titlePageFieldsTitle: "Поля титульного листа",
  previewCaption: "Схема титульного листа",

  entriesTitle: "Ежедневные записи",
  entriesLead:
    "Пример записей за первые и последний дни практики. Даты условные.",
  entriesCaption: "Пример заполнения дневника практики",

  templatesTitle: "Шаблоны",
  templatesLead: "Оригиналы от кафедры, без изменений.",
  templatesPending:
    "Шаблон дневника появится здесь, когда кафедра передаст оригинал.",
};

export const practiceSections = [
  { id: "practice-guide", title: practiceCopy.guideTitle },
  { id: "practice-title-page", title: practiceCopy.titlePageTitle },
  { id: "practice-entries", title: practiceCopy.entriesTitle },
  { id: "practice-templates", title: practiceCopy.templatesTitle },
] as const;

export const practiceGuide: readonly { title: string; text: string }[] = [
  {
    title: "Пишите в тот же день",
    text: "Короткая запись вечером проще, чем восстанавливать три недели перед сдачей.",
  },
  {
    title: "Действие и результат",
    text: "Что сделали, с чем работали и что получилось. Не «присутствовал», а «подготовил», «проверил», «настроил».",
  },
  {
    title: "Первый и последний день",
    text: "Обычно это инструктаж, знакомство с организацией и задание — и подготовка отчёта в конце.",
  },
  {
    title: "Совпадение с отчётом",
    text: "Задачи из дневника должны встречаться в отчёте и индивидуальном задании.",
  },
  {
    title: "Подпись руководителя",
    text: "Узнайте заранее, когда руководитель от организации ставит отметки: ежедневно или в конце.",
  },
];

export const practiceComparison = {
  weak: "Работал в отделе, помогал сотрудникам.",
  strong:
    "Собрал данные о заявках за сентябрь в сводную таблицу, проверил дубли и передал руководителю на проверку.",
};

/**
 * Title-page layout. `{key}` tags refer to studentFields; `{institution}` is
 * the verified branch name from site.ts, not student input.
 */
export type TitlePageLine = {
  text: string;
  align?: "center" | "start";
  role?: "header" | "title" | "subtitle" | "footer";
};

export const titlePageLines: readonly TitlePageLine[] = [
  { text: "{institution}", role: "header" },
  { text: "{department}", role: "header" },
  { text: "Дневник", role: "title" },
  { text: "прохождения {practiceType} практики", role: "subtitle" },
  { text: "Студент: {fullName}", align: "start" },
  { text: "Направление: {direction}", align: "start" },
  { text: "Курс {course}, группа {group}", align: "start" },
  { text: "Место прохождения: {practicePlace}", align: "start" },
  { text: "Сроки: с {periodStart} по {periodEnd}", align: "start" },
  { text: "Руководитель от кафедры: {supervisorUniversity}", align: "start" },
  {
    text: "Руководитель от организации: {supervisorOrganization}",
    align: "start",
  },
  { text: "Душанбе, {year}", role: "footer" },
];

export const titlePageFieldKeys: readonly FieldKey[] = [
  "department",
  "practiceType",
  "fullName",
  "direction",
  "course",
  "group",
  "practicePlace",
  "periodStart",
  "periodEnd",
  "supervisorUniversity",
  "supervisorOrganization",
  "year",
];

export type DiaryEntry = { date: string; work: string; mark: string };

export const diaryColumns = {
  date: "Дата",
  work: "Содержание выполненной работы",
  mark: "Отметка руководителя",
};

export const diaryExample: readonly DiaryEntry[] = [
  {
    date: "03.02",
    work: "Вводный инструктаж по охране труда и технике безопасности. Знакомство с организацией, её структурой и правилами внутреннего распорядка. Получение индивидуального задания.",
    mark: "Выполнено",
  },
  {
    date: "04.02",
    work: "Изучение документации и программ, которые используются в подразделении. Составление плана работы на период практики.",
    mark: "Выполнено",
  },
  {
    date: "05.02",
    work: "Сбор исходных данных по теме индивидуального задания. Подготовка сводной таблицы и согласование её структуры с руководителем.",
    mark: "Выполнено",
  },
  {
    date: "21.02",
    work: "Оформление отчёта и дневника практики. Представление результатов руководителю от организации.",
    mark: "Выполнено",
  },
];

export type PracticeTemplate = {
  slug: string;
  title: string;
  summary: string;
  /** Approved DOCX only; `null` keeps the download visibly unavailable. */
  template_url: string | null;
  fields: readonly FieldKey[];
};

export const practiceTemplates: readonly PracticeTemplate[] = [
  {
    slug: "practice-diary",
    title: "Дневник практики",
    summary: "Титульный лист и таблица ежедневных записей.",
    template_url: null,
    fields: titlePageFieldKeys,
  },
  {
    slug: "practice-title-page",
    title: "Титульный лист дневника",
    summary: "Отдельный лист, если таблицу записей выдаёт кафедра.",
    template_url: null,
    fields: titlePageFieldKeys,
  },
];
