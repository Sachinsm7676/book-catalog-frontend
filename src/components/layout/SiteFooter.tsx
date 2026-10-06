// Footer destinations are outside Homework 1; the links are placeholders (listed in README "Not covered").
const FOOTER_LINKS = ["Help", "License", "Privacy"] as const;

/** Site footer: brand and tagline on the left, secondary links on the right. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="footer-brand">
          <p className="footer-brand-name">DevShelf</p>
          <p className="footer-tagline">Practical books for better software.</p>
        </div>
        <ul className="footer-links" aria-label="Footer">
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <a className="footer-link" href="#">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
