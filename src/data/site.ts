/*
 * Editable site content. Texts and links come from the Student Council
 * presentation; update them here and the whole page follows.
 */

import type { LogoPieceId } from "@/lib/brand";

export type NavigationItem = {
  label: string;
  href: `#${string}` | `/${string}`;
};

export const site = {
  name: "Студенческий совет",
  shortName: "Студсовет",
  fullName: "Студенческий совет филиала МГУ в Душанбе",
  // \xa0 — no-break spaces keep the initials with the surname.
  branch: "Филиал МГУ имени М.\xa0В.\xa0Ломоносова в городе Душанбе",
  branchShort: "Филиал МГУ · Душанбе",
  tagline: "Создаём проекты, события и возможности для студентов",
  timeZone: "Asia/Dushanbe",
};

/** Every external link on the page. `null` hides the link until it exists. */
export const links: Record<
  | "councilInstagram"
  | "branchInstagram"
  | "branchTelegram"
  | "community"
  | "studentChat"
  | "iposLead"
  | "formIpos"
  | "formKmts"
  | "formOsps",
  string | null
> = {
  councilInstagram: "https://www.instagram.com/ds.msu.sc/",
  branchInstagram: "https://www.instagram.com/msu.tj_official/",
  branchTelegram: "https://t.me/msutj_official",
  community: "https://t.me/msu_community_dushanbe/1/27",
  studentChat: "https://t.me/+F5r3-lcqFGphYTli",
  iposLead: "https://t.me/DIOADAND",
  formIpos:
    "https://docs.google.com/forms/d/e/1FAIpQLSfrCCKdKJIrOj7HR08T-nQ4QvbLtL9dmrXXtlyqrEQHduMw3Q/viewform",
  formKmts:
    "https://docs.google.com/forms/d/e/1FAIpQLSdkTsqlvir4j0trH_BqnUUxf1zQpJfWSaq6A4QhgZxydAkm4g/viewform",
  formOsps:
    "https://docs.google.com/forms/d/e/1FAIpQLScnY9Xshi4_Q-EtBeSUDnHmr9OizVY5mz9HtFFLUmxXn10DHA/viewform",
};

/** Ideas and questions go to the council's Instagram direct messages. */
export const ideaUrl = links.councilInstagram;
export const ideaHandle = "@ds.msu.sc";

export const navigation: NavigationItem[] = [
  { label: "О нас", href: "#about" },
  { label: "Секторы", href: "#sectors" },
  { label: "Участие", href: "#join" },
  { label: "Студенту", href: "/student" },
  { label: "Контакты", href: "#contacts" },
];

export const roles = [
  { title: "Организуем", text: "Праздники, конкурсы и встречи в филиале" },
  { title: "Поддерживаем", text: "Идеи и инициативы самих студентов" },
  { title: "Связываем", text: "Студентов и администрацию университета" },
];

/** Each direction points at its own piece of the logo, as in the council's slides. */
export const directions: {
  title: string;
  text: string;
  side: "left" | "right";
  piece: LogoPieceId;
}[] = [
  {
    title: "Медиа и контент",
    text: "Reels, фото, интервью, новости",
    side: "left",
    piece: "left",
  },
  {
    title: "Мероприятия",
    text: "Праздники, конкурсы и встречи",
    side: "left",
    piece: "band",
  },
  {
    title: "Цифровые проекты",
    text: "Сайт и приложение расписания",
    side: "right",
    piece: "right",
  },
  {
    title: "Студенческие инициативы",
    text: "Помогаем превратить идею в проект",
    side: "right",
    piece: "tower",
  },
  {
    title: "Обратная связь",
    text: "Слышим студентов и доносим их голос",
    side: "right",
    piece: "base",
  },
];

export type SectorId = "ipos" | "kmts" | "osps";

export type Sector = {
  id: SectorId;
  short: string;
  name: string;
  title: string;
  text: string;
  tags: string[];
  form: string | null;
  /** One-line summary next to the freshman form. */
  focus: string;
  lead?: { role: string; name: string; handle: string; href: string | null };
};

