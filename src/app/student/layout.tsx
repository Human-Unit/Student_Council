import type { ReactNode } from "react";
import { BrandDefs } from "@/components/BrandDefs";
import { Effects } from "@/components/Effects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageTab } from "@/components/PageTab";
import "@/styles/student.css";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BrandDefs />
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <Header home={false} />
      <main id="main-content" className="student-main" tabIndex={-1}>
        {children}
      </main>
      <Footer home={false} />
      <PageTab />
      <Effects />
    </>
  );
}
