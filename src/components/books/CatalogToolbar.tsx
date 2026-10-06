"use client";

import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { Icon } from "@/components/common/Icon";
import { SORT_OPTIONS } from "@/constants/catalog";
import type { SortOption } from "@/types/book";
import { formatCount } from "@/utils/format";

const SORT_INPUT_ID = "sort-books";

interface CatalogToolbarProps {
  /** loading: placeholder instead of the count; error: no count at all; ready: "N books" */
  status: "loading" | "error" | "ready";
  totalElements: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/** Results count on the left, sort control on the right. */
export function CatalogToolbar({ status, totalElements, sort, onSortChange }: CatalogToolbarProps) {
  const selected = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  return (
    <div className="results-bar">
      {/* Count slot */}
      {status === "loading" ? (
        <span className="results-count-skeleton" aria-hidden="true">
          <Skeleton width="100%" height="100%" />
        </span>
      ) : status === "ready" ? (
        <p className="results-count" aria-live="polite">
          {formatCount(totalElements)} {totalElements === 1 ? "book" : "books"}
        </p>
      ) : (
        <span />
      )}

      {/* Sort control. The label names the keyboard-focusable input; the native select gets its own name. */}
      <div className="sort-control">
        <label htmlFor={SORT_INPUT_ID} className="visually-hidden">
          Sort books
        </label>
        <Dropdown
          inputId={SORT_INPUT_ID}
          className="sort-dropdown"
          panelClassName="sort-panel"
          value={sort}
          options={[...SORT_OPTIONS]}
          optionLabel="label"
          optionValue="value"
          onChange={(event: DropdownChangeEvent) => onSortChange(event.value as SortOption)}
          valueTemplate={
            <>
              <span className="sort-label">Sort by</span>
              <span className="sort-value">{selected.label}</span>
            </>
          }
          dropdownIcon={<Icon name="chevron-down-grey" size="sm" />}
          pt={{ select: { "aria-label": "Sort books" } }}
        />
      </div>
    </div>
  );
}
