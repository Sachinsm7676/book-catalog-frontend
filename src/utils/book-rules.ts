import { BOOK_CATEGORIES, BOOK_LIMITS, COVER_URL_PREFIXES } from "@/constants/books-admin";
import type { Book, BookCategory, BookField, BookRequest } from "@/types/book";
import { todayIsoDate } from "@/utils/format";

/**
 * Client-side copy of the API's validation for POST/PUT /api/v1/books.
 * The messages are word for word the API's (devshelf-api README, "Validation"), so a rule the browser
 * catches and the same rule caught by the server read the same. One message per field, first failing rule wins,
 * in the same order as the server checks them.
 */

/** What the form holds while the user types: text inputs as strings, the number and dropdown as null when empty. */
export interface BookFormValues {
  title: string;
  author: string;
  category: BookCategory | null;
  priceInr: number | null;
  isbn: string;
  publishedAt: string;
  description: string;
  coverUrl: string;
}

export type BookFormErrors = Partial<Record<BookField, string>>;

export const EMPTY_BOOK_FORM: BookFormValues = {
  title: "",
  author: "",
  category: null,
  priceInr: null,
  isbn: "",
  publishedAt: "",
  description: "",
  coverUrl: "",
};

/** Field order on screen: also the order the first invalid field is focused in */
export const BOOK_FIELD_ORDER: readonly BookField[] = [
  "title",
  "author",
  "category",
  "priceInr",
  "isbn",
  "publishedAt",
  "description",
  "coverUrl",
];

const ISBN_PATTERN = /^\d{13}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const formatLimit = (value: number): string => value.toLocaleString("en-US");

/** A real calendar date in YYYY-MM-DD (rejects 2026-02-30) */
function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

const decimalPlaces = (value: number): number => {
  const [, fraction = ""] = String(value).split(".");
  return fraction.length;
};

/** Check one field. Returns the message to show under it, or undefined when it is fine. */
export function validateBookField(field: BookField, values: BookFormValues, today = todayIsoDate()): string | undefined {
  switch (field) {
    case "title": {
      const title = values.title.trim();
      if (!title) return "Title is required.";
      if (title.length < BOOK_LIMITS.titleMin || title.length > BOOK_LIMITS.titleMax)
        return `Title must be ${BOOK_LIMITS.titleMin} to ${BOOK_LIMITS.titleMax} characters.`;
      return undefined;
    }
    case "author": {
      const author = values.author.trim();
      if (!author) return "Author is required.";
      if (author.length < BOOK_LIMITS.authorMin || author.length > BOOK_LIMITS.authorMax)
        return `Author must be ${BOOK_LIMITS.authorMin} to ${BOOK_LIMITS.authorMax} characters.`;
      return undefined;
    }
    case "category":
      if (!values.category) return "Choose a category.";
      if (!BOOK_CATEGORIES.includes(values.category)) return "Choose a category from the list.";
      return undefined;
    case "priceInr": {
      const price = values.priceInr;
      if (price === null) return "Price is required.";
      if (!Number.isFinite(price)) return "Price must be a number.";
      if (price < BOOK_LIMITS.priceMin || price > BOOK_LIMITS.priceMax) return "Price must be between ₹0 and ₹99,999.99.";
      if (decimalPlaces(price) > BOOK_LIMITS.priceDecimals) return "Price can have at most 2 decimal places.";
      return undefined;
    }
    case "isbn": {
      const isbn = values.isbn.trim();
      if (isbn && !ISBN_PATTERN.test(isbn)) return `ISBN must be exactly ${BOOK_LIMITS.isbnLength} digits.`;
      return undefined;
    }
    case "publishedAt": {
      const date = values.publishedAt.trim();
      if (!date) return undefined;
      if (!isValidIsoDate(date)) return "Enter the date as YYYY-MM-DD.";
      if (date > today) return "Published date cannot be in the future.";
      return undefined;
    }
    case "description":
      if (values.description.trim().length > BOOK_LIMITS.descriptionMax)
        return `Description can be at most ${formatLimit(BOOK_LIMITS.descriptionMax)} characters.`;
      return undefined;
    case "coverUrl": {
      const url = values.coverUrl.trim();
      if (!url) return undefined;
      if (url.length > BOOK_LIMITS.coverUrlMax) return `Cover URL can be at most ${BOOK_LIMITS.coverUrlMax} characters.`;
      if (!COVER_URL_PREFIXES.some((prefix) => url.startsWith(prefix)))
        return "Cover URL must start with http://, https:// or /assets/images/.";
      return undefined;
    }
  }
}

/** Check every field; an empty object means the form can be sent. */
export function validateBookForm(values: BookFormValues, today = todayIsoDate()): BookFormErrors {
  const errors: BookFormErrors = {};
  for (const field of BOOK_FIELD_ORDER) {
    const message = validateBookField(field, values, today);
    if (message) errors[field] = message;
  }
  return errors;
}

/** Form values → request body: strings trimmed, empty optional fields sent as null (the API does the same). */
export function toBookRequest(values: BookFormValues): BookRequest {
  const optional = (value: string): string | null => value.trim() || null;
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    category: values.category,
    priceInr: values.priceInr,
    isbn: optional(values.isbn),
    publishedAt: optional(values.publishedAt),
    description: optional(values.description),
    coverUrl: optional(values.coverUrl),
  };
}

/** A saved book → the edit form's starting values */
export function toBookFormValues(book: Book): BookFormValues {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    priceInr: book.priceInr,
    isbn: book.isbn ?? "",
    publishedAt: book.publishedAt ?? "",
    description: book.description ?? "",
    coverUrl: book.coverUrl ?? "",
  };
}

/** Keep only the API field errors that belong to a form field (anything else is shown in the form's banner). */
export function pickFieldErrors(fieldErrors: Record<string, string>): BookFormErrors {
  const picked: BookFormErrors = {};
  for (const field of BOOK_FIELD_ORDER) {
    if (fieldErrors[field]) picked[field] = fieldErrors[field];
  }
  return picked;
}
