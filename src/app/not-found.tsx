import type { Metadata } from "next";
import { ActionLink } from "@/components/ActionLink";
import { BrandDefs } from "@/components/BrandDefs";
import { PageTabShape } from "@/components/BrandShapes";
import { Logo } from "@/components/Logo";
import { tie } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Страница не найдена | Студсовет МГУ Душанбе",
};

export default function NotFound() {
  return (
    <main className="not-found">
      <BrandDefs />
      <div className="not-found-super" aria-hidden="true">
        <Logo className="not-found-super-a" tone="light" shadow="blue" />
        <Logo className="not-found-super-b" tone="light" shadow="blue" />
      </div>
      <div className="not-found-inner shell">
        <p className="section-label">
          <span className="section-tab" aria-hidden="true">
            <PageTabShape />
            <span>404</span>
          </span>
          <span>Страница не найдена</span>
        </p>
        <h1>Такой страницы нет</h1>
        <p>
          {tie(
            "Возможно, ссылка устарела. На главной — всё о Студенческом совете филиала МГУ в Душанбе.",
          )}
        </p>
        <ActionLink href="/" tone="paper">
          На главную
        </ActionLink>
      </div>
    </main>
  );
}
