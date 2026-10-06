"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { useCart } from "@/components/providers/CartProvider";
import { useCatalogNavigation } from "@/components/providers/CatalogNavigationProvider";
import { CART_ROUTE } from "@/constants/cart";
import { CATALOG_ROUTE, SEARCH_DEBOUNCE_MS } from "@/constants/catalog";
import { formatCount } from "@/utils/format";

/** Brand, cart link and search. The search box writes ?q= to the catalog URL after a short pause. */
export function SiteHeader() {
  const pathname = usePathname();
  const { params, navigate } = useCatalogNavigation();
  const { count } = useCart();

  // Controlled input: what the user is typing right now
  const [query, setQuery] = useState(params.q);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The last value this component pushed to the URL, so our own navigations never overwrite fast typing
  const lastPushed = useRef(params.q);

  // When the URL changes from elsewhere (Clear filters, back button), drop any pending search and mirror it
  useEffect(() => {
    if (params.q !== lastPushed.current) {
      if (debounce.current) {
        clearTimeout(debounce.current);
        debounce.current = null;
      }
      lastPushed.current = params.q;
      setQuery(params.q);
    }
  }, [params.q]);

  // Cancel a pending search when the header unmounts
  useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current);
    },
    [],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      debounce.current = null;
      const q = value.trim();
      lastPushed.current = q;
      // A new search restarts at page 1; keystrokes replace the history entry instead of adding to it
      navigate({ q, page: 1 }, { mode: "replace" });
    }, SEARCH_DEBOUNCE_MS);
  };

  const onCartPage = pathname === CART_ROUTE;

  return (
    <header className="site-header">
      <div className="site-header-container">
        {/* Brand */}
        <Link href={CATALOG_ROUTE} className="brand" aria-label="DevShelf home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">DevShelf</span>
        </Link>

        {/* Cart link: before the search in the DOM so the phone layout's focus order matches what is seen */}
        <Link
          href={CART_ROUTE}
          className="cart-button header-cart p-button p-component"
          aria-label={`Cart, ${formatCount(count)} items`}
          aria-current={onCartPage ? "page" : undefined}
        >
          <Icon name="shopping-cart-indigo" size="lg" />
          <span className="p-button-label">Cart</span>
          <Badge value={formatCount(count)} className="cart-count" />
        </Link>

        {/* Search */}
        <div className="header-search">
          <label className="search-field">
            <Icon name="search-grey" size="md" />
            <InputText
              className="search-field-input"
              value={query}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="Search books, authors, topics"
              aria-label="Search books, authors, topics"
              inputMode="search"
              autoComplete="off"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
