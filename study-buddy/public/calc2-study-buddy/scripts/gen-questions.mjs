/** node scripts/gen-questions.mjs → js/questions.js */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { extraExam1 } from './bank/exam1-extra.mjs';
import { extraExam2 } from './bank/exam2-extra.mjs';
import { extraExam3 } from './bank/exam3-extra.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'js', 'questions.js');

function q(id, topic, stem, choices, answer, explanation, steps, whyNotOthers) {
  return {
    id,
    topics: [topic],
    stem,
    choices,
    answer,
    explanation,
    tutoring: { steps, whyNotOthers },
  };
}

const all = [
  // ——— Exam 1: IBP ———
  q(
    'IBP01',
    'ibp',
    'Integration by parts is the reverse of which derivative rule?',
    ['Chain rule', 'Product rule', 'Quotient rule', 'Power rule'],
    'B',
    'd(uv) = u dv + v du, so ∫ u dv = uv − ∫ v du.',
    [
      'Product rule: (uv)′ = u′v + uv′.',
      'Integrate both sides and rearrange to get ∫ u dv = uv − ∫ v du.',
      'That is why IBP is the tool for a product you cannot u-sub.',
    ],
    'Chain is reverse u-sub. Quotient is not the IBP identity. Power is for x^n alone.'
  ),
  q(
    'IBP02',
    'ibp',
    'Using LIATE, which factor is the better choice of u in ∫ x e^x dx?',
    ['e^x (exponential first)', 'x (algebraic first)', 'It does not matter', 'Neither — use only u-sub'],
    'B',
    'LIATE picks Log, Inverse trig, Algebraic, Trig, Exponential — so u = x, dv = e^x dx.',
    [
      'u should get simpler when differentiated. x → 1; e^x does not get simpler.',
      'dv = e^x dx is easy to integrate: v = e^x.',
      'Then ∫ x e^x dx = x e^x − ∫ e^x dx = e^x (x − 1) + C.',
    ],
    'Picking u = e^x makes the new integral worse (x e^x still there plus extra). u-sub has no inner derivative sitting outside.'
  ),
  q(
    'IBP03',
    'ibp',
    '∫ ln x dx equals:',
    ['1/x + C', 'x ln x + C', 'x ln x − x + C', 'ln|x| + C'],
    'C',
    'u = ln x, dv = dx ⇒ du = dx/x, v = x ⇒ x ln x − ∫ 1 dx = x ln x − x + C.',
    [
      'This is the classic “only a log” IBP: let u = ln x and dv = dx.',
      'uv − ∫ v du = x ln x − ∫ x · (1/x) dx = x ln x − ∫ 1 dx.',
      'Do not forget + C on the indefinite integral.',
    ],
    '1/x is the derivative of ln x, not the integral. x ln x is missing the −x. ln|x| is ∫ dx/x.'
  ),
  q(
    'IBP04',
    'ibp',
    '∫ x cos x dx equals:',
    ['x sin x + C', 'x sin x + cos x + C', 'x cos x + sin x + C', '½ x² cos x + C'],
    'B',
    'u = x, dv = cos x dx ⇒ uv − ∫ v du = x sin x − ∫ sin x dx = x sin x + cos x + C.',
    [
      'LIATE: algebraic x is u; cos x is easy to integrate.',
      'v = sin x, so subtract ∫ sin x dx = −cos x, which flips to + cos x.',
      'Check by differentiating: sin x + x cos x − sin x = x cos x.',
    ],
    'x sin x is incomplete. x cos x + sin x is the other IBP swap. ½ x² cos x is fake product integration.'
  ),
  q(
    'IBP05',
    'ibp',
    'For ∫ e^x sin x dx the standard method is:',
    ['One u-sub u = sin x', 'IBP twice, then solve for the original integral', 'Partial fractions', 'Trig sub x = tan θ'],
    'B',
    'IBP twice returns a multiple of the original I; move I to the left and divide.',
    [
      'Let I = ∫ e^x sin x dx. After two parts you get I = e^x (something) − I + …',
      'Add I to both sides: 2I = …, then I = (1/2) e^x (sin x − cos x) + C (up to algebra).',
      'This “circular IBP” is a standard Exam 1 write-up.',
    ],
    'u-sub fails (no cos x sitting outside). Partial fractions need a rational function. Trig sub is for quadratic radicals.'
  ),
  q(
    'IBP06',
    'ibp',
    'Tabular integration is most efficient when the integrand is:',
    ['A rational function of high degree', 'A polynomial times e^{ax}, sin(ax), or cos(ax)', '√(a² − x²)', '1/(x ln x)'],
    'B',
    'Repeatedly differentiate the polynomial (it dies) and integrate the trig/exp column.',
    [
      'The polynomial column goes to 0 after finitely many derivatives.',
      'Alternate + − + on the diagonals: that is IBP unrolled.',
      'Graders accept a clearly labeled table.',
    ],
    'Rationals want partial fractions. √(a²−x²) is trig sub. 1/(x ln x) is u = ln x.'
  ),

  // ——— Trig integrals ———
  q(
    'TI01',
    'trig-int',
    'To integrate ∫ sin³ x cos² x dx, the first move is:',
    ['Power-reduce both (both powers look even-ish)', 'Save one sin x and write sin² x = 1 − cos² x; u = cos x', 'u = sin x only', 'IBP with u = sin³ x'],
    'B',
    'Odd power of sine: save one sin, convert the rest, u = cos.',
    [
      'sin³ x = sin² x · sin x = (1 − cos² x) sin x.',
      'Then ∫ (1 − cos² x) cos² x sin x dx, u = cos x, du = −sin x dx.',
      'Even+even would have been power-reduce; here sine is odd, so this is faster.',
    ],
    'Power-reducing works but is longer. u = sin x would need a leftover cos, but leftover is sin. IBP is the wrong tool.'
  ),
  q(
    'TI02',
    'trig-int',
    '∫ sin² x dx equals:',
    ['−cos² x + C', 'x/2 − (1/4) sin 2x + C', '(sin³ x)/3 + C', '−sin x cos x + C'],
    'B',
    'sin² x = (1 − cos 2x)/2, so ∫ = x/2 − (1/4) sin 2x + C.',
    [
      'Even power, no odd leftover: use the power-reduction identity.',
      '∫ (1/2) dx − ∫ (1/2) cos 2x dx = x/2 − (1/4) sin 2x + C.',
      'Equivalent form: x/2 − (1/2) sin x cos x + C.',
    ],
    '−cos² is a derivative fragment. (sin³)/3 is ∫ sin² x cos x. Last option is incomplete/wrong sign.'
  ),
  q(
    'TI03',
    'trig-int',
    '∫ tan x dx equals:',
    ['sec x + C', 'ln|sec x| + C', 'sec² x + C', '−csc x + C'],
    'B',
    'tan x = sin x / cos x; u = cos x gives −ln|cos x| = ln|sec x| + C.',
    [
      'Write tan as sin/cos so the numerator is (almost) the derivative of the denominator.',
      'u = cos x, du = −sin x dx ⇒ −ln|u| = −ln|cos x|.',
      '−ln|cos x| = ln|sec x|. Same family of answers.',
    ],
    'sec is not an antiderivative of tan (derivative of sec is sec tan). sec² is the derivative of tan.'
  ),
  q(
    'TI04',
    'trig-int',
    '∫ sec x dx equals:',
    ['ln|sec x| + C', 'ln|sec x + tan x| + C', 'tan x + C', 'sec x tan x + C'],
    'B',
    'Standard formula (multiply by (sec+tan)/(sec+tan) or memorize).',
    [
      'This is a memorized Calc II integral, often listed on formula sheets.',
      'Check: d/dx ln|sec+tan| = (sec tan + sec²)/(sec+tan) = sec.',
      '∫ sec³ x is harder (IBP) and is a different problem.',
    ],
    'ln|sec| is ∫ tan. tan is ∫ sec². sec tan is d/dx(sec).'
  ),
  q(
    'TI05',
    'trig-int',
    'For ∫ sec⁴ x tan² x dx a good u is:',
    ['u = cos x', 'u = tan x  (because du = sec² x dx and leftover sec² = 1+tan²)', 'u = sec x tan x', 'u = x'],
    'B',
    'Even positive power of sec: peel sec² dx = du and convert remaining sec² to 1+tan².',
    [
      'sec⁴ tan² = sec² · sec² · tan² = (1+tan²) tan² sec².',
      'u = tan x, du = sec² x dx → ∫ (1+u²) u² du.',
      'Odd power of tan with leftover sec tan would have used u = sec instead.',
    ],
    'u = cos fights the sec powers. u = sec tan is the derivative of sec, not needed here.'
  ),
  q(
    'TI06',
    'trig-int',
    'sin² θ + cos² θ equals:',
    ['0', '1', 'tan² θ', 'sec² θ'],
    'B',
    'Pythagorean identity — used constantly to convert leftover even powers.',
    [
      'Also remember 1 + tan² = sec² and 1 + cot² = csc².',
      'These turn a mixed trig integral into a polynomial in u.',
      'Wrong identities are the #1 source of Exam 1 algebra errors.',
    ],
    'tan² is sin²/cos². sec² = 1+tan², not sin²+cos².'
  ),

  // ——— Trig sub ———
  q(
    'TS01',
    'trig-sub',
    'To integrate an expression containing √(a² − x²), the usual substitution is:',
    ['x = a tan θ', 'x = a sin θ', 'x = a sec θ', 'x = a sec θ tan θ'],
    'B',
    'a² − a² sin² θ = a² cos² θ, so the square root becomes a cos θ (for acute θ).',
    [
      'Picture a right triangle with opposite x, hypotenuse a.',
      'Then sin θ = x/a, and the adjacent side is √(a²−x²).',
      'Always replace dx as well: dx = a cos θ dθ.',
    ],
    'tan is for a²+x². sec is for x²−a².'
  ),
  q(
    'TS02',
    'trig-sub',
    '√(a² + x²) suggests:',
    ['x = a sin θ', 'x = a tan θ', 'x = a cos θ', 'x = a / θ'],
    'B',
    'a² + a² tan² θ = a² sec² θ, so the root becomes a sec θ.',
    [
      'Triangle: adjacent a, opposite x, hypotenuse √(a²+x²).',
      'dx = a sec² θ dθ.',
      'This is the one that produces sec in the integrand.',
    ],
    'sin is a²−x². cos would give a minus, not a plus.'
  ),
  q(
    'TS03',
    'trig-sub',
    '√(x² − a²) suggests:',
    ['x = a sin θ', 'x = a tan θ', 'x = a sec θ', 'x = a θ'],
    'C',
    'a² sec² θ − a² = a² tan² θ, so the root becomes a tan θ.',
    [
      'Triangle: adjacent a, hypotenuse x, opposite √(x²−a²).',
      'Need |x| ≥ a for the root to be real.',
      'dx = a sec θ tan θ dθ.',
    ],
    'sin and tan do not cancel this radical cleanly.'
  ),
  q(
    'TS04',
    'trig-sub',
    'After a trig sub you should convert θ back to x by:',
    ['Leaving θ in the answer always', 'Using a reference triangle labeled with x and a', 'Replacing θ by x', 'Using L’Hôpital'],
    'B',
    'The triangle gives sin θ, tan θ, sec θ as ratios of sides in x.',
    [
      'Indefinite integrals in x need an x-answer unless the problem is definite and you changed limits.',
      'For definite integrals you may change limits to θ-values and skip back-sub.',
      'Draw the triangle on the exam — it is part of a complete write-up.',
    ],
    'Leaving θ is incomplete for an x-problem. θ is not x. L’Hôpital is a limit tool.'
  ),
  q(
    'TS05',
    'trig-sub',
    'In x = 3 sin θ, dx equals:',
    ['3 sin θ dθ', '3 cos θ dθ', '3 sec² θ dθ', 'cos θ dθ'],
    'B',
    'Differentiate both sides: dx/dθ = 3 cos θ.',
    [
      'Forgetting to replace dx is the most common trig-sub crash.',
      'If x = a sin θ then dx = a cos θ dθ.',
      'Check units/form: one dθ should remain until you integrate.',
    ],
    '3 sec² would be x = 3 tan θ. Missing the 3 is a constant drop.'
  ),
  q(
    'TS06',
    'trig-sub',
    '∫ dx / √(9 − x²) equals:',
    ['ln|9 − x²| + C', 'arcsin(x/3) + C', 'arccos(x/3) + C', 'ln|x + √(9−x²)| + C'],
    'B',
    'This is the arcsin template: ∫ dx/√(a²−x²) = arcsin(x/a) + C with a = 3.',
    [
      'Recognize the inverse-trig form before grinding a substitution (faster on a multiple choice).',
      'Trig sub x = 3 sin θ also works and yields θ = arcsin(x/3).',
      'Domain |x| < 3.',
    ],
    'ln of the inside is not this integral. The ln|x+√(x²±a²)| forms are inverse hyp / other radicals. arccos would be −arcsin plus constant, not the standard antiderivative listed.'
  ),

  // ——— Partial fractions ———
  q(
    'PF01',
    'partial',
    'Before decomposing (x³ + 1)/(x² + x) you should first:',
    ['Factor nothing — write A/x + B/(x+1) only', 'Long-divide because the numerator degree is larger', 'Use IBP', 'Use trig sub'],
    'B',
    'Improper rational: deg(num) ≥ deg(den) ⇒ divide, then decompose the remainder.',
    [
      'Here deg 3 ≥ deg 2, so there is a polynomial part (a linear quotient).',
      'Partial fractions apply only to the proper remainder.',
      'Skipping division is a classic Exam 1 zero on that problem.',
    ],
    'A/x+B/(x+1) would be for a proper fraction with those factors only. IBP/trig sub are the wrong family.'
  ),
  q(
    'PF02',
    'partial',
    'The template for (3x+1)/[(x−2)(x+5)] is:',
    ['A/(x−2) + B/(x+5)', 'A/(x−2) + Bx/(x+5)', '(Ax+B)/[(x−2)(x+5)]', 'A/(x−2)² + B/(x+5)²'],
    'A',
    'Distinct linear factors: one constant over each.',
    [
      'Clear: 3x+1 = A(x+5) + B(x−2).',
      'Plug x = 2 and x = −5 (cover-up) to read A and B instantly.',
      'Then integrate as A ln|x−2| + B ln|x+5| + C.',
    ],
    'Linear-over-linear is for an irreducible quadratic. Squares would be a repeated factor you do not have.'
  ),
  q(
    'PF03',
    'partial',
    'The template for 1/[(x−1)² (x+2)] includes:',
    ['A/(x−1) + B/(x+2) only', 'A/(x−1) + B/(x−1)² + C/(x+2)', 'A/(x−1)² + B/(x+2)²', '(Ax+B)/(x−1)² + C/(x+2)'],
    'B',
    'A repeated linear factor needs every power from 1 up to the multiplicity.',
    [
      'Multiplicity 2 ⇒ A/(x−1) + B/(x−1)².',
      'The distinct linear (x+2) gets one term C/(x+2).',
      'Missing the A/(x−1) term makes the system inconsistent.',
    ],
    'Only two terms is incomplete. Squaring both is wrong. Ax+B over a linear-squared is the quadratic style, not needed.'
  ),
  q(
    'PF04',
    'partial',
    'The template for (x+1)/( (x−3)(x²+4) ) is:',
    ['A/(x−3) + B/(x²+4)', 'A/(x−3) + (Bx+C)/(x²+4)', 'A/(x−3) + B/x + C/4', '(Ax+B)/(x−3) + C/(x²+4)'],
    'B',
    'Irreducible quadratic factor gets a linear numerator Bx+C.',
    [
      'x²+4 does not factor over the reals.',
      'After solving, ∫ (Bx+C)/(x²+4) splits into a ln piece and an arctan piece.',
      '∫ dx/(x²+a²) = (1/a) arctan(x/a).',
    ],
    'A constant over x²+4 cannot produce the x in the numerator if it is needed. Splitting x²+4 into x and 4 is not factoring.'
  ),
  q(
    'PF05',
    'partial',
    '∫ dx / (x² + 4x + 3) after factoring is:',
    ['ln|x² + 4x + 3| + C', 'A ln|x+1| + B ln|x+3| + C  (partial fractions)', 'arctan(x+2) + C', '1/(x+2) + C'],
    'B',
    'x²+4x+3 = (x+1)(x+3); decompose and integrate logs.',
    [
      'Complete-the-square would also work but partial fractions is cleaner here.',
      '1/(x+1)(x+3) = (1/2)[1/(x+1) − 1/(x+3)].',
      'Answer: (1/2) ln |(x+1)/(x+3)| + C.',
    ],
    'ln of the quadratic is only if the numerator were the derivative 2x+4. arctan is the irreducible (no real roots) case after completing the square when the quadratic does not factor.'
  ),
  q(
    'PF06',
    'partial',
    'Cover-up (Heaviside) is legal for:',
    ['Any improper fraction with no work', 'Distinct linear factors, plugging the root that zeros one factor', 'Only trig integrals', 'Repeated quadratic factors only'],
    'B',
    'For A/(x−r) + …, multiply by (x−r) and set x = r to read A.',
    [
      'Show the cleared equation so the grader sees the method.',
      'Repeated factors still need extra coefficients — cover-up alone is not enough for those.',
      'Always divide first if the fraction is improper.',
    ],
    'It is not a free pass on improper fractions. It is not a trig method.'
  ),

  // ——— Improper ———
  q(
    'IM01',
    'improper',
    '∫_1^∞ x^{−p} dx converges if and only if:',
    ['p < 1', 'p > 1', 'p > 0', 'p ≥ 1'],
    'B',
    'p-test on [1, ∞): need p > 1. Harmonic p = 1 diverges.',
    [
      'Antiderivative x^{1−p}/(1−p) for p ≠ 1; let b → ∞.',
      'The exponent 1−p is negative precisely when p > 1, so the term vanishes.',
      'p = 1 is ln b → ∞.',
    ],
    'p < 1 is the cutoff on (0,1], the opposite end. p ≥ 1 includes the divergent harmonic case.'
  ),
  q(
    'IM02',
    'improper',
    '∫_0^1 x^{−p} dx converges if and only if:',
    ['p > 1', 'p < 1', 'p = 1', 'p > 0'],
    'B',
    'Near 0 the singularity is milder when p is smaller: need p < 1.',
    [
      'The blow-up is at x = 0, so write lim (a→0⁺) ∫_a^1 x^{−p} dx.',
      'p = 1 is −ln a → ∞ (diverges).',
      'Do not reuse the [1,∞) cutoff here.',
    ],
    'p > 1 is the infinity-end p-test. p = 1 diverges on (0,1] too.'
  ),
  q(
    'IM03',
    'improper',
    'The correct rewrite of ∫_0^∞ e^{−x} dx is:',
    ['e^{−∞} − e^0', 'lim (b→∞) ∫_0^b e^{−x} dx', '∫ e^{−x} dx with x = ∞ plugged in', '0, because e^{−x} → 0'],
    'B',
    'Definition: replace the infinite limit by a finite b, then take lim b→∞.',
    [
      '∫_0^b e^{−x} dx = 1 − e^{−b} → 1.',
      'So the improper integral converges to 1.',
      'Writing e^{−∞} is sloppy and often marked down.',
    ],
    'The integrand going to 0 does not decide the integral (compare 1/x). Plugging ∞ as a number is not a definition.'
  ),
  q(
    'IM04',
    'improper',
    '∫_1^∞ (1/x) dx is:',
    ['0', '1', 'divergent (harmonic)', 'ln 1'],
    'C',
    'lim (b→∞) ln b = ∞. This is the continuous version of the harmonic series.',
    [
      'Antiderivative ln x on [1, b] is ln b − ln 1 = ln b.',
      'ln b → ∞, so the integral diverges.',
      'p = 1 is the boundary case of the p-test — it diverges.',
    ],
    'It is not a finite number. ln 1 = 0 is only the lower limit contribution.'
  ),
  q(
    'IM05',
    'improper',
    'If 0 ≤ f(x) ≤ g(x) for x ≥ 1 and ∫_1^∞ g converges, then ∫_1^∞ f:',
    ['May go either way', 'Converges (direct comparison)', 'Diverges', 'Equals ∫ g'],
    'B',
    'Comparison: a smaller nonnegative function inherits convergence.',
    [
      'Think areas: the region under f sits under a finite-area region.',
      'The opposite: if f ≥ g ≥ 0 and ∫ g diverges, then ∫ f diverges.',
      'Limit comparison is the version when they are only “the same size.”',
    ],
    'It does not automatically diverge. The integrals need not be equal.'
  ),
  q(
    'IM06',
    'improper',
    '∫_{-1}^1 dx/x is improper because:',
    ['The interval is finite, so it is actually proper', 'There is a vertical asymptote at x = 0 inside the interval', 'The integrand is negative', '1/x is not continuous at x = 1'],
    'B',
    'Split at 0 and take one-sided limits. (This one diverges.)',
    [
      'A finite interval can still be improper if f blows up inside.',
      'You must write lim (a→0⁻) ∫_{-1}^a + lim (b→0⁺) ∫_b^1.',
      'Cauchy principal value is 0, but that is not the ordinary improper integral — both sides diverge.',
    ],
    'Continuity fails at 0, not at 1. Sign does not make it improper.'
  ),

  // ——— Apps ———
  q(
    'AP01',
    'apps-int',
    'The arc-length integral for y = f(x) from x = a to x = b is:',
    ['∫_a^b f(x) dx', '∫_a^b √(1 + (f′(x))²) dx', '∫_a^b 2π f(x) dx', '∫_a^b f′(x) dx'],
    'B',
    'ds = √(dx² + dy²) = √(1 + (dy/dx)²) dx.',
    [
      'Pythagoras on a tiny piece of curve: legs dx and dy.',
      'Factor dx out of the root to get √(1+(y′)²).',
      'Surface of revolution multiplies this ds by 2π·radius.',
    ],
    '∫ f is area under the curve. 2π f is a shell/surface fragment without ds. ∫ f′ is net change of f.'
  ),
  q(
    'AP02',
    'apps-int',
    'Surface area of y = f(x) ≥ 0 revolved about the x-axis is:',
    ['∫ π [f(x)]² dx', '2π ∫ f(x) √(1 + (f′(x))²) dx', '∫ √(1+(f′)²) dx', '2π ∫ x f(x) dx'],
    'B',
    'Each band has radius f(x) and width ds = √(1+(f′)²) dx.',
    [
      'Disk/washer volume uses π R² and is a different formula.',
      'About the y-axis the radius is x, not f(x).',
      'Setup points are often most of the grade — box radius and ds.',
    ],
    'π R² is volume. Bare √(1+(f′)²) is arc length. 2π ∫ x f is a Pappus/shell relative, not this surface.'
  ),
  q(
    'AP03',
    'apps-int',
    'Hooke’s-law work to stretch a spring from x = a to x = b (natural length at 0) is:',
    ['k(b − a)', '∫_a^b kx dx', 'k b²', '∫_a^b k dx'],
    'B',
    'F(x) = kx, so W = ∫ F dx = ∫_a^b kx dx = (k/2)(b² − a²).',
    [
      'Work is force times distance, but force changes, so integrate.',
      'Units: if k is N/m and x is m, work is joules.',
      'Pumping problems replace kx by (slice weight)×(distance that slice travels).',
    ],
    'k(b−a) treats force as constant. Missing the 1/2 if you quote k b² blindly.'
  ),
  q(
    'AP04',
    'apps-int',
    'For y = x^{3/2} on [0, 1], (y′)² equals:',
    ['(3/2) x^{1/2}', '(9/4) x', '(3/2) x', 'x³'],
    'B',
    'y′ = (3/2) x^{1/2}, so (y′)² = 9/4 x. That is what goes inside 1+(y′)².',
    [
      'Differentiate first, then square — do not square the function.',
      '1 + (y′)² = 1 + (9/4)x, which is a friendly root after algebra.',
      'This is a standard “the root actually works out” arc-length example.',
    ],
    '(3/2)√x is y′, not (y′)². x³ is y², irrelevant here.'
  ),
  q(
    'AP05',
    'apps-int',
    'A pumping (tank) work integral is built by:',
    ['∫ volume only', 'Slicing the liquid and writing (weight of slice) × (distance that slice is lifted)', 'Using arc length of the tank wall', '∫ kx only'],
    'B',
    'Each thin slab has a different travel distance; integrate force×distance.',
    [
      'Draw the tank. Mark y = 0 somewhere convenient (often the spout or the bottom).',
      'A typical slice: A(y) Δy · density · g · distance(y).',
      'Limits run over the y-values that actually contain liquid.',
    ],
    'Volume alone is not work. Arc length is geometry of a curve. kx is springs, not tanks.'
  ),
  q(
    'AP06',
    'apps-int',
    'If a problem asks only to “set up” an arc-length integral, you should still:',
    ['Skip y′ because setup means limits only', 'Compute y′, simplify 1+(y′)² if easy, and write the definite integral', 'Give a decimal from a calculator only', 'Write ∫ ds with no formula'],
    'B',
    'A complete setup is the simplified integrand and the correct limits. Evaluation may be optional.',
    [
      'OSU-style exams often stop before a nasty antiderivative.',
      'Unsimplified √(1+(ugly)²) may lose the “simplify” points.',
      'Box the final integral.',
    ],
    'Limits alone are not a setup. A calculator decimal is not the write-up they want unless asked.'
  ),

  // ——— Sequences ———
  q(
    'SQ01',
    'sequences',
    'The sequence a_n = n / (n + 1) converges to:',
    ['0', '1', '∞', 'Does not exist'],
    'B',
    'Divide by n: 1 / (1 + 1/n) → 1/1 = 1.',
    [
      'This is a Calc I infinity-limit in disguise.',
      'The sequence is the list 1/2, 2/3, 3/4, … climbing toward 1.',
      'It is bounded above by 1 and increasing, so the monotone-convergence theorem also applies.',
    ],
    '0 would be if the denominator grew faster. ∞ is the sequence n itself. It does exist.'
  ),
  q(
    'SQ02',
    'sequences',
    'a_n = (−1)^n  (n = 1, 2, 3, …) :',
    ['Converges to 0', 'Converges to 1', 'Converges to −1', 'Diverges (oscillates)'],
    'D',
    'Terms alternate −1, 1, −1, 1, … — two subsequences, two limits.',
    [
      'A sequence converges only if it approaches one finite number.',
      'Odd and even subsequences disagree, so the sequence diverges.',
      'Do not confuse this with the alternating series Σ (−1)^n / n, which does converge.',
    ],
    'It does not settle at 0, 1, or −1. Oscillation with amplitude 1 is divergence.'
  ),
  q(
    'SQ03',
    'sequences',
    'A monotone bounded sequence:',
    ['May still diverge', 'Must converge (to a finite limit)', 'Must go to 0', 'Must be geometric'],
    'B',
    'Monotone Convergence Theorem: increasing and bounded above (or decreasing and bounded below) ⇒ converges.',
    [
      'You may not know the limit — only that it exists.',
      'Bounded alone is not enough ((−1)^n is bounded and diverges).',
      'Monotone alone is not enough (a_n = n increases and diverges).',
    ],
    'It need not go to 0 (n/(n+1) → 1). It need not be geometric.'
  ),
  q(
    'SQ04',
    'sequences',
    'If the series Σ a_n converges, then the sequence a_n :',
    ['May do anything', 'Must go to 0', 'Must go to 1', 'Must be decreasing'],
    'B',
    'Necessary condition: a_n → 0. Not sufficient (harmonic).',
    [
      'Partial sums s_n converge ⇒ s_n − s_{n−1} = a_n → 0.',
      'Use this as a divergence test: if a_n ↛ 0, the series diverges.',
      'Never use “a_n → 0” alone to claim the series converges.',
    ],
    'Not anything — the terms must vanish. They need not be monotone.'
  ),
  q(
    'SQ05',
    'sequences',
    'Which grows fastest as n → ∞?',
    ['n³', '2^n', 'n!', 'ln n'],
    'C',
    'ln n ≪ n^p ≪ c^n ≪ n! ≪ n^n (for c > 1).',
    [
      'Compare consecutive ratios or take logs for a growth race.',
      'Factorials beat exponentials: (n+1)! / n! = n+1 → ∞ while 2^{n+1}/2^n = 2.',
      'This ordering is used constantly in ratio tests later.',
    ],
    'Polynomials lose to exponentials. Logs lose to everything here. 2^n loses to n!.'
  ),
  q(
    'SQ06',
    'sequences',
    'lim (n→∞) (1 + 1/n)^n equals:',
    ['1', '0', 'e', '∞'],
    'C',
    'This is the standard sequential definition of e.',
    [
      'Do not expand as 1^n = 1 — the base is changing with n.',
      'Related: (1 + x/n)^n → e^x.',
      'Useful when a series or sequence has this shape.',
    ],
    '1 is the trap from “1 to a power.” It is not 0 or ∞.'
  ),

  // ——— Series basics ———
  q(
    'SB01',
    'series-basic',
    'The geometric series Σ_{n=0}^∞ r^n converges if and only if:',
    ['r > 0', '|r| < 1', '|r| ≤ 1', 'r ≠ 1'],
    'B',
    '|r| < 1, and the sum is 1/(1−r). At r = ±1 it diverges.',
    [
      'Partial sum (1 − r^{N+1})/(1−r) → 1/(1−r) precisely when |r| < 1.',
      'r = 1 is 1+1+1+… . r = −1 is 1−1+1−1+… .',
      'Identify r carefully (sometimes it is −1/2 or 3/2).',
    ],
    '|r| ≤ 1 includes the endpoints that fail. Sign of r alone is not the test.'
  ),
  q(
    'SB02',
    'series-basic',
    'Σ_{n=1}^∞ (1/2)^n equals:',
    ['1/2', '1', '2', 'Diverges'],
    'B',
    'Geometric with first term a = 1/2 and r = 1/2: a/(1−r) = (1/2)/(1/2) = 1.',
    [
      'From n = 1: (1/2) + (1/4) + (1/8) + … = 1.',
      'If the sum started at n = 0 you would get 1 more (the 1 = r^0 term) for a total of 2.',
      'Always state the first term and the ratio.',
    ],
    '1/2 is only the first term. 2 is the n=0 to ∞ sum. It converges.'
  ),
  q(
    'SB03',
    'series-basic',
    'The harmonic series Σ 1/n :',
    ['Converges to ln 2', 'Converges to 1', 'Diverges', 'Converges by the n-th term test because 1/n → 0'],
    'C',
    'p-series with p = 1, or integral test ∫ dx/x = ln → ∞. Terms → 0 is not enough.',
    [
      'Grouping 1/2 + (1/3+1/4) + (next four > 1/2) + … shows divergence.',
      'This is the standard counterexample to “terms go to 0 ⇒ series converges.”',
      'p-series converges only for p > 1.',
    ],
    'ln 2 is the alternating harmonic sum. The n-th term test cannot prove convergence.'
  ),
  q(
    'SB04',
    'series-basic',
    'The n-th term (divergence) test says: if lim a_n ≠ 0 (or DNE), then Σ a_n :',
    ['Converges', 'Diverges', 'Converges conditionally', 'Is geometric'],
    'B',
    'Necessary condition failed ⇒ the series diverges. The test never proves convergence.',
    [
      'If the limit is 0, the test is inconclusive — pick another test.',
      'Example: a_n = n/(n+1) → 1 ≠ 0, so Σ n/(n+1) diverges immediately.',
      'Write the limit on the exam.',
    ],
    'It cannot conclude convergence or “conditional.” Geometric is a different test.'
  ),
  q(
    'SB05',
    'series-basic',
    'A telescoping series is handled by:',
    ['Ratio test first', 'Writing the partial sum s_N and canceling, then letting N → ∞', 'Root test only', 'Always concluding divergence'],
    'B',
    'Partial fractions often produce (b_n − b_{n+1}); the partial sum collapses.',
    [
      'Example: 1/(n(n+1)) = 1/n − 1/(n+1). s_N = 1 − 1/(N+1) → 1.',
      'You must exhibit the remaining uncancelled terms.',
      'Then take the limit of s_N — that limit is the sum.',
    ],
    'Ratio/root are overkill and often inconclusive on rational telescopers.'
  ),
  q(
    'SB06',
    'series-basic',
    'Σ_{n=1}^∞ 3 · (2/5)^{n−1} equals:',
    ['3', '6', '5', 'Diverges because |r| = 2/5 < 1'],
    'C',
    'Geometric with a = 3, r = 2/5. Sum a/(1−r) = 3 / (3/5) = 5.',
    [
      'Standard form a + ar + ar² + … starts at n = 1 with first term 3.',
      '|r| = 2/5 < 1, so it converges.',
      'A common slip is using 1−r = 2/5 instead of 3/5 (that would give 3/(2/5)=15/2).',
    ],
    '3 is only a. 6 would be if someone did 3/(1/2). “Diverges because |r|<1” reverses the criterion.'
  ),

  // ——— Series tests ———
  q(
    'ST01',
    'series-tests',
    'The integral test requires f to be eventually:',
    ['Odd and periodic', 'Positive, continuous, and decreasing', 'Polynomial', 'Alternating'],
    'B',
    'Then Σ f(n) and ∫_1^∞ f(x) dx both converge or both diverge.',
    [
      'Check the three hypotheses before integrating — graders look for them.',
      'Classic: Σ 1/(n ln n) via ∫ dx/(x ln x) = ln(ln x) → ∞, diverges.',
      'The value of the integral is not the value of the series.',
    ],
    'Odd/periodic/alternating are other stories. Polynomials are a special case, not the hypothesis.'
  ),
  q(
    'ST02',
    'series-tests',
    'Limit comparison of a_n > 0, b_n > 0: if lim a_n/b_n = c with 0 < c < ∞, then:',
    ['Σ a converges and Σ b diverges', 'The two series either both converge or both diverge', 'Σ a always converges', 'The test fails'],
    'B',
    'Same “size” ⇒ same behavior. Favorite partner b_n is a p-series or geometric.',
    [
      'For a_n = (3n² + 1)/(n⁴ + 5) compare to 3/n² (p = 2 > 1) ⇒ converges.',
      'If the limit is 0 or ∞ the test may still work in one direction, but the standard statement needs a positive finite c.',
      'Direct comparison needs an inequality; limit comparison only needs a limit.',
    ],
    'They cannot go opposite ways when c is positive and finite. It does not force convergence by itself.'
  ),
  q(
    'ST03',
    'series-tests',
    'The Alternating Series Test requires b_n ↓ 0 (decreasing to 0). Then Σ (−1)^{n+1} b_n :',
    ['Diverges', 'Converges (possibly only conditionally)', 'Converges absolutely', 'Has sum b_1'],
    'B',
    'AST gives convergence of the alternating series. Absolute convergence is a separate check of Σ b_n.',
    [
      'You must argue b_n is eventually decreasing (derivative or ratio) and lim b_n = 0.',
      'Remainder |R_N| ≤ b_{N+1}.',
      'Alternating harmonic converges (to ln 2) but not absolutely.',
    ],
    'It does not prove absolute convergence. The sum is not generally the first term.'
  ),
  q(
    'ST04',
    'series-tests',
    'Ratio test: L = lim |a_{n+1}/a_n|. The series converges absolutely when:',
    ['L > 1', 'L < 1', 'L = 1', 'L = 0 only'],
    'B',
    'L < 1 absolute convergence; L > 1 (or ∞) divergence; L = 1 inconclusive.',
    [
      'Reach for ratio when you see n! or c^n or products.',
      'L = 1 happens for most p-series — switch tests.',
      'Root test has the same L cutoffs with ( |a_n| )^{1/n}.',
    ],
    'L > 1 diverges. L = 1 is the useless case. L = 0 is a subcase of L < 1, not the only success.'
  ),
  q(
    'ST05',
    'series-tests',
    'Σ (−1)^n / n  is:',
    ['Absolutely convergent', 'Conditionally convergent', 'Divergent', 'Geometric with |r| = 1'],
    'B',
    'AST: 1/n ↓ 0 so it converges. Σ 1/n diverges, so not absolute ⇒ conditional.',
    [
      'Absolute series = harmonic = diverge.',
      'This is the mascot of conditional convergence.',
      'Write both sentences on a free-response: “converges by AST; not absolutely because …”',
    ],
    'Not absolute. Not divergent. Not geometric.'
  ),
  q(
    'ST06',
    'series-tests',
    'Best first test for Σ n! / n^n :',
    ['Integral test', 'n-th term test only', 'Ratio test', 'AST'],
    'C',
    'Factorials and n^n scream ratio: |a_{n+1}/a_n| → 1/e < 1, so it converges.',
    [
      'a_{n+1}/a_n = (n+1)! n^n / ( (n+1)^{n+1} n! ) = n^n / (n+1)^n = (n/(n+1))^n → 1/e.',
      'Integral test is painful with factorials. AST needs alternation.',
      'n-th term actually does go to 0, so it cannot decide.',
    ],
    'Integral is the wrong hammer. No alternation for AST. n-th term is inconclusive.'
  ),
  q(
    'ST07',
    'series-tests',
    'If Σ |a_n| converges, then Σ a_n :',
    ['May diverge', 'Converges (absolute ⇒ ordinary convergence)', 'Oscillates', 'Is a p-series'],
    'B',
    'Absolute convergence implies convergence. The converse is false.',
    [
      'Proof idea: a_n = (a_n + |a_n|) − |a_n| and 0 ≤ a_n+|a_n| ≤ 2|a_n|.',
      'Always check Σ |a_n| first on an alternating problem if it looks easy.',
      'If Σ |a_n| diverges, the original might still converge (conditional).',
    ],
    'It cannot diverge if the absolute series converges. It need not be a p-series.'
  ),
  q(
    'ST08',
    'series-tests',
    'Ratio test with L = 1 means:',
    ['The series converges', 'The series diverges', 'The test is inconclusive — try another test', 'The series is geometric'],
    'C',
    'p-series and harmonic both give L = 1 and disagree, so L = 1 tells you nothing.',
    [
      'Switch to integral, comparison, AST, or n-th term as appropriate.',
      'Do not write “inconclusive, therefore diverges.”',
      'Root test L = 1 is equally inconclusive.',
    ],
    'Neither convergence nor divergence follows. Geometric series usually have L = |r| ≠ 1 when the ratio test is used that way.'
  ),

  // ——— Power series ———
  q(
    'PW01',
    'power',
    'For a power series centered at a, the set of x where it converges is always:',
    ['All real x', 'Only x = a', 'An interval centered at a (possibly a point or the whole line), plus a decision at each endpoint', 'A union of two rays'],
    'C',
    'There is a radius R ∈ [0, ∞]. Inside (a−R, a+R) it converges; outside it diverges; endpoints are case-by-case.',
    [
      'Find R with the ratio (or root) test on consecutive terms.',
      'Then plug x = a−R and x = a+R into the series and use Exam 2 tests.',
      'Never assume the interval is closed just because R is finite.',
    ],
    'Not always all x (R could be 0 or finite). Not only the center unless R = 0. Not two disconnected rays.'
  ),
  q(
    'PW02',
    'power',
    'The geometric series Σ x^n converges when:',
    ['|x| ≤ 1', '|x| < 1', 'x > 0', 'all x'],
    'B',
    'R = 1. At x = 1 it is harmonic-like 1+1+…; at x = −1 it oscillates. Interval (−1, 1).',
    [
      'This is the seed series for almost every “represent f as a power series” problem.',
      'Substitute, differentiate, or integrate inside |x| < 1, then re-check endpoints.',
      'Sum is 1/(1−x) for |x| < 1.',
    ],
    '|x| ≤ 1 wrongly includes the endpoints. Sign of x is not the test.'
  ),
  q(
    'PW03',
    'power',
    'If Σ c_n (x−2)^n has radius 3, it definitely converges at:',
    ['x = 6', 'x = −2', 'x = 2.5', 'x = −1'],
    'C',
    'Open interval (2−3, 2+3) = (−1, 5). 2.5 is inside. x = −1 and x = 5 are endpoints (unknown). x = 6 is outside.',
    [
      '|x−2| < 3 is the guaranteed set.',
      'x = 6 has |6−2| = 4 > 3 ⇒ diverges.',
      'x = −1 has |−1−2| = 3 = R ⇒ endpoint, need another test.',
    ],
    '6 is outside. −2 is |−2−2|=4>3, diverges. −1 is an endpoint, not definite.'
  ),
  q(
    'PW04',
    'power',
    'Term-by-term differentiation of a power series:',
    ['Is never allowed', 'Is valid on the open interval of convergence (same center, same radius)', 'Always changes the radius', 'Turns it into a Taylor polynomial only'],
    'B',
    'Differentiate or integrate inside (a−R, a+R). Endpoints must be rechecked.',
    [
      'Radius stays the same; interval (closed/open) may change.',
      'This is how you get 1/(1−x)² = Σ (n+1) x^n from the geometric series.',
      'You do not need to re-derive R from scratch, but you do re-test x = ±R.',
    ],
    'It is allowed inside the open interval. Radius does not automatically change.'
  ),
  q(
    'PW05',
    'power',
    'A series Σ c_n (x+1)^n is centered at:',
    ['x = 1', 'x = −1', 'x = 0', 'x = c_n'],
    'B',
    'General term (x − a)^n with a = −1, because x − (−1) = x+1.',
    [
      'Always rewrite as (x − a) to read the center.',
      'Radius is measured as distance from this a.',
      'Maclaurin means a = 0 specifically.',
    ],
    'x = 1 would be (x−1)^n. x = 0 is Maclaurin.'
  ),
  q(
    'PW06',
    'power',
    'To find R for Σ n! (x−3)^n , the ratio |a_{n+1}/a_n| tends to:',
    ['0, so R = ∞', '∞ unless x = 3, so R = 0', '1, so R = 1', '3'],
    'B',
    '|a_{n+1}/a_n| = (n+1) |x−3| → ∞ if x ≠ 3. Only the center converges. R = 0.',
    [
      'Factorials in the numerator without a matching n^n or similar kill the radius.',
      'e^x = Σ x^n/n! has n! in the denominator, which is the opposite (R = ∞).',
      'R = 0 series are legal — they still define a function at the center.',
    ],
    'R = ∞ is the n! in the denominator case. The 3 is the center, not the radius.'
  ),

  // ——— Taylor ———
  q(
    'TY01',
    'taylor',
    'The Maclaurin series for e^x is:',
    ['Σ x^n', 'Σ x^n / n!', 'Σ (−1)^n x^n / n!', 'Σ n! x^n'],
    'B',
    'e^x = Σ_{n=0}^∞ x^n / n!, valid for all x.',
    [
      'All derivatives of e^x at 0 are 1, so f^{(n)}(0)/n! = 1/n!.',
      'This is the #1 series to memorize for Exam 3 / the final.',
      'Replace x by −x² etc. to build e^{−x²} without recomputing derivatives.',
    ],
    'Σ x^n is geometric 1/(1−x). Alternating /n! is e^{−x} or similar. n! in the numerator is not e^x.'
  ),
  q(
    'TY02',
    'taylor',
    'The Maclaurin series for sin x begins:',
    ['x − x²/2! + x³/3! − …', 'x − x³/3! + x⁵/5! − …', '1 − x²/2! + x⁴/4! − …', 'x + x³/3! + x⁵/5! + …'],
    'B',
    'Odd powers only, alternating, factorials in the denominator.',
    [
      'sin is odd, so only odd powers.',
      'cos is the even sibling: 1 − x²/2! + x⁴/4! − …',
      'Signs: (−1)^n on x^{2n+1}/(2n+1)!.',
    ],
    'Even starting 1−x²/2! is cosine. Missing factorials or missing the minus signs are common traps.'
  ),
  q(
    'TY03',
    'taylor',
    'The Maclaurin series for 1/(1−x) is:',
    ['Σ x^n / n!', 'Σ x^n   (|x| < 1)', 'Σ (−1)^n x^n', 'Σ n x^{n−1}'],
    'B',
    'Geometric: 1 + x + x² + x³ + … for |x| < 1.',
    [
      'This is both a geometric series and the Taylor series of 1/(1−x) at 0.',
      'Differentiate to get 1/(1−x)² = Σ n x^{n−1}.',
      'Substitute x → −x to get 1/(1+x) = Σ (−1)^n x^n.',
    ],
    ' /n! is exponential. Σ (−1)^n x^n is 1/(1+x). Σ n x^{n−1} is the derivative series.'
  ),
  q(
    'TY04',
    'taylor',
    'To get a series for ln(1+x), starting from 1/(1+x) = Σ (−1)^n x^n , you should:',
    ['Differentiate', 'Integrate term by term and adjust the constant', 'Multiply by n!', 'Use IBP on ln'],
    'B',
    '∫_0^x dt/(1+t) = ln(1+x) = Σ (−1)^n x^{n+1}/(n+1)  (and x = 1 works: alternating harmonic).',
    [
      'Term-by-term integration is legal on the open interval, then check endpoints.',
      'The n = 0 term integrates x to x^{1}/1, etc.',
      'This is faster than computing many derivatives of ln(1+x).',
    ],
    'Differentiating 1/(1+x) gives −1/(1+x)², not ln. IBP is not how you build the series here.'
  ),
  q(
    'TY05',
    'taylor',
    'The degree-2 Taylor polynomial of f at a is:',
    ['f(a) + f′(a)(x−a) + f″(a)(x−a)²', 'f(a) + f′(a)(x−a) + f″(a)(x−a)² / 2', 'f″(a)/2', 'f(x) exactly'],
    'B',
    'T_2(x) = f(a) + f′(a)(x−a) + f″(a)(x−a)² / 2!. The 2! matters.',
    [
      'In general the n-th term is f^{(n)}(a)/n! · (x−a)^n.',
      'Forgetting n! is the most common Taylor-polynomial error.',
      'T_2 is the quadratic approximation; it equals f only for quadratics (or up to that degree).',
    ],
    'Missing /2! overstates the quadratic term. f″(a)/2 is only the coefficient, not the polynomial.'
  ),
  q(
    'TY06',
    'taylor',
    'A standard Lagrange remainder bound is |R_n(x)| ≤ :',
    ['|f(x)|', 'M |x−a|^{n+1} / (n+1)!   (M bound on |f^{(n+1)}|)', 'n!', '|x−a| only'],
    'B',
    'If |f^{(n+1)}| ≤ M on the interval between a and x, that inequality holds.',
    [
      'Used for “how many terms so the error is < 10^{−k}?”',
      'You pick a convenient M (e.g. e^x on [0,1] has M = e).',
      'Then solve M |x−a|^{n+1}/(n+1)! < tolerance.',
    ],
    'Not the function size itself. n! in the numerator would be backwards.'
  ),
  q(
    'TY07',
    'taylor',
    'The Maclaurin series for arctan x is:',
    ['Σ (−1)^n x^{2n+1} / (2n+1)   (|x| ≤ 1)', 'Σ x^{2n+1} / (2n+1)!', 'Σ (−1)^n x^{2n}', '1/(1+x²)'],
    'A',
    'Integrate the geometric series for 1/(1+x²). Valid on [−1, 1].',
    [
      '1/(1+x²) = Σ (−1)^n x^{2n} for |x| < 1.',
      'Integrate: arctan x = Σ (−1)^n x^{2n+1}/(2n+1).',
      'x = ±1 work (at x = 1 you get Leibniz: π/4 = 1 − 1/3 + 1/5 − …).',
    ],
    'Odd factorials would be a sine-like series. 1/(1+x²) is the derivative of arctan, not the series for arctan.'
  ),

  // ——— Parametric ———
  q(
    'PR01',
    'parametric',
    'If x = x(t), y = y(t), then dy/dx equals:',
    ['(d²y/dt²) / (d²x/dt²)', '(dy/dt) / (dx/dt)   (if dx/dt ≠ 0)', '(dx/dt) / (dy/dt)', 'y/x'],
    'B',
    'Chain rule: dy/dx = (dy/dt)·(dt/dx) = y′(t) / x′(t).',
    [
      'Horizontal tangent: y′ = 0 and x′ ≠ 0.',
      'Vertical tangent: x′ = 0 and y′ ≠ 0.',
      'If both vanish, you need a closer look (cusp / stop).',
    ],
    'Second derivatives over each other is not d²y/dx² either. y/x is the ray slope from the origin, not the tangent.'
  ),
  q(
    'PR02',
    'parametric',
    'd²y/dx² in parametric form is:',
    ['(d²y/dt²) / (d²x/dt²)', '[ d/dt (dy/dx) ] / (dx/dt)', 'd/dt (dy/dx)', 'y″(t)'],
    'B',
    'Differentiate dy/dx with respect to t, then divide by dx/dt again.',
    [
      'Let y′_x = (dy/dt)/(dx/dt). Then d²y/dx² = (d/dt y′_x) / (dx/dt).',
      'Writing y″/x″ is a famous wrong formula.',
      'Simplify y′_x before differentiating or the algebra explodes.',
    ],
    'y″(t) is acceleration in y, not concavity vs x. Forgetting the extra /x′ is the usual miss.'
  ),
  q(
    'PR03',
    'parametric',
    'Arc length of a parametric curve t ∈ [α, β] is:',
    ['∫ |y(t)| dt', '∫_α^β √( (dx/dt)² + (dy/dt)² ) dt', '∫ √(1+(dy/dx)²) dx only, never in t', 'x(β) − x(α)'],
    'B',
    'Speed times dt: ds = √(x′² + y′²) dt.',
    [
      'This is the same Pythagoras as ordinary arc length, written in t.',
      'It automatically handles vertical tangents that would break dy/dx.',
      'If the curve is traced twice, the integral double-counts length.',
    ],
    '∫|y| is not length. Converting to dx is optional, not required. x(β)−x(α) is net horizontal change.'
  ),
  q(
    'PR04',
    'parametric',
    'For x = cos t, y = sin t, dy/dx equals:',
    ['tan t', '−cot t', 'cot t', '−tan t'],
    'B',
    'y′ = cos t, x′ = −sin t, so dy/dx = cos t / (−sin t) = −cot t.',
    [
      'This is the unit circle traversed counterclockwise.',
      'Slope −cot t matches the tangent to the circle (perpendicular to the radius).',
      'At t = 0, x′ = 0, y′ = 1: vertical tangent at (1, 0).',
    ],
    'tan t is y/x (the radius), not the tangent slope. Missing the minus from x′ = −sin t is common.'
  ),
  q(
    'PR05',
    'parametric',
    'A horizontal tangent occurs where:',
    ['dx/dt = 0 and dy/dt ≠ 0', 'dy/dt = 0 and dx/dt ≠ 0', 'd²y/dx² = 0', 't = 0 only'],
    'B',
    'Slope 0 means numerator y′ = 0 while the denominator x′ is not zero.',
    [
      'If both derivatives vanish, do not automatically call it horizontal or vertical.',
      'Plug the t-values back to get (x, y) points — the exam wants points, not just t.',
      'Vertical is the opposite vanishing.',
    ],
    'dx/dt = 0 is vertical (usually). Inflection is not the same as horizontal tangent.'
  ),
  q(
    'PR06',
    'parametric',
    'If a particle has velocity ⟨x′(t), y′(t)⟩, its speed is:',
    ['x′ + y′', '√(x′² + y′²)', 'x′ y′', '|x′ − y′|'],
    'B',
    'Speed is the magnitude of velocity — the arc-length integrand.',
    [
      'Distance traveled from t = a to b is ∫_a^b speed dt.',
      'Displacement is the vector of net change, not the same as distance.',
      'This language shows up on applied parametric questions.',
    ],
    'You cannot add components for speed. The product is not a magnitude.'
  ),

  // ——— Polar ———
  q(
    'PO01',
    'polar',
    'The conversion from polar to Cartesian is:',
    ['x = r sin θ, y = r cos θ', 'x = r cos θ, y = r sin θ', 'x = θ cos r, y = θ sin r', 'r = x + y'],
    'B',
    'x = r cos θ, y = r sin θ. Also r² = x² + y² and tan θ = y/x (watch the quadrant).',
    [
      'Draw θ from the positive x-axis, r the signed radius.',
      'Negative r means go |r| in the opposite direction (θ+π).',
      'These two formulas plus r² = x²+y² convert equations either way.',
    ],
    'Swapping sin/cos is the classic mix-up. r is not x+y.'
  ),
  q(
    'PO02',
    'polar',
    'Area inside a polar curve from θ = α to θ = β is:',
    ['∫ r dθ', '(1/2) ∫_α^β [r(θ)]² dθ', '∫ 2π r ds', 'π r² always'],
    'B',
    'A pizza slice of radius r and angle dθ has area (1/2) r² dθ.',
    [
      'Limits must match the piece you want (one petal, inner loop, …).',
      'Find where r = 0 to get petal endpoints.',
      'Forgetting the 1/2 is the most common polar-area error.',
    ],
    '∫ r is not area. π r² is a full disk of constant r. 2π r ds is a surface fragment.'
  ),
  q(
    'PO03',
    'polar',
    'The cardioid r = a(1 − cos θ) is traced once for θ in:',
    ['[0, π]', '[0, 2π]', '[0, π/2]', '[0, 4π]'],
    'B',
    'Standard cardioid: a full 0 to 2π sweep. r = 0 at θ = 0 (dimple at the pole).',
    [
      'At θ = π, r = a(1 − (−1)) = 2a (the far point).',
      'Roses are the ones that may finish earlier (e.g. odd n in 0 to π).',
      'Sketching five or six θ-values prevents a doubled integral.',
    ],
    '[0, π] only gets the lower or upper half-ish, not the full cardioid. 4π double-traces.'
  ),
  q(
    'PO04',
    'polar',
    'r = a cos(2θ) is a rose with how many petals?',
    ['2', '4', '1', '8'],
    'B',
    'r = a cos(nθ) or sin(nθ): n petals if n is odd, 2n if n is even. Here n = 2 ⇒ 4 petals.',
    [
      'Odd n: 0 to π already draws every petal.',
      'Even n: need 0 to 2π.',
      'Petals of cos(nθ) sit on the axes differently than sin(nθ).',
    ],
    '2 would be if someone used n instead of 2n for even n. 8 is 2n with n wrongly 4.'
  ),
  q(
    'PO05',
    'polar',
    'Polar arc length uses the integrand:',
    ['r', '√(1 + (dr/dθ)²)', '√( r² + (dr/dθ)² )', 'r² / 2'],
    'C',
    'ds = √( r² + (dr/dθ)² ) dθ. (Compare to parametric with x = r cos θ, y = r sin θ.)',
    [
      'It is not √(1+(y′)²) unless you converted to Cartesian.',
      'r² / 2 is the area integrand, not length.',
      'If r is constant (a circle), length is ∫ |r| dθ = r Δθ, as expected.',
    ],
    '√(1+(r′)²) forgets the extra r². r²/2 is area.'
  ),
  q(
    'PO06',
    'polar',
    'A limaçon r = a + b cos θ has an inner loop when:',
    ['|a| = |b|', '|a| > |b|', '|a| < |b|', 'b = 0'],
    'C',
    '|a| < |b| inner loop; |a| = |b| cardioid; |a| > |b| dimpled or convex limaçon.',
    [
      'r can be zero for some θ precisely when |a| ≤ |b|.',
      'That extra zero is the loop (or the cardioid’s cusp).',
      'Know the three pictures — OSU exams love “identify the graph.”',
    ],
    '|a| = |b| is the cardioid. |a| > |b| has no inner loop. b = 0 is a circle.'
  ),
  q(
    'PO07',
    'polar',
    'To find θ-limits for one petal of r = 3 sin(3θ), solve:',
    ['r = 3', 'r = 0  (sin(3θ) = 0) and take adjacent roots that bound a positive petal', 'θ = 0 to 2π always', 'θ = 0 to π/2 always'],
    'B',
    'Petals start and end at the pole, where r = 0. Adjacent zeros of sin(3θ) bound one petal.',
    [
      'sin(3θ) = 0 ⇒ 3θ = kπ ⇒ θ = kπ/3.',
      'One petal is, for example, θ = 0 to π/3.',
      'Odd rose: full figure is 0 to π, not 0 to 2π (that would double).',
    ],
    'r = 3 is the tip, not the endpoint of the petal. Blind 0 to 2π double-counts an odd rose.'
  ),
];

const combined = [...all, ...extraExam1, ...extraExam2, ...extraExam3];

const banner = `/**
 * Calculus II Semester Study Buddy — MCQ bank
 * Generated by scripts/gen-questions.mjs — edit that file (and scripts/bank/) and re-run.
 * answer is "A"|"B"|"C"|"D". topics match js/topics.js ids.
 * Target: 75 per midterm, 225 comprehensive final.
 */
window.CALC2_QUESTIONS = `;

writeFileSync(outPath, banner + JSON.stringify(combined, null, 2) + ';\n', 'utf8');
const by = {};
for (const qn of combined) {
  const t = qn.topics[0];
  by[t] = (by[t] || 0) + 1;
}
console.log('Wrote', combined.length, 'questions to', outPath);
console.log(by);
