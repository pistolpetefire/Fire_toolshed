/** node scripts/gen-questions.mjs → js/questions.js  (≥1100 FE Industrial MCQs) */
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

function money(n) {
  return Math.round(n * 100) / 100;
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

function ceil(n) {
  return Math.ceil(n - 1e-12);
}

// ——— Engineering economics ———
(function econ() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Engineering economics (Handbook)') => {
    n += 1;
    rows.push(item(`EC${String(n).padStart(4, '0')}`, 'econ', stem, c, w, exp, st, why, hb));
  };
  for (const P of [2000, 3000, 4000, 5000, 8000]) {
    for (const i of [0.05, 0.08, 0.1]) {
      for (const k of [2, 3, 4, 5]) {
        const F = money(P * (1 + i) ** k);
        push(
          `A present amount P = $${P} grows at i = ${fmt(i * 100)}% per year for n = ${k} years. Future worth F is closest to:`,
          F,
          [money(P * (1 + i * k)), money(P / (1 + i) ** k), money(P * i * k), P + k * 100],
          `F = P(1+i)^n = ${P}(1+${fmt(i)})^${k} = ${fmt(F)}.`,
          ['Use F = P(1+i)^n, not simple interest.', `1+i = ${fmt(1 + i)}.`, `Raise to n=${k}, then multiply by ${P}.`],
          'Used simple interest P(1+in), or computed P from F.'
        );
      }
    }
  }
  for (const F of [10000, 12000, 16000]) {
    for (const i of [0.05, 0.08, 0.1]) {
      for (const k of [2, 4, 5]) {
        const P = money(F / (1 + i) ** k);
        push(
          `You need F = $${F} in ${k} years. i = ${fmt(i * 100)}% per year. How much must you invest today (P)?`,
          P,
          [money(F * (1 + i) ** k), money(F * (1 + i * k)), money(F / (1 + i * k)), F / k],
          `P = F(1+i)^{−n} = ${F}/(1+${fmt(i)})^${k} = ${fmt(P)}.`,
          ['Discount: P = F/(1+i)^n.', `Denominator (1+${fmt(i)})^${k}.`, `P ≈ ${fmt(P)}.`],
          'Compounded forward instead of discounting, or used simple interest.'
        );
      }
    }
  }
  for (const P of [1000, 2500, 5000]) {
    for (const i of [0.06, 0.08, 0.1]) {
      for (const k of [2, 3, 4]) {
        const I = money(P * i * k);
        push(
          `Simple interest: P = $${P}, i = ${fmt(i * 100)}%/yr, n = ${k} yr. Interest earned I is:`,
          I,
          [money(P * (1 + i) ** k - P), money(P * i), money(P * (1 + i * k)), P],
          `I = Pin = ${P}·${fmt(i)}·${k} = ${fmt(I)}. (Not compound.)`,
          ['Simple interest is I = P·i·n.', 'Do not raise (1+i) to n.', `I = ${fmt(I)}.`],
          'Used compound interest, or reported Pin for one year only.'
        );
      }
    }
  }
  for (const r of [0.06, 0.08, 0.12]) {
    for (const m of [2, 4, 12]) {
      const ieff = (1 + r / m) ** m - 1;
      push(
        `Nominal r = ${fmt(r * 100)}% per year compounded ${m} times per year. Effective annual i_eff is closest to:`,
        fmt(ieff),
        [fmt(r), fmt(r / m), fmt(r * m), fmt((1 + r) ** m - 1)],
        `i_eff = (1 + r/m)^m − 1 = (1 + ${fmt(r)}/${m})^${m} − 1 = ${fmt(ieff)}.`,
        ['i_eff = (1+r/m)^m − 1.', `r/m = ${fmt(r / m)}.`, 'Raise to m, subtract 1.'],
        'Reported the nominal r, or r/m, or compounded with (1+r)^m.',
        'Effective interest (Handbook)'
      );
    }
  }
  for (const B of [10000, 20000, 40000]) {
    for (const S of [0, 2000, 4000]) {
      for (const N of [5, 8, 10]) {
        const d = money((B - S) / N);
        push(
          `Straight-line depreciation: first cost B = $${B}, salvage S = $${S}, life N = ${N} yr. Annual depreciation is:`,
          d,
          [money(B / N), money((B + S) / N), money(B - S), money((B - S) * N)],
          `d = (B − S)/N = (${B} − ${S})/${N} = ${fmt(d)}.`,
          ['SL: (basis − salvage) / life.', `Depreciable amount ${B - S}.`, `Divide by ${N}.`],
          'Forgot salvage, or reported the depreciable base instead of the annual amount.',
          'Depreciation — SL (Handbook)'
        );
      }
    }
  }
  for (const A of [500, 1000, 2000]) {
    for (const i of [0.08, 0.1]) {
      for (const k of [5, 10]) {
        const fac = ((1 + i) ** k - 1) / (i * (1 + i) ** k);
        const P = money(A * fac);
        push(
          `Uniform annual A = $${A} for n = ${k} years at i = ${fmt(i * 100)}%. Present worth P is closest to:`,
          P,
          [money(A * k), money(A / i), money(A * (1 + i) ** k), money(A * k / (1 + i))],
          `P = A(P/A,i,n) = A · [((1+i)^n−1)/(i(1+i)^n)] = ${A}·${fmt(fac)} = ${fmt(P)}.`,
          ['Use the (P/A,i,n) factor.', `Compute [((1+i)^n−1)/(i(1+i)^n)].`, 'Multiply by A.'],
          'Multiplied A by n (no discount), or used A/i as a perpetuity with the wrong n.',
          'Uniform series P/A (Handbook)'
        );
      }
    }
  }
  for (const ben of [12000, 15000, 18000, 24000]) {
    for (const cost of [8000, 10000, 12000]) {
      if (ben <= cost) continue;
      const bc = money(ben / cost);
      push(
        `PW(benefits) = $${ben}, PW(costs) = $${cost}. Benefit/cost ratio is:`,
        bc,
        [money(ben - cost), money(cost / ben), money(ben + cost), 1],
        `B/C = PW(B)/PW(C) = ${ben}/${cost} = ${fmt(bc)}.`,
        ['B/C uses equivalent worth of benefits over costs.', 'Same i and n on both sides.', `Ratio ${fmt(bc)}.`],
        'Reported B−C (that is NPW), or inverted the ratio.',
        'B/C ratio (Handbook)'
      );
    }
  }
  for (const Inv of [10000, 20000, 30000]) {
    for (const A of [2500, 4000, 5000]) {
      const pb = money(Inv / A);
      push(
        `Simple payback: investment $${Inv}, uniform annual net cash $${A}. Payback period (years) is:`,
        pb,
        [money(Inv * A), money(A / Inv), Inv - A, A],
        `Payback = investment / annual net = ${Inv}/${A} = ${fmt(pb)} years.`,
        ['Simple payback ignores interest.', 'Divide first cost by annual recovery.', `${fmt(pb)} years.`],
        'Multiplied instead of dividing, or reported leftover cash.'
      );
    }
  }
  add('econ', rows);
})();

