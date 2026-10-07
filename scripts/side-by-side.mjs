// Design-left / build-right comparison images for the design review.
//
//   node scripts/side-by-side.mjs
//
// Pairs every PNG in docs/design/figma/ with the build screenshot of the same name in docs/screenshots/
// (e.g. figma/catalog-filled-1440.png + screenshots/catalog-filled-1440.png) and writes
// docs/design/side-by-side/<name>.png. Run `npm run screenshots` first so the build captures exist.
// Uses Playwright's Chromium (already installed for the tests); no extra dependency.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FIGMA_DIR = path.join(ROOT, "docs", "design", "figma");
const BUILD_DIR = path.join(ROOT, "docs", "screenshots");
const OUT_DIR = path.join(ROOT, "docs", "design", "side-by-side");

const toDataUrl = (file) => `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;

const page = (name, design, build) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; padding: 24px; background: #f7f7fc; font: 600 16px/1.4 Inter, system-ui, sans-serif; color: #191a20; }
  h1 { margin: 0 0 16px; font-size: 20px; }
  .row { display: flex; gap: 24px; align-items: flex-start; }
  figure { margin: 0; flex: 1 1 0; min-width: 0; }
  figcaption { margin-bottom: 8px; color: #666874; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; }
  img { display: block; width: 100%; border: 1px solid #e2e3ea; border-radius: 8px; background: #fff; }
</style></head><body>
  <h1>${name}</h1>
  <div class="row">
    <figure><figcaption>Design (Figma)</figcaption><img src="${design}"></figure>
    <figure><figcaption>Build (deployed code)</figcaption><img src="${build}"></figure>
  </div>
</body></html>`;

if (!fs.existsSync(FIGMA_DIR)) {
  console.error(`No Figma exports found. Put the PNGs in ${path.relative(ROOT, FIGMA_DIR)}/ named like the screenshots.`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
let made = 0;
const missing = [];
for (const file of fs.readdirSync(FIGMA_DIR).filter((name) => name.endsWith(".png")).sort()) {
  const build = path.join(BUILD_DIR, file);
  if (!fs.existsSync(build)) {
    missing.push(file);
    continue;
  }
  const name = file.replace(/\.png$/, "");
  await tab.setContent(page(name, toDataUrl(path.join(FIGMA_DIR, file)), toDataUrl(build)));
  await tab.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
  await tab.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
  made += 1;
}
await browser.close();

console.log(`${made} side-by-side image(s) written to ${path.relative(ROOT, OUT_DIR)}/`);
if (missing.length) console.log(`No build screenshot for: ${missing.join(", ")}`);
