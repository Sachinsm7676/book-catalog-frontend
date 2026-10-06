"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BookService } from "@/api-services/BookService";
import type { BooksListParams } from "@/types/book";
import { QUERIES } from "@/utils/api-integration";

/**
 * Data hook for the catalog list (TanStack Query). Components call this, never the service directly.
 * While a new page or filter loads, the previous list stays on screen (keepPreviousData) and
 * isFetching tells the grid to dim.
 */
export function useGetBooksList(params: BooksListParams) {
  return useQuery({
    queryKey: QUERIES.books.list(params),
    queryFn: () => BookService.getBooksList(params),
    placeholderData: keepPreviousData,
  });
}
