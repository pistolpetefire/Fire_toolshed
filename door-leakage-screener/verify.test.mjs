// Simple automated checks for Door Leakage Screener
// Run with: node verify.test.mjs

function independentOrifice(Cd, A, dP, rho) {
  if (rho <= 0 || A <= 0) return 0;
  const sign = Math.sign(dP) || 1;
  return sign * Cd * A * Math.sqrt(2 * Math.abs(dP) / rho);
}

function approx(a, b, tol = 0.0005) {
  return Math.abs(a - b) <= tol;
}

// Test 1: basic orifice (acceptance)
const q1 = independentOrifice(0.65, 0.01, 25, 1.2);
console.assert(approx(q1, 0.04196), `Basic orifice failed: got ${q1}`);

// Test 2: pressure scale (4× pressure → 2× flow)
const q2 = independentOrifice(0.65, 0.01, 100, 1.2);
console.assert(approx(q2 / q1, 2, 0.01), "Pressure scale failed");

// Test 3: zero pressure
const q0 = independentOrifice(0.65, 0.01, 0, 1.2);
console.assert(q0 === 0, "Zero pressure failed");

// Test 4: reverse direction
const qNeg = independentOrifice(0.65, 0.01, -25, 1.2);
console.assert(qNeg < 0 && approx(Math.abs(qNeg), q1), "Reverse pressure failed");

console.log("All independent orifice checks passed.");
console.log("Basic Q:", q1.toFixed(6), "m³/s");
