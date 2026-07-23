/** node scripts/gen-questions.mjs → js/questions.js */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'js', 'questions.js');

function q(id, topic, stem, choices, answer, explanation) {
  return { id, topics: [topic], stem, choices, answer, explanation };
}

const all = [
  // —— LIMITS (14) ——
  q('L01', 'limits', 'lim(x→2) (x² − 4)/(x − 2) equals:', ['0', '2', '4', 'undefined'], 'C', 'Factor: (x−2)(x+2)/(x−2) → x+2 → 4 as x→2.'),
  q('L02', 'limits', 'lim(x→0) sin(x)/x equals:', ['0', '1', '∞', 'does not exist'], 'B', 'Standard limit: sin x / x → 1 as x → 0.'),
  q('L03', 'limits', 'lim(x→∞) (3x² + 1)/(x² − 5) equals:', ['0', '1', '3', '∞'], 'C', 'Divide by x²: (3 + 1/x²)/(1 − 5/x²) → 3/1 = 3.'),
  q('L04', 'limits', 'lim(x→0⁺) 1/x equals:', ['0', '1', '+∞', '−∞'], 'C', 'From the right, 1/x → +∞.'),
  q('L05', 'limits', 'lim(x→0⁻) 1/x equals:', ['0', '+∞', '−∞', '1'], 'C', 'From the left, 1/x → −∞.'),
  q('L06', 'limits', 'If lim(x→a) f(x) = L and lim(x→a) g(x) = M, then lim(x→a) [f(x)+g(x)] equals:', ['L − M', 'L + M', 'LM', 'L/M always'], 'B', 'Sum rule for limits (when both exist).'),
  q('L07', 'limits', 'A function is continuous at x = a if:', ['f(a) is defined only', 'lim f exists only', 'lim(x→a) f(x) = f(a)', 'f is differentiable'], 'C', 'Continuity: limit exists, f(a) defined, and they match.'),
  q('L08', 'limits', 'lim(x→3) (x − 3)/(x² − 9) equals:', ['0', '1/6', '1/3', 'DNE'], 'B', 'Factor denom (x−3)(x+3); cancel → 1/(x+3) → 1/6.'),
  q('L09', 'limits', 'Which limit form is indeterminate?', ['5/0', '0/5', '0/0', '3 + 4'], 'C', '0/0 is indeterminate; you need more work (factor, L\'Hôpital if allowed, etc.).'),
  q('L10', 'limits', 'lim(x→∞) e^(−x) equals:', ['∞', '1', '0', '−1'], 'C', 'Exponential decay: e^(−x) → 0 as x → ∞.'),
  q('L11', 'limits', 'lim(x→0) (1 − cos x)/x² equals:', ['0', '1/2', '1', '∞'], 'B', 'Standard result (or half-angle / L\'Hôpital twice if your course allows).'),
  q('L12', 'limits', 'If lim(x→2⁻) f = 5 and lim(x→2⁺) f = 7, then lim(x→2) f:', ['is 5', 'is 7', 'is 6', 'does not exist'], 'D', 'One-sided limits disagree → two-sided limit DNE.'),
  q('L13', 'limits', 'lim(x→0) (√(1+x) − 1)/x equals:', ['0', '1/2', '1', '∞'], 'B', 'Rationalize numerator → 1/(√(1+x)+1) → 1/2.'),
  q('L14', 'limits', 'A vertical asymptote of f often occurs where:', ['f′ = 0', 'lim f → ±∞ as x approaches a finite value', 'f″ = 0', 'f is continuous'], 'B', 'VA: function blows up as x approaches a line x = a.'),

  // —— DEFINITION (10) ——
  q('D01', 'derivative-def', 'The derivative f′(a) is defined as:', ['lim(h→0) [f(a+h)−f(a)]/h', 'f(a+h)−f(a)', '∫ f', 'f(a)/a'], 'A', 'Limit definition (difference quotient).'),
  q('D02', 'derivative-def', 'Geometrically, f′(a) is the slope of the:', ['secant through a and b only', 'tangent line at x = a', 'normal only', 'chord of a circle always'], 'B', 'Derivative = instantaneous slope = tangent slope.'),
  q('D03', 'derivative-def', 'If f is differentiable at a, then f is:', ['discontinuous at a', 'continuous at a', 'constant near a', 'undefined at a'], 'B', 'Differentiability implies continuity (not conversely).'),
  q('D04', 'derivative-def', 'f(x) = |x| at x = 0 is:', ['differentiable', 'continuous but not differentiable', 'discontinuous', 'smooth with f′=0'], 'B', 'Corner: continuous, no unique tangent.'),
  q('D05', 'derivative-def', 'Units of dy/dx if y is meters and x is seconds:', ['m·s', 'm/s', 's/m', 'm²'], 'B', 'Rate of change of meters per second.'),
  q('D06', 'derivative-def', 'The equation of the tangent line to y = f(x) at x = a is:', ['y − f(a) = f′(a)(x − a)', 'y = f′(a)', 'y = f(a)x', 'y = f″(a)'], 'A', 'Point-slope form with slope f′(a).'),
  q('D07', 'derivative-def', 'If f′(x) > 0 on an interval, then f is:', ['decreasing', 'increasing', 'constant', 'concave down always'], 'B', 'Positive derivative → increasing.'),
  q('D08', 'derivative-def', 'If f′(c) = 0, then x = c is:', ['always a max', 'always a min', 'a critical number (candidate)', 'undefined'], 'C', 'Critical numbers are where f′=0 or f′ DNE (in domain).'),
  q('D09', 'derivative-def', 'Average rate of change of f on [a,b] is:', ['f′(a)', '[f(b)−f(a)]/(b−a)', 'f(b)+f(a)', '∫_a^b f'], 'B', 'Slope of the secant line.'),
  q('D10', 'derivative-def', 'f(x) = x²; f′(3) by definition equals:', ['6', '9', '3', '0'], 'A', 'lim(h→0) [(3+h)²−9]/h = lim(6h+h²)/h = 6.'),

  // —— RULES (16) ——
  q('R01', 'derivative-rules', 'd/dx [x^n] equals:', ['n x^(n−1)', 'x^n / n', 'n x^n', 'x^(n+1)'], 'A', 'Power rule.'),
  q('R02', 'derivative-rules', 'd/dx [sin x] equals:', ['−cos x', 'cos x', 'sin x', '−sin x'], 'B', 'Derivative of sine is cosine.'),
  q('R03', 'derivative-rules', 'd/dx [cos x] equals:', ['sin x', '−sin x', 'cos x', '−cos x'], 'B', 'Derivative of cosine is −sine.'),
  q('R04', 'derivative-rules', 'd/dx [e^x] equals:', ['x e^(x−1)', 'e^x', 'ln x', '1/x'], 'B', 'Exponential e^x is its own derivative.'),
  q('R05', 'derivative-rules', 'd/dx [ln x] (x > 0) equals:', ['ln x', '1/x', 'e^x', 'x'], 'B', 'Natural log derivative is 1/x.'),
  q('R06', 'derivative-rules', 'Product rule: (uv)′ equals:', ['u′v′', 'u′v + uv′', 'u′/v + u/v′', 'uv'], 'B', 'First·d(second) + second·d(first).'),
  q('R07', 'derivative-rules', 'Quotient rule: (u/v)′ equals:', ['(u′v − uv′)/v²', '(u′v + uv′)/v²', 'u′/v′', 'v/u'], 'A', 'Low d(high) − high d(low), over low squared.'),
  q('R08', 'derivative-rules', 'Chain rule: d/dx [f(g(x))] equals:', ['f′(g(x))', 'f′(g(x)) · g′(x)', 'f(g′(x))', 'g′(f(x))'], 'B', 'Outer derivative evaluated at inner, times inner derivative.'),
  q('R09', 'derivative-rules', 'd/dx [(3x+1)⁵] equals:', ['5(3x+1)⁴', '15(3x+1)⁴', '5(3x+1)⁴ · 3 only as 5·3', '15(3x+1)⁵'], 'B', 'Chain: 5(3x+1)⁴ · 3 = 15(3x+1)⁴.'),
  q('R10', 'derivative-rules', 'd/dx [x sin x] equals:', ['cos x', 'sin x + x cos x', 'x cos x', 'sin x − x cos x'], 'B', 'Product: 1·sin x + x·cos x.'),
  q('R11', 'derivative-rules', 'd/dx [tan x] equals:', ['sec x', 'sec² x', 'csc² x', '−sec² x'], 'B', 'Derivative of tan is sec².'),
  q('R12', 'derivative-rules', 'd/dx [√x] equals:', ['1/(2√x)', '2√x', '√x / 2', '1/√x'], 'A', 'x^(1/2) → (1/2)x^(−1/2).'),
  q('R13', 'derivative-rules', 'd/dx [ln(3x)] equals:', ['1/(3x)', '3/x', '1/x', '3 ln x'], 'C', 'Chain: (1/(3x))·3 = 1/x. (Or ln3+ln x.)'),
  q('R14', 'derivative-rules', 'd/dx [e^(2x)] equals:', ['e^(2x)', '2e^(2x)', 'e^x', '2e^x'], 'B', 'Chain: e^(2x)·2.'),
  q('R15', 'derivative-rules', 'If y = cos(x²), y′ equals:', ['−sin(x²)', '−2x sin(x²)', '2x cos(x²)', '−sin(2x)'], 'B', 'Chain: −sin(x²)·2x.'),
  q('R16', 'derivative-rules', 'd²/dx² [x³] equals:', ['3x²', '6x', 'x', '6'], 'B', 'First 3x², second 6x.'),

  // —— APPLICATIONS (14) ——
  q('A01', 'applications', 'To find absolute max of continuous f on [a,b], check:', ['only critical points', 'critical points in (a,b) and endpoints', 'only endpoints', 'where f″=0 only'], 'B', 'Closed Interval Method.'),
  q('A02', 'applications', 'If f′ changes from + to − at c, then f has a local:', ['min at c', 'max at c', 'neither', 'inflection only'], 'B', 'First derivative test: + to − → local max.'),
  q('A03', 'applications', 'If f″(c) > 0 and f′(c)=0, then f has a local:', ['max at c', 'min at c', 'neither guaranteed', 'discontinuity'], 'B', 'Second derivative test: f″>0 → concave up → local min.'),
  q('A04', 'applications', 'Related rates problems use:', ['implicit differentiation w.r.t. time', 'only integrals', 'only limits at infinity', 'u-sub only'], 'A', 'Differentiate both sides with respect to t.'),
  q('A05', 'applications', 'Linear approximation of f near a is:', ['L(x) = f(a) + f′(a)(x−a)', 'L(x) = f′(a)', 'L(x) = f(a)x', 'L(x) = f″(a)'], 'A', 'Tangent line approximation.'),
  q('A06', 'applications', 'Mean Value Theorem requires f continuous on [a,b] and differentiable on (a,b). Then there exists c with:', ['f′(c) = 0', 'f′(c) = [f(b)−f(a)]/(b−a)', 'f(c)=0', 'f″(c)=0'], 'B', 'Instantaneous rate equals average rate somewhere.'),
  q('A07', 'applications', 'A point of inflection is where:', ['f′=0 always', 'concavity changes', 'f is discontinuous', 'f′ does not exist only'], 'B', 'Concavity change (often f″ changes sign).'),
  q('A08', 'applications', 'Horizontal asymptote y = L means:', ['lim(x→∞) f(x) = L (or x→−∞)', 'f′(L)=0', 'f(L)=0', 'vertical asymptote'], 'A', 'End behavior approaches a horizontal line.'),
  q('A09', 'applications', 'For optimization with constraint, a common strategy is:', ['express as one-variable function then f′=0', 'always integrate first', 'ignore domain', 'set f=0 only'], 'A', 'Eliminate a variable, then maximize/minimize.'),
  q('A10', 'applications', 'If a particle has position s(t), velocity is:', ['s″(t)', 's′(t)', '∫ s', 's(t)/t always'], 'B', 'v = ds/dt.'),
  q('A11', 'applications', 'Acceleration is:', ['s′(t)', 'v′(t) = s″(t)', '∫ v only', 's(t)'], 'B', 'a = dv/dt = d²s/dt².'),
  q('A12', 'applications', 'Newton\'s method iterates:', ['x_{n+1} = x_n − f(x_n)/f′(x_n)', 'x + f(x)', 'f′(x)/f(x)', '∫ f'], 'A', 'Root-finding via tangent line (if your course covers it).'),
  q('A13', 'applications', 'A ladder 10 ft slides: bottom moves away at 2 ft/s. Related rates typically relate:', ['x and y with x²+y²=100', 'only x', 'only angles with no sides', 'volume only'], 'A', 'Pythagorean constraint; differentiate w.r.t. time.'),
  q('A14', 'applications', 'If f′(x) = 0 for all x in an interval, then f is:', ['increasing', 'constant on that interval', 'quadratic', 'undefined'], 'B', 'Zero derivative implies constant (on an interval).'),

  // —— INTEGRALS (14) ——
  q('I01', 'integrals', '∫ x^n dx (n ≠ −1) equals:', ['n x^(n−1) + C', 'x^(n+1)/(n+1) + C', 'x^n / n + C', 'ln|x| + C'], 'B', 'Power rule for antiderivatives.'),
  q('I02', 'integrals', '∫ 1/x dx equals:', ['x²/2 + C', 'ln|x| + C', '1/x² + C', 'e^x + C'], 'B', 'Antiderivative of 1/x is ln|x|.'),
  q('I03', 'integrals', '∫ e^x dx equals:', ['e^x + C', 'x e^x + C', 'ln x + C', 'e^(x+1) + C'], 'A', 'e^x is its own antiderivative.'),
  q('I04', 'integrals', '∫ cos x dx equals:', ['sin x + C', '−sin x + C', 'cos x + C', '−cos x + C'], 'A', 'Derivative of sin is cos.'),
  q('I05', 'integrals', '∫ sin x dx equals:', ['cos x + C', '−cos x + C', 'sin x + C', '−sin x + C'], 'B', 'Derivative of −cos is sin.'),
  q('I06', 'integrals', 'Fundamental Theorem of Calculus (part 1): d/dx ∫_a^x f(t) dt equals:', ['f(a)', 'f(x)', 'F(x)−F(a)', '0'], 'B', 'Derivative of integral from a to x is f(x) (if f continuous).'),
  q('I07', 'integrals', 'FTC part 2: ∫_a^b f(x) dx equals:', ['f(b)−f(a)', 'F(b)−F(a) where F′=f', 'f′(b)−f′(a)', 'F(a)+F(b)'], 'B', 'Evaluate any antiderivative at endpoints.'),
  q('I08', 'integrals', '∫_0^1 2x dx equals:', ['0', '1', '2', '1/2'], 'B', '[x²]_0^1 = 1.'),
  q('I09', 'integrals', 'Average value of f on [a,b] is:', ['(1/(b−a)) ∫_a^b f', '∫ f', 'f(b)−f(a)', 'f′(b)'], 'A', 'Mean value for integrals.'),
  q('I10', 'integrals', '∫ (3x² + 2) dx equals:', ['x³ + 2x + C', '6x + C', 'x³ + 2 + C', '3x³ + 2x + C'], 'A', 'x³ + 2x + C.'),
  q('I11', 'integrals', 'If ∫_0^2 f = 5 and ∫_0^2 g = 2, then ∫_0^2 (f−g) equals:', ['3', '7', '10', '2.5'], 'A', 'Linearity of integrals: 5 − 2 = 3.'),
  q('I12', 'integrals', 'A definite integral ∫_a^b f(x) dx can represent:', ['only a derivative', 'net signed area between curve and x-axis', 'only volume', 'a limit that never exists'], 'B', 'Net area interpretation (positive above, negative below).'),
  q('I13', 'integrals', '∫ sec² x dx equals:', ['tan x + C', 'sec x + C', 'sec x tan x + C', '−cot x + C'], 'A', 'Derivative of tan is sec².'),
  q('I14', 'integrals', 'If F′ = f, then ∫_1^4 f(x) dx equals:', ['F(4)/F(1)', 'F(4) − F(1)', 'F(4) + F(1)', 'f(4) − f(1)'], 'B', 'FTC: F(b) − F(a).'),

  // —— U-SUB (10) ——
  q('U01', 'substitution', 'For ∫ 2x cos(x²) dx, a good u is:', ['2x', 'x²', 'cos(x²)', 'sin x'], 'B', 'u = x², du = 2x dx matches.'),
  q('U02', 'substitution', '∫ e^(3x) dx equals:', ['e^(3x) + C', '(1/3)e^(3x) + C', '3e^(3x) + C', 'e^x / 3 + C'], 'B', 'u = 3x, du = 3 dx → (1/3)e^u.'),
  q('U03', 'substitution', '∫ (2x+1)^5 · 2 dx equals:', ['(2x+1)^6 / 6 + C', '(2x+1)^6 + C', '2(2x+1)^5 + C', '(2x+1)^5 / 5 + C'], 'A', 'u = 2x+1, du = 2 dx → u^6/6.'),
  q('U04', 'substitution', '∫ sin(x) cos(x) dx can use u =:', ['sin x or cos x', 'x only', 'tan x only', 'e^x'], 'A', 'Either works; du matches the other factor (±).'),
  q('U05', 'substitution', '∫_0^1 2x(x²+1)^3 dx equals:', ['0', '15/4', '4', '1'], 'B', 'u=x²+1, u:1→2; ∫_1^2 u^3 du = [u^4/4]_1^2 = 4 − 1/4 = 15/4.'),
  q('U06', 'substitution', 'When substituting in a definite integral, you should:', ['always convert limits to u-limits (or back-sub carefully)', 'never change limits', 'drop +C', 'use product rule'], 'A', 'Change limits with u(x), or return to x before evaluating.'),
  q('U07', 'substitution', '∫ dx/(2x+5) equals:', ['ln|2x+5| + C', '(1/2)ln|2x+5| + C', '2 ln|2x+5| + C', '1/(2x+5) + C'], 'B', 'u=2x+5, du=2dx → (1/2)ln|u|.'),
  q('U08', 'substitution', '∫ x e^(x²) dx equals:', ['e^(x²) + C', '(1/2)e^(x²) + C', 'x² e^(x²) + C', 'e^x + C'], 'B', 'u=x², du=2x dx.'),
  q('U09', 'substitution', '∫ cos(5x) dx equals:', ['sin(5x) + C', '(1/5)sin(5x) + C', '5 sin(5x) + C', '−sin(5x) + C'], 'B', 'u=5x, (1/5)sin u.'),
  q('U10', 'substitution', 'A substitution works best when the integrand contains:', ['a function and (nearly) its derivative as a factor', 'only polynomials always', 'no chain structure', 'only absolute values'], 'A', 'Pattern: f′(g(x)) g′(x) or similar.'),

  // —— AREA / VOLUME INTRO (8) ——
  q('V01', 'area-volume', 'Area between y=f(x) and y=g(x) on [a,b] (f≥g) is:', ['∫_a^b [f−g] dx', '∫ (f+g)', 'f′−g′', '∫ f·g'], 'A', 'Top minus bottom integrated.'),
  q('V02', 'area-volume', 'Disk method about x-axis: V =:', ['∫ π [R(x)]² dx', '∫ 2π R', '∫ R dx', '∫ π R'], 'A', 'Cross-section disks: π radius squared.'),
  q('V03', 'area-volume', 'Washer method accounts for:', ['a hole by π(R_outer² − R_inner²)', 'only surface area', 'derivatives only', 'arc length only'], 'A', 'Outer radius squared minus inner radius squared.'),
  q('V04', 'area-volume', '∫_0^1 x dx (area under y=x) equals:', ['0', '1/2', '1', '2'], 'B', 'Triangle area 1/2.'),
  q('V05', 'area-volume', 'If f is below the x-axis on [a,b], ∫_a^b f is:', ['positive always', 'negative (signed area)', 'zero always', 'undefined'], 'B', 'Definite integral measures signed area.'),
  q('V06', 'area-volume', 'To find area between curves, first often find:', ['intersection points for limits', 'only derivatives', 'only f″', 'asymptotes only'], 'A', 'Intersections give a and b (or split intervals).'),
  q('V07', 'area-volume', 'Shell method (about y-axis) uses integrand proportional to:', ['2π x f(x)', 'π [f(x)]² only always', 'f′(x)', '1/x'], 'A', 'Circumference × height × thickness (if taught in Calc I).'),
  q('V08', 'area-volume', 'Net area of f from 0 to 2 if equal triangles above and below cancels to:', ['positive', 'zero', '∞', 'undefined'], 'B', 'Equal positive and negative signed areas → net 0.'),

  // —— CONCEPTS (12) ——
  q('C01', 'concepts', 'A derivative measures:', ['accumulated area', 'instantaneous rate of change', 'average value only', 'total distance only'], 'B', 'Core meaning of derivative.'),
  q('C02', 'concepts', 'A definite integral can measure:', ['slope only', 'accumulated change / net area', 'only critical points', 'only concavity'], 'B', 'Accumulation / net area.'),
  q('C03', 'concepts', 'If F is an antiderivative of f, then F′ equals:', ['∫ f', 'f', 'F', '0'], 'B', 'Definition of antiderivative.'),
  q('C04', 'concepts', 'The chain rule is needed when differentiating:', ['sums only', 'compositions f(g(x))', 'constants only', 'only polynomials of degree 1'], 'B', 'Compositions require chain rule.'),
  q('C05', 'concepts', 'L\'Hôpital\'s rule (if allowed) applies to limits of type:', ['∞ − ∞ only always', '0/0 or ∞/∞ (under conditions)', '0·∞ only', '1^∞ never'], 'B', 'Indeterminate quotients 0/0 or ∞/∞.'),
  q('C06', 'concepts', 'Velocity is negative when a particle moves:', ['right on a number line (usual)', 'left (if positive direction is right)', 'with a = 0 only', 'never'], 'B', 'Sign of v indicates direction.'),
  q('C07', 'concepts', 'Continuity does not imply:', ['limits exist at the point in the continuous case on open interval carefully', 'differentiability', 'f(a) defined', 'lim = f(a)'], 'B', 'Continuous ⇏ differentiable (e.g. |x|).'),
  q('C08', 'concepts', 'The +C in indefinite integrals means:', ['always zero', 'family of antiderivatives differ by a constant', 'only for definite integrals', 'error term'], 'B', 'Infinitely many antiderivatives, vertical shifts.'),
  q('C09', 'concepts', 'Graphically, where f′ = 0 on a smooth curve, the tangent is:', ['vertical', 'horizontal', 'undefined always', '45 degrees'], 'B', 'Zero slope → horizontal tangent.'),
  q('C10', 'concepts', '∫_a^a f(x) dx equals:', ['f(a)', '0', '2f(a)', 'undefined always'], 'B', 'Integral over zero width is 0.'),
  q('C11', 'concepts', 'If f′(x) = g′(x) for all x, then f and g differ by:', ['a constant', 'x', 'f·g', 'nothing fixed'], 'A', 'Same derivative → differ by constant.'),
  q('C12', 'concepts', 'Best first step for many Calc I “word” max/min problems:', ['draw diagram, define variables, write formula', 'integrate immediately', 'take limit at infinity only', 'use product rule on numbers'], 'A', 'Model first, then calculus.'),
];

const header = `/**
 * Calculus I Final Study Buddy — MCQ bank (${all.length} questions)
 * Typical college Calc I final topics (OSU-OKC style). Edit freely.
 * answer is "A"|"B"|"C"|"D". topics match js/topics.js ids.
 */
window.CALC1_QUESTIONS = `;

writeFileSync(outPath, header + JSON.stringify(all, null, 2) + ';\n');
console.log('Wrote', all.length, 'questions');
const counts = {};
for (const item of all) {
  const t = item.topics[0];
  counts[t] = (counts[t] || 0) + 1;
}
console.log(counts);
