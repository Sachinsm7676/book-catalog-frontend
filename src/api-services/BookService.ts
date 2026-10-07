import { apiClient, toApiError } from "@/utils/api-client";
import { API_ENDPOINTS } from "@/utils/api-integration";
import { ApiError } from "@/types/api";
import type { Book, BookRequest, BooksListParams, PagedResponse } from "@/types/book";

/** The book drawn without a cover in the Figma "Missing cover" frame. */
const MISSING_COVER_DEMO_BOOK_ID = "docker-kubernetes-in-practice";

/** Message of the forced error state; the same wording as a real server failure. */
const DEMO_ERROR_MESSAGE = "We could not load the catalog. Please try again.";

/** Query string for the list endpoint. "All" means no category filter, so it is left out. */
const toListQuery = ({ q, category, sort, page, size }: BooksListParams) => ({
  ...(q ? { q } : {}),
  ...(category !== "All" ? { category } : {}),
  sort,
  page,
  size,
});

/**
 * Book API client: one method per endpoint, each returning the response body or throwing an ApiError.
 * Screens never call this directly; they use the hooks in src/hooks/API/books/.
 */
export const BookService = {
  async getBooksList(params: BooksListParams): Promise<PagedResponse<Book>> {
    // ---- Demo switches for design review (?state=). They answer locally and never reach the API. ----
    if (params.demoState === "loading") {
      return new Promise<PagedResponse<Book>>(() => undefined); // never resolves: the skeleton stays on screen
    }
    if (params.demoState === "error") {
      throw new ApiError({ status: 500, code: "DEMO_ERROR", message: DEMO_ERROR_MESSAGE, fieldErrors: {} });
    }
    if (params.demoState === "empty") {
      return { list: [], pageNumber: 1, size: params.size, totalElements: 0, totalPages: 1 };
    }

    try {
      const { data } = await apiClient.get<PagedResponse<Book>>(API_ENDPOINTS.books.list, {
        params: toListQuery(params),
      });
      if (params.demoState === "missing-cover") {
        return {
          ...data,
          list: data.list.map((book) => (book.id === MISSING_COVER_DEMO_BOOK_ID ? { ...book, coverUrl: null } : book)),
        };
      }
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async getBookDetails(id: string): Promise<Book> {
    try {
      const { data } = await apiClient.get<Book>(API_ENDPOINTS.books.details(id));
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async createBook(request: BookRequest): Promise<Book> {
    try {
      const { data } = await apiClient.post<Book>(API_ENDPOINTS.books.create, request);
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async updateBook(id: string, request: BookRequest): Promise<Book> {
    try {
      const { data } = await apiClient.put<Book>(API_ENDPOINTS.books.update(id), request);
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async deleteBook(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.books.delete(id));
    } catch (error) {
      throw toApiError(error);
    }
  },
};