// ——— Modeling & quantitative analysis ———
(function modeling() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Queues / modeling (Handbook)') => {
    n += 1;
    rows.push(item(`MD${String(n).padStart(4, '0')}`, 'modeling', stem, c, w, exp, st, why, hb));
  };
  for (let lam = 2; lam <= 10; lam++) {
    for (let mu = lam + 1; mu <= lam + 6; mu++) {
      const rho = lam / mu;
      push(
        `Single server: arrival rate λ = ${lam}/hr, service rate μ = ${mu}/hr. Utilization ρ is:`,
        fmt(rho),
        [fmt(mu / lam), fmt(lam * mu), fmt(mu - lam), fmt(1 - lam / mu)],
        `ρ = λ/μ = ${lam}/${mu} = ${fmt(rho)}. Must be < 1 for a stable queue.`,
        ['ρ = λ/μ for one server.', `Check ρ < 1 (here ${fmt(rho)}).`, 'Do not invert to μ/λ.'],
        'Inverted λ and μ, or reported idle time 1−ρ.'
      );
    }
  }
  for (const lam of [4, 5, 6, 8, 10]) {
    for (const W of [0.2, 0.25, 0.5, 1, 2]) {
      const L = money(lam * W);
      push(
        `Little’s law: λ = ${lam} jobs/hr, mean time in system W = ${W} hr. Mean number in system L is:`,
        L,
        [fmt(W / lam), fmt(lam / W), fmt(lam + W), fmt(lam - W)],
        `L = λW = ${lam}·${W} = ${fmt(L)}.`,
        ['Little: L = λW (consistent units).', 'Jobs/hour × hours = jobs.', `L = ${fmt(L)}.`],
        'Divided instead of multiplied, or mixed Lq with W.'
      );
    }
  }
  for (const lam of [3, 4, 5, 6]) {
    for (const mu of [lam + 2, lam + 4, lam + 6]) {
      const rho = lam / mu;
      const Lq = (rho * rho) / (1 - rho);
      push(
        `M/M/1: λ = ${lam}/hr, μ = ${mu}/hr. Mean queue length Lq is closest to:`,
        fmt(Lq),
        [fmt(rho), fmt(rho / (1 - rho)), fmt(lam / (mu - lam)), fmt(1 - rho)],
        `ρ=${fmt(rho)}. Lq = ρ²/(1−ρ) = ${fmt(Lq)}. (L = ρ/(1−ρ) = ${fmt(rho / (1 - rho))} is the system count.)`,
        ['ρ=λ/μ.', 'M/M/1: Lq = ρ²/(1−ρ).', 'Do not use L = ρ/(1−ρ) if they asked Lq.'],
        'Reported utilization or mean system size L instead of Lq.'
      );
    }
  }
  for (const Wq of [0.1, 0.2, 0.4, 0.5]) {
    for (const mu of [4, 5, 8, 10]) {
      const W = Wq + 1 / mu;
      push(
        `Mean wait in queue Wq = ${Wq} hr, service rate μ = ${mu}/hr. Mean time in system W is:`,
        fmt(W),
        [Wq, fmt(1 / mu), fmt(Wq * mu), fmt(Wq - 1 / mu)],
        `W = Wq + 1/μ = ${Wq} + ${fmt(1 / mu)} = ${fmt(W)}.`,
        ['Time in system = queue wait + service time.', `Service time 1/μ = ${fmt(1 / mu)}.`, 'Add to Wq.'],
        'Forgot to add service time, or multiplied Wq by μ.'
      );
    }
  }
  for (const c of [10, 12, 15, 20]) {
    for (const used of [4, 6, 8, 9]) {
      if (used >= c) continue;
      const slack = c - used;
      push(
        `An LP constraint has capacity ${c} and uses ${used} at the candidate point. Slack is:`,
        slack,
        [used, c + used, c * used, 0],
        `Slack = capacity − used = ${c} − ${used} = ${slack}. Slack 0 means the constraint is binding.`,
        ['Slack = RHS − LHS for a ≤ constraint.', 'Zero slack ⇒ binding / on the edge.', `Slack ${slack}.`],
        'Reported the used amount, or assumed every constraint is binding (slack 0).',
        'LP slack (Handbook)'
      );
    }
  }
  for (const p11 of [0.6, 0.7, 0.8, 0.9, 0.95]) {
    push(
      `Two-state machine: P(up → up) = ${p11}. If it is up now, P(still up next period) is:`,
      fmt(p11),
      [fmt(1 - p11), fmt(p11 / 2), 1, 0],
      `That one-step probability is given: P(up→up) = ${p11}. P(up→down) = ${fmt(1 - p11)}.`,
      ['Read the transition you need from the matrix.', 'Stay-up is P(up→up).', `= ${p11}.`],
      'Used the change probability 1−p instead of the stay probability.'
    );
    push(
      `Two-state machine: P(up → up) = ${p11}. If it is up now, P(down next period) is:`,
      fmt(1 - p11),
      [fmt(p11), fmt(p11 / 2), 1, 0],
      `P(up→down) = 1 − P(up→up) = 1 − ${p11} = ${fmt(1 - p11)} (rows of a transition matrix sum to 1).`,
      ['Each row of a one-step matrix sums to 1.', `1 − ${p11} = ${fmt(1 - p11)}.`, 'That is the change probability, not the stay.'],
      'Reported the stay probability P(up→up) instead of 1−p.'
    );
  }
  add('modeling', rows);
})();

