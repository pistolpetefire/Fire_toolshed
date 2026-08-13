/** node scripts/gen-questions.mjs → js/questions.js  (≥1100 FE-style MCQs) */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'js', 'questions.js');
const LETTERS = ['A', 'B', 'C', 'D'];

function fmt(n) {
  if (typeof n === 'string') return n;
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  const r = Math.round(n * 10000) / 10000;
  return String(r);
}

function uniq4(correct, distractors) {
  const out = [fmt(correct)];
  for (const d of distractors) {
    const s = fmt(d);
    if (!out.includes(s)) out.push(s);
    if (out.length === 4) break;
  }
  let k = 1;
  while (out.length < 4) {
    const s = fmt(typeof correct === 'number' ? correct + k : `alt${k}`);
    if (!out.includes(s)) out.push(s);
    k += 1;
  }
  return out;
}

function item(id, topic, stem, correct, distractors, explanation, steps, why, handbook) {
  const raw = uniq4(correct, distractors);
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = (id.charCodeAt(id.length - 1) + id.length + i * 7) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  const choices = order.map((k) => raw[k]);
  const answer = LETTERS[choices.indexOf(raw[0])];
  return {
    id,
    topics: [topic],
    stem,
    choices,
    answer,
    explanation,
    handbook,
    tutoring: { steps, whyNotOthers: why },
  };
}

const bank = [];

function add(topic, rows) {
  for (const r of rows) bank.push({ ...r, topic });
}

// ——— Algebra & trig ———
(function alg() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Algebra / trigonometry (Handbook)') => {
    n += 1;
    rows.push(item(`AT${String(n).padStart(4, '0')}`, 'alg-trig', stem, c, w, exp, st, why, hb));
  };
  for (let a = 2; a <= 9; a++) {
    for (let b = 1; b <= 8; b++) {
      if (a === b) continue;
      const x = 3 * a - b;
      push(
        `Solve for x: (x + ${b}) / ${a} = 3.`,
        x,
        [3 * a + b, (3 - b) / a, 3 + b, a * 3],
        `Multiply both sides by ${a}: x + ${b} = ${3 * a}. Then x = ${x}.`,
        [`Multiply by ${a}.`, `x = ${3 * a} − ${b} = ${x}.`, 'Substitute back to check.'],
        'Forgot to multiply the constant, or added instead of subtracted.'
      );
    }
  }
  for (let p = 2; p <= 6; p++) {
    for (let k = 2; k <= 5; k++) {
      push(
        `Simplify: log_${p}(${p ** k}).`,
        k,
        [p, k * p, p ** k, 1],
        `log_b(b^k) = k, so log_${p}(${p ** k}) = ${k}.`,
        ['Argument is a power of the base.', `p^${k} = ${p ** k}.`, `Therefore the log is ${k}.`],
        'Returning the argument or the base instead of the exponent.'
      );
    }
  }
  for (const deg of [30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 330]) {
    const rad = (deg * Math.PI) / 180;
    const exact = { 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2', 120: '2π/3', 135: '3π/4', 150: '5π/6', 180: 'π', 210: '7π/6', 240: '4π/3', 270: '3π/2', 300: '5π/3', 330: '11π/6' }[deg];
    push(
      `${deg}° in radians is:`,
      exact,
      ['π/' + deg, String(deg) + 'π', (deg / 180).toFixed(3) + ' (no π)', deg + ' rad'],
      `radians = degrees · π/180 = ${deg}π/180 = ${exact}.`,
      ['Multiply by π/180.', 'Reduce the fraction.', `Answer ${exact}.`],
      'Forgot π, or used 180/π the wrong way.',
      'Trig — degree/radian conversion'
    );
  }
  for (let a = 3; a <= 10; a++) {
    for (let b = 3; b <= 10; b++) {
      if (a === b) continue;
      const c2 = a * a + b * b;
      push(
        `Right triangle legs ${a} and ${b}. Hypotenuse equals:`,
        fmt(Math.sqrt(c2)),
        [a + b, Math.abs(a - b), a * b, c2],
        `c = √(${a}²+${b}²) = √${c2} = ${fmt(Math.sqrt(c2))}.`,
        ['Pythagoras.', `c² = ${c2}.`, `c = ${fmt(Math.sqrt(c2))}.`],
        'Added the legs, or forgot the square root.'
      );
    }
  }
  for (let A = 20; A <= 70; A += 10) {
    for (const a of [5, 8, 10, 12]) {
      const b = 2 * a;
      const sinB = (b * Math.sin((A * Math.PI) / 180)) / a;
      if (sinB >= 1) continue;
      const B = (Math.asin(sinB) * 180) / Math.PI;
      push(
        `Law of sines: angle A = ${A}°, side a = ${a}, side b = ${b}. Angle B is closest to:`,
        Math.round(B),
        [A, 180 - A, Math.round(B / 2), Math.round(90 - B)],
        `sin B / ${b} = sin ${A}° / ${a} ⇒ sin B = ${fmt(sinB)} ⇒ B ≈ ${fmt(B)}°.`,
        ['Write sin B / b = sin A / a.', 'Solve for sin B.', 'arcsin (check the SSA ambiguous case on the FE if needed).'],
        'Used cosines, or swapped a and b.',
        'Trig — law of sines'
      );
    }
  }
  add('alg-trig', rows);
})();

