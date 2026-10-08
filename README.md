# DevShelf — Manage books (Homework 2) on the Catalog and Cart (Homework 1)

**TL | AI Frontend Training — Homework 2: a full feature (list, create, details, edit, delete) on a real API I built,
with test cases, Playwright tests and a QA build report.** Submitted by Sachin S M · Reviewer: Vaishali

| | |
|---|---|
| Demo (frontend) | [book-catalog-frontend-rouge.vercel.app/admin/books/list](https://book-catalog-frontend-rouge.vercel.app/admin/books/list) — the Manage books screens (Vercel, production) |
| Demo (API) | [devshelf-api.onrender.com/api/v1/books](https://devshelf-api.onrender.com/api/v1/books) · [Swagger UI](https://devshelf-api.onrender.com/swagger-ui/index.html) (Render, free plan) |
| Frontend repo | [github.com/Sachinsm7676/book-catalog-frontend](https://github.com/Sachinsm7676/book-catalog-frontend) · branch `main` |
| Backend repo | [github.com/Sachinsm7676/devshelf-api](https://github.com/Sachinsm7676/devshelf-api) · branch `main` (Spring Boot 3.5, Java 21, PostgreSQL, Flyway) |
| Design | [Figma — DevShelf](https://www.figma.com/design/GmMGwepcgacGOKSFaf5elg/Untitled?node-id=0-1): page 1 = Homework 1 frames, page "HW2 — Manage books" = Homework 2 frames (1440 / 768 / 375, loading / empty / errors) |
| Test cases | [docs/test-cases.md](docs/test-cases.md) — WM QA Template format, every area of the Step 7 table |
| Playwright HTML report | [book-catalog-frontend-rouge.vercel.app/qa/playwright-report/](https://book-catalog-frontend-rouge.vercel.app/qa/playwright-report/index.html) — the run against the deployed site (read-only + mutation projects), kept in [public/qa/playwright-report/](public/qa/playwright-report/) |
| QA build report | [docs/qa-build-report-hw2.md](docs/qa-build-report-hw2.md) — the 10 parts from Step 8 |
| Design check | [docs/design-check-hw2.md](docs/design-check-hw2.md) — 13 designer questions with the answers used |
| Design vs build | [docs/design/side-by-side/](docs/design/side-by-side/) (Figma left, deployed build right) · Figma exports in [docs/design/figma/](docs/design/figma/) |
| Screenshots | [docs/screenshots/](docs/screenshots/) — every screen and state at the WM widths plus 1440 |

> **The API is on Render's free plan, which sleeps after about 15 minutes without traffic, and a cold start takes a
> few minutes.** A scheduled GitHub Actions job in the API repo ([`keep-warm.yml`](https://github.com/Sachinsm7676/devshelf-api/blob/main/.github/workflows/keep-warm.yml)) pings it every 5 minutes so it stays
> awake. If it ever is asleep, the page shows "We could not load the books" after 70 s; wait a minute and press *Try again*.

## What I built (Homework 2)

**Entity:** a book (title, author, category, price in ₹, ISBN-13, published date, description, cover URL), the same books
the Homework 1 catalog sells. The catalog and cart now read them from the API; the mock data is gone.

| Route | Screen | States |
|---|---|---|
| `/admin/books/list` | Manage list: search (title, author or ISBN), category filter, sort, 10 per page; table on desktop, cards on a phone | filled · loading (10 skeleton rows) · no books yet · no match (*Clear filters*) · error (API message + *Try again*) |
| `/admin/books/create` | Add book form | empty · field errors + banner · saving (*Adding…*, button disabled) · server error under its field |
| `/admin/books/details/[id]` | Everything stored about one book, with *Edit book* and *Delete* | filled · loading · *Book not found* · error |
| `/admin/books/edit/[id]` | Same form, filled with the saved values | as Add book |
| Delete dialog | from the list and from the details | ask · deleting (buttons disabled) · failure shown inside the dialog |

- **Validation matches the backend word for word**: the same rules, limits and 16 messages as `devshelf-api`
  (`BookMessages.java`), checked in the browser first and again by the API. A server-only error such as a duplicate ISBN
  ("Another book already uses this ISBN.") lands under its field, focus moves there, and nothing typed is lost.
- **No double submit, no double delete:** the button is disabled while the request runs; mutations are never retried.
- **After every save:** a toast ("Book added" / "Changes saved" / "Book deleted", 5 s so it survives the navigation),
  back to the list, and the list, details, catalog and cart all refresh by themselves (TanStack Query invalidation).
  A deleted book also leaves every cart.
- **Filters live in the URL** (`?q=&category=&sort=&page=`), so a view can be shared and the back button works.
- **"Manage books" link:** in the header from 768 px up; in the footer below that (no room beside the cart on a phone —
  design question Q2).
- **Published on** is a calendar (PrimeReact, in the DevShelf tokens): pick-only so a date cannot be mistyped, future days
  disabled, *Today* / *Clear*. It replaced the browser's date picker, which flickered when opening in Edge on Windows.
- **Footer pages:** *Help* (how to use the site), *License* (a demo, sample data, links to both repos) and *Privacy*
  (no sign-in or tracking; the cart stays in the browser; added books are public) at `/help`, `/license`, `/privacy`.
- **Catalog cards line up:** price and *Add to cart* sit at the bottom of each card, level across a row even when a
  title wraps to two lines.

**Data layer (service + hook, no API call in a component):** endpoint paths in `src/utils/api-integration.ts`
→ axios calls in `src/api-services/BookService.ts` (`src/utils/api-client.ts` holds the axios instance, the 70 s timeout and
the API error shape) → TanStack Query hooks in `src/hooks/API/books/` (`useGetBooksList`, `useGetBookDetails`,
`useGetBooksByIds`, `useBookMutations`) → screens.

**Backend (`devshelf-api`):** `GET /api/v1/books` (search, category, sort, page, size), `GET /{id}`, `POST`, `PUT /{id}`,
`DELETE /{id}`; Spring Boot 3.5, Java 21, PostgreSQL with Flyway (table + 24 seeded books), field validation in
`BookRequestValidator` (one message per field, in form order), one error shape (`status`, `code`, `message`, `fieldErrors`), CORS limited to the frontend origin,
Swagger UI. 90 JUnit tests. Deployed with the Render Blueprint in its repo (`render.yaml`).

One real response (`GET https://devshelf-api.onrender.com/api/v1/books/clean-code-in-java`):

```json
{"id":"clean-code-in-java","title":"Clean Code in Java","author":"Ananya Rao","category":"Java","priceInr":999.00,
 "isbn":"9789350000014","publishedAt":"2025-11-04","description":"Write Java that your teammates can read on the first pass: …",
 "coverUrl":"/assets/images/book-cover-clean-code-in-java.jpg","rating":4.8,"ratingCount":1284,"popularity":100,
 "createdAt":"…Z","updatedAt":"…Z"}
```

## How to run it (backend, then frontend)

Requires Java 21 and Node 20+. PostgreSQL either from Docker or an existing install.

```bash
# 1. Backend — https://github.com/Sachinsm7676/devshelf-api
git clone https://github.com/Sachinsm7676/devshelf-api.git
cd devshelf-api
docker compose up -d              # PostgreSQL 16 on 5432 (or see its README for an existing PostgreSQL)
./mvnw spring-boot:run            # Windows: .\mvnw.cmd spring-boot:run → http://localhost:8080 (Flyway seeds 24 books)
./mvnw test                       # 90 tests, in-memory H2

# 2. Frontend — this repo
git clone https://github.com/Sachinsm7676/book-catalog-frontend.git
cd book-catalog-frontend
npm install
npx playwright install chromium   # once, for the tests
cp .env.example .env.local        # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 (the default)
npm run dev                       # http://localhost:3000/admin/books/list
npm run check                     # lint + type-check + build (stop `npm run dev` first: both use .next/)
npm run test:e2e                  # read-only tests (needs the API running)
npm run test:e2e:mutation         # create / edit / delete tests (local API only; they delete what they create)
npm run screenshots               # responsive sweep → docs/screenshots/
node scripts/side-by-side.mjs     # Figma exports + screenshots → docs/design/side-by-side/
```

To run the read-only tests against the deployed site:
`PLAYWRIGHT_BASE_URL=https://book-catalog-frontend-rouge.vercel.app E2E_API_URL=https://devshelf-api.onrender.com npm run test:e2e`.

**Deploy:** API on Render from `render.yaml` (one free web service + one free PostgreSQL; set `CORS_ALLOWED_ORIGINS` to the
Vercel origin). Frontend on Vercel with `NEXT_PUBLIC_API_BASE_URL` = the Render URL — `NEXT_PUBLIC_*` values are baked in at
build time, so change it in Vercel and redeploy.

## Check results (Homework 2)

Run on 8 Oct 2026 on this machine (Windows 11, Node 24, Chromium via Playwright 1.63), local API on PostgreSQL.

```
> npm run check                     # lint → type-check → build
eslint                              0 problems
tsc --noEmit                        exit 0
next build                          ✓ Compiled successfully · ✓ Generating static pages (4/4)
                                    ƒ /admin/books/list 4.48 kB · ƒ /admin/books/create 609 B · ƒ /admin/books/details/[id] 7.03 kB
                                    ƒ /admin/books/edit/[id] 2.69 kB · ƒ /books/list 5.37 kB · ƒ /cart 9.5 kB
                                    ƒ /help · ƒ /license · ƒ /privacy (footer pages)

> npm run test:e2e                  # read-only, local
Running 182 tests using 1 worker
182 passed (4.5m)
  e2e/admin-books.spec.ts          26  page opens · search / category / sort / paging / no match · loading / empty / error states ·
                                       details · not found · form rules and messages · server error under its field ·
                                       edit pre-filled · header and footer links · phone card title · sort ellipsis · banner styles · date calendar
  e2e/book-catalog.spec.ts         10  catalog on the API (Homework 1 regression) + cards line up across a row
  e2e/site-pages.spec.ts            5  footer Help / License / Privacy pages, no dead footer links
  e2e/catalog-navigation.spec.ts    8
  e2e/cart.spec.ts                  8  incl. a deleted book leaving the cart
  e2e/responsive.spec.ts          125  every screen and state at 1920 … 375 (+1440): no sideways scroll, screenshot saved

> npm run test:e2e:mutation        # create / edit / delete, local API
Running 4 tests using 1 worker
4 passed (14.5s)
  create → list → details → edit → delete (main flow) · duplicate ISBN from the server · double-click creates one book ·
  delete from details removes it from the list and the cart

> devshelf-api: ./mvnw test
Tests run: 90, Failures: 0, Errors: 0, Skipped: 0
  BookCrudApiTest 14 · BookListApiTest 23 · BookValidationApiTest 34 · BookServiceTest 3 · SlugGeneratorTest 11 ·
  DatabaseUrlEnvironmentPostProcessorTest 3 · KeepAwakePingerTest 2
```

**Against the deployed site** (app code as deployed from `8e730c1`, API on Render), 8 Oct 2026 12:27–12:33 IST. Both projects in one run,
so the HTML report covers read-only and create/edit/delete together; one retry allowed, so a live-API hiccup shows as
"flaky" instead of failing the run:

```
> PLAYWRIGHT_BASE_URL=https://book-catalog-frontend-rouge.vercel.app E2E_API_URL=https://devshelf-api.onrender.com
> npx playwright test --project=chromium --project=mutation --retries=1 --reporter=line,html
Running 186 tests using 1 worker
185 passed · 1 flaky (admin-delete-dialog @ 1440 screenshot; passed on retry) · 0 failed (6.4m)
  afterwards: GET /api/v1/books?q=E2E → 0 test books left; 23 books in the live catalog
  HTML report: https://book-catalog-frontend-rouge.vercel.app/qa/playwright-report/index.html
```

## Explaining the code (review map)

| Concept | Where to look |
|---|---|
| Components and props | `BookForm` takes `initialValues`, `submitLabel`, `pendingLabel`, `pending`, `apiError`, `cancelHref`, `onSubmit` and is shared by create and edit; `DeleteBookDialog` takes `book`, `onClose`, `onDeleted`; `BookLoadState` takes `isPending`, `error`, `onRetry`; `PageHeading` takes `title`, `subtitle`, `back`, `actions` |
| State (`useState`) | `BookForm`: `values`, `errors`, `banner` (what the user typed lives only here); `BookDetailsScreen.confirming` (dialog open); `AdminBooksToolbar.query` (search text before the 300 ms debounce) |
| Server state (TanStack Query) | lists and details are never copied into `useState`: `useGetBooksList`, `useGetBookDetails`; `useBookMutations` invalidates every book query on success, so all screens refresh |
| Effects | the toolbar debounces the search into the URL and cancels its timer; the form moves focus to the first invalid field after a failed submit |
| Lists and keys | `AdminBooksTable` maps rows with `key={book.id}`; the skeleton maps 10 placeholder rows |
| Conditional rendering | `AdminBooksList`: loading / error / no books / no match / table, from the query state and the filters |
| Events and forms | `onSubmit` with `preventDefault`, `onBlur` validation per field, `onChange` per field, Dropdown `onChange` for category and sort |
| Custom hooks | `useAdminBooksParams` (URL ↔ filters), the data hooks above, `useToast` |
| Context | `ToastProvider`: one toast region in the shell, so a screen can save, navigate back to the list and still confirm it; `CartProvider` (Homework 1) drops a deleted book |
| TypeScript | `Book`, `BookRequest`, `BookField`, `BookFormValues`, `ApiError`, `PageResponse<T>`; no `any` |
| Next.js: folder = URL | `src/app/(main)/admin/books/list/page.tsx` → `/admin/books/list`; `details/[id]/page.tsx` → a dynamic segment read from `params`; `(main)` is a route group and adds nothing to the URL |
| Server vs client | `page.tsx` files are server components that render a client screen; everything with state, effects or events has `"use client"` |
| Env variables | `NEXT_PUBLIC_API_BASE_URL` (browser-visible, baked in at build time) |

## Not covered / known limits (Homework 2)

- **No login:** anyone with the link can add, edit or delete books (the Roles test area is "not applicable" for the
  homework). The demo API is public on purpose.
- **Free hosting:** the API is kept awake by a 5-minute ping; if it does sleep, a cold start takes a few minutes and Render's free database expires after a
  limited time, after which it would need a new one.
- Cover is a URL (an `https://` link or one of the app's `/assets/images/` files), not an upload.
- No undo after delete (the API has no soft delete); the dialog says "This cannot be undone."
- All browser checks ran in headless Chromium on this machine and against the deployed site; a real phone and Safari are
  manual items in the QA report.

---

# Homework 1 (submitted 6 Oct, result: Pass)

The sections below describe Homework 1 as it was submitted. Since Homework 2 the catalog and cart read the real API: the mock
`BookService` body and `src/mocks/books.ts` are gone. The `?state=loading|empty|missing-cover|error` demo links on
`/books/list` still work, for the design review.

**Catalog** at `/books/list`: header (brand, cart link with count, search), hero strip, category chips, results count + sort,
a grid of book cards (cover, category, title, author, rating, price, *Add to cart*), pagination and footer. States: filled ·
loading (8 skeleton cards) · empty · missing cover · error. **Cart** at `/cart`: items with *Remove*, order summary with discount
code, 18 % GST and total, checkout stub, empty state. Stack: Next.js 15.5 (App Router) · React 19 · TypeScript ·
PrimeReact 10.9 · SCSS · TanStack Query 5 · Playwright. Design check: [docs/design-check.md](docs/design-check.md) (21
questions). QA check: [docs/qa-check.md](docs/qa-check.md) (345 checks, 47 findings).

## WM rules applied

- **Naming:** classes `lowercase-with-hyphens` (`book-card`, `admin-table`), colour variables colour + code (`$indigo-b1`,
  `$red-b1`), icons `icon-<name>-<colour>` (`icon-trash-indigo.svg`), images lowercase-hyphen.
- **No hardcoded colours or numbers** in components or partials: SCSS reads `token("…")`, `$space-*`, `$font-size-*`,
  `$control-height`, `$breakpoints`; the few numbers components must pass to `next/image` come from `src/constants/design.ts`,
  which mirrors the tokens. Grep `#[0-9a-f]{6}` under `src/` finds only `_variables.scss` (the SVG exports keep their Figma colours).
- **Light/dark:** every `[day]` colour has one `[night]` colour with the same name (`$colors-day` / `$colors-night`), emitted as
  CSS custom properties and switched by `<html data-theme="dark">`. Homework 2 added `red-b2` and `overlay-b1`, each with its pair.
- **Breakpoints:** the WM list 1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375 as a Sass map with `mq-down()` / `mq-up()`.
- **Formats:** dates "November 4, 2025" (WM English date format) and "Nov 4, 2025" in the table, times "1:12 AM" (AM/PM after the
  number), three-digit commas everywhere ("₹1,249.50", "1,000 characters").

## Process: prompts and skills used (Homework 1)

One Claude Code session (VS Code) on 5 Oct 2026 with the **Notion** and **Figma** connectors enabled, following the training
page in order: setup → design check → plan → build with fake data → responsive check → tests → QA → fixes → hand-over notes.
The exact prompts are on my Notion homework page.

## One problem I hit and how I solved it (Homework 1)

The responsive test passed at all ten widths for the filled page, then failed for **the loading state at 375 px only**
(`page is 478px wide in a 375px viewport`). PrimeReact's `Skeleton` always writes an inline `style="width: 100%"`, which beats
the SCSS rule that should have made the cover skeleton 112 px wide on mobile. Fix: give the size to a plain wrapper element and
let the Skeleton fill it. The QA pass then found its bigger cousin: PrimeReact 10 injects its CSS after hydration, so for a few
seconds after every load at 375 px the page was 413 px wide; `style.scss` now ships those structural rules itself.