// ——— Engineering management ———
(function management() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'PERT / CPM / decisions (Handbook)') => {
    n += 1;
    rows.push(item(`MG${String(n).padStart(4, '0')}`, 'management', stem, c, w, exp, st, why, hb));
  };
  for (let a = 1; a <= 6; a++) {
    for (let m = a + 1; m <= a + 4; m++) {
      for (let b = m + 1; b <= m + 4; b++) {
        const te = (a + 4 * m + b) / 6;
        if (rows.length > 80 && (a + m + b) % 2 === 0) continue;
        push(
          `PERT activity: optimistic a = ${a}, most likely m = ${m}, pessimistic b = ${b}. Expected time te is:`,
          fmt(te),
          [fmt((a + m + b) / 3), fmt((a + b) / 2), m, fmt((b - a) / 6)],
          `te = (a+4m+b)/6 = (${a}+${4 * m}+${b})/6 = ${fmt(te)}.`,
          ['PERT mean uses four times the most likely.', '(a+4m+b)/6.', 'Not the simple average (a+m+b)/3.'],
          'Used (a+m+b)/3, or reported σ = (b−a)/6.'
        );
      }
    }
  }
  for (let a = 1; a <= 8; a++) {
    for (let b = a + 3; b <= a + 12; b += 3) {
      const sig = (b - a) / 6;
      push(
        `PERT: a = ${a}, b = ${b}. Activity standard deviation σ is:`,
        fmt(sig),
        [fmt((b - a) / 2), b - a, fmt((a + b) / 6), fmt((b - a) / 36)],
        `σ = (b − a)/6 = (${b}−${a})/6 = ${fmt(sig)}. Variance is σ² = ${fmt(sig * sig)}.`,
        ['Handbook: σ = (b−a)/6.', 'Variance = [(b−a)/6]².', `σ = ${fmt(sig)}.`],
        'Used (b−a)/2, or reported variance when they asked σ.'
      );
    }
  }
  for (const p of [
    [3, 5, 4],
    [2, 7, 6],
    [4, 4, 8],
    [5, 3, 9],
    [1, 6, 5],
    [8, 2, 7],
    [3, 3, 10],
    [6, 4, 5],
  ]) {
    const crit = p[0] + p[1];
    const other = p[0] + p[2];
    const long = Math.max(crit, other);
    push(
      `Two paths: A–B = ${p[0]}+${p[1]} and A–C = ${p[0]}+${p[2]} (durations). Project duration (critical path) is:`,
      long,
      [Math.min(crit, other), p[0] + p[1] + p[2], p[0], Math.abs(crit - other)],
      `Path AB = ${crit}, path AC = ${other}. Critical path is the longest = ${long}.`,
      ['Sum each path.', 'Critical = longest, not shortest.', `Duration ${long}.`],
      'Picked the shorter path, or summed every activity once as if they were all critical.'
    );
  }
  for (const ES of [0, 2, 4, 5, 8]) {
    for (const LS of [ES, ES + 1, ES + 3, ES + 5]) {
      const slack = LS - ES;
      push(
        `Activity early start ES = ${ES}, late start LS = ${LS}. Total slack is:`,
        slack,
        [ES, LS, LS + ES, Math.abs(LS - 2 * ES)],
        `Slack = LS − ES = ${LS} − ${ES} = ${slack}. Slack 0 ⇒ critical.`,
        ['Slack = LS−ES = LF−EF.', 'Zero slack activities are critical.', `Slack ${slack}.`],
        'Reported ES or LS instead of the difference.'
      );
    }
  }
  for (const payoff of [80, 100, 120, 200]) {
    for (const pWin of [0.2, 0.4, 0.6, 0.7]) {
      for (const lose of [0, -20, -40]) {
        const emv = money(payoff * pWin + lose * (1 - pWin));
        push(
          `Decision: payoff ${payoff} with p = ${pWin}, otherwise ${lose}. Expected monetary value EMV is:`,
          emv,
          [payoff, lose, money(payoff * pWin), money((payoff + lose) / 2)],
          `EMV = ${payoff}·${pWin} + ${lose}·${fmt(1 - pWin)} = ${fmt(emv)}.`,
          ['EMV = Σ (payoff × probability).', 'Include the lose branch.', `EMV ${fmt(emv)}.`],
          'Reported the win payoff only, or averaged the two payoffs with equal weight.',
          'EMV (Handbook)'
        );
      }
    }
  }
  for (const EV of [40, 50, 60, 80, 90]) {
    for (const PV of [50, 70, 80, 100]) {
      const sv = EV - PV;
      push(
        `Earned value EV = ${EV}, planned value PV = ${PV}. Schedule variance SV is:`,
        sv,
        [EV - 45, EV / PV, PV - EV, EV + PV],
        `SV = EV − PV = ${EV} − ${PV} = ${sv}. (Negative ⇒ behind schedule.)`,
        ['SV = EV − PV.', 'CV = EV − AC is cost, not schedule.', `SV = ${sv}.`],
        'Computed CV = EV−AC, or inverted to PV−EV.',
        'Earned value (Handbook)'
      );
    }
  }
  for (const EV of [40, 50, 60, 80, 90]) {
    for (const AC of [45, 55, 75, 85]) {
      const cv = EV - AC;
      push(
        `Earned value EV = ${EV}, actual cost AC = ${AC}. Cost variance CV is:`,
        cv,
        [EV - 50, EV / AC, AC - EV, EV + AC],
        `CV = EV − AC = ${EV} − ${AC} = ${cv}. (Negative ⇒ over budget.)`,
        ['CV = EV − AC.', 'Do not divide (that would be CPI).', `CV = ${cv}.`],
        'Reported CPI = EV/AC, or used PV by mistake.',
        'Earned value (Handbook)'
      );
    }
  }
  add('management', rows);
})();

// ——— Production & inventory ———
(function production() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Inventory / lines (Handbook)') => {
    n += 1;
    rows.push(item(`PR${String(n).padStart(4, '0')}`, 'production', stem, c, w, exp, st, why, hb));
  };
  const eoqSets = [
    [800, 50, 4],
    [1000, 40, 5],
    [2000, 25, 4],
    [3600, 50, 8],
    [5000, 20, 10],
    [8000, 32, 4],
    [10000, 100, 2],
    [12000, 48, 6],
    [1600, 80, 5],
    [2400, 30, 6],
    [4500, 32, 8],
    [7200, 25, 10],
  ];
  for (const [D, S, H] of eoqSets) {
    const Q = Math.sqrt((2 * D * S) / H);
    push(
      `Annual demand D = ${D}, order cost S = $${S}, holding cost H = $${H}/unit/yr. EOQ is closest to:`,
      fmt(Q),
      [fmt(D / S), fmt((2 * D * S) / H), fmt(Math.sqrt((2 * D * H) / S)), fmt(D * S / H)],
      `Q* = √(2DS/H) = √(2·${D}·${S}/${H}) = ${fmt(Q)}.`,
      ['Match D, S, H to the same year.', 'Q* = √(2DS/H).', 'Square-root last.'],
      'Forgot the square root, or swapped H and S inside.'
    );
    const nOrders = D / Q;
    push(
      `Using Q = ${fmt(Math.round(Q))} on D = ${D} units/yr, orders per year are closest to:`,
      fmt(D / Math.round(Q)),
      [Math.round(Q), fmt(Math.round(Q) / D), D, S],
      `Orders/year = D/Q = ${D}/${Math.round(Q)} = ${fmt(D / Math.round(Q))}.`,
      ['Orders per year = D/Q.', 'Time between orders = Q/D years.', `≈ ${fmt(D / Math.round(Q))}.`],
      'Reported Q, or inverted Q/D without converting to a count.'
    );
  }
  for (const d of [20, 40, 50, 80, 100]) {
    for (const L of [2, 3, 5, 7]) {
      const rop = d * L;
      push(
        `Daily demand d = ${d}, lead time L = ${L} days, no safety stock. Reorder point ROP is:`,
        rop,
        [d + L, d, L, fmt(d / L)],
        `ROP = d·L = ${d}·${L} = ${rop} (units on hand when you reorder).`,
        ['Demand during lead time is d×L.', 'Add safety stock only if they give it.', `ROP = ${rop}.`],
        'Added d+L, or used d/L.'
      );
    }
  }
  for (const a of [10, 12, 15, 20, 24]) {
    for (const step of [1, 2, 3]) {
      const data = [a, a + step, a + 2 * step, a + 3 * step];
      const ma3 = (data[1] + data[2] + data[3]) / 3;
      push(
        `Actuals ${data.join(', ')}. 3-period moving-average forecast for the next period is:`,
        fmt(ma3),
        [fmt((data[0] + data[1] + data[2]) / 3), fmt(data.reduce((s, v) => s + v, 0) / 4), data[3], data[0]],
        `Last three actuals: ${data[1]}, ${data[2]}, ${data[3]}. Average = ${fmt(ma3)}.`,
        ['Moving average uses the most recent n actuals.', `n=3: drop ${data[0]}.`, `Forecast ${fmt(ma3)}.`],
        'Averaged all four, or used the first three instead of the last three.'
      );
    }
  }
  for (const F of [100, 120, 200]) {
    for (const A of [80, 110, 150, 180]) {
      for (const alpha of [0.2, 0.3, 0.5]) {
        const next = F + alpha * (A - F);
        push(
          `Exponential smoothing: last forecast F = ${F}, actual A = ${A}, α = ${alpha}. Next forecast is:`,
          fmt(next),
          [fmt(alpha * A), fmt(F + alpha * A), A, fmt((A + F) / 2)],
          `F_new = F + α(A−F) = ${F} + ${alpha}(${A}−${F}) = ${fmt(next)}. Same as αA + (1−α)F.`,
          ['F_t = F_{t−1} + α(A−F_{t−1}).', 'α close to 1 chases actuals.', `New F = ${fmt(next)}.`],
          'Used αA only, or averaged A and F with 50/50 regardless of α.'
        );
      }
    }
  }
  for (const T of [480, 450, 420]) {
    for (const D of [120, 150, 200, 240]) {
      const CT = T / D;
      push(
        `Available time ${T} min/shift, demand ${D} units/shift. Cycle time CT (min/unit) is:`,
        fmt(CT),
        [D / T, T * D, T - D, D],
        `CT = available / demand = ${T}/${D} = ${fmt(CT)} min/unit.`,
        ['CT = T_available / demand.', 'Then Nmin = (Σ task times)/CT.', `CT = ${fmt(CT)}.`],
        'Inverted demand/time, or reported leftover minutes.'
      );
    }
  }
  for (const sumt of [12, 18, 24, 30]) {
    for (const CT of [4, 5, 6, 8]) {
      const nmin = sumt / CT;
      const stations = ceil(nmin);
      push(
        `Sum of task times Σt = ${sumt} min, cycle time CT = ${CT} min. Minimum stations Nmin (round up) is:`,
        stations,
        [fmt(nmin), Math.floor(nmin) || 1, sumt * CT, CT],
        `Nmin = Σt/CT = ${sumt}/${CT} = ${fmt(nmin)} → round up to ${stations} stations.`,
        ['Nmin = (Σ task times) / CT.', 'Stations must be an integer — always round up.', `${stations} stations.`],
        'Left it as a fraction, or rounded down.'
      );
    }
  }
  add('production', rows);
})();