// ——— Analytic geometry ———
(function geo() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`AG${String(n).padStart(4, '0')}`, 'analytic', stem, c, w, exp, st, why, 'Analytic geometry (Handbook)'));
  };
  for (let x1 = -4; x1 <= 5; x1++) {
    for (let y1 = -3; y1 <= 4; y1++) {
      const x2 = x1 + 3;
      const y2 = y1 + 4;
      const d = 5;
      push(
        `Distance from (${x1}, ${y1}) to (${x2}, ${y2}) is:`,
        d,
        [7, 12, 25, fmt(Math.sqrt(3 * 3 + 2 * 2))],
        `Δx=3, Δy=4, 3-4-5 triangle. d=5.`,
        ['Δx=3, Δy=4.', '√(9+16)=5.', 'Recognize the 3-4-5 triple.'],
        'Added 3+4, or left the answer as 25.'
      );
    }
  }
  for (let h = -2; h <= 3; h++) {
    for (let k = -2; k <= 3; k++) {
      for (const r of [2, 3, 4, 5]) {
        push(
          `The circle (x − ${h})² + (y − ${k})² = ${r * r} has radius:`,
          r,
          [r * r, 2 * r, h, k],
          `Standard form (x−h)²+(y−k)²=r² with r²=${r * r}, so r=${r}. Center (${h}, ${k}).`,
          ['Match (x−h)²+(y−k)²=r².', `r²=${r * r} ⇒ r=${r}.`, `Center is (${h}, ${k}), not the radius.`],
          'Reporting r² as the radius.'
        );
      }
    }
  }
  add('analytic', rows);
})();

// ——— Vectors ———
(function vec() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`VE${String(n).padStart(4, '0')}`, 'vectors', stem, c, w, exp, st, why, 'Vectors (Handbook)'));
  };
  for (let ax = 1; ax <= 6; ax++) {
    for (let ay = 1; ay <= 6; ay++) {
      const mag = Math.sqrt(ax * ax + ay * ay);
      push(
        `Magnitude of ⟨${ax}, ${ay}⟩ is:`,
        fmt(mag),
        [ax + ay, ax * ay, ax * ax + ay * ay, Math.abs(ax - ay)],
        `|a|=√(${ax}²+${ay}²)=√${ax * ax + ay * ay}=${fmt(mag)}.`,
        ['Square, add, square-root.', `Inside: ${ax * ax + ay * ay}.`, `√ = ${fmt(mag)}.`],
        'Forgot the square root, or added components.'
      );
    }
  }
  for (let ax = 1; ax <= 5; ax++) {
    for (let ay = 0; ay <= 4; ay++) {
      for (let bx = 0; bx <= 4; bx++) {
        const by = 2;
        const dot = ax * bx + ay * by;
        push(
          `⟨${ax}, ${ay}⟩ · ⟨${bx}, ${by}⟩ equals:`,
          dot,
          [ax * by + ay * bx, ax + bx + ay + by, ax * bx, ay * by],
          `Dot = ${ax}·${bx} + ${ay}·${by} = ${dot}.`,
          ['Multiply corresponding components.', 'Add.', `Result ${dot}.`],
          'Used a 2D cross (ad−bc) instead of a dot.'
        );
      }
    }
  }
  for (let ax = 1; ax <= 5; ax++) {
    for (let ay = 1; ay <= 5; ay++) {
      const bx = -ay;
      const by = ax;
      push(
        `⟨${ax}, ${ay}⟩ · ⟨${bx}, ${by}⟩ equals:`,
        0,
        [1, ax * ay, ax + ay, -1],
        `These are perpendicular: ${ax}(${bx})+${ay}(${by}) = ${-ax * ay + ay * ax} = 0.`,
        ['Compute the dot.', 'It is identically 0.', 'Perpendicular vectors have dot 0.'],
        'A zero dot is not “undefined.” It is perpendicular.'
      );
    }
  }
  add('vectors', rows);
})();

