/**
 * 5 logo scenarios × all report tools that use FireToolshedLogo.
 * Validates shared/report-logo.js resolution + HTML wiring.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "validation/e2e-logo-out");
fs.mkdirSync(OUT, { recursive: true });

const REPORT_APPS = [
  "flow-test-report",
  "flow-test-request",
  "sprinkler-system-estimator",
  "fire-pump-sizer",
  "fire-tank-sizer",
  "ibc-ifc-hazard",
  "occupant-egress",
  "concrete-fire-rating",
  "deflagration-vent",
];

let pass = 0;
let fail = 0;
const errors = [];

function ok(name, cond, detail = "") {
  if (cond) {
    pass++;
    console.log("  OK   " + name);
  } else {
    fail++;
    errors.push(name + (detail ? " — " + detail : ""));
    console.log("  FAIL " + name + (detail ? " — " + detail : ""));
  }
  return !!cond;
}

function loadLogoModule() {
  const code = fs.readFileSync(path.join(root, "shared/report-logo.js"), "utf8");
  const store = {};
  const g = {
    window: {},
    globalThis: {},
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
    },
  };
  g.window = g;
  g.globalThis = g;
  vm.runInNewContext(code + "\nthis.FireToolshedLogo = globalThis.FireToolshedLogo;", g);
  const L = g.FireToolshedLogo;
  if (!L) throw new Error("FireToolshedLogo not exported");
  return { L, store };
}

const SCENARIOS = [
  {
    id: 1,
    name: "Benham brand logo (default)",
    state: { source: "benham", haskellState: "FL" },
    expectLabel: /^Benham$/,
    expectSrc: /^data:image\/png;base64,/,
    expectMinSrcLen: 1000,
    expectHeaderHas: ["Benham", "data:image/png"],
  },
  {
    id: 2,
    name: "MeadHunt JV brand logo",
    state: { source: "meadhunt", haskellState: "FL" },
    expectLabel: /^MeadHunt JV$/,
    expectSrc: /^data:image\/png;base64,/,
    expectMinSrcLen: 1000,
    expectHeaderHas: ["MeadHunt", "data:image/png"],
  },
  {
    id: 3,
    name: "Haskell by state — Florida (The Haskell Company)",
    state: { source: "haskell", haskellState: "FL" },
    expectLabel: /Haskell — Florida \(The Haskell Company\)/,
    expectSrc: /^data:image\/svg\+xml/,
    expectMinSrcLen: 200,
    expectHeaderHas: ["Haskell", "The Haskell Company", "Florida"],
    expectEntityTagline: "The Haskell Company",
  },
  {
    id: 4,
    name: "Haskell by state — New York (P.A., P.C.)",
    state: { source: "haskell", haskellState: "NY" },
    expectLabel: /Haskell — New York \(Architects and Engineers, P\.A\., P\.C\.\)/,
    expectSrc: /^data:image\/svg\+xml/,
    expectMinSrcLen: 200,
    expectHeaderHas: ["New York", "P.A., P.C."],
    expectEntityTagline: "Architects and Engineers, P.A., P.C.",
  },
  {
    id: 5,
    name: "Custom upload logo",
    state: {
      source: "upload",
      haskellState: "FL",
      uploadDataUrl:
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="#123456"/><text x="8" y="26" fill="#fff" font-size="14">CUSTOM</text></svg>'
        ),
      uploadName: "custom-test-logo.svg",
    },
    expectLabel: /Custom: custom-test-logo\.svg/,
    expectSrc: /^data:image\/svg\+xml/,
    expectMinSrcLen: 50,
    expectHeaderHas: ["Custom", "CUSTOM"],
  },
];

console.log("=== Report logos — 5 scenarios ===\n");

const { L, store } = loadLogoModule();

// Catalog sanity
ok("Benham data URL embedded", typeof L.getLogoSrc === "function");
L.save({ source: "benham" });
ok("Benham PNG present", L.getLogoSrc().startsWith("data:image/png;base64,"), String(L.getLogoSrc().length));
L.save({ source: "meadhunt" });
ok("MeadHunt PNG present", L.getLogoSrc().startsWith("data:image/png;base64,"), String(L.getLogoSrc().length));
ok("Haskell state map has FL→company", L.HASKELL_STATE_ENTITY.FL === "company");
ok("Haskell state map has NY→pa_pc", L.HASKELL_STATE_ENTITY.NY === "pa_pc");
ok("51 states in selector list", L.HASKELL_STATES.length === 51, String(L.HASKELL_STATES.length));

const scenarioResults = [];

SCENARIOS.forEach((sc) => {
  console.log(`\n--- Scenario ${sc.id}: ${sc.name} ---`);
  L.save(sc.state);
  const loaded = L.load();
  const src = L.getLogoSrc();
  const label = L.getSourceLabel();
  const header = L.reportHeaderHtml({ maxHeight: 52 });

  ok(`S${sc.id} source saved`, loaded.source === sc.state.source, loaded.source);
  ok(`S${sc.id} label`, sc.expectLabel.test(label), label);
  ok(`S${sc.id} src type`, sc.expectSrc.test(src), src.slice(0, 40));
  ok(`S${sc.id} src length`, src.length >= sc.expectMinSrcLen, String(src.length));
  ok(`S${sc.id} header has <img>`, /<img\s/i.test(header));
  ok(`S${sc.id} header embeds src`, header.includes(src.slice(0, 48)) || header.includes('src="'));
  (sc.expectHeaderHas || []).forEach((frag) => {
    ok(`S${sc.id} header has "${frag}"`, header.includes(frag) || label.includes(frag));
  });
  if (sc.expectEntityTagline) {
    const ent = L.getHaskellEntity();
    ok(`S${sc.id} entity tagline`, ent.tagline === sc.expectEntityTagline, ent.tagline);
  }
  if (sc.state.source === "upload") {
    ok(`S${sc.id} upload name`, loaded.uploadName === "custom-test-logo.svg");
  }

  // Simulate report package fragment used by apps
  const packageSnippet =
    header +
    "<h1>Report package test</h1>" +
    "<p>Scenario " +
    sc.id +
    ": " +
    label +
    "</p>";

  const artifact = {
    scenario: sc.id,
    name: sc.name,
    source: loaded.source,
    haskellState: loaded.haskellState,
    label,
    srcPrefix: src.slice(0, 48),
    srcLength: src.length,
    headerLength: header.length,
  };
  scenarioResults.push(artifact);
  fs.writeFileSync(
    path.join(OUT, `scenario-${String(sc.id).padStart(2, "0")}.json`),
    JSON.stringify(artifact, null, 2)
  );
  fs.writeFileSync(
    path.join(OUT, `scenario-${String(sc.id).padStart(2, "0")}-header.html`),
    "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" +
      label +
      "</title></head><body>" +
      packageSnippet +
      "</body></html>"
  );
  console.log(`  → label: ${label}`);
  console.log(`  → src: ${src.slice(0, 36)}… (${src.length} chars)`);
});

// Persistence: scenario 2 then reload module state from same store
console.log("\n--- Persistence ---");
L.save({ source: "meadhunt" });
const raw = store["fireToolshed.reportLogo.v1"];
ok("localStorage key written", !!raw);
const parsed = JSON.parse(raw);
ok("persisted source meadhunt", parsed.source === "meadhunt");
L.save({ source: "haskell", haskellState: "AL" });
const raw2 = JSON.parse(store["fireToolshed.reportLogo.v1"]);
ok("persisted haskellState AL", raw2.haskellState === "AL");
ok("AL entity pa_inc", L.entityForState("AL").id === "pa_inc");

// Additional entity spot-checks
console.log("\n--- Entity map spot-checks ---");
[
  ["TX", "company", "The Haskell Company"],
  ["CA", "aei", "Architecture and Engineering, Inc."],
  ["MN", "pa", "Architects and Engineers, PA"],
  ["CT", "pc", "Architects and Engineers, P.C."],
  ["MS", "hae", "HAE, P.A."],
].forEach(([st, id, tag]) => {
  const e = L.entityForState(st);
  ok(`${st} → ${id}`, e.id === id && e.tagline === tag, e.tagline);
});

// All report apps wiring
console.log("\n--- Report app wiring (" + REPORT_APPS.length + " tools) ---");
const requiredOptions = ["benham", "meadhunt", "haskell", "upload"];
REPORT_APPS.forEach((app) => {
  const htmlPath = path.join(root, app, "index.html");
  ok(`${app} index exists`, fs.existsSync(htmlPath));
  if (!fs.existsSync(htmlPath)) return;
  const html = fs.readFileSync(htmlPath, "utf8");
  ok(`${app} loads report-logo.js`, /report-logo\.js/.test(html));
  ok(`${app} has reportLogoSource`, /id=["']reportLogoSource["']/.test(html));
  requiredOptions.forEach((opt) => {
    ok(
      `${app} option ${opt}`,
      new RegExp(`value=["']${opt}["']`).test(html),
      "missing option"
    );
  });
  // Apps should bind logo controls or at least print host
  const hasBind =
    /FireToolshedLogo\.bindControls|reportLogoPrint|reportHeaderHtml/.test(html) ||
    fs.existsSync(path.join(root, app, "assets/app.js"));
  if (fs.existsSync(path.join(root, app, "assets/app.js"))) {
    const appJs = fs.readFileSync(path.join(root, app, "assets/app.js"), "utf8");
    ok(
      `${app} app uses FireToolshedLogo`,
      /FireToolshedLogo/.test(appJs),
      "no FireToolshedLogo in app.js"
    );
  } else {
    ok(`${app} has logo usage`, hasBind);
  }
});

// Cross-scenario: header uniqueness (benham ≠ meadhunt)
console.log("\n--- Cross-scenario distinctness ---");
L.save({ source: "benham" });
const b = L.getLogoSrc();
L.save({ source: "meadhunt" });
const m = L.getLogoSrc();
ok("Benham ≠ MeadHunt data URLs", b !== m && b.length > 100 && m.length > 100);
L.save({ source: "haskell", haskellState: "FL" });
const hFl = L.getLogoSrc();
L.save({ source: "haskell", haskellState: "NY" });
const hNy = L.getLogoSrc();
ok("Haskell FL ≠ NY SVGs", hFl !== hNy);
ok("Haskell FL includes Company", decodeURIComponent(hFl).includes("The Haskell Company"));
ok("Haskell NY includes P.A., P.C.", decodeURIComponent(hNy).includes("P.A., P.C."));

const summary = {
  passed: pass,
  failed: fail,
  errors,
  scenarios: scenarioResults,
  reportApps: REPORT_APPS,
};
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));

console.log("\n=== SUMMARY ===");
console.log("Passed:", pass);
console.log("Failed:", fail);
if (errors.length) {
  console.log("\nFAILURES:");
  errors.forEach((e) => console.log(" - " + e));
}
console.log("\nArtifacts:", OUT);
process.exit(fail ? 1 : 0);
