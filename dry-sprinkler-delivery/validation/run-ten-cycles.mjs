/**
 * Multi-cycle stress harness for Dry Sprinkler Water Delivery.
 * Models multi-page PDF calc workflows: many segments, large mains,
 * wet rejection, HW spot checks, volume, delivery, performance.
 *
 * Usage:
 *   node validation/run-ten-cycles.mjs [cycles=10] [label=pre]
 *   node validation/run-ten-cycles.mjs 10 post
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import vm from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cycles = Math.max(1, parseInt(process.argv[2] || "10", 10) || 10);
const label = process.argv[3] || "run";

const resultsDir = join(__dirname, "results");
if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

function loadAPI() {
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
  return sandbox.window.DrySprinklerDelivery || sandbox.DrySprinklerDelivery;
}

const pf = (Q, C, d) =>
  (4.52 * Math.pow(Q, 1.85)) / (Math.pow(C, 1.85) * Math.pow(d, 4.87));

/** Multi-page PDF-style fixture (Project Bravo-like: many rows, large UG, valves notes) */
function bravoStyleMultiPageFixture() {
  // Page-like groups as notes (simulating multi-page pipe tables)
  const segs = [];
  const mk = (o) => ({
    id: "s" + Math.random().toString(36).slice(2, 8),
    schedule: "10",
    cFactor: 120,
    elevFt: 0,
    fittings: {},
    elOverride: null,
    idIn: null,
    notes: "",
    ...o,
  });

  // Page 8–9 style: long feed + branch stubs
  segs.push(
    mk({
      from: "DPV",
      to: "UG1",
      lengthFt: 558.52,
      nominal: "10",
      idIn: 10.58,
      cFactor: 140,
      elOverride: 225.72,
      elevFt: 0,
      fixedLossPsi: 0,
      notes: "PDF p.11 054-060 DI10 C140",
    })
  );
  segs.push(
    mk({
      from: "UG1",
      to: "RISER",
      lengthFt: 195.48,
      nominal: "10",
      idIn: 10.42,
      elOverride: 75.36,
      elevFt: 18,
      fixedLossPsi: 0.9,
      notes: "PDF p.11 045-049 10in + riser check",
    })
  );
  segs.push(
    mk({
      from: "RISER",
      to: "CM",
      lengthFt: 69.3,
      nominal: "8",
      idIn: 8.329,
      elOverride: 0,
      elevFt: 3,
      notes: "PDF p.11 042-045 8in",
    })
  );
  // Many crossmain stubs (multi-page table volume)
  for (let i = 0; i < 12; i++) {
    segs.push(
      mk({
        from: i === 0 ? "CM" : "CM" + i,
        to: "CM" + (i + 1),
        lengthFt: 10 + (i % 3),
        nominal: "8",
        idIn: 8.329,
        notes: `PDF p.8-9 crossmain row ${i + 1}`,
      })
    );
  }
  segs.push(
    mk({
      from: "CM12",
      to: "BR",
      lengthFt: 38.81,
      nominal: "2.5",
      idIn: 2.635,
      elOverride: 0,
      notes: "PDF branch takeoff 2.5 Sch10",
    })
  );
  segs.push(
    mk({
      from: "BR",
      to: "Remote",
      lengthFt: 30,
      nominal: "1.5",
      idIn: 1.682,
      notes: "PDF remote arm",
    })
  );
  return segs;
}

function longTree(n) {
  const segs = [];
  for (let i = 0; i < n; i++) {
    segs.push({
      id: "t" + i,
      from: i === 0 ? "DPV" : "N" + i,
      to: i === n - 1 ? "Remote" : "N" + (i + 1),
      lengthFt: 20 + (i % 7) * 3,
      nominal: i < 3 ? "6" : i < 8 ? "4" : "2",
      schedule: i % 2 ? "10" : "40",
      idIn: null,
      cFactor: 120,
      elevFt: i % 5 === 0 ? 2 : 0,
      fittings: { elbow90: i % 3, elbow45: 0, teeThru: 0, teeBranch: i % 4 === 0 ? 1 : 0, gate: 0, butterfly: 0, check: 0, coupling: 0, reducer: 0 },
      elOverride: null,
      notes: `seg ${i + 1}/${n}`,
    });
  }
  return segs;
}

