"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/common/Icon";
import { BOOK_CATEGORIES, BOOK_LIMITS } from "@/constants/books-admin";
import type { ApiError } from "@/types/api";
import type { BookField, BookRequest } from "@/types/book";
import {
  BOOK_FIELD_ORDER,
  pickFieldErrors,
  toBookRequest,
  validateBookField,
  validateBookForm,
  type BookFormErrors,
  type BookFormValues,
} from "@/utils/book-rules";
import { formatCount, todayIsoDate } from "@/utils/format";

/** Banner text when the browser's own checks stop the form; the API uses the same sentence for a 400. */
const FIX_FIELDS_MESSAGE = "Please correct the highlighted fields.";

const fieldId = (field: BookField) => `book-${field}`;
const errorId = (field: BookField) => `book-${field}-error`;
const hintId = (field: BookField) => `book-${field}-hint`;

interface BookFormProps {
  initialValues: BookFormValues;
  submitLabel: string;
  /** label while the request runs: "Adding…", "Saving…" */
  pendingLabel: string;
  pending: boolean;
  /** last failure from the API; field errors are moved under their inputs, the message goes in the banner */
  apiError: ApiError | null;
  cancelHref: string;
  onSubmit: (request: BookRequest) => void;
}

/**
 * Create and edit form. Rules match the API word for word (src/utils/book-rules.ts); a field is checked when
 * the user leaves it, and again on every change once it has shown an error. Submit is disabled while the
 * request runs, and nothing the user typed is lost when the API refuses it.
 */
