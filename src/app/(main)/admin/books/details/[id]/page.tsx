import type { Metadata } from "next";
import { BookDetailsScreen } from "@/components/admin-books/BookDetailsScreen";

export const metadata: Metadata = { title: "Book details" };

/** Route /admin/books/details/[id]: one book, with Edit and Delete. The id is the book's slug. */
export default async function AdminBookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetailsScreen id={decodeURIComponent(id)} />;
}
