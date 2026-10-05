import {
  CHEVRON_PATH,
  CHEVRON_VIEWBOX,
  STAR_PATH,
  STAR_VIEWBOX,
  TAB_PATH,
  TAB_VIEWBOX,
} from "@/lib/brand";

type ShapeProps = {
  className?: string;
};

/** Four-point sparkle used across Student Council covers. */
export function Star({ className }: ShapeProps) {
  return (
    <svg
      className={className}
      viewBox={STAR_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );
}

/** Roof chevron bullet. */
export function Chevron({ className }: ShapeProps) {
  return (
    <svg
      className={`chevron${className ? ` ${className}` : ""}`}
      viewBox={CHEVRON_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={CHEVRON_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
      />
    </svg>
  );
}

/** Pentagon page tab from the brandbook, carrying a section number. */
export function PageTabShape({ className }: ShapeProps) {
  return (
    <svg
      className={className}
      viewBox={TAB_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <path d={TAB_PATH} fill="currentColor" />
    </svg>
  );
}

/** Official branch emblem, recoloured through a CSS mask. */
export function Emblem({ className }: ShapeProps) {
  return (
    <span
      className={`emblem${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="Эмблема филиала МГУ в Душанбе"
    />
  );
}

export function InstagramIcon({ className }: ShapeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function TelegramIcon({ className }: ShapeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21.4 3.6 2.9 10.7c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.6-2.5 4.7 3.4c.7.5 1.7.1 1.9-.8l3-14.5c.2-.9-.8-1.7-1.6-1.4zM9.6 14.3l8.7-7.6-6.8 9.1-.3 2.8z"
        fill="currentColor"
      />
    </svg>
  );
}
