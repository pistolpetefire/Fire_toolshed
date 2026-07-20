import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function HubNotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <p className="font-display text-5xl font-bold text-indigo-600">404</p>
      <h1 className="mt-3 font-display text-xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        That path isn&apos;t part of Study Buddy. Head back to the class list.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Home className="h-4 w-4" /> Study Buddy home
      </Link>
    </div>
  );
}
