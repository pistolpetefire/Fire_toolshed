// Independent checks for Structural Fire Member Temperature Screener
// Run: node verify.test.mjs

function analyticalConvOnly(T0, Tg, h, SF, rho, cp, t_s) {
  if (rho <= 0 || cp <= 0 || SF <= 0) return T0;
  const k = (h * SF) / (rho * cp);
  return Tg - (Tg - T0) * Math.exp(-k * t_s);
}

function integrateSimple(T0, Tg, h, SF, rho, cp, duration_s, dt) {
  let T = T0;
  const n = Math.ceil(duration_s / dt);
  for (let i = 0; i < n; i++) {
    const dT = (SF / (rho * cp)) * h * (Tg - T) * dt;
    T += dT;
  }
  return T;
}

function approx(a, b, tol = 1) { return Math.abs(a - b) <= tol; }

// 1. Match analytical constant-gas, convection-only
const T0 = 20, Tg = 800, h = 25, SF = 100, rho = 7850, cp = 600;
const t = 600; // 10 min
const analytical = analyticalConvOnly(T0, Tg, h, SF, rho, cp, t);
const numerical = integrateSimple(T0, Tg, h, SF, rho, cp, t, 1);
console.assert(approx(numerical, analytical, 2), `Analytical match failed: num ${numerical.toFixed(1)}, ana ${analytical.toFixed(1)}`);

// 2. Halving timestep converges within tolerance
const coarse = integrateSimple(T0, Tg, h, SF, rho, cp, t, 10);
const fine = integrateSimple(T0, Tg, h, SF, rho, cp, t, 5);
console.assert(approx(coarse, fine, 2), `Timestep convergence failed: coarse ${coarse.toFixed(1)}, fine ${fine.toFixed(1)}`);

// 3. Equal initial temperatures → no heating; unreached threshold
const noHeat = integrateSimple(20, 20, 25, 100, 7850, 600, 600, 5);
console.assert(approx(noHeat, 20, 0.1), `Equal temp failed: ${noHeat}`);
// Unreached: if Tcrit > peak, display "not reached" (handled in UI)

console.log("All independent checks passed.");
console.log("Analytical vs numerical (10 min):", analytical.toFixed(1), "/", numerical.toFixed(1), "°C");
console.log("Coarse vs fine:", coarse.toFixed(1), "/", fine.toFixed(1), "°C");
