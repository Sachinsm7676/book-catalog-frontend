// WM | Three digit comma rule: every number shown to a user is grouped in thousands.
const groupedNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** 1284 -> "1,284" */
export const formatCount = (value: number): string => groupedNumber.format(value);

/** 1299 -> "₹1,299" (prices are stored as whole rupees) */
export const formatPrice = (amountInr: number): string => `₹${groupedNumber.format(amountInr)}`;

/** 4.8 -> "4.8" (always one decimal, as in the design) */
export const formatRating = (rating: number): string => rating.toFixed(1);
