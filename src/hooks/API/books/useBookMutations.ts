"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookService } from "@/api-services/BookService";
import type { ApiError } from "@/types/api";
import type { Book, BookRequest } from "@/types/book";
import { QUERIES } from "@/utils/api-integration";

/**
 * Create, edit and delete. Each one invalidates every book query on success, so the catalog, the manage list,
 * the details screen and the cart all show the new state without a reload. Mutations are never retried:
 * a retried POST could add the same book twice.
 */

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation<Book, ApiError, BookRequest>({
    mutationFn: (request) => BookService.createBook(request),
    onSuccess: async (book) => {
      queryClient.setQueryData(QUERIES.books.details(book.id), book);
      await queryClient.invalidateQueries({ queryKey: QUERIES.books.all });
    },
  });
}

export function useUpdateBook(id: string) {
  const queryClient = useQueryClient();
  return useMutation<Book, ApiError, BookRequest>({
    mutationFn: (request) => BookService.updateBook(id, request),
    onSuccess: async (book) => {
      queryClient.setQueryData(QUERIES.books.details(book.id), book);
      await queryClient.invalidateQueries({ queryKey: QUERIES.books.all });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (id) => BookService.deleteBook(id),
    onSuccess: async (_, id) => {
      // Drop the details entry first so nothing re-requests a book we know is gone
      queryClient.removeQueries({ queryKey: QUERIES.books.details(id) });
      await queryClient.invalidateQueries({ queryKey: QUERIES.books.all });
    },
  });
}
