/**
 * Deflagration Vent Sizing — NFPA 68 preliminary calculator
 * Primary use: room vent sizing (L×W×H). Also process equipment dust/gas.
 *
 * Basis: NFPA 68-2023 (equations in assets/nfpa68-engine.js).
 * Dust: Eq. 8.2.1.1 Av0 = 1e-4 (1 + 1.54 Pstat^(4/3)) KSt V^(3/4) sqrt(Pmax/Pred - 1), Pmax = unvented dust Pmax;
 *       Eq. 8.2.2.3 elongated multiplier for 2 < L/D <= 6.
 * Gas:  Eq. 7.2.1a/b (Pred <= 0.5 bar-g) or Eq. 7.2.2a/b (Pred > 0.5 bar-g), with lambda per 7.2.6.
 * "Allowable enclosure pressure" (#pmax) is the structural strength check only; it is not the Pmax in the equations.
 */
(function () {
  "use strict";

  var APP_VERSION = "1.2.1";
  var EDITION = "NFPA 68-2023";
  var E = window.NFPA68;
  var STORAGE_KEY = "deflagrationVent.v1";

  var FT3_PER_M3 = 35.3146667;
  var FT2_PER_M2 = 10.7639104;
  var PSI_PER_BAR = 14.5037738;
  var FT_PER_M = 3.2808399;

  /** Construction presets — values stored as US psi for room defaults; converted in apply */
  var CONSTRUCTION = {
    light_metal: {
      label: "Light metal / panel building",
      predPsi: 1.5,
      pmaxPsi: 2.5,
      pstatPsi: 0.5,
      note: "Weak enclosure — low Pred → large vents typical for metal buildings / panel walls.",
    },
    masonry: {
      label: "Masonry / tilt-up",
      predPsi: 2.5,
      pmaxPsi: 4.0,
      pstatPsi: 0.75,
      note: "Moderate strength — confirm allowable pressure with structural engineer.",
    },
    concrete: {
      label: "Reinforced concrete",
      predPsi: 3.5,
      pmaxPsi: 6.0,
      pstatPsi: 1.0,
      note: "Higher strength may allow higher Pred (smaller vents) — verify structure.",
    },
    custom: {
      label: "Custom",
      predPsi: null,
      pmaxPsi: null,
      pstatPsi: null,
      note: "Enter Pstat, Pred, and strength manually.",
    },
  };

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
    }, 2800);
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
    return Number.isFinite(n) ? n : fb != null ? fb : NaN;
  }

  function round3(n) {
    return Math.round(n * 1000) / 1000;
  }
  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  function isRoomPath(path) {
    return path === "room_dust" || path === "room_gas";
  }
  function isDustPath(path) {
    return path === "room_dust" || path === "process_dust";
  }
  function isGasPath(path) {
    return path === "room_gas" || path === "process_gas";
  }

  function pathMeta(path) {
    var map = {
      room_dust: {
        tag: "ROOM · DUST",
        title: "Room vent sizing — combustible dust",
        short: "Room (dust)",
      },
      room_gas: {
        tag: "ROOM · GAS",
        title: "Room vent sizing — flammable gas / vapor",
        short: "Room (gas)",
      },
      process_dust: {
        tag: "PROCESS · DUST",
        title: "Process equipment — combustible dust",
        short: "Process (dust)",
      },
      process_gas: {
        tag: "PROCESS · GAS",
        title: "Process equipment — flammable gas / vapor",
        short: "Process (gas)",
      },
    };
    return map[path] || { tag: "—", title: "—", short: "—" };
  }

  function defaultState() {
    return {
      hazardPath: null,
      projectName: "",
      units: "us",
      // room
      roomL: 40,
      roomW: 30,
      roomH: 12,
      fillFrac: 1.0,
      construction: "light_metal",
      ventLocation: "wall",
      wallAreaAvail: "",
      // process
      volume: 350,
      ldRatio: 1.5,
      length: "",
      diameter: "",
      // shared deflagration
      kst: 150,
      kg: 100,
      pstat: 0.5,
      pred: 1.5,
      pmax: 2.5,
      pmaxMat: 116,
      su: 46,
      cd: 0.7,
      p0: 0,
      asOverride: "",
      aobs: "",
      efficiency: 1.0,
      panelArea: "",
      notes: "",
    };
  }

  var state = defaultState();

  /**
   * Room L/D per NFPA 68-2023 6.4.3: H = longest dimension; Dhe from the cross-section
   * normal to it (6.4.3.6.2 when aspect ratio <= 1.2, else 6.4.3.6.3); L/D = H/Dhe (6.4.3.7).
   */
  function roomGeometrySI(L, W, H, fill) {
    if (!(L > 0) || !(W > 0) || !(H > 0)) {
      return { V: NaN, Veff: NaN, LD: NaN, Llong: NaN, Deq: NaN, floor: NaN };
    }
    var V = L * W * H;
    var fillF = Math.min(1, Math.max(0.05, fill || 1));
    var Veff = V * fillF;
    var g = E.roomGeometry(L, W, H);
    var Llong = g.Llong;
    var Deq = g.Dhe;
    var LD = g.LD;
    return {
      As: g.As,
      V: V,
      Veff: Veff,
      LD: LD,
      Llong: Llong,
      Deq: Deq,
      floor: L * W,
      fill: fillF,
    };
  }

  function toSI() {
    var us = state.units === "us";
    var path = state.hazardPath;
    var room = isRoomPath(path);

    var roomL = num(state.roomL, NaN);
    var roomW = num(state.roomW, NaN);
    var roomH = num(state.roomH, NaN);
    var fill = num(state.fillFrac, 1);
    var V = num(state.volume, NaN);
    var L = num(state.length, NaN);
    var D = num(state.diameter, NaN);
    var LD = num(state.ldRatio, NaN);
    var Pstat = num(state.pstat, NaN);
    var Pred = num(state.pred, NaN);
    var Pmax = num(state.pmax, NaN);
    var Kst = num(state.kst, NaN);
    var PmaxMat = num(state.pmaxMat, NaN);
    var Su = num(state.su, NaN) / 100;
    var Cd = num(state.cd, 0.7);
    var P0 = num(state.p0, 0);
    var AsOver = num(state.asOverride, NaN);
    var Aobs = num(state.aobs, NaN);
    var wallAvail = num(state.wallAreaAvail, NaN);
    var panelAreaUser = num(state.panelArea, NaN);

    if (us) {
      if (Number.isFinite(roomL)) roomL = roomL / FT_PER_M;
      if (Number.isFinite(roomW)) roomW = roomW / FT_PER_M;
      if (Number.isFinite(roomH)) roomH = roomH / FT_PER_M;
      if (Number.isFinite(V)) V = V / FT3_PER_M3;
      if (Number.isFinite(L)) L = L / FT_PER_M;
      if (Number.isFinite(D)) D = D / FT_PER_M;
      if (Number.isFinite(Pstat)) Pstat = Pstat / PSI_PER_BAR;
      if (Number.isFinite(Pred)) Pred = Pred / PSI_PER_BAR;
      if (Number.isFinite(Pmax)) Pmax = Pmax / PSI_PER_BAR;
      if (Number.isFinite(PmaxMat)) PmaxMat = PmaxMat / PSI_PER_BAR;
      if (Number.isFinite(P0)) P0 = P0 / PSI_PER_BAR;
      if (Number.isFinite(AsOver)) AsOver = AsOver / FT2_PER_M2;
      if (Number.isFinite(Aobs)) Aobs = Aobs / FT2_PER_M2;
      if (Number.isFinite(wallAvail)) wallAvail = wallAvail / FT2_PER_M2;
      if (Number.isFinite(panelAreaUser)) panelAreaUser = panelAreaUser / FT2_PER_M2;
    }

    var geom = {
      V: V,
      Veff: V,
      LD: LD,
      room: null,
    };

    if (room) {
      var rg = roomGeometrySI(roomL, roomW, roomH, fill);
      geom.V = rg.V;
      geom.Veff = rg.Veff;
      geom.LD = rg.LD;
      geom.room = rg;
      geom.roomL = roomL;
      geom.roomW = roomW;
      geom.roomH = roomH;
    } else {
      if (Number.isFinite(L) && Number.isFinite(D) && D > 0) {
        geom.LD = L / D;
      }
      if (!(geom.LD > 0)) geom.LD = 1.5;
      geom.Veff = geom.V;
    }

    return {
      V: geom.V,
      Veff: geom.Veff,
      LD: geom.LD,
      L: L,
      D: D,
      room: geom.room,
      roomL: geom.roomL,
      roomW: geom.roomW,
      roomH: geom.roomH,
      Pstat: Pstat,
      Pred: Pred,
      Pmax: Pmax,
      Kst: Kst,
      PmaxMat: PmaxMat,
      Su: Su,
      Cd: Cd > 0 ? Cd : 0.7,
      P0: Number.isFinite(P0) ? P0 : 0,
      AsOver: AsOver,
      Aobs: Aobs,
      Ef: Math.min(1, Math.max(0.1, num(state.efficiency, 1))),
      panelAreaUser: panelAreaUser,
      wallAvail: wallAvail,
      fill: Math.min(1, Math.max(0.05, fill || 1)),
    };
  }

  function stClass(kst) {
    if (!(kst > 0)) return "—";
    if (kst <= 200) return "St 1";
    if (kst <= 300) return "St 2";
    return "St 3";
  }

  function calc() {
    var si = toSI();
    var path = state.hazardPath;
    var dust = isDustPath(path);
    var room = isRoomPath(path);
    var warnings = [];
    var errors = [];

    var Vuse = dust ? si.Veff : si.V;
    if (!(Vuse > 0)) {
      errors.push(
        room
          ? "Enter positive room length, width, and height."
          : "Enter a positive enclosure volume."
      );
    }
    if (!(si.Pstat > 0)) errors.push("Enter Pstat > 0.");
    if (!(si.Pred > 0)) errors.push("Enter Pred > 0.");
    if (si.Pred > 0 && si.Pstat > 0 && si.Pred <= si.Pstat) {
      errors.push("Pred must be greater than Pstat.");
    }
    if (dust && !(si.Kst > 0)) errors.push("Enter Kst > 0.");
    if (!dust && !(si.Su > 0)) errors.push("Enter fundamental burning velocity Su > 0.");
    if (!(si.PmaxMat > 0)) {
      errors.push("Enter Pmax (maximum unvented deflagration pressure of the " + (dust ? "dust" : "gas mixture") + ").");
    } else if (si.Pred > 0 && si.Pred >= si.PmaxMat) {
      errors.push("Pred must be less than the material Pmax.");
    }
    if (dust && si.PmaxMat > 0 && (si.PmaxMat < 5 || si.PmaxMat > 12)) {
      warnings.push("NFPA 68-2023 8.2.1.3: Eq. 8.2.1.1 applies for 5 bar-g <= Pmax <= 12 bar-g.");
    }
    if (dust && si.Kst > 0 && (si.Kst < 10 || si.Kst > 800)) {
      warnings.push("NFPA 68-2023 8.2.1.3: Eq. 8.2.1.1 applies for 10 <= KSt <= 800 bar-m/s.");
    }
    if (dust && si.Pstat >= 0.75) {
      warnings.push("NFPA 68-2023 8.2.1.3: Pstat must be < 0.75 bar-g.");
    }
    if (!dust && si.Pred > 0.1 && si.Pstat >= 0.75 * si.Pred && si.Pred <= 0.5) {
      warnings.push("NFPA 68-2023 7.2.1.2: Pstat must be < 0.75 Pred.");
    }
    if (!dust && si.Su >= 3) warnings.push("NFPA 68-2023 7.2.6.8: lambda equations limited to Su < 3 m/s.");
    if (!dust && si.PmaxMat >= 10) warnings.push("NFPA 68-2023 7.2.6.8: lambda equations limited to Pmax < 10 bar-g.");
    if (room && si.fill < 1 && !dust) {
      warnings.push(
        "Partial fill fraction is not applied on the gas path (NFPA 68-2023 7.3 partial-volume method not modeled) — full volume used."
      );
    } else if (room && si.fill < 1) {
      warnings.push(
        "Partial fill fraction " +
          round2(si.fill) +
          " applied to volume — only use with documented partial-volume justification."
      );
    }

    var LD = si.LD;
    if (!(LD > 0)) {
      LD = 1.5;
      if (!room) warnings.push("L/D not set — defaulted to 1.5.");
    }
    if (LD > 6) {
      warnings.push(
        "L/D > 6 is outside the simple elongated formula — use full NFPA 68 / specialist analysis for rooms or equipment."
      );
    }
    if (room && Number.isFinite(si.V) && si.V > 10000) {
      warnings.push(
        "Very large room volume — confirm applicability of basic vent equations and structural design."
      );
    }

    var Av0 = NaN;
    var gas = null;
    var gasGeom = null;
    var mult = 1;
    var formula = "";
    var regime = "compact";

    if (!errors.length) {
      if (dust) {
        Av0 = E.dustAv0(Vuse, si.Kst, si.Pstat, si.Pred, si.PmaxMat);
        formula =
          "Av₀ = 1×10⁻⁴ × (1 + 1.54·Pstat^(4/3)) × KSt × V^(3/4) × √(Pmax/Pred − 1)  [" + EDITION + " Eq. 8.2.1.1]";
        if (LD > 2 && LD <= 6) {
          mult = E.dustLDMultiplier(LD, si.Pred, 0);
          regime = "elongated";
          formula += "; Av₁ = Av₀ × [1 + 0.6·(L/D−2)^0.75·exp(−0.95·Pred²)]  [Eq. 8.2.2.3]";
        } else if (LD > 6) {
          mult = E.dustLDMultiplier(6, si.Pred, 0);
          regime = "elongated (L/D>6 estimate)";
        } else {
          regime = room ? "room · compact (L/D ≤ 2)" : "compact (L/D ≤ 2)";
        }
        if (room && LD <= 2) regime = "room · compact (L/D ≤ 2)";
        if (room && LD > 2 && LD <= 6) regime = "room · elongated";
      } else {
        if (room && si.room) {
          gasGeom = { As: si.room.As, Dhe: si.room.Deq, LD: LD, shape: "rectangular room" };
        } else {
          gasGeom = E.cylinderGeometry(Vuse, LD, si.L, si.D);
        }
        if (si.AsOver > 0) gasGeom = Object.assign({}, gasGeom, { As: si.AsOver, shape: gasGeom.shape + ", As entered" });
        gas = E.gasVent({
          As: gasGeom.As,
          Dhe: gasGeom.Dhe,
          LD: LD,
          Su: si.Su,
          Pmax: si.PmaxMat,
          Pred: si.Pred,
          Pstat: si.Pstat,
          P0: si.P0,
          Cd: si.Cd,
          Aobs: si.Aobs,
        });
        Av0 = gas.Av;
        if (gas.eq === "7.2.2") {
          formula =
            "Av₀ = As·[1 − ((Pred+1)/(Pmax+1))^(1/γb)] / [((Pred+1)/(Pmax+1))^(1/γb) − δ] · (Su·ρu/Gu)·(λ/Cd)  [" +
            EDITION + " Eq. 7.2.2a/b, Pred > 0.5 bar-g]";
        } else {
          formula =
            "Av₀ = As·C/√Pred, C = (Su·ρu·λ/(2·Gu·Cd))·[((Pmax+1)/(P0+1))^(1/γb) − 1]·(P0+1)^½  [" +
            EDITION + " Eq. 7.2.1a/b, Pred ≤ 0.5 bar-g]";
        }
        formula += "; λ per 7.2.6 (iterated on vent diameter); ρu 1.2 kg/m³, Gu 230.1 kg/m²·s, γb 1.15 (7.2.3)";
        regime = (room ? "room · gas " : "gas ") + "Eq. " + (gas.eq || "—");
        if (LD > 5) {
          warnings.push("L/D > 5 is outside NFPA 68-2023 Chapter 7 (7.1.1) — see Chapter 9 / specialist analysis.");
        }
        if (Number.isFinite(si.Pred) && si.Pred > 2 && LD >= 2.5) {
          warnings.push("NFPA 68-2023 7.2.6.7: L/D correction to λ is limited to Pred ≤ 2 bar-g.");
        }
      }
    }

    var Av = Number.isFinite(Av0) ? Av0 * mult : NaN;
    var Ef = si.Ef;
    var Ageom = Number.isFinite(Av) && Ef > 0 ? Av / Ef : NaN;

    if (Number.isFinite(si.Pmax) && si.Pmax > 0 && Number.isFinite(si.Pred)) {
      if (si.Pred > si.Pmax) {
        errors.push(
          "Pred exceeds allowable enclosure pressure — increase vent area or strengthen the room/structure."
        );
      } else if (si.Pred > (2 / 3) * si.Pmax) {
        warnings.push(
          "Pred is above ⅔ of allowable pressure — verify with structural engineer / NFPA 68 limits."
        );
      }
    }

    if (dust && Number.isFinite(si.Pred) && Number.isFinite(si.Pstat)) {
      if (si.Pred < 0.05 || si.Pred > 2.0) {
        warnings.push(
          "Pred outside common published envelope — confirm NFPA 68 edition limits for this application."
        );
      }
    }

    var panels = null;
    if (Number.isFinite(Ageom) && Number.isFinite(si.panelAreaUser) && si.panelAreaUser > 0) {
      panels = Math.ceil(Ageom / si.panelAreaUser - 1e-12);
    }

    var wallCheck = null;
    if (room && Number.isFinite(Ageom) && Number.isFinite(si.wallAvail) && si.wallAvail > 0) {
      wallCheck = {
        avail: si.wallAvail,
        need: Ageom,
        ok: si.wallAvail + 1e-9 >= Ageom,
        ratio: Ageom > 0 ? si.wallAvail / Ageom : NaN,
      };
      if (!wallCheck.ok) {
        warnings.push(
          "Available wall/roof vent area is less than required geometric area — add vents or strengthen structure / raise Pred only if justified."
        );
      }
    }

    var ok = errors.length === 0 && Number.isFinite(Av) && Av > 0;
    var status = "incomplete";
    if (errors.length) status = "fail";
    else if (ok && warnings.length) status = "warn";
    else if (ok) status = "pass";

    return {
      si: si,
      Av0: Av0,
      mult: mult,
      Av: Av,
      Ageom: Ageom,
      Ef: Ef,
      LD: LD,
      regime: regime,
      formula: formula,
      warnings: warnings,
      errors: errors,
      status: status,
      panels: panels,
      wallCheck: wallCheck,
      gas: gas,
      gasGeom: gasGeom,
      edition: EDITION,
      st: dust ? stClass(si.Kst) : "—",
      room: room,
      dust: dust,
      meta: pathMeta(path),
    };
  }

  function fmtArea(m2) {
    if (!Number.isFinite(m2)) return "—";
    if (state.units === "us") return round3(m2 * FT2_PER_M2).toFixed(3) + " ft²";
    return round3(m2).toFixed(3) + " m²";
  }
  function fmtVol(m3) {
    if (!Number.isFinite(m3)) return "—";
    if (state.units === "us") return round2(m3 * FT3_PER_M3).toFixed(1) + " ft³";
    return round2(m3).toFixed(2) + " m³";
  }
  function fmtP(bar) {
    if (!Number.isFinite(bar)) return "—";
    if (state.units === "us") return round2(bar * PSI_PER_BAR).toFixed(2) + " psi g";
    return round3(bar).toFixed(3) + " bar g";
  }
  function fmtLen(m) {
    if (!Number.isFinite(m)) return "—";
    if (state.units === "us") return round2(m * FT_PER_M).toFixed(2) + " ft";
    return round2(m).toFixed(2) + " m";
  }

  function updateUnitLabels() {
    var us = state.units === "us";
    document.querySelectorAll(".u-vol").forEach(function (el) {
      el.textContent = us ? "(ft³)" : "(m³)";
    });
    document.querySelectorAll(".u-len").forEach(function (el) {
      el.textContent = us ? "(ft)" : "(m)";
    });
    document.querySelectorAll(".u-p").forEach(function (el) {
      el.textContent = us ? "(psi g)" : "(bar g)";
    });
    document.querySelectorAll(".u-area").forEach(function (el) {
      el.textContent = us ? "(ft²)" : "(m²)";
    });
    if ($("mAvUnit")) $("mAvUnit").textContent = us ? "ft²" : "m²";
    if ($("mAeffUnit")) $("mAeffUnit").textContent = us ? "ft² geometric" : "m² geometric";
  }

  function openHelp() {
    var m = $("helpModal");
    if (!m) return;
    m.classList.remove("hidden");
    m.setAttribute("aria-hidden", "false");
  }
  function closeHelp() {
    var m = $("helpModal");
    if (!m) return;
    m.classList.add("hidden");
    m.setAttribute("aria-hidden", "true");
  }

  function showPath(show) {
    if ($("pathPick")) {
      if (show) $("pathPick").classList.remove("hidden");
      else $("pathPick").classList.add("hidden");
    }
    if ($("workbench")) {
      if (show) $("workbench").classList.add("hidden");
      else $("workbench").classList.remove("hidden");
    }
    ["btnPrintPdf", "btnSave", "btnReset"].forEach(function (id) {
      var el = $(id);
      if (el) el.style.display = show ? "none" : "";
    });
  }

  function applyConstructionPreset(skipIfCustom) {
    var key = state.construction || "light_metal";
    var c = CONSTRUCTION[key];
    if (!c || key === "custom") return;
    if (skipIfCustom && state.construction === "custom") return;
    var us = state.units === "us";
    if (c.predPsi != null) {
      state.pred = us ? c.predPsi : round3(c.predPsi / PSI_PER_BAR);
      if ($("pred")) $("pred").value = state.pred;
    }
    if (c.pstatPsi != null) {
      state.pstat = us ? c.pstatPsi : round3(c.pstatPsi / PSI_PER_BAR);
      if ($("pstat")) $("pstat").value = state.pstat;
    }
    if (c.pmaxPsi != null) {
      state.pmax = us ? c.pmaxPsi : round3(c.pmaxPsi / PSI_PER_BAR);
      if ($("pmax")) $("pmax").value = state.pmax;
    }
    if ($("constructionHint")) $("constructionHint").textContent = c.note;
  }

  function updatePathUI() {
    var path = state.hazardPath;
    var room = isRoomPath(path);
    var dust = isDustPath(path);
    var meta = pathMeta(path);

    if ($("panelRoomGeom")) {
      if (room) $("panelRoomGeom").classList.remove("hidden");
      else $("panelRoomGeom").classList.add("hidden");
    }
    if ($("panelRoomStruct")) {
      if (room) $("panelRoomStruct").classList.remove("hidden");
      else $("panelRoomStruct").classList.add("hidden");
    }
    if ($("panelProcessGeom")) {
      if (room) $("panelProcessGeom").classList.add("hidden");
      else $("panelProcessGeom").classList.remove("hidden");
    }
    if ($("fieldKst")) {
      if (dust) $("fieldKst").classList.remove("hidden");
      else $("fieldKst").classList.add("hidden");
    }
    document.querySelectorAll(".gas-only").forEach(function (el) {
      if (dust) el.classList.add("hidden");
      else el.classList.remove("hidden");
    });
    if ($("pathBanner")) {
      $("pathBanner").innerHTML =
        '<span class="tag">' +
        escapeHtml(meta.tag) +
        "</span> " +
        escapeHtml(meta.title) +
        " · " + EDITION + " · IBC/IFC context";
    }
    if ($("labelProject")) {
      $("labelProject").textContent = room
        ? "Project / room name"
        : "Project / equipment tag";
    }
    if ($("mGeomLabel")) {
      $("mGeomLabel").textContent = room ? "Room L/D" : "L/D";
    }
    if ($("volumeHint")) {
      $("volumeHint").textContent = dust
        ? "Dirty volume for dust collectors when applicable."
        : "Free volume of the protected enclosure.";
    }
  }

  function selectPath(path) {
    state.hazardPath = path;
    // Room defaults use US construction presets
    if (isRoomPath(path)) {
      if (!state.construction) state.construction = "light_metal";
      applyConstructionPreset(false);
    } else {
      // process defaults: SI-friendly vessel pressures in current units
      if (state.units === "us") {
        state.pstat = state.pstat || 1.5;
        state.pred = state.pred || 3.0;
      } else {
        state.pstat = 0.1;
        state.pred = 0.2;
      }
      writeForm();
    }
    showPath(false);
    updatePathUI();
    render();
    toast(pathMeta(path).short + " selected");
  }

  function readForm() {
    state.projectName = ($("projectName") && $("projectName").value.trim()) || "";
    state.units = ($("units") && $("units").value) || "us";
    state.roomL = ($("roomL") && $("roomL").value) || "";
    state.roomW = ($("roomW") && $("roomW").value) || "";
    state.roomH = ($("roomH") && $("roomH").value) || "";
    state.fillFrac = ($("fillFrac") && $("fillFrac").value) || "1";
    state.construction = ($("construction") && $("construction").value) || "light_metal";
    state.ventLocation = ($("ventLocation") && $("ventLocation").value) || "wall";
    state.wallAreaAvail = ($("wallAreaAvail") && $("wallAreaAvail").value) || "";
    state.volume = ($("volume") && $("volume").value) || "";
    state.ldRatio = ($("ldRatio") && $("ldRatio").value) || "";
    state.length = ($("length") && $("length").value) || "";
    state.diameter = ($("diameter") && $("diameter").value) || "";
    state.kst = ($("kst") && $("kst").value) || "";
    state.su = ($("su") && $("su").value) || "";
    state.pmaxMat = ($("pmaxMat") && $("pmaxMat").value) || "";
    state.cd = ($("cd") && $("cd").value) || "0.7";
    state.p0 = ($("p0") && $("p0").value) || "0";
    state.asOverride = ($("asOverride") && $("asOverride").value) || "";
    state.aobs = ($("aobs") && $("aobs").value) || "";
    state.pstat = ($("pstat") && $("pstat").value) || "";
    state.pred = ($("pred") && $("pred").value) || "";
    state.pmax = ($("pmax") && $("pmax").value) || "";
    state.efficiency = ($("efficiency") && $("efficiency").value) || "1";
    state.panelArea = ($("panelArea") && $("panelArea").value) || "";
    state.notes = ($("notes") && $("notes").value.trim()) || "";
  }

  function writeForm() {
    if ($("projectName")) $("projectName").value = state.projectName;
    if ($("units")) $("units").value = state.units;
    if ($("roomL")) $("roomL").value = state.roomL;
    if ($("roomW")) $("roomW").value = state.roomW;
    if ($("roomH")) $("roomH").value = state.roomH;
    if ($("fillFrac")) $("fillFrac").value = state.fillFrac;
    if ($("construction")) $("construction").value = state.construction;
    if ($("ventLocation")) $("ventLocation").value = state.ventLocation;
    if ($("wallAreaAvail")) $("wallAreaAvail").value = state.wallAreaAvail;
    if ($("volume")) $("volume").value = state.volume;
    if ($("ldRatio")) $("ldRatio").value = state.ldRatio;
    if ($("length")) $("length").value = state.length;
    if ($("diameter")) $("diameter").value = state.diameter;
    if ($("kst")) $("kst").value = state.kst;
    if ($("su")) $("su").value = state.su;
    if ($("pmaxMat")) $("pmaxMat").value = state.pmaxMat;
    if ($("cd")) $("cd").value = state.cd;
    if ($("p0")) $("p0").value = state.p0;
    if ($("asOverride")) $("asOverride").value = state.asOverride;
    if ($("aobs")) $("aobs").value = state.aobs;
    if ($("pstat")) $("pstat").value = state.pstat;
    if ($("pred")) $("pred").value = state.pred;
    if ($("pmax")) $("pmax").value = state.pmax;
    if ($("efficiency")) $("efficiency").value = state.efficiency;
    if ($("panelArea")) $("panelArea").value = state.panelArea;
    if ($("notes")) $("notes").value = state.notes;
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
      // migrate old dust|gas paths
      if (d.hazardPath === "dust") state.hazardPath = "process_dust";
      if (d.hazardPath === "gas") state.hazardPath = "process_gas";
    } catch (_) { /* ignore */ }
  }

  function render() {
    if (!state.hazardPath) {
      showPath(true);
      saveState();
      return;
    }
    showPath(false);
    updatePathUI();
    updateUnitLabels();
    readForm();

    // Process L/D helper
    if (!isRoomPath(state.hazardPath)) {
      var L = num(state.length, NaN);
      var D = num(state.diameter, NaN);
      if (Number.isFinite(L) && Number.isFinite(D) && D > 0 && $("ldRatio")) {
        var ld = round2(L / D);
        state.ldRatio = ld;
        $("ldRatio").value = ld;
      }
    }

    var r = calc();
    var us = state.units === "us";

    // Room displays
    if (r.room && r.si.room) {
      if ($("roomVolDisplay")) {
        $("roomVolDisplay").textContent =
          fmtVol(r.si.V) +
          (r.si.fill < 1
            ? " geometric · V_eff " + fmtVol(r.si.Veff)
            : "");
      }
      if ($("roomLDDisplay")) {
        $("roomLDDisplay").textContent = Number.isFinite(r.LD)
          ? round2(r.LD).toFixed(2) +
            "  (L=" +
            fmtLen(r.si.room.Llong) +
            ", D_he=" +
            fmtLen(r.si.room.Deq) +
            ")"
          : "—";
      }
    }

    if ($("mAv")) {
      $("mAv").textContent = Number.isFinite(r.Av)
        ? (us ? round3(r.Av * FT2_PER_M2) : round3(r.Av)).toFixed(3)
        : "—";
    }
    if ($("mAeff")) {
      $("mAeff").textContent = Number.isFinite(r.Ageom)
        ? (us ? round3(r.Ageom * FT2_PER_M2) : round3(r.Ageom)).toFixed(3)
        : "—";
    }
    if ($("mLD")) $("mLD").textContent = Number.isFinite(r.LD) ? round2(r.LD).toFixed(2) : "—";
    if ($("mLDNote")) $("mLDNote").textContent = r.regime || "";

    var statusEl = $("mStatus");
    var sub = $("mStatusSub");
    var metric = statusEl && statusEl.closest(".metric");
    if (metric) metric.classList.remove("ok", "bad", "warn");
    if (statusEl) {
      if (r.status === "pass") {
        statusEl.textContent = "OK";
        if (sub) sub.textContent = "Inputs in range";
        if (metric) metric.classList.add("ok");
      } else if (r.status === "warn") {
        statusEl.textContent = "CHECK";
        if (sub) sub.textContent = r.warnings.length + " warning(s)";
        if (metric) metric.classList.add("warn");
      } else if (r.status === "fail") {
        statusEl.textContent = "ERROR";
        if (sub) sub.textContent = r.errors[0] || "Invalid inputs";
        if (metric) metric.classList.add("bad");
      } else {
        statusEl.textContent = "—";
        if (sub) sub.textContent = "Enter inputs";
      }
    }

    var box = $("resultBox");
    if (box) {
      var roomLines = "";
      if (r.room && r.si.room) {
        roomLines =
          '<div class="row"><span>Room size (L×W×H)</span><strong>' +
          fmtLen(r.si.roomL) +
          " × " +
          fmtLen(r.si.roomW) +
          " × " +
          fmtLen(r.si.roomH) +
          "</strong></div>" +
          '<div class="row"><span>Floor area</span><strong>' +
          fmtArea(r.si.room.floor) +
          "</strong></div>" +
          '<div class="row"><span>Vent location</span><strong>' +
          escapeHtml(state.ventLocation) +
          "</strong></div>" +
          '<div class="row"><span>Construction preset</span><strong>' +
          escapeHtml(
            (CONSTRUCTION[state.construction] && CONSTRUCTION[state.construction].label) ||
              state.construction
          ) +
          "</strong></div>";
      }
      var wallLine = "";
      if (r.wallCheck) {
        wallLine =
          '<div class="row"><span>Wall/roof area available</span><strong>' +
          fmtArea(r.wallCheck.avail) +
          (r.wallCheck.ok ? " · meets need" : " · SHORT") +
          "</strong></div>";
      }
      var panelLine =
        r.panels != null
          ? '<div class="row"><span>Panels needed (at stated size)</span><strong>' +
            r.panels +
            "</strong></div>"
          : "";

      box.innerHTML =
        '<div class="row"><span>Required free vent area A<sub>v</sub></span><strong>' +
        fmtArea(r.Av) +
        "</strong></div>" +
        '<div class="row"><span>Geometric area (÷ E<sub>f</sub>)</span><strong>' +
        fmtArea(r.Ageom) +
        "</strong></div>" +
        '<div class="row"><span>Vent efficiency E<sub>f</sub></span><strong>' +
        round2(r.Ef).toFixed(2) +
        "</strong></div>" +
        '<div class="row"><span>Effective volume V_eff</span><strong>' +
        fmtVol(r.si.Veff) +
        "</strong></div>" +
        roomLines +
        '<div class="row"><span>L/D · regime</span><strong>' +
        (Number.isFinite(r.LD) ? round2(r.LD).toFixed(2) : "—") +
        " · " +
        escapeHtml(r.regime) +
        "</strong></div>" +
        (r.dust
          ? '<div class="row"><span>K<sub>St</sub> · St class</span><strong>' +
            (Number.isFinite(r.si.Kst) ? r.si.Kst : "—") +
            " bar·m/s · " +
            r.st +
            "</strong></div>"
          : '<div class="row"><span>S<sub>u</sub></span><strong>' +
            (Number.isFinite(r.si.Su) ? round2(r.si.Su * 100) : "—") +
            " cm/s</strong></div>" +
            '<div class="row"><span>A<sub>s</sub> · D<sub>he</sub></span><strong>' +
            (r.gasGeom ? fmtArea(r.gasGeom.As) + " · " + fmtLen(r.gasGeom.Dhe) : "—") +
            "</strong></div>" +
            '<div class="row"><span>λ (7.2.6) · equation</span><strong>' +
            (r.gas && Number.isFinite(r.gas.lambda) ? round3(r.gas.lambda).toFixed(3) : "—") +
            " · Eq. " +
            escapeHtml((r.gas && r.gas.eq) || "—") +
            "</strong></div>") +
        '<div class="row"><span>P<sub>max</sub> (unvented, material)</span><strong>' +
        fmtP(r.si.PmaxMat) +
        "</strong></div>" +
        '<div class="row"><span>Code basis</span><strong id="mEditionRow">' +
        EDITION +
        "</strong></div>" +
        '<div class="row"><span>P<sub>stat</sub> / P<sub>red</sub></span><strong>' +
        fmtP(r.si.Pstat) +
        " / " +
        fmtP(r.si.Pred) +
        "</strong></div>" +
        wallLine +
        panelLine +
        (r.formula
          ? '<p class="hint" style="margin:0.75rem 0 0">' + escapeHtml(r.formula) + "</p>"
          : "");
    }

    var chk = $("checkBox");
    if (chk) {
      if (r.errors.length) {
        chk.className = "callout bad";
        chk.innerHTML =
          "<strong>Errors</strong><br>" + r.errors.map(escapeHtml).join("<br>");
      } else if (r.warnings.length) {
        chk.className = "callout warn";
        chk.innerHTML =
          "<strong>Warnings</strong><br>" +
          r.warnings.map(escapeHtml).join("<br>");
      } else if (Number.isFinite(r.Av)) {
        chk.className = "callout ok";
        var roomNote = r.room
          ? " Distribute vents on exterior walls/roof so the fireball discharges outdoors safely."
          : "";
        chk.innerHTML =
          "<strong>Calculation complete.</strong> Provide geometric vent area of at least <strong>" +
          fmtArea(r.Ageom) +
          "</strong> after efficiency." +
          roomNote;
      } else {
        chk.className = "callout info";
        chk.textContent = "Enter geometry and deflagration parameters.";
      }
    }

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
    var roomBlock = "";
    if (r.room && r.si.room) {
      roomBlock =
        "<p><strong>Room L×W×H:</strong> " +
        fmtLen(r.si.roomL) +
        " × " +
        fmtLen(r.si.roomW) +
        " × " +
        fmtLen(r.si.roomH) +
        "<br><strong>Floor area:</strong> " +
        fmtArea(r.si.room.floor) +
        " · <strong>Fill fraction:</strong> " +
        round2(r.si.fill).toFixed(2) +
        "<br><strong>Construction:</strong> " +
        escapeHtml(
          (CONSTRUCTION[state.construction] && CONSTRUCTION[state.construction].label) ||
            "—"
        ) +
        " · <strong>Vent location:</strong> " +
        escapeHtml(state.ventLocation) +
        "</p>";
    }
    var wall =
      r.wallCheck
        ? "<p><strong>Available wall/roof area:</strong> " +
          fmtArea(r.wallCheck.avail) +
          " · " +
          (r.wallCheck.ok ? "Meets" : "SHORT of") +
          " required " +
          fmtArea(r.wallCheck.need) +
          "</p>"
        : "";
    return (
      logo +
      "<h1>Deflagration Vent Sizing</h1>" +
      "<p><strong>Code basis:</strong> " + EDITION + "</p>" +
      "<p><strong>Application:</strong> " +
      escapeHtml(r.meta.title) +
      "<br><strong>Project:</strong> " +
      escapeHtml(state.projectName || "—") +
      "<br><strong>Units:</strong> " +
      (state.units === "us" ? "US customary" : "SI") +
      "</p>" +
      roomBlock +
      "<h2>Results</h2>" +
      "<p><strong>Required free vent area A<sub>v</sub>:</strong> " +
      fmtArea(r.Av) +
      "<br><strong>Geometric area (÷ E<sub>f</sub> = " +
      round2(r.Ef).toFixed(2) +
      "):</strong> " +
      fmtArea(r.Ageom) +
      "<br><strong>V_eff:</strong> " +
      fmtVol(r.si.Veff) +
      " · <strong>L/D:</strong> " +
      (Number.isFinite(r.LD) ? round2(r.LD).toFixed(2) : "—") +
      " (" +
      escapeHtml(r.regime) +
      ")<br>" +
      (r.dust
        ? "<strong>K<sub>St</sub>:</strong> " +
          (Number.isFinite(r.si.Kst) ? r.si.Kst : "—") +
          " bar·m/s (" +
          r.st +
          ")"
        : "<strong>S<sub>u</sub>:</strong> " +
          (Number.isFinite(r.si.Su) ? round2(r.si.Su * 100) : "—") +
          " cm/s · <strong>λ:</strong> " +
          (r.gas && Number.isFinite(r.gas.lambda) ? round3(r.gas.lambda).toFixed(3) : "—") +
          " · <strong>A<sub>s</sub>:</strong> " +
          (r.gasGeom ? fmtArea(r.gasGeom.As) : "—") +
          " · Eq. " +
          escapeHtml((r.gas && r.gas.eq) || "—")) +
      "<br><strong>P<sub>max</sub> (material):</strong> " +
      fmtP(r.si.PmaxMat) +
      "<br><strong>P<sub>stat</sub> / P<sub>red</sub>:</strong> " +
      fmtP(r.si.Pstat) +
      " / " +
      fmtP(r.si.Pred) +
      (r.panels != null ? "<br><strong>Panels:</strong> " + r.panels : "") +
      "</p>" +
      wall +
      (r.formula ? "<p style='font-size:0.88rem'>" + escapeHtml(r.formula) + "</p>" : "") +
      (r.errors.length
        ? "<p><strong>Errors:</strong> " + r.errors.map(escapeHtml).join("; ") + "</p>"
        : "") +
      (r.warnings.length
        ? "<p><strong>Warnings:</strong> " + r.warnings.map(escapeHtml).join("; ") + "</p>"
        : "") +
      (state.notes
        ? "<p><strong>Notes:</strong> " + escapeHtml(state.notes) + "</p>"
        : "") +
      "<h2>Code context</h2><ul>" +
      "<li>" + EDITION + " — deflagration venting (rooms and equipment).</li>" +
      "<li>NFPA 69 — prevention / isolation alternatives.</li>" +
      "<li>NFPA 652 / 654 — dust hazard analysis.</li>" +
      "<li>IBC / IFC — explosion control by reference where required.</li></ul>" +
      "<p style='color:#64748b;font-size:0.85rem'>Fire Toolshed · Deflagration Vent Sizing v" +
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
      "ul{padding-left:1.2rem}"
    );
  }

  function printToPdf() {
    if (!state.hazardPath) {
      toast("Select an application path first");
      return;
    }
    render();
    var r = calc();
    var boot =
      "window.onload=function(){var done=false;function closeMe(){if(done)return;done=true;try{window.close();}catch(e){}}" +
      "window.addEventListener('afterprint',closeMe);" +
      "setTimeout(function(){try{window.focus();window.print();}catch(e){}setTimeout(closeMe,50);},250);};";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Deflagration Vent Sizing</title><style>" +
      printCss() +
      "</style></head><body>" +
      packageHtml(r, true) +
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
    if (!state.hazardPath) {
      toast("Select an application path first");
      return;
    }
    render();
    var r = calc();
    var name =
      (state.projectName || "deflagration-vent").replace(/[^\w\-]+/g, "_").slice(0, 40) ||
      "deflagration-vent";
    var html =
      "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Deflagration Vent</title><style>" +
      printCss() +
      "</style></head><body>" +
      packageHtml(r, true) +
      "</body></html>";
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "_deflagration-vent.html";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("Saved HTML report");
  }

  function bind() {
    $("pickRoomDust") &&
      $("pickRoomDust").addEventListener("click", function () {
        selectPath("room_dust");
      });
    $("pickRoomGas") &&
      $("pickRoomGas").addEventListener("click", function () {
        selectPath("room_gas");
      });
    $("pickProcess") &&
      $("pickProcess").addEventListener("click", function () {
        selectPath("process_dust");
      });
    $("pickGas") &&
      $("pickGas").addEventListener("click", function () {
        selectPath("process_gas");
      });
    $("btnChangePath") &&
      $("btnChangePath").addEventListener("click", function () {
        if (!confirm("Change application path?")) return;
        state.hazardPath = null;
        showPath(true);
        saveState();
      });

    if ($("construction")) {
      $("construction").addEventListener("change", function () {
        readForm();
        applyConstructionPreset(false);
        render();
      });
    }

    document.querySelectorAll("#workbench input, #workbench select").forEach(function (el) {
      if (el.id === "construction") return;
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    $("btnHelp") && $("btnHelp").addEventListener("click", openHelp);
    $("btnHelpFoot") && $("btnHelpFoot").addEventListener("click", openHelp);
    $("helpClose") && $("helpClose").addEventListener("click", closeHelp);
    $("helpBackdrop") && $("helpBackdrop").addEventListener("click", closeHelp);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeHelp();
    });

    $("btnPrintPdf") && $("btnPrintPdf").addEventListener("click", printToPdf);
    $("btnSave") && $("btnSave").addEventListener("click", saveReport);
    $("btnReset") &&
      $("btnReset").addEventListener("click", function () {
        if (!confirm("Reset form and return to path selection?")) return;
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) { /* ignore */ }
        state = defaultState();
        writeForm();
        showPath(true);
        saveState();
      });
  }

  function init() {
    loadState();
    bind();
    writeForm();
    updateUnitLabels();
    if ($("appVersion")) $("appVersion").textContent = "Version " + APP_VERSION;
    if (window.FireToolshedLogo) {
      window.FireToolshedLogo.bindControls({
        selectId: "reportLogoSource",
        fileId: "reportLogoFile",
        previewId: "reportLogoPreview",
        fileWrapId: "reportLogoFileWrap",
        onChange: function () {
          if (state.hazardPath) render();
        },
      });
    }
    var valid =
      state.hazardPath === "room_dust" ||
      state.hazardPath === "room_gas" ||
      state.hazardPath === "process_dust" ||
      state.hazardPath === "process_gas";
    if (valid) {
      showPath(false);
      updatePathUI();
      render();
    } else {
      state.hazardPath = null;
      showPath(true);
      saveState();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
