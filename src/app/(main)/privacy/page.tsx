import type { Metadata } from "next";
import { InfoPage } from "@/components/common/InfoPage";

export const metadata: Metadata = { title: "Privacy" };

/** Route /privacy: what the demo stores, and where. */
export default function PrivacyPage() {
  return (
    <InfoPage
      testId="privacy-page"
      title="Privacy"
      subtitle="What this demo keeps, and where."
      sections={[
        {
          heading: "No account, no tracking",
          body: <p>There is no sign-in, and the site uses no analytics or advertising cookies.</p>,
        },
        {
          heading: "Your cart stays in your browser",
          body: (
            <p>
              The books in your cart and the discount code you applied are saved in this browser only, so they are still
              there after a reload. They are never sent to the server. Clearing this site&apos;s data in your browser
              removes them.
            </p>
          ),
        },
        {
          heading: "Books you add are public",
          body: (
            <p>
              Books added or changed in Manage books are saved in the demo database and everyone who opens the demo can
              see them. Please do not enter personal information.
            </p>
          ),
        },
        {
          heading: "Hosting",
          body: (
            <p>
              The website and the book service run on third-party hosting, which may keep standard request logs, such as
              the time of a request and the address it came from.
            </p>
          ),
        },
      ]}
    />
  );
}
