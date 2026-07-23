/**
 * Calculus I Final Study Buddy — worked practice problems
 * Tutor-style solutions with commonMistakes + whyItWorks.
 */
window.CALC1_MATH = [
  {
    "id": "mw-L1",
    "topics": [
      "limits"
    ],
    "title": "Limit by factoring",
    "prompt": "Evaluate lim(x→4) (x² − 16)/(x − 4).",
    "hints": [
      "Factor numerator as difference of squares.",
      "Cancel the common factor (x ≠ 4), then plug in x = 4."
    ],
    "solution": [
      "Goal: evaluate lim(x->4) (x^2-16)/(x-4).",
      "Direct plug-in gives 0/0 — indeterminate, not automatic DNE.",
      "Factor: x^2-16=(x-4)(x+4).",
      "For x!=4 cancel (x-4) to get x+4.",
      "lim(x->4)(x+4)=8. The graph has a hole at x=4 but approaches height 8."
    ],
    "answerLine": "8",
    "commonMistakes": [
      "Calling the limit undefined because the original expression is undefined at x=4.",
      "Canceling (x-4) then refusing to plug x=4 into the simplified function."
    ],
    "whyItWorks": "Limits care about nearby values, not a single missing point. After canceling, the simplified function matches the original wherever both exist, so their limits agree."
  },
  {
    "id": "mw-L2",
    "topics": [
      "limits"
    ],
    "title": "Limit at infinity",
    "prompt": "Evaluate lim(x→∞) (5x³ − 2x)/(2x³ + 7).",
    "hints": [
      "Divide every term by the highest power of x in the denominator (x³)."
    ],
    "solution": [
      "Degrees of numerator and denominator are both 3.",
      "Divide every term by x^3: (5-2/x^2)/(2+7/x^3).",
      "As x->inf those fractions vanish => 5/2.",
      "Shortcut: leading terms 5x^3/2x^3=5/2."
    ],
    "answerLine": "5/2",
    "commonMistakes": [
      "Treating infinity like a number without leading-term analysis.",
      "Dividing by the wrong power of x."
    ],
    "whyItWorks": "For large |x|, highest-power terms dominate. Equal degrees => limit is the ratio of leading coefficients."
  },
  {
    "id": "mw-L3",
    "topics": [
      "limits"
    ],
    "title": "One-sided continuity",
    "prompt": "Let f(x) = { x² if x < 1; 3 − x if x ≥ 1 }. Is f continuous at x = 1? Explain using limits.",
    "hints": [
      "Check lim from left, lim from right, and f(1)."
    ],
    "solution": [
      "From the left (x<1): f(x)=x^2 -> 1 as x->1-.",
      "From the right (x>=1): f(x)=3-x -> 2 as x->1+.",
      "f(1)=3-1=2.",
      "Left limit 1 != right limit 2 => not continuous at x=1."
    ],
    "answerLine": "Not continuous at x = 1 (one-sided limits disagree: 1 vs 2)",
    "commonMistakes": [
      "Only checking f(1) and declaring continuous.",
      "Averaging left and right limits."
    ],
    "whyItWorks": "Continuity at a point needs left limit = right limit = function value. If one-sided limits disagree, the two-sided limit does not exist."
  },
  {
    "id": "mw-D1",
    "topics": [
      "derivative-def"
    ],
    "title": "Derivative from definition",
    "prompt": "Use the limit definition to find f′(x) for f(x) = x² + 3x.",
    "hints": [
      "f′(x) = lim(h→0) [f(x+h)−f(x)]/h",
      "Expand (x+h)² carefully."
    ],
    "solution": [
      "f'(x)=lim(h->0)[f(x+h)-f(x)]/h with f(x)=x^2+3x.",
      "f(x+h)=(x+h)^2+3(x+h)=x^2+2xh+h^2+3x+3h.",
      "Difference: 2xh+h^2+3h. Divide by h: 2x+h+3.",
      "h->0 => f'(x)=2x+3. Power-rule check matches."
    ],
    "answerLine": "f′(x) = 2x + 3",
    "commonMistakes": [
      "Setting h=0 before simplifying the difference quotient.",
      "Expanding (x+h)^2 as x^2+h^2 (missing 2xh)."
    ],
    "whyItWorks": "The definition is the limit of average rates of change as the interval shrinks — that limiting slope is f'(x)."
  },
  {
    "id": "mw-D2",
    "topics": [
      "derivative-def"
    ],
    "title": "Tangent line",
    "prompt": "Find the equation of the tangent line to y = x³ at x = 2.",
    "hints": [
      "y′ = 3x² so slope at 2 is …",
      "Point is (2, 8). Use point-slope."
    ],
    "solution": [
      "y=x^3 => y'=3x^2. At x=2, slope m=12. Point (2,8).",
      "y-8=12(x-2) => y=12x-16."
    ],
    "answerLine": "y = 12x − 16",
    "commonMistakes": [
      "Using slope f(2)=8 instead of f'(2).",
      "Point-slope sign errors."
    ],
    "whyItWorks": "Tangent line uses the point on the curve and the derivative as slope."
  },
  {
    "id": "mw-R1",
    "topics": [
      "derivative-rules"
    ],
    "title": "Product rule",
    "prompt": "Differentiate y = x² sin x.",
    "hints": [
      "Product: (uv)′ = u′v + uv′",
      "u = x², v = sin x"
    ],
    "solution": [
      "u=x^2, v=sin x => u'=2x, v'=cos x.",
      "y'=2x sin x + x^2 cos x."
    ],
    "answerLine": "y′ = 2x sin x + x² cos x",
    "commonMistakes": [
      "Only differentiating one factor (product rule incomplete)."
    ],
    "whyItWorks": "Product rule: derivative of first times second plus first times derivative of second."
  },
  {
    "id": "mw-R2",
    "topics": [
      "derivative-rules"
    ],
    "title": "Quotient rule",
    "prompt": "Differentiate y = (x² + 1)/(x − 3).",
    "hints": [
      "(u/v)′ = (u′v − uv′)/v²"
    ],
    "solution": [
      "u=x^2+1, u'=2x; v=x-3, v'=1.",
      "y'=[2x(x-3)-(x^2+1)]/(x-3)^2=(x^2-6x-1)/(x-3)^2."
    ],
    "answerLine": "y′ = (x² − 6x − 1)/(x − 3)²",
    "commonMistakes": [
      "Plus sign instead of minus in the quotient rule numerator."
    ],
    "whyItWorks": "Quotient rule (u/v)'=(u'v-uv')/v^2 — middle sign is minus."
  },
  {
    "id": "mw-R3",
    "topics": [
      "derivative-rules"
    ],
    "title": "Chain rule",
    "prompt": "Differentiate y = (3x² − 5)⁴.",
    "hints": [
      "Outer power, inner 3x²−5",
      "Multiply by derivative of inside"
    ],
    "solution": [
      "Outer power 4, inside 3x^2-5.",
      "y'=4(3x^2-5)^3*(6x)=24x(3x^2-5)^3."
    ],
    "answerLine": "y′ = 24x(3x² − 5)³",
    "commonMistakes": [
      "Forgetting the chain-rule factor from the inside derivative."
    ],
    "whyItWorks": "Chain rule: n[g(x)]^(n-1)*g'(x). Here g=3x^2-5, g'=6x."
  },
  {
    "id": "mw-R4",
    "topics": [
      "derivative-rules"
    ],
    "title": "Trig + chain",
    "prompt": "Differentiate y = cos(5x).",
    "hints": [
      "d/dx cos u = −sin u · u′"
    ],
    "solution": [
      "y'=-sin(5x)*5=-5 sin(5x)."
    ],
    "answerLine": "y′ = −5 sin(5x)",
    "commonMistakes": [
      "Forgetting to multiply by 5 from the chain rule."
    ],
    "whyItWorks": "d/dx cos(u)=-sin(u)*u' with u=5x."
  },
  {
    "id": "mw-R5",
    "topics": [
      "derivative-rules"
    ],
    "title": "Exponential and log",
    "prompt": "Differentiate y = e^(3x) + ln(2x) for x > 0.",
    "hints": [
      "Chain on e^(3x); ln(2x) = ln2 + ln x or chain 1/(2x)·2"
    ],
    "solution": [
      "d/dx e^(3x)=3e^(3x).",
      "d/dx ln(2x)=1/x.",
      "y'=3e^(3x)+1/x."
    ],
    "answerLine": "y′ = 3e^(3x) + 1/x",
    "commonMistakes": [
      "Writing 1/(3x) for d/dx ln(2x) or forgetting the chain on e^(3x)."
    ],
    "whyItWorks": "e^(3x) chains a factor 3; ln(2x)=ln2+ln x has derivative 1/x."
  },
  {
    "id": "mw-A1",
    "topics": [
      "applications"
    ],
    "title": "Related rates — expanding circle",
    "prompt": "A circle’s radius increases at 2 cm/s. How fast is the area increasing when r = 5 cm?",
    "hints": [
      "A = πr²",
      "Differentiate both sides w.r.t. t",
      "Plug r=5, dr/dt=2"
    ],
    "solution": [
      "A=pi r^2. Differentiate w.r.t. t: dA/dt=2 pi r dr/dt.",
      "At r=5, dr/dt=2: dA/dt=20 pi cm^2/s.",
      "Units: cm*(cm/s)=cm^2/s, correct for area rate."
    ],
    "answerLine": "20π cm²/s",
    "commonMistakes": [
      "Plugging r=5 before differentiating.",
      "Forgetting the 2 in 2 pi r r'."
    ],
    "whyItWorks": "A and r both change with time; differentiating the formula links their rates."
  },
  {
    "id": "mw-A2",
    "topics": [
      "applications"
    ],
    "title": "Optimization — rectangle under a curve",
    "prompt": "A rectangle has base on the x-axis and upper vertices on y = 12 − x². What base width maximizes area? (Assume x ≥ 0 for the right edge, full width 2x if symmetric — or use width w and height 12−(w/2)².)",
    "hints": [
      "By symmetry, vertices at (±x, 12−x²), width 2x, height 12−x².",
      "A(x) = 2x(12 − x²) = 24x − 2x³ for 0 ≤ x ≤ √12.",
      "A′=0 to maximize."
    ],
    "solution": [
      "Vertices (+/-x, 12-x^2): width 2x, height 12-x^2, A=2x(12-x^2)=24x-2x^3.",
      "A'=24-6x^2=0 => x^2=4 => x=2 (in domain). Width=4.",
      "Endpoints give A=0, so max at x=2."
    ],
    "answerLine": "Width 4 (x = 2 on each side of axis)",
    "commonMistakes": [
      "Forgetting the domain 0<=x<=sqrt(12).",
      "Maximizing width instead of area."
    ],
    "whyItWorks": "Express area as a single-variable function, then use A'=0 and compare endpoints."
  },
  {
    "id": "mw-A3",
    "topics": [
      "applications"
    ],
    "title": "First derivative test",
    "prompt": "f(x) = x³ − 3x. Find critical points and classify local max/min.",
    "hints": [
      "f′ = 3x² − 3",
      "Sign chart of f′"
    ],
    "solution": [
      "f'=3x^2-3=3(x-1)(x+1). Critical points x=+/-1.",
      "Sign of f': + on (-inf,-1), - on (-1,1), + on (1,inf).",
      "Local max at x=-1 (f=2); local min at x=1 (f=-2)."
    ],
    "answerLine": "Local max (−1, 2); local min (1, −2)",
    "commonMistakes": [
      "Calling every critical point a max.",
      "Sign chart errors for f'."
    ],
    "whyItWorks": "First-derivative test uses sign changes of f' around critical numbers."
  },
  {
    "id": "mw-A4",
    "topics": [
      "applications"
    ],
    "title": "Linear approximation",
    "prompt": "Approximate √4.1 using the tangent line to √x at a = 4.",
    "hints": [
      "f(x)=√x, f(4)=2, f′(x)=1/(2√x), f′(4)=1/4",
      "L(x)=2+(1/4)(x−4)"
    ],
    "solution": [
      "f(x)=sqrt(x), a=4, f(4)=2, f'=1/(2sqrt(x)), f'(4)=1/4.",
      "L(x)=2+(1/4)(x-4). L(4.1)=2.025."
    ],
    "answerLine": "≈ 2.025",
    "commonMistakes": [
      "Using f(4.1) without linearization.",
      "Wrong f' for sqrt."
    ],
    "whyItWorks": "Near a known point, the tangent line is the best linear approximation."
  },
  {
    "id": "mw-I1",
    "topics": [
      "integrals"
    ],
    "title": "Indefinite integral",
    "prompt": "Find ∫ (6x² − 4x + 5) dx.",
    "hints": [
      "Integrate term by term",
      "Don’t forget +C"
    ],
    "solution": [
      "int 6x^2 dx = 2x^3, int -4x dx = -2x^2, int 5 dx = 5x.",
      "Answer: 2x^3 - 2x^2 + 5x + C. Check by differentiating."
    ],
    "answerLine": "2x³ − 2x² + 5x + C",
    "commonMistakes": [
      "Forgetting +C.",
      "Wrong coefficients when integrating polynomials."
    ],
    "whyItWorks": "Integrate term by term; differentiate the answer to check."
  },
  {
    "id": "mw-I2",
    "topics": [
      "integrals"
    ],
    "title": "Definite integral via FTC",
    "prompt": "Evaluate ∫_0^π sin x dx.",
    "hints": [
      "Antiderivative −cos x",
      "Evaluate −cos π − (−cos 0)"
    ],
    "solution": [
      "Antiderivative of sin x is -cos x.",
      "[-cos x]_0^pi = (-cos pi)-(-cos 0)=1+1=2.",
      "One arch of sine from 0 to pi has area 2."
    ],
    "answerLine": "2",
    "commonMistakes": [
      "Integral of sin as +cos.",
      "cos(pi) treated as +1."
    ],
    "whyItWorks": "FTC evaluates an antiderivative at endpoints. d/dx(-cos x)=sin x."
  },
  {
    "id": "mw-I3",
    "topics": [
      "integrals"
    ],
    "title": "FTC derivative of integral",
    "prompt": "If g(x) = ∫_1^x √(t³ + 1) dt, find g′(x).",
    "hints": [
      "FTC part 1: d/dx ∫_a^x f(t) dt = f(x)"
    ],
    "solution": [
      "g'(x)=sqrt(x^3+1) by FTC1 (continuous integrand)."
    ],
    "answerLine": "g′(x) = √(x³ + 1)",
    "commonMistakes": [
      "Trying to evaluate the integral fully instead of using FTC1."
    ],
    "whyItWorks": "FTC part 1: d/dx int_a^x f(t)dt = f(x)."
  },
  {
    "id": "mw-I4",
    "topics": [
      "integrals"
    ],
    "title": "Average value",
    "prompt": "Find the average value of f(x) = 3x² on [0, 2].",
    "hints": [
      "(1/(b−a)) ∫_a^b f"
    ],
    "solution": [
      "(1/2) int_0^2 3x^2 dx = (1/2)[x^3]_0^2 = 4."
    ],
    "answerLine": "4",
    "commonMistakes": [
      "Forgetting to divide by (b-a)."
    ],
    "whyItWorks": "Average value is (1/(b-a)) times the definite integral."
  },
  {
    "id": "mw-U1",
    "topics": [
      "substitution"
    ],
    "title": "u-sub indefinite",
    "prompt": "Evaluate ∫ 3x² (x³ + 1)⁴ dx.",
    "hints": [
      "u = x³ + 1, du = 3x² dx"
    ],
    "solution": [
      "u=x^3+1, du=3x^2 dx.",
      "int u^4 du = u^5/5 + C = (x^3+1)^5/5 + C."
    ],
    "answerLine": "(x³ + 1)⁵ / 5 + C",
    "commonMistakes": [
      "u=3x^2 without matching du.",
      "Forgetting /5 after integrating u^4."
    ],
    "whyItWorks": "u=x^3+1 makes du=3x^2 dx match the factor in front."
  },
  {
    "id": "mw-U2",
    "topics": [
      "substitution"
    ],
    "title": "u-sub definite",
    "prompt": "Evaluate ∫_0^1 2x e^(x²) dx.",
    "hints": [
      "u = x², du = 2x dx",
      "x=0 → u=0; x=1 → u=1"
    ],
    "solution": [
      "u=x^2, du=2x dx. Limits: x=0->u=0, x=1->u=1.",
      "int_0^1 e^u du = e-1."
    ],
    "answerLine": "e − 1",
    "commonMistakes": [
      "Keeping x-limits after switching to u.",
      "Missing the e^u antiderivative evaluation."
    ],
    "whyItWorks": "2x dx is du when u=x^2, converting the integral to a pure exponential."
  },
  {
    "id": "mw-U3",
    "topics": [
      "substitution"
    ],
    "title": "Trig substitution pattern",
    "prompt": "Evaluate ∫ cos(2x) dx using substitution.",
    "hints": [
      "u = 2x, du = 2 dx → (1/2)∫ cos u du"
    ],
    "solution": [
      "u=2x, du=2 dx => (1/2)int cos u du = (1/2)sin(2x)+C."
    ],
    "answerLine": "(1/2) sin(2x) + C",
    "commonMistakes": [
      "Writing sin(2x) without the 1/2 factor."
    ],
    "whyItWorks": "Chain rule reverse: u=2x brings a factor 1/2."
  },
  {
    "id": "mw-V1",
    "topics": [
      "area-volume"
    ],
    "title": "Area between curves",
    "prompt": "Find the area enclosed by y = x and y = x² between their intersection points.",
    "hints": [
      "Intersections: x = x² → x=0,1",
      "Top is y=x on [0,1]"
    ],
    "solution": [
      "Intersections: x=x^2 => x=0,1. On [0,1], y=x is above y=x^2.",
      "int_0^1 (x-x^2)dx = 1/2 - 1/3 = 1/6."
    ],
    "answerLine": "1/6",
    "commonMistakes": [
      "Integrating bottom-top.",
      "Wrong intersection limits."
    ],
    "whyItWorks": "Area = int (upper-lower) between intersection points."
  },
  {
    "id": "mw-V2",
    "topics": [
      "area-volume"
    ],
    "title": "Disk method",
    "prompt": "Region under y = √x from x=0 to x=4 is rotated about the x-axis. Find the volume.",
    "hints": [
      "V = ∫ π [R(x)]² dx = ∫_0^4 π (√x)² dx = ∫_0^4 π x dx"
    ],
    "solution": [
      "R(x)=sqrt(x), so pi int_0^4 x dx = pi [x^2/2]_0^4 = 8pi."
    ],
    "answerLine": "8π",
    "commonMistakes": [
      "Forgetting pi or the square on radius."
    ],
    "whyItWorks": "Disk method: V=int pi [R(x)]^2 dx with R=sqrt(x)."
  },
  {
    "id": "mw-C1",
    "topics": [
      "concepts"
    ],
    "title": "Word problem setup",
    "prompt": "A rectangular garden is fenced with 40 m of fencing against a long barn wall (no fence on barn side). Write area A as a function of width x perpendicular to the barn, and find critical point(s).",
    "hints": [
      "If x is depth away from barn, let y be length along barn: 2x + y = 40 → y = 40 − 2x.",
      "A = x y = x(40 − 2x)."
    ],
    "solution": [
      "Depth x, length along barn y, 2x+y=40 => y=40-2x.",
      "A=x(40-2x)=40x-2x^2. A'=40-4x=0 => x=10, y=20, A=200."
    ],
    "answerLine": "A(x)=40x−2x²; critical x=10 m (max)",
    "commonMistakes": [
      "Using 4 sides of fencing against the barn.",
      "Ignoring domain 0<x<20."
    ],
    "whyItWorks": "Constraint reduces area to one variable; calculus finds the max on the domain."
  },
  {
    "id": "mw-L4",
    "topics": [
      "limits"
    ],
    "title": "Rationalize limit",
    "prompt": "Evaluate lim(x→0) (√(x+9) − 3)/x.",
    "hints": [
      "Multiply by conjugate √(x+9)+3"
    ],
    "solution": [
      "Multiply by sqrt(x+9)+3. Numerator becomes x.",
      "Simplifies to 1/(sqrt(x+9)+3) -> 1/6 as x->0."
    ],
    "answerLine": "1/6",
    "commonMistakes": [
      "Giving up at 0/0 without conjugating."
    ],
    "whyItWorks": "Conjugate rationalizes the numerator so the x cancels."
  },
  {
    "id": "mw-R6",
    "topics": [
      "derivative-rules"
    ],
    "title": "Implicit differentiation",
    "prompt": "Find dy/dx if x² + y² = 25.",
    "hints": [
      "Differentiate both sides w.r.t. x; y is a function of x",
      "2x + 2y y′ = 0"
    ],
    "solution": [
      "2x + 2y y' = 0 => y' = -x/y (y!=0)."
    ],
    "answerLine": "dy/dx = −x/y",
    "commonMistakes": [
      "Treating y as constant (forgetting y')."
    ],
    "whyItWorks": "Implicit differentiation: y is a function of x, so d/dx(y^2)=2y y'."
  },
  {
    "id": "mw-A5",
    "topics": [
      "applications"
    ],
    "title": "Particle motion",
    "prompt": "s(t) = t³ − 6t² + 9t. When is the particle at rest? When is velocity positive on [0,5]?",
    "hints": [
      "v = s′",
      "Factor v",
      "Sign chart"
    ],
    "solution": [
      "v=3(t-1)(t-3). Rest at t=1 and t=3.",
      "v>0 on [0,1) and (3,5]; v<0 on (1,3)."
    ],
    "answerLine": "Rest at t=1,3; v>0 on [0,1)∪(3,5]",
    "commonMistakes": [
      "Confusing where v=0 with where s=0."
    ],
    "whyItWorks": "At rest means velocity zero; sign of v tells direction of motion."
  },
  {
    "id": "mw-I5",
    "topics": [
      "integrals"
    ],
    "title": "Split property",
    "prompt": "Given ∫_0^3 f = 10 and ∫_0^1 f = 4, find ∫_1^3 f.",
    "hints": [
      "∫_0^3 = ∫_0^1 + ∫_1^3"
    ],
    "solution": [
      "int_0^3 = int_0^1 + int_1^3 => 10=4+int_1^3 => int_1^3=6."
    ],
    "answerLine": "6",
    "commonMistakes": [
      "Subtracting in the wrong order."
    ],
    "whyItWorks": "Additivity of integrals on adjacent intervals."
  },
  {
    "id": "mw-U4",
    "topics": [
      "substitution"
    ],
    "title": "Harder u-sub",
    "prompt": "Evaluate ∫ x / √(1 + x²) dx.",
    "hints": [
      "u = 1 + x², du = 2x dx → (1/2)∫ u^(−1/2) du"
    ],
    "solution": [
      "u=1+x^2, du=2x dx => (1/2)int u^(-1/2) du = sqrt(1+x^2)+C."
    ],
    "answerLine": "√(1 + x²) + C",
    "commonMistakes": [
      "u=x without matching du=2x dx half-factor."
    ],
    "whyItWorks": "u=1+x^2 makes du=2x dx; half factor completes the sub."
  }
];
