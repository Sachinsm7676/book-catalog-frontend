"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useState } from "react";
import { BookLoadState } from "./BookLoadState";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { BookCover } from "@/components/books/BookCover";
import { Icon } from "@/components/common/Icon";
import { PageHeading } from "@/components/common/PageHeading";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import { DETAILS_COVER_SIZES } from "@/constants/design";
import { useGetBookDetails } from "@/hooks/API/books/useGetBookDetails";
import { formatCount, formatDate, formatDateTime, formatPrice, formatRating } from "@/utils/format";

/** /admin/books/details/[id]: everything stored about one book, with Edit and Delete. */
export function BookDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const { data: book, isPending, error, refetch } = useGetBookDetails(id);
  const [confirming, setConfirming] = useState(false);

  if (!book) {
    return (
      <div className="admin-page">
        <BookLoadState isPending={isPending} error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  const notSet = <span className="details-empty">Not set</span>;

  return (
    <div className="admin-page">
      <PageHeading
        title={book.title}
        subtitle={`by ${book.author}`}
        back={{ href: ADMIN_BOOKS_ROUTES.list, label: "Back to books" }}
        actions={
          <>
            <Link
              href={ADMIN_BOOKS_ROUTES.edit(book.id)}
              className="p-button p-component"
              data-testid="edit-book"
            >
              <span className="p-button-label">Edit book</span>
            </Link>
            <Button type="button" outlined onClick={() => setConfirming(true)} data-testid="delete-book">
              <Icon name="trash-indigo" size="sm" />
              <span className="p-button-label">Delete</span>
            </Button>
          </>
        }
      />

      <div className="details-layout">
        <BookCover title={book.title} coverUrl={book.coverUrl} variant="details" sizes={DETAILS_COVER_SIZES} priority />

        <div className="details-body">
          <dl className="details-list" data-testid="book-details">
            <div className="details-item">
              <dt>Category</dt>
              <dd>{book.category}</dd>
            </div>
            <div className="details-item">
              <dt>Price</dt>
              <dd className="details-price">{formatPrice(book.priceInr)}</dd>
            </div>
            <div className="details-item">
              <dt>ISBN-13</dt>
              <dd>{book.isbn ?? notSet}</dd>
            </div>
            <div className="details-item">
              <dt>Published on</dt>
              <dd>{formatDate(book.publishedAt) ?? notSet}</dd>
            </div>
            <div className="details-item">
              <dt>Rating</dt>
              <dd>
                {book.ratingCount > 0
                  ? `${formatRating(book.rating)} out of 5 from ${formatCount(book.ratingCount)} readers`
                  : "No ratings yet"}
              </dd>
            </div>
            <div className="details-item">
              <dt>Added</dt>
              <dd>{formatDateTime(book.createdAt)}</dd>
            </div>
            <div className="details-item">
              <dt>Last updated</dt>
              <dd>{formatDateTime(book.updatedAt)}</dd>
            </div>
          </dl>

          <section className="details-description" aria-labelledby="description-heading">
            <h2 id="description-heading" className="details-section-title">
              Description
            </h2>
            {book.description ? <p className="details-text">{book.description}</p> : <p>{notSet}</p>}
          </section>
        </div>
      </div>

      <DeleteBookDialog
        book={confirming ? book : null}
        onClose={() => setConfirming(false)}
        onDeleted={() => router.push(ADMIN_BOOKS_ROUTES.list)}
      />
    </div>
  );
}
