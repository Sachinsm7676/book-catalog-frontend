import type { CategoryFilter, DemoState, SortOption } from "@/types/book";

/** Route of the catalog screen (Figma: "Home / Book catalog") */
export const CATALOG_ROUTE = "/books/list";

/** Books per page; the Figma grid shows two rows of four */
export const PAGE_SIZE = 8;

/** Skeleton cards shown while the first page loads: one per slot of a full page */
export const SKELETON_COUNT = PAGE_SIZE;

/** Chips exactly as drawn in Figma. "Databases" is deliberately absent until the designer confirms it (design-check Q6). */
export const CATEGORY_FILTERS: readonly CategoryFilter[] = [
  "All",
  "JavaScript",
  "Java",
  "Python",
  "DevOps",
  "System Design",
  "AI/ML",
];

/** Entries of the sort control, in menu order */
export const SORT_OPTIONS: readonly { label: string; value: SortOption }[] = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Top rated", value: "rating" },
];

/** The frame opens on "Popular" */
export const DEFAULT_SORT: SortOption = "popular";

/** Demo-only switches accepted in ?state= (handled by the mock BookService) */
export const DEMO_STATES: readonly DemoState[] = ["loading", "empty", "error", "missing-cover"];

/** Wait this long after the last keystroke before searching */
export const SEARCH_DEBOUNCE_MS = 300;

/** How long the "Added to cart" toast stays on screen */
export const TOAST_LIFE_MS = 2000;

/** A list fetched this recently is shown again without a skeleton (TanStack Query staleTime) */
export const QUERY_STALE_MS = 60_000;
