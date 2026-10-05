import { LOGO_VIEWBOX, logoPieces, type LogoTone } from "@/lib/brand";

type LogoProps = {
  /** Brandbook colourway; can also be overridden with --logo-back/--logo-front. */
  tone?: LogoTone;
  /** Paper-cut drop shadows, tuned to the background the logo sits on. */
  shadow?: "blue" | "dark" | "soft";
  className?: string;
  /** Accessible name; decorative when omitted. */
  title?: string;
};

export function Logo({ tone = "blue", shadow, className, title }: LogoProps) {
  return (
    <svg
      className={`logo logo--${tone}${className ? ` ${className}` : ""}`}
      viewBox={LOGO_VIEWBOX}
      focusable="false"
      {...(title
        ? { role: "img", "aria-label": title }
        : { "aria-hidden": true })}
    >
      {logoPieces.map(({ id, front, d }) => (
        <g
          key={id}
          className={`logo-piece logo-piece--${id}`}
          filter={shadow ? `url(#cut-shadow-${shadow})` : undefined}
        >
          <path className={front ? "logo-front" : "logo-back"} d={d} />
        </g>
      ))}
    </svg>
  );
}
