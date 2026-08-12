/**
 * Syllabus locker — room for a future copy of the actual course syllabus.
 *
 * How to add a syllabus later (pick one):
 *   1. Paste the text into the in-app Syllabus locker (saved on this device).
 *   2. Drop an extract into syllabus/EXTRACT.md, then copy key bullets into
 *      DEFAULT_EXAM_FOCUS.instructor below (or paste in the app).
 *   3. Edit this file and set status: 'loaded', sourceLabel, and instructor arrays.
 *
 * Default focus lists are the common OSU MATH 2153 test emphases (Stewart-style
 * 3-exam split). They are NOT your instructor's official list until you replace them.
 */
window.CALC2_SYLLABUS = {
  status: 'placeholder', // 'placeholder' | 'loaded'
  sourceLabel: null, // e.g. 'OSU-OKC MATH 2153 Fall 2026 — Prof. Name'
  courseCodes: ['MATH 2153', 'Calc II'],
  school: 'Oklahoma State (Stillwater / OSU-OKC typical)',
  textbookNote:
    'OSU Stillwater often uses Rogawski Early Transcendentals (Ch 7–11). Many older and some OSU-OKC sections use Stewart Early Transcendentals. Topic names match; section numbers differ — see the mapping table in the app.',
  howToAdd: [
    'Get a PDF or Canvas copy of your syllabus (and any “exam coverage” announcement).',
    'Paste the exam-coverage paragraphs into the Syllabus locker on the home screen, or into syllabus/EXTRACT.md.',
    'Rewrite the Key focus bullets for Exam 1 / 2 / 3 / Final so they match YOUR section.',
    'Optionally set sourceLabel and status: "loaded" in this file so the hub badge flips from Waiting to Loaded.',
  ],
  defaultExamFocus: {
    exam1: [
      'Name the technique before integrating (parts vs trig vs sub vs partial).',
      'Integration by parts: choose u with LIATE; expect one tabular polynomial×trig/exp.',
      'Trig integrals: odd power → save one and u-sub; even → power-reduce.',
      'Trig sub: three triangles. Convert dx and the radical; back-sub with a drawn triangle.',
      'Partial fractions: divide if improper; cover-up or system for coefficients.',
      'Improper: rewrite as a limit. p-test. Comparison when you cannot antiderive.',
      'Applications (if listed): set up arc length / surface / work — setup is half the points.',
    ],
    exam2: [
      'Sequence vs series: a_n → L is not the same as Σ a_n converging.',
      'Geometric: identify r; converges iff |r| < 1 to a/(1−r).',
      'n-th term test can only prove divergence (if a_n ↛ 0).',
      'Every “does it converge?” answer must name a test and show the needed limit/integral.',
      'AST: decreasing + → 0. Remainder ≤ first omitted term.',
      'Ratio/root for factorials, n!, and exponentials. Inconclusive when limit = 1.',
      'Absolute vs conditional: check Σ |a_n| first on alternating series.',
    ],
    exam3: [
      'Power series: ratio test for R, then test each endpoint as a numeric series.',
      'Manipulate 1/(1−x) = Σ x^n by substituting, differentiating, integrating.',
      'Memorize Maclaurin: e^x, sin x, cos x, 1/(1−x), ln(1+x), arctan x.',
      'Taylor remainder / “how many terms” if your instructor lists it.',
      'Parametric: dy/dx = (dy/dt)/(dx/dt); second derivative is not (d²y/dt²)/(d²x/dt²).',
      'Polar graphs: roses, cardioids, limaçons — know petals and inner loops.',
      'Polar area (½)∫ r² dθ — find the correct θ-limits from the graph, not guesswork.',
    ],
    final: [
      'Comprehensive: expect at least one technique integral, one series-test writeup, one Taylor, one polar/parametric.',
      'Polar area and arc length are the usual “after Exam 3” leftovers.',
      'Write named tests and full +C / limit notation — graders score the work.',
      'If your section allows a note sheet, put the three trig-sub triangles, series tests, and Maclaurin list on it.',
      'Re-work every missed item in this app until the Review missed list is empty.',
    ],
  },
  /** Filled when a real syllabus is added. Empty arrays mean “use defaults.” */
  instructorExamFocus: {
    exam1: [],
    exam2: [],
    exam3: [],
    final: [],
  },
};
