"use client";

import { Paginator, type PaginatorPageChangeEvent, type PaginatorTemplateOptions } from "primereact/paginator";
import { classNames } from "primereact/utils";
import { Icon } from "@/components/common/Icon";

interface CatalogPaginationProps {
  /** 1-based current page, taken from the URL so the highlight moves with the click */
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

/**
 * PrimeReact Paginator with the designed 44px square controls.
 * Figma draws page 1 only (grey previous chevron, black next chevron); the other states reuse the same
 * two assets, mirrored with CSS where needed (docs/design-check.md, Q9).
 */
export function CatalogPagination({ page, size, totalElements, onPageChange }: CatalogPaginationProps) {
  const template: PaginatorTemplateOptions = {
    layout: "PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options) => (
      <button
        type="button"
        className="pagination-control"
        onClick={options.onClick}
        disabled={options.disabled}
        aria-label="Previous page"
      >
        {options.disabled ? (
          <Icon name="chevron-left-grey" size="md" />
        ) : (
          <Icon name="chevron-right-black" size="md" className="icon-flip-x" />
        )}
      </button>
    ),
    NextPageLink: (options) => (
      <button
        type="button"
        className="pagination-control"
        onClick={options.onClick}
        disabled={options.disabled}
        aria-label="Next page"
      >
        {options.disabled ? (
          <Icon name="chevron-left-grey" size="md" className="icon-flip-x" />
        ) : (
          <Icon name="chevron-right-black" size="md" />
        )}
      </button>
    ),
    PageLinks: (options) => {
      const active = options.page === options.currentPage;
      return (
        <button
          type="button"
          className={classNames("pagination-page", { "is-active": active })}
          onClick={options.onClick}
          aria-current={active ? "page" : undefined}
          aria-label={`Page ${options.page + 1}`}
        >
          {options.page + 1}
        </button>
      );
    },
  };

  return (
    <nav className="pagination-wrap" aria-label="Catalog pages">
      <Paginator
        className="pagination"
        first={(page - 1) * size}
        rows={size}
        totalRecords={totalElements}
        template={template}
        onPageChange={(event: PaginatorPageChangeEvent) => onPageChange(event.page + 1)}
      />
    </nav>
  );
}
