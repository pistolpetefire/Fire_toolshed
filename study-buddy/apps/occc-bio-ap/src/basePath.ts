/** Mount path for this class app inside Study Buddy */
export const APP_SLUG = 'occc-bio-ap';
export const APP_BASE = `/classes/${APP_SLUG}`;

/**
 * Prefix an in-app path with the class app base.
 * @example p('/') → '/classes/occc-bio-ap'
 * @example p('/systems') → '/classes/occc-bio-ap/systems'
 * @example p('/flashcards?due=1') → '/classes/occc-bio-ap/flashcards?due=1'
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
