"use client";

import Image from "next/image";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { CATALOG_COVER_SIZES } from "@/constants/design";

interface BookCoverProps {
  title: string;
  coverUrl: string | null;
  /** true for above-the-fold covers so they are not lazy-loaded */
  priority?: boolean;
  /** next/image sizes hint; the catalog default fits the grid, the cart passes its own */
  sizes?: string;
  /** cart covers are 96px (80px on the phone layout) instead of the card width */
  variant?: "catalog" | "cart";
}

/** Cover image with the designed "Cover unavailable" fallback (no URL, or the image fails to load). */
export function BookCover({ title, coverUrl, priority = false, sizes = CATALOG_COVER_SIZES, variant = "catalog" }: BookCoverProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={classNames("book-cover", { "book-cover-cart": variant === "cart" })}>
      {coverUrl && !failed ? (
        <Image
          src={coverUrl}
          alt={`Cover of ${title}`}
          fill
          sizes={sizes}
          className="book-cover-image"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="book-cover-missing"
          role="img"
          aria-label={`${title}: cover unavailable`}
          data-testid="book-cover-missing"
        >
          <Icon name="book-open-grey" size="xl" />
          <span className="book-cover-missing-text">Cover unavailable</span>
        </div>
      )}
    </div>
  );
}
