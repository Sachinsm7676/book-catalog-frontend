import type { APIRequestContext, Page } from "@playwright/test";

/** Where the API runs for the tests; the same default as NEXT_PUBLIC_API_BASE_URL in .env.example */
export const API_URL = process.env.E2E_API_URL ?? "http://localhost:8080";

/** Matches every request to the books endpoints, list and details, whatever the API host is */
export const BOOKS_API = /\/api\/v1\/books(\/|\?|$)/;

export const ADMIN = {
  list: "/admin/books/list",
  create: "/admin/books/create",
  details: (id: string) => `/admin/books/details/${id}`,
  edit: (id: string) => `/admin/books/edit/${id}`,
};

/** A seeded book the read-only tests can rely on (never edited or deleted by the mutation tests) */
export const SEEDED = {
  id: "clean-code-in-java",
  title: "Clean Code in Java",
  author: "Ananya Rao",
};

/** Read one book straight from the API (to compare the screen with the source of truth) */
export async function apiGetBook(request: APIRequestContext, id: string) {
  const response = await request.get(`${API_URL}/api/v1/books/${id}`);
  return response.ok() ? response.json() : null;
}

/** Remove a book the test created, ignoring "already gone" */
export async function apiDeleteBook(request: APIRequestContext, id: string) {
  await request.delete(`${API_URL}/api/v1/books/${id}`);
}

/** Remove every book whose title starts with "E2E " (what the mutation tests create) */
export async function apiDeleteTestBooks(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/api/v1/books`, { params: { q: "E2E ", size: 50 } });
  if (!response.ok()) return;
  const { list } = (await response.json()) as { list: { id: string; title: string }[] };
  for (const book of list.filter((item) => item.title.startsWith("E2E "))) await apiDeleteBook(request, book.id);
}

/** Every list request answers with this body instead of reaching the API */
export async function stubBooksList(page: Page, body: unknown, status = 200) {
  await page.route(BOOKS_API, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) })
      : route.continue(),
  );
}

/** The API "goes down": every books request fails at the network level */
export async function failBooksApi(page: Page) {
  await page.route(BOOKS_API, (route) => route.abort("connectionrefused"));
}

/** The API never answers, so the loading state stays on screen */
export async function hangBooksApi(page: Page) {
  await page.route(BOOKS_API, () => undefined);
}

export const EMPTY_PAGE = { list: [], pageNumber: 1, size: 10, totalElements: 0, totalPages: 1 };
