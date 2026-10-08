import Image from "next/image";
import { ICON_SIZE, type IconSize } from "@/constants/design";

/** Icon files exported from Figma, stored as /public/assets/icons/icon-<name>-<colour>.svg (WM rule). */
export type IconName =
  | "search-grey"
  | "search-x-indigo"
  | "shopping-cart-indigo"
  | "chevron-down-grey"
  | "chevron-left-grey"
  | "chevron-right-black"
  | "star-amber"
  | "book-open-grey"
  | "book-open-white"
  | "trash-indigo"
  | "arrow-right-white"
  | "lock-grey"
  | "calendar-grey";

interface IconProps {
  name: IconName;
  /** token size used in the design frame (xs 16, sm 18, md 20, lg 22, xl 32) */
  size: IconSize;
  className?: string;
}

/**
 * Decorative icon (hidden from screen readers; the surrounding control carries the label).
 * Renders on the server too (not-found page), so it joins its classes without PrimeReact's client-only helper.
 */
export function Icon({ name, size, className }: IconProps) {
  const pixels = ICON_SIZE[size];
  const classes = ["icon", `icon-${name}`, className].filter(Boolean).join(" ");
  return (
    <Image
      src={`/assets/icons/icon-${name}.svg`}
      width={pixels}
      height={pixels}
      alt=""
      aria-hidden="true"
      unoptimized
      className={classes}
    />
  );
}
