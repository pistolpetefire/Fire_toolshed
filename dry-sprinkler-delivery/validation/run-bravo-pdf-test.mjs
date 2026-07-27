/**
 * Regression against Tyco HW printout:
 *   C:\\Users\\kdclay\\Downloads\\12K2.25@60 PSI CALS.pdf
 * Project Bravo — 12 × K25.2 @ 60 psi, FMDS 8-9 UUP, wet system.
 *
 * Note: The printout is a full gridded wet calc (listed software). Our app is
 * tree/branch + simplified delivery. This test validates:
 *   1) Hazen–Williams pf / Pf on published pipe rows (within 0.1 psi / ~1%)
 *   2) K√P design flow
 *   3) App engine path walk on a simplified riser/main feed path
 *   4) Volume scale vs stated system volume (order-of-magnitude)
 *
 * Run: node validation/run-bravo-pdf-test.mjs
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import vm from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log("  OK  ", msg);
  } else {
    failed++;
    console.error("  FAIL", msg);
  }
}
function almost(a, b, tol, msg) {
  assert(Math.abs(a - b) <= tol, `${msg} (got ${a}, expected ${b} ± ${tol})`);
}

const pf = (Q, C, d) =>
  (4.52 * Math.pow(Q, 1.85)) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));

console.log("\n=== Project Bravo PDF — HW regression ===\n");
console.log("Source: 12K2.25@60 PSI CALS.pdf · Tyco calc · Wet · 12×K25.2@60\n");

// ── Design summary from PDF pages 1–2 ──────────────────────────────────────
console.log("Design summary (from printout)");
const K = 25.2;
const Pmin = 60;
const qHead = K * Math.sqrt(Pmin);
almost(qHead, 195.2, 0.05, "K√P = 25.2×√60 = 195.2 gpm/head");
almost(12 * qHead, 2342.4, 0.1, "12×K√P ≈ 2342 gpm min (print peaking total 2359.8)");
console.log("  Print overhead sprinkler flow: 2359.8 gpm · hose 250 · total 2609.8");
console.log("  Print system volume: 5312.5 gal · Type: Wet · Occupancy: UUP / FMDS 8-9");
console.log("  Required at remote heads: 60 psi · Demand w/o pump: 127.9 psi @ 2359.8 gpm\n");

// ── Segment-level HW (PIPE INFORMATION sheets) ─────────────────────────────
// Columns: Q (pipe total flow), C, actual ID, L_total (incl EL), print Pf/ft, print Pf
console.log("Hazen–Williams segment checks (printout Pf)");
const segs = [
  { lab: "S2→S3 branch", Q: 117.1, C: 120, d: 2.635, L: 10, ppf: 0.0386, pPf: 0.4 },
  { lab: "S3→S4 branch", Q: 313.1, C: 120, d: 2.635, L: 10, ppf: 0.2384, pPf: 2.4 },
  { lab: "S4→104 branch", Q: 513.1, C: 120, d: 2.635, L: 38.81, ppf: 0.595, pPf: 23.1 },
  { lab: "104→105 8\"", Q: 513.1, C: 120, d: 8.329, L: 10, ppf: 0.0022, pPf: 0.0 },
  { lab: "105→003 8\"", Q: 1026.2, C: 120, d: 8.329, L: 10, ppf: 0.0079, pPf: 0.1 },
  { lab: "016→042 2.5\"", Q: 129.6, C: 120, d: 2.635, L: 245.25, ppf: 0.0466, pPf: 11.4 },
  { lab: "042→045 8\" feed", Q: 2359.8, C: 120, d: 8.329, L: 69.3, ppf: 0.037, pPf: 2.6 },
  { lab: "045→049 10\"", Q: 2359.8, C: 120, d: 10.42, L: 270.85, ppf: 0.0124, pPf: 3.4 },
  { lab: "054→060 10\" C140", Q: 2359.8, C: 140, d: 10.58, L: 784.24, ppf: 0.0087, pPf: 6.8 },
  { lab: "S1→082 branch", Q: 273.4, C: 120, d: 2.635, L: 192.91, ppf: 0.1855, pPf: 35.8 },
  { lab: "S1→S2 short", Q: 78.1, C: 120, d: 2.635, L: 10, ppf: 0.0182, pPf: 0.2 },
];

let maxAbsPf = 0;
for (const s of segs) {
  const e = pf(s.Q, s.C, s.d);
  const E = e * s.L;
  maxAbsPf = Math.max(maxAbsPf, Math.abs(E - s.pPf));
  almost(e, s.ppf, 0.002, `${s.lab} pf/ft eng=${e.toFixed(4)} print=${s.ppf}`);
  almost(E, s.pPf, 0.12, `${s.lab} Pf eng=${E.toFixed(2)} print=${s.pPf}`);
}
console.log(`  Max |ΔPf| across segments: ${maxAbsPf.toFixed(3)} psi\n`);

// ── App engine bootstrap ───────────────────────────────────────────────────
console.log("App engine — simplified feed path (remote branch + mains @ design Q)");
const appSrc = readFileSync(join(root, "assets", "app.js"), "utf8");
const store = new Map();
const sandbox = {
  console,
  Math,
  Date,
  JSON,
  parseFloat,
  Number,
  String,
  Array,
  Object,
  Map,
  Set,
  Error,
  performance: { now: () => Date.now() },
  document: {
    readyState: "complete",
    documentElement: { classList: { toggle: () => {} } },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({
      className: "",
      textContent: "",
      style: {},
      appendChild: () => {},
      addEventListener: () => {},
      click: () => {},
      remove: () => {},
    }),
    body: { appendChild: () => {} },
  },
  window: {},
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  CustomEvent: function () {},
  URL: { createObjectURL: () => "blob:t", revokeObjectURL: () => {} },
  Blob: function () {},
  confirm: () => true,
  navigator: {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(appSrc, sandbox, { filename: "app.js" });
const API = sandbox.window.DrySprinklerDelivery || sandbox.DrySprinklerDelivery;
assert(!!API, "DrySprinklerDelivery API loaded");

/**
 * Feed-main path only at full overhead Q = 2359.8 gpm (PDF pipes that
 * actually carry that flow). Do NOT put 2.5" branches on this single-Q walk —
 * the listed model peaks many branches; a tree tool with one Q would invent
 * huge friction on small pipe.
 *
 * Print friction on these feed rows ≈ 2.6+3.4+1.1+6.8+… ≈ 15–20 psi
 * + elev remote→pump ≈ 13 psi + 60 remote ≈ order 90–130 psi region.
 */
