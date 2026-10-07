"use client";

import { useQuery } from "@tanstack/react-query";
import { BookService } from "@/api-services/BookService";
import type { ApiError } from "@/types/api";
import type { Book } from "@/types/book";
import { QUERIES } from "@/utils/api-integration";

/** One book for the details and edit screens. A 404 is final (not retried); the screen shows "Book not found". */
export function useGetBookDetails(id: string) {
  return useQuery<Book, ApiError>({
    queryKey: QUERIES.books.details(id),
    queryFn: () => BookService.getBookDetails(id),
  });
}
