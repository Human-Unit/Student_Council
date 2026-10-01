import { About } from "@/components/About";
import { Feedback } from "@/components/Feedback";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Feedback />
        <Team />
      </main>
      <Footer />
    </>
  );
}
