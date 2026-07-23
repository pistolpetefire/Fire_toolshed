import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Construction, Search, Sparkles, X } from 'lucide-react';
import { CLASS_APPS, type ClassAppListing } from '../catalog';

const COLOR: Record<string, string> = {
  sky: 'from-sky-500 to-sky-700',
  emerald: 'from-emerald-500 to-emerald-700',
  violet: 'from-violet-500 to-violet-700',
  rose: 'from-rose-500 to-rose-700',
  amber: 'from-amber-500 to-amber-700',
  indigo: 'from-indigo-500 to-indigo-700',
};

type StatusFilter = 'all' | 'live' | 'coming-soon';

export function HubHome() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLASS_APPS.filter((app) => {
      if (statusFilter === 'live' && app.status !== 'live' && app.status !== 'beta') return false;
      if (statusFilter === 'coming-soon' && app.status !== 'coming-soon') return false;
      if (!q) return true;
      const hay = [
        app.title,
        app.shortTitle,
        app.subject,
        app.school,
        app.description,
        ...app.courseCodes,
        ...app.tags,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, statusFilter]);

  const live = filtered.filter((a) => a.status === 'live' || a.status === 'beta');
  const soon = filtered.filter((a) => a.status === 'coming-soon');
  const totalLive = CLASS_APPS.filter((a) => a.status === 'live' || a.status === 'beta').length;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-6 text-white shadow-lg sm:p-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Study Buddy
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your class study apps, in one place
          </h1>
          <p className="mt-3 text-sm text-indigo-100 sm:text-base">
            Each course lives in its own folder with its own progress, flashcards, and quizzes. Open a class below —
            Anatomy &amp; Physiology and Chemistry I final prep are ready; more subjects can plug in the same way.
          </p>
        </div>
      </section>

      {/* Search & filter */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <label className="sr-only" htmlFor="class-search">
          Search classes
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="class-search"
            type="search"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900"
            placeholder="Search by course code, subject, or school…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(
            [
              ['all', 'All'],
              ['live', 'Live'],
              ['coming-soon', 'Coming soon'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setStatusFilter(id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500" aria-live="polite">
          Showing {filtered.length} of {CLASS_APPS.length} class{CLASS_APPS.length === 1 ? '' : 'es'}
          {query ? ` matching “${query.trim()}”` : ''}
        </p>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="font-medium text-slate-600 dark:text-slate-300">No classes match your search.</p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
            onClick={() => {
              setQuery('');
              setStatusFilter('all');
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {live.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">Your classes</h2>
                  <p className="text-sm text-slate-500">Live study apps you can use today</p>
                </div>
                <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {totalLive} live
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {live.map((app) => (
                  <ClassCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )}

          {soon.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="font-display text-xl font-bold">Coming soon</h2>
                <p className="text-sm text-slate-500">
                  Tap a card for details — or copy{' '}
                  <code className="text-xs">apps/occc-bio-ap</code> to build the next app.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {soon.map((app) => (
                  <ClassCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Add another class app</h3>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <li>
                Copy <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">apps/_template</code> or{' '}
                <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">apps/occc-bio-ap</code>
              </li>
              <li>
                Edit <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">meta.ts</code> (course codes,
                title, path)
              </li>
              <li>
                Register it in <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">src/catalog.ts</code>{' '}
                and mount the route in <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">App.tsx</code>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

function resolveExternalHref(rel: string): string {
  // BASE_URL is e.g. / or /Fire_toolshed/study-buddy/
  const base = import.meta.env.BASE_URL || '/';
  const root = base.endsWith('/') ? base : `${base}/`;
  return `${root}${rel.replace(/^\//, '')}`;
}

function ClassCard({ app }: { app: ClassAppListing }) {
  const live = app.status === 'live' || app.status === 'beta';
  const gradient = COLOR[app.color] ?? COLOR.indigo;
  const to = live ? app.path : `/coming-soon/${app.slug}`;
  const external = live && app.externalHref ? resolveExternalHref(app.externalHref) : null;

  const className = `group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 ${
    !live ? 'opacity-95' : ''
  }`;

  const inner = (
    <>
      <div className={`bg-gradient-to-br ${gradient} p-4 text-white`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            {live ? <BookOpen className="h-5 w-5" /> : <Construction className="h-5 w-5" />}
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            {app.status === 'coming-soon' ? 'Soon' : app.status}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold">{app.title}</h3>
        <p className="mt-0.5 text-xs text-white/80">{app.courseCodes.join(' · ')}</p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-slate-500">{app.school}</p>
        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{app.subject}</p>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600 dark:text-slate-300">{app.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-400">v{app.version}</span>
          {live ? (
            <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 group-hover:gap-1.5 dark:text-indigo-400">
              Open app <ArrowRight className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              View plan <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={external} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {inner}
    </Link>
  );
}
