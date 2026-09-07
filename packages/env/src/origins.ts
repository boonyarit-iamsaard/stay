/**
 * Splits the comma-separated origin list used by `CORS_ORIGIN`.
 *
 * Two frontends (`web` and `staff`) now call the same API, so the server has to
 * trust more than one origin. Order is preserved and duplicates are dropped, so
 * the value can be edited per environment without care for tidiness.
 */
export function parseOriginList(value: string): string[] {
  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return [...new Set(origins)];
}
