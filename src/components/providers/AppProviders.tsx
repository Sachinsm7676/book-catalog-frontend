"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { useState, type ReactNode } from "react";
import { QUERY_STALE_MS } from "@/constants/catalog";

/** Client-side providers: PrimeReact configuration and the TanStack Query cache (one per browser session). */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: QUERY_STALE_MS, retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <PrimeReactProvider value={{ ripple: false }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PrimeReactProvider>
  );
}
