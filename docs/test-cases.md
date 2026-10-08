# Test cases — Manage books (Homework 2)

Format: **WM | QA Template** — each case starts "Verify that …" and is marked **Positive** (the system does what it should)
or **Negative** (it refuses what it should refuse). Areas follow the training's Step 7 table.

- **Build under test:** frontend `book-catalog-frontend` (`main`) + API `devshelf-api` (`main`)
- **Screens:** `/admin/books/list` · `/admin/books/create` · `/admin/books/details/[id]` · `/admin/books/edit/[id]`
  (and the HW1 catalog `/books/list` and cart `/cart`, which now read the same API)
- **Data:** a fresh API starts with 24 seeded books. Do not edit or delete **Clean Code in Java** (the read-only tests use it).
- **Automated by:** `e2e/admin-books.spec.ts` (read-only) · `e2e/admin-books.mutation.spec.ts` (create/edit/delete) ·
  `e2e/responsive.spec.ts` (widths) · `e2e/book-catalog.spec.ts`, `e2e/cart.spec.ts` (regression). "Manual" = not automated.

## 1. Page opens

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-01 | Positive | Verify that the manage list opens with its title, heading, count and rows | API running, 24 books | Open `/admin/books/list` | Tab title "Manage books · DevShelf"; h1 "Manage books"; "24 books in the catalog"; 10 rows; "Add book" button | admin-books: page opens |
| MB-02 | Positive | Verify that the header link opens the manage list on desktop | Width ≥ 768 | Open `/books/list`, click "Manage books" in the header | `/admin/books/list` opens; the header link is highlighted | admin-books: header link |
| MB-03 | Positive | Verify that on a phone the footer carries the "Manage books" link | Width 375 | Open `/books/list`; look at the header, then the footer | Header has no "Manage books"; footer link opens the list | admin-books: footer link |
| MB-04 | Positive | Verify that the create screen opens empty with every field labelled | — | Click "Add book" | Title "Add book · DevShelf"; 8 labelled fields; required ones marked *; "Fields marked * are required." | admin-books: empty form |
| MB-05 | Positive | Verify that the details screen shows every stored value in WM formats | — | Click "Clean Code in Java" in the list | h1 is the title; category Java; price ₹999; ISBN; "November 4, 2025"; "4.8 out of 5 from 1,284 readers"; Added / Last updated as "Oct 7, 2026, 3:00 PM" style | admin-books: details |
| MB-06 | Negative | Verify that an unknown book id shows "Book not found" | — | Open `/admin/books/details/no-such-book` | h1 "Book not found"; the API's message "This book does not exist. It may have been deleted."; "Back to books" | admin-books: unknown id |
| MB-07 | Negative | Verify that editing an unknown id shows "Book not found" (no empty form) | — | Open `/admin/books/edit/no-such-book` | Same not-found block, no form | Manual |

## 2. Main flow (create → list → edit → delete)

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-10 | Positive | Verify that a valid book can be created | — | Add book; fill Title, Author, Category, Price 1249.5, Published 2026-01-15, Description; click "Add book" | Toast "Book added"; back on the list; the new book is the first row; price "₹1,249.50"; published "Jan 15, 2026" | mutation: main flow |
| MB-11 | Positive | Verify that a new book appears in the customer catalog at once | MB-10 done | Search the catalog for its title | The card shows, with "No ratings yet" instead of stars | mutation: main flow |
| MB-12 | Positive | Verify that edit opens with the saved values filled in | — | Details → "Edit book" | Every field holds the saved value; price shows "999" | admin-books: edit pre-fill |
| MB-13 | Positive | Verify that an edit is saved and shown in the list | A test book exists | Change title and price, "Save changes" | Toast "Changes saved"; list row shows the new title and "₹1,999"; the URL id is unchanged | mutation: main flow |
| MB-14 | Positive | Verify that Delete from the list asks first and then removes the book | A test book exists | Row "Delete" → dialog → "Delete book" | Dialog names the book; toast "Book deleted"; row gone; its details URL shows "Book not found" | mutation: main flow |
| MB-15 | Positive | Verify that Delete from the details screen returns to the list | A test book exists | Details → "Delete" → "Delete book" | Back on the list with "Book deleted" | mutation: details delete |
| MB-16 | Negative | Verify that Cancel in the delete dialog keeps the book and sends nothing | — | Details → "Delete" → "Cancel" | Dialog closes; book still shown; no DELETE request | admin-books: delete cancel |
| MB-17 | Positive | Verify that a deleted book leaves every cart that held it | A test book is in the cart | Delete it, open `/cart` | It is gone from the list; header count drops by one | mutation: cart removal |
| MB-18 | Negative | Verify that a double click on "Add book" creates one book | — | Fill the form, double-click "Add book" | Exactly one POST; one book with that title | mutation: double click |
| MB-19 | Negative | Verify that the submit button is disabled while saving | — | Submit a valid form on a slow connection (DevTools → Slow 3G) | Button reads "Adding…"/"Saving…" and cannot be pressed again | Manual |
| MB-20 | Negative | Verify that deleting a book someone else already deleted is handled | Book open in two tabs | Delete in tab 1, then in tab 2 | Tab 2 shows "Already deleted" and returns to the list | Manual |

