import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { p } from '../basePath';
import { Search, ArrowRight } from 'lucide-react';
import { structures, searchStructures } from '../data/structures';
import { bodySystems } from '../data/systems';
import type { SystemId } from '../types';

export function Atlas() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') ?? '';
  const initialSys = (params.get('system') as SystemId | null) ?? 'all';

  const [query, setQuery] = useState(initialQ);
  const [system, setSystem] = useState<SystemId | 'all'>(
    initialSys && bodySystems.some((s) => s.id === initialSys) ? initialSys : 'all'
  );

  const results = useMemo(() => {
    let list = query.trim() ? searchStructures(query) : structures;
    if (system !== 'all') {
      list = list.filter((s) => s.systemId === system);
    }
    return list;
  }, [query, system]);

  const updateQuery = (q: string) => {
    setQuery(q);
    const next = new URLSearchParams(params);
    if (q) next.set('q', q);
    else next.delete('q');
    setParams(next, { replace: true });
  };

  const updateSystem = (sys: SystemId | 'all') => {
    setSystem(sys);
    const next = new URLSearchParams(params);
    if (sys !== 'all') next.set('system', sys);
    else next.delete('system');
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="page-title">Anatomy Atlas</h1>
        <p className="page-subtitle">
          Searchable catalog of structures across all body systems. Click any entry for a full detail view.
        </p>
      </header>

      <div className="card p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            className="input pl-10"
            placeholder="Search by name, function, alias, or relation…"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={system === 'all'} onClick={() => updateSystem('all')} label="All systems" />
          {bodySystems.map((s) => (
            <FilterChip
              key={s.id}
              active={system === s.id}
              onClick={() => updateSystem(s.id)}
              label={s.shortName}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{results.length}</span> structure
        {results.length === 1 ? '' : 's'}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((s) => (
          <Link
            key={s.id}
            to={p(`/atlas/${s.id}`)}
            className="card group flex items-start gap-3 p-4 transition hover:border-brand-300 hover:shadow-sm dark:hover:border-brand-700"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                  {s.name}
                </h2>
                <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 capitalize">
                  {s.systemId}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{s.category}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{s.function}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-500" />
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="card p-10 text-center text-slate-500">
          No structures match your search. Try a different term or clear filters.
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
}
