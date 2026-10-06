"use client";

import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { CATEGORY_FILTERS } from "@/constants/catalog";
import type { CategoryFilter } from "@/types/book";

interface CategoryChipsProps {
  value: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

/** Single-select category filter rendered as pill buttons (PrimeReact Button in the chip variant). */
export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <ul className="category-chips" aria-label="Filter by category">
      {CATEGORY_FILTERS.map((category) => {
        const active = category === value;
        return (
          <li key={category}>
            <Button
              type="button"
              className={classNames("chip-button", { "is-active": active })}
              aria-pressed={active}
              onClick={() => onChange(category)}
            >
              <span className="p-button-label">{category}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
