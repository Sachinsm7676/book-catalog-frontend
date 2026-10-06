import type { BooksListParams } from "@/types/book";

/**
 * Endpoint paths. Homework 1 answers from BookService's mock, so nothing calls these yet.
 * TODO(HW2): point BookService at API_ENDPOINTS.books.list and add the create/update/delete paths.
 */
export const API_ENDPOINTS = {
  books: {
    list: "/api/v1/books",
  },
} as const;

/**
 * TanStack Query keys, kept in one place so invalidation after create/edit/delete is predictable.
 * TODO(HW2): mutations invalidate QUERIES.books.all after a successful write.
 */
export const QUERIES = {
  books: {
    all: ["books"] as const,
    list: (params: BooksListParams) => ["books", "list", params] as const,
  },
};
