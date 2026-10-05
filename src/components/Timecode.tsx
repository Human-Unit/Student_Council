"use client";

import { useEffect, useRef } from "react";

const FPS = 25;

/** Running HH:MM:SS:FF timecode for the camera viewfinder; idle off-screen. */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const digits = Array.from(element.querySelectorAll("i"));
    const start = performance.now();
    let frame = 0;
    let visible = false;
    let last = "";

    const tick = (now: number) => {
      frame = 0;
      if (!visible) {
        return;
      }
      const seconds = (now - start) / 1000;
      const value = [
        Math.floor(seconds / 3600),
        Math.floor(seconds / 60) % 60,
        Math.floor(seconds) % 60,
        Math.floor(seconds * FPS) % FPS,
      ]
        .map((part) => String(part).padStart(2, "0"))
        .join("");
      if (value !== last) {
        digits.forEach((digit, index) => {
          if (digit.textContent !== value[index]) {
            digit.textContent = value[index];
          }
        });
        last = value;
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span className="timecode" ref={ref} aria-hidden="true">
      {[0, 1, 2, 3].map((group) => (
        <span key={group}>
          {group > 0 && <b>:</b>}
          <i>0</i>
          <i>0</i>
        </span>
      ))}
    </span>
  );
}
