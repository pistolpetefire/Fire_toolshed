import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Clock, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import {
  COURSE,
  INSTRUCTOR,
  MATERIALS,
  GRADE_ROWS,
  UNIT3_WEIGHT_NOTE,
  LETTER_CONTRACT,
  ATTENDANCE,
  LATE_POLICY,
  AI_POLICY,
  SUBMISSION,
  DISCLAIMER,
  CAMPUS,
} from '../data/syllabus';
import { EXAM_BLOCKS, courseUnits } from '../data/courseUnits';
import { p } from '../basePath';

export function Syllabus() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
          {COURSE.school} · {COURSE.term}
        </p>
        <h1 className="page-title">
          {COURSE.code}: {COURSE.title}
        </h1>
        <p className="page-subtitle">
          {COURSE.format} · {COURSE.room} · Dr. Alex K. Hughes
        </p>
      </header>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-violet-600" />
          <h2 className="font-display text-lg font-semibold">Instructor</h2>
        </div>
        <p className="mt-3 text-lg font-semibold">{INSTRUCTOR.name}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.emailNote}
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.office}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            {INSTRUCTOR.hours}
          </li>
        </ul>
        <a href={INSTRUCTOR.zoom} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
          Canvas (Zoom link lives there) <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <p className="mt-1 text-xs text-slate-500">{INSTRUCTOR.zoomNote}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{COURSE.description}</p>
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Required materials (all free except your time)</h2>
        <p className="mt-2 text-sm text-slate-500">{MATERIALS.oerHint}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {MATERIALS.required.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-display text-lg font-semibold">Grade weights</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-2 font-semibold">Item</th>
              <th className="px-5 py-2 font-semibold">Detail</th>
              <th className="px-5 py-2 font-semibold">%</th>
            </tr>
          </thead>
          <tbody>
            {GRADE_ROWS.map((row) => (
              <tr key={row.item} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-2 font-medium">{row.item}</td>
                <td className="px-5 py-2 text-slate-500">{row.detail}</td>
                <td className="px-5 py-2 tabular-nums">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-xs text-slate-500">{UNIT3_WEIGHT_NOTE}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">Contract A</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {LETTER_CONTRACT.A.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-display text-lg font-semibold">Contract B</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {LETTER_CONTRACT.B.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Unit calendar</h2>
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
                    <Link to={p(`/units/${u.id}`)} className="badge bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                      {u.chapter} {u.shortTitle} · {u.weight}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Policies that actually change the grade</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Attendance', body: `${ATTENDANCE.allowed} absences allowed. ${ATTENDANCE.fourth}. ${ATTENDANCE.sixth}. ${ATTENDANCE.eighth}. ${ATTENDANCE.tardy}` },
            { title: 'Illness', body: ATTENDANCE.illness },
            { title: 'Forgiveness Days', body: ATTENDANCE.forgivenessNote },
            { title: 'Late majors', body: `${LATE_POLICY.summary} ${LATE_POLICY.canvas}` },
            { title: 'Daily homework', body: LATE_POLICY.homework },
            { title: 'AI', body: AI_POLICY },
            { title: 'How to submit', body: `${SUBMISSION.essays} ${SUBMISSION.unit4} ${SUBMISSION.where}` },
          ].map((pol) => (
            <div key={pol.title} className="card p-4">
              <h3 className="font-semibold">{pol.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pol.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">Campus help</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {CAMPUS.map((c) => (
            <li key={c.label}>
              <a href={c.href} className="font-semibold text-violet-700 hover:underline">
                {c.label}
              </a>
              <span className="text-slate-500"> — {c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{DISCLAIMER}</p>
        </div>
      </section>

      <Link to={p('/units')} className="btn-secondary text-sm">
        <BookOpen className="h-4 w-4" /> Go to units
      </Link>
    </div>
  );
}
