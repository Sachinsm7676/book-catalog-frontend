"use client";

import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { ADMIN_SORT_OPTIONS, BOOK_CATEGORIES, BOOK_LIMITS } from "@/constants/books-admin";
import { SEARCH_DEBOUNCE_MS } from "@/constants/catalog";
import type { CategoryFilter, SortOption } from "@/types/book";

const CATEGORY_OPTIONS: readonly { label: string; value: CategoryFilter }[] = [
  { label: "All categories", value: "All" },
  ...BOOK_CATEGORIES.map((category) => ({ label: category, value: category })),
];

interface AdminBooksToolbarProps {
  q: string;
  category: CategoryFilter;
  sort: SortOption;
  /** search text is sent after a short pause; replace = no history entry per keystroke */
  onSearch: (q: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onSortChange: (sort: SortOption) => void;
}

/** Search (title, author or ISBN), category filter and sort of the manage list. */
export function AdminBooksToolbar({ q, category, sort, onSearch, onCategoryChange, onSortChange }: AdminBooksToolbarProps) {
  const [query, setQuery] = useState(q);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSent = useRef(q);

  // The URL changed from elsewhere (Clear filters, back button): drop a pending search and mirror it
  useEffect(() => {
    if (q !== lastSent.current) {
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = null;
      lastSent.current = q;
      setQuery(q);
    }
  }, [q]);

  useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current);
    },
    [],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      debounce.current = null;
      const trimmed = value.trim();
      lastSent.current = trimmed;
      onSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className="admin-toolbar" role="search" aria-label="Find books">
      <label className="search-field admin-search">
        <Icon name="search-grey" size="md" />
        <InputText
          className="search-field-input"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="Search by title, author or ISBN"
          aria-label="Search by title, author or ISBN"
          maxLength={BOOK_LIMITS.searchMax}
          inputMode="search"
          autoComplete="off"
          data-testid="admin-search"
        />
      </label>

      <div className="admin-filters">
        <label htmlFor="admin-category" className="visually-hidden">
          Category
        </label>
        <Dropdown
          inputId="admin-category"
          className="sort-dropdown admin-dropdown"
          panelClassName="sort-panel"
          value={category}
          options={[...CATEGORY_OPTIONS]}
          optionLabel="label"
          optionValue="value"
          onChange={(event: DropdownChangeEvent) => onCategoryChange(event.value as CategoryFilter)}
          dropdownIcon={<Icon name="chevron-down-grey" size="sm" />}
          pt={{ select: { "aria-label": "Category" } }}
          id="admin-category-dropdown"
        />

        <label htmlFor="admin-sort" className="visually-hidden">
          Sort books
        </label>
        <Dropdown
          inputId="admin-sort"
          className="sort-dropdown admin-dropdown"
          panelClassName="sort-panel"
          value={sort}
          options={[...ADMIN_SORT_OPTIONS]}
          optionLabel="label"
          optionValue="value"
          onChange={(event: DropdownChangeEvent) => onSortChange(event.value as SortOption)}
          dropdownIcon={<Icon name="chevron-down-grey" size="sm" />}
          pt={{ select: { "aria-label": "Sort books" } }}
          id="admin-sort-dropdown"
        />
      </div>
    </div>
  );
}
