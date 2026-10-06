"use client";

import { Button } from "primereact/button";
import { DiscountCodeField } from "./DiscountCodeField";
import { Icon } from "@/components/common/Icon";
import { useCart } from "@/components/providers/CartProvider";
import { GST_RATE } from "@/constants/cart";
import { formatPrice } from "@/utils/format";

interface OrderSummaryProps {
  onCheckout: () => void;
}

/** Order summary card: discount code, subtotal / discount / tax / total, checkout action, secure note. */
export function OrderSummary({ onCheckout }: OrderSummaryProps) {
  const { totals, discountCode } = useCart();
  const taxLabel = `Tax (${Math.round(GST_RATE * 100)}% GST)`;

  return (
    <aside className="order-summary" aria-labelledby="order-summary-title" data-testid="order-summary">
      <h2 className="order-summary-title" id="order-summary-title">
        Order summary
      </h2>

      <DiscountCodeField />

      <hr className="summary-divider" />

      {/* Money lines; announced when they change */}
      <dl className="summary-rows" aria-live="polite">
        <div className="summary-row">
          <dt>Subtotal</dt>
          <dd className="summary-row-value" data-testid="summary-subtotal">
            {formatPrice(totals.subtotal)}
          </dd>
        </div>
        {discountCode && totals.discount > 0 ? (
          <div className="summary-row" data-testid="summary-discount">
            <dt>Discount ({discountCode})</dt>
            <dd className="summary-row-value">{`−${formatPrice(totals.discount)}`}</dd>
          </div>
        ) : null}
        <div className="summary-row">
          <dt>{taxLabel}</dt>
          <dd className="summary-row-value" data-testid="summary-tax">
            {formatPrice(totals.tax)}
          </dd>
        </div>
      </dl>

      <hr className="summary-divider" />

      <dl className="summary-rows">
        <div className="summary-row summary-row-total">
          <dt>Total</dt>
          <dd data-testid="summary-total">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {/* Checkout is Homework 2; the button stays as drawn and says so when clicked */}
      <Button type="button" className="checkout-button" onClick={onCheckout}>
        <Icon name="arrow-right-white" size="md" />
        <span className="p-button-label">Proceed to checkout</span>
      </Button>

      <p className="checkout-note">
        <Icon name="lock-grey" size="xs" />
        <span>Secure checkout · Instant downloads</span>
      </p>
    </aside>
  );
}
