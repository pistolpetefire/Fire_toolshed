/**
 * Occupant Load & Egress Capacity
 * Two code paths: IBC and NFPA 101 (preliminary).
 */
(function () {
  "use strict";

  var APP_VERSION = "1.1.0";
  var STORAGE_KEY = "occupantEgress.v1";

  /** Shared egress component types */
  var EGRESS_TYPES = [
    { id: "door", label: "Door / other level component", kind: "other" },
    { id: "stair", label: "Stair / stairway", kind: "stair" },
    { id: "ramp", label: "Ramp", kind: "other" },
    { id: "corridor", label: "Corridor (capacity check)", kind: "other" },
  ];

  /**
   * IBC path — Table 1004.5 load factors, §1005 capacity, Ch. 10 travel (simplified).
   */
  var IBC_LOAD_USES = [
    { id: "assembly_standing", label: "Assembly — standing space (5 net)", factor: 5, basis: "net" },
    { id: "assembly_chairs", label: "Assembly — concentrated chairs (7 net)", factor: 7, basis: "net" },
    { id: "assembly_tables", label: "Assembly — unconcentrated tables (15 net)", factor: 15, basis: "net" },
    { id: "assembly_stage", label: "Assembly — stages / platforms (15 net)", factor: 15, basis: "net" },
    { id: "business", label: "Business (150 gross)", factor: 150, basis: "gross" },
    { id: "classroom", label: "Educational — classroom (20 net)", factor: 20, basis: "net" },
    { id: "shops", label: "Educational — shops / vocational (50 net)", factor: 50, basis: "net" },
    { id: "exercise", label: "Exercise rooms (50 gross)", factor: 50, basis: "gross" },
    { id: "industrial", label: "Industrial / factory (100 gross)", factor: 100, basis: "gross" },
    { id: "institutional_inpatient", label: "Institutional — inpatient treatment (240 gross)", factor: 240, basis: "gross" },
    { id: "institutional_outpatient", label: "Institutional — outpatient (100 gross)", factor: 100, basis: "gross" },
    { id: "kitchen", label: "Kitchens — commercial (200 gross)", factor: 200, basis: "gross" },
    { id: "library_stack", label: "Library — stack areas (100 gross)", factor: 100, basis: "gross" },
    { id: "library_reading", label: "Library — reading rooms (50 net)", factor: 50, basis: "net" },
    { id: "locker", label: "Locker rooms (50 gross)", factor: 50, basis: "gross" },
    { id: "mercantile", label: "Mercantile (60 gross)", factor: 60, basis: "gross" },
    { id: "mercantile_storage", label: "Mercantile storage / stock (300 gross)", factor: 300, basis: "gross" },
    { id: "parking", label: "Parking garages (200 gross)", factor: 200, basis: "gross" },
    { id: "residential", label: "Residential (200 gross)", factor: 200, basis: "gross" },
    { id: "storage", label: "Storage / warehouse (300 gross)", factor: 300, basis: "gross" },
    { id: "mechanical", label: "Mechanical / equipment rooms (300 gross)", factor: 300, basis: "gross" },
    { id: "fixed", label: "Fixed seating / known count (use Fixed OL)", factor: 0, basis: "fixed" },
  ];

  var IBC_OCC_GROUPS = [
    { id: "A", label: "A — Assembly", travel: { yes: 250, no: 200 }, common: { yes: 75, no: 75 }, deadEnd: { yes: 20, no: 20 } },
    { id: "B", label: "B — Business", travel: { yes: 300, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "E", label: "E — Educational", travel: { yes: 250, no: 200 }, common: { yes: 75, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "F", label: "F — Factory / Industrial", travel: { yes: 400, no: 300 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "H", label: "H — High Hazard (verify specific H)", travel: { yes: 200, no: 150 }, common: { yes: 50, no: 50 }, deadEnd: { yes: 20, no: 20 } },
    { id: "I", label: "I — Institutional (verify specific I)", travel: { yes: 250, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 30, no: 20 } },
    { id: "M", label: "M — Mercantile", travel: { yes: 250, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "R", label: "R — Residential", travel: { yes: 250, no: 200 }, common: { yes: 125, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "S", label: "S — Storage", travel: { yes: 400, no: 300 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "U", label: "U — Utility / Miscellaneous", travel: { yes: 300, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
  ];

  /**
   * NFPA 101 path — Table 7.3.1.2 load factors, §7.3.3 capacity, occupancy travel (simplified).
   * Notable difference: Business is 100 sf/person gross (vs IBC 150).
   */
  var NFPA_LOAD_USES = [
    { id: "assembly_standing", label: "Assembly — standing space (5 net)", factor: 5, basis: "net" },
    { id: "assembly_chairs", label: "Assembly — concentrated (7 net)", factor: 7, basis: "net" },
    { id: "assembly_tables", label: "Assembly — less concentrated (15 net)", factor: 15, basis: "net" },
    { id: "assembly_stage", label: "Assembly — stages (15 net)", factor: 15, basis: "net" },
    { id: "business", label: "Business use (100 gross)", factor: 100, basis: "gross" },
    { id: "classroom", label: "Educational — classroom (20 net)", factor: 20, basis: "net" },
    { id: "shops", label: "Educational — shops / labs (50 net)", factor: 50, basis: "net" },
    { id: "day_care", label: "Day-care (35 net)", factor: 35, basis: "net" },
    { id: "exercise", label: "Exercise rooms (50 gross)", factor: 50, basis: "gross" },
    { id: "industrial", label: "Industrial general / special-purpose (100 gross)", factor: 100, basis: "gross" },
    { id: "health_care", label: "Health care — inpatient treatment (240 gross)", factor: 240, basis: "gross" },
    { id: "ambulatory", label: "Ambulatory health care (100 gross)", factor: 100, basis: "gross" },
    { id: "kitchen", label: "Kitchens (100 gross)", factor: 100, basis: "gross" },
    { id: "library_stack", label: "Library — stack areas (100 gross)", factor: 100, basis: "gross" },
    { id: "library_reading", label: "Library — reading rooms (50 net)", factor: 50, basis: "net" },
    { id: "locker", label: "Locker rooms (50 gross)", factor: 50, basis: "gross" },
    { id: "mercantile_street", label: "Mercantile — sales on street floor (30 gross)", factor: 30, basis: "gross" },
    { id: "mercantile_other", label: "Mercantile — sales floors other than street (60 gross)", factor: 60, basis: "gross" },
    { id: "mercantile_storage", label: "Mercantile storage / stock (300 gross)", factor: 300, basis: "gross" },
    { id: "parking", label: "Parking structures (200 gross)", factor: 200, basis: "gross" },
    { id: "residential", label: "Residential (200 gross)", factor: 200, basis: "gross" },
    { id: "storage", label: "Storage (500 gross)", factor: 500, basis: "gross" },
    { id: "mechanical", label: "Mechanical / equipment (300 gross)", factor: 300, basis: "gross" },
    { id: "fixed", label: "Fixed seating / known count (use Fixed OL)", factor: 0, basis: "fixed" },
  ];

  /** NFPA 101 occupancy classifications (simplified travel limits by chapter practice). */
  var NFPA_OCC_GROUPS = [
    { id: "assembly", label: "Assembly", travel: { yes: 250, no: 200 }, common: { yes: 75, no: 20 }, deadEnd: { yes: 20, no: 20 } },
    { id: "educational", label: "Educational", travel: { yes: 250, no: 150 }, common: { yes: 75, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "day_care", label: "Day-Care", travel: { yes: 250, no: 150 }, common: { yes: 75, no: 75 }, deadEnd: { yes: 20, no: 20 } },
    { id: "health_care", label: "Health Care", travel: { yes: 200, no: 150 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 30, no: 20 } },
    { id: "ambulatory", label: "Ambulatory Health Care", travel: { yes: 200, no: 150 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 30, no: 20 } },
    { id: "detention", label: "Detention & Correctional", travel: { yes: 200, no: 150 }, common: { yes: 50, no: 50 }, deadEnd: { yes: 20, no: 20 } },
    { id: "residential", label: "Residential", travel: { yes: 250, no: 200 }, common: { yes: 125, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "mercantile", label: "Mercantile", travel: { yes: 250, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "business", label: "Business", travel: { yes: 300, no: 200 }, common: { yes: 100, no: 75 }, deadEnd: { yes: 50, no: 20 } },
    { id: "industrial", label: "Industrial", travel: { yes: 400, no: 300 }, common: { yes: 100, no: 50 }, deadEnd: { yes: 50, no: 20 } },
    { id: "storage", label: "Storage", travel: { yes: 400, no: 300 }, common: { yes: 100, no: 50 }, deadEnd: { yes: 50, no: 20 } },
  ];

  var CODE_PATHS = {
    ibc: {
      id: "ibc",
      short: "IBC",
      title: "International Building Code (IBC)",
      loadTable: "IBC Table 1004.5",
      capacityRef: "IBC §1005.3",
      travelRef: "IBC Chapter 10 (simplified by occupancy group)",
      loadUses: IBC_LOAD_USES,
      occGroups: IBC_OCC_GROUPS,
      defaultOcc: "B",
      defaultUse: "business",
      widthNote: function (sp) {
        return sp
          ? "IBC 1005.3 (sprinklered): stairs 0.2 in/occ · other egress 0.15 in/occ"
          : "IBC 1005.3 (not sprinklered): stairs 0.3 in/occ · other egress 0.2 in/occ";
      },
    },
    nfpa101: {
      id: "nfpa101",
      short: "NFPA 101",
      title: "NFPA 101 Life Safety Code",
      loadTable: "NFPA 101 Table 7.3.1.2",
      capacityRef: "NFPA 101 §7.3.3",
      travelRef: "NFPA 101 occupancy chapters (simplified travel limits)",
      loadUses: NFPA_LOAD_USES,
      occGroups: NFPA_OCC_GROUPS,
      defaultOcc: "business",
      defaultUse: "business",
      widthNote: function (sp) {
        return sp
          ? "NFPA 101 7.3.3 (sprinklered throughout): stairs 0.2 in/occ · level/ramps 0.15 in/occ"
          : "NFPA 101 7.3.3: stairs 0.3 in/occ · level components & ramps 0.2 in/occ";
      },
    },
  };

  function $(id) {
    return document.getElementById(id);
  }

  function uid() {
    return "id" + Math.random().toString(36).slice(2, 9);
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

  function num(v, fb) {
    var n = parseFloat(v);
    return Number.isFinite(n) ? n : fb != null ? fb : 0;
  }

  function round0(n) {
    return Math.round(n);
  }

  function currentPath() {
    return CODE_PATHS[state.codePath] || null;
  }

  function loadUses() {
    var p = currentPath();
    return p ? p.loadUses : IBC_LOAD_USES;
  }

  function occGroups() {
    var p = currentPath();
    return p ? p.occGroups : IBC_OCC_GROUPS;
  }

  function defaultSpace() {
    var p = currentPath();
    return {
      id: uid(),
      name: "",
      useId: p ? p.defaultUse : "business",
      areaSf: 1500,
      fixedOl: "",
    };
  }

  function defaultEgress() {
    return {
      id: uid(),
      name: "Exit 1",
      typeId: "door",
      clearWidthIn: 36,
      qty: 1,
    };
  }

  function defaultState() {
    return {
      codePath: null,
      projectName: "",
      buildingArea: "",
      sprinklered: "yes",
      occupancyGroup: "B",
      spaces: [],
      egress: [],
      travelActual: "",
      commonPathActual: "",
      deadEndActual: "",
    };
  }

  var state = defaultState();

  function ensureWorkbenchDefaults() {
    var p = currentPath();
    if (!p) return;
    if (!state.occupancyGroup || !occGroups().some(function (g) { return g.id === state.occupancyGroup; })) {
      state.occupancyGroup = p.defaultOcc;
    }
    if (!Array.isArray(state.spaces) || !state.spaces.length) {
      state.spaces = [defaultSpace()];
    } else {
      // Remap use ids that don't exist on this path
      var uses = loadUses();
      state.spaces.forEach(function (sp) {
        if (!uses.some(function (u) { return u.id === sp.useId; })) {
          sp.useId = p.defaultUse;
        }
      });
    }
    if (!Array.isArray(state.egress) || !state.egress.length) {
      state.egress = [
        defaultEgress(),
        Object.assign(defaultEgress(), { name: "Exit 2", clearWidthIn: 36 }),
      ];
    }
  }

  function loadFactor(useId) {
    var uses = loadUses();
    return (
      uses.find(function (u) {
        return u.id === useId;
      }) || uses[0]
    );
  }

  function occGroup(id) {
    var groups = occGroups();
    return (
      groups.find(function (g) {
        return g.id === id;
      }) || groups[0]
    );
  }

  function widthFactors(sprinklered) {
    var sp = sprinklered === "yes";
    var p = currentPath();
    return {
      stair: sp ? 0.2 : 0.3,
      other: sp ? 0.15 : 0.2,
      label: p ? p.widthNote(sp) : "",
    };
  }

  function spaceOl(sp) {
    var fixed = num(sp.fixedOl, 0);
    if (fixed > 0) return round0(fixed);
    var use = loadFactor(sp.useId);
    if (!use.factor || use.basis === "fixed") return 0;
    var area = num(sp.areaSf, 0);
    if (area <= 0) return 0;
    return round0(area / use.factor);
  }

  function totalLoad() {
    return state.spaces.reduce(function (s, sp) {
      return s + spaceOl(sp);
    }, 0);
  }

  function egressCapacity(eg, factors) {
    var type =
      EGRESS_TYPES.find(function (t) {
        return t.id === eg.typeId;
      }) || EGRESS_TYPES[0];
    var factor = type.kind === "stair" ? factors.stair : factors.other;
    var w = Math.max(0, num(eg.clearWidthIn, 0));
    var q = Math.max(1, round0(num(eg.qty, 1)));
    if (w <= 0) return { factor: factor, capacity: 0 };
    return { factor: factor, capacity: Math.floor(w / factor) * q };
  }

  function totalCapacity(factors) {
    return state.egress.reduce(function (s, eg) {
      return s + egressCapacity(eg, factors).capacity;
    }, 0);
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
      if (!d || typeof d !== "object") return;
      state = Object.assign(defaultState(), d);
      // migrate old codeBasis → codePath
      if (!state.codePath && d.codeBasis) {
        if (String(d.codeBasis).indexOf("nfpa") >= 0) state.codePath = "nfpa101";
        else state.codePath = "ibc";
      }
      if (state.codePath && !CODE_PATHS[state.codePath]) state.codePath = null;
    } catch (_) { /* ignore */ }
  }

  function useOptionsHtml(selected) {
    return loadUses()
      .map(function (u) {
        return (
          '<option value="' +
          u.id +
          '"' +
          (u.id === selected ? " selected" : "") +
          ">" +
          escapeHtml(u.label) +
          "</option>"
        );
      })
      .join("");
  }

  function egressTypeOptions(selected) {
    return EGRESS_TYPES.map(function (t) {
      return (
        '<option value="' +
        t.id +
        '"' +
        (t.id === selected ? " selected" : "") +
        ">" +
        escapeHtml(t.label) +
        "</option>"
      );
    }).join("");
  }

  function renderSpaces() {
    var body = $("spaceBody");
    if (!body) return;
    body.innerHTML = state.spaces
      .map(function (sp) {
        var ol = spaceOl(sp);
        return (
          '<tr data-space="' +
          sp.id +
          '">' +
          '<td><input data-f="name" type="text" value="' +
          escapeHtml(sp.name) +
          '" placeholder="Room name" /></td>' +
          '<td><select data-f="useId">' +
          useOptionsHtml(sp.useId) +
          "</select></td>" +
          '<td class="num"><input class="num-in" data-f="areaSf" type="number" min="0" step="1" value="' +
          (sp.areaSf != null ? sp.areaSf : "") +
          '" /></td>' +
          '<td class="num"><input class="num-in" data-f="fixedOl" type="number" min="0" step="1" value="' +
          (sp.fixedOl != null ? sp.fixedOl : "") +
          '" placeholder="—" /></td>' +
          '<td class="num"><strong>' +
          ol +
          "</strong></td>" +
          '<td><button type="button" class="ghost icon-btn" data-del-space="' +
          sp.id +
          '">×</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function renderEgress(factors) {
    var body = $("egressBody");
    if (!body) return;
    body.innerHTML = state.egress
      .map(function (eg) {
        var c = egressCapacity(eg, factors);
        return (
          '<tr data-egress="' +
          eg.id +
          '">' +
          '<td><input data-f="name" type="text" value="' +
          escapeHtml(eg.name) +
          '" /></td>' +
          '<td><select data-f="typeId">' +
          egressTypeOptions(eg.typeId) +
          "</select></td>" +
          '<td class="num"><input class="num-in" data-f="clearWidthIn" type="number" min="0" step="0.5" value="' +
          (eg.clearWidthIn != null ? eg.clearWidthIn : "") +
          '" /></td>' +
          '<td class="num"><input class="num-in" data-f="qty" type="number" min="1" step="1" value="' +
          (eg.qty != null ? eg.qty : 1) +
          '" /></td>' +
          '<td class="num">' +
          c.factor.toFixed(2) +
          "</td>" +
          '<td class="num"><strong>' +
          c.capacity +
          "</strong></td>" +
          '<td><button type="button" class="ghost icon-btn" data-del-egress="' +
          eg.id +
          '">×</button></td>' +
          "</tr>"
        );
      })
      .join("");
  }

  function calcModel() {
    var p = currentPath();
    var factors = widthFactors(state.sprinklered);
    var load = totalLoad();
    var cap = totalCapacity(factors);
    var margin = cap - load;
    var group = occGroup(state.occupancyGroup);
    var spKey = state.sprinklered === "yes" ? "yes" : "no";
    var allow = {
      travel: group.travel[spKey],
      common: group.common[spKey],
      deadEnd: group.deadEnd[spKey],
    };
    var travel = num(state.travelActual, NaN);
    var common = num(state.commonPathActual, NaN);
    var dead = num(state.deadEndActual, NaN);
    var travelOk =
      !Number.isFinite(travel) || travel <= 0 ? null : travel <= allow.travel;
    var commonOk =
      !Number.isFinite(common) || common <= 0 ? null : common <= allow.common;
    var deadOk = !Number.isFinite(dead) || dead <= 0 ? null : dead <= allow.deadEnd;

    var capStatus = "incomplete";
    if (load > 0 && cap > 0) capStatus = margin >= 0 ? "pass" : "fail";
    else if (load > 0 || cap > 0) capStatus = "partial";

    return {
      path: p,
      factors: factors,
      load: load,
      cap: cap,
      margin: margin,
      group: group,
      allow: allow,
      travel: travel,
      common: common,
      dead: dead,
      travelOk: travelOk,
      commonOk: commonOk,
      deadOk: deadOk,
      capStatus: capStatus,
      spaces: state.spaces.map(function (sp) {
        return Object.assign({}, sp, { ol: spaceOl(sp), use: loadFactor(sp.useId) });
      }),
      egress: state.egress.map(function (eg) {
        var c = egressCapacity(eg, factors);
        var type =
          EGRESS_TYPES.find(function (t) {
            return t.id === eg.typeId;
          }) || EGRESS_TYPES[0];
        return Object.assign({}, eg, {
          capacity: c.capacity,
          factor: c.factor,
          typeLabel: type.label,
        });
      }),
    };
  }

  function showPathPick(show) {
    var pick = $("pathPick");
    var work = $("workbench");
    var actions = $("workActions");
    if (pick) {
      if (show) pick.classList.remove("hidden");
      else pick.classList.add("hidden");
    }
    if (work) {
      if (show) work.classList.add("hidden");
      else work.classList.remove("hidden");
    }
    if (actions) {
      // hide print/save until path chosen (keep portal)
      var kids = actions.querySelectorAll("button, a.btn-link");
      kids.forEach(function (el) {
        if (el.id === "btnChangePath" || el.id === "btnPrintPdf" || el.id === "btnSave" || el.id === "btnReset") {
          el.style.display = show ? "none" : "";
        }
      });
    }
    var lead = $("headerLead");
    if (lead) {
      lead.innerHTML = show
        ? "Choose a code path, then calculate <strong>occupant load</strong>, <strong>egress capacity</strong>, and travel-distance checks."
        : "Path active — factors and limits follow the selected code.";
    }
  }

  function selectPath(pathId) {
    if (!CODE_PATHS[pathId]) return;
    state.codePath = pathId;
    ensureWorkbenchDefaults();
    populateOccGroups();
    writeFormMeta();
    showPathPick(false);
    render();
    toast(CODE_PATHS[pathId].short + " path selected");
  }

  function changePath() {
    if (
      !confirm(
        "Change code path? Occupant-load use factors and travel limits will switch. Space uses that do not exist on the other path will reset."
      )
    ) {
      return;
    }
    state.codePath = null;
    showPathPick(true);
    saveState();
  }

  function populateOccGroups() {
    var occ = $("occupancyGroup");
    if (!occ) return;
    var groups = occGroups();
    occ.innerHTML = groups
      .map(function (g) {
        return (
          '<option value="' + g.id + '">' + escapeHtml(g.label) + "</option>"
        );
      })
      .join("");
    if (!groups.some(function (g) { return g.id === state.occupancyGroup; })) {
      state.occupancyGroup = groups[0].id;
    }
    occ.value = state.occupancyGroup;
    var lab = $("occupancyGroupLabel");
    var p = currentPath();
    if (lab && p) {
      lab.textContent =
        p.id === "nfpa101"
          ? "Occupancy classification (travel limits)"
          : "Primary occupancy group (travel limits)";
    }
  }

  function render() {
    if (!state.codePath) {
      showPathPick(true);
      saveState();
      return;
    }
    showPathPick(false);
    ensureWorkbenchDefaults();

    var m = calcModel();
    var p = m.path;

    if ($("pathBanner") && p) {
      $("pathBanner").innerHTML =
        '<span><span class="path-tag">' +
        escapeHtml(p.short) +
        "</span> " +
        escapeHtml(p.title) +
        " · Load: " +
        escapeHtml(p.loadTable) +
        " · Capacity: " +
        escapeHtml(p.capacityRef) +
        "</span>";
    }

    if ($("sprinklerHint") && p) {
      $("sprinklerHint").textContent = p.widthNote(state.sprinklered === "yes");
    }

    if ($("mLoad")) $("mLoad").textContent = String(m.load);
    if ($("mCap")) $("mCap").textContent = String(m.cap);
    if ($("mMargin")) {
      $("mMargin").textContent = (m.margin >= 0 ? "+" : "") + m.margin;
    }
    var statusEl = $("mStatus");
    var sub = $("mStatusSub");
    var metric = statusEl && statusEl.closest(".metric");
    if (metric) metric.classList.remove("ok", "bad", "warn");
    if (statusEl) {
      if (m.capStatus === "pass") {
        statusEl.textContent = "PASS";
        if (sub) sub.textContent = "Capacity ≥ load";
        if (metric) metric.classList.add("ok");
      } else if (m.capStatus === "fail") {
        statusEl.textContent = "FAIL";
        if (sub) sub.textContent = "Need more egress width";
        if (metric) metric.classList.add("bad");
      } else if (m.capStatus === "partial") {
        statusEl.textContent = "—";
        if (sub) sub.textContent = "Complete both tables";
        if (metric) metric.classList.add("warn");
      } else {
        statusEl.textContent = "—";
        if (sub) sub.textContent = "Enter spaces & exits";
      }
    }

    if ($("spaceTotalHint")) {
      $("spaceTotalHint").textContent =
        "Total occupant load = " +
        m.load +
        " persons · factors from " +
        (p ? p.loadTable : "code") +
        ".";
    }
    if ($("egressTotalHint")) {
      $("egressTotalHint").textContent =
        "Total egress capacity = " + m.cap + " persons · " + m.factors.label;
    }

    if ($("allowBox")) {
      $("allowBox").innerHTML =
        "Travel ≤ <strong>" +
        m.allow.travel +
        " ft</strong> · Common path ≤ <strong>" +
        m.allow.common +
        " ft</strong> · Dead-end ≤ <strong>" +
        m.allow.deadEnd +
        " ft</strong><br><span class='sub' style='margin:0'>" +
        escapeHtml(m.group.label) +
        (state.sprinklered === "yes" ? " · sprinklered" : " · nonsprinklered") +
        " · " +
        (p ? escapeHtml(p.travelRef) : "") +
        "</span>";
    }

    var tr = $("travelResult");
    if (tr) {
      var bits = [];
      if (m.travelOk === true)
        bits.push("Travel distance OK (" + m.travel + " ≤ " + m.allow.travel + " ft)");
      if (m.travelOk === false)
        bits.push(
          "Travel distance EXCEEDS limit (" + m.travel + " > " + m.allow.travel + " ft)"
        );
      if (m.commonOk === true)
        bits.push("Common path OK (" + m.common + " ≤ " + m.allow.common + " ft)");
      if (m.commonOk === false)
        bits.push(
          "Common path EXCEEDS limit (" + m.common + " > " + m.allow.common + " ft)"
        );
      if (m.deadOk === true)
        bits.push("Dead-end OK (" + m.dead + " ≤ " + m.allow.deadEnd + " ft)");
      if (m.deadOk === false)
        bits.push(
          "Dead-end EXCEEDS limit (" + m.dead + " > " + m.allow.deadEnd + " ft)"
        );
      if (!bits.length) {
        tr.className = "callout info";
        tr.textContent =
          "Optional: enter measured/design distances to compare against simplified limits for this code path.";
      } else {
        var anyFail =
          m.travelOk === false || m.commonOk === false || m.deadOk === false;
        tr.className = "callout " + (anyFail ? "bad" : "ok");
        tr.innerHTML = bits.map(escapeHtml).join("<br>");
      }
    }

    if ($("factorBox")) {
      $("factorBox").textContent = m.factors.label;
    }

    if ($("summaryBox")) {
      var statusClass =
        m.capStatus === "pass" ? "pass" : m.capStatus === "fail" ? "fail" : "";
      var statusText =
        m.capStatus === "pass"
          ? "PASS — capacity ≥ occupant load"
          : m.capStatus === "fail"
            ? "FAIL — capacity short by " + Math.abs(m.margin) + " persons"
            : "Incomplete — add spaces and egress components";
      $("summaryBox").innerHTML =
        '<div class="row"><span>Code path</span><strong>' +
        escapeHtml(p ? p.short : "—") +
        "</strong></div>" +
        '<div class="row"><span>Project</span><strong>' +
        escapeHtml(state.projectName || "—") +
        "</strong></div>" +
        '<div class="row"><span>Area / story</span><strong>' +
        escapeHtml(state.buildingArea || "—") +
        "</strong></div>" +
        '<div class="row"><span>Occupancy</span><strong>' +
        escapeHtml(m.group.label) +
        "</strong></div>" +
        '<div class="row"><span>Sprinklered</span><strong>' +
        (state.sprinklered === "yes" ? "Yes (NFPA 13)" : "No") +
        "</strong></div>" +
        '<div class="row"><span>Total occupant load</span><strong>' +
        m.load +
        "</strong></div>" +
        '<div class="row"><span>Total egress capacity</span><strong>' +
        m.cap +
        "</strong></div>" +
        '<div class="row"><span>Margin</span><strong>' +
        (m.margin >= 0 ? "+" : "") +
        m.margin +
        "</strong></div>" +
        '<div class="row"><span>Result</span><strong class="' +
        statusClass +
        '">' +
        statusText +
        "</strong></div>";
    }

    renderSpaces();
    renderEgress(m.factors);

    if ($("printBody")) $("printBody").innerHTML = packageHtml(m, false);
    if ($("reportLogoPrint") && window.FireToolshedLogo) {
      $("reportLogoPrint").innerHTML = window.FireToolshedLogo.reportHeaderHtml({
        maxHeight: 52,
      });
    }

    saveState();
  }

  function readSpaceRow(tr) {
    var id = tr.getAttribute("data-space");
    var sp = state.spaces.find(function (s) {
      return s.id === id;
    });
    if (!sp) return;
    var name = tr.querySelector('[data-f="name"]');
    var useId = tr.querySelector('[data-f="useId"]');
    var area = tr.querySelector('[data-f="areaSf"]');
    var fixed = tr.querySelector('[data-f="fixedOl"]');
    if (name) sp.name = name.value;
    if (useId) sp.useId = useId.value;
    if (area) sp.areaSf = area.value === "" ? "" : num(area.value, 0);
    if (fixed) sp.fixedOl = fixed.value === "" ? "" : fixed.value;
  }

  function readEgressRow(tr) {
    var id = tr.getAttribute("data-egress");
    var eg = state.egress.find(function (s) {
      return s.id === id;
    });
    if (!eg) return;
    var name = tr.querySelector('[data-f="name"]');
    var typeId = tr.querySelector('[data-f="typeId"]');
    var w = tr.querySelector('[data-f="clearWidthIn"]');
    var q = tr.querySelector('[data-f="qty"]');
    if (name) eg.name = name.value;
    if (typeId) eg.typeId = typeId.value;
    if (w) eg.clearWidthIn = num(w.value, 0);
    if (q) eg.qty = Math.max(1, round0(num(q.value, 1)));
  }

  function readFormMeta() {
    state.projectName = ($("projectName") && $("projectName").value.trim()) || "";
    state.buildingArea = ($("buildingArea") && $("buildingArea").value.trim()) || "";
    state.sprinklered = ($("sprinklered") && $("sprinklered").value) || "yes";
    state.occupancyGroup =
      ($("occupancyGroup") && $("occupancyGroup").value) || state.occupancyGroup;
    state.travelActual = ($("travelActual") && $("travelActual").value) || "";
    state.commonPathActual =
      ($("commonPathActual") && $("commonPathActual").value) || "";
    state.deadEndActual = ($("deadEndActual") && $("deadEndActual").value) || "";
  }

  function writeFormMeta() {
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("buildingArea")) $("buildingArea").value = state.buildingArea;
    if ($("sprinklered")) $("sprinklered").value = state.sprinklered;
    if ($("occupancyGroup")) $("occupancyGroup").value = state.occupancyGroup;
    if ($("travelActual")) $("travelActual").value = state.travelActual;
    if ($("commonPathActual")) $("commonPathActual").value = state.commonPathActual;
    if ($("deadEndActual")) $("deadEndActual").value = state.deadEndActual;
  }

  function packageHtml(m, includeLogo) {
    var logo =
      includeLogo && window.FireToolshedLogo
        ? window.FireToolshedLogo.reportHeaderHtml({ maxHeight: 52 })
        : "";
    var p = m.path;
    var spaceRows = m.spaces
      .map(function (sp) {
        return (
          "<tr><td>" +
          escapeHtml(sp.name || "—") +
          "</td><td>" +
          escapeHtml(sp.use.label) +
          "</td><td style='text-align:right'>" +
          (sp.areaSf !== "" ? sp.areaSf : "—") +
          "</td><td style='text-align:right'>" +
          (sp.fixedOl !== "" ? sp.fixedOl : "—") +
          "</td><td style='text-align:right'>" +
          sp.ol +
          "</td></tr>"
        );
      })
      .join("");
    var egRows = m.egress
      .map(function (eg) {
        return (
          "<tr><td>" +
          escapeHtml(eg.name || "—") +
          "</td><td>" +
          escapeHtml(eg.typeLabel) +
          "</td><td style='text-align:right'>" +
          eg.clearWidthIn +
          "</td><td style='text-align:right'>" +
          eg.qty +
          "</td><td style='text-align:right'>" +
          eg.factor.toFixed(2) +
          "</td><td style='text-align:right'>" +
          eg.capacity +
          "</td></tr>"
        );
      })
      .join("");
    var status =
      m.capStatus === "pass"
        ? "PASS — capacity ≥ load"
        : m.capStatus === "fail"
          ? "FAIL — short by " + Math.abs(m.margin) + " persons"
          : "Incomplete";
    return (
      logo +
      "<h1>Occupant Load &amp; Egress Capacity</h1>" +
      "<p><strong>Code path:</strong> " +
      escapeHtml(p ? p.title : "—") +
      " · Load: " +
      escapeHtml(p ? p.loadTable : "—") +
      " · Capacity: " +
      escapeHtml(p ? p.capacityRef : "—") +
      "<br><strong>Project:</strong> " +
      escapeHtml(state.projectName || "—") +
      " · <strong>Area:</strong> " +
      escapeHtml(state.buildingArea || "—") +
      "<br><strong>Occupancy:</strong> " +
      escapeHtml(m.group.label) +
      " · <strong>Sprinklered:</strong> " +
      (state.sprinklered === "yes" ? "Yes" : "No") +
      "</p>" +
      "<p><strong>Total occupant load:</strong> " +
      m.load +
      " · <strong>Egress capacity:</strong> " +
      m.cap +
      " · <strong>Margin:</strong> " +
      (m.margin >= 0 ? "+" : "") +
      m.margin +
      "<br><strong>Result:</strong> " +
      status +
      "</p>" +
      "<p style='font-size:0.9rem'>" +
      escapeHtml(m.factors.label) +
      "</p>" +
      "<h2>Spaces</h2>" +
      "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Space</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Use</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Area</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Fixed</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>OL</th></tr></thead><tbody>" +
      spaceRows +
      "</tbody></table>" +
      "<h2>Egress components</h2>" +
      "<table style='width:100%;border-collapse:collapse;font-size:0.9rem'><thead><tr>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>ID</th>" +
      "<th style='text-align:left;border-bottom:1px solid #e2e8f0'>Type</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Width</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Qty</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Factor</th>" +
      "<th style='text-align:right;border-bottom:1px solid #e2e8f0'>Cap.</th></tr></thead><tbody>" +
      egRows +
      "</tbody></table>" +
      "<h2>Travel limits (simplified)</h2>" +
      "<p>Allowable — Travel " +
      m.allow.travel +
      " ft · Common path " +
      m.allow.common +
      " ft · Dead-end " +
      m.allow.deadEnd +
      " ft<br>Entered — Travel " +
      (Number.isFinite(m.travel) ? m.travel + " ft" : "—") +
      " · Common " +
      (Number.isFinite(m.common) ? m.common + " ft" : "—") +
      " · Dead-end " +
      (Number.isFinite(m.dead) ? m.dead + " ft" : "—") +
      "</p>" +
      "<p style='color:#64748b;font-size:0.85rem'>Fire Toolshed · Occupant Load &amp; Egress Capacity v" +
      APP_VERSION +
      " · Preliminary only · " +
      escapeHtml(new Date().toLocaleString()) +
      "</p>"
    );
  }

  function printCss() {
    return (
      "@page{size:letter;margin:0.55in 0.6in}" +
      "body{font-family:system-ui,sans-serif;color:#0f172a;line-height:1.45;margin:0}" +
      "h1{font-size:1.3rem;margin:0 0 0.4rem}h2{font-size:1.05rem;margin:0.9rem 0 0.35rem}" +
      "table{width:100%;border-collapse:collapse}th,td{padding:0.3rem;border-bottom:1px solid #e2e8f0}"
    );
  }

  function printToPdf() {
    if (!state.codePath) {
      toast("Select IBC or NFPA 101 path first");
      return;
    }
    readFormMeta();
    render();
    var m = calcModel();
    var boot =
      "window.onload=function(){var done=false;function closeMe(){if(done)return;done=true;try{window.close();}catch(e){}}" +
      "window.addEventListener('afterprint',closeMe);" +
      "setTimeout(function(){try{window.focus();window.print();}catch(e){}setTimeout(closeMe,50);},250);};";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Egress Capacity</title><style>" +
      printCss() +
      "</style></head><body>" +
      packageHtml(m, true) +
      "<script>" +
      boot +
      "<\/script></body></html>";
    var w = window.open("", "_blank");
    if (!w) {
      toast("Popup blocked — using page print");
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
    toast("Print dialog: Save as PDF — Cancel returns here");
  }

  function saveReport() {
    if (!state.codePath) {
      toast("Select IBC or NFPA 101 path first");
      return;
    }
    readFormMeta();
    render();
    var m = calcModel();
    var name =
      (state.projectName || "occupant-egress").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "occupant-egress";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Egress Capacity</title><style>" +
      printCss() +
      "</style></head><body>" +
      packageHtml(m, true) +
      "</body></html>";
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "_egress-capacity.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("Saved HTML report");
  }

  function bind() {
    $("pickIbc") &&
      $("pickIbc").addEventListener("click", function () {
        selectPath("ibc");
      });
    $("pickNfpa") &&
      $("pickNfpa").addEventListener("click", function () {
        selectPath("nfpa101");
      });
    $("btnChangePath") && $("btnChangePath").addEventListener("click", changePath);

    ["projectName", "buildingArea", "sprinklered", "occupancyGroup", "travelActual", "commonPathActual", "deadEndActual"].forEach(
      function (id) {
        var el = $(id);
        if (!el) return;
        el.addEventListener("input", function () {
          readFormMeta();
          render();
        });
        el.addEventListener("change", function () {
          readFormMeta();
          render();
        });
      }
    );

    $("btnAddSpace") &&
      $("btnAddSpace").addEventListener("click", function () {
        state.spaces.push(defaultSpace());
        render();
      });
    $("btnAddEgress") &&
      $("btnAddEgress").addEventListener("click", function () {
        state.egress.push(defaultEgress());
        render();
      });

    document.addEventListener("input", function (e) {
      var t = e.target;
      if (!t) return;
      var sp = t.closest && t.closest("tr[data-space]");
      var eg = t.closest && t.closest("tr[data-egress]");
      if (sp) {
        readSpaceRow(sp);
        render();
      } else if (eg) {
        readEgressRow(eg);
        render();
      }
    });
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      var sp = t.closest && t.closest("tr[data-space]");
      var eg = t.closest && t.closest("tr[data-egress]");
      if (sp) {
        readSpaceRow(sp);
        render();
      } else if (eg) {
        readEgressRow(eg);
        render();
      }
    });
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;
      var ds = t.getAttribute && t.getAttribute("data-del-space");
      var de = t.getAttribute && t.getAttribute("data-del-egress");
      if (ds) {
        if (state.spaces.length <= 1) {
          toast("Keep at least one space");
          return;
        }
        state.spaces = state.spaces.filter(function (s) {
          return s.id !== ds;
        });
        render();
      }
      if (de) {
        if (state.egress.length <= 1) {
          toast("Keep at least one egress component");
          return;
        }
        state.egress = state.egress.filter(function (s) {
          return s.id !== de;
        });
        render();
      }
    });

    $("btnPrintPdf") && $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnSave") && $("btnSave").addEventListener("click", saveReport);
    $("btnReset") &&
      $("btnReset").addEventListener("click", function () {
        if (!confirm("Reset form and return to code path selection?")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) { /* ignore */ }
        state = defaultState();
        writeFormMeta();
        showPathPick(true);
        saveState();
      });
  }

  function init() {
    loadState();
    bind();
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: function () {
          if (state.codePath) render();
        },
      });
    }
    if (state.codePath && CODE_PATHS[state.codePath]) {
      ensureWorkbenchDefaults();
      populateOccGroups();
      writeFormMeta();
      showPathPick(false);
      render();
    } else {
      state.codePath = null;
      showPathPick(true);
      saveState();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
