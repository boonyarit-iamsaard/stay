/**
 * The public API of the health feature. Everything else is internal — import it
 * from its own path inside the feature, not from here.
 */

export type { ApiHealth } from "./lib/fetch-api-health";
export { fetchApiHealth } from "./lib/fetch-api-health";
