import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
  testId?: string;
  /** h2 inside a page that already has an h1 (catalog); h1 when the block is the page (404) */
  titleAs?: "h1" | "h2";
}

/** Centered message block: used for "no results", load errors and the not-found page. */
export function EmptyState({ icon, title, text, action, testId, titleAs: Title = "h2" }: EmptyStateProps) {
  return (
    <section className="empty-state" role="status" data-testid={testId}>
      <div className="empty-state-icon">{icon}</div>
      <Title className="empty-state-title">{title}</Title>
      <p className="empty-state-text">{text}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  );
}
