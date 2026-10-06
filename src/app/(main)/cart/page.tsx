import type { Metadata } from "next";
import { CartScreen } from "@/components/cart/CartScreen";

export const metadata: Metadata = { title: "Your cart" };

/** Route /cart: the Cart screen (Figma "Cart — Desktop/Mobile — Default/Empty"). */
export default function CartPage() {
  return <CartScreen />;
}
