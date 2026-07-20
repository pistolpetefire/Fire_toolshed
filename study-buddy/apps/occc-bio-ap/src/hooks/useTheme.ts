import { useEffect } from 'react';
import type { UserProgress } from '../types';

export function useTheme(theme: UserProgress['theme']) {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark);
    };

    if (theme === 'dark') {
      apply(true);
      return;
    }
    if (theme === 'light') {
      apply(false);
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);
}
