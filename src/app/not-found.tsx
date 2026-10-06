import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/common/Icon";
import { SiteShell } from "@/components/layout/SiteShell";
import { CATALOG_ROUTE } from "@/constants/catalog";

export const metadata: Metadata = { title: "Page not found" };

/**
 * Branded 404 inside the normal shell. This page is prerendered and the shell reads the URL,
 * so the shell sits inside a Suspense boundary (it renders on the client after hydration).
 */
export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <SiteShell>
        <div className="catalog-page">
          <EmptyState
            testId="not-found"
            titleAs="h1"
            icon={<Icon name="search-x-indigo" size="xl" />}
            title="Page not found"
            text="That link is old or mistyped. The catalog is one click away."
            action={
              <Link href={CATALOG_ROUTE} className="p-button p-component">
                <span className="p-button-label">Back to the catalog</span>
              </Link>
            }
          />
        </div>
      </SiteShell>
    </Suspense>
  );
}
