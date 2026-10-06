import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { CartProvider } from "@/components/providers/CartProvider";
import { CatalogNavigationProvider } from "@/components/providers/CatalogNavigationProvider";

/** Customer-facing page shell: cart and navigation state, header, page content, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CatalogNavigationProvider>
        <SiteHeader />
        <main className="site-main">{children}</main>
        <SiteFooter />
      </CatalogNavigationProvider>
    </CartProvider>
  );
}
