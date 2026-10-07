"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AdminBooksTable } from "./AdminBooksTable";
import { AdminBooksTableSkeleton } from "./AdminBooksTableSkeleton";
import { AdminBooksToolbar } from "./AdminBooksToolbar";
import { DeleteBookDialog } from "./DeleteBookDialog";
import { CatalogPagination } from "@/components/books/CatalogPagination";
import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/common/Icon";
import { PageHeading } from "@/components/common/PageHeading";
import { ADMIN_BOOKS_ROUTES, ADMIN_DEFAULT_SORT } from "@/constants/books-admin";
import { useGetBooksList } from "@/hooks/API/books/useGetBooksList";
import { useAdminBooksParams } from "@/hooks/useAdminBooksParams";
import type { Book } from "@/types/book";
import { formatCount } from "@/utils/format";

/**
 * /admin/books/list: every book with search, category filter, sort and paging, plus add, edit and delete.
 * Five states: loading (skeleton rows), error (API message + Try again), no books at all, no match, filled.
 */
export function AdminBooksList() {
  const { params, navigate } = useAdminBooksParams();
  const { data, isPending, isError, error, isFetching, isPlaceholderData, refetch } = useGetBooksList(params);
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const hasFilters = params.q !== "" || params.category !== "All";

  // The API clamps a page past the end (e.g. after deleting the last row of the last page): follow it in the URL
  useEffect(() => {
    if (!data || isPlaceholderData || isFetching) return;
    if (data.pageNumber !== params.page) navigate({ page: data.pageNumber }, "replace");
  }, [data, isPlaceholderData, isFetching, params.page, navigate]);

  const clearFilters = () => {
    navigate({ q: "", category: "All", sort: ADMIN_DEFAULT_SORT, page: 1 }, "push");
    resultsRef.current?.focus();
  };

  const addBookButton = (
    <Link href={ADMIN_BOOKS_ROUTES.create} className="p-button p-component" data-testid="add-book">
      <span className="p-button-label">Add book</span>
    </Link>
  );

  let content: ReactNode;
  if (isPending) {
    content = <AdminBooksTableSkeleton />;
  } else if (isError) {
    content = (
      <EmptyState
        testId="admin-error"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="We could not load the books"
        text={error.message}
        action={
          <Button type="button" onClick={() => void refetch()}>
            <span className="p-button-label">Try again</span>
          </Button>
        }
      />
    );
  } else if (data.totalElements === 0 && !hasFilters) {
    content = (
      <EmptyState
        testId="admin-empty"
        icon={<Icon name="book-open-grey" size="xl" />}
        title="No books yet"
        text="Add the first book and it will appear here and in the catalog."
        action={addBookButton}
      />
    );
  } else if (data.totalElements === 0) {
    content = (
      <EmptyState
        testId="admin-no-results"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="No books match your search"
        text="Try another title, author or ISBN, or clear the filters."
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
        <AdminBooksTable books={data.list} busy={isFetching} onDelete={setToDelete} />
        <CatalogPagination
          page={Math.min(params.page, data.totalPages)}
          size={data.size}
          totalElements={data.totalElements}
          onPageChange={(page) => {
            navigate({ page }, "push");
            window.scrollTo({ top: 0 });
          }}
          label="Book list pages"
        />
      </>
    );
  }

  const countText = isPending
    ? "Loading books…"
    : isError
      ? "Book list unavailable"
      : `${formatCount(data.totalElements)} ${data.totalElements === 1 ? "book" : "books"}${hasFilters ? " match" : " in the catalog"}`;

  return (
    <div className="admin-page">
      <PageHeading
        title="Manage books"
        subtitle={<span aria-live="polite" data-testid="admin-count">{countText}</span>}
        actions={addBookButton}
      />

      <AdminBooksToolbar
        q={params.q}
        category={params.category}
        sort={params.sort}
        onSearch={(q) => navigate({ q, page: 1 }, "replace")}
        onCategoryChange={(category) => navigate({ category, page: 1 }, "push")}
        onSortChange={(sort) => navigate({ sort, page: 1 }, "push")}
      />

      <section className="admin-results" aria-labelledby="admin-results-heading" ref={resultsRef} tabIndex={-1}>
        <h2 id="admin-results-heading" className="visually-hidden">
          Books
        </h2>
        {content}
      </section>

      <DeleteBookDialog book={toDelete} onClose={() => setToDelete(null)} onDeleted={() => setToDelete(null)} />
    </div>
  );
}
