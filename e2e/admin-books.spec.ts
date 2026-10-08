import { expect, test } from "@playwright/test";
import { ADMIN, BOOKS_API, EMPTY_PAGE, SEEDED, apiGetBook, failBooksApi, hangBooksApi, stubBooksList } from "./helpers";

// Read-only tests of the manage-books feature (Homework 2). Nothing here creates, changes or deletes data:
// write paths are in admin-books.mutation.spec.ts. Server answers that cannot be produced safely (500, empty
// database, API down) are simulated with page.route.

test.describe("Manage books: list", () => {
  test("page opens with the title, the heading, the count and ten rows", async ({ page }) => {
    await page.goto(`${ADMIN.list}?sort=title`);
    await expect(page).toHaveTitle("Manage books · DevShelf");
    await expect(page.getByRole("heading", { level: 1, name: "Manage books" })).toBeVisible();
    await expect(page.getByTestId("admin-book-row")).toHaveCount(10);
    await expect(page.getByTestId("admin-count")).toHaveText(/^\d+ books in the catalog$/);
    await expect(page.getByTestId("admin-book-row").first()).toContainText("Building Reliable LLM Applications");
    await expect(page.getByRole("link", { name: "Add book" }).first()).toBeVisible();
  });

  test("search matches title, author and ISBN", async ({ page, request }) => {
    await page.goto(ADMIN.list);
    const search = page.getByTestId("admin-search");

    await search.fill("vikram shah");
    await expect(page).toHaveURL(/q=vikram\+shah/);
    await expect(page.getByTestId("admin-book-row")).toHaveCount(3);

    const book = await apiGetBook(request, SEEDED.id);
    expect(book?.isbn, "the seeded book has an ISBN").toBeTruthy();
    await search.fill(book.isbn);
    await expect(page.getByTestId("admin-book-row")).toHaveCount(1);
    await expect(page.getByTestId("admin-book-row")).toContainText(SEEDED.title);
  });

  test("a search with % or _ is taken literally", async ({ page }) => {
    await page.goto(`${ADMIN.list}?q=%25`);
    await expect(page.getByTestId("admin-no-results")).toBeVisible();
  });

  test("category filter narrows the list and is kept in the URL", async ({ page }) => {
    await page.goto(ADMIN.list);
    await page.locator("#admin-category-dropdown").click();
    await page.getByRole("option", { name: "Databases" }).click();
    await expect(page).toHaveURL(/category=Databases/);
    const rows = page.getByTestId("admin-book-row");
    await expect(rows).toHaveCount(3);
    for (const category of await rows.locator('td[data-label="Category"]').allTextContents()) {
      expect(category).toBe("Databases");
    }
  });

  test("sort by price, high to low, puts the most expensive book first", async ({ page }) => {
    await page.goto(ADMIN.list);
    await page.locator("#admin-sort-dropdown").click();
    await page.getByRole("option", { name: "Price: high to low" }).click();
    await expect(page).toHaveURL(/sort=price-desc/);
    await expect(page.getByTestId("admin-book-row").first().locator('td[data-label="Price"]')).toHaveText("₹1,499");
  });

  test("paging moves to the next page and the URL follows", async ({ page }) => {
    await page.goto(`${ADMIN.list}?sort=title`);
    await expect(page.getByTestId("admin-book-row")).toHaveCount(10);
    const firstOnPageOne = await page.getByTestId("admin-book-row").first().textContent();
    await page.getByRole("navigation", { name: "Book list pages" }).getByRole("button", { name: "Page 2" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByTestId("admin-book-row").first()).not.toHaveText(firstOnPageOne ?? "");
  });

  test("an out-of-range page is clamped to the last page", async ({ page }) => {
    await page.goto(`${ADMIN.list}?sort=title&page=99`);
    await expect(page.getByTestId("admin-book-row").first()).toBeVisible();
    await expect(page).not.toHaveURL(/page=99/);
  });

  test("no match shows the no-results state, and Clear filters brings the list back", async ({ page }) => {
    await page.goto(`${ADMIN.list}?q=zzzz-no-such-book&category=Java`);
    await expect(page.getByRole("heading", { name: "No books match your search" })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/admin\/books\/list$/);
    await expect(page.getByTestId("admin-book-row")).toHaveCount(10);
    await expect(page.getByTestId("admin-search")).toHaveValue("");
  });
});

test.describe("Manage books: states", () => {
  test("loading shows placeholder rows", async ({ page }) => {
    await hangBooksApi(page);
    await page.goto(ADMIN.list);
    await expect(page.getByTestId("admin-loading")).toBeVisible();
    await expect(page.getByTestId("admin-count")).toHaveText("Loading books…");
  });

  test("a sort label too long for the phone dropdown ends in an ellipsis", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(ADMIN.list);
    const label = page.locator("#admin-sort-dropdown .p-dropdown-label");
    await expect(label).toHaveText("Recently updated");
    await expect(label).toHaveCSS("text-overflow", "ellipsis");
    await expect(label).toHaveCSS("display", "block");
    const clipped = await label.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(clipped, "the label is wider than its box at 375, so the ellipsis is what the user sees").toBe(true);
  });

  test("on the phone card a short title sits beside its cover, not at the far edge", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(`${ADMIN.list}?sort=title`);
    const row = page.getByTestId("admin-book-row").filter({ has: page.getByRole("link", { name: SEEDED.title, exact: true }) });
    const cell = row.locator("td.cell-book");
    const coverRight = await cell.locator("> :first-child").evaluate((el) => el.getBoundingClientRect().right);
    const textLeft = await cell.locator(".cell-book-text").evaluate((el) => el.getBoundingClientRect().left);
    // The design gap is 12 px; space-between used to push "Clean Code in Java" ~100 px away
    expect(textLeft - coverRight).toBeLessThanOrEqual(16);
  });

  test("an empty database shows No books yet with an Add book action", async ({ page }) => {
    await stubBooksList(page, EMPTY_PAGE);
    await page.goto(ADMIN.list);
    await expect(page.getByRole("heading", { name: "No books yet" })).toBeVisible();
    await expect(page.getByTestId("admin-empty").getByRole("link", { name: "Add book" })).toBeVisible();
  });

  test("API down shows a readable message, and Try again recovers once it is back", async ({ page }) => {
    await failBooksApi(page);
    await page.goto(ADMIN.list);
    await expect(page.getByTestId("admin-error")).toBeVisible();
    await expect(page.getByText(/We could not reach the DevShelf server/)).toBeVisible();

    await page.unroute(BOOKS_API);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByTestId("admin-book-row").first()).toBeVisible();
  });

  test("a server error shows the API's own message", async ({ page }) => {
    await stubBooksList(
      page,
      { status: 500, code: "INTERNAL_ERROR", message: "Something went wrong on our side. Please try again in a moment.", fieldErrors: {} },
      500,
    );
    await page.goto(ADMIN.list);
    await expect(page.getByText("Something went wrong on our side. Please try again in a moment.")).toBeVisible();
  });
});

