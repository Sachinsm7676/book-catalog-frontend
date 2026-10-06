# DevShelf — Book catalog and Cart (Homework 1)

**TL | AI Frontend Training — Homework 1: one list screen from a design, fake data, working on every WM screen width.**
Submitted by Sachin S M · Reviewer: Vaishali · Built 5 Oct 2026 with Claude Code

| | |
|---|---|
| Demo link | _fill in after deploy — see [Deploy](#deploy)_ |
| Repo / branch | _fill in after push_ · branch `main` |
| Design | [Figma — DevShelf](https://www.figma.com/design/GmMGwepcgacGOKSFaf5elg/Untitled?node-id=0-1) (my own design: Home / Book catalog and Cart, Desktop 1440 and Mobile 375, with Default / Loading / Empty / Missing cover states) |
| Training page | [TL \| AI Frontend Training](https://app.notion.com/p/divii/TL-AI-Frontend-Training-Building-Frontend-with-Claude-Code-for-Backend-Developers-3e9326b2d5fb80c0872def7b6a848d3c) |
| Design check | [docs/design-check.md](docs/design-check.md) — WM Part A checklist, 21 designer questions with the answers used, QA decisions |
| QA check | [docs/qa-check.md](docs/qa-check.md) — 345 checks by seven independent QA dimensions, 47 findings, every one dispositioned |
| Screenshots | [docs/screenshots/](docs/screenshots/) — 36 full-page captures at the WM widths |

## What I built

**DevShelf** is a small bookstore for developers, on **fake data** (24 books in `src/mocks/books.ts`; page 1 is exactly the Figma frame).

**Catalog** at `/books/list` (the graded list screen): header (brand, cart link with count, search), hero strip, category chips,
results count + sort, a grid of book cards (cover, category, title, author, rating, price, *Add to cart*), pagination and footer.

- **States:** filled · loading (8 skeleton cards) · empty ("No books found" + *Clear filters*) · missing cover ("Cover unavailable")
  · error (not in Figma — the empty block with the API message and *Try again*).
- **Interactions:** search (300 ms debounce), category filter, sort, pagination, add to cart (header badge + toast, "Already in your cart" on a repeat).
  Every filter lives in the URL (`?q=&category=&sort=&page=`): a view is shareable, chips/sort/pages create history entries so
  the back button steps through them, and an out-of-range page is corrected in the address bar.
- **Responsive:** 4 → 3 → 2 columns by available width, list layout under 768 px, no sideways scroll from 1920 to 375 (also before hydration).

**Cart** at `/cart` (added after the first review, from the Figma Cart frames): the books in the cart (cover, title, author,
"PDF · EPUB", price, *Remove*), an order summary (discount code, subtotal, tax 18 % GST, total, *Proceed to checkout*, secure note)
and the empty state with *Browse books*. Digital books are held once (no quantity). A first-time visitor starts with the two
seeded books every frame shows; the cart persists per browser in localStorage. `DEV10` gives 10 % off; an unknown code shows
the Checkout frame's red error pattern. Checkout itself is Homework 2, so the button says so when clicked.

Stack (as the training prescribes): Next.js 15.5 (App Router) · React 19 · TypeScript · PrimeReact 10.9 · SCSS · TanStack Query 5 ·
Playwright 1.63. PrimeReact parts reused: `Button`, `InputText`, `Dropdown`, `Paginator`, `Skeleton`, `Badge`, `Toast`, restyled
through SCSS tokens (no new component where one existed).

## How to run

```bash
npm install
npx playwright install chromium   # once, for the tests
npm run dev                       # http://localhost:3000 → redirects to /books/list
npm run check                     # lint + type-check + build
npm run test:e2e                  # behaviour + responsive tests (starts the dev server itself)
npm run screenshots               # responsive sweep only → docs/screenshots/
```

No `.env.local` is needed for Homework 1 (`.env.example` documents the variable reserved for Homework 2). Node 20+ required.

**See each state** (the `?state=` switches are demo-only, handled in the mock `BookService`, removed when the real API lands):

| State | URL |
|---|---|
| Catalog, filled | `/books/list` |
| Catalog, loading | `/books/list?state=loading` |
| Catalog, empty | `/books/list?state=empty` (or any search with no match, e.g. `?q=zzz`) |
| Catalog, missing cover | `/books/list?state=missing-cover` |
| Catalog, error | `/books/list?state=error` |
| Cart, filled | `/cart` (two seeded books on first visit) |
| Cart, empty | `/cart` after removing both books (persists until you add one again) |
| Not found | any other path, e.g. `/books/nope` |

### Deploy

Mock data only, so any Node host works: `npm run build && npm run start`. The fastest demo link is Vercel (`npx vercel` from
the repo root, defaults are fine). Set `PLAYWRIGHT_BASE_URL=<demo url>` to run the same Playwright suite against the deployed build.

## Screenshots (docs/screenshots)

| Width | Catalog filled | Catalog loading | Catalog empty | Catalog missing cover | Cart filled | Cart empty |
|---|---|---|---|---|---|---|
| 1920 | [✓](docs/screenshots/catalog-filled-1920.png) | [✓](docs/screenshots/catalog-loading-1920.png) | [✓](docs/screenshots/catalog-empty-1920.png) | [✓](docs/screenshots/catalog-missing-cover-1920.png) | [✓](docs/screenshots/cart-filled-1920.png) | [✓](docs/screenshots/cart-empty-1920.png) |
| 1600 | [✓](docs/screenshots/catalog-filled-1600.png) | | | | [✓](docs/screenshots/cart-filled-1600.png) | |
| 1366 | [✓](docs/screenshots/catalog-filled-1366.png) | [✓](docs/screenshots/catalog-loading-1366.png) | [✓](docs/screenshots/catalog-empty-1366.png) | [✓](docs/screenshots/catalog-missing-cover-1366.png) | [✓](docs/screenshots/cart-filled-1366.png) | [✓](docs/screenshots/cart-empty-1366.png) |
| 1280 | [✓](docs/screenshots/catalog-filled-1280.png) | | | | [✓](docs/screenshots/cart-filled-1280.png) | |
| 1024 | [✓](docs/screenshots/catalog-filled-1024.png) | | | | [✓](docs/screenshots/cart-filled-1024.png) | |
| 991 | [✓](docs/screenshots/catalog-filled-991.png) | | | | [✓](docs/screenshots/cart-filled-991.png) | |
| 768 | [✓](docs/screenshots/catalog-filled-768.png) | [✓](docs/screenshots/catalog-loading-768.png) | [✓](docs/screenshots/catalog-empty-768.png) | [✓](docs/screenshots/catalog-missing-cover-768.png) | [✓](docs/screenshots/cart-filled-768.png) | [✓](docs/screenshots/cart-empty-768.png) |
| 640 | [✓](docs/screenshots/catalog-filled-640.png) | | | | [✓](docs/screenshots/cart-filled-640.png) | |
| 480 | [✓](docs/screenshots/catalog-filled-480.png) | | | | [✓](docs/screenshots/cart-filled-480.png) | |
| 375 | [✓](docs/screenshots/catalog-filled-375.png) | [✓](docs/screenshots/catalog-loading-375.png) | [✓](docs/screenshots/catalog-empty-375.png) | [✓](docs/screenshots/catalog-missing-cover-375.png) | [✓](docs/screenshots/cart-filled-375.png) | [✓](docs/screenshots/cart-empty-375.png) |

Each capture is taken by `e2e/responsive.spec.ts`, which first asserts `scrollWidth <= clientWidth` and that no element's box
reaches past the viewport. Captures run with reduced motion, so they are byte-identical between runs.

## Project structure

```
src/app/(main)/layout.tsx              shell for customer pages (force-dynamic: the header reads the URL)
src/app/(main)/books/list/page.tsx     route /books/list ((main) adds nothing to the URL)
src/app/(main)/cart/page.tsx           route /cart
src/app/not-found.tsx                  branded 404 inside the shell
src/components/books/                  BookCatalog (the screen), BookCard, BookCover, BookGrid, CategoryChips,
                                       CatalogToolbar, CatalogPagination, skeletons
src/components/cart/                   CartScreen, CartItem, OrderSummary, DiscountCodeField, CartEmpty
src/components/common/                 Icon, EmptyState
src/components/layout/                 SiteShell, SiteHeader, SiteFooter
src/components/providers/              AppProviders (PrimeReact + TanStack Query), CartProvider (items, discount, localStorage),
                                       CatalogNavigationProvider (URL ↔ filters, one navigate() for header and catalog)
src/api-services/BookService.ts        API client (mock, 800 ms latency) — Homework 2 swaps the body for axios
src/hooks/API/books/useGetBooksList.ts data hook (TanStack Query); components never call the service
src/constants/                         catalog.ts, cart.ts, design.ts (TypeScript mirror of the size tokens)
src/types/                             book.ts (Book, BooksListParams, PagedResponse, unions), cart.ts
src/utils/                             api-integration (endpoints + query keys), catalog-params (URL ↔ filters),
                                       cart-totals (pure money maths), format (WM numbers)
src/styles/                            _variables (tokens), _mixins, _icon, _button, _form-element, _component,
                                       _header, _footer, pages/_book-catalog, pages/_cart, style.scss
public/assets/icons | images           Figma exports, WM names (icon-<name>-<colour>.svg, book-cover-<slug>.jpg, illustration-cart-empty.svg)
e2e/                                   book-catalog (9), catalog-navigation (8), cart (8), responsive (36 width tests)
docs/                                  design-check.md, qa-check.md, screenshots/
CLAUDE.md, .claude/settings.json       project context and safe-command permissions for Claude Code
```

## WM rules applied

- **Naming:** classes `lowercase-with-hyphens` (`book-card`, `order-summary`), colour variables colour + code (`$indigo-b1`,
  `$red-b1`), icons `icon-<name>-<colour>` (`icon-trash-indigo.svg`), images lowercase-hyphen.
- **No hardcoded colours or numbers** in components or partials: SCSS reads `token("…")`, `$space-*`, `$font-size-*`,
  `$control-height`, `$breakpoints`; the few numbers components must pass to `next/image` come from `src/constants/design.ts`,
  which mirrors the tokens. Grep `#[0-9a-f]{6}` under `src/` finds only `_variables.scss` (the SVG exports keep their Figma colours).
- **Light/dark:** every `[day]` colour has one `[night]` colour with the same name (`$colors-day` / `$colors-night`), emitted as
  CSS custom properties and switched by `<html data-theme="dark">`.
- **Breakpoints:** the WM list 1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375 as a Sass map with `mq-down()` / `mq-up()`.
- **Buttons sized by padding** (the 44 px comes from 12 px vertical padding, never a fixed height), **images fit their box**
  (2:3, `object-fit: cover`), **one Google font** (Inter via `next/font`; the PrimeReact theme font is overridden so no second
  Inter loads), **three-digit comma** on every number including the cart badge, a comment above every block.
- SCSS folder follows the WM HTML guideline structure (`_variables`, `_mixins`, `_icon`, `_button`, `_form-element`,
  `_component`, `_header`, `_footer`, `style.scss`, plus one partial per page).

## Process: prompts and skills used

One Claude Code session (VS Code) on 5 Oct 2026 with the **Notion** and **Figma** connectors enabled, following the training
page in order: setup → design check → plan → build with fake data → responsive check → tests → QA → fixes → hand-over notes.

**Prompts I gave Claude Code**

1. The Figma link with `@pm @auto`, then: *"Homework. read it and use my figma design and complete homework"* with the Notion link.
2. *"check again and proceed to complete task"* — after enabling the Notion and Figma connectors (the first attempt could not read
   either page: Notion returned `publicAccessRole: none`, Figma returned 403).
3. *"local url to chk"* — to get the dev server up and click through the build myself.
4. `/qa-check` — the project's QA skill, run as seven independent QA agents against the live app.
5. *"in 3rd page cover unavailable and add to cart feature is not working"* with a screenshot — my own review. Both were my design
   decisions rather than crashes (four page-3 books had no cover art; the cart button had nowhere to go), and both were changed:
   page 3 got cover art, and the Cart screen was built from the Figma Cart frames (my choice from the options offered).
6. *"Continue from where you left off. complete the task"* — after an account rate limit cut the QA verification and the cart build
   agents short; the rest was finished in the main session.

**Training prompts applied, in order**

- *Plan a screen* — read the Figma frames and the WM pages, list designer questions, list the files to create, no code yet
  ([docs/design-check.md](docs/design-check.md) and the structure above).
- *Build with fake data* — reuse PrimeReact parts, SCSS with WM naming, no hardcoded colours, run `npx tsc --noEmit` and `npm run lint`.
- *Step 5 responsive prompt* — check 1920 … 375, screenshot each, report sideways scrolling, overlap, fixed widths.
- *Step 7 Playwright prompt* — one spec per feature, check visible text and the title, run against localhost:3000.
- *Step 6 bug template* — for the two issues from my review: reproduce first (headless browser, server log, repo integrity), then change.

**Skills and connectors**

- Figma MCP: `get_metadata`, `get_design_context` with the `figma-design-to-code` skill resource, asset export (8 covers, 13 icons, 1 illustration).
- Notion MCP: `notion-fetch` for the training page and the WM pages it links (HTML development guideline, Light/Dark Mode Color System,
  Design guidelines for designers, Figma Setting Rules).
- Project skill `/qa-check`, run as a multi-agent workflow (happy path, negative/boundary, responsive/fidelity, accessibility/console,
  code audit, data logic, regression). Its table and every disposition are in [docs/qa-check.md](docs/qa-check.md).
- The training's `fe-*` skills were not yet published on 5 Oct (the page says a clean version is coming by 6 Oct), so their steps were done by hand.
- Repo setup for Claude Code: `CLAUDE.md` (stack, commands, folders, rules, known traps) and `.claude/settings.json`
  (safe check commands allowed; push, deploy and delete denied).

## One problem I hit and how I solved it

The responsive test passed at all ten widths for the filled page, then failed for **the loading state at 375 px only**:

```
Error: page is 478px wide in a 375px viewport
```

**Cause.** PrimeReact's `Skeleton` always writes an inline `style="width: 100%"`. Inline styles beat stylesheet rules, so the SCSS
that should have made the cover skeleton 112 px wide on mobile was ignored; each skeleton card became wider than its box and the
page scrolled sideways.

**Fix.** Give the size to a plain wrapper element in SCSS and let the Skeleton fill it. Doing that for every skeleton line also moved
the last design numbers out of the TSX and into tokens. `e2e/responsive.spec.ts` caught it; a check of the filled state alone
would have shipped the bug.

**The QA pass found its bigger cousin.** PrimeReact 10 injects all of its component CSS at runtime, after hydration, so for a few
seconds after every load at 375 px the sort control's hidden accessibility input and native select were visible and the page was
413 px wide — invisible to a test that waits for the page to settle. `style.scss` now ships those structural rules itself, and a
50 ms width sampler over the first six seconds reports zero overflow frames. Smaller ones along the way: ESLint linting Playwright's
minified report (ignored the output folders), shimmer making the loading screenshots change bytes on every run (reduced motion),
and a `classNames` import from `primereact/utils` that is client-only and crashed the server-rendered 404 page.

## Check results (run on 5 Oct 2026, this machine)

```
> npm run check          # lint → typecheck → build
eslint                   0 problems
tsc --noEmit             exit 0
next build               ✓ Compiled successfully · ✓ Generating static pages (4/4)
                         ƒ /books/list 38.1 kB · ƒ /cart 2.35 kB · ○ /_not-found · First Load JS 103–198 kB

> npx playwright test
Running 61 tests using 1 worker
61 passed (2.1m)
  e2e/book-catalog.spec.ts         9 passed  page opens · loading · empty + clear filters · chip · search · pagination · missing cover · error · add to cart
  e2e/catalog-navigation.spec.ts   8 passed  back button · chip within debounce · page clamp in URL · optimistic page highlight ·
                                             error toolbar · accessible names · covers on every page · branded 404
  e2e/cart.spec.ts                 8 passed  seeded totals · remove · empty + Browse books · add once / already in cart ·
                                             DEV10 · invalid and empty code · checkout stub · persistence
  e2e/responsive.spec.ts          36 passed  catalog filled and cart filled @ 1920/1600/1366/1280/1024/991/768/640/480/375;
                                             catalog loading / empty / missing-cover and cart empty @ 1920/1366/768/375;
                                             scrollWidth <= clientWidth and no element past the viewport in every case
```

## Explaining the code (review map)

| Concept | Where to look |
|---|---|
| Components and props | `BookCard` takes `book`, `onAddToCart`, `priority`; `CartItem` takes `book`, `onRemove`; the screens compose them |
| State (`useState`) | `SiteHeader.query` (controlled input), `BookCover.failed`, `DiscountCodeField.code` / `attempt`, `CartProvider.state` |
| Effects and cleanup | `SiteHeader`: sync from the URL only on external changes and cancel the pending timer; `CartProvider`: read storage after mount, write only after the read; `BookCatalog`: rewrite a non-canonical URL once |
| Lists and keys | `BookGrid` and `CartScreen` map with `key={book.id}`; `CategoryChips` maps `CATEGORY_FILTERS` |
| Conditional rendering | `BookCatalog`: skeleton / error / empty / grid from `isPending`, `isError`, `data.list.length`; `CartScreen`: empty vs layout |
| Events and forms | `onChange` (search, code), `onClick` (chips, add, remove, pages), `onSubmit` (discount form), Dropdown `onChange` (sort) |
| Custom hooks | `useGetBooksList` (TanStack Query, `keepPreviousData`), `useCart`, `useCatalogNavigation` |
| Context and re-rendering | `CartProvider`: one `addItem` anywhere re-renders the header badge; `CatalogNavigationProvider`: one `navigate()` shared by header and catalog |
| TypeScript | `Book`, `BooksListParams`, `PagedResponse<T>`, `CartState`, `CartTotals`, `IconName` / `IconSize` unions; no `any` |
| Next.js: folder = URL | `src/app/(main)/books/list/page.tsx` → `/books/list`, `src/app/(main)/cart/page.tsx` → `/cart`; `(main)` is a route group |
| Server vs client | pages, layouts, `Icon`, `EmptyState` are server components; anything with state, effects or events has `"use client"` |
| Dynamic rendering | the `(main)` layout is `force-dynamic` because the shell reads `useSearchParams`; the prerendered 404 wraps the shell in `Suspense` |
| Env variables | `.env.example`: only `NEXT_PUBLIC_*` reaches the browser |

## Not covered / known limits

- Checkout, Book details and Order success exist in Figma but are Homework 2 scope; *Proceed to checkout* says so when clicked.
- Footer links are placeholders (design-check Q13).
- The night palette is defined but only applied with `data-theme="dark"`; Figma has no dark frames (Q8).
- No "Databases" chip, exactly as drawn (Q6); those books are reachable through "All" and search.
- Demo switches (`?state=…`) exist only in the mock service; the cart is stored per browser, not per account.
- All browser checks ran in headless Chromium on this machine; a real phone and Safari are on the manual QA list in `docs/qa-check.md`.
