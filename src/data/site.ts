export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

export type Project = {
  title: string;
  description: string;
  cta: string;
  href: string | null;
  eyebrow: string;
};

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  contactUrl?: string;
};

export type SocialLink = {
  label: string;
  href: string | null;
};

// TODO(brand): set to "/brand/student-council-logo.svg" (or another approved
// public/brand asset) when the official logo is supplied.
export const brandLogoSrc: string | null = null;

export const navigation: NavigationItem[] = [
  { label: "О Студсовете", href: "#about" },
  { label: "Проекты", href: "#projects" },
  { label: "Команда", href: "#team" },
  { label: "Предложить идею", href: "#feedback" },
  { label: "Контакты", href: "#contacts" },
];

export const projects: Project[] = [
  {
    eyebrow: "Учёба",
    title: "Расписание",
    description: "Студенческий проект для удобной проверки расписания.",
    cta: "Подробнее",
    href: null,
  },
  {
    eyebrow: "Медиа",
    title: "СМИ",
    description:
      "Видео, фотографии, интервью и информационные проекты Студенческого совета.",
    cta: "Instagram",
    href: null,
  },
  {
    eyebrow: "Связь",
    title: "Студсовет Online",
    description:
      "Пространство для информации, студенческих инициатив и обратной связи.",
    cta: "Предложить идею",
    href: "#feedback",
  },
];

// TODO(content): add the real Google Form URL when it is provided.
export const feedbackUrl: string | null = null;

// TODO(content): replace with verified team data and real photos.
export const teamMembers: TeamMember[] = [];

// TODO(content): add verified Student Council contact URLs.
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: null },
  { label: "Telegram", href: null },
  { label: "Email", href: null },
];
