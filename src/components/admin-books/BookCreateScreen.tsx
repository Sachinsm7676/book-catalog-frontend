"use client";

import { useRouter } from "next/navigation";
import { BookForm } from "./BookForm";
import { PageHeading } from "@/components/common/PageHeading";
import { useToast } from "@/components/providers/ToastProvider";
import { ADMIN_BOOKS_ROUTES, BOOK_TOASTS } from "@/constants/books-admin";
import { useCreateBook } from "@/hooks/API/books/useBookMutations";
import { EMPTY_BOOK_FORM } from "@/utils/book-rules";

/** /admin/books/create: empty form; on success a toast and back to the list, where the new book is first. */
export function BookCreateScreen() {
  const router = useRouter();
  const showToast = useToast();
  const createBook = useCreateBook();

  return (
    <div className="admin-page admin-page-narrow">
      <PageHeading
        title="Add book"
        subtitle="The book appears in the catalog as soon as it is saved."
        back={{ href: ADMIN_BOOKS_ROUTES.list, label: "Back to books" }}
      />
      <BookForm
        initialValues={EMPTY_BOOK_FORM}
        submitLabel="Add book"
        pendingLabel="Adding…"
        pending={createBook.isPending || createBook.isSuccess}
        apiError={createBook.error}
        cancelHref={ADMIN_BOOKS_ROUTES.list}
        onSubmit={(request) =>
          createBook.mutate(request, {
            onSuccess: (book) => {
              showToast({ severity: "success", summary: BOOK_TOASTS.created, detail: book.title });
              router.push(ADMIN_BOOKS_ROUTES.list);
            },
          })
        }
      />
    </div>
  );
}