test.describe("Manage books: details", () => {
  test("a title in the list opens its details, with WM date and number formats", async ({ page, request }) => {
    const book = await apiGetBook(request, SEEDED.id);
    await page.goto(`${ADMIN.list}?q=${encodeURIComponent(SEEDED.title)}`);
    await page.getByRole("link", { name: SEEDED.title, exact: true }).click();

    await expect(page).toHaveURL(ADMIN.details(SEEDED.id));
    await expect(page).toHaveTitle("Book details · DevShelf");
    await expect(page.getByRole("heading", { level: 1, name: SEEDED.title })).toBeVisible();
    const details = page.getByTestId("book-details");
    await expect(details).toContainText(book.category);
    await expect(details).toContainText("₹999");
    await expect(details).toContainText("November 4, 2025");
    await expect(details).toContainText("4.8 out of 5 from 1,284 readers");
  });

  test("an unknown id shows Book not found with the API's message and a way back", async ({ page }) => {
    await page.goto(ADMIN.details("no-such-book-anywhere"));
    await expect(page.getByRole("heading", { level: 1, name: "Book not found" })).toBeVisible();
    await expect(page.getByText("This book does not exist. It may have been deleted.")).toBeVisible();
    await page.getByRole("link", { name: "Back to books" }).last().click();
    await expect(page).toHaveURL(/\/admin\/books\/list/);
  });

  test("Delete asks first, and Cancel keeps the book without calling the API", async ({ page }) => {
    const deletes: string[] = [];
    page.on("request", (req) => {
      if (req.method() === "DELETE") deletes.push(req.url());
    });
    await page.goto(ADMIN.details(SEEDED.id));
    await page.getByTestId("delete-book").click();
    const dialog = page.getByRole("dialog", { name: "Delete this book?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(SEEDED.title);
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { level: 1, name: SEEDED.title })).toBeVisible();
    expect(deletes).toEqual([]);
  });
});

