import type { ReactNode } from "react";
import { ArrowIcon } from "./ArrowIcon";

export type ActionTone =
  "blue" | "paper" | "ink" | "red" | "ghost" | "kmts" | "osps";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  tone?: ActionTone;
  size?: "md" | "sm";
  download?: boolean;
  label?: string;
};

export function ActionLink({
  href,
  children,
  tone = "blue",
  size = "md",
  download = false,
  label,
}: ActionLinkProps) {
  const external = /^https?:\/\//.test(href);
  const direction = download ? "down" : external ? "up-right" : "right";

  return (
    <a
      className={`btn btn--${tone}${size === "sm" ? " btn--sm" : ""}`}
      href={href}
      download={download || undefined}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="btn-label">{children}</span>
      <span className="btn-icon" aria-hidden="true">
        <ArrowIcon direction={direction} />
        <ArrowIcon direction={direction} />
      </span>
    </a>
  );
}
