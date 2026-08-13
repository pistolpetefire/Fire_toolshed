/**
 * Searchable FE math/stats formula reference (plain text so Ctrl+F works).
 * Standard engineering-math identities — not a copy of the NCEES Handbook PDF.
 * Load the official Handbook from ncees.org for exam-identical pages.
 */
window.FE_HANDBOOK = {
  nceesDownload: 'https://account.ncees.org/reference-handbooks/',
  note:
    'On the real FE CBT exam you search the official FE Reference Handbook (Ctrl+F / find). Practice the same way here. This page is searchable text. Optionally attach the official PDF you download from NCEES — it stays on this device only.',
  sections: [
    {
      id: 'alg',
      title: 'Algebra and trigonometry',
      keywords: 'log exponent quadratic sine cosine tangent law of sines cosines identity radian degree',
      body: [
        'Quadratic formula: x = [-b ± √(b² − 4ac)] / (2a)',
        'log_b (xy) = log_b x + log_b y    log_b (x/y) = log_b x − log_b y    log_b (x^k) = k log_b x',
        'Change of base: log_b a = ln a / ln b',
        'a^x = e^{x ln a}',
        'sin²θ + cos²θ = 1    1 + tan²θ = sec²θ    1 + cot²θ = csc²θ',
        'sin 2θ = 2 sinθ cosθ    cos 2θ = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ',
        'Law of sines: a/sin A = b/sin B = c/sin C',
        'Law of cosines: c² = a² + b² − 2ab cos C',
        'Degrees to radians: θ_rad = θ_deg · π / 180',
        'Area of triangle: (1/2)ab sin C',
      ],
    },
    {
      id: 'geo',
      title: 'Analytic geometry',
      keywords: 'distance midpoint slope circle line intercept conic parabola ellipse',
      body: [
        'Distance 2-D: √[(x2−x1)² + (y2−y1)²]    3-D: add (z2−z1)² under the root',
        'Midpoint: ((x1+x2)/2, (y1+y2)/2)',
        'Slope of a line: m = (y2−y1)/(x2−x1)    Point-slope: y − y1 = m(x − x1)',
        'Circle: (x−h)² + (y−k)² = r²    Center (h,k), radius r',
        'Complete the square to read center and radius from x²+y²+Dx+Ey+F=0',
        'Parabola y² = 4ax    Ellipse x²/a² + y²/b² = 1    Hyperbola x²/a² − y²/b² = 1',
      ],
    },
    {
      id: 'vec',
      title: 'Vectors',
      keywords: 'dot cross magnitude unit projection angle i j k',
      body: [
        'Magnitude: |a| = √(ax² + ay² + az²)',
        'Unit vector: â = a / |a|',
        'Dot product: a·b = ax bx + ay by + az bz = |a||b| cos θ',
        'a · b = 0  ⇒  perpendicular    a × b = 0  ⇒  parallel',
        'Cross product magnitude: |a×b| = |a||b| sin θ  (area of parallelogram)',
        '2-D cross z-component: ax by − ay bx',
        'Projection of a onto b: proj_b a = [(a·b) / |b|²] b',
      ],
    },
    {
      id: 'mat',
      title: 'Matrices and linear algebra',
      keywords: 'determinant inverse Cramer eigenvalue eigenvector multiply identity singular',
      body: [
        '2×2 determinant: det[a b; c d] = ad − bc',
        '3×3: expand by cofactors along a row or column',
        'det A = 0  ⇒  singular, no inverse, Cramer does not give a unique solution',
        '2×2 inverse: (1/det) [ d −b ; −c a ]',
        'A A^{-1} = I',
        'Cramer: x_i = det(A_i) / det A   (A_i replaces column i with the right-hand side)',
        'Eigenvalues: det(A − λI) = 0',
        'Matrix multiply: (AB)_ij = row i of A · column j of B. AB ≠ BA in general.',
      ],
    },
    {
      id: 'diff',
      title: 'Differential calculus',
      keywords: 'derivative product quotient chain power related rates max min partial',
      body: [
        'd/dx [x^n] = n x^{n−1}    d/dx [e^{kx}] = k e^{kx}    d/dx [ln x] = 1/x',
        'd/dx [sin u] = cos u · u′    d/dx [cos u] = −sin u · u′',
        'Product: (uv)′ = u′v + uv′    Quotient: (u/v)′ = (u′v − uv′) / v²',
        'Chain: d/dx f(g(x)) = f′(g(x)) g′(x)',
        'Critical points: f′ = 0 or f′ does not exist (in the domain)',
        'Related rates: write the constraint, differentiate both sides with respect to t, then plug numbers',
        'Partial ∂f/∂x: treat y as constant',
      ],
    },
    {
      id: 'int',
      title: 'Integral calculus',
      keywords: 'antiderivative FTC definite trapezoid simpson average area',
      body: [
        '∫ x^n dx = x^{n+1}/(n+1) + C   (n ≠ −1)    ∫ dx/x = ln|x| + C',
        '∫ e^{kx} dx = e^{kx}/k + C    ∫ sin x dx = −cos x + C    ∫ cos x dx = sin x + C',
        'Fundamental theorem: ∫_a^b f(x) dx = F(b) − F(a)',
        'Average value on [a,b]: (1/(b−a)) ∫_a^b f(x) dx',
        'Trapezoidal rule: (h/2)(y0 + 2y1 + 2y2 + … + 2y_{n−1} + yn),  h = (b−a)/n',
        'Indefinite integrals need +C',
      ],
    },
    {
      id: 'de',
      title: 'Differential equations',
      keywords: 'separable integrating factor characteristic Laplace first order second order',
      body: [
        'Separable: g(y) dy = f(x) dx   then integrate both sides, include C',
        'First-order linear: y′ + P(x) y = Q(x)    integrating factor μ = e^{∫ P dx}',
        'Then d/dx (μ y) = μ Q',
        'Constant-coeff: y″ + b y′ + c y = 0    characteristic r² + b r + c = 0',
        'Distinct real roots: C1 e^{r1 t} + C2 e^{r2 t}',
        'Repeated root r: (C1 + C2 t) e^{rt}',
        'Complex α ± βi: e^{α t} (C1 cos βt + C2 sin βt)',
        'y″ + ω² y = 0  →  C1 cos(ωt) + C2 sin(ωt)',
      ],
    },
    {
      id: 'prob',
      title: 'Probability',
      keywords: 'Bayes binomial expected value independent exclusive complement permutation combination',
      body: [
        'P(A^c) = 1 − P(A)    0 ≤ P(A) ≤ 1',
        'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
        'Independent: P(A ∩ B) = P(A) P(B)',
        'Mutually exclusive: P(A ∩ B) = 0 so P(A ∪ B) = P(A) + P(B)',
        'Conditional: P(A|B) = P(A ∩ B) / P(B)',
        'Bayes: P(A|B) = P(B|A) P(A) / P(B)    with P(B) from total probability',
        'Permutations: n! / (n−k)!    Combinations: C(n,k) = n! / (k! (n−k)!)',
        'Binomial: P(X=k) = C(n,k) p^k (1−p)^{n−k}',
        'Expected value: E[X] = Σ x p(x)   or  ∫ x f(x) dx',
      ],
    },
    {
      id: 'stat',
      title: 'Statistics',
      keywords: 'mean variance standard error z-score confidence interval normal sample',
      body: [
        'Sample mean: x̄ = (Σ x_i) / n',
        'Sample variance: s² = Σ(x_i − x̄)² / (n − 1)    (use n−1, not n)',
        'Sample standard deviation s = √(s²)',
        'z-score of a value: z = (x − μ) / σ',
        'Standard error of the mean: σ / √n   (not σ, not σ/n)',
        'CI for mean, σ known: x̄ ± z_{α/2} · (σ / √n)',
        'Common z: 90% → 1.645    95% → 1.96    99% → 2.576',
        'Normal rule of thumb: ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ',
      ],
    },
    {
      id: 'const',
      title: 'Constants and calculator',
      keywords: 'pi e calculator TI-36X approved NCEES',
      body: [
        'π ≈ 3.1416    e ≈ 2.71828',
        'NCEES-approved calculators only on exam day (e.g. TI-36X Pro, Casio fx-115, HP 35s). No CAS graphing.',
        'Confirm DEG vs RAD before any sin/cos/tan.',
      ],
    },
  ],
};

window.FE_HANDBOOK_TEXT = function () {
  const hb = window.FE_HANDBOOK;
  const parts = [hb.note, ''];
  for (const s of hb.sections) {
    parts.push(s.title.toUpperCase());
    parts.push(s.keywords);
    for (const line of s.body) parts.push(line);
    parts.push('');
  }
  return parts.join('\n');
};
