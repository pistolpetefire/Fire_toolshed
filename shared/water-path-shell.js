/**
 * Fire Toolshed — light water-path shell
 * Shared chrome for synergy; each tool remains a standalone page.
 *
 * Usage:
 *   FireToolshedShell.mount({ step: 'flow'|'sprinkler'|'pump'|'tank'|'hub', base: '..' });
 *   // base = relative path from current page to repo root
 */
(function (global) {
  "use strict";

  var KEYS = {
    flow: "fireToolshed.flowTestHandoff.v1",
    sprinkler: "fireToolshed.sprinklerHandoff.v1",
    pump: "fireToolshed.pumpHandoff.v1",
    tank: "fireToolshed.tankHandoff.v1",
    project: "fireToolshed.project.v1",
  };

  /** Values that should not seed the shared project name */
  var STOCK_PROJECT_NAMES = {
    "DoD Facility - System Hydraulic Results": true,
    "DoD Aircraft Maintenance Hangar - Rev 3": true,
  };

  var STEPS = [
    {
      id: "flow",
      n: 1,
      short: "Flow Test",
      title: "Flow Test Report",
      path: "flow-test-report/",
      blurb: "Hydrant static / residual / pitot · N^1.85 curve · Class AA–C",
    },
    {
      id: "sprinkler",
      n: 2,
      short: "Sprinkler",
      title: "Sprinkler System Estimator",
      path: "sprinkler-system-estimator/",
      blurb: "Demand, pressure stack, duration · supply vs demand",
    },
    {
      id: "pump",
      n: 3,
      short: "Pump",
      title: "Fire Pump Sizer",
      path: "fire-pump-sizer/",
      blurb: "Import duty · NFPA 20 / UFC pump, driver, room",
    },
    {
      id: "tank",
      n: 4,
      short: "Tank",
      title: "Fire Tank Sizer",
      path: "fire-tank-sizer/",
      blurb: "Flow × duration + safety · prefab catalog · pad plan",
    },
  ];

  function joinBase(base, rel) {
    base = (base || ".").replace(/\/+$/, "");
    rel = String(rel || "").replace(/^\/+/, "");
    if (!base || base === ".") return rel || "./";
    return base + "/" + rel;
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var d = JSON.parse(raw);
      return d && typeof d === "object" ? d : null;
    } catch (_) {
      return null;
    }
  }

  function isStockProjectName(name) {
    var n = String(name || "").trim();
    if (!n) return true;
    return !!STOCK_PROJECT_NAMES[n];
  }

  function loadProject() {
    var d = readJson(KEYS.project);
    if (!d) {
      return { projectName: "", facility: "", updatedAt: "" };
    }
    return {
      projectName: typeof d.projectName === "string" ? d.projectName : "",
      facility: typeof d.facility === "string" ? d.facility : "",
      updatedAt: d.updatedAt || "",
    };
  }

  function saveProject( partial ) {
    var cur = loadProject();
    var next = {
      projectName:
        partial && partial.projectName != null
          ? String(partial.projectName).trim()
          : cur.projectName,
      facility:
        partial && partial.facility != null
          ? String(partial.facility).trim()
          : cur.facility,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEYS.project, JSON.stringify(next));
    } catch (_) { /* ignore */ }
    try {
      // Notify other listeners in this tab
      if (typeof CustomEvent === "function") {
        window.dispatchEvent(
          new CustomEvent("fireToolshed:project", { detail: next })
        );
      }
    } catch (_) { /* ignore */ }
    return next;
  }

  function getProjectName() {
    return loadProject().projectName || "";
  }

  /** Prefer shared project; else first non-stock handoff projectName */
  function resolveProjectName() {
    var shared = loadProject().projectName;
    if (shared && !isStockProjectName(shared)) return shared;
    if (shared) return shared;

    var sources = [
      readJson(KEYS.flow),
      readJson(KEYS.sprinkler),
      readJson(KEYS.pump),
      readJson(KEYS.tank),
    ];
    for (var i = 0; i < sources.length; i++) {
      var d = sources[i];
      if (d && d.projectName && !isStockProjectName(d.projectName)) {
        return String(d.projectName).trim();
      }
    }
    return shared || "";
  }

  /**
   * Push shared project name into app form fields.
   * @param {string|string[]} fieldIds default ['projectName']
   * @param {{ force?: boolean }} opts force overwrite even if field has different value
   */
  function applyProjectToFields(fieldIds, opts) {
    opts = opts || {};
    var name = resolveProjectName();
    if (!name && !opts.force) return name;
    var ids = Array.isArray(fieldIds)
      ? fieldIds
      : fieldIds
        ? [fieldIds]
        : ["projectName"];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var cur = String(el.value || "").trim();
      if (opts.force || !cur || isStockProjectName(cur) || cur !== name) {
        if (name) el.value = name;
        // Let app listeners pick up the change
        try {
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        } catch (_) { /* ignore */ }
      }
    });
    return name;
  }

  /**
   * Wire app project fields to shared store (two-way).
   * @param {string|string[]} fieldIds
   */
  function bindAppProjectFields(fieldIds) {
    var ids = Array.isArray(fieldIds)
      ? fieldIds
      : fieldIds
        ? [fieldIds]
        : ["projectName"];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el.dataset.wpsProjectBound === "1") return;
      el.dataset.wpsProjectBound = "1";
      var push = function () {
        var v = String(el.value || "").trim();
        if (isStockProjectName(v) && !loadProject().projectName) return;
        if (v !== loadProject().projectName) {
          saveProject({ projectName: v });
          var shellInput = document.getElementById("wpsProjectName");
          if (shellInput && document.activeElement !== shellInput) {
            shellInput.value = v;
          }
        }
      };
      el.addEventListener("input", push);
      el.addEventListener("change", push);
    });
  }

  function seedProjectFromContext() {
    var cur = loadProject();
    if (cur.projectName) return cur;

    // App field
    var appEl = document.getElementById("projectName");
    if (appEl) {
      var av = String(appEl.value || "").trim();
      if (av && !isStockProjectName(av)) {
        return saveProject({ projectName: av });
      }
    }

    var fromHandoff = resolveProjectName();
    if (fromHandoff) {
      return saveProject({ projectName: fromHandoff });
    }
    return cur;
  }

  function fmtWhen(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString();
    } catch (_) {
      return "";
    }
  }

  function flowSummary(d) {
    if (!d) return null;
    var st = d.staticPressure != null ? d.staticPressure : d.staticPsi;
    var res = d.residualPressure != null ? d.residualPressure : d.residualPsi;
    var q = d.flowAtResidual != null ? d.flowAtResidual : d.flowGpm;
    if (!(Number(st) > 0) || !(Number(res) > 0) || !(Number(q) > 0)) return null;
    return {
      ready: true,
      detail: Math.round(Number(st)) + "/" + Math.round(Number(res)) + " psi @ " + Math.round(Number(q)) + " gpm",
      when: fmtWhen(d.capturedAt),
    };
  }

  function sprinklerSummary(d) {
    if (!d || !(Number(d.flowGpm) > 0)) return null;
    var bit =
      Math.round(Number(d.flowGpm)) +
      " gpm @ " +
      (Number(d.pressurePsi) || 0).toFixed(0) +
      " psi";
    if (d.durationMin) bit += " · " + Math.round(Number(d.durationMin)) + " min";
    if (d.supplyAssessment && d.supplyAssessment.status) bit += " · " + d.supplyAssessment.status;
    return { ready: true, detail: bit, when: fmtWhen(d.capturedAt) };
  }

  function pumpSummary(d) {
    if (!d || !(Number(d.flowGpm) > 0)) return null;
    var bit = Math.round(Number(d.flowGpm)) + " gpm × " + Math.round(Number(d.durationMin) || 0) + " min";
    if (d.supplyStatus) bit += " · " + d.supplyStatus;
    return { ready: true, detail: bit, when: fmtWhen(d.capturedAt) };
  }

  function tankSummary(d) {
    if (!d) return null;
    var gal = d.tank && d.tank.gal != null ? d.tank.gal : d.requiredShellGal;
    if (!(Number(gal) > 0) && !(Number(d.flowGpm) > 0)) return null;
    var bit =
      Number(gal) > 0
        ? Math.round(Number(gal)).toLocaleString() + " gal tank"
        : Math.round(Number(d.flowGpm)) + " gpm demand";
    return { ready: true, detail: bit, when: fmtWhen(d.capturedAt) };
  }

  function handoffState() {
    return {
      flow: flowSummary(readJson(KEYS.flow)),
      sprinkler: sprinklerSummary(readJson(KEYS.sprinkler)),
      pump: pumpSummary(readJson(KEYS.pump)),
      tank: tankSummary(readJson(KEYS.tank)),
    };
  }

  function stepIndex(id) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i;
    return -1;
  }

  function nextStep(currentId) {
    var i = stepIndex(currentId);
    if (i < 0 || i >= STEPS.length - 1) return null;
    return STEPS[i + 1];
  }

  function prevStep(currentId) {
    var i = stepIndex(currentId);
    if (i <= 0) return null;
    return STEPS[i - 1];
  }

  function pillHtml(label, summary) {
    var ready = !!(summary && summary.ready);
    var detail = ready && summary.detail ? summary.detail : "not captured";
    var title = ready && summary.when ? summary.when : "";
    return (
      '<span class="wps-pill' +
      (ready ? " is-ready" : "") +
      '"' +
      (title ? ' title="' + escapeAttr(title) + '"' : "") +
      '><span class="wps-dot" aria-hidden="true"></span>' +
      escapeHtml(label) +
      '<span class="wps-pill-detail">' +
      escapeHtml(detail) +
      "</span></span>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function chainHtml(opts, handoffs) {
    var cur = opts.step;
    var curIdx = stepIndex(cur);
    var parts = [];
    STEPS.forEach(function (s, i) {
      if (i) parts.push('<span class="wps-arrow" aria-hidden="true">→</span>');
      var cls = "wps-step";
      if (s.id === cur) cls += " is-active";
      else if (curIdx > i) {
        // mark prior steps done if their handoff exists
        var ready =
          (s.id === "flow" && handoffs.flow) ||
          (s.id === "sprinkler" && handoffs.sprinkler) ||
          (s.id === "pump" && handoffs.pump) ||
          (s.id === "tank" && handoffs.tank);
        if (ready) cls += " is-done";
      }
      var href = joinBase(opts.base, s.path);
      var label =
        '<span class="wps-n">' +
        s.n +
        '</span><span class="wps-label">' +
        escapeHtml(s.short) +
        "</span>";
      if (s.id === cur) {
        parts.push(
          '<span class="' +
            cls +
            '" aria-current="step">' +
            label +
            "</span>"
        );
      } else {
        parts.push(
          '<a class="' + cls + '" href="' + escapeAttr(href) + '">' + label + "</a>"
        );
      }
    });
    return parts.join("");
  }

  function ctaForStep(opts, handoffs) {
    var next = nextStep(opts.step);
    var prev = prevStep(opts.step);
    var btns = [];

    if (prev) {
      btns.push(
        '<a class="wps-btn" href="' +
          escapeAttr(joinBase(opts.base, prev.path)) +
          '">← ' +
          escapeHtml(prev.short) +
          "</a>"
      );
    }

    // Contextual next / import hints
    if (opts.step === "flow") {
      if (next) {
        btns.push(
          '<a class="wps-btn wps-btn-primary" href="' +
            escapeAttr(joinBase(opts.base, next.path)) +
            '">Next: Sprinkler →</a>'
        );
      }
    } else if (opts.step === "sprinkler") {
      if (!handoffs.flow) {
        btns.push(
          '<a class="wps-btn" href="' +
            escapeAttr(joinBase(opts.base, "flow-test-report/")) +
            '">Load Flow Test first</a>'
        );
      }
      if (next) {
        btns.push(
          '<a class="wps-btn wps-btn-primary" href="' +
            escapeAttr(joinBase(opts.base, next.path)) +
            '">Next: Pump →</a>'
        );
      }
    } else if (opts.step === "pump") {
      if (!handoffs.sprinkler) {
        btns.push(
          '<a class="wps-btn" href="' +
            escapeAttr(joinBase(opts.base, "sprinkler-system-estimator/")) +
            '">Capture from Sprinkler</a>'
        );
      }
      if (next) {
        btns.push(
          '<a class="wps-btn wps-btn-primary" href="' +
            escapeAttr(joinBase(opts.base, next.path)) +
            '">Next: Tank →</a>'
        );
      }
    } else if (opts.step === "tank") {
      if (!handoffs.pump && !handoffs.sprinkler) {
        btns.push(
          '<a class="wps-btn" href="' +
            escapeAttr(joinBase(opts.base, "fire-pump-sizer/")) +
            '">Capture from Pump</a>'
        );
      }
    } else if (opts.step === "hub") {
      btns.push(
        '<a class="wps-btn wps-btn-primary" href="' +
          escapeAttr(joinBase(opts.base, "flow-test-report/")) +
          '">Start at Flow Test →</a>'
      );
    }

    btns.push(
      '<a class="wps-btn" href="' +
        escapeAttr(joinBase(opts.base, "water-supply/")) +
        '" title="Water path overview">Path hub</a>'
    );

    return btns.join("");
  }

  function noteForStep(opts, handoffs) {
    if (opts.step === "hub") {
      return "Set the project name above — it carries through all four tools. Captures stay in this browser until cleared.";
    }
    if (opts.step === "flow") {
      return handoffs.flow
        ? "Flow test capture ready for Sprinkler Estimator."
        : "Complete the test, then Capture for Sprinkler (or Capture & Open).";
    }
    if (opts.step === "sprinkler") {
      if (!handoffs.flow) return "Optional: import a Flow Test capture to plot supply vs demand.";
      if (!handoffs.sprinkler) return "Flow test loaded in chain — set demand, then Capture for Pump.";
      return "Sprinkler duty captured — continue to Fire Pump Sizer.";
    }
    if (opts.step === "pump") {
      if (!handoffs.sprinkler) return "Import Sprinkler Demand when ready — or enter duty manually.";
      if (!handoffs.pump) return "Sprinkler capture available — Import, size pump, then Capture for Tank.";
      return "Pump capture ready for Tank Sizer.";
    }
    if (opts.step === "tank") {
      if (handoffs.pump) return "Pump capture available — Import Upstream / Pump Demand.";
      if (handoffs.sprinkler) return "Sprinkler capture available for flow × duration.";
      return "Enter flow × duration or import from Pump / Sprinkler.";
    }
    return "Each tool works alone; captures link the path when you use them.";
  }

  function projectRowHtml(projectName) {
    return (
      '<div class="wps-project" role="group" aria-label="Shared project name">' +
      '<label class="wps-project-label" for="wpsProjectName">Project name</label>' +
      '<input type="text" id="wpsProjectName" class="wps-project-input" autocomplete="organization" ' +
      'placeholder="Carries across Flow → Sprinkler → Pump → Tank" ' +
      'value="' +
      escapeAttr(projectName || "") +
      '" />' +
      '<span class="wps-project-hint">Shared on this device for all four water tools and reports</span>' +
      "</div>"
    );
  }

  function statusInnerHtml(opts, handoffs) {
    return (
      '<div class="wps-pills" aria-label="Capture status">' +
      pillHtml("1 Flow", handoffs.flow) +
      pillHtml("2 Sprinkler", handoffs.sprinkler) +
      pillHtml("3 Pump", handoffs.pump) +
      pillHtml("4 Tank", handoffs.tank) +
      "</div>" +
      '<div class="wps-actions">' +
      ctaForStep(opts, handoffs) +
      "</div>" +
      '<p class="wps-note" style="flex-basis:100%">' +
      escapeHtml(noteForStep(opts, handoffs)) +
      "</p>"
    );
  }

  function buildHtml(opts) {
    var handoffs = handoffState();
    var project = loadProject();
    var portal = joinBase(opts.base, "");
    if (portal && !/\/$/.test(portal) && portal !== "." && portal !== "..") portal += "/";
    if (portal === "." || portal === "") portal = "./";
    else if (portal === "..") portal = "../";

    return (
      '<div class="wps-root no-print" data-wps-step="' +
      escapeAttr(opts.step || "") +
      '" role="region" aria-label="Fire Toolshed water supply path">' +
      '<div class="wps-top">' +
      '<div class="wps-brand">' +
      "<strong>Fire Toolshed</strong>" +
      '<span class="wps-tag">Water supply path · tools stay independent</span>' +
      "</div>" +
      '<div class="wps-top-links">' +
      '<a href="' +
      escapeAttr(portal) +
      '">All tools portal</a>' +
      '<a href="' +
      escapeAttr(joinBase(opts.base, "water-supply/")) +
      '">Path hub</a>' +
      "</div>" +
      "</div>" +
      projectRowHtml(project.projectName) +
      '<nav class="wps-chain" id="wpsChain" aria-label="Water path steps">' +
      chainHtml(opts, handoffs) +
      "</nav>" +
      '<div class="wps-status" id="wpsStatus">' +
      statusInnerHtml(opts, handoffs) +
      "</div>" +
      "</div>"
    );
  }

  function hideLegacyChrome() {
    document.body.classList.add("wps-active");
    document.querySelectorAll(".beta-banner, .chain").forEach(function (el) {
      // Only hide path banners/chains that look like our legacy path UI
      if (el.classList.contains("wps-keep")) return;
      var text = (el.textContent || "").toLowerCase();
      if (
        el.classList.contains("beta-banner") ||
        el.classList.contains("chain") ||
        text.indexOf("water supply") !== -1 ||
        text.indexOf("flow test") !== -1
      ) {
        el.classList.add("wps-legacy");
        if (el.classList.contains("beta-banner") || el.classList.contains("chain")) {
          el.hidden = true;
        }
      }
    });
  }

  /**
   * @param {{ step: string, base?: string, mountId?: string, refreshMs?: number, projectFieldIds?: string|string[] }} opts
   */
  function mount(opts) {
    opts = opts || {};
    var step = opts.step || "hub";
    var base = opts.base != null ? opts.base : "..";
    var mountId = opts.mountId || "waterPathShell";
    var fieldIds = opts.projectFieldIds || ["projectName"];
    var shellOpts = { step: step, base: base };

    var host = document.getElementById(mountId);
    if (!host) {
      host = document.createElement("div");
      host.id = mountId;
      host.className = "no-print";
      if (document.body.firstChild) {
        document.body.insertBefore(host, document.body.firstChild);
      } else {
        document.body.appendChild(host);
      }
    }

    function bindShellProjectInput() {
      var input = document.getElementById("wpsProjectName");
      if (!input || input.dataset.wpsBound === "1") return;
      input.dataset.wpsBound = "1";
      var push = function () {
        var v = String(input.value || "").trim();
        saveProject({ projectName: v });
        applyProjectToFields(fieldIds, { force: true });
      };
      input.addEventListener("input", push);
      input.addEventListener("change", push);
    }

    function syncShellProjectFromStore() {
      var input = document.getElementById("wpsProjectName");
      if (!input) return;
      if (document.activeElement === input) return;
      var name = loadProject().projectName || "";
      if (input.value !== name) input.value = name;
    }

    /** Update chain + status only (keeps project field / focus intact) */
    function refreshStatus() {
      var handoffs = handoffState();
      var chain = host.querySelector("#wpsChain");
      var status = host.querySelector("#wpsStatus");
      if (chain) chain.innerHTML = chainHtml(shellOpts, handoffs);
      if (status) status.innerHTML = statusInnerHtml(shellOpts, handoffs);
      syncShellProjectFromStore();
    }

    function paintFull() {
      seedProjectFromContext();
      host.innerHTML = buildHtml(shellOpts);
      bindShellProjectInput();
      applyProjectToFields(fieldIds, { force: !!loadProject().projectName });
      bindAppProjectFields(fieldIds);
    }

    paintFull();
    hideLegacyChrome();

    // Refresh pills when returning to tab or storage changes (other tabs)
    var onVis = function () {
      if (document.visibilityState === "visible") {
        refreshStatus();
        applyProjectToFields(fieldIds, { force: false });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", function (e) {
      if (!e.key || e.key.indexOf("fireToolshed.") === 0) {
        refreshStatus();
        if (e.key === KEYS.project || !e.key) {
          applyProjectToFields(fieldIds, { force: true });
        }
      }
    });
    window.addEventListener("fireToolshed:project", function () {
      syncShellProjectFromStore();
      applyProjectToFields(fieldIds, { force: false });
    });

    // Light poll so same-tab captures update the shell without app hooks
    var ms = opts.refreshMs != null ? opts.refreshMs : 2500;
    var timer = null;
    if (ms > 0) {
      timer = setInterval(refreshStatus, ms);
    }

    return {
      refresh: refreshStatus,
      refreshFull: paintFull,
      destroy: function () {
        document.removeEventListener("visibilitychange", onVis);
        if (timer) clearInterval(timer);
      },
      handoffs: handoffState,
      loadProject: loadProject,
      saveProject: saveProject,
      getProjectName: getProjectName,
      applyProjectToFields: applyProjectToFields,
      STEPS: STEPS,
      KEYS: KEYS,
    };
  }

  global.FireToolshedShell = {
    mount: mount,
    handoffs: handoffState,
    loadProject: loadProject,
    saveProject: saveProject,
    getProjectName: getProjectName,
    applyProjectToFields: applyProjectToFields,
    bindAppProjectFields: bindAppProjectFields,
    STEPS: STEPS,
    KEYS: KEYS,
    joinBase: joinBase,
  };
})(typeof window !== "undefined" ? window : globalThis);
