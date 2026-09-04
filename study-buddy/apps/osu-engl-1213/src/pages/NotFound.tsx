import { Link } from 'react-router-dom';
import { p } from '../basePath';
import { Home, CalendarCheck, BookOpen } from 'lucide-react';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-violet-600">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">That route doesn&apos;t exist in the ENGL 1213 Comp II Hub.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link to={p('/')} className="btn-primary">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
        <Link to={p('/planner')} className="btn-secondary">
          <CalendarCheck className="h-4 w-4" /> Planner
        </Link>
        <Link to={p('/units')} className="btn-secondary">
          <BookOpen className="h-4 w-4" /> Units
        </Link>
      </div>
    </div>
  );
}
