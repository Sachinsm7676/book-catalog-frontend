/** Book categories, exactly as the API spells them. "Databases" has no catalog chip (see docs/design-check.md, Q6). */
export type BookCategory =
  | "JavaScript"
  | "Java"
  | "Python"
  | "DevOps"
  | "System Design"
  | "AI/ML"
  | "Databases";

export type CategoryFilter = BookCategory | "All";

/** Sort keys the API accepts. The catalog offers the first five; the manage list also offers "title" and "updated". */
export type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating" | "title" | "updated";

/** Demo-only switches (?state=...) that force a catalog state for design review. BookService answers them without calling the API. */
export type DemoState = "loading" | "empty" | "error" | "missing-cover";

/** A book as GET /api/v1/books/{id} returns it. */
export interface Book {
  /** Slug made by the server from the title on create; never changes */
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  /** Rupees, up to 2 decimals */
  priceInr: number;
  /** 13 digits, or null */
  isbn: string | null;
  /** YYYY-MM-DD, or null when unknown */
  publishedAt: string | null;
  description: string | null;
  /** Absolute URL, a /assets/images/ path served by this app, or null when there is no cover art */
  coverUrl: string | null;
  /** Read-only on the API: set by reviews, 0 for a new book */
  rating: number;
  ratingCount: number;
  /** Read-only on the API: higher = more popular, used by the default sort */
  popularity: number;
  /** ISO instants */
  createdAt: string;
  updatedAt: string;
}

/** Body of POST /api/v1/books and PUT /api/v1/books/{id}: the editable fields only. */
export interface BookRequest {
  title: string;
  author: string;
  category: BookCategory | null;
  priceInr: number | null;
  isbn: string | null;
  publishedAt: string | null;
  description: string | null;
  coverUrl: string | null;
}

/** Fields of the create/edit form, keyed like the request so API field errors land on the right input. */
export type BookField = keyof BookRequest;

/** Query of GET /api/v1/books. All of it lives in the URL so a filtered view is shareable. */
export interface BooksListParams {
  q: string;
  category: CategoryFilter;
  sort: SortOption;
  /** 1-based */
  page: number;
  size: number;
  demoState?: DemoState;
}

/** Paged list envelope returned by GET /api/v1/books. */
export interface PagedResponse<T> {
  list: T[];
  pageNumber: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
