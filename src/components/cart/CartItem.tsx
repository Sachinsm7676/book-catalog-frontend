"use client";

import { Button } from "primereact/button";
import { BookCover } from "@/components/books/BookCover";
import { Icon } from "@/components/common/Icon";
import { BOOK_FORMATS_LABEL } from "@/constants/cart";
import { CART_COVER_SIZES } from "@/constants/design";
import type { Book } from "@/types/book";
import { formatPrice } from "@/utils/format";

interface CartItemProps {
  book: Book;
  onRemove: (book: Book) => void;
}

/** One book in the cart: cover, title, author, formats, price and Remove (Figma "Cart item"). */
export function CartItem({ book, onRemove }: CartItemProps) {
  const titleId = `cart-item-title-${book.id}`;

  return (
    <article className="cart-item" data-testid="cart-item" aria-labelledby={titleId}>
      <BookCover title={book.title} coverUrl={book.coverUrl} variant="cart" sizes={CART_COVER_SIZES} />

      <div className="cart-item-details">
        <h2 className="cart-item-title" id={titleId}>
          {book.title}
        </h2>
        <p className="cart-item-meta">by {book.author}</p>
        <p className="cart-item-meta">{BOOK_FORMATS_LABEL}</p>
        <p className="cart-item-price">{formatPrice(book.priceInr)}</p>

        {/* Text button: trash icon + "Remove" */}
        <Button
          type="button"
          text
          className="cart-item-remove"
          onClick={() => onRemove(book)}
          aria-label={`Remove ${book.title} from cart`}
        >
          <Icon name="trash-indigo" size="sm" />
          <span className="p-button-label">Remove</span>
        </Button>
      </div>
    </article>
  );
}