// ——— Facilities & supply chain ———
(function facilities() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Facilities / distances (Handbook)') => {
    n += 1;
    rows.push(item(`FC${String(n).padStart(4, '0')}`, 'facilities', stem, c, w, exp, st, why, hb));
  };
  for (let x1 = 0; x1 <= 8; x1++) {
    for (let y1 = 0; y1 <= 6; y1 += 2) {
      const x2 = x1 + 3;
      const y2 = y1 + 5;
      const rect = Math.abs(x2 - x1) + Math.abs(y2 - y1);
      const euc = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      push(
        `From (${x1}, ${y1}) to (${x2}, ${y2}). Rectilinear (aisle) distance is:`,
        rect,
        [fmt(euc), (x2 - x1) * (y2 - y1), Math.abs(x2 - x1), rect * rect],
        `Rectilinear = |Δx|+|Δy| = ${x2 - x1}+${y2 - y1} = ${rect}. (Euclidean would be ${fmt(euc)}.)`,
        ['Plant aisles are usually |Δx|+|Δy|.', 'Do not use √(Δx²+Δy²) unless they say straight-line.', `d = ${rect}.`],
        'Used Euclidean distance, or multiplied the deltas.'
      );
    }
  }
  for (const f of [10, 20, 50, 80]) {
    for (const d of [4, 5, 8, 12]) {
      const ld = f * d;
      push(
        `Department pair: flow f = ${f} trips, distance d = ${d}. Load-distance score contribution is:`,
        ld,
        [f + d, f - d, fmt(f / d), d],
        `LD = f·d = ${f}·${d} = ${ld}. Total score sums every pair.`,
        ['Load-distance = Σ (flow × distance).', 'Minimize the total for a layout.', `This pair ${ld}.`],
        'Added flow and distance, or reported only d.'
      );
    }
  }
  for (const D of [400, 600, 800, 1000]) {
    for (const t of [2, 3, 5]) {
      for (const avail of [400, 450, 480]) {
        for (const u of [0.8, 0.9]) {
          const raw = (D * t) / (avail * u);
          const m = ceil(raw);
          if (m > 20) continue;
          push(
            `Demand D = ${D} units, ${t} min/unit, ${avail} min available, utilization ${fmt(u)}. Machines required (round up) is:`,
            m,
            [fmt(raw), Math.max(1, Math.floor(raw)), D, t],
            `Machines = (D·t)/(available·util) = (${D}·${t})/(${avail}·${u}) = ${fmt(raw)} → ${m}.`,
            ['Required minutes = D × time/unit.', 'Divide by available × utilization.', 'Round machines up.'],
            'Forgot utilization, or rounded down.'
          );
        }
      }
    }
  }
  for (const w1 of [2, 3, 5]) {
    for (const w2 of [1, 4, 6]) {
      for (const x1 of [0, 2, 10]) {
        for (const x2 of [6, 8, 20]) {
          const xg = (w1 * x1 + w2 * x2) / (w1 + w2);
          push(
            `Center of gravity (x only): mass ${w1} at x=${x1} and mass ${w2} at x=${x2}. x̄ is:`,
            fmt(xg),
            [fmt((x1 + x2) / 2), w1 + w2, x1, x2],
            `x̄ = (Σ w x)/(Σ w) = (${w1}·${x1}+${w2}·${x2})/(${w1}+${w2}) = ${fmt(xg)}.`,
            ['Weighted average of coordinates.', 'Weights are shipments or demand.', `x̄ = ${fmt(xg)}.`],
            'Averaged locations with equal weight, or reported a raw coordinate.'
          );
        }
      }
    }
  }
  add('facilities', rows);
})();

