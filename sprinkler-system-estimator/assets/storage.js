/**
 * Storage / ESFR comparison for the Sprinkler System Estimator.
 *
 * Built-in numbers are only the figures in the storage-module brief.
 * They are labeled with a table or section and stay editable.
 * Every other arrangement is user-entered. This file does not invent
 * table cells, K-factor limits, hose values, or an FM revision.
 *
 * Sprinkler demand = (number of heads) × K × √P.
 */
(function (root) {
  "use strict";

  var HOSE_SAMPLE = {
    citation: "NFPA 13-2022 Table 20.15.2.6",
    hoseGpm: 250,
    durationMin: 60,
    note: "Sample hose allowance and duration from the brief. Added on both columns for the comparison. Editable. FM Data Sheet 3-26 Table 2 is not prefilled.",
  };

  /** NFPA 13-2022 Table 23.3.1 — only the rows named in the brief. */
  var NFPA_2022_ROWS = [
    {
      id: "nfpa-2022-civ-35-40-k252",
      citation: "NFPA 13-2022 Table 23.3.1",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 25.2,
      orientation: "pendent",
      heads: 12,
      pressurePsi: 25,
      permitted: true,
      note: "K-25.2 pendent is permitted. Built-in design is 12 heads at 25 psi.",
    },
    {
      id: "nfpa-2022-civ-35-40-k168",
      citation: "NFPA 13-2022 Table 23.3.1",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 16.8,
      orientation: "",
      heads: null,
      pressurePsi: 52,
      permitted: true,
      note: "K-16.8 is permitted at 52 psi. The brief does not state the number of heads for this K-factor.",
    },
    {
      id: "nfpa-2022-civ-35-40-k14",
      citation: "NFPA 13-2022 Table 23.3.1",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 14,
      orientation: "",
      heads: null,
      pressurePsi: null,
      permitted: false,
      note: "K-14 is not permitted at a 40 ft ceiling for Class IV commodity stored 35 ft.",
    },
    {
      id: "nfpa-2022-civ-35-40-k224",
      citation: "NFPA 13-2022 Table 23.3.1",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 22.4,
      orientation: "",
      heads: null,
      pressurePsi: null,
      permitted: false,
      note: "K-22.4 is not permitted at a 40 ft ceiling for Class IV commodity stored 35 ft.",
    },
  ];

  /**
   * FM figures from the brief. Tables 8 and 14 are both cited.
   * The cell is not assigned to one of those tables here — confirm on the revision you enter.
   * Data Sheet 3-26 Table 2 and section 2.3.1.14 have no built-in numbers.
   */
  var FM_ROWS = [
    {
      id: "fm-civ-35-40-k252",
      citation: "FM Data Sheet 8-9, Tables 8 and 14",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 25.2,
      orientation: "pendent",
      response: "",
      fireCase: "",
      heads: 12,
      pressurePsi: 40,
      permitted: true,
      note: "Class IV, 35 ft storage, 40 ft ceiling, K-25.2 pendent. Brief figure: 12 heads at 40 psi. Confirm whether this cell is Table 8 or Table 14 on your revision.",
    },
    {
      id: "fm-tower-85-k252-shielded",
      citation: "FM Data Sheet 8-9, Tables 8 and 14",
      commodity: "",
      storageFt: null,
      ceilingFt: 85,
      kFactor: 25.2,
      orientation: "",
      response: "quick-response",
      fireCase: "shielded",
      heads: 12,
      pressurePsi: 50,
      permitted: true,
      note: "Tower case at 85 ft, quick-response K-25.2, shielded fire. Brief figure: 12 heads at 50 psi. Confirm whether this cell is Table 8 or Table 14 on your revision.",
    },
  ];

  var CASES = [
    {
      id: "class-iv-35-40",
      label: "Class IV, 35 ft storage, 40 ft ceiling (sample)",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 25.2,
      orientation: "pendent",
      response: "",
      fireCase: "",
    },
    {
      id: "tower-85-shielded",
      label: "Tower, 85 ft, quick-response K-25.2, shielded fire",
      commodity: "",
      storageFt: "",
      ceilingFt: 85,
      kFactor: 25.2,
      orientation: "",
      response: "quick-response",
      fireCase: "shielded",
    },
    {
      id: "custom",
      label: "User-entered arrangement",
    },
  ];

  var DS326 = {
    citation: "FM Data Sheet 3-26 Table 2 and section 2.3.1.14",
    note: "No figure from the brief is stored for Data Sheet 3-26. Enter Table 2 and section 2.3.1.14 from the revision you typed.",
  };

  function num(v) {
    if (v == null || v === "") return null;
    var n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }

  function kClose(a, b) {
    if (a == null || b == null) return false;
    return Math.abs(a - b) < 0.051;
  }

  function sameText(a, b) {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function esfrSprinklerGpm(heads, k, psi) {
    var n = num(heads);
    var K = num(k);
    var p = num(psi);
    if (n == null || K == null || p == null) return null;
    if (!(n > 0) || !(K > 0) || p < 0) return null;
    return n * K * Math.sqrt(p);
  }

  function roundGpm(q) {
    if (q == null || !Number.isFinite(q)) return null;
    return Math.round(q);
  }

  function formatInt(n) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    var s = String(Math.round(Number(n)));
    var neg = s.charAt(0) === "-";
    if (neg) s = s.slice(1);
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return neg ? "-" + s : s;
  }

  function format1(n) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    var r = Math.round(Number(n) * 10) / 10;
    var neg = r < 0;
    var fixed = Math.abs(r).toFixed(1).split(".");
    fixed[0] = fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (neg ? "-" : "") + fixed.join(".");
  }

  function findNfpaRow(input) {
    if (String((input && input.edition) || "") !== "2022") return null;
    var storageFt = num(input.storageFt);
    var ceilingFt = num(input.ceilingFt);
    var k = num(input.kFactor);
    for (var i = 0; i < NFPA_2022_ROWS.length; i++) {
      var row = NFPA_2022_ROWS[i];
      if (!sameText(row.commodity, input.commodity)) continue;
      if (row.storageFt !== storageFt || row.ceilingFt !== ceilingFt) continue;
      if (!kClose(row.kFactor, k)) continue;
      return row;
    }
    return null;
  }

  function findFmRow(input) {
    var k = num(input.kFactor);
    var ceilingFt = num(input.ceilingFt);
    var storageFt = num(input.storageFt);
    var response = String(input.response || "").toLowerCase();
    var fireCase = String(input.fireCase || "").toLowerCase();
    if (ceilingFt === 85 && kClose(k, 25.2)) {
      var standard = response.indexOf("standard") >= 0;
      var quick = response.indexOf("quick") >= 0 || response === "";
      var shielded = fireCase.indexOf("shield") >= 0 || fireCase === "";
      if (!standard && quick && shielded) return FM_ROWS[1];
    }
    if (sameText(input.commodity, "Class IV") && storageFt === 35 && ceilingFt === 40 && kClose(k, 25.2)) {
      return FM_ROWS[0];
    }
    return null;
  }

  function kFactorFlag(input) {
    var src = input || {};
    if (String(src.edition || "") !== "2022") {
      return {
        status: "user-entered",
        permitted: null,
        citation: "NFPA edition is not 2022",
        message: "Built-in K-factor flags are only for NFPA 13-2022. Enter whether this K-factor is permitted for the edition you selected. No 2022 cell is copied into another edition.",
      };
    }
    var row = findNfpaRow(src);
    if (!row) {
      return {
        status: "no-row",
        permitted: null,
        citation: "NFPA 13-2022 Table 23.3.1",
        message: "No built-in NFPA 13-2022 Table 23.3.1 row for this commodity, storage height, ceiling height, and K-factor. Enter the design from your copy. This tool does not fill other cells.",
      };
    }
    if (!row.permitted) {
      return {
        status: "not-permitted",
        permitted: false,
        kFactor: row.kFactor,
        citation: row.citation,
        pressurePsi: null,
        heads: null,
        message: row.note + " No design pressure is stored for this K-factor.",
      };
    }
    return {
      status: "permitted",
      permitted: true,
      kFactor: row.kFactor,
      citation: row.citation,
      pressurePsi: row.pressurePsi,
      heads: row.heads,
      message: row.note,
    };
  }

  function permissionNotes(input) {
    var src = input || {};
    if (String(src.edition || "") !== "2022") return [];
    var storageFt = num(src.storageFt);
    var ceilingFt = num(src.ceilingFt);
    var notes = [];
    for (var i = 0; i < NFPA_2022_ROWS.length; i++) {
      var row = NFPA_2022_ROWS[i];
      if (!sameText(row.commodity, src.commodity)) continue;
      if (row.storageFt !== storageFt || row.ceilingFt !== ceilingFt) continue;
      notes.push({
        kFactor: row.kFactor,
        permitted: row.permitted,
        pressurePsi: row.pressurePsi,
        heads: row.heads,
        citation: row.citation,
        note: row.note,
      });
    }
    return notes;
  }

  function applyCase(caseId, current) {
    var out = Object.assign({}, current || {}, { caseId: caseId });
    var found = null;
    for (var i = 0; i < CASES.length; i++) {
      if (CASES[i].id === caseId) found = CASES[i];
    }
    if (!found || found.id === "custom") return out;
    out.commodity = found.commodity;
    out.storageFt = found.storageFt;
    out.ceilingFt = found.ceilingFt;
    out.kFactor = found.kFactor;
    out.orientation = found.orientation;
    out.response = found.response;
    out.fireCase = found.fireCase;
    return out;
  }

  function fillFromRows(input) {
    var out = Object.assign({}, input || {});
    if (out.hoseSource !== "user") {
      out.nfpaHose = HOSE_SAMPLE.hoseGpm;
      out.nfpaDuration = HOSE_SAMPLE.durationMin;
      out.fmHose = HOSE_SAMPLE.hoseGpm;
      out.fmDuration = HOSE_SAMPLE.durationMin;
      out.hoseSource = "builtin";
    }
    var nfpa = findNfpaRow(out);
    if (out.nfpaPsiSource !== "user") {
      if (nfpa && nfpa.permitted && nfpa.pressurePsi != null) {
        out.nfpaPsi = nfpa.pressurePsi;
        out.nfpaPsiSource = "builtin";
      } else {
        out.nfpaPsi = "";
        out.nfpaPsiSource = "none";
      }
    }
    if (out.nfpaHeadsSource !== "user") {
      if (nfpa && nfpa.permitted && nfpa.heads != null) {
        out.nfpaHeads = nfpa.heads;
        out.nfpaHeadsSource = "builtin";
      } else {
        out.nfpaHeads = "";
        out.nfpaHeadsSource = "none";
      }
    }
    var fm = findFmRow(out);
    if (out.fmPsiSource !== "user") {
      if (fm && fm.pressurePsi != null) {
        out.fmPsi = fm.pressurePsi;
        out.fmPsiSource = "builtin";
      } else {
        out.fmPsi = "";
        out.fmPsiSource = "none";
      }
    }
    if (out.fmHeadsSource !== "user") {
      if (fm && fm.permitted !== false && fm.heads != null) {
        out.fmHeads = fm.heads;
        out.fmHeadsSource = "builtin";
      } else {
        out.fmHeads = "";
        out.fmHeadsSource = "none";
      }
    }
    return out;
  }

  function blankInput() {
    return {
      edition: "2022",
      editionLabel: "",
      fmRevision: "",
      caseId: "class-iv-35-40",
      commodity: "Class IV",
      storageFt: 35,
      ceilingFt: 40,
      kFactor: 25.2,
      orientation: "pendent",
      response: "",
      fireCase: "",
      nfpaHeads: "",
      nfpaPsi: "",
      nfpaHeadsSource: "builtin",
      nfpaPsiSource: "builtin",
      fmHeads: "",
      fmPsi: "",
      fmHeadsSource: "builtin",
      fmPsiSource: "builtin",
      nfpaHose: "",
      nfpaDuration: "",
      fmHose: "",
      fmDuration: "",
      hoseSource: "builtin",
      govern: "greater",
      ds326Table2: "",
      ds326Section: "",
    };
  }

  function sampleInput() {
    return fillFromRows(blankInput());
  }

  function fmRevisionText(revision) {
    var rev = String(revision || "").trim();
    if (!rev) return "FM revision not entered — type the revision printed on your data sheets.";
    return "FM revision entered: " + rev + ".";
  }

  function sideResult(entry, flag, citation, builtin) {
    var blocked = !!(flag && flag.permitted === false);
    var arithmetic = esfrSprinklerGpm(entry.heads, entry.kFactor, entry.psi);
    var raw = blocked ? null : arithmetic;
    var sprinklerGpm = raw == null ? null : roundGpm(raw);
    var hose = num(entry.hoseGpm);
    var duration = num(entry.durationMin);
    var total = sprinklerGpm == null || hose == null ? null : sprinklerGpm + hose;
    var builtinPsi = builtin && builtin.pressurePsi != null ? builtin.pressurePsi : null;
    var enteredPsi = num(entry.psi);
    return {
      heads: num(entry.heads),
      psi: enteredPsi,
      kFactor: num(entry.kFactor),
      rawGpm: raw,
      arithmeticGpm: arithmetic,
      sprinklerGpm: sprinklerGpm,
      hoseGpm: hose,
      durationMin: duration,
      totalGpm: total,
      blocked: blocked,
      permitted: flag ? flag.permitted : null,
      flagStatus: flag ? flag.status : "no-row",
      flagMessage: flag ? flag.message : "",
      citation: citation,
      builtinPsi: builtinPsi,
      builtinHeads: builtin && builtin.heads != null ? builtin.heads : null,
      differsFromBuiltin: builtinPsi != null && enteredPsi != null && Math.abs(enteredPsi - builtinPsi) > 0.05,
    };
  }

  function pickGoverning(nfpa, fm, govern) {
    if (govern === "nfpa") return nfpa.totalGpm == null ? null : "nfpa";
    if (govern === "fm") return fm.totalGpm == null ? null : "fm";
    if (nfpa.totalGpm == null && fm.totalGpm == null) return null;
    if (fm.totalGpm == null) return "nfpa";
    if (nfpa.totalGpm == null) return "fm";
    return fm.totalGpm > nfpa.totalGpm ? "fm" : "nfpa";
  }

  function demandSentence(side, label) {
    if (!side || side.sprinklerGpm == null) return label + ": no sprinkler demand (enter heads and pressure, or the K-factor is not permitted).";
    var rawBit = side.rawGpm != null ? format1(side.rawGpm) + " gpm, shown as " + formatInt(side.sprinklerGpm) + " gpm" : formatInt(side.sprinklerGpm) + " gpm";
    return label + ": " + formatInt(side.heads) + " × " + side.kFactor + " × √" + side.psi + " = " + rawBit +
      (side.hoseGpm != null ? ", plus " + formatInt(side.hoseGpm) + " gpm hose" : "") +
      (side.durationMin != null ? " for " + formatInt(side.durationMin) + " min" : "") +
      ". Total " + formatInt(side.totalGpm) + " gpm.";
  }

  function evaluate(input) {
    var src = Object.assign({}, input || {});
    var nfpaRow = findNfpaRow(src);
    var fmRow = findFmRow(src);
    var nfpaFlag = kFactorFlag(src);
    var fmFlag = fmRow
      ? { status: "permitted", permitted: true, message: fmRow.note, citation: fmRow.citation }
      : {
          status: "no-row",
          permitted: null,
          message: "No built-in FM row for this arrangement. Enter heads and pressure from your data sheet. Nothing is inferred.",
          citation: "FM Data Sheet 8-9, Tables 8 and 14",
        };
    var nfpaCitation = (nfpaRow && nfpaRow.citation) || "NFPA 13-2022 Table 23.3.1";
    if (String(src.edition || "") !== "2022") {
      nfpaCitation = (String(src.editionLabel || "").trim() || "Other NFPA edition") + " — user-entered. Built-in Table 23.3.1 cells are not applied.";
    }
    var fmCitation = ((fmRow && fmRow.citation) || "FM Data Sheet 8-9, Tables 8 and 14") + " " + fmRevisionText(src.fmRevision);
    var nfpa = sideResult(
      { heads: src.nfpaHeads, psi: src.nfpaPsi, kFactor: src.kFactor, hoseGpm: src.nfpaHose, durationMin: src.nfpaDuration },
      nfpaFlag,
      nfpaCitation,
      nfpaRow
    );
    var fm = sideResult(
      { heads: src.fmHeads, psi: src.fmPsi, kFactor: src.kFactor, hoseGpm: src.fmHose, durationMin: src.fmDuration },
      fmFlag,
      fmCitation,
      fmRow
    );
    var key = pickGoverning(nfpa, fm, src.govern || "greater");
    var chosen = key === "fm" ? fm : key === "nfpa" ? nfpa : null;
    var governLabel = key === "fm" ? "FM" : key === "nfpa" ? "NFPA" : "";
    var governing = null;
    if (chosen) {
      var hoseCite = HOSE_SAMPLE.citation;
      governing = {
        key: key,
        label: governLabel,
        heads: chosen.heads,
        psi: chosen.psi,
        kFactor: chosen.kFactor,
        sprinklerGpm: chosen.sprinklerGpm,
        hoseGpm: chosen.hoseGpm,
        durationMin: chosen.durationMin,
        totalGpm: chosen.totalGpm,
        citation: chosen.citation,
        durationBasis: "Duration " + formatInt(chosen.durationMin) + " min. Hose " + formatInt(chosen.hoseGpm) +
          " gpm. " + hoseCite + ". " + HOSE_SAMPLE.note + " " + fmRevisionText(src.fmRevision),
        demandBasis: "Storage / ESFR comparison. Governing column: " + governLabel +
          (src.govern === "greater" || !src.govern ? " (greater demand)" : " (selected)") + ". " +
          demandSentence(nfpa, "NFPA") + " " + demandSentence(fm, "FM") + " " +
          hoseCite + ". " + DS326.citation + ": " +
          (String(src.ds326Table2 || "").trim() || "Table 2 not entered") + ". Section 2.3.1.14: " +
          (String(src.ds326Section || "").trim() || "not entered") + ". " + fmRevisionText(src.fmRevision),
      };
    }
    return {
      edition: String(src.edition || ""),
      editionLabel: String(src.editionLabel || ""),
      fmRevision: String(src.fmRevision || "").trim(),
      fmRevisionText: fmRevisionText(src.fmRevision),
      nfpa: nfpa,
      fm: fm,
      hoseCitation: HOSE_SAMPLE.citation,
      hoseNote: HOSE_SAMPLE.note,
      ds326: {
        citation: DS326.citation,
        note: DS326.note,
        table2: String(src.ds326Table2 || "").trim(),
        section: String(src.ds326Section || "").trim(),
      },
      permissionNotes: permissionNotes(src),
      governingKey: key,
      governing: governing,
    };
  }

  root.FireToolshedStorage = {
    HOSE_SAMPLE: HOSE_SAMPLE,
    NFPA_2022_ROWS: NFPA_2022_ROWS,
    FM_ROWS: FM_ROWS,
    CASES: CASES,
    DS326: DS326,
    esfrSprinklerGpm: esfrSprinklerGpm,
    roundGpm: roundGpm,
    formatInt: formatInt,
    format1: format1,
    findNfpaRow: findNfpaRow,
    findFmRow: findFmRow,
    kFactorFlag: kFactorFlag,
    permissionNotes: permissionNotes,
    applyCase: applyCase,
    fillFromRows: fillFromRows,
    blankInput: blankInput,
    sampleInput: sampleInput,
    evaluate: evaluate,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
