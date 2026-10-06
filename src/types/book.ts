/** Book categories shown on the catalog. "Databases" appears on cards but has no filter chip (see docs/design-check.md, Q6). */
export type BookCategory =
  | "JavaScript"
  | "Java"
  | "Python"
  | "DevOps"
  | "System Design"
  | "AI/ML"
  | "Databases";

export type CategoryFilter = BookCategory | "All";

export type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

/** Demo-only switches (?state=...) that force a screen state. The mock service honours them; a real API will not. */
export type DemoState = "loading" | "empty" | "error" | "missing-cover";

/** A book as the catalog displays it. Mirrors the response shape planned for Homework 2's real API. */
export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  priceInr: number;
  rating: number;
  ratingCount: number;
  /** null when the publisher has not supplied cover art yet */
  coverUrl: string | null;
  /** ISO date, used by the "Newest" sort */
  publishedAt: string;
  /** higher = more popular, used by the default sort */
  popularity: number;
}

/** Everything the list endpoint needs. All of it lives in the URL so a filtered view is shareable. */
export interface BooksListParams {
  q: string;
  category: CategoryFilter;
  sort: SortOption;
  /** 1-based */
  page: number;
  size: number;
  demoState?: DemoState;
}

/** Paged list envelope: the same shape the backend will return in Homework 2. */
export interface PagedResponse<T> {
  list: T[];
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
