import { Link, NavLink, Outlet } from 'react-router-dom';
import { GraduationCap, LayoutGrid, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HubLayout() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved =
      localStorage.getItem('study-buddy:hub-theme') ??
      localStorage.getItem('study-budd:hub-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('study-buddy:hub-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#hub-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-sm font-bold leading-tight tracking-tight">Study Buddy</div>
              <div className="text-[11px] text-slate-500">Class-by-class study apps</div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Classes</span>
            </NavLink>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </header>

      <main id="hub-main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        Study Buddy · private study toolkit · each class app keeps its own progress
      </footer>
    </div>
  );
}
