/**
 * Vite injects BASE_URL from vite.config `base` (always ends with /).
 * React Router basename should not have a trailing slash (except root).
 */
export function getRouterBasename(): string | undefined {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/') return undefined;
  return base.replace(/\/$/, '');
}
