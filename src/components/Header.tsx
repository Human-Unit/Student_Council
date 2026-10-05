"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brandLogoSrc, navigation } from "@/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    if (!menuOpen) {
      return () => document.body.classList.remove("menu-open");
    }

    firstMenuLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1180) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
    >
      <div className="header-inner shell">
        <a
          className="brand"
          href="#top"
          aria-label="Студенческий совет — на главную"
        >
          {brandLogoSrc ? (
            <Image
              className="brand-logo"
              src={brandLogoSrc}
              width={44}
              height={44}
              alt=""
              aria-hidden="true"
            />
          ) : (
            <span className="brand-mark" aria-hidden="true">
              СС
            </span>
          )}
          <span className="brand-copy">
            <strong>Студсовет</strong>
            <small>Филиал МГУ · Душанбе</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#feedback">
          Предложить идею
        </a>

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
        <nav className="shell" aria-label="Мобильная навигация">
          {navigation.map((item, index) => (
            <a
              ref={index === 0 ? firstMenuLinkRef : undefined}
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
