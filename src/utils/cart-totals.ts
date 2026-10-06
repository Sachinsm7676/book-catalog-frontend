import { DISCOUNT_CODES, GST_RATE } from "@/constants/cart";
import type { Book } from "@/types/book";
import type { CartTotals } from "@/types/cart";

/** Codes are compared trimmed and upper-cased: " dev10 " is DEV10 */
export const normalizeDiscountCode = (code: string): string => code.trim().toUpperCase();

/** Discount rate for a code, or null when the code is unknown */
export function lookupDiscountRate(code: string | null): number | null {
  if (!code) return null;
  const rate = DISCOUNT_CODES[normalizeDiscountCode(code)];
  return rate === undefined ? null : rate;
}

/**
 * Order summary maths, pure so it can be checked by hand:
 * subtotal = sum of prices; discount = subtotal x rate (rounded); tax = 18% of the discounted
 * subtotal (rounded); total = discounted subtotal + tax. With the two seeded books:
 * 999 + 1,299 = 2,298 · tax 414 · total 2,712, matching the Figma frame.
 */
export function calculateCartTotals(items: readonly Book[], discountRate = 0): CartTotals {
  const subtotal = items.reduce((sum, book) => sum + book.priceInr, 0);
  const discount = Math.round(subtotal * discountRate);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * GST_RATE);
  return { subtotal, discountRate, discount, taxable, tax, total: taxable + tax };
}
