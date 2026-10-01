import { socialLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="shell">
        <div className="footer-top">
          <p className="footer-title">Будем на связи.</p>
          <ul
            className="social-list"
            aria-label="Контакты Студенческого совета"
          >
            {socialLinks.map((link, index) => (
              <li key={link.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {link.href ? (
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <span className="social-placeholder">
                    {link.label} <small>скоро</small>
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