// ——— Matrices ———
(function mat() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`MX${String(n).padStart(4, '0')}`, 'matrices', stem, c, w, exp, st, why, 'Matrices / linear algebra (Handbook)'));
  };
  for (let a = 1; a <= 5; a++) {
    for (let b = 0; b <= 4; b++) {
      for (let c = 0; c <= 4; c++) {
        for (let d = 1; d <= 5; d++) {
          const det = a * d - b * c;
          if (det === 0) continue;
          push(
            `det [ ${a} ${b} ; ${c} ${d} ] equals:`,
            det,
            [a * d + b * c, a + d, a * d, -det],
            `ad − bc = ${a}·${d} − ${b}·${c} = ${det}.`,
            ['2×2 det is ad−bc.', `ad=${a * d}, bc=${b * c}.`, `Difference ${det}.`],
            'Used ad+bc, or added the diagonal only.'
          );
        }
      }
    }
  }
  add('matrices', rows);
})();

// ——— Diff calc ———
(function dc() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`DC${String(n).padStart(4, '0')}`, 'diff-calc', stem, c, w, exp, st, why, 'Differential calculus (Handbook)'));
  };
  for (let p = 2; p <= 9; p++) {
    for (const x of [1, 2, 3, 4, 5]) {
      const y = p * x ** (p - 1);
      push(
        `d/dx [x^${p}] at x = ${x} equals:`,
        y,
        [x ** p, (p - 1) * x ** (p - 1), p * x ** p, p * x],
        `Power rule: ${p} x^${p - 1}. At ${x}: ${p}·${x ** (p - 1)} = ${y}.`,
        [`Derivative is ${p}x^${p - 1}.`, `Plug x=${x}.`, `Value ${y}.`],
        'Forgot to drop the power, or multiplied by x again.'
      );
    }
  }
  for (let k = 2; k <= 9; k++) {
    push(
      `d/dx [e^{${k}x}] equals:`,
      `${k}e^{${k}x}`,
      [`e^{${k}x}`, `${k}e^x`, `e^{${k}x}/${k}`, `${k}x e^{${k}x}`],
      `Chain rule: e^{${k}x} · ${k} = ${k}e^{${k}x}.`,
      ['Derivative of e^u is e^u u′.', `u=${k}x, u′=${k}.`, `Answer ${k}e^{${k}x}.`],
      'Forgot the chain-rule factor ${k}.'
    );
  }
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      push(
        `If f(x)=${a}x² + ${b}x, then f′(x) =`,
        `${2 * a}x + ${b}`,
        [`${a}x + ${b}`, `${2 * a}x`, `${a}x² + ${b}`, `${2 * a}x + ${2 * b}`],
        `Termwise: ${2 * a}x + ${b}.`,
        ['Power rule on each term.', `2·${a}x = ${2 * a}x.`, `Constant ${b} stays.`],
        'Differentiated the constant, or forgot the 2.'
      );
    }
  }
  for (let k = 2; k <= 8; k++) {
    for (const x of [0, Math.PI / 2]) {
      const val = k * Math.cos(k * x);
      push(
        `d/dx [sin(${k}x)] at x = ${x === 0 ? '0' : 'π/2'} equals:`,
        fmt(val),
        [fmt(Math.sin(k * x)), fmt(k), fmt(-k * Math.sin(k * x)), 0],
        `Chain: ${k} cos(${k}x). At that x, ${fmt(val)}.`,
        [`Derivative of sin(u) is cos(u) u′.`, `u=${k}x, u′=${k}.`, `Evaluate.`],
        'Forgot the factor k, or differentiated to sin instead of cos.'
      );
    }
  }
  for (let n = 2; n <= 6; n++) {
    push(
      `d²/dx² [x^${n}] equals:`,
      `${n * (n - 1)}x^${n - 2}`,
      [`${n}x^${n - 1}`, `${n}x^${n - 2}`, `${n * n}x^${n - 2}`, `${n - 1}x^${n}`],
      `First ${n}x^${n - 1}, second ${n * (n - 1)}x^${n - 2}.`,
      ['Differentiate twice.', 'Power drops by 1 each time.', `Coefficient ${n}·${n - 1}.`],
      'Stopped after one derivative.'
    );
  }
  add('diff-calc', rows);
})();

