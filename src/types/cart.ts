/** What the cart persists: book ids (resolved against the catalog) and the applied discount code */
export interface CartState {
  bookIds: string[];
  discountCode: string | null;
}

/** Outcome of adding a book: digital books are held once, there is no quantity */
export type AddItemResult = "added" | "already-in-cart";

/** Outcome of applying a discount code */
export type ApplyDiscountResult = "applied" | "invalid" | "empty";

/** Money lines of the order summary, in whole rupees */
export interface CartTotals {
  subtotal: number;
  discountRate: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
}