## 3. Validation (same rules and words in the browser and the API)

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-30 | Negative | Verify that an empty form is not sent | — | Click "Add book" with nothing filled | Banner "Please correct the highlighted fields."; "Title is required." · "Author is required." · "Choose a category." · "Price is required."; focus on Title; no POST | admin-books: empty submit |
| MB-31 | Negative | Verify that too-short title and author are refused | — | Title "A", Author "B", submit | "Title must be 2 to 120 characters." · "Author must be 2 to 80 characters." | admin-books: formats |
| MB-32 | Negative | Verify that a title over 120 characters is refused | — | Paste 121 characters, submit | "Title must be 2 to 120 characters." | Manual |
| MB-33 | Negative | Verify that an ISBN that is not 13 digits is refused | — | ISBN "978123456789" (12), then "97812345678ab" | "ISBN must be exactly 13 digits." | admin-books: formats |
| MB-34 | Negative | Verify that a future published date cannot be entered | — | Open the Published on calendar, go to next month | Every future day is disabled; the field cannot be typed into. The API still refuses a future date with "Published date cannot be in the future." (API test) | admin-books: calendar |
| MB-35 | Negative | Verify that a cover URL with another scheme is refused | — | Cover "ftp://example.com/c.jpg" | "Cover URL must start with http://, https:// or /assets/images/." | admin-books: formats |
| MB-36 | Negative | Verify that a description over 1,000 characters is refused | — | 1,001 characters | Counter turns red "1,001 / 1,000 characters"; "Description can be at most 1,000 characters." | admin-books: formats |
| MB-37 | Negative | Verify that a price above ₹99,999.99 is refused | — | Price 100000 | "Price must be between ₹0 and ₹99,999.99." | Manual |
| MB-38 | Negative | Verify that a price cannot get a third decimal | — | Type 10.999 | The field keeps 2 decimals ("10.99") | Manual |
| MB-39 | Negative | Verify that a duplicate ISBN is refused by the server and shown under ISBN | Seeded ISBN known | Create with Clean Code in Java's ISBN | 409 from the API; "Another book already uses this ISBN." under ISBN; banner; everything typed is kept; no book created | mutation: duplicate ISBN |
| MB-40 | Positive | Verify that a book keeps its own ISBN on edit | — | Edit a book with an ISBN, change only the price, save | Saved; no "already uses" error | API test `updateKeepsOwnIsbn` |
| MB-41 | Negative | Verify that a server field error lands under its field | — | (simulated 409 on POST) submit | Message under ISBN, focus moves there, URL unchanged | admin-books: server error |
| MB-42 | Positive | Verify that an error clears as soon as the field is corrected | Error shown | Type a valid title | The title error disappears | admin-books: error clears |
| MB-43 | Positive | Verify that optional fields can stay empty | — | Fill only the four required fields | Saved; details show "Not set" for ISBN, date, description; cover shows "Cover unavailable" | Manual |
| MB-44 | Negative | Verify that the API refuses bad input even without the browser checks | API running | `curl -X POST …/api/v1/books -d '{}'` | 400 `VALIDATION_FAILED` with all four required-field messages | API tests (`BookControllerTest`) |
| MB-45 | Positive | Verify that the error banner is styled as designed | — | Click "Add book" with nothing filled | Light red banner, red-b1 border, icon 8 px from the text, text left-aligned | admin-books: error banner styles |

## 4. List behaviour

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-50 | Positive | Verify that search matches author (any case) | — | Type "vikram shah" | 3 rows; URL `?q=vikram+shah` | admin-books: search |
| MB-51 | Positive | Verify that search matches ISBN | — | Type Clean Code in Java's ISBN | 1 row, that book | admin-books: search |
| MB-52 | Negative | Verify that `%` and `_` are searched literally | — | Search "%" | "No books match your search" (not every book) | admin-books: literal % |
| MB-53 | Positive | Verify that the category filter narrows the list | — | Category → Databases | 3 rows, all Databases; `?category=Databases` | admin-books: category |
| MB-54 | Positive | Verify that sort Price: high to low puts ₹1,499 first | — | Sort → Price: high to low | First price ₹1,499; `?sort=price-desc` | admin-books: sort |
| MB-55 | Positive | Verify that paging moves to the next page | — | Page 2 | Different rows; `?page=2` | admin-books: paging |
| MB-56 | Negative | Verify that a page past the end is corrected | — | Open `?page=99` | Last page shown; the URL drops `page=99` | admin-books: clamp |
| MB-57 | Negative | Verify that a search with no match offers Clear filters | — | `?q=zzzz&category=Java` | "No books match your search"; Clear filters resets search box, category and URL | admin-books: no results |
| MB-58 | Positive | Verify that filters survive a reload and the back button | Filters set | Reload; open a book; Back | Same filtered page | Manual |
| MB-59 | Positive | Verify that after any change every screen is up to date without a reload | — | Edit a price; open the catalog and the cart | New price everywhere | mutation: main flow (list); Manual (cart) |

