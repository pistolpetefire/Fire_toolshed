import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Construction, Bell } from 'lucide-react';
import { getAppBySlug } from '../catalog';

/**
 * Placeholder page for class apps that are not live yet.
 * Linked from hub cards so students know what's planned.
 */
export function ComingSoon() {
  const { slug } = useParams<{ slug: string }>();
  const app = slug ? getAppBySlug(slug) : undefined;

  if (!app) return <Navigate to="/" replace />;
  if (app.status === 'live' || app.status === 'beta') {
    return <Navigate to={app.path} replace />;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> All classes
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
          <Construction className="h-7 w-7" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
          Coming soon
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">{app.title}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{app.courseCodes.join(' · ')}</p>
        <p className="mt-1 text-xs text-slate-400">{app.school}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{app.description}</p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm dark:bg-slate-800/60">
          <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <Bell className="h-4 w-4 text-indigo-500" /> What to expect
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
            <li>Dedicated study tools for {app.subject}</li>
            <li>Its own progress (won&apos;t mix with other classes)</li>
            <li>Added under <code className="text-xs">apps/{app.slug}</code> when ready</li>
          </ul>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Study Buddy
        </Link>
      </div>
    </div>
  );
}
