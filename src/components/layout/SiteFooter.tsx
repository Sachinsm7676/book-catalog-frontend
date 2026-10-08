import Link from "next/link";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import { FOOTER_INFO_LINKS } from "@/constants/site";

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
          <li>
            <Link className="footer-link" href={ADMIN_BOOKS_ROUTES.list}>
              Manage books
            </Link>
          </li>
          {FOOTER_INFO_LINKS.map((link) => (
            <li key={link.href}>
              <Link className="footer-link" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
