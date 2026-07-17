/**
 * End-to-end water-path test: 10 cycles
 * Flow Test → Sprinkler Estimator → Fire Pump Sizer → Tank Sizer
 *
 * Simulates save/copy handoffs and core calcs used by each app.
 * Writes cycle artifacts under validation/e2e-out/
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "e2e-out");
const EXP = 1.85;
const GAL_PER_CUFT = 7.48051945;
const PSI_PER_FT = 0.433;

const results = { cycles: [], pass: 0, fail: 0, errors: [] };

function ok(cycle, name, cond, detail = "") {
  if (cond) results.pass++;
  else {
    results.fail++;
    results.errors.push(`C${cycle}: ${name}${detail ? " — " + detail : ""}`);
  }
  return !!cond;
}

function round0(n) {
  return Math.round(n);
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function cylGal(d, h) {
  return Math.PI * Math.pow(d / 2, 2) * h * GAL_PER_CUFT;
}

// --- Flow Test (NFPA 291 style) ---
function flowTestCycle(s) {
  const drop = s.staticPsi - s.residualPsi;
  const dropPct = (drop / s.staticPsi) * 100;
  const valid = s.staticPsi > s.residualPsi && s.flowGpm > 0 && drop > 0;
  const supplyAt = (q) =>
    s.staticPsi - drop * Math.pow(q / Math.max(s.flowGpm, 1e-9), EXP);
  const rating = s.ratingResidual || 20;
  const capacityAtRating =
    valid && s.staticPsi > rating
      ? s.flowGpm * Math.pow((s.staticPsi - rating) / drop, 1 / EXP)
      : NaN;

  // Pitot check optional (single or multi-outlet sum)
  const C = s.outletC || 0.9;
  let pitotQ = 0;
  if (Array.isArray(s.outlets) && s.outlets.length) {
    pitotQ = s.outlets.reduce((sum, o) => {
      const c = o.c != null ? o.c : C;
      const d = o.diameterIn != null ? o.diameterIn : s.outletDia || 2.5;
      const p = o.pitotPsi != null ? o.pitotPsi : s.pitotPsi || 15;
      return sum + 29.83 * c * Math.pow(d, 2) * Math.sqrt(p);
    }, 0);
  } else {
    pitotQ =
      29.83 * C * Math.pow(s.outletDia || 2.5, 2) * Math.sqrt(s.pitotPsi || 15);
  }

  // Capacity rounding: nearest 50 below 1000, nearest 100 at/above 1000
  const roundCapacity = (q) => {
    if (!Number.isFinite(q) || q <= 0) return NaN;
    if (q < 1000) return Math.round(q / 50) * 50;
    return Math.round(q / 100) * 100;
  };
  const capacityRounded = roundCapacity(capacityAtRating);
  const hydrantClass = !Number.isFinite(capacityRounded)
    ? "—"
    : capacityRounded >= 1500
      ? "AA"
      : capacityRounded >= 1000
        ? "A"
        : capacityRounded >= 500
          ? "B"
          : "C";

  const pitotPsi = s.pitotPsi || 15;
  const pitotInBand = pitotPsi >= 10 && pitotPsi <= 30;

  const handoff = {
    source: "flow-test-report",
    version: "2.3.0-e2e",
    capturedAt: new Date().toISOString(),
    projectName: s.project,
    facility: s.facility || "",
    testPurpose: s.purpose || "suppressionSupply",
    staticPressure: s.staticPsi,
    residualPressure: s.residualPsi,
    flowAtResidual: s.flowGpm,
    minResidual: rating,
    supplyExponent: EXP,
    fireFlowAt20: capacityAtRating,
    fireFlowAt20Rounded: capacityRounded,
    hydrantClass,
    residualHydrant: s.residualHydrant || "FH-R",
    flowHydrants: s.flowHydrants || ["FH-F1"],
    residualGaugeCalDate: s.residualCal || "2025-06-01",
    pitotGaugeCalDate: s.pitotCal || "2025-06-01",
    multiOutletMode: !!(s.outlets && s.outlets.length > 1),
    outletCount: s.outlets ? s.outlets.length : 1,
    dropPct,
    label: `${s.project} · flow test`,
  };

  return {
    valid,
    dropPct,
    capacityAtRating,
    capacityRounded,
    hydrantClass,
    pitotInBand,
    supplyAt,
    pitotQ,
    handoff,
    checks: {
      drop25: dropPct >= 25,
      multiHydrant: (s.flowHydrants || []).length >= 1,
      calPresent: !!(handoff.residualGaugeCalDate && handoff.pitotGaugeCalDate),
      pitotBand: pitotInBand,
      classRated: hydrantClass !== "—",
    },
  };
}

// --- Sprinkler Estimator ---
function sprinklerCycle(ft, s) {
  const density = s.density;
  const area = s.designArea;
  const hose = s.includeHose !== false ? s.hoseGpm : 0;
  const sprOnly = s.mode === "simple" ? s.manualGpm : density * area;
  const flowGpm = s.mode === "simple" ? s.manualGpm : sprOnly + hose;

  const elev = (s.elevFt || 0) * PSI_PER_FT;
  const K = s.kFactor || 8;
  const cov = s.coverage || 130;
  const qHead = density * cov;
  const pFromK = Math.pow(qHead / K, 2);
  const remote = Math.max(s.minFloor || 7, pFromK);
  const backflow = s.backflowPsi || 12;
  const equip = s.equipPsi || 19;
  const safety = s.safetyPsi || 5;
  const pressurePsi = remote + elev + backflow + equip + safety;
  const durationMin = s.durationMin || 60;

  // Supply vs demand if flow test present (N^1.85)
  let supplyAtDemand = NaN;
  let margin = NaN;
  let supplyStatus = null;
  let netBoostPsi = null;
  if (ft && ft.valid) {
    supplyAtDemand = ft.supplyAt(flowGpm);
    margin = supplyAtDemand - pressurePsi;
    netBoostPsi = Math.max(0, -margin);
    if (margin >= 0) supplyStatus = "adequate";
    else if (supplyAtDemand >= pressurePsi * 0.6) supplyStatus = "marginal";
    else supplyStatus = "pump_required";
  }

  const supplyAssessment =
    Number.isFinite(supplyAtDemand)
      ? {
          status: supplyStatus,
          availablePsi: round1(supplyAtDemand),
          demandPsi: round1(pressurePsi),
          demandGpm: round0(flowGpm),
          marginPsi: round1(margin),
          netBoostPsi: round1(netBoostPsi),
          testStatic: ft.handoff.staticPressure,
          testResidual: ft.handoff.residualPressure,
          testFlow: ft.handoff.flowAtResidual,
          supplyExponent: EXP,
        }
      : null;

  const handoff = {
    source: "sprinkler-system-estimator",
    version: "1.6.0-e2e",
    capturedAt: new Date().toISOString(),
    projectName: s.project,
    facility: s.facility || "",
    framework: s.framework || "nfpa13",
    frameworkLabel: s.frameworkLabel || "NFPA 13",
    flowGpm: round0(flowGpm),
    pressurePsi: round1(pressurePsi),
    durationMin: round0(durationMin),
    hoseGpm: hose,
    sprinklerOnlyGpm: round0(sprOnly),
    tankGalPrelim: round0(flowGpm * durationMin),
    demandBasis: s.demandBasis || "E2E density-area planning",
    flowTest: ft
      ? {
          staticPsi: ft.handoff.staticPressure,
          residualPsi: ft.handoff.residualPressure,
          flowGpm: ft.handoff.flowAtResidual,
        }
      : null,
    supplyAssessment,
  };

  return {
    flowGpm: handoff.flowGpm,
    pressurePsi: handoff.pressurePsi,
    durationMin: handoff.durationMin,
    remote: round1(remote),
    elev: round1(elev),
    supplyAtDemand: Number.isFinite(supplyAtDemand) ? round1(supplyAtDemand) : null,
    margin: Number.isFinite(margin) ? round1(margin) : null,
    supplyStatus,
    netBoostPsi: netBoostPsi != null ? round1(netBoostPsi) : null,
    handoff,
  };
}

// --- Fire Pump Sizer ---
function pumpCycle(sp, s) {
  const systemFlow = sp.flowGpm;
  const systemPSI = sp.pressurePsi;
  const durationMin = sp.durationMin;
  const ratedGPM = s.ratedGPM || Math.ceil(systemFlow / 250) * 250 || 500;
  const ratedPSI = s.ratedPSI || Math.ceil(systemPSI / 5) * 5 + 10;

  // Prefer sprinkler supplyAssessment (N^1.85); else compute N^1.85 from flowTest; else hydrant
  let availablePSI = null;
  let netPump = null;
  let supplyStatus = null;
  const sa = sp.handoff.supplyAssessment;
  if (sa && Number.isFinite(sa.availablePsi)) {
    availablePSI = sa.availablePsi;
    netPump = Math.max(0, systemPSI - availablePSI);
    supplyStatus = sa.status;
  } else if (sp.handoff.flowTest) {
    const st = sp.handoff.flowTest.staticPsi;
    const res = sp.handoff.flowTest.residualPsi;
    const qtest = sp.handoff.flowTest.flowGpm;
    const drop = st - res;
    availablePSI = st - drop * Math.pow(systemFlow / Math.max(qtest, 1e-9), EXP);
    if (availablePSI < 0) availablePSI = 0;
    netPump = Math.max(0, systemPSI - availablePSI);
    if (availablePSI >= systemPSI - 0.05) supplyStatus = "adequate";
    else if (availablePSI >= systemPSI * 0.6) supplyStatus = "marginal";
    else supplyStatus = "pump_required";
  } else if (s.hydrant) {
    const st = s.hydrant.static;
    const res = s.hydrant.residual;
    const qtest = s.hydrant.flow;
    const drop = st - res;
    availablePSI = st - drop * Math.pow(systemFlow / Math.max(qtest, 1e-9), EXP);
    if (availablePSI < 0) availablePSI = 0;
    netPump = Math.max(0, systemPSI - Math.max(0, availablePSI));
  }

  // NFPA 20 test points
  const churn = ratedPSI * 1.4;
  const oneFifty = ratedPSI * 0.65;
  const coversDuty = ratedGPM >= systemFlow && ratedPSI >= systemPSI * 0.95;

  // Driver rough
  const headFt = ratedPSI * 2.31;
  const motorHP = (ratedGPM * headFt) / (3960 * 0.75) * 1.15;

  // Pump → tank handoff
  const tankHandoff = {
    source: "fire-pump-sizer",
    version: "2.3.0-e2e",
    capturedAt: new Date().toISOString(),
    projectName: s.project,
    flowGpm: systemFlow,
    durationMin,
    pressurePsi: systemPSI,
    ratedGPM,
    ratedPSI,
    availablePSI: availablePSI != null ? round1(availablePSI) : null,
    netPumpPSI: netPump != null ? round1(netPump) : null,
    supplyStatus: supplyStatus || "",
  };

  const snapshot = {
    source: "fire-pump-sizer",
    version: "2.3.0-e2e",
    projectName: s.project,
    systemFlow,
    systemPSI,
    durationMin,
    ratedGPM,
    ratedPSI,
    churnPSI: round1(churn),
    oneFiftyPSI: round1(oneFifty),
    availablePSI: availablePSI != null ? round1(availablePSI) : null,
    netPumpPSI: netPump != null ? round1(netPump) : null,
    supplyStatus,
    motorHP: round1(motorHP),
    coversDuty,
    ufcMode: !!s.ufcMode,
    tankHandoff,
  };

  return snapshot;
}

// --- Tank Sizer ---
function tankCycle(pump, s) {
  const flow = pump.systemFlow;
  const duration = pump.durationMin;
  const base = flow * duration;
  const safetyPct = s.safetyPct ?? 5;
  const unusablePct = s.unusablePct ?? 5;
  const withSafety = base * (1 + safetyPct / 100);
  const requiredShell = withSafety / (1 - unusablePct / 100);

  const maxH = s.maxHeightFt ?? 24;
  const maxD = s.maxDiaFt ?? 40;

  // Small catalog subset for e2e
  const dias = [11, 15.5, 18, 21, 24, 27, 30, 33, 36, 39, 42];
  const heights = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28];
  let pick = null;
  for (const d of dias) {
    for (const h of heights) {
      if (d > maxD || h > maxH) continue;
      const gal = cylGal(d, h);
      if (gal >= requiredShell) {
        if (!pick || gal < pick.gal || (gal === pick.gal && h < pick.htFt)) {
          pick = { diaFt: d, htFt: h, gal: round0(gal) };
        }
      }
    }
  }

  const padBeyond = s.padBeyondFt ?? 2;
  const padDia = pick ? pick.diaFt + 2 * padBeyond : 0;
  const padThickIn = s.padThicknessIn ?? 12;
  const padCuYd = pick
    ? (Math.PI * Math.pow(padDia / 2, 2) * (padThickIn / 12)) / 27
    : 0;

  return {
    baseGal: round0(base),
    requiredShellGal: round0(requiredShell),
    safetyPct,
    unusablePct,
    tank: pick,
    pad: pick
      ? {
          padDiaFt: round1(padDia),
          beyondFt: padBeyond,
          thicknessIn: padThickIn,
          padCuYd: round1(padCuYd),
        }
      : null,
    meets: !!pick,
  };
}

// --- 10 scenarios ---
const SCENARIOS = [
  {
    name: "OH-2 wet office, moderate supply",
    ft: {
      project: "E2E-01 Office OH2",
      facility: "Bldg A",
      staticPsi: 72,
      residualPsi: 48,
      flowGpm: 1256,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-F1"],
      residualHydrant: "FH-R1",
      outletC: 0.9,
      pitotPsi: 15,
      // multi-outlet pitot sum (NFPA 291 multi-butt)
      outlets: [
        { pitotPsi: 14, diameterIn: 2.5, c: 0.9 },
        { pitotPsi: 16, diameterIn: 2.5, c: 0.9 },
      ],
    },
    sp: {
      project: "E2E-01 Office OH2",
      framework: "nfpa13",
      frameworkLabel: "NFPA 13 · wet pipe",
      density: 0.2,
      designArea: 1500,
      hoseGpm: 250,
      kFactor: 8,
      coverage: 130,
      elevFt: 40,
      durationMin: 90,
    },
    pump: { project: "E2E-01 Office OH2", ufcMode: false, useN185: true },
    tank: { safetyPct: 5, unusablePct: 5, maxHeightFt: 24, maxDiaFt: 40 },
  },
  {
    name: "UFC Ordinary wet, strong supply",
    ft: {
      project: "E2E-02 UFC Ordinary",
      staticPsi: 85,
      residualPsi: 55,
      flowGpm: 1800,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-2", "FH-3"],
    },
    sp: {
      project: "E2E-02 UFC Ordinary",
      framework: "ufc",
      frameworkLabel: "UFC 3-600-01 Table 9-3 · wet pipe",
      density: 0.2,
      designArea: 2500,
      hoseGpm: 250,
      kFactor: 8,
      coverage: 130,
      elevFt: 50,
      durationMin: 60,
      backflowPsi: 12,
    },
    pump: { project: "E2E-02 UFC Ordinary", ufcMode: true, useN185: true },
    tank: { safetyPct: 10, unusablePct: 5, maxHeightFt: 20, maxDiaFt: 36 },
  },
  {
    name: "Light hazard, small demand",
    ft: {
      project: "E2E-03 Light",
      staticPsi: 65,
      residualPsi: 45,
      flowGpm: 900,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-F1"],
    },
    sp: {
      project: "E2E-03 Light",
      density: 0.1,
      designArea: 1500,
      hoseGpm: 100,
      kFactor: 5.6,
      coverage: 225,
      elevFt: 25,
      durationMin: 30,
      equipPsi: 15,
      safetyPsi: 5,
    },
    pump: { project: "E2E-03 Light", useN185: true },
    tank: { safetyPct: 5, maxHeightFt: 16, maxDiaFt: 30 },
  },
  {
    name: "Extra hazard, long duration",
    ft: {
      project: "E2E-04 Extra",
      staticPsi: 90,
      residualPsi: 60,
      flowGpm: 2200,
      purpose: "suppressionSupply",
      flowHydrants: ["F1", "F2", "F3"],
    },
    sp: {
      project: "E2E-04 Extra",
      framework: "ufc",
      frameworkLabel: "UFC Extra · wet",
      density: 0.3,
      designArea: 2500,
      hoseGpm: 500,
      kFactor: 11.2,
      coverage: 100,
      elevFt: 60,
      durationMin: 90,
      backflowPsi: 12,
      equipPsi: 22,
      safetyPsi: 10,
    },
    pump: { project: "E2E-04 Extra", ufcMode: true, useN185: true, ratedGPM: 2000, ratedPSI: 140 },
    tank: { safetyPct: 10, unusablePct: 8, maxHeightFt: 28, maxDiaFt: 45 },
  },
  {
    name: "AF Sundown 0.2/5000",
    ft: {
      project: "E2E-05 AF Sundown",
      staticPsi: 70,
      residualPsi: 42,
      flowGpm: 1600,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-A", "FH-B"],
    },
    sp: {
      project: "E2E-05 AF Sundown",
      framework: "afsundown",
      frameworkLabel: "AF Sundown · wet pipe only",
      density: 0.2,
      designArea: 5000,
      hoseGpm: 250,
      kFactor: 8,
      coverage: 130,
      elevFt: 35,
      durationMin: 60,
    },
    pump: { project: "E2E-05 AF Sundown", ufcMode: true, useN185: true },
    tank: { safetyPct: 10, maxHeightFt: 24, maxDiaFt: 42 },
  },
  {
    name: "Fire-flow purpose hydrant rating",
    ft: {
      project: "E2E-06 Fire Flow Rating",
      staticPsi: 80,
      residualPsi: 50,
      flowGpm: 1500,
      purpose: "fireFlow",
      ratingResidual: 20,
      flowHydrants: ["FH-F1", "FH-F2"],
    },
    sp: {
      project: "E2E-06 Fire Flow Rating",
      mode: "simple",
      manualGpm: 1000,
      density: 0.15,
      designArea: 1500,
      hoseGpm: 0,
      includeHose: false,
      elevFt: 20,
      durationMin: 60,
      kFactor: 5.6,
      coverage: 130,
    },
    pump: { project: "E2E-06 Fire Flow Rating", useN185: true },
    tank: { safetyPct: 5, maxHeightFt: 20, maxDiaFt: 30 },
  },
  {
    name: "Weak supply, high demand (margin stress)",
    ft: {
      project: "E2E-07 Weak Supply",
      staticPsi: 55,
      residualPsi: 40,
      flowGpm: 800,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-1"],
    },
    sp: {
      project: "E2E-07 Weak Supply",
      density: 0.2,
      designArea: 2500,
      hoseGpm: 250,
      elevFt: 45,
      durationMin: 60,
      kFactor: 8,
      coverage: 130,
    },
    pump: { project: "E2E-07 Weak Supply", useN185: true, ratedGPM: 1000, ratedPSI: 120 },
    tank: { safetyPct: 5, maxHeightFt: 24, maxDiaFt: 36 },
  },
  {
    name: "FM-style storage density planning",
    ft: {
      project: "E2E-08 FM Storage",
      staticPsi: 75,
      residualPsi: 50,
      flowGpm: 2000,
      purpose: "suppressionSupply",
      flowHydrants: ["F1", "F2"],
    },
    sp: {
      project: "E2E-08 FM Storage",
      framework: "fm",
      frameworkLabel: "FM Global · wet pipe",
      density: 0.45,
      designArea: 2000,
      hoseGpm: 500,
      kFactor: 11.2,
      coverage: 100,
      elevFt: 30,
      durationMin: 90,
      safetyPsi: 10,
    },
    pump: { project: "E2E-08 FM Storage", useN185: true, ratedGPM: 2000, ratedPSI: 150 },
    tank: { safetyPct: 15, unusablePct: 5, maxHeightFt: 24, maxDiaFt: 48 },
  },
  {
    name: "Dry-pipe OH larger area",
    ft: {
      project: "E2E-09 Dry OH",
      staticPsi: 68,
      residualPsi: 48,
      flowGpm: 1400,
      purpose: "suppressionSupply",
      flowHydrants: ["FH-F1"],
    },
    sp: {
      project: "E2E-09 Dry OH",
      density: 0.2,
      designArea: 1950, // +30% dry
      hoseGpm: 250,
      kFactor: 8,
      coverage: 130,
      elevFt: 40,
      durationMin: 90,
      equipPsi: 20,
    },
    pump: { project: "E2E-09 Dry OH", useN185: true },
    tank: { safetyPct: 5, maxHeightFt: 22, maxDiaFt: 36 },
  },
  {
    name: "High elevation tall building",
    ft: {
      project: "E2E-10 Tall Bldg",
      staticPsi: 95,
      residualPsi: 62,
      flowGpm: 2500,
      purpose: "suppressionSupply",
      flowHydrants: ["F1", "F2", "F3", "F4"],
    },
    sp: {
      project: "E2E-10 Tall Bldg",
      density: 0.2,
      designArea: 2500,
      hoseGpm: 250,
      kFactor: 11.2,
      coverage: 130,
      elevFt: 120,
      durationMin: 60,
      backflowPsi: 12,
      equipPsi: 25,
      safetyPsi: 10,
    },
    pump: { project: "E2E-10 Tall Bldg", ufcMode: true, useN185: true, ratedGPM: 1500, ratedPSI: 175 },
    tank: { safetyPct: 10, unusablePct: 5, maxHeightFt: 18, maxDiaFt: 50 },
  },
];

function run() {
  fs.mkdirSync(OUT, { recursive: true });
  const summary = [];

  console.log("=== E2E Water Path: 10 cycles ===\n");

  SCENARIOS.forEach((sc, idx) => {
    const cycle = idx + 1;
    const cycleDir = path.join(OUT, `cycle-${String(cycle).padStart(2, "0")}`);
    fs.mkdirSync(cycleDir, { recursive: true });

    console.log(`--- Cycle ${cycle}: ${sc.name} ---`);

    // 1) Flow test
    const ft = flowTestCycle(sc.ft);
    ok(cycle, "FT valid test", ft.valid);
    ok(cycle, "FT drop% computed", ft.dropPct > 0, String(ft.dropPct));
    ok(cycle, "FT multi-hydrant layout preferred", ft.checks.multiHydrant);
    ok(cycle, "FT cal dates present", ft.checks.calPresent);
    ok(cycle, "FT pitot band 10-30", ft.checks.pitotBand);
    if (sc.ft.purpose === "fireFlow" || Number.isFinite(ft.capacityAtRating)) {
      ok(cycle, "FT capacity@rating finite", Number.isFinite(ft.capacityAtRating));
      if (Number.isFinite(ft.capacityAtRating)) {
        ok(cycle, "FT capacity rounded", Number.isFinite(ft.capacityRounded));
        ok(cycle, "FT hydrant class AA-C", !!ft.hydrantClass && ft.hydrantClass !== "—");
      }
    }
    if (sc.ft.outlets && sc.ft.outlets.length > 1) {
      ok(cycle, "FT multi-outlet pitot sum > 0", ft.pitotQ > 0);
    }
    // Save flow test artifacts (simulates Save report + Capture)
    fs.writeFileSync(
      path.join(cycleDir, "01-flow-test-handoff.json"),
      JSON.stringify(ft.handoff, null, 2)
    );
    fs.writeFileSync(
      path.join(cycleDir, "01-flow-test-report.json"),
      JSON.stringify(
        {
          type: "flow-test-report",
          scenario: sc.name,
          handoff: ft.handoff,
          dropPct: ft.dropPct,
          capacityAtRating: ft.capacityAtRating,
          checks: ft.checks,
        },
        null,
        2
      )
    );

    // 2) Sprinkler — load FT data, complete estimate, save/copy
    sc.sp.project = sc.sp.project || sc.ft.project;
    const sp = sprinklerCycle(ft, sc.sp);
    ok(cycle, "SP flow > 0", sp.flowGpm > 0, String(sp.flowGpm));
    ok(cycle, "SP pressure > 0", sp.pressurePsi > 0, String(sp.pressurePsi));
    ok(cycle, "SP duration > 0", sp.durationMin > 0);
    ok(cycle, "SP remote >= 7", sp.remote >= 7 - 1e-6, String(sp.remote));
    ok(
      cycle,
      "SP handoff has FT snapshot",
      !!sp.handoff.flowTest && sp.handoff.flowTest.flowGpm === ft.handoff.flowAtResidual
    );
    ok(
      cycle,
      "SP supplyAssessment present",
      !!sp.handoff.supplyAssessment &&
        ["adequate", "marginal", "pump_required"].includes(sp.handoff.supplyAssessment.status)
    );
    if (sp.handoff.supplyAssessment) {
      ok(
        cycle,
        "SP netBoost >= 0",
        sp.handoff.supplyAssessment.netBoostPsi >= 0
      );
      if (sp.margin != null && sp.margin < 0) {
        ok(
          cycle,
          "SP negative margin => pump/marginal",
          sp.supplyStatus === "pump_required" || sp.supplyStatus === "marginal"
        );
      }
    }
    // pressure stack consistency
    ok(cycle, "SP elev = ft*0.433", Math.abs(sp.elev - (sc.sp.elevFt || 0) * PSI_PER_FT) < 0.15);

    fs.writeFileSync(
      path.join(cycleDir, "02-sprinkler-handoff.json"),
      JSON.stringify(sp.handoff, null, 2)
    );
    fs.writeFileSync(
      path.join(cycleDir, "02-sprinkler-report.json"),
      JSON.stringify(
        {
          type: "sprinkler-report",
          scenario: sc.name,
          result: {
            flowGpm: sp.flowGpm,
            pressurePsi: sp.pressurePsi,
            durationMin: sp.durationMin,
            remote: sp.remote,
            supplyAtDemand: sp.supplyAtDemand,
            margin: sp.margin,
          },
          handoff: sp.handoff,
        },
        null,
        2
      )
    );

    // 3) Pump sizer — import sprinkler, save
    sc.pump.project = sc.pump.project || sc.ft.project;
    const pump = pumpCycle(sp, sc.pump);
    ok(cycle, "PUMP system flow matches SP", pump.systemFlow === sp.flowGpm);
    ok(cycle, "PUMP system pressure matches SP", Math.abs(pump.systemPSI - sp.pressurePsi) < 0.05);
    ok(cycle, "PUMP duration matches SP", pump.durationMin === sp.durationMin);
    ok(cycle, "PUMP rated flow defined", pump.ratedGPM > 0);
    ok(cycle, "PUMP churn = 1.4*rated", Math.abs(pump.churnPSI - pump.ratedPSI * 1.4) < 0.15);
    ok(cycle, "PUMP 150% head = 0.65*rated", Math.abs(pump.oneFiftyPSI - pump.ratedPSI * 0.65) < 0.15);
    if (pump.availablePSI != null) {
      ok(cycle, "PUMP available PSI computed (N^1.85)", Number.isFinite(pump.availablePSI));
      ok(cycle, "PUMP net >= 0", pump.netPumpPSI >= 0);
      ok(
        cycle,
        "PUMP supply status set",
        ["adequate", "marginal", "pump_required"].includes(pump.supplyStatus)
      );
    }
    ok(
      cycle,
      "PUMP tank handoff has flow×duration",
      !!pump.tankHandoff &&
        pump.tankHandoff.flowGpm === pump.systemFlow &&
        pump.tankHandoff.durationMin === pump.durationMin
    );

    fs.writeFileSync(
      path.join(cycleDir, "03-pump-report.json"),
      JSON.stringify({ type: "pump-report", scenario: sc.name, pump }, null, 2)
    );
    fs.writeFileSync(
      path.join(cycleDir, "03-pump-handoff.json"),
      JSON.stringify(pump.tankHandoff, null, 2)
    );

    // 4) Tank sizer — import demand from pump/sprinkler path, save
    const tank = tankCycle(pump, sc.tank || {});
    ok(cycle, "TK base = Q*t", tank.baseGal === round0(pump.systemFlow * pump.durationMin));
    ok(
      cycle,
      "TK uses pump handoff flow",
      tank.baseGal === round0(pump.tankHandoff.flowGpm * pump.tankHandoff.durationMin)
    );
    ok(cycle, "TK required shell > base", tank.requiredShellGal >= tank.baseGal);
    ok(cycle, "TK found prefab under constraints", tank.meets, tank.meets ? "" : "no tank fit");
    if (tank.tank) {
      ok(cycle, "TK height <= max", tank.tank.htFt <= (sc.tank?.maxHeightFt ?? 99) + 1e-9);
      ok(cycle, "TK dia <= max", tank.tank.diaFt <= (sc.tank?.maxDiaFt ?? 99) + 1e-9);
      ok(cycle, "TK shell >= required", tank.tank.gal + 1 >= tank.requiredShellGal);
      ok(cycle, "TK pad larger than tank", tank.pad.padDiaFt > tank.tank.diaFt);
    }

    fs.writeFileSync(
      path.join(cycleDir, "04-tank-report.json"),
      JSON.stringify(
        {
          type: "tank-report",
          scenario: sc.name,
          fromPump: {
            flowGpm: pump.systemFlow,
            durationMin: pump.durationMin,
            pressurePsi: pump.systemPSI,
          },
          tank,
        },
        null,
        2
      )
    );

    // Combined chain file (simulates full save package)
    const chain = {
      cycle,
      name: sc.name,
      flowTest: ft.handoff,
      sprinkler: sp.handoff,
      pump,
      tank,
    };
    fs.writeFileSync(path.join(cycleDir, "00-full-chain.json"), JSON.stringify(chain, null, 2));

    const line = {
      cycle,
      name: sc.name,
      ft_dropPct: round1(ft.dropPct),
      sp_gpm: sp.flowGpm,
      sp_psi: sp.pressurePsi,
      sp_min: sp.durationMin,
      supply_margin: sp.margin,
      pump_rated: `${pump.ratedGPM}@${pump.ratedPSI}`,
      tank_gal: tank.tank?.gal ?? null,
      tank_dxh: tank.tank ? `${tank.tank.diaFt}x${tank.tank.htFt}` : null,
      pad_dia: tank.pad?.padDiaFt ?? null,
    };
    summary.push(line);
    console.log(
      `  FT drop ${line.ft_dropPct}% | SP ${line.sp_gpm} gpm @ ${line.sp_psi} psi × ${line.sp_min} min | margin ${line.supply_margin} | pump ${line.pump_rated} | tank ${line.tank_gal} gal (${line.tank_dxh}) pad⌀${line.pad_dia}`
    );
  });

  fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    path.join(OUT, "results.json"),
    JSON.stringify(
      {
        pass: results.pass,
        fail: results.fail,
        errors: results.errors,
        cycles: summary,
      },
      null,
      2
    )
  );

  console.log("\n=== SUMMARY ===");
  console.log(`Passed: ${results.pass}`);
  console.log(`Failed: ${results.fail}`);
  if (results.errors.length) {
    console.log("Failures:");
    results.errors.forEach((e) => console.log(" - " + e));
  }
  console.log(`\nArtifacts: ${OUT}`);
  process.exit(results.fail ? 1 : 0);
}

run();
