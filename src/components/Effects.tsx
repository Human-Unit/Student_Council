"use client";

import { useEffect } from "react";

/**
 * Page-wide progressive enhancements:
 * - `[data-reveal]` elements fade up once they enter the viewport;
 * - `[data-spotlight]` cards receive the pointer position as CSS variables.
 */
export function Effects() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => revealObserver.observe(element));

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const card = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-spotlight]",
      );
      if (!card) {
        return;
      }
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      revealObserver.disconnect();
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return null;
}
