/**
 * Fire Tank Sizer — preliminary fire water storage
 * Volume from system/pump flow × duration + framework safety.
 * Prefab steel catalog filtered by max height / max diameter.
 * Plan diagram with tank + concrete pad (pump-sizer style).
 */
(function () {
  "use strict";

  const APP_VERSION = "1.1.0-prelim";
  const STORAGE_KEY = "fireTankSizer.v1";
  const SPRINKLER_HANDOFF_KEY = "fireToolshed.sprinklerHandoff.v1";
  const PUMP_HANDOFF_KEY = "fireToolshed.pumpHandoff.v1";
  const TANK_HANDOFF_KEY = "fireToolshed.tankHandoff.v1";
  const GAL_PER_CUFT = 7.48051945;

  /**
   * Representative US prefab / bolted / corrugated steel fire-protection tank sizes.
   * Dimensions approximate industry-typical product lines (Pioneer-style, bolted ring,
   * welded ground storage). Confirm with manufacturer for project use.
   * diaFt / htFt = shell outside diameter / shell height (ft).
   */
  const PREFAB_CATALOG = buildPrefabCatalog();

  function buildPrefabCatalog() {
    // Common diameters (ft) used by bolted/corrugated steel fire tanks
    const dias = [11, 13.5, 15.5, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48];
    // Typical total heights (ft) — low profile through taller standpipe-style
    const heights = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32];
    const list = [];
    let id = 0;
    dias.forEach((d) => {
      heights.forEach((h) => {
        const gal = Math.round(cylGallons(d, h) / 500) * 500; // nominal round
        if (gal < 4000 || gal > 400000) return;
        // Prefer squat reservoir (d >= h*0.6) or moderate standpipe for fire suction tanks
        const aspect = d / h;
        let style = "bolted-steel";
        if (aspect >= 1.2) style = "bolted-reservoir";
        else if (aspect < 0.75) style = "standpipe-style";
        list.push({
          id: "pf-" + ++id,
          nominalGal: gal,
          diaFt: d,
          htFt: h,
          style: style,
          computedGal: Math.round(cylGallons(d, h)),
        });
      });
    });
    // Sort by nominal capacity then height
    list.sort((a, b) => a.nominalGal - b.nominalGal || a.htFt - b.htFt);
    return list;
  }

  function cylGallons(diaFt, htFt) {
    const r = Math.max(0, diaFt) / 2;
    return Math.PI * r * r * Math.max(0, htFt) * GAL_PER_CUFT;
  }

  /** Framework volume safety (planning defaults — not a full NFPA 22 design) */
  const SAFETY = {
    nfpa: {
      label: "NFPA 13 / 20 / 22 planning",
      pct: 5,
      note: "Base = flow × duration. +5% planning contingency for suction losses / freeboard; confirm NFPA 22 effective capacity and AHJ.",
    },
    ufc: {
      label: "UFC 3-600-01 planning",
      pct: 10,
      note: "Base = flow × duration. +10% UFC-style planning contingency; confirm current UFC edition for duration and redundancy.",
    },
    fm: {
      label: "FM Global planning",
      pct: 15,
      note: "Base = flow × duration. +15% FM-style planning contingency; cite governing FM DS for duration and usable volume.",
    },
  };

  const defaultState = () => ({
    projectName: "",
    facility: "",
    preparedBy: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    framework: "nfpa",
    flowGpm: 1250,
    durationMin: 60,
    safetyPctOverride: null, // null = use framework default
    unusablePct: 5, // freeboard / suction / vortex allowance on tank volume
    maxHeightFt: 24,
    maxDiaFt: 40,
    padBeyondFt: 2,
    padThicknessIn: 12,
    selectedId: "",
    customDiaFt: 0,
    customHtFt: 0,
    useCustom: false,
  });

  let state = defaultState();

  const $ = (id) => document.getElementById(id);

  function num(v, fb) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fb || 0;
  }
  function round0(n) {
    return Math.round(n);
  }
  function round1(n) {
    return Math.round(n * 10) / 10;
  }
  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safetyPct() {
    if (state.safetyPctOverride != null && state.safetyPctOverride !== "") {
      return Math.max(0, num(state.safetyPctOverride, 0));
    }
    return SAFETY[state.framework]?.pct ?? 5;
  }

  function calculateDemand() {
    const flow = Math.max(0, num(state.flowGpm));
    const dur = Math.max(0, num(state.durationMin));
    const baseGal = flow * dur;
    const pct = safetyPct();
    const withSafety = baseGal * (1 + pct / 100);
    const unusable = Math.max(0, num(state.unusablePct, 0));
    // Tank shell capacity must cover usable demand after unusable allowance
    const requiredShellGal =
      unusable >= 100 ? Infinity : withSafety / (1 - unusable / 100);
    return {
      flowGpm: round0(flow),
      durationMin: round0(dur),
      baseGal: round0(baseGal),
      safetyPct: pct,
      safetyGal: round0(withSafety - baseGal),
      withSafetyGal: round0(withSafety),
      unusablePct: unusable,
      requiredShellGal: round0(requiredShellGal),
      frameworkLabel: SAFETY[state.framework]?.label || "Planning",
      safetyNote: SAFETY[state.framework]?.note || "",
    };
  }

  function padForTank(diaFt) {
    const beyond = Math.max(0, num(state.padBeyondFt, 2));
    const thickIn = Math.max(0, num(state.padThicknessIn, 12));
    const padDia = diaFt + 2 * beyond;
    const padSF = Math.PI * Math.pow(padDia / 2, 2);
    const padCuYd = (padSF * (thickIn / 12)) / 27;
    return {
      beyondFt: beyond,
      thicknessIn: thickIn,
      padDiaFt: round1(padDia),
      padSF: round1(padSF),
      padCuYd: round1(padCuYd),
    };
  }

  function filterCatalog(demand) {
    const maxH = num(state.maxHeightFt, 999);
    const maxD = num(state.maxDiaFt, 999);
    const need = demand.requiredShellGal;
    return PREFAB_CATALOG.map((t) => {
      const okH = !(maxH > 0) || t.htFt <= maxH + 1e-9;
      const okD = !(maxD > 0) || t.diaFt <= maxD + 1e-9;
      const okV = t.computedGal + 1e-6 >= need;
      return {
        ...t,
        ok: okH && okD && okV,
        failH: !okH,
        failD: !okD,
        failV: !okV,
        spareGal: t.computedGal - need,
      };
    });
  }

  function selectedTank(demand) {
    if (state.useCustom && num(state.customDiaFt) > 0 && num(state.customHtFt) > 0) {
      const d = num(state.customDiaFt);
      const h = num(state.customHtFt);
      const gal = Math.round(cylGallons(d, h));
      return {
        id: "custom",
        nominalGal: gal,
        computedGal: gal,
        diaFt: d,
        htFt: h,
        style: "custom-steel",
        ok: true,
        custom: true,
      };
    }
    const list = filterCatalog(demand);
    let pick = list.find((t) => t.id === state.selectedId && t.ok);
    if (!pick) pick = list.find((t) => t.ok);
    return pick || null;
  }

  function calculate() {
    const demand = calculateDemand();
    const catalog = filterCatalog(demand);
    const tank = selectedTank(demand);
    const pad = tank ? padForTank(tank.diaFt) : padForTank(0);
    const maxH = num(state.maxHeightFt);
    const maxD = num(state.maxDiaFt);
    let constraintNote = "";
    if (tank) {
      if (maxH > 0 && tank.htFt > maxH) constraintNote += "Exceeds max height. ";
      if (maxD > 0 && tank.diaFt > maxD) constraintNote += "Exceeds max diameter. ";
      if (tank.computedGal < demand.requiredShellGal)
        constraintNote += "Shell capacity below required. ";
    }
    const okCount = catalog.filter((t) => t.ok).length;
    return {
      demand,
      catalog,
      tank,
      pad,
      okCount,
      constraintNote: constraintNote.trim(),
      meetsConstraints:
        !!tank &&
        (!maxH || tank.htFt <= maxH) &&
        (!maxD || tank.diaFt <= maxD) &&
        tank.computedGal >= demand.requiredShellGal,
    };
  }

  /** Plan view: pad + cylindrical tank footprint + dimensions (pump-sizer style) */
  function renderPlanSVG(calc) {
    const tank = calc.tank;
    if (!tank) {
      return (
        '<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg">' +
        '<text x="320" y="160" text-anchor="middle" fill="#64748b" font-size="14">Select a prefab option or enter custom diameter &amp; height.</text>' +
        "</svg>"
      );
    }
    const pad = calc.pad;
    const siteFt = Math.max(pad.padDiaFt, tank.diaFt) + 4; // plot margin
    const padL = 52;
    const padR = 36;
    const padT = 40;
    const padB = 56;
    const scale = Math.min(480 / siteFt, 300 / siteFt, 22);
    const plot = siteFt * scale;
    const vbW = padL + plot + padR;
    const vbH = padT + plot + padB;
    const ox = padL;
    const oy = padT;
    const cx = ox + plot / 2;
    const cy = oy + plot / 2;
    const tankR = (tank.diaFt / 2) * scale;
    const padRpx = (pad.padDiaFt / 2) * scale;

    const parts = [];
    parts.push(
      `<svg viewBox="0 0 ${vbW.toFixed(1)} ${vbH.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fire tank plan view with concrete pad">`
    );
    parts.push("<defs>");
    parts.push(
      '<pattern id="padHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
    );
    parts.push(
      '<line x1="0" y1="0" x2="0" y2="10" stroke="#94a3b8" stroke-width="1.2" opacity="0.5"/>'
    );
    parts.push("</pattern>");
    parts.push("</defs>");

    parts.push(
      `<text x="${ox}" y="18" font-size="12" font-weight="600" fill="#1e293b">PLAN VIEW — STEEL TANK ON CONCRETE PAD</text>`
    );
    // North
    parts.push(`<g transform="translate(${ox + plot - 8}, 10)">`);
    parts.push('<polygon points="0,0 6,14 -6,14" fill="#334155"/>');
    parts.push(
      '<text x="0" y="26" text-anchor="middle" font-size="9" fill="#475569">N</text>'
    );
    parts.push("</g>");

    // Site background
    parts.push(
      `<rect x="${ox}" y="${oy}" width="${plot}" height="${plot}" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="2"/>`
    );

    // Pad
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${padRpx}" fill="url(#padHatch)" stroke="#64748b" stroke-width="2"/>`
    );
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${padRpx}" fill="#cbd5e1" fill-opacity="0.35" stroke="none"/>`
    );
    parts.push(
      `<text x="${cx}" y="${cy - padRpx + 14}" text-anchor="middle" font-size="10" font-weight="600" fill="#475569">CONCRETE PAD ⌀ ${pad.padDiaFt}'</text>`
    );

    // Tank shell (plan = circle)
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${tankR}" fill="#1e3a8a" fill-opacity="0.92" stroke="#172554" stroke-width="2"/>`
    );
    // Inner ring hint
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${Math.max(8, tankR * 0.55)}" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="4 3"/>`
    );
    parts.push(
      `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">STEEL TANK</text>`
    );
    parts.push(
      `<text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="11" fill="#bfdbfe">${round0(tank.computedGal).toLocaleString()} gal</text>`
    );
    parts.push(
      `<text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="10" fill="#93c5fd">⌀ ${tank.diaFt}' · H ${tank.htFt}'</text>`
    );

    // Diameter dimension — tank
    const dimY = cy + padRpx + 18;
    parts.push(
      `<line x1="${cx - tankR}" y1="${dimY}" x2="${cx + tankR}" y2="${dimY}" stroke="#1e40af" stroke-width="1.2"/>`
    );
    parts.push(
      `<line x1="${cx - tankR}" y1="${dimY - 4}" x2="${cx - tankR}" y2="${dimY + 4}" stroke="#1e40af"/>`
    );
    parts.push(
      `<line x1="${cx + tankR}" y1="${dimY - 4}" x2="${cx + tankR}" y2="${dimY + 4}" stroke="#1e40af"/>`
    );
    parts.push(
      `<text x="${cx}" y="${dimY + 14}" text-anchor="middle" font-size="11" font-weight="600" fill="#1e3a8a">Tank ⌀ ${tank.diaFt} ft</text>`
    );

    // Pad diameter dimension
    const dimY2 = oy + plot + 28;
    parts.push(
      `<line x1="${cx - padRpx}" y1="${dimY2}" x2="${cx + padRpx}" y2="${dimY2}" stroke="#334155" stroke-width="1"/>`
    );
    parts.push(
      `<line x1="${cx - padRpx}" y1="${dimY2 - 4}" x2="${cx - padRpx}" y2="${dimY2 + 4}" stroke="#334155"/>`
    );
    parts.push(
      `<line x1="${cx + padRpx}" y1="${dimY2 - 4}" x2="${cx + padRpx}" y2="${dimY2 + 4}" stroke="#334155"/>`
    );
    parts.push(
      `<text x="${cx}" y="${dimY2 + 14}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">Pad ⌀ ${pad.padDiaFt} ft (+${pad.beyondFt}' ea. side)</text>`
    );

    // Height callout (text, since plan view)
    parts.push(
      `<text x="${ox + 6}" y="${oy + plot - 8}" font-size="10" fill="#64748b">Shell height ${tank.htFt} ft · Pad ${pad.thicknessIn}" thick · ${pad.padCuYd} cu yd (approx)</text>`
    );

    parts.push("</svg>");
    return parts.join("");
  }

  function planToImg(svgMarkup) {
    const encoded = encodeURIComponent(svgMarkup)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    return (
      '<img class="room-plan-img" src="data:image/svg+xml;charset=utf-8,' +
      encoded +
      '" alt="Fire tank plan view on concrete pad" ' +
      'style="display:block;width:100%;max-width:720px;height:auto;min-height:260px;margin:0 auto;background:#fff;" />'
    );
  }

  function readForm() {
    state.projectName = $("projectName")?.value.trim() || "";
    state.facility = $("facility")?.value.trim() || "";
    state.preparedBy = $("preparedBy")?.value.trim() || "";
    state.date = $("reportDate")?.value || state.date;
    state.notes = $("projectNotes")?.value.trim() || "";
    state.framework =
      document.querySelector('input[name="framework"]:checked')?.value || "nfpa";
    state.flowGpm = num($("flowGpm")?.value, 0);
    state.durationMin = num($("durationMin")?.value, 0);
    const so = $("safetyPct")?.value;
    state.safetyPctOverride = so === "" || so == null ? null : num(so, 0);
    state.unusablePct = num($("unusablePct")?.value, 5);
    state.maxHeightFt = num($("maxHeightFt")?.value, 0);
    state.maxDiaFt = num($("maxDiaFt")?.value, 0);
    state.padBeyondFt = num($("padBeyondFt")?.value, 2);
    state.padThicknessIn = num($("padThicknessIn")?.value, 12);
    state.useCustom = !!$("useCustom")?.checked;
    state.customDiaFt = num($("customDiaFt")?.value, 0);
    state.customHtFt = num($("customHtFt")?.value, 0);
  }

  function writeForm() {
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("facility")) $("facility").value = state.facility;
    if ($("preparedBy")) $("preparedBy").value = state.preparedBy;
    if ($("reportDate")) $("reportDate").value = state.date;
    if ($("projectNotes")) $("projectNotes").value = state.notes;
    const fw = document.querySelector(
      `input[name="framework"][value="${state.framework}"]`
    );
    if (fw) fw.checked = true;
    if ($("flowGpm")) $("flowGpm").value = state.flowGpm;
    if ($("durationMin")) $("durationMin").value = state.durationMin;
    if ($("safetyPct"))
      $("safetyPct").value =
        state.safetyPctOverride == null ? "" : state.safetyPctOverride;
    if ($("unusablePct")) $("unusablePct").value = state.unusablePct;
    if ($("maxHeightFt")) $("maxHeightFt").value = state.maxHeightFt || "";
    if ($("maxDiaFt")) $("maxDiaFt").value = state.maxDiaFt || "";
    if ($("padBeyondFt")) $("padBeyondFt").value = state.padBeyondFt;
    if ($("padThicknessIn")) $("padThicknessIn").value = state.padThicknessIn;
    if ($("useCustom")) $("useCustom").checked = !!state.useCustom;
    if ($("customDiaFt")) $("customDiaFt").value = state.customDiaFt || "";
    if ($("customHtFt")) $("customHtFt").value = state.customHtFt || "";
    $("customFields")?.classList.toggle("hidden", !state.useCustom);
  }

  function renderCatalog(calc) {
    const tbody = $("catalogBody");
    if (!tbody) return;
    const rows = calc.catalog.filter((t) => {
      // show all that pass height/dia even if volume short? show ok + near misses by volume
      return true;
    });
    // Limit display: prefer options that pass constraints, then first 40 of sorted
    const ok = rows.filter((t) => t.ok);
    const bad = rows.filter((t) => !t.ok);
    const show = ok.concat(bad).slice(0, 48);
    tbody.innerHTML = show
      .map((t) => {
        const cls =
          (t.id === state.selectedId ||
          (calc.tank && calc.tank.id === t.id && !state.useCustom)
            ? "selected "
            : "") + (t.ok ? "pick" : "fail");
        const note = t.ok
          ? "+" + round0(t.spareGal).toLocaleString() + " gal spare"
          : [
              t.failV ? "volume" : "",
              t.failH ? "height" : "",
              t.failD ? "diameter" : "",
            ]
              .filter(Boolean)
              .join(", ");
        return (
          `<tr class="${cls}" data-tank-id="${t.id}">` +
          `<td>${round0(t.nominalGal).toLocaleString()}</td>` +
          `<td class="num">${t.diaFt}</td>` +
          `<td class="num">${t.htFt}</td>` +
          `<td class="num">${round0(t.computedGal).toLocaleString()}</td>` +
          `<td>${escapeHtml(t.style)}</td>` +
          `<td>${escapeHtml(note)}</td>` +
          `</tr>`
        );
      })
      .join("");

    tbody.querySelectorAll("tr.pick").forEach((tr) => {
      tr.addEventListener("click", () => {
        state.selectedId = tr.getAttribute("data-tank-id");
        state.useCustom = false;
        writeForm();
        render();
      });
    });
  }

  function render() {
    const calc = calculate();
    const d = calc.demand;

    if ($("metricBase")) $("metricBase").textContent = d.baseGal.toLocaleString();
    if ($("metricRequired"))
      $("metricRequired").textContent = d.requiredShellGal.toLocaleString();
    if ($("metricTank"))
      $("metricTank").textContent = calc.tank
        ? round0(calc.tank.computedGal).toLocaleString()
        : "—";
    if ($("metricPad"))
      $("metricPad").textContent = calc.tank ? calc.pad.padDiaFt + "'" : "—";

    if ($("resultBase"))
      $("resultBase").textContent = `${d.flowGpm} gpm × ${d.durationMin} min = ${d.baseGal.toLocaleString()} gal`;
    if ($("resultSafety"))
      $("resultSafety").textContent = `+${d.safetyPct}% (${d.safetyGal.toLocaleString()} gal) → ${d.withSafetyGal.toLocaleString()} gal usable target`;
    if ($("resultUnusable"))
      $("resultUnusable").textContent = `${d.unusablePct}% unusable allowance → shell ≥ ${d.requiredShellGal.toLocaleString()} gal`;
    if ($("resultFramework")) $("resultFramework").textContent = d.frameworkLabel;
    if ($("resultNote")) $("resultNote").textContent = d.safetyNote;

    const callout = $("selectCallout");
    if (callout) {
      if (!calc.tank) {
        callout.className = "callout warn";
        callout.textContent =
          "No prefab option meets volume + max height/diameter. Loosen constraints or use custom dimensions.";
      } else if (!calc.meetsConstraints) {
        callout.className = "callout warn";
        callout.textContent = calc.constraintNote || "Selection fails a site constraint.";
      } else {
        callout.className = "callout ok";
        callout.textContent =
          `Selected: ⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}' H · ${round0(calc.tank.computedGal).toLocaleString()} gal shell · pad ⌀ ${calc.pad.padDiaFt}' (${calc.pad.padCuYd} cu yd @ ${calc.pad.thicknessIn}")`;
      }
    }

    if ($("exportSummary") && calc.tank) {
      $("exportSummary").innerHTML =
        `<div><strong>${round0(calc.tank.computedGal).toLocaleString()} gal</strong> shell · ⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}' H</div>` +
        `<div style="margin-top:0.35rem"><strong>Pad ⌀ ${calc.pad.padDiaFt}'</strong> · ${calc.pad.beyondFt}' beyond shell · ${calc.pad.thicknessIn}" thick</div>` +
        `<div style="margin-top:0.35rem;color:var(--muted)">Required shell ≥ ${d.requiredShellGal.toLocaleString()} gal from ${d.flowGpm} gpm × ${d.durationMin} min + safety</div>`;
    } else if ($("exportSummary")) {
      $("exportSummary").textContent = "—";
    }

    renderCatalog(calc);

    const svg = renderPlanSVG(calc);
    const host = $("planHost");
    if (host) host.innerHTML = planToImg(svg);
    const printHost = $("printPlanHost");
    if (printHost) printHost.innerHTML = planToImg(svg);

    // Print fields
    const set = (id, v) => {
      if ($(id)) $(id).textContent = v;
    };
    set("printProject", state.projectName || "—");
    set("printFacility", state.facility || "—");
    set("printBy", state.preparedBy || "—");
    set("printDate", state.date || "—");
    set(
      "printDemand",
      `${d.flowGpm} GPM × ${d.durationMin} min = ${d.baseGal.toLocaleString()} gal base`
    );
    set(
      "printRequired",
      `${d.requiredShellGal.toLocaleString()} gal shell (safety ${d.safetyPct}% + unusable ${d.unusablePct}%)`
    );
    set(
      "printTank",
      calc.tank
        ? `⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}' H · ${round0(calc.tank.computedGal).toLocaleString()} gal (${calc.tank.style})`
        : "—"
    );
    set(
      "printPad",
      calc.tank
        ? `⌀ ${calc.pad.padDiaFt}' · ${calc.pad.beyondFt}' beyond · ${calc.pad.thicknessIn}" · ~${calc.pad.padCuYd} cu yd`
        : "—"
    );
    set(
      "printConstraints",
      `Max H ${state.maxHeightFt || "—"} ft · Max ⌀ ${state.maxDiaFt || "—"} ft · ${d.frameworkLabel}`
    );
    set("printNotes", state.notes || "—");
    set("printVersion", APP_VERSION);
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
    } catch (_) { /* ignore */ }
  }

  function importSprinklerHandoff(silent) {
    try {
      const raw = localStorage.getItem(SPRINKLER_HANDOFF_KEY);
      if (!raw) {
        if (!silent) toast("No sprinkler capture found — open Sprinkler Estimator and Capture for Pump Sizer first");
        return false;
      }
      const d = JSON.parse(raw);
      if (!(num(d.flowGpm) > 0)) {
        if (!silent) toast("Sprinkler handoff missing flow");
        return false;
      }
      state.flowGpm = num(d.flowGpm);
      if (num(d.durationMin) > 0) state.durationMin = num(d.durationMin);
      if (d.projectName && !state.projectName) state.projectName = d.projectName;
      if (d.facility && !state.facility) state.facility = d.facility;
      // Map framework labels loosely
      const fl = String(d.frameworkLabel || d.framework || "").toLowerCase();
      if (fl.includes("ufc")) state.framework = "ufc";
      else if (fl.includes("fm")) state.framework = "fm";
      else state.framework = "nfpa";
      if (!silent)
        toast(
          `Imported ${state.flowGpm} GPM × ${state.durationMin} min from Sprinkler Estimator`
        );
      return true;
    } catch (_) {
      if (!silent) toast("Could not read sprinkler handoff");
      return false;
    }
  }

  /** Prefer pump sizer capture (flow × duration) when available. */
  function importPumpHandoff(silent) {
    try {
      const raw = localStorage.getItem(PUMP_HANDOFF_KEY);
      if (!raw) {
        if (!silent)
          toast("No pump capture found — open Fire Pump Sizer and click Capture for Tank");
        return false;
      }
      const d = JSON.parse(raw);
      if (!(num(d.flowGpm) > 0)) {
        if (!silent) toast("Pump handoff missing flow");
        return false;
      }
      state.flowGpm = num(d.flowGpm);
      if (num(d.durationMin) > 0) state.durationMin = num(d.durationMin);
      if (d.projectName && !state.projectName) state.projectName = d.projectName;
      if (!silent)
        toast(
          `Imported ${state.flowGpm} GPM × ${state.durationMin} min from Fire Pump Sizer` +
            (d.supplyStatus ? ` · supply ${d.supplyStatus}` : "")
        );
      return true;
    } catch (_) {
      if (!silent) toast("Could not read pump handoff");
      return false;
    }
  }

  /** Import best available upstream handoff: pump first, then sprinkler. */
  function importUpstreamDemand(silent) {
    if (importPumpHandoff(true)) {
      if (!silent) {
        // re-toast with preference message
        try {
          const d = JSON.parse(localStorage.getItem(PUMP_HANDOFF_KEY) || "{}");
          toast(
            `Imported ${state.flowGpm} GPM × ${state.durationMin} min from Fire Pump Sizer (preferred)`
          );
        } catch (_) {
          toast(`Imported ${state.flowGpm} GPM × ${state.durationMin} min from Fire Pump Sizer`);
        }
      }
      return true;
    }
    return importSprinklerHandoff(silent);
  }

  function updateHandoffBanner() {
    const el = $("handoffBanner");
    if (!el) return;
    let pump = null;
    let spr = null;
    try {
      const pr = localStorage.getItem(PUMP_HANDOFF_KEY);
      if (pr) pump = JSON.parse(pr);
    } catch (_) { /* ignore */ }
    try {
      const sr = localStorage.getItem(SPRINKLER_HANDOFF_KEY);
      if (sr) spr = JSON.parse(sr);
    } catch (_) { /* ignore */ }
    if (pump && num(pump.flowGpm) > 0) {
      el.classList.remove("hidden");
      el.className = "callout info";
      el.textContent =
        `Pump capture ready: ${Math.round(num(pump.flowGpm))} GPM × ${Math.round(num(pump.durationMin) || 0)} min` +
        (pump.capturedAt ? ` · ${new Date(pump.capturedAt).toLocaleString()}` : "") +
        " — use Import Pump Demand.";
      return;
    }
    if (spr && num(spr.flowGpm) > 0) {
      el.classList.remove("hidden");
      el.className = "callout info";
      el.textContent =
        `Sprinkler capture ready: ${Math.round(num(spr.flowGpm))} GPM × ${Math.round(num(spr.durationMin) || 0)} min` +
        (spr.capturedAt ? ` · ${new Date(spr.capturedAt).toLocaleString()}` : "") +
        " — use Import Sprinkler Demand.";
      return;
    }
    el.classList.add("hidden");
    el.textContent = "";
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

  function captureTankResult() {
    const calc = calculate();
    if (!calc.tank) {
      toast("Select a tank option first");
      return;
    }
    const projectName = sharedProjectName(state.projectName);
    if (projectName) state.projectName = projectName;
    const payload = {
      source: "fire-tank-sizer",
      version: APP_VERSION,
      capturedAt: new Date().toISOString(),
      projectName: projectName || state.projectName,
      facility: state.facility,
      flowGpm: calc.demand.flowGpm,
      durationMin: calc.demand.durationMin,
      baseGal: calc.demand.baseGal,
      requiredShellGal: calc.demand.requiredShellGal,
      safetyPct: calc.demand.safetyPct,
      tank: {
        id: calc.tank.id,
        gal: calc.tank.computedGal,
        diaFt: calc.tank.diaFt,
        htFt: calc.tank.htFt,
        style: calc.tank.style,
      },
      pad: calc.pad,
      framework: state.framework,
      maxHeightFt: state.maxHeightFt,
      maxDiaFt: state.maxDiaFt,
    };
    try {
      localStorage.setItem(TANK_HANDOFF_KEY, JSON.stringify(payload));
      toast(
        `Saved tank: ${round0(calc.tank.computedGal).toLocaleString()} gal · ⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}'`
      );
    } catch (_) {
      toast("Could not save tank handoff");
    }
  }

  function onChange() {
    readForm();
    // When framework changes, clear override display default
    render();
  }

  function openHelp() {
    const m = $("helpModal");
    if (!m) return;
    m.classList.remove("hidden");
    m.setAttribute("aria-hidden", "false");
  }
  function closeHelp() {
    const m = $("helpModal");
    if (!m) return;
    m.classList.add("hidden");
    m.setAttribute("aria-hidden", "true");
  }

  function openCleanReport() {
    render();
    const panel = $("cleanReportPanel");
    const body = $("cleanReportBody");
    const calc = calculate();
    const d = calc.demand;
    if (body) {
      const logoHtml =
        window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml
          ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 48 })
          : "";
      body.innerHTML =
        logoHtml +
        `<div class="export-box">` +
        `<div><strong>${d.flowGpm} GPM</strong> × <strong>${d.durationMin} min</strong> = ${d.baseGal.toLocaleString()} gal base</div>` +
        `<div style="margin-top:0.35rem">Safety ${d.safetyPct}% + unusable ${d.unusablePct}% → shell ≥ <strong>${d.requiredShellGal.toLocaleString()} gal</strong></div>` +
        (calc.tank
          ? `<div style="margin-top:0.5rem">Tank: ⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}' H · <strong>${round0(calc.tank.computedGal).toLocaleString()} gal</strong></div>` +
            `<div>Pad: ⌀ ${calc.pad.padDiaFt}' · ${calc.pad.beyondFt}' beyond · ${calc.pad.thicknessIn}" · ~${calc.pad.padCuYd} cu yd</div>`
          : `<div style="margin-top:0.5rem">No tank selected.</div>`) +
        `<div class="hint" style="margin-top:0.5rem">${escapeHtml(d.frameworkLabel)} · Max H ${state.maxHeightFt || "—"} ft · Max ⌀ ${state.maxDiaFt || "—"} ft</div>` +
        `</div>` +
        `<div class="plan-frame" style="margin-top:0.75rem">${planToImg(renderPlanSVG(calc))}</div>`;
    }
    if (panel) {
      panel.classList.remove("hidden");
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => window.print(), 250);
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
    const d = calc.demand;
    const name =
      (state.projectName || "fire-tank").replace(/[^\w\-]+/g, "_").slice(0, 40) || "fire-tank";
    const tankLine = calc.tank
      ? `⌀ ${calc.tank.diaFt}' × ${calc.tank.htFt}' H · ${round0(calc.tank.computedGal).toLocaleString()} gal (${calc.tank.style})`
      : "No tank selected";
    const padLine = calc.tank
      ? `⌀ ${calc.pad.padDiaFt}' · ${calc.pad.beyondFt}' beyond · ${calc.pad.thicknessIn}" · ~${calc.pad.padCuYd} cu yd`
      : "—";
    const logoHtml =
      window.FireToolshedLogo && window.FireToolshedLogo.reportHeaderHtml
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 56 })
        : "";
    const html =
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Fire Tank Report — ${escapeHtml(state.projectName || "Report")}</title>` +
      `<style>body{font-family:system-ui,sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#0f172a;line-height:1.45}h1{font-size:1.35rem}h2{font-size:1.05rem;margin-top:1.2rem}.muted{color:#64748b;font-size:0.85rem}.box{border:1px solid #e2e8f0;border-radius:12px;padding:0.85rem;margin:0.75rem 0}img{max-width:100%;height:auto;border:1px solid #e2e8f0;border-radius:12px}</style></head><body>` +
      logoHtml +
      `<h1>Fire Water Tank — Preliminary Sizing Report</h1>` +
      `<p class="muted">Fire Toolshed · Fire Tank Sizer v${APP_VERSION} · ${new Date().toLocaleString()}</p>` +
      `<p><b>Project:</b> ${escapeHtml(state.projectName || "—")} · <b>Site:</b> ${escapeHtml(state.facility || "—")}<br>` +
      `<b>Prepared by:</b> ${escapeHtml(state.preparedBy || "—")} · <b>Date:</b> ${escapeHtml(state.date || "—")}</p>` +
      `<div class="box"><b>Demand:</b> ${d.flowGpm} GPM × ${d.durationMin} min = ${d.baseGal.toLocaleString()} gal base<br>` +
      `<b>Safety:</b> ${d.safetyPct}% (${escapeHtml(d.frameworkLabel)}) · Unusable ${d.unusablePct}% → shell ≥ ${d.requiredShellGal.toLocaleString()} gal<br>` +
      `<b>Constraints:</b> Max H ${state.maxHeightFt || "—"} ft · Max ⌀ ${state.maxDiaFt || "—"} ft</div>` +
      `<div class="box"><b>Selected tank:</b> ${escapeHtml(tankLine)}<br><b>Concrete pad:</b> ${escapeHtml(padLine)}</div>` +
      `<h2>Plan diagram</h2>${planToImg(renderPlanSVG(calc))}` +
      `<p><b>Notes:</b> ${escapeHtml(state.notes || "—")}</p>` +
      `<p class="muted">Preliminary only. Construction, foundation, anchorage, and effective capacity per NFPA 22 / manufacturer / SE / AHJ.</p>` +
      `</body></html>`;
    downloadFile(name + "_tank-report.html", html);
    downloadFile(
      name + "_tank-data.json",
      JSON.stringify(
        {
          version: APP_VERSION,
          savedAt: new Date().toISOString(),
          state: state,
          calc: {
            demand: calc.demand,
            tank: calc.tank,
            pad: calc.pad,
            meetsConstraints: calc.meetsConstraints,
          },
        },
        null,
        2
      ),
      "application/json"
    );
    toast("Saved HTML report + JSON data files");
  }

  function bind() {
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    });
    $("useCustom")?.addEventListener("change", () => {
      readForm();
      writeForm();
      render();
    });
    $("btnImport")?.addEventListener("click", () => {
      if (importUpstreamDemand(false)) {
        writeForm();
        render();
        updateHandoffBanner();
      }
    });
    $("btnImportPump")?.addEventListener("click", () => {
      if (importPumpHandoff(false)) {
        writeForm();
        render();
        updateHandoffBanner();
      }
    });
    $("btnImportSprinkler")?.addEventListener("click", () => {
      if (importSprinklerHandoff(false)) {
        writeForm();
        render();
        updateHandoffBanner();
      }
    });
    $("btnCapture")?.addEventListener("click", captureTankResult);
    $("btnReport")?.addEventListener("click", openCleanReport);
    $("btnSaveReport")?.addEventListener("click", saveReportFiles);
    $("btnPrint")?.addEventListener("click", () => {
      render();
      window.print();
    });
    $("btnHelp")?.addEventListener("click", openHelp);
    $("helpClose")?.addEventListener("click", closeHelp);
    $("helpBackdrop")?.addEventListener("click", closeHelp);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeHelp();
    });
    $("btnReset")?.addEventListener("click", () => {
      if (!confirm("Reset tank sizer to defaults?")) return;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) { /* ignore */ }
      state = defaultState();
      writeForm();
      render();
      toast("Reset to defaults");
    });
  }

  function init() {
    if (window.FireToolshedShell) {
      window.FireToolshedShell.mount({ step: "tank", base: ".." });
    }
    load();
    // Soft import if still on stock defaults
    if (state.flowGpm === 1250 && state.durationMin === 60) {
      if (!importPumpHandoff(true)) importSprinklerHandoff(true);
    }
    writeForm();
    bind();
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
    updateHandoffBanner();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
