import { MOCK_BOOKS } from "@/mocks/books";
import type { Book, BooksListParams, PagedResponse, SortOption } from "@/types/book";

/** Simulated network latency, so the loading state is real rather than theoretical. */
const MOCK_LATENCY_MS = 800;

/** The book drawn without a cover in the Figma "Missing cover" frame. */
const MISSING_COVER_DEMO_BOOK_ID = "docker-kubernetes-in-practice";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const sorters: Record<SortOption, (a: Book, b: Book) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  "price-asc": (a, b) => a.priceInr - b.priceInr,
  "price-desc": (a, b) => b.priceInr - a.priceInr,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
};

/**
 * Book API client.
 * Homework 1: answers from mock data after a short delay.
 * Homework 2: replace the body of getBooksList with an axios call to API_ENDPOINTS.books.list;
 * the hook (useGetBooksList) and the screen do not change.
 */
export const BookService = {
  async getBooksList(params: BooksListParams): Promise<PagedResponse<Book>> {
    // ---- Demo switches (mock only) ----
    if (params.demoState === "loading") {
      return new Promise<PagedResponse<Book>>(() => undefined); // never resolves: the skeleton stays on screen
    }

    await wait(MOCK_LATENCY_MS);

    if (params.demoState === "error") {
      throw new Error("We could not load the catalog. Please try again.");
    }

    let items: Book[] = params.demoState === "empty" ? [] : [...MOCK_BOOKS];

    if (params.demoState === "missing-cover") {
      items = items.map((book) => (book.id === MISSING_COVER_DEMO_BOOK_ID ? { ...book, coverUrl: null } : book));
    }

    // ---- Search, filter, sort ----
    const needle = params.q.toLowerCase();
    if (needle) {
      items = items.filter((book) =>
        [book.title, book.author, book.category].some((field) => field.toLowerCase().includes(needle)),
      );
    }
    if (params.category !== "All") {
      items = items.filter((book) => book.category === params.category);
    }
    items.sort(sorters[params.sort]);

    // ---- Page ----
    const totalElements = items.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / params.size));
    const pageNumber = Math.min(Math.max(1, params.page), totalPages);
    const start = (pageNumber - 1) * params.size;

    return {
      list: items.slice(start, start + params.size),
      pageNumber,
      size: params.size,
      totalElements,
      totalPages,
    };
  },
};
