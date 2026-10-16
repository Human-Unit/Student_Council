import type { CSSProperties } from "react";
import { contactGroups, navigation, site } from "@/data/site";
import { tie } from "@/lib/typography";
import { navigationHref } from "@/lib/navigation";
import { ArrowIcon } from "./ArrowIcon";
import {
  Emblem,
  InstagramIcon,
  PageTabShape,
  TelegramIcon,
} from "./BrandShapes";
import { DushanbeClock } from "./DushanbeClock";
import { Logo } from "./Logo";

export function Footer({ home = true }: { home?: boolean }) {
  return (
    <footer
      className="site-footer"
      id="contacts"
      aria-labelledby="contacts-title"
      data-index="07"
      data-theme="ink"
    >
      <Logo className="footer-watermark" tone="ink" />

      <div className="shell">
        <div className="footer-top">
          <div className="footer-intro" data-reveal>
            <p className="section-label">
              <span className="section-tab" aria-hidden="true">
                <PageTabShape />
                <span>07</span>
              </span>
              <span>Контакты</span>
            </p>
            <h2 className="footer-title" id="contacts-title">
              Будь на связи
            </h2>
            <p className="footer-note">
              {tie(
                "Новости, анонсы и студенческое сообщество — подписывайся и пиши.",
              )}
            </p>
          </div>

          <div className="contact-groups">
            {contactGroups.map((group, groupIndex) => (
              <div
                className="contact-group"
                key={group.title}
                data-reveal
                style={{ "--d": groupIndex } as CSSProperties}
              >
                <p className="contact-group-title">{group.title}</p>
                <ul>
                  {group.links
                    .filter((link) => link.href)
                    .map((link) => (
                      <li key={link.label}>
                        <a
                          className="contact-row"
                          href={link.href ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="contact-icon">
                            {link.kind === "instagram" ? (
                              <InstagramIcon />
                            ) : (
                              <TelegramIcon />
                            )}
                          </span>
                          <span className="contact-copy">
                            <b>{link.label}</b>
                            <small>{link.note}</small>
                          </span>
                          <span className="contact-arrow">
                            <ArrowIcon direction="up-right" />
                          </span>
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-grid">
          <nav className="footer-col" aria-label="Разделы сайта">
            <p className="footer-col-title">Разделы</p>
            <ul className="footer-links">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={navigationHref(item.href, home)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-col footer-col--branch">
            <p className="footer-col-title">Филиал</p>
            <Emblem className="footer-emblem" />
            <p>{tie(site.branch)}</p>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Сейчас в Душанбе</p>
            <p className="footer-clock">
              <DushanbeClock />
              <span>GMT+5</span>
            </p>
          </div>
          <div className="footer-col footer-col--end">
            <a className="to-top" href="#top">
              <span>Наверх</span>
              <span className="to-top-icon" aria-hidden="true">
                <ArrowIcon direction="up" />
                <ArrowIcon direction="up" />
              </span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <a
            className="footer-brand"
            href="#top"
            aria-label="Студенческий совет — наверх"
          >
            <Logo tone="red" />
            <span>
              Студенческий совет
              <br />
              филиала МГУ в Душанбе
            </span>
          </a>
          <p>© {new Date().getFullYear()} Студенческий совет</p>
        </div>
      </div>
    </footer>
  );
}