function runCycle(API, cycle) {
  const checks = [];
  const fail = (name, detail) => checks.push({ name, ok: false, detail });
  const pass = (name, detail) => checks.push({ name, ok: true, detail });
  const almost = (a, b, tol, name) => {
    if (Math.abs(a - b) <= tol) pass(name, `${a} ≈ ${b} ±${tol}`);
    else fail(name, `${a} vs ${b} ±${tol}`);
  };

  // 1) HW multi-page PDF segment spot checks (Bravo)
  const hwRows = [
    { Q: 117.1, C: 120, d: 2.635, L: 10, pPf: 0.4, name: "PDF-S2S3" },
    { Q: 513.1, C: 120, d: 2.635, L: 38.81, pPf: 23.1, name: "PDF-S4-104" },
    { Q: 2359.8, C: 120, d: 10.42, L: 270.85, pPf: 3.4, name: "PDF-10in" },
    { Q: 2359.8, C: 140, d: 10.58, L: 784.24, pPf: 6.8, name: "PDF-DI10" },
  ];
  for (const r of hwRows) {
    const Pf = pf(r.Q, r.C, r.d) * r.L;
    almost(Pf, r.pPf, 0.12, `hw:${r.name}`);
  }

  // 2) Wet rejection (PDF Bravo is wet)
  API.setState({
    ...API.defaultState(),
    systemType: "wet",
    projectName: `Cycle ${cycle} wet PDF`,
    segments: bravoStyleMultiPageFixture(),
    supplyNode: "DPV",
    remoteNodes: ["Remote"],
    designMode: "totalflow",
    totalDesignFlowGpm: 2359.8,
    minPressurePsi: 60,
    residualSupplyPsi: 127.9,
  });
  let r = API.calculate();
  if (r.compliance.rejected && r.compliance.overallBand === "rejected") {
    pass("wet:rejected", r.compliance.rejectReason?.slice(0, 80));
  } else fail("wet:rejected", `band=${r.compliance.overallBand}`);

  // 3) Dry multi-page fixture delivery runs
  API.setState({
    ...API.defaultState(),
    systemType: "dry",
    projectName: `Cycle ${cycle} dry multi-page`,
    hazardId: "highpiled",
    openHeads: 4,
    designMode: "kfactor",
    kFactor: 25.2,
    minPressurePsi: 60,
    residualSupplyPsi: 100,
    fillFlowGpm: null,
    qodPresent: false,
    includeFittingVolume: true,
    segments: bravoStyleMultiPageFixture(),
    supplyNode: "DPV",
    remoteNodes: ["Remote"],
  });
  const t0 = Date.now();
  r = API.calculate();
  const ms = Date.now() - t0;
  if (r.pathFound) pass("dry:path", r.pathNodes.join(">").slice(0, 60));
  else fail("dry:path", "no path");
  if (r.totalVolGal > 100) pass("dry:volume", `${r.totalVolGal} gal`);
  else fail("dry:volume", String(r.totalVolGal));
  if (r.deliverySec >= 0 && Number.isFinite(r.deliverySec)) {
    pass("dry:delivery", `${r.deliverySec}s band=${r.compliance.overallBand}`);
  } else fail("dry:delivery", String(r.deliverySec));
  if (ms < 200) pass("dry:perf", `${ms}ms`);
  else fail("dry:perf", `${ms}ms >= 200`);

  // 4) 10" / 12" nominal support (PDF mains)
  const has10 = !!(API.PIPE_ID && API.PIPE_ID["10"]);
  const has12 = !!(API.PIPE_ID && API.PIPE_ID["12"]);
  if (has10 && has12) pass("pipe:10in", `10=${API.PIPE_ID["10"].sch10} 12=${API.PIPE_ID["12"].sch10}`);
  else fail("pipe:10in", `10=${!!has10} 12=${!!has12}`);

  // 5) Valve / fixed loss
  API.setState({
    ...API.defaultState(),
    systemType: "dry",
    designMode: "totalflow",
    totalDesignFlowGpm: 500,
    minPressurePsi: 20,
    residualSupplyPsi: 80,
    segments: [
      {
        id: "v1",
        from: "DPV",
        to: "Remote",
        lengthFt: 100,
        nominal: "4",
        schedule: "40",
        idIn: 4.026,
        cFactor: 120,
        elevFt: 0,
        fittings: {},
        elOverride: 0,
        fixedLossPsi: 5,
        notes: "valve",
      },
    ],
    supplyNode: "DPV",
    remoteNodes: ["Remote"],
  });
  const rVal = API.calculate();
  const need = rVal.hydraulics.supplyRequiredPsi;
  const hwOnly = pf(500, 120, 4.026) * 100;
  if (Math.abs(need - (20 + hwOnly + 5)) < 0.5) {
    pass("valve:fixedLoss", `need=${need} includes 5 psi fixed (fixedΣ=${rVal.hydraulics.totalFixedLossPsi})`);
  } else if (Math.abs(need - (20 + hwOnly)) < 0.5) {
    fail("valve:fixedLoss", `fixedLossPsi ignored (need=${need}, expect ~${(20 + hwOnly + 5).toFixed(2)})`);
  } else {
    fail("valve:fixedLoss", `unexpected need=${need} hwOnly=${hwOnly.toFixed(2)}`);
  }

  // 6) Long network (20 segments) multi-page scale
  API.setState({
    ...API.defaultState(),
    systemType: "double_interlock",
    designMode: "totalflow",
    totalDesignFlowGpm: 250,
    minPressurePsi: 15,
    residualSupplyPsi: 90,
    segments: longTree(20),
    supplyNode: "DPV",
    remoteNodes: ["Remote"],
  });
  const t1 = Date.now();
  const r20 = API.calculate();
  const ms20 = Date.now() - t1;
  if (r20.pathFound && r20.segmentVols.length === 20) pass("net:20seg", `${ms20}ms`);
  else fail("net:20seg", `found=${r20.pathFound} n=${r20.segmentVols?.length}`);
  if (ms20 < 200) pass("net:20perf", `${ms20}ms`);
  else fail("net:20perf", `${ms20}ms`);

  // 7) Volume exemption boundary (PDF volumes often large)
  API.setState({
    ...API.defaultState(),
    systemType: "dry",
    qodPresent: false,
    includeFittingVolume: false,
    segments: [
      {
        id: "a",
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
  });
  const rEx = API.calculate();
  if (rEx.compliance.exempt) pass("exempt:500", `${rEx.totalVolGal} gal`);
  else fail("exempt:500", `${rEx.totalVolGal} band=${rEx.compliance.overallBand}`);

  // 8) Invalid zero length hard error
  API.setState({
    ...API.defaultState(),
    systemType: "dry",
    segments: [
      {
        id: "z",
        from: "DPV",
        to: "Remote",
        lengthFt: 0,
        nominal: "4",
        schedule: "40",
        idIn: 4,
        cFactor: 120,
        elevFt: 0,
        fittings: {},
        elOverride: 0,
        notes: "",
      },
    ],
  });
  const rBad = API.calculate();
  if (rBad.validation && !rBad.validation.ok && rBad.validation.errors.length) {
    pass("valid:zeroL", rBad.validation.errors[0]);
  } else fail("valid:zeroL", "expected error on zero length");

  // 9) Multi-remote volume picks max path
  API.setState({
    ...API.defaultState(),
    systemType: "dry",
    includeFittingVolume: false,
    supplyNode: "DPV",
    remoteNodes: ["R1", "R2"],
    segments: [
      {
        id: "1",
        from: "DPV",
        to: "R1",
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
      {
        id: "2",
        from: "DPV",
        to: "J",
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
        id: "3",
        from: "J",
        to: "R2",
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
    ],
  });
  const rMR = API.calculate();
  if (rMR.bestRemote === "R2" && rMR.volToRemoteGal > rMR.totalVolGal * 0.5) {
    pass("remote:maxPath", `best=${rMR.bestRemote} V=${rMR.volToRemoteGal}`);
  } else {
    fail("remote:maxPath", `best=${rMR.bestRemote} Vrem=${rMR.volToRemoteGal} Vtot=${rMR.totalVolGal}`);
  }

  // 10) Multi-page PDF fixture import + HW batch from printout pages
  if (typeof API.importPdfFixture !== "function") {
    fail("pdf:importAPI", "no multi-page PDF fixture import API");
  } else {
    try {
      const fixturePath = join(__dirname, "fixtures", "bravo-12k25-60-multipage.json");
      const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));
      const imp = API.importPdfFixture(fixture, { silent: true, calculate: true });
      if (!imp.ok) fail("pdf:importAPI", imp.error || "import failed");
      else {
        pass(
          "pdf:importAPI",
          `${imp.segmentCount} segs · ${imp.pdfSource?.pageCount || "?"}p · type=${imp.systemType}`
        );
        if (imp.result?.compliance?.rejected) pass("pdf:wetReject", "wet fixture rejected");
        else fail("pdf:wetReject", "expected wet reject on Bravo fixture");
        const hw = imp.hwResults || [];
        const hwOk = hw.filter((h) => h.ok).length;
        if (hw.length && hwOk === hw.length) pass("pdf:hwBatch", `${hwOk}/${hw.length} page-rows`);
        else if (hw.length) fail("pdf:hwBatch", `${hwOk}/${hw.length} HW rows matched`);
        else fail("pdf:hwBatch", "no hwChecks in fixture");
        // 10" nominal used on imported segments
        const used10 = (API.getState().segments || []).some((s) => String(s.nominal) === "10");
        if (used10) pass("pdf:uses10", "fixture uses 10\" nominal");
        else fail("pdf:uses10", "no 10\" segment after import");
      }
    } catch (e) {
      fail("pdf:importAPI", e.message || String(e));
    }
  }

  const failed = checks.filter((c) => !c.ok);
  return {
    cycle,
    passed: checks.filter((c) => c.ok).length,
    failed: failed.length,
    checks,
    failures: failed.map((f) => f.name + ": " + f.detail),
  };
}

const API = loadAPI();
if (!API) {
  console.error("Failed to load DrySprinklerDelivery API");
  process.exit(1);
}

console.log(`\n=== Dry Sprinkler — ${cycles} test cycles (${label}) ===`);
console.log(`App version: ${API.version}\n`);

const cycleResults = [];
for (let i = 1; i <= cycles; i++) {
  const cr = runCycle(API, i);
  cycleResults.push(cr);
  const mark = cr.failed === 0 ? "PASS" : "FAIL";
  console.log(
    `Cycle ${String(i).padStart(2)}: ${mark}  ${cr.passed} ok / ${cr.failed} fail` +
      (cr.failures.length ? "  · " + cr.failures.slice(0, 3).join(" | ") : "")
  );
}

// Aggregate failure frequencies
const freq = new Map();
for (const cr of cycleResults) {
  for (const f of cr.failures) {
    const key = f.split(":")[0] + ":" + f.split(":")[1];
    // name is first part before second colon content
    const name = f.split(":")[0] + (f.includes(":") ? ":" + f.split(":")[1].split(" ")[0] : "");
    const n = f.match(/^([^:]+:[^:]+)/) ? f.match(/^([^:]+)/)[1] : f;
    // better: use check name from structure
  }
  for (const c of cr.checks) {
    if (!c.ok) freq.set(c.name, (freq.get(c.name) || 0) + 1);
  }
}

const totalPass = cycleResults.reduce((s, c) => s + c.passed, 0);
const totalFail = cycleResults.reduce((s, c) => s + c.failed, 0);
const cyclesPass = cycleResults.filter((c) => c.failed === 0).length;

console.log("\n--- Failure frequency (across cycles) ---");
const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
if (!sorted.length) console.log("  (none)");
for (const [k, v] of sorted) console.log(`  ${v}/${cycles}  ${k}`);

// Improvement candidates from systematic probes
const improvements = [];
if ((freq.get("pipe:10in") || 0) > 0) {
  improvements.push({
    id: "pipe-10-12",
    title: "Add 10\" and 12\" nominal pipe sizes (PDF mains)",
    reason: "Multi-page HW printouts routinely use 10\" UG/mains; app stopped at 8\".",
  });
}
if ((freq.get("valve:fixedLoss") || 0) > 0) {
  improvements.push({
    id: "fixed-loss",
    title: "Support fixed pressure-loss devices (valves)",
    reason: "PDF pipe tables show riser check / OS&Y / butterfly fixed ΔP rows.",
  });
}
if ((freq.get("pdf:importAPI") || 0) > 0) {
  improvements.push({
    id: "pdf-fixture",
    title: "Multi-page PDF fixture import API + sample fixture",
    reason: "Calcs are multi-page PDFs; need structured fixture load for regression.",
  });
}
// Always suggest if less than 3
while (improvements.length < 3) {
  const extras = [
    {
      id: "source-meta",
      title: "Track multi-page PDF source metadata on project/report",
      reason: "Traceability when validating against multi-page listed calcs.",
    },
    {
      id: "batch-hw",
      title: "Batch HW segment verifier from fixture rows",
      reason: "Page-by-page Pf checks against printout tables.",
    },
  ];
  for (const e of extras) {
    if (improvements.length >= 3) break;
    if (!improvements.find((x) => x.id === e.id)) improvements.push(e);
  }
  break;
}

console.log("\n--- Suggested improvements (top 3) ---");
improvements.slice(0, 3).forEach((imp, i) => {
  console.log(`  ${i + 1}. [${imp.id}] ${imp.title}`);
  console.log(`     ${imp.reason}`);
});

const summary = {
  label,
  version: API.version,
  cycles,
  cyclesPass,
  totalPass,
  totalFail,
  failureFrequency: Object.fromEntries(sorted),
  improvements: improvements.slice(0, 3),
  at: new Date().toISOString(),
};

const outPath = join(resultsDir, `cycles-${label}-${Date.now()}.json`);
writeFileSync(outPath, JSON.stringify({ summary, cycleResults }, null, 2));
console.log(`\nWrote ${outPath}`);
console.log(
  `\n=== Summary: ${cyclesPass}/${cycles} cycles clean · ${totalPass} assertions ok · ${totalFail} failed ===\n`
);

// Exit 0 even with probe failures so improvement discovery can proceed;
// exit 1 only if catastrophic (API missing already handled)
process.exit(0);