// ——— Integral calc ———
(function ic() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`IC${String(n).padStart(4, '0')}`, 'int-calc', stem, c, w, exp, st, why, 'Integral calculus (Handbook)'));
  };
  for (let p = 1; p <= 8; p++) {
    for (const a of [0, 1, 2, 3]) {
      const b = a + 3;
      const val = (b ** (p + 1) - a ** (p + 1)) / (p + 1);
      push(
        `∫_${a}^${b} x^${p} dx equals:`,
        fmt(val),
        [b ** p - a ** p, (b ** p) / p, fmt(val * (p + 1)), p * (b - a)],
        `F=x^${p + 1}/${p + 1}. F(${b})−F(${a}) = ${fmt(val)}.`,
        [`Antiderivative x^${p + 1}/${p + 1}.`, `Evaluate ${b} and ${a}.`, `Difference ${fmt(val)}.`],
        'Forgot to add 1 to the power, or skipped dividing.'
      );
    }
  }
  for (let ntrap = 2; ntrap <= 4; ntrap++) {
    for (const h of [1, 2]) {
      const ys = [];
      for (let i = 0; i <= ntrap; i++) ys.push(1 + i);
      const trap = (h / 2) * (ys[0] + ys[ys.length - 1] + 2 * ys.slice(1, -1).reduce((s, v) => s + v, 0));
      push(
        `Trapezoidal rule, h=${h}, y-values ${ys.join(', ')}. Estimate ∫ is:`,
        fmt(trap),
        [ys.reduce((s, v) => s + v, 0), fmt(trap * 2), h * ys[ys.length - 1], ntrap],
        `(h/2)(y0 + yn + 2Σ middle) = ${fmt(trap)}.`,
        ['Write (h/2)(first + last + 2·middles).', `h=${h}.`, `Value ${fmt(trap)}.`],
        'Used a left Riemann sum, or forgot the 1/2.',
        'Numerical integration — trapezoid (Handbook)'
      );
    }
  }
  for (let k = 2; k <= 6; k++) {
    for (const a of [0, 1]) {
      const b = a + 1;
      const val = (Math.exp(k * b) - Math.exp(k * a)) / k;
      push(
        `∫_${a}^${b} e^{${k}x} dx equals:`,
        fmt(val),
        [fmt(Math.exp(k * b) - Math.exp(k * a)), fmt(k * (Math.exp(b) - Math.exp(a))), 0, k],
        `∫ e^{kx} dx = e^{kx}/k. Evaluate ${a} to ${b}: ${fmt(val)}.`,
        [`Antiderivative e^{${k}x}/${k}.`, 'FTC: F(b)−F(a).', `Value ${fmt(val)}.`],
        'Forgot to divide by k.'
      );
    }
  }
  for (const a of [1, 2, Math.E]) {
    const b = a * 2;
    push(
      `∫_${fmt(a)}^${fmt(b)} (1/x) dx equals:`,
      fmt(Math.log(b / a)),
      [fmt(1 / b - 1 / a), fmt(b - a), 0, fmt(Math.log(b) + Math.log(a))],
      `ln|x| from ${fmt(a)} to ${fmt(b)} = ln(${fmt(b)}/${fmt(a)}) = ${fmt(Math.log(b / a))}.`,
      ['Antiderivative ln|x|.', 'ln b − ln a = ln(b/a).', 'Natural log (Handbook).'],
      'Used 1/x² or subtracted the endpoints without ln.'
    );
  }
  add('int-calc', rows);
})();

