# DevShelf — Frontend (Homeworks 1 and 2, TL | AI Frontend Training)

DevShelf is a small bookstore for software developers. This repo holds the customer-facing catalog
("Home / Book catalog") and the Cart screen (Homework 1, from Sachin's own Figma design), and the
"Manage books" feature: list, create, details, edit and delete on the real DevShelf API (Homework 2).

Stack: Next.js 15 (App Router) · React 19 · TypeScript · PrimeReact 10 · SCSS · TanStack Query 5 · Playwright
Backend API: `devshelf-api` (separate repo, Spring Boot + PostgreSQL), base URL in `NEXT_PUBLIC_API_BASE_URL`.
Endpoints: `GET/POST /api/v1/books`, `GET/PUT/DELETE /api/v1/books/{id}`. Every error is
`{status, code, message, fieldErrors}`; screens show `message` and put `fieldErrors` under the matching input.
Design: Figma file `GmMGwepcgacGOKSFaf5elg`, frames "Home / Book catalog — Desktop | Mobile — Default | Loading | Empty | Missing cover"
and "Cart — Desktop | Mobile — Default | Empty". Error styling comes from "Checkout — Desktop — Email error".
Company rules: WM (Work Manual) on Notion wins over anything written here.

## Commands
```
npm run dev            # start the app on localhost:3000 ("/" redirects to /books/list)
npm run typecheck      # tsc --noEmit — run after every change
npm run lint
npm run build
npm run check          # lint + typecheck + build
npm run test:e2e       # Playwright, read-only tests; starts the dev server itself unless PLAYWRIGHT_BASE_URL is set
                       # (the API must be running: the run stops at once with a message if it is not)
npm run test:e2e:mutation  # create / edit / delete tests (*.mutation.spec.ts); local API only, they clean up after themselves
npm run test:e2e:ui    # visual runner
npm run screenshots    # responsive sweep at the 10 WM widths + 1440 → docs/screenshots/
```

## Folders
```
src/app/(main)/layout.tsx              shell for customer pages (force-dynamic: the header reads the URL)
src/app/(main)/books/list/page.tsx     route /books/list ((main) adds nothing to the URL)
src/app/(main)/cart/page.tsx           route /cart
src/app/(main)/admin/books/...         routes /admin/books/list | create | details/[id] | edit/[id] (Homework 2)
src/app/not-found.tsx                  branded 404 inside the shell
src/components/books/                  catalog screen: BookCatalog (state machine), BookCard, BookCover, BookGrid,
                                       CategoryChips, CatalogToolbar, CatalogPagination, skeletons
src/components/cart/                   cart screen: CartScreen, CartItem, OrderSummary, DiscountCodeField, CartEmpty
src/components/admin-books/            manage screens: AdminBooksList (state machine), AdminBooksToolbar, AdminBooksTable
                                       (table → cards under 768), BookForm (create + edit), BookDetailsScreen, BookCreateScreen,
                                       BookEditScreen, BookLoadState (spinner / not found / error), DeleteBookDialog
src/components/common/                 Icon, EmptyState, PageHeading
src/components/layout/                 SiteShell (providers + header + footer), SiteHeader (search writes ?q=), SiteFooter
src/components/providers/              AppProviders (PrimeReact + TanStack Query), CartProvider (stored ids resolved
                                       through the API, discount, localStorage), CatalogNavigationProvider (URL ↔ filters,
                                       one navigate()), ToastProvider (one toast region that survives navigation)
src/api-services/BookService.ts        one method per endpoint (axios), throws ApiError; the ?state= demo switches live here
src/hooks/API/books/                   useGetBooksList, useGetBookDetails, useGetBooksByIds (cart), useBookMutations
                                       (create / update / delete, each invalidates QUERIES.books.all); components never call the service
src/hooks/useAdminBooksParams.ts       manage-list filters ↔ URL
src/constants/                         books-admin.ts (routes, page size, sort options, categories, BOOK_LIMITS = the API's rules),
                                       api.ts (timeout), catalog.ts (page size, chips, sort options, demo states, debounce, toast, stale time),
                                       cart.ts (route, GST, discount codes, seed, storage key), design.ts (TS mirror of the size tokens)
src/types/                             book.ts (Book, BookRequest, BooksListParams, PagedResponse, unions), api.ts (ApiError),
                                       cart.ts (CartState, results, totals)
src/utils/                             api-client (axios instance, toApiError), api-integration (endpoints + query keys),
                                       book-rules (form validation = the API's rules and messages), catalog-params and
                                       admin-books-params (URL ↔ filters), cart-totals (pure money maths), format (WM number and date formats)
src/styles/                            SCSS in WM structure: _variables (tokens), _mixins, _icon, _button, _form-element,
                                       _component, _header, _footer, pages/_book-catalog, pages/_cart, style.scss
public/assets/icons | images           assets exported from Figma, WM names (icon-<name>-<colour>.svg, book-cover-<slug>.jpg)
e2e/                                   Playwright: book-catalog, catalog-navigation, cart, admin-books (read-only),
                                       admin-books.mutation (writes), responsive (widths + screenshots); helpers.ts, global-setup.ts
docs/                                  design-check.md (HW1), design-check-hw2.md, test-cases.md (WM QA format), build-report.md,
                                       qa-check.md (HW1 QA table), screenshots/, design/ (Figma PNG exports, side-by-side images)
```

## Rules
- Follow the style of the file you are editing. Reuse PrimeReact parts and the components above before adding new ones.
- No hardcoded colours or sizes in components or SCSS partials. Use the tokens in `src/styles/_variables.scss`
  (`token("indigo-b1")`, `$space-4`, `$radius-md`, `@include mq-down("sm")`). The few sizes a component must pass as
  numbers (next/image width/height/sizes) come from `src/constants/design.ts`, which mirrors the tokens: change both.
- Class names are lowercase-with-hyphens. Icons are `icon-<name>-<colour>`. Colour variables are colour + code (`$indigo-b1`).
- Every light colour has exactly one dark counterpart with the same name (`$colors-day` / `$colors-night`).
- Filters live in the URL. A new one goes into `catalog-params.ts` and its allowed values into `constants/catalog.ts`;
  navigation always goes through `useCatalogNavigation().navigate()` (push for clicks, replace for keystrokes and clean-up).
- Every list screen shows loading, empty and error. A missing image shows the designed placeholder, not a broken image.
- Cart: digital books are held once (no quantity); a first-time visitor gets the two seeded books; ids persist in
  localStorage (only written after it was read) and are resolved through the API; a deleted book drops out. Checkout is a stub.
- Demo-only switches `?state=loading|empty|error|missing-cover` on the catalog are answered in `BookService` without calling
  the API. They are kept on purpose for the design review; tests of the manage screens simulate states with `page.route` instead.
- Form rules live in `src/utils/book-rules.ts` and must stay word for word the API's messages (devshelf-api README,
  "Validation"). Change both repos together.
