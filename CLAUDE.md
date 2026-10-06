# DevShelf — Frontend (Homework 1, TL | AI Frontend Training)

DevShelf is a small bookstore for software developers. This repo holds the customer-facing catalog
("Home / Book catalog") and the Cart screen, both built from Sachin's own Figma design for Homework 1 of
the Divii frontend training. Homework 1 uses mock data only; Homework 2 will connect a real API.

Stack: Next.js 15 (App Router) · React 19 · TypeScript · PrimeReact 10 · SCSS · TanStack Query 5 · Playwright
Backend API: none yet. `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`) is reserved for Homework 2.
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
npm run test:e2e       # Playwright; starts the dev server itself unless PLAYWRIGHT_BASE_URL is set
npm run test:e2e:ui    # visual runner
npm run screenshots    # responsive sweep at the 10 WM widths → docs/screenshots/
```

## Folders
```
src/app/(main)/layout.tsx              shell for customer pages (force-dynamic: the header reads the URL)
src/app/(main)/books/list/page.tsx     route /books/list ((main) adds nothing to the URL)
src/app/(main)/cart/page.tsx           route /cart
src/app/not-found.tsx                  branded 404 inside the shell
src/components/books/                  catalog screen: BookCatalog (state machine), BookCard, BookCover, BookGrid,
                                       CategoryChips, CatalogToolbar, CatalogPagination, skeletons
src/components/cart/                   cart screen: CartScreen, CartItem, OrderSummary, DiscountCodeField, CartEmpty
src/components/common/                 Icon, EmptyState
src/components/layout/                 SiteShell (providers + header + footer), SiteHeader (search writes ?q=), SiteFooter
src/components/providers/              AppProviders (PrimeReact + TanStack Query), CartProvider (items, discount,
                                       localStorage), CatalogNavigationProvider (URL ↔ filters, one navigate())
src/api-services/BookService.ts        API client — mock with 800 ms latency in Homework 1
src/hooks/API/books/useGetBooksList.ts data hook (TanStack Query); components never call the service
src/constants/                         catalog.ts (page size, chips, sort options, demo states, debounce, toast, stale time),
                                       cart.ts (route, GST, discount codes, seed, storage key), design.ts (TS mirror of the size tokens)
src/types/                             book.ts (Book, BooksListParams, PagedResponse, unions), cart.ts (CartState, results, totals)
src/utils/                             api-integration (endpoints + query keys), catalog-params (URL ↔ filters),
                                       cart-totals (pure money maths), format (WM number formats)
src/mocks/books.ts                     fake data: 24 books, page 1 = the Figma frame, every book has cover art
src/styles/                            SCSS in WM structure: _variables (tokens), _mixins, _icon, _button, _form-element,
                                       _component, _header, _footer, pages/_book-catalog, pages/_cart, style.scss
public/assets/icons | images           assets exported from Figma, WM names (icon-<name>-<colour>.svg, book-cover-<slug>.jpg)
e2e/                                   Playwright: book-catalog, catalog-navigation, cart (behaviour), responsive (widths + screenshots)
docs/                                  design-check.md (design questions and decisions), qa-check.md (QA table), screenshots/
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
- Cart: digital books are held once (no quantity); a first-time visitor gets the two seeded books; state persists in
  localStorage and is only written after it was read. Checkout is a stub until Homework 2.
- Demo-only switches `?state=loading|empty|error|missing-cover` are handled in `BookService` and must go when the real API lands.
- Company rules are in WM (Notion). Fetch them, don't guess: HTML development guideline, Light/Dark Mode Color System,
  Design guidelines for designers, QA Template, Date format, Three digit comma rule.
- Never commit `.env.local`. Never auto-allow `git push`, deploys or deletes (see `.claude/settings.json`).

## Known traps
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
