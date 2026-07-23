/**
 * Calculus I Final Study Buddy — MCQ bank (98 questions)
 * Detailed tutoring.steps + whyNotOthers for coach-style feedback.
 * answer is "A"|"B"|"C"|"D". topics match js/topics.js ids.
 */
window.CALC1_QUESTIONS = [
  {
    "id": "L01",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→2) (x² − 4)/(x − 2) equals:",
    "choices": [
      "0",
      "2",
      "4",
      "undefined"
    ],
    "answer": "C",
    "explanation": "Factor: (x−2)(x+2)/(x−2) → x+2 → 4 as x→2. Plug-in first: (4-4)/(2-2)=0/0 — indeterminate, so algebra is required. Factor numerator: x^2-4=(x-2)(x+2). Cancel (x-2) for x!=2 to get x+2. Now lim(x->2)(x+2)=4. A hole at x=2 does not stop the limit from existing.",
    "tutoring": {
      "steps": [
        "Plug-in first: (4-4)/(2-2)=0/0 — indeterminate, so algebra is required.",
        "Factor numerator: x^2-4=(x-2)(x+2). Cancel (x-2) for x!=2 to get x+2.",
        "Now lim(x->2)(x+2)=4. A hole at x=2 does not stop the limit from existing."
      ],
      "whyNotOthers": "0 would be if the simplified limit were 0; \"undefined\" confuses the limit with the original function value at 2; 2 is a distractor from the canceled factor."
    }
  },
  {
    "id": "L02",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→0) sin(x)/x equals:",
    "choices": [
      "0",
      "1",
      "∞",
      "does not exist"
    ],
    "answer": "B",
    "explanation": "Standard limit: sin x / x → 1 as x → 0. Standard Calc I limit (radians): lim(x->0) sin(x)/x = 1. sin(0)/0 looks like 0/0 if you only plug in — the ratio still approaches 1. Check: sin(0.1)/0.1 is about 0.998, very close to 1.",
    "tutoring": {
      "steps": [
        "Standard Calc I limit (radians): lim(x->0) sin(x)/x = 1.",
        "sin(0)/0 looks like 0/0 if you only plug in — the ratio still approaches 1.",
        "Check: sin(0.1)/0.1 is about 0.998, very close to 1."
      ],
      "whyNotOthers": "0 is only sin(0); infinity is wrong growth; DNE needs left/right disagreement."
    }
  },
  {
    "id": "L03",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→∞) (3x² + 1)/(x² − 5) equals:",
    "choices": [
      "0",
      "1",
      "3",
      "∞"
    ],
    "answer": "C",
    "explanation": "Divide by x²: (3 + 1/x²)/(1 − 5/x²) → 3/1 = 3. At infinity, compare leading terms: 3x^2 / x^2 = 3. Divide top and bottom by x^2: (3+1/x^2)/(1-5/x^2) -> 3. Equal degree => limit is ratio of leading coefficients.",
    "tutoring": {
      "steps": [
        "At infinity, compare leading terms: 3x^2 / x^2 = 3.",
        "Divide top and bottom by x^2: (3+1/x^2)/(1-5/x^2) -> 3.",
        "Equal degree => limit is ratio of leading coefficients."
      ],
      "whyNotOthers": "0 if denom degree higher; infinity if num degree higher; 1 if leading coeffs were equal 1/1."
    }
  },
  {
    "id": "L04",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→0⁺) 1/x equals:",
    "choices": [
      "0",
      "1",
      "+∞",
      "−∞"
    ],
    "answer": "C",
    "explanation": "From the right, 1/x → +∞. x->0+: x is a tiny positive number, so 1/x is a huge positive number (+infinity). We say the limit diverges to +infinity (not a finite number).",
    "tutoring": {
      "steps": [
        "x->0+: x is a tiny positive number, so 1/x is a huge positive number (+infinity).",
        "We say the limit diverges to +infinity (not a finite number)."
      ],
      "whyNotOthers": "-infinity is the left-hand behavior; 0 and 1 are finite and wrong here."
    }
  },
  {
    "id": "L05",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→0⁻) 1/x equals:",
    "choices": [
      "0",
      "+∞",
      "−∞",
      "1"
    ],
    "answer": "C",
    "explanation": "From the left, 1/x → −∞. x->0-: x is tiny negative, so 1/x -> -infinity.",
    "tutoring": {
      "steps": [
        "x->0-: x is tiny negative, so 1/x -> -infinity."
      ],
      "whyNotOthers": "+infinity is the right-hand limit; finite answers ignore the blow-up."
    }
  },
  {
    "id": "L06",
    "topics": [
      "limits"
    ],
    "stem": "If lim(x→a) f(x) = L and lim(x→a) g(x) = M, then lim(x→a) [f(x)+g(x)] equals:",
    "choices": [
      "L − M",
      "L + M",
      "LM",
      "L/M always"
    ],
    "answer": "B",
    "explanation": "Sum rule for limits (when both exist). If lim f = L and lim g = M (both finite), then lim(f+g)=L+M. Both limits must exist as real numbers for this sum rule.",
    "tutoring": {
      "steps": [
        "If lim f = L and lim g = M (both finite), then lim(f+g)=L+M.",
        "Both limits must exist as real numbers for this sum rule."
      ],
      "whyNotOthers": "Product/quotient have different rules; L-M would be a difference."
    }
  },
  {
    "id": "L07",
    "topics": [
      "limits"
    ],
    "stem": "A function is continuous at x = a if:",
    "choices": [
      "f(a) is defined only",
      "lim f exists only",
      "lim(x→a) f(x) = f(a)",
      "f is differentiable"
    ],
    "answer": "C",
    "explanation": "Continuity: limit exists, f(a) defined, and they match. Continuous at a means: f(a) defined, lim(x->a)f exists, and lim = f(a). Fail any one piece and the function is discontinuous at a.",
    "tutoring": {
      "steps": [
        "Continuous at a means: f(a) defined, lim(x->a)f exists, and lim = f(a).",
        "Fail any one piece and the function is discontinuous at a."
      ],
      "whyNotOthers": "Defined alone or limit alone is not enough; differentiability is stronger than continuity."
    }
  },
  {
    "id": "L08",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→3) (x − 3)/(x² − 9) equals:",
    "choices": [
      "0",
      "1/6",
      "1/3",
      "DNE"
    ],
    "answer": "B",
    "explanation": "Factor denom (x−3)(x+3); cancel → 1/(x+3) → 1/6. At x=3 you get 0/0. Factor x^2-9=(x-3)(x+3), cancel, get 1/(x+3). Limit as x->3 is 1/6.",
    "tutoring": {
      "steps": [
        "At x=3 you get 0/0. Factor x^2-9=(x-3)(x+3), cancel, get 1/(x+3).",
        "Limit as x->3 is 1/6."
      ],
      "whyNotOthers": "DNE confuses removable discontinuity with no limit; 0 is only the unsimplified numerator."
    }
  },
  {
    "id": "L09",
    "topics": [
      "limits"
    ],
    "stem": "Which limit form is indeterminate?",
    "choices": [
      "5/0",
      "0/5",
      "0/0",
      "3 + 4"
    ],
    "answer": "C",
    "explanation": "0/0 is indeterminate; you need more work (factor, L'Hôpital if allowed, etc.). Indeterminate means the form does not yet decide the limit (classic: 0/0, infinity/infinity). Nonzero/0 is infinite-type behavior, not the indeterminate form 0/0.",
    "tutoring": {
      "steps": [
        "Indeterminate means the form does not yet decide the limit (classic: 0/0, infinity/infinity).",
        "Nonzero/0 is infinite-type behavior, not the indeterminate form 0/0."
      ],
      "whyNotOthers": "0/5 is simply 0; constants are fine; 5/0 is not called 0/0."
    }
  },
  {
    "id": "L10",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→∞) e^(−x) equals:",
    "choices": [
      "∞",
      "1",
      "0",
      "−1"
    ],
    "answer": "C",
    "explanation": "Exponential decay: e^(−x) → 0 as x → ∞. e^(-x)=1/e^x. As x->infinity, e^x->infinity, so e^(-x)->0.",
    "tutoring": {
      "steps": [
        "e^(-x)=1/e^x. As x->infinity, e^x->infinity, so e^(-x)->0."
      ],
      "whyNotOthers": "infinity confuses e^x with e^(-x); 1 is e^0."
    }
  },
  {
    "id": "L11",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→0) (1 − cos x)/x² equals:",
    "choices": [
      "0",
      "1/2",
      "1",
      "∞"
    ],
    "answer": "B",
    "explanation": "Standard result (or half-angle / L'Hôpital twice if your course allows). Standard result: lim(x->0)(1-cos x)/x^2 = 1/2. Use 1-cos x = 2 sin^2(x/2), or L'Hopital twice if your course allows.",
    "tutoring": {
      "steps": [
        "Standard result: lim(x->0)(1-cos x)/x^2 = 1/2.",
        "Use 1-cos x = 2 sin^2(x/2), or L'Hopital twice if your course allows."
      ],
      "whyNotOthers": "1 is lim sinx/x; 0 underestimates the order of the numerator."
    }
  },
  {
    "id": "L12",
    "topics": [
      "limits"
    ],
    "stem": "If lim(x→2⁻) f = 5 and lim(x→2⁺) f = 7, then lim(x→2) f:",
    "choices": [
      "is 5",
      "is 7",
      "is 6",
      "does not exist"
    ],
    "answer": "D",
    "explanation": "One-sided limits disagree → two-sided limit DNE. Two-sided limit exists only if left and right limits exist and are equal. 5 != 7, so lim(x->2) does not exist.",
    "tutoring": {
      "steps": [
        "Two-sided limit exists only if left and right limits exist and are equal.",
        "5 != 7, so lim(x->2) does not exist."
      ],
      "whyNotOthers": "You cannot average one-sided limits (6) to force a two-sided limit."
    }
  },
  {
    "id": "L13",
    "topics": [
      "limits"
    ],
    "stem": "lim(x→0) (√(1+x) − 1)/x equals:",
    "choices": [
      "0",
      "1/2",
      "1",
      "∞"
    ],
    "answer": "B",
    "explanation": "Rationalize numerator → 1/(√(1+x)+1) → 1/2. 0/0 form. Multiply by conjugate sqrt(1+x)+1. Numerator becomes x; cancel x (x!=0): 1/(sqrt(1+x)+1) -> 1/2.",
    "tutoring": {
      "steps": [
        "0/0 form. Multiply by conjugate sqrt(1+x)+1.",
        "Numerator becomes x; cancel x (x!=0): 1/(sqrt(1+x)+1) -> 1/2."
      ],
      "whyNotOthers": "1 would drop the +1 in the conjugate denominator."
    }
  },
  {
    "id": "L14",
    "topics": [
      "limits"
    ],
    "stem": "A vertical asymptote of f often occurs where:",
    "choices": [
      "f′ = 0",
      "lim f → ±∞ as x approaches a finite value",
      "f″ = 0",
      "f is continuous"
    ],
    "answer": "B",
    "explanation": "VA: function blows up as x approaches a line x = a. Vertical asymptote: as x approaches a finite a, f(x)-> +/- infinity. Often at denominator zeros that do not cancel with the numerator.",
    "tutoring": {
      "steps": [
        "Vertical asymptote: as x approaches a finite a, f(x)-> +/- infinity.",
        "Often at denominator zeros that do not cancel with the numerator."
      ],
      "whyNotOthers": "f'=0 is a horizontal tangent idea, not a VA; continuity is the opposite idea."
    }
  },
  {
    "id": "D01",
    "topics": [
      "derivative-def"
    ],
    "stem": "The derivative f′(a) is defined as:",
    "choices": [
      "lim(h→0) [f(a+h)−f(a)]/h",
      "f(a+h)−f(a)",
      "∫ f",
      "f(a)/a"
    ],
    "answer": "A",
    "explanation": "Limit definition (difference quotient). Definition: f'(a)=lim(h->0)[f(a+h)-f(a)]/h when that limit exists. The fraction is a secant slope; h->0 makes it the tangent slope.",
    "tutoring": {
      "steps": [
        "Definition: f'(a)=lim(h->0)[f(a+h)-f(a)]/h when that limit exists.",
        "The fraction is a secant slope; h->0 makes it the tangent slope."
      ],
      "whyNotOthers": "f(a+h)-f(a) is only a rise, not a rate; integrals accumulate, they do not define f'."
    }
  },
  {
    "id": "D02",
    "topics": [
      "derivative-def"
    ],
    "stem": "Geometrically, f′(a) is the slope of the:",
    "choices": [
      "secant through a and b only",
      "tangent line at x = a",
      "normal only",
      "chord of a circle always"
    ],
    "answer": "B",
    "explanation": "Derivative = instantaneous slope = tangent slope. Secant slopes approach the tangent slope; that limit is f'(a).",
    "tutoring": {
      "steps": [
        "Secant slopes approach the tangent slope; that limit is f'(a)."
      ],
      "whyNotOthers": "A secant uses two points; the derivative is the instantaneous tangent slope."
    }
  },
  {
    "id": "D03",
    "topics": [
      "derivative-def"
    ],
    "stem": "If f is differentiable at a, then f is:",
    "choices": [
      "discontinuous at a",
      "continuous at a",
      "constant near a",
      "undefined at a"
    ],
    "answer": "B",
    "explanation": "Differentiability implies continuity (not conversely). Theorem: differentiable at a implies continuous at a. Idea: finite difference quotient limit forces f(a+h)-f(a)->0.",
    "tutoring": {
      "steps": [
        "Theorem: differentiable at a implies continuous at a.",
        "Idea: finite difference quotient limit forces f(a+h)-f(a)->0."
      ],
      "whyNotOthers": "Continuous does not imply differentiable (example: |x| at 0)."
    }
  },
  {
    "id": "D04",
    "topics": [
      "derivative-def"
    ],
    "stem": "f(x) = |x| at x = 0 is:",
    "choices": [
      "differentiable",
      "continuous but not differentiable",
      "discontinuous",
      "smooth with f′=0"
    ],
    "answer": "B",
    "explanation": "Corner: continuous, no unique tangent. |x| is continuous everywhere (no jump). At 0, left derivative -1 and right derivative +1 disagree, so not differentiable.",
    "tutoring": {
      "steps": [
        "|x| is continuous everywhere (no jump).",
        "At 0, left derivative -1 and right derivative +1 disagree, so not differentiable."
      ],
      "whyNotOthers": "It is continuous; there is no smooth f'=0 at the corner."
    }
  },
  {
    "id": "D05",
    "topics": [
      "derivative-def"
    ],
    "stem": "Units of dy/dx if y is meters and x is seconds:",
    "choices": [
      "m·s",
      "m/s",
      "s/m",
      "m²"
    ],
    "answer": "B",
    "explanation": "Rate of change of meters per second. Units of dy/dx are (units of y)/(units of x). Meters per second is a rate.",
    "tutoring": {
      "steps": [
        "Units of dy/dx are (units of y)/(units of x). Meters per second is a rate."
      ],
      "whyNotOthers": "m*s is not a rate; s/m is an inverse rate."
    }
  },
  {
    "id": "D06",
    "topics": [
      "derivative-def"
    ],
    "stem": "The equation of the tangent line to y = f(x) at x = a is:",
    "choices": [
      "y − f(a) = f′(a)(x − a)",
      "y = f′(a)",
      "y = f(a)x",
      "y = f″(a)"
    ],
    "answer": "A",
    "explanation": "Point-slope form with slope f′(a). Tangent line: point (a,f(a)), slope f'(a). Point-slope: y - f(a) = f'(a)(x - a).",
    "tutoring": {
      "steps": [
        "Tangent line: point (a,f(a)), slope f'(a).",
        "Point-slope: y - f(a) = f'(a)(x - a)."
      ],
      "whyNotOthers": "y=f'(a) is only a horizontal line with that slope through the origin-ish form — not the general tangent."
    }
  },
  {
    "id": "D07",
    "topics": [
      "derivative-def"
    ],
    "stem": "If f′(x) > 0 on an interval, then f is:",
    "choices": [
      "decreasing",
      "increasing",
      "constant",
      "concave down always"
    ],
    "answer": "B",
    "explanation": "Positive derivative → increasing. If f'>0 on an interval, slopes are positive, so f is increasing there.",
    "tutoring": {
      "steps": [
        "If f'>0 on an interval, slopes are positive, so f is increasing there."
      ],
      "whyNotOthers": "f'<0 decreases; f'=0 everywhere implies constant on an interval."
    }
  },
  {
    "id": "D08",
    "topics": [
      "derivative-def"
    ],
    "stem": "If f′(c) = 0, then x = c is:",
    "choices": [
      "always a max",
      "always a min",
      "a critical number (candidate)",
      "undefined"
    ],
    "answer": "C",
    "explanation": "Critical numbers are where f′=0 or f′ DNE (in domain). Critical numbers: f'(c)=0 or f' DNE (c in domain). They are candidates for extrema — not automatic max/min.",
    "tutoring": {
      "steps": [
        "Critical numbers: f'(c)=0 or f' DNE (c in domain).",
        "They are candidates for extrema — not automatic max/min."
      ],
      "whyNotOthers": "x^3 at 0 has f'=0 but is not a local max or min."
    }
  },
  {
    "id": "D09",
    "topics": [
      "derivative-def"
    ],
    "stem": "Average rate of change of f on [a,b] is:",
    "choices": [
      "f′(a)",
      "[f(b)−f(a)]/(b−a)",
      "f(b)+f(a)",
      "∫_a^b f"
    ],
    "answer": "B",
    "explanation": "Slope of the secant line. Average rate on [a,b] = secant slope = [f(b)-f(a)]/(b-a). Instantaneous rate is the derivative (limit of average rates).",
    "tutoring": {
      "steps": [
        "Average rate on [a,b] = secant slope = [f(b)-f(a)]/(b-a).",
        "Instantaneous rate is the derivative (limit of average rates)."
      ],
      "whyNotOthers": "f'(a) is instantaneous at a single point, not the average over [a,b]."
    }
  },
  {
    "id": "D10",
    "topics": [
      "derivative-def"
    ],
    "stem": "f(x) = x²; f′(3) by definition equals:",
    "choices": [
      "6",
      "9",
      "3",
      "0"
    ],
    "answer": "A",
    "explanation": "lim(h→0) [(3+h)²−9]/h = lim(6h+h²)/h = 6. f(3+h)=(3+h)^2=9+6h+h^2. Difference 6h+h^2. Divide by h: 6+h -> 6. Power rule check: 2x at x=3 is also 6.",
    "tutoring": {
      "steps": [
        "f(3+h)=(3+h)^2=9+6h+h^2. Difference 6h+h^2. Divide by h: 6+h -> 6.",
        "Power rule check: 2x at x=3 is also 6."
      ],
      "whyNotOthers": "9 is f(3); 3 is the input, not the derivative."
    }
  },
  {
    "id": "R01",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [x^n] equals:",
    "choices": [
      "n x^(n−1)",
      "x^n / n",
      "n x^n",
      "x^(n+1)"
    ],
    "answer": "A",
    "explanation": "Power rule. Power rule: multiply by the old exponent, then reduce the exponent by 1. Always differentiate, then (for integrals) reverse — do not mix the two rules.",
    "tutoring": {
      "steps": [
        "Power rule: multiply by the old exponent, then reduce the exponent by 1.",
        "Always differentiate, then (for integrals) reverse — do not mix the two rules."
      ],
      "whyNotOthers": "x^(n+1)/(n+1) is the integral power rule, not the derivative."
    }
  },
  {
    "id": "R02",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [sin x] equals:",
    "choices": [
      "−cos x",
      "cos x",
      "sin x",
      "−sin x"
    ],
    "answer": "B",
    "explanation": "Derivative of sine is cosine. In radians, d/dx sin x = cos x.",
    "tutoring": {
      "steps": [
        "In radians, d/dx sin x = cos x."
      ],
      "whyNotOthers": "-sin and -cos belong to other standard derivatives."
    }
  },
  {
    "id": "R03",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [cos x] equals:",
    "choices": [
      "sin x",
      "−sin x",
      "cos x",
      "−cos x"
    ],
    "answer": "B",
    "explanation": "Derivative of cosine is −sine. d/dx cos x = -sin x. Watch the sign.",
    "tutoring": {
      "steps": [
        "d/dx cos x = -sin x. Watch the sign."
      ],
      "whyNotOthers": "Writing +sin x is the classic cos-derivative error."
    }
  },
  {
    "id": "R04",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [e^x] equals:",
    "choices": [
      "x e^(x−1)",
      "e^x",
      "ln x",
      "1/x"
    ],
    "answer": "B",
    "explanation": "Exponential e^x is its own derivative. e^x is its own derivative — unique and heavily tested.",
    "tutoring": {
      "steps": [
        "e^x is its own derivative — unique and heavily tested."
      ],
      "whyNotOthers": "Power-rule shapes like x e^(x-1) do not apply to base-e exponential."
    }
  },
  {
    "id": "R05",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [ln x] (x > 0) equals:",
    "choices": [
      "ln x",
      "1/x",
      "e^x",
      "x"
    ],
    "answer": "B",
    "explanation": "Natural log derivative is 1/x. d/dx ln x = 1/x for x>0 (more generally ln|x|).",
    "tutoring": {
      "steps": [
        "d/dx ln x = 1/x for x>0 (more generally ln|x|)."
      ],
      "whyNotOthers": "ln x is not self-derivative; e^x is."
    }
  },
  {
    "id": "R06",
    "topics": [
      "derivative-rules"
    ],
    "stem": "Product rule: (uv)′ equals:",
    "choices": [
      "u′v′",
      "u′v + uv′",
      "u′/v + u/v′",
      "uv"
    ],
    "answer": "B",
    "explanation": "First·d(second) + second·d(first). Product: (uv)' = u'v + uv'. Say it: first times d(second) plus second times d(first).",
    "tutoring": {
      "steps": [
        "Product: (uv)' = u'v + uv'.",
        "Say it: first times d(second) plus second times d(first)."
      ],
      "whyNotOthers": "u'v' is not the product rule."
    }
  },
  {
    "id": "R07",
    "topics": [
      "derivative-rules"
    ],
    "stem": "Quotient rule: (u/v)′ equals:",
    "choices": [
      "(u′v − uv′)/v²",
      "(u′v + uv′)/v²",
      "u′/v′",
      "v/u"
    ],
    "answer": "A",
    "explanation": "Low d(high) − high d(low), over low squared. Quotient: (u/v)' = (u'v - uv') / v^2. The middle sign is minus — memorize with a phrase you like.",
    "tutoring": {
      "steps": [
        "Quotient: (u/v)' = (u'v - uv') / v^2.",
        "The middle sign is minus — memorize with a phrase you like."
      ],
      "whyNotOthers": "A plus sign in the numerator is a very common wrong answer."
    }
  },
  {
    "id": "R08",
    "topics": [
      "derivative-rules"
    ],
    "stem": "Chain rule: d/dx [f(g(x))] equals:",
    "choices": [
      "f′(g(x))",
      "f′(g(x)) · g′(x)",
      "f(g′(x))",
      "g′(f(x))"
    ],
    "answer": "B",
    "explanation": "Outer derivative evaluated at inner, times inner derivative. Chain rule: derivative of outside (leave inside alone) times derivative of inside.",
    "tutoring": {
      "steps": [
        "Chain rule: derivative of outside (leave inside alone) times derivative of inside."
      ],
      "whyNotOthers": "Forgetting to multiply by g'(x) is the #1 chain-rule mistake."
    }
  },
  {
    "id": "R09",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [(3x+1)⁵] equals:",
    "choices": [
      "5(3x+1)⁴",
      "15(3x+1)⁴",
      "5(3x+1)⁴ · 3 only as 5·3",
      "15(3x+1)⁵"
    ],
    "answer": "B",
    "explanation": "Chain: 5(3x+1)⁴ · 3 = 15(3x+1)⁴. Outside: 5(3x+1)^4. Inside derivative: 3. Multiply: 15(3x+1)^4.",
    "tutoring": {
      "steps": [
        "Outside: 5(3x+1)^4. Inside derivative: 3. Multiply: 15(3x+1)^4."
      ],
      "whyNotOthers": "5(3x+1)^4 alone forgot the chain factor 3."
    }
  },
  {
    "id": "R10",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [x sin x] equals:",
    "choices": [
      "cos x",
      "sin x + x cos x",
      "x cos x",
      "sin x − x cos x"
    ],
    "answer": "B",
    "explanation": "Product: 1·sin x + x·cos x. u=x, v=sin x => sin x + x cos x.",
    "tutoring": {
      "steps": [
        "u=x, v=sin x => sin x + x cos x."
      ],
      "whyNotOthers": "x cos x alone forgot the first term of the product rule."
    }
  },
  {
    "id": "R11",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [tan x] equals:",
    "choices": [
      "sec x",
      "sec² x",
      "csc² x",
      "−sec² x"
    ],
    "answer": "B",
    "explanation": "Derivative of tan is sec². d/dx tan x = sec^2 x.",
    "tutoring": {
      "steps": [
        "d/dx tan x = sec^2 x."
      ],
      "whyNotOthers": "sec x alone is incomplete; csc^2 is for -cot."
    }
  },
  {
    "id": "R12",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [√x] equals:",
    "choices": [
      "1/(2√x)",
      "2√x",
      "√x / 2",
      "1/√x"
    ],
    "answer": "A",
    "explanation": "x^(1/2) → (1/2)x^(−1/2). sqrt(x)=x^(1/2) => (1/2)x^(-1/2)=1/(2 sqrt(x)).",
    "tutoring": {
      "steps": [
        "sqrt(x)=x^(1/2) => (1/2)x^(-1/2)=1/(2 sqrt(x))."
      ],
      "whyNotOthers": "2 sqrt(x) is related to integrating sqrt, not this derivative."
    }
  },
  {
    "id": "R13",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [ln(3x)] equals:",
    "choices": [
      "1/(3x)",
      "3/x",
      "1/x",
      "3 ln x"
    ],
    "answer": "C",
    "explanation": "Chain: (1/(3x))·3 = 1/x. ln(3x)=ln 3 + ln x, derivative 1/x. Or chain: (1/(3x))*3 = 1/x.",
    "tutoring": {
      "steps": [
        "ln(3x)=ln 3 + ln x, derivative 1/x. Or chain: (1/(3x))*3 = 1/x."
      ],
      "whyNotOthers": "1/(3x) forgot to multiply by the chain-rule 3."
    }
  },
  {
    "id": "R14",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d/dx [e^(2x)] equals:",
    "choices": [
      "e^(2x)",
      "2e^(2x)",
      "e^x",
      "2e^x"
    ],
    "answer": "B",
    "explanation": "Chain: e^(2x)·2. d/dx e^(2x) = e^(2x)*2 = 2e^(2x).",
    "tutoring": {
      "steps": [
        "d/dx e^(2x) = e^(2x)*2 = 2e^(2x)."
      ],
      "whyNotOthers": "e^(2x) alone forgot the factor 2."
    }
  },
  {
    "id": "R15",
    "topics": [
      "derivative-rules"
    ],
    "stem": "If y = cos(x²), y′ equals:",
    "choices": [
      "−sin(x²)",
      "−2x sin(x²)",
      "2x cos(x²)",
      "−sin(2x)"
    ],
    "answer": "B",
    "explanation": "Chain: −sin(x²)·2x. Outer cos, inner x^2: -sin(x^2)*2x = -2x sin(x^2).",
    "tutoring": {
      "steps": [
        "Outer cos, inner x^2: -sin(x^2)*2x = -2x sin(x^2)."
      ],
      "whyNotOthers": "-sin(x^2) forgot *2x; -sin(2x) used a wrong simplification."
    }
  },
  {
    "id": "R16",
    "topics": [
      "derivative-rules"
    ],
    "stem": "d²/dx² [x³] equals:",
    "choices": [
      "3x²",
      "6x",
      "x",
      "6"
    ],
    "answer": "B",
    "explanation": "First 3x², second 6x. First derivative 3x^2; second derivative 6x.",
    "tutoring": {
      "steps": [
        "First derivative 3x^2; second derivative 6x."
      ],
      "whyNotOthers": "3x^2 is only the first derivative."
    }
  },
  {
    "id": "A01",
    "topics": [
      "applications"
    ],
    "stem": "To find absolute max of continuous f on [a,b], check:",
    "choices": [
      "only critical points",
      "critical points in (a,b) and endpoints",
      "only endpoints",
      "where f″=0 only"
    ],
    "answer": "B",
    "explanation": "Closed Interval Method. Continuous on [a,b] => absolute max/min exist. Check critical points in (a,b) AND both endpoints; compare f values.",
    "tutoring": {
      "steps": [
        "Continuous on [a,b] => absolute max/min exist.",
        "Check critical points in (a,b) AND both endpoints; compare f values."
      ],
      "whyNotOthers": "Skipping endpoints loses many absolute extrema on closed intervals."
    }
  },
  {
    "id": "A02",
    "topics": [
      "applications"
    ],
    "stem": "If f′ changes from + to − at c, then f has a local:",
    "choices": [
      "min at c",
      "max at c",
      "neither",
      "inflection only"
    ],
    "answer": "B",
    "explanation": "First derivative test: + to − → local max. First-derivative test: f' changes + to - => local maximum.",
    "tutoring": {
      "steps": [
        "First-derivative test: f' changes + to - => local maximum."
      ],
      "whyNotOthers": "Change - to + is a local minimum."
    }
  },
  {
    "id": "A03",
    "topics": [
      "applications"
    ],
    "stem": "If f″(c) > 0 and f′(c)=0, then f has a local:",
    "choices": [
      "max at c",
      "min at c",
      "neither guaranteed",
      "discontinuity"
    ],
    "answer": "B",
    "explanation": "Second derivative test: f″>0 → concave up → local min. If f'(c)=0 and f''(c)>0, graph is concave up => local min.",
    "tutoring": {
      "steps": [
        "If f'(c)=0 and f''(c)>0, graph is concave up => local min."
      ],
      "whyNotOthers": "f''<0 => local max; f''=0 is inconclusive."
    }
  },
  {
    "id": "A04",
    "topics": [
      "applications"
    ],
    "stem": "Related rates problems use:",
    "choices": [
      "implicit differentiation w.r.t. time",
      "only integrals",
      "only limits at infinity",
      "u-sub only"
    ],
    "answer": "A",
    "explanation": "Differentiate both sides with respect to t. Related rates: equation from geometry/physics, differentiate both sides w.r.t. time t. Plug in known values only AFTER differentiating.",
    "tutoring": {
      "steps": [
        "Related rates: equation from geometry/physics, differentiate both sides w.r.t. time t.",
        "Plug in known values only AFTER differentiating."
      ],
      "whyNotOthers": "Integrals accumulate; they are not the first tool for related rates."
    }
  },
  {
    "id": "A05",
    "topics": [
      "applications"
    ],
    "stem": "Linear approximation of f near a is:",
    "choices": [
      "L(x) = f(a) + f′(a)(x−a)",
      "L(x) = f′(a)",
      "L(x) = f(a)x",
      "L(x) = f″(a)"
    ],
    "answer": "A",
    "explanation": "Tangent line approximation. Linearization / tangent approximation: L(x)=f(a)+f'(a)(x-a).",
    "tutoring": {
      "steps": [
        "Linearization / tangent approximation: L(x)=f(a)+f'(a)(x-a)."
      ],
      "whyNotOthers": "f'(a) is only the slope number, not the approximating line function."
    }
  },
  {
    "id": "A06",
    "topics": [
      "applications"
    ],
    "stem": "Mean Value Theorem requires f continuous on [a,b] and differentiable on (a,b). Then there exists c with:",
    "choices": [
      "f′(c) = 0",
      "f′(c) = [f(b)−f(a)]/(b−a)",
      "f(c)=0",
      "f″(c)=0"
    ],
    "answer": "B",
    "explanation": "Instantaneous rate equals average rate somewhere. MVT: some c in (a,b) has f'(c) equal to average rate [f(b)-f(a)]/(b-a).",
    "tutoring": {
      "steps": [
        "MVT: some c in (a,b) has f'(c) equal to average rate [f(b)-f(a)]/(b-a)."
      ],
      "whyNotOthers": "f'(c)=0 is Rolle when f(a)=f(b), a special case of MVT."
    }
  },
  {
    "id": "A07",
    "topics": [
      "applications"
    ],
    "stem": "A point of inflection is where:",
    "choices": [
      "f′=0 always",
      "concavity changes",
      "f is discontinuous",
      "f′ does not exist only"
    ],
    "answer": "B",
    "explanation": "Concavity change (often f″ changes sign). Inflection point: concavity changes (typically f'' changes sign).",
    "tutoring": {
      "steps": [
        "Inflection point: concavity changes (typically f'' changes sign)."
      ],
      "whyNotOthers": "f'=0 is horizontal tangent, not automatically an inflection."
    }
  },
  {
    "id": "A08",
    "topics": [
      "applications"
    ],
    "stem": "Horizontal asymptote y = L means:",
    "choices": [
      "lim(x→∞) f(x) = L (or x→−∞)",
      "f′(L)=0",
      "f(L)=0",
      "vertical asymptote"
    ],
    "answer": "A",
    "explanation": "End behavior approaches a horizontal line. Horizontal asymptote y=L means f(x)->L as x-> +/- infinity (one or both ends).",
    "tutoring": {
      "steps": [
        "Horizontal asymptote y=L means f(x)->L as x-> +/- infinity (one or both ends)."
      ],
      "whyNotOthers": "Vertical asymptotes are finite x where f blows up."
    }
  },
  {
    "id": "A09",
    "topics": [
      "applications"
    ],
    "stem": "For optimization with constraint, a common strategy is:",
    "choices": [
      "express as one-variable function then f′=0",
      "always integrate first",
      "ignore domain",
      "set f=0 only"
    ],
    "answer": "A",
    "explanation": "Eliminate a variable, then maximize/minimize. Use constraints to get a single-variable function, note domain, then f'=0 / endpoints.",
    "tutoring": {
      "steps": [
        "Use constraints to get a single-variable function, note domain, then f'=0 / endpoints."
      ],
      "whyNotOthers": "Integrating first is for accumulation, not the standard max/min setup."
    }
  },
  {
    "id": "A10",
    "topics": [
      "applications"
    ],
    "stem": "If a particle has position s(t), velocity is:",
    "choices": [
      "s″(t)",
      "s′(t)",
      "∫ s",
      "s(t)/t always"
    ],
    "answer": "B",
    "explanation": "v = ds/dt. Velocity is the time-derivative of position: v = s'.",
    "tutoring": {
      "steps": [
        "Velocity is the time-derivative of position: v = s'."
      ],
      "whyNotOthers": "s'' is acceleration."
    }
  },
  {
    "id": "A11",
    "topics": [
      "applications"
    ],
    "stem": "Acceleration is:",
    "choices": [
      "s′(t)",
      "v′(t) = s″(t)",
      "∫ v only",
      "s(t)"
    ],
    "answer": "B",
    "explanation": "a = dv/dt = d²s/dt². Acceleration a = v' = s''.",
    "tutoring": {
      "steps": [
        "Acceleration a = v' = s''."
      ],
      "whyNotOthers": "s' is only velocity."
    }
  },
  {
    "id": "A12",
    "topics": [
      "applications"
    ],
    "stem": "Newton's method iterates:",
    "choices": [
      "x_{n+1} = x_n − f(x_n)/f′(x_n)",
      "x + f(x)",
      "f′(x)/f(x)",
      "∫ f"
    ],
    "answer": "A",
    "explanation": "Root-finding via tangent line (if your course covers it). Newton iteration: x_{n+1} = x_n - f(x_n)/f'(x_n) (follow the tangent to the root).",
    "tutoring": {
      "steps": [
        "Newton iteration: x_{n+1} = x_n - f(x_n)/f'(x_n) (follow the tangent to the root)."
      ],
      "whyNotOthers": "Missing the minus or the update structure is incomplete."
    }
  },
  {
    "id": "A13",
    "topics": [
      "applications"
    ],
    "stem": "A ladder 10 ft slides: bottom moves away at 2 ft/s. Related rates typically relate:",
    "choices": [
      "x and y with x²+y²=100",
      "only x",
      "only angles with no sides",
      "volume only"
    ],
    "answer": "A",
    "explanation": "Pythagorean constraint; differentiate w.r.t. Ladder constraint x^2 + y^2 = L^2. Differentiate: 2x x' + 2y y' = 0. Solve for the unknown rate using known values.",
    "tutoring": {
      "steps": [
        "Ladder constraint x^2 + y^2 = L^2. Differentiate: 2x x' + 2y y' = 0.",
        "Solve for the unknown rate using known values."
      ],
      "whyNotOthers": "You need the full Pythagorean relationship, not a single variable alone."
    }
  },
  {
    "id": "A14",
    "topics": [
      "applications"
    ],
    "stem": "If f′(x) = 0 for all x in an interval, then f is:",
    "choices": [
      "increasing",
      "constant on that interval",
      "quadratic",
      "undefined"
    ],
    "answer": "B",
    "explanation": "Zero derivative implies constant (on an interval). If f'=0 for all x on an interval, then f is constant on that interval.",
    "tutoring": {
      "steps": [
        "If f'=0 for all x on an interval, then f is constant on that interval."
      ],
      "whyNotOthers": "Increasing requires f'>0 (not zero)."
    }
  },
  {
    "id": "I01",
    "topics": [
      "integrals"
    ],
    "stem": "∫ x^n dx (n ≠ −1) equals:",
    "choices": [
      "n x^(n−1) + C",
      "x^(n+1)/(n+1) + C",
      "x^n / n + C",
      "ln|x| + C"
    ],
    "answer": "B",
    "explanation": "Power rule for antiderivatives. Integral power rule: raise exponent by 1, divide by the new exponent, add +C (n != -1). Always differentiate your answer to check.",
    "tutoring": {
      "steps": [
        "Integral power rule: raise exponent by 1, divide by the new exponent, add +C (n != -1).",
        "Always differentiate your answer to check."
      ],
      "whyNotOthers": "n x^(n-1) is the derivative power rule — opposite direction."
    }
  },
  {
    "id": "I02",
    "topics": [
      "integrals"
    ],
    "stem": "∫ 1/x dx equals:",
    "choices": [
      "x²/2 + C",
      "ln|x| + C",
      "1/x² + C",
      "e^x + C"
    ],
    "answer": "B",
    "explanation": "Antiderivative of 1/x is ln|x|. The case n=-1: integral of 1/x is ln|x| + C.",
    "tutoring": {
      "steps": [
        "The case n=-1: integral of 1/x is ln|x| + C."
      ],
      "whyNotOthers": "x^2/2 is the integral of x, not 1/x."
    }
  },
  {
    "id": "I03",
    "topics": [
      "integrals"
    ],
    "stem": "∫ e^x dx equals:",
    "choices": [
      "e^x + C",
      "x e^x + C",
      "ln x + C",
      "e^(x+1) + C"
    ],
    "answer": "A",
    "explanation": "e^x is its own antiderivative. Integral of e^x is e^x + C.",
    "tutoring": {
      "steps": [
        "Integral of e^x is e^x + C."
      ],
      "whyNotOthers": "No extra polynomial factor without a more advanced technique."
    }
  },
  {
    "id": "I04",
    "topics": [
      "integrals"
    ],
    "stem": "∫ cos x dx equals:",
    "choices": [
      "sin x + C",
      "−sin x + C",
      "cos x + C",
      "−cos x + C"
    ],
    "answer": "A",
    "explanation": "Derivative of sin is cos. Because d/dx sin x = cos x, integral of cos x is sin x + C.",
    "tutoring": {
      "steps": [
        "Because d/dx sin x = cos x, integral of cos x is sin x + C."
      ],
      "whyNotOthers": "-sin is the derivative of cos, not the integral of cos."
    }
  },
  {
    "id": "I05",
    "topics": [
      "integrals"
    ],
    "stem": "∫ sin x dx equals:",
    "choices": [
      "cos x + C",
      "−cos x + C",
      "sin x + C",
      "−sin x + C"
    ],
    "answer": "B",
    "explanation": "Derivative of −cos is sin. d/dx (-cos x) = sin x, so integral of sin x is -cos x + C. Sign errors here are extremely common on finals.",
    "tutoring": {
      "steps": [
        "d/dx (-cos x) = sin x, so integral of sin x is -cos x + C.",
        "Sign errors here are extremely common on finals."
      ],
      "whyNotOthers": "Forgetting the minus is the usual wrong answer."
    }
  },
  {
    "id": "I06",
    "topics": [
      "integrals"
    ],
    "stem": "Fundamental Theorem of Calculus (part 1): d/dx ∫_a^x f(t) dt equals:",
    "choices": [
      "f(a)",
      "f(x)",
      "F(x)−F(a)",
      "0"
    ],
    "answer": "B",
    "explanation": "Derivative of integral from a to x is f(x) (if f continuous). FTC part 1: d/dx of integral from a to x of f(t) dt equals f(x) when f is continuous.",
    "tutoring": {
      "steps": [
        "FTC part 1: d/dx of integral from a to x of f(t) dt equals f(x) when f is continuous."
      ],
      "whyNotOthers": "f(a) is constant; F(x)-F(a) is the integral value, not this derivative."
    }
  },
  {
    "id": "I07",
    "topics": [
      "integrals"
    ],
    "stem": "FTC part 2: ∫_a^b f(x) dx equals:",
    "choices": [
      "f(b)−f(a)",
      "F(b)−F(a) where F′=f",
      "f′(b)−f′(a)",
      "F(a)+F(b)"
    ],
    "answer": "B",
    "explanation": "Evaluate any antiderivative at endpoints. FTC part 2: if F'=f, then integral from a to b of f is F(b)-F(a).",
    "tutoring": {
      "steps": [
        "FTC part 2: if F'=f, then integral from a to b of f is F(b)-F(a)."
      ],
      "whyNotOthers": "f(b)-f(a) is not generally the integral of f."
    }
  },
  {
    "id": "I08",
    "topics": [
      "integrals"
    ],
    "stem": "∫_0^1 2x dx equals:",
    "choices": [
      "0",
      "1",
      "2",
      "1/2"
    ],
    "answer": "B",
    "explanation": "[x²]_0^1 = 1. Antiderivative of 2x is x^2. Evaluate from 0 to 1: 1-0=1.",
    "tutoring": {
      "steps": [
        "Antiderivative of 2x is x^2. Evaluate from 0 to 1: 1-0=1."
      ],
      "whyNotOthers": "2 would mean you forgot to integrate properly."
    }
  },
  {
    "id": "I09",
    "topics": [
      "integrals"
    ],
    "stem": "Average value of f on [a,b] is:",
    "choices": [
      "(1/(b−a)) ∫_a^b f",
      "∫ f",
      "f(b)−f(a)",
      "f′(b)"
    ],
    "answer": "A",
    "explanation": "Mean value for integrals. Average value on [a,b] is (1/(b-a)) * definite integral of f on [a,b].",
    "tutoring": {
      "steps": [
        "Average value on [a,b] is (1/(b-a)) * definite integral of f on [a,b]."
      ],
      "whyNotOthers": "The bare integral is net area, not average height."
    }
  },
  {
    "id": "I10",
    "topics": [
      "integrals"
    ],
    "stem": "∫ (3x² + 2) dx equals:",
    "choices": [
      "x³ + 2x + C",
      "6x + C",
      "x³ + 2 + C",
      "3x³ + 2x + C"
    ],
    "answer": "A",
    "explanation": "x³ + 2x + C. Integrate term by term: integral (3x^2+2) dx = x^3 + 2x + C. Differentiate: 3x^2+2 checks out.",
    "tutoring": {
      "steps": [
        "Integrate term by term: integral (3x^2+2) dx = x^3 + 2x + C.",
        "Differentiate: 3x^2+2 checks out."
      ],
      "whyNotOthers": "Always differentiate to catch coefficient errors."
    }
  },
  {
    "id": "I11",
    "topics": [
      "integrals"
    ],
    "stem": "If ∫_0^2 f = 5 and ∫_0^2 g = 2, then ∫_0^2 (f−g) equals:",
    "choices": [
      "3",
      "7",
      "10",
      "2.5"
    ],
    "answer": "A",
    "explanation": "Linearity of integrals: 5 − 2 = 3. Linearity: integral(f-g)=integral f - integral g = 5-2=3.",
    "tutoring": {
      "steps": [
        "Linearity: integral(f-g)=integral f - integral g = 5-2=3."
      ],
      "whyNotOthers": "Adding the integrals would give 7, not the difference."
    }
  },
  {
    "id": "I12",
    "topics": [
      "integrals"
    ],
    "stem": "A definite integral ∫_a^b f(x) dx can represent:",
    "choices": [
      "only a derivative",
      "net signed area between curve and x-axis",
      "only volume",
      "a limit that never exists"
    ],
    "answer": "B",
    "explanation": "Net area interpretation (positive above, negative below). Definite integral measures net signed area (above axis +, below -).",
    "tutoring": {
      "steps": [
        "Definite integral measures net signed area (above axis +, below -)."
      ],
      "whyNotOthers": "It is not \"only a derivative.\""
    }
  },
  {
    "id": "I13",
    "topics": [
      "integrals"
    ],
    "stem": "∫ sec² x dx equals:",
    "choices": [
      "tan x + C",
      "sec x + C",
      "sec x tan x + C",
      "−cot x + C"
    ],
    "answer": "A",
    "explanation": "Derivative of tan is sec². Because d/dx tan x = sec^2 x, integral of sec^2 x is tan x + C.",
    "tutoring": {
      "steps": [
        "Because d/dx tan x = sec^2 x, integral of sec^2 x is tan x + C."
      ],
      "whyNotOthers": "sec tan is the derivative of sec, not this integral."
    }
  },
  {
    "id": "I14",
    "topics": [
      "integrals"
    ],
    "stem": "If F′ = f, then ∫_1^4 f(x) dx equals:",
    "choices": [
      "F(4)/F(1)",
      "F(4) − F(1)",
      "F(4) + F(1)",
      "f(4) − f(1)"
    ],
    "answer": "B",
    "explanation": "FTC: F(b) − F(a). By FTC, integral_1^4 f = F(4)-F(1) when F'=f.",
    "tutoring": {
      "steps": [
        "By FTC, integral_1^4 f = F(4)-F(1) when F'=f."
      ],
      "whyNotOthers": "A ratio F(4)/F(1) has no meaning here."
    }
  },
  {
    "id": "U01",
    "topics": [
      "substitution"
    ],
    "stem": "For ∫ 2x cos(x²) dx, a good u is:",
    "choices": [
      "2x",
      "x²",
      "cos(x²)",
      "sin x"
    ],
    "answer": "B",
    "explanation": "u = x², du = 2x dx matches. Inside of cos is x^2; its derivative 2x multiplies outside — set u=x^2.",
    "tutoring": {
      "steps": [
        "Inside of cos is x^2; its derivative 2x multiplies outside — set u=x^2."
      ],
      "whyNotOthers": "u=2x is the derivative factor, not the composite inside."
    }
  },
  {
    "id": "U02",
    "topics": [
      "substitution"
    ],
    "stem": "∫ e^(3x) dx equals:",
    "choices": [
      "e^(3x) + C",
      "(1/3)e^(3x) + C",
      "3e^(3x) + C",
      "e^x / 3 + C"
    ],
    "answer": "B",
    "explanation": "u = 3x, du = 3 dx → (1/3)e^u. u=3x, du=3 dx, so dx=du/3 => (1/3) integral e^u du = (1/3)e^(3x)+C.",
    "tutoring": {
      "steps": [
        "u=3x, du=3 dx, so dx=du/3 => (1/3) integral e^u du = (1/3)e^(3x)+C."
      ],
      "whyNotOthers": "Forgetting the 1/3 is the reverse-chain-rule error."
    }
  },
  {
    "id": "U03",
    "topics": [
      "substitution"
    ],
    "stem": "∫ (2x+1)^5 · 2 dx equals:",
    "choices": [
      "(2x+1)^6 / 6 + C",
      "(2x+1)^6 + C",
      "2(2x+1)^5 + C",
      "(2x+1)^5 / 5 + C"
    ],
    "answer": "A",
    "explanation": "u = 2x+1, du = 2 dx → u^6/6. u=2x+1, du=2 dx matches the factor 2 => integral u^5 du = u^6/6 + C.",
    "tutoring": {
      "steps": [
        "u=2x+1, du=2 dx matches the factor 2 => integral u^5 du = u^6/6 + C."
      ],
      "whyNotOthers": "Dividing by 5 alone forgets the +1 in the power rule for antiderivatives."
    }
  },
  {
    "id": "U04",
    "topics": [
      "substitution"
    ],
    "stem": "∫ sin(x) cos(x) dx can use u =:",
    "choices": [
      "sin x or cos x",
      "x only",
      "tan x only",
      "e^x"
    ],
    "answer": "A",
    "explanation": "Either works; du matches the other factor (±). u=sin x works with du=cos x dx; u=cos x works with a minus sign.",
    "tutoring": {
      "steps": [
        "u=sin x works with du=cos x dx; u=cos x works with a minus sign."
      ],
      "whyNotOthers": "A random u=x does not simplify sin(x)cos(x)."
    }
  },
  {
    "id": "U05",
    "topics": [
      "substitution"
    ],
    "stem": "∫_0^1 2x(x²+1)^3 dx equals:",
    "choices": [
      "0",
      "15/4",
      "4",
      "1"
    ],
    "answer": "B",
    "explanation": "u=x²+1, u:1→2; ∫_1^2 u^3 du = [u^4/4]_1^2 = 4 − 1/4 = 15/4. u=x^2+1, du=2x dx. When x goes 0->1, u goes 1->2. integral_1^2 u^3 du = [u^4/4]_1^2 = 4 - 1/4 = 15/4.",
    "tutoring": {
      "steps": [
        "u=x^2+1, du=2x dx. When x goes 0->1, u goes 1->2.",
        "integral_1^2 u^3 du = [u^4/4]_1^2 = 4 - 1/4 = 15/4."
      ],
      "whyNotOthers": "Using x-limits while the integrand is in u is inconsistent."
    }
  },
  {
    "id": "U06",
    "topics": [
      "substitution"
    ],
    "stem": "When substituting in a definite integral, you should:",
    "choices": [
      "always convert limits to u-limits (or back-sub carefully)",
      "never change limits",
      "drop +C",
      "use product rule"
    ],
    "answer": "A",
    "explanation": "Change limits with u(x), or return to x before evaluating. Either convert limits to u-limits, or return the antiderivative to x before using original limits.",
    "tutoring": {
      "steps": [
        "Either convert limits to u-limits, or return the antiderivative to x before using original limits."
      ],
      "whyNotOthers": "Never leave an integral written in u with x-limits still attached."
    }
  },
  {
    "id": "U07",
    "topics": [
      "substitution"
    ],
    "stem": "∫ dx/(2x+5) equals:",
    "choices": [
      "ln|2x+5| + C",
      "(1/2)ln|2x+5| + C",
      "2 ln|2x+5| + C",
      "1/(2x+5) + C"
    ],
    "answer": "B",
    "explanation": "u=2x+5, du=2dx → (1/2)ln|u|. u=2x+5, du=2 dx => (1/2) integral du/u = (1/2)ln|2x+5|+C.",
    "tutoring": {
      "steps": [
        "u=2x+5, du=2 dx => (1/2) integral du/u = (1/2)ln|2x+5|+C."
      ],
      "whyNotOthers": "ln|2x+5| without 1/2 forgot du=2 dx."
    }
  },
  {
    "id": "U08",
    "topics": [
      "substitution"
    ],
    "stem": "∫ x e^(x²) dx equals:",
    "choices": [
      "e^(x²) + C",
      "(1/2)e^(x²) + C",
      "x² e^(x²) + C",
      "e^x + C"
    ],
    "answer": "B",
    "explanation": "u=x², du=2x dx. u=x^2, du=2x dx => (1/2) integral e^u du = (1/2)e^(x^2)+C.",
    "tutoring": {
      "steps": [
        "u=x^2, du=2x dx => (1/2) integral e^u du = (1/2)e^(x^2)+C."
      ],
      "whyNotOthers": "e^(x^2) without 1/2 is incomplete."
    }
  },
  {
    "id": "U09",
    "topics": [
      "substitution"
    ],
    "stem": "∫ cos(5x) dx equals:",
    "choices": [
      "sin(5x) + C",
      "(1/5)sin(5x) + C",
      "5 sin(5x) + C",
      "−sin(5x) + C"
    ],
    "answer": "B",
    "explanation": "u=5x, (1/5)sin u. u=5x, du=5 dx => (1/5)sin(5x)+C.",
    "tutoring": {
      "steps": [
        "u=5x, du=5 dx => (1/5)sin(5x)+C."
      ],
      "whyNotOthers": "sin(5x) without 1/5 forgot the chain reverse factor."
    }
  },
  {
    "id": "U10",
    "topics": [
      "substitution"
    ],
    "stem": "A substitution works best when the integrand contains:",
    "choices": [
      "a function and (nearly) its derivative as a factor",
      "only polynomials always",
      "no chain structure",
      "only absolute values"
    ],
    "answer": "A",
    "explanation": "Pattern: f′(g(x)) g′(x) or similar. u-sub is for a composite piece whose derivative (almost) multiplies the rest of the integrand.",
    "tutoring": {
      "steps": [
        "u-sub is for a composite piece whose derivative (almost) multiplies the rest of the integrand."
      ],
      "whyNotOthers": "Not every integral needs u-sub — plain power rule often works."
    }
  },
  {
    "id": "V01",
    "topics": [
      "area-volume"
    ],
    "stem": "Area between y=f(x) and y=g(x) on [a,b] (f≥g) is:",
    "choices": [
      "∫_a^b [f−g] dx",
      "∫ (f+g)",
      "f′−g′",
      "∫ f·g"
    ],
    "answer": "A",
    "explanation": "Top minus bottom integrated. Area between curves: integrate (top function minus bottom function) over the right interval.",
    "tutoring": {
      "steps": [
        "Area between curves: integrate (top function minus bottom function) over the right interval."
      ],
      "whyNotOthers": "Adding the functions is not the area between them."
    }
  },
  {
    "id": "V02",
    "topics": [
      "area-volume"
    ],
    "stem": "Disk method about x-axis: V =:",
    "choices": [
      "∫ π [R(x)]² dx",
      "∫ 2π R",
      "∫ R dx",
      "∫ π R"
    ],
    "answer": "A",
    "explanation": "Cross-section disks: π radius squared. Disk method: cross-section is a disk with area pi R^2; integrate along the axis.",
    "tutoring": {
      "steps": [
        "Disk method: cross-section is a disk with area pi R^2; integrate along the axis."
      ],
      "whyNotOthers": "Missing pi or forgetting to square R loses most of the credit."
    }
  },
  {
    "id": "V03",
    "topics": [
      "area-volume"
    ],
    "stem": "Washer method accounts for:",
    "choices": [
      "a hole by π(R_outer² − R_inner²)",
      "only surface area",
      "derivatives only",
      "arc length only"
    ],
    "answer": "A",
    "explanation": "Outer radius squared minus inner radius squared. Washer: outer disk minus inner hole => pi(R_out^2 - R_in^2).",
    "tutoring": {
      "steps": [
        "Washer: outer disk minus inner hole => pi(R_out^2 - R_in^2)."
      ],
      "whyNotOthers": "Subtracting radii without squaring each radius is wrong."
    }
  },
  {
    "id": "V04",
    "topics": [
      "area-volume"
    ],
    "stem": "∫_0^1 x dx (area under y=x) equals:",
    "choices": [
      "0",
      "1/2",
      "1",
      "2"
    ],
    "answer": "B",
    "explanation": "Triangle area 1/2. integral_0^1 x dx = [x^2/2]_0^1 = 1/2 (triangle under y=x).",
    "tutoring": {
      "steps": [
        "integral_0^1 x dx = [x^2/2]_0^1 = 1/2 (triangle under y=x)."
      ],
      "whyNotOthers": "1 would be the area of the unit square, not under y=x."
    }
  },
  {
    "id": "V05",
    "topics": [
      "area-volume"
    ],
    "stem": "If f is below the x-axis on [a,b], ∫_a^b f is:",
    "choices": [
      "positive always",
      "negative (signed area)",
      "zero always",
      "undefined"
    ],
    "answer": "B",
    "explanation": "Definite integral measures signed area. Where f is below the axis, f is negative, so the integral contribution is negative (signed area).",
    "tutoring": {
      "steps": [
        "Where f is below the axis, f is negative, so the integral contribution is negative (signed area)."
      ],
      "whyNotOthers": "Total geometric area would use absolute value; net area keeps signs."
    }
  },
  {
    "id": "V06",
    "topics": [
      "area-volume"
    ],
    "stem": "To find area between curves, first often find:",
    "choices": [
      "intersection points for limits",
      "only derivatives",
      "only f″",
      "asymptotes only"
    ],
    "answer": "A",
    "explanation": "Intersections give a and b (or split intervals). Find intersections f=g to get limits of integration (or split where top/bottom swaps).",
    "tutoring": {
      "steps": [
        "Find intersections f=g to get limits of integration (or split where top/bottom swaps)."
      ],
      "whyNotOthers": "Derivatives alone do not give the bounds between two curves."
    }
  },
  {
    "id": "V07",
    "topics": [
      "area-volume"
    ],
    "stem": "Shell method (about y-axis) uses integrand proportional to:",
    "choices": [
      "2π x f(x)",
      "π [f(x)]² only always",
      "f′(x)",
      "1/x"
    ],
    "answer": "A",
    "explanation": "Circumference × height × thickness (if taught in Calc I). Cylindrical shells about the y-axis often look like integral 2 pi x f(x) dx (when taught).",
    "tutoring": {
      "steps": [
        "Cylindrical shells about the y-axis often look like integral 2 pi x f(x) dx (when taught)."
      ],
      "whyNotOthers": "pi [f(x)]^2 is the disk formula for a different setup."
    }
  },
  {
    "id": "V08",
    "topics": [
      "area-volume"
    ],
    "stem": "Net area of f from 0 to 2 if equal triangles above and below cancels to:",
    "choices": [
      "positive",
      "zero",
      "∞",
      "undefined"
    ],
    "answer": "B",
    "explanation": "Equal positive and negative signed areas → net 0. Equal positive and negative signed areas cancel, so the net integral can be 0.",
    "tutoring": {
      "steps": [
        "Equal positive and negative signed areas cancel, so the net integral can be 0."
      ],
      "whyNotOthers": "Total area of the regions would still be positive."
    }
  },
  {
    "id": "C01",
    "topics": [
      "concepts"
    ],
    "stem": "A derivative measures:",
    "choices": [
      "accumulated area",
      "instantaneous rate of change",
      "average value only",
      "total distance only"
    ],
    "answer": "B",
    "explanation": "Core meaning of derivative. Derivative = instantaneous rate of change = slope of the tangent line.",
    "tutoring": {
      "steps": [
        "Derivative = instantaneous rate of change = slope of the tangent line."
      ],
      "whyNotOthers": "Accumulated area is the integral's main story, not the derivative's."
    }
  },
  {
    "id": "C02",
    "topics": [
      "concepts"
    ],
    "stem": "A definite integral can measure:",
    "choices": [
      "slope only",
      "accumulated change / net area",
      "only critical points",
      "only concavity"
    ],
    "answer": "B",
    "explanation": "Accumulation / net area. A definite integral measures accumulated net change / net signed area.",
    "tutoring": {
      "steps": [
        "A definite integral measures accumulated net change / net signed area."
      ],
      "whyNotOthers": "Critical points come from derivatives, not from the integral alone."
    }
  },
  {
    "id": "C03",
    "topics": [
      "concepts"
    ],
    "stem": "If F is an antiderivative of f, then F′ equals:",
    "choices": [
      "∫ f",
      "f",
      "F",
      "0"
    ],
    "answer": "B",
    "explanation": "Definition of antiderivative. By definition, if F is an antiderivative of f, then F' = f.",
    "tutoring": {
      "steps": [
        "By definition, if F is an antiderivative of f, then F' = f."
      ],
      "whyNotOthers": "The integral symbol denotes a family of antiderivatives (+C), not F' itself."
    }
  },
  {
    "id": "C04",
    "topics": [
      "concepts"
    ],
    "stem": "The chain rule is needed when differentiating:",
    "choices": [
      "sums only",
      "compositions f(g(x))",
      "constants only",
      "only polynomials of degree 1"
    ],
    "answer": "B",
    "explanation": "Compositions require chain rule. Compositions f(g(x)) need the chain rule; products need product rule; quotients need quotient rule.",
    "tutoring": {
      "steps": [
        "Compositions f(g(x)) need the chain rule; products need product rule; quotients need quotient rule."
      ],
      "whyNotOthers": "Sums can be differentiated term-by-term without chain rule."
    }
  },
  {
    "id": "C05",
    "topics": [
      "concepts"
    ],
    "stem": "L'Hôpital's rule (if allowed) applies to limits of type:",
    "choices": [
      "∞ − ∞ only always",
      "0/0 or ∞/∞ (under conditions)",
      "0·∞ only",
      "1^∞ never"
    ],
    "answer": "B",
    "explanation": "Indeterminate quotients 0/0 or ∞/∞. L'Hopital (if allowed in your course): for 0/0 or infinity/infinity forms, lim f/g may equal lim f'/g' under conditions.",
    "tutoring": {
      "steps": [
        "L'Hopital (if allowed in your course): for 0/0 or infinity/infinity forms, lim f/g may equal lim f'/g' under conditions."
      ],
      "whyNotOthers": "It is not a free pass on every limit without checking the indeterminate form."
    }
  },
  {
    "id": "C06",
    "topics": [
      "concepts"
    ],
    "stem": "Velocity is negative when a particle moves:",
    "choices": [
      "right on a number line (usual)",
      "left (if positive direction is right)",
      "with a = 0 only",
      "never"
    ],
    "answer": "B",
    "explanation": "Sign of v indicates direction. If positive direction is right, then v<0 means the particle moves left.",
    "tutoring": {
      "steps": [
        "If positive direction is right, then v<0 means the particle moves left."
      ],
      "whyNotOthers": "Sign of velocity is direction of motion, not \"always right.\""
    }
  },
  {
    "id": "C07",
    "topics": [
      "concepts"
    ],
    "stem": "Continuity does not imply:",
    "choices": [
      "limits exist at the point in the continuous case on open interval carefully",
      "differentiability",
      "f(a) defined",
      "lim = f(a)"
    ],
    "answer": "B",
    "explanation": "Continuous ⇏ differentiable (e.g. Continuity is weaker than differentiability. Corners can be continuous but not differentiable.",
    "tutoring": {
      "steps": [
        "Continuity is weaker than differentiability. Corners can be continuous but not differentiable."
      ],
      "whyNotOthers": "Differentiability implies continuity, not the reverse."
    }
  },
  {
    "id": "C08",
    "topics": [
      "concepts"
    ],
    "stem": "The +C in indefinite integrals means:",
    "choices": [
      "always zero",
      "family of antiderivatives differ by a constant",
      "only for definite integrals",
      "error term"
    ],
    "answer": "B",
    "explanation": "Infinitely many antiderivatives, vertical shifts. +C appears because any constant shift of an antiderivative is still an antiderivative.",
    "tutoring": {
      "steps": [
        "+C appears because any constant shift of an antiderivative is still an antiderivative."
      ],
      "whyNotOthers": "In definite integrals, constants cancel in F(b)-F(a)."
    }
  },
  {
    "id": "C09",
    "topics": [
      "concepts"
    ],
    "stem": "Graphically, where f′ = 0 on a smooth curve, the tangent is:",
    "choices": [
      "vertical",
      "horizontal",
      "undefined always",
      "45 degrees"
    ],
    "answer": "B",
    "explanation": "Zero slope → horizontal tangent. Where f'=0 (and f' exists), the tangent line is horizontal.",
    "tutoring": {
      "steps": [
        "Where f'=0 (and f' exists), the tangent line is horizontal."
      ],
      "whyNotOthers": "Vertical tangents are infinite-slope cases, not f'=0."
    }
  },
  {
    "id": "C10",
    "topics": [
      "concepts"
    ],
    "stem": "∫_a^a f(x) dx equals:",
    "choices": [
      "f(a)",
      "0",
      "2f(a)",
      "undefined always"
    ],
    "answer": "B",
    "explanation": "Integral over zero width is 0. Integral from a to a has zero width, so its value is 0.",
    "tutoring": {
      "steps": [
        "Integral from a to a has zero width, so its value is 0."
      ],
      "whyNotOthers": "f(a) is a function value (height), not an integral over no interval."
    }
  },
  {
    "id": "C11",
    "topics": [
      "concepts"
    ],
    "stem": "If f′(x) = g′(x) for all x, then f and g differ by:",
    "choices": [
      "a constant",
      "x",
      "f·g",
      "nothing fixed"
    ],
    "answer": "A",
    "explanation": "Same derivative → differ by constant. If two functions have the same derivative on an interval, they differ by a constant on that interval.",
    "tutoring": {
      "steps": [
        "If two functions have the same derivative on an interval, they differ by a constant on that interval."
      ],
      "whyNotOthers": "They need not be identical — only parallel by a vertical shift."
    }
  },
  {
    "id": "C12",
    "topics": [
      "concepts"
    ],
    "stem": "Best first step for many Calc I “word” max/min problems:",
    "choices": [
      "draw diagram, define variables, write formula",
      "integrate immediately",
      "take limit at infinity only",
      "use product rule on numbers"
    ],
    "answer": "A",
    "explanation": "Model first, then calculus. Word problems: draw, define variables, write a formula, use calculus, check the domain.",
    "tutoring": {
      "steps": [
        "Word problems: draw, define variables, write a formula, use calculus, check the domain."
      ],
      "whyNotOthers": "Jumping straight into a random rule without a model wastes time on exams."
    }
  }
];
