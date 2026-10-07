import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { CartProvider } from "@/components/providers/CartProvider";
import { CatalogNavigationProvider } from "@/components/providers/CatalogNavigationProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

/** Page shell: cart, catalog navigation and toast state, header, page content, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <CatalogNavigationProvider>
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </CatalogNavigationProvider>
      </CartProvider>
    </ToastProvider>
  );
}
