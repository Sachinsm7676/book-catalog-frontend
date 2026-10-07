# Design check — Manage books (Homework 2)

The HW2 screens extend the DevShelf design system from Homework 1 (`docs/design-check.md`): same tokens
(`src/styles/_variables.scss`), 44 px controls, 8 px radius, `grey-b2` borders, Inter 400/600/700, and the error
pattern of the Figma "Checkout — Email error" frame (red label, 2 px red border, 13 px red helper text).
Figma frames for the HW2 screens: see "Frames" at the end (desktop 1440 and mobile 375).

## Screens and states

| Screen | Route | States |
|---|---|---|
| Manage list | `/admin/books/list` | filled · loading (10 skeleton rows) · no books yet · no match (Clear filters) · error (API message + Try again) |
| Add book | `/admin/books/create` | empty · field errors + banner · saving (button "Adding…", disabled) · server error under the field |
| Book details | `/admin/books/details/[id]` | filled · loading (spinner) · not found · error |
| Edit book | `/admin/books/edit/[id]` | pre-filled · same as Add book |
| Delete dialog | from list and details | ask · deleting (buttons disabled) · failure message inside the dialog |

## Questions I would ask the designer (and what I used meanwhile)

| # | Question | Used in the build |
|---|---|---|
| Q1 | Where does the manage area live: a separate admin app with its own layout, or inside the shop? | Inside the shop shell (same header and footer), under `/admin/books/...`, so one deploy shows both. |
| Q2 | The 375 header has no room for a third item next to the brand and the cart. Where is "Manage books" on a phone? | Header from 768 up; below 768 it is in the footer (always visible). |
| Q3 | Table or cards for the list? | A real table on desktop (Book, Category, Price, Published, Last updated, actions); under 768 each row becomes a card with labelled values; between 768 and 1023 "Last updated" is hidden so titles are not squeezed. |
| Q4 | Default order of the manage list? | "Recently updated" first, so a book you just saved is at the top. The catalog keeps "Popular". |
| Q5 | Rows per page? | 10 (catalog keeps 8, its grid is 2 × 4). |
| Q6 | Do we confirm deletes? Undo instead? | Confirmation dialog, red "Delete book" button, the title in bold, "This cannot be undone." No undo (the API has no soft delete). |
| Q7 | After save: back to the list or to the details? | Back to the list with a toast ("Book added" / "Changes saved"), as the training's Step 4 says. |
| Q8 | Is there a design for the date field? | Native date input (calendar picker on every browser, keyboard friendly); dates are shown as "November 4, 2025" (WM) and "Nov 4, 2025" in the table. |
| Q9 | Cover upload or URL? | URL field (upload is out of scope). Empty = the designed "Cover unavailable" placeholder. |
| Q10 | A new book has no ratings. What does the card show? | "No ratings yet" in the rating row (same height, so cards stay aligned). |
| Q11 | Prices with paise? | Allowed up to 2 decimals; shown as "₹1,249.50", whole rupees stay "₹999" as in HW1. |
| Q12 | Danger colour? | `red-b1` (already the error colour); no new red. A light `red-b2` was added for the error banner background, with its night pair. |
| Q13 | Required-field marker? | Red `*` after the label, "(optional)" in grey on the others, and a line "Fields marked * are required." above the form. |

## New tokens (all with a night pair)

`red-b2` (banner background), `overlay-b1` (dimmed page behind the dialog); sizes `$admin-filter-width`,
`$thumb-cover-width`, `$details-cover-width(-mobile)`, `$form-width`, `$textarea-min-height`, `$dialog-width`,
`$spinner-size`, `$details-label-width`.

## Frames

Figma file: [DevShelf](https://www.figma.com/design/GmMGwepcgacGOKSFaf5elg/Untitled?node-id=0-1).
PNG exports and the design-left / build-right images at 1440, 768 and 375 are in `docs/design/`.
