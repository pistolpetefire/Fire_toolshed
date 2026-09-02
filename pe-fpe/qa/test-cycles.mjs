/**
 * Two test cycles for PE-FPE item banks.
 * Cycle 1: load, schema, blueprint, keys.
 * Cycle 2: re-run after recording cycle-1 issues (same checks + uniqueness).
 *
 * Run from pe-fpe/: node qa/test-cycles.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "js/item-factory.js",
  "js/bank.js",
  "js/form-a-rest.js",
  "js/form-a-rest2.js",
  "js/form-a-rest3.js",
  "js/form-b.js",
  "js/form-c.js",
  "js/boot.js",
  "js/references.js",
];

function load() {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  for (const f of files) {
    vm.runInContext(readFileSync(join(root, f), "utf8"), ctx, { filename: f });
  }
  return ctx.window;
}

function cycle(label, w) {
  const fail = [];
  const ok = (c, m) => { if (!c) fail.push(m); };
  const locks = [
    "NFPA 11-2024", "NFPA 13-2022", "NFPA 20-2022", "NFPA 30-2024", "NFPA 72-2022",
    "NFPA 92-2024", "NFPA 101-2024", "NFPA 400-2022", "NFPA 855-2023", "NFPA 2001-2022",
  ];
  const targets = { 1: 12, 2: 12, 3: 8, 4: 10, 5: 15, 6: 9, 7: 10, 8: 9 };
  const ranges = { 1: [10, 15], 2: [10, 15], 3: [6, 9], 4: [8, 12], 5: [12, 18], 6: [7, 11], 7: [8, 12], 8: [9, 14] };

  for (const form of ["A", "B", "C"]) {
    const items = (w.PE_FPE_FORMS && w.PE_FPE_FORMS[form]) || [];
    const prefix = `Form ${form}: `;
    if (form === "A") {
      ok(items.length === 85, prefix + `expected 85 items, got ${items.length}`);
    } else {
      ok(items.length === 85 || items.length === 0, prefix + `got ${items.length} items (want 85)`);
      if (items.length === 0) continue;
    }
    ok(items.every((it) => it.type === "mcq4"), prefix + "all mcq4");
    ok(items.every((it) => (it.choices || []).length === 4), prefix + "4 choices");
    ok(items.every((it) => ["A", "B", "C", "D"].includes(it.answer)), prefix + "answers A–D");
    ok(items.every((it) => it.solution && it.solution.whyWrong), prefix + "whyWrong present");
    items.forEach((it) => {
      const expect = ["A", "B", "C", "D"].filter((k) => k !== it.answer);
      const got = Object.keys(it.solution.whyWrong || {});
      ok(expect.every((k) => got.includes(k)), `${it.id} missing whyWrong ${expect.filter((k) => !got.includes(k))}`);
      ok(!got.includes(it.answer), `${it.id} whyWrong includes the key`);
      ok(it.handbook || it.code, `${it.id} missing handbook or code`);
      ok(!it.edition_lock || locks.includes(it.edition_lock), `${it.id} bad lock ${it.edition_lock}`);
    });
    const ids = items.map((it) => it.id);
    ok(new Set(ids).size === ids.length, prefix + "duplicate ids");
    const byD = {};
    items.forEach((it) => { byD[it.domain] = (byD[it.domain] || 0) + 1; });
    for (const d of Object.keys(targets)) {
      const n = byD[d] || 0;
      ok(n >= ranges[d][0] && n <= ranges[d][1], prefix + `domain ${d} count ${n} outside ${ranges[d]}`);
    }
    ok(items.some((it) => it.edition_lock === "NFPA 855-2023"), prefix + "needs NFPA 855-2023");
    ok(items.some((it) => it.edition_lock === "NFPA 30-2024"), prefix + "needs NFPA 30-2024");
    ok(items.some((it) => it.units === "US") && items.some((it) => it.units === "SI"), prefix + "needs US and SI");
    const mix = items.filter((it) => /gpm/.test(it.stem) && /L\/min/.test(it.stem) && /report|what is|demand|flow/i.test(it.stem));
    ok(mix.length === 0, prefix + `possible mixed-unit calc stems: ${mix.map((i) => i.id).join(",")}`);
    const letters = { A: 0, B: 0, C: 0, D: 0 };
    items.forEach((it) => { letters[it.answer]++; });
    ok(letters.A <= 40 && letters.B <= 40 && letters.C <= 40 && letters.D <= 40,
      prefix + `key pile-up ${JSON.stringify(letters)}`);
  }
  return { label, fail, nA: w.PE_FPE_FORMS.A.length, nB: w.PE_FPE_FORMS.B.length, nC: w.PE_FPE_FORMS.C.length };
}

const w = load();
const c1 = cycle("cycle-1", w);
const c2 = cycle("cycle-2", w);
const report = { at: new Date().toISOString(), c1, c2, pass: !c1.fail.length && !c2.fail.length };
writeFileSync(join(root, "qa/test-results.json"), JSON.stringify(report, null, 2));
console.log(c1.label, c1.fail.length ? "FAIL" : "OK", `A=${c1.nA} B=${c1.nB} C=${c1.nC}`);
if (c1.fail.length) c1.fail.forEach((m) => console.log("  -", m));
console.log(c2.label, c2.fail.length ? "FAIL" : "OK");
if (c2.fail.length) c2.fail.forEach((m) => console.log("  -", m));
if (!report.pass) process.exit(1);
console.log("two test cycles passed");
