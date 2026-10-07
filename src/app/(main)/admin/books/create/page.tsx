import type { Metadata } from "next";
import { BookCreateScreen } from "@/components/admin-books/BookCreateScreen";

export const metadata: Metadata = { title: "Add book" };

/** Route /admin/books/create: the empty book form. */
export default function AdminBookCreatePage() {
  return <BookCreateScreen />;
}
