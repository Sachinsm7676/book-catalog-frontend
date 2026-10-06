import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

// The header and both screens read the URL (useSearchParams), so this group renders per request instead
// of being prerendered at build time. That is also why no Suspense boundary is needed around them.
export const dynamic = "force-dynamic";

/** Shell for customer-facing pages: header, page content, footer. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
