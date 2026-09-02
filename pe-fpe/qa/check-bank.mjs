/**
 * Style-lock QA for Form A items 1–15.
 * Run: node qa/check-bank.mjs   (from pe-fpe/)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "js/bank.js"), "utf8");
const window = {};
Function("window", src)(window);
const items = window.PE_FPE_ITEMS;
const locks = [
  "NFPA 11-2024", "NFPA 13-2022", "NFPA 20-2022", "NFPA 30-2024", "NFPA 72-2022",
  "NFPA 92-2024", "NFPA 101-2024", "NFPA 400-2022", "NFPA 855-2023", "NFPA 2001-2022",
];
const fail = [];
const ok = (c, m) => { if (!c) fail.push(m); };

ok(items.length === 15, `expected 15 items, got ${items.length}`);
ok(items.every((it) => it.type === "mcq4"), "every item is mcq4");
ok(items.every((it) => (it.choices || []).length === 4), "every item has 4 choices");
ok(items.every((it) => ["A", "B", "C", "D"].includes(it.answer)), "answers are A–D");
ok(items.every((it) => it.solution && it.solution.whyWrong), "every item explains wrong choices");
items.forEach((it) => {
  const wrong = Object.keys(it.solution.whyWrong || {});
  const expect = ["A", "B", "C", "D"].filter((k) => k !== it.answer);
  ok(expect.every((k) => wrong.includes(k)), `${it.id} missing whyWrong for ${expect.filter((k) => !wrong.includes(k)).join(",")}`);
  ok(!wrong.includes(it.answer), `${it.id} whyWrong includes the key`);
});
ok(items.some((it) => it.units === "US") && items.some((it) => it.units === "SI"), "both US and SI");
ok(items.some((it) => it.edition_lock === "NFPA 855-2023"), "has NFPA 855-2023");
ok(items.some((it) => it.edition_lock === "NFPA 30-2024"), "has NFPA 30-2024");
ok(items.every((it) => !it.edition_lock || locks.includes(it.edition_lock)), "edition locks on 2027 list");

const keys = {
  "FPE-2027-A-001": "B",
  "FPE-2027-A-002": "B",
  "FPE-2027-A-003": "B",
  "FPE-2027-A-004": "A",
  "FPE-2027-A-005": "B",
  "FPE-2027-A-006": "A",
  "FPE-2027-A-007": "A",
  "FPE-2027-A-008": "B",
  "FPE-2027-A-009": "A",
  "FPE-2027-A-010": "A",
  "FPE-2027-A-011": "A",
  "FPE-2027-A-012": "A",
  "FPE-2027-A-013": "A",
  "FPE-2027-A-014": "A",
  "FPE-2027-A-015": "A",
};
items.forEach((it) => ok(it.answer === keys[it.id], `key mismatch ${it.id}`));

if (fail.length) {
  console.error("FAIL");
  fail.forEach((m) => console.error(" -", m));
  process.exit(1);
}
console.log("OK  15 mcq4 items; whyWrong on every distractor; 855 and 30 present");
