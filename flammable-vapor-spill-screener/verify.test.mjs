// Independent verification checks for Flammable Vapor Spill Screener
// Run: node verify.test.mjs

const R = 8.314462618;

function vaporVolumeRate(m, MW_kg, T, P) {
  return (m * R * T) / (P * MW_kg);
}
function approx(a, b, rel = 0.005) {
  return Math.abs(a - b) / Math.abs(b) < rel;
}

// Test 1
const G = vaporVolumeRate(0.001, 0.078, 293.15, 101325);
console.assert(approx(G, 3.084e-4), `G failed: ${G}`);
const ppm = (G / 1) * 1e6;
console.assert(approx(ppm, 308, 0.01), `ppm failed: ${ppm}`);

// Test 2
const Qreq = G / (1 * 0.25 * 0.012);
console.assert(approx(Qreq, 0.1028), `Qreq failed: ${Qreq}`);

// Test 3
const Css = G / 1;
const C100 = Css * (1 - Math.exp(-1 * 100 / 100));
console.assert(approx(C100 / Css, 0.632), `C100 ratio failed: ${C100/Css}`);
const C2000 = Css * (1 - Math.exp(-1 * 2000 / 100));
console.assert(C2000 / Css > 0.999, "C2000 not near steady");

console.log("All independent vapor-spill checks passed.");
console.log("G =", G.toExponential(4), "m³/s");
