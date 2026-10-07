"use client";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { useToast } from "@/components/providers/ToastProvider";
import { BOOK_TOASTS } from "@/constants/books-admin";
import { useDeleteBook } from "@/hooks/API/books/useBookMutations";
import type { Book } from "@/types/book";
import { isNotFoundError } from "@/utils/api-client";

interface DeleteBookDialogProps {
  /** The book to delete; null keeps the dialog closed */
  book: Pick<Book, "id" | "title"> | null;
  onClose: () => void;
  /** Called after the API confirmed the delete (or the book was already gone) */
  onDeleted?: () => void;
}

/**
 * "Delete this book?" confirmation. Delete is only sent after an explicit click, the button is disabled while
 * the request runs (no double delete), and a failure stays inside the dialog with the API's message.
 */
export function DeleteBookDialog({ book, onClose, onDeleted }: DeleteBookDialogProps) {
  const showToast = useToast();
  const deleteBook = useDeleteBook();

  const close = () => {
    if (deleteBook.isPending) return;
    deleteBook.reset();
    onClose();
  };

  const confirm = () => {
    if (!book) return;
    deleteBook.mutate(book.id, {
      onSuccess: () => {
        showToast({ severity: "success", summary: BOOK_TOASTS.deleted, detail: book.title });
        deleteBook.reset();
        onDeleted?.();
      },
      onError: (error) => {
        // Someone else deleted it first: the outcome the user wanted, so treat it as done
        if (isNotFoundError(error)) {
          showToast({ severity: "info", summary: "Already deleted", detail: book.title });
          deleteBook.reset();
          onDeleted?.();
        }
      },
    });
  };

  const footer = (
    <div className="dialog-actions">
      <Button type="button" outlined onClick={close} disabled={deleteBook.isPending}>
        <span className="p-button-label">Cancel</span>
      </Button>
      <Button
        type="button"
        className="p-button-danger"
        onClick={confirm}
        disabled={deleteBook.isPending}
        aria-busy={deleteBook.isPending}
        data-testid="confirm-delete"
      >
        <span className="p-button-label">{deleteBook.isPending ? "Deleting…" : "Delete book"}</span>
      </Button>
    </div>
  );

  return (
    <Dialog
      visible={book !== null}
      onHide={close}
      header="Delete this book?"
      footer={footer}
      className="confirm-dialog"
      modal
      dismissableMask={!deleteBook.isPending}
      closable={!deleteBook.isPending}
      draggable={false}
      resizable={false}
    >
      <p className="confirm-dialog-text">
        <strong>{book?.title}</strong> will be removed from the catalog and from every cart. This cannot be undone.
      </p>
      {deleteBook.isError && !isNotFoundError(deleteBook.error) ? (
        <Message severity="error" className="form-banner" text={deleteBook.error.message} />
      ) : null}
    </Dialog>
  );
}
