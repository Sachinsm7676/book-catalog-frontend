"use client";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { DEFAULT_DISCOUNT_CODE_INPUT } from "@/constants/cart";
import type { ApplyDiscountResult } from "@/types/cart";
import { lookupDiscountRate, normalizeDiscountCode } from "@/utils/cart-totals";

const INPUT_ID = "discount-code";
const HELP_ID = "discount-code-help";

/** Helper line for a failed attempt; the applied case is built from the code and its rate */
const ERROR_TEXT: Record<Exclude<ApplyDiscountResult, "applied">, string> = {
  invalid: "This code is not valid",
  empty: "Enter a discount code",
};

/**
 * Discount code row of the order summary: label, PrimeReact InputText (prefilled with DEV10 as drawn),
 * outlined Apply button, and a helper line (red error pattern from the Checkout frame, indigo when applied).
 */
export function DiscountCodeField() {
  const { discountCode, applyDiscount } = useCart();
  const [code, setCode] = useState(DEFAULT_DISCOUNT_CODE_INPUT);
  const [attempt, setAttempt] = useState<ApplyDiscountResult | null>(null);

  const isApplied = discountCode !== null && normalizeDiscountCode(code) === discountCode;
  const isError = !isApplied && (attempt === "invalid" || attempt === "empty");
  const appliedRate = lookupDiscountRate(discountCode);

  const help = isApplied
    ? `${discountCode} applied · ${Math.round((appliedRate ?? 0) * 100)}% off`
    : isError && attempt
      ? ERROR_TEXT[attempt]
      : null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setAttempt(applyDiscount(code));
  };

  return (
    <form className="discount-code-block" onSubmit={submit} noValidate>
      <div className={classNames("discount-code", { "is-invalid": isError })}>
        <div className="discount-code-field">
          <label htmlFor={INPUT_ID} className="discount-code-label">
            Discount code
          </label>
          <InputText
            id={INPUT_ID}
            className="discount-code-input"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setAttempt(null);
            }}
            aria-invalid={isError}
            aria-describedby={help ? HELP_ID : undefined}
            autoComplete="off"
          />
        </div>
        <Button type="submit" outlined className="discount-code-apply" disabled={isApplied}>
          <span className="p-button-label">Apply</span>
        </Button>
      </div>
      {help ? (
        <p
          id={HELP_ID}
          className={classNames("discount-code-help", { "is-error": isError, "is-success": isApplied })}
          role="status"
        >
          {help}
        </p>
      ) : null}
    </form>
  );
}
