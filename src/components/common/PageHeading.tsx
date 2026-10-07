import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/common/Icon";

interface PageHeadingProps {
  title: string;
  subtitle?: ReactNode;
  /** "← Back to books" style link above the title */
  back?: { href: string; label: string };
  /** buttons on the right (stacked under the title on the phone layout) */
  actions?: ReactNode;
}

/** Shared heading of the manage-books screens: optional back link, h1, subtitle, actions. */
export function PageHeading({ title, subtitle, back, actions }: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div className="page-heading-text">
        {back ? (
          <Link href={back.href} className="back-link">
            <Icon name="chevron-left-grey" size="sm" />
            <span>{back.label}</span>
          </Link>
        ) : null}
        <h1 className="page-heading-title">{title}</h1>
        {subtitle ? <p className="page-heading-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-heading-actions">{actions}</div> : null}
    </header>
  );
}
