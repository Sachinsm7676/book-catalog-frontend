import type { BookCategory, SortOption } from "@/types/book";

/** Routes of the manage-books feature (Homework 2). Same shape as the training: list / create / details / edit. */
export const ADMIN_BOOKS_ROUTES = {
  list: "/admin/books/list",
  create: "/admin/books/create",
  details: (id: string) => `/admin/books/details/${encodeURIComponent(id)}`,
  edit: (id: string) => `/admin/books/edit/${encodeURIComponent(id)}`,
} as const;

/** Rows per page on the manage list (the catalog keeps 8, its grid is two rows of four) */
export const ADMIN_PAGE_SIZE = 10;

/** The manage list opens on the most recently changed book, so a save is visible at the top */
export const ADMIN_DEFAULT_SORT: SortOption = "updated";

/** Sort entries of the manage list, in menu order */
export const ADMIN_SORT_OPTIONS: readonly { label: string; value: SortOption }[] = [
  { label: "Recently updated", value: "updated" },
  { label: "Title A–Z", value: "title" },
  { label: "Newest published", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Popular", value: "popular" },
];

/** Every category the API accepts, for the form and the manage filter (the catalog chips omit Databases) */
export const BOOK_CATEGORIES: readonly BookCategory[] = [
  "JavaScript",
  "Java",
  "Python",
  "DevOps",
  "System Design",
  "AI/ML",
  "Databases",
];

/**
 * Field limits. They mirror the backend's BookRequest rules one for one (devshelf-api README, "Validation");
 * change both together.
 */
export const BOOK_LIMITS = {
  titleMin: 2,
  titleMax: 120,
  authorMin: 2,
  authorMax: 80,
  priceMin: 0,
  priceMax: 99_999.99,
  priceDecimals: 2,
  isbnLength: 13,
  descriptionMax: 1000,
  coverUrlMax: 500,
  searchMax: 100,
} as const;

/** Cover URL prefixes the API accepts. /assets/images/ covers are files served by this app. */
export const COVER_URL_PREFIXES = ["http://", "https://", "/assets/images/"] as const;

/**
 * How long a save or delete toast stays on screen. Longer than the 2 s "Added to cart" toast because it starts
 * before the navigation back to the list: at 2 s it could expire while the list was still loading.
 */
export const BOOK_TOAST_LIFE_MS = 5000;

/** Toast wording after a successful write */
export const BOOK_TOASTS = {
  created: "Book added",
  updated: "Changes saved",
  deleted: "Book deleted",
} as const;
