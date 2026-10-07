"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, SEED_CART_BOOK_IDS } from "@/constants/cart";
import { useGetBooksByIds } from "@/hooks/API/books/useGetBooksByIds";
import type { ApiError } from "@/types/api";
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
  /** true while the stored ids are being resolved against the API */
  isLoading: boolean;
  /** the API could not be reached or failed; the cart screen shows it with a retry */
  loadError: ApiError | null;
  retryLoad: () => void;
  addItem: (book: Book) => AddItemResult;
  removeItem: (bookId: string) => void;
  applyDiscount: (code: string) => ApplyDiscountResult;
  clearDiscount: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** A first-time visitor sees the two books every Figma frame shows in the cart */
const seedState = (): CartState => ({ bookIds: [...SEED_CART_BOOK_IDS], discountCode: null });

/** Parse the stored cart; anything malformed is dropped so the seed is used instead. Ids are checked against the API later. */
function readStoredCart(): CartState | null {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<CartState>;
    if (!Array.isArray(candidate.bookIds)) return null;
    return {
      bookIds: candidate.bookIds.filter((id): id is string => typeof id === "string"),
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

  // Stored ids → books from the API (cached per id). Nothing is requested before storage has been read.
  const resolved = useGetBooksByIds(hydrated ? state.bookIds : []);
  const items = resolved.books;

  // A book deleted since it was added drops out of the cart for good
  const missingKey = resolved.missingIds.join("|");
  useEffect(() => {
    if (!missingKey) return;
    const missing = new Set(missingKey.split("|"));
    setState((current) => ({ ...current, bookIds: current.bookIds.filter((id) => !missing.has(id)) }));
  }, [missingKey]);
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
      // The badge counts what is stored, so it does not flicker to 0 while the books load
      count: state.bookIds.length - resolved.missingIds.length,
      discountCode: state.discountCode,
      totals,
      hydrated,
      isLoading: !hydrated || resolved.isPending,
      loadError: resolved.error,
      retryLoad: resolved.refetch,
      addItem,
      removeItem,
      applyDiscount,
      clearDiscount,
    }),
    [
      items,
      state.bookIds.length,
      resolved.missingIds.length,
      resolved.isPending,
      resolved.error,
      resolved.refetch,
      state.discountCode,
      totals,
      hydrated,
      addItem,
      removeItem,
      applyDiscount,
      clearDiscount,
    ],
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
