"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { tie } from "@/lib/typography";

export type ScrollTextPart = string | { em: string };

type ScrollTextProps = {
  parts: ScrollTextPart[];
  className?: string;
};

/**
 * Paragraph whose words light up one after another while it scrolls through
 * the viewport. Without JavaScript (or with reduced motion) it renders as
 * plain, fully visible text.
 */
export function ScrollText({ parts, className }: ScrollTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const words = parts.flatMap((part) => {
    const emphasised = typeof part !== "string";
    const text = tie(emphasised ? part.em : part);
    // Split on regular whitespace only: words joined by a no-break space
    // ("и создавать") light up together.
    return text
      .split(/[ \t\n]+/)
      .filter(Boolean)
      .map((word) => ({ word, emphasised }));
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.setProperty("--progress", "1");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top edge enters the lower part of the screen,
      // 1 when the bottom edge reaches the upper third.
      const start = viewport * 0.88;
      const end = viewport * 0.38 - rect.height;
      const progress = (start - rect.top) / (start - end);
      element.style.setProperty(
        "--progress",
        Math.min(1, Math.max(0, progress)).toFixed(4),
      );
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <p
      ref={ref}
      className={`scroll-text${className ? ` ${className}` : ""}`}
      style={{ "--count": words.length } as CSSProperties}
    >
      {words.map(({ word, emphasised }, index) => (
        <Fragment key={index}>
          <span
            className={emphasised ? "scroll-word is-em" : "scroll-word"}
            style={{ "--i": index } as CSSProperties}
          >
            {word}
          </span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
