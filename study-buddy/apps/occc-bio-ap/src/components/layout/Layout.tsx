import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Bone,
  Layers,
  BrainCircuit,
  Search,
  Settings,
  Menu,
  X,
  BookOpen,
  Moon,
  Sun,
  Home,
} from 'lucide-react';
import { useProgressContext } from '../../context/ProgressContext';
import { p } from '../../basePath';

const navItems = [
  { to: p('/'), label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: p('/systems'), label: 'Body Systems', icon: Bone },
  { to: p('/flashcards'), label: 'Flashcards', icon: Layers },
  { to: p('/quizzes'), label: 'Quizzes', icon: BrainCircuit },
  { to: p('/atlas'), label: 'Atlas', icon: Search },
  { to: p('/settings'), label: 'Settings', icon: Settings },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { progress, updateProgress } = useProgressContext();

  const toggleTheme = () => {
    updateProgress((p0) => ({
      ...p0,
      theme: p0.theme === 'dark' ? 'light' : p0.theme === 'light' ? 'dark' : 'dark',
    }));
  };

  const isDark =
    progress.theme === 'dark' ||
    (progress.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }`;

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={linkClass}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </NavLink>
      ))}
      <Link
        to="/"
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        onClick={() => setMobileOpen(false)}
      >
        <Home className="h-5 w-5 shrink-0" />
        Study Buddy hub
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold leading-tight">Anatomy Hub</div>
            <div className="text-[11px] text-slate-500">BIO 1314 · BIO 1414 · OCCC</div>
          </div>
        </div>
        {nav}
        <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Studying as{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{progress.displayName}</span>
          </p>
          <p className="mt-1 text-[10px] text-slate-400">Study Buddy · class app</p>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl dark:bg-slate-900 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-display text-sm font-bold">Anatomy Hub</span>
              </div>
              <button type="button" className="btn-ghost p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="btn-ghost p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <span className="font-display text-sm font-bold">Anatomy Hub</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-ghost p-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle light/dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-800 sm:px-6">
          Study Buddy · OCCC Anatomy Hub · BIO 1314 / BIO 1414 · Progress saved in this browser
        </footer>
      </div>
    </div>
  );
}
