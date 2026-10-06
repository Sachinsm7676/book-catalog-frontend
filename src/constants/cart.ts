/** Route of the cart screen (Figma: "Cart — Desktop/Mobile — Default/Empty") */
export const CART_ROUTE = "/cart";

/** Indian GST applied on the (discounted) subtotal, as the frame shows "Tax (18% GST)" */
export const GST_RATE = 0.18;

/** Accepted discount codes and their rate. The frame shows DEV10 typed into the field. */
export const DISCOUNT_CODES: Readonly<Record<string, number>> = { DEV10: 0.1 };

/** What the field shows before the user types, exactly as drawn */
export const DEFAULT_DISCOUNT_CODE_INPUT = "DEV10";

/** A first-time visitor's cart: every frame shows "Cart 2" with these two books */
export const SEED_CART_BOOK_IDS: readonly string[] = ["clean-code-in-java", "mastering-react-19"];

/** localStorage key; bump the version if the stored shape changes */
export const CART_STORAGE_KEY = "devshelf.cart.v1";

/** All titles are digital books in both formats */
export const BOOK_FORMATS_LABEL = "PDF · EPUB";