const feedSegments = [
  {
    id: "m2",
    from: "N042",
    to: "N045",
    lengthFt: 6.36,
    nominal: "8",
    schedule: "10",
    idIn: 8.329,
    cFactor: 120,
    elevFt: -3.14, // elev drop toward supply (045 lower)
    fittings: {},
    elOverride: 62.94,
    notes: "PDF 042-045 Pf≈2.6",
  },
  {
    id: "m3",
    from: "N045",
    to: "N049",
    lengthFt: 195.48,
    nominal: "8",
    schedule: "10",
    idIn: 10.42,
    cFactor: 120,
    elevFt: -18.14,
    fittings: {},
    elOverride: 75.36,
    notes: "PDF 045-049 Pf≈3.4",
  },
  {
    id: "m4",
    from: "N049",
    to: "N054",
    lengthFt: 8.72 + 1.59 + 1.17 + 0.88,
    nominal: "8",
    schedule: "10",
    idIn: 10.42,
    cFactor: 120,
    elevFt: -8.36,
    fittings: {},
    elOverride: 82.21,
    notes: "PDF 049–054 + valves approx",
  },
  {
    id: "m5",
    from: "N054",
    to: "PUMP",
    lengthFt: 558.52,
    nominal: "8",
    schedule: "10",
    idIn: 10.58,
    cFactor: 140,
    elevFt: 0,
    fittings: {},
    elOverride: 225.72,
    notes: "PDF 054-060 DI C140 Pf≈6.8",
  },
];

// Hand sum of print Pf on feed-only rows used above
const printFeedPf = 2.6 + 3.4 + 1.1 + 0.9 + 0.0 + 0.0 + 6.8; // ~14.8 from sheets
const printFeedElevPsi = (3.14 + 18.14 + 8.36) * 0.433; // rise remote side → ~12.9