// ——— DEs ———
(function de() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`DE${String(n).padStart(4, '0')}`, 'diffeq', stem, c, w, exp, st, why, 'Differential equations (Handbook)'));
  };
  for (let k = 1; k <= 8; k++) {
    for (const y0 of [1, 2, 3, 4, 5]) {
      push(
        `Solve y′ = ${k} y, y(0)=${y0}. y(t) =`,
        `${y0}e^{${k}t}`,
        [`${y0}e^{${-k}t}`, `${k}e^{${y0}t}`, `${y0 + k}e^{t}`, `${y0}t + ${k}`],
        `Separable: dy/y = ${k} dt ⇒ ln|y|=${k}t+C ⇒ y=${y0}e^{${k}t}.`,
        ['Separate dy/y = k dt.', 'Integrate; y = C e^{kt}.', `y(0)=${y0} fixes C.`],
        'Wrong sign on k, or treated it as y′=k (linear in t).'
      );
    }
  }
  for (let a = 1; a <= 5; a++) {
    for (let b = 1; b <= 5; b++) {
      const sum = -(a + b);
      const prod = a * b;
      push(
        `Characteristic equation r² + ${-sum}r + ${prod} = 0 has roots:`,
        `${-a} and ${-b}`,
        [`${a} and ${b}`, `${-a} and ${b}`, `0 and ${prod}`, `${sum} and ${prod}`],
        `Factors as (r+${a})(r+${b})=0, so r=${-a}, ${-b}.`,
        ['Need two numbers that add to the middle coeff and multiply to the constant.', `Roots ${-a}, ${-b}.`, 'General solution is C1 e^{r1 t}+C2 e^{r2 t}.'],
        'Dropped the minus signs on the roots.'
      );
    }
  }
  for (let p = 1; p <= 5; p++) {
    push(
      `Integrating factor for y′ + ${p} y = x is:`,
      `e^{${p}x}`,
      [`e^{${-p}x}`, `${p}e^x`, `e^{x/${p}}`, `${p}x`],
      `μ = e^{∫P dx} = e^{∫${p} dx} = e^{${p}x}.`,
      ['Standard form y′+P y=Q with P constant.', `μ=e^{∫${p} dx}.`, `μ=e^{${p}x}.`],
      'Used e^{−P} or forgot to integrate P.'
    );
  }
  for (let w = 1; w <= 6; w++) {
    push(
      `The DE y″ + ${w * w} y = 0 has general solution of the form:`,
      `C1 cos(${w}t) + C2 sin(${w}t)`,
      [`C1 e^{${w}t} + C2 e^{${-w}t}`, `C1 t + C2`, `${w} sin t`, `C1 e^{${w * w}t}`],
      `r² + ${w * w} = 0 ⇒ r = ±${w} i. Solution is sines and cosines of ${w}t.`,
      ['Characteristic r² + ω² = 0.', `ω=${w}.`, 'Oscillatory: sin and cos.'],
      'Real exponentials are for r² − ω² = 0, not r² + ω² = 0.'
    );
  }
  add('diffeq', rows);
})();

