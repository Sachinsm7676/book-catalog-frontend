import { BookCardSkeleton } from "./BookCardSkeleton";
import { SKELETON_COUNT } from "@/constants/catalog";

/** Eight skeleton cards in the same grid as the real list. */
export function BookGridSkeleton() {
  return (
    <div className="book-grid" role="status" aria-label="Loading books" data-testid="book-grid-skeleton">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