export const sectors: Sector[] = [
  {
    id: "ipos",
    short: "ИПОС",
    name: "Информационно-правовой общественный сектор",
    title: "Работаем как небольшая creative studio",
    text: "Команда студентов, которая показывает жизнь университета изнутри: снимаем видео, делаем фотографии, создаём дизайн, пишем тексты и рассказываем о том, что происходит в филиале.",
    tags: [
      "Reels",
      "Съёмки",
      "Интервью",
      "Дизайн",
      "Сценарии",
      "Фото",
      "Инфопроекты",
    ],
    form: links.formIpos,
    focus: "Медиа: видео, фото, дизайн, тексты",
    lead: {
      role: "Глава ИПОС",
      name: "Махмудов Дилшод Джамшедович",
      handle: "@DIOADAND",
      href: links.iposLead,
    },
  },
  {
    id: "kmts",
    short: "КМТС",
    name: "Культурно-массовый творческий сектор",
    title: "События, ради которых остаются после пар",
    text: "Команда, которая создаёт события и атмосферу студенческой жизни — от идеи и подготовки до самого вечера.",
    tags: [
      "Праздники",
      "Тематические вечера",
      "Конкурсы",
      "Выставки",
      "Выступления",
      "Традиции",
    ],
    form: links.formKmts,
    focus: "События: праздники, вечера, конкурсы",
  },
  {
    id: "osps",
    short: "ОСПС",
    name: "Образовательный социально-правовой сектор",
    title: "Учимся друг у друга — за пределами пар",
    text: "Создаём пространство, где студенты учатся друг у друга и получают знания за пределами обычных пар.",
    tags: ["Кружки", "Встречи со специалистами", "Форумы и конференции"],
    form: links.formOsps,
    focus: "Знания: кружки, встречи, форумы",
  },
];

export const benefits = [
  { title: "Практика", text: "Реальные задачи вместо учебных кейсов" },
  { title: "Портфолио", text: "Проекты, которые можно показать" },
  { title: "Команда", text: "Учишься договариваться и делать вместе" },
  { title: "Организация", text: "От идеи до готового события" },
  { title: "Свой проект", text: "Можно запустить собственную инициативу" },
  { title: "Знакомства", text: "Люди с разных курсов и направлений" },
];

export const participationSteps = [
  {
    title: "Помощь на мероприятии",
    tag: "Один вечер",
    text: "Встретить гостей, помочь с организацией, почувствовать атмосферу",
  },
  {
    title: "Съёмка, дизайн, тексты",
    tag: "Одна задача",
    text: "Снять ролик, сделать афишу или написать пост",
  },
  {
    title: "Участие в проекте",
    tag: "На время проекта",
    text: "Работаешь в команде над задачей — от идеи до результата",
  },
  {
    title: "Работа в секторе",
    tag: "Постоянно",
    text: "Становишься частью команды и ведёшь свои задачи",
  },
  {
    title: "Своя инициатива",
    tag: "Ты ведёшь проект",
    text: "Предлагаешь идею, собираешь команду, а Совет помогает запустить",
  },
];

export const plans = [
  {
    title: "Цифровое",
    items: ["Развиваем сайт Студсовета", "Продвигаем приложение расписания"],
  },
  {
    title: "Медиа",
    items: ["Делаем Instagram интереснее", "Запускаем новые медиа-проекты"],
  },
  {
    title: "Сообщество",
    items: [
      "Проводим новые мероприятия",
      "Запускаем систему предложений от студентов",
    ],
  },
];

export type ContactLink = {
  label: string;
  note: string;
  href: string | null;
  kind: "instagram" | "telegram";
};

export const contactGroups: { title: string; links: ContactLink[] }[] = [
  {
    title: "Студенческий совет",
    links: [
      {
        label: "Instagram Студсовета",
        note: "@ds.msu.sc — пиши в директ",
        href: links.councilInstagram,
        kind: "instagram",
      },
    ],
  },
  {
    title: "Студенческое сообщество",
    links: [
      {
        label: "Чат для студентов",
        note: "Telegram-чат",
        href: links.studentChat,
        kind: "telegram",
      },
      {
        label: "Сообщество МГУ",
        note: "Telegram-сообщество",
        href: links.community,
        kind: "telegram",
      },
    ],
  },
  {
    title: "Официальные каналы филиала",
    links: [
      {
        label: "Канал МГУ",
        note: "@msutj_official",
        href: links.branchTelegram,
        kind: "telegram",
      },
      {
        label: "Instagram филиала",
        note: "@msu.tj_official",
        href: links.branchInstagram,
        kind: "instagram",
      },
    ],
  },
];

export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public (e.g. "/team/ivanova.jpg") or an absolute URL. Initials are shown when omitted. */
  photo?: string;
  contactUrl?: string;
};

// TODO(content): add verified team members; the section appears once filled.
export const teamMembers: TeamMember[] = [];
