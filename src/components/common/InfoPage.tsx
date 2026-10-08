import type { ReactNode } from "react";
import { PageHeading } from "@/components/common/PageHeading";

export interface InfoSection {
  heading: string;
  body: ReactNode;
}

interface InfoPageProps {
  title: string;
  subtitle: string;
  sections: readonly InfoSection[];
  testId: string;
}

/** Text page reached from the footer (Help, License, Privacy): heading, then titled sections. */
export function InfoPage({ title, subtitle, sections, testId }: InfoPageProps) {
  return (
    <div className="admin-page admin-page-narrow info-page" data-testid={testId}>
      <PageHeading title={title} subtitle={subtitle} />
      {sections.map((section) => (
        <section key={section.heading} className="info-section" aria-label={section.heading}>
          <h2 className="info-section-title">{section.heading}</h2>
          <div className="info-section-body">{section.body}</div>
        </section>
      ))}
    </div>
  );
}
