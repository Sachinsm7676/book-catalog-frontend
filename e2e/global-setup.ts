import { API_URL } from "./helpers";

/**
 * Fail fast with a useful message when the API is not running, instead of 60 tests timing out one by one.
 * Skipped when PLAYWRIGHT_BASE_URL points at a deployed build (its API is whatever that build was built with).
 */
export default async function globalSetup() {
  if (process.env.PLAYWRIGHT_BASE_URL) return;
  try {
    const response = await fetch(`${API_URL}/actuator/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(
      `The DevShelf API is not answering at ${API_URL} (${String(error)}).\n` +
        "Start it first (devshelf-api README, \"Run locally\"), or set E2E_API_URL to where it runs.",
    );
  }
}
