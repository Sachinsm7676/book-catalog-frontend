"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { CATALOG_ROUTE } from "@/constants/catalog";
import type { BooksListParams } from "@/types/book";
import { buildCatalogQuery, parseCatalogParams } from "@/utils/catalog-params";

interface NavigateOptions {
  /** push creates a history entry (chips, sort, pages, Clear filters); replace does not (search keystrokes, URL clean-up) */
  mode: "push" | "replace";
}

interface CatalogNavigationValue {
  /** Filters parsed from the committed URL */
  params: BooksListParams;
  /** The committed query string without "?", for comparing against the canonical form */
  rawQuery: string;
  /** Merge a change into the newest requested state and navigate to it */
  navigate: (patch: Partial<BooksListParams>, options: NavigateOptions) => BooksListParams;
}

const CatalogNavigationContext = createContext<CatalogNavigationValue | null>(null);

/**
 * One place that turns filter changes into catalog URLs. The header (search) and the catalog (chips,
 * sort, pages) both go through it, and every change is merged into the LATEST requested state rather
 * than the last committed URL. Without that, two quick actions overwrite each other: a letter typed
 * and a chip clicked inside the debounce window, or a click while a navigation is still in flight.
 */
export function CatalogNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.toString();
  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams]);

  // Newest requested state, and the query of the navigation we are still waiting for
  const latest = useRef<BooksListParams>(params);
  const pending = useRef<string | null>(null);

  // A committed URL becomes the newest known state unless a newer navigation is still in flight
  useEffect(() => {
    const committed = buildCatalogQuery(params);
    if (pending.current === null || pending.current === committed) {
      pending.current = null;
      latest.current = params;
    }
  }, [params]);

  const navigate = useCallback(
    (patch: Partial<BooksListParams>, { mode }: NavigateOptions): BooksListParams => {
      const next: BooksListParams = { ...latest.current, ...patch };
      latest.current = next;
      const query = buildCatalogQuery(next);
      pending.current = query;
      const url = `${CATALOG_ROUTE}${query}`;
      if (mode === "push") {
        router.push(url, { scroll: false });
      } else {
        router.replace(url, { scroll: false });
      }
      return next;
    },
    [router],
  );

  const value = useMemo(() => ({ params, rawQuery, navigate }), [params, rawQuery, navigate]);

  return <CatalogNavigationContext.Provider value={value}>{children}</CatalogNavigationContext.Provider>;
}

/** Access the catalog filters and the navigate function */
export function useCatalogNavigation(): CatalogNavigationValue {
  const context = useContext(CatalogNavigationContext);
  if (!context) {
    throw new Error("useCatalogNavigation must be used inside <CatalogNavigationProvider>");
  }
  return context;
}
