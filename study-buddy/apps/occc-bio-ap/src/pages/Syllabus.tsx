import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  ListOrdered,
} from 'lucide-react';
import {
  COURSE,
  INSTRUCTOR,
  MATERIALS,
  GRADE_ROWS,
  TOTAL_POINTS,
  LETTER_GRADES,
  POLICY_HIGHLIGHTS,
  DISCLAIMER,
} from '../data/syllabus';
import { EXAM_BLOCKS, courseUnits } from '../data/courseUnits';

export function Syllabus() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
          {COURSE.school} · {COURSE.term}
        </p>
        <h1 className="page-title">{COURSE.code}: {COURSE.title}</h1>
        <p className="page-subtitle">
          {COURSE.format} · {COURSE.sections.join(' · ')}
        </p>
      </header>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Instructor</h2>
        </div>
        <p className="mt-3 text-lg font-semibold">{INSTRUCTOR.name}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <a className="text-brand-600 hover:underline dark:text-brand-400" href={`mailto:${INSTRUCTOR.email}`}>
              {INSTRUCTOR.email}
            </a>
            <span className="text-slate-400">·</span>
            {INSTRUCTOR.phone}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.office} · {INSTRUCTOR.division}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Office hours: {INSTRUCTOR.hours}
          </li>
        </ul>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Course description</h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{COURSE.description}</p>
        <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">{COURSE.requiredNext}</p>
        <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Official course objectives
        </h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {COURSE.officialObjectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Systems treated in depth this semester:{' '}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {COURSE.coveredSystems.join(', ')}
          </span>
          . Cardiovascular, respiratory, digestive, endocrine, urinary, lymphatic, and reproductive are BIO 1414.
        </p>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Materials</h2>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {MATERIALS.required.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-500">
          <strong>Optional:</strong> {MATERIALS.optional}
        </p>
        <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
          {MATERIALS.dayOne}
        </p>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <h2 className="font-display text-lg font-semibold">Grading · {TOTAL_POINTS} points</h2>
          <p className="text-sm text-slate-500">Senter rounds 0.5 and up on exams and the final grade.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-2 font-semibold sm:px-6">Item</th>
                <th className="px-3 py-2 font-semibold">Count</th>
                <th className="px-5 py-2 text-right font-semibold sm:px-6">Points</th>
              </tr>
            </thead>
            <tbody>
              {GRADE_ROWS.map((row) => (
                <tr key={row.item} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-2.5 sm:px-6">{row.item}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.detail}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums sm:px-6">{row.points}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold dark:border-slate-700 dark:bg-slate-800/40">
                <td className="px-5 py-2.5 sm:px-6" colSpan={2}>
                  Total
                </td>
                <td className="px-5 py-2.5 text-right tabular-nums sm:px-6">{TOTAL_POINTS}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid gap-2 border-t border-slate-100 p-5 text-xs dark:border-slate-800 sm:grid-cols-5 sm:px-6">
          {LETTER_GRADES.map((g) => (
            <div key={g.letter} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
              <div className="font-bold">
                {g.letter} <span className="font-normal text-slate-500">({g.gpa})</span>
              </div>
              <div className="text-slate-500">{g.range}</div>
              <div className="tabular-nums text-slate-500">{g.points} pts</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-brand-500" />
          <div>
            <h2 className="font-display text-lg font-semibold">Five exam blocks</h2>
            <p className="text-sm text-slate-500">
              10 official units map onto 5 unit exams / study guides / lecture quizzes. Confirm pairing and dates
              in Moodle — they are not printed in the syllabus.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAM_BLOCKS.map((block) => (
            <div
              key={block.id}
              className="rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800"
            >
              <p className="font-semibold">{block.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{block.note}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {block.unitIds.map((id) => {
                  const u = courseUnits.find((c) => c.id === id);
                  if (!u) return null;
                  return (
                    <Link
                      key={id}
                      to={p(`/units/${id}`)}
                      className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300"
                    >
                      Unit {u.number}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <Link to={p('/units')} className="btn-primary mt-4">
          Open the unit path <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="font-display text-lg font-semibold">Policies that hit your grade</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {POLICY_HIGHLIGHTS.map((pol) => (
            <div key={pol.title} className="card p-4">
              <h3 className="font-semibold">{pol.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pol.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
    </div>
  );
}
