import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll position on every client-side navigation (hub + class apps). */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
