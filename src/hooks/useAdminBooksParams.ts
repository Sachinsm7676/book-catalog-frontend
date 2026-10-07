"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import type { BooksListParams } from "@/types/book";
import { buildAdminBooksQuery, parseAdminBooksParams } from "@/utils/admin-books-params";

/**
 * Manage-list filters, kept in the URL like the catalog's: a filtered view survives a reload, a trip to
 * the details screen and back, and can be shared. Changes merge into the newest requested state, so a
 * keystroke and a dropdown change made close together do not overwrite each other.
 */
export function useAdminBooksParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseAdminBooksParams(searchParams), [searchParams]);

  const latest = useRef(params);
  latest.current = params;

  const navigate = useCallback(
    (patch: Partial<BooksListParams>, mode: "push" | "replace") => {
      const next = { ...latest.current, ...patch };
      latest.current = next;
      const url = `${ADMIN_BOOKS_ROUTES.list}${buildAdminBooksQuery(next)}`;
      if (mode === "push") router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [router],
  );

  /** The query string of the current view, so the details and edit screens can link back to it */
  const listHref = `${ADMIN_BOOKS_ROUTES.list}${buildAdminBooksQuery(params)}`;

  return { params, navigate, listHref };
}