export function BookForm({ initialValues, submitLabel, pendingLabel, pending, apiError, cancelHref, onSubmit }: BookFormProps) {
  const [values, setValues] = useState<BookFormValues>(initialValues);
  // The newest values, also between renders: a blur can fire before React has applied the last keystroke
  const latestValues = useRef(values);
  // Set the moment a valid form is sent. `pending` only turns true on the next render, so two clicks in the
  // same instant (a double click) would both get through it and create the book twice.
  const inFlight = useRef(false);
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [banner, setBanner] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const today = todayIsoDate();

  const focusField = (field: BookField) => {
    const element = formRef.current?.querySelector<HTMLElement>(`#${fieldId(field)}`);
    element?.focus();
  };

  // Move a new API failure onto the form: field messages under their inputs, the summary in the banner
  // The request finished without leaving the screen (it failed): allow the next attempt
  useEffect(() => {
    if (!pending) inFlight.current = false;
  }, [pending, apiError]);

  useEffect(() => {
    if (!apiError) return;
    const fieldErrors = pickFieldErrors(apiError.fieldErrors);
    setErrors((current) => ({ ...current, ...fieldErrors }));
    setBanner(apiError.message);
    const first = BOOK_FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) focusField(first);
  }, [apiError]);

  const update = <K extends BookField>(field: K, value: BookFormValues[K]) => {
    const next = { ...latestValues.current, [field]: value };
    latestValues.current = next;
    setValues(next);
    // Re-check live only once the field has shown an error, so the user is not scolded mid-typing
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateBookField(field, next, today) }));
  };

  const checkOnLeave = (field: BookField) => {
    const message = validateBookField(field, latestValues.current, today);
    setErrors((current) => ({ ...current, [field]: message }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pending || inFlight.current) return;
    const found = validateBookForm(values, today);
    setErrors(found);
    const first = BOOK_FIELD_ORDER.find((field) => found[field]);
    if (first) {
      setBanner(FIX_FIELDS_MESSAGE);
      focusField(first);
      return;
    }
    setBanner(null);
    inFlight.current = true;
    onSubmit(toBookRequest(latestValues.current));
  };

  /** Label, input, hint and error for one field, wired together for screen readers */
  const field = (name: BookField, label: string, input: ReactNode, options: { required?: boolean; hint?: ReactNode } = {}) => (
    <div className={classNames("form-field", `form-field-${name}`, { "has-error": Boolean(errors[name]) })}>
      <label className="form-label" htmlFor={fieldId(name)}>
        {label}
        {options.required ? (
          <span className="form-required" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="form-optional">(optional)</span>
        )}
      </label>
      {input}
      {options.hint ? (
        <p className="form-hint" id={hintId(name)}>
          {options.hint}
        </p>
      ) : null}
      {errors[name] ? (
        <p className="form-error" id={errorId(name)} data-testid={`error-${name}`}>
          <span className="form-error-text">{errors[name]}</span>
        </p>
      ) : null}
    </div>
  );

  /** aria attributes every input gets */
  const a11y = (name: BookField, required = false) => ({
    id: fieldId(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-required": required || undefined,
    "aria-describedby":
      [errors[name] ? errorId(name) : null, name in HINTED ? hintId(name) : null].filter(Boolean).join(" ") || undefined,
  });

  const descriptionLength = values.description.trim().length;

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate ref={formRef} aria-busy={pending}>
      <p className="form-legend">
        Fields marked <span className="form-required">*</span> are required.
      </p>

      {banner ? <Message severity="error" className="form-banner" text={banner} data-testid="form-banner" /> : null}

      <div className="form-grid">
        {field(
          "title",
          "Title",
          <InputText
            {...a11y("title", true)}
            className="form-input"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            onBlur={() => checkOnLeave("title")}
            autoComplete="off"
          />,
          { required: true, hint: HINTED.title },
        )}

        {field(
          "author",
          "Author",
          <InputText
            {...a11y("author", true)}
            className="form-input"
            value={values.author}
            onChange={(event) => update("author", event.target.value)}
            onBlur={() => checkOnLeave("author")}
            autoComplete="off"
          />,
          { required: true, hint: HINTED.author },
        )}

        {field(
          "category",
          "Category",
          <Dropdown
            id="book-category-dropdown"
            inputId={fieldId("category")}
            className={classNames("sort-dropdown form-dropdown", { "p-invalid": Boolean(errors.category) })}
            panelClassName="sort-panel"
            value={values.category}
            options={[...BOOK_CATEGORIES]}
            placeholder="Choose a category"
            onChange={(event) => {
              update("category", event.value);
              setErrors((current) => ({ ...current, category: undefined }));
            }}
            onBlur={() => checkOnLeave("category")}
            dropdownIcon={<Icon name="chevron-down-grey" size="sm" />}
            aria-invalid={errors.category ? true : undefined}
            aria-describedby={errors.category ? errorId("category") : undefined}
            pt={{ select: { "aria-label": "Category" } }}
          />,
          { required: true },
        )}

        {field(
          "priceInr",
          "Price (₹)",
          <InputNumber
            id="book-priceInr-number"
            inputId={fieldId("priceInr")}
            className={classNames("form-number", { "p-invalid": Boolean(errors.priceInr) })}
            inputClassName="form-input"
            value={values.priceInr}
            // onChange fires on every keystroke; onValueChange only once the field has formatted the input, which is
            // after its blur. Checking on blur with the older value flashed "Price is required." and the layout shift
            // made a click on the submit button land on nothing.
            onChange={(event) => update("priceInr", event.value ?? null)}
            onValueChange={(event) => update("priceInr", event.value ?? null)}
            onBlur={() => checkOnLeave("priceInr")}
            mode="decimal"
            locale="en-US"
            minFractionDigits={0}
            maxFractionDigits={BOOK_LIMITS.priceDecimals}
            useGrouping
            aria-invalid={errors.priceInr ? true : undefined}
            aria-required
            aria-describedby={[errors.priceInr ? errorId("priceInr") : null, hintId("priceInr")].filter(Boolean).join(" ")}
          />,
          { required: true, hint: HINTED.priceInr },
        )}

        {field(
          "isbn",
          "ISBN-13",
          <InputText
            {...a11y("isbn")}
            className="form-input"
            value={values.isbn}
            onChange={(event) => update("isbn", event.target.value)}
            onBlur={() => checkOnLeave("isbn")}
            inputMode="numeric"
            autoComplete="off"
          />,
          { hint: HINTED.isbn },
        )}

        {field(
          "publishedAt",
          "Published on",
          <InputText
            {...a11y("publishedAt")}
            className="form-input"
            type="date"
            max={today}
            value={values.publishedAt}
            onChange={(event) => update("publishedAt", event.target.value)}
            onBlur={() => checkOnLeave("publishedAt")}
          />,
          { hint: HINTED.publishedAt },
        )}

        {field(
          "coverUrl",
          "Cover image URL",
          <InputText
            {...a11y("coverUrl")}
            className="form-input"
            value={values.coverUrl}
            onChange={(event) => update("coverUrl", event.target.value)}
            onBlur={() => checkOnLeave("coverUrl")}
            inputMode="url"
            autoComplete="off"
            placeholder="https://"
          />,
          { hint: HINTED.coverUrl },
        )}

        {field(
          "description",
          "Description",
          <InputTextarea
            {...a11y("description")}
            className="form-input form-textarea"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            onBlur={() => checkOnLeave("description")}
            rows={5}
            autoResize
          />,
          {
            hint: (
              <span className={classNames({ "form-hint-over": descriptionLength > BOOK_LIMITS.descriptionMax })}>
                {formatCount(descriptionLength)} / {formatCount(BOOK_LIMITS.descriptionMax)} characters
              </span>
            ),
          },
        )}
      </div>

      <div className="form-actions">
        <Link href={cancelHref} className="p-button p-component p-button-outlined" aria-disabled={pending}>
          <span className="p-button-label">Cancel</span>
        </Link>
        <Button type="submit" disabled={pending} aria-busy={pending} data-testid="submit-book">
          <span className="p-button-label">{pending ? pendingLabel : submitLabel}</span>
        </Button>
      </div>
    </form>
  );
}

/** Help text under the inputs that have one (also tells a11y() which fields get aria-describedby to a hint) */
const HINTED: Partial<Record<BookField, string>> = {
  title: `${BOOK_LIMITS.titleMin} to ${BOOK_LIMITS.titleMax} characters.`,
  author: `${BOOK_LIMITS.authorMin} to ${BOOK_LIMITS.authorMax} characters.`,
  priceInr: "₹0 to ₹99,999.99, up to 2 decimal places.",
  isbn: "13 digits, no dashes. Must be unique.",
  publishedAt: "Today or earlier.",
  coverUrl: "A link starting with https://. Leave empty to show “Cover unavailable”.",
  description: "",
};
