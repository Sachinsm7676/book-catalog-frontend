// WM | Three digit comma rule: every number shown to a user is grouped in thousands.
const groupedNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const groupedMoney = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 1284 -> "1,284" */
export const formatCount = (value: number): string => groupedNumber.format(value);

/** 1299 -> "₹1,299"; 1299.5 -> "₹1,299.50" (paise only when there are any, as in the design) */
export const formatPrice = (amountInr: number): string =>
  `₹${Number.isInteger(amountInr) ? groupedNumber.format(amountInr) : groupedMoney.format(amountInr)}`;

/** 4.8 -> "4.8" (always one decimal, as in the design) */
export const formatRating = (rating: number): string => rating.toFixed(1);

// WM | Date format (English): "May 1, 2016". Dates from the API are YYYY-MM-DD with no time zone, so they are
// formatted in UTC to stop a viewer west of Greenwich seeing the previous day.
const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
// WM: time is written with AM/PM after the number. Instants are shown in the viewer's own time zone.
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** "2025-11-04" -> "November 4, 2025"; null -> null */
export const formatDate = (isoDate: string | null): string | null =>
  isoDate ? longDate.format(new Date(`${isoDate}T00:00:00Z`)) : null;

/** "2025-11-04" -> "Nov 4, 2025" (tables, where space is short) */
export const formatShortDate = (isoDate: string | null): string | null =>
  isoDate ? shortDate.format(new Date(`${isoDate}T00:00:00Z`)) : null;

/** "2026-10-07T09:30:00Z" -> "Oct 7, 2026, 3:00 PM" in the viewer's time zone */
export const formatDateTime = (instant: string): string => dateTime.format(new Date(instant));

/** A calendar day as YYYY-MM-DD, read in the viewer's time zone (never via UTC, which can shift the day) */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today in the viewer's calendar as YYYY-MM-DD (for the "not in the future" rule) */
export function todayIsoDate(now: Date = new Date()): string {
  return toIsoDate(now);
}

/** "2026-01-15" -> local midnight on 15 Jan 2026 for the date picker; null when empty or not a real date */
export function isoDateToLocalDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toIsoDate(date) === iso ? date : null;
}

/** The last moment of a YYYY-MM-DD day, locally: the date picker's upper limit (its Today button hides once now is past it) */
export function endOfLocalDay(iso: string): Date | undefined {
  const date = isoDateToLocalDate(iso);
  if (!date) return undefined;
  date.setHours(23, 59, 59, 999);
  return date;
}