// ——— Probability ———
(function pr() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why) => {
    n += 1;
    rows.push(item(`PR${String(n).padStart(4, '0')}`, 'probability', stem, c, w, exp, st, why, 'Probability (Handbook)'));
  };
  for (let p = 10; p <= 90; p += 5) {
    push(
      `If P(A)=${fmt(p / 100)}, then P(A^c) =`,
      fmt(1 - p / 100),
      [fmt(p / 100), fmt(p / 50), 1, 0],
      `Complement: 1 − ${fmt(p / 100)} = ${fmt(1 - p / 100)}.`,
      ['P(not A)=1−P(A).', `1 − ${fmt(p / 100)}.`, `= ${fmt(1 - p / 100)}.`],
      'Reported P(A) again, or doubled it.'
    );
  }
  for (let a = 2; a <= 6; a++) {
    for (let b = 2; b <= 6; b++) {
      const p = (a / 10) * (b / 10);
      push(
        `Independent events, P(A)=${fmt(a / 10)}, P(B)=${fmt(b / 10)}. P(A and B) =`,
        fmt(p),
        [fmt(a / 10 + b / 10), fmt(a / 10 + b / 10 - p), fmt(Math.max(a, b) / 10), fmt((a + b) / 20)],
        `Independence ⇒ multiply: ${fmt(a / 10)}·${fmt(b / 10)}=${fmt(p)}.`,
        ['Independent: P(A∩B)=P(A)P(B).', 'Multiply.', `= ${fmt(p)}.`],
        'Added instead of multiplying (that is for exclusive-or style unions).'
      );
    }
  }
  for (const n of [4, 5, 6, 7, 8]) {
    for (const k of [1, 2, 3]) {
      if (k > n) continue;
      const p = 0.5;
      const comb = factorial(n) / (factorial(k) * factorial(n - k));
      const val = comb * p ** k * (1 - p) ** (n - k);
      push(
        `Binomial: n=${n}, p=1/2, P(X=${k}) =`,
        fmt(val),
        [fmt(1 / (n + 1)), fmt(k / n), fmt(comb), fmt(p ** k)],
        `C(${n},${k}) (1/2)^${n} = ${comb}/${2 ** n} = ${fmt(val)}.`,
        [`C(${n},${k})=${comb}.`, `Each outcome has prob (1/2)^${n}.`, `Product ${fmt(val)}.`],
        'Forgot the combination factor, or used k/n.',
        'Binomial pmf (Handbook)'
      );
    }
  }
  for (let x = 1; x <= 5; x++) {
    for (let px = 2; px <= 5; px++) {
      const ev = x * (px / 10) + 0 * (1 - px / 10);
      push(
        `X is ${x} with probability ${fmt(px / 10)} and 0 otherwise. E[X] =`,
        fmt(ev),
        [x, fmt(px / 10), fmt(x + px / 10), fmt(x / (px / 10))],
        `E[X]=${x}·${fmt(px / 10)}+0·…=${fmt(ev)}.`,
        ['E[X]=Σ x p(x).', `Only the ${x} term survives.`, `= ${fmt(ev)}.`],
        'Reported x or p, not the product.'
      );
    }
  }
  for (let a = 2; a <= 5; a++) {
    for (let b = 2; b <= 5; b++) {
      if (a / 10 + b / 10 > 1) continue;
      const u = a / 10 + b / 10;
      push(
        `Mutually exclusive A,B with P(A)=${fmt(a / 10)}, P(B)=${fmt(b / 10)}. P(A or B) =`,
        fmt(u),
        [fmt((a / 10) * (b / 10)), fmt(Math.max(a, b) / 10), 1, 0],
        `Exclusive ⇒ add: ${fmt(a / 10)}+${fmt(b / 10)}=${fmt(u)}. P(A and B)=0.`,
        ['Mutually exclusive: no overlap.', 'P(union)=P(A)+P(B).', `=${fmt(u)}.`],
        'Multiplied (that is independence for AND, not exclusive OR).'
      );
    }
  }
  add('probability', rows);
})();

function factorial(m) {
  let p = 1;
  for (let i = 2; i <= m; i++) p *= i;
  return p;
}

