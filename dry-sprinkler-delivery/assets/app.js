/**
 * Dry Sprinkler System Water Delivery Time Calculator
 * Preliminary design estimates — NOT a listed NFPA 13 calculation method.
 *
 * Engine: pipe volumes, Hazen–Williams steady-state, FMRC-style trip time,
 * volume/flow transit time, NFPA 13 / FM Global compliance checks.
 */
(function () {
  "use strict";

  const APP_VERSION = "1.2.0-prelim";

  /** System types that use dry-pipe water delivery time criteria (NFPA 13 §8.2) */
  const DELIVERY_ELIGIBLE = {
    dry: true,
    double_interlock: true,
  };
  const STORAGE_KEY = "drySprinklerDelivery.v1";
  const HISTORY_KEY = "drySprinklerDelivery.history.v1";
  const THEME_KEY = "drySprinklerDelivery.theme.v1";
  const GAL_PER_CUFT = 7.48051945;
  const PSI_PER_FT = 0.433; // water column
  const L_PER_GAL = 3.785411784;
  const M_PER_FT = 0.3048;
  const KPA_PER_PSI = 6.894757;
  const LPM_PER_GPM = 3.785411784;

  // ─── NFPA 13 water delivery table (hard-coded) ───────────────────────────
  const HAZARD_TABLE = [
    { id: "dwelling", label: "Dwelling Unit", heads: 1, maxSec: 15 },
    { id: "light", label: "Light", heads: 1, maxSec: 60 },
    { id: "ordinary", label: "Ordinary (Group 1 or 2)", heads: 2, maxSec: 50 },
    { id: "extra", label: "Extra (Group 1 or 2)", heads: 4, maxSec: 45 },
    { id: "highpiled", label: "High-Piled", heads: 4, maxSec: 40 },
  ];

  // ─── Pipe internal diameters (in) — ASTM / NFPA typical ──────────────────
  const PIPE_ID = {
    // nominal: { sch10, sch40 }
    '0.5': { sch40: 0.622, sch10: 0.674 },
    '0.75': { sch40: 0.824, sch10: 0.884 },
    '1': { sch40: 1.049, sch10: 1.097 },
    '1.25': { sch40: 1.38, sch10: 1.442 },
    '1.5': { sch40: 1.61, sch10: 1.682 },
    '2': { sch40: 2.067, sch10: 2.157 },
    '2.5': { sch40: 2.469, sch10: 2.635 },
    '3': { sch40: 3.068, sch10: 3.26 },
    '3.5': { sch40: 3.548, sch10: 3.76 },
    '4': { sch40: 4.026, sch10: 4.26 },
    '5': { sch40: 5.047, sch10: 5.295 },
    '6': { sch40: 6.065, sch10: 6.357 },
    '8': { sch40: 7.981, sch10: 8.329 },
    // Common UG / feed mains on multi-page listed HW printouts
    '10': { sch40: 10.02, sch10: 10.42 },
    '12': { sch40: 11.938, sch10: 12.39 },
  };

  const NOMINAL_OPTIONS = [
    { v: "0.5", l: '½"' },
    { v: "0.75", l: '¾"' },
    { v: "1", l: '1"' },
    { v: "1.25", l: '1¼"' },
    { v: "1.5", l: '1½"' },
    { v: "2", l: '2"' },
    { v: "2.5", l: '2½"' },
    { v: "3", l: '3"' },
    { v: "3.5", l: '3½"' },
    { v: "4", l: '4"' },
    { v: "5", l: '5"' },
    { v: "6", l: '6"' },
    { v: "8", l: '8"' },
    { v: "10", l: '10"' },
    { v: "12", l: '12"' },
  ];

  /**
   * Equivalent length (ft) for fittings — NFPA 13 Table 27.2.3.1.1 style
   * values for Schedule 40 steel (approximate; user may edit segment EL).
   * Keys: elbow90, elbow45, teeThru, teeBranch, gate, butterfly, check, coupling, reducer
   */
  const FITTING_EL = {
    // nominal → { type: ft }
    "0.5": { elbow90: 1, elbow45: 1, teeThru: 1, teeBranch: 3, gate: 0, butterfly: 0, check: 4, coupling: 0, reducer: 1 },
    "0.75": { elbow90: 2, elbow45: 1, teeThru: 1, teeBranch: 4, gate: 0, butterfly: 0, check: 5, coupling: 0, reducer: 1 },
    "1": { elbow90: 2, elbow45: 1, teeThru: 1, teeBranch: 5, gate: 0, butterfly: 0, check: 7, coupling: 0, reducer: 1 },
    "1.25": { elbow90: 3, elbow45: 1, teeThru: 1, teeBranch: 6, gate: 0, butterfly: 0, check: 9, coupling: 0, reducer: 1 },
    "1.5": { elbow90: 4, elbow45: 2, teeThru: 2, teeBranch: 7, gate: 0, butterfly: 0, check: 11, coupling: 0, reducer: 2 },
    "2": { elbow90: 5, elbow45: 2, teeThru: 2, teeBranch: 10, gate: 1, butterfly: 6, check: 13, coupling: 0, reducer: 2 },
    "2.5": { elbow90: 6, elbow45: 3, teeThru: 2, teeBranch: 12, gate: 1, butterfly: 7, check: 16, coupling: 0, reducer: 3 },
    "3": { elbow90: 7, elbow45: 3, teeThru: 3, teeBranch: 15, gate: 1, butterfly: 10, check: 20, coupling: 0, reducer: 3 },
    "3.5": { elbow90: 8, elbow45: 3, teeThru: 3, teeBranch: 17, gate: 1, butterfly: 12, check: 23, coupling: 0, reducer: 3 },
    "4": { elbow90: 10, elbow45: 4, teeThru: 4, teeBranch: 20, gate: 2, butterfly: 12, check: 25, coupling: 0, reducer: 4 },
    "5": { elbow90: 12, elbow45: 5, teeThru: 5, teeBranch: 25, gate: 2, butterfly: 9, check: 32, coupling: 0, reducer: 5 },
    "6": { elbow90: 14, elbow45: 6, teeThru: 6, teeBranch: 30, gate: 3, butterfly: 10, check: 38, coupling: 0, reducer: 6 },
    "8": { elbow90: 18, elbow45: 8, teeThru: 8, teeBranch: 35, gate: 4, butterfly: 12, check: 50, coupling: 0, reducer: 8 },
    "10": { elbow90: 22, elbow45: 10, teeThru: 10, teeBranch: 50, gate: 5, butterfly: 15, check: 60, coupling: 0, reducer: 10 },
    "12": { elbow90: 26, elbow45: 12, teeThru: 12, teeBranch: 60, gate: 6, butterfly: 18, check: 70, coupling: 0, reducer: 12 },
  };

  const FITTING_TYPES = [
    { id: "elbow90", label: "90° elbow" },
    { id: "elbow45", label: "45° elbow" },
    { id: "teeThru", label: "Tee run" },
    { id: "teeBranch", label: "Tee branch" },
    { id: "gate", label: "Gate valve" },
    { id: "butterfly", label: "Butterfly" },
    { id: "check", label: "Check valve" },
    { id: "coupling", label: "Coupling" },
    { id: "reducer", label: "Reducer" },
  ];

  // ─── State ───────────────────────────────────────────────────────────────
  function newSegment(overrides) {
    return {
      id: "s" + Math.random().toString(36).slice(2, 9),
      from: "DPV",
      to: "N1",
      lengthFt: 50,
      nominal: "4",
      schedule: "40",
      idIn: null, // null = auto from table
      cFactor: 120,
      elevFt: 0,
      fittings: { elbow90: 2, elbow45: 0, teeThru: 0, teeBranch: 0, gate: 0, butterfly: 0, check: 0, coupling: 0, reducer: 0 },
      elOverride: null, // null = sum from fittings
      /** Fixed device pressure loss (psi) — valves, meters; from multi-page PDF rows */
      fixedLossPsi: 0,
      notes: "",
      ...overrides,
    };
  }

  function defaultState() {
    return {
      projectName: "",
      facility: "",
      preparedBy: "",
      peNumber: "",
      company: "",
      date: new Date().toISOString().slice(0, 10),
      occupancyDesc: "",
      notes: "",
      criteriaSet: "nfpa", // nfpa | fm | both
      /** dry | double_interlock | single_interlock | wet — only dry & double-interlock use water delivery time */
      systemType: "dry",
      hazardId: "ordinary",
      openHeads: 2,
      qodPresent: false,
      units: "us", // us | metric (display conversion)
      includeFittingVolume: true,
      supplyNode: "DPV",
      remoteNodes: ["Remote"],
      // Design / hydraulic inputs
      designMode: "kfactor", // kfactor | totalflow | density
      kFactor: 5.6,
      minPressurePsi: 7,
      totalDesignFlowGpm: 0, // used if totalflow
      densityGpmSf: 0.15,
      designAreaSf: 1500,
      residualSupplyPsi: 65, // residual at supply/DPV after trip (fill-rate basis)
      /**
       * Multi-page PDF calc source metadata (traceability for listed-printout checks).
       * { fileName, pageCount, extractedPages[], notes, importedAt }
       */
      pdfSource: null,
      // Trip time inputs
      airPressurePsi: 40, // gauge initial
      tripPressurePsi: 15, // gauge at trip (differential / set)
      temperatureF: 70,
      tripTimeOverrideSec: null, // null = calculated
      transitMethod: "volume_flow", // volume_flow | length_velocity
      fillVelocityFps: 10, // for length_velocity method
      /**
       * Fill flow override (gpm). Null/blank → derive from residual @ DPV via HW
       * (or design Q of open heads if residual not usable).
       */
      fillFlowGpm: null,
      transitTimeOverrideSec: null,
      fmMaxSecOverride: null, // free-text numeric override for stricter FM
      darkMode: false,
      segments: [
        newSegment({ from: "DPV", to: "N1", lengthFt: 80, nominal: "4", fittings: { elbow90: 2, elbow45: 0, teeThru: 0, teeBranch: 1, gate: 1, butterfly: 0, check: 1, coupling: 0, reducer: 0 } }),
        newSegment({ from: "N1", to: "N2", lengthFt: 120, nominal: "3", fittings: { elbow90: 4, elbow45: 0, teeThru: 0, teeBranch: 2, gate: 0, butterfly: 0, check: 0, coupling: 0, reducer: 0 } }),
        newSegment({ from: "N2", to: "Remote", lengthFt: 40, nominal: "1.5", fittings: { elbow90: 2, elbow45: 0, teeThru: 0, teeBranch: 0, gate: 0, butterfly: 0, check: 0, coupling: 0, reducer: 0 } }),
      ],
    };
  }

  let state = defaultState();
  let lastResult = null;

  const $ = (id) => document.getElementById(id);

  function num(v, fb) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fb != null ? fb : 0;
  }
  function round(n, d) {
    const f = Math.pow(10, d == null ? 2 : d);
    return Math.round(n * f) / f;
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  // ─── Unit helpers ────────────────────────────────────────────────────────
  function idInFor(seg) {
    if (seg.idIn != null && seg.idIn !== "" && Number.isFinite(Number(seg.idIn))) {
      return Number(seg.idIn);
    }
    const row = PIPE_ID[seg.nominal];
    if (!row) return 4.026;
    return seg.schedule === "10" ? row.sch10 : row.sch40;
  }

  function pipeVolumeGal(idIn, lengthFt) {
    if (idIn <= 0 || lengthFt <= 0) return 0;
    const dFt = idIn / 12;
    return (Math.PI / 4) * dFt * dFt * lengthFt * GAL_PER_CUFT;
  }

  /** Approx fitting volume as fraction of 1 ft of pipe × EL count (planning) */
  function fittingVolumeGal(seg) {
    if (!state.includeFittingVolume) return 0;
    const id = idInFor(seg);
    const el = equivalentLengthFt(seg);
    // treat EL as equivalent pipe for volume approximation (conservative-ish for elbows)
    return pipeVolumeGal(id, el * 0.15); // 15% of EL as physical fitting volume
  }

  function equivalentLengthFt(seg) {
    if (seg.elOverride != null && seg.elOverride !== "" && Number.isFinite(Number(seg.elOverride))) {
      return Math.max(0, Number(seg.elOverride));
    }
    const table = FITTING_EL[seg.nominal] || FITTING_EL["4"];
    let sum = 0;
    FITTING_TYPES.forEach((ft) => {
      const c = Math.max(0, num(seg.fittings?.[ft.id], 0));
      sum += c * (table[ft.id] || 0);
    });
    return sum;
  }

  function totalLengthWithEL(seg) {
    return Math.max(0, num(seg.lengthFt)) + equivalentLengthFt(seg);
  }

  // ─── Graph / paths ───────────────────────────────────────────────────────
  function buildAdj(segments) {
    const adj = new Map(); // from -> [{to, seg}]
    segments.forEach((seg) => {
      const f = String(seg.from || "").trim();
      const t = String(seg.to || "").trim();
      if (!f || !t) return;
      if (!adj.has(f)) adj.set(f, []);
      adj.get(f).push({ to: t, seg });
      // undirected for path search (tree/branch) — also reverse for path from remote back
    });
    return adj;
  }

  function buildUndirected(segments) {
    const adj = new Map();
    function add(a, b, seg) {
      if (!adj.has(a)) adj.set(a, []);
      adj.get(a).push({ to: b, seg, forward: true });
      if (!adj.has(b)) adj.set(b, []);
      adj.get(b).push({ to: a, seg, forward: false });
    }
    segments.forEach((seg) => {
      const f = String(seg.from || "").trim();
      const t = String(seg.to || "").trim();
      if (f && t) add(f, t, seg);
    });
    return adj;
  }

  /** BFS path of segments from supply to remote */
  function pathToRemote(supply, remote, segments) {
    const adj = buildUndirected(segments);
    const s = String(supply || "").trim();
    const r = String(remote || "").trim();
    if (!s || !r || !adj.has(s)) return null;
    if (s === r) return { nodes: [s], segments: [] };

    const q = [s];
    const prev = new Map([[s, null]]);
    while (q.length) {
      const cur = q.shift();
      if (cur === r) break;
      const neigh = adj.get(cur) || [];
      for (const n of neigh) {
        if (!prev.has(n.to)) {
          prev.set(n.to, { node: cur, edge: n });
          q.push(n.to);
        }
      }
    }
    if (!prev.has(r)) return null;

    const nodes = [];
    const segs = [];
    let cur = r;
    nodes.unshift(cur);
    while (prev.get(cur)) {
      const p = prev.get(cur);
      segs.unshift(p.edge.seg);
      cur = p.node;
      nodes.unshift(cur);
    }
    return { nodes, segments: segs };
  }

  // ─── Design flow ─────────────────────────────────────────────────────────
  function designFlowGpm() {
    const n = Math.max(1, Math.round(num(state.openHeads, 1)));
    if (state.designMode === "totalflow") {
      return Math.max(0, num(state.totalDesignFlowGpm));
    }
    if (state.designMode === "density") {
      return Math.max(0, num(state.densityGpmSf) * num(state.designAreaSf));
    }
    // kfactor: Q = n * K * sqrt(P)
    const K = Math.max(0, num(state.kFactor, 5.6));
    const P = Math.max(0, num(state.minPressurePsi, 7));
    return n * K * Math.sqrt(P);
  }

  function orificeAreaIn2(kFactor) {
    // K ≈ 29.83 * Cd * d² with Cd≈0.98 → d ≈ sqrt(K/29.23)
    const K = Math.max(0.1, num(kFactor, 5.6));
    const d = Math.sqrt(K / 29.83);
    return (Math.PI / 4) * d * d;
  }

  // ─── Volume ──────────────────────────────────────────────────────────────
  function segmentVolumes(segments) {
    return segments.map((seg) => {
      const id = idInFor(seg);
      const pipeGal = pipeVolumeGal(id, Math.max(0, num(seg.lengthFt)));
      const fitGal = fittingVolumeGal(seg);
      return {
        seg,
        idIn: id,
        pipeGal,
        fitGal,
        totalGal: pipeGal + fitGal,
        elFt: equivalentLengthFt(seg),
        LeFt: totalLengthWithEL(seg),
      };
    });
  }

  // ─── Hydraulics (steady-state HW from remote toward supply) ───────────────
  /**
   * Walk path from remote → supply. Assume all design flow enters at remote
   * and travels back through path segments (tree simplification).
   * p_loss/ft = 4.52 * Q^1.85 / (C^1.85 * d^4.87)
   */
  function hydraulicWalk(pathSegs, Qgpm, remoteNode, supplyNode) {
    if (!pathSegs || !pathSegs.length) {
      return { nodes: [], totalFrictionPsi: 0, totalElevPsi: 0, supplyRequiredPsi: num(state.minPressurePsi, 7) };
    }

    // Orient segments from remote toward supply
    // pathSegs is supply→remote order; reverse for walk
    const ordered = pathSegs.slice().reverse();
    let p = Math.max(0, num(state.minPressurePsi, 7)); // residual at remote
    let elevAccumFt = 0;
    const rows = [];
    let nodeCursor = remoteNode;

    rows.push({
      node: remoteNode,
      flowGpm: Qgpm,
      pressurePsi: p,
      frictionPsi: 0,
      elevPsi: 0,
      role: "remote",
    });

    for (const seg of ordered) {
      const id = idInFor(seg);
      const C = Math.max(1, num(seg.cFactor, 120));
      const L = totalLengthWithEL(seg);
      const pf =
        L > 0 && id > 0 && Qgpm > 0
          ? (4.52 * Math.pow(Qgpm, 1.85)) / (Math.pow(C, 1.85) * Math.pow(id, 4.87))
          : 0;
      const fixedLoss = Math.max(0, num(seg.fixedLossPsi, 0));
      const fric = pf * L + fixedLoss;
      // Next node toward supply (undirected)
      const f = String(seg.from || "").trim();
      const t = String(seg.to || "").trim();
      const nextNode = nodeCursor === t ? f : nodeCursor === f ? t : f;

      // elevFt = elevation rise From → To (user input).
      // Water flows supply → remote. Required P at supply end of this segment is:
      //   P_supply_end = P_remote_end + friction + 0.433 × (elev_remote_end − elev_supply_end)
      // Walking remote → supply: if we stand at "to" going to "from", remote end is "to",
      // elev_remote − elev_supply = elev(to) − elev(from) = elevFt.
      // If we stand at "from" going to "to", elev_remote − elev_supply = −elevFt.
      const elevDir = num(seg.elevFt, 0);
      const atFromGoingTo = nodeCursor === f;
      const elevRiseAlongWaterFlowFt = atFromGoingTo ? -elevDir : elevDir;
      const elevPsi = elevRiseAlongWaterFlowFt * PSI_PER_FT;

      p = p + fric + elevPsi; // pressure required at next node (toward supply)
      elevAccumFt += elevRiseAlongWaterFlowFt;
      nodeCursor = nextNode;

      rows.push({
        node: nextNode,
        flowGpm: Qgpm,
        pressurePsi: round(p, 2),
        frictionPsi: round(fric, 3),
        pipeFrictionPsi: round(pf * L, 3),
        fixedLossPsi: round(fixedLoss, 3),
        elevPsi: round(elevPsi, 3),
        segment: `${f}→${t}`,
        pfPerFt: round(pf, 5),
        role: nextNode === supplyNode ? "supply" : "node",
      });
    }

    return {
      nodes: rows,
      totalFrictionPsi: round(
        rows.reduce((s, r) => s + (r.frictionPsi || 0), 0),
        2
      ),
      totalFixedLossPsi: round(
        rows.reduce((s, r) => s + (r.fixedLossPsi || 0), 0),
        2
      ),
      totalElevPsi: round(elevAccumFt * PSI_PER_FT, 2),
      supplyRequiredPsi: round(p, 2),
      remoteResidualPsi: Math.max(0, num(state.minPressurePsi, 7)),
    };
  }

  /**
   * Import a multi-page PDF calc fixture (JSON extracted from listed HW printouts).
   * Shape:
   * {
   *   meta: { fileName, pageCount, pages: [{page, title}], notes, systemType? },
   *   project?: partial project fields,
   *   segments: [ { from, to, lengthFt, nominal, schedule, idIn, cFactor, elevFt,
   *                 fittings?, elOverride?, fixedLossPsi?, notes?, pdfPage? } ],
   *   hwChecks?: [ { label, Q, C, d, L, printPf } ]  // optional regression rows
   * }
   */
  function importPdfFixture(fixture, opts) {
    opts = opts || {};
    if (!fixture || typeof fixture !== "object") {
      return { ok: false, error: "Fixture is null or not an object" };
    }
    const segsIn = fixture.segments || fixture.pipeSegments || [];
    if (!Array.isArray(segsIn) || !segsIn.length) {
      return { ok: false, error: "Fixture has no segments[] (multi-page pipe table required)" };
    }
    const base = defaultState();
    const proj = fixture.project || {};
    const meta = fixture.meta || {};
    const systemType =
      proj.systemType ||
      meta.systemType ||
      fixture.systemType ||
      state.systemType ||
      "dry";

    const segments = segsIn.map((s, i) =>
      newSegment({
        id: s.id || "pdf" + i + "_" + Math.random().toString(36).slice(2, 6),
        from: String(s.from || s.start || s.Node1 || "").trim() || "N" + i,
        to: String(s.to || s.end || s.Node2 || "").trim() || "N" + (i + 1),
        lengthFt: num(s.lengthFt != null ? s.lengthFt : s.L != null ? s.L : s.length, 0),
        nominal: String(s.nominal != null ? s.nominal : s.size != null ? s.size : "4"),
        schedule: String(s.schedule || s.sch || "40"),
        idIn: s.idIn != null ? num(s.idIn) : s.actualID != null ? num(s.actualID) : null,
        cFactor: num(s.cFactor != null ? s.cFactor : s.C != null ? s.C : s.HWC, 120),
        elevFt: num(s.elevFt != null ? s.elevFt : s.elevChange, 0),
        fittings: s.fittings || {},
        elOverride:
          s.elOverride != null
            ? num(s.elOverride)
            : s.eqLen != null
              ? num(s.eqLen)
              : s.EL != null
                ? num(s.EL)
                : null,
        fixedLossPsi: num(s.fixedLossPsi != null ? s.fixedLossPsi : s.deviceLossPsi, 0),
        notes:
          (s.notes || s.NOTES || "") +
          (s.pdfPage != null ? ` [PDF p.${s.pdfPage}]` : s.page != null ? ` [PDF p.${s.page}]` : ""),
      })
    );

    state = {
      ...base,
      ...state,
      ...proj,
      systemType,
      segments,
      supplyNode: proj.supplyNode || fixture.supplyNode || meta.supplyNode || segments[0].from,
      remoteNodes: proj.remoteNodes || fixture.remoteNodes || meta.remoteNodes || [
        segments[segments.length - 1].to,
      ],
      pdfSource: {
        fileName: meta.fileName || fixture.fileName || "fixture.json",
        pageCount: meta.pageCount || (meta.pages && meta.pages.length) || null,
        pages: meta.pages || [],
        notes: meta.notes || fixture.notes || "",
        importedAt: new Date().toISOString(),
        segmentCount: segments.length,
      },
    };

    if (proj.designMode) state.designMode = proj.designMode;
    if (proj.totalDesignFlowGpm != null) state.totalDesignFlowGpm = num(proj.totalDesignFlowGpm);
    if (proj.kFactor != null) state.kFactor = num(proj.kFactor);
    if (proj.minPressurePsi != null) state.minPressurePsi = num(proj.minPressurePsi);
    if (proj.residualSupplyPsi != null) state.residualSupplyPsi = num(proj.residualSupplyPsi);
    if (proj.hazardId) state.hazardId = proj.hazardId;
    if (proj.openHeads != null) state.openHeads = Math.round(num(proj.openHeads));
    if (proj.qodPresent != null) state.qodPresent = !!proj.qodPresent;
    if (proj.criteriaSet) state.criteriaSet = proj.criteriaSet;

    // Optional HW batch verification from multi-page printout rows
    let hwResults = null;
    if (Array.isArray(fixture.hwChecks) && fixture.hwChecks.length) {
      hwResults = verifyHwChecks(fixture.hwChecks);
    }

    if (!opts.silent) {
      try {
        if (typeof render === "function") render();
      } catch (_) {
        /* headless */
      }
    }
    save();
    return {
      ok: true,
      segmentCount: segments.length,
      systemType: state.systemType,
      pdfSource: state.pdfSource,
      hwResults,
      result: opts.calculate === false ? null : calculate(),
    };
  }

  /** Batch-verify Pf rows extracted from multi-page PDF pipe tables */
  function verifyHwChecks(rows, tolPsi) {
    const tol = tolPsi != null ? tolPsi : 0.12;
    return (rows || []).map((row) => {
      const Q = num(row.Q != null ? row.Q : row.flowGpm);
      const C = num(row.C != null ? row.C : row.cFactor, 120);
      const d = num(row.d != null ? row.d : row.idIn != null ? row.idIn : row.actualID);
      const L = num(row.L != null ? row.L : row.lengthFt != null ? row.lengthFt : row.totalLen);
      const printPf = num(row.printPf != null ? row.printPf : row.Pf != null ? row.Pf : row.pPf);
      const pfPerFt =
        Q > 0 && C > 0 && d > 0
          ? (4.52 * Math.pow(Q, 1.85)) / (Math.pow(C, 1.85) * Math.pow(d, 4.87))
          : 0;
      const engPf = pfPerFt * L;
      const delta = engPf - printPf;
      return {
        label: row.label || row.name || `${Q}gpm d=${d}`,
        Q,
        C,
        d,
        L,
        printPf,
        engPf: round(engPf, 4),
        delta: round(delta, 4),
        ok: Math.abs(delta) <= tol,
        pdfPage: row.pdfPage != null ? row.pdfPage : row.page,
      };
    });
  }

  // ─── Trip time (FMRC-style) ──────────────────────────────────────────────
  /**
   * t_trip ≈ 0.0352 × (V_T / (A_n × √T₀)) × ln(p_a0 / p_a)
   *
   * Documented unit set used here:
   *   V_T  — system air volume, gallons
   *   A_n  — total open orifice area, in²
   *   T₀   — absolute temperature, °R (= °F + 460)
   *   p_a0, p_a — absolute air pressures (psia) = gauge + 14.7
   *
   * Constant 0.0352 is the simplified FMRC-style coefficient for this unit set
   * (preliminary estimate only — not a listed method).
   *
   * QOD: when present, apply planning reduction of 50% to calculated trip
   * (user can fully override trip time).
   */
  function tripTimeSec(totalVolGal, openHeads, kFactor) {
    if (state.tripTimeOverrideSec != null && state.tripTimeOverrideSec !== "") {
      return {
        sec: Math.max(0, num(state.tripTimeOverrideSec)),
        formula: "User override",
        details: {},
        overridden: true,
      };
    }

    const VT = Math.max(0.01, totalVolGal);
    const An = Math.max(1e-6, orificeAreaIn2(kFactor) * Math.max(1, openHeads));
    const T0 = Math.max(200, num(state.temperatureF, 70) + 460); // °R
    const pa0 = Math.max(0.1, num(state.airPressurePsi, 40) + 14.7);
    const pa = Math.max(0.1, num(state.tripPressurePsi, 15) + 14.7);
    const ratio = Math.max(1.001, pa0 / pa);
    let t = 0.0352 * (VT / (An * Math.sqrt(T0))) * Math.log(ratio);

    let qodNote = "";
    if (state.qodPresent) {
      t *= 0.5;
      qodNote = "QOD present: 50% trip-time reduction applied (planning factor).";
    }

    return {
      sec: round(t, 1),
      formula: "t_trip = 0.0352 × (V_T / (A_n √T₀)) × ln(p_a0/p_a)",
      details: {
        VT: round(VT, 2),
        An: round(An, 4),
        T0: round(T0, 1),
        pa0: round(pa0, 2),
        pa: round(pa, 2),
        ln: round(Math.log(ratio), 4),
        qodNote,
      },
      overridden: false,
    };
  }

  // ─── Fill rate from residual @ DPV (Hazen–Williams inverse) ──────────────
  /**
   * Average fill rate after trip: residual gauge pressure at the dry-pipe valve
   * drives flow into an open path (open heads ≈ atmospheric during fill).
   *
   * ΔP_avail = P_residual − elev_psi  (elev rise supply→remote reduces available)
   * ΔP_avail = Σ [4.52 L / (C^1.85 d^4.87)] × Q^1.85
   * ⇒ Q = (ΔP_avail / Σk)^(1/1.85)
   */
  function fillRateFromResidual(pathSegs, residualPsi) {
    const P_res = Math.max(0, num(residualPsi, 0));
    let elevPsi = 0;
    let sumK = 0;
    let fixedPsi = 0;
    (pathSegs || []).forEach((seg) => {
      // elevFt From→To; for fill supply→remote use rise along flow ≈ elev if From is supply-side.
      // Approximate with absolute segment elev contribution as entered (same as path sum of elevFt
      // when segments are oriented supply→remote). Prefer sum of elevFt as user-entered path rise.
      elevPsi += num(seg.elevFt, 0) * PSI_PER_FT;
      fixedPsi += Math.max(0, num(seg.fixedLossPsi, 0));
      const id = idInFor(seg);
      const C = Math.max(1, num(seg.cFactor, 120));
      const L = totalLengthWithEL(seg);
      if (id > 0 && L > 0) {
        sumK += (4.52 * L) / (Math.pow(C, 1.85) * Math.pow(id, 4.87));
      }
    });
    // P_avail drives pipe friction after elev + fixed device losses
    const P_avail = P_res - Math.abs(elevPsi) - fixedPsi;
    if (P_avail <= 0 || sumK <= 0) {
      return {
        Qgpm: 0,
        P_res,
        elevPsi: round(elevPsi, 3),
        fixedPsi: round(fixedPsi, 3),
        P_avail: round(P_avail, 3),
        sumK: round(sumK, 8),
        ok: false,
        reason:
          P_res <= 0
            ? "Enter residual pressure at DPV after trip"
            : P_avail <= 0
              ? "Elevation + fixed losses exceed residual (no fill head)"
              : "Path friction coefficient is zero",
      };
    }
    const Qgpm = Math.pow(P_avail / sumK, 1 / 1.85);
    return {
      Qgpm: round(Qgpm, 2),
      P_res: round(P_res, 2),
      elevPsi: round(elevPsi, 3),
      fixedPsi: round(fixedPsi, 3),
      P_avail: round(P_avail, 3),
      sumK: round(sumK, 8),
      ok: Qgpm > 0,
      reason: "",
    };
  }

  // ─── Transit time ────────────────────────────────────────────────────────
  /**
   * t_transit ≈ Volume_to_remote (gal) / Average_fill_rate (gpm)  → seconds via ×60
   *
   * Average fill rate (priority):
   *   1) User override fillFlowGpm
   *   2) Derived from residual @ DPV via inverse Hazen–Williams on path
   *   3) Fallback: design Q of open heads
   *
   * Method length_velocity: t = L_path / v_fill
   */
  function transitTimeSec(volRemoteGal, pathLengthFt, designQgpm, pathSegs) {
    if (state.transitTimeOverrideSec != null && state.transitTimeOverrideSec !== "") {
      return {
        sec: Math.max(0, num(state.transitTimeOverrideSec)),
        formula: "User override",
        details: {},
        overridden: true,
        fillRate: null,
      };
    }

    if (state.transitMethod === "length_velocity") {
      const v = Math.max(0.1, num(state.fillVelocityFps, 10));
      const L = Math.max(0, pathLengthFt);
      const t = L / v;
      return {
        sec: round(t, 1),
        formula: "t_transit = L_path / v_fill",
        details: { L: round(L, 1), v: round(v, 2), method: "length_velocity" },
        overridden: false,
        fillRate: null,
      };
    }

    const fillRate = fillRateFromResidual(pathSegs, state.residualSupplyPsi);
    let Q = Math.max(0.01, designQgpm);
    let qSource = "design";

    if (state.fillFlowGpm != null && state.fillFlowGpm !== "" && num(state.fillFlowGpm) > 0) {
      Q = Math.max(0.01, num(state.fillFlowGpm));
      qSource = "override";
    } else if (fillRate.ok && fillRate.Qgpm > 0) {
      Q = Math.max(0.01, fillRate.Qgpm);
      qSource = "residual_hw";
    }

    const V = Math.max(0, volRemoteGal);
    const t = (60 * V) / Q;
    return {
      sec: round(t, 1),
      formula: "t_transit = 60 × V_remote / Q_fill",
      details: {
        V: round(V, 2),
        Q: round(Q, 2),
        method: "volume_flow",
        qSource,
        fillRate,
      },
      overridden: false,
      fillRate,
    };
  }

  /** Green ≤ 90% of limit; Yellow within 10% of limit (≤ limit); Red exceeds */
  function bandFor(deliverySec, limitSec, exempt) {
    if (exempt) return "exempt";
    if (!(limitSec > 0)) return "na";
    if (deliverySec > limitSec) return "red";
    if (deliverySec > limitSec * 0.9) return "yellow";
    return "green";
  }

  function systemTypeLabel(id) {
    const map = {
      dry: "Dry pipe",
      double_interlock: "Double-interlock preaction",
      single_interlock: "Single-interlock preaction",
      wet: "Wet pipe",
    };
    return map[id] || id || "—";
  }

  function isDeliveryEligible() {
    return !!DELIVERY_ELIGIBLE[state.systemType || "dry"];
  }

  // ─── Compliance ──────────────────────────────────────────────────────────
  function compliance(result) {
    const hazard = HAZARD_TABLE.find((h) => h.id === state.hazardId) || HAZARD_TABLE[2];
    const nfpaMax = hazard.maxSec;
    let fmMax = nfpaMax;
    if (state.fmMaxSecOverride != null && state.fmMaxSecOverride !== "") {
      fmMax = Math.max(0, num(state.fmMaxSecOverride));
    }

    const V = result.totalVolGal;
    const Vrem = result.volToRemoteGal;
    const qod = !!state.qodPresent;
    const delivery = result.deliverySec;
    const eligible = isDeliveryEligible();
    const sysLabel = systemTypeLabel(state.systemType);

    const checks = [];

    // Hard reject: wet (and other non-dry types) — water delivery time N/A
    if (!eligible) {
      const reason =
        state.systemType === "wet"
          ? "Wet pipe systems are water-filled. NFPA 13 dry-pipe water delivery time criteria do not apply. This tool rejects wet systems for delivery-time compliance."
          : state.systemType === "single_interlock"
            ? "Single-interlock preaction is not evaluated under dry-pipe water delivery time in this tool (use dry or double-interlock). Select the correct system type or use listed software."
            : `System type “${sysLabel}” is not eligible for dry-pipe water delivery time evaluation.`;

      checks.push({
        id: "system_type",
        label: `System type: ${sysLabel}`,
        status: "fail",
        band: "rejected",
        detail: reason,
      });
      checks.push({
        id: "volume_total",
        label: `Total system volume: ${round(V, 1)} gal (informational only)`,
        status: "na",
        detail: `Volume to most remote: ${round(Vrem, 1)} gal — delivery compliance not evaluated`,
      });
      checks.push({
        id: "delivery_rejected",
        label: "Water delivery time compliance",
        status: "fail",
        band: "rejected",
        detail: "Rejected — not a dry-pipe / double-interlock system.",
      });

      return {
        hazard,
        nfpaMax,
        fmMax,
        stricterMax: Math.min(nfpaMax, fmMax),
        exempt: false,
        exemptReason: "",
        rejected: true,
        rejectReason: reason,
        checks,
        overall: "rejected",
        overallBand: "rejected",
        nfpaBand: "rejected",
        fmBand: "rejected",
        bothBand: "rejected",
        nfpaPass: false,
        fmPass: false,
        bothPass: false,
        eligible: false,
        systemType: state.systemType,
        systemLabel: sysLabel,
      };
    }

    checks.push({
      id: "system_type",
      label: `System type: ${sysLabel}`,
      status: "pass",
      detail: "Eligible for dry-pipe / double-interlock water delivery time evaluation.",
    });

    let exempt = false;
    let exemptReason = "";
    if (V <= 500) {
      exempt = true;
      exemptReason = "System volume ≤ 500 gal → NFPA 13 water delivery time requirement does not apply.";
    } else if (V <= 750 && qod) {
      exempt = true;
      exemptReason =
        "System volume ≤ 750 gal with listed quick-opening device → NFPA 13 water delivery time requirement does not apply.";
    }

    checks.push({
      id: "volume_total",
      label: `Total system volume: ${round(V, 1)} gal`,
      status: "na",
      detail: `Volume to most remote: ${round(Vrem, 1)} gal`,
    });

    if (exempt) {
      checks.push({
        id: "exempt",
        label: "Volume exemption",
        status: "exempt",
        detail: exemptReason,
      });
    } else {
      checks.push({
        id: "exempt",
        label: "Volume exemption",
        status: "na",
        detail: "No exemption — delivery time criteria apply.",
      });
    }

    const nfpaBand = bandFor(delivery, nfpaMax, exempt);
    const fmBand = bandFor(delivery, fmMax, exempt);
    const stricterMax = Math.min(nfpaMax, fmMax);
    const bothBand = bandFor(delivery, stricterMax, exempt);
    const nfpaPass = nfpaBand === "green" || nfpaBand === "yellow" || nfpaBand === "exempt";
    const fmPass = fmBand === "green" || fmBand === "yellow" || fmBand === "exempt";
    const bothPass = bothBand === "green" || bothBand === "yellow" || bothBand === "exempt";

    function bandStatus(band) {
      if (band === "exempt") return "exempt";
      if (band === "green") return "pass";
      if (band === "yellow") return "warn";
      if (band === "red") return "fail";
      return "na";
    }
    function bandDetail(band, max) {
      if (exempt) return "Exempt by volume";
      const d = round(delivery, 1);
      if (band === "green") return `${d} s ≤ 90% of ${max} s limit (margin)`;
      if (band === "yellow") return `${d} s within 10% of ${max} s limit (meets but tight)`;
      if (band === "red") return `${d} s exceeds ${max} s limit`;
      return `${d} s vs ${max} s`;
    }

    if (state.criteriaSet === "nfpa" || state.criteriaSet === "both") {
      checks.push({
        id: "nfpa_delivery",
        label: `NFPA 13 water delivery ≤ ${nfpaMax} s (${hazard.label})`,
        status: bandStatus(nfpaBand),
        band: nfpaBand,
        detail: bandDetail(nfpaBand, nfpaMax),
      });
    }

    if (state.criteriaSet === "fm" || state.criteriaSet === "both") {
      const fmLabel =
        state.fmMaxSecOverride != null && state.fmMaxSecOverride !== ""
          ? `FM Global (override ${fmMax} s)`
          : `FM Global (aligned ${fmMax} s)`;
      checks.push({
        id: "fm_delivery",
        label: `${fmLabel}`,
        status: bandStatus(fmBand),
        band: fmBand,
        detail: bandDetail(fmBand, fmMax),
      });
    }

    if (state.criteriaSet === "both") {
      checks.push({
        id: "both_stricter",
        label: `Both — stricter limit ${stricterMax} s`,
        status: bandStatus(bothBand),
        band: bothBand,
        detail: `Trip ${result.trip.sec} s + transit ${result.transit.sec} s = ${round(delivery, 1)} s · ${bandDetail(bothBand, stricterMax)}`,
      });
    }

    // Soft warning: >750 gal without QOD
    if (V > 750 && !qod) {
      checks.push({
        id: "large_no_qod",
        label: "System > 750 gal without QOD",
        status: "warn",
        detail: "Consider listed quick-opening device; delivery time criteria apply.",
      });
    }

    // Hydraulic residual flag
    const supplyAvail = num(state.residualSupplyPsi, 0);
    const supplyNeed = result.hydraulics.supplyRequiredPsi;
    const hydroOk = supplyAvail <= 0 || supplyAvail >= supplyNeed;
    checks.push({
      id: "hydraulics",
      label: "Supply residual vs required at DPV",
      status: supplyAvail <= 0 ? "warn" : hydroOk ? "pass" : "fail",
      detail:
        supplyAvail <= 0
          ? `Required at supply ≈ ${supplyNeed} psi (enter residual supply to compare)`
          : `Available ${supplyAvail} psi vs required ${supplyNeed} psi`,
    });

    let overallBand = "green";
    if (exempt) overallBand = "exempt";
    else if (state.criteriaSet === "both") overallBand = bothBand;
    else if (state.criteriaSet === "fm") overallBand = fmBand;
    else overallBand = nfpaBand;

    let overall = "pass";
    if (overallBand === "exempt") overall = "exempt";
    else if (overallBand === "red") overall = "fail";
    else if (overallBand === "yellow") overall = "warn";
    else overall = "pass";

    return {
      hazard,
      nfpaMax,
      fmMax,
      stricterMax,
      exempt,
      exemptReason,
      rejected: false,
      rejectReason: "",
      checks,
      overall,
      overallBand,
      nfpaBand,
      fmBand,
      bothBand,
      nfpaPass,
      fmPass,
      bothPass,
      eligible: true,
      systemType: state.systemType,
      systemLabel: sysLabel,
    };
  }

  // ─── Validation (soft warnings; hard stop only on impossible inputs) ─────
  function validate(result) {
    const warnings = [];
    const errors = [];
    const segs = state.segments || [];

    if (!String(state.supplyNode || "").trim()) {
      errors.push("Supply / dry-pipe valve node is required.");
    }
    if (!(state.remoteNodes || []).filter(Boolean).length) {
      errors.push("At least one remote sprinkler node is required.");
    }

    segs.forEach((seg, i) => {
      const n = i + 1;
      if (!(num(seg.lengthFt) > 0)) {
        errors.push(`Segment ${n} (${seg.from}→${seg.to}): length must be > 0.`);
      }
      const id = idInFor(seg);
      if (!(id > 0)) {
        errors.push(`Segment ${n} (${seg.from}→${seg.to}): internal diameter must be > 0.`);
      }
      const C = num(seg.cFactor, 120);
      if (C < 80 || C > 150) {
        warnings.push(
          `Segment ${n} (${seg.from}→${seg.to}): C-factor ${C} outside typical 80–150 range.`
        );
      }
    });

    if (result && !result.pathFound) {
      warnings.push(
        `Network path not found from supply “${state.supplyNode}” to remote “${(state.remoteNodes || [])[0]}”. Check node names.`
      );
    }

    if (result && result.totalVolGal > 750 && !state.qodPresent) {
      warnings.push("System volume > 750 gal without listed QOD — delivery time criteria apply.");
    }

    if (result && result.hydraulics) {
      const need = result.hydraulics.supplyRequiredPsi;
      const avail = num(state.residualSupplyPsi, 0);
      if (avail > 0 && avail < need) {
        warnings.push(
          `Residual at supply (${avail} psi) is below required for design demand (${need} psi).`
        );
      }
      // Flag remote residual vs min design (we set remote to minPressure by construction for design walk)
      const minP = num(state.minPressurePsi, 7);
      if (minP < 7) {
        warnings.push(`Remote minimum pressure ${minP} psi is below common NFPA 13 floor of 7 psi.`);
      }
    }

    return { warnings, errors, ok: errors.length === 0 };
  }

  // ─── Full calculate ──────────────────────────────────────────────────────
  function calculate() {
    const segs = state.segments || [];
    const vols = segmentVolumes(segs);
    const totalVolGal = vols.reduce((s, v) => s + v.totalGal, 0);

    const supply = String(state.supplyNode || "DPV").trim();
    const remotes = (state.remoteNodes || [])
      .map((r) => String(r).trim())
      .filter(Boolean);
    const primaryRemote = remotes[0] || "Remote";

    // Path with maximum volume to remote among marked remotes
    let bestPath = null;
    let bestVol = -1;
    let bestRemote = primaryRemote;
    remotes.forEach((rn) => {
      const path = pathToRemote(supply, rn, segs);
      if (!path) return;
      const v = path.segments.reduce((s, seg) => {
        const found = vols.find((x) => x.seg.id === seg.id);
        return s + (found ? found.totalGal : 0);
      }, 0);
      if (v > bestVol) {
        bestVol = v;
        bestPath = path;
        bestRemote = rn;
      }
    });

    // Fallback: all segments if no path
    let volToRemoteGal = Math.max(0, bestVol);
    let pathLengthFt = 0;
    if (bestPath) {
      pathLengthFt = bestPath.segments.reduce((s, seg) => s + Math.max(0, num(seg.lengthFt)), 0);
    } else {
      volToRemoteGal = totalVolGal;
      pathLengthFt = segs.reduce((s, seg) => s + Math.max(0, num(seg.lengthFt)), 0);
    }

    const Q = designFlowGpm();
    const pathSegs = bestPath ? bestPath.segments : segs;
    const hydraulics = hydraulicWalk(pathSegs, Q, bestRemote, supply);

    const trip = tripTimeSec(totalVolGal, state.openHeads, state.kFactor);
    const transit = transitTimeSec(volToRemoteGal, pathLengthFt, Q, pathSegs);
    const deliverySec = round(trip.sec + transit.sec, 1);
    const fillDerived = fillRateFromResidual(pathSegs, state.residualSupplyPsi);

    const result = {
      totalVolGal: round(totalVolGal, 2),
      volToRemoteGal: round(volToRemoteGal, 2),
      pathLengthFt: round(pathLengthFt, 1),
      designFlowGpm: round(Q, 2),
      bestRemote,
      pathNodes: bestPath ? bestPath.nodes : [],
      pathFound: !!bestPath,
      segmentVols: vols,
      hydraulics,
      trip,
      transit,
      deliverySec,
      fillDerived,
      orificeAreaIn2: round(orificeAreaIn2(state.kFactor) * Math.max(1, state.openHeads), 4),
    };
    result.compliance = compliance(result);
    result.validation = validate(result);
    lastResult = result;
    return result;
  }

  // ─── Unit display helpers ────────────────────────────────────────────────
  function isMetric() {
    return state.units === "metric";
  }
  function fmtVol(gal, digits) {
    const d = digits == null ? 1 : digits;
    if (isMetric()) return round(gal * L_PER_GAL, d) + " L";
    return round(gal, d) + " gal";
  }
  function fmtFlow(gpm, digits) {
    const d = digits == null ? 1 : digits;
    if (isMetric()) return round(gpm * LPM_PER_GPM, d) + " L/min";
    return round(gpm, d) + " gpm";
  }
  function fmtPress(psi, digits) {
    const d = digits == null ? 2 : digits;
    if (isMetric()) return round(psi * KPA_PER_PSI, d) + " kPa";
    return round(psi, d) + " psi";
  }
  function fmtLen(ft, digits) {
    const d = digits == null ? 1 : digits;
    if (isMetric()) return round(ft * M_PER_FT, d) + " m";
    return round(ft, d) + " ft";
  }
  function unitLabel(kind) {
    if (kind === "vol") return isMetric() ? "L" : "gal";
    if (kind === "flow") return isMetric() ? "L/min" : "gpm";
    if (kind === "press") return isMetric() ? "kPa" : "psi";
    if (kind === "len") return isMetric() ? "m" : "ft";
    return "";
  }

  // ─── Persist + project history (last 5) ──────────────────────────────────
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      const base = defaultState();
      state = { ...base, ...p, segments: p.segments?.length ? p.segments : base.segments };
      state.segments = state.segments.map((s) => ({
        ...newSegment(),
        ...s,
        fittings: { ...newSegment().fittings, ...(s.fittings || {}) },
      }));
    } catch (_) { /* ignore */ }
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === "dark") state.darkMode = true;
    } catch (_) { /* ignore */ }
  }
  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }
  function pushHistory() {
    readForm();
    const snap = {
      id: "p" + Date.now(),
      savedAt: new Date().toISOString(),
      label:
        (state.projectName || "Untitled").slice(0, 48) +
        " · " +
        (state.date || new Date().toISOString().slice(0, 10)),
      state: JSON.parse(JSON.stringify(state)),
    };
    let hist = loadHistory().filter((h) => h && h.state);
    hist = [snap].concat(hist).slice(0, 5);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    } catch (_) { /* ignore */ }
    renderHistorySelect();
    toast("Project saved to history (last 5)");
  }
  function restoreHistory(id) {
    const hist = loadHistory();
    const item = hist.find((h) => h.id === id);
    if (!item || !item.state) {
      toast("History item not found");
      return;
    }
    const base = defaultState();
    state = {
      ...base,
      ...item.state,
      segments: (item.state.segments || base.segments).map((s) => ({
        ...newSegment(),
        ...s,
        fittings: { ...newSegment().fittings, ...(s.fittings || {}) },
      })),
    };
    render();
    toast("Restored: " + (item.label || id));
  }
  function renderHistorySelect() {
    const sel = $("projectHistory");
    if (!sel) return;
    const hist = loadHistory();
    const cur = sel.value;
    sel.innerHTML =
      `<option value="">— Last 5 projects —</option>` +
      hist
        .map(
          (h) =>
            `<option value="${escapeHtml(h.id)}">${escapeHtml(h.label || h.id)}</option>`
        )
        .join("");
    if (cur && hist.some((h) => h.id === cur)) sel.value = cur;
  }
  function applyTheme() {
    try {
      const root = document.documentElement;
      if (root && root.classList) {
        root.classList.toggle("dark", !!state.darkMode);
      }
    } catch (_) { /* ignore (headless tests) */ }
    try {
      localStorage.setItem(THEME_KEY, state.darkMode ? "dark" : "light");
    } catch (_) { /* ignore */ }
    const btn = $("btnTheme");
    if (btn) btn.textContent = state.darkMode ? "Light" : "Dark";
  }

  // ─── Read form ───────────────────────────────────────────────────────────
  function readForm() {
    const g = (id) => $(id);
    if (g("projectName")) state.projectName = g("projectName").value;
    if (g("facility")) state.facility = g("facility").value;
    if (g("preparedBy")) state.preparedBy = g("preparedBy").value;
    if (g("peNumber")) state.peNumber = g("peNumber").value;
    if (g("company")) state.company = g("company").value;
    if (g("reportDate")) state.date = g("reportDate").value;
    if (g("occupancyDesc")) state.occupancyDesc = g("occupancyDesc").value;
    if (g("projectNotes")) state.notes = g("projectNotes").value;

    const crit = document.querySelector('input[name="criteriaSet"]:checked');
    if (crit) state.criteriaSet = crit.value;

    if (g("systemType")) state.systemType = g("systemType").value || "dry";
    if (g("hazardId")) state.hazardId = g("hazardId").value;
    if (g("openHeads")) state.openHeads = Math.max(1, Math.round(num(g("openHeads").value, 1)));
    if (g("qodPresent")) state.qodPresent = !!g("qodPresent").checked;
    if (g("includeFittingVolume")) state.includeFittingVolume = !!g("includeFittingVolume").checked;

    const units = document.querySelector('input[name="units"]:checked');
    if (units) state.units = units.value;

    if (g("supplyNode")) state.supplyNode = g("supplyNode").value.trim() || "DPV";
    if (g("remoteNodes")) {
      state.remoteNodes = g("remoteNodes")
        .value.split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!state.remoteNodes.length) state.remoteNodes = ["Remote"];
    }

    const dm = document.querySelector('input[name="designMode"]:checked');
    if (dm) state.designMode = dm.value;
    if (g("kFactor")) state.kFactor = num(g("kFactor").value, 5.6);
    if (g("minPressurePsi")) state.minPressurePsi = num(g("minPressurePsi").value, 7);
    if (g("totalDesignFlowGpm")) state.totalDesignFlowGpm = num(g("totalDesignFlowGpm").value, 0);
    if (g("densityGpmSf")) state.densityGpmSf = num(g("densityGpmSf").value, 0.15);
    if (g("designAreaSf")) state.designAreaSf = num(g("designAreaSf").value, 1500);
    if (g("residualSupplyPsi")) state.residualSupplyPsi = num(g("residualSupplyPsi").value, 0);

    if (g("airPressurePsi")) state.airPressurePsi = num(g("airPressurePsi").value, 40);
    if (g("tripPressurePsi")) state.tripPressurePsi = num(g("tripPressurePsi").value, 15);
    if (g("temperatureF")) state.temperatureF = num(g("temperatureF").value, 70);

    const tto = g("tripTimeOverrideSec")?.value;
    state.tripTimeOverrideSec = tto === "" || tto == null ? null : num(tto);
    const trto = g("transitTimeOverrideSec")?.value;
    state.transitTimeOverrideSec = trto === "" || trto == null ? null : num(trto);
    const fmo = g("fmMaxSecOverride")?.value;
    state.fmMaxSecOverride = fmo === "" || fmo == null ? null : num(fmo);

    const tm = document.querySelector('input[name="transitMethod"]:checked');
    if (tm) state.transitMethod = tm.value;
    if (g("fillVelocityFps")) state.fillVelocityFps = num(g("fillVelocityFps").value, 10);
    const ff = g("fillFlowGpm")?.value;
    state.fillFlowGpm = ff === "" || ff == null ? null : num(ff);

    // segments from table
    const tbody = $("pipeBody");
    if (tbody) {
      const rows = [...tbody.querySelectorAll("tr[data-seg-id]")];
      state.segments = rows.map((tr) => {
        const id = tr.getAttribute("data-seg-id");
        const prev = state.segments.find((s) => s.id === id) || newSegment();
        const val = (name) => tr.querySelector(`[data-f="${name}"]`)?.value;
        const fittings = { ...prev.fittings };
        FITTING_TYPES.forEach((ft) => {
          const el = tr.querySelector(`[data-fit="${ft.id}"]`);
          if (el) fittings[ft.id] = Math.max(0, Math.round(num(el.value, 0)));
        });
        const idRaw = val("idIn");
        const elRaw = val("elOverride");
        return {
          ...prev,
          id,
          from: val("from") || "",
          to: val("to") || "",
          lengthFt: num(val("lengthFt"), 0),
          nominal: val("nominal") || "4",
          schedule: val("schedule") || "40",
          idIn: idRaw === "" || idRaw == null ? null : num(idRaw),
          cFactor: num(val("cFactor"), 120),
          elevFt: num(val("elevFt"), 0),
          fittings,
          elOverride: elRaw === "" || elRaw == null ? null : num(elRaw),
          fixedLossPsi: Math.max(0, num(val("fixedLossPsi"), 0)),
          notes: val("notes") || "",
        };
      });
    }
  }

  function writeForm() {
    const set = (id, v) => {
      if ($(id) != null && v != null) $(id).value = v;
    };
    set("projectName", state.projectName);
    set("facility", state.facility);
    set("preparedBy", state.preparedBy);
    set("peNumber", state.peNumber);
    set("company", state.company);
    set("reportDate", state.date);
    set("occupancyDesc", state.occupancyDesc);
    set("projectNotes", state.notes);

    const crit = document.querySelector(`input[name="criteriaSet"][value="${state.criteriaSet}"]`);
    if (crit) crit.checked = true;

    set("systemType", state.systemType || "dry");
    set("hazardId", state.hazardId);
    set("openHeads", state.openHeads);
    if ($("qodPresent")) $("qodPresent").checked = !!state.qodPresent;
    if ($("includeFittingVolume")) $("includeFittingVolume").checked = !!state.includeFittingVolume;

    const u = document.querySelector(`input[name="units"][value="${state.units}"]`);
    if (u) u.checked = true;

    set("supplyNode", state.supplyNode);
    set("remoteNodes", (state.remoteNodes || []).join(", "));

    const dm = document.querySelector(`input[name="designMode"][value="${state.designMode}"]`);
    if (dm) dm.checked = true;
    set("kFactor", state.kFactor);
    set("minPressurePsi", state.minPressurePsi);
    set("totalDesignFlowGpm", state.totalDesignFlowGpm || "");
    set("densityGpmSf", state.densityGpmSf);
    set("designAreaSf", state.designAreaSf);
    set("residualSupplyPsi", state.residualSupplyPsi || "");

    set("airPressurePsi", state.airPressurePsi);
    set("tripPressurePsi", state.tripPressurePsi);
    set("temperatureF", state.temperatureF);
    set("tripTimeOverrideSec", state.tripTimeOverrideSec == null ? "" : state.tripTimeOverrideSec);
    set("transitTimeOverrideSec", state.transitTimeOverrideSec == null ? "" : state.transitTimeOverrideSec);
    set("fmMaxSecOverride", state.fmMaxSecOverride == null ? "" : state.fmMaxSecOverride);
    set("fillVelocityFps", state.fillVelocityFps);
    set("fillFlowGpm", state.fillFlowGpm == null ? "" : state.fillFlowGpm);

    const tm = document.querySelector(`input[name="transitMethod"][value="${state.transitMethod}"]`);
    if (tm) tm.checked = true;

    toggleDesignModeUI();
    toggleTransitUI();
  }

  function toggleDesignModeUI() {
    const mode = state.designMode;
    $("blockKfactor")?.classList.toggle("hidden", mode !== "kfactor");
    $("blockTotalflow")?.classList.toggle("hidden", mode !== "totalflow");
    $("blockDensity")?.classList.toggle("hidden", mode !== "density");
  }

  function toggleTransitUI() {
    $("blockFillVel")?.classList.toggle("hidden", state.transitMethod !== "length_velocity");
  }

  // ─── Pipe table ──────────────────────────────────────────────────────────
  function nominalSelectHtml(selected) {
    return NOMINAL_OPTIONS.map(
      (o) =>
        `<option value="${o.v}" ${o.v === selected ? "selected" : ""}>${o.l}</option>`
    ).join("");
  }

  function renderPipeTable() {
    const tbody = $("pipeBody");
    if (!tbody) return;
    const vols = segmentVolumes(state.segments);

    tbody.innerHTML = state.segments
      .map((seg, i) => {
        const v = vols[i];
        const idAuto = (() => {
          const row = PIPE_ID[seg.nominal];
          if (!row) return "";
          return seg.schedule === "10" ? row.sch10 : row.sch40;
        })();
        const fitSummary = FITTING_TYPES.map((ft) => {
          const c = seg.fittings?.[ft.id] || 0;
          return c
            ? `<label class="fit-chip" title="${ft.label}" style="display:inline-flex;align-items:center;gap:2px;margin:1px">
                <span style="font-size:0.65rem;color:#64748b">${ft.id.replace("elbow", "E").replace("tee", "T").slice(0, 4)}</span>
                <input data-fit="${ft.id}" type="number" min="0" step="1" value="${c}" style="width:2.4rem;min-height:28px;padding:2px">
              </label>`
            : `<label class="fit-chip" title="${ft.label}" style="display:inline-flex;align-items:center;gap:2px;margin:1px;opacity:0.55">
                <span style="font-size:0.65rem;color:#64748b">${ft.id.replace("elbow", "E").replace("tee", "T").slice(0, 4)}</span>
                <input data-fit="${ft.id}" type="number" min="0" step="1" value="0" style="width:2.4rem;min-height:28px;padding:2px">
              </label>`;
        }).join("");

        return `<tr data-seg-id="${seg.id}">
          <td><input data-f="from" value="${escapeHtml(seg.from)}" style="width:4.5rem"></td>
          <td><input data-f="to" value="${escapeHtml(seg.to)}" style="width:4.5rem"></td>
          <td class="num"><input data-f="lengthFt" type="number" min="0" step="0.1" value="${seg.lengthFt}" style="width:4.5rem"></td>
          <td><select data-f="nominal" style="width:4.2rem">${nominalSelectHtml(seg.nominal)}</select></td>
          <td><select data-f="schedule" style="width:3.5rem">
            <option value="40" ${seg.schedule === "40" ? "selected" : ""}>40</option>
            <option value="10" ${seg.schedule === "10" ? "selected" : ""}>10</option>
          </select></td>
          <td class="num"><input data-f="idIn" type="number" min="0" step="0.001" placeholder="${idAuto}" value="${seg.idIn == null ? "" : seg.idIn}" style="width:4.2rem" title="Blank = auto ${idAuto} in"></td>
          <td class="num"><input data-f="cFactor" type="number" min="1" step="1" value="${seg.cFactor}" style="width:3.5rem"></td>
          <td style="min-width:12rem">${fitSummary}</td>
          <td class="num"><input data-f="elOverride" type="number" min="0" step="0.1" placeholder="${round(v.elFt, 1)}" value="${seg.elOverride == null ? "" : seg.elOverride}" style="width:4rem" title="Blank = auto EL ${round(v.elFt, 1)} ft"></td>
          <td class="num"><input data-f="elevFt" type="number" step="0.1" value="${seg.elevFt || 0}" style="width:3.8rem"></td>
          <td class="num"><input data-f="fixedLossPsi" type="number" min="0" step="0.1" value="${seg.fixedLossPsi || 0}" style="width:3.5rem" title="Fixed device ΔP (valve, check) from PDF"></td>
          <td class="num seg-vol">${round(v.totalGal, 2)}</td>
          <td><input data-f="notes" value="${escapeHtml(seg.notes || "")}" style="width:5rem"></td>
          <td class="row-actions">
            <button type="button" class="sm ghost btn-dup" title="Duplicate">⧉</button>
            <button type="button" class="sm danger btn-del" title="Delete">✕</button>
          </td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("change", onAnyChange);
      el.addEventListener("input", onAnyChange);
    });
    tbody.querySelectorAll(".btn-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-seg-id");
        if (state.segments.length <= 1) {
          toast("Keep at least one segment");
          return;
        }
        state.segments = state.segments.filter((s) => s.id !== id);
        render();
      });
    });
    tbody.querySelectorAll(".btn-dup").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tr = btn.closest("tr");
        const id = tr?.getAttribute("data-seg-id");
        readForm();
        const src = state.segments.find((s) => s.id === id);
        if (!src) return;
        const copy = newSegment({
          ...JSON.parse(JSON.stringify(src)),
          id: "s" + Math.random().toString(36).slice(2, 9),
        });
        const idx = state.segments.findIndex((s) => s.id === id);
        state.segments.splice(idx + 1, 0, copy);
        render();
      });
    });
  }

  // ─── Render results ──────────────────────────────────────────────────────
  function onAnyChange() {
    readForm();
    // hazard auto-suggest open heads if user just changed hazard
    renderResultsOnly();
    save();
  }

  function onHazardChange() {
    readForm();
    const h = HAZARD_TABLE.find((x) => x.id === state.hazardId);
    if (h) {
      state.openHeads = h.heads;
      if ($("openHeads")) $("openHeads").value = h.heads;
    }
    renderResultsOnly();
    save();
  }

  function renderResultsOnly() {
    const now =
      typeof performance !== "undefined" && performance.now
        ? () => performance.now()
        : () => Date.now();
    const t0 = now();
    const r = calculate();
    const c = r.compliance;
    const elapsed = now() - t0;

    const setMetric = (id, val) => {
      if ($(id)) $(id).textContent = val;
    };
    setMetric("metricDelivery", r.deliverySec);
    setMetric("metricTrip", r.trip.sec);
    setMetric("metricTransit", r.transit.sec);
    setMetric("metricVolTotal", isMetric() ? round(r.totalVolGal * L_PER_GAL, 0) : round(r.totalVolGal, 1));
    setMetric("metricVolRemote", isMetric() ? round(r.volToRemoteGal * L_PER_GAL, 0) : round(r.volToRemoteGal, 1));
    setMetric("metricFlow", isMetric() ? round(r.designFlowGpm * LPM_PER_GPM, 0) : r.designFlowGpm);

    if ($("unitVolTotal")) $("unitVolTotal").textContent = unitLabel("vol");
    if ($("unitVolRemote")) $("unitVolRemote").textContent = unitLabel("vol");
    if ($("unitFlow")) $("unitFlow").textContent = unitLabel("flow") + " (open heads)";

    const statusEl = $("metricStatus");
    const statusCard = $("metricStatusCard");
    if (statusEl && statusCard) {
      statusCard.classList.remove(
        "pass-status",
        "fail-status",
        "exempt-status",
        "warn-status",
        "band-green",
        "band-yellow",
        "band-red",
        "band-exempt",
        "band-rejected"
      );
      const band = c.overallBand || "green";
      statusCard.classList.add("band-" + band);
      if (band === "rejected") {
        statusEl.textContent = "REJECTED";
        statusCard.classList.add("fail-status");
      } else if (band === "exempt") {
        statusEl.textContent = "EXEMPT";
        statusCard.classList.add("exempt-status");
      } else if (band === "green") {
        statusEl.textContent = "MEETS";
        statusCard.classList.add("pass-status");
      } else if (band === "yellow") {
        statusEl.textContent = "TIGHT";
        statusCard.classList.add("warn-status");
      } else {
        statusEl.textContent = "EXCEEDS";
        statusCard.classList.add("fail-status");
      }
    }

    // Wet / ineligible system banner
    const wetBox = $("systemTypeBanner");
    if (wetBox) {
      if (c.rejected) {
        wetBox.className = "callout fail";
        wetBox.innerHTML =
          `<strong>System type rejected for water delivery time.</strong> ${escapeHtml(c.rejectReason || "")}` +
          ` Volumes and Hazen–Williams may still be reviewed for information only — compliance is not evaluated.`;
        wetBox.classList.remove("hidden");
      } else {
        wetBox.classList.add("hidden");
        wetBox.innerHTML = "";
      }
    }

    // Dual NFPA / FM side-by-side
    const dual = $("dualCompare");
    if (dual) {
      const showBoth = state.criteriaSet === "both";
      dual.classList.toggle("hidden", !showBoth && state.criteriaSet !== "nfpa" && state.criteriaSet !== "fm");
      // Always show at least the selected set; show both cards when "both"
      const nfpaCard = $("nfpaCompareCard");
      const fmCard = $("fmCompareCard");
      if (nfpaCard) {
        nfpaCard.classList.toggle("hidden", state.criteriaSet === "fm");
        nfpaCard.className =
          "compare-card band-" + (c.nfpaBand || "na") + (state.criteriaSet === "fm" ? " hidden" : "");
        if ($("nfpaCompareTime")) $("nfpaCompareTime").textContent = r.deliverySec + " s";
        if ($("nfpaCompareLimit")) $("nfpaCompareLimit").textContent = "Limit " + c.nfpaMax + " s";
        if ($("nfpaCompareBand"))
          $("nfpaCompareBand").textContent = (c.nfpaBand || "—").toUpperCase();
      }
      if (fmCard) {
        fmCard.classList.toggle("hidden", state.criteriaSet === "nfpa");
        fmCard.className =
          "compare-card band-" + (c.fmBand || "na") + (state.criteriaSet === "nfpa" ? " hidden" : "");
        if ($("fmCompareTime")) $("fmCompareTime").textContent = r.deliverySec + " s";
        if ($("fmCompareLimit")) $("fmCompareLimit").textContent = "Limit " + c.fmMax + " s";
        if ($("fmCompareBand")) $("fmCompareBand").textContent = (c.fmBand || "—").toUpperCase();
      }
      dual.classList.remove("hidden");
    }

    const volBox = $("volumeCallout");
    if (volBox) {
      if (c.exempt) {
        volBox.className = "callout exempt";
        volBox.textContent = c.exemptReason;
      } else {
        volBox.className = "callout info";
        volBox.textContent = `Total ${fmtVol(r.totalVolGal, 1)} · to remote “${r.bestRemote}” ${fmtVol(r.volToRemoteGal, 1)} · no volume exemption (≤500 gal / ≤750 gal + QOD).`;
      }
    }

    const delBox = $("deliveryCallout");
    if (delBox) {
      const limit =
        state.criteriaSet === "fm"
          ? c.fmMax
          : state.criteriaSet === "both"
            ? c.stricterMax
            : c.nfpaMax;
      const band = c.overallBand;
      if (band === "rejected") {
        delBox.className = "callout fail";
        delBox.innerHTML = `<strong>Rejected</strong> — ${escapeHtml(c.systemLabel || "this system type")} is not evaluated for dry-pipe water delivery time. Estimated trip+transit (${r.deliverySec} s) is shown for reference only and is <em>not</em> a compliance result.`;
      } else if (band === "exempt") {
        delBox.className = "callout exempt";
        delBox.innerHTML = `<strong>${r.deliverySec} s</strong> (trip ${r.trip.sec} + transit ${r.transit.sec}) — volume-exempt.`;
      } else if (band === "green") {
        delBox.className = "callout ok";
        delBox.innerHTML = `<strong>${r.deliverySec} s</strong> meets with margin (≤ 90% of ${limit} s) · trip ${r.trip.sec} + transit ${r.transit.sec}.`;
      } else if (band === "yellow") {
        delBox.className = "callout warn";
        delBox.innerHTML = `<strong>${r.deliverySec} s</strong> within 10% of ${limit} s limit · trip ${r.trip.sec} + transit ${r.transit.sec}.`;
      } else {
        delBox.className = "callout fail";
        delBox.innerHTML = `<strong>${r.deliverySec} s</strong> exceeds ${limit} s · trip ${r.trip.sec} + transit ${r.transit.sec}.`;
      }
    }

    // Mute dual compare when rejected
    if (c.rejected) {
      if ($("nfpaCompareBand")) $("nfpaCompareBand").textContent = "REJECTED";
      if ($("fmCompareBand")) $("fmCompareBand").textContent = "REJECTED";
      $("nfpaCompareCard")?.classList.add("band-rejected");
      $("fmCompareCard")?.classList.add("band-rejected");
    }

    // Validation banner
    const valBox = $("validationBanner");
    if (valBox && r.validation) {
      const { errors, warnings } = r.validation;
      if (errors.length) {
        valBox.className = "callout fail";
        valBox.innerHTML =
          "<strong>Input errors</strong><ul style='margin:0.35rem 0 0;padding-left:1.1rem'>" +
          errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("") +
          "</ul>";
        valBox.classList.remove("hidden");
      } else if (warnings.length) {
        valBox.className = "callout warn";
        valBox.innerHTML =
          "<strong>Warnings</strong><ul style='margin:0.35rem 0 0;padding-left:1.1rem'>" +
          warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("") +
          "</ul>";
        valBox.classList.remove("hidden");
      } else {
        valBox.classList.add("hidden");
        valBox.innerHTML = "";
      }
    }

    if ($("tripFormulaDetail")) {
      const d = r.trip.details || {};
      $("tripFormulaDetail").innerHTML = r.trip.overridden
        ? "User override of trip time."
        : `V<sub>T</sub>=${d.VT} gal · A<sub>n</sub>=${d.An} in² · T₀=${d.T0} °R · p<sub>a0</sub>=${d.pa0} psia · p<sub>a</sub>=${d.pa} psia · ln=${d.ln}` +
          (d.qodNote ? `<br>${escapeHtml(d.qodNote)}` : "");
    }
    if ($("transitFormulaDetail")) {
      const d = r.transit.details || {};
      let extra = "";
      if (d.qSource === "residual_hw" && d.fillRate) {
        extra = ` (from residual ${d.fillRate.P_res} psi − elev ${d.fillRate.elevPsi} psi → Q = (P<sub>avail</sub>/Σk)<sup>1/1.85</sup>)`;
      } else if (d.qSource === "override") {
        extra = " (user fill-flow override)";
      } else if (d.qSource === "design") {
        extra = " (fallback: design Q of open heads)";
      }
      $("transitFormulaDetail").innerHTML = r.transit.overridden
        ? "User override of transit time."
        : d.method === "length_velocity"
          ? `L=${d.L} ft · v=${d.v} fps`
          : `V<sub>remote</sub>=${d.V} gal · Q<sub>fill</sub>=${d.Q} gpm` + extra;
    }

    if ($("fillRateDetail")) {
      const fr = r.fillDerived;
      if (fr && fr.ok) {
        $("fillRateDetail").textContent = `Derived fill rate ${fmtFlow(fr.Qgpm)} from residual ${fmtPress(fr.P_res)} at DPV (P_avail ${fmtPress(fr.P_avail)}).`;
      } else if (fr) {
        $("fillRateDetail").textContent = fr.reason || "Fill rate not derived.";
      }
    }

    const ul = $("checkList");
    if (ul) {
      ul.innerHTML = c.checks
        .map((ch) => {
          const band = ch.band || ch.status;
          return `<li><span class="tag ${ch.status} band-tag-${band || ch.status}">${escapeHtml((ch.band || ch.status || "").toUpperCase())}</span><div><strong>${escapeHtml(ch.label)}</strong><div class="sub" style="margin:0">${escapeHtml(ch.detail)}</div></div></li>`;
        })
        .join("");
    }

    const hbody = $("hydroBody");
    if (hbody) {
      const rows = r.hydraulics.nodes || [];
      hbody.innerHTML = rows
        .map((row) => {
          const cls =
            row.role === "remote" ? "remote" : row.role === "supply" ? "supply" : "";
          const low =
            row.role === "remote" &&
            num(row.pressurePsi) + 1e-9 < num(state.minPressurePsi, 7);
          return `<tr class="${cls}${low ? " low-p" : ""}">
            <td>${escapeHtml(row.node)}</td>
            <td class="num">${isMetric() ? round(row.flowGpm * LPM_PER_GPM, 1) : round(row.flowGpm, 1)}</td>
            <td class="num">${isMetric() ? round(row.pressurePsi * KPA_PER_PSI, 1) : round(row.pressurePsi, 2)}</td>
            <td class="num">${row.frictionPsi != null ? (isMetric() ? round(row.frictionPsi * KPA_PER_PSI, 2) : round(row.frictionPsi, 3)) : "—"}</td>
            <td class="num">${row.elevPsi != null ? (isMetric() ? round(row.elevPsi * KPA_PER_PSI, 2) : round(row.elevPsi, 3)) : "—"}</td>
            <td>${escapeHtml(row.segment || "—")}</td>
          </tr>`;
        })
        .join("");
    }

    if ($("hydroSummary")) {
      const fix =
        r.hydraulics.totalFixedLossPsi > 0
          ? ` · Fixed devices ${fmtPress(r.hydraulics.totalFixedLossPsi)}`
          : "";
      const pdf =
        state.pdfSource && state.pdfSource.fileName
          ? ` · PDF: ${state.pdfSource.fileName}` +
            (state.pdfSource.pageCount ? ` (${state.pdfSource.pageCount}p)` : "")
          : "";
      $("hydroSummary").textContent =
        `Design Q = ${fmtFlow(r.designFlowGpm)} · Friction ${fmtPress(r.hydraulics.totalFrictionPsi)}${fix} · Elev ${fmtPress(r.hydraulics.totalElevPsi)} · Required at supply ≈ ${fmtPress(r.hydraulics.supplyRequiredPsi)}` +
        (r.pathFound ? ` · path ${r.pathNodes.join(" → ")}` : " · path not found (using all segments)") +
        pdf +
        ` · calc ${round(elapsed, 1)} ms`;
    }

    if ($("pdfSourceBanner")) {
      if (state.pdfSource && state.pdfSource.fileName) {
        $("pdfSourceBanner").classList.remove("hidden");
        $("pdfSourceBanner").textContent =
          `PDF source: ${state.pdfSource.fileName}` +
          (state.pdfSource.pageCount ? ` · ${state.pdfSource.pageCount} pages` : "") +
          (state.pdfSource.segmentCount ? ` · ${state.pdfSource.segmentCount} segments` : "") +
          (state.pdfSource.notes ? ` — ${state.pdfSource.notes}` : "");
      } else {
        $("pdfSourceBanner").classList.add("hidden");
        $("pdfSourceBanner").textContent = "";
      }
    }

    const vbody = $("volBody");
    if (vbody) {
      vbody.innerHTML = r.segmentVols
        .map((v) => {
          const L = isMetric() ? round(num(v.seg.lengthFt) * M_PER_FT, 2) : round(num(v.seg.lengthFt), 1);
          const EL = isMetric() ? round(v.elFt * M_PER_FT, 2) : round(v.elFt, 1);
          const p = isMetric() ? round(v.pipeGal * L_PER_GAL, 2) : round(v.pipeGal, 2);
          const f = isMetric() ? round(v.fitGal * L_PER_GAL, 2) : round(v.fitGal, 2);
          const t = isMetric() ? round(v.totalGal * L_PER_GAL, 2) : round(v.totalGal, 2);
          return `<tr>
              <td>${escapeHtml(v.seg.from)} → ${escapeHtml(v.seg.to)}</td>
              <td class="num">${round(v.idIn, 3)}</td>
              <td class="num">${L}</td>
              <td class="num">${EL}</td>
              <td class="num">${p}</td>
              <td class="num">${f}</td>
              <td class="num"><strong>${t}</strong></td>
            </tr>`;
        })
        .join("");
    }

    if ($("calcTiming")) {
      $("calcTiming").textContent = `Recalc ${round(elapsed, 1)} ms`;
    }

    updatePrintBlock(r);
  }

  function render() {
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    writeForm();
    renderPipeTable();
    renderResultsOnly();
    save();
  }

  // ─── Print / report ──────────────────────────────────────────────────────
  function updatePrintBlock(r) {
    const c = r.compliance;
    const set = (id, v) => {
      if ($(id)) $(id).textContent = v;
    };
    set("printProject", state.projectName || "—");
    set("printFacility", state.facility || "—");
    set("printBy", state.preparedBy || "—");
    set("printPe", state.peNumber || "—");
    set("printCompany", state.company || "—");
    set("printDate", state.date || "—");
    set("printOccupancy", state.occupancyDesc || "—");
    set("printSystemType", c.systemLabel || systemTypeLabel(state.systemType));
    set("printHazard", c.hazard.label);
    set("printHeads", String(state.openHeads));
    set("printQod", state.qodPresent ? "Yes" : "No");
    set("printCriteria", state.criteriaSet === "both" ? "NFPA 13 + FM (stricter)" : state.criteriaSet === "fm" ? "FM Global" : "NFPA 13");
    if (c.rejected) {
      set("printStatus", "REJECTED — NOT ELIGIBLE");
      set("printDelivery", "N/A (system type rejected)");
    }
    set("printVolTotal", round(r.totalVolGal, 2) + " gal");
    set("printVolRemote", round(r.volToRemoteGal, 2) + " gal");
    set("printFlow", r.designFlowGpm + " gpm");
    set("printTrip", r.trip.sec + " s");
    set("printTransit", r.transit.sec + " s");
    set("printDelivery", r.deliverySec + " s");
    set("printLimit", (state.criteriaSet === "fm" ? c.fmMax : state.criteriaSet === "both" ? Math.min(c.nfpaMax, c.fmMax) : c.nfpaMax) + " s");
    set("printStatus", c.overall.toUpperCase());
    set("printHydro", `Required @ supply ${r.hydraulics.supplyRequiredPsi} psi · residual target @ remote ${r.hydraulics.remoteResidualPsi} psi`);
    set("printNotes", state.notes || "—");
    set("printVersion", APP_VERSION);
    set("printSignName", state.preparedBy || "________________");
    set("printSignPe", state.peNumber || "________________");
    set("printSignDate", state.date || "________________");
    set("printTripFormula", r.trip.formula || "—");
    set("printTransitFormula", r.transit.formula || "—");
    set("printFillNote", (() => {
      const d = r.transit.details || {};
      if (d.qSource === "residual_hw") return `Q_fill = ${d.Q} gpm from residual HW at DPV`;
      if (d.qSource === "override") return `Q_fill = ${d.Q} gpm (user override)`;
      if (d.qSource === "design") return `Q_fill = ${d.Q} gpm (design open-head flow)`;
      return "—";
    })());
    set("printNfpaBand", (c.nfpaBand || "—").toUpperCase());
    set("printFmBand", (c.fmBand || "—").toUpperCase());

    const pt = $("printSegBody");
    if (pt) {
      pt.innerHTML = r.segmentVols
        .map(
          (v) =>
            `<tr>
              <td>${escapeHtml(v.seg.from)}→${escapeHtml(v.seg.to)}</td>
              <td>${escapeHtml(v.seg.nominal)}" Sch ${escapeHtml(v.seg.schedule)}</td>
              <td>${round(v.idIn, 3)}</td>
              <td>${round(num(v.seg.lengthFt), 1)}</td>
              <td>${round(v.elFt, 1)}</td>
              <td>${v.seg.cFactor}</td>
              <td>${round(v.totalGal, 2)}</td>
              <td>${escapeHtml(v.seg.notes || "")}</td>
            </tr>`
        )
        .join("");
    }

    if (window.FireToolshedLogo && typeof window.FireToolshedLogo.reportHeaderHtml === "function") {
      const host = $("reportLogoPrint");
      if (host) host.innerHTML = window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 });
    }
  }

  function buildReportHtml(r) {
    const c = r.compliance;
    const limit =
      state.criteriaSet === "fm"
        ? c.fmMax
        : state.criteriaSet === "both"
          ? Math.min(c.nfpaMax, c.fmMax)
          : c.nfpaMax;
    const logo =
      window.FireToolshedLogo && typeof window.FireToolshedLogo.reportHeaderHtml === "function"
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 56 })
        : "";

    const segRows = r.segmentVols
      .map(
        (v) =>
          `<tr>
            <td>${escapeHtml(v.seg.from)}→${escapeHtml(v.seg.to)}</td>
            <td>${escapeHtml(String(v.seg.nominal))}" Sch ${escapeHtml(v.seg.schedule)}</td>
            <td style="text-align:right">${round(v.idIn, 3)}</td>
            <td style="text-align:right">${round(num(v.seg.lengthFt), 1)}</td>
            <td style="text-align:right">${round(v.elFt, 1)}</td>
            <td style="text-align:right">${v.seg.cFactor}</td>
            <td style="text-align:right">${round(v.totalGal, 2)}</td>
          </tr>`
      )
      .join("");

    const hydroRows = (r.hydraulics.nodes || [])
      .map(
        (row) =>
          `<tr>
            <td>${escapeHtml(row.node)}</td>
            <td style="text-align:right">${round(row.flowGpm, 1)}</td>
            <td style="text-align:right">${round(row.pressurePsi, 2)}</td>
            <td style="text-align:right">${row.frictionPsi != null ? round(row.frictionPsi, 3) : "—"}</td>
          </tr>`
      )
      .join("");

    const checkRows = c.checks
      .map(
        (ch) =>
          `<tr><td>${escapeHtml(ch.status.toUpperCase())}</td><td>${escapeHtml(ch.label)}</td><td>${escapeHtml(ch.detail)}</td></tr>`
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Dry Sprinkler Delivery — ${escapeHtml(state.projectName || "Report")}</title>
<style>
  body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;max-width:900px;margin:1.5rem auto;padding:0 1rem;line-height:1.45}
  h1{font-size:1.35rem;margin:0 0 .25rem}
  h2{font-size:1.05rem;margin:1.25rem 0 .5rem;border-bottom:1px solid #e2e8f0;padding-bottom:.25rem}
  .meta{color:#475569;font-size:.9rem;margin-bottom:1rem}
  .disclaimer{border:2px solid #b45309;background:#fffbeb;padding:.75rem 1rem;margin:1rem 0;color:#78350f;font-size:.88rem}
  table{width:100%;border-collapse:collapse;font-size:.85rem;margin:.5rem 0 1rem}
  th,td{border:1px solid #cbd5e1;padding:.35rem .5rem;text-align:left}
  th{background:#f1f5f9}
  .kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.5rem;margin:1rem 0}
  .kpi div{border:1px solid #e2e8f0;border-radius:8px;padding:.5rem .65rem}
  .kpi b{display:block;font-size:1.2rem}
  .kpi span{font-size:.7rem;color:#64748b;text-transform:uppercase}
  footer{margin-top:2rem;font-size:.75rem;color:#64748b}
</style></head><body>
${logo}
<h1>Dry Sprinkler System Water Delivery Time</h1>
<p class="meta">${escapeHtml(state.projectName || "Untitled project")} · ${escapeHtml(state.facility || "")}<br>
Prepared by ${escapeHtml(state.preparedBy || "—")}${state.peNumber ? " · PE " + escapeHtml(state.peNumber) : ""} · ${escapeHtml(state.company || "")} · ${escapeHtml(state.date || "")}</p>

<div class="disclaimer">
  <strong>Preliminary design estimate only.</strong> This tool is <em>not</em> a listed calculation method under NFPA 13.
  Final compliance requires either a nationally recognized testing laboratory–listed program or a successful field trip test.
</div>

<div class="kpi">
  <div><span>Delivery time</span><b>${r.deliverySec} s</b></div>
  <div><span>Trip</span><b>${r.trip.sec} s</b></div>
  <div><span>Transit</span><b>${r.transit.sec} s</b></div>
  <div><span>Limit</span><b>${limit} s</b></div>
  <div><span>Status</span><b>${c.overall.toUpperCase()}</b></div>
  <div><span>Total volume</span><b>${round(r.totalVolGal, 1)} gal</b></div>
</div>

<h2>Project criteria</h2>
<table>
  <tr><th>Occupancy / building</th><td>${escapeHtml(state.occupancyDesc || "—")}</td></tr>
  <tr><th>System type</th><td>${escapeHtml(c.systemLabel || systemTypeLabel(state.systemType))}${c.rejected ? " — <strong>REJECTED for water delivery time</strong>" : ""}</td></tr>
  ${
    state.pdfSource && state.pdfSource.fileName
      ? `<tr><th>PDF source</th><td>${escapeHtml(state.pdfSource.fileName)}${
          state.pdfSource.pageCount ? " · " + state.pdfSource.pageCount + " pages" : ""
        }${state.pdfSource.segmentCount ? " · " + state.pdfSource.segmentCount + " segments" : ""}</td></tr>`
      : ""
  }
  <tr><th>Criteria set</th><td>${escapeHtml(state.criteriaSet)}</td></tr>
  <tr><th>Hazard</th><td>${escapeHtml(c.hazard.label)} · ${state.openHeads} most remote head(s) · max ${c.nfpaMax} s (NFPA)</td></tr>
  <tr><th>QOD present</th><td>${state.qodPresent ? "Yes" : "No"}</td></tr>
  ${c.rejected ? `<tr><th>Compliance</th><td style="color:#991b1b"><strong>REJECTED</strong> — ${escapeHtml(c.rejectReason || "")}</td></tr>` : ""}
  <tr><th>Design flow</th><td>${r.designFlowGpm} gpm · K=${state.kFactor} · P<sub>min</sub>=${state.minPressurePsi} psi</td></tr>
  <tr><th>Supply / remote</th><td>${escapeHtml(state.supplyNode)} → ${escapeHtml(r.bestRemote)}</td></tr>
</table>

<h2>Volumes</h2>
<table>
  <tr><th>Total system volume</th><td>${round(r.totalVolGal, 2)} gal</td></tr>
  <tr><th>Volume to most remote</th><td>${round(r.volToRemoteGal, 2)} gal</td></tr>
  <tr><th>Exemption</th><td>${c.exempt ? escapeHtml(c.exemptReason) : "None"}</td></tr>
</table>

<h2>Pipe segments</h2>
<table>
  <thead><tr><th>From–To</th><th>Pipe</th><th>ID (in)</th><th>L (ft)</th><th>EL (ft)</th><th>C</th><th>Vol (gal)</th></tr></thead>
  <tbody>${segRows}</tbody>
</table>

<h2>Water delivery estimate</h2>
<table>
  <tr><th>Trip time</th><td>${r.trip.sec} s — ${escapeHtml(r.trip.formula)}</td></tr>
  <tr><th>Transit time</th><td>${r.transit.sec} s — ${escapeHtml(r.transit.formula)}</td></tr>
  <tr><th>Total delivery</th><td><strong>${r.deliverySec} s</strong> (limit ${limit} s)</td></tr>
  <tr><th>Air / trip pressures</th><td>${state.airPressurePsi} psig initial · ${state.tripPressurePsi} psig trip · ${state.temperatureF} °F</td></tr>
</table>

<h2>Steady-state hydraulics (Hazen–Williams)</h2>
<p style="font-size:.85rem;color:#475569">p = 4.52 Q<sup>1.85</sup> / (C<sup>1.85</sup> d<sup>4.87</sup>) psi/ft · Required at supply ≈ ${r.hydraulics.supplyRequiredPsi} psi</p>
<table>
  <thead><tr><th>Node</th><th>Q (gpm)</th><th>P (psi)</th><th>ΔP<sub>fric</sub></th></tr></thead>
  <tbody>${hydroRows}</tbody>
</table>

<h2>Compliance checks</h2>
<table>
  <thead><tr><th>Status</th><th>Check</th><th>Detail</th></tr></thead>
  <tbody>${checkRows}</tbody>
</table>

${state.notes ? `<h2>Notes</h2><p>${escapeHtml(state.notes)}</p>` : ""}

<h2>Delivery formulas</h2>
<table>
  <tr><th>Trip</th><td>${escapeHtml(r.trip.formula)}</td></tr>
  <tr><th>Transit</th><td>${escapeHtml(r.transit.formula)}</td></tr>
  <tr><th>Fill rate basis</th><td>${escapeHtml((() => {
    const d = r.transit.details || {};
    if (d.qSource === "residual_hw") return `Residual HW @ DPV → Q_fill = ${d.Q} gpm`;
    if (d.qSource === "override") return `User override Q_fill = ${d.Q} gpm`;
    if (d.qSource === "design") return `Design open-head Q = ${d.Q} gpm`;
    return "—";
  })())}</td></tr>
  <tr><th>NFPA band</th><td>${escapeHtml((c.nfpaBand || "—").toUpperCase())} (limit ${c.nfpaMax} s)</td></tr>
  <tr><th>FM band</th><td>${escapeHtml((c.fmBand || "—").toUpperCase())} (limit ${c.fmMax} s)</td></tr>
</table>

<h2>Signature</h2>
<table>
  <tr><th>Name</th><td>${escapeHtml(state.preparedBy || "")}</td><th>PE #</th><td>${escapeHtml(state.peNumber || "")}</td></tr>
  <tr><th>Date</th><td>${escapeHtml(state.date || "")}</td><th>Company</th><td>${escapeHtml(state.company || "")}</td></tr>
  <tr><th>Signature</th><td colspan="3" style="height:3rem"> </td></tr>
</table>

<footer>
  Dry Sprinkler Water Delivery Time Calculator ${APP_VERSION} · Fire Toolshed<br>
  Preliminary only — not a listed NFPA 13 method. Field trip test or listed software required for final compliance.
</footer>
<script>/* Print to PDF via browser: Ctrl/Cmd+P → Save as PDF */</script>
</body></html>`;
  }

  function downloadBlob(filename, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function projectFileBase() {
    const stamp = (state.date || new Date().toISOString().slice(0, 10)).replace(/[^\d-]/g, "");
    const base = (state.projectName || "dry-sprinkler").replace(/[^\w\-]+/g, "_").slice(0, 40);
    return { base, stamp };
  }

  function saveReport() {
    readForm();
    const r = calculate();
    const html = buildReportHtml(r);
    const { base, stamp } = projectFileBase();

    downloadBlob(`${base}_delivery_${stamp}.html`, new Blob([html], { type: "text/html;charset=utf-8" }));
    const data = { version: APP_VERSION, exportedAt: new Date().toISOString(), state, result: r };
    downloadBlob(
      `${base}_delivery_${stamp}.json`,
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    toast("Report HTML + JSON downloaded — use Print → Save as PDF for PDF");
  }

  function exportCsv() {
    readForm();
    const r = calculate();
    const rows = [
      [
        "From",
        "To",
        "Length_ft",
        "Nominal",
        "Schedule",
        "ID_in",
        "C",
        "EL_ft",
        "Elev_ft",
        "Pipe_gal",
        "Fit_gal",
        "Total_gal",
        "Notes",
      ],
    ];
    r.segmentVols.forEach((v) => {
      rows.push([
        v.seg.from,
        v.seg.to,
        num(v.seg.lengthFt),
        v.seg.nominal,
        v.seg.schedule,
        round(v.idIn, 4),
        v.seg.cFactor,
        round(v.elFt, 3),
        num(v.seg.elevFt),
        round(v.pipeGal, 4),
        round(v.fitGal, 4),
        round(v.totalGal, 4),
        (v.seg.notes || "").replace(/"/g, '""'),
      ]);
    });
    // Node pressures
    rows.push([]);
    rows.push(["Node", "Q_gpm", "P_psi", "dP_fric_psi", "dP_elev_psi", "Segment", "Role"]);
    (r.hydraulics.nodes || []).forEach((n) => {
      rows.push([
        n.node,
        round(n.flowGpm, 3),
        round(n.pressurePsi, 4),
        n.frictionPsi != null ? round(n.frictionPsi, 4) : "",
        n.elevPsi != null ? round(n.elevPsi, 4) : "",
        n.segment || "",
        n.role || "",
      ]);
    });
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\r\n");
    const { base, stamp } = projectFileBase();
    downloadBlob(`${base}_nodes_${stamp}.csv`, new Blob([csv], { type: "text/csv;charset=utf-8" }));
    toast("CSV exported (pipe + node tables)");
  }

  function exportPdf() {
    readForm();
    calculate();
    updatePrintBlock(lastResult);
    // Browser print dialog — user chooses “Save as PDF”
    window.print();
  }

  // ─── Example / reset ─────────────────────────────────────────────────────
  function loadExample() {
    state = defaultState();
    state.projectName = "Example Warehouse — Dry Pipe OH-2";
    state.facility = "Building A, high bay";
    state.preparedBy = "FPE";
    state.company = "Fire Toolshed";
    state.occupancyDesc = "Ordinary Hazard Group 2 storage / manufacturing";
    state.systemType = "dry";
    state.hazardId = "ordinary";
    state.openHeads = 2;
    state.qodPresent = false;
    state.airPressurePsi = 40;
    state.tripPressurePsi = 15;
    state.residualSupplyPsi = 75;
    state.kFactor = 8.0;
    state.minPressurePsi = 7;
    state.fillFlowGpm = null; // derive fill from residual HW
    state.criteriaSet = "both";
    state.notes =
      "Example network for tool demonstration only. Transit fill rate derived from residual pressure at DPV via inverse Hazen–Williams.";
    render();
    toast("Example project loaded");
  }

  function resetAll() {
    if (!confirm("Reset all inputs to defaults?")) return;
    state = defaultState();
    render();
    toast("Reset to defaults");
  }

  // ─── Help modal ──────────────────────────────────────────────────────────
  function showHelp() {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop no-print";
    backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
      <h2 id="helpTitle">Help / calculation basis</h2>
      <p class="hint">This tool produces <strong>preliminary</strong> dry-pipe / double-interlock preaction water delivery estimates. It is not a listed method.</p>
      <h3>Volumes</h3>
      <p>Pipe volume from actual internal diameter and length. Optional fitting volume ≈ 15% of equivalent length treated as pipe (toggleable).</p>
      <h3>Hazen–Williams</h3>
      <div class="formula-box">p (psi/ft) = 4.52 × Q<sup>1.85</sup> / (C<sup>1.85</sup> × d<sup>4.87</sup>)</div>
      <p>Walk from remote node(s) back to supply; accumulate friction + elevation (0.433 psi/ft).</p>
      <h3>Trip time (FMRC-style)</h3>
      <div class="formula-box">t_trip ≈ 0.0352 × (V_T / (A_n √T₀)) × ln(p_a0 / p_a)</div>
      <p>V_T gal, A_n in² (from K-factor orifice), T₀ °R, absolute pressures. QOD applies 50% planning reduction unless you override trip time.</p>
      <h3>Transit time</h3>
      <div class="formula-box">t_transit = 60 × V_remote / Q_fill<br>Q_fill from residual @ DPV: Q = (P_avail / Σk)<sup>1/1.85</sup></div>
      <p>P_avail = residual − elevation. Σk from path Hazen–Williams coefficients. Override fill flow if desired. Alternate: L / v_fill.</p>
      <h3>Color bands</h3>
      <p><strong>Green</strong> ≤ 90% of limit · <strong>Yellow</strong> within 10% of limit (still ≤ limit) · <strong>Red</strong> exceeds.</p>
      <h3>NFPA 13 exemptions</h3>
      <ul>
        <li>≤ 500 gal — no water delivery time requirement</li>
        <li>≤ 750 gal with listed QOD — no water delivery time requirement</li>
      </ul>
      <h3>Delivery limits (NFPA 13 table)</h3>
      <ul>
        <li>Dwelling 1 head — 15 s</li>
        <li>Light 1 head — 60 s</li>
        <li>Ordinary 2 heads — 50 s</li>
        <li>Extra 4 heads — 45 s</li>
        <li>High-piled 4 heads — 40 s</li>
      </ul>
      <div class="close-row"><button type="button" class="primary" id="helpClose">Close</button></div>
    </div>`;
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
    backdrop.querySelector("#helpClose").addEventListener("click", close);
  }

  // ─── Wire UI ─────────────────────────────────────────────────────────────
  function wire() {
    document.addEventListener("change", (e) => {
      if (e.target.closest("#pipeBody")) return; // handled per-input
      if (e.target.id === "hazardId") {
        onHazardChange();
        return;
      }
      if (e.target.name === "designMode") {
        readForm();
        toggleDesignModeUI();
        renderResultsOnly();
        save();
        return;
      }
      if (e.target.name === "transitMethod") {
        readForm();
        toggleTransitUI();
        renderResultsOnly();
        save();
        return;
      }
      if (e.target.closest(".shell") || e.target.closest("header")) {
        onAnyChange();
      }
    });
    document.addEventListener("input", (e) => {
      if (e.target.closest("#pipeBody")) return;
      if (e.target.matches("input, select, textarea") && e.target.closest(".shell")) {
        // debounce light
        clearTimeout(wire._t);
        wire._t = setTimeout(onAnyChange, 120);
      }
    });

    $("btnAddRow")?.addEventListener("click", () => {
      readForm();
      const last = state.segments[state.segments.length - 1];
      state.segments.push(
        newSegment({
          from: last?.to || "N",
          to: "New",
          lengthFt: 20,
          nominal: last?.nominal || "2",
          schedule: last?.schedule || "40",
        })
      );
      render();
    });
    $("btnInsertRow")?.addEventListener("click", () => {
      readForm();
      state.segments.unshift(newSegment({ from: state.supplyNode || "DPV", to: "N0", lengthFt: 10, nominal: "4" }));
      render();
    });
    $("btnDupPath")?.addEventListener("click", () => {
      readForm();
      const copies = state.segments.map((s) =>
        newSegment({
          ...JSON.parse(JSON.stringify(s)),
          id: "s" + Math.random().toString(36).slice(2, 9),
          from: s.from + "'",
          to: s.to + "'",
        })
      );
      state.segments = state.segments.concat(copies);
      render();
      toast("Path duplicated (nodes primed with ')");
    });

    $("btnHelp")?.addEventListener("click", showHelp);
    $("btnMethodology")?.addEventListener("click", () => {
      $("methodologyPanel")?.classList.toggle("hidden");
    });
    $("btnSaveReport")?.addEventListener("click", saveReport);
    $("btnPrint")?.addEventListener("click", exportPdf);
    $("btnPdf")?.addEventListener("click", exportPdf);
    $("btnCsv")?.addEventListener("click", exportCsv);
    $("btnSaveProject")?.addEventListener("click", pushHistory);
    $("btnExample")?.addEventListener("click", loadExample);
    $("btnReset")?.addEventListener("click", resetAll);
    $("btnImportFixture")?.addEventListener("click", () => $("fixtureFile")?.click());
    $("fixtureFile")?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fix = JSON.parse(String(reader.result || "{}"));
          const res = importPdfFixture(fix);
          if (!res.ok) {
            toast(res.error || "Import failed");
            return;
          }
          render();
          const hwOk = res.hwResults
            ? res.hwResults.filter((h) => h.ok).length + "/" + res.hwResults.length + " HW rows"
            : "";
          toast(
            `Imported ${res.segmentCount} segments` +
              (res.pdfSource?.pageCount ? ` · ${res.pdfSource.pageCount} PDF pages` : "") +
              (hwOk ? ` · ${hwOk}` : "") +
              (res.result?.compliance?.rejected ? " · system type REJECTED" : "")
          );
        } catch (err) {
          toast("Invalid fixture JSON: " + (err.message || err));
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    });
    $("btnTheme")?.addEventListener("click", () => {
      state.darkMode = !state.darkMode;
      applyTheme();
      save();
    });
    $("projectHistory")?.addEventListener("change", (e) => {
      const id = e.target.value;
      if (id) restoreHistory(id);
    });

    // Logo (shared Fire Toolshed control)
    if (window.FireToolshedLogo && typeof window.FireToolshedLogo.bindControls === "function") {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
      });
    }
  }

  // ─── Expose for validation tests ─────────────────────────────────────────
  window.DrySprinklerDelivery = {
    version: APP_VERSION,
    calculate,
    getState: () => state,
    setState: (s) => {
      state = { ...defaultState(), ...s };
    },
    defaultState,
    pipeVolumeGal,
    orificeAreaIn2,
    tripTimeSec,
    transitTimeSec,
    fillRateFromResidual,
    bandFor,
    validate,
    HAZARD_TABLE,
    PIPE_ID,
    DELIVERY_ELIGIBLE,
    isDeliveryEligible,
    systemTypeLabel,
    designFlowGpm,
    pathToRemote,
    hydraulicWalk,
    segmentVolumes,
    idInFor,
    importPdfFixture,
    verifyHwChecks,
    loadMultiPageFixture: importPdfFixture,
  };

  // ─── Boot ────────────────────────────────────────────────────────────────
  function boot() {
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    load();
    applyTheme();
    wire();
    render();
    renderHistorySelect();

    // PWA service worker
    try {
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => { /* offline optional */ });
      }
    } catch (_) { /* ignore */ }

    if (window.FireToolshedShell && typeof window.FireToolshedShell.mount === "function") {
      try {
        window.FireToolshedShell.mount({ step: "hub", base: ".." });
      } catch (_) { /* optional */ }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
