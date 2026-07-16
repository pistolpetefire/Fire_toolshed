/**
 * Sprinkler System Estimator — preliminary / charette planning
 * NOT a Hazen-Williams final hydraulic calculation.
 */
(function () {
  "use strict";

  const APP_VERSION = "1.0.0-prelim";
  const STORAGE_KEY = "sprinklerSystemEstimator.v1";
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

  /** NFPA 13 density-area style planning presets (ordinary / light / extra) */
  const NFPA13 = [
    { id: "custom", name: "Custom / project values", density: 0.1, area: 1500, hose: 100, remotePsi: 7, note: "Enter project values." },
    { id: "light", name: "Light hazard (typical density-area)", density: 0.1, area: 1500, hose: 100, remotePsi: 7, note: "NFPA 13 light hazard density-area planning values; confirm edition & occupancy." },
    { id: "oh1", name: "Ordinary hazard Group 1", density: 0.15, area: 1500, hose: 250, remotePsi: 7, note: "OH-1 planning density-area; confirm with adopted NFPA 13." },
    { id: "oh2", name: "Ordinary hazard Group 2", density: 0.2, area: 1500, hose: 250, remotePsi: 7, note: "OH-2 planning density-area; confirm with adopted NFPA 13." },
    { id: "eh1", name: "Extra hazard Group 1", density: 0.3, area: 2500, hose: 500, remotePsi: 7, note: "EH-1 planning values; often superseded by storage/special design." },
    { id: "eh2", name: "Extra hazard Group 2", density: 0.4, area: 2500, hose: 500, remotePsi: 7, note: "EH-2 planning values; verify special occupancy criteria." },
  ];

  /** UFC 3-600-01 Table 9-3 style planning options (subset for prelim) */
  const UFC_TABLE = [
    { id: "custom", name: "Custom UFC / project demand", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, note: "Enter UFC-specific project values." },
    { id: "light-30-wet", name: "Light · wet · ceiling ≤30 ft", density: 0.1, area: 1500, hose: 100, remotePsi: 7, kFactor: 5.6, note: "UFC Table 9-3 style light/wet ≤30 ft planning row." },
    { id: "ordinary-30-wet", name: "Ordinary · wet · ceiling ≤30 ft", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 8, note: "UFC Table 9-3 style ordinary/wet ≤30 ft planning row." },
    { id: "ordinary-45-wet", name: "Ordinary · wet · ceiling >30–45 ft", density: 0.2, area: 2500, hose: 250, remotePsi: 7, kFactor: 11.2, note: "UFC elevated ceiling planning row; confirm current UFC edition." },
    { id: "extra-30-wet", name: "Extra · wet · ceiling ≤30 ft (planning)", density: 0.3, area: 2500, hose: 500, remotePsi: 7, kFactor: 11.2, note: "Extra hazard planning placeholder — verify UFC table for occupancy." },
  ];

  /** FM Global Data Sheet inspired planning presets (generic — user must cite DS) */
  const FM_PRESETS = [
    { id: "custom", name: "Custom FM / project (cite data sheet)", density: 0.2, area: 2500, hose: 250, remotePsi: 7, note: "Enter values from the governing FM Global DS for the occupancy." },
    { id: "ds3-26-oh", name: "FM DS 3-26 style — ordinary hazard (planning)", density: 0.2, area: 2500, hose: 250, remotePsi: 7, note: "Generic OH planning placeholder. Cite actual FM DS 3-26 tables/figures used." },
    { id: "ds8-9-storage", name: "FM DS 8-9 style — storage (planning)", density: 0.45, area: 2000, hose: 500, remotePsi: 7, note: "Storage is highly configuration-specific. Replace with DS 8-9 values for commodity/height/aisle." },
    { id: "ds5-32-dc", name: "FM DS 5-32 style — data center (planning)", density: 0.3, area: 2500, hose: 250, remotePsi: 7, note: "Data center protection varies (wet/preaction/clean agent). Cite DS 5-32 project path." },
    { id: "ds3-26-eh", name: "FM DS 3-26 style — extra hazard (planning)", density: 0.3, area: 2500, hose: 500, remotePsi: 7, note: "Extra hazard planning placeholder; confirm DS tables for process/occupancy." },
  ];

  const defaultState = () => ({
    projectName: "",
    preparedBy: "",
    date: new Date().toISOString().slice(0, 10),
    facility: "",
    notes: "",
    mode: "simple", // simple | criteria
    framework: "nfpa13", // nfpa13 | ufc | fm
    presetId: "oh2",
    manualDemandGpm: 500,
    includeHose: true,
    density: 0.2,
    designArea: 1500,
    hoseGpm: 250,
    remotePsi: 7,
    kFactor: 5.6,
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
      remote: "Remote area residual at most remote sprinkler(s); minimum often 7 psi for standard spray unless K-factor or listing requires more.",
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

  function getPresetList() {
    if (state.framework === "ufc") return UFC_TABLE;
    if (state.framework === "fm") return FM_PRESETS;
    return NFPA13;
  }

  function getPreset() {
    const list = getPresetList();
    return list.find((p) => p.id === state.presetId) || list[0];
  }

  function applyPreset() {
    const p = getPreset();
    if (!p || p.id === "custom") return;
    state.density = p.density;
    state.designArea = p.area;
    state.hoseGpm = p.hose;
    state.remotePsi = p.remotePsi;
    if (p.kFactor) state.kFactor = p.kFactor;
    state.basisNotes.demand = p.note;
  }

  function elevLossPsi() {
    return Math.max(0, num(state.elevFt)) * PSI_PER_FT;
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
    const q = Math.max(0, num(state.density)) * Math.max(0, num(state.designArea));
    const hose = state.includeHose ? Math.max(0, num(state.hoseGpm)) : 0;
    return q + hose;
  }

  function sprinklerOnlyGpm() {
    if (state.mode === "simple") {
      // In simple mode, hose is assumed included in manual total unless user notes otherwise
      return Math.max(0, num(state.manualDemandGpm));
    }
    return Math.max(0, num(state.density)) * Math.max(0, num(state.designArea));
  }

  function calculate() {
    const elev = elevLossPsi();
    const backflow = backflowLossPsi();
    const equipLosses = lossItemsTotal();
    const other = Math.max(0, num(state.systemOtherPsi));
    const safety = Math.max(0, num(state.safetyMarginPsi));
    const remote = Math.max(0, num(state.remotePsi));

    const flowGpm = sprinklerDemandGpm();
    const pressurePsi =
      remote + elev + backflow + equipLosses + other + safety;

    const breakdown = [
      { id: "remote", label: "Remote sprinkler residual (min at remote head)", psi: remote, basis: state.basisNotes.remote },
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
      breakdown,
      frameworkLabel:
        state.framework === "ufc"
          ? "UFC 3-600-01"
          : state.framework === "fm"
            ? "FM Global data sheets"
            : "NFPA 13",
      modeLabel: state.mode === "simple" ? "Simple (manual demand)" : "Criteria-assisted estimate",
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
    state.presetId = $("presetSelect")?.value || state.presetId;
    state.manualDemandGpm = num($("manualDemandGpm")?.value, 0);
    state.includeHose = !!$("includeHose")?.checked;
    state.density = num($("density")?.value, 0);
    state.designArea = num($("designArea")?.value, 0);
    state.hoseGpm = num($("hoseGpm")?.value, 0);
    state.remotePsi = num($("remotePsi")?.value, 7);
    state.kFactor = num($("kFactor")?.value, 5.6);
    state.elevFt = num($("elevFt")?.value, 0);
    state.backflowType = $("backflowType")?.value || "none";
    state.backflowCustomPsi = num($("backflowCustomPsi")?.value, 0);
    state.safetyMarginPsi = num($("safetyMarginPsi")?.value, 0);
    state.systemOtherPsi = num($("systemOtherPsi")?.value, 0);
    state.basisNotes.demand = $("demandBasis")?.value || state.basisNotes.demand;
    state.basisNotes.losses = $("lossBasis")?.value || state.basisNotes.losses;
    state.basisNotes.remote = $("remoteBasis")?.value || state.basisNotes.remote;

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

    const modeEl = document.querySelector(`input[name="mode"][value="${state.mode}"]`);
    if (modeEl) modeEl.checked = true;
    const fw = document.querySelector(`input[name="framework"][value="${state.framework}"]`);
    if (fw) fw.checked = true;

    populatePresets();
    if ($("manualDemandGpm")) $("manualDemandGpm").value = state.manualDemandGpm;
    if ($("includeHose")) $("includeHose").checked = state.includeHose;
    if ($("density")) $("density").value = state.density;
    if ($("designArea")) $("designArea").value = state.designArea;
    if ($("hoseGpm")) $("hoseGpm").value = state.hoseGpm;
    if ($("remotePsi")) $("remotePsi").value = state.remotePsi;
    if ($("kFactor")) $("kFactor").value = state.kFactor;
    if ($("elevFt")) $("elevFt").value = state.elevFt;
    if ($("backflowType")) $("backflowType").value = state.backflowType;
    if ($("backflowCustomPsi")) $("backflowCustomPsi").value = state.backflowCustomPsi;
    if ($("safetyMarginPsi")) $("safetyMarginPsi").value = state.safetyMarginPsi;
    if ($("systemOtherPsi")) $("systemOtherPsi").value = state.systemOtherPsi;
    if ($("demandBasis")) $("demandBasis").value = state.basisNotes.demand;
    if ($("lossBasis")) $("lossBasis").value = state.basisNotes.losses;
    if ($("remoteBasis")) $("remoteBasis").value = state.basisNotes.remote;

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

    $("metricFlow").textContent = String(calc.flowGpm);
    $("metricPressure").textContent = String(calc.pressurePsi);
    $("metricElev").textContent = String(calc.elevPsi);
    $("metricRemote").textContent = String(calc.remotePsi);

    $("resultFlow").textContent = calc.flowGpm + " GPM";
    $("resultPressure").textContent = calc.pressurePsi + " PSI";
    $("resultMode").textContent = calc.modeLabel + " · " + calc.frameworkLabel;

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
        `<div class="row total"><span>Required pressure at pump discharge (prelim)</span><strong>${calc.pressurePsi} psi</strong></div>
         <div class="row total"><span>System demand flow (prelim)</span><strong>${calc.flowGpm} gpm</strong></div>`;
    }

    $("exportFlow").textContent = String(calc.flowGpm);
    $("exportPressure").textContent = String(calc.pressurePsi);

    // Print fields
    $("printProject").textContent = state.projectName || "—";
    $("printBy").textContent = state.preparedBy || "—";
    $("printDate").textContent = state.date || "—";
    $("printFacility").textContent = state.facility || "—";
    $("printFramework").textContent = calc.frameworkLabel;
    $("printMode").textContent = calc.modeLabel;
    $("printPreset").textContent = getPreset()?.name || "—";
    $("printNotes").textContent = state.notes || "—";
    $("printDemandBasis").textContent = state.basisNotes.demand || "—";
    $("printLossBasis").textContent = state.basisNotes.losses || "—";
    $("printFlow").textContent = calc.flowGpm + " GPM";
    $("printPressure").textContent = calc.pressurePsi + " PSI";
    $("printVersion").textContent = APP_VERSION;

    const pbd = $("printBreakdown");
    if (pbd) {
      pbd.innerHTML = calc.breakdown
        .map(
          (row) =>
            `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.basis)}</td><td class="num">${round1(row.psi)}</td></tr>`,
        )
        .join("");
    }

    save();
  }

  function onChange() {
    const prevFramework = state.framework;
    const prevMode = state.mode;
    readForm();
    if (state.framework !== prevFramework) {
      state.presetId = getPresetList()[1]?.id || getPresetList()[0].id;
      populatePresets();
      applyPreset();
      writeForm();
    }
    if (state.mode !== prevMode) {
      updateModeVisibility();
    }
    // Preset change in criteria mode
    render();
  }

  function onPresetChange() {
    readForm();
    applyPreset();
    writeForm();
    render();
  }

  async function copyForPumpSizer() {
    const calc = calculate();
    const text =
      `SPRINKLER SYSTEM ESTIMATOR → FIRE PUMP SIZER\n` +
      `Tool version: ${APP_VERSION}\n` +
      `Project: ${state.projectName || "—"}\n` +
      `Date: ${state.date || "—"}\n` +
      `Framework: ${calc.frameworkLabel}\n` +
      `Mode: ${calc.modeLabel}\n\n` +
      `SYSTEM DUTY (PRELIMINARY)\n` +
      `Required Flow at Pump: ${calc.flowGpm} GPM\n` +
      `Required Pressure at Pump Discharge: ${calc.pressurePsi} PSI\n\n` +
      `BREAKDOWN (psi)\n` +
      calc.breakdown.map((r) => `- ${r.label}: ${round1(r.psi)} psi`).join("\n") +
      `\n\nPaste into Fire Pump Sizer: System Flow = ${calc.flowGpm} GPM, System Pressure = ${calc.pressurePsi} PSI.\n` +
      `Not a final Hazen-Williams hydraulic calculation.`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("Copied for Fire Pump Sizer");
    } catch (_) {
      toast("Copy failed — select text manually");
    }
  }

  function resetAll() {
    if (!confirm("Reset all inputs to defaults and clear saved form data?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) { /* ignore */ }
    state = defaultState();
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

    document.querySelectorAll('input[name="mode"], input[name="framework"]').forEach((el) => {
      el.addEventListener("change", () => {
        onChange();
        writeForm();
        render();
      });
    });

    // Re-bind loss table after each render of table
    $("lossTableBody")?.addEventListener("input", onChange);
    $("lossTableBody")?.addEventListener("change", onChange);

    $("btnPrint")?.addEventListener("click", () => window.print());
    $("btnCopyPump")?.addEventListener("click", copyForPumpSizer);
    $("btnReset")?.addEventListener("click", resetAll);
  }

  function init() {
    load();
    writeForm();
    bind();
    // loss table events: use delegation on parent
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
    $("appVersion").textContent = "Version " + APP_VERSION;
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
