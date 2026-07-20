import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  Bone,
  Dumbbell,
  Brain,
  Heart,
  Wind,
  Apple,
  FlaskConical,
  Droplets,
  Hand,
  Shield,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { bodySystems } from '../data/systems';
import { useProgressContext } from '../context/ProgressContext';
import type { SystemId } from '../types';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Bone,
  Dumbbell,
  Brain,
  Heart,
  Wind,
  Apple,
  FlaskConical,
  Droplets,
  Hand,
  Shield,
  HeartHandshake,
};

const COLOR_MAP: Record<string, string> = {
  sky: 'from-sky-500 to-sky-700',
  rose: 'from-rose-500 to-rose-700',
  violet: 'from-violet-500 to-violet-700',
  red: 'from-red-500 to-red-700',
  cyan: 'from-cyan-500 to-cyan-700',
  amber: 'from-amber-500 to-amber-700',
  fuchsia: 'from-fuchsia-500 to-fuchsia-700',
  yellow: 'from-yellow-500 to-yellow-600',
  orange: 'from-orange-500 to-orange-700',
  lime: 'from-lime-500 to-lime-700',
  pink: 'from-pink-500 to-pink-700',
};

export function SystemsList() {
  const { progress } = useProgressContext();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="page-title">Body Systems</h1>
        <p className="page-subtitle">
          Organized for OCCC Human A&amp;P (BIO 1314 / BIO 1414). Open a system for overview, key structures, and study tools.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bodySystems.map((sys) => {
          const Icon = ICONS[sys.icon] ?? Bone;
          const studied = progress.systems[sys.id as SystemId]?.studied;
          const viewed = progress.systems[sys.id as SystemId]?.structuresViewed.length ?? 0;

          return (
            <Link
              key={sys.id}
              to={p(`/systems/${sys.id}`)}
              className="card group flex flex-col overflow-hidden transition hover:shadow-md"
            >
              <div className={`bg-gradient-to-br ${COLOR_MAP[sys.color] ?? 'from-slate-500 to-slate-700'} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </div>
                  {studied && (
                    <span className="badge bg-white/20 text-white">
                      <CheckCircle2 className="h-3 w-3" /> Studied
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-display text-lg font-bold">{sys.name}</h2>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{sys.description}</p>
                <p className="mt-2 text-xs text-slate-500">{sys.courseRelevance}</p>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
                  <span>
                    {viewed}/{sys.keyStructures.length} structures viewed
                  </span>
                  <span className="flex items-center gap-1 font-medium text-brand-600 group-hover:gap-1.5 dark:text-brand-400">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