## 5. Roles

| ID | Type | Test case | Expected result |
|---|---|---|---|
| MB-60 | — | Allowed / not allowed users | **Not applicable.** DevShelf has no login in this homework; anyone with the link can manage books. Listed under "Known issues". |

## 6. States

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-70 | Positive | Verify that loading shows placeholder rows | API slow (simulated) | Open the list | 10 skeleton rows; count reads "Loading books…" | admin-books: loading |
| MB-71 | Positive | Verify that an empty database shows "No books yet" | 0 books (simulated) | Open the list | "No books yet" with an "Add book" action | admin-books: empty |
| MB-72 | Negative | Verify that the API being down shows a readable message and recovers | API stopped (simulated) | Open the list; start API; "Try again" | "We could not reach the DevShelf server…"; Try again loads the rows | admin-books: API down |
| MB-73 | Negative | Verify that a server error shows the API's own message | 500 (simulated) | Open the list | "Something went wrong on our side. Please try again in a moment." | admin-books: server error |
| MB-74 | Positive | Verify that details and edit show a spinner while loading | Slow API | Open a details URL | "Loading book…" spinner, then the book | Manual |
| MB-75 | Negative | Verify that the cart shows an error with Try again when the API is down | API stopped | Open `/cart` | "We could not load your cart" + API message + Try again | Manual |

## 7. Screen sizes

| ID | Type | Test case | Steps | Expected result | Automated by |
|---|---|---|---|---|---|
| MB-80 | Positive | Verify that no manage screen scrolls sideways from 1920 to 375 | Open list, create, details at 1920 / 1600 / 1440 / 1366 / 1280 / 1024 / 991 / 768 / 640 / 480 / 375 | Page never wider than the viewport; no element past the right edge | responsive (screenshots in `docs/screenshots/`) |
| MB-81 | Positive | Verify that the table becomes cards under 768 | Width 375 | Each book is a card with labelled values and full-width Edit / Delete | responsive |
| MB-82 | Positive | Verify that the "Last updated" column hides between 768 and 1023 | Width 991 | Five columns, title not squeezed | responsive |
| MB-83 | Positive | Verify that the form goes to one column under 768 and buttons are full width | Width 375 | One column; Cancel / Add book side by side, each half width | responsive |
| MB-84 | Positive | Verify that the delete dialog fits a phone | Width 375 | Dialog inside the screen with 16 px margins | responsive (`admin-delete-dialog-375.png`) |
| MB-85 | Positive | Verify that long titles wrap instead of overflowing | Create a 120-character title | Wraps in list, card, details heading | Manual |
| MB-86 | Positive | Verify that on a phone card a short title sits beside its cover | Width 375, sort Title A–Z | Look at the "Clean Code in Java" card | Title and author start 12 px right of the cover, not at the far edge of the card | admin-books: phone card title |
| MB-87 | Positive | Verify that a long sort option ends in an ellipsis on a phone | Width 375 | Open the list (sort "Recently updated") | The label is cut with "…", not mid-letter | admin-books: sort ellipsis |
| MB-88 | Positive | Verify that price and Add to cart line up across a catalog row | Width 1440 | Open `/books/list?sort=rating` (a row mixes one- and two-line titles) | In each row of four, the price lines and the Add to cart buttons are at the same height | book-catalog: line up |

## 8. Footer pages (regression)

| ID | Type | Test case | Precondition | Steps | Expected result | Automated by |
|---|---|---|---|---|---|---|
| MB-90 | Positive | Verify that the footer Help link opens the Help page | — | From Manage books, click "Help" in the footer | `/help`, tab "Help · DevShelf", h1 "Help", sections incl. "Manage books" | site-pages |
| MB-91 | Positive | Verify that the footer License link opens the License page | — | Click "License" in the footer | `/license`, h1 "License", "Source code" with links to both GitHub repositories | site-pages |
| MB-92 | Positive | Verify that the footer Privacy link opens the Privacy page | — | Click "Privacy" in the footer | `/privacy`, h1 "Privacy", explains the cart stays in the browser and added books are public | site-pages |
| MB-93 | Negative | Verify that no footer link is a dead "#" link | — | Read the footer links on any page | Exactly: Manage books, Help, License, Privacy, each to a real page | site-pages |
| MB-94 | Positive | Verify that the footer pages do not scroll sideways | Widths 1920 / 1440 / 1366 / 768 / 375 | Open each page | Page never wider than the viewport | responsive (`help-*.png`, `license-*.png`, `privacy-*.png`) |
| MB-95 | Positive | Verify that the Published on calendar opens once and stays open | Edge / Chrome | Click the date field | The calendar opens once, without flicker, and stays open; Today fills today's date as dd-mm-yyyy; Clear empties the field | admin-books: calendar |
