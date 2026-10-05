import type { CSSProperties } from "react";
import { directions } from "@/data/site";
import { tie } from "@/lib/typography";
import { Logo } from "./Logo";
import { SectionHeading } from "./SectionHeading";

function DirectionList({ side }: { side: "left" | "right" }) {
  return (
    <ul className={`dir-list dir-list--${side}`}>
      {directions
        .filter((direction) => direction.side === side)
        .map((direction, index) => (
          <li
            className="dir-item"
            key={direction.title}
            data-piece={direction.piece}
            style={{ "--d": index } as CSSProperties}
          >
            <h3>{direction.title}</h3>
            <p>{tie(direction.text)}</p>
          </li>
        ))}
    </ul>
  );
}

export function Directions() {
  return (
    <section
      className="section directions"
      id="directions"
      aria-labelledby="directions-title"
      data-index="02"
      data-theme="blue"
    >
      <div className="directions-super" aria-hidden="true">
        <Logo tone="light" />
      </div>
      <div className="shell">
        <SectionHeading
          tone="blue"
          index="02"
          eyebrow="Направления"
          title="Чем мы занимаемся сейчас"
          titleId="directions-title"
          lead={tie("Пять направлений — одна команда")}
        />
        <div className="dir-stage" data-reveal>
          <DirectionList side="left" />
          <div className="dir-logo">
            <Logo tone="light" shadow="blue" />
          </div>
          <DirectionList side="right" />
        </div>
      </div>
    </section>
  );
}
