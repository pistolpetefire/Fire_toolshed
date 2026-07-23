/** Enrich CALC1_MATH with longer solutions, commonMistakes, whyItWorks */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'js', 'math-problems.js');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(path, 'utf8'), ctx);
const M = ctx.window.CALC1_MATH;

const enrich = {
  'mw-L1': {
    commonMistakes: [
      'Calling the limit undefined because the original expression is undefined at x=4.',
      'Canceling (x-4) then refusing to plug x=4 into the simplified function.',
    ],
    whyItWorks:
      'Limits care about nearby values, not a single missing point. After canceling, the simplified function matches the original wherever both exist, so their limits agree.',
    solution: [
      'Goal: evaluate lim(x->4) (x^2-16)/(x-4).',
      'Direct plug-in gives 0/0 — indeterminate, not automatic DNE.',
      'Factor: x^2-16=(x-4)(x+4).',
      'For x!=4 cancel (x-4) to get x+4.',
      'lim(x->4)(x+4)=8. The graph has a hole at x=4 but approaches height 8.',
    ],
  },
  'mw-L2': {
    commonMistakes: [
      'Treating infinity like a number without leading-term analysis.',
      'Dividing by the wrong power of x.',
    ],
    whyItWorks:
      'For large |x|, highest-power terms dominate. Equal degrees => limit is the ratio of leading coefficients.',
    solution: [
      'Degrees of numerator and denominator are both 3.',
      'Divide every term by x^3: (5-2/x^2)/(2+7/x^3).',
      'As x->inf those fractions vanish => 5/2.',
      'Shortcut: leading terms 5x^3/2x^3=5/2.',
    ],
  },
  'mw-L3': {
    commonMistakes: [
      'Only checking f(1) and declaring continuous.',
      'Averaging left and right limits.',
    ],
    whyItWorks:
      'Continuity at a point needs left limit = right limit = function value. If one-sided limits disagree, the two-sided limit does not exist.',
    solution: [
      'From the left (x<1): f(x)=x^2 -> 1 as x->1-.',
      'From the right (x>=1): f(x)=3-x -> 2 as x->1+.',
      'f(1)=3-1=2.',
      'Left limit 1 != right limit 2 => not continuous at x=1.',
    ],
  },
  'mw-D1': {
    commonMistakes: [
      'Setting h=0 before simplifying the difference quotient.',
      'Expanding (x+h)^2 as x^2+h^2 (missing 2xh).',
    ],
    whyItWorks:
      'The definition is the limit of average rates of change as the interval shrinks — that limiting slope is f\'(x).',
    solution: [
      'f\'(x)=lim(h->0)[f(x+h)-f(x)]/h with f(x)=x^2+3x.',
      'f(x+h)=(x+h)^2+3(x+h)=x^2+2xh+h^2+3x+3h.',
      'Difference: 2xh+h^2+3h. Divide by h: 2x+h+3.',
      'h->0 => f\'(x)=2x+3. Power-rule check matches.',
    ],
  },
  'mw-D2': {
    commonMistakes: ['Using slope f(2)=8 instead of f\'(2).', 'Point-slope sign errors.'],
    whyItWorks: 'Tangent line uses the point on the curve and the derivative as slope.',
    solution: [
      'y=x^3 => y\'=3x^2. At x=2, slope m=12. Point (2,8).',
      'y-8=12(x-2) => y=12x-16.',
    ],
  },
  'mw-R1': {
    commonMistakes: ['Only differentiating one factor (product rule incomplete).'],
    whyItWorks: 'Product rule: derivative of first times second plus first times derivative of second.',
    solution: [
      'u=x^2, v=sin x => u\'=2x, v\'=cos x.',
      'y\'=2x sin x + x^2 cos x.',
    ],
  },
  'mw-R2': {
    commonMistakes: ['Plus sign instead of minus in the quotient rule numerator.'],
    whyItWorks: 'Quotient rule (u/v)\'=(u\'v-uv\')/v^2 — middle sign is minus.',
    solution: [
      'u=x^2+1, u\'=2x; v=x-3, v\'=1.',
      'y\'=[2x(x-3)-(x^2+1)]/(x-3)^2=(x^2-6x-1)/(x-3)^2.',
    ],
  },
  'mw-R3': {
    commonMistakes: ['Forgetting the chain-rule factor from the inside derivative.'],
    whyItWorks: 'Chain rule: n[g(x)]^(n-1)*g\'(x). Here g=3x^2-5, g\'=6x.',
    solution: [
      'Outer power 4, inside 3x^2-5.',
      'y\'=4(3x^2-5)^3*(6x)=24x(3x^2-5)^3.',
    ],
  },
  'mw-R4': {
    commonMistakes: ['Forgetting to multiply by 5 from the chain rule.'],
    whyItWorks: 'd/dx cos(u)=-sin(u)*u\' with u=5x.',
    solution: ['y\'=-sin(5x)*5=-5 sin(5x).'],
  },
  'mw-R5': {
    commonMistakes: ['Writing 1/(3x) for d/dx ln(2x) or forgetting the chain on e^(3x).'],
    whyItWorks: 'e^(3x) chains a factor 3; ln(2x)=ln2+ln x has derivative 1/x.',
    solution: [
      'd/dx e^(3x)=3e^(3x).',
      'd/dx ln(2x)=1/x.',
      'y\'=3e^(3x)+1/x.',
    ],
  },
  'mw-A1': {
    commonMistakes: ['Plugging r=5 before differentiating.', 'Forgetting the 2 in 2 pi r r\'.'],
    whyItWorks: 'A and r both change with time; differentiating the formula links their rates.',
    solution: [
      'A=pi r^2. Differentiate w.r.t. t: dA/dt=2 pi r dr/dt.',
      'At r=5, dr/dt=2: dA/dt=20 pi cm^2/s.',
      'Units: cm*(cm/s)=cm^2/s, correct for area rate.',
    ],
  },
  'mw-A2': {
    commonMistakes: ['Forgetting the domain 0<=x<=sqrt(12).', 'Maximizing width instead of area.'],
    whyItWorks: 'Express area as a single-variable function, then use A\'=0 and compare endpoints.',
    solution: [
      'Vertices (+/-x, 12-x^2): width 2x, height 12-x^2, A=2x(12-x^2)=24x-2x^3.',
      'A\'=24-6x^2=0 => x^2=4 => x=2 (in domain). Width=4.',
      'Endpoints give A=0, so max at x=2.',
    ],
  },
  'mw-A3': {
    commonMistakes: ['Calling every critical point a max.', 'Sign chart errors for f\'.'],
    whyItWorks: 'First-derivative test uses sign changes of f\' around critical numbers.',
    solution: [
      'f\'=3x^2-3=3(x-1)(x+1). Critical points x=+/-1.',
      'Sign of f\': + on (-inf,-1), - on (-1,1), + on (1,inf).',
      'Local max at x=-1 (f=2); local min at x=1 (f=-2).',
    ],
  },
  'mw-A4': {
    commonMistakes: ['Using f(4.1) without linearization.', 'Wrong f\' for sqrt.'],
    whyItWorks: 'Near a known point, the tangent line is the best linear approximation.',
    solution: [
      'f(x)=sqrt(x), a=4, f(4)=2, f\'=1/(2sqrt(x)), f\'(4)=1/4.',
      'L(x)=2+(1/4)(x-4). L(4.1)=2.025.',
    ],
  },
  'mw-I1': {
    commonMistakes: ['Forgetting +C.', 'Wrong coefficients when integrating polynomials.'],
    whyItWorks: 'Integrate term by term; differentiate the answer to check.',
    solution: [
      'int 6x^2 dx = 2x^3, int -4x dx = -2x^2, int 5 dx = 5x.',
      'Answer: 2x^3 - 2x^2 + 5x + C. Check by differentiating.',
    ],
  },
  'mw-I2': {
    commonMistakes: ['Integral of sin as +cos.', 'cos(pi) treated as +1.'],
    whyItWorks: 'FTC evaluates an antiderivative at endpoints. d/dx(-cos x)=sin x.',
    solution: [
      'Antiderivative of sin x is -cos x.',
      '[-cos x]_0^pi = (-cos pi)-(-cos 0)=1+1=2.',
      'One arch of sine from 0 to pi has area 2.',
    ],
  },
  'mw-I3': {
    commonMistakes: ['Trying to evaluate the integral fully instead of using FTC1.'],
    whyItWorks: 'FTC part 1: d/dx int_a^x f(t)dt = f(x).',
    solution: ['g\'(x)=sqrt(x^3+1) by FTC1 (continuous integrand).'],
  },
  'mw-I4': {
    commonMistakes: ['Forgetting to divide by (b-a).'],
    whyItWorks: 'Average value is (1/(b-a)) times the definite integral.',
    solution: [
      '(1/2) int_0^2 3x^2 dx = (1/2)[x^3]_0^2 = 4.',
    ],
  },
  'mw-U1': {
    commonMistakes: ['u=3x^2 without matching du.', 'Forgetting /5 after integrating u^4.'],
    whyItWorks: 'u=x^3+1 makes du=3x^2 dx match the factor in front.',
    solution: [
      'u=x^3+1, du=3x^2 dx.',
      'int u^4 du = u^5/5 + C = (x^3+1)^5/5 + C.',
    ],
  },
  'mw-U2': {
    commonMistakes: ['Keeping x-limits after switching to u.', 'Missing the e^u antiderivative evaluation.'],
    whyItWorks: '2x dx is du when u=x^2, converting the integral to a pure exponential.',
    solution: [
      'u=x^2, du=2x dx. Limits: x=0->u=0, x=1->u=1.',
      'int_0^1 e^u du = e-1.',
    ],
  },
  'mw-U3': {
    commonMistakes: ['Writing sin(2x) without the 1/2 factor.'],
    whyItWorks: 'Chain rule reverse: u=2x brings a factor 1/2.',
    solution: ['u=2x, du=2 dx => (1/2)int cos u du = (1/2)sin(2x)+C.'],
  },
  'mw-V1': {
    commonMistakes: ['Integrating bottom-top.', 'Wrong intersection limits.'],
    whyItWorks: 'Area = int (upper-lower) between intersection points.',
    solution: [
      'Intersections: x=x^2 => x=0,1. On [0,1], y=x is above y=x^2.',
      'int_0^1 (x-x^2)dx = 1/2 - 1/3 = 1/6.',
    ],
  },
  'mw-V2': {
    commonMistakes: ['Forgetting pi or the square on radius.'],
    whyItWorks: 'Disk method: V=int pi [R(x)]^2 dx with R=sqrt(x).',
    solution: [
      'R(x)=sqrt(x), so pi int_0^4 x dx = pi [x^2/2]_0^4 = 8pi.',
    ],
  },
  'mw-C1': {
    commonMistakes: ['Using 4 sides of fencing against the barn.', 'Ignoring domain 0<x<20.'],
    whyItWorks: 'Constraint reduces area to one variable; calculus finds the max on the domain.',
    solution: [
      'Depth x, length along barn y, 2x+y=40 => y=40-2x.',
      'A=x(40-2x)=40x-2x^2. A\'=40-4x=0 => x=10, y=20, A=200.',
    ],
  },
  'mw-L4': {
    commonMistakes: ['Giving up at 0/0 without conjugating.'],
    whyItWorks: 'Conjugate rationalizes the numerator so the x cancels.',
    solution: [
      'Multiply by sqrt(x+9)+3. Numerator becomes x.',
      'Simplifies to 1/(sqrt(x+9)+3) -> 1/6 as x->0.',
    ],
  },
  'mw-R6': {
    commonMistakes: ['Treating y as constant (forgetting y\').'],
    whyItWorks: 'Implicit differentiation: y is a function of x, so d/dx(y^2)=2y y\'.',
    solution: [
      '2x + 2y y\' = 0 => y\' = -x/y (y!=0).',
    ],
  },
  'mw-A5': {
    commonMistakes: ['Confusing where v=0 with where s=0.'],
    whyItWorks: 'At rest means velocity zero; sign of v tells direction of motion.',
    solution: [
      'v=3(t-1)(t-3). Rest at t=1 and t=3.',
      'v>0 on [0,1) and (3,5]; v<0 on (1,3).',
    ],
  },
  'mw-I5': {
    commonMistakes: ['Subtracting in the wrong order.'],
    whyItWorks: 'Additivity of integrals on adjacent intervals.',
    solution: ['int_0^3 = int_0^1 + int_1^3 => 10=4+int_1^3 => int_1^3=6.'],
  },
  'mw-U4': {
    commonMistakes: ['u=x without matching du=2x dx half-factor.'],
    whyItWorks: 'u=1+x^2 makes du=2x dx; half factor completes the sub.',
    solution: [
      'u=1+x^2, du=2x dx => (1/2)int u^(-1/2) du = sqrt(1+x^2)+C.',
    ],
  },
};

const out = M.map((p) => {
  const e = enrich[p.id];
  const base = {
    ...p,
    commonMistakes: e?.commonMistakes || [
      'Skipping setup (diagram/formula) and jumping into random algebra.',
      'Not checking by differentiating (integrals) or by units/domain (rates).',
    ],
    whyItWorks:
      e?.whyItWorks ||
      'Each step applies a standard Calc I idea (limit law, derivative rule, FTC, substitution). Name the rule at each line on your paper.',
    solution: e?.solution || (p.solution.length >= 4 ? p.solution : [
      'Write the relevant definition or formula first.',
      ...p.solution,
      'Check by differentiating, plugging a convenient number, or re-reading units/domain.',
    ]),
  };
  return base;
});

const header = `/**
 * Calculus I Final Study Buddy — worked practice problems
 * Tutor-style solutions with commonMistakes + whyItWorks.
 */
window.CALC1_MATH = `;

writeFileSync(path, header + JSON.stringify(out, null, 2) + ';\n');
console.log('Enriched math problems:', out.length);
