/**
 * Flow Test Request — stock NFPA 291 request package (2½″ outlets only)
 */
(function () {
  "use strict";

  var APP_VERSION = "1.0.3";
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
      hydrantReasons: "",
      jurisdictionAsk: "",
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
    state.hydrantReasons =
      ($("hydrantReasons") && $("hydrantReasons").value.trim()) || "";
    state.jurisdictionAsk =
      ($("jurisdictionAsk") && $("jurisdictionAsk").value.trim()) || "";
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
    if ($("hydrantReasons")) $("hydrantReasons").value = state.hydrantReasons;
    if ($("jurisdictionAsk")) $("jurisdictionAsk").value = state.jurisdictionAsk;
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

  function packageModel() {
    readForm();
    var projectName = sharedProjectName(state.projectName);
    if (projectName) state.projectName = projectName;
    var purpose = purposeMeta(state.testPurpose);
    var jurisdiction = state.jurisdictionAsk || DEFAULT_JURISDICTION;
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
      hydrantReasons: state.hydrantReasons || "—",
      jurisdictionAsk: jurisdiction,
      purpose: purpose,
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
      "<h2>1. Purpose</h2>" +
      "<p><strong>" +
      escapeHtml(m.purpose.label) +
      "</strong></p>" +
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
      "</p>"
    );
  }

  function packagePlainText(m) {
    return (
      "HYDRANT FLOW TEST REQUEST\n\n" +
      "1. PURPOSE\n" +
      m.purpose.label +
      "\n\n" +
      "2. PROJECT / LOCATION\n" +
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
      "\n\n" +
      "3. PROPOSED HYDRANTS\n" +
      "Residual: " +
      m.residualHydrant +
      "\nFlow: " +
      m.flowHydrants +
      "\nPlanned 2½″ outlets: " +
      m.numOutlets +
      "\nReasons for selecting hydrants:\n" +
      m.hydrantReasons +
      "\n\n" +
      "4. UNIQUE JURISDICTION / INSTALLATION REQUIREMENTS\n" +
      m.jurisdictionAsk +
      "\n"
    );
  }

  function render() {
    readForm();
    var m = packageModel();
    var html = packageHtml(m, { includeLogo: false });
    if ($("livePreview")) $("livePreview").innerHTML = html;
    if ($("printBody")) $("printBody").innerHTML = html;
    // Logo still on printed/PDF package from shared Toolshed setting (no form UI)
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

  /** Standalone document CSS for print / Save as PDF window */
  function printDocumentCss() {
    return (
      "@page{size:letter;margin:0.6in 0.65in}" +
      "html,body{margin:0;padding:0;background:#fff;color:#0f172a;" +
      "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.45}" +
      "body{padding:0 0.15in}" +
      "h1{font-size:1.35rem;margin:0 0 0.35rem;page-break-after:avoid}" +
      "h2{font-size:1.05rem;margin:0.95rem 0 0.35rem;page-break-after:avoid}" +
      "h3{font-size:0.95rem;margin:0.75rem 0 0.3rem;page-break-after:avoid}" +
      "p{margin:0.35rem 0}" +
      ".meta{color:#64748b;font-size:0.85rem;margin:0 0 0.75rem}" +
      "ol,ul{padding-left:1.25rem;margin:0.35rem 0 0.5rem;page-break-inside:avoid}" +
      "li{margin:0.28rem 0;page-break-inside:avoid}" +
      "img{max-height:52px;max-width:220px;object-fit:contain}" +
      ".report-logo{margin:0 0 0.85rem;padding-bottom:0.65rem;border-bottom:1px solid #e2e8f0;" +
      "display:flex;align-items:center;justify-content:space-between;gap:1rem}" +
      "@media print{body{padding:0}}"
    );
  }

  function buildPrintableHtml(m) {
    var title = "Flow Test Request — " + (m.projectName || "Request");
    var body = packageHtml(m, { includeLogo: true });
    return (
      "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
      "<title>" +
      escapeHtml(title) +
      "</title><style>" +
      printDocumentCss() +
      "</style></head><body>" +
      body +
      "<script>" +
      "window.onload=function(){setTimeout(function(){window.focus();window.print();},250);};" +
      "<\/script></body></html>"
    );
  }

  /**
   * Open a clean document and invoke the browser print dialog.
   * User chooses "Microsoft Print to PDF" / "Save as PDF" as the destination.
   */
  function printToPdf() {
    render();
    var m = packageModel();
    var html = buildPrintableHtml(m);
    var w = window.open("", "_blank");
    if (!w) {
      // Popup blocked — fall back to on-page print
      toast("Popup blocked — using page print. Choose Save as PDF / Microsoft Print to PDF.");
      setTimeout(function () {
        window.print();
      }, 200);
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    toast("Print dialog: choose Save as PDF (or Microsoft Print to PDF)");
  }

  function printPage() {
    render();
    toast("Print dialog: choose Save as PDF / Microsoft Print to PDF if you want a PDF file");
    setTimeout(function () {
      window.print();
    }, 200);
  }

  function saveHtml() {
    var m = packageModel();
    var name =
      (m.projectName || "flow-test-request").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "flow-test-request";
    var html = buildPrintableHtml(m).replace(
      /<script>[\s\S]*?<\/script>/i,
      ""
    );
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
    $("btnPrintPdf") && $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnPrint") && $("btnPrint").addEventListener("click", printPage);
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
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
