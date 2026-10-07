"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/common/Icon";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import type { ApiError } from "@/types/api";
import { isNotFoundError } from "@/utils/api-client";

interface BookLoadStateProps {
  isPending: boolean;
  error: ApiError | null;
  onRetry: () => void;
}

/**
 * What the details and edit screens show before they have a book: a spinner, "Book not found" for a 404
 * (deleted, or a mistyped link), or the API's message with Try again for anything else.
 */
export function BookLoadState({ isPending, error, onRetry }: BookLoadStateProps) {
  if (isPending) {
    return (
      <div className="page-loading" role="status" data-testid="book-loading">
        <ProgressSpinner className="loading-spinner" strokeWidth="4" aria-hidden="true" />
        <p className="page-loading-text">Loading book…</p>
      </div>
    );
  }

  if (error && isNotFoundError(error)) {
    return (
      <EmptyState
        testId="book-not-found"
        titleAs="h1"
        icon={<Icon name="search-x-indigo" size="xl" />}
        title="Book not found"
        text={error.message}
        action={
          <Link href={ADMIN_BOOKS_ROUTES.list} className="p-button p-component">
            <span className="p-button-label">Back to books</span>
          </Link>
        }
      />
    );
  }

  return (
    <EmptyState
      testId="book-error"
      titleAs="h1"
      icon={<Icon name="search-x-indigo" size="xl" />}
      title="We could not load this book"
      text={error?.message ?? ""}
      action={
        <Button type="button" onClick={onRetry}>
          <span className="p-button-label">Try again</span>
        </Button>
      }
    />
  );
}
