/**
 * Build parallel Forms B and C from Form A: different occupancies,
 * shuffled keys, Form-B/C scenario tags. Run: node qa/gen-bc.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "js/item-factory.js", "js/bank.js", "js/form-a-rest.js",
  "js/form-a-rest2.js", "js/form-a-rest3.js", "js/form-b.js",
  "js/form-c.js", "js/boot.js",
];

function loadA() {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(readFileSync(join(root, f), "utf8"), ctx, { filename: f });
  return ctx.window.PE_FPE_FORMS.A;
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OCC_B = [
  [/400-bed hospital/gi, "1.2-million-ft² cold-storage warehouse"],
  [/hospital/gi, "cold-storage warehouse"],
  [/14 m tall hotel atrium/gi, "18 m airport concourse void"],
  [/hotel atrium/gi, "airport concourse"],
  [/hotel/gi, "airport terminal"],
  [/open-plan office/gi, "middle-school classroom wing"],
  [/office is 55 dBA/gi, "classroom is 50 dBA"],
  [/office/gi, "classroom wing"],
  [/solvent room/gi, "paint-mix room"],
  [/light-manufacturing building/gi, "tire-warehouse fire area"],
  [/exhibition hall/gi, "indoor flea-market hall"],
  [/loading dock/gi, "unheated lumber shed"],
  [/computer hall/gi, "data hall"],
  [/3D printer farm/gi, "CNC electronics cell"],
  [/community college|assembly space/gi, "school gymnasium"],
  [/two-story assembly/gi, "school gymnasium"],
  [/windowless inner office/gi, "windowless records room"],
  [/windowless corridor/gi, "windowless sterile corridor"],
];

const OCC_C = [
  [/400-bed hospital/gi, "800-bed university medical center"],
  [/hospital/gi, "research-lab campus"],
  [/14 m tall hotel atrium/gi, "22 m shopping-mall atrium"],
  [/hotel atrium/gi, "mall atrium"],
  [/hotel/gi, "regional mall"],
  [/open-plan office/gi, "call-center floor"],
  [/office is 55 dBA/gi, "call center is 60 dBA"],
  [/office/gi, "call-center floor"],
  [/solvent room/gi, "composite-layup room"],
  [/light-manufacturing building/gi, "aircraft hangar annex"],
  [/exhibition hall/gi, "convention exhibit hall"],
  [/loading dock/gi, "unheated rail siding canopy"],
  [/computer hall/gi, "trading-floor IDF room"],
  [/3D printer farm/gi, "lithium-battery pack assembly cell"],
  [/two-story assembly/gi, "arena concourse"],
  [/windowless inner office/gi, "windowless MRI control room"],
  [/windowless corridor/gi, "windowless sterile core"],
];

function applyOcc(text, pairs) {
  let s = text;
  for (const [re, to] of pairs) s = s.replace(re, to);
  return s;
}

function transform(it, form, occ, seed) {
  const rand = rng(seed + it.number * 17);
  const letters = ["A", "B", "C", "D"];
  const tagged = applyOcc(it.stem, occ) + `\n\nForm ${form} uses this occupancy and the values printed in the stem. Do not reuse Form A numbers from memory.`;
  const order = shuffle([0, 1, 2, 3], rand);
  const oldChoices = it.choices;
  const newChoices = order.map((oldIdx, newIdx) => ({
    key: letters[newIdx],
    text: applyOcc(oldChoices[oldIdx].text, occ),
  }));
  const oldAnsIdx = letters.indexOf(it.answer);
  const newAnsIdx = order.indexOf(oldAnsIdx);
  const newAns = letters[newAnsIdx];
  const why = {};
  order.forEach((oldIdx, newIdx) => {
    const oldL = letters[oldIdx];
    if (oldL === it.answer) return;
    const note = (it.solution.whyWrong || {})[oldL];
    if (note) why[letters[newIdx]] = applyOcc(note, occ);
  });
  return {
    ...it,
    id: `FPE-2027-${form}-` + String(it.number).padStart(3, "0"),
    form,
    stem: tagged,
    choices: newChoices,
    answer: newAns,
    solution: {
      ...it.solution,
      outline: applyOcc(it.solution.outline, occ),
      whyWrong: why,
    },
  };
}

function emit(form, items) {
  const body = items.map((it) => JSON.stringify(it)).join(",\n");
  return `/** Form ${form} — parallel 85-item 2027 blueprint pack. */\nwindow.PE_FPE_ITEMS_${form} = [\n${body}\n];\n`;
}

const A = loadA();
const B = A.map((it) => transform(it, "B", OCC_B, 701));
const C = A.map((it) => transform(it, "C", OCC_C, 1301));
writeFileSync(join(root, "js/form-b.js"), emit("B", B));
writeFileSync(join(root, "js/form-c.js"), emit("C", C));
console.log("wrote B", B.length, "C", C.length);
