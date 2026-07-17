/**
 * Flow Test Request — stock NFPA 291 request package (2½″ outlets only)
 */
(function () {
  "use strict";

  var APP_VERSION = "1.0.0";
  var STORAGE_KEY = "flow-test-request:v1";

  var DEFAULT_JURISDICTION =
    "Please advise of any unique requirements of this jurisdiction or installation for the requested hydrant flow test, including but not limited to: required observers or escorts (base fire, CE, water utility); advance notice, work clearances, or traffic control; allowed discharge locations and environmental constraints; residual pressure policy; gauge calibration documentation; ordinary-demand or concurrent-use constraints during the test; permitted hours; PPE; data sheet or report format; and any deviations from the 2½-inch outlet procedure below.";

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.className = "toast-lite";
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:0.65rem 1rem;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.2)";
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

  function sharedProjectName(fallback) {
    var local = String(fallback || "").trim();
    if (window.FireToolshedShell && window.FireToolshedShell.getProjectName) {
      var shared = String(window.FireToolshedShell.getProjectName() || "").trim();
      if (shared) {
        if (local && local !== shared) {
          window.FireToolshedShell.saveProject &&
            window.FireToolshedShell.saveProject({ projectName: local });
          return local;
        }
        return shared;
      }
    }
    if (local && window.FireToolshedShell && window.FireToolshedShell.saveProject) {
      window.FireToolshedShell.saveProject({ projectName: local });
    }
    return local;
  }

  function defaultState() {
    var d = new Date();
    try {
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    } catch (_) { /* ignore */ }
    return {
      testPurpose: "suppressionSupply",
      projectName: "",
      requestedDate: d.toISOString().slice(0, 10),
      buildingOrAddress: "",
      cityStateOrBase: "",
      requestedBy: "",
      contactInfo: "",
      residualHydrant: "",
      flowHydrants: "",
      numOutlets: "2",
      preferredWindow: "",
      hydrantReasons: "",
      jurisdictionAsk: "",
      additionalNotes: "",
    };
  }

  var state = defaultState();

  function purposeMeta(purpose) {
    if (purpose === "fireFlow") {
      return {
        id: "fireFlow",
        label: "Fire flow — hydrant capacity / fire-flow rating",
        short: "Fire flow / hydrant capacity",
        objective:
          "Obtain static and residual pressures and discharge from 2½-inch outlets to estimate available fire flow (hydrant capacity) at the rating residual (commonly 20 psi), consistent with NFPA 291 fire-flow / capacity practice.",
        deliverable:
          "Report static, residual, test flow (gpm), pressure drop, estimated capacity at the rating residual, and hydrant class (AA–C) when requested. Provide gauge calibration dates.",
      };
    }
    return {
      id: "suppressionSupply",
      label: "Suppression purpose — fire protection system water supply",
      short: "Fire suppression system water supply",
      objective:
        "Obtain static and residual pressures and discharge from 2½-inch outlets to establish a water-supply curve (N^1.85) for fire protection system design and evaluation, consistent with NFPA 291 practice for system water supply tests.",
      deliverable:
        "Report static, residual, test flow (gpm), pressure drop, and the N^1.85 supply curve (or equivalent tabulated points). Provide gauge calibration dates. System demand will be applied separately by the design team (Sprinkler Estimator / hydraulic calculation).",
    };
  }

  /**
   * Stock NFPA 291-aligned procedures limited to 2½″ outlets.
   * Citations are guidance references used across this toolshed (4.3–4.7, 4.11).
   */
  function procedureSections(purpose) {
    var meta = purposeMeta(purpose);
    var commonSetup = [
      "Coordinate with the water purveyor / base water shop and fire protection authority having jurisdiction (AHJ) before flowing water.",
      "Limit flowing outlets on this request to 2½-inch hydrant hose outlets only (do not use the pumper outlet under this stock procedure unless the AHJ explicitly redirects the test).",
      "Equipment (typical): residual pressure gauge (often 0–200 psi class), pitot gauge (often 0–50/60 psi), pitot tube / blade, and outlet caps/diffusers as needed for safe discharge.",
      "Verify pressure gauges are calibrated within the last 12 months (or more frequently if heavily used), per NFPA 291 gauge-calibration practice. Record gauge IDs and calibration dates on the data sheet.",
      "Preferred layout: one residual (gauge) hydrant and one or more separate flow hydrants on the same supply, consistent with NFPA 291 multi-hydrant layout guidance (see Fig. 4.3.4 style practice). Identify residual R and flow F1…Fn on a sketch.",
      "Confirm ordinary system demand and any unusual demand conditions on the day of test; note them on the data sheet.",
    ];

    var fieldSteps = [
      "At the residual hydrant: install the residual gauge; bleed air from the hydrant barrel before taking the static reading (NFPA 291 4.5.2–4.5.3 practice).",
      "Record static pressure with no test discharge (all test flow outlets closed).",
      "Open flow hydrants one at a time (4.5.6). Flow long enough to clear debris before taking readings (4.5.7).",
      "With dry-barrel hydrants, ensure the stem is fully open while flowing; with wet-barrel hydrants, ensure the outlet valve is wide open while flowing (4.6.8–4.6.9).",
      "Measure discharge from each open 2½-inch outlet with a pitot. Place the pitot orifice approximately one-half the outlet diameter into the stream and square to the outlet face (4.6.3–4.6.4).",
      "Prefer pitot pressures in the 10–30 psi band when practical (4.6.6); change tip/orifice or number of open 2½-inch outlets if readings are outside a clean range.",
      "Apply the outlet discharge coefficient C from the outlet geometry (smooth & rounded ≈ 0.90, square & sharp ≈ 0.80, projecting ≈ 0.70; flow tube ≈ 0.95 when used) per NFPA 291 Fig. 4.7.1 practice. Compute Q = 29.83 × C × d² × √P for each 2½-inch outlet (d = 2.5 in) and sum total test flow.",
      "Read pitot pressure(s) and residual pressure simultaneously on a common signal (4.5.8). Use portable radios if crews are separated (4.4.3).",
      "Target a residual pressure drop of at least about 25% of static for a reliable theoretical curve (NFPA 291 4.3.6 practice). Open additional 2½-inch outlets (still no pumper under this request) if the drop is insufficient and it is safe/authorized to do so.",
      "Record: static (psi), residual (psi), pitot (psi) per outlet, outlet diameter (2.5 in), C, computed gpm per outlet, total gpm, time, weather, hydrant IDs, main size if known, and operators.",
      "Shut hydrants down slowly, one at a time (4.5.10). Restore caps and leave the system in a ready condition.",
    ];

    var purposeSteps =
      purpose === "fireFlow"
        ? [
            "Primary objective: fire-flow / hydrant capacity. Maintain residual during the flowing test at or above the rating residual when practical (often about 20 psi residual policy); capacity at the rating residual may still be computed by N^1.85 methods if residual during the test differs.",
            "Report estimated available flow at the rating residual and hydrant classification (Class AA / A / B / C) when required by the AHJ or base standard.",
            "Round reported capacity in accordance with the installation’s practice (this toolshed uses nearest 50 gpm below 1,000 gpm and nearest 100 gpm at/above 1,000 gpm unless the AHJ specifies otherwise).",
          ]
        : [
            "Primary objective: fire protection system water supply. Build the supply relationship between residual pressure and flow using the N^1.85 method for design handoff.",
            "Do not require a sprinkler system demand value in the field for this request; the design team will overlay system demand later.",
            "If residual during the test approaches or falls below the installation’s minimum residual policy, stop increasing flow and record the limiting condition.",
          ];

    var dataSheet = [
      "Complete an NFPA 291-style data sheet (4.11 practice): project/location, date/time, purpose, residual and flow hydrant IDs, gauge calibration dates, static/residual/pitot, total flow, layout notes, and signatures of residual and pitot operators / witnesses.",
      "Provide a simple sketch of residual vs flow hydrants relative to the building or system connection when practical.",
      "Return results to the requestor for entry into the Flow Test Report tool (supply curve / capacity package).",
    ];

    return {
      meta: meta,
      commonSetup: commonSetup,
      fieldSteps: fieldSteps,
      purposeSteps: purposeSteps,
      dataSheet: dataSheet,
    };
  }

  function readForm() {
    state.testPurpose =
      $("testPurpose") && $("testPurpose").value === "fireFlow"
        ? "fireFlow"
        : "suppressionSupply";
    state.projectName = ($("projectName") && $("projectName").value.trim()) || "";
    state.requestedDate = ($("requestedDate") && $("requestedDate").value) || "";
    state.buildingOrAddress =
      ($("buildingOrAddress") && $("buildingOrAddress").value.trim()) || "";
    state.cityStateOrBase =
      ($("cityStateOrBase") && $("cityStateOrBase").value.trim()) || "";
    state.requestedBy = ($("requestedBy") && $("requestedBy").value.trim()) || "";
    state.contactInfo = ($("contactInfo") && $("contactInfo").value.trim()) || "";
    state.residualHydrant =
      ($("residualHydrant") && $("residualHydrant").value.trim()) || "";
    state.flowHydrants = ($("flowHydrants") && $("flowHydrants").value.trim()) || "";
    state.numOutlets = ($("numOutlets") && $("numOutlets").value) || "2";
    state.preferredWindow =
      ($("preferredWindow") && $("preferredWindow").value.trim()) || "";
    state.hydrantReasons =
      ($("hydrantReasons") && $("hydrantReasons").value.trim()) || "";
    state.jurisdictionAsk =
      ($("jurisdictionAsk") && $("jurisdictionAsk").value.trim()) || "";
    state.additionalNotes =
      ($("additionalNotes") && $("additionalNotes").value.trim()) || "";
  }

  function writeForm() {
    if ($("testPurpose")) $("testPurpose").value = state.testPurpose;
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("requestedDate")) $("requestedDate").value = state.requestedDate;
    if ($("buildingOrAddress")) $("buildingOrAddress").value = state.buildingOrAddress;
    if ($("cityStateOrBase")) $("cityStateOrBase").value = state.cityStateOrBase;
    if ($("requestedBy")) $("requestedBy").value = state.requestedBy;
    if ($("contactInfo")) $("contactInfo").value = state.contactInfo;
    if ($("residualHydrant")) $("residualHydrant").value = state.residualHydrant;
    if ($("flowHydrants")) $("flowHydrants").value = state.flowHydrants;
    if ($("numOutlets")) $("numOutlets").value = state.numOutlets;
    if ($("preferredWindow")) $("preferredWindow").value = state.preferredWindow;
    if ($("hydrantReasons")) $("hydrantReasons").value = state.hydrantReasons;
    if ($("jurisdictionAsk")) $("jurisdictionAsk").value = state.jurisdictionAsk;
    if ($("additionalNotes")) $("additionalNotes").value = state.additionalNotes;
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

  function listHtml(items) {
    return (
      "<ol>" +
      items
        .map(function (t) {
          return "<li>" + escapeHtml(t) + "</li>";
        })
        .join("") +
      "</ol>"
    );
  }

  function packageModel() {
    readForm();
    var projectName = sharedProjectName(state.projectName);
    if (projectName) state.projectName = projectName;
    var proc = procedureSections(state.testPurpose);
    var jurisdiction =
      state.jurisdictionAsk || DEFAULT_JURISDICTION;
    return {
      projectName: projectName || state.projectName || "—",
      requestedDate: state.requestedDate || "—",
      buildingOrAddress: state.buildingOrAddress || "—",
      cityStateOrBase: state.cityStateOrBase || "—",
      requestedBy: state.requestedBy || "—",
      contactInfo: state.contactInfo || "—",
      residualHydrant: state.residualHydrant || "—",
      flowHydrants: state.flowHydrants || "—",
      numOutlets: state.numOutlets || "2",
      preferredWindow: state.preferredWindow || "—",
      hydrantReasons: state.hydrantReasons || "—",
      jurisdictionAsk: jurisdiction,
      additionalNotes: state.additionalNotes || "",
      purpose: proc.meta,
      commonSetup: proc.commonSetup,
      fieldSteps: proc.fieldSteps,
      purposeSteps: proc.purposeSteps,
      dataSheet: proc.dataSheet,
    };
  }

  function packageHtml(m, opts) {
    opts = opts || {};
    var logo =
      opts.includeLogo && window.FireToolshedLogo
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 })
        : "";
    return (
      logo +
      "<h1>Hydrant Flow Test Request</h1>" +
      '<p class="meta">Fire Toolshed · Flow Test Request v' +
      APP_VERSION +
      " · NFPA 291 guidance · 2½-inch outlets only · Generated " +
      escapeHtml(new Date().toLocaleString()) +
      "</p>" +
      "<h2>1. Purpose</h2>" +
      "<p><strong>" +
      escapeHtml(m.purpose.label) +
      "</strong></p>" +
      "<p>" +
      escapeHtml(m.purpose.objective) +
      "</p>" +
      "<p><strong>Requested deliverable:</strong> " +
      escapeHtml(m.purpose.deliverable) +
      "</p>" +
      "<h2>2. Project / location</h2>" +
      "<p><strong>Project name:</strong> " +
      escapeHtml(m.projectName) +
      "<br><strong>Date of requested test:</strong> " +
      escapeHtml(m.requestedDate) +
      "<br><strong>Address or building number:</strong> " +
      escapeHtml(m.buildingOrAddress) +
      "<br><strong>City, state or military base:</strong> " +
      escapeHtml(m.cityStateOrBase) +
      "<br><strong>Requested by:</strong> " +
      escapeHtml(m.requestedBy) +
      "<br><strong>Contact:</strong> " +
      escapeHtml(m.contactInfo) +
      "<br><strong>Preferred window:</strong> " +
      escapeHtml(m.preferredWindow) +
      "</p>" +
      "<h2>3. Proposed hydrants</h2>" +
      "<p><strong>Residual (gauge) hydrant:</strong> " +
      escapeHtml(m.residualHydrant) +
      "<br><strong>Flow hydrant(s):</strong> " +
      escapeHtml(m.flowHydrants) +
      "<br><strong>Planned 2½″ outlets to flow:</strong> " +
      escapeHtml(m.numOutlets) +
      "</p>" +
      "<p><strong>Reasons for selecting these hydrants:</strong><br>" +
      escapeHtml(m.hydrantReasons).replace(/\n/g, "<br>") +
      "</p>" +
      "<h2>4. Unique jurisdiction / installation requirements</h2>" +
      "<p>" +
      escapeHtml(m.jurisdictionAsk).replace(/\n/g, "<br>") +
      "</p>" +
      (m.additionalNotes
        ? "<p><strong>Additional notes:</strong><br>" +
          escapeHtml(m.additionalNotes).replace(/\n/g, "<br>") +
          "</p>"
        : "") +
      "<h2>5. Stock procedures — 2½-inch outlets only (NFPA 291)</h2>" +
      "<p>Perform the hydrant flow test in general accordance with NFPA 291 recommended practice. " +
      "This request authorizes / requests flowing of <strong>2½-inch outlets only</strong>.</p>" +
      "<h3>5.1 Preparation</h3>" +
      listHtml(m.commonSetup) +
      "<h3>5.2 Field procedure</h3>" +
      listHtml(m.fieldSteps) +
      "<h3>5.3 Purpose-specific emphasis (" +
      escapeHtml(m.purpose.short) +
      ")</h3>" +
      listHtml(m.purposeSteps) +
      "<h3>5.4 Data sheet &amp; return of results</h3>" +
      listHtml(m.dataSheet) +
      "<h2>6. Limitations</h2>" +
      "<ul>" +
      "<li>Guidance package only — follow the adopted edition of NFPA 291, UFC / installation instructions, and AHJ direction if they differ.</li>" +
      "<li>Pumper-outlet testing is outside this stock 2½-inch procedure unless the AHJ redirects the test in writing.</li>" +
      "<li>Not a final hydraulic calculation of the fire protection system.</li>" +
      "</ul>"
    );
  }

  function packagePlainText(m) {
    function block(title, items) {
      return (
        title +
        "\n" +
        items
          .map(function (t, i) {
            return "  " + (i + 1) + ". " + t;
          })
          .join("\n") +
        "\n"
      );
    }
    return (
      "HYDRANT FLOW TEST REQUEST\n" +
      "Fire Toolshed · Flow Test Request v" +
      APP_VERSION +
      " · NFPA 291 · 2½-inch outlets only\n\n" +
      "PURPOSE\n" +
      m.purpose.label +
      "\n" +
      m.purpose.objective +
      "\nDeliverable: " +
      m.purpose.deliverable +
      "\n\n" +
      "PROJECT / LOCATION\n" +
      "Project name: " +
      m.projectName +
      "\nDate of requested test: " +
      m.requestedDate +
      "\nAddress or building number: " +
      m.buildingOrAddress +
      "\nCity, state or military base: " +
      m.cityStateOrBase +
      "\nRequested by: " +
      m.requestedBy +
      "\nContact: " +
      m.contactInfo +
      "\nPreferred window: " +
      m.preferredWindow +
      "\n\n" +
      "HYDRANTS\n" +
      "Residual: " +
      m.residualHydrant +
      "\nFlow: " +
      m.flowHydrants +
      "\nPlanned 2½″ outlets: " +
      m.numOutlets +
      "\nReasons for selecting hydrants:\n" +
      m.hydrantReasons +
      "\n\n" +
      "JURISDICTION / UNIQUE REQUIREMENTS\n" +
      m.jurisdictionAsk +
      "\n" +
      (m.additionalNotes ? "\nAdditional notes:\n" + m.additionalNotes + "\n" : "") +
      "\n" +
      block("PREPARATION (2½″ only)", m.commonSetup) +
      "\n" +
      block("FIELD PROCEDURE", m.fieldSteps) +
      "\n" +
      block("PURPOSE EMPHASIS — " + m.purpose.short, m.purposeSteps) +
      "\n" +
      block("DATA SHEET & RETURN", m.dataSheet)
    );
  }

  function updatePurposeUi() {
    var meta = purposeMeta(state.testPurpose);
    var hint = $("purposeHint");
    var callout = $("purposeCallout");
    if (hint) {
      hint.textContent =
        state.testPurpose === "fireFlow"
          ? "Fire-flow package emphasizes capacity at the rating residual and hydrant class, using 2½″ outlets only."
          : "Suppression package emphasizes the N^1.85 supply curve for system design handoff, using 2½″ outlets only.";
    }
    if (callout) {
      callout.className = "callout info";
      callout.innerHTML =
        "<strong>" +
        escapeHtml(meta.short) +
        ".</strong> " +
        escapeHtml(meta.objective);
    }
  }

  function render() {
    readForm();
    updatePurposeUi();
    var m = packageModel();
    var html = packageHtml(m, { includeLogo: false });
    if ($("livePreview")) $("livePreview").innerHTML = html;
    if ($("printBody")) $("printBody").innerHTML = html;
    if ($("reportLogoPrint") && window.FireToolshedLogo) {
      $("reportLogoPrint").innerHTML = window.FireToolshedLogo.reportHeaderHtml({
        maxHeight: 52,
      });
    }
    saveState();
  }

  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
  }

  function saveHtml() {
    var m = packageModel();
    var name =
      (m.projectName || "flow-test-request").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "flow-test-request";
    var body = packageHtml(m, { includeLogo: true });
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Flow Test Request — " +
      escapeHtml(m.projectName) +
      "</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:24px auto;padding:0 16px;color:#0f172a;line-height:1.45}h1{font-size:1.4rem}h2{font-size:1.05rem;margin-top:1.25rem}h3{font-size:0.95rem;margin-top:0.85rem}.meta{color:#64748b;font-size:0.85rem}ol,ul{padding-left:1.25rem}li{margin:0.3rem 0}</style></head><body>" +
      body +
      "</body></html>";
    downloadFile(name + "_flow-test-request.html", html);
    downloadFile(
      name + "_flow-test-request.json",
      JSON.stringify(
        {
          version: APP_VERSION,
          savedAt: new Date().toISOString(),
          state: state,
          purpose: m.purpose.id,
        },
        null,
        2
      ),
      "application/json"
    );
    toast("Saved HTML request + JSON");
  }

  async function copyText() {
    var m = packageModel();
    var text = packagePlainText(m);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("Request text copied");
    } catch (_) {
      toast("Could not copy — use Save HTML instead");
    }
  }

  function bind() {
    document.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });
    $("btnPrint") &&
      $("btnPrint").addEventListener("click", function () {
        render();
        setTimeout(function () {
          window.print();
        }, 150);
      });
    $("btnSave") && $("btnSave").addEventListener("click", saveHtml);
    $("btnCopy") && $("btnCopy").addEventListener("click", copyText);
    $("btnReset") &&
      $("btnReset").addEventListener("click", function () {
        if (!confirm("Reset this flow test request form?")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) { /* ignore */ }
        state = defaultState();
        if (window.FireToolshedShell && window.FireToolshedShell.getProjectName) {
          var pn = window.FireToolshedShell.getProjectName();
          if (pn) state.projectName = pn;
        }
        writeForm();
        render();
        toast("Reset to defaults");
      });
  }

  function init() {
    if (window.FireToolshedShell) {
      window.FireToolshedShell.mount({ step: "flow", base: ".." });
    }
    loadState();
    if (window.FireToolshedShell && window.FireToolshedShell.getProjectName) {
      var pn = window.FireToolshedShell.getProjectName();
      if (pn && !state.projectName) state.projectName = pn;
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
