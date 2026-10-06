"use client";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useEffect, useRef, type ReactNode } from "react";
import { BookGrid } from "./BookGrid";
import { BookGridSkeleton } from "./BookGridSkeleton";
import { CatalogPagination } from "./CatalogPagination";
import { CatalogToolbar } from "./CatalogToolbar";
import { CategoryChips } from "./CategoryChips";
import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/common/Icon";
import { useCart } from "@/components/providers/CartProvider";
import { useCatalogNavigation } from "@/components/providers/CatalogNavigationProvider";
import { DEFAULT_SORT, TOAST_LIFE_MS } from "@/constants/catalog";
import { useGetBooksList } from "@/hooks/API/books/useGetBooksList";
import type { Book, BooksListParams } from "@/types/book";
import { buildCatalogQuery } from "@/utils/catalog-params";

/**
 * Home / Book catalog screen.
 * Filters (search, category, sort, page) live in the URL: a view is shareable, chips/sort/page clicks
 * create history entries so the back button steps through them, and the tests can open any state directly.
 */
export function BookCatalog() {
  const { params, rawQuery, navigate } = useCatalogNavigation();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useGetBooksList(params);
  const { addItem } = useCart();
  const toast = useRef<Toast>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // After an action that replaces the block the user clicked in, move focus to the results region
  const focusResults = () => resultsRef.current?.focus();

  const applyFilter = (patch: Partial<BooksListParams>) => navigate({ ...patch, page: 1 }, { mode: "push" });
  const goToPage = (page: number) => {
    navigate({ page }, { mode: "push" });
    window.scrollTo({ top: 0 });
  };
  const clearFilters = () => {
    navigate({ q: "", category: "All", sort: DEFAULT_SORT, page: 1, demoState: undefined }, { mode: "push" });
    focusResults();
  };
  const retry = () => {
    void refetch();
    focusResults();
  };

  // Keep the address bar honest: when the mock clamps an out-of-range page or junk params were dropped,
  // rewrite the URL once to what is actually shown (only once the data for these params has arrived)
  useEffect(() => {
    if (!data || isPlaceholderData || isFetching) return;
    const canonical = buildCatalogQuery({ ...params, page: data.pageNumber });
    const current = rawQuery ? `?${rawQuery}` : "";
    if (canonical !== current) navigate({ page: data.pageNumber }, { mode: "replace" });
  }, [data, isPlaceholderData, isFetching, params, rawQuery, navigate]);

  const handleAddToCart = (book: Book) => {
    const result = addItem(book);
    toast.current?.show(
      result === "added"
        ? { severity: "success", summary: "Added to cart", detail: book.title, life: TOAST_LIFE_MS }
        : { severity: "info", summary: "Already in your cart", detail: book.title, life: TOAST_LIFE_MS },
    );
  };

  // ---- Which of the four states is on screen: loading, error, empty, filled ----
  let content: ReactNode;
  if (isPending) {
    content = <BookGridSkeleton />;
  } else if (isError) {
    content = (
      <EmptyState
        testId="catalog-error"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="Something went wrong"
        text={error.message}
        action={
          <Button type="button" onClick={retry}>
            <span className="p-button-label">Try again</span>
          </Button>
        }
      />
    );
  } else if (data.list.length === 0) {
    content = (
      <EmptyState
        testId="catalog-empty"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="No books found"
        text="Try another search or remove filters to explore all developer books."
        action={
          <Button type="button" onClick={clearFilters}>
            <span className="p-button-label">Clear filters</span>
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        <BookGrid books={data.list} onAddToCart={handleAddToCart} busy={isFetching} />
        <CatalogPagination
          page={Math.min(params.page, data.totalPages)}
          size={data.size}
          totalElements={data.totalElements}
          onPageChange={goToPage}
        />
      </>
    );
  }

  return (
    <div className="catalog-page">
      <Toast ref={toast} position="bottom-right" />

      {/* Hero strip + controls */}
      <section className="catalog-intro" aria-labelledby="catalog-heading">
        <div className="hero-strip">
          <h1 className="hero-title" id="catalog-heading">
            Books for developers, by developers
          </h1>
          <p className="hero-text">
            Focused, practical guides to help you build better software and grow your career.
          </p>
        </div>
        <div className="catalog-controls">
          <CategoryChips value={params.category} onChange={(category) => applyFilter({ category })} />
          <CatalogToolbar
            status={isPending ? "loading" : isError ? "error" : "ready"}
            totalElements={data?.totalElements ?? 0}
            sort={params.sort}
            onSortChange={(sort) => applyFilter({ sort })}
          />
        </div>
      </section>

      {/* Results region: skeleton / error / empty / grid + pagination; focusable for the retry/clear handlers */}
      <section className="catalog-status" aria-labelledby="results-heading" ref={resultsRef} tabIndex={-1}>
        <h2 id="results-heading" className="visually-hidden">
          Results
        </h2>
        {content}
      </section>
    </div>
  );
}
