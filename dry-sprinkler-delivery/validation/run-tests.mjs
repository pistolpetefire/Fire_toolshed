/**
 * Node validation for Dry Sprinkler Water Delivery engine formulas.
 * Loads calculation helpers by re-implementing pure core checks
 * (mirrors assets/app.js unit conventions).
 *
 * Run: node validation/run-tests.mjs
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
  const ok = Math.abs(a - b) <= tol;
  assert(ok, `${msg} (got ${a}, expected ${b} ± ${tol})`);
}

// ── Pure formula checks (independent of DOM) ───────────────────────────────
const GAL_PER_CUFT = 7.48051945;

function pipeVolumeGal(idIn, lengthFt) {
  const dFt = idIn / 12;
  return (Math.PI / 4) * dFt * dFt * lengthFt * GAL_PER_CUFT;
}

function orificeAreaIn2(kFactor) {
  const d = Math.sqrt(kFactor / 29.83);
  return (Math.PI / 4) * d * d;
}

function hwPsiPerFt(Q, C, d) {
  return (4.52 * Math.pow(Q, 1.85)) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));
}

function tripTime(VT, An, T0R, pa0, pa) {
  return 0.0352 * (VT / (An * Math.sqrt(T0R))) * Math.log(pa0 / pa);
}

console.log("\n=== Dry Sprinkler Delivery — validation ===\n");

console.log("Pipe volume");
// 4" Sch 40 ID 4.026, 100 ft ≈ π/4*(4.026/12)^2*100*7.4805 ≈ 65.4 gal
const v4 = pipeVolumeGal(4.026, 100);
almost(v4, 65.4, 1.0, "4\" Sch40 × 100 ft ≈ 65.4 gal");

const v2 = pipeVolumeGal(2.067, 50);
almost(v2, 8.7, 0.5, "2\" Sch40 × 50 ft ≈ 8.7 gal");

console.log("\nOrifice area from K");
const a56 = orificeAreaIn2(5.6);
almost(a56, 0.147, 0.02, "K5.6 orifice area ~0.15 in²");

console.log("\nHazen–Williams");
// Known: 250 gpm, C=120, d=4.026 → pf roughly 0.016–0.02 psi/ft
const pf = hwPsiPerFt(250, 120, 4.026);
assert(pf > 0.01 && pf < 0.05, `HW 250 gpm / 4\" / C120 pf=${pf.toFixed(5)} in expected band`);

// Friction on 100 ft should be ~1–3 psi
const fric100 = pf * 100;
assert(fric100 > 1 && fric100 < 5, `100 ft friction ≈ ${fric100.toFixed(2)} psi`);

console.log("\nTrip time formula");
// Sample: 600 gal, An=0.3 in2, 70F=530R, 40+14.7 / 15+14.7
const t = tripTime(600, 0.3, 530, 54.7, 29.7);
assert(t > 0.5 && t < 200, `Sample trip time ${t.toFixed(1)} s in plausible range`);

// Higher volume → longer trip
const t2 = tripTime(1200, 0.3, 530, 54.7, 29.7);
assert(t2 > t * 1.9 && t2 < t * 2.1, "Trip doubles with double volume");

console.log("\nTransit volume/flow");
// 100 gal / 50 gpm = 2 min = 120 s
const tTransit = (60 * 100) / 50;
almost(tTransit, 120, 0.01, "60*V/Q: 100 gal @ 50 gpm = 120 s");

console.log("\nFill rate inverse HW");
// Single segment: L=100, d=4.026, C=120 → k = 4.52*100/(120^1.85 * 4.026^4.87)
function sumK_simple(L, C, d) {
  return (4.52 * L) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));
}
const k = sumK_simple(100, 120, 4.026);
const P = 50; // elev 0
const Qfill = Math.pow(P / k, 1 / 1.85);
assert(Qfill > 100 && Qfill < 2000, `Fill Q from 50 psi on 100ft 4" ≈ ${Qfill.toFixed(0)} gpm`);
// Round-trip: friction at Qfill should ≈ P
const pfCheck = hwPsiPerFt(Qfill, 120, 4.026) * 100;
almost(pfCheck, P, 0.15, "HW round-trip: friction ≈ residual within 0.15 psi");

console.log("\nColor bands");
function band(d, lim, exempt) {
  if (exempt) return "exempt";
  if (d > lim) return "red";
  if (d > lim * 0.9) return "yellow";
  return "green";
}
assert(band(40, 50, false) === "green", "40/50 green");
assert(band(48, 50, false) === "yellow", "48/50 yellow (within 10%)");
assert(band(51, 50, false) === "red", "51/50 red");
assert(band(100, 50, true) === "exempt", "exempt overrides");

console.log("\nVolume exemptions logic");
function exempt(V, qod) {
  if (V <= 500) return "500";
  if (V <= 750 && qod) return "750+qod";
  return null;
}
assert(exempt(400, false) === "500", "≤500 exempt");
assert(exempt(600, false) === null, "600 no QOD not exempt");
assert(exempt(600, true) === "750+qod", "600 + QOD exempt");
assert(exempt(800, true) === null, "800 + QOD not exempt");

console.log("\nNFPA table limits");
const table = {
  dwelling: 15,
  light: 60,
  ordinary: 50,
  extra: 45,
  highpiled: 40,
};
assert(table.ordinary === 50, "Ordinary max 50 s");
assert(table.highpiled === 40, "High-piled max 40 s");

// ── Load app.js in a minimal browser sandbox ───────────────────────────────
console.log("\nEngine bootstrap (vm sandbox)");
const appSrc = readFileSync(join(root, "assets", "app.js"), "utf8");
const store = new Map();
const documentMock = {
  readyState: "complete",
  documentElement: { classList: { toggle: () => {}, add: () => {}, remove: () => {} } },
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
    setAttribute: () => {},
  }),
  body: { appendChild: () => {} },
};

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
  document: documentMock,
  window: {},
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  CustomEvent: function () {},
  URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
  Blob: function () {},
  confirm: () => true,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appSrc, sandbox, { filename: "app.js" });
  const API = sandbox.window.DrySprinklerDelivery || sandbox.DrySprinklerDelivery;
  assert(!!API, "DrySprinklerDelivery API exported");
  if (API) {
    assert(/^1\.\d+/.test(API.version), "version 1.x");
    const vol = API.pipeVolumeGal(4.026, 100);
    almost(vol, 65.4, 1.0, "API pipeVolumeGal matches");
    const a = API.orificeAreaIn2(5.6);
    almost(a, 0.147, 0.02, "API orificeAreaIn2");

    // Full calculate with default example network
    API.setState(API.defaultState());
    const r = API.calculate();
    assert(r.totalVolGal > 0, `totalVolGal=${r.totalVolGal}`);
    assert(r.deliverySec > 0, `deliverySec=${r.deliverySec}`);
    assert(r.trip.sec >= 0 && r.transit.sec >= 0, "trip+transit non-negative");
    assert(r.compliance && r.compliance.hazard, "compliance has hazard");
    assert(r.designFlowGpm > 0, `designFlow=${r.designFlowGpm}`);
    assert(r.fillDerived && r.fillDerived.Qgpm >= 0, "fillDerived present");
    assert(r.validation && r.validation.ok, "default network validates");
    assert(
      ["green", "yellow", "red", "exempt"].includes(r.compliance.overallBand),
      `overallBand=${r.compliance.overallBand}`
    );

    // Fill rate from residual
    if (typeof API.fillRateFromResidual === "function") {
      const segs = API.defaultState().segments;
      const fr = API.fillRateFromResidual(segs, 65);
      assert(fr.ok && fr.Qgpm > 0, `fillRateFromResidual Q=${fr.Qgpm}`);
    }

    // Acceptance: HW on simple path within 0.1 psi hand calc
    // 200 gpm, C=120, d=4.026, L=50 → pf * 50
    const pf = (4.52 * Math.pow(200, 1.85)) / (Math.pow(120, 1.85) * Math.pow(4.026, 4.87));
    const hand = pf * 50;
    API.setState({
      ...API.defaultState(),
      designMode: "totalflow",
      totalDesignFlowGpm: 200,
      minPressurePsi: 7,
      residualSupplyPsi: 100,
      openHeads: 1,
      fillFlowGpm: null,
      segments: [
        {
          id: "s1",
          from: "DPV",
          to: "Remote",
          lengthFt: 50,
          nominal: "4",
          schedule: "40",
          idIn: 4.026,
          cFactor: 120,
          elevFt: 0,
          fittings: {},
          elOverride: 0,
          notes: "",
        },
      ],
      remoteNodes: ["Remote"],
      supplyNode: "DPV",
    });
    const rHw = API.calculate();
    const fric = rHw.hydraulics.totalFrictionPsi;
    almost(fric, hand, 0.1, `HW friction hand=${hand.toFixed(3)} engine=${fric}`);

    // 500 gal exemption path: tiny network
    API.setState({
      ...API.defaultState(),
      segments: [
        {
          id: "s1",
          from: "DPV",
          to: "Remote",
          lengthFt: 10,
          nominal: "1",
          schedule: "40",
          idIn: null,
          cFactor: 120,
          elevFt: 0,
          fittings: {},
          elOverride: 0,
          notes: "",
        },
      ],
      remoteNodes: ["Remote"],
      supplyNode: "DPV",
    });
    const r2 = API.calculate();
    assert(r2.totalVolGal < 500, `tiny system vol=${r2.totalVolGal}`);
    assert(r2.compliance.exempt === true, "small system exempt");

    // Volume ±1% on multi-segment (pipe only, fittings off)
    API.setState({
      ...API.defaultState(),
      includeFittingVolume: false,
      segments: [
        {
          id: "a",
          from: "DPV",
          to: "N1",
          lengthFt: 100,
          nominal: "4",
          schedule: "40",
          idIn: 4.026,
          cFactor: 120,
          elevFt: 0,
          fittings: {},
          elOverride: 0,
          notes: "",
        },
        {
          id: "b",
          from: "N1",
          to: "Remote",
          lengthFt: 50,
          nominal: "2",
          schedule: "40",
          idIn: 2.067,
          cFactor: 120,
          elevFt: 0,
          fittings: {},
          elOverride: 0,
          notes: "",
        },
      ],
      remoteNodes: ["Remote"],
      supplyNode: "DPV",
    });
    const r3 = API.calculate();
    const handVol =
      pipeVolumeGal(4.026, 100) + pipeVolumeGal(2.067, 50);
    almost(r3.totalVolGal, handVol, handVol * 0.01, "total volume within ±1%");

    // Path finding
    const path = API.pathToRemote(
      "DPV",
      "Remote",
      API.defaultState().segments
    );
    assert(path && path.nodes.includes("DPV") && path.nodes.includes("Remote"), "path DPV→Remote");

    // Wet system must be rejected for water delivery compliance
    API.setState({
      ...API.defaultState(),
      systemType: "wet",
      projectName: "Wet reject test",
    });
    const rWet = API.calculate();
    assert(rWet.compliance.rejected === true, "wet system rejected");
    assert(rWet.compliance.overallBand === "rejected", "wet overallBand rejected");
    assert(rWet.compliance.eligible === false, "wet not delivery-eligible");

    API.setState({
      ...API.defaultState(),
      systemType: "double_interlock",
    });
    const rDi = API.calculate();
    assert(rDi.compliance.rejected !== true, "double-interlock is eligible");
    assert(rDi.compliance.eligible === true, "double-interlock eligible flag");
  }
} catch (e) {
  failed++;
  console.error("  FAIL engine bootstrap:", e.message);
  console.error(e.stack);
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed ? 1 : 0);
