import { socialLinks } from "@/data/site";
import { ArrowIcon } from "./ArrowIcon";

export function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-kicker">
              <span>06</span> Контакты
            </p>
            <p className="footer-title">Будем на связи.</p>
            <a className="footer-back" href="#top">
              В начало <ArrowIcon />
            </a>
          </div>
          <ul
            className="social-list"
            aria-label="Контакты Студенческого совета"
          >
            {socialLinks.map((link, index) => (
              <li key={link.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {link.href ? (
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <ArrowIcon />
                  </a>
                ) : (
                  <span className="social-placeholder">
                    {link.label} <small>Скоро</small>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-bottom">
          <p>
            Филиал Московского государственного университета имени М. В.
            Ломоносова в городе Душанбе
          </p>
          <p>Студенческий совет · {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
