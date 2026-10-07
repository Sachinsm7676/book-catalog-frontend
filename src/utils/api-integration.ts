import type { BooksListParams } from "@/types/book";

/** Endpoint paths of the DevShelf API (base URL: NEXT_PUBLIC_API_BASE_URL). */
export const API_ENDPOINTS = {
  books: {
    list: "/api/v1/books",
    create: "/api/v1/books",
    details: (id: string) => `/api/v1/books/${encodeURIComponent(id)}`,
    update: (id: string) => `/api/v1/books/${encodeURIComponent(id)}`,
    delete: (id: string) => `/api/v1/books/${encodeURIComponent(id)}`,
  },
} as const;

/**
 * TanStack Query keys, kept in one place so invalidation is predictable:
 * every create, edit and delete invalidates QUERIES.books.all, which refreshes lists and details alike.
 */
export const QUERIES = {
  books: {
    all: ["books"] as const,
    list: (params: BooksListParams) => ["books", "list", params] as const,
    details: (id: string) => ["books", "details", id] as const,
  },
};
