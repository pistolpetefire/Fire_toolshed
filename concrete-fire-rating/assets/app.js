/**
 * Concrete Fire Rating Thickness
 * Min. equivalent thickness for 1–4 hr FRR — IBC / ACI 216.1 calculated methods.
 */
(function () {
  "use strict";

  var APP_VERSION = "1.0.0";
  var STORAGE_KEY = "concreteFireRating.v1";
  var IN_TO_MM = 25.4;

  /**
   * Thickness tables (inches) for fire-resistance ratings of 1, 2, 3, 4 hours.
   *
   * Cast-in-place / precast walls & solid slabs:
   *   IBC Table 722.2.1.1 (and ACI/TMS 216.1 Table 2.1 equivalent values)
   *   Same heat-transmission thicknesses are used industry-wide for solid
   *   walls, floors, and roofs (PCA / PCI / SFPE handbook discussion of
   *   ASTM E119 unexposed-face temperature criterion).
   *
   * Concrete masonry (equivalent thickness Te):
   *   IBC / ACI-TMS 216.1 / NCMA TEK fire-resistance tables by aggregate type.
   */
  var ASSEMBLIES = {
    wall_cip: {
      id: "wall_cip",
      label: "Cast-in-place or precast concrete wall (solid / flat)",
      thicknessLabel: "Minimum wall thickness (equivalent = actual for solid flat walls)",
      notes: [
        "For solid walls with flat faces, equivalent thickness Te equals actual thickness.",
        "Applies to plain, reinforced, or prestressed concrete walls (IBC 722.2.1.1).",
        "Ribbed, core, or hollow units require Te calculation — not covered by this simple lookup.",
      ],
      materials: [
        {
          id: "siliceous",
          label: "Normal-weight — siliceous aggregate (quartz, granite, basalt, etc.)",
          densityHint: "Typical NWC ~145 pcf",
          t: { 1: 3.5, 2: 5.0, 3: 6.2, 4: 7.0 },
          sources: [
            "IBC Table 722.2.1.1 — Siliceous",
            "ACI/TMS 216.1 Table 2.1 (single-layer concrete walls/floors/roofs)",
            "PCA / PCI industry fire-resistance thickness tables (ASTM E119 heat transmission)",
          ],
        },
        {
          id: "carbonate",
          label: "Normal-weight — carbonate aggregate (limestone, dolomite)",
          densityHint: "Typical NWC ~145 pcf",
          t: { 1: 3.2, 2: 4.6, 3: 5.7, 4: 6.6 },
          sources: [
            "IBC Table 722.2.1.1 — Carbonate",
            "ACI/TMS 216.1 Table 2.1",
            "PCA / PCI industry tables",
          ],
        },
        {
          id: "sand_lw",
          label: "Sand-lightweight concrete (NW sand + LW coarse aggregate, ≤ ~120 pcf)",
          densityHint: "Sand-lightweight structural concrete",
          t: { 1: 2.7, 2: 3.8, 3: 4.6, 4: 5.4 },
          sources: [
            "IBC Table 722.2.1.1 — Sand-lightweight",
            "ACI/TMS 216.1 Table 2.1",
            "ESCSI / lightweight aggregate industry fire-resistance data",
          ],
        },
        {
          id: "lightweight",
          label: "All-lightweight concrete (LW fine + coarse, ~95–105 pcf class)",
          densityHint: "All-lightweight",
          t: { 1: 2.5, 2: 3.6, 3: 4.4, 4: 5.1 },
          sources: [
            "IBC Table 722.2.1.1 — Lightweight",
            "ACI/TMS 216.1 Table 2.1",
            "ESCSI / SFPE Handbook concrete fire-resistance discussion",
          ],
        },
      ],
    },
    floor_slab: {
      id: "floor_slab",
      label: "Solid concrete floor or roof slab (flat solid)",
      thicknessLabel: "Minimum slab thickness (equivalent = actual for solid flat slabs)",
      notes: [
        "Heat-transmission (unexposed face) criterion governs solid slab thickness tables in IBC/ACI 216.1.",
        "For solid flat slabs, Te = actual thickness. Joists, voids, and metal decks need multi-layer / assembly methods or listings.",
        "Structural capacity, cover to reinforcement, and continuity are separate checks (not only fire thickness).",
      ],
      materials: [
        {
          id: "siliceous",
          label: "Normal-weight — siliceous aggregate",
          densityHint: "NWC siliceous",
          t: { 1: 3.5, 2: 5.0, 3: 6.2, 4: 7.0 },
          sources: [
            "IBC Table 722.2.1.1 / ACI 216.1 Table 2.1 (floors & roofs)",
            "PCI Design Handbook fire-resistance slab thickness by aggregate type",
            "SFPE Handbook — concrete slab heat transmission vs thickness",
          ],
        },
        {
          id: "carbonate",
          label: "Normal-weight — carbonate aggregate",
          densityHint: "NWC carbonate",
          t: { 1: 3.2, 2: 4.6, 3: 5.7, 4: 6.6 },
          sources: [
            "IBC Table 722.2.1.1 / ACI 216.1 Table 2.1",
            "PCI / PCA industry tables",
          ],
        },
        {
          id: "sand_lw",
          label: "Sand-lightweight concrete",
          densityHint: "Sand-lightweight",
          t: { 1: 2.7, 2: 3.8, 3: 4.6, 4: 5.4 },
          sources: [
            "IBC Table 722.2.1.1 / ACI 216.1 Table 2.1",
            "ESCSI lightweight aggregate fire-resistance guidance",
          ],
        },
        {
          id: "lightweight",
          label: "All-lightweight concrete",
          densityHint: "All-lightweight",
          t: { 1: 2.5, 2: 3.6, 3: 4.4, 4: 5.1 },
          sources: [
            "IBC Table 722.2.1.1 / ACI 216.1 Table 2.1",
            "PCI slab fire-endurance curves by aggregate type",
          ],
        },
      ],
    },
    cmu_wall: {
      id: "cmu_wall",
      label: "Concrete masonry wall (CMU) — equivalent thickness Te",
      thicknessLabel: "Minimum equivalent thickness Te of solid material in the wall",
      notes: [
        "Use equivalent thickness Te of the masonry assembly (not overall hollow unit width).",
        "Te is published by the unit manufacturer or calculated per ASTM / NCMA methods (percent solid × specified thickness).",
        "Where combustible members frame into the wall, solid material between member ends and the opposite face must be ≥ ~93% of tabulated Te (IBC/NCMA note).",
        "Finishes (e.g., gypsum) may contribute per IBC/ACI 216.1 multi-layer rules — not applied in this basic lookup.",
      ],
      materials: [
        {
          id: "cmu_gravel",
          label: "CMU — calcareous or siliceous gravel aggregate",
          densityHint: "Normal-weight CMU aggregate",
          t: { 1: 2.8, 2: 4.2, 3: 5.3, 4: 6.2 },
          sources: [
            "IBC calculated masonry fire resistance / ACI-TMS 216.1",
            "NCMA TEK — Fire Resistance Ratings of Concrete Masonry Assemblies",
            "ASTM E119 / UL assembly testing basis",
          ],
        },
        {
          id: "cmu_limestone",
          label: "CMU — limestone, cinders, or unexpanded (air-cooled) slag",
          densityHint: "Limestone / cinder / slag aggregate CMU",
          t: { 1: 2.7, 2: 4.0, 3: 5.0, 4: 5.9 },
          sources: [
            "ACI-TMS 216.1 / NCMA TEK fire-resistance tables",
            "IBC masonry calculated fire resistance",
          ],
        },
        {
          id: "cmu_expanded_clay",
          label: "CMU — expanded clay, shale, or slate",
          densityHint: "Lightweight expanded clay/shale/slate CMU",
          t: { 1: 2.2, 2: 3.6, 3: 4.4, 4: 5.1 },
          sources: [
            "ACI-TMS 216.1 / NCMA TEK (expanded clay, shale or slate)",
            "IBC masonry calculated fire resistance",
          ],
        },
        {
          id: "cmu_pumice",
          label: "CMU — expanded slag or pumice",
          densityHint: "Lightweight expanded slag / pumice CMU",
          t: { 1: 2.1, 2: 3.2, 3: 4.0, 4: 4.7 },
          sources: [
            "ACI-TMS 216.1 / NCMA TEK (expanded slag or pumice)",
            "IBC masonry calculated fire resistance",
          ],
        },
      ],
    },
  };

  // Expanded clay/shale CMU values: commonly 2.1 / 3.2 / 4.0 / 4.7 for 1/2/3/4 hr in NCMA-style tables
  // Expanded slag/pumice: 1.9 / 2.9 / 3.6 / 4.2

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:0.65rem 1rem;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99";
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 2600);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function defaultState() {
    return {
      assemblyType: "wall_cip",
      materialId: "siliceous",
      ratingHr: 2,
      checkThickness: "",
      projectName: "",
    };
  }

  var state = defaultState();

  function getAssembly() {
    return ASSEMBLIES[state.assemblyType] || ASSEMBLIES.wall_cip;
  }

  function getMaterial() {
    var a = getAssembly();
    var m = a.materials.find(function (x) {
      return x.id === state.materialId;
    });
    return m || a.materials[0];
  }

  function requiredTe(hr, material) {
    var h = Number(hr);
    var t = material && material.t ? material.t[h] : null;
    return t != null ? t : NaN;
  }

  function populateAssemblies() {
    var sel = $("assemblyType");
    if (!sel) return;
    sel.innerHTML = Object.keys(ASSEMBLIES)
      .map(function (k) {
        var a = ASSEMBLIES[k];
        return (
          '<option value="' +
          a.id +
          '">' +
          escapeHtml(a.label) +
          "</option>"
        );
      })
      .join("");
    sel.value = state.assemblyType;
  }

  function populateMaterials() {
    var a = getAssembly();
    var sel = $("materialId");
    if (!sel) return;
    var ids = a.materials.map(function (m) {
      return m.id;
    });
    if (ids.indexOf(state.materialId) < 0) state.materialId = a.materials[0].id;
    sel.innerHTML = a.materials
      .map(function (m) {
        return (
          '<option value="' +
          m.id +
          '">' +
          escapeHtml(m.label) +
          "</option>"
        );
      })
      .join("");
    sel.value = state.materialId;
    var hint = $("materialHint");
    var mat = getMaterial();
    if (hint && mat) hint.textContent = mat.densityHint || "";
  }

  function readForm() {
    state.assemblyType = ($("assemblyType") && $("assemblyType").value) || "wall_cip";
    state.materialId = ($("materialId") && $("materialId").value) || "siliceous";
    state.ratingHr = Math.min(
      4,
      Math.max(1, Math.round(Number(($("ratingHr") && $("ratingHr").value) || 2)))
    );
    if ([1, 2, 3, 4].indexOf(state.ratingHr) < 0) state.ratingHr = 2;
    state.checkThickness =
      $("checkThickness") && $("checkThickness").value !== ""
        ? $("checkThickness").value
        : "";
    state.projectName = ($("projectName") && $("projectName").value.trim()) || "";
  }

  function writeForm() {
    if ($("assemblyType")) $("assemblyType").value = state.assemblyType;
    populateMaterials();
    if ($("ratingHr")) $("ratingHr").value = String(state.ratingHr);
    if ($("checkThickness")) $("checkThickness").value = state.checkThickness;
    if ($("projectName")) $("projectName").value = state.projectName;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (d && typeof d === "object") state = Object.assign(defaultState(), d);
    } catch (_) { /* ignore */ }
  }

  function resultModel() {
    readForm();
    var assembly = getAssembly();
    var material = getMaterial();
    var te = requiredTe(state.ratingHr, material);
    var check = parseFloat(state.checkThickness);
    var checkOk = null;
    if (Number.isFinite(check) && check > 0 && Number.isFinite(te)) {
      checkOk = check + 1e-9 >= te;
    }
    return {
      assembly: assembly,
      material: material,
      ratingHr: state.ratingHr,
      teIn: te,
      teMm: Number.isFinite(te) ? round1(te * IN_TO_MM) : NaN,
      check: Number.isFinite(check) && check > 0 ? check : null,
      checkOk: checkOk,
      projectName: state.projectName,
    };
  }

  function render() {
    readForm();
    // If assembly changed, refresh materials
    populateMaterials();
    readForm();
    var r = resultModel();
    var te = r.teIn;

    if ($("metricIn"))
      $("metricIn").textContent = Number.isFinite(te) ? te.toFixed(1) : "—";
    if ($("metricMm"))
      $("metricMm").textContent = Number.isFinite(r.teMm) ? String(r.teMm) : "—";
    if ($("metricRating")) $("metricRating").textContent = String(r.ratingHr);

    var checkEl = $("checkResult");
    if (checkEl) {
      if (r.check == null) {
        checkEl.className = "callout info";
        checkEl.textContent =
          "Enter your proposed thickness to compare against the minimum " +
          (Number.isFinite(te) ? te.toFixed(1) + " in" : "—") +
          ".";
      } else if (r.checkOk) {
        checkEl.className = "callout ok";
        checkEl.innerHTML =
          "<strong>Meets tabulated minimum.</strong> Proposed " +
          r.check.toFixed(1) +
          " in ≥ required " +
          te.toFixed(1) +
          " in equivalent thickness for " +
          r.ratingHr +
          "-hour rating (calculated method).";
      } else {
        checkEl.className = "callout bad";
        checkEl.innerHTML =
          "<strong>Below tabulated minimum.</strong> Proposed " +
          r.check.toFixed(1) +
          " in &lt; required " +
          te.toFixed(1) +
          " in for " +
          r.ratingHr +
          "-hour rating. Increase thickness, change material, or use a listed assembly.";
      }
    }

    var tbody = $("ratingTableBody");
    if (tbody && r.material) {
      tbody.innerHTML = [1, 2, 3, 4]
        .map(function (hr) {
          var t = r.material.t[hr];
          var sel = hr === r.ratingHr ? ' class="is-selected"' : "";
          return (
            "<tr" +
            sel +
            "><td>" +
            hr +
            " hour" +
            (hr > 1 ? "s" : "") +
            '</td><td class="num">' +
            t.toFixed(1) +
            '</td><td class="num">' +
            round1(t * IN_TO_MM) +
            "</td></tr>"
          );
        })
        .join("");
    }

    if ($("sourceLine") && r.material) {
      $("sourceLine").textContent = "Sources: " + r.material.sources.join(" · ");
    }

    if ($("basisBox")) {
      $("basisBox").innerHTML =
        "<strong>" +
        escapeHtml(r.assembly.thicknessLabel) +
        "</strong><br>" +
        escapeHtml(r.material.label) +
        " · " +
        r.ratingHr +
        "-hour fire-resistance rating (ASTM E119 heat-transmission / calculated method).";
    }

    var notes = $("notesList");
    if (notes) {
      var items = (r.assembly.notes || []).concat([
        "Values are for the calculated fire-resistance method. Listed assemblies (UL, Intertek, etc.) may allow different thicknesses.",
        "SFPE Handbook of Fire Protection Engineering addresses heat transfer and concrete behavior in fire; tabulated thicknesses implement code-accepted ASTM E119 criteria via IBC/ACI 216.1.",
        "Always confirm against the edition of IBC, ACI/TMS 216.1, and AHJ adopted for the project.",
      ]);
      notes.innerHTML = items
        .map(function (t) {
          return "<li>" + escapeHtml(t) + "</li>";
        })
        .join("");
    }

    // Print body
    if ($("printBody")) $("printBody").innerHTML = packageHtml(r, false);
    if ($("reportLogoPrint") && window.FireToolshedLogo) {
      $("reportLogoPrint").innerHTML = window.FireToolshedLogo.reportHeaderHtml({
        maxHeight: 52,
      });
    }

    saveState();
  }

  function packageHtml(r, includeLogo) {
    var logo =
      includeLogo && window.FireToolshedLogo
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 })
        : "";
    var rows = [1, 2, 3, 4]
      .map(function (hr) {
        var t = r.material.t[hr];
        return (
          "<tr><td>" +
          hr +
          " h</td><td style='text-align:right'>" +
          t.toFixed(1) +
          " in</td><td style='text-align:right'>" +
          round1(t * IN_TO_MM) +
          " mm</td></tr>"
        );
      })
      .join("");
    var checkLine = "";
    if (r.check != null) {
      checkLine =
        "<p><strong>Proposed thickness check:</strong> " +
        r.check.toFixed(1) +
        " in — " +
        (r.checkOk ? "meets" : "does not meet") +
        " the " +
        r.ratingHr +
        "-hour minimum of " +
        r.teIn.toFixed(1) +
        " in.</p>";
    }
    return (
      logo +
      "<h1>Concrete Fire-Resistance Thickness</h1>" +
      (r.projectName
        ? "<p><strong>Project:</strong> " + escapeHtml(r.projectName) + "</p>"
        : "") +
      "<p><strong>Assembly:</strong> " +
      escapeHtml(r.assembly.label) +
      "<br><strong>Material makeup:</strong> " +
      escapeHtml(r.material.label) +
      "<br><strong>Required rating:</strong> " +
      r.ratingHr +
      " hour(s)<br><strong>Minimum equivalent thickness:</strong> " +
      r.teIn.toFixed(1) +
      " in (" +
      r.teMm +
      " mm)</p>" +
      checkLine +
      "<h2>Thickness table (this material)</h2>" +
      "<table style='width:100%;border-collapse:collapse'>" +
      "<thead><tr><th style='text-align:left;border-bottom:1px solid #e2e8f0;padding:0.35rem'>Rating</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0;padding:0.35rem'>Te (in)</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0;padding:0.35rem'>Te (mm)</th></tr></thead>" +
      "<tbody>" +
      rows +
      "</tbody></table>" +
      "<h2>Sources</h2><ul>" +
      r.material.sources
        .map(function (s) {
          return "<li>" + escapeHtml(s) + "</li>";
        })
        .join("") +
      "</ul>" +
      "<h2>Notes</h2><ul>" +
      r.assembly.notes
        .map(function (s) {
          return "<li>" + escapeHtml(s) + "</li>";
        })
        .join("") +
      "<li>Preliminary calculated method only. Confirm adopted IBC edition, ACI/TMS 216.1, listings, and AHJ.</li>" +
      "</ul>" +
      "<p style='color:#64748b;font-size:0.85rem'>Fire Toolshed · Concrete Fire Rating Thickness v" +
      APP_VERSION +
      " · " +
      escapeHtml(new Date().toLocaleString()) +
      "</p>"
    );
  }

  function printDocumentCss() {
    return (
      "@page{size:letter;margin:0.6in 0.65in}" +
      "body{font-family:system-ui,sans-serif;color:#0f172a;line-height:1.45;margin:0}" +
      "h1{font-size:1.35rem;margin:0 0 0.5rem}h2{font-size:1.05rem;margin:1rem 0 0.4rem}" +
      "table{width:100%;border-collapse:collapse}th,td{padding:0.35rem;border-bottom:1px solid #e2e8f0}" +
      "ul{padding-left:1.2rem}li{margin:0.25rem 0}"
    );
  }

  function printToPdf() {
    render();
    var r = resultModel();
    var printBoot =
      "window.onload=function(){" +
      "var done=false;" +
      "function closeMe(){if(done)return;done=true;try{window.close();}catch(e){}}" +
      "window.addEventListener('afterprint',closeMe);" +
      "setTimeout(function(){" +
      "try{window.focus();window.print();}catch(e){}" +
      "setTimeout(closeMe,50);" +
      "},250);" +
      "};";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Concrete Fire Rating</title><style>" +
      printDocumentCss() +
      "</style></head><body>" +
      packageHtml(r, true) +
      "<script>" +
      printBoot +
      "<\/script></body></html>";
    var w = window.open("", "_blank");
    if (!w) {
      toast("Popup blocked — use browser Print and choose Save as PDF");
      window.print();
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    try {
      w.addEventListener("beforeunload", function () {
        try {
          window.focus();
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
    toast("Print dialog: choose Save as PDF — Cancel closes and returns here");
  }

  function saveReport() {
    render();
    var r = resultModel();
    var name =
      (r.projectName || "concrete-fire-rating").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "concrete-fire-rating";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Concrete Fire Rating</title><style>" +
      printDocumentCss() +
      "</style></head><body>" +
      packageHtml(r, true) +
      "</body></html>";
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "_concrete-fire-rating.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("Saved HTML report");
  }

  function bind() {
    $("assemblyType") &&
      $("assemblyType").addEventListener("change", function () {
        readForm();
        state.materialId = getAssembly().materials[0].id;
        writeForm();
        render();
      });
    ["materialId", "ratingHr", "checkThickness", "projectName"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });
    $("btnPrintPdf") && $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnSave") && $("btnSave").addEventListener("click", saveReport);
    $("btnReset") &&
      $("btnReset").addEventListener("click", function () {
        if (!confirm("Reset form?")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) { /* ignore */ }
        state = defaultState();
        writeForm();
        render();
      });
  }

  function init() {
    loadState();
    populateAssemblies();
    writeForm();
    bind();
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: render,
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
