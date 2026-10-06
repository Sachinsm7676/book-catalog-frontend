import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { CATALOG_ROUTE } from "@/constants/catalog";
import { ILLUSTRATION_SIZE } from "@/constants/design";

/** Empty cart (Figma "Cart — Empty"): illustration, title, text and a way back to the catalog. */
export function CartEmpty() {
  return (
    <section className="cart-empty" data-testid="cart-empty" aria-labelledby="cart-empty-title">
      <Image
        src="/assets/images/illustration-cart-empty.svg"
        width={ILLUSTRATION_SIZE.width}
        height={ILLUSTRATION_SIZE.height}
        alt=""
        aria-hidden="true"
        unoptimized
        className="cart-empty-illustration"
      />
      <h2 className="cart-empty-title" id="cart-empty-title">
        Your cart is empty
      </h2>
      <p className="cart-empty-text">Discover practical developer books and build your next skill.</p>
      <Link href={CATALOG_ROUTE} className="p-button p-component cart-empty-action">
        <Icon name="book-open-white" size="md" />
        <span className="p-button-label">Browse books</span>
      </Link>
    </section>
  );
}
