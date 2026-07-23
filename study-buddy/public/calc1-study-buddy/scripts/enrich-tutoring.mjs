/** Enrich CALC1_QUESTIONS with tutoring.steps + whyNotOthers. Run: node scripts/enrich-tutoring.mjs */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const qPath = join(root, 'js', 'questions.js');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(qPath, 'utf8'), ctx);
const Q = ctx.window.CALC1_QUESTIONS;

const EXTRA = {
  L01: {
    steps: [
      'Plug-in first: (4-4)/(2-2)=0/0 — indeterminate, so algebra is required.',
      'Factor numerator: x^2-4=(x-2)(x+2). Cancel (x-2) for x!=2 to get x+2.',
      'Now lim(x->2)(x+2)=4. A hole at x=2 does not stop the limit from existing.',
    ],
    whyNotOthers:
      '0 would be if the simplified limit were 0; "undefined" confuses the limit with the original function value at 2; 2 is a distractor from the canceled factor.',
  },
  L02: {
    steps: [
      'Standard Calc I limit (radians): lim(x->0) sin(x)/x = 1.',
      'sin(0)/0 looks like 0/0 if you only plug in — the ratio still approaches 1.',
      'Check: sin(0.1)/0.1 is about 0.998, very close to 1.',
    ],
    whyNotOthers: '0 is only sin(0); infinity is wrong growth; DNE needs left/right disagreement.',
  },
  L03: {
    steps: [
      'At infinity, compare leading terms: 3x^2 / x^2 = 3.',
      'Divide top and bottom by x^2: (3+1/x^2)/(1-5/x^2) -> 3.',
      'Equal degree => limit is ratio of leading coefficients.',
    ],
    whyNotOthers: '0 if denom degree higher; infinity if num degree higher; 1 if leading coeffs were equal 1/1.',
  },
  L04: {
    steps: [
      'x->0+: x is a tiny positive number, so 1/x is a huge positive number (+infinity).',
      'We say the limit diverges to +infinity (not a finite number).',
    ],
    whyNotOthers: '-infinity is the left-hand behavior; 0 and 1 are finite and wrong here.',
  },
  L05: {
    steps: ['x->0-: x is tiny negative, so 1/x -> -infinity.'],
    whyNotOthers: '+infinity is the right-hand limit; finite answers ignore the blow-up.',
  },
  L06: {
    steps: [
      'If lim f = L and lim g = M (both finite), then lim(f+g)=L+M.',
      'Both limits must exist as real numbers for this sum rule.',
    ],
    whyNotOthers: 'Product/quotient have different rules; L-M would be a difference.',
  },
  L07: {
    steps: [
      'Continuous at a means: f(a) defined, lim(x->a)f exists, and lim = f(a).',
      'Fail any one piece and the function is discontinuous at a.',
    ],
    whyNotOthers: 'Defined alone or limit alone is not enough; differentiability is stronger than continuity.',
  },
  L08: {
    steps: [
      'At x=3 you get 0/0. Factor x^2-9=(x-3)(x+3), cancel, get 1/(x+3).',
      'Limit as x->3 is 1/6.',
    ],
    whyNotOthers: 'DNE confuses removable discontinuity with no limit; 0 is only the unsimplified numerator.',
  },
  L09: {
    steps: [
      'Indeterminate means the form does not yet decide the limit (classic: 0/0, infinity/infinity).',
      'Nonzero/0 is infinite-type behavior, not the indeterminate form 0/0.',
    ],
    whyNotOthers: '0/5 is simply 0; constants are fine; 5/0 is not called 0/0.',
  },
  L10: {
    steps: ['e^(-x)=1/e^x. As x->infinity, e^x->infinity, so e^(-x)->0.'],
    whyNotOthers: 'infinity confuses e^x with e^(-x); 1 is e^0.',
  },
  L11: {
    steps: [
      'Standard result: lim(x->0)(1-cos x)/x^2 = 1/2.',
      'Use 1-cos x = 2 sin^2(x/2), or L\'Hopital twice if your course allows.',
    ],
    whyNotOthers: '1 is lim sinx/x; 0 underestimates the order of the numerator.',
  },
  L12: {
    steps: [
      'Two-sided limit exists only if left and right limits exist and are equal.',
      '5 != 7, so lim(x->2) does not exist.',
    ],
    whyNotOthers: 'You cannot average one-sided limits (6) to force a two-sided limit.',
  },
  L13: {
    steps: [
      '0/0 form. Multiply by conjugate sqrt(1+x)+1.',
      'Numerator becomes x; cancel x (x!=0): 1/(sqrt(1+x)+1) -> 1/2.',
    ],
    whyNotOthers: '1 would drop the +1 in the conjugate denominator.',
  },
  L14: {
    steps: [
      'Vertical asymptote: as x approaches a finite a, f(x)-> +/- infinity.',
      'Often at denominator zeros that do not cancel with the numerator.',
    ],
    whyNotOthers: 'f\'=0 is a horizontal tangent idea, not a VA; continuity is the opposite idea.',
  },
  D01: {
    steps: [
      'Definition: f\'(a)=lim(h->0)[f(a+h)-f(a)]/h when that limit exists.',
      'The fraction is a secant slope; h->0 makes it the tangent slope.',
    ],
    whyNotOthers: 'f(a+h)-f(a) is only a rise, not a rate; integrals accumulate, they do not define f\'.',
  },
  D02: {
    steps: ['Secant slopes approach the tangent slope; that limit is f\'(a).'],
    whyNotOthers: 'A secant uses two points; the derivative is the instantaneous tangent slope.',
  },
  D03: {
    steps: [
      'Theorem: differentiable at a implies continuous at a.',
      'Idea: finite difference quotient limit forces f(a+h)-f(a)->0.',
    ],
    whyNotOthers: 'Continuous does not imply differentiable (example: |x| at 0).',
  },
  D04: {
    steps: [
      '|x| is continuous everywhere (no jump).',
      'At 0, left derivative -1 and right derivative +1 disagree, so not differentiable.',
    ],
    whyNotOthers: 'It is continuous; there is no smooth f\'=0 at the corner.',
  },
  D05: {
    steps: ['Units of dy/dx are (units of y)/(units of x). Meters per second is a rate.'],
    whyNotOthers: 'm*s is not a rate; s/m is an inverse rate.',
  },
  D06: {
    steps: [
      'Tangent line: point (a,f(a)), slope f\'(a).',
      'Point-slope: y - f(a) = f\'(a)(x - a).',
    ],
    whyNotOthers: 'y=f\'(a) is only a horizontal line with that slope through the origin-ish form — not the general tangent.',
  },
  D07: {
    steps: ['If f\'>0 on an interval, slopes are positive, so f is increasing there.'],
    whyNotOthers: 'f\'<0 decreases; f\'=0 everywhere implies constant on an interval.',
  },
  D08: {
    steps: [
      'Critical numbers: f\'(c)=0 or f\' DNE (c in domain).',
      'They are candidates for extrema — not automatic max/min.',
    ],
    whyNotOthers: 'x^3 at 0 has f\'=0 but is not a local max or min.',
  },
  D09: {
    steps: [
      'Average rate on [a,b] = secant slope = [f(b)-f(a)]/(b-a).',
      'Instantaneous rate is the derivative (limit of average rates).',
    ],
    whyNotOthers: 'f\'(a) is instantaneous at a single point, not the average over [a,b].',
  },
  D10: {
    steps: [
      'f(3+h)=(3+h)^2=9+6h+h^2. Difference 6h+h^2. Divide by h: 6+h -> 6.',
      'Power rule check: 2x at x=3 is also 6.',
    ],
    whyNotOthers: '9 is f(3); 3 is the input, not the derivative.',
  },
  R01: {
    steps: [
      'Power rule: multiply by the old exponent, then reduce the exponent by 1.',
      'Always differentiate, then (for integrals) reverse — do not mix the two rules.',
    ],
    whyNotOthers: 'x^(n+1)/(n+1) is the integral power rule, not the derivative.',
  },
  R02: {
    steps: ['In radians, d/dx sin x = cos x.'],
    whyNotOthers: '-sin and -cos belong to other standard derivatives.',
  },
  R03: {
    steps: ['d/dx cos x = -sin x. Watch the sign.'],
    whyNotOthers: 'Writing +sin x is the classic cos-derivative error.',
  },
  R04: {
    steps: ['e^x is its own derivative — unique and heavily tested.'],
    whyNotOthers: 'Power-rule shapes like x e^(x-1) do not apply to base-e exponential.',
  },
  R05: {
    steps: ['d/dx ln x = 1/x for x>0 (more generally ln|x|).'],
    whyNotOthers: 'ln x is not self-derivative; e^x is.',
  },
  R06: {
    steps: [
      'Product: (uv)\' = u\'v + uv\'.',
      'Say it: first times d(second) plus second times d(first).',
    ],
    whyNotOthers: 'u\'v\' is not the product rule.',
  },
  R07: {
    steps: [
      'Quotient: (u/v)\' = (u\'v - uv\') / v^2.',
      'The middle sign is minus — memorize with a phrase you like.',
    ],
    whyNotOthers: 'A plus sign in the numerator is a very common wrong answer.',
  },
  R08: {
    steps: [
      'Chain rule: derivative of outside (leave inside alone) times derivative of inside.',
    ],
    whyNotOthers: 'Forgetting to multiply by g\'(x) is the #1 chain-rule mistake.',
  },
  R09: {
    steps: [
      'Outside: 5(3x+1)^4. Inside derivative: 3. Multiply: 15(3x+1)^4.',
    ],
    whyNotOthers: '5(3x+1)^4 alone forgot the chain factor 3.',
  },
  R10: {
    steps: ['u=x, v=sin x => sin x + x cos x.'],
    whyNotOthers: 'x cos x alone forgot the first term of the product rule.',
  },
  R11: {
    steps: ['d/dx tan x = sec^2 x.'],
    whyNotOthers: 'sec x alone is incomplete; csc^2 is for -cot.',
  },
  R12: {
    steps: ['sqrt(x)=x^(1/2) => (1/2)x^(-1/2)=1/(2 sqrt(x)).'],
    whyNotOthers: '2 sqrt(x) is related to integrating sqrt, not this derivative.',
  },
  R13: {
    steps: [
      'ln(3x)=ln 3 + ln x, derivative 1/x. Or chain: (1/(3x))*3 = 1/x.',
    ],
    whyNotOthers: '1/(3x) forgot to multiply by the chain-rule 3.',
  },
  R14: {
    steps: ['d/dx e^(2x) = e^(2x)*2 = 2e^(2x).'],
    whyNotOthers: 'e^(2x) alone forgot the factor 2.',
  },
  R15: {
    steps: ['Outer cos, inner x^2: -sin(x^2)*2x = -2x sin(x^2).'],
    whyNotOthers: '-sin(x^2) forgot *2x; -sin(2x) used a wrong simplification.',
  },
  R16: {
    steps: ['First derivative 3x^2; second derivative 6x.'],
    whyNotOthers: '3x^2 is only the first derivative.',
  },
  A01: {
    steps: [
      'Continuous on [a,b] => absolute max/min exist.',
      'Check critical points in (a,b) AND both endpoints; compare f values.',
    ],
    whyNotOthers: 'Skipping endpoints loses many absolute extrema on closed intervals.',
  },
  A02: {
    steps: ['First-derivative test: f\' changes + to - => local maximum.'],
    whyNotOthers: 'Change - to + is a local minimum.',
  },
  A03: {
    steps: [
      'If f\'(c)=0 and f\'\'(c)>0, graph is concave up => local min.',
    ],
    whyNotOthers: 'f\'\'<0 => local max; f\'\'=0 is inconclusive.',
  },
  A04: {
    steps: [
      'Related rates: equation from geometry/physics, differentiate both sides w.r.t. time t.',
      'Plug in known values only AFTER differentiating.',
    ],
    whyNotOthers: 'Integrals accumulate; they are not the first tool for related rates.',
  },
  A05: {
    steps: [
      'Linearization / tangent approximation: L(x)=f(a)+f\'(a)(x-a).',
    ],
    whyNotOthers: 'f\'(a) is only the slope number, not the approximating line function.',
  },
  A06: {
    steps: [
      'MVT: some c in (a,b) has f\'(c) equal to average rate [f(b)-f(a)]/(b-a).',
    ],
    whyNotOthers: 'f\'(c)=0 is Rolle when f(a)=f(b), a special case of MVT.',
  },
  A07: {
    steps: [
      'Inflection point: concavity changes (typically f\'\' changes sign).',
    ],
    whyNotOthers: 'f\'=0 is horizontal tangent, not automatically an inflection.',
  },
  A08: {
    steps: [
      'Horizontal asymptote y=L means f(x)->L as x-> +/- infinity (one or both ends).',
    ],
    whyNotOthers: 'Vertical asymptotes are finite x where f blows up.',
  },
  A09: {
    steps: [
      'Use constraints to get a single-variable function, note domain, then f\'=0 / endpoints.',
    ],
    whyNotOthers: 'Integrating first is for accumulation, not the standard max/min setup.',
  },
  A10: {
    steps: ['Velocity is the time-derivative of position: v = s\'.'],
    whyNotOthers: 's\'\' is acceleration.',
  },
  A11: {
    steps: ['Acceleration a = v\' = s\'\'.'],
    whyNotOthers: 's\' is only velocity.',
  },
  A12: {
    steps: [
      'Newton iteration: x_{n+1} = x_n - f(x_n)/f\'(x_n) (follow the tangent to the root).',
    ],
    whyNotOthers: 'Missing the minus or the update structure is incomplete.',
  },
  A13: {
    steps: [
      'Ladder constraint x^2 + y^2 = L^2. Differentiate: 2x x\' + 2y y\' = 0.',
      'Solve for the unknown rate using known values.',
    ],
    whyNotOthers: 'You need the full Pythagorean relationship, not a single variable alone.',
  },
  A14: {
    steps: ['If f\'=0 for all x on an interval, then f is constant on that interval.'],
    whyNotOthers: 'Increasing requires f\'>0 (not zero).',
  },
  I01: {
    steps: [
      'Integral power rule: raise exponent by 1, divide by the new exponent, add +C (n != -1).',
      'Always differentiate your answer to check.',
    ],
    whyNotOthers: 'n x^(n-1) is the derivative power rule — opposite direction.',
  },
  I02: {
    steps: [
      'The case n=-1: integral of 1/x is ln|x| + C.',
    ],
    whyNotOthers: 'x^2/2 is the integral of x, not 1/x.',
  },
  I03: {
    steps: ['Integral of e^x is e^x + C.'],
    whyNotOthers: 'No extra polynomial factor without a more advanced technique.',
  },
  I04: {
    steps: ['Because d/dx sin x = cos x, integral of cos x is sin x + C.'],
    whyNotOthers: '-sin is the derivative of cos, not the integral of cos.',
  },
  I05: {
    steps: [
      'd/dx (-cos x) = sin x, so integral of sin x is -cos x + C.',
      'Sign errors here are extremely common on finals.',
    ],
    whyNotOthers: 'Forgetting the minus is the usual wrong answer.',
  },
  I06: {
    steps: [
      'FTC part 1: d/dx of integral from a to x of f(t) dt equals f(x) when f is continuous.',
    ],
    whyNotOthers: 'f(a) is constant; F(x)-F(a) is the integral value, not this derivative.',
  },
  I07: {
    steps: [
      'FTC part 2: if F\'=f, then integral from a to b of f is F(b)-F(a).',
    ],
    whyNotOthers: 'f(b)-f(a) is not generally the integral of f.',
  },
  I08: {
    steps: [
      'Antiderivative of 2x is x^2. Evaluate from 0 to 1: 1-0=1.',
    ],
    whyNotOthers: '2 would mean you forgot to integrate properly.',
  },
  I09: {
    steps: [
      'Average value on [a,b] is (1/(b-a)) * definite integral of f on [a,b].',
    ],
    whyNotOthers: 'The bare integral is net area, not average height.',
  },
  I10: {
    steps: [
      'Integrate term by term: integral (3x^2+2) dx = x^3 + 2x + C.',
      'Differentiate: 3x^2+2 checks out.',
    ],
    whyNotOthers: 'Always differentiate to catch coefficient errors.',
  },
  I11: {
    steps: ['Linearity: integral(f-g)=integral f - integral g = 5-2=3.'],
    whyNotOthers: 'Adding the integrals would give 7, not the difference.',
  },
  I12: {
    steps: [
      'Definite integral measures net signed area (above axis +, below -).',
    ],
    whyNotOthers: 'It is not "only a derivative."',
  },
  I13: {
    steps: ['Because d/dx tan x = sec^2 x, integral of sec^2 x is tan x + C.'],
    whyNotOthers: 'sec tan is the derivative of sec, not this integral.',
  },
  I14: {
    steps: ['By FTC, integral_1^4 f = F(4)-F(1) when F\'=f.'],
    whyNotOthers: 'A ratio F(4)/F(1) has no meaning here.',
  },
  U01: {
    steps: [
      'Inside of cos is x^2; its derivative 2x multiplies outside — set u=x^2.',
    ],
    whyNotOthers: 'u=2x is the derivative factor, not the composite inside.',
  },
  U02: {
    steps: [
      'u=3x, du=3 dx, so dx=du/3 => (1/3) integral e^u du = (1/3)e^(3x)+C.',
    ],
    whyNotOthers: 'Forgetting the 1/3 is the reverse-chain-rule error.',
  },
  U03: {
    steps: [
      'u=2x+1, du=2 dx matches the factor 2 => integral u^5 du = u^6/6 + C.',
    ],
    whyNotOthers: 'Dividing by 5 alone forgets the +1 in the power rule for antiderivatives.',
  },
  U04: {
    steps: [
      'u=sin x works with du=cos x dx; u=cos x works with a minus sign.',
    ],
    whyNotOthers: 'A random u=x does not simplify sin(x)cos(x).',
  },
  U05: {
    steps: [
      'u=x^2+1, du=2x dx. When x goes 0->1, u goes 1->2.',
      'integral_1^2 u^3 du = [u^4/4]_1^2 = 4 - 1/4 = 15/4.',
    ],
    whyNotOthers: 'Using x-limits while the integrand is in u is inconsistent.',
  },
  U06: {
    steps: [
      'Either convert limits to u-limits, or return the antiderivative to x before using original limits.',
    ],
    whyNotOthers: 'Never leave an integral written in u with x-limits still attached.',
  },
  U07: {
    steps: [
      'u=2x+5, du=2 dx => (1/2) integral du/u = (1/2)ln|2x+5|+C.',
    ],
    whyNotOthers: 'ln|2x+5| without 1/2 forgot du=2 dx.',
  },
  U08: {
    steps: [
      'u=x^2, du=2x dx => (1/2) integral e^u du = (1/2)e^(x^2)+C.',
    ],
    whyNotOthers: 'e^(x^2) without 1/2 is incomplete.',
  },
  U09: {
    steps: ['u=5x, du=5 dx => (1/5)sin(5x)+C.'],
    whyNotOthers: 'sin(5x) without 1/5 forgot the chain reverse factor.',
  },
  U10: {
    steps: [
      'u-sub is for a composite piece whose derivative (almost) multiplies the rest of the integrand.',
    ],
    whyNotOthers: 'Not every integral needs u-sub — plain power rule often works.',
  },
  V01: {
    steps: [
      'Area between curves: integrate (top function minus bottom function) over the right interval.',
    ],
    whyNotOthers: 'Adding the functions is not the area between them.',
  },
  V02: {
    steps: [
      'Disk method: cross-section is a disk with area pi R^2; integrate along the axis.',
    ],
    whyNotOthers: 'Missing pi or forgetting to square R loses most of the credit.',
  },
  V03: {
    steps: [
      'Washer: outer disk minus inner hole => pi(R_out^2 - R_in^2).',
    ],
    whyNotOthers: 'Subtracting radii without squaring each radius is wrong.',
  },
  V04: {
    steps: [
      'integral_0^1 x dx = [x^2/2]_0^1 = 1/2 (triangle under y=x).',
    ],
    whyNotOthers: '1 would be the area of the unit square, not under y=x.',
  },
  V05: {
    steps: [
      'Where f is below the axis, f is negative, so the integral contribution is negative (signed area).',
    ],
    whyNotOthers: 'Total geometric area would use absolute value; net area keeps signs.',
  },
  V06: {
    steps: [
      'Find intersections f=g to get limits of integration (or split where top/bottom swaps).',
    ],
    whyNotOthers: 'Derivatives alone do not give the bounds between two curves.',
  },
  V07: {
    steps: [
      'Cylindrical shells about the y-axis often look like integral 2 pi x f(x) dx (when taught).',
    ],
    whyNotOthers: 'pi [f(x)]^2 is the disk formula for a different setup.',
  },
  V08: {
    steps: [
      'Equal positive and negative signed areas cancel, so the net integral can be 0.',
    ],
    whyNotOthers: 'Total area of the regions would still be positive.',
  },
  C01: {
    steps: [
      'Derivative = instantaneous rate of change = slope of the tangent line.',
    ],
    whyNotOthers: 'Accumulated area is the integral\'s main story, not the derivative\'s.',
  },
  C02: {
    steps: [
      'A definite integral measures accumulated net change / net signed area.',
    ],
    whyNotOthers: 'Critical points come from derivatives, not from the integral alone.',
  },
  C03: {
    steps: [
      'By definition, if F is an antiderivative of f, then F\' = f.',
    ],
    whyNotOthers: 'The integral symbol denotes a family of antiderivatives (+C), not F\' itself.',
  },
  C04: {
    steps: [
      'Compositions f(g(x)) need the chain rule; products need product rule; quotients need quotient rule.',
    ],
    whyNotOthers: 'Sums can be differentiated term-by-term without chain rule.',
  },
  C05: {
    steps: [
      'L\'Hopital (if allowed in your course): for 0/0 or infinity/infinity forms, lim f/g may equal lim f\'/g\' under conditions.',
    ],
    whyNotOthers: 'It is not a free pass on every limit without checking the indeterminate form.',
  },
  C06: {
    steps: [
      'If positive direction is right, then v<0 means the particle moves left.',
    ],
    whyNotOthers: 'Sign of velocity is direction of motion, not "always right."',
  },
  C07: {
    steps: [
      'Continuity is weaker than differentiability. Corners can be continuous but not differentiable.',
    ],
    whyNotOthers: 'Differentiability implies continuity, not the reverse.',
  },
  C08: {
    steps: [
      '+C appears because any constant shift of an antiderivative is still an antiderivative.',
    ],
    whyNotOthers: 'In definite integrals, constants cancel in F(b)-F(a).',
  },
  C09: {
    steps: [
      'Where f\'=0 (and f\' exists), the tangent line is horizontal.',
    ],
    whyNotOthers: 'Vertical tangents are infinite-slope cases, not f\'=0.',
  },
  C10: {
    steps: [
      'Integral from a to a has zero width, so its value is 0.',
    ],
    whyNotOthers: 'f(a) is a function value (height), not an integral over no interval.',
  },
  C11: {
    steps: [
      'If two functions have the same derivative on an interval, they differ by a constant on that interval.',
    ],
    whyNotOthers: 'They need not be identical — only parallel by a vertical shift.',
  },
  C12: {
    steps: [
      'Word problems: draw, define variables, write a formula, use calculus, check the domain.',
    ],
    whyNotOthers: 'Jumping straight into a random rule without a model wastes time on exams.',
  },
};