test.describe("Manage books: form validation (nothing is saved)", () => {
  test("submitting an empty form shows every required message and sends nothing", async ({ page }) => {
    const writes: string[] = [];
    page.on("request", (req) => {
      if (["POST", "PUT"].includes(req.method())) writes.push(req.url());
    });
    await page.goto(ADMIN.create);
    await expect(page).toHaveTitle("Add book · DevShelf");
    await page.getByTestId("submit-book").click();

    await expect(page.getByTestId("form-banner")).toHaveText("Please correct the highlighted fields.");
    await expect(page.getByTestId("error-title")).toHaveText("Title is required.");
    await expect(page.getByTestId("error-author")).toHaveText("Author is required.");
    await expect(page.getByTestId("error-category")).toHaveText("Choose a category.");
    await expect(page.getByTestId("error-priceInr")).toHaveText("Price is required.");
    await expect(page.locator("#book-title")).toBeFocused();
    expect(writes).toEqual([]);
  });

  test("the error banner gets its own styles: icon spaced from the text, red-b1 border", async ({ page }) => {
    await page.goto(ADMIN.create);
    await page.getByTestId("submit-book").click();
    const banner = page.getByTestId("form-banner");
    await expect(banner).toHaveCSS("column-gap", "8px");
    await expect(banner).toHaveCSS("border-top-color", "rgb(179, 38, 30)");
    await expect(banner).toHaveCSS("justify-content", "flex-start");
  });

  test("too short, wrong format and future values get the same messages as the API", async ({ page }) => {
    await page.goto(ADMIN.create);
    await page.locator("#book-title").fill("A");
    await page.locator("#book-author").fill("B");
    await page.locator("#book-isbn").fill("978123456789");
    await page.locator("#book-publishedAt").fill("2099-01-01");
    await page.locator("#book-coverUrl").fill("ftp://example.com/cover.jpg");
    await page.locator("#book-description").fill("x".repeat(1001));
    await page.getByTestId("submit-book").click();

    await expect(page.getByTestId("error-title")).toHaveText("Title must be 2 to 120 characters.");
    await expect(page.getByTestId("error-author")).toHaveText("Author must be 2 to 80 characters.");
    await expect(page.getByTestId("error-isbn")).toHaveText("ISBN must be exactly 13 digits.");
    await expect(page.getByTestId("error-publishedAt")).toHaveText("Published date cannot be in the future.");
    await expect(page.getByTestId("error-coverUrl")).toHaveText("Cover URL must start with http://, https:// or /assets/images/.");
    await expect(page.getByTestId("error-description")).toHaveText("Description can be at most 1,000 characters.");
  });

  test("a field's error clears as soon as it is corrected", async ({ page }) => {
    await page.goto(ADMIN.create);
    await page.getByTestId("submit-book").click();
    await expect(page.getByTestId("error-title")).toBeVisible();
    await page.locator("#book-title").fill("Refactoring Notes");
    await expect(page.getByTestId("error-title")).toBeHidden();
  });

  test("an error from the server lands under its field and keeps what was typed", async ({ page }) => {
    // Simulated 409 so this stays read-only; the real duplicate-ISBN round trip is in the mutation spec
    await page.route(BOOKS_API, (route) =>
      route.request().method() === "POST"
        ? route.fulfill({
            status: 409,
            contentType: "application/json",
            body: JSON.stringify({
              status: 409,
              code: "ISBN_TAKEN",
              message: "Please correct the highlighted fields.",
              fieldErrors: { isbn: "Another book already uses this ISBN." },
            }),
          })
        : route.continue(),
    );
    await page.goto(ADMIN.create);
    await page.locator("#book-title").fill("Server Says No");
    await page.locator("#book-author").fill("Test Author");
    await page.locator("#book-category-dropdown").click();
    await page.getByRole("option", { name: "Java", exact: true }).click();
    await page.locator("#book-priceInr").pressSequentially("499");
    await page.locator("#book-isbn").fill("9780000000000");
    await page.getByTestId("submit-book").click();

    await expect(page.getByTestId("error-isbn")).toHaveText("Another book already uses this ISBN.");
    await expect(page.getByTestId("form-banner")).toHaveText("Please correct the highlighted fields.");
    await expect(page.locator("#book-title")).toHaveValue("Server Says No");
    await expect(page.locator("#book-isbn")).toBeFocused();
    await expect(page).toHaveURL(ADMIN.create);
  });

  test("edit opens with the saved values filled in, and Cancel goes back to the details", async ({ page, request }) => {
    const book = await apiGetBook(request, SEEDED.id);
    await page.goto(ADMIN.edit(SEEDED.id));
    await expect(page).toHaveTitle("Edit book · DevShelf");
    await expect(page.locator("#book-title")).toHaveValue(book.title);
    await expect(page.locator("#book-author")).toHaveValue(book.author);
    await expect(page.locator("#book-priceInr")).toHaveValue("999");
    await expect(page.locator("#book-isbn")).toHaveValue(book.isbn ?? "");
    await expect(page.locator("#book-publishedAt")).toHaveValue(book.publishedAt ?? "");
    await page.getByRole("link", { name: "Cancel" }).click();
    await expect(page).toHaveURL(ADMIN.details(SEEDED.id));
  });
});

test.describe("Manage books: navigation", () => {
  test("the header link opens the manage list on desktop", async ({ page }) => {
    await page.goto("/books/list");
    await page.getByRole("banner").getByRole("link", { name: "Manage books" }).click();
    await expect(page).toHaveURL(/\/admin\/books\/list/);
  });

  test("on a phone the footer carries the link instead", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/books/list");
    await expect(page.getByRole("banner").getByRole("link", { name: "Manage books" })).toBeHidden();
    await page.getByRole("contentinfo").getByRole("link", { name: "Manage books" }).click();
    await expect(page).toHaveURL(/\/admin\/books\/list/);
  });
});
