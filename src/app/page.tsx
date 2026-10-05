import { About } from "@/components/About";
import { BrandDefs } from "@/components/BrandDefs";
import { Directions } from "@/components/Directions";
import { Effects } from "@/components/Effects";
import { Feedback } from "@/components/Feedback";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Join } from "@/components/Join";
import { PageTab } from "@/components/PageTab";
import { Sectors } from "@/components/Sectors";
import { Team } from "@/components/Team";
import { Ticker } from "@/components/Ticker";

export default function Home() {
  return (
    <>
      <BrandDefs />
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Ticker />
        <About />
        <Directions />
        <Sectors />
        <Join />
        <Team />
        <Feedback />
      </main>
      <Footer />
      <PageTab />
      <Effects />
    </>
  );
}
