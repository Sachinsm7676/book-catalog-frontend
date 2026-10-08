import { expect, test } from "@playwright/test";
import { PAGE_SIZE } from "../src/constants/catalog";
import { apiCountBooks, booksLabel } from "./helpers";

const ROUTE = "/books/list";

test.describe("Book catalog", () => {
  test("page opens with the title, the hero and eight books", async ({ page, request }) => {
    const total = await apiCountBooks(request);
    await page.goto(ROUTE);
    await expect(page).toHaveTitle(/Book catalog · DevShelf/);
    await expect(page.getByRole("heading", { level: 1, name: "Books for developers, by developers" })).toBeVisible();
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await expect(page.getByText(booksLabel(total), { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Clean Code in Java" })).toBeVisible();
  });

  test("price and Add to cart line up across every row, even when one title wraps to two lines", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    // Sorted by rating, the first row mixes one- and two-line titles (the case reported in review)
    await page.goto(`${ROUTE}?sort=rating`);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    const rows = await page.getByTestId("book-card").evaluateAll((cards) => {
      const byRow = new Map<number, number[]>();
      for (const card of cards) {
        const top = Math.round(card.getBoundingClientRect().top);
        const button = card.querySelector(".book-action");
        if (!button) continue;
        byRow.set(top, [...(byRow.get(top) ?? []), button.getBoundingClientRect().top]);
      }
      return [...byRow.values()];
    });
    expect(rows.length, "two rows of four at 1440").toBe(2);
    for (const buttonTops of rows) {
      expect(Math.max(...buttonTops) - Math.min(...buttonTops), `button tops ${buttonTops.join(", ")}`).toBeLessThanOrEqual(1);
    }
  });

  test("loading state shows eight skeleton cards and no books", async ({ page }) => {
    await page.goto(`${ROUTE}?state=loading`);
    await expect(page.getByTestId("book-card-skeleton")).toHaveCount(8);
    await expect(page.getByTestId("book-card")).toHaveCount(0);
  });

  test("empty state appears for a search with no matches, and Clear filters restores the list", async ({ page }) => {
    await page.goto(`${ROUTE}?q=zzzz-no-such-book`);
    await expect(page.getByTestId("catalog-empty")).toBeVisible();
    await expect(page.getByRole("heading", { name: "No books found" })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/books\/list$/);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
  });

  test("category chip filters the list and updates the URL", async ({ page, request }) => {
    const javaBooks = await apiCountBooks(request, { category: "Java" });
    await page.goto(ROUTE);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await page.getByRole("button", { name: "Java", exact: true }).click();
    await expect(page).toHaveURL(/category=Java/);
    await expect(page.getByText(booksLabel(javaBooks), { exact: true })).toBeVisible();
    const categories = await page.locator(".book-category").allTextContents();
    expect(categories.length).toBe(Math.min(javaBooks, PAGE_SIZE));
    expect(categories.every((category) => category === "Java")).toBe(true);
  });

  test("search box filters by title after the debounce", async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByRole("textbox", { name: "Search books, authors, topics" }).fill("postgres");
    await expect(page).toHaveURL(/q=postgres/);
    await expect(page.getByTestId("book-card")).toHaveCount(2);
  });

  test("pagination moves to page 2 and back", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId("book-card")).toHaveCount(8);
    await page.getByRole("button", { name: "Page 2" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole("heading", { level: 3, name: "Clean Code in Java: Workbook" })).toBeVisible();
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page).toHaveURL(/\/books\/list$/);
  });

  test("missing cover shows the designed placeholder", async ({ page }) => {
    await page.goto(`${ROUTE}?state=missing-cover`);
    await expect(page.getByTestId("book-cover-missing")).toHaveCount(1);
    await expect(page.getByText("Cover unavailable")).toBeVisible();
  });

  test("error state shows the API message and a retry action", async ({ page }) => {
    await page.goto(`${ROUTE}?state=error`);
    await expect(page.getByTestId("catalog-error")).toBeVisible();
    await expect(page.getByText("We could not load the catalog. Please try again.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("add to cart updates the header count", async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByRole("link", { name: "Cart, 2 items" })).toBeVisible();
    // Clean Code in Java is already in the seeded cart, so add a book that is not
    await page.getByRole("button", { name: "Add Python for Data Engineers to cart" }).click();
    await expect(page.getByText("Added to cart")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();
  });
});
