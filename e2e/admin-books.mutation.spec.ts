import { expect, test, type Page } from "@playwright/test";
import { ADMIN, API_URL, SEEDED, apiDeleteBook, apiGetBook, apiDeleteTestBooks, pickDate } from "./helpers";

// Create / edit / delete against the real API (npm run test:e2e:mutation). Every book is created by the test
// itself with a unique title and removed in afterEach, so the seeded 24 are never touched.

const created = new Set<string>();

test.afterEach(async ({ request }) => {
  for (const id of created) await apiDeleteBook(request, id);
  created.clear();
  // Safety net: anything titled "E2E …" that a failed run left behind (e.g. a second copy with a "-2" id)
  await apiDeleteTestBooks(request);
});

const uniqueTitle = (label: string) => `E2E ${label} ${Date.now()}`;

/** Slug the API makes from a title (lowercase, non-alphanumerics → "-") */
const slugOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function fillBookForm(page: Page, values: { title: string; author: string; category: string; price: string; isbn?: string }) {
  await page.locator("#book-title").fill(values.title);
  await page.locator("#book-author").fill(values.author);
  await page.locator("#book-category-dropdown").click();
  await page.getByRole("option", { name: values.category, exact: true }).click();
  await page.locator("#book-priceInr").pressSequentially(values.price);
  if (values.isbn !== undefined) await page.locator("#book-isbn").fill(values.isbn);
}

test("create → appears in the list and the catalog → edit → change shows → delete → gone", async ({ page }) => {
  const title = uniqueTitle("Refactoring Field Notes");
  const id = slugOf(title);
  created.add(id);

  // Create
  await page.goto(ADMIN.create);
  await fillBookForm(page, { title, author: "Test Author", category: "Java", price: "1249.5" });
  await pickDate(page, "2026-01-15");
  await page.locator("#book-description").fill("Written by the Playwright mutation test.");
  await page.getByTestId("submit-book").click();

  await expect(page).toHaveURL(/\/admin\/books\/list$/);
  await expect(page.getByText("Book added")).toBeVisible();
  // The list opens on "Recently updated", so the new book is first
  const firstRow = page.getByTestId("admin-book-row").first();
  await expect(firstRow).toContainText(title);
  await expect(firstRow.locator('td[data-label="Price"]')).toHaveText("₹1,249.50");
  await expect(firstRow.locator('td[data-label="Published"]')).toHaveText("Jan 15, 2026");

  // It is in the customer catalog too
  await page.goto(`/books/list?q=${encodeURIComponent(title)}`);
  await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
  await expect(page.getByText("No ratings yet")).toBeVisible();

  // Details → Edit
  await page.goto(ADMIN.details(id));
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  await expect(page.getByTestId("book-details")).toContainText("January 15, 2026");
  await page.getByTestId("edit-book").click();
  await expect(page).toHaveURL(ADMIN.edit(id));
  const newTitle = `${title} (2nd edition)`;
  await page.locator("#book-title").fill(newTitle);
  await page.locator("#book-priceInr").click();
  await page.locator("#book-priceInr").press("Control+A");
  await page.locator("#book-priceInr").pressSequentially("1999");
  await page.getByTestId("submit-book").click();

  await expect(page).toHaveURL(/\/admin\/books\/list$/);
  await expect(page.getByText("Changes saved")).toBeVisible();
  await expect(firstRow).toContainText(newTitle);
  await expect(firstRow.locator('td[data-label="Price"]')).toHaveText("₹1,999");

  // The id (slug) does not change on edit
  await firstRow.getByRole("link", { name: newTitle, exact: true }).click();
  await expect(page).toHaveURL(ADMIN.details(id));

  // Delete from the list
  await page.goto(`${ADMIN.list}?q=${encodeURIComponent(newTitle)}`);
  await page.getByRole("button", { name: `Delete ${newTitle}` }).click();
  await page.getByTestId("confirm-delete").click();
  await expect(page.getByText("Book deleted")).toBeVisible();
  await expect(page.getByTestId("admin-no-results")).toBeVisible();

  // Gone for good
  await page.goto(ADMIN.details(id));
  await expect(page.getByRole("heading", { level: 1, name: "Book not found" })).toBeVisible();
  created.delete(id);
});

test("a duplicate ISBN is refused by the server; the message is under ISBN and nothing is lost", async ({ page, request }) => {
  const seeded = await apiGetBook(request, SEEDED.id);
  expect(seeded?.isbn, "the seeded book has an ISBN").toBeTruthy();
  const title = uniqueTitle("Duplicate ISBN");
  created.add(slugOf(title)); // in case the server wrongly accepts it

  await page.goto(ADMIN.create);
  await fillBookForm(page, { title, author: "Test Author", category: "Python", price: "699", isbn: seeded.isbn });
  await page.getByTestId("submit-book").click();

  await expect(page.getByTestId("error-isbn")).toHaveText("Another book already uses this ISBN.");
  await expect(page.getByTestId("form-banner")).toHaveText("Please correct the highlighted fields.");
  await expect(page.locator("#book-title")).toHaveValue(title);
  await expect(page).toHaveURL(ADMIN.create);
  expect(await apiGetBook(request, slugOf(title))).toBeNull();
});

test("double-clicking Add book creates the book once", async ({ page, request }) => {
  const title = uniqueTitle("Double Click");
  const id = slugOf(title);
  created.add(id);
  const posts: string[] = [];
  page.on("request", (req) => {
    if (req.method() === "POST" && req.url().startsWith(API_URL)) posts.push(req.url());
  });

  await page.goto(ADMIN.create);
  await fillBookForm(page, { title, author: "Test Author", category: "DevOps", price: "299" });
  await page.getByTestId("submit-book").dblclick();

  await expect(page).toHaveURL(/\/admin\/books\/list$/);
  expect(posts).toHaveLength(1);
  const response = await request.get(`${API_URL}/api/v1/books`, { params: { q: title } });
  expect((await response.json()).totalElements).toBe(1);
});

test("deleting from the details screen returns to the list, and the book leaves the cart", async ({ page, request }) => {
  const title = uniqueTitle("Cart Removal");
  const id = slugOf(title);
  created.add(id);
  const response = await request.post(`${API_URL}/api/v1/books`, {
    data: { title, author: "Test Author", category: "AI/ML", priceInr: 450 },
  });
  expect(response.status()).toBe(201);

  // Put it in the cart from the catalog
  await page.goto(`/books/list?q=${encodeURIComponent(title)}`);
  await page.getByRole("button", { name: `Add ${title} to cart` }).click();
  await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();

  // Delete it from its details screen
  await page.goto(ADMIN.details(id));
  await page.getByTestId("delete-book").click();
  await page.getByTestId("confirm-delete").click();
  await expect(page).toHaveURL(/\/admin\/books\/list/);
  await expect(page.getByText("Book deleted")).toBeVisible();
  created.delete(id);

  // The cart no longer lists it
  await page.goto("/cart");
  await expect(page.getByTestId("cart-item")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();
});
