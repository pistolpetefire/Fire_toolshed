/**
 * Calculus I tutoring layer — topic coaches shown after answers / with workshop problems.
 * Written for a high-school student in first college Calc I.
 */
window.CALC1_TUTORING = {
  coaches: {
    limits: {
      title: 'Limits coach',
      howToThink:
        'Ask: “What is y approaching as x approaches a value (or ±∞)?” First try direct plug-in. If you get 0/0, factor, conjugate, or trig identity—not ‘undefined’ yet. If you get nonzero/0, think vertical asymptote / infinite limit (sign matters for one-sided).',
      commonMistake:
        'Common mistake: calling every 0/0 “undefined” without simplifying, or mixing up left vs right one-sided limits (especially with 1/x or absolute value).',
      examTip:
        'Exam tip: write the simplified function for x ≠ a, then take the limit. Continuity needs lim = f(a), so check left, right, and the function value separately when pieces change.',
    },
    'derivative-def': {
      title: 'Definition coach',
      howToThink:
        'f′(a) is the slope of the tangent at x = a. The definition is lim(h→0) [f(a+h)−f(a)]/h. Expand, cancel h, then set h = 0. Differentiable ⇒ continuous, but continuous does not guarantee differentiable (corners, cusps).',
      commonMistake:
        'Common mistake: forgetting to subtract f(a), or plugging h = 0 before canceling h (that falsely gives 0/0 and panic).',
      examTip:
        'Exam tip: tangent line is y − f(a) = f′(a)(x − a). Units of dy/dx are “units of y per units of x.”',
    },
    'derivative-rules': {
      title: 'Rules coach',
      howToThink:
        'Name the structure: sum? product? quotient? composition (chain)? Power: n x^(n−1). Product: u′v + uv′. Quotient: (u′v − uv′)/v². Chain: outer′(inner) × inner′. Trig/exp/ln each have standard derivatives.',
      commonMistake:
        'Common mistake: forgetting the chain-rule multiplier (e.g. derivative of (3x+1)⁵ is not 5(3x+1)⁴ alone—you need ×3). Or swapping product and quotient signs.',
      examTip:
        'Exam tip: rewrite roots/reciprocals as powers before differentiating (√x = x^(1/2)). For e^(kx) and ln(g(x)), always chain.',
    },
    applications: {
      title: 'Applications coach',
      howToThink:
        'Related rates: draw, write equation, differentiate both sides with respect to t, plug known values last. Optimization: one variable, domain, A′=0 (or endpoints on closed interval). Sketching: f′ for increase/decrease, f″ for concavity.',
      commonMistake:
        'Common mistake: plugging numbers before differentiating in related rates, or optimizing without checking the domain/endpoints.',
      examTip:
        'Exam tip: Closed Interval Method = critical points in (a,b) plus endpoints. Local max/min: first-derivative sign change or second-derivative test when f′(c)=0.',
    },
    integrals: {
      title: 'Integrals coach',
      howToThink:
        'Indefinite ∫ is “undo derivative” (+C). Power: x^(n+1)/(n+1) for n≠−1. Definite ∫_a^b f = F(b)−F(a) (FTC). Geometrically: net signed area. Average value = (1/(b−a))∫_a^b f.',
      commonMistake:
        'Common mistake: dropping +C on indefinite integrals, or swapping F(a)−F(b). Also treating net area like total area when the curve goes below the axis.',
      examTip:
        'Exam tip: d/dx ∫_a^x f(t) dt = f(x). Memorize ∫sin, ∫cos, ∫e^x, ∫1/x = ln|x|.',
    },
    substitution: {
      title: 'u-sub coach',
      howToThink:
        'Look for a piece whose derivative (almost) multiplies the rest. Set u = “inside,” compute du, adjust constants. For definite integrals, change limits to u-values (or convert back to x carefully).',
      commonMistake:
        'Common mistake: substituting u but forgetting to change dx limits—or changing x-limits while leaving the integrand in x.',
      examTip:
        'Exam tip: if you see f′(g(x))g′(x), you are staring at the chain rule in reverse. Practice ∫e^(3x), ∫cos(5x), ∫2x(x²+1)^n.',
    },
    'area-volume': {
      title: 'Area & volume coach',
      howToThink:
        'Area between curves: ∫(top − bottom) dx (or right − left in dy). Find intersections for limits. Disk: V = ∫ π [R(x)]² dx. Washer: π(R_out² − R_in²).',
      commonMistake:
        'Common mistake: using bottom − top, or forgetting π and the square on radius for solids of revolution.',
      examTip:
        'Exam tip: sketch first. Split the integral if which curve is on top changes.',
    },
    concepts: {
      title: 'Big-ideas coach',
      howToThink:
        'Derivative ≈ instantaneous rate / slope of tangent. Integral ≈ accumulated change / net area. Antiderivative undoes derivative. Theorems (MVT, FTC) connect slope and accumulation.',
      commonMistake:
        'Common mistake: mixing up “continuous” with “differentiable,” or thinking ∫ always means only positive area.',
      examTip:
        'Exam tip: if stuck on a hard computation, restate in words: “I need a slope” vs “I need an area/accumulation.” That often picks the right tool.',
    },
  },

  /**
   * Build a full tutoring block for an MCQ after grading.
   * @param {object} q question
   * @param {string} userLetter A-D or null
   * @param {boolean} correct
   */
  buildMcqTutor(q, userLetter, correct) {
    const topic = (q.topics && q.topics[0]) || 'concepts';
    const coach = this.coaches[topic] || this.coaches.concepts;
    const ansIdx = q.answer.charCodeAt(0) - 65;
    const correctText = q.choices[ansIdx];
    const userIdx = userLetter ? userLetter.charCodeAt(0) - 65 : -1;
    const userText = userIdx >= 0 ? q.choices[userIdx] : null;

    const walkthrough = [];
    if (correct) {
      walkthrough.push('You picked the right answer. Still read the walkthrough—finals reuse the same ideas with new numbers.');
    } else if (userLetter) {
      walkthrough.push(
        `You chose ${userLetter}: “${userText}”. That is not correct. The correct choice is ${q.answer}: “${correctText}”.`
      );
      walkthrough.push(
        'Compare your choice to the correct one: what idea did the wrong option tempt you with (forgot chain rule? mixed up left/right? dropped a sign?)?'
      );
    } else {
      walkthrough.push(`Correct choice: ${q.answer} — ${correctText}.`);
    }

    walkthrough.push(`Step-by-step reason: ${q.explanation}`);

    if (q.tutoring && Array.isArray(q.tutoring.steps) && q.tutoring.steps.length) {
      for (const s of q.tutoring.steps) walkthrough.push(s);
    }
    if (q.tutoring && q.tutoring.whyNotOthers) {
      walkthrough.push(`Why other options fail: ${q.tutoring.whyNotOthers}`);
    }

    return {
      headline: correct ? 'Correct — here is the full coaching' : 'Not quite — let us tutor this one',
      correctChoice: `${q.answer}. ${correctText}`,
      walkthrough,
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
    };
  },
};
