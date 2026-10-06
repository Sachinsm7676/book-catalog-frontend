import { defineConfig, devices } from "@playwright/test";

// Test your local code by default. Set PLAYWRIGHT_BASE_URL to point the suite at a deployed build.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    // Freeze the skeleton shimmer and transitions so screenshots are byte-identical between runs
    reducedMotion: "reduce",
    // The dev server compiles a page on its first visit, which can take a while (see CLAUDE.md "Known traps").
    navigationTimeout: 60_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000/books/list",
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
