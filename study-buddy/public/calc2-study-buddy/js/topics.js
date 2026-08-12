/**
 * Calculus II Semester Study Buddy — exam units + topics
 *
 * Default split matches common Oklahoma State MATH 2153 (Calc II) courses:
 * 3 midterms + comprehensive final. Stewart numbering is the historical OSU
 * custom-text split; Rogawski numbering is the current Stillwater default
 * (Lebl and many sections: Ch 7–8 techniques, Ch 10 series, Ch 11 polar).
 *
 * When a real syllabus is dropped in, override exam.focus via syllabus.js
 * or the in-app Syllabus locker — do not change topic ids (progress keys).
 */
window.CALC2_EXAMS = [
  {
    id: 'exam1',
    label: 'Exam 1',
    short: 'E1',
    title: 'Techniques & applications of integration',
    weeks: 'Weeks 1–5',
    typical: 'Common OSU MATH 2153 Test 1',
    blurb:
      'Integration by parts, trig integrals, trig sub, partial fractions, improper integrals, and first applications (arc length / surface / work).',
    stewart: '7.1–7.5, 7.8, 8.1–8.3',
    rogawski: '7.1–7.3, 7.5–7.8; 8.1 or 8.3 (section varies)',
    topicIds: ['ibp', 'trig-int', 'trig-sub', 'partial', 'improper', 'apps-int'],
  },
  {
    id: 'exam2',
    label: 'Exam 2',
    short: 'E2',
    title: 'Sequences & series tests',
    weeks: 'Weeks 6–10',
    typical: 'Common OSU MATH 2153 Test 2',
    blurb:
      'Sequences, geometric and telescoping series, then the test toolbox: integral, comparison, AST, ratio, root, and a strategy for “which test?”',
    stewart: '11.1–11.7',
    rogawski: '10.1–10.5',
    topicIds: ['sequences', 'series-basic', 'series-tests'],
  },
  {
    id: 'exam3',
    label: 'Exam 3',
    short: 'E3',
    title: 'Power series, Taylor, parametric & polar',
    weeks: 'Weeks 11–14',
    typical: 'Common OSU MATH 2153 Test 3',
    blurb:
      'Radius/interval of convergence, representing functions as series, Taylor/Maclaurin, then parametric calculus and polar graphs.',
    stewart: '11.8–11.10, 10.1–10.3',
    rogawski: '10.6–10.8, 11.1–11.3',
    topicIds: ['power', 'taylor', 'parametric', 'polar'],
  },
  {
    id: 'final',
    label: 'Final exam',
    short: 'Final',
    title: 'Comprehensive + leftover polar calculus',
    weeks: 'Weeks 15–16',
    typical: 'University scheduled comprehensive final',
    blurb:
      'Everything from Exams 1–3, plus polar area and arc length (often taught after Exam 3). Weighted toward series and techniques.',
    stewart: 'All of the above + 10.4 (polar area/length)',
    rogawski: 'All of the above + 11.4 (polar area/length)',
    topicIds: [
      'ibp',
      'trig-int',
      'trig-sub',
      'partial',
      'improper',
      'apps-int',
      'sequences',
      'series-basic',
      'series-tests',
      'power',
      'taylor',
      'parametric',
      'polar',
    ],
    comprehensive: true,
  },
];

