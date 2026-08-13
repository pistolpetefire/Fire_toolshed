/**
 * FE General Math tutoring — solve path on every item.
 */
window.FE_TUTORING = {
  coaches: {
    'alg-trig': {
      title: 'Algebra & trig coach',
      howToThink: 'Isolate the unknown. For trig, pick the identity that matches the form. For triangles, law of sines if you have a side-angle pair; cosines if you have SAS or SSS.',
      commonMistake: 'Common mistake: mixing degree and radian mode, or dropping a sign when moving terms.',
      examTip: 'Exam tip: FE Handbook has the identity list. Confirm calculator mode before sin/cos.',
      firstMove: 'Write what is given and what is unknown. Check degree vs radian if any trig is involved.',
      recipe: [
        'Rewrite logs/exponentials with one base, or convert to e^{} if needed.',
        'For a triangle, sketch and label. Choose sines (ASA/AAS/SSA) or cosines (SAS/SSS).',
        'Solve algebraically; watch ± on square roots and inverse trig ranges.',
        'Plug back to check.',
      ],
      writeOnExam: 'Show the isolated equation or the law you used. Box the number and units (deg/rad).',
      howToCheck: 'Substitute back. For a triangle, check the three angles sum to 180°.',
      traps: [{ re: /radian|degree/i, why: 'Wrong angle mode is the usual FE trap.' }],
    },
    analytic: {
      title: 'Analytic geometry coach',
      howToThink: 'Distance, midpoint, slope, then the standard form (line or circle). Complete the square to read a circle’s center and radius.',
      commonMistake: 'Common mistake: forgetting to complete the square, or using (x2−x1) only once in distance.',
      examTip: 'Exam tip: Handbook lists the standard conic forms. Match the equation to a name before computing.',
      firstMove: 'Identify the object: line, circle, or distance between two points.',
      recipe: [
        'Write the two points or the equation.',
        'Distance: √(Δx²+Δy²). Slope: Δy/Δx. Circle: complete the square.',
        'Read center (h,k) and r from (x−h)²+(y−k)²=r².',
        'Check by plugging a known point.',
      ],
      writeOnExam: 'Show Δx, Δy or the completed-square steps. Box center and r, or the distance.',
      howToCheck: 'A point on the circle must satisfy the original equation.',
      traps: [{ re: /radius.*diameter|r² as r/i, why: 'r² is not the radius. Take the square root.' }],
    },
    vectors: {
      title: 'Vectors coach',
      howToThink: 'Draw components. Dot product for angles and work; cross product for perpendicular area / moment in 2D/3D.',
      commonMistake: 'Common mistake: mixing up |a||b|cosθ (dot) with |a||b|sinθ (cross magnitude).',
      examTip: 'Exam tip: Handbook has both product formulas. Name which one you need in words first.',
      firstMove: 'Are you asked for a length, an angle, a projection, or a perpendicular vector?',
      recipe: [
        'Write components. Magnitude first if you need a unit vector.',
        'Dot: Σ a_i b_i. Then cosθ = (a·b)/(|a||b|).',
        'Cross (3D): determinant of i j k. Direction from right-hand rule.',
        'Projection: ((a·b)/|b|²) b.',
      ],
      writeOnExam: 'Show the component arithmetic. Name dot vs cross. Box the vector or the angle.',
      howToCheck: 'Dot of a vector with a perpendicular result should be 0. Magnitudes are nonnegative.',
      traps: [{ re: /dot.*perp|cross.*parallel/i, why: 'Perpendicular ⇒ dot 0. Parallel ⇒ cross 0.' }],
    },
    matrices: {
      title: 'Matrices coach',
      howToThink: 'Size first (can you multiply?). Det=0 means no inverse. Cramer is det(A_i)/det A. Eigenvalues from det(A−λI)=0.',
      commonMistake: 'Common mistake: AB vs BA, or using det as if it were the inverse.',
      examTip: 'Exam tip: 2×2 inverse is (1/det)[d −b; −c a]. Memorize that; it is faster than Gauss on the FE.',
      firstMove: 'Write the sizes. If a 2×2 system, decide inverse vs Cramer vs substitution.',
      recipe: [
        '2×2 det = ad−bc. If 0, stop (no unique inverse / Cramer fails).',
        'Inverse: (1/det) times the adjugate.',
        'Cramer: replace one column with b, ratio of dets.',
        'Eigen: form A−λI, set det=0, solve the quadratic in λ.',
      ],
      writeOnExam: 'Show det, then the formula you used. Box x,y or the λ values.',
      howToCheck: 'Multiply A A^{-1} and look for I. Or plug (x,y) back into both equations.',
      traps: [{ re: /no inverse|singular/i, why: 'det=0 means singular — no inverse, not “inverse is 0.”' }],
    },
    'diff-calc': {
      title: 'Differential calculus coach',
      howToThink: 'Name the rule (power, product, quotient, chain). For max/min, f′=0 then test. Related rates: equation first, then d/dt.',
      commonMistake: 'Common mistake: forgetting the chain-rule multiplier, or plugging numbers before differentiating in related rates.',
      examTip: 'Exam tip: rewrite roots as powers. Partial derivative: treat the other variable as a constant.',
      firstMove: 'Is this a derivative, an optimization, or a related rate? Write the equation before differentiating.',
      recipe: [
        'Rewrite (√x = x^{1/2}). Apply power/product/quotient/chain.',
        'Related rates: differentiate both sides w.r.t. t, then plug known values.',
        'Opt: domain, f′=0, endpoints if closed interval.',
        'Partials: ∂/∂x holds y fixed.',
      ],
      writeOnExam: 'Show the derivative line. For related rates, box the equation you differentiated. Include units if given.',
      howToCheck: 'Differentiate a simple check (power rule). Sign of f′ should match increase/decrease.',
      traps: [{ re: /forgot chain|no chain/i, why: 'Inside functions always contribute a multiplier.' }],
    },
    'int-calc': {
      title: 'Integral calculus coach',
      howToThink: 'Antiderivative +C, or FTC for definite. Area between curves is top−bottom. Trapezoid if only a table is given.',
      commonMistake: 'Common mistake: dropping +C, or swapping F(a)−F(b).',
      examTip: 'Exam tip: average value is (1/(b−a))∫f. Handbook has the trapezoidal formula.',
      firstMove: 'Indefinite, definite, area, or a table? That pick chooses FTC vs trap rule.',
      recipe: [
        'Power: x^{n+1}/(n+1). ln|x| for 1/x. Trig/exp from the table.',
        'Definite: F(b)−F(a). Change u-limits if you u-sub.',
        'Trap: h=(b−a)/n, (h/2)(y0+2y1+…+yn).',
        'Keep +C on indefinite.',
      ],
      writeOnExam: 'Write F(x), then F(b)−F(a), or the trap sum. Box the number.',
      howToCheck: 'Differentiate F to recover f. Trap estimate should sit near a rough rectangle estimate.',
      traps: [{ re: /\+C|indefinite/i, why: 'Indefinite answers without +C are incomplete.' }],
    },
    diffeq: {
      title: 'DE coach',
      howToThink: 'Separable if you can write g(y) dy = f(x) dx. First-order linear: μ=e^{∫P}. Second-order constant coeff: characteristic equation.',
      commonMistake: 'Common mistake: forgetting the integrating factor, or dropping +C (the family of solutions).',
      examTip: 'Exam tip: Handbook lists the standard 1st-linear and constant-coeff forms. Match the form first.',
      firstMove: 'Name the type: separable, 1st linear y′+P y=Q, or y″+b y′+c y=0.',
      recipe: [
        'Separable: integrate both sides, include C, apply IC if given.',
        'Linear: μ=e^{∫P dx}, d/dx(μ y)=μ Q.',
        'Const coeff: r²+b r+c=0. Real distinct → C1 e^{r1 t}+C2 e^{r2 t}; repeated → (C1+C2 t)e^{rt}; complex → e^{αt}(C1 cos βt+C2 sin βt).',
        'Apply y(0), y′(0) last.',
      ],
      writeOnExam: 'Name the type. Show μ or the characteristic roots. Box y(t) with C or with IC applied.',
      howToCheck: 'Differentiate your y and plug back into the DE. ICs must hold exactly.',
      traps: [{ re: /forgot C|particular only/i, why: 'General solution needs the arbitrary constants until ICs fix them.' }],
    },
    probability: {
      title: 'Probability coach',
      howToThink: 'Count the sample space. Independent ⇒ multiply. Mutually exclusive ⇒ add and P(and)=0. Bayes when you are given a reverse conditional.',
      commonMistake: 'Common mistake: adding when you should multiply, or forgetting to divide by P(B) in Bayes.',
      examTip: 'Exam tip: Handbook has Bayes and the binomial pmf. Write the event in words first.',
      firstMove: 'Is this counting, a named distribution, or Bayes? Identify P(what | what).',
      recipe: [
        'List outcomes or write the formula (binomial, geometric).',
        'Independence: P(A and B)=P(A)P(B).',
        'Bayes: P(A|B)=P(B|A)P(A)/P(B), with P(B) from total probability.',
        'E[X]=Σ x p(x) or ∫ x f(x) dx.',
      ],
      writeOnExam: 'Define the event. Show the formula with numbers plugged in. Box a probability between 0 and 1.',
      howToCheck: 'Probabilities in [0,1]. Complements: P(A^c)=1−P(A).',
      traps: [{ re: /greater than 1|negative/i, why: 'A probability outside [0,1] means the formula was applied backwards.' }],
    },
    statistics: {
      title: 'Statistics coach',
      howToThink: 'Sample mean and s use n−1 in the variance. z=(x−μ)/σ. CI: x̄ ± (critical)(se).',
      commonMistake: 'Common mistake: dividing by n instead of n−1 for sample variance, or using σ instead of σ/√n for the mean.',
      examTip: 'Exam tip: Handbook has the normal table and CI formulas. Know whether σ is known.',
      firstMove: 'One data set (mean/s) or inference (z, CI)? Known σ or not?',
      recipe: [
        'x̄ = Σx / n. Sample variance s² = Σ(x−x̄)² / (n−1).',
        'z = (x−μ)/σ for a single value; se of the mean is σ/√n.',
        'CI: x̄ ± z_{α/2} · σ/√n when σ is known.',
        'About 68/95/99.7 within 1/2/3 σ if normal.',
      ],
      writeOnExam: 'Show n, x̄, s or se. Write the CI endpoints. Box the interval or the z.',
      howToCheck: 's must be ≥ 0. A 95% CI should be wider than a 68% interval.',
      traps: [{ re: /÷ n instead|population variance/i, why: 'Sample s² uses n−1. σ/√n is the SE of the mean, not σ.' }],
    },
  },

  getCoach(topic) {
    return this.coaches[topic] || this.coaches['alg-trig'];
  },

  autopsyChoices(q) {
    const letters = ['A', 'B', 'C', 'D'];
    const coach = this.getCoach((q.topics || [])[0]);
    const whyAll = (q.tutoring && q.tutoring.whyNotOthers) || '';
    return (q.choices || []).map((text, i) => {
      const letter = letters[i];
      const ok = letter === q.answer;
      if (ok) return { letter, text, ok: true, why: q.explanation || 'Matches the method.' };
      const trap = (coach.traps || []).find((t) => t.re.test(String(text)));
      return { letter, text, ok: false, why: trap ? trap.why : whyAll || 'Wrong tool or arithmetic. Compare to the method above.' };
    });
  },

  buildMcqTutor(q, userLetter, correct) {
    const coach = this.getCoach((q.topics || [])[0]);
    const ansIdx = String(q.answer || 'A').charCodeAt(0) - 65;
    const correctText = (q.choices || [])[ansIdx] || '';
    const workSteps = (q.tutoring && q.tutoring.steps) || [];
    return {
      headline: correct ? 'Correct — full solve path' : 'Not quite — full solve path',
      correctChoice: `${q.answer}. ${correctText}`,
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      workSteps,
      explanation: q.explanation,
      autopsy: this.autopsyChoices(q),
      trapNotes: (q.tutoring && q.tutoring.whyNotOthers) || '',
      writeOnExam: coach.writeOnExam,
      howToCheck: coach.howToCheck,
      handbook: q.handbook || 'FE Reference Handbook — matching math section',
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
    };
  },

  buildWorkshopTutor(p) {
    const coach = this.getCoach((p.topics || [])[0]);
    return {
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      writeOnExam: p.examWriteup || coach.writeOnExam,
      howToCheck: p.check || coach.howToCheck,
      handbook: p.handbook || coach.examTip,
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
    };
  },
};
