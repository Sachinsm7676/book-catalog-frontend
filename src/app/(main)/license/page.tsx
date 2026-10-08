import type { Metadata } from "next";
import { InfoPage } from "@/components/common/InfoPage";
import { REPO_LINKS } from "@/constants/site";

export const metadata: Metadata = { title: "License" };

/** Route /license: what DevShelf is and where its content and code come from. */
export default function LicensePage() {
  return (
    <InfoPage
      testId="license-page"
      title="License"
      subtitle="DevShelf is a demo, not a real store."
      sections={[
        {
          heading: "A training demo",
          body: (
            <p>
              DevShelf was built for an internal frontend training (Homework 1 and 2). Nothing is sold and no payment is
              taken.
            </p>
          ),
        },
        {
          heading: "Books and covers",
          body: (
            <p>
              Titles, authors, prices and ratings are sample data made up for the demo. The cover images come from the
              DevShelf design and are used only on this site.
            </p>
          ),
        },
        {
          heading: "Source code",
          body: (
            <ul>
              <li>
                Website: <a href={REPO_LINKS.frontend}>book-catalog-frontend on GitHub</a>
              </li>
              <li>
                Book service (API): <a href={REPO_LINKS.api}>devshelf-api on GitHub</a>
              </li>
            </ul>
          ),
        },
      ]}
    />
  );
}
