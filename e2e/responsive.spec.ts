import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { CART_STORAGE_KEY } from "../src/constants/cart";

// WM | HTML development guideline: media query breakpoints to check
const WIDTHS = [1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375];
// The four widths the training marks as mandatory; secondary states are captured at these only
const KEY_WIDTHS = [1920, 1366, 768, 375];
const VIEWPORT_HEIGHT = 1000;

interface ScreenState {
  /** screenshot name: <screen>-<state>-<width>.png */
  name: string;
  url: string;
  /** captured at every WM width (true) or only at the key widths */
  everyWidth: boolean;
  /** runs before navigation, e.g. to seed storage */
  prepare?: (page: Page) => Promise<void>;
  ready: (page: Page) => Promise<void>;
}

const emptyCart = async (page: Page) => {
  await page.addInitScript(
    ([key]) => window.localStorage.setItem(key, JSON.stringify({ bookIds: [], discountCode: null })),
    [CART_STORAGE_KEY],
  );
};

const STATES: ScreenState[] = [
  { name: "catalog-filled", url: "/books/list", everyWidth: true, ready: (page) => expect(page.getByTestId("book-card")).toHaveCount(8) },
  { name: "catalog-loading", url: "/books/list?state=loading", everyWidth: false, ready: (page) => expect(page.getByTestId("book-card-skeleton")).toHaveCount(8) },
  { name: "catalog-empty", url: "/books/list?state=empty", everyWidth: false, ready: (page) => expect(page.getByTestId("catalog-empty")).toBeVisible() },
  { name: "catalog-missing-cover", url: "/books/list?state=missing-cover", everyWidth: false, ready: (page) => expect(page.getByTestId("book-cover-missing")).toHaveCount(1) },
  { name: "cart-filled", url: "/cart", everyWidth: true, ready: (page) => expect(page.getByTestId("cart-item")).toHaveCount(2) },
  { name: "cart-empty", url: "/cart", everyWidth: false, prepare: emptyCart, ready: (page) => expect(page.getByTestId("cart-empty")).toBeVisible() },
];

const OUT_DIR = path.join(process.cwd(), "docs", "screenshots");

test.beforeAll(() => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
});

// Scroll through the page so lazy-loaded covers are fetched before the full-page screenshot
async function loadWholePage(page: Page) {
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  await page.evaluate(() => document.fonts.ready);
}

// Any element whose box pokes out of the viewport on the right is a sideways-scroll bug even if the page clips it
async function widestOverflow(page: Page) {
  return page.evaluate(() => {
    const limit = document.documentElement.clientWidth;
    let worst = { tag: "", right: limit };
    for (const element of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      if (element.tagName === "NEXTJS-PORTAL") continue;
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.right > worst.right + 1) worst = { tag: `${element.tagName}.${element.className}`, right: rect.right };
    }
    return worst;
  });
}

for (const width of WIDTHS) {
  for (const state of STATES) {
    if (!state.everyWidth && !KEY_WIDTHS.includes(width)) continue;

    test(`${state.name} @ ${width}px: no sideways scroll, screenshot saved`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      if (state.prepare) await state.prepare(page);
      await page.goto(state.url);
      await state.ready(page);
      await loadWholePage(page);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `page is ${scrollWidth}px wide in a ${clientWidth}px viewport`).toBeLessThanOrEqual(clientWidth);
      const overflow = await widestOverflow(page);
      expect(overflow.right, `${overflow.tag} reaches ${overflow.right}px in a ${clientWidth}px viewport`).toBeLessThanOrEqual(clientWidth + 1);

      // Hide the Next.js dev-tools badge: it is not part of the page
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.screenshot({ path: path.join(OUT_DIR, `${state.name}-${width}.png`), fullPage: true, animations: "disabled" });
    });
  }
}
