"use client";

import { classNames } from "primereact/utils";
import { BookCard } from "./BookCard";
import { FIRST_ROW_COUNT } from "@/constants/design";
import type { Book } from "@/types/book";

interface BookGridProps {
  books: Book[];
  onAddToCart: (book: Book) => void;
  /** true while a new page or filter is loading behind the current list */
  busy?: boolean;
}

/**
 * Responsive grid of book cards. Covers in the first row load eagerly; the decision is made per cover
 * URL because companion titles share art, and next/image keeps one priority flag per URL.
 */
export function BookGrid({ books, onAddToCart, busy = false }: BookGridProps) {
  const eagerCovers = new Set(books.slice(0, FIRST_ROW_COUNT).map((book) => book.coverUrl));

  return (
    <ul className={classNames("book-grid", { "is-busy": busy })} aria-busy={busy} aria-label="Books">
      {books.map((book) => (
        <li key={book.id} className="book-grid-item">
          <BookCard book={book} onAddToCart={onAddToCart} priority={book.coverUrl !== null && eagerCovers.has(book.coverUrl)} />
        </li>
      ))}
    </ul>
  );
}
