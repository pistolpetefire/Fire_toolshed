/**
 * Validate HMIS import against ADM Echo sample workbook.
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const require = createRequire(import.meta.url);

// Load SheetJS (UMD)
const XLSX = require(path.join(root, "shared/xlsx.full.min.js"));
globalThis.XLSX = XLSX;

// Load HmisImport (assigns globalThis.HmisImport)
await import(pathToFileURL(path.join(root, "ibc-ifc-hazard/assets/hmis-import.js")).href);
const HmisImport = globalThis.HmisImport;
if (!HmisImport) {
  console.error("HmisImport not loaded");
  process.exit(1);
}

const SAMPLE =
  process.env.HMIS_SAMPLE ||
  path.join(
    process.env.USERPROFILE || "",
    "Downloads",
    "ADM Echo HMIS 2026-07-09 (1).xlsx"
  );

const HAZARDS = [
  { id: "explosives", label: "Explosives", mapsH: ["H-1"] },
  { id: "class_i_liquid", label: "Flammable liquids (Class I)", mapsH: ["H-2", "H-3"] },
  { id: "oxidizer", label: "Oxidizers", mapsH: ["H-2", "H-3"] },
  { id: "organic_peroxide", label: "Organic peroxides", mapsH: ["H-1", "H-2", "H-3"] },
  { id: "corrosive", label: "Corrosive", mapsH: ["H-4"] },
  { id: "toxic", label: "Toxic", mapsH: ["H-4"] },
];

let pass = 0;
let fail = 0;
function ok(name, cond, detail) {
  if (cond) {
    pass++;
    console.log("  OK  ", name);
  } else {
    fail++;
    console.log("  FAIL", name, detail || "");
  }
}

console.log("=== HMIS import e2e ===\n");
ok("sample exists", fs.existsSync(SAMPLE), SAMPLE);
if (!fs.existsSync(SAMPLE)) {
  console.log("\nSkip remaining — set HMIS_SAMPLE or place file in Downloads.");
  process.exit(fail ? 1 : 0);
}

const buf = fs.readFileSync(SAMPLE);
const wb = XLSX.read(buf, { type: "buffer", cellDates: true });
const sheets = HmisImport.sheetsFromXlsxWorkbook(wb);
ok("has 3 sheets", Object.keys(sheets).length >= 3, Object.keys(sheets).join(","));

const result = HmisImport.assessWorkbook(sheets, { hazardCatalog: HAZARDS });
ok("assessment ok", result.ok, result.error);
console.log("\nInventory sheet:", result.inventorySheet);
console.log("Materials:", result.materialCount);
console.log("Hazards:", result.hazardIds);
console.log("Suggested H:", result.suggestedH);
console.log("Path:", result.pathMode, result.pathConfidence);
console.log("Edition:", result.edition);
console.log("Project:", result.projectName);
console.log("Unmatched:", result.unmatched?.length);

ok("material count >= 3", result.materialCount >= 3, String(result.materialCount));
ok("has class_i_liquid", result.hazardIds.includes("class_i_liquid"));
ok("has oxidizer", result.hazardIds.includes("oxidizer"));
ok("has organic_peroxide", result.hazardIds.includes("organic_peroxide"), result.hazardIds.join(","));
ok("has corrosive", result.hazardIds.includes("corrosive"), result.hazardIds.join(","));
ok("suggests H-2", result.suggestedH.includes("H-2"));
ok("suggests H-3", result.suggestedH.includes("H-3"));
ok("edition 2024", result.edition === "2024", result.edition);
ok("path group_h on TBD", result.pathMode === "group_h");
ok("project mentions Echo or ADM", /echo|adm/i.test(result.projectName || ""), result.projectName);

// Keyword unit checks
ok(
  "keyword IB",
  HmisImport.classifyHazardText("FLAMMABLE LIQUID CLASS IB").includes("class_i_liquid")
);
ok(
  "keyword class 2 oxidizer",
  HmisImport.classifyHazardText("CLASS 2 OXIDIZER").includes("oxidizer")
);
ok(
  "keyword organic peroxide IV",
  HmisImport.classifyHazardText("ORGANIC PEROXIDE CLASS IV").includes("organic_peroxide")
);
ok(
  "keyword corrosive cat 1a",
  HmisImport.classifyHazardText("CORROSIVE CAT 1A").includes("corrosive")
);

// CSV path
const csv =
  "PRODUCT NAME,COMPONENT,HAZARD CLASSIFICATION\n" +
  "Test Fuel,,FLAMMABLE LIQUID CLASS IA\n" +
  "Acid Cleaner,,CORROSIVE\n";
const csvResult = HmisImport.assessWorkbook(
  { Inventory: HmisImport.parseCsvText(csv) },
  { hazardCatalog: HAZARDS }
);
ok("csv ok", csvResult.ok);
ok("csv class_i", csvResult.hazardIds.includes("class_i_liquid"));
ok("csv corrosive", csvResult.hazardIds.includes("corrosive"));

console.log("\n=== SUMMARY ===");
console.log("Passed:", pass);
console.log("Failed:", fail);
if (result.materials) {
  result.materials.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.product} → ${(m.matchedIds || []).join(", ") || "(none)"}`);
    console.log(`     class: ${(m.classifications || []).join(" | ")}`);
  });
}
process.exit(fail ? 1 : 0);