// ——— Statistics ———
(function st() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, steps, why) => {
    n += 1;
    rows.push(item(`ST${String(n).padStart(4, '0')}`, 'statistics', stem, c, w, exp, steps, why, 'Statistics (Handbook)'));
  };
  for (let a = 1; a <= 6; a++) {
    const data = [a, a + 2, a + 4, a + 6];
    const mean = data.reduce((s, v) => s + v, 0) / 4;
    push(
      `Mean of {${data.join(', ')}} is:`,
      fmt(mean),
      [data[0], data[3], fmt(mean * 2), fmt((data[0] + data[3]) / 4)],
      `Sum=${data.reduce((s, v) => s + v, 0)}, n=4, mean=${fmt(mean)}.`,
      ['Add the values.', 'Divide by n=4.', `Mean ${fmt(mean)}.`],
      'Reported the midrange with the wrong divisor, or a single data point.'
    );
    const s2 = data.reduce((s, v) => s + (v - mean) ** 2, 0) / 3;
    push(
      `Sample variance of {${data.join(', ')}} (divide by n−1) is:`,
      fmt(s2),
      [fmt(s2 * 3 / 4), fmt(Math.sqrt(s2)), 0, fmt(mean)],
      `Σ(x−x̄)² / 3 = ${fmt(s2)}.`,
      ['Find the mean first.', 'Square deviations, sum.', 'Divide by n−1=3, not 4.'],
      'Divided by n (population) or reported the standard deviation.'
    );
  }
  for (const mu of [10, 50, 100]) {
    for (const sig of [2, 5, 10]) {
      for (const z of [-2, -1, 1, 2]) {
        const x = mu + z * sig;
        push(
          `Normal, μ=${mu}, σ=${sig}. The z-score of x=${x} is:`,
          z,
          [x - mu, fmt((x - mu) / (sig * sig)), -z, 0],
          `z=(x−μ)/σ=(${x}−${mu})/${sig}=${z}.`,
          ['z=(x−μ)/σ.', 'Subtract, then divide.', `z=${z}.`],
          'Forgot to divide by σ, or divided by σ².'
        );
      }
    }
  }
  for (const n of [4, 9, 16, 25, 36, 49, 64, 81, 100]) {
    for (const sig of [3, 6, 12]) {
      const se = sig / Math.sqrt(n);
      push(
        `σ=${sig}, n=${n}. Standard error of the mean σ/√n is:`,
        fmt(se),
        [sig, fmt(sig / n), fmt(sig * Math.sqrt(n)), n],
        `SE=${sig}/√${n}=${sig}/${Math.sqrt(n)}=${fmt(se)}.`,
        ['SE of the mean is σ/√n, not σ.', `√${n}=${Math.sqrt(n)}.`, `SE=${fmt(se)}.`],
        'Used σ or σ/n instead of σ/√n.'
      );
    }
  }
  for (let a = 1; a <= 9; a += 2) {
    const data = [a, a + 2, a + 8];
    const med = a + 2;
    push(
      `Median of {${data.join(', ')}} is:`,
      med,
      [a, a + 8, fmt((a + a + 2 + a + 8) / 3), 0],
      `Ordered already. Middle value is ${med}.`,
      ['Sort the list.', 'n=3 odd ⇒ middle entry.', `Median ${med}.`],
      'Reported the mean, or an endpoint.'
    );
  }
  add('statistics', rows);
})();

// Pad any short topic with extra safe variants so each has ≥ 123
const byTopic = {};
for (const q of bank) {
  const t = q.topics[0];
  byTopic[t] = (byTopic[t] || 0) + 1;
}

const NEED = 123;
for (const [topic, count] of Object.entries(byTopic)) {
  if (count < NEED) {
    console.warn('Topic short (no PAD filler):', topic, count);
  }
}

// Assign pools: first 3 diag-a, next 3 diag-b, rest drill — per topic
const grouped = {};
for (const q of bank) {
  const t = q.topics[0];
  if (!grouped[t]) grouped[t] = [];
  grouped[t].push(q);
}

const final = [];
for (const t of Object.keys(grouped)) {
  const list = grouped[t];
  list.forEach((q, i) => {
    q.pool = i < 3 ? 'diag-a' : i < 6 ? 'diag-b' : 'drill';
    final.push(q);
  });
}

writeFileSync(
  outPath,
  `/** FE General Math MCQ bank. Generated — do not hand-edit. */\nwindow.FE_QUESTIONS = ${JSON.stringify(final)};\n`,
  'utf8'
);
const counts = {};
const pools = { 'diag-a': 0, 'diag-b': 0, drill: 0 };
for (const q of final) {
  counts[q.topics[0]] = (counts[q.topics[0]] || 0) + 1;
  pools[q.pool] += 1;
}
console.log('total', final.length, 'pools', pools, 'byTopic', counts);
