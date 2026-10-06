/**
 * TypeScript mirror of the few sizes that components must pass as numbers (next/image width,
 * height and `sizes`). The SCSS tokens in src/styles/_variables.scss are the source of truth;
 * keep both files in step when a size changes.
 */

/** Icon sizes used in the frames: $icon-xs .. $icon-xl */
export const ICON_SIZE = { xs: 16, sm: 18, md: 20, lg: 22, xl: 32 } as const;
export type IconSize = keyof typeof ICON_SIZE;

/** Catalog cover widths: $cover-width-mobile and $card-width */
export const COVER_WIDTH = { mobile: 112, desktop: 276 } as const;

/** Cart cover widths: $cart-cover-width-mobile and $cart-cover-width */
export const CART_COVER_WIDTH = { mobile: 80, desktop: 96 } as const;

/** Breakpoints the layouts switch at ($breakpoints "sm" and "md") and the widest 3-column viewport */
export const BREAKPOINT = { sm: 768, md: 1024, threeColumnsMax: 1231 } as const;

/** next/image `sizes` for catalog covers: one list column under sm, a third of the viewport in the 3-column range, 276px above */
export const CATALOG_COVER_SIZES = `(max-width: ${BREAKPOINT.sm - 1}px) ${COVER_WIDTH.mobile}px, (max-width: ${BREAKPOINT.threeColumnsMax}px) 33vw, ${COVER_WIDTH.desktop}px`;

/** next/image `sizes` for cart covers */
export const CART_COVER_SIZES = `(max-width: ${BREAKPOINT.sm - 1}px) ${CART_COVER_WIDTH.mobile}px, ${CART_COVER_WIDTH.desktop}px`;

/** Cards in the first grid row on the full 1200px column; their covers load eagerly */
export const FIRST_ROW_COUNT = 4;

/** Empty-cart illustration box: $illustration-width x $illustration-height */
export const ILLUSTRATION_SIZE = { width: 200, height: 160 } as const;