// ——— Human factors & safety ———
(function human() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Human factors / safety (Handbook)') => {
    n += 1;
    rows.push(item(`HF${String(n).padStart(4, '0')}`, 'human', stem, c, w, exp, st, why, hb));
  };
  const reachJobs = [
    'reach a stop button',
    'reach a shelf bin',
    'reach a pedal',
    'reach an overhead valve',
    'reach a keyboard on a bench',
  ];
  const clearJobs = [
    'pass through a hatch',
    'fit a helmet clearance',
    'walk an aisle with elbows out',
    'sit under a conveyor',
    'clear a machine guard opening',
  ];
  for (const job of reachJobs) {
    for (const extra of ['on a mixed-gender line', 'for the smallest operators', 'when gloves add bulk', 'on first shift']) {
      push(
        `Designing to ${job} ${extra}, which population percentile should you design to?`,
        '5th (small) percentile',
        ['95th (large) percentile', '50th (average) only', '99th only'],
        'Reach/access: the smallest operators must still reach. Use a small percentile (typically 5th).',
        ['Ask: is this reach or clearance?', 'Reach → small percentile.', 'Clearance → large percentile.'],
        'Used 95th (that is clearance) or designed only to the average.'
      );
    }
  }
  for (const job of clearJobs) {
    for (const extra of ['with winter clothing', 'for the largest operators', 'including shoes', 'plus a tool belt']) {
      push(
        `Designing to ${job} ${extra}, which population percentile should you design to?`,
        '95th (large) percentile',
        ['5th (small) percentile', '50th (average) only', '1st only'],
        'Clearance: the largest operators must still fit. Use a large percentile (typically 95th).',
        ['Clearance / fit-through → large percentile.', 'Do not design only to the mean.', '5th is for reach.'],
        'Used 5th (reach) or the average only.'
      );
    }
  }
  const hier = [
    ['A solvent splash risk at a degreaser. Best first control in the hierarchy?', 'Eliminate / substitute the solvent', 'Require goggles and gloves only', 'Add a warning sign only', 'Write a longer SOP only'],
    ['Noise at 95 dBA on a punch press. Best engineering-level idea?', 'Enclose / damp the press', 'Hand out earplugs and stop', 'Tell people to stand farther away only', 'Do nothing if average exposure is 8 hr'],
    ['Lockout/tagout is which type of control?', 'Administrative (procedure)', 'Elimination of the energy source forever', 'PPE', 'Substitution of a different machine'],
    ['Hard hats on a site are:', 'PPE — last in the hierarchy', 'Elimination', 'Substitution', 'An engineering guard'],
    ['Best way to stop a fall hazard on a roof edge?', 'Guardrail / eliminate the edge exposure', 'Tell people to be careful', 'Issue a memo', 'Rely on a harness only as plan A'],
  ];
  const jobs2 = ['assembly cell', 'warehouse', 'lab', 'paint booth', 'loading dock'];
  for (const [stem, c, w1, w2, w3] of hier) {
    for (const where of jobs2) {
      push(
        `${stem} (context: ${where})`,
        c,
        [w1, w2, w3],
        'Hierarchy: elimination/substitution → engineering → administrative → PPE last.',
        ['Name the hazard.', 'Climb the hierarchy; PPE is not plan A.', `Best listed: ${c}.`],
        'Jumped to PPE or a sign when a better control exists.'
      );
    }
  }
  for (const load of [20, 25, 30, 40, 50]) {
    for (const rwl of [16, 20, 24, 28]) {
      const LI = load / rwl;
      push(
        `NIOSH: object weight ${load} lb, recommended weight limit RWL = ${rwl} lb. Lifting index LI is:`,
        fmt(LI),
        [load - rwl, load + rwl, rwl / load, rwl],
        `LI = load / RWL = ${load}/${rwl} = ${fmt(LI)}. LI > 1 means increased risk.`,
        ['LI = weight / RWL.', 'RWL already includes the multipliers.', `LI = ${fmt(LI)}.`],
        'Subtracted instead of dividing, or inverted RWL/load.'
      );
    }
  }
  const displays = [
    ['operator must read an exact pressure 147.2 psi', 'Digital display', 'Analog needle only', 'A colored light only', 'No display — train memory'],
    ['operator must see if tank level is rising or falling quickly', 'Analog / trend display', 'A 6-digit digital only', 'A written log 1/hour', 'No display'],
    ['alarm must be noticed in a noisy shop', 'Redundant visual + audible', 'A 4-pt font label only', 'A memo in the break room', 'Rely on coworkers'],
    ['emergency stop must be hit with a palm', 'Large mushroom pushbutton', 'A recessed key switch', 'A menu on a touchscreen only', 'A 2-mm toggle'],
  ];
  for (const [need, c, w1, w2, w3] of displays) {
    for (const extra of ['day shift', 'night shift', 'gloved hands', 'new hires']) {
      push(
        `Display/control: ${need} (${extra}). Best choice:`,
        c,
        [w1, w2, w3],
        'Digital for precise readout; analog for rate/trend; emergency controls large and reachable; alarms use more than one sense.',
        ['Match the task: precise number vs trend vs emergency.', 'Fit the control to gloves and stress.', `Choose: ${c}.`],
        'Picked a precise digital when they needed a trend, or a tiny control for an e-stop.'
      );
    }
  }
  for (const dB of [80, 85, 90, 95, 100]) {
    for (const hrs of [2, 4, 8]) {
      push(
        `Shop noise ${dB} dBA for ${hrs} hours. OSHA’s hierarchy still says the first engineering move is to:`,
        'Reduce the noise at the source / enclose it',
        ['Issue earplugs and stop there', 'Ignore it under 8 hours', 'Only write a warning in the handbook'],
        'Hearing protection is PPE (last). Engineering: quieter process, enclosure, damping. OSHA PEL context is 90 dBA TWA; 85 dBA is a common action level — still fix the source.',
        ['Name the energy (noise).', 'Engineering before PPE.', 'Duration does not make PPE plan A.'],
        'Jumped to earplugs as the only control.'
      );
    }
  }
  for (const p of [5, 50, 95]) {
    for (const dim of ['stature', 'sitting eye height', 'forward reach', 'shoulder breadth']) {
      const role = p === 5 ? 'reach / small user' : p === 95 ? 'clearance / large user' : 'adjustable / average starting point';
      push(
        `A table lists the ${p}th percentile ${dim}. That number is most appropriate when the design problem is:`,
        role,
        p === 5
          ? ['clearance for the largest user', 'only a maximum guard opening', 'fire-exit width for 99th']
          : p === 95
            ? ['reach for the smallest user', 'a pedal the 5th must hit', 'minimum shelf height for short operators']
            : ['the only clearance value you will ever use', 'the only reach value you will ever use', 'a substitute for 5th and 95th on a fixed design'],
        `${p}th ${dim}: ${role}. Fixed designs still need 5th (reach) and 95th (clearance); 50th is a start for adjustability.`,
        ['Match percentile to reach vs clearance vs adjust.', `${p}th → ${role}.`, 'Do not design a fixed workplace to the mean only.'],
        'Used 50th as if everyone were average, or swapped reach and clearance.'
      );
    }
  }
  add('human', rows);
})();