- Book ids are slugs the API makes from the title; they never change on edit. Build URLs with `ADMIN_BOOKS_ROUTES`.
- After every create/edit/delete, invalidate `QUERIES.books.all` (the mutation hooks do it). Never copy API data into state.
- Tests that write data go in `*.mutation.spec.ts` and delete what they create.
- Company rules are in WM (Notion). Fetch them, don't guess: HTML development guideline, Light/Dark Mode Color System,
  Design guidelines for designers, QA Template, Date format, Three digit comma rule.
- Never commit `.env.local`. Never auto-allow `git push`, deploys or deletes (see `.claude/settings.json`).

## Known traps
- The API's free host sleeps when idle: the first request after a while takes up to a minute. The axios timeout is 70 s
  and the network error message says so. Do not "fix" a slow first load by lowering the timeout.
- `NEXT_PUBLIC_API_BASE_URL` is baked in at build time. Changing it on Vercel does nothing until the next deploy.
- PrimeReact Dropdown renders a hidden `<select>` too, so `getByLabel` can match twice: tests click the dropdown by its `id`.
- PrimeReact InputNumber ignores Playwright's `fill()`; type into it with `pressSequentially()`.
- The `(main)` group is `force-dynamic` because the header and both screens read `useSearchParams`; a statically
  prerendered page would need a `<Suspense>` boundary around them (`not-found.tsx` has one for that reason).
- PrimeReact 10 injects its component CSS at runtime. `style.scss` ships the structural rules (hidden accessibility
  inputs, dropdown trigger, badge, skeleton) so the server paint is right; without them the page scrolled sideways at 375px for seconds.
- PrimeReact's `Skeleton` writes an inline width; size a wrapper element instead (see `.skeleton-cover`, `.skeleton-line-*`).
- `primereact/utils` (`classNames`) is client-only: never import it in a component that a server component renders (Icon, EmptyState).
- Blank page, only the header shows, no error: two `npm run dev` servers are running. Stop all node processes, delete `.next`, start one.
- Playwright times out on the first run: the dev server compiles the page on its first visit. Open it once, then run the tests.
- Screenshots: `playwright.config.ts` sets `reducedMotion: "reduce"` and captures with `animations: "disabled"`; without that
  the skeleton shimmer changed the loading PNGs on every run.
- The Figma cover exports are JPEG files even though their asset URLs end in `.png`; they are stored as `.jpg`.
- The search box must not be re-synced from the URL after every keystroke, or the debounce overwrites what the user is typing.
  `SiteHeader` tracks the last value it pushed, syncs only on external changes, and cancels a pending search when one arrives.
