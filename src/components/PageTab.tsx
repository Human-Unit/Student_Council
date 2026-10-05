"use client";

import { useEffect, useState } from "react";
import { PageTabShape } from "./BrandShapes";

type TabState = { index: string; theme: string } | null;

/**
 * The brandbook's page tab, pinned to the bottom-right corner: it shows the
 * number of the section underneath it and switches colour with the section.
 */
export function PageTab() {
  const [state, setState] = useState<TabState>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-index], #top"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const { index, theme } = (entry.target as HTMLElement).dataset;
          setState(index ? { index, theme: theme ?? "paper" } : null);
        }
      },
      // A thin band at the height of the tab itself.
      { rootMargin: "-88% 0px -8% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`page-tab page-tab--${state?.theme ?? "paper"}${state ? "" : " is-hidden"}`}
      aria-hidden="true"
    >
      <PageTabShape />
      <span key={state?.index}>{state?.index}</span>
    </div>
  );
}
