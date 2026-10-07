import { Skeleton } from "primereact/skeleton";
import { ADMIN_PAGE_SIZE } from "@/constants/books-admin";

/** Loading state of the manage list: the table shape with one placeholder row per slot of a full page. */
export function AdminBooksTableSkeleton() {
  return (
    <div className="admin-table-wrap" role="status" aria-label="Loading books" data-testid="admin-loading">
      <ul className="admin-skeleton-list">
        {Array.from({ length: ADMIN_PAGE_SIZE }, (_, index) => (
          <li key={index} className="admin-skeleton-row" aria-hidden="true">
            <span className="skeleton-thumb">
              <Skeleton width="100%" height="100%" />
            </span>
            <span className="skeleton-row-text">
              <span className="skeleton-line skeleton-line-title-end">
                <Skeleton width="100%" height="100%" className="skeleton-accent" />
              </span>
              <span className="skeleton-line skeleton-line-author">
                <Skeleton width="100%" height="100%" />
              </span>
            </span>
            <span className="skeleton-line skeleton-line-price">
              <Skeleton width="100%" height="100%" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
