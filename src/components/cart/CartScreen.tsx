"use client";

import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { CartEmpty } from "./CartEmpty";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/common/Icon";
import { useCart } from "@/components/providers/CartProvider";
import { TOAST_LIFE_MS } from "@/constants/catalog";
import type { Book } from "@/types/book";
import { formatCount } from "@/utils/format";

/** /cart: the books in the cart with the order summary, or the empty state. Books are read from the API by id. */
export function CartScreen() {
  const { items, count, removeItem, isLoading, loadError, retryLoad } = useCart();
  const toast = useRef<Toast>(null);

  const isEmpty = count === 0;
  const subtitle = isEmpty
    ? "Ready when you are."
    : `${formatCount(count)} digital ${count === 1 ? "book" : "books"} in your cart`;

  const handleRemove = (book: Book) => removeItem(book.id);

  // Checkout is outside the homework scope: the button stays as drawn and explains itself
  const handleCheckout = () =>
    toast.current?.show({
      severity: "info",
      summary: "Checkout is not part of this demo",
      detail: "This demo stops at the cart.",
      life: TOAST_LIFE_MS,
    });

  let content;
  if (loadError && !isEmpty) {
    content = (
      <EmptyState
        testId="cart-error"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="We could not load your cart"
        text={loadError.message}
        action={
          <Button type="button" onClick={retryLoad}>
            <span className="p-button-label">Try again</span>
          </Button>
        }
      />
    );
  } else if (isLoading && !isEmpty) {
    content = (
      <div className="cart-loading" role="status" data-testid="cart-loading">
        <ProgressSpinner className="loading-spinner" strokeWidth="4" aria-hidden="true" />
        <p className="cart-loading-text">Loading your cart…</p>
      </div>
    );
  } else if (isEmpty) {
    content = <CartEmpty />;
  } else {
    content = (
      <div className="cart-layout">
        <ul className="cart-items" aria-label="Books in your cart">
          {items.map((book) => (
            <li key={book.id}>
              <CartItem book={book} onRemove={handleRemove} />
            </li>
          ))}
        </ul>
        <OrderSummary onCheckout={handleCheckout} />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Toast ref={toast} position="bottom-right" />

      {/* Section heading */}
      <header className="cart-heading">
        <h1 className="cart-title">Your cart</h1>
        <p className="cart-subtitle" aria-live="polite" data-testid="cart-subtitle">
          {subtitle}
        </p>
      </header>

      {/* Items + summary, loading, error, or the empty state */}
      {content}
    </div>
  );
}
