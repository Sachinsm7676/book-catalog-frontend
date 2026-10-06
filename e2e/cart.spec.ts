import { expect, test, type Page } from "@playwright/test";

const CART = "/cart";
const CATALOG = "/books/list";

// The two seeded books: 999 + 1,299 = 2,298 · 18% tax 414 · total 2,712 (the Figma frame's numbers)
const SEEDED = { subtotal: "₹2,298", tax: "₹414", total: "₹2,712" };

async function expectTotals(page: Page, totals: { subtotal: string; tax: string; total: string }) {
  await expect(page.getByTestId("summary-subtotal")).toHaveText(totals.subtotal);
  await expect(page.getByTestId("summary-tax")).toHaveText(totals.tax);
  await expect(page.getByTestId("summary-total")).toHaveText(totals.total);
}

test.describe("Cart", () => {
  test("opens with the two seeded books and the designed totals", async ({ page }) => {
    await page.goto(CART);
    await expect(page).toHaveTitle(/Your cart · DevShelf/);
    await expect(page.getByRole("heading", { level: 1, name: "Your cart" })).toBeVisible();
    await expect(page.getByTestId("cart-subtitle")).toHaveText("2 digital books in your cart");
    await expect(page.getByTestId("cart-item")).toHaveCount(2);
    await expect(page.getByRole("heading", { level: 2, name: "Clean Code in Java" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Mastering React 19" })).toBeVisible();
    await expect(page.getByText("PDF · EPUB").first()).toBeVisible();
    await expectTotals(page, SEEDED);
    await expect(page.getByRole("link", { name: "Cart, 2 items" })).toHaveAttribute("aria-current", "page");
  });

  test("removing a book updates the subtitle, the totals and the header count", async ({ page }) => {
    await page.goto(CART);
    await page.getByRole("button", { name: "Remove Clean Code in Java from cart" }).click();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
    await expect(page.getByTestId("cart-subtitle")).toHaveText("1 digital book in your cart");
    await expectTotals(page, { subtotal: "₹1,299", tax: "₹234", total: "₹1,533" });
    await expect(page.getByRole("link", { name: "Cart, 1 items" })).toBeVisible();
  });

  test("removing every book shows the empty state, and Browse books returns to the catalog", async ({ page }) => {
    await page.goto(CART);
    await page.getByRole("button", { name: "Remove Clean Code in Java from cart" }).click();
    await page.getByRole("button", { name: "Remove Mastering React 19 from cart" }).click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
    await expect(page.getByTestId("cart-subtitle")).toHaveText("Ready when you are.");
    await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
    await page.getByRole("link", { name: "Browse books" }).click();
    await expect(page).toHaveURL(new RegExp(`${CATALOG}$`));
    await expect(page.getByTestId("book-card")).toHaveCount(8);
  });

  test("adding from the catalog puts the book in the cart once; a second add says so", async ({ page }) => {
    await page.goto(CATALOG);
    await page.getByRole("button", { name: "Add System Design Interview Handbook to cart" }).click();
    await expect(page.getByText("Added to cart")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();
    await page.getByRole("button", { name: "Add System Design Interview Handbook to cart" }).click();
    await expect(page.getByText("Already in your cart")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart, 3 items" })).toBeVisible();
    await page.getByRole("link", { name: "Cart, 3 items" }).click();
    await expect(page).toHaveURL(new RegExp(`${CART}$`));
    await expect(page.getByTestId("cart-item")).toHaveCount(3);
    await expect(page.getByRole("heading", { level: 2, name: "System Design Interview Handbook" })).toBeVisible();
  });

  test("DEV10 applies a 10% discount and recomputes tax and total", async ({ page }) => {
    await page.goto(CART);
    await expect(page.getByLabel("Discount code")).toHaveValue("DEV10");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByTestId("summary-discount")).toContainText("Discount (DEV10)");
    await expect(page.getByTestId("summary-discount")).toContainText("−₹230");
    await expectTotals(page, { subtotal: "₹2,298", tax: "₹372", total: "₹2,440" });
    await expect(page.getByText("DEV10 applied · 10% off")).toBeVisible();
    await expect(page.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  test("an unknown or empty code shows the error pattern and changes nothing", async ({ page }) => {
    await page.goto(CART);
    const field = page.getByLabel("Discount code");
    await field.fill("NOPE");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("This code is not valid")).toBeVisible();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expectTotals(page, SEEDED);
    await field.fill("   ");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByText("Enter a discount code")).toBeVisible();
    await field.fill(" dev10 ");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByTestId("summary-discount")).toContainText("Discount (DEV10)");
  });

  test("Proceed to checkout explains that checkout is Homework 2", async ({ page }) => {
    await page.goto(CART);
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
    await expect(page.getByText("Checkout opens in Homework 2")).toBeVisible();
  });

  test("the cart survives a reload and does not reseed", async ({ page }) => {
    await page.goto(CART);
    await page.getByRole("button", { name: "Remove Clean Code in Java from cart" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByTestId("summary-discount")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
    await expect(page.getByTestId("summary-discount")).toBeVisible();
    await page.getByRole("button", { name: "Remove Mastering React 19 from cart" }).click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });
});
