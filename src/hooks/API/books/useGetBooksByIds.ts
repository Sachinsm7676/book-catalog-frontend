"use client";

import { useQueries } from "@tanstack/react-query";
import { BookService } from "@/api-services/BookService";
import type { ApiError } from "@/types/api";
import type { Book } from "@/types/book";
import { isNotFoundError } from "@/utils/api-client";
import { QUERIES } from "@/utils/api-integration";

interface BooksByIdsResult {
  /** Books that still exist, in the order of the ids */
  books: Book[];
  /** Ids the API answered 404 for: deleted since they were stored */
  missingIds: string[];
  isPending: boolean;
  /** First failure that is not a 404 (API down, server error) */
  error: ApiError | null;
  refetch: () => void;
}

/**
 * Resolve stored book ids (the cart) against the API, one cached details request per id, so a book opened
 * on the details screen is not fetched twice. Deleted books are reported, not thrown.
 */
export function useGetBooksByIds(ids: readonly string[]): BooksByIdsResult {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: QUERIES.books.details(id),
      queryFn: () => BookService.getBookDetails(id),
    })),
    combine: (results) => {
      const books: Book[] = [];
      const missingIds: string[] = [];
      let error: ApiError | null = null;
      results.forEach((result, index) => {
        if (result.data) books.push(result.data);
        else if (result.error && isNotFoundError(result.error)) missingIds.push(ids[index]);
        else if (result.error && !error) error = result.error as ApiError;
      });
      return {
        books,
        missingIds,
        isPending: results.some((result) => result.isPending),
        error,
        refetch: () => results.forEach((result) => void result.refetch()),
      };
    },
  });
}
