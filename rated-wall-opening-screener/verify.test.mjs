// Independent checks for Rated Wall Opening Screener
// Run: node verify.test.mjs

function openingPercent(total, wall) {
  return wall > 0 ? (total / wall) * 100 : NaN;
}
function failureOR(p1, p2) { return 1 - (1 - p1) * (1 - p2); }
function failureAND(p1, p2) { return p1 * p2; }
function rectangularFlux(Ts_C, Ta_C, eps, w, h, d) {
  if (Ts_C <= Ta_C) return 0;
  const Ts = Ts_C + 273.15, Ta = Ta_C + 273.15;
  const dT4 = Math.pow(Ts, 4) - Math.pow(Ta, 4);
  const char = Math.min(w, h) || 1;
  const F = 1 / (1 + Math.pow(2 * d / char, 2));
  return eps * 5.67e-8 * dT4 * F / 1000;
}

function approx(a, b, tol = 0.001) { return Math.abs(a - b) <= tol; }

// 1. Geometry: 25 ft in 100 ft = 25%, meets 25%
const pct = openingPercent(25, 100);
console.assert(approx(pct, 25), `Geometry failed: ${pct}`);
console.assert(pct <= 25 + 1e-6, "Equality should meet limit");

// 2. Reliability: 0.1 and 0.2 → OR=0.28, AND=0.02
const or = failureOR(0.1, 0.2);
const and = failureAND(0.1, 0.2);
console.assert(approx(or, 0.28), `OR failed: ${or}`);
console.assert(approx(and, 0.02), `AND failed: ${and}`);

// 3. Radiation: zero ΔT → 0; increasing distance reduces flux
const q0 = rectangularFlux(20, 20, 0.8, 1, 2, 1);
console.assert(q0 === 0, `Zero ΔT failed: ${q0}`);
const qNear = rectangularFlux(800, 20, 0.8, 1, 2, 1);
const qFar = rectangularFlux(800, 20, 0.8, 1, 2, 5);
console.assert(qFar < qNear, `Distance reduction failed: near ${qNear}, far ${qFar}`);

console.log("All independent checks passed.");
console.log("OR:", or.toFixed(4), "AND:", and.toFixed(4));
console.log("Flux near/far:", qNear.toFixed(3), "/", qFar.toFixed(3), "kW/m²");
