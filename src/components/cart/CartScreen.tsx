"use client";

import { Toast } from "primereact/toast";
import { useRef } from "react";
import { CartEmpty } from "./CartEmpty";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import { useCart } from "@/components/providers/CartProvider";
import { TOAST_LIFE_MS } from "@/constants/catalog";
import type { Book } from "@/types/book";
import { formatCount } from "@/utils/format";

/** /cart: the books in the cart with the order summary, or the empty state. */
export function CartScreen() {
  const { items, count, removeItem } = useCart();
  const toast = useRef<Toast>(null);

  const isEmpty = count === 0;
  const subtitle = isEmpty
    ? "Ready when you are."
    : `${formatCount(count)} digital ${count === 1 ? "book" : "books"} in your cart`;

  const handleRemove = (book: Book) => removeItem(book.id);

  // Checkout is Homework 2: the button stays as drawn and explains itself
  const handleCheckout = () =>
    toast.current?.show({
      severity: "info",
      summary: "Checkout opens in Homework 2",
      detail: "This demo stops at the cart.",
      life: TOAST_LIFE_MS,
    });

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

      {/* Items + summary, or the empty state */}
      {isEmpty ? (
        <CartEmpty />
      ) : (
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
      )}
    </div>
  );
}
