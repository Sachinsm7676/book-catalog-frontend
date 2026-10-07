import { ADMIN_DEFAULT_SORT, ADMIN_PAGE_SIZE, ADMIN_SORT_OPTIONS, BOOK_CATEGORIES, BOOK_LIMITS } from "@/constants/books-admin";
import type { BooksListParams, CategoryFilter, SortOption } from "@/types/book";

type ParamsReader = { get(name: string): string | null };

const isCategoryFilter = (value: string | null): value is CategoryFilter =>
  value === "All" || (value !== null && (BOOK_CATEGORIES as readonly string[]).includes(value));

const isAdminSort = (value: string | null): value is SortOption =>
  value !== null && ADMIN_SORT_OPTIONS.some((option) => option.value === value);

/** Read the manage-list filters from the URL (?q=&category=&sort=&page=). Unknown values fall back to defaults. */
export function parseAdminBooksParams(searchParams: ParamsReader): BooksListParams {
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);

  return {
    q: (searchParams.get("q") ?? "").trim().slice(0, BOOK_LIMITS.searchMax),
    category: isCategoryFilter(category) ? category : "All",
    sort: isAdminSort(sort) ? sort : ADMIN_DEFAULT_SORT,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    size: ADMIN_PAGE_SIZE,
  };
}

/** Query string for a set of manage-list filters; defaults are left out so URLs stay short. */
export function buildAdminBooksQuery(params: BooksListParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category !== "All") query.set("category", params.category);
  if (params.sort !== ADMIN_DEFAULT_SORT) query.set("sort", params.sort);
  if (params.page > 1) query.set("page", String(params.page));
  const text = query.toString();
  return text ? `?${text}` : "";
}
