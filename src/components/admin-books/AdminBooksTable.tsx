"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { BookCover } from "@/components/books/BookCover";
import { Icon } from "@/components/common/Icon";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import { THUMB_COVER_SIZES } from "@/constants/design";
import type { Book } from "@/types/book";
import { formatDateTime, formatPrice, formatShortDate } from "@/utils/format";

interface AdminBooksTableProps {
  books: Book[];
  /** dims the rows while the next page or filter loads */
  busy: boolean;
  onDelete: (book: Book) => void;
}

/**
 * The manage list. A real table on desktop and tablet; under 768 each row becomes a card and every cell
 * shows its own label (data-label), so nothing scrolls sideways on a phone.
 */
export function AdminBooksTable({ books, busy, onDelete }: AdminBooksTableProps) {
  return (
    <div className={classNames("admin-table-wrap", { "is-busy": busy })} aria-busy={busy}>
      <table className="admin-table" data-testid="admin-books-table">
        <caption className="visually-hidden">Books in the catalog</caption>
        <thead>
          <tr>
            <th scope="col">Book</th>
            <th scope="col">Category</th>
            <th scope="col" className="cell-number">
              Price
            </th>
            <th scope="col">Published</th>
            <th scope="col">Last updated</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} data-testid="admin-book-row">
              <td className="cell-book">
                <BookCover title={book.title} coverUrl={book.coverUrl} variant="thumb" sizes={THUMB_COVER_SIZES} />
                <div className="cell-book-text">
                  <Link href={ADMIN_BOOKS_ROUTES.details(book.id)} className="cell-book-title">
                    {book.title}
                  </Link>
                  <span className="cell-book-author">{book.author}</span>
                </div>
              </td>
              <td data-label="Category">{book.category}</td>
              <td data-label="Price" className="cell-number">
                {formatPrice(book.priceInr)}
              </td>
              <td data-label="Published">{formatShortDate(book.publishedAt) ?? "Not set"}</td>
              <td data-label="Last updated">{formatDateTime(book.updatedAt)}</td>
              <td className="cell-actions">
                <Link
                  href={ADMIN_BOOKS_ROUTES.edit(book.id)}
                  className="p-button p-component p-button-outlined row-action"
                  aria-label={`Edit ${book.title}`}
                >
                  <span className="p-button-label">Edit</span>
                </Link>
                <Button
                  type="button"
                  className="row-action row-action-danger"
                  outlined
                  onClick={() => onDelete(book)}
                  aria-label={`Delete ${book.title}`}
                >
                  <Icon name="trash-indigo" size="sm" />
                  <span className="p-button-label">Delete</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
