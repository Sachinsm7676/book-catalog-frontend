import { CATEGORY_FILTERS, DEFAULT_SORT, DEMO_STATES, PAGE_SIZE, SORT_OPTIONS } from "@/constants/catalog";
import type { BooksListParams, CategoryFilter, DemoState, SortOption } from "@/types/book";

/** Anything with a get() method, such as URLSearchParams or Next's ReadonlyURLSearchParams. */
type ParamsReader = { get(name: string): string | null };

const isCategoryFilter = (value: string | null): value is CategoryFilter =>
  value !== null && (CATEGORY_FILTERS as readonly string[]).includes(value);

const isSortOption = (value: string | null): value is SortOption =>
  value !== null && SORT_OPTIONS.some((option) => option.value === value);

const isDemoState = (value: string | null): value is DemoState =>
  value !== null && (DEMO_STATES as readonly string[]).includes(value);

/** Read the catalog filters from the URL (?q=&category=&sort=&page=&state=). Unknown values fall back to defaults. */
export function parseCatalogParams(searchParams: ParamsReader): BooksListParams {
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = Number.parseInt(searchParams.get("page") ?? "", 10);
  const state = searchParams.get("state");

  return {
    q: (searchParams.get("q") ?? "").trim(),
    category: isCategoryFilter(category) ? category : "All",
    sort: isSortOption(sort) ? sort : DEFAULT_SORT,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    size: PAGE_SIZE,
    demoState: isDemoState(state) ? state : undefined,
  };
}

/** Build the query string for a set of filters. Defaults are left out so URLs stay short. */
export function buildCatalogQuery(params: Partial<BooksListParams>): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.sort && params.sort !== DEFAULT_SORT) query.set("sort", params.sort);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.demoState) query.set("state", params.demoState);

  const text = query.toString();
  return text ? `?${text}` : "";
}
