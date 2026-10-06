import type { Metadata } from "next";
import { BookCatalog } from "@/components/books/BookCatalog";

export const metadata: Metadata = { title: "Book catalog" };

/** Route /books/list: the Home / Book catalog screen. */
export default function BookListPage() {
  return <BookCatalog />;
}
