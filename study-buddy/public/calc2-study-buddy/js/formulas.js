/**
 * Calc II formula / strategy sheets shown in the Formula sheet view.
 * Study aid only — match your instructor’s allowed note sheet.
 */
window.CALC2_FORMULAS = [
  {
    id: 'ibp-sheet',
    exam: 'exam1',
    title: 'Integration by parts',
    items: [
      '∫ u dv = uv − ∫ v du',
      'LIATE (pick u first): Log, Inverse trig, Algebraic, Trig, Exponential',
      'Tabular: polynomial × e^{ax} / sin / cos',
      '∫ ln x dx = x ln x − x + C',
      'Circular: ∫ e^{ax} sin(bx) — IBP twice, solve for I',
    ],
  },
  {
    id: 'trig-sheet',
    exam: 'exam1',
    title: 'Trig integrals & identities',
    items: [
      'sin²θ + cos²θ = 1,  1 + tan²θ = sec²θ',
      'sin²θ = (1 − cos 2θ)/2,  cos²θ = (1 + cos 2θ)/2',
      'Odd power of sin: save one sin, u = cos (and vice versa)',
      'Even powers of sin and cos: power-reduce first',
      '∫ tan x dx = ln|sec x| + C = −ln|cos x| + C',
      '∫ sec x dx = ln|sec x + tan x| + C',
    ],
  },
  {
    id: 'trigsub-sheet',
    exam: 'exam1',
    title: 'Trig substitution',
    items: [
      '√(a² − x²)  →  x = a sin θ,   dx = a cos θ dθ',
      '√(a² + x²)  →  x = a tan θ,   dx = a sec² θ dθ',
      '√(x² − a²)  →  x = a sec θ,   dx = a sec θ tan θ dθ',
      'Draw the triangle to convert back to x (opp/adj/hyp)',
    ],
  },
  {
    id: 'pf-sheet',
    exam: 'exam1',
    title: 'Partial fractions',
    items: [
      'If deg(num) ≥ deg(den), divide first',
      'Distinct linear: A/(x−r) + B/(x−s)',
      'Repeated linear: A/(x−r) + B/(x−r)² + …',
      'Irreducible quadratic: (Cx + D)/(x² + px + q)',
    ],
  },
  {
    id: 'improper-sheet',
    exam: 'exam1',
    title: 'Improper integrals',
    items: [
      '∫_a^∞ f = lim (b→∞) ∫_a^b f   (and similarly −∞ or both)',
      'Discontinuity at c: split and take one-sided limits',
      'p-test on [1, ∞): ∫ x^{−p} dx converges ⇔ p > 1',
      'p-test on (0, 1]: ∫ x^{−p} dx converges ⇔ p < 1',
    ],
  },
  {
    id: 'apps-sheet',
    exam: 'exam1',
    title: 'Arc length, surface, work',
    items: [
      'Arc length: L = ∫_a^b √(1 + (y′)²) dx',
      'Surface about x-axis: S = 2π ∫ y √(1 + (y′)²) dx',
      'Work: W = ∫ F(x) dx  (Hooke: F = kx; pumping: slices of weight × distance)',
    ],
  },
  {
    id: 'seq-sheet',
    exam: 'exam2',
    title: 'Sequences',
    items: [
      '{a_n} converges if lim (n→∞) a_n exists and is finite',
      'Monotone + bounded ⇒ converges',
      'If Σ a_n converges, then a_n → 0 (necessary, not sufficient)',
      'n grows slower than any positive power of n; polynomials ≪ exponentials ≪ n! ≪ n^n',
    ],
  },
  {
    id: 'series-sheet',
    exam: 'exam2',
    title: 'Named series & tests',
    items: [
      'Geometric Σ ar^{n} (or ar^{n−1}): |r| < 1 → a/(1−r); |r| ≥ 1 diverges',
      'p-series Σ 1/n^p converges ⇔ p > 1. Harmonic (p = 1) diverges',
      'n-th term: if a_n ↛ 0, the series diverges',
      'Integral test: f positive, continuous, decreasing',
      'Limit comparison: lim a_n/b_n = c ∈ (0, ∞) ⇒ same behavior',
      'AST: a_n ↓ 0 ⇒ Σ (−1)^{n} a_n converges',
      'Ratio: L = lim |a_{n+1}/a_n|; L < 1 conv, L > 1 div, L = 1 inconclusive',
      'Absolute conv ⇒ conv. Conditional: conv but not absolutely',
    ],
  },
  {
    id: 'power-sheet',
    exam: 'exam3',
    title: 'Power series',
    items: [
      'Centered at a: Σ c_n (x − a)^n',
      'Radius R from ratio/root. Interval is (a−R, a+R) plus endpoint checks',
      '1/(1 − x) = Σ_{n=0}^∞ x^n  for |x| < 1',
      'May differentiate or integrate term by term inside the open interval',
    ],
  },
  {
    id: 'taylor-sheet',
    exam: 'exam3',
    title: 'Maclaurin list (memorize)',
    items: [
      'e^x = Σ x^n / n!',
      'sin x = Σ (−1)^n x^{2n+1} / (2n+1)!',
      'cos x = Σ (−1)^n x^{2n} / (2n)!',
      'ln(1 + x) = Σ (−1)^{n+1} x^n / n    (|x| < 1, and x = 1)',
      'arctan x = Σ (−1)^n x^{2n+1} / (2n+1)    (|x| ≤ 1)',
      'Taylor: f(x) = Σ f^{(n)}(a)/n! · (x − a)^n',
    ],
  },
  {
    id: 'param-sheet',
    exam: 'exam3',
    title: 'Parametric',
    items: [
      'dy/dx = (dy/dt) / (dx/dt)   provided dx/dt ≠ 0',
      'd²y/dx² = [d/dt (dy/dx)] / (dx/dt)',
      'Arc length: ∫_α^β √( (dx/dt)² + (dy/dt)² ) dt',
    ],
  },
  {
    id: 'polar-sheet',
    exam: 'exam3',
    title: 'Polar',
    items: [
      'x = r cos θ,   y = r sin θ,   r² = x² + y²,   tan θ = y/x',
      'Area: A = (1/2) ∫_α^β [r(θ)]² dθ',
      'Arc length: ∫ √( r² + (dr/dθ)² ) dθ',
      'dy/dx = (r′ sin θ + r cos θ) / (r′ cos θ − r sin θ)',
      'Cardioid r = a(1 ± cos θ) or a(1 ± sin θ); rose r = a cos(nθ) has n or 2n petals',
    ],
  },
];
