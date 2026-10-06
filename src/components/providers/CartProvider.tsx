"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, SEED_CART_BOOK_IDS } from "@/constants/cart";
import { MOCK_BOOKS } from "@/mocks/books";
import type { Book } from "@/types/book";
import type { AddItemResult, ApplyDiscountResult, CartState, CartTotals } from "@/types/cart";
import { calculateCartTotals, lookupDiscountRate, normalizeDiscountCode } from "@/utils/cart-totals";

interface CartContextValue {
  /** Books in the cart, in the order they were added (digital books: one copy each, no quantity) */
  items: Book[];
  count: number;
  discountCode: string | null;
  totals: CartTotals;
  /** false until localStorage has been read on the client */
  hydrated: boolean;
  addItem: (book: Book) => AddItemResult;
  removeItem: (bookId: string) => void;
  applyDiscount: (code: string) => ApplyDiscountResult;
  clearDiscount: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Catalog lookup for stored ids. Homework 2 replaces this with the API (ids only are persisted). */
const booksById = new Map(MOCK_BOOKS.map((book) => [book.id, book]));

/** A first-time visitor sees the two books every Figma frame shows in the cart */
const seedState = (): CartState => ({ bookIds: [...SEED_CART_BOOK_IDS], discountCode: null });

/** Parse the stored cart; anything malformed or unknown is dropped so the seed is used instead */
function readStoredCart(): CartState | null {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<CartState>;
    if (!Array.isArray(candidate.bookIds)) return null;
    return {
      bookIds: candidate.bookIds.filter((id): id is string => typeof id === "string" && booksById.has(id)),
      discountCode: typeof candidate.discountCode === "string" ? candidate.discountCode : null,
    };
  } catch {
    return null;
  }
}

/**
 * Shared cart state: the header badge, every "Add to cart" button and the cart screen read and update
 * the same object. Persisted in localStorage per browser; the server never sees it.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  // Read storage once after mount (never during render: the server has no storage and the first
  // client render must match the server HTML)
  useEffect(() => {
    const stored = readStoredCart();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  // Write only after that read, so the seed never overwrites a stored cart
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode, quota): the cart still works for this page view
    }
  }, [state, hydrated]);

  const items = useMemo(
    () => state.bookIds.map((id) => booksById.get(id)).filter((book): book is Book => Boolean(book)),
    [state.bookIds],
  );
  const discountRate = lookupDiscountRate(state.discountCode) ?? 0;
  const totals = useMemo(() => calculateCartTotals(items, discountRate), [items, discountRate]);

  const addItem = useCallback(
    (book: Book): AddItemResult => {
      if (state.bookIds.includes(book.id)) return "already-in-cart";
      setState((current) =>
        current.bookIds.includes(book.id) ? current : { ...current, bookIds: [...current.bookIds, book.id] },
      );
      return "added";
    },
    [state.bookIds],
  );

  const removeItem = useCallback((bookId: string) => {
    setState((current) => ({ ...current, bookIds: current.bookIds.filter((id) => id !== bookId) }));
  }, []);

  const applyDiscount = useCallback((code: string): ApplyDiscountResult => {
    const normalized = normalizeDiscountCode(code);
    if (!normalized) return "empty";
    if (lookupDiscountRate(normalized) === null) return "invalid";
    setState((current) => ({ ...current, discountCode: normalized }));
    return "applied";
  }, []);

  const clearDiscount = useCallback(() => {
    setState((current) => ({ ...current, discountCode: null }));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      discountCode: state.discountCode,
      totals,
      hydrated,
      addItem,
      removeItem,
      applyDiscount,
      clearDiscount,
    }),
    [items, state.discountCode, totals, hydrated, addItem, removeItem, applyDiscount, clearDiscount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Access the cart from any client component under <CartProvider> */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
