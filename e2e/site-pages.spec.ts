import { expect, test } from "@playwright/test";

const PAGES = [
  { link: "Help", url: /\/help$/, title: /Help · DevShelf/, testId: "help-page", section: "Manage books" },
  { link: "License", url: /\/license$/, title: /License · DevShelf/, testId: "license-page", section: "Source code" },
  { link: "Privacy", url: /\/privacy$/, title: /Privacy · DevShelf/, testId: "privacy-page", section: "Your cart stays in your browser" },
] as const;

test.describe("Footer pages", () => {
  for (const target of PAGES) {
    test(`the footer ${target.link} link opens the ${target.link} page`, async ({ page }) => {
      await page.goto("/admin/books/list");
      await page.getByRole("list", { name: "Footer" }).getByRole("link", { name: target.link, exact: true }).click();
      await expect(page).toHaveURL(target.url);
      await expect(page).toHaveTitle(target.title);
      await expect(page.getByTestId(target.testId)).toBeVisible();
      await expect(page.getByRole("heading", { level: 1, name: target.link })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: target.section })).toBeVisible();
    });
  }

  test("the License page links both repositories", async ({ page }) => {
    await page.goto("/license");
    await expect(page.getByRole("link", { name: "book-catalog-frontend on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Sachinsm7676/book-catalog-frontend",
    );
    await expect(page.getByRole("link", { name: "devshelf-api on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Sachinsm7676/devshelf-api",
    );
  });

  test("no footer link is a dead # link", async ({ page }) => {
    await page.goto("/books/list");
    const hrefs = await page.getByRole("list", { name: "Footer" }).getByRole("link").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(hrefs).toEqual(["/admin/books/list", "/help", "/license", "/privacy"]);
  });
});