// ——— Work design ———
(function work() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Work measurement (Handbook)') => {
    n += 1;
    rows.push(item(`WK${String(n).padStart(4, '0')}`, 'work', stem, c, w, exp, st, why, hb));
  };
  for (const OT of [0.8, 1.0, 1.2, 1.5, 2.0]) {
    for (const r of [0.9, 1.0, 1.1, 1.2]) {
      const NT = money(OT * r);
      push(
        `Observed time OT = ${OT} min, performance rating ${fmt(r)}. Normal time NT is:`,
        NT,
        [OT, r, money(OT / r), money(OT + r)],
        `NT = OT × rating = ${OT} × ${fmt(r)} = ${fmt(NT)} min.`,
        ['Normal time levels the observation to 100% pace.', 'NT = OT × rating.', `NT = ${fmt(NT)}.`],
        'Forgot the rating, or divided instead of multiplied.'
      );
    }
  }
  for (const NT of [1, 1.2, 1.5, 2, 2.4]) {
    for (const A of [0.1, 0.15, 0.2]) {
      const st1 = money(NT / (1 - A));
      const st2 = money(NT * (1 + A));
      push(
        `Normal time NT = ${NT} min. Allowance A = ${fmt(A)} of shift time (PFD on the whole day). Standard time ST is closest to:`,
        st1,
        [st2, NT, money(NT * A), money(NT * (1 - A))],
        `When A is a fraction of the shift: ST = NT / (1 − A) = ${NT} / ${fmt(1 - A)} = ${fmt(st1)}.`,
        ['Ask how the allowance is defined.', 'Shift-based: ST = NT/(1−A).', 'Added-to-work: ST = NT(1+A) — different question.'],
        'Used ST = NT(1+A) when the problem said allowance is a fraction of the shift.'
      );
      push(
        `Normal time NT = ${NT} min. Allowance A = ${fmt(A)} added to the work time. Standard time ST is:`,
        st2,
        [st1, NT, money(NT * A), money(NT / A)],
        `When A is added to work: ST = NT(1+A) = ${NT}(1+${fmt(A)}) = ${fmt(st2)}.`,
        ['Added-to-work allowance: ST = NT(1+A).', 'Do not divide by (1−A) unless they said shift fraction.', `ST = ${fmt(st2)}.`],
        'Used NT/(1−A) when they said the allowance is added to the work.'
      );
    }
  }
  const rates = [0.7, 0.8, 0.9];
  for (const T1 of [100, 120, 160, 200]) {
    for (const lr of rates) {
      const b = Math.log(lr) / Math.log(2);
      for (const k of [2, 4, 8]) {
        const Tn = T1 * k ** b;
        push(
          `${fmt(lr * 100)}% learning curve, T1 = ${T1} min. Time for unit n = ${k} is closest to:`,
          fmt(Tn),
          [fmt(T1 * lr), fmt(T1 / k), fmt(T1 * k), fmt(T1 * lr * k)],
          `b = ln(${lr})/ln 2 = ${fmt(b)}. T_n = T1 · n^b = ${T1}·${k}^(${fmt(b)}) = ${fmt(Tn)}.`,
          ['T_n = T1 × n^b with b = ln(learning rate)/ln 2.', `${k} is a power of 2 so T doubles-index is handy.`, `T_${k} ≈ ${fmt(Tn)}.`],
          'Multiplied T1 by the rate once, or divided T1 by n.',
          'Learning curve (Handbook)'
        );
      }
    }
  }
  for (const x of [20, 30, 40, 50]) {
    for (const N of [80, 100, 160, 200]) {
      if (x >= N) continue;
      const p = x / N;
      push(
        `Work sampling: ${x} observations of “working” out of ${N}. Estimated proportion p is:`,
        fmt(p),
        [x, N, fmt(1 - p), fmt(x * N)],
        `p̂ = x/N = ${x}/${N} = ${fmt(p)}.`,
        ['Proportion = count / total observations.', 'Then CI uses √(p(1−p)/N).', `p̂ = ${fmt(p)}.`],
        'Reported the raw count, or 1−p (idle) when they asked working.'
      );
    }
  }
  for (const E of [0.03, 0.04, 0.05, 0.06]) {
    for (const p of [0.2, 0.3, 0.4, 0.5]) {
      for (const z of [1.96, 1.645]) {
        const nn = ceil((z * z * p * (1 - p)) / (E * E));
        push(
          `Work-sampling sample size: want E = ${E}, z = ${z}, guess p = ${p}. n is closest to (round up):`,
          nn,
          [ceil(z * p / E), ceil(z * z / E), ceil(p * (1 - p) * 100), Math.max(1, Math.floor((z * z * p * (1 - p)) / (E * E)))],
          `n = z² p(1−p)/E² = ${z}²·${p}·${fmt(1 - p)} / ${fmt(E * E)} = ${nn} (rounded up).`,
          ['Work sampling: n = z² p(1−p)/E².', 'E is the half-width of the proportion.', `n ≈ ${nn}.`],
          'Used a made-up n, or forgot to square z or E.',
          'Work sampling sample size (Handbook)'
        );
      }
    }
  }
  add('work', rows);
})();

// ——— Quality ———
(function quality() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Quality / SPC (Handbook)') => {
    n += 1;
    rows.push(item(`QL${String(n).padStart(4, '0')}`, 'quality', stem, c, w, exp, st, why, hb));
  };
  for (const USL of [20, 30, 50, 100]) {
    for (const LSL of [10, 12, 16]) {
      if (USL <= LSL + 4) continue;
      for (const sig of [1, 2, 2.5, 4]) {
        const cp = (USL - LSL) / (6 * sig);
        if (cp <= 0) continue;
        push(
          `USL = ${USL}, LSL = ${LSL}, σ = ${sig}. Process capability Cp is:`,
          fmt(cp),
          [fmt((USL - LSL) / (3 * sig)), fmt((USL - LSL) / sig), fmt(6 * sig), fmt(USL - LSL)],
          `Cp = (USL−LSL)/(6σ) = (${USL}−${LSL})/(6·${sig}) = ${fmt(cp)}.`,
          ['Cp ignores centering.', 'Divide the spec width by 6σ.', `Cp = ${fmt(cp)}.`],
          'Used 3σ in the denominator (that is closer to Cpk’s one-sided 3σ), or forgot to divide.'
        );
      }
    }
  }
  for (const USL of [22, 40, 60]) {
    for (const LSL of [10, 16]) {
      for (const mu of [14, 18, 20, 28]) {
        if (mu <= LSL || mu >= USL) continue;
        for (const sig of [2, 3]) {
          const cpu = (USL - mu) / (3 * sig);
          const cpl = (mu - LSL) / (3 * sig);
          const cpk = Math.min(cpu, cpl);
          push(
            `USL=${USL}, LSL=${LSL}, μ=${mu}, σ=${sig}. Cpk is:`,
            fmt(cpk),
            [fmt(Math.max(cpu, cpl)), fmt((USL - LSL) / (6 * sig)), fmt(cpu + cpl), fmt(mu / sig)],
            `Cpu=(${USL}−${mu})/(3·${sig})=${fmt(cpu)}, Cpl=(${mu}−${LSL})/(3·${sig})=${fmt(cpl)}. Cpk = min = ${fmt(cpk)}.`,
            ['Cpk = min(USL−μ, μ−LSL) / (3σ).', 'Cpk ≤ Cp. Off-center ⇒ Cpk < Cp.', `Cpk = ${fmt(cpk)}.`],
            'Reported the larger one-sided index, or Cp instead of Cpk.'
          );
        }
      }
    }
  }
  for (const xbar of [20, 50, 80]) {
    for (const Rbar of [2, 4, 6]) {
      for (const A2 of [0.577, 0.729]) {
        const ucl = money(xbar + A2 * Rbar);
        const lcl = money(xbar - A2 * Rbar);
        push(
          `x̄ chart: grand mean x̄ = ${xbar}, R̄ = ${Rbar}, A2 = ${A2}. UCL is closest to:`,
          ucl,
          [lcl, money(xbar + Rbar), money(A2 * Rbar), xbar],
          `UCL = x̄ + A2 R̄ = ${xbar} + ${A2}·${Rbar} = ${fmt(ucl)}.`,
          ['x̄ chart: x̄ ± A2 R̄.', 'A2 comes from the subgroup-size table.', `UCL ${fmt(ucl)}.`],
          'Used x̄+R̄ (forgot A2), or reported LCL.'
        );
      }
    }
  }
  for (const Rbar of [2, 3, 5, 8]) {
    for (const D4 of [2.114, 2.282]) {
      const ucl = money(D4 * Rbar);
      push(
        `R chart: R̄ = ${Rbar}, D4 = ${D4}. UCL_R is closest to:`,
        ucl,
        [Rbar, money(Rbar / D4), money(D4 + Rbar), 0],
        `UCL_R = D4 R̄ = ${D4}·${Rbar} = ${fmt(ucl)}. LCL_R = D3 R̄ (often 0 for small n).`,
        ['R chart uses D3, D4 from the table.', 'UCL = D4 × R̄.', `UCL ${fmt(ucl)}.`],
        'Reported R̄, or added D4+R̄.'
      );
    }
  }
  for (const Rbar of [4, 6, 8, 10]) {
    for (const d2 of [2.059, 2.326]) {
      const sig = Rbar / d2;
      push(
        `Estimate σ from R̄ = ${Rbar}, d2 = ${d2}. σ̂ is closest to:`,
        fmt(sig),
        [Rbar, money(Rbar * d2), d2, fmt(Rbar / 6)],
        `σ̂ ≈ R̄ / d2 = ${Rbar}/${d2} = ${fmt(sig)}.`,
        ['Range-to-sigma factor is d2.', 'σ̂ = R̄/d2.', `≈ ${fmt(sig)}.`],
        'Multiplied by d2, or used R̄/6 with no table.'
      );
    }
  }
  for (const def of [2, 5, 10, 20]) {
    for (const N of [1000, 2000, 10000]) {
      const dpu = def / N;
      const dpmo = (def / N) * 1e6;
      push(
        `${def} defects in ${N} units (one opportunity each). DPU is:`,
        fmt(dpu),
        [def, N, fmt(dpmo), fmt(1 - dpu)],
        `DPU = defects/units = ${def}/${N} = ${fmt(dpu)}. DPMO = DPU × 10^6 = ${fmt(dpmo)}.`,
        ['DPU = defects / units.', 'DPMO multiplies by a million.', `DPU = ${fmt(dpu)}.`],
        'Reported the raw defect count, or DPMO when they asked DPU.'
      );
    }
  }
  add('quality', rows);
})();

