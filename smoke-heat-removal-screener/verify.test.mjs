// Independent checks for Smoke/Heat Removal & Purge Screener
// Run: node verify.test.mjs

function naturalVents(area, ratio, ventSize) {
  const req = area * ratio;
  const count = ventSize > 0 ? Math.ceil(req / ventSize) : 0;
  return { req, count };
}
function mechanical(vol, ach) {
  return vol * ach / 60;
}
function purgeRemaining(C0, ach, t_min) {
  return C0 * Math.exp(-ach * t_min / 60);
}
function timeTo(C0, Ct, ach) {
  return (-Math.log(Ct / C0) / ach) * 60;
}

function approx(a, b, tol = 0.1) { return Math.abs(a - b) <= tol; }

// 1. 1:100 on 50,000 ft² → 500 ft²; 32 ft² vents → 16 units
const nat = naturalVents(50000, 0.01, 32);
console.assert(approx(nat.req, 500), `Natural required failed: ${nat.req}`);
console.assert(nat.count === 16, `Natural count failed: ${nat.count}`);

// 2. 1,500,000 ft³ at 2 ACH → 50,000 cfm
const mech = mechanical(1500000, 2);
console.assert(approx(mech, 50000), `Mechanical failed: ${mech}`);

// 3. 6 ACH, 10 min → ~36.8%; 1% takes ~46.05 min
const rem = purgeRemaining(1, 6, 10);
console.assert(approx(rem, 0.368, 0.01), `Purge remaining failed: ${rem}`);
const t = timeTo(1, 0.01, 6);
console.assert(approx(t, 46.05, 0.1), `Time to 1% failed: ${t}`);

console.log("All independent checks passed.");
console.log("Natural:", nat.req, "ft²,", nat.count, "units");
console.log("Mechanical:", mech, "cfm");
console.log("Purge 10 min:", (rem*100).toFixed(1) + "%; time to 1%:", t.toFixed(2), "min");
