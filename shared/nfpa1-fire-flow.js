/**
 * NFPA 1 required fire flow (sprinkler reduction, floors, cap, duration, greater-of).
 * Browser: window.Nfpa1FireFlow. Node: module.exports.
 *
 * Area bands are the toolshed copy already in hydrant-loop-sizer/assets/hls-engine.js
 * (that file: IFC 2024 Table B105.1(2), Arizona UpCodes, flag S; it also states
 * NFPA 1 Table 18.4.5.2.1 carries the same numbers, flag S/U). This file does not
 * re-type the table from NFPA LiNK and does not invent bands.
 *
 * Citations stay at section level. Owner basis for the sprinkler rules is NFPA 1-2021
 * (LiNK): the reduction, the 1,000 gpm minimum, the 600 gpm quick-response minimum,
 * the 2,000 gpm / 2 hour cap, and the greater-of supply rule. The 2024 edition
 * renumbers those rules to §18.4.4; subsection numbers under 18.4.4 are not stated here.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Nfpa1FireFlow = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var INF = Infinity;
  var GROUPS = [
    { key: "I", label: "Types IA and IB (NFPA 1: I (443), I (332), II (222))" },
    { key: "IIA", label: "Types IIA and IIIA (NFPA 1: II (111), III (211))" },
    { key: "IV", label: "Types IV and V-A (NFPA 1: IV (2HH), V (111))" },
    { key: "IIB", label: "Types IIB and IIIB (NFPA 1: II (000), III (200))" },
    { key: "VB", label: "Type V-B (NFPA 1: V (000))" },
  ];
  // gpm, hours, upper bounds [I, IIA, IV, IIB, VB]. null = column already ended. INF = "Greater".
  var FF_ROWS = [
    [1500, 2, 22700, 12700, 8200, 5900, 3600], [1750, 2, 30200, 17000, 10900, 7900, 4800], [2000, 2, 38700, 21800, 12900, 9800, 6200],
    [2250, 2, 48300, 24200, 17400, 12600, 7700], [2500, 2, 59000, 33200, 21300, 15400, 9400], [2750, 2, 70900, 39700, 25500, 18400, 11300],
    [3000, 3, 83700, 47100, 30100, 21800, 13400], [3250, 3, 97700, 54900, 35200, 25900, 15600], [3500, 3, 112700, 63400, 40600, 29300, 18000],
    [3750, 3, 128700, 72400, 46400, 33500, 20600], [4000, 4, 145900, 82100, 52500, 37900, 23300], [4250, 4, 164200, 92400, 59100, 42700, 26300],
    [4500, 4, 183400, 103100, 66000, 47700, 29300], [4750, 4, 203700, 114600, 73300, 53000, 32600], [5000, 4, 225200, 126700, 81100, 58600, 36000],
    [5250, 4, 247700, 139400, 89200, 65400, 39600], [5500, 4, 271200, 152600, 97700, 70600, 43400], [5750, 4, 295900, 166500, 106500, 77000, 47400],
    [6000, 4, INF, INF, 115800, 83700, 51500], [6250, 4, null, null, 125500, 90600, 55700], [6500, 4, null, null, 135500, 97900, 60200],
    [6750, 4, null, null, 145800, 106800, 64800], [7000, 4, null, null, 156700, 113200, 69600], [7250, 4, null, null, 167900, 121300, 74600],
    [7500, 4, null, null, 179400, 129600, 79800], [7750, 4, null, null, 191400, 138300, 85100], [8000, 4, null, null, INF, INF, INF],
  ];

  var UFC_SPECIAL = {
    family1: { gpm: 500, hours: 1.5, note: "Family housing, 1-story: 500 gpm / 90 min." },
    family2: { gpm: 750, hours: 1.5, note: "Family housing, 2-story: 750 gpm / 90 min." },
    family3: { gpm: 1000, hours: 1.5, note: "Family housing, 3+ stories: 1,000 gpm / 90 min." },
    vehicle: { gpm: 500, hours: 2, note: "Vehicle parking areas: 500 gpm / 2 hr." },
    aircraft: { gpm: 1000, hours: 2, note: "Aircraft parking/refueling: 1,000 gpm / 2 hr." },
  };

  var TABLE_NOTE = "Area bands are the toolshed copy used by the Hydrant Loop Sizer (IFC 2024 Table B105.1(2) in that file; that file states NFPA 1 Table 18.4.5.2.1 carries the same numbers). Not re-read from NFPA LiNK here. A typed table flow and duration replaces the lookup. AHJ may modify.";

  function normalizeBasis(basis) {
    var s = String(basis || "nfpa1").toLowerCase();
    if (s === "florida" || s === "fl" || s === "nfpa" || s === "nfpa1" || s === "ffpc") return "nfpa1";
    if (s === "ifc" || s === "ibc") return "ifc";
    if (s === "ufc" || s === "dod") return "ufc";
    return "nfpa1";
  }

  function normalizeEdition(edition) {
    return String(edition) === "2024" ? "2024" : "2021";
  }

  function normalizeGroup(group) {
    var g = String(group || "").toUpperCase().replace(/\s+/g, "");
    var map = {
      I: "I", IA: "I", IB: "I", "I(443)": "I", "I(332)": "I", "II(222)": "I",
      IIA: "IIA", IIIA: "IIA", "II(111)": "IIA", "III(211)": "IIA",
      IV: "IV", IVA: "IV", VA: "IV", "IV(2HH)": "IV", "V(111)": "IV",
      IIB: "IIB", IIIB: "IIB", "II(000)": "IIB", "III(200)": "IIB", "TYPEII(000)": "IIB",
      VB: "VB", "V(000)": "VB", "TYPEV(000)": "VB",
    };
    return map[g] || null;
  }

  function groupLabel(key) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === key) return GROUPS[i].label;
    return key || "";
  }

  function sprinklerKind(input) {
    if (input.sprinklered === true && (input.sprinkler == null || input.sprinkler === "")) return "throughout";
    var s = String(input.sprinkler == null ? "none" : input.sprinkler).toLowerCase();
    if (s === "none" || s === "" || s === "false" || s === "0") return "none";
    if (s === "13d" || s === "irc") return "13d";
    if (s === "13r" || s === "s13r") return "13r";
    return "throughout";
  }

  function isQuick(input) {
    return input.quickResponse === true || input.qr === true || String(input.sprinkler || "").toLowerCase() === "sqr";
  }

  function durationForReduced(gpm) {
    return gpm <= 2750 ? 2 : gpm <= 3750 ? 3 : 4;
  }

  function tableFlow(group, area) {
    var key = normalizeGroup(group);
    var col = ["I", "IIA", "IV", "IIB", "VB"].indexOf(key);
    if (col < 0) return null;
    if (!(area >= 0)) return null;
    for (var i = 0; i < FF_ROWS.length; i++) {
      var hi = FF_ROWS[i][2 + col];
      if (hi === null) continue;
      if (area <= hi) return { gpm: FF_ROWS[i][0], hours: FF_ROWS[i][1], row: i, group: key };
    }
    return null;
  }

  function sectionCite(edition, topic) {
    if (edition === "2024") {
      return "NFPA 1-2024 §18.4.4 (" + topic + "; 2024 renumbering of the 2021 rules). AHJ may modify.";
    }
    return "NFPA 1-2021 §18.4.5.3 and §18.4.5.4 (" + topic + "). AHJ may modify.";
  }

  /**
   * Supply the greater of fire flow and sprinkler demand. Never the sum.
   * Rates and volumes are compared separately: the supply rate is the greater gpm,
   * and the storage volume is the greater of the two (gpm × minutes) products.
   * A tie goes to sprinkler demand, matching the tank sizer's existing comparison.
   */
  function greaterOfSupply(fireGpm, fireMin, sprGpm, sprMin) {
    fireGpm = Math.max(0, Number(fireGpm) || 0);
    fireMin = Math.max(0, Number(fireMin) || 0);
    sprGpm = Math.max(0, Number(sprGpm) || 0);
    sprMin = Math.max(0, Number(sprMin) || 0);
    var fireGal = fireGpm * fireMin;
    var sprinklerGal = sprGpm * sprMin;
    var rateGoverns = sprGpm >= fireGpm && sprGpm > 0 ? "sprinkler" : "fire-flow";
    var volumeGoverns = sprinklerGal >= fireGal && sprinklerGal > 0 ? "sprinkler" : "fire-flow";
    return {
      fireGpm: fireGpm,
      fireMin: fireMin,
      fireGal: fireGal,
      sprinklerGpm: sprGpm,
      sprinklerMin: sprMin,
      sprinklerGal: sprinklerGal,
      supplyGpm: Math.max(fireGpm, sprGpm),
      supplyGal: Math.max(fireGal, sprinklerGal),
      durationMin: volumeGoverns === "sprinkler" ? sprMin : fireMin,
      sumGpm: fireGpm + sprGpm,
      sumGal: fireGal + sprinklerGal,
      rateGoverns: rateGoverns,
      volumeGoverns: volumeGoverns,
      added: false,
    };
  }

  function fail(message) {
    return { ok: false, error: message };
  }

  /**
   * input: { basis, edition, group, area, sprinkler, sprinklered, quickResponse,
   *          special, tableGpm, tableHours, sprinklerDemandGpm, sprinklerDemandMin }
   * User-entered tableGpm (and tableHours) overrides the lookup. Do not pass a
   * guessed code-table value; pass only a value the user typed or a lookup.
   */
  function requiredFireFlow(input) {
    input = input || {};
    var basis = normalizeBasis(input.basis);
    var edition = normalizeEdition(input.edition);
    var notes = [];
    var special = String(input.special || "");
    if (basis === "ufc" && UFC_SPECIAL[special]) {
      var sp = UFC_SPECIAL[special];
      var spGal = Math.round(sp.gpm * sp.hours * 60);
      var spSupply = greaterOfSupply(sp.gpm, Math.round(sp.hours * 60), input.sprinklerDemandGpm, input.sprinklerDemandMin);
      return {
        ok: true,
        basis: basis,
        edition: edition,
        rule: "ufc-special",
        gpm: sp.gpm,
        hours: sp.hours,
        residualPsi: 20,
        gallons: spGal,
        tableGpm: null,
        tableHours: null,
        tableSource: "ufc-special",
        sprinklered: false,
        quickResponse: false,
        reducedGpm: null,
        floorGpm: null,
        capBinds: false,
        durationCapped: false,
        ahjMayModify: false,
        method: "UFC 3-600-01 facility fire flow",
        cite: "UFC 3-600-01 facility values already in this calculator. DFPE may modify.",
        notes: [sp.note, "DFPE may modify."],
        supply: spSupply,
      };
    }

    var kind = sprinklerKind(input);
    var qr = isQuick(input) && kind !== "none" && kind !== "13d";
    var tableGpm = Number(input.tableGpm);
    var tableHours = Number(input.tableHours);
    var tableSource = "lookup";
    var groupKey = normalizeGroup(input.group);
    var area = Number(input.area);
    if (tableGpm > 0) {
      tableSource = "user-entry";
      if (!(tableHours > 0)) tableHours = null;
      notes.push("Table flow " + tableGpm + " gpm is user-entered, not a lookup.");
    } else {
      var looked = tableFlow(groupKey, area);
      if (!looked) return fail("Enter the fire-flow calculation area and construction type, or a table flow and duration.");
      tableGpm = looked.gpm;
      tableHours = looked.hours;
      groupKey = looked.group;
      notes.push("Table flow " + tableGpm.toLocaleString() + " gpm for " + tableHours + " h. " + TABLE_NOTE);
    }

    var gpm = tableGpm;
    var hours = tableHours;
    var rule = "unsprinklered";
    var floorGpm = null;
    var reducedGpm = null;
    var capBinds = false;
    var durationCapped = false;
    var ahj = false;
    var method = "Unsprinklered table fire flow";
    var cite = "";

    var nfpaSprinklered = (basis === "nfpa1" || basis === "ufc") && (kind === "throughout" || kind === "13r");
    if (nfpaSprinklered) {
      if (!(hours > 0)) {
        hours = 2;
        notes.push("Table duration was not entered. Sprinklered duration uses the 2 hour maximum.");
      }
      reducedGpm = 0.25 * tableGpm;
      floorGpm = qr ? 600 : 1000;
      capBinds = reducedGpm > 2000;
      gpm = Math.min(Math.max(reducedGpm, floorGpm), 2000);
      gpm = Math.round(gpm);
      var rawHours = hours;
      hours = Math.min(hours, 2);
      durationCapped = rawHours > 2;
      rule = "nfpa1-sprinkler";
      ahj = true;
      method = basis === "ufc"
        ? "UFC 3-600-01 using the NFPA 1 sprinkler reduction"
        : "NFPA 1 sprinklered fire flow";
      cite = sectionCite(edition, "75% reduction, 1,000 gpm minimum, 600 gpm with quick-response sprinklers throughout, 2,000 gpm for 2 hours, greater of fire flow and sprinkler demand");
      notes.push("Sprinklered throughout: Q = min(max(25% of table flow, " + floorGpm.toLocaleString() + " gpm), 2,000 gpm).");
      notes.push(qr
        ? "Quick-response sprinklers throughout: minimum 600 gpm."
        : "Minimum 1,000 gpm. Quick-response sprinklers throughout lower that floor to 600 gpm.");
      notes.push("Sprinklered duration = min(table duration, 2 hours).");
      if (capBinds) notes.push("25% of the table flow is above 2,000 gpm, so the result is capped at 2,000 gpm for 2 hours.");
      else if (gpm === 2000 && reducedGpm >= 2000) notes.push("25% of the table flow is 2,000 gpm, which is the sprinklered maximum.");
      if (reducedGpm < floorGpm) notes.push("25% of the table flow is below the minimum, so the floor governs.");
      notes.push("AHJ may modify.");
      if (basis === "ufc") notes.push("DFPE may modify. UFC special facility values are not reduced again.");
    } else if (basis === "ifc" && kind !== "none") {
      reducedGpm = kind === "13d" ? 0.5 * tableGpm : 0.25 * tableGpm;
      if (kind === "13r") {
        floorGpm = 1500;
        gpm = Math.max(reducedGpm, 1500);
        notes.push("IFC Appendix B sprinkler reduction: 25% of the table flow, not less than 1,500 gpm (NFPA 13R). The NFPA 1 2,000 gpm / 2 hour cap is not an IFC rule and is not applied.");
      } else if (kind === "13d") {
        floorGpm = 500;
        gpm = Math.max(reducedGpm, 500);
        notes.push("IFC / IRC one- and two-family reduction already in this calculator: 50% of the table flow, not less than 500 gpm. The NFPA 1 2,000 gpm cap is not applied.");
      } else {
        floorGpm = 1000;
        gpm = Math.max(reducedGpm, 1000);
        notes.push("IFC Appendix B sprinkler reduction: 25% of the table flow, not less than 1,000 gpm (NFPA 13). The NFPA 1 2,000 gpm / 2 hour cap is not applied.");
      }
      gpm = Math.round(gpm);
      hours = durationForReduced(gpm);
      rule = "ifc-b105.2";
      method = "IBC / IFC Appendix B sprinkler reduction";
      cite = "IFC Appendix B. Duration follows the reduced flow. Confirm the adopted edition and local amendments.";
    } else {
      gpm = Math.round(tableGpm);
      hours = tableHours;
      if (!(hours > 0)) return fail("Enter the table duration (hours) with a user-entered table flow.");
      method = basis === "ufc" ? "UFC 3-600-01 unsprinklered fire flow" : basis === "ifc" ? "IBC / IFC Appendix B table fire flow" : "NFPA 1 unsprinklered table fire flow";
      cite = basis === "nfpa1"
        ? (edition === "2024" ? "NFPA 1-2024 §18.4.4 unsprinklered table fire flow. AHJ may modify." : "NFPA 1-2021 §18.4.5 unsprinklered table fire flow. AHJ may modify.")
        : basis === "ufc" ? "UFC 3-600-01 unsprinklered facility fire flow. DFPE may modify." : "IFC Appendix B table fire flow. Confirm the adopted edition.";
      if (basis === "nfpa1") notes.push("Not sprinklered throughout: no 75% reduction. AHJ may modify.");
    }

    if (qr && !nfpaSprinklered) {
      notes.push("The 600 gpm quick-response minimum applies only when the building is sprinklered throughout on the NFPA 1 or UFC basis.");
    }

    var gallons = Math.round(gpm * hours * 60);
    var fireMin = Math.round(hours * 60);
    var supply = greaterOfSupply(gpm, fireMin, input.sprinklerDemandGpm, input.sprinklerDemandMin);
    if ((Number(input.sprinklerDemandGpm) || 0) > 0) {
      notes.push("Required supply is the greater of fire flow (" + gpm.toLocaleString() + " gpm) and sprinkler demand (" + Math.round(Number(input.sprinklerDemandGpm)).toLocaleString() + " gpm), not the sum (" + supply.sumGpm.toLocaleString() + " gpm).");
      notes.push("Storage volume is the greater of the two volumes (" + Math.round(supply.supplyGal).toLocaleString() + " gal), not the sum (" + Math.round(supply.sumGal).toLocaleString() + " gal).");
      if (basis === "nfpa1" || nfpaSprinklered) {
        ahj = true;
        if (cite.indexOf("18.4.5.4") < 0 && cite.indexOf("18.4.4") < 0) {
          cite = sectionCite(edition, "greater of fire flow and sprinkler demand, not the sum");
        }
      }
    }

    return {
      ok: true,
      basis: basis,
      edition: edition,
      group: groupKey,
      groupLabel: groupLabel(groupKey),
      area: Number.isFinite(area) ? area : null,
      rule: rule,
      gpm: gpm,
      hours: hours,
      residualPsi: 20,
      gallons: gallons,
      tableGpm: tableGpm,
      tableHours: tableSource === "user-entry" ? (Number(input.tableHours) > 0 ? Number(input.tableHours) : null) : tableHours,
      tableSource: tableSource,
      sprinklered: nfpaSprinklered || (basis === "ifc" && kind !== "none"),
      quickResponse: !!(qr && nfpaSprinklered),
      reducedGpm: reducedGpm,
      floorGpm: floorGpm,
      capBinds: capBinds,
      durationCapped: durationCapped,
      ahjMayModify: ahj,
      method: method,
      cite: cite,
      notes: notes,
      supply: supply,
    };
  }

  return {
    GROUPS: GROUPS,
    FF_ROWS: FF_ROWS,
    TABLE_NOTE: TABLE_NOTE,
    normalizeBasis: normalizeBasis,
    normalizeEdition: normalizeEdition,
    normalizeGroup: normalizeGroup,
    tableFlow: tableFlow,
    greaterOfSupply: greaterOfSupply,
    requiredFireFlow: requiredFireFlow,
    sectionCite: sectionCite,
  };
});
