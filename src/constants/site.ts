/** Short pages linked from the footer */
export const INFO_ROUTES = {
  help: "/help",
  license: "/license",
  privacy: "/privacy",
} as const;

/** Footer links after "Manage books", in the order the Figma footer shows them */
export const FOOTER_INFO_LINKS = [
  { label: "Help", href: INFO_ROUTES.help },
  { label: "License", href: INFO_ROUTES.license },
  { label: "Privacy", href: INFO_ROUTES.privacy },
] as const;

/** Source code, linked from the License page */
export const REPO_LINKS = {
  frontend: "https://github.com/Sachinsm7676/book-catalog-frontend",
  api: "https://github.com/Sachinsm7676/devshelf-api",
} as const;