function generic(q) {
  const ans = q.choices[q.answer.charCodeAt(0) - 65];
  return {
    steps: [
      `Correct selection: ${q.answer} — "${ans}".`,
      `Core reason: ${q.explanation}`,
      'Say the reason out loud in one sentence, then change the numbers and retry a similar problem in the workshop.',
    ],
    whyNotOthers:
      'Cross out options that mix derivative vs integral, left vs right limits, or forget a chain-rule factor. If you hit one of those traps, write a sticky note for exam week.',
  };
}

const out = Q.map((q) => {
  // If already enriched with long tutoring, still refresh from EXTRA when present
  const baseExplain = String(q.explanation || '').split(' Plug-in first:')[0].split(' Standard Calc')[0];
  // Prefer original short if we detect previous enrichment — use first sentence-ish
  let short = q.explanation || '';
  if (short.length > 180 && !EXTRA[q.id]) {
    short = short.slice(0, 160) + '…';
  }
  // For EXTRA items, keep a clean short lead-in from original first line of old short explanations
  const lead = (q._short || short).split(/(?<=\.)\s+/)[0] || short;

  const extra = EXTRA[q.id] || generic({ ...q, explanation: lead });
  const longExplanation = [lead, ...extra.steps].filter(Boolean).join(' ');

  return {
    id: q.id,
    topics: q.topics,
    stem: q.stem,
    choices: q.choices,
    answer: q.answer,
    explanation: longExplanation,
    tutoring: {
      steps: extra.steps,
      whyNotOthers: extra.whyNotOthers,
    },
  };
});

const header = `/**
 * Calculus I Final Study Buddy — MCQ bank (${out.length} questions)
 * Detailed tutoring.steps + whyNotOthers for coach-style feedback.
 * answer is "A"|"B"|"C"|"D". topics match js/topics.js ids.
 */
window.CALC1_QUESTIONS = `;

writeFileSync(qPath, header + JSON.stringify(out, null, 2) + ';\n');
console.log('Enriched', out.length, 'MCQs');