API.setState({
  ...API.defaultState(),
  projectName: "Project Bravo — PDF feed mains @ 2359.8 gpm",
  facility: "1090 PACIFIC AVENUE, BREMEN, GA",
  preparedBy: "Paul C (from printout)",
  company: "Haskell",
  occupancyDesc: "UUP · FMDS 8-9 · 12×K25.2@60 · WET listed calc (feed path only)",
  hazardId: "highpiled",
  openHeads: 4,
  designMode: "totalflow",
  totalDesignFlowGpm: 2359.8,
  minPressurePsi: 60,
  residualSupplyPsi: 127.9,
  kFactor: 25.2,
  qodPresent: false,
  includeFittingVolume: false,
  supplyNode: "PUMP",
  remoteNodes: ["N042"],
  fillFlowGpm: null,
  segments: feedSegments,
  notes:
    "Feed-main subset from 12K2.25@60 PSI CALS.pdf at full overhead Q. Not the full gridded model.",
});

const r = API.calculate();
console.log("\n  App results (FEED MAINS only @ 2359.8 gpm, remote P=60 at N042):");
console.log(`  Path: ${r.pathNodes.join(" → ")}`);
console.log(`  Design Q: ${r.designFlowGpm} gpm`);
console.log(`  Path volume: ${r.totalVolGal} gal (print entire system 5312.5 gal)`);
console.log(`  Friction Σ: ${r.hydraulics.totalFrictionPsi} psi (print feed rows ~${printFeedPf.toFixed(1)} psi)`);
console.log(`  Elev Σ: ${r.hydraulics.totalElevPsi} psi (hand ~${printFeedElevPsi.toFixed(1)} psi)`);
console.log(`  Required @ PUMP: ${r.hydraulics.supplyRequiredPsi} psi`);
console.log(`  Print FULL system demand w/o pump: 127.9 psi (includes all branches/grid)`);
console.log(
  `  Feed-only hand estimate: 60 + ${printFeedPf.toFixed(1)} fric + ${printFeedElevPsi.toFixed(1)} elev ≈ ${(60 + printFeedPf + printFeedElevPsi).toFixed(1)} psi`
);

assert(r.pathFound, "path N042 → PUMP found");
assert(r.designFlowGpm === 2359.8, "design flow 2359.8");
almost(
  r.hydraulics.totalFrictionPsi,
  printFeedPf,
  3.0,
  `feed friction app=${r.hydraulics.totalFrictionPsi} vs print rows ~${printFeedPf.toFixed(1)}`
);
// Feed-only required should be well below full-system 127.9 (missing branch losses)
const req = r.hydraulics.supplyRequiredPsi;
assert(req > 60 && req < 127.9, `feed-only required ${req} < full-system 127.9 (missing grid branches)`);
almost(req, 60 + printFeedPf + printFeedElevPsi, 5, "feed-only required ≈ 60+fric+elev hand");

// Spot-check hydraulicWalk single segment S4→104 at correct branch Q
const walk = API.hydraulicWalk(
  [
    {
      from: "S4",
      to: "N104",
      lengthFt: 14.09,
      nominal: "2.5",
      schedule: "10",
      idIn: 2.635,
      cFactor: 120,
      elevFt: 0,
      fittings: {},
      elOverride: 24.71,
    },
  ],
  513.1,
  "S4",
  "N104"
);
const fricSeg = walk.totalFrictionPsi;
almost(fricSeg, 23.1, 0.15, `app walk S4→104 @ 513.1 gpm Pf=${fricSeg} vs print 23.1`);

// Wet system note
console.log("\nLimitations vs this PDF");
console.log("  • Printout system type: WET — water delivery time criteria (dry) do not apply.");
console.log("  • Full model is gridded multi-branch; app v1 is tree / simple branch only.");
console.log("  • 10\" / 12\" nominal supported (v1.2); multi-page PDF fixture JSON import available.");
console.log("  • Pump boost (+137.5 psi @ 2359.8 gpm) is not modeled as a device — residual is user input.");
console.log("  • Segment HW matches printout within ~0.1 psi — formula engine validated.");

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed ? 1 : 0);
