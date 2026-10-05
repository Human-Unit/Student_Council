"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { navigation, site } from "@/data/site";
import { ActionLink } from "./ActionLink";
import { Chevron } from "./BrandShapes";
import { Logo } from "./Logo";

const DESKTOP_QUERY = "(min-width: 1081px)";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 8) {
        // Tuck the header away while reading down, bring it back on scroll up.
        setHidden(y > lastY && y > 560);
        lastY = y;
      }
    };

    const handleScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const targets = ["#top", ...navigation.map((item) => item.href)]
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const href = `#${entry.target.id}`;
            setActiveHref(href === "#top" ? null : href);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const background = [
      document.getElementById("main-content"),
      document.querySelector<HTMLElement>(".site-footer"),
    ];
    background.forEach((element) => {
      if (element) {
        element.inert = menuOpen;
      }
    });

    if (!menuOpen) {
      return;
    }

    firstMenuLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleViewportChange = () => {
      if (desktop.matches) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleViewportChange);

    return () => {
      document.body.classList.remove("menu-open");
      background.forEach((element) => {
        if (element) {
          element.inert = false;
        }
      });
      window.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleViewportChange);
    };
  }, [menuOpen]);

  const headerClassName = [
    "site-header",
    scrolled && "is-scrolled",
    hidden && !menuOpen && "is-hidden",
    menuOpen && "is-menu-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className="header-bar">
        <a
          className="brand"
          href="#top"
          aria-label="Студенческий совет — на главную"
          onClick={() => setMenuOpen(false)}
        >
          <Logo className="brand-logo" />
          <span className="brand-copy">
            <strong>{site.shortName}</strong>
            <small>{site.branchShort}</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? "true" : undefined}
            >
              {item.label}
              <Chevron className="nav-chevron" />
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <ActionLink href="#idea" tone="paper" size="sm">
            Предложить идею
          </ActionLink>
        </div>

        <button
          ref={menuToggleRef}
          className="menu-toggle"
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <Logo className="mobile-menu-logo" tone="light" />
        <nav className="mobile-menu-nav shell" aria-label="Мобильная навигация">
          {navigation.map((item, index) => (
            <a
              ref={index === 0 ? firstMenuLinkRef : undefined}
              key={item.href}
              href={item.href}
              style={{ "--i": index } as CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer shell">
          <div className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>
            <ActionLink href="#idea" tone="paper">
              Предложить идею
            </ActionLink>
          </div>
          <p className="mobile-menu-meta">{site.fullName}</p>
        </div>
      </div>
    </header>
  );
}
