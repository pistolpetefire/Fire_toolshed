import { Link } from 'react-router-dom';
import { p } from '../basePath';
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  BookOpen,
  Users,
} from 'lucide-react';
import {
  COURSE,
  INSTRUCTOR,
  TAS,
  MATERIALS,
  GRADE_ROWS,
  TOTAL_POINTS,
  EXTRA_CREDIT_CAP,
  LETTER_GRADES,
  EXAM_DATES,
  POLICY_HIGHLIGHTS,
  DISCLAIMER,
} from '../data/syllabus';
import { EXAM_BLOCKS, courseUnits } from '../data/courseUnits';

export function Syllabus() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {COURSE.school} · {COURSE.term}
        </p>
        <h1 className="page-title">
          {COURSE.code}: {COURSE.title}
        </h1>
        <p className="page-subtitle">
          {COURSE.format} · {COURSE.sections.map((s) => `${s.time} (${s.crn})`).join(' · ')} · {COURSE.sections[0].room}
        </p>
      </header>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-emerald-600" />
          <h2 className="font-display text-lg font-semibold">Instructor</h2>
        </div>
        <p className="mt-3 text-lg font-semibold">{INSTRUCTOR.name}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <a className="text-emerald-700 hover:underline dark:text-emerald-400" href={`mailto:${INSTRUCTOR.email}`}>
              {INSTRUCTOR.email}
            </a>
          </li>
          <li className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.phone}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.office}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Meetings: {INSTRUCTOR.meeting}
          </li>
        </ul>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-slate-400" /> Teaching assistants
        </div>
        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {TAS.map((ta) => (
            <li key={ta.email}>
              {ta.name} ·{' '}
              <a className="text-emerald-700 hover:underline dark:text-emerald-400" href={`mailto:${ta.email}`}>
                {ta.email}
              </a>
              {ta.office ? ` · ${ta.office}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Course overview</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{COURSE.description}</p>
        <h3 className="mt-4 text-sm font-semibold">Required materials</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {MATERIALS.required.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-400">
          Quizlet class join (optional companion, not this app): {MATERIALS.quizlet}
        </p>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-display text-lg font-semibold">Grades (out of {TOTAL_POINTS})</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-2 font-semibold">Item</th>
              <th className="px-5 py-2 font-semibold">Detail</th>
              <th className="px-5 py-2 font-semibold">Pts</th>
              <th className="px-5 py-2 font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            {GRADE_ROWS.map((row) => (
              <tr key={row.item} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-2 font-medium">{row.item}</td>
                <td className="px-5 py-2 text-slate-500">{row.detail}</td>
                <td className="px-5 py-2 tabular-nums">{row.points}</td>
                <td className="px-5 py-2 tabular-nums">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-xs text-slate-500">
          Extra credit capped at {EXTRA_CREDIT_CAP} pts. Canvas shows points, not a running percent. Scale:{' '}
          {LETTER_GRADES.map((g) => `${g.letter} ${g.range}`).join(' · ')}
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Exam dates</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAM_DATES.map((ex) => (
            <div key={ex.id} className="card p-4">
              <h3 className="font-semibold">{ex.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ex.when}</p>
              <p className="text-xs text-slate-500">{ex.format}</p>
              <p className="mt-2 text-sm">{ex.covers}</p>
              {ex.id === 1 && (
                <Link to={p('/plan')} className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline">
                  Open Exam 1 study plan
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Chapter map</h2>
        {EXAM_BLOCKS.map((block) => (
          <div key={block.id} className="mb-4">
            <h3 className="text-sm font-semibold">
              {block.title} · {block.when}
            </h3>
            <p className="text-xs text-slate-500">{block.note}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {courseUnits
                .filter((u) => u.examBlock === block.id)
                .map((u) => (
                  <li key={u.id}>
                    <Link
                      to={p(`/units/${u.id}`)}
                      className={`badge ${
                        u.ready
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {u.chapter} {u.shortTitle}
                      {!u.ready ? ' · later' : ''}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Policies that affect your grade</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {POLICY_HIGHLIGHTS.map((pol) => (
            <div key={pol.title} className="card p-4">
              <h3 className="font-semibold">{pol.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pol.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{DISCLAIMER}</p>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Writing: week 8 (human influence on agroecosystems, 100 pts, Packback, due 10/11) and week 15 data interpretation.
        Week 1 country-data group assignment allows AI. Exams do not.
      </p>
      <Link to={p('/units')} className="btn-secondary text-sm">
        <BookOpen className="h-4 w-4" /> Go to chapters
      </Link>
    </div>
  );
}
