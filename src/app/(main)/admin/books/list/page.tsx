import type { Metadata } from "next";
import { AdminBooksList } from "@/components/admin-books/AdminBooksList";

export const metadata: Metadata = { title: "Manage books" };

/** Route /admin/books/list: the manage-books list (search, filter, sort, paging, add, edit, delete). */
export default function AdminBooksListPage() {
  return <AdminBooksList />;
}
