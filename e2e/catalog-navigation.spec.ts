import { expect, test } from "@playwright/test";
import { PAGE_SIZE } from "../src/constants/catalog";
import { apiCountBooks, booksLabel } from "./helpers";

const ROUTE = "/books/list";

// Behaviours added after the first QA pass: history, URL clean-up, error toolbar, accessible names, 404.
test.describe("Catalog navigation and states", () => {
  test("the back button steps through filter states", async ({ page, request }) => {
    const javaBooks = await apiCountBooks(request, { category: "Java" });
    await page.goto(ROUTE);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await page.getByRole("button", { name: "Java", exact: true }).click();
    await expect(page).toHaveURL(/category=Java/);
    await expect(page.getByText(booksLabel(javaBooks), { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Python", exact: true }).click();
    await expect(page).toHaveURL(/category=Python/);
    await page.goBack();
    await expect(page).toHaveURL(/category=Java/);
    await expect(page.getByText("3 books")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
    await expect(page.getByTestId("book-card")).toHaveCount(8);
  });

  test("a chip clicked right after a keystroke keeps both the search and the category", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await page.getByRole("textbox", { name: "Search books, authors, topics" }).fill("a");
    await page.getByRole("button", { name: "Java", exact: true }).click();
    await expect(page).toHaveURL(/q=a/);
    await expect(page).toHaveURL(/category=Java/);
    await expect(page.getByRole("button", { name: "Java", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("textbox", { name: "Search books, authors, topics" })).toHaveValue("a");
  });

  test("an out-of-range page is clamped on screen and in the URL", async ({ page, request }) => {
    const total = await apiCountBooks(request);
    const lastPage = Math.ceil(total / PAGE_SIZE);
    await page.goto(`${ROUTE}?page=999`);
    await expect(page.getByTestId("book-card")).toHaveCount(total - PAGE_SIZE * (lastPage - 1));
    await expect(page).toHaveURL(new RegExp(`page=${lastPage}$`));
    await expect(page.getByRole("button", { name: `Page ${lastPage}` })).toHaveAttribute("aria-current", "page");
    await page.goto(`${ROUTE}?category=Nope&sort=bogus&page=abc`);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  });

  test("the clicked page is highlighted while its books load", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await page.getByRole("button", { name: "Page 2" }).click();
    await expect(page.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { level: 3, name: "Clean Code in Java: Workbook" })).toBeVisible();
  });

  test("the error state shows no loading placeholder in the results bar", async ({ page }) => {
    await page.goto(`${ROUTE}?state=error`);
    await expect(page.getByTestId("catalog-error")).toBeVisible();
    await expect(page.locator(".results-count-skeleton")).toHaveCount(0);
    await expect(page.locator(".results-count")).toHaveCount(0);
  });

  test("the sort control and the search box have accessible names", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("textbox", { name: "Search books, authors, topics" })).toBeVisible();
    const sortInput = page.locator("#sort-books");
    await expect(sortInput).toHaveCount(1);
    await expect(page.getByLabel("Sort books").first()).toBeAttached();
  });

  test("every book on every page has a cover; the placeholder only appears on demand", async ({ page, request }) => {
    const total = await apiCountBooks(request);
    const lastPage = Math.ceil(total / PAGE_SIZE);
    for (let pageNumber = 1; pageNumber <= lastPage; pageNumber += 1) {
      await page.goto(`${ROUTE}?page=${pageNumber}`);
      await expect(page.getByTestId("book-card")).toHaveCount(Math.min(PAGE_SIZE, total - PAGE_SIZE * (pageNumber - 1)));
      await expect(page.getByTestId("book-cover-missing")).toHaveCount(0);
    }
    await page.goto(`${ROUTE}?state=missing-cover`);
    await expect(page.getByTestId("book-cover-missing")).toHaveCount(1);
  });

  test("an unknown URL shows the branded not-found page with a way back", async ({ page }) => {
    const response = await page.goto("/books/nope");
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found · DevShelf/);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.locator(".site-header")).toBeVisible();
    await page.getByRole("link", { name: "Back to the catalog" }).click();
    await expect(page.getByTestId("book-card")).toHaveCount(8);
  });
});
