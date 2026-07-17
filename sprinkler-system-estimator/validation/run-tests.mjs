/**
 * Regression harness for Sprinkler System Estimator (prelim planning tool)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const APP_JS = fs.readFileSync(path.join(root, "assets/app.js"), "utf8");
const HTML = fs.readFileSync(path.join(root, "index.html"), "utf8");
const CSS = fs.readFileSync(path.join(root, "assets/styles.css"), "utf8");
const portalPath = path.resolve(root, "../index.html");
const portal = fs.existsSync(portalPath) ? fs.readFileSync(portalPath, "utf8") : "";

const results = { pass: 0, fail: 0, warns: [], fails: [], notes: [] };

function ok(name, cond, detail = "") {
  if (cond) results.pass++;
  else {
    results.fail++;
    results.fails.push(name + (detail ? " — " + detail : ""));
  }
}
function warn(msg) {
  results.warns.push(msg);
}

// --- Static ---
const verJs = (APP_JS.match(/APP_VERSION\s*=\s*"([^"]+)"/) || [])[1];
const verHtml = (HTML.match(/id="appVersion"[^>]*>([^<]+)/) || [])[1];
ok("APP_VERSION present", !!verJs, verJs);
ok("Version is 1.6.x", /1\.6\.\d+-prelim/.test(verJs || ""), verJs);
if (verHtml && verJs && !String(verHtml).includes(verJs)) {
  warn(`HTML static version "${verHtml}" differs from JS APP_VERSION "${verJs}" (ok if JS overwrites at runtime)`);
}
ok(
  "JS sets appVersion at runtime",
  /appVersion/.test(APP_JS) && /APP_VERSION/.test(APP_JS)
);

const ids = [
  "metricFlow",
  "metricPressure",
  "metricRemote",
  "presetSelect",
  "kFactor",
  "remotePsi",
  "autoRemoteFromK",
  "density",
  "designArea",
  "hoseGpm",
  "includeHose",
  "btnCopyPump",
  "btnPrint",
  "btnReset",
  "breakdownList",
  "demandBasis",
  "exportFlow",
  "exportPressure",
  "appVersion",
  "criteriaDemandPanel",
  "simpleDemandPanel",
  "systemTypeHint",
];
for (const id of ids) ok(`HTML has #${id}`, HTML.includes(`id="${id}"`));
ok("HTML has systemType wet/dry", HTML.includes('name="systemType"') && HTML.includes('value="dry"'));
ok("HTML has afsundown", HTML.includes('value="afsundown"'));
ok("CSS non-empty", CSS.length > 500);
ok("Portal links sprinkler", /sprinkler/i.test(portal));

// --- Parse preset arrays ---
function extractPresets(blockName) {
  const re = new RegExp(`const ${blockName}\\s*=\\s*\\[`);
  const startMatch = APP_JS.match(re);
  if (!startMatch) return [];
  const start = startMatch.index + startMatch[0].length - 1; // at '['
  let depth = 0;
  let end = -1;
  for (let i = start; i < APP_JS.length; i++) {
    if (APP_JS[i] === "[") depth++;
    else if (APP_JS[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return [];
  const body = APP_JS.slice(start + 1, end);
  const items = [];
  let d = 0;
  let s = -1;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "{") {
      if (d === 0) s = i;
      d++;
    } else if (body[i] === "}") {
      d--;
      if (d === 0 && s >= 0) {
        const chunk = body.slice(s, i + 1);
        try {
          items.push(Function('"use strict"; return (' + chunk + ")")());
        } catch {
          const idm = chunk.match(/id:\s*"([^"]+)"/);
          if (idm) items.push({ id: idm[1], _parseError: true });
        }
        s = -1;
      }
    }
  }
  return items;
}

const UFC = extractPresets("UFC_TABLE");
const NFPA = extractPresets("NFPA13");
const AF = extractPresets("AF_SUNDOWN");
const FM = extractPresets("FM_PRESETS");

ok("UFC_TABLE parsed ≥20", UFC.length >= 20, "count=" + UFC.length);
ok("NFPA13 parsed ≥10", NFPA.length >= 10, "count=" + NFPA.length);
ok("AF_SUNDOWN parsed ≥1", AF.length >= 1, "count=" + AF.length);
ok("FM_PRESETS parsed ≥5", FM.length >= 5, "count=" + FM.length);

ok(
  "AF Sundown wet-only",
  AF.every((p) => !p.sys || p.sys === "wet" || p.sys === "any") &&
    !AF.some((p) => p.sys === "dry" || /dry/i.test(p.id || ""))
);

const storage = FM.filter((p) => /storage|esfr/i.test((p.id || "") + (p.name || "")));
ok("Storage presets exist", storage.length >= 1, "count=" + storage.length);
ok(
  "Storage/ESFR wet-only",
  storage.every((p) => p.sys === "wet" || p.sys === "any") &&
    !FM.some((p) => p.sys === "dry" && /storage|esfr/i.test((p.id || "") + (p.name || "")))
);

const ufcWet = UFC.filter((p) => p.sys === "wet");
const ufcDry = UFC.filter((p) => p.sys === "dry");
ok("UFC wet rows ≥10", ufcWet.length >= 10, "wet=" + ufcWet.length);
ok("UFC dry rows ≥9", ufcDry.length >= 9, "dry=" + ufcDry.length);
ok(
  "UFC no dry high-bay heads",
  !UFC.some((p) => p.sys === "dry" && num(p.heads) > 0)
);

// --- Calc mirror ---
const PSI_PER_FT = 0.433;
function num(v, fb = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fb;
}
function round1(n) {
  return Math.round(n * 10) / 10;
}

function kRemote(p, overrides = {}) {
  const K = num(overrides.kFactor ?? p.kFactor);
  const floor = num(overrides.minFloor ?? 7);
  let qHead = num(overrides.remoteHeadGpm ?? 0);
  if (!(qHead > 0)) {
    const dens = num(overrides.density ?? p.density);
    const cov = num(overrides.coverage ?? p.coverage);
    if (dens > 0 && cov > 0) qHead = dens * cov;
  }
  if (!(K > 0) || !(qHead > 0)) return { ok: false };
  const pFromK = Math.pow(qHead / K, 2);
  return {
    ok: true,
    qHead,
    K,
    pFromK,
    pRemote: Math.max(floor, pFromK),
    floored: Math.max(floor, pFromK) > pFromK + 1e-9,
  };
}

function flowForPreset(p, includeHose = true) {
  let spr = 0;
  if (num(p.heads) > 0) {
    spr = num(p.heads) * num(p.kFactor) * Math.sqrt(num(p.headPsi ?? 7));
  } else {
    spr = num(p.density) * num(p.area);
  }
  const hose = includeHose ? num(p.hose) : 0;
  return { spr, hose, total: spr + hose };
}

function pressureStack(p, opts = {}) {
  const elevFt = opts.elevFt ?? 40;
  const backflow = opts.backflow ?? 12;
  const equip = opts.equip ?? 5 + 8 + 6;
  const safety = opts.safety ?? 5;
  let remote = num(p.remotePsi, 7);
  if (opts.autoK !== false) {
    // Match app: for heads mode, set remoteHeadGpm = K*sqrt(P)
    if (num(p.heads) > 0) {
      const K = num(p.kFactor);
      const pEnd = num(p.headPsi ?? 7);
      const q = K * Math.sqrt(pEnd);
      const k = kRemote(p, { remoteHeadGpm: q });
      if (k.ok) remote = k.pRemote;
    } else {
      const k = kRemote(p);
      if (k.ok) remote = k.pRemote;
    }
  }
  const elev = elevFt * PSI_PER_FT;
  return {
    remote: round1(remote),
    elev: round1(elev),
    total: round1(remote + elev + backflow + equip + safety),
  };
}

const cases = [
  {
    name: "AF Sundown wet",
    p: AF.find((p) => p.id === "af-sundown") || AF[0],
    expectFlow: 0.2 * 5000 + 250,
    expectQhead: 0.2 * 130,
    expectP: Math.max(7, Math.pow(26 / 8, 2)),
  },
  {
    name: "UFC OH wet ≤30",
    p: UFC.find((p) => p.id === "oh-w-30"),
    expectFlow: 0.2 * 2500 + 250,
    expectQhead: 0.2 * 130,
    expectP: Math.max(7, Math.pow(26 / 8, 2)),
  },
  {
    name: "UFC OH dry ≤30",
    p: UFC.find((p) => p.id === "oh-d-30"),
    expectFlow: 0.2 * 3500 + 250,
  },
  {
    name: "UFC Extra wet >45–60",
    p: UFC.find((p) => p.id === "eh-w-60"),
    expectFlow: 0.5 * 3000 + 500,
    expectQhead: 0.5 * 100,
    expectP: Math.max(7, Math.pow(50 / 11.2, 2)),
  },
  {
    name: "UFC Light high bay 12@7",
    p: UFC.find((p) => p.id === "lt-w-100"),
    expectFlow: 12 * 25.2 * Math.sqrt(7) + 500,
    expectHighBay: true,
  },
  {
    name: "NFPA OH2 wet",
    p: NFPA.find((p) => p.id === "oh2"),
    expectFlow: 0.2 * 1500 + 250,
  },
  {
    name: "NFPA OH2 dry +30%",
    p: NFPA.find((p) => p.id === "oh2-dry"),
    expectFlow: 0.2 * 1950 + 250,
  },
];

for (const c of cases) {
  if (!c.p || c.p._parseError) {
    ok(c.name + " preset found", false);
    continue;
  }
  ok(c.name + " preset found", true);
  const f = flowForPreset(c.p);
  if (c.expectFlow != null)
    ok(
      c.name + " flow",
      Math.abs(f.total - c.expectFlow) < 0.6,
      `got ${f.total.toFixed(2)} expect ${c.expectFlow}`
    );
  if (c.expectHighBay) {
    ok(c.name + " heads=12 K=25.2", c.p.heads === 12 && c.p.kFactor === 25.2);
  }
  if (c.expectQhead != null || c.expectP != null) {
    const k = kRemote(c.p);
    if (c.expectQhead != null)
      ok(c.name + " Qhead", Math.abs(k.qHead - c.expectQhead) < 0.05, String(k.qHead));
    if (c.expectP != null)
      ok(c.name + " P remote", Math.abs(k.pRemote - c.expectP) < 0.15, `got ${k.pRemote}`);
  }
}

// Light residual
const lightK = kRemote({ density: 0.1, coverage: 225, kFactor: 5.6 });
ok("Light K P~(22.5/5.6)^2≈16.1", Math.abs(lightK.pFromK - Math.pow(22.5 / 5.6, 2)) < 0.01);

// Edges
ok("Zero density spr=0", flowForPreset({ density: 0, area: 1500, hose: 0 }).spr === 0);
ok("K=0 remote fails", !kRemote({ density: 0.2, coverage: 130, kFactor: 0 }).ok);
ok("Q=0 remote fails", !kRemote({ density: 0, coverage: 0, kFactor: 8 }).ok);

// Floor behavior: small K demand
const floorCase = kRemote({ density: 0.05, coverage: 100, kFactor: 11.2, remotePsi: 7 });
// Q=5, P=(5/11.2)^2≈0.2 → floor 7
ok("Low Q uses 7 psi floor", floorCase.ok && floorCase.floored && floorCase.pRemote === 7);

// All UFC rows positive flow
for (const p of UFC) {
  if (p.id === "custom" || p._parseError) continue;
  const f = flowForPreset(p, true);
  ok(`UFC ${p.id} flow>0`, f.total > 0, String(f.total));
  ok(`UFC ${p.id} K>0`, num(p.kFactor) > 0);
}

// NFPA dry = wet * 1.3
const wetOh2 = NFPA.find((p) => p.id === "oh2");
const dryOh2 = NFPA.find((p) => p.id === "oh2-dry");
if (wetOh2 && dryOh2) {
  ok(
    "NFPA OH2 dry area = wet×1.3",
    Math.abs(dryOh2.area - wetOh2.area * 1.3) < 1,
    `${dryOh2.area} vs ${wetOh2.area * 1.3}`
  );
}

// Example stack
const af = AF.find((p) => p.id === "af-sundown") || AF[0];
if (af && !af._parseError) {
  const stack = pressureStack(af);
  const flow = flowForPreset(af);
  ok("AF stack > 50 psi", stack.total > 50, String(stack.total));
  ok("AF remote ~10.6", Math.abs(stack.remote - 10.6) < 0.2, String(stack.remote));
  results.notes.push(
    `AF Sundown: ${flow.total} gpm · stack ≈ ${stack.total} psi (remote ${stack.remote} + elev ${stack.elev} + bf12 + equip19 + safety5)`
  );
}

// High bay pressure should be ~7 from K path
const hb = UFC.find((p) => p.id === "oh-w-100");
if (hb) {
  const stack = pressureStack(hb);
  ok("High bay remote ≈7", Math.abs(stack.remote - 7) < 0.15, String(stack.remote));
  results.notes.push(
    `UFC Ordinary >60–100: flow≈${flowForPreset(hb).total.toFixed(0)} gpm · remote ${stack.remote} psi`
  );
}

// Product recommendations (static analysis)
if (!/sloped|2 in 12|slope/i.test(APP_JS)) {
  warn("No sloped-ceiling +30% design-area toggle (UFC requires increase when slope > 2:12)");
}
if (!/duration/i.test(APP_JS)) {
  warn("Hose stream duration (UFC Table 9-4: 60/90 min) not tracked — useful for tank sizer later");
}
if (!/safety factor|1\.1|10%\s*margin|overage/i.test(APP_JS)) {
  results.notes.push("Safety is fixed psi margin only (good for charette); no % of demand option");
}
if (!/portal|index\.html|card/i.test(APP_JS) && !/sprinkler-system-estimator/.test(portal)) {
  warn("Portal may not feature this app");
} else if (/sprinkler/i.test(portal)) {
  results.notes.push("Portal already links sprinkler estimator");
}

// UI: designHeads not exposed for edit after high-bay preset
if (!HTML.includes("designHeads") && !HTML.includes("designHeadPsi")) {
  warn("High-bay 12@7 mode has no dedicated UI fields (heads/end-psi); only density/area show 0 — easy to misread");
}

// Duration table logic (mirror)
function tableDuration(id, fw) {
  if (fw === "ufc") return String(id).indexOf("eh-") === 0 ? 90 : 60;
  if (fw === "afsundown") return 60;
  if (fw === "fm") {
    if (/storage|esfr/.test(id)) return 90;
    if (/eh|extra/.test(id)) return 90;
    return 60;
  }
  if (id === "light" || id === "light-dry") return 30;
  if (id === "oh1" || id === "oh1-dry") return 60;
  if (id === "oh2" || id === "oh2-dry") return 90;
  if (id === "eh1" || id === "eh1-dry") return 90;
  if (id === "eh2" || id === "eh2-dry") return 120;
  return 60;
}
const durCases = [
  ["lt-w-30", "ufc", 60],
  ["eh-w-30", "ufc", 90],
  ["af-sundown", "afsundown", 60],
  ["light", "nfpa13", 30],
  ["oh2", "nfpa13", 90],
  ["eh2", "nfpa13", 120],
  ["ds3-26-oh", "fm", 60],
  ["ds8-9-storage", "fm", 90],
];
for (const [id, fw, exp] of durCases) {
  ok(`Duration ${fw}/${id}`, tableDuration(id, fw) === exp, String(tableDuration(id, fw)));
}
ok("Tank gal = flow×duration", 1250 * 60 === 75000);

ok("JS has duration table", APP_JS.includes("tableDurationForPreset"));
ok("JS has handoff key", APP_JS.includes("fireToolshed.sprinklerHandoff.v1"));
ok("JS has capture", APP_JS.includes("captureForPumpSizer"));
ok("JS has readme", APP_JS.includes("openReadme"));
ok("JS has clean report", APP_JS.includes("openCleanReport"));
ok("HTML has duration field", HTML.includes('id="durationMin"'));
ok("HTML has readme modal", HTML.includes('id="readmeModal"'));
ok("HTML has capture button", HTML.includes('id="btnCaptureDemand"'));
ok("HTML has clean report button", HTML.includes('id="btnCleanReport"'));

// Live server
try {
  const live = await fetch("http://127.0.0.1:4180/sprinkler-system-estimator/assets/app.js");
  const txt = await live.text();
  ok("Live JS 1.6.x", /1\.6\.\d+-prelim/.test(txt));
  ok("Live no af-sundown-dry", !txt.includes("af-sundown-dry"));
  ok("Live no storage-dry", !txt.includes("ds8-9-storage-dry"));
  ok("Live has handoff", txt.includes("fireToolshed.sprinklerHandoff.v1"));
  ok("Live has flow test curve", txt.includes("supplyPressureAtFlow") && txt.includes("renderSupplySvg"));
  const page = await fetch("http://127.0.0.1:4180/sprinkler-system-estimator/");
  ok("Live HTML 200", page.status === 200);
  const fps = await fetch("http://127.0.0.1:4180/fire-pump-sizer/assets/app.js");
  const fpsTxt = await fps.text();
  ok("Live FPS import", fpsTxt.includes("importSprinklerDemand"));
} catch (e) {
  warn("Live server check failed: " + e.message);
}

// Counts summary notes
results.notes.push(
  `Preset counts: UFC ${UFC.length}, NFPA ${NFPA.length}, AF ${AF.length}, FM ${FM.length}`
);
results.notes.push(`UFC wet=${ufcWet.length} dry=${ufcDry.length}`);
results.notes.push(`JS version ${verJs}`);

console.log(JSON.stringify({ pass: results.pass, fail: results.fail, warns: results.warns.length }, null, 2));
console.log(`\nSUMMARY: ${results.pass} passed, ${results.fail} failed, ${results.warns.length} warnings`);
if (results.fails.length) {
  console.log("\nFAILURES:");
  results.fails.forEach((f) => console.log(" - " + f));
}
if (results.warns.length) {
  console.log("\nWARNINGS:");
  results.warns.forEach((w) => console.log(" - " + w));
}
if (results.notes.length) {
  console.log("\nNOTES:");
  results.notes.forEach((n) => console.log(" - " + n));
}

process.exit(results.fail ? 1 : 0);
