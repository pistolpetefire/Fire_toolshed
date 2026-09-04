/** Mount path for this class app inside Study Buddy */
export const APP_SLUG = 'osu-fpst-1213';
export const APP_BASE = `/classes/${APP_SLUG}`;

/**
 * Prefix an in-app path with the class app base.
 * @example p('/') → '/classes/osu-fpst-1213'
 * @example p('/units') → '/classes/osu-fpst-1213/units'
 */
export function p(path = '/'): string {
  if (!path || path === '/') return APP_BASE;
  const raw = path.startsWith('/') ? path : `/${path}`;
  const qIndex = raw.indexOf('?');
  const pathname = qIndex >= 0 ? raw.slice(0, qIndex) : raw;
  const query = qIndex >= 0 ? raw.slice(qIndex) : '';
  const joined = pathname === '/' ? APP_BASE : `${APP_BASE}${pathname}`;
  return `${joined}${query}`;
}
