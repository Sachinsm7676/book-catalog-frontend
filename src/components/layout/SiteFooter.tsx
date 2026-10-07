import Link from "next/link";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";

// Help, License and Privacy are outside the homework; those links are placeholders (README "Not covered").
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
          <li>
            <Link className="footer-link" href={ADMIN_BOOKS_ROUTES.list}>
              Manage books
            </Link>
          </li>
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
