/**
 * Fire Flow Calculator v1.2.0
 * NFPA 1 sprinkler reduction lives in shared/nfpa1-fire-flow.js.
 */
(function () {
  "use strict";

  var APP_VERSION = "1.2.0";

  function calcHydrants(flow) {
    if (flow <= 1000) return 1;
    if (flow <= 1750) return 2;
    if (flow <= 2250) return 3;
    if (flow <= 2750) return 4;
    if (flow <= 3250) return 5;
    if (flow <= 4000) return 6;
    return Math.ceil(flow / 1000);
  }

  function fmtHours(h) {
    if (!(h > 0)) return "—";
    var n = Math.round(h * 100) / 100;
    return n + " hour" + (n === 1 ? "" : "s");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readInput() {
    return {
      basis: document.getElementById("basis").value,
      edition: document.getElementById("edition").value,
      group: document.getElementById("constType").value,
      area: Number(document.getElementById("area").value) || 0,
      sprinkler: document.getElementById("sprinkler").value,
      quickResponse: document.getElementById("qr").checked,
      special: document.getElementById("special").value,
      tableGpm: Number(document.getElementById("tableGpm").value) || 0,
      tableHours: Number(document.getElementById("tableHours").value) || 0,
      sprinklerDemandGpm: Number(document.getElementById("sprDemandGpm").value) || 0,
      sprinklerDemandMin: Number(document.getElementById("sprDemandMin").value) || 0,
    };
  }

  function computeFromForm() {
    if (!window.Nfpa1FireFlow) return { ok: false, error: "Fire-flow engine did not load." };
    var input = readInput();
    var out = window.Nfpa1FireFlow.requiredFireFlow(input);
    if (!out.ok) return out;
    out.hydrants = calcHydrants(out.supply ? out.supply.supplyGpm : out.gpm);
    out.version = APP_VERSION;
    return out;
  }

  function logoHeader() {
    if (window.FireToolshedLogo && typeof window.FireToolshedLogo.reportHeaderHtml === "function") {
      return window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 48 });
    }
    return "";
  }

  function render(out) {
    var results = document.getElementById("results");
    results.style.display = "block";
    if (!out.ok) {
      results.innerHTML = "<h2>Required Fire Flow</h2><p>" + escapeHtml(out.error || "Could not calculate.") + "</p>";
      return out;
    }
    var supply = out.supply || {};
    var ahj = out.ahjMayModify ? " <span class=\"ahj\">AHJ may modify</span>" : "";
    var supplyBlock = "";
    if ((supply.sprinklerGpm || 0) > 0) {
      supplyBlock =
        "<p><strong>Sprinkler demand:</strong> " + Math.round(supply.sprinklerGpm).toLocaleString() + " gpm × " +
        Math.round(supply.sprinklerMin).toLocaleString() + " min = " + Math.round(supply.sprinklerGal).toLocaleString() + " gal</p>" +
        "<p><strong>Required supply:</strong> <span class=\"big\">" + Math.round(supply.supplyGpm).toLocaleString() + " gpm</span> @ 20 psi" +
        " — the greater of fire flow and sprinkler demand, not the sum (" + Math.round(supply.sumGpm).toLocaleString() + " gpm)." + ahj + "</p>" +
        "<p><strong>Storage volume:</strong> " + Math.round(supply.supplyGal).toLocaleString() +
        " gal — the greater of the two volumes, not the sum (" + Math.round(supply.sumGal).toLocaleString() + " gal).</p>";
    }
    results.innerHTML =
      logoHeader() +
      "<h2>Required Fire Flow</h2>" +
      "<p><strong>Method:</strong> " + escapeHtml(out.method) + "</p>" +
      "<p><strong>Table flow:</strong> " + (out.tableGpm ? Number(out.tableGpm).toLocaleString() + " gpm for " + fmtHours(out.tableHours) : "—") +
      " <span class=\"muted\">(" + escapeHtml(out.tableSource === "user-entry" ? "user entry" : out.tableSource === "ufc-special" ? "UFC facility value" : "toolshed area bands") + ")</span></p>" +
      "<p><strong>Required fire flow:</strong> <span class=\"big\">" + out.gpm.toLocaleString() + " gpm</span> @ " + out.residualPsi + " psi residual" +
      (out.ahjMayModify && !(supply.sprinklerGpm > 0) ? ahj : "") + "</p>" +
      "<p><strong>Duration:</strong> " + fmtHours(out.hours) + " (" + out.gallons.toLocaleString() + " gallons). Fire-flow water volume is Q × t, before tank safety or unusable allowances.</p>" +
      supplyBlock +
      "<p><strong>Hydrant count (planning estimate, not a code table):</strong> " + out.hydrants + "</p>" +
      "<div class=\"notes\"><strong>Notes:</strong><ul>" + out.notes.map(function (n) { return "<li>" + escapeHtml(n) + "</li>"; }).join("") + "</ul></div>" +
      "<p class=\"cite\">" + escapeHtml(out.cite) + " Hydrant count above is this calculator's existing planning estimate, not IFC Table C102.1 and not NFPA 1 §18.5. Version " + APP_VERSION + ". Not stamped engineering advice.</p>";
    return out;
  }

  function calculate() {
    return render(computeFromForm());
  }

  var FIREFLOW_HANDOFF_KEY = "fireToolshed.fireFlowHandoff.v1";

  function captureForWaterPath() {
    var out = calculate();
    var gpm = out && out.supply ? out.supply.supplyGpm : out && out.gpm;
    var minutes = out && out.supply ? out.supply.durationMin : out && Math.round(out.hours * 60);
    var gallons = out && out.supply ? out.supply.supplyGal : out && out.gallons;
    if (!(out && out.ok && gpm > 0)) {
      alert(out && out.error ? out.error : "No valid fire flow to capture.");
      return;
    }
    var payload = {
      source: "fire-flow",
      version: APP_VERSION,
      flowGpm: Math.round(gpm),
      durationMin: Math.round(minutes),
      durationHours: out.hours,
      totalGallons: Math.round(gallons),
      residualPsi: 20,
      hydrantCount: out.hydrants,
      maxPerHydrant: 1250,
      codeBasis: document.getElementById("basis").value,
      edition: out.edition,
      ahjMayModify: !!out.ahjMayModify,
      capturedAt: new Date().toISOString(),
      notes: out.notes || [],
    };
    try {
      localStorage.setItem(FIREFLOW_HANDOFF_KEY, JSON.stringify(payload));
      alert("Fire flow captured for Pump Sizer and Tank Sizer.\n" +
        payload.flowGpm.toLocaleString() + " gpm · " + payload.durationMin + " min · " +
        payload.totalGallons.toLocaleString() + " gal" +
        (out.ahjMayModify ? "\nAHJ may modify." : ""));
      if (window.FireToolshedShell && typeof window.FireToolshedShell.refresh === "function") {
        window.FireToolshedShell.refresh();
      }
    } catch (e) {
      alert("Could not save capture: " + e.message);
    }
  }

  function openHelp() {
    var m = document.getElementById("helpModal");
    if (!m) return;
    m.classList.remove("hidden");
    m.setAttribute("aria-hidden", "false");
  }
  function closeHelp() {
    var m = document.getElementById("helpModal");
    if (!m) return;
    m.classList.add("hidden");
    m.setAttribute("aria-hidden", "true");
  }

  window.calc = calculate;
  window.FireFlowApp = { version: APP_VERSION, computeFromForm: computeFromForm, calcHydrants: calcHydrants };

  document.addEventListener("DOMContentLoaded", function () {
    var ver = document.getElementById("appVersion");
    if (ver) ver.textContent = "v" + APP_VERSION;
    document.getElementById("calcBtn").addEventListener("click", calculate);
    var btn = document.getElementById("btnCapture");
    if (btn) btn.addEventListener("click", captureForWaterPath);
    var help = document.getElementById("btnHelp");
    if (help) help.addEventListener("click", openHelp);
    var helpClose = document.getElementById("helpClose");
    if (helpClose) helpClose.addEventListener("click", closeHelp);
    var backdrop = document.getElementById("helpBackdrop");
    if (backdrop) backdrop.addEventListener("click", closeHelp);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeHelp();
    });
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: function () {
          var host = document.getElementById("reportLogoPrint");
          if (host) host.innerHTML = logoHeader();
        },
      });
    }
    if (window.FireToolshedShell) {
      window.FireToolshedShell.mount({ step: "fireflow", base: ".." });
    }
  });
})();
