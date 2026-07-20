import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { Home, Search, BookOpen } from 'lucide-react';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        That route doesn&apos;t exist in OCCC Anatomy Hub. Try one of these:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to={p('/')} className="btn-primary">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
        <Link to={p('/atlas')} className="btn-secondary">
          <Search className="h-4 w-4" /> Atlas
        </Link>
        <Link to={p('/systems')} className="btn-secondary">
          <BookOpen className="h-4 w-4" /> Body systems
        </Link>
      </div>
    </div>
  );
}