// ——— Systems & reliability ———
(function systems() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Reliability (Handbook)') => {
    n += 1;
    rows.push(item(`RL${String(n).padStart(4, '0')}`, 'systems', stem, c, w, exp, st, why, hb));
  };
  for (const r1 of [0.8, 0.9, 0.95]) {
    for (const r2 of [0.8, 0.9, 0.99]) {
      for (const r3 of [0.7, 0.85, 0.9]) {
        const rs = r1 * r2 * r3;
        push(
          `Series system R1=${r1}, R2=${r2}, R3=${r3}. System reliability is:`,
          fmt(rs),
          [fmt(r1 + r2 + r3), fmt(Math.min(r1, r2, r3)), fmt(1 - (1 - r1) * (1 - r2) * (1 - r3)), 1],
          `Series: Rs = R1 R2 R3 = ${r1}·${r2}·${r3} = ${fmt(rs)}.`,
          ['Series multiplies reliabilities.', 'System is no better than the weakest, and usually worse.', `Rs = ${fmt(rs)}.`],
          'Added the R’s, or used the parallel formula 1−Π(1−Ri).'
        );
      }
    }
  }
  for (const r of [0.6, 0.7, 0.8, 0.9]) {
    for (const k of [2, 3, 4]) {
      const rp = 1 - (1 - r) ** k;
      push(
        `${k} identical units in parallel, each R = ${r}. System reliability is:`,
        fmt(rp),
        [fmt(r ** k), fmt(k * r), fmt(1 - r), 1],
        `Rp = 1 − (1−R)^n = 1 − (${fmt(1 - r)})^${k} = ${fmt(rp)}.`,
        ['Parallel fails only if every unit fails.', 'Rp = 1 − Π(1−Ri).', `Rp = ${fmt(rp)}.`],
        'Multiplied the R’s (that is series), or added nR (can exceed 1).'
      );
    }
  }
  for (const lam of [0.001, 0.002, 0.01, 0.02]) {
    for (const t of [10, 50, 100, 200]) {
      const Rt = Math.exp(-lam * t);
      push(
        `Constant failure rate λ = ${lam} /hr. Reliability at t = ${t} hr is closest to:`,
        fmt(Rt),
        [fmt(lam * t), fmt(1 - lam * t), fmt(1 / lam), fmt(Math.exp(-lam))],
        `R(t) = e^{−λt} = exp(−${lam}·${t}) = ${fmt(Rt)}.`,
        ['Exponential: R(t)=e^{−λt}.', 'MTTF = 1/λ is not R(t).', `R(${t}) ≈ ${fmt(Rt)}.`],
        'Reported λt, 1−λt (rare-event approx without e), or MTTF.'
      );
    }
  }
  for (const lam of [0.001, 0.002, 0.005, 0.01, 0.02, 0.05]) {
    const mttf = 1 / lam;
    push(
      `Exponential failures, λ = ${lam} per hour. MTTF (hours) is:`,
      fmt(mttf),
      [lam, fmt(1 / (lam * lam)), fmt(lam * 1000), 0],
      `MTTF = 1/λ = 1/${lam} = ${fmt(mttf)} hours.`,
      ['Constant hazard ⇒ MTTF = 1/λ.', 'MTTR is repair time, not this.', `MTTF = ${fmt(mttf)}.`],
      'Reported λ, or confused with MTTR.'
    );
  }
  for (const mttf of [100, 200, 400, 500]) {
    for (const mttr of [4, 5, 10, 20]) {
      const A = mttf / (mttf + mttr);
      push(
        `MTTF = ${mttf} hr, MTTR = ${mttr} hr. Inherent availability A is:`,
        fmt(A),
        [fmt(mttf / mttr), fmt(mttr / (mttf + mttr)), fmt(1 / mttf), mttr],
        `A = MTTF / (MTTF + MTTR) = ${mttf}/(${mttf}+${mttr}) = ${fmt(A)}.`,
        ['Availability is uptime fraction.', 'A = MTTF/(MTTF+MTTR).', `A = ${fmt(A)}.`],
        'Used MTTF/MTTR, or reported downtime fraction MTTR/(MTTF+MTTR).'
      );
    }
  }
  for (const S of [4, 6, 8, 10]) {
    for (const O of [3, 5, 7]) {
      for (const D of [2, 4, 6]) {
        const rpn = S * O * D;
        push(
          `FMEA: severity ${S}, occurrence ${O}, detection ${D}. RPN is:`,
          rpn,
          [S + O + D, S * O, Math.max(S, O, D), S + O * D],
          `RPN = S × O × D = ${S}·${O}·${D} = ${rpn}.`,
          ['Risk priority number multiplies the three 1–10 scores.', 'Higher RPN ⇒ higher priority.', `RPN = ${rpn}.`],
          'Added the scores, or omitted detection.'
        );
      }
    }
  }
  add('systems', rows);
})();

