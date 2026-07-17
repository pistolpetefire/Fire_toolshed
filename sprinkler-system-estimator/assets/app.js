/**
 * Sprinkler System Estimator — preliminary / charette planning
 * NOT a Hazen-Williams final hydraulic calculation.
 */
(function () {
  "use strict";

  const APP_VERSION = "1.6.0-prelim";
  const STORAGE_KEY = "sprinklerSystemEstimator.v1";
  /** Shared handoff payload for Fire Pump Sizer (and future tank sizer) */
  const HANDOFF_KEY = "fireToolshed.sprinklerHandoff.v1";
  /** Shared handoff from Flow Test Report */
  const FLOW_TEST_HANDOFF_KEY = "fireToolshed.flowTestHandoff.v1";
  const FLOW_TEST_APP_KEY = "flow-test-report:v1";
  const FLOW_TEST_APP_KEY_LEGACY = "fire-pump-estimator:v1";
  const SUPPLY_EXPONENT = 1.85;
  const PSI_PER_FT = 0.433;

  /** Typical backflow losses used for preliminary UFC-style estimates */
  const BACKFLOW = {
    none: { label: "None / not applicable", psi: 0 },
    doubleCheck: { label: "Double check (typ. 8 psi)", psi: 8 },
    reducedPressure: { label: "Reduced pressure (typ. 12 psi)", psi: 12 },
    custom: { label: "Custom", psi: 0 },
  };

  /**
   * Generic equivalent-length / lump-sum loss templates.
   * Values are preliminary planning defaults — user must confirm project basis.
   */
  const LOSS_ITEMS = [
    {
      id: "riserAssembly",
      label: "Riser assembly (OS&Y, check, alarm valve, trim — generic)",
      basis: "Planning allowance for wet riser assembly; not project-specific HW EL.",
      defaultPsi: 5,
      defaultOn: true,
    },
    {
      id: "undergroundMain",
      label: "Underground / yard main (generic length allowance)",
      basis: "Lump-sum friction + fittings for short private main; refine with full calc later.",
      defaultPsi: 8,
      defaultOn: true,
    },
    {
      id: "interiorMain",
      label: "Interior feed main / standpipe feed (generic)",
      basis: "Preliminary interior main friction allowance.",
      defaultPsi: 6,
      defaultOn: true,
    },
    {
      id: "floorControl",
      label: "Floor control / zone valve assembly",
      basis: "Typical floor control manifold allowance.",
      defaultPsi: 3,
      defaultOn: false,
    },
    {
      id: "meter",
      label: "Fire meter / detector check (if required)",
      basis: "Generic meter loss; verify manufacturer curve.",
      defaultPsi: 4,
      defaultOn: false,
    },
    {
      id: "other",
      label: "Other documented losses (user)",
      basis: "Catch-all for project-specific items with written basis.",
      defaultPsi: 0,
      defaultOn: false,
    },
  ];

  /**
   * sys: "wet" | "dry" | "any"
   * Wet = wet pipe, single-interlock preaction, non-interlock preaction
   * Dry = dry pipe, double-interlock preaction, deluge
   * NFPA dry design areas use the common +30% remote-area increase (confirm edition).
   */
  /** NFPA 13 density-area style planning presets (ordinary / light / extra) */
  const NFPA13 = [
    { id: "custom", name: "Custom / project values", sys: "any", density: 0.1, area: 1500, hose: 100, remotePsi: 7, kFactor: 5.6, coverage: 225, note: "Enter project values." },
    // Wet
    { id: "light", name: "Light hazard — wet · 0.10/1,500 · K5.6", sys: "wet", density: 0.1, area: 1500, hose: 100, remotePsi: 7, kFactor: 5.6, coverage: 225, note: "NFPA 13 light hazard density-area (wet) planning values; confirm edition & occupancy." },
    { id: "oh1", name: "Ordinary hazard Group 1 — wet · 0.15/1,500 · K5.6", sys: "wet", density: 0.15, area: 1500, hose: 250, remotePsi: 7, kFactor: 5.6, coverage: 130, note: "OH-1 wet density-area planning; confirm with adopted NFPA 13." },
    { id: "oh2", name: "Ordinary hazard Group 2 — wet · 0.20/1,500 · K8.0", sys: "wet", density: 0.2, area: 1500, hose: 250, remotePsi: 7, kFactor: 8.0, coverage: 130, note: "OH-2 wet density-area planning; confirm with adopted NFPA 13." },
    { id: "eh1", name: "Extra hazard Group 1 — wet · 0.30/2,500 · K11.2", sys: "wet", density: 0.3, area: 2500, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "EH-1 wet planning values; often superseded by storage/special design." },
    { id: "eh2", name: "Extra hazard Group 2 — wet · 0.40/2,500 · K11.2", sys: "wet", density: 0.4, area: 2500, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "EH-2 wet planning values; verify special occupancy criteria." },
    // Dry (+30% design area per typical NFPA 13 dry/double-interlock rule)
    { id: "light-dry", name: "Light hazard — dry · 0.10/1,950 · K5.6", sys: "dry", density: 0.1, area: 1950, hose: 100, remotePsi: 7, kFactor: 5.6, coverage: 225, note: "NFPA 13 light hazard dry pipe (design area +30% vs wet 1,500 → 1,950 sf). Confirm edition; QR area reductions may not apply." },
    { id: "oh1-dry", name: "Ordinary hazard Group 1 — dry · 0.15/1,950 · K5.6", sys: "dry", density: 0.15, area: 1950, hose: 250, remotePsi: 7, kFactor: 5.6, coverage: 130, note: "OH-1 dry pipe planning: density unchanged, design area +30% (1,500 → 1,950 sf). Confirm adopted NFPA 13." },
    { id: "oh2-dry", name: "Ordinary hazard Group 2 — dry · 0.20/1,950 · K8.0", sys: "dry", density: 0.2, area: 1950, hose: 250, remotePsi: 7, kFactor: 8.0, coverage: 130, note: "OH-2 dry pipe planning: density unchanged, design area +30% (1,500 → 1,950 sf). Confirm adopted NFPA 13." },
    { id: "eh1-dry", name: "Extra hazard Group 1 — dry · 0.30/3,250 · K11.2", sys: "dry", density: 0.3, area: 3250, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "EH-1 dry pipe planning: density unchanged, design area +30% (2,500 → 3,250 sf)." },
    { id: "eh2-dry", name: "Extra hazard Group 2 — dry · 0.40/3,250 · K11.2", sys: "dry", density: 0.4, area: 3250, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "EH-2 dry pipe planning: density unchanged, design area +30% (2,500 → 3,250 sf)." },
  ];

  /**
   * UFC 3-600-01 Table 9-3 — Sprinkler Design Demand and Minimum K-Factor
   * (Change 6, 6 May 2021). Hose from Table 9-4.
   * Wet = wet / single-interlock / non-interlock preaction.
   * Dry = dry pipe / double-interlock preaction / deluge.
   * Coverage sf is planning default for remote-head K calc (not a UFC table value).
   * Note: Table 9-3 dry is N/A for ceiling height >60–100 ft.
   */
  const UFC_TABLE = [
    { id: "custom", name: "Custom UFC / project demand", sys: "any", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Enter UFC-specific project values. Confirm against adopted UFC 3-600-01 edition." },

    // —— Light hazard ——
    { id: "lt-w-30", name: "Light · ceiling ≤30 ft — 0.10/1,500 · K5.6", sys: "wet", density: 0.1, area: 1500, hose: 250, remotePsi: 7, kFactor: 5.6, coverage: 225, note: "UFC 3-600-01 Table 9-3 Light, wet, ceiling ≤30 ft: 0.10 gpm/sf over 1,500 sf; min K 5.6. Hose Table 9-4: 250 gpm (ceilings ≤60 ft)." },
    { id: "lt-d-30", name: "Light · ceiling ≤30 ft — 0.10/1,500 · K5.6", sys: "dry", density: 0.1, area: 1500, hose: 250, remotePsi: 7, kFactor: 5.6, coverage: 225, note: "UFC 3-600-01 Table 9-3 Light, dry pipe, ceiling ≤30 ft: 0.10 gpm/sf over 1,500 sf; min K 5.6. Hose Table 9-4: 250 gpm (ceilings ≤60 ft)." },
    { id: "lt-w-45", name: "Light · ceiling >30–45 ft — 0.20/2,500 · K11.2", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Light, wet, ceiling >30–45 ft: 0.20 gpm/sf over 2,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "lt-d-45", name: "Light · ceiling >30–45 ft — 0.20/3,500 · K11.2", sys: "dry", density: 0.2, area: 3500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Light, dry pipe, ceiling >30–45 ft: 0.20 gpm/sf over 3,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "lt-w-60", name: "Light · ceiling >45–60 ft — 0.20/2,500 · K11.2", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Light, wet, ceiling >45–60 ft: 0.20 gpm/sf over 2,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "lt-d-60", name: "Light · ceiling >45–60 ft — 0.20/3,500 · K11.2", sys: "dry", density: 0.2, area: 3500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Light, dry pipe, ceiling >45–60 ft: 0.20 gpm/sf over 3,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "lt-w-100", name: "Light · ceiling >60–100 ft — 12 spr. @ 7 psi · K25.2", sys: "wet", density: 0, area: 0, hose: 500, remotePsi: 7, kFactor: 25.2, coverage: 130, heads: 12, headPsi: 7, note: "UFC 3-600-01 Table 9-3 Light, wet, ceiling >60–100 ft: 12 sprinklers at 7 psi end pressure; min K 25.2. Dry = N/A for this ceiling band. Hose Table 9-4: 500 gpm (ceilings >60 ft)." },

    // —— Ordinary hazard ——
    { id: "oh-w-30", name: "Ordinary · ceiling ≤30 ft — 0.20/2,500 · K8.0", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8.0, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, wet, ceiling ≤30 ft: 0.20 gpm/sf over 2,500 sf; min K 8.0. Hose Table 9-4: 250 gpm. (OH-1 and OH-2 both use Ordinary row per UFC.)" },
    { id: "oh-d-30", name: "Ordinary · ceiling ≤30 ft — 0.20/3,500 · K8.0", sys: "dry", density: 0.2, area: 3500, hose: 250, remotePsi: 7, kFactor: 8.0, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, dry pipe, ceiling ≤30 ft: 0.20 gpm/sf over 3,500 sf; min K 8.0. Hose Table 9-4: 250 gpm." },
    { id: "oh-w-45", name: "Ordinary · ceiling >30–45 ft — 0.20/2,500 · K11.2", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, wet, ceiling >30–45 ft: 0.20 gpm/sf over 2,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "oh-d-45", name: "Ordinary · ceiling >30–45 ft — 0.20/3,500 · K11.2", sys: "dry", density: 0.2, area: 3500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, dry pipe, ceiling >30–45 ft: 0.20 gpm/sf over 3,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "oh-w-60", name: "Ordinary · ceiling >45–60 ft — 0.20/2,500 · K11.2", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, wet, ceiling >45–60 ft: 0.20 gpm/sf over 2,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "oh-d-60", name: "Ordinary · ceiling >45–60 ft — 0.20/3,500 · K11.2", sys: "dry", density: 0.2, area: 3500, hose: 250, remotePsi: 7, kFactor: 11.2, coverage: 130, note: "UFC 3-600-01 Table 9-3 Ordinary, dry pipe, ceiling >45–60 ft: 0.20 gpm/sf over 3,500 sf; min K 11.2. Hose Table 9-4: 250 gpm." },
    { id: "oh-w-100", name: "Ordinary · ceiling >60–100 ft — 12 spr. @ 7 psi · K25.2", sys: "wet", density: 0, area: 0, hose: 500, remotePsi: 7, kFactor: 25.2, coverage: 130, heads: 12, headPsi: 7, note: "UFC 3-600-01 Table 9-3 Ordinary, wet, ceiling >60–100 ft: 12 sprinklers at 7 psi end pressure; min K 25.2. Dry = N/A for this ceiling band. Hose Table 9-4: 500 gpm." },

    // —— Extra hazard ——
    { id: "eh-w-30", name: "Extra · ceiling ≤30 ft — 0.30/2,500 · K11.2", sys: "wet", density: 0.3, area: 2500, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, wet, ceiling ≤30 ft: 0.30 gpm/sf over 2,500 sf; min K 11.2. Hose Table 9-4: 500 gpm, 90 min duration. (EH-1 and EH-2 both use Extra row per UFC.)" },
    { id: "eh-d-30", name: "Extra · ceiling ≤30 ft — 0.30/3,500 · K11.2", sys: "dry", density: 0.3, area: 3500, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, dry pipe, ceiling ≤30 ft: 0.30 gpm/sf over 3,500 sf; min K 11.2. Hose Table 9-4: 500 gpm." },
    { id: "eh-w-45", name: "Extra · ceiling >30–45 ft — 0.30/3,600 · K11.2", sys: "wet", density: 0.3, area: 3600, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, wet, ceiling >30–45 ft: 0.30 gpm/sf over 3,600 sf; min K 11.2. Hose Table 9-4: 500 gpm." },
    { id: "eh-d-45", name: "Extra · ceiling >30–45 ft — 0.30/4,600 · K11.2", sys: "dry", density: 0.3, area: 4600, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, dry pipe, ceiling >30–45 ft: 0.30 gpm/sf over 4,600 sf; min K 11.2. Hose Table 9-4: 500 gpm." },
    { id: "eh-w-60", name: "Extra · ceiling >45–60 ft — 0.50/3,000 · K11.2", sys: "wet", density: 0.5, area: 3000, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, wet, ceiling >45–60 ft: 0.50 gpm/sf over 3,000 sf; min K 11.2. Hose Table 9-4: 500 gpm." },
    { id: "eh-d-60", name: "Extra · ceiling >45–60 ft — 0.50/4,000 · K11.2", sys: "dry", density: 0.5, area: 4000, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "UFC 3-600-01 Table 9-3 Extra, dry pipe, ceiling >45–60 ft: 0.50 gpm/sf over 4,000 sf; min K 11.2. Hose Table 9-4: 500 gpm." },
    { id: "eh-w-100", name: "Extra · ceiling >60–100 ft — 12 spr. @ 7 psi · K25.2", sys: "wet", density: 0, area: 0, hose: 500, remotePsi: 7, kFactor: 25.2, coverage: 100, heads: 12, headPsi: 7, note: "UFC 3-600-01 Table 9-3 Extra, wet, ceiling >60–100 ft: 12 sprinklers at 7 psi end pressure; min K 25.2. Dry = N/A for this ceiling band. Hose Table 9-4: 500 gpm." },
  ];

  /**
   * AF Sundown project criteria — wet pipe only (no dry-pipe path).
   */
  const AF_SUNDOWN = [
    {
      id: "af-sundown",
      name: "AF Sundown — 0.20 gpm/sf over 5,000 sf · K8.0 · 130 sf/head",
      sys: "wet",
      density: 0.2,
      area: 5000,
      hose: 250,
      remotePsi: 7,
      kFactor: 8.0,
      coverage: 130,
      note: "AF Sundown wet pipe criteria only: density 0.20 gpm/sf over 5,000 sf; K-factor 8.0; coverage 130 sf/head. Hose allowance 250 gpm (planning default — confirm project basis). No dry-pipe AF Sundown criteria.",
    },
  ];

  /**
   * FM Global Data Sheet inspired planning presets (generic — user must cite DS).
   * ESFR / storage-type protection: wet only (no dry-pipe presets).
   */
  const FM_PRESETS = [
    { id: "custom", name: "Custom FM / project (cite data sheet)", sys: "any", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Enter values from the governing FM Global DS for the occupancy." },
    // Wet — general hazard
    { id: "ds3-26-oh", name: "FM DS 3-26 style — ordinary hazard (wet)", sys: "wet", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Generic OH wet planning placeholder. Cite actual FM DS 3-26 tables/figures used." },
    { id: "ds3-26-eh", name: "FM DS 3-26 style — extra hazard (wet)", sys: "wet", density: 0.3, area: 2500, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "Extra hazard wet planning placeholder; confirm DS tables for process/occupancy." },
    { id: "ds5-32-dc", name: "FM DS 5-32 style — data center (wet)", sys: "wet", density: 0.3, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Data center protection varies (wet/preaction/clean agent). Cite DS 5-32 project path." },
    // ESFR / storage — wet only (no dry-pipe criteria)
    { id: "ds8-9-storage", name: "FM DS 8-9 / ESFR-type storage (wet only)", sys: "wet", density: 0.45, area: 2000, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "Storage / ESFR-type protection is wet-pipe only in this tool. Configuration-specific — replace with governing DS 8-9 / ESFR listing values for commodity, height, and aisle. No dry-pipe storage or ESFR criteria." },
    // Dry — general hazard only (not storage/ESFR)
    { id: "ds3-26-oh-dry", name: "FM DS 3-26 style — ordinary hazard (dry)", sys: "dry", density: 0.2, area: 3250, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Generic OH dry planning: area +30% (2,500 → 3,250 sf). Confirm FM DS dry/preaction rules. Not for ESFR/storage." },
    { id: "ds3-26-eh-dry", name: "FM DS 3-26 style — extra hazard (dry)", sys: "dry", density: 0.3, area: 3250, hose: 500, remotePsi: 7, kFactor: 11.2, coverage: 100, note: "Extra hazard dry planning (+30% area). Confirm DS tables. Not for ESFR/storage." },
    { id: "ds5-32-dc-dry", name: "FM DS 5-32 style — data center (dry / preaction)", sys: "dry", density: 0.3, area: 3250, hose: 250, remotePsi: 7, kFactor: 8, coverage: 130, note: "Data center dry/preaction planning (+30% area). Cite DS 5-32. Not for ESFR/storage." },
  ];

  const defaultState = () => ({
    projectName: "",
    preparedBy: "",
    date: new Date().toISOString().slice(0, 10),
    facility: "",
    notes: "",
    mode: "simple", // simple | criteria
    framework: "nfpa13", // nfpa13 | ufc | afsundown | fm
    systemType: "wet", // wet | dry — filters criteria presets
    presetId: "oh2",
    manualDemandGpm: 500,
    includeHose: true,
    density: 0.2,
    designArea: 1500,
    designHeads: 0, // UFC Table 9-3 >60 ft: number of sprinklers (0 = density-area mode)
    designHeadPsi: 7, // end-head pressure for heads-at-psi mode
    hoseGpm: 250,
    durationMin: 90,
    durationAuto: true, // when true, duration follows framework/preset table
    remotePsi: 7,
    kFactor: 8.0,
    sprinklerCoverageSf: 130,
    remoteHeadGpm: 0,
    minResidualFloor: 7,
    autoRemoteFromK: true,
    elevFt: 40,
    backflowType: "reducedPressure",
    backflowCustomPsi: 12,
    safetyMarginPsi: 5,
    systemOtherPsi: 0,
    losses: LOSS_ITEMS.map((item) => ({
      id: item.id,
      enabled: item.defaultOn,
      psi: item.defaultPsi,
    })),
    basisNotes: {
      demand: "Preliminary demand estimate for charette / concept design only.",
      losses: "Lump-sum / equivalent planning losses — not a pipe-by-pipe Hazen-Williams analysis.",
      remote:
        "When K is known: required pressure at most remote head P = max(minimum floor, (Q_head/K)^2). Q_head from density × coverage or user head flow. Not a full remote-area hydraulic proof.",
      duration: "Duration follows the active framework table (UFC 9-4, NFPA 13, or FM planning default).",
    },
    flowTest: {
      enabled: false,
      label: "",
      staticPsi: 0,
      residualPsi: 0,
      flowGpm: 0,
      minResidualPsi: 20,
      source: "none",
      capturedAt: "",
    },
  });

  let state = defaultState();

  const $ = (id) => document.getElementById(id);

  function num(v, fallback) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback || 0;
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 200);
    }, 2200);
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function round0(n) {
    return Math.round(n);
  }

  function rawPresetList() {
    if (state.framework === "ufc") return UFC_TABLE;
    if (state.framework === "afsundown") return AF_SUNDOWN;
    if (state.framework === "fm") return FM_PRESETS;
    return NFPA13;
  }

  /** Frameworks / protection types that never use dry-pipe criteria in this tool */
  function isWetOnlyFramework() {
    return state.framework === "afsundown";
  }

  function getPresetList() {
    // AF Sundown and ESFR/storage are wet-only — never list dry variants for them
    const sys = isWetOnlyFramework() || state.systemType !== "dry" ? "wet" : "dry";
    return rawPresetList().filter((p) => !p.sys || p.sys === "any" || p.sys === sys);
  }

  function getPreset() {
    const list = getPresetList();
    return list.find((p) => p.id === state.presetId) || list[0];
  }

  function systemTypeLabel(sys) {
    return sys === "dry"
      ? "Dry pipe / double-interlock preaction / deluge"
      : "Wet pipe / single-interlock / non-interlock preaction";
  }

  /**
   * Water-supply duration (minutes) by active framework.
   * UFC 3-600-01 Table 9-4: Light & Ordinary = 60 min; Extra = 90 min.
   * NFPA 13 typical hose-stream / supply duration (edition-dependent ranges):
   *   Light 30; Ordinary 60–90 (OH-1→60, OH-2→90); Extra 90–120 (EH-1→90, EH-2→120).
   * FM Global: planning defaults (cite governing DS — storage often longer).
   * AF Sundown: ordinary-style 60 min planning default.
   */
  function tableDurationForPreset(p, framework) {
    const id = (p && p.id) || "";
    const name = ((p && p.name) || "").toLowerCase();
    const fw = framework || state.framework;

    if (p && p.duration != null && Number.isFinite(Number(p.duration))) {
      return {
        min: Math.max(0, Number(p.duration)),
        basis: p.durationBasis || "Preset-specified duration.",
      };
    }

    if (fw === "ufc") {
      if (id.indexOf("eh-") === 0 || name.indexOf("extra") >= 0) {
        return {
          min: 90,
          basis: "UFC 3-600-01 Table 9-4 — Extra hazard duration: 90 minutes.",
        };
      }
      return {
        min: 60,
        basis: "UFC 3-600-01 Table 9-4 — Light / Ordinary hazard duration: 60 minutes.",
      };
    }

    if (fw === "afsundown") {
      return {
        min: 60,
        basis: "AF Sundown planning duration: 60 minutes (ordinary-style water-supply duration; confirm project criteria).",
      };
    }

    if (fw === "fm") {
      if (/storage|esfr/.test(id + name)) {
        return {
          min: 90,
          basis: "FM Global storage / ESFR-type planning duration: 90 minutes (confirm governing FM DS — may be longer).",
        };
      }
      if (/eh|extra/.test(id + name)) {
        return {
          min: 90,
          basis: "FM Global extra-hazard planning duration: 90 minutes (confirm governing FM DS).",
        };
      }
      return {
        min: 60,
        basis: "FM Global ordinary / general occupancy planning duration: 60 minutes (confirm governing FM DS).",
      };
    }

    // NFPA 13
    if (id === "light" || id === "light-dry" || name.indexOf("light") === 0) {
      return {
        min: 30,
        basis: "NFPA 13 typical light-hazard water-supply duration: 30 minutes (confirm adopted edition table).",
      };
    }
    if (id === "oh1" || id === "oh1-dry") {
      return {
        min: 60,
        basis: "NFPA 13 ordinary hazard Group 1: 60 minutes (ordinary range often 60–90 min — confirm edition).",
      };
    }
    if (id === "oh2" || id === "oh2-dry") {
      return {
        min: 90,
        basis: "NFPA 13 ordinary hazard Group 2 planning: 90 minutes (ordinary range often 60–90 min — confirm edition).",
      };
    }
    if (id === "eh1" || id === "eh1-dry") {
      return {
        min: 90,
        basis: "NFPA 13 extra hazard Group 1: 90 minutes (extra range often 90–120 min — confirm edition).",
      };
    }
    if (id === "eh2" || id === "eh2-dry") {
      return {
        min: 120,
        basis: "NFPA 13 extra hazard Group 2 planning: 120 minutes (extra range often 90–120 min — confirm edition).",
      };
    }
    return {
      min: 60,
      basis: "Default planning duration 60 minutes — set framework/preset or enter project duration.",
    };
  }

  function applyDurationFromTable() {
    const info = tableDurationForPreset(getPreset(), state.framework);
    state.durationMin = info.min;
    state.basisNotes.duration = info.basis;
    return info;
  }

  function frameworkLabel(fw) {
    const base =
      fw === "ufc"
        ? "UFC 3-600-01 Table 9-3"
        : fw === "afsundown"
          ? "AF Sundown"
          : fw === "fm"
            ? "FM Global data sheets"
            : "NFPA 13";
    const storageWetOnly =
      fw === "fm" && /storage|esfr/i.test(String(state.presetId || "") + String(getPreset()?.name || ""));
    const sysPart =
      fw === "afsundown" || storageWetOnly
        ? "wet pipe only"
        : state.systemType === "dry"
          ? "dry pipe"
          : "wet pipe";
    return base + " · " + sysPart;
  }

  function applyPreset() {
    const p = getPreset();
    if (!p || p.id === "custom") return;
    state.density = p.density;
    state.designArea = p.area;
    state.hoseGpm = p.hose;
    state.remotePsi = p.remotePsi;
    if (p.kFactor) state.kFactor = p.kFactor;
    if (p.coverage) state.sprinklerCoverageSf = p.coverage;
    if (p.heads && p.heads > 0) {
      state.designHeads = p.heads;
      state.designHeadPsi = p.headPsi != null ? p.headPsi : 7;
      // Remote head flow for K-calc = single sprinkler at design end pressure
      const K = Math.max(0, num(state.kFactor));
      const pEnd = Math.max(0, num(state.designHeadPsi, 7));
      state.remoteHeadGpm = K > 0 ? round1(K * Math.sqrt(pEnd)) : 0;
      state.remotePsi = state.designHeadPsi;
    } else {
      state.designHeads = 0;
      state.designHeadPsi = 7;
      state.remoteHeadGpm = 0;
    }
    state.basisNotes.demand = p.note;
    if (state.durationAuto !== false) {
      applyDurationFromTable();
    }
    if (state.autoRemoteFromK) {
      applyRemoteFromK();
    }
  }

  /** Sprinkler-only demand: density×area, or UFC heads-at-end-pressure mode */
  function criteriaSprinklerOnlyGpm() {
    if (num(state.designHeads) > 0) {
      const K = Math.max(0, num(state.kFactor));
      const pEnd = Math.max(0, num(state.designHeadPsi, 7));
      return num(state.designHeads) * K * Math.sqrt(pEnd);
    }
    return Math.max(0, num(state.density)) * Math.max(0, num(state.designArea));
  }

  /**
   * Remote head required pressure from K-factor:
   *   Q_head (gpm) = remoteHeadGpm override, else density × coverage (sf)
   *   P_k (psi) = (Q_head / K)^2
   *   P_remote = max(minResidualFloor, P_k)
   */
  function computeRemoteFromK() {
    const K = Math.max(0, num(state.kFactor));
    const floor = Math.max(0, num(state.minResidualFloor, 7));
    let qHead = Math.max(0, num(state.remoteHeadGpm));
    let qSource = "user remote head flow";

    if (!(qHead > 0)) {
      const dens = Math.max(0, num(state.density));
      const cov = Math.max(0, num(state.sprinklerCoverageSf));
      if (dens > 0 && cov > 0) {
        qHead = dens * cov;
        qSource = "density × coverage (" + dens + " gpm/sf × " + cov + " sf)";
      }
    }

    if (!(K > 0) || !(qHead > 0)) {
      return {
        ok: false,
        qHead: qHead,
        K: K,
        pFromK: NaN,
        pRemote: Math.max(0, num(state.remotePsi, floor)),
        floor: floor,
        qSource: qSource,
        note: "Enter K-factor and head flow (or density + coverage) to auto-calculate required pressure.",
      };
    }

    const pFromK = Math.pow(qHead / K, 2);
    const pRemote = Math.max(floor, pFromK);
    const floored = pRemote > pFromK + 1e-9;

    return {
      ok: true,
      qHead: qHead,
      K: K,
      pFromK: pFromK,
      pRemote: pRemote,
      floor: floor,
      qSource: qSource,
      floored: floored,
      note:
        "Q_head = " +
        round1(qHead) +
        " gpm (" +
        qSource +
        "); K = " +
        K +
        "; P = (Q/K)² = " +
        round1(pFromK) +
        " psi" +
        (floored ? "; raised to minimum floor " + floor + " psi" : "") +
        ".",
    };
  }

  function applyRemoteFromK() {
    const r = computeRemoteFromK();
    if (r.ok) {
      state.remotePsi = round1(r.pRemote);
      state.basisNotes.remote = r.note;
    }
    return r;
  }

  function elevLossPsi() {
    return Math.max(0, num(state.elevFt)) * PSI_PER_FT;
  }

  /** Read latest flow test from shared handoff or Flow Test Report localStorage */
  function readSavedFlowTest() {
    // 1) Explicit handoff
    try {
      const raw = localStorage.getItem(FLOW_TEST_HANDOFF_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (
          d &&
          num(d.staticPressure) > 0 &&
          num(d.residualPressure) > 0 &&
          num(d.flowAtResidual) > 0 &&
          num(d.staticPressure) > num(d.residualPressure)
        ) {
          return {
            label: d.label || d.projectName || "Saved flow test",
            staticPsi: num(d.staticPressure),
            residualPsi: num(d.residualPressure),
            flowGpm: num(d.flowAtResidual),
            minResidualPsi: num(d.minResidual, 20),
            source: "handoff",
            capturedAt: d.capturedAt || "",
            projectName: d.projectName || "",
            facility: d.facility || "",
            testPurpose: d.testPurposeLabel || d.testPurpose || "",
            residualGaugeCalDate: d.residualGaugeCalDate || "",
            pitotGaugeCalDate: d.pitotGaugeCalDate || "",
          };
        }
      }
    } catch (_) { /* ignore */ }

    // 2) Flow Test Report app state
    try {
      const raw =
        localStorage.getItem(FLOW_TEST_APP_KEY) ||
        localStorage.getItem(FLOW_TEST_APP_KEY_LEGACY);
      if (raw) {
        const d = JSON.parse(raw);
        const form = d.form || d;
        if (
          num(form.staticPressure) > 0 &&
          num(form.residualPressure) > 0 &&
          num(form.flowAtResidual) > 0 &&
          num(form.staticPressure) > num(form.residualPressure)
        ) {
          return {
            label: "Flow Test Report (browser save)",
            staticPsi: num(form.staticPressure),
            residualPsi: num(form.residualPressure),
            flowGpm: num(form.flowAtResidual),
            minResidualPsi: num(form.minResidual, 20),
            source: "flow-test-report",
            capturedAt: "",
            projectName: "",
            facility: "",
          };
        }
      }
    } catch (_) { /* ignore */ }

    return null;
  }

  function applySavedFlowTest(silent) {
    const saved = readSavedFlowTest();
    if (!saved) {
      if (!silent) toast("No saved flow test found — open Flow Test Report and click Capture for Sprinkler Estimator");
      return false;
    }
    state.flowTest.enabled = true;
    state.flowTest.label = saved.label;
    state.flowTest.staticPsi = saved.staticPsi;
    state.flowTest.residualPsi = saved.residualPsi;
    state.flowTest.flowGpm = saved.flowGpm;
    state.flowTest.minResidualPsi = saved.minResidualPsi;
    state.flowTest.source = saved.source;
    state.flowTest.capturedAt = saved.capturedAt;
    state.flowTest.testPurpose = saved.testPurpose || "";
    state.flowTest.residualGaugeCalDate = saved.residualGaugeCalDate || "";
    state.flowTest.pitotGaugeCalDate = saved.pitotGaugeCalDate || "";
    if (saved.projectName && !state.projectName) state.projectName = saved.projectName;
    if (saved.facility && !state.facility) state.facility = saved.facility;
    if (!silent) toast("Loaded flow test: " + saved.staticPsi + " / " + saved.residualPsi + " psi @ " + round0(saved.flowGpm) + " gpm");
    return true;
  }

  function flowTestValid(ft) {
    const f = ft || state.flowTest;
    return (
      f &&
      num(f.staticPsi) > 0 &&
      num(f.residualPsi) > 0 &&
      num(f.flowGpm) > 0 &&
      num(f.staticPsi) > num(f.residualPsi)
    );
  }

  /**
   * Available residual pressure on the supply curve at flow Q:
   *   P(Q) = Pstatic − (Pstatic − Presidual) × (Q / Qtest)^1.85
   */
  function supplyPressureAtFlow(q, ft) {
    const f = ft || state.flowTest;
    if (!flowTestValid(f)) return NaN;
    const drop = num(f.staticPsi) - num(f.residualPsi);
    const ratio = Math.max(0, num(q)) / Math.max(num(f.flowGpm), 1e-9);
    return num(f.staticPsi) - drop * Math.pow(ratio, SUPPLY_EXPONENT);
  }

  function assessSupply(calc) {
    if (!state.flowTest.enabled || !flowTestValid()) {
      return { ok: false, reason: "no-test" };
    }
    const demandQ = calc.flowGpm;
    const demandP = calc.pressurePsi;
    const avail = supplyPressureAtFlow(demandQ);
    const margin = avail - demandP;
    const netBoostPsi = Math.max(0, -margin);
    const extrapolated = demandQ > num(state.flowTest.flowGpm);
    const belowMin =
      Number.isFinite(avail) && avail < num(state.flowTest.minResidualPsi);
    let status = "ok";
    let message = "";
    if (!Number.isFinite(avail)) {
      status = "invalid";
      message = "Invalid supply curve inputs.";
    } else if (margin >= 0 && !belowMin) {
      status = "adequate";
      message =
        "Supply adequate: available " +
        round1(avail) +
        " psi at demand flow — about " +
        round1(margin) +
        " psi above system demand" +
        (extrapolated ? " (extrapolated beyond test flow)" : "") +
        ". Net pump boost ≈ 0 psi.";
    } else if (margin >= 0 && belowMin) {
      // Meets demand but under preferred residual — treat as marginal for handoff
      status = "marginal";
      message =
        "Marginal: supply meets demand pressure but falls below min residual reference (" +
        round1(num(state.flowTest.minResidualPsi)) +
        " psi) at demand flow. Review residual policy / pump boost.";
    } else if (avail >= demandP * 0.6) {
      status = "marginal";
      message =
        "Marginal supply: available " +
        round1(avail) +
        " psi — about " +
        round1(Math.abs(margin)) +
        " psi short of demand" +
        (extrapolated ? " (extrapolated beyond test flow)" : "") +
        ". Pump must add ≈ " +
        round1(netBoostPsi) +
        " psi net boost.";
    } else {
      status = "pump_required";
      message =
        "Pump required: available " +
        round1(avail) +
        " psi is well below system demand " +
        round1(demandP) +
        " psi (shortfall " +
        round1(Math.abs(margin)) +
        " psi" +
        (extrapolated ? "; extrapolated beyond test flow" : "") +
        "). Net pump boost ≈ " +
        round1(netBoostPsi) +
        " psi. Capture for Fire Pump Sizer.";
    }
    return {
      ok: true,
      status: status,
      message: message,
      availablePsi: round1(avail),
      demandPsi: demandP,
      demandGpm: demandQ,
      marginPsi: round1(margin),
      netBoostPsi: round1(netBoostPsi),
      extrapolated: extrapolated,
      testStatic: round1(num(state.flowTest.staticPsi)),
      testResidual: round1(num(state.flowTest.residualPsi)),
      testFlow: round0(num(state.flowTest.flowGpm)),
    };
  }

  function buildSupplyChartModel(calc) {
    if (!state.flowTest.enabled || !flowTestValid()) return null;
    const ft = state.flowTest;
    const demandQ = Math.max(0, calc.flowGpm);
    const demandP = Math.max(0, calc.pressurePsi);
    const testQ = Math.max(1, num(ft.flowGpm));
    const staticP = num(ft.staticPsi);
    const residualP = num(ft.residualPsi);
    const minRes = num(ft.minResidualPsi, 20);
    const availAtDemand = supplyPressureAtFlow(demandQ, ft);

    const maxFlow = Math.max(600, demandQ * 1.3, testQ * 1.2, 1);
    const maxPressure = Math.max(
      60,
      staticP * 1.12,
      demandP * 1.25,
      minRes * 1.4,
      Number.isFinite(availAtDemand) ? Math.max(0, availAtDemand) * 1.15 : 0
    );
    const maxHyd = Math.pow(maxFlow, SUPPLY_EXPONENT);

    const padL = 56;
    const padR = 24;
    const padT = 28;
    const padB = 48;
    const plotW = 640 - padL - padR;
    const plotH = 320 - padT - padB;

    const xOf = (q) =>
      padL + (Math.pow(Math.max(0, q), SUPPLY_EXPONENT) / maxHyd) * plotW;
    const yOf = (p) => padT + plotH - (Math.max(0, p) / maxPressure) * plotH;

    const pathPts = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const q = (i / steps) * maxFlow;
      const p = Math.max(0, supplyPressureAtFlow(q, ft));
      pathPts.push([xOf(q), yOf(p)]);
    }
    const supplyPath = pathPts
      .map((pt, i) => (i === 0 ? "M " : "L ") + pt[0].toFixed(1) + " " + pt[1].toFixed(1))
      .join(" ");

    const demandX = xOf(demandQ);
    const demandY = yOf(demandP);
    const supplyAtDemandY = yOf(Math.max(0, availAtDemand));
    const minY = yOf(minRes);

    // Tick labels
    const flowTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxFlow);
    const psiTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxPressure);

    return {
      maxFlow: maxFlow,
      maxPressure: maxPressure,
      supplyPath: supplyPath,
      demandX: demandX,
      demandY: demandY,
      supplyAtDemandY: supplyAtDemandY,
      minY: minY,
      minRes: minRes,
      padL: padL,
      padT: padT,
      plotW: plotW,
      plotH: plotH,
      flowTicks: flowTicks,
      psiTicks: psiTicks,
      xOf: xOf,
      yOf: yOf,
      staticP: staticP,
      residualP: residualP,
      testQ: testQ,
      demandQ: demandQ,
      demandP: demandP,
      availAtDemand: availAtDemand,
      label: ft.label || "Flow test",
    };
  }

  function renderSupplySvg(model) {
    if (!model) return "";
    const svg = [];
    // background
    svg.push(
      '<rect x="0" y="0" width="640" height="320" fill="#fafbfc" rx="8"/>'
    );
    // plot border
    svg.push(
      `<rect x="${model.padL}" y="${model.padT}" width="${model.plotW}" height="${model.plotH}" fill="#fff" stroke="#e2e8f0"/>`
    );

    // grid + ticks
    model.flowTicks.forEach((q) => {
      const x = model.xOf(q);
      svg.push(
        `<line x1="${x}" y1="${model.padT}" x2="${x}" y2="${model.padT + model.plotH}" stroke="#f1f5f9"/>`
      );
      svg.push(
        `<line x1="${x}" y1="${model.padT + model.plotH}" x2="${x}" y2="${model.padT + model.plotH + 6}" stroke="#94a3b8"/>`
      );
      svg.push(
        `<text x="${x}" y="${model.padT + model.plotH + 22}" text-anchor="middle" fill="#64748b" font-size="11" font-family="system-ui,sans-serif">${round0(q)}</text>`
      );
    });
    model.psiTicks.forEach((p) => {
      const y = model.yOf(p);
      svg.push(
        `<line x1="${model.padL}" y1="${y}" x2="${model.padL + model.plotW}" y2="${y}" stroke="#f1f5f9"/>`
      );
      svg.push(
        `<line x1="${model.padL - 6}" y1="${y}" x2="${model.padL}" y2="${y}" stroke="#94a3b8"/>`
      );
      svg.push(
        `<text x="${model.padL - 10}" y="${y + 4}" text-anchor="end" fill="#64748b" font-size="11" font-family="system-ui,sans-serif">${round0(p)}</text>`
      );
    });

    // axis labels
    svg.push(
      `<text x="${model.padL + model.plotW / 2}" y="308" text-anchor="middle" fill="#64748b" font-size="12" font-family="system-ui,sans-serif">Flow, gpm (N^${SUPPLY_EXPONENT} scale)</text>`
    );
    svg.push(
      `<text x="16" y="${model.padT + model.plotH / 2}" text-anchor="middle" fill="#64748b" font-size="12" font-family="system-ui,sans-serif" transform="rotate(-90 16 ${model.padT + model.plotH / 2})">Pressure, psi</text>`
    );

    // min residual reference
    svg.push(
      `<line x1="${model.padL}" y1="${model.minY}" x2="${model.padL + model.plotW}" y2="${model.minY}" stroke="#d19b28" stroke-width="2" stroke-dasharray="4 6"/>`
    );

    // supply curve
    svg.push(
      `<path d="${model.supplyPath}" fill="none" stroke="#0f766e" stroke-width="3.5"/>`
    );

    // test residual point
    const testX = model.xOf(model.testQ);
    const testY = model.yOf(model.residualP);
    svg.push(`<circle cx="${testX}" cy="${testY}" r="5" fill="#0f766e" stroke="#fff" stroke-width="1.5"/>`);

    // static at Q=0
    svg.push(
      `<circle cx="${model.xOf(0)}" cy="${model.yOf(model.staticP)}" r="4" fill="#0f766e" opacity="0.7"/>`
    );

    // demand vertical guide
    svg.push(
      `<line x1="${model.demandX}" y1="${model.padT}" x2="${model.demandX}" y2="${model.padT + model.plotH}" stroke="#94a3b8" stroke-dasharray="5 6"/>`
    );

    // available supply at demand flow
    if (Number.isFinite(model.availAtDemand) && model.availAtDemand > 0) {
      svg.push(
        `<circle cx="${model.demandX}" cy="${model.supplyAtDemandY}" r="5" fill="#0f766e" stroke="#134e4a" stroke-width="1"/>`
      );
    }

    // demand point (system estimator)
    svg.push(
      `<circle cx="${model.demandX}" cy="${model.demandY}" r="7" fill="#b91c1c" stroke="#fff" stroke-width="2"/>`
    );

    // legend
    const lx = 360;
    const ly = 36;
    svg.push(`<rect x="${lx - 8}" y="${ly - 14}" width="250" height="78" fill="#fff" fill-opacity="0.92" stroke="#e2e8f0" rx="6"/>`);
    svg.push(`<line x1="${lx}" y1="${ly}" x2="${lx + 28}" y2="${ly}" stroke="#0f766e" stroke-width="3.5"/>`);
    svg.push(`<text x="${lx + 36}" y="${ly + 4}" fill="#334155" font-size="12" font-family="system-ui,sans-serif">Supply curve (N^${SUPPLY_EXPONENT})</text>`);
    svg.push(`<circle cx="${lx + 14}" cy="${ly + 22}" r="6" fill="#b91c1c"/>`);
    svg.push(`<text x="${lx + 36}" y="${ly + 26}" fill="#334155" font-size="12" font-family="system-ui,sans-serif">System demand point</text>`);
    svg.push(`<line x1="${lx}" y1="${ly + 44}" x2="${lx + 28}" y2="${ly + 44}" stroke="#d19b28" stroke-width="2" stroke-dasharray="4 6"/>`);
    svg.push(`<text x="${lx + 36}" y="${ly + 48}" fill="#334155" font-size="12" font-family="system-ui,sans-serif">Min residual reference</text>`);

    return svg.join("");
  }

  function supplyChartRows(calc, assess) {
    if (!flowTestValid()) return [];
    const ft = state.flowTest;
    const avail = assess && assess.ok ? assess.availablePsi : round1(supplyPressureAtFlow(calc.flowGpm));
    return [
      {
        point: "Static (Q = 0)",
        flow: 0,
        psi: round1(num(ft.staticPsi)),
        notes: "No-flow static from hydrant test",
      },
      {
        point: "Test residual",
        flow: round0(num(ft.flowGpm)),
        psi: round1(num(ft.residualPsi)),
        notes: "Measured residual at test flow",
      },
      {
        point: "Supply at demand flow",
        flow: calc.flowGpm,
        psi: avail,
        notes:
          "P = Pstatic − ΔP×(Q/Qtest)^" +
          SUPPLY_EXPONENT +
          (assess && assess.extrapolated ? " · extrapolated past test flow" : ""),
      },
      {
        point: "System demand (estimator)",
        flow: calc.flowGpm,
        psi: calc.pressurePsi,
        notes: "Sprinkler estimator duty point (flow @ system demand pressure)",
      },
      {
        point: "Min residual reference",
        flow: "—",
        psi: round1(num(ft.minResidualPsi, 20)),
        notes: "Reference line only",
      },
    ];
  }

  function renderSupplyAnalysis(calc) {
    const wrap = $("supplyCurveWrap");
    const svgEl = $("supplyCurveSvg");
    const tbody = $("supplyChartTableBody");
    const assessEl = $("supplyAssessment");
    const statusEl = $("flowTestStatus");
    const printSec = $("printSupplySection");
    const printHost = $("printSupplySvgHost");
    const printBody = $("printSupplyTableBody");
    const printMeta = $("printSupplyMeta");
    const printAssess = $("printSupplyAssessment");

    const active = state.flowTest.enabled && flowTestValid();
    if (statusEl) {
      if (!state.flowTest.enabled) {
        statusEl.textContent =
          "Flow test overlay off. Load a saved test or enter static / residual / flow and enable the checkbox.";
      } else if (!flowTestValid()) {
        statusEl.textContent =
          "Enter static > residual and flow at residual, or load a saved Flow Test Report.";
      } else {
        statusEl.textContent =
          (state.flowTest.label || "Flow test") +
          ": " +
          round1(num(state.flowTest.staticPsi)) +
          " psi static · " +
          round1(num(state.flowTest.residualPsi)) +
          " psi residual @ " +
          round0(num(state.flowTest.flowGpm)) +
          " gpm" +
          (state.flowTest.testPurpose ? " · " + state.flowTest.testPurpose : "") +
          (state.flowTest.capturedAt
            ? " · captured " + new Date(state.flowTest.capturedAt).toLocaleString()
            : "");
      }
    }

    if (!active) {
      wrap?.classList.add("hidden");
      if (printSec) printSec.style.display = "none";
      if (svgEl) svgEl.innerHTML = "";
      if (tbody) tbody.innerHTML = "";
      return;
    }

    wrap?.classList.remove("hidden");
    const model = buildSupplyChartModel(calc);
    const assess = assessSupply(calc);
    const svgMarkup = renderSupplySvg(model);
    if (svgEl) svgEl.innerHTML = svgMarkup;

    if (assessEl) {
      const cls =
        assess.status === "adequate"
          ? "ok"
          : assess.status === "pump_required" || assess.status === "invalid"
            ? "bad"
            : assess.status === "marginal"
              ? "warn"
              : "info";
      assessEl.className = "callout " + cls;
      assessEl.textContent = assess.message || "";
    }

    const rows = supplyChartRows(calc, assess);
    const rowHtml = rows
      .map(
        (r) =>
          `<tr><td>${escapeHtml(r.point)}</td><td class="num">${r.flow}</td><td class="num">${r.psi}</td><td>${escapeHtml(r.notes)}</td></tr>`
      )
      .join("");
    if (tbody) tbody.innerHTML = rowHtml;

    // Print report section
    if (printSec) printSec.style.display = "block";
    if (printHost) {
      printHost.innerHTML =
        `<svg viewBox="0 0 640 320" style="width:100%;height:auto;max-height:320px">${svgMarkup}</svg>`;
    }
    if (printBody) printBody.innerHTML = rowHtml;
    if (printMeta) {
      printMeta.textContent =
        (state.flowTest.label || "Flow test") +
        " · Supply curve P = Pstatic − (Pstatic−Presidual)×(Q/Qtest)^" +
        SUPPLY_EXPONENT +
        " · Flow axis uses N^" +
        SUPPLY_EXPONENT +
        " hydraulic scale.";
    }
    if (printAssess) printAssess.textContent = assess.message || "";
  }

  function backflowLossPsi() {
    if (state.backflowType === "custom") return Math.max(0, num(state.backflowCustomPsi));
    return BACKFLOW[state.backflowType]?.psi || 0;
  }

  function lossItemsTotal() {
    return state.losses.reduce((sum, row) => {
      if (!row.enabled) return sum;
      return sum + Math.max(0, num(row.psi));
    }, 0);
  }

  function sprinklerDemandGpm() {
    if (state.mode === "simple") {
      return Math.max(0, num(state.manualDemandGpm));
    }
    const q = criteriaSprinklerOnlyGpm();
    const hose = state.includeHose ? Math.max(0, num(state.hoseGpm)) : 0;
    return q + hose;
  }

  function sprinklerOnlyGpm() {
    if (state.mode === "simple") {
      // In simple mode, hose is assumed included in manual total unless user notes otherwise
      return Math.max(0, num(state.manualDemandGpm));
    }
    return criteriaSprinklerOnlyGpm();
  }

  function calculate() {
    const kCalc = state.autoRemoteFromK ? applyRemoteFromK() : computeRemoteFromK();

    const elev = elevLossPsi();
    const backflow = backflowLossPsi();
    const equipLosses = lossItemsTotal();
    const other = Math.max(0, num(state.systemOtherPsi));
    const safety = Math.max(0, num(state.safetyMarginPsi));
    const remote = Math.max(0, num(state.remotePsi));

    const flowGpm = sprinklerDemandGpm();
    const pressurePsi =
      remote + elev + backflow + equipLosses + other + safety;

    const remoteLabel = state.autoRemoteFromK && kCalc.ok
      ? "Remote head required pressure (from K-factor)"
      : "Remote head required pressure (min at remote head)";

    const breakdown = [
      { id: "remote", label: remoteLabel, psi: remote, basis: state.basisNotes.remote },
      { id: "elev", label: `Elevation (${round0(num(state.elevFt))} ft × 0.433 psi/ft)`, psi: elev, basis: "Static head from pump discharge datum to highest sprinkler / roof level used for planning." },
      { id: "backflow", label: `Backflow preventer (${BACKFLOW[state.backflowType]?.label || "Custom"})`, psi: backflow, basis: "Typical device allowance for concept design; verify manufacturer pressure loss at design flow." },
    ];

    LOSS_ITEMS.forEach((meta) => {
      const row = state.losses.find((l) => l.id === meta.id);
      if (!row || !row.enabled) return;
      breakdown.push({
        id: meta.id,
        label: meta.label,
        psi: Math.max(0, num(row.psi)),
        basis: meta.basis,
      });
    });

    if (other > 0) {
      breakdown.push({
        id: "otherSys",
        label: "Additional system losses (user)",
        psi: other,
        basis: "User-entered remainder for project-specific items.",
      });
    }

    if (safety > 0) {
      breakdown.push({
        id: "safety",
        label: "Planning safety margin",
        psi: safety,
        basis: "Explicit contingency for charette-level uncertainty; not a code safety factor.",
      });
    }

    const durationMin = Math.max(0, round0(num(state.durationMin)));
    const tankGalPrelim = round0(flowGpm * durationMin); // gpm × min ≈ gallons for constant demand

    return {
      flowGpm: round0(flowGpm),
      sprinklerOnlyGpm: round0(sprinklerOnlyGpm()),
      hoseGpm: state.mode === "simple" ? 0 : state.includeHose ? round0(num(state.hoseGpm)) : 0,
      pressurePsi: round1(pressurePsi),
      elevPsi: round1(elev),
      backflowPsi: round1(backflow),
      equipLossPsi: round1(equipLosses),
      remotePsi: round1(remote),
      safetyPsi: round1(safety),
      durationMin: durationMin,
      durationBasis: state.basisNotes.duration || "",
      tankGalPrelim: tankGalPrelim,
      breakdown,
      kCalc: kCalc,
      frameworkLabel: frameworkLabel(state.framework),
      modeLabel: state.mode === "simple" ? "Simple (manual demand)" : "Criteria-assisted estimate",
      designHeads: num(state.designHeads),
      designHeadPsi: num(state.designHeadPsi, 7),
      systemTypeLabel: systemTypeLabel(state.systemType),
      presetName: getPreset()?.name || "—",
    };
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state = { ...defaultState(), ...parsed };
      // Ensure losses array shape
      const defaults = defaultState().losses;
      state.losses = defaults.map((d) => {
        const found = (parsed.losses || []).find((l) => l.id === d.id);
        return found ? { ...d, ...found } : d;
      });
      state.flowTest = { ...defaultState().flowTest, ...(parsed.flowTest || {}) };
      state.basisNotes = { ...defaultState().basisNotes, ...(parsed.basisNotes || {}) };
    } catch (_) { /* ignore */ }
  }

  function populatePresets() {
    const sel = $("presetSelect");
    if (!sel) return;
    const list = getPresetList();
    sel.innerHTML = list
      .map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`)
      .join("");
    if (!list.some((p) => p.id === state.presetId)) {
      state.presetId = list[0].id;
    }
    sel.value = state.presetId;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readForm() {
    state.projectName = $("projectName")?.value || "";
    state.preparedBy = $("preparedBy")?.value || "";
    state.date = $("reportDate")?.value || state.date;
    state.facility = $("facility")?.value || "";
    state.notes = $("projectNotes")?.value || "";
    state.mode = document.querySelector('input[name="mode"]:checked')?.value || "simple";
    state.framework = document.querySelector('input[name="framework"]:checked')?.value || "nfpa13";
    state.systemType = document.querySelector('input[name="systemType"]:checked')?.value || "wet";
    state.presetId = $("presetSelect")?.value || state.presetId;
    state.manualDemandGpm = num($("manualDemandGpm")?.value, 0);
    state.includeHose = !!$("includeHose")?.checked;
    state.density = num($("density")?.value, 0);
    state.designArea = num($("designArea")?.value, 0);
    // Manual density-area entry exits UFC "12 sprinklers @ end psi" mode
    if (state.density > 0 && state.designArea > 0) {
      state.designHeads = 0;
    }
    state.hoseGpm = num($("hoseGpm")?.value, 0);
    state.durationAuto = $("durationAuto") ? !!$("durationAuto").checked : state.durationAuto !== false;
    if (state.durationAuto) {
      applyDurationFromTable();
    } else {
      state.durationMin = num($("durationMin")?.value, 60);
      if ($("durationBasis") && document.activeElement === $("durationBasis")) {
        state.basisNotes.duration = $("durationBasis").value;
      } else if ($("durationBasis")?.value) {
        state.basisNotes.duration = $("durationBasis").value;
      }
    }
    state.remotePsi = num($("remotePsi")?.value, 7);
    state.kFactor = num($("kFactor")?.value, 5.6);
    state.sprinklerCoverageSf = num($("sprinklerCoverageSf")?.value, 130);
    state.remoteHeadGpm = num($("remoteHeadGpm")?.value, 0);
    state.minResidualFloor = num($("minResidualFloor")?.value, 7);
    state.autoRemoteFromK = !!$("autoRemoteFromK")?.checked;
    state.elevFt = num($("elevFt")?.value, 0);
    state.backflowType = $("backflowType")?.value || "none";
    state.backflowCustomPsi = num($("backflowCustomPsi")?.value, 0);
    state.safetyMarginPsi = num($("safetyMarginPsi")?.value, 0);
    state.systemOtherPsi = num($("systemOtherPsi")?.value, 0);
    state.basisNotes.demand = $("demandBasis")?.value || state.basisNotes.demand;
    state.basisNotes.losses = $("lossBasis")?.value || state.basisNotes.losses;
    state.basisNotes.remote = $("remoteBasis")?.value || state.basisNotes.remote;
    if (!state.durationAuto && $("durationBasis")) {
      state.basisNotes.duration = $("durationBasis").value || state.basisNotes.duration;
    }

    if (!state.flowTest) state.flowTest = defaultState().flowTest;
    state.flowTest.enabled = !!$("flowTestEnabled")?.checked;
    state.flowTest.staticPsi = num($("ftStatic")?.value, 0);
    state.flowTest.residualPsi = num($("ftResidual")?.value, 0);
    state.flowTest.flowGpm = num($("ftFlow")?.value, 0);
    state.flowTest.minResidualPsi = num($("ftMinResidual")?.value, 20);
    if (state.flowTest.enabled && flowTestValid() && state.flowTest.source === "none") {
      state.flowTest.source = "manual";
      state.flowTest.label = state.flowTest.label || "Manual hydrant test entry";
    }

    state.losses = LOSS_ITEMS.map((meta) => {
      const en = document.querySelector(`[data-loss-en="${meta.id}"]`);
      const psi = document.querySelector(`[data-loss-psi="${meta.id}"]`);
      return {
        id: meta.id,
        enabled: en ? !!en.checked : false,
        psi: psi ? num(psi.value, 0) : 0,
      };
    });
  }

  function writeForm() {
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("preparedBy")) $("preparedBy").value = state.preparedBy;
    if ($("reportDate")) $("reportDate").value = state.date;
    if ($("facility")) $("facility").value = state.facility;
    if ($("projectNotes")) $("projectNotes").value = state.notes;

    if (isWetOnlyFramework()) state.systemType = "wet";

    const modeEl = document.querySelector(`input[name="mode"][value="${state.mode}"]`);
    if (modeEl) modeEl.checked = true;
    const fw = document.querySelector(`input[name="framework"][value="${state.framework}"]`);
    if (fw) fw.checked = true;
    const sysEl = document.querySelector(`input[name="systemType"][value="${state.systemType}"]`);
    if (sysEl) sysEl.checked = true;
    updateSystemTypeUi();

    populatePresets();
    if ($("manualDemandGpm")) $("manualDemandGpm").value = state.manualDemandGpm;
    if ($("includeHose")) $("includeHose").checked = state.includeHose;
    if ($("density")) $("density").value = state.density;
    if ($("designArea")) $("designArea").value = state.designArea;
    if ($("hoseGpm")) $("hoseGpm").value = state.hoseGpm;
    if ($("durationAuto")) $("durationAuto").checked = state.durationAuto !== false;
    if ($("durationMin")) {
      $("durationMin").value = state.durationMin;
      $("durationMin").readOnly = state.durationAuto !== false;
    }
    if ($("durationBasis")) $("durationBasis").value = state.basisNotes.duration || "";
    if ($("remotePsi")) {
      $("remotePsi").value = state.remotePsi;
      $("remotePsi").readOnly = !!state.autoRemoteFromK;
      $("remotePsi").title = state.autoRemoteFromK
        ? "Auto-calculated from K-factor — uncheck auto to edit manually"
        : "Manual remote head required pressure";
    }
    if ($("kFactor")) $("kFactor").value = state.kFactor;
    if ($("sprinklerCoverageSf")) $("sprinklerCoverageSf").value = state.sprinklerCoverageSf;
    if ($("remoteHeadGpm")) $("remoteHeadGpm").value = state.remoteHeadGpm || "";
    if ($("minResidualFloor")) $("minResidualFloor").value = state.minResidualFloor;
    if ($("autoRemoteFromK")) $("autoRemoteFromK").checked = !!state.autoRemoteFromK;
    if ($("elevFt")) $("elevFt").value = state.elevFt;
    if ($("backflowType")) $("backflowType").value = state.backflowType;
    if ($("backflowCustomPsi")) $("backflowCustomPsi").value = state.backflowCustomPsi;
    if ($("safetyMarginPsi")) $("safetyMarginPsi").value = state.safetyMarginPsi;
    if ($("systemOtherPsi")) $("systemOtherPsi").value = state.systemOtherPsi;
    if ($("demandBasis")) $("demandBasis").value = state.basisNotes.demand;
    if ($("lossBasis")) $("lossBasis").value = state.basisNotes.losses;
    if ($("remoteBasis")) $("remoteBasis").value = state.basisNotes.remote;

    if (!state.flowTest) state.flowTest = defaultState().flowTest;
    if ($("flowTestEnabled")) $("flowTestEnabled").checked = !!state.flowTest.enabled;
    if ($("ftStatic")) $("ftStatic").value = state.flowTest.staticPsi || "";
    if ($("ftResidual")) $("ftResidual").value = state.flowTest.residualPsi || "";
    if ($("ftFlow")) $("ftFlow").value = state.flowTest.flowGpm || "";
    if ($("ftMinResidual")) $("ftMinResidual").value = state.flowTest.minResidualPsi || 20;

    renderLossTable();
    updateModeVisibility();
  }

  function renderLossTable() {
    const tbody = $("lossTableBody");
    if (!tbody) return;
    tbody.innerHTML = LOSS_ITEMS.map((meta) => {
      const row = state.losses.find((l) => l.id === meta.id) || {
        id: meta.id,
        enabled: meta.defaultOn,
        psi: meta.defaultPsi,
      };
      return `
        <tr>
          <td><input type="checkbox" data-loss-en="${meta.id}" ${row.enabled ? "checked" : ""} aria-label="Include ${escapeHtml(meta.label)}"></td>
          <td>
            <div>${escapeHtml(meta.label)}</div>
            <div class="sub" style="font-size:0.7rem;color:var(--muted)">${escapeHtml(meta.basis)}</div>
          </td>
          <td class="num">
            <input type="number" data-loss-psi="${meta.id}" step="0.5" min="0" value="${row.psi}" ${row.enabled ? "" : "disabled"}>
          </td>
        </tr>
      `;
    }).join("");
  }

  function updateModeVisibility() {
    const simple = state.mode === "simple";
    $("simpleDemandPanel")?.classList.toggle("hidden", !simple);
    $("criteriaDemandPanel")?.classList.toggle("hidden", simple);
    $("backflowCustomWrap")?.classList.toggle("hidden", state.backflowType !== "custom");
  }

  function render() {
    const calc = calculate();

    // Keep remote field in sync when auto-K is on
    if (state.autoRemoteFromK && $("remotePsi")) {
      $("remotePsi").value = state.remotePsi;
      $("remotePsi").readOnly = true;
    } else if ($("remotePsi")) {
      $("remotePsi").readOnly = false;
    }

    $("metricFlow").textContent = String(calc.flowGpm);
    $("metricPressure").textContent = String(calc.pressurePsi);
    $("metricElev").textContent = String(calc.elevPsi);
    $("metricRemote").textContent = String(calc.remotePsi);
    if ($("metricDuration")) $("metricDuration").textContent = String(calc.durationMin);

    $("resultFlow").textContent = calc.flowGpm + " GPM";
    $("resultPressure").textContent = calc.pressurePsi + " PSI";
    if ($("resultDuration")) $("resultDuration").textContent = calc.durationMin + " min";
    if ($("resultTank")) $("resultTank").textContent = calc.tankGalPrelim.toLocaleString() + " gal";
    $("resultMode").textContent = calc.modeLabel + " · " + calc.frameworkLabel;

    if ($("durationMin") && state.durationAuto !== false) {
      $("durationMin").value = calc.durationMin;
      $("durationMin").readOnly = true;
    } else if ($("durationMin")) {
      $("durationMin").readOnly = false;
    }
    if ($("durationBasis") && state.durationAuto !== false && document.activeElement !== $("durationBasis")) {
      $("durationBasis").value = calc.durationBasis || state.basisNotes.duration || "";
    }
    if ($("exportDuration")) $("exportDuration").textContent = String(calc.durationMin);

    const kBox = $("kResultCallout");
    if (kBox) {
      const k = calc.kCalc;
      if (state.autoRemoteFromK && k && k.ok) {
        kBox.className = "callout " + (k.floored ? "warn" : "ok");
        kBox.innerHTML =
          "<strong>K-factor required pressure:</strong> Q<sub>head</sub> = " +
          round1(k.qHead) +
          " gpm · K = " +
          k.K +
          " · (Q/K)² = <strong>" +
          round1(k.pFromK) +
          " psi</strong>" +
          (k.floored
            ? " → using floor <strong>" + round1(k.pRemote) + " psi</strong>"
            : " → remote head required pressure <strong>" + round1(k.pRemote) + " psi</strong>") +
          "<br><span style='opacity:0.9'>" +
          escapeHtml(k.note) +
          "</span>";
      } else if (state.autoRemoteFromK) {
        kBox.className = "callout warn";
        kBox.textContent =
          (k && k.note) ||
          "Auto required pressure needs K > 0 and head flow (set coverage + density, or enter remote head GPM).";
      } else {
        kBox.className = "callout info";
        kBox.textContent =
          "Manual remote head required pressure mode. Enable “Auto-set remote head required pressure from K-factor” to compute P = (Q/K)².";
      }
    }

    if ($("remoteBasis") && state.autoRemoteFromK && calc.kCalc && calc.kCalc.ok) {
      // Keep basis textarea aligned with calc (user can still edit after unchecking auto)
      if (document.activeElement !== $("remoteBasis")) {
        $("remoteBasis").value = state.basisNotes.remote;
      }
    }

    const bd = $("breakdownList");
    if (bd) {
      bd.innerHTML =
        calc.breakdown
          .map(
            (row) => `
          <div class="row">
            <span title="${escapeHtml(row.basis)}">${escapeHtml(row.label)}</span>
            <strong>${round1(row.psi)} psi</strong>
          </div>
        `,
          )
          .join("") +
        `<div class="row total"><span>System demand pressure (prelim)</span><strong>${calc.pressurePsi} psi</strong></div>
         <div class="row total"><span>System demand flow (prelim)</span><strong>${calc.flowGpm} gpm</strong></div>` +
        (calc.designHeads > 0
          ? `<div class="row"><span style="color:var(--muted);font-size:0.85rem">Flow basis: ${round0(calc.designHeads)} sprinklers × K ${state.kFactor} × √${round1(calc.designHeadPsi)} psi` +
            (calc.hoseGpm ? ` + ${calc.hoseGpm} gpm hose` : "") +
            `</span><strong></strong></div>`
          : state.mode === "criteria"
            ? `<div class="row"><span style="color:var(--muted);font-size:0.85rem">Flow basis: ${state.density} gpm/sf × ${round0(state.designArea)} sf` +
              (calc.hoseGpm ? ` + ${calc.hoseGpm} gpm hose` : "") +
              `</span><strong></strong></div>`
            : "");
    }

    $("exportFlow").textContent = String(calc.flowGpm);
    $("exportPressure").textContent = String(calc.pressurePsi);
    if ($("exportDuration")) $("exportDuration").textContent = String(calc.durationMin);

    // Print / clean report fields
    const setTxt = (id, v) => {
      if ($(id)) $(id).textContent = v;
    };
    setTxt("printProject", state.projectName || "—");
    setTxt("printBy", state.preparedBy || "—");
    setTxt("printDate", state.date || "—");
    setTxt("printFacility", state.facility || "—");
    setTxt("printFramework", calc.frameworkLabel);
    setTxt("printMode", calc.modeLabel);
    setTxt("printPreset", calc.presetName);
    setTxt("printSystemType", calc.systemTypeLabel);
    setTxt("printNotes", state.notes || "—");
    setTxt("printDemandBasis", state.basisNotes.demand || "—");
    setTxt("printLossBasis", state.basisNotes.losses || "—");
    setTxt("printDurationBasis", calc.durationBasis || "—");
    setTxt("printRemoteBasis", state.basisNotes.remote || "—");
    setTxt("printFlow", calc.flowGpm + " GPM");
    setTxt("printPressure", calc.pressurePsi + " PSI");
    setTxt("printDuration", calc.durationMin + " min");
    setTxt(
      "printTank",
      calc.tankGalPrelim.toLocaleString() + " gal (flow × duration, prelim)"
    );
    setTxt("printHose", (calc.hoseGpm || 0) + " GPM");
    setTxt("printSprinklerOnly", calc.sprinklerOnlyGpm + " GPM");
    setTxt("printVersion", APP_VERSION);

    const pbd = $("printBreakdown");
    if (pbd) {
      pbd.innerHTML = calc.breakdown
        .map(
          (row) =>
            `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.basis)}</td><td class="num">${round1(row.psi)}</td></tr>`
        )
        .join("");
    }

    // On-screen clean report panel (mirrors print summary)
    const reportBody = $("cleanReportBody");
    if (reportBody) {
      let supplyNote = "";
      if (state.flowTest.enabled && flowTestValid()) {
        const a = assessSupply(calc);
        supplyNote =
          `<p class="hint" style="margin-top:0.5rem"><strong>Supply vs demand:</strong> ${escapeHtml(a.message || "")}</p>`;
      }
      const logoHtml =
        window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml
          ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 48 })
          : "";
      reportBody.innerHTML =
        logoHtml +
        `<div class="report-kpis">` +
        `<div><span>System demand flow</span><strong>${calc.flowGpm} GPM</strong></div>` +
        `<div><span>System demand pressure</span><strong>${calc.pressurePsi} PSI</strong></div>` +
        `<div><span>Duration required</span><strong>${calc.durationMin} min</strong></div>` +
        `<div><span>Prelim tank volume</span><strong>${calc.tankGalPrelim.toLocaleString()} gal</strong></div>` +
        `</div>` +
        `<p class="hint" style="margin-top:0.75rem">${escapeHtml(calc.modeLabel)} · ${escapeHtml(calc.frameworkLabel)} · ${escapeHtml(calc.presetName)}</p>` +
        `<p class="hint">${escapeHtml(calc.durationBasis || "")}</p>` +
        supplyNote;
    }

    renderSupplyAnalysis(calc);
    updateReportLogoPrint();

    save();
  }

  function updateReportLogoPrint() {
    const host = $("reportLogoPrint");
    if (!host) return;
    if (window.FireToolshedLogo && typeof window.FireToolshedLogo.reportHeaderHtml === "function") {
      host.innerHTML = window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 });
    } else {
      host.innerHTML = "";
    }
  }

  function pickDefaultPreset() {
    const list = getPresetList();
    const firstReal = list.find((p) => p.id !== "custom") || list[0];
    state.presetId = firstReal ? firstReal.id : "";
    populatePresets();
    applyPreset();
    writeForm();
  }

  function updateSystemTypeUi() {
    const dryRadio = document.querySelector('input[name="systemType"][value="dry"]');
    const wetRadio = document.querySelector('input[name="systemType"][value="wet"]');
    const hint = $("systemTypeHint");
    const wetOnly = isWetOnlyFramework();

    if (dryRadio) {
      dryRadio.disabled = wetOnly;
      dryRadio.parentElement?.classList.toggle("disabled", wetOnly);
    }
    if (wetOnly) {
      state.systemType = "wet";
      if (wetRadio) wetRadio.checked = true;
      if (dryRadio) dryRadio.checked = false;
      if (hint) {
        hint.textContent =
          "AF Sundown is wet pipe only — dry-pipe criteria are not available for this framework. ESFR/storage-type FM presets are also wet only.";
      }
    } else if (hint) {
      hint.textContent =
        "No dry-pipe criteria for AF Sundown or ESFR/storage-type protection. UFC Table 9-3 dry is also N/A for ceiling heights >60–100 ft.";
    }
  }

  function onChange() {
    const prevFramework = state.framework;
    const prevSystemType = state.systemType;
    const prevMode = state.mode;
    readForm();
    updateSystemTypeUi();
    // Re-read after wet-only force may have flipped system type
    if (isWetOnlyFramework()) state.systemType = "wet";
    if (state.framework !== prevFramework || state.systemType !== prevSystemType) {
      pickDefaultPreset();
    }
    if (state.mode !== prevMode) {
      updateModeVisibility();
    }
    render();
  }

  function onPresetChange() {
    readForm();
    applyPreset();
    writeForm();
    render();
  }

  function sharedProjectName(fallback) {
    const local = String(fallback != null ? fallback : state.projectName || "").trim();
    if (window.FireToolshedShell?.getProjectName) {
      const shared = String(window.FireToolshedShell.getProjectName() || "").trim();
      if (shared) {
        if (local && local !== shared) {
          window.FireToolshedShell.saveProject?.({ projectName: local });
          return local;
        }
        return shared;
      }
    }
    if (local) window.FireToolshedShell?.saveProject?.({ projectName: local });
    return local;
  }

  function buildHandoffPayload(calc) {
    const assess =
      state.flowTest.enabled && flowTestValid() ? assessSupply(calc) : null;
    const projectName = sharedProjectName(state.projectName);
    if (projectName && !state.projectName) state.projectName = projectName;
    const supplyAssessment =
      assess && assess.ok
        ? {
            status: assess.status,
            message: assess.message,
            availablePsi: assess.availablePsi,
            demandPsi: assess.demandPsi,
            demandGpm: assess.demandGpm,
            marginPsi: assess.marginPsi,
            netBoostPsi: assess.netBoostPsi,
            extrapolated: !!assess.extrapolated,
            testStatic: assess.testStatic,
            testResidual: assess.testResidual,
            testFlow: assess.testFlow,
            supplyExponent: SUPPLY_EXPONENT,
          }
        : null;
    const flowTest =
      state.flowTest.enabled && flowTestValid()
        ? {
            staticPsi: num(state.flowTest.staticPsi),
            residualPsi: num(state.flowTest.residualPsi),
            flowGpm: num(state.flowTest.flowGpm),
            minResidualPsi: num(state.flowTest.minResidualPsi, 20),
            label: state.flowTest.label || "",
            source: state.flowTest.source || "",
          }
        : null;
    return {
      source: "sprinkler-system-estimator",
      version: APP_VERSION,
      capturedAt: new Date().toISOString(),
      projectName: projectName || "",
      facility: state.facility || "",
      preparedBy: state.preparedBy || "",
      date: state.date || "",
      framework: state.framework,
      frameworkLabel: calc.frameworkLabel,
      systemType: state.systemType,
      presetId: state.presetId,
      presetName: calc.presetName,
      flowGpm: calc.flowGpm,
      pressurePsi: calc.pressurePsi,
      durationMin: calc.durationMin,
      durationBasis: calc.durationBasis,
      hoseGpm: calc.hoseGpm,
      sprinklerOnlyGpm: calc.sprinklerOnlyGpm,
      tankGalPrelim: calc.tankGalPrelim,
      demandBasis: state.basisNotes.demand || "",
      notes: state.notes || "",
      flowTest: flowTest,
      supplyAssessment: supplyAssessment,
    };
  }

  function handoffText(calc, payload) {
    const sa = payload.supplyAssessment;
    const supplyBlock = sa
      ? `\nSUPPLY VS DEMAND (N^${SUPPLY_EXPONENT})\n` +
        `Status: ${sa.status}\n` +
        `Available at demand: ${sa.availablePsi} psi\n` +
        `Margin: ${sa.marginPsi} psi · Net boost: ${sa.netBoostPsi} psi\n` +
        `Test: ${sa.testStatic}/${sa.testResidual} psi @ ${sa.testFlow} gpm\n` +
        `${sa.message || ""}\n`
      : "\nSUPPLY VS DEMAND: no valid flow test overlay\n";
    return (
      `SPRINKLER SYSTEM ESTIMATOR → FIRE PUMP SIZER\n` +
      `Tool version: ${APP_VERSION}\n` +
      `Captured: ${payload.capturedAt}\n` +
      `Project: ${state.projectName || "—"}\n` +
      `Facility: ${state.facility || "—"}\n` +
      `Date: ${state.date || "—"}\n` +
      `Framework: ${calc.frameworkLabel}\n` +
      `System type: ${calc.systemTypeLabel}\n` +
      `Preset: ${calc.presetName}\n` +
      `Mode: ${calc.modeLabel}\n\n` +
      `SYSTEM DUTY (PRELIMINARY)\n` +
      `Required Flow at Pump: ${calc.flowGpm} GPM\n` +
      `System Demand Pressure: ${calc.pressurePsi} PSI\n` +
      `Duration Required: ${calc.durationMin} minutes\n` +
      `Duration basis: ${calc.durationBasis || "—"}\n` +
      `Prelim tank volume (flow × duration): ${calc.tankGalPrelim} gallons\n\n` +
      `Sprinkler-only flow: ${calc.sprinklerOnlyGpm} GPM\n` +
      `Hose allowance: ${calc.hoseGpm || 0} GPM\n` +
      supplyBlock +
      `\nBREAKDOWN (psi)\n` +
      calc.breakdown.map((r) => `- ${r.label}: ${round1(r.psi)} psi`).join("\n") +
      `\n\nHandoff key: ${HANDOFF_KEY}\n` +
      `Open Fire Pump Sizer and click “Import Sprinkler Demand” (or Capture & Open Pump).\n` +
      `Not a final Hazen-Williams hydraulic calculation.`
    );
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  }

  /** Capture demand (flow, pressure, duration, supply assessment) for Fire Pump Sizer */
  async function captureForPumpSizer(openNext) {
    const calc = calculate();
    const payload = buildHandoffPayload(calc);
    try {
      localStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
    } catch (_) {
      toast("Could not save handoff to browser storage");
      return false;
    }
    const text = handoffText(calc, payload);
    const sa = payload.supplyAssessment;
    const supplyBit = sa ? ` · ${sa.status}` : "";
    try {
      await copyText(text);
      toast(
        `Captured ${calc.flowGpm} GPM @ ${calc.pressurePsi} PSI · ${calc.durationMin} min${supplyBit}` +
          (openNext ? " — opening Pump Sizer…" : " — open Fire Pump Sizer")
      );
    } catch (_) {
      toast(
        `Saved handoff (${calc.flowGpm} GPM · ${calc.durationMin} min)${supplyBit}` +
          (openNext ? " — opening…" : " — clipboard copy failed")
      );
    }
    if (openNext) {
      setTimeout(() => {
        window.location.href = "../fire-pump-sizer/";
      }, 350);
    }
    return true;
  }

  async function copyForPumpSizer() {
    await captureForPumpSizer(false);
  }

  function openCleanReport() {
    render();
    const panel = $("cleanReportPanel");
    if (panel) {
      panel.classList.remove("hidden");
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // slight delay so layout paints before print dialog
    setTimeout(() => window.print(), 200);
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime || "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
  }

  function saveReportFiles() {
    const calc = calculate();
    const name =
      (state.projectName || "sprinkler-estimate").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "sprinkler-estimate";
    const stack = (calc.breakdown || [])
      .map(
        (r) =>
          `<tr><td>${escapeHtml(r.label)}</td><td>${escapeHtml(r.basis || "")}</td><td style="text-align:right">${round1(r.psi)}</td></tr>`
      )
      .join("");
    const logoHtml =
      window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 56 })
        : "";
    const html =
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sprinkler Estimate — ${escapeHtml(state.projectName || "Report")}</title>` +
      `<style>body{font-family:system-ui,sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#0f172a;line-height:1.45}h1{font-size:1.35rem}h2{font-size:1.05rem;margin-top:1.25rem}table{width:100%;border-collapse:collapse;font-size:0.9rem}th,td{border-bottom:1px solid #e2e8f0;padding:0.4rem;text-align:left;vertical-align:top}th{color:#64748b;font-size:0.72rem;text-transform:uppercase}.muted{color:#64748b;font-size:0.85rem}.kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:0.75rem;margin:1rem 0}.kpi div{border:1px solid #e2e8f0;border-radius:10px;padding:0.65rem}.kpi b{display:block;font-size:1.15rem}</style></head><body>` +
      logoHtml +
      `<h1>Sprinkler System Estimate — Charette Report</h1>` +
      `<p class="muted">Fire Toolshed · Sprinkler System Estimator v${APP_VERSION} · ${new Date().toLocaleString()}</p>` +
      `<p><b>Project:</b> ${escapeHtml(state.projectName || "—")} · <b>Facility:</b> ${escapeHtml(state.facility || "—")}<br>` +
      `<b>Prepared by:</b> ${escapeHtml(state.preparedBy || "—")} · <b>Date:</b> ${escapeHtml(state.date || "—")}<br>` +
      `<b>Mode:</b> ${escapeHtml(calc.modeLabel)} · <b>Framework:</b> ${escapeHtml(calc.frameworkLabel)} · <b>Preset:</b> ${escapeHtml(calc.presetName || "—")}</p>` +
      `<div class="kpi">` +
      `<div><span class="muted">System demand flow</span><b>${calc.flowGpm} GPM</b></div>` +
      `<div><span class="muted">System demand pressure</span><b>${calc.pressurePsi} PSI</b></div>` +
      `<div><span class="muted">Duration</span><b>${calc.durationMin} min</b></div>` +
      `<div><span class="muted">Prelim tank vol.</span><b>${calc.tankGalPrelim.toLocaleString()} gal</b></div>` +
      `</div>` +
      `<h2>Demand basis</h2><p>${escapeHtml(state.basisNotes.demand || "—")}</p>` +
      `<h2>Duration basis</h2><p>${escapeHtml(calc.durationBasis || state.basisNotes.duration || "—")}</p>` +
      `<h2>Remote head basis</h2><p>${escapeHtml(state.basisNotes.remote || "—")}</p>` +
      `<h2>Loss methodology</h2><p>${escapeHtml(state.basisNotes.losses || "—")}</p>` +
      `<h2>Pressure stack</h2><table><thead><tr><th>Component</th><th>Basis</th><th>PSI</th></tr></thead><tbody>${stack}</tbody></table>` +
      (state.flowTest && state.flowTest.enabled && flowTestValid()
        ? `<h2>Flow test overlay</h2><p>${escapeHtml(state.flowTest.label || "Flow test")} · Static ${state.flowTest.staticPsi} / Residual ${state.flowTest.residualPsi} @ ${state.flowTest.flowGpm} gpm</p>`
        : "") +
      `<p class="muted">Preliminary only — not a final Hazen-Williams hydraulic calculation. Verify against adopted code and AHJ direction.</p>` +
      `</body></html>`;
    downloadFile(name + "_sprinkler-report.html", html);
    downloadFile(
      name + "_sprinkler-data.json",
      JSON.stringify(
        {
          version: APP_VERSION,
          savedAt: new Date().toISOString(),
          state: state,
          calc: {
            flowGpm: calc.flowGpm,
            pressurePsi: calc.pressurePsi,
            durationMin: calc.durationMin,
            tankGalPrelim: calc.tankGalPrelim,
            frameworkLabel: calc.frameworkLabel,
            modeLabel: calc.modeLabel,
            breakdown: calc.breakdown,
          },
        },
        null,
        2
      ),
      "application/json"
    );
    toast("Saved HTML report + JSON project files");
  }

  function openReadme() {
    const modal = $("readmeModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    $("readmeClose")?.focus();
  }

  function closeReadme() {
    const modal = $("readmeModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function resetAll() {
    if (!confirm("Reset all inputs to defaults and clear saved form data?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) { /* ignore */ }
    state = defaultState();
    applyDurationFromTable();
    writeForm();
    render();
    toast("Reset to defaults");
  }

  function bind() {
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    });

    $("presetSelect")?.addEventListener("change", onPresetChange);

    document
      .querySelectorAll('input[name="mode"], input[name="framework"], input[name="systemType"]')
      .forEach((el) => {
        el.addEventListener("change", () => {
          onChange();
          writeForm();
          render();
        });
      });

    $("durationAuto")?.addEventListener("change", () => {
      readForm();
      if (state.durationAuto) applyDurationFromTable();
      writeForm();
      render();
    });

    $("lossTableBody")?.addEventListener("input", onChange);
    $("lossTableBody")?.addEventListener("change", onChange);

    $("btnPrint")?.addEventListener("click", openCleanReport);
    $("btnCleanReport")?.addEventListener("click", openCleanReport);
    $("btnSaveReport")?.addEventListener("click", saveReportFiles);
    $("btnCopyPump")?.addEventListener("click", () => captureForPumpSizer(false));
    $("btnCaptureDemand")?.addEventListener("click", () => captureForPumpSizer(false));
    $("btnCaptureOpenPump")?.addEventListener("click", () => captureForPumpSizer(true));
    $("btnReset")?.addEventListener("click", resetAll);
    $("btnReadme")?.addEventListener("click", openReadme);
    $("readmeClose")?.addEventListener("click", closeReadme);
    $("readmeBackdrop")?.addEventListener("click", closeReadme);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeReadme();
    });

    $("btnLoadFlowTest")?.addEventListener("click", () => {
      if (applySavedFlowTest(false)) {
        writeForm();
        render();
      }
    });
    $("btnClearFlowTest")?.addEventListener("click", () => {
      state.flowTest = defaultState().flowTest;
      writeForm();
      render();
      toast("Flow test cleared");
    });
  }

  function init() {
    if (window.FireToolshedShell) {
      window.FireToolshedShell.mount({ step: "sprinkler", base: ".." });
    }
    load();
    if (state.durationAuto !== false) applyDurationFromTable();
    writeForm();
    bind();
    $("lossTable")?.addEventListener("input", onChange);
    $("lossTable")?.addEventListener("change", (e) => {
      const t = e.target;
      if (t && t.matches("[data-loss-en]")) {
        const id = t.getAttribute("data-loss-en");
        const psi = document.querySelector(`[data-loss-psi="${id}"]`);
        if (psi) psi.disabled = !t.checked;
      }
      onChange();
    });
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: updateReportLogoPrint,
      });
    }
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
