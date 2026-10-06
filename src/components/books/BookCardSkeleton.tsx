import { Skeleton } from "primereact/skeleton";

/** Lines of the card skeleton, top to bottom, as drawn in the Figma "Loading" frame. */
const SKELETON_LINES = [
  { name: "category", accent: true },
  { name: "title", accent: false },
  { name: "title-end", accent: false },
  { name: "author", accent: false },
  { name: "price", accent: true },
  { name: "action", accent: false },
] as const;

/**
 * Loading placeholder matching the Figma "Loading" frame: cover, five lines, action.
 * Sizes live on wrapper elements, not on the Skeleton: PrimeReact Skeleton always writes an inline
 * width, which beats responsive SCSS (that bug showed up as sideways scroll at 375px).
 */
export function BookCardSkeleton() {
  return (
    <div className="book-card-skeleton" data-testid="book-card-skeleton" aria-hidden="true">
      <div className="skeleton-cover">
        <Skeleton width="100%" height="100%" />
      </div>
      <div className="skeleton-info">
        {SKELETON_LINES.map((line) => (
          <span key={line.name} className={`skeleton-line skeleton-line-${line.name}`}>
            <Skeleton width="100%" height="100%" className={line.accent ? "skeleton-accent" : undefined} />
          </span>
        ))}
      </div>
    </div>
  );
}
