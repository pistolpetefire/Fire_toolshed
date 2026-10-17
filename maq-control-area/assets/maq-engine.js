/**
 * MAQ & Control Area engine. Browser: window.MAQEngine. Node: module.exports. No DOM access.
 * Basis: IFC Table 5003.1.1(1) (physical hazards) and Table 5003.1.1(2) (health hazards), same values as IBC Tables 307.1(1)/(2);
 * control areas per IFC Table 5003.8.3.2 (IBC Table 414.2.2). Editions: 2021 and 2024. The only value difference between the two
 * tables is the 2024 split of flammable gas into Category 1A/1B (High BV) and 1B (Low BV); the 1B (Low BV) rows are 2024 only.
 * Notes used: d = +100% sprinklered throughout (903.3.1.1); e = +100% in approved cabinets / gas cabinets / exhausted enclosures /
 * safety cans (5003.9.10), applied cumulatively with d; f = not limited when sprinklered; g = allowed only when sprinklered;
 * h = combination of IA/IB/IC; b = aggregate use + storage may not exceed the storage MAQ (with increases).
 * Values: number, "NL" (not limited), "NA" (not applicable), "NOTE" (not tabulated; see the note).
 */
(function (root, factory) {
  var m = factory();
  if (typeof module === "object" && module.exports) module.exports = m;
  else root.MAQEngine = m;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var U = { gal: "gal", lb: "lb", cf: "cu ft", ntp: "cu ft (NTP)", lbl: "lb" };
  function M(key, mat, cls, group, unit, s, c, o, extra) {
    var e = { key: key, mat: mat, cls: cls, group: group, unit: unit, storage: s, closed: c, open: o, table: "5003.1.1(1)", hazard: "physical" };
    if (extra) for (var k in extra) e[k] = extra[k];
    return e;
  }
  function H(key, mat, cls, unit, s, c, o, extra) {
    var e = M(key, mat, cls, "H-4", unit, s, c, o, extra);
    e.table = "5003.1.1(2)";
    e.hazard = "health";
    return e;
  }
  var LIQ = { cond: "liquid", condLabel: "Open system or pressurized > 15 psig (H-2)" };
  var OX3 = { cond: "liquid", condLabel: "Open system or pressurized > 15 psig (H-2)", noteJ: true };

  // [value, notes]
  var MATERIALS = [
    M("dust", "Combustible dust", "—", "H-2", U.lb, ["NOTE", "p"], ["NOTE", "p"], ["NOTE", "p"]),
    M("fiber-loose", "Combustible fibers", "Loose", "H-3", U.cf, [100, ""], [100, ""], [20, ""]),
    M("fiber-baled", "Combustible fibers", "Baled", "H-3", U.cf, [1000, ""], [1000, ""], [200, ""]),
    M("cl-II", "Combustible liquid", "II", "H-2 or H-3", U.gal, [120, "de"], [120, "d"], [30, "d"], LIQ),
    M("cl-IIIA", "Combustible liquid", "IIIA", "H-2 or H-3", U.gal, [330, "de"], [330, "d"], [80, "d"], LIQ),
    M("cl-IIIB", "Combustible liquid", "IIIB", "NA", U.gal, [13200, "ef"], [13200, "f"], [3300, "f"]),
    M("cryo-flam", "Cryogenic, flammable", "—", "H-2", U.gal, [45, "d"], [45, "d"], [10, "d"]),
    M("cryo-inert", "Cryogenic, inert", "—", "NA", U.ntp, ["NL", ""], ["NL", ""], ["NA", ""]),
    M("cryo-ox", "Cryogenic, oxidizing", "—", "H-3", U.gal, [45, "d"], [45, "d"], [10, "d"]),
    M("exp-1.1", "Explosives", "Division 1.1", "H-1", U.lb, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("exp-1.2", "Explosives", "Division 1.2", "H-1", U.lb, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("exp-1.3", "Explosives", "Division 1.3", "H-1 or H-2", U.lb, [5, "eg"], [1, "g"], [1, "g"],
      { cond: "exp13", condLabel: "IBC 307.3.1 conditions for H-2 met" }),
    M("exp-1.4", "Explosives", "Division 1.4", "H-3", U.lb, [50, "eg"], [50, "g"], ["NA", ""]),
    M("exp-1.4G", "Explosives", "Division 1.4G (consumer fireworks, net pyrotechnic wt.)", "H-3", U.lb, [125, "e"], ["NA", ""], ["NA", ""]),
    M("exp-1.5", "Explosives", "Division 1.5", "H-1", U.lb, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("exp-1.6", "Explosives", "Division 1.6", "H-1", U.lb, [1, "eg"], ["NA", ""], ["NA", ""]),
    M("fg-gas-high", "Flammable gas, gaseous", "1A and 1B (High BV)", "H-2", U.ntp, [1000, "de"], [1000, "de"], ["NA", ""],
      { label2021: "Flammable gas, gaseous" }),
    M("fg-gas-low", "Flammable gas, gaseous", "1B (Low BV ≤ 10 cm/s)", "H-2", U.ntp, [162500, "de"], [162500, "de"], ["NA", ""],
      { only: "2024" }),
    M("fg-liq-high", "Flammable gas, liquefied", "1A and 1B (High BV)", "H-2", U.lb, [150, "de"], [150, "de"], ["NA", ""],
      { label2021: "Flammable gas, liquefied" }),
    M("fg-liq-low", "Flammable gas, liquefied", "1B (Low BV ≤ 10 cm/s)", "H-2", U.lb, [10000, "de"], [10000, "de"], ["NA", ""],
      { only: "2024" }),
    M("fl-IA", "Flammable liquid", "IA", "H-2 or H-3", U.gal, [30, "de"], [30, "d"], [10, "d"], Object.assign({ classI: true }, LIQ)),
    M("fl-IBIC", "Flammable liquid", "IB and IC", "H-2 or H-3", U.gal, [120, "de"], [120, "d"], [30, "d"], Object.assign({ classI: true }, LIQ)),
    M("fsolid", "Flammable solid", "—", "H-3", U.lb, [125, "de"], [125, "d"], [25, "d"]),
    M("inert-gas", "Inert gas, gaseous or liquefied", "—", "NA", U.ntp, ["NL", ""], ["NL", ""], ["NA", ""]),
    M("op-UD", "Organic peroxide", "UD", "H-1", U.lb, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("op-I", "Organic peroxide", "I", "H-2", U.lb, [5, "de"], [1, "d"], [1, "d"]),
    M("op-II", "Organic peroxide", "II", "H-3", U.lb, [50, "de"], [50, "d"], [10, "d"]),
    M("op-III", "Organic peroxide", "III", "H-3", U.lb, [125, "de"], [125, "d"], [25, "d"]),
    M("op-IV", "Organic peroxide", "IV", "NA", U.lb, ["NL", ""], ["NL", ""], ["NL", ""]),
    M("op-V", "Organic peroxide", "V", "NA", U.lb, ["NL", ""], ["NL", ""], ["NL", ""]),
    M("ox-4-s", "Oxidizer", "4 (solid)", "H-1", U.lb, [1, "g"], [0.25, "g"], [0.25, "g"]),
    M("ox-4-l", "Oxidizer", "4 (liquid)", "H-1", U.lbl, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("ox-3", "Oxidizer", "3", "H-2 or H-3", U.lb, [10, "de"], [2, "d"], [2, "d"], OX3),
    M("ox-2", "Oxidizer", "2", "H-3", U.lb, [250, "de"], [250, "d"], [50, "d"]),
    M("ox-1", "Oxidizer", "1", "NA", U.lb, [4000, "ef"], [4000, "f"], [1000, "f"]),
    M("oxgas-gas", "Oxidizing gas, gaseous", "—", "H-3", U.ntp, [1500, "de"], [1500, "de"], ["NA", ""]),
    M("oxgas-liq", "Oxidizing gas, liquefied", "—", "H-3", U.lb, [150, "de"], [150, "de"], ["NA", ""]),
    M("pyro-sl", "Pyrophoric", "solid or liquid", "H-2", U.lb, [4, "eg"], [1, "g"], [0, ""]),
    M("pyro-gas", "Pyrophoric", "gas", "H-2", U.ntp, [50, "eg"], [10, "eg"], ["NA", ""]),
    M("ur-4-sl", "Unstable (reactive)", "4 (solid or liquid)", "H-1", U.lb, [1, "eg"], [0.25, "g"], [0.25, "g"]),
    M("ur-4-gas", "Unstable (reactive)", "4 (gas)", "H-1", U.ntp, [10, "eg"], [2, "eg"], ["NA", ""]),
    M("ur-3-sl", "Unstable (reactive)", "3 (solid or liquid)", "H-1 or H-2", U.lb, [5, "de"], [1, "d"], [1, "d"],
      { cond: "detonable", condLabel: "Detonable (H-1)" }),
    M("ur-3-gas", "Unstable (reactive)", "3 (gas)", "H-1 or H-2", U.ntp, [50, "de"], [10, "de"], ["NA", ""],
      { cond: "detonable", condLabel: "Detonable (H-1)" }),
    M("ur-2-sl", "Unstable (reactive)", "2 (solid or liquid)", "H-3", U.lb, [50, "de"], [50, "d"], [10, "d"]),
    M("ur-2-gas", "Unstable (reactive)", "2 (gas)", "H-3", U.ntp, [750, "de"], [750, "de"], ["NA", ""]),
    M("ur-1", "Unstable (reactive)", "1", "NA", U.lb, ["NL", ""], ["NL", ""], ["NL", ""]),
    M("wr-3", "Water reactive", "3", "H-2", U.lb, [5, "de"], [5, "d"], [1, "d"]),
    M("wr-2", "Water reactive", "2", "H-3", U.lb, [50, "de"], [50, "d"], [10, "d"]),
    M("wr-1", "Water reactive", "1", "NA", U.lb, ["NL", ""], ["NL", ""], ["NL", ""]),
    // Table 5003.1.1(2): health hazards. Group when exceeded is always H-4 (IBC 307.6).
    H("cor-s", "Corrosive", "solid", U.lb, [5000, "de"], [5000, "d"], [1000, "d"]),
    H("cor-l", "Corrosive", "liquid", U.gal, [500, "de"], [500, "d"], [100, "d"]),
    H("cor-g", "Corrosive", "gas, gaseous", U.ntp, [810, "de"], [810, "de"], ["NA", ""]),
    H("cor-lg", "Corrosive", "gas, liquefied", U.lb, [150, "d"], [150, "d"], ["NA", ""]),
    H("ht-s", "Highly toxic", "solid", U.lb, [10, "de"], [10, "d"], [3, "d"]),
    H("ht-l", "Highly toxic", "liquid", U.lbl, [10, "de"], [10, "d"], [3, "d"]),
    H("ht-g", "Highly toxic", "gas, gaseous", U.ntp, [20, "dx"], [20, "dx"], ["NA", ""]),
    H("ht-lg", "Highly toxic", "gas, liquefied", U.lb, [4, "dx"], [4, "dx"], ["NA", ""]),
    H("tox-s", "Toxic", "solid", U.lb, [500, "de"], [500, "d"], [125, "d"]),
    H("tox-l", "Toxic", "liquid", U.lbl, [500, "de"], [500, "d"], [125, "d"]),
    H("tox-g", "Toxic", "gas, gaseous", U.ntp, [810, "de"], [810, "de"], ["NA", ""]),
    H("tox-lg", "Toxic", "gas, liquefied", U.lb, [150, "de"], [150, "de"], ["NA", ""]),
  ];
  // Note "x" (health table note g): highly toxic gases allowed only in approved exhausted gas cabinets or exhausted enclosures.
  var COMBO = M("fl-combo", "Flammable liquid, combination", "IA + IB + IC", "H-2 or H-3", U.gal, [120, "deh"], [120, "dh"], [30, "dh"], LIQ);

  // IFC Table 5003.8.3.2 / IBC Table 414.2.2 (identical in 2021 and 2024).
  var STORIES = [
    { id: "A10", label: "Above grade: higher than 9", pct: 5, max: 1, hr: 2 },
    { id: "A7", label: "Above grade: 7–9", pct: 5, max: 2, hr: 2 },
    { id: "A6", label: "Above grade: 6", pct: 12.5, max: 2, hr: 2 },
    { id: "A5", label: "Above grade: 5", pct: 12.5, max: 2, hr: 2 },
    { id: "A4", label: "Above grade: 4", pct: 12.5, max: 2, hr: 2 },
    { id: "A3", label: "Above grade: 3", pct: 50, max: 2, hr: 1 },
    { id: "A2", label: "Above grade: 2", pct: 75, max: 3, hr: 1 },
    { id: "A1", label: "Above grade: 1", pct: 100, max: 4, hr: 1 },
    { id: "B1", label: "Below grade: 1", pct: 75, max: 3, hr: 1 },
    { id: "B2", label: "Below grade: 2", pct: 50, max: 2, hr: 1 },
    { id: "B3", label: "Below grade: lower than 2", pct: 0, max: 0, hr: null, notAllowed: true },
  ];

  var EDITIONS = {
    "2024": { ibc: "2024 IBC", ifc: "2024 IFC", florida: "Florida Building Code 9th Edition (based on the 2024 IBC)" },
    "2021": { ibc: "2021 IBC", ifc: "2021 IFC", florida: "Florida Building Code 8th Edition (based on the 2021 IBC); FBC 9th Edition uses the 2024 basis" },
  };

  function byKey(key) {
    if (key === COMBO.key) return COMBO;
    for (var i = 0; i < MATERIALS.length; i++) if (MATERIALS[i].key === key) return MATERIALS[i];
    return null;
  }
  function materialsFor(edition) {
    return MATERIALS.filter(function (m) { return !m.only || m.only === String(edition); });
  }
  function story(id) {
    for (var i = 0; i < STORIES.length; i++) if (STORIES[i].id === id) return STORIES[i];
    return STORIES[7];
  }
  function label(m, edition) {
    if (String(edition) === "2021" && m.label2021) return m.label2021;
    return m.mat + (m.cls && m.cls !== "—" ? ", " + m.cls : "");
  }

  /** MAQ for one cell. Returns {limit: number|Infinity, base, factor, notes, kind: num|NL|NA|NOTE|NOTALLOWED, why[]} */
  function cellMAQ(cell, ctx, cabinet) {
    var base = cell[0], notes = cell[1] || "", why = [];
    if (base === "NA") return { kind: "NA", limit: NaN, base: base, notes: notes, why: ["NA in table"] };
    if (base === "NOTE") return { kind: "NOTE", limit: NaN, base: base, notes: notes, why: ["Not tabulated; see table note (hazard analysis, 104.2.2)"] };
    if (base === "NL") return { kind: "NL", limit: Infinity, base: base, notes: notes, why: ["Not limited"] };
    if (notes.indexOf("f") >= 0 && ctx.sprinklered) return { kind: "NL", limit: Infinity, base: base, notes: notes, why: ["Note f: not limited, sprinklered throughout (903.3.1.1)"] };
    if (notes.indexOf("g") >= 0 && !ctx.sprinklered) return { kind: "NOTALLOWED", limit: 0, base: base, notes: notes, why: ["Note g: allowed only in a building sprinklered throughout"] };
    if (notes.indexOf("x") >= 0 && !cabinet) return { kind: "NOTALLOWED", limit: 0, base: base, notes: notes, why: ["Allowed only in approved exhausted gas cabinets or exhausted enclosures"] };
    var factor = 1;
    if (notes.indexOf("d") >= 0 && ctx.sprinklered) { factor *= 2; why.push("Note d: +100% sprinklered"); }
    if (notes.indexOf("e") >= 0 && cabinet) { factor *= 2; why.push("Note e: +100% approved cabinets / gas cabinets / exhausted enclosures"); }
    var pct = ctx.story.pct / 100;
    if (pct !== 1) why.push(ctx.story.pct + "% per story (Table 5003.8.3.2)");
    return { kind: "num", limit: base * factor * pct, base: base, factor: factor, pct: ctx.story.pct, notes: notes, why: why };
  }

  function judge(qty, maq) {
    qty = qty > 0 ? qty : 0;
    if (maq.kind === "NA") return qty > 0 ? "REVIEW" : "—";
    if (maq.kind === "NOTE") return qty > 0 ? "REVIEW" : "—";
    if (maq.kind === "NL") return qty > 0 ? "PASS" : "—";
    if (qty === 0) return "—";
    return qty <= maq.limit + 1e-9 ? "PASS" : "FAIL";
  }

  function resolveGroup(m, rows) {
    if (m.hazard === "health") return { group: "H-4", basis: "IBC 307.6: health-hazard materials above MAQ are Group H-4" };
    var anyCond = rows.some(function (r) { return !!r.cond; });
    var anyOpen = rows.some(function (r) { return r.open > 0; });
    if (m.cond === "liquid") {
      if (anyCond || anyOpen) return { group: "H-2", basis: "IBC 307.4: used or stored in open systems, or closed systems pressurized > 15 psig" };
      return { group: "H-3", basis: "IBC 307.5: stored or used in normally closed containers or systems pressurized ≤ 15 psig" };
    }
    if (m.cond === "detonable") return anyCond ? { group: "H-1", basis: "IBC 307.3: detonable" } : { group: "H-2", basis: "IBC 307.4: nondetonable" };
    if (m.cond === "exp13") return anyCond ? { group: "H-2", basis: "IBC 307.3.1 conditions met" } : { group: "H-1", basis: "IBC 307.3 (Division 1.3 defaults to H-1)" };
    if (m.group === "NA") return { group: "NA", basis: "Table lists no Group H for this class" };
    return { group: m.group, basis: "IFC Table 5003.1.1(1)" };
  }

  function evalGroup(m, rows, ctx, label2) {
    var cabinet = rows.length > 0 && rows.every(function (r) { return !!r.cabinet; });
    var sum = { storage: 0, closed: 0, open: 0 };
    rows.forEach(function (r) { ["storage", "closed", "open"].forEach(function (k) { sum[k] += r[k] > 0 ? r[k] : 0; }); });
    var modes = {};
    ["storage", "closed", "open"].forEach(function (k) {
      var maq = cellMAQ(m[k], ctx, cabinet);
      modes[k] = { qty: sum[k], maq: maq, result: judge(sum[k], maq) };
    });
    // Note b: aggregate of use and storage may not exceed the storage MAQ, including applicable increases.
    var total = sum.storage + sum.closed + sum.open;
    var aggMaq = modes.storage.maq;
    var agg = { qty: total, maq: aggMaq, result: sum.closed + sum.open > 0 && aggMaq.kind === "num" ? (total <= aggMaq.limit + 1e-9 ? "PASS" : "FAIL") : "—" };
    var results = [modes.storage.result, modes.closed.result, modes.open.result, agg.result];
    var fail = results.indexOf("FAIL") >= 0;
    var review = results.indexOf("REVIEW") >= 0;
    var status = fail ? "FAIL" : review ? "REVIEW" : total > 0 ? "PASS" : "—";
    var g = fail ? resolveGroup(m, rows) : null;
    return {
      key: m.key, label: label2 || label(m, ctx.edition), table: m.table, hazard: m.hazard, unit: m.unit, cabinet: cabinet,
      modes: modes, aggregate: agg, status: status, hGroup: g, noteJ: !!m.noteJ, rows: rows.length,
    };
  }

  /**
   * project: {edition: "2024"|"2021", sprinklered: bool, story: STORIES id, controlAreas: n,
   *           materials: [{key, name, storage, closed, open, cabinet, cond}]}  (quantities per control area)
   */
  function evaluate(project) {
    var edition = String(project.edition || "2024") === "2021" ? "2021" : "2024";
    var st = story(project.story || "A1");
    var ctx = { edition: edition, sprinklered: !!project.sprinklered, story: st };
    var errors = [], warnings = [], groups = {}, order = [];
    (project.materials || []).forEach(function (r) {
      var m = byKey(r.key);
      if (!m) { warnings.push("Unknown material key " + r.key); return; }
      if (m.only && m.only !== edition) { errors.push(label(m, edition) + " is a " + m.only + "-edition category; pick another class for " + edition + "."); return; }
      if (!groups[m.key]) { groups[m.key] = []; order.push(m.key); }
      groups[m.key].push({ storage: +r.storage || 0, closed: +r.closed || 0, open: +r.open || 0, cabinet: !!r.cabinet, cond: !!r.cond, name: r.name || "" });
    });
    var out = order.map(function (k) { return evalGroup(byKey(k), groups[k], ctx); });
    // Note h: combination of Class IA, IB and IC (only meaningful when more than one Class I row or class is present).
    var classIRows = [];
    order.forEach(function (k) { if (byKey(k).classI) classIRows = classIRows.concat(groups[k]); });
    if (classIRows.length > 1) out.push(evalGroup(COMBO, classIRows, ctx, "Flammable liquid, combination (IA, IB, IC) — note h"));

    var ca = Math.max(0, Math.floor(+project.controlAreas || 1));
    var caCheck = { story: st, count: ca, max: st.max, pct: st.pct, hr: st.hr, ok: !st.notAllowed && ca <= st.max };
    if (st.notAllowed) errors.push("Table 5003.8.3.2: control areas with hazardous materials are not allowed lower than 2 stories below grade plane.");
    else if (ca > st.max) errors.push("Table 5003.8.3.2: " + ca + " control areas on this story exceeds the maximum of " + st.max + ".");
    if (!ctx.sprinklered) warnings.push("Not sprinklered: note d increases are not applied and note g materials are not allowed.");

    var fails = out.filter(function (g) { return g.status === "FAIL"; });
    var groupsNeeded = [];
    fails.forEach(function (g) { if (g.hGroup && g.hGroup.group !== "NA" && groupsNeeded.indexOf(g.hGroup.group) < 0) groupsNeeded.push(g.hGroup.group); });
    groupsNeeded.sort();
    var decision;
    if (!fails.length && !st.notAllowed && caCheck.ok) decision = { hRequired: false, text: "Within MAQ per control area — Group H not required for these materials." };
    else if (!fails.length) decision = { hRequired: null, text: "Control-area layout does not comply with Table 5003.8.3.2 — fix the control areas, or treat as Group H." };
    else if (groupsNeeded.length) decision = { hRequired: true, groups: groupsNeeded, text: "MAQ exceeded — Group " + groupsNeeded.join(", ") + " required (or reduce quantities / add control areas)." };
    else decision = { hRequired: null, text: "MAQ exceeded for a class the table lists with no Group H (NA) — see IFC Ch. 50/57 and the AHJ." };
    return {
      edition: edition, editionInfo: EDITIONS[edition], sprinklered: ctx.sprinklered, story: st, controlAreas: caCheck,
      groups: out, decision: decision, errors: errors, warnings: warnings,
    };
  }

  return {
    VERSION: "1.0.0", MATERIALS: MATERIALS, COMBO: COMBO, STORIES: STORIES, EDITIONS: EDITIONS,
    byKey: byKey, materialsFor: materialsFor, label: label, cellMAQ: cellMAQ, evaluate: evaluate,
  };
});
