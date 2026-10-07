import type { Metadata } from "next";
import { BookEditScreen } from "@/components/admin-books/BookEditScreen";

export const metadata: Metadata = { title: "Edit book" };

/** Route /admin/books/edit/[id]: the book form filled with the saved values. */
export default async function AdminBookEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookEditScreen id={decodeURIComponent(id)} />;
}
