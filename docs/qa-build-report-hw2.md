# QA build report — DevShelf "Manage books" (Homework 2)

Format: WM | Report, the 10 parts of the training's Step 8. Written as if handing the build to QA.

## 1. Build

| | |
|---|---|
| Frontend | `book-catalog-frontend` · branch `main` as of 8 Oct 13:00 IST (app code from `8e730c1`; the commits after it add the published Playwright report, docs and test changes only) · [book-catalog-frontend-rouge.vercel.app](https://book-catalog-frontend-rouge.vercel.app) |
| Backend | `devshelf-api` · branch `main` · commit `d28766d` (adds the self-ping that keeps the free instance awake; the books API itself is unchanged since `0d8430d`) · [devshelf-api.onrender.com](https://devshelf-api.onrender.com/api/v1/books) · [Swagger](https://devshelf-api.onrender.com/swagger-ui/index.html) |
| Date | 8 Oct 2026 |
| Start here | [/admin/books/list](https://book-catalog-frontend-rouge.vercel.app/admin/books/list) |

The API is on Render's free plan. A GitHub Actions job pings it every 5 minutes so it stays awake; if it has slept anyway,
a cold start takes a few minutes. Open the API link first and wait for it to answer before testing.

## 2. TL tasks covered

- [TL | AI Frontend Training — Homework 2](https://app.notion.com/p/3e9326b2d5fb80c0872def7b6a848d3c) (Steps 3–8): a full
  feature (list, create, details, edit, delete) on a real API, test cases, Playwright tests and this report.
- Submission page: [Sachin S M — Submissions & Feedback](https://app.notion.com/p/divii/Sachin-S-M-3f0326b2d5fb8107913bf42dbca567e6).

## 3. What changed, in plain words

- New **Manage books** area: a list of all books with search, category filter, sort and pages; a form to add a book; a page
  with all of one book's details; the same form to edit it; and delete, which always asks first.
- The **catalog** and **cart** from Homework 1 now show the real books from the API instead of sample data. A book added in
  Manage books appears in the catalog; a deleted book disappears from the catalog and from every cart.
- The form checks every field with the same rules and the same words as the server, and shows the server's own error (for
  example a duplicate ISBN) under the right field without losing what was typed.
- "Manage books" is in the header on screens 768 px and wider, and in the footer on phones.

## 4. Fixed issues (found during my own testing before hand-over)

| # | Issue | What changed |
|---|---|---|
| 1 | After deleting from the details page, the "Book deleted" message could disappear before the list had loaded | Save and delete messages now stay 5 s (the cart's "Added to cart" stays 2 s) |
| 2 | The red error banner above the form had none of its designed styles (icon touching the text, default red) | The styles targeted the wrong PrimeReact class; now light-red banner, red border, icon spaced 8 px |
| 3 | On a phone, a book with a short title showed the title far from its cover in the list card | The book cell keeps the title beside the cover |
| 4 | On a phone, the sort box cut "Recently updated" off mid-letter | It now ends in "…" |
| 5 | The cover URL help text did not mention `/assets/images/` paths, which the API accepts | Help text updated |
| 6 | Catalog: when one title in a row wrapped to two lines, that card's price and *Add to cart* sat lower than its neighbours' (found in review, `?sort=rating`) | Cards fill the row height and the price + button sit at the bottom, so they line up across every row |
| 7 | Footer *Help*, *License* and *Privacy* were placeholder `#` links: clicking them did nothing | Three short pages: `/help` (how to use the site), `/license` (demo content, links to both repos), `/privacy` (cart kept in the browser only, added books are public, no tracking) |
| 8 | *Published on*: the browser's own date picker flickered twice as it opened (Edge on Windows, found in review) | Replaced with the PrimeReact calendar in the DevShelf tokens: opens once, pick-only (no mistyped dates), future days disabled, *Today* / *Clear*, calendar icon inside the field as in Figma. The API still refuses a future date |

Each fix has an automated test (see part 9).

## 5. Test accounts / roles

None. DevShelf has no login in this homework; anyone with the link can manage books. Roles testing is **not applicable**
(test case MB-60).

## 6. Data QA must prepare first

Nothing. The API starts with 24 seeded books.
- Please do **not** edit or delete **Clean Code in Java**: the automated read-only tests rely on it.
- Name the books you create starting with **"QA "** so they are easy to find and delete afterwards.
- The deployed database is shared by everyone testing the demo: delete what you create.

## 7. What to test

1. Open `/admin/books/list`: title "Manage books", "24 books in the catalog" (or the current count), 10 rows, page links.
2. Search "kubernetes", then by an author name, then by an ISBN from a details page: only matching books stay; clear the search.
3. Pick a category, then a sort option; go to page 2; press the browser Back button: each step comes back.
4. Search "zzzz": "No books match your search" with *Clear filters*.
5. *Add book* → click *Add book* with nothing filled: red banner and four field messages ("Title is required." …); nothing saved.
6. Enter wrong values: title "A", ISBN with 12 digits, a future date, a cover URL starting `ftp://`, price 100000: each shows its own message.
7. Add a valid book ("QA …", any category, price 1249.5): toast "Book added", back on the list with the new book first,
   price "₹1,249.50"; it is also in the catalog at `/books/list` with "No ratings yet".
8. Add a second book with the ISBN of an existing book: "Another book already uses this ISBN." under ISBN, everything typed kept.
9. Open the new book's details → *Edit book*: the form is filled in; change title and price → *Save changes*: toast, list shows the change.
10. Put the new book in the cart from the catalog, then delete it from its details page: the dialog names the book;
    after *Delete book* → toast "Book deleted", the book is gone from the list, the catalog and the cart.
11. Open `/admin/books/details/no-such-book`: "Book not found" with *Back to books*.
12. Double-click *Add book* / *Delete book* quickly: only one book is created / one request is sent.
13. On the catalog sorted by rating (`/books/list?sort=rating`), check every row: prices and *Add to cart* buttons line up.
14. Click *Help*, *License* and *Privacy* in the footer: each opens its own page; the License page links both repositories.
15. On Add book, click *Published on*: the calendar opens once and stays open; next month's days are all disabled;
    *Today* fills today's date (dd-mm-yyyy) and *Clear* empties it.
16. Repeat 1, 5, 10, 14 and 15 at 1920, 1366, 768 and 375 wide (browser responsive mode): no sideways scrolling, cards on a phone,
    "Manage books" in the footer under 768.

## 8. Known issues and what is not covered

- No login or roles (homework scope).
- Free hosting: kept awake by a 5-minute ping; if it does sleep, a cold start takes a few minutes and the first page shows the error with *Try again*, which works once it is awake.
- Cover is a URL, not an upload. No undo after delete.
- The live demo's data is shared: reviewers add and delete books. Read-only tests that check counts read the current
  totals from the API instead of assuming the 24 seeded books, so they stay valid while others test. (One seeded book,
  "Python for Data Engineers: Exercises", was deleted on the live demo on 8 Oct during manual testing.)
- Automated checks ran in Chromium only (headless, this machine, and against the deployed site). Safari, Firefox and a
  real phone are not checked yet.

## 9. Results of lint, type-check, build and tests

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

## 10. Screen sizes and browsers checked

- **Chromium (Playwright, headless)** at 1920, 1600, 1440, 1366, 1280, 1024, 991, 768, 640, 480 and 375 for every screen and
  state: no page wider than the window and no element past its right edge. Screenshots in `docs/screenshots/`.
- The same read-only suite against the **deployed** Vercel site with the **deployed** Render API.
- Design vs build at 1440, 768 and 375: `docs/design/side-by-side/`.
- Not checked: Safari, Firefox, a real phone.