// ——— Applied IE statistics ———
(function iestats() {
  const rows = [];
  let n = 0;
  const push = (stem, c, w, exp, st, why, hb = 'Applied statistics (Handbook)') => {
    n += 1;
    rows.push(item(`IS${String(n).padStart(4, '0')}`, 'ie-stats', stem, c, w, exp, st, why, hb));
  };
  for (const mu of [10, 50, 100]) {
    for (const sig of [2, 5, 10]) {
      for (const z of [-2, -1, 1, 2]) {
        const x = mu + z * sig;
        push(
          `Normal process, μ = ${mu}, σ = ${sig}. z-score of x = ${x} is:`,
          z,
          [x - mu, fmt((x - mu) / (sig * sig)), -z, 0],
          `z = (x−μ)/σ = (${x}−${mu})/${sig} = ${z}.`,
          ['z = (x−μ)/σ.', 'Subtract, then divide by σ (not σ²).', `z = ${z}.`],
          'Forgot to divide by σ, or divided by variance.'
        );
      }
    }
  }
  for (const n of [4, 9, 16, 25, 36, 49, 64, 81, 100]) {
    for (const sig of [3, 6, 12]) {
      const se = sig / Math.sqrt(n);
      push(
        `σ = ${sig}, n = ${n}. Standard error of the mean σ/√n is:`,
        fmt(se),
        [sig, fmt(sig / n), fmt(sig * Math.sqrt(n)), n],
        `SE = ${sig}/√${n} = ${sig}/${Math.sqrt(n)} = ${fmt(se)}.`,
        ['SE of x̄ is σ/√n, not σ.', `√${n} = ${Math.sqrt(n)}.`, `SE = ${fmt(se)}.`],
        'Used σ or σ/n instead of σ/√n.'
      );
    }
  }
  for (const z of [1.645, 1.96, 2.576]) {
    for (const sig of [2, 4, 5, 10]) {
      for (const E of [0.5, 1, 2]) {
        const raw = ((z * sig) / E) ** 2;
        const nn = ceil(raw);
        if (nn > 4000) continue;
        push(
          `Sample size for a mean: z = ${z}, σ = ${sig}, max error E = ${E}. n (round up) is:`,
          nn,
          [fmt(raw), Math.max(1, Math.floor(raw)), ceil(z * sig / E), ceil(z * sig)],
          `n = (zσ/E)² = (${z}·${sig}/${E})² = ${fmt(raw)} → ${nn}.`,
          ['n = (z σ / E)² for a mean.', 'Always round the sample size up.', `n = ${nn}.`],
          'Forgot to square, or rounded down.'
        );
      }
    }
  }
  for (const xbar of [48, 50, 52, 55]) {
    for (const mu0 of [50]) {
      for (const se of [1, 2, 4]) {
        const z = (xbar - mu0) / se;
        push(
          `Test H0: μ = ${mu0}. x̄ = ${xbar}, SE = ${se}. Test statistic z is:`,
          fmt(z),
          [xbar - mu0, fmt((xbar - mu0) * se), se, mu0],
          `z = (x̄ − μ0)/SE = (${xbar}−${mu0})/${se} = ${fmt(z)}.`,
          ['Write H0 first.', 'z = (x̄−μ0)/(σ/√n).', `z = ${fmt(z)}.`],
          'Reported x̄−μ0 without dividing by SE.'
        );
      }
    }
  }
  const concepts = [
    ['n = 8, σ unknown. Which distribution for a mean CI?', 't (df = 7)', 'z (standard normal)', 'chi-square with 8 df', 'F with 8 and 8 df'],
    ['p-value = 0.03, α = 0.05. Decision?', 'Reject H0', 'Accept H0 as proven', 'Fail to reject H0', 'Increase α to 0.01'],
    ['p-value = 0.20, α = 0.05. Decision?', 'Fail to reject H0', 'Accept H0 as proven true', 'Reject H0', 'The sample size was invalid'],
    ['ANOVA is primarily used to:', 'Compare means of 3+ groups', 'Estimate a single proportion', 'Replace every t-test with z', 'Compute Cp only'],
    ['A 2³ factorial has how many runs in one replicate?', '8', '6', '9', '3'],
    ['Type I error is:', 'Reject H0 when H0 is true', 'Fail to reject H0 when it is false', 'Any measurement error', 'Using z instead of t'],
    ['Type II error is:', 'Fail to reject H0 when Ha is true', 'Reject H0 when H0 is true', 'A calibration error', 'Using n−1 by mistake'],
    ['R² in simple regression is:', 'Fraction of y-variance explained by x', 'The slope', 'The intercept', 'Always equal to the correlation r'],
  ];
  const wraps = ['on a filling line', 'in a supplier audit', 'during DOE kickoff', 'in a Six Sigma project', 'for intern training'];
  for (const [stem, c, w1, w2, w3] of concepts) {
    for (const w of wraps) {
      push(
        `${stem} (${w})`,
        c,
        [w1, w2, w3],
        `${c}. Unknown σ and small n → t. Small p ⇒ reject H0 (we do not “prove” H0). ANOVA compares several means. 2³ = 8 runs.`,
        ['Identify estimate vs test vs experiment.', 'Small n + unknown σ → t, df = n−1.', `Answer: ${c}.`],
        'Used z when t was required, or said we “accept H0” as proven.'
      );
    }
  }
  add('ie-stats', rows);
})();

const byTopic = {};
for (const q of bank) {
  const t = q.topics[0];
  byTopic[t] = (byTopic[t] || 0) + 1;
}

const NEED = 110;
for (const [topic, count] of Object.entries(byTopic)) {
  if (count < NEED) console.warn('Topic short:', topic, count);
}

const grouped = {};
for (const q of bank) {
  const t = q.topics[0];
  if (!grouped[t]) grouped[t] = [];
  grouped[t].push(q);
}

function templateKey(stem) {
  return String(stem).replace(/\$?[\d.]+/g, '#').replace(/\s+/g, ' ');
}

const final = [];
for (const t of Object.keys(grouped)) {
  const list = grouped[t];
  const seenStem = new Set();
  const uniq = list.filter((q) => {
    if (seenStem.has(q.stem)) return false;
    seenStem.add(q.stem);
    return true;
  });
  const families = [];
  const famIndex = new Map();
  for (const q of uniq) {
    const key = templateKey(q.stem);
    if (!famIndex.has(key)) {
      famIndex.set(key, families.length);
      families.push([]);
    }
    families[famIndex.get(key)].push(q);
  }
  const diagA = [];
  const diagB = [];
  for (let i = 0; i < families.length && (diagA.length < 3 || diagB.length < 3); i++) {
    const fam = families[i];
    if (diagA.length < 3 && fam[0]) diagA.push(fam[0]);
    if (diagB.length < 3 && fam[1]) diagB.push(fam[1]);
    else if (diagB.length < 3 && fam[0] && !diagA.includes(fam[0])) diagB.push(fam[0]);
  }
  const used = new Set([...diagA, ...diagB]);
  // If a family had only one item, pull leftover uniques for B
  if (diagB.length < 3) {
    for (const q of uniq) {
      if (used.has(q)) continue;
      diagB.push(q);
      used.add(q);
      if (diagB.length >= 3) break;
    }
  }
  diagA.forEach((q) => {
    q.pool = 'diag-a';
    final.push(q);
  });
  diagB.forEach((q) => {
    q.pool = 'diag-b';
    final.push(q);
  });
  for (const q of uniq) {
    if (used.has(q)) continue;
    q.pool = 'drill';
    final.push(q);
  }
}

writeFileSync(
  outPath,
  `/** FE Industrial MCQ bank. Generated — do not hand-edit. */\nwindow.IE_QUESTIONS = ${JSON.stringify(final)};\n`,
  'utf8'
);
const counts = {};
const pools = { 'diag-a': 0, 'diag-b': 0, drill: 0 };
for (const q of final) {
  counts[q.topics[0]] = (counts[q.topics[0]] || 0) + 1;
  pools[q.pool] += 1;
}
console.log('total', final.length, 'pools', pools, 'byTopic', counts);
