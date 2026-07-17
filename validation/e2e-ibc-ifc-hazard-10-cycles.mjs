/**
 * 10-cycle validation: IBC/IFC Hazard Impacts
 * Loads requirement catalog from app.js and runs scenario matrix.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_JS = path.join(__dirname, "../ibc-ifc-hazard/assets/app.js");
const OUT = path.join(__dirname, "e2e-hazard-out");

const src = fs.readFileSync(APP_JS, "utf8");

function extractArray(name) {
  const re = new RegExp(
    "var\\s+" + name + "\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*\\n\\s*var\\s+"
  );
  let m = src.match(re);
  if (!m) {
    // last array before EDITION_NOTES or function
    const re2 = new RegExp("var\\s+" + name + "\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*\\n\\s*var\\s+EDITION");
    m = src.match(re2);
  }
  if (!m) {
    const re3 = new RegExp("var\\s+" + name + "\\s*=\\s*(\\[[\\s\\S]*?\\]);");
    m = src.match(re3);
  }
  if (!m) throw new Error("Could not extract " + name);
  // Use Function to evaluate array literal (no browser deps)
  return new Function("return (" + m[1] + ");")();
}

// Extract H_GROUPS, HAZARDS, REQUIREMENTS carefully
function extractBlock(startMarker, endMarker) {
  const i = src.indexOf(startMarker);
  if (i < 0) throw new Error("missing " + startMarker);
  const j = src.indexOf(endMarker, i + startMarker.length);
  if (j < 0) throw new Error("missing end " + endMarker);
  const body = src.slice(i + startMarker.length, j).trim();
  // body starts with [ ... 
  const open = body.indexOf("[");
  // find matching close from open
  let depth = 0;
  let end = -1;
  for (let k = open; k < body.length; k++) {
    if (body[k] === "[") depth++;
    else if (body[k] === "]") {
      depth--;
      if (depth === 0) {
        end = k;
        break;
      }
    }
  }
  if (end < 0) throw new Error("unbalanced " + startMarker);
  const lit = body.slice(open, end + 1);
  return new Function("return (" + lit + ");")();
}

const H_GROUPS = extractBlock("var H_GROUPS =", "var HAZARDS =");
const HAZARDS = extractBlock("var HAZARDS =", "var REQUIREMENTS =");
const REQUIREMENTS = extractBlock("var REQUIREMENTS =", "var EDITION_NOTES =");

const results = { cycles: [], pass: 0, fail: 0, errors: [] };

function ok(cycle, name, cond, detail = "") {
  if (cond) results.pass++;
  else {
    results.fail++;
    results.errors.push(`C${cycle}: ${name}${detail ? " — " + detail : ""}`);
  }
  return !!cond;
}

function unique(arr) {
  const o = {};
  const out = [];
  arr.forEach((x) => {
    if (!o[x]) {
      o[x] = 1;
      out.push(x);
    }
  });
  return out;
}

const CLASS_I_FAMILY = [
  "class_ia_liquid",
  "class_ib_liquid",
  "class_ic_liquid",
  "class_i_liquid",
];
const CLASS_II_III_FAMILY = [
  "class_ii_liquid",
  "class_iiia_liquid",
  "class_iiib_liquid",
  "class_ii_iii_liquid",
];

function hazardLabel(id) {
  const haz = HAZARDS.find((x) => x.id === id);
  return haz ? haz.label : id;
}

function matchingHazardDrivers(state, whenHz) {
  if (whenHz === "class_i_liquid") {
    return CLASS_I_FAMILY.filter((id) => state.hazards.includes(id)).map(hazardLabel);
  }
  if (whenHz === "class_ii_iii_liquid") {
    return CLASS_II_III_FAMILY.filter((id) => state.hazards.includes(id)).map(hazardLabel);
  }
  return state.hazards.includes(whenHz) ? [hazardLabel(whenHz)] : [];
}

function analyze(state) {
  const controlAreaPath = state.pathMode === "control_area";
  const rows = [];
  REQUIREMENTS.forEach((req) => {
    if (req.editions && req.editions.indexOf(state.edition) < 0) return;
    const drivers = [];
    if (!controlAreaPath && req.whenH) {
      req.whenH.forEach((h) => {
        if (state.hGroups.includes(h)) drivers.push(h);
      });
    }
    if (req.whenHaz) {
      req.whenHaz.forEach((hz) => {
        matchingHazardDrivers(state, hz).forEach((lab) => drivers.push(lab));
      });
    }
    if (req.whenHighPiled && state.highPiled) drivers.push("High-piled storage");
    const classIOnRow =
      req.whenHaz &&
      req.whenHaz.includes("class_i_liquid") &&
      matchingHazardDrivers(state, "class_i_liquid").length > 0;
    const h1h2OnRow = drivers.includes("H-1") || drivers.includes("H-2");
    const hasH1H2 = state.hGroups.includes("H-1") || state.hGroups.includes("H-2");
    if (drivers.length && (h1h2OnRow || classIOnRow || (hasH1H2 && !controlAreaPath))) {
      if (state.openToAtmosphere) drivers.push("Open to atmosphere");
      if (state.underPressure) drivers.push("Under pressure");
    }
    const needsH = !controlAreaPath && req.whenH && req.whenH.length;
    const needsHaz = req.whenHaz && req.whenHaz.length;
    const needsHp = !!req.whenHighPiled;
    if (!needsH && !needsHaz && !needsHp) return;
    if (controlAreaPath && !needsHaz && !needsHp) return;
    if (!drivers.length) return;
    if (state.filterCost === "high" && req.cost !== "high") return;
    if (state.filterCat !== "all" && req.cat !== state.filterCat) return;
    rows.push({ req, drivers: unique(drivers) });
  });
  return rows;
}

function suggestedH(state) {
  const set = {};
  state.hazards.forEach((hzId) => {
    const haz = HAZARDS.find((x) => x.id === hzId);
    if (!haz || !haz.mapsH) return;
    haz.mapsH.forEach((h) => {
      if (!state.hGroups.includes(h)) set[h] = 1;
    });
  });
  return Object.keys(set).sort();
}

const SCENARIOS = [
  {
    name: "Empty selection",
    edition: "2021",
    hGroups: [],
    hazards: [],
    highPiled: false,
    expectMin: 0,
    expectMax: 0,
  },
  {
    name: "H-1 detonation only",
    edition: "2021",
    hGroups: ["H-1"],
    hazards: ["explosives"],
    highPiled: false,
    expectIds: ["h1_detached_or_special", "explosion_control", "roof_class_a", "nfpa13_required"],
    expectHighCostMin: 3,
  },
  {
    name: "H-2 flammable gas + Class I liquids",
    edition: "2021",
    hGroups: ["H-2"],
    hazards: ["flammable_gas", "class_ib_liquid"],
    highPiled: false,
    expectIds: ["explosion_control", "hazardous_exhaust", "spill_control_secondary", "roof_class_a"],
    expectMultiDriver: true,
    expectDriverText: ["IFC 57 Class I — Flammable liquid IB"],
  },
  {
    name: "H-3 combustible liquids + oxidizers",
    edition: "2018",
    hGroups: ["H-3"],
    hazards: ["class_ii_liquid", "oxidizer"],
    highPiled: false,
    expectIds: ["incompatible_separation", "control_areas_414", "nfpa13_required"],
    expectDriverText: ["IFC 57 Class II — Combustible liquid"],
  },
  {
    name: "H-4 highly toxic + corrosive",
    edition: "2021",
    hGroups: ["H-4"],
    hazards: ["highly_toxic", "corrosive"],
    highPiled: false,
    expectIds: ["continuous_gas_detection", "hazardous_exhaust", "toxic_treatment_system"],
    expectHighCostMin: 2,
  },
  {
    name: "H-5 semiconductor HPM",
    edition: "2024",
    hGroups: ["H-5"],
    hazards: ["hpm"],
    highPiled: false,
    expectIds: ["hpm_service_corridors", "smoke_barrier_h5", "toxic_treatment_system", "continuous_gas_detection"],
  },
  {
    name: "Multi-group H-2 + H-3 + aerosols",
    edition: "2021",
    hGroups: ["H-2", "H-3"],
    hazards: ["aerosols", "class_ia_liquid"],
    highPiled: false,
    openToAtmosphere: true,
    expectIds: ["aerosol_level23", "special_suppression", "fire_wall_or_barrier_h"],
    expectMerged: true,
    expectDriverText: ["IFC 57 Class I — Flammable liquid IA", "Open to atmosphere"],
  },
  {
    name: "High-piled only (no H)",
    edition: "2015",
    hGroups: [],
    hazards: [],
    highPiled: true,
    expectIds: ["high_piled", "smoke_heat_vents_hp"],
    expectMin: 2,
  },
  {
    name: "Combustible dust room (H-2 context)",
    edition: "2021",
    hGroups: ["H-2"],
    hazards: ["combustible_dust"],
    highPiled: false,
    expectIds: ["dust_haz_housekeeping", "explosion_control", "explosion_vent_discharge"],
  },
  {
    name: "Full stack H-2/H-4 + dust + high-piled + filter high-cost",
    edition: "2024",
    hGroups: ["H-2", "H-4"],
    hazards: ["class_ic_liquid", "highly_toxic", "combustible_dust", "flammable_gas"],
    highPiled: true,
    underPressure: true,
    filterCost: "high",
    expectMin: 8,
    allHighCost: true,
    expectDriverText: ["IFC 57 Class I — Flammable liquid IC", "Under pressure"],
  },
  {
    name: "Control-area path: Class I + oxidizer (no H construction)",
    edition: "2021",
    pathMode: "control_area",
    hGroups: ["H-2", "H-3"],
    hazards: ["class_ib_liquid", "oxidizer"],
    highPiled: false,
    expectIds: ["control_areas_414", "spill_control_secondary", "incompatible_separation"],
    rejectIds: ["type_construction_h", "roof_class_a", "fire_wall_or_barrier_h"],
    expectFewerThanGroupH: true,
  },
  {
    name: "Suggest H from hazards (mapsH) without auto-select",
    edition: "2021",
    pathMode: "group_h",
    hGroups: [],
    hazards: ["highly_toxic", "hpm", "explosives"],
    highPiled: false,
    expectSuggest: ["H-1", "H-4", "H-5"],
    expectMin: 1,
  },
];

function run() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log("=== IBC/IFC Hazard Impacts — 10 cycles ===\n");
  console.log(
    `Catalog: ${H_GROUPS.length} H groups · ${HAZARDS.length} hazard types · ${REQUIREMENTS.length} requirements\n`
  );

  ok(0, "H_GROUPS has 5", H_GROUPS.length === 5);
  ok(0, "HAZARDS >= 15", HAZARDS.length >= 15);
  ok(0, "REQUIREMENTS >= 20", REQUIREMENTS.length >= 20);
  ok(
    0,
    "All reqs have title+code+cat",
    REQUIREMENTS.every((r) => r.id && r.title && r.code && r.cat && r.cost)
  );

  SCENARIOS.forEach((sc, idx) => {
    const cycle = idx + 1;
    const state = {
      edition: sc.edition,
      pathMode: sc.pathMode || "group_h",
      hGroups: sc.hGroups || [],
      hazards: sc.hazards || [],
      highPiled: !!sc.highPiled,
      openToAtmosphere: !!sc.openToAtmosphere,
      underPressure: !!sc.underPressure,
      filterCost: sc.filterCost || "all",
      filterCat: sc.filterCat || "all",
    };
    const rows = analyze(state);
    const ids = rows.map((r) => r.req.id);
    const high = rows.filter((r) => r.req.cost === "high").length;
    const sug = suggestedH(state);

    console.log(`--- Cycle ${cycle}: ${sc.name} ---`);
    console.log(
      `  edition ${state.edition} · path=${state.pathMode} · H=[${state.hGroups}] · hazards=${state.hazards.length} · hp=${state.highPiled}`
    );
    console.log(`  → ${rows.length} requirements (${high} high-cost)` + (sug.length ? ` · suggest H=${sug.join(",")}` : ""));

    ok(cycle, "runs without throw", true);
    if (sc.expectMin != null) ok(cycle, `count >= ${sc.expectMin}`, rows.length >= sc.expectMin, String(rows.length));
    if (sc.expectMax != null) ok(cycle, `count <= ${sc.expectMax}`, rows.length <= sc.expectMax, String(rows.length));
    if (sc.expectIds) {
      sc.expectIds.forEach((id) => {
        ok(cycle, `has ${id}`, ids.includes(id));
      });
    }
    if (sc.expectDriverText) {
      const allDrivers = rows.flatMap((r) => r.drivers);
      sc.expectDriverText.forEach((txt) => {
        ok(cycle, `driver has "${txt}"`, allDrivers.includes(txt), allDrivers.slice(0, 12).join("; "));
      });
    }
    if (sc.rejectIds) {
      sc.rejectIds.forEach((id) => {
        ok(cycle, `lacks ${id}`, !ids.includes(id));
      });
    }
    if (sc.expectSuggest) {
      sc.expectSuggest.forEach((h) => {
        ok(cycle, `suggests ${h}`, sug.includes(h));
      });
    }
    if (sc.expectFewerThanGroupH) {
      const groupHRows = analyze({ ...state, pathMode: "group_h" });
      ok(
        cycle,
        "control_area fewer than group_h",
        rows.length < groupHRows.length,
        `${rows.length} vs ${groupHRows.length}`
      );
      ok(
        cycle,
        "control_area has no pure H-only drivers",
        rows.every((r) => !r.drivers.some((d) => /^H-[1-5]$/.test(d)))
      );
    }
    if (sc.expectHighCostMin != null) {
      ok(cycle, `high-cost >= ${sc.expectHighCostMin}`, high >= sc.expectHighCostMin, String(high));
    }
    if (sc.allHighCost) {
      ok(
        cycle,
        "filter high-cost only",
        rows.every((r) => r.req.cost === "high")
      );
    }
    if (sc.expectMultiDriver) {
      const multi = rows.some((r) => r.drivers.length >= 2);
      ok(cycle, "at least one multi-driver row", multi);
    }
    if (sc.expectMerged) {
      // no duplicate requirement ids
      ok(cycle, "no duplicate req ids", new Set(ids).size === ids.length);
    }
    // every row has drivers
    ok(
      cycle,
      "every row has drivers",
      rows.every((r) => r.drivers && r.drivers.length)
    );
    // edition note path always available
    ok(cycle, "edition is known year", ["2015", "2018", "2021", "2024"].includes(state.edition));

    const artifact = {
      cycle,
      name: sc.name,
      state,
      count: rows.length,
      highCost: high,
      ids,
      suggestedH: sug,
      sample: rows.slice(0, 5).map((r) => ({
        id: r.req.id,
        title: r.req.title,
        cost: r.req.cost,
        drivers: r.drivers,
        code: r.req.code,
      })),
    };
    results.cycles.push(artifact);
    fs.writeFileSync(
      path.join(OUT, `cycle-${String(cycle).padStart(2, "0")}.json`),
      JSON.stringify(artifact, null, 2)
    );
  });

  // Cross-checks
  ok(
    11,
    "Roof class A linked to all H groups",
    REQUIREMENTS.find((r) => r.id === "roof_class_a")?.whenH?.length === 5
  );
  ok(
    11,
    "High-piled req exists",
    REQUIREMENTS.some((r) => r.whenHighPiled)
  );
  ok(
    11,
    "IFC 50+ hazards include Ch.50+ refs",
    HAZARDS.filter((h) => /IFC\s*5/.test(h.ifc) || /IFC\s*6/.test(h.ifc)).length >= 10
  );
  ok(
    11,
    "Every hazard has mapsH",
    HAZARDS.every((h) => Array.isArray(h.mapsH) && h.mapsH.length)
  );
  ok(
    11,
    "mapsH values are valid H ids",
    HAZARDS.every((h) => h.mapsH.every((m) => H_GROUPS.some((g) => g.id === m)))
  );

  fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(results, null, 2));

  console.log("\n=== SUMMARY ===");
  console.log(`Passed: ${results.pass}`);
  console.log(`Failed: ${results.fail}`);
  if (results.errors.length) {
    console.log("\nFAILURES:");
    results.errors.forEach((e) => console.log(" - " + e));
  }
  console.log(`\nArtifacts: ${OUT}`);
  process.exit(results.fail ? 1 : 0);
}

run();
