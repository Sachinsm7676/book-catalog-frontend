"use client";

import { Button } from "primereact/button";
import { BookCover } from "./BookCover";
import { Icon } from "@/components/common/Icon";
import type { Book } from "@/types/book";
import { formatCount, formatPrice, formatRating } from "@/utils/format";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  priority?: boolean;
}

/** One catalog entry: cover, category, title, author, rating, price and the add-to-cart action. */
export function BookCard({ book, onAddToCart, priority }: BookCardProps) {
  const titleId = `book-title-${book.id}`;
  const rating = formatRating(book.rating);
  const ratingCount = formatCount(book.ratingCount);

  return (
    <article className="book-card" data-testid="book-card" aria-labelledby={titleId}>
      <BookCover title={book.title} coverUrl={book.coverUrl} priority={priority} />

      <div className="book-info">
        <p className="book-category">{book.category}</p>
        <h3 className="book-title" id={titleId}>
          {book.title}
        </h3>
        <p className="book-author">by {book.author}</p>

        {/* Rating: the visible star/number pair, plus one sentence for screen readers */}
        {book.ratingCount > 0 ? (
          <p className="book-rating">
            <Icon name="star-amber" size="sm" />
            <span className="book-rating-value" aria-hidden="true">
              {rating}
            </span>
            <span className="book-rating-count" aria-hidden="true">
              ({ratingCount})
            </span>
            <span className="visually-hidden">{`Rated ${rating} out of 5 by ${ratingCount} readers`}</span>
          </p>
        ) : (
          <p className="book-rating book-rating-none">No ratings yet</p>
        )}

        <p className="book-price">{formatPrice(book.priceInr)}</p>

        <Button
          type="button"
          outlined
          className="book-action"
          onClick={() => onAddToCart(book)}
          aria-label={`Add ${book.title} to cart`}
        >
          <Icon name="shopping-cart-indigo" size="md" />
          <span className="p-button-label">Add to cart</span>
        </Button>
      </div>
    </article>
  );
}
