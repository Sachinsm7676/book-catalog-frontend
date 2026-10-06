# Design check — Home / Book catalog and Cart (Step 2, Part A)

Figma: [GmMGwepcgacGOKSFaf5elg](https://www.figma.com/design/GmMGwepcgacGOKSFaf5elg/Untitled?node-id=0-1)
Frames checked: `Home / Book catalog — Desktop (1440) | Mobile (375) — Default | Loading | Empty | Missing cover`,
`Cart — Desktop (1440) | Mobile (375) — Default | Empty`, and `Checkout — Desktop — Email error` for the error pattern.
Checked against: WM | HTML development guideline (checklist "when reviewing design in figma before development"),
WM | Design guidelines for designers, WM | Figma Setting Rules. Date: 2026-10-05.

The design is my own, so these questions are answered by me as "designer" in the right-hand column.
The implementation follows the "Decision" column.

## Checklist

| # | WM check | Result | Decision |
|---|----------|--------|----------|
| 1 | Container size the same on every page | ✅ 1200 px column on all 1440 frames (catalog, cart, checkout); 16 px side padding on 375 | `$container-width: 1200px`, `$gutter: 16px` |
| 2 | Same spacing for the same element everywhere | ✅ Header 16 px vertical, catalog content 48 px (desktop) / 32 px (mobile), cart content 48/32 with 32 px between blocks, gaps 48 / 32 / 16 / 8 | Spacing scale `$space-*` |
| 3 | Repeated components identical on every screen | ⚠️ Category chip is 40 px tall on desktop but 44 px on mobile; sort control shows a "Sort by" label on desktop only; the cart's Remove is a text button while every other action is a filled/outlined button | Treated as intentional. See Q1, Q2, Q16 |
| 4 | One font family with clear sizes | ✅ Inter only. Sizes 32 / 24 / 20 / 16 / 13, weights 400 / 600 / 700 | `next/font` Inter, `$font-size-*`; the PrimeReact theme font is overridden so no second Inter loads |
| 5 | How long text wraps on small screens | ⚠️ Mobile card titles are cut with "…" on the second line; hero title wraps freely | 2-line clamp on card and cart titles (`line-clamp(2)`). See Q3 |
| 6 | Font and colour library from the designer | ⚠️ File has no Figma variables/styles; values read from the frames | Tokens in `_variables.scss`; colour names as WM (`$indigo-b1` …, `$red-b1` from the checkout error) |
| 7 | Empty / loading / no-image states designed | ✅ Catalog: all three for both widths; cart: empty for both widths. ❌ No **error** state anywhere | Error reuses the empty-state block with the API message. See Q4 |
| 8 | Button width from padding, not fixed px | ✅ All buttons and chips are `padding 16px` horizontally; the 44 px height is reached through 12 px vertical padding | PrimeReact Button restyled with `min-height`, no fixed width or height |
| 9 | Images flexible and fitting their box | ✅ Covers are 2:3 everywhere (276×414, 112×168, 96×144, 80×120) | `aspect-ratio: 2/3; object-fit: cover` |
| 10 | Browser support request | — Not specified | Evergreen browsers assumed |

## Questions for the designer (and the answers used) — catalog

| # | Question | Answer used for this build |
|---|----------|---------------------------|
| Q1 | Chips are 40 px tall on desktop and 44 px on mobile — intentional (touch target) or an oversight? | Intentional. 40 desktop, 44 under 768 px. |
| Q2 | "Sort by" prefix exists on desktop only. Hide it on mobile, or drop it everywhere? | Hide under 768 px. |
| Q3 | Mobile shows "System Design Interview Handb…". Should titles clamp to 2 lines with an ellipsis, or wrap fully? | Clamp to 2 lines on all widths. |
| Q4 | There is no **error** state (API down). Can we reuse the empty-state block with the API message and a "Try again" button? | Yes, reused. The results count disappears in that state; only the error block says what happened. |
| Q5 | The results label says "8 books" but the pagination shows pages 1 · 2 · 3. Is the count the total or the current page? | Count = total results after filters; 8 per page. Mock has 24 books, so the label reads "24 books". |
| Q6 | A card is tagged **Databases**, but there is no "Databases" chip. Add the chip? | Not added; chips stay exactly as drawn. Databases books are reachable through "All" and search. |
| Q7 | Only 1440 and 375 are drawn. What happens between 768 and 1279 (tablet)? | Same card, fewer columns: 4 → 3 → 2 by available width; the mobile list layout starts under 768 px. |
| Q8 | No dark mode is drawn. WM asks for a 1:1 [day]/[night] palette — can we define a night palette with the same names? | Defined as an assumption in `$colors-night`; applied only when `<html data-theme="dark">` is set, never automatically. |
| Q9 | Pagination is drawn on page 1 only (grey previous, black next). What do later pages look like? | Same two assets; the enabled previous chevron is the black asset mirrored, the disabled next is the grey asset mirrored. |
| Q10 | Hover, focus and pressed states are not drawn. | Hover darkens slightly (filter) or uses the tint; keyboard focus shows a 2 px indigo ring on every control, including the search box. |
| Q11 | Cart badge with 10+ items, or 0 items? | Badge grows with the number (three-digit comma applied); 0 still shows the badge. |
| Q12 | Is search live-as-you-type or on Enter? | Live, 300 ms after the last keystroke. A chip, sort or Clear click inside that window is kept together with the typed text. |
| Q13 | Footer links (Help, License, Privacy) — where do they go? | Out of scope for Homework 1; placeholders with a 44 px tall hit area on the phone layout. |

## Questions for the designer (and the answers used) — cart (added 5 Oct after the owner review)

| # | Question | Answer used for this build |
|---|----------|---------------------------|
| Q14 | Cart items have no quantity control. Is every book held once? | Yes: digital books, one copy each. Adding a book already in the cart shows "Already in your cart". |
| Q15 | Every frame shows "Cart 2" with Clean Code in Java and Mastering React 19. Should a new visitor start with them? | Yes, as a demo seed. Changes persist per browser in localStorage, so a cleared cart stays cleared after a reload. |
| Q16 | Remove is drawn as a text action (trash icon + "Remove"), unlike the other buttons. Keep it that way? | Keep it; it is a 44 px tall text button. |
| Q17 | The discount field shows "DEV10" as typed text. Is that a prefilled value or an example? | Prefilled, exactly as drawn. DEV10 gives 10 % off; Apply adds a "Discount (DEV10)" row (not drawn) between Subtotal and Tax, and tax is 18 % of the discounted subtotal. |
| Q18 | What does an invalid or empty code look like? | The Checkout frame's error pattern: red label, 2 px red border, red helper text ("This code is not valid" / "Enter a discount code"). |
| Q19 | Where does "Proceed to checkout" go in Homework 1? | Nowhere yet: the button stays as drawn and shows "Checkout opens in Homework 2". |
| Q20 | Only 1440 and 375 are drawn for the cart. When does the summary column stack under the items? | Two columns at 1024 px and up (items + 384 px summary), stacked below; cover 96 px down to 768 px, 80 px under it. |
| Q21 | The header count in the empty frames is "0". Should the empty cart still show the badge? | Yes, "Cart 0", and the subtitle reads "Ready when you are." |

## Decisions taken from the QA pass (5 Oct)

- Chip, sort, page and Clear-filters clicks create history entries so the back button steps through filter states; search keystrokes replace the entry.
- An out-of-range or unknown URL value is clamped on screen and the address bar is rewritten once to what is shown.
- Unknown URLs render a branded "Page not found" page inside the shell with a link back to the catalog.
- Page 3 of the catalog no longer has books without cover art; the "Cover unavailable" state is reached with `?state=missing-cover` or a failed image.
- One PrimeReact behaviour is accepted as is: the open Dropdown carries `aria-activedescendant` on its root element (library issue, no user impact).

## Things the frames settle (no question needed)

- Default sort is **Popular**; page 1 order is the frame order.
- Prices are whole rupees with the ₹ sign and a three-digit comma (`₹1,299`); rating counts use the same grouping (`(1,284)`).
- The order summary of the two seeded books is Subtotal ₹2,298 · Tax (18 % GST) ₹414 · Total ₹2,712, which the maths in `cart-totals.ts` reproduces.
- The "Missing cover" placeholder is a grey box with a book-open icon and the text "Cover unavailable".
