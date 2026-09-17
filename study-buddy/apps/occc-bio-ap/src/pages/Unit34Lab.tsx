import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { p } from '../basePath';
import { LAB_CELL, LAB_TONICITY } from '../data/labExam';
import { LAB_TISSUES } from '../data/histologyLab';

const CARDS = [
  {
    to: '/quizzes/exam/2/lab/histology',
    title: 'Four tissues',
    meta: `${LAB_TISSUES.length} slides · 10 stations / run`,
    body: 'Name the unlabeled micrograph, then characteristic and function. Epithelium, connective, muscle, nervous.',
  },
  {
    to: '/quizzes/exam/2/lab/cell',
    title: 'Animal cell (Fig. 3.25)',
    meta: `${LAB_CELL.length} lettered structures`,
    body: 'Same unlabeled cell plate. A letter marks the structure. Name it, then characteristic and function.',
  },
  {
    to: '/quizzes/exam/2/lab/tonicity',
    title: 'Osmosis / tonicity',
    meta: `${LAB_TONICITY.length} RBC plates`,
    body: 'Hypotonic, isotonic, or hypertonic. Then how the RBC looks and which way the water moved.',
  },
  {
    to: '/quizzes/exam/2/lab/mixed',
    title: 'Mixed lab exam',
    meta: '12 stations from all three',
    body: 'Closest to a walk-around practical: tissues, cell letters, and RBC tonicity in one run.',
  },
];

export function Unit34Lab() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to={p('/quizzes')} className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Quizzes
        </Link>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Exam 2 · Units 3 &amp; 4</p>
        <h1 className="page-title">Lab exam practicals</h1>
        <p className="page-subtitle">
          Format from the four-tissue lab quiz: unlabeled instructor plate, name it from a word bank, then a
          characteristic and a function. Lecture Exam 2 (MCQ / matching / labeling) is separate.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={p(c.to)}
            className="card group flex flex-col p-5 transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700"
          >
            <h2 className="font-display text-lg font-semibold">{c.title}</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{c.meta}</p>
            <p className="mt-2 flex-1 text-sm text-slate-500">{c.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-1.5 dark:text-brand-400">
              Start <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="card space-y-2 p-5 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-semibold text-slate-800 dark:text-slate-100">Not on a plate yet</p>
        <p>
          Need unlabeled instructor photos (not labeled tables) before they go in the practical:{' '}
          <span className="font-medium">pseudostratified epithelium, transitional epithelium, blood smear,
          reticular CT, fibrocartilage, elastic CT</span>
          , and <span className="font-medium">mitosis stages (PMAT)</span> for Unit 4. Membrane chemistry stays on the
          fill-the-leaders / study plates until we can cover printed names.
        </p>
        <p>
          Look-alikes already baked into the characteristic choices: skeletal vs cardiac vs smooth; hyaline vs
          elastic cartilage; dense regular vs irregular; hypotonic vs hypertonic RBCs.
        </p>
      </div>
    </div>
  );
}
