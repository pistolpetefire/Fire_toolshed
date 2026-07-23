/**
 * Calculus I Final Study Buddy — MCQ bank (98 questions)
 * Typical college Calc I final topics (OSU-OKC style). Edit freely.
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
    "explanation": "Factor: (x−2)(x+2)/(x−2) → x+2 → 4 as x→2."
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
    "explanation": "Standard limit: sin x / x → 1 as x → 0."
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
    "explanation": "Divide by x²: (3 + 1/x²)/(1 − 5/x²) → 3/1 = 3."
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
    "explanation": "From the right, 1/x → +∞."
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
    "explanation": "From the left, 1/x → −∞."
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
    "explanation": "Sum rule for limits (when both exist)."
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
    "explanation": "Continuity: limit exists, f(a) defined, and they match."
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
    "explanation": "Factor denom (x−3)(x+3); cancel → 1/(x+3) → 1/6."
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
    "explanation": "0/0 is indeterminate; you need more work (factor, L'Hôpital if allowed, etc.)."
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
    "explanation": "Exponential decay: e^(−x) → 0 as x → ∞."
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
    "explanation": "Standard result (or half-angle / L'Hôpital twice if your course allows)."
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
    "explanation": "One-sided limits disagree → two-sided limit DNE."
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
    "explanation": "Rationalize numerator → 1/(√(1+x)+1) → 1/2."
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
    "explanation": "VA: function blows up as x approaches a line x = a."
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
    "explanation": "Limit definition (difference quotient)."
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
    "explanation": "Derivative = instantaneous slope = tangent slope."
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
    "explanation": "Differentiability implies continuity (not conversely)."
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
    "explanation": "Corner: continuous, no unique tangent."
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
    "explanation": "Rate of change of meters per second."
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
    "explanation": "Point-slope form with slope f′(a)."
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
    "explanation": "Positive derivative → increasing."
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
    "explanation": "Critical numbers are where f′=0 or f′ DNE (in domain)."
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
    "explanation": "Slope of the secant line."
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
    "explanation": "lim(h→0) [(3+h)²−9]/h = lim(6h+h²)/h = 6."
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
    "explanation": "Power rule."
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
    "explanation": "Derivative of sine is cosine."
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
    "explanation": "Derivative of cosine is −sine."
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
    "explanation": "Exponential e^x is its own derivative."
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
    "explanation": "Natural log derivative is 1/x."
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
    "explanation": "First·d(second) + second·d(first)."
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
    "explanation": "Low d(high) − high d(low), over low squared."
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
    "explanation": "Outer derivative evaluated at inner, times inner derivative."
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
    "explanation": "Chain: 5(3x+1)⁴ · 3 = 15(3x+1)⁴."
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
    "explanation": "Product: 1·sin x + x·cos x."
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
    "explanation": "Derivative of tan is sec²."
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
    "explanation": "x^(1/2) → (1/2)x^(−1/2)."
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
    "explanation": "Chain: (1/(3x))·3 = 1/x. (Or ln3+ln x.)"
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
    "explanation": "Chain: e^(2x)·2."
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
    "explanation": "Chain: −sin(x²)·2x."
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
    "explanation": "First 3x², second 6x."
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
    "explanation": "Closed Interval Method."
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
    "explanation": "First derivative test: + to − → local max."
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
    "explanation": "Second derivative test: f″>0 → concave up → local min."
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
    "explanation": "Differentiate both sides with respect to t."
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
    "explanation": "Tangent line approximation."
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
    "explanation": "Instantaneous rate equals average rate somewhere."
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
    "explanation": "Concavity change (often f″ changes sign)."
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
    "explanation": "End behavior approaches a horizontal line."
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
    "explanation": "Eliminate a variable, then maximize/minimize."
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
    "explanation": "v = ds/dt."
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
    "explanation": "a = dv/dt = d²s/dt²."
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
    "explanation": "Root-finding via tangent line (if your course covers it)."
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
    "explanation": "Pythagorean constraint; differentiate w.r.t. time."
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
    "explanation": "Zero derivative implies constant (on an interval)."
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
    "explanation": "Power rule for antiderivatives."
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
    "explanation": "Antiderivative of 1/x is ln|x|."
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
    "explanation": "e^x is its own antiderivative."
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
    "explanation": "Derivative of sin is cos."
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
    "explanation": "Derivative of −cos is sin."
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
    "explanation": "Derivative of integral from a to x is f(x) (if f continuous)."
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
    "explanation": "Evaluate any antiderivative at endpoints."
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
    "explanation": "[x²]_0^1 = 1."
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
    "explanation": "Mean value for integrals."
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
    "explanation": "x³ + 2x + C."
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
    "explanation": "Linearity of integrals: 5 − 2 = 3."
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
    "explanation": "Net area interpretation (positive above, negative below)."
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
    "explanation": "Derivative of tan is sec²."
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
    "explanation": "FTC: F(b) − F(a)."
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
    "explanation": "u = x², du = 2x dx matches."
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
    "explanation": "u = 3x, du = 3 dx → (1/3)e^u."
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
    "explanation": "u = 2x+1, du = 2 dx → u^6/6."
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
    "explanation": "Either works; du matches the other factor (±)."
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
    "explanation": "u=x²+1, u:1→2; ∫_1^2 u^3 du = [u^4/4]_1^2 = 4 − 1/4 = 15/4."
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
    "explanation": "Change limits with u(x), or return to x before evaluating."
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
    "explanation": "u=2x+5, du=2dx → (1/2)ln|u|."
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
    "explanation": "u=x², du=2x dx."
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
    "explanation": "u=5x, (1/5)sin u."
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
    "explanation": "Pattern: f′(g(x)) g′(x) or similar."
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
    "explanation": "Top minus bottom integrated."
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
    "explanation": "Cross-section disks: π radius squared."
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
    "explanation": "Outer radius squared minus inner radius squared."
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
    "explanation": "Triangle area 1/2."
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
    "explanation": "Definite integral measures signed area."
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
    "explanation": "Intersections give a and b (or split intervals)."
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
    "explanation": "Circumference × height × thickness (if taught in Calc I)."
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
    "explanation": "Equal positive and negative signed areas → net 0."
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
    "explanation": "Core meaning of derivative."
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
    "explanation": "Accumulation / net area."
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
    "explanation": "Definition of antiderivative."
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
    "explanation": "Compositions require chain rule."
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
    "explanation": "Indeterminate quotients 0/0 or ∞/∞."
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
    "explanation": "Sign of v indicates direction."
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
    "explanation": "Continuous ⇏ differentiable (e.g. |x|)."
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
    "explanation": "Infinitely many antiderivatives, vertical shifts."
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
    "explanation": "Zero slope → horizontal tangent."
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
    "explanation": "Integral over zero width is 0."
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
    "explanation": "Same derivative → differ by constant."
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
    "explanation": "Model first, then calculus."
  }
];
