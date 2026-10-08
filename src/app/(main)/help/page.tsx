import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/common/InfoPage";
import { ADMIN_BOOKS_ROUTES } from "@/constants/books-admin";
import { CART_ROUTE } from "@/constants/cart";
import { CATALOG_ROUTE } from "@/constants/catalog";

export const metadata: Metadata = { title: "Help" };

/** Route /help: how to use the catalog, the cart and Manage books. */
export default function HelpPage() {
  return (
    <InfoPage
      testId="help-page"
      title="Help"
      subtitle="How to find a book, use the cart and manage the catalog."
      sections={[
        {
          heading: "Find a book",
          body: (
            <p>
              Search by title, author or topic from the box in the header, pick a category, or change the sort on the{" "}
              <Link href={CATALOG_ROUTE}>catalog</Link>. Your filters stay in the address bar, so you can share the view
              or go back a step with the browser&apos;s Back button.
            </p>
          ),
        },
        {
          heading: "Your cart",
          body: (
            <p>
              Each book can be added once. In the <Link href={CART_ROUTE}>cart</Link> you can remove a book and try the
              discount code DEV10 for 10&nbsp;% off; the total includes 18&nbsp;% GST. Checkout is not part of this demo.
            </p>
          ),
        },
        {
          heading: "Manage books",
          body: (
            <p>
              <Link href={ADMIN_BOOKS_ROUTES.list}>Manage books</Link> lists every book with search, category filter,
              sort and pages. Add a book, open one to see everything stored about it, edit it or delete it. Fields marked
              with * are required; deleting always asks first and cannot be undone.
            </p>
          ),
        },
        {
          heading: "The first page is slow to load",
          body: (
            <p>
              The demo&apos;s book service can be asleep after a quiet spell and take a few minutes to wake. If a page
              shows &ldquo;Try again&rdquo;, wait a moment and press it.
            </p>
          ),
        },
      ]}
    />
  );
}
