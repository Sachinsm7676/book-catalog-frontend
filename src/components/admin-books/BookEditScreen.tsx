"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "./BookForm";
import { BookLoadState } from "./BookLoadState";
import { PageHeading } from "@/components/common/PageHeading";
import { useToast } from "@/components/providers/ToastProvider";
import { ADMIN_BOOKS_ROUTES, BOOK_TOASTS } from "@/constants/books-admin";
import { useUpdateBook } from "@/hooks/API/books/useBookMutations";
import { useGetBookDetails } from "@/hooks/API/books/useGetBookDetails";
import { toBookFormValues } from "@/utils/book-rules";

/** /admin/books/edit/[id]: the form filled with the saved values; on success a toast and back to the list. */
export function BookEditScreen({ id }: { id: string }) {
  const router = useRouter();
  const showToast = useToast();
  const { data: book, isPending, error, refetch } = useGetBookDetails(id);
  const updateBook = useUpdateBook(id);

  if (!book) {
    return (
      <div className="admin-page admin-page-narrow">
        <BookLoadState isPending={isPending} error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="admin-page admin-page-narrow">
      <PageHeading
        title="Edit book"
        subtitle={book.title}
        back={{ href: ADMIN_BOOKS_ROUTES.details(id), label: "Back to details" }}
      />
      <BookForm
        // A fresh form per book: the starting values are read once, never overwritten while the user types
        key={book.id}
        initialValues={toBookFormValues(book)}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        pending={updateBook.isPending || updateBook.isSuccess}
        apiError={updateBook.error}
        cancelHref={ADMIN_BOOKS_ROUTES.details(id)}
        onSubmit={(request) =>
          updateBook.mutate(request, {
            onSuccess: (saved) => {
              showToast({ severity: "success", summary: BOOK_TOASTS.updated, detail: saved.title });
              router.push(ADMIN_BOOKS_ROUTES.list);
            },
          })
        }
      />
    </div>
  );
}
