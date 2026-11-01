import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { Star } from "@/components/BrandShapes";
import { tie } from "@/lib/typography";

type Breadcrumb = { label: string; href?: string };

export function StudentIntro({
  title,
  lead,
  index = "01",
  eyebrow,
  breadcrumbs,
  children,
}: {
  title: ReactNode;
  lead: string;
  index?: string;
  eyebrow: string;
  breadcrumbs: Breadcrumb[];
  /** Optional content under the heading, e.g. an in-page table of contents. */
  children?: ReactNode;
}) {
  // Narrow screens show one "back" link instead of a wrapping trail.
  const parent = breadcrumbs.findLast((crumb) => crumb.href) ?? {
    label: "Главная",
    href: "/",
  };

  return (
    <section
      className="student-intro"
      id="top"
      data-index={index}
      data-theme="blue"
      aria-labelledby="student-title"
    >
      <div className="shell">
        <nav className="student-breadcrumbs" aria-label="Хлебные крошки">
          <ol>
            <li>
              <Link href="/">Главная</Link>
            </li>
            {breadcrumbs.map((crumb, position) => (
              <li key={position}>
                {crumb.href ? (
                  <a href={crumb.href}>{crumb.label}</a>
                ) : (
                  <span aria-current="page">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
          <a className="student-back" href={parent.href}>
            <ArrowIcon direction="left" />
            {parent.label}
          </a>
        </nav>
        <SectionHeading
          as="h1"
          index={index}
          eyebrow={eyebrow}
          title={title}
          titleId="student-title"
          lead={tie(lead)}
          tone="blue"
        />
        {children}
        <Star className="student-intro-star" />
      </div>
    </section>
  );
}