window.CALC2_TOPICS = [
  {
    id: 'ibp',
    exam: 'exam1',
    label: 'Integration by parts',
    short: 'IBP',
    blurb: '∫ u dv = uv − ∫ v du. LIATE / tabular. Circular IBP (e^x sin x).',
  },
  {
    id: 'trig-int',
    exam: 'exam1',
    label: 'Trigonometric integrals',
    short: 'Trig ∫',
    blurb: 'Powers of sin/cos/tan/sec. Odd-power save-one, even-power half-angle.',
  },
  {
    id: 'trig-sub',
    exam: 'exam1',
    label: 'Trigonometric substitution',
    short: 'Trig sub',
    blurb: '√(a²−x²), √(a²+x²), √(x²−a²) and the reference triangle.',
  },
  {
    id: 'partial',
    exam: 'exam1',
    label: 'Partial fractions',
    short: 'PF',
    blurb: 'Linear factors, repeats, irreducible quadratics. Divide if improper.',
  },
  {
    id: 'improper',
    exam: 'exam1',
    label: 'Improper integrals',
    short: 'Improper',
    blurb: 'Infinite limits, vertical asymptotes, p-integrals, comparison.',
  },
  {
    id: 'apps-int',
    exam: 'exam1',
    label: 'Arc length, surface & work',
    short: 'Apps',
    blurb: 'Arc length, surface of revolution, work / pumping (if on your test).',
  },
  {
    id: 'sequences',
    exam: 'exam2',
    label: 'Sequences',
    short: 'Seq',
    blurb: 'Limits of a_n, monotone + bounded, squeeze, growth races.',
  },
  {
    id: 'series-basic',
    exam: 'exam2',
    label: 'Series basics',
    short: 'Σ basics',
    blurb: 'Partial sums, geometric, telescoping, harmonic, n-th term test.',
  },
  {
    id: 'series-tests',
    exam: 'exam2',
    label: 'Convergence tests',
    short: 'Tests',
    blurb: 'Integral, comparison, limit comparison, AST, ratio, root, strategy.',
  },
  {
    id: 'power',
    exam: 'exam3',
    label: 'Power series',
    short: 'Power',
    blurb: 'Radius & interval of convergence. Term-by-term calc. 1/(1−x).',
  },
  {
    id: 'taylor',
    exam: 'exam3',
    label: 'Taylor & Maclaurin',
    short: 'Taylor',
    blurb: 'Known series, building new ones, remainder / how many terms.',
  },
  {
    id: 'parametric',
    exam: 'exam3',
    label: 'Parametric equations',
    short: 'Param',
    blurb: 'dy/dx, d²y/dx², tangent, arc length for x(t), y(t).',
  },
  {
    id: 'polar',
    exam: 'exam3',
    label: 'Polar coordinates',
    short: 'Polar',
    blurb: 'r(θ) graphs, conversions, area ½∫ r², polar arc length.',
  },
];

window.CALC2_SEMESTER_WEEKS = [
  { exam: 'exam1', label: 'Week 1 — Integration by parts', text: 'IBP MCQs + 2 workshop IBP problems on paper (include ∫ ln x and one tabular).' },
  { exam: 'exam1', label: 'Week 2 — Trig integrals & trig sub', text: 'Odd/even sin-cos strategy. Memorize the three trig-sub triangles. 3 workshop problems.' },
  { exam: 'exam1', label: 'Week 3 — Partial fractions', text: 'Always check degree. Linear / repeated / quadratic cases. Cover strategy-for-integration flowchart.' },
  { exam: 'exam1', label: 'Week 4 — Improper integrals', text: 'Rewrite as limits. p-test on [1,∞) and (0,1]. Comparison for “looks like 1/x^p”.' },
  { exam: 'exam1', label: 'Week 5 — Applications + Exam 1', text: 'Arc length / surface / one work problem. Practice Exam 1 (mixed). Clear missed list for E1 topics.' },
  { exam: 'exam2', label: 'Week 6 — Sequences', text: 'a_n limits. Monotone + bounded theorem. If series later converges, a_n must go to 0.' },
  { exam: 'exam2', label: 'Week 7 — Geometric & telescoping', text: 'Geometric |r|<1. Telescoping partial sums. Harmonic diverges. n-th term (divergence) test.' },
  { exam: 'exam2', label: 'Week 8 — Integral & comparison', text: 'Integral test hypotheses. Direct vs limit comparison. p-series vs harmonic.' },
  { exam: 'exam2', label: 'Week 9 — AST, ratio, root', text: 'Conditional vs absolute. Ratio for factorials and a^n. Strategy: “which test first?”' },
  { exam: 'exam2', label: 'Week 10 — Exam 2', text: 'Practice Exam 2. Rewrite every “justify convergence” with a named test and the limit/integral you used.' },
  { exam: 'exam3', label: 'Week 11 — Power series', text: 'Ratio test for R. Always check endpoints separately. Term-by-term integrate/differentiate.' },
  { exam: 'exam3', label: 'Week 12 — Taylor & Maclaurin', text: 'Memorize e^x, sin, cos, 1/(1−x), ln(1+x), arctan. Build others by sub / multiply / integrate.' },
  { exam: 'exam3', label: 'Week 13 — Parametric', text: 'dy/dx = y′/x′. Second derivative is d/dt(dy/dx) / (dx/dt). Arc length ∫ √(x′²+y′²).' },
  { exam: 'exam3', label: 'Week 14 — Polar + Exam 3', text: 'Sketch roses/cardioids/limaçons. Area ½∫ r². Practice Exam 3.' },
  { exam: 'final', label: 'Week 15 — Polar leftover + mix', text: 'Polar area/length if not on Exam 3. Mixed MCQs from all three exams. Formula sheet review.' },
  { exam: 'final', label: 'Week 16 — Final week', text: 'Comprehensive practice final. Clear Review missed. Sleep. Bring allowed note sheet if your section permits one.' },
];
