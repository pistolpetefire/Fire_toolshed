// MAQ evaluation bridge for Hazardous Materials Assessor.
// Reuses logic from ../maq-control-area/assets/maq-engine.js (simplified for export).
// Maps free-text hazard classifications to known table keys where possible.

export const MATERIALS = [
  {key:"fl-IA", mat:"Flammable liquid", cls:"IA", unit:"gal", storage:[30,"de"], closed:[30,"d"], open:[10,"d"], hazard:"physical"},
  {key:"fl-IBIC", mat:"Flammable liquid", cls:"IB and IC", unit:"gal", storage:[120,"de"], closed:[120,"d"], open:[30,"d"], hazard:"physical"},
  {key:"cl-II", mat:"Combustible liquid", cls:"II", unit:"gal", storage:[120,"de"], closed:[120,"d"], open:[30,"d"], hazard:"physical"},
  {key:"cl-IIIA", mat:"Combustible liquid", cls:"IIIA", unit:"gal", storage:[330,"de"], closed:[330,"d"], open:[80,"d"], hazard:"physical"},
  {key:"cl-IIIB", mat:"Combustible liquid", cls:"IIIB", unit:"gal", storage:[13200,"ef"], closed:[13200,"f"], open:[3300,"f"], hazard:"physical"},
  {key:"fsolid", mat:"Flammable solid", cls:"\u2014", unit:"lb", storage:[125,"de"], closed:[125,"d"], open:[25,"d"], hazard:"physical"},
  {key:"fg-gas-high", mat:"Flammable gas, gaseous", cls:"1A and 1B (High BV)", unit:"cu ft (NTP)", storage:[1000,"de"], closed:[1000,"de"], open:["NA",""], hazard:"physical"},
  {key:"ox-3", mat:"Oxidizer", cls:"3", unit:"lb", storage:[10,"de"], closed:[2,"d"], open:[2,"d"], hazard:"physical"},
  {key:"ox-2", mat:"Oxidizer", cls:"2", unit:"lb", storage:[250,"de"], closed:[250,"d"], open:[50,"d"], hazard:"physical"},
  {key:"ox-1", mat:"Oxidizer", cls:"1", unit:"lb", storage:[4000,"ef"], closed:[4000,"f"], open:[1000,"f"], hazard:"physical"},
  {key:"cor-s", mat:"Corrosive", cls:"solid", unit:"lb", storage:[5000,"de"], closed:[5000,"d"], open:[1000,"d"], hazard:"health"},
  {key:"cor-l", mat:"Corrosive", cls:"liquid", unit:"gal", storage:[500,"de"], closed:[500,"d"], open:[100,"d"], hazard:"health"},
  {key:"tox-s", mat:"Toxic", cls:"solid", unit:"lb", storage:[500,"de"], closed:[500,"d"], open:[125,"d"], hazard:"health"},
  {key:"tox-l", mat:"Toxic", cls:"liquid", unit:"lb", storage:[500,"de"], closed:[500,"d"], open:[125,"d"], hazard:"health"},
  {key:"ht-s", mat:"Highly toxic", cls:"solid", unit:"lb", storage:[10,"de"], closed:[10,"d"], open:[3,"d"], hazard:"health"},
  {key:"ht-l", mat:"Highly toxic", cls:"liquid", unit:"lb", storage:[10,"de"], closed:[10,"d"], open:[3,"d"], hazard:"health"},
];

export function matchHazard(label) {
  const l = String(label || "").toLowerCase();
  if (/flammable liquid.*\bia\b|class ia/.test(l)) return "fl-IA";
  if (/flammable liquid.*(ib|ic)|class i[bc]/.test(l)) return "fl-IBIC";
  if (/combustible liquid.*\bii\b|class ii[^i]/.test(l)) return "cl-II";
  if (/combustible liquid.*iiia|class iiia/.test(l)) return "cl-IIIA";
  if (/combustible liquid.*iiib|class iiib/.test(l)) return "cl-IIIB";
  if (/flammable solid/.test(l)) return "fsolid";
  if (/flammable gas/.test(l)) return "fg-gas-high";
  if (/oxidizer.*\b3\b|class 3 oxid/.test(l)) return "ox-3";
  if (/oxidizer.*\b2\b|class 2 oxid/.test(l)) return "ox-2";
  if (/oxidizer.*\b1\b|class 1 oxid/.test(l)) return "ox-1";
  if (/corrosive.*solid/.test(l)) return "cor-s";
  if (/corrosive.*(liquid|gal)/.test(l)) return "cor-l";
  if (/toxic.*solid/.test(l) && !/highly/.test(l)) return "tox-s";
  if (/toxic.*(liquid|gal)/.test(l) && !/highly/.test(l)) return "tox-l";
  if (/highly toxic.*solid/.test(l)) return "ht-s";
  if (/highly toxic.*(liquid|gal)/.test(l)) return "ht-l";
  return null;
}

function cellMAQ(cell, sprinklered, cabinet, storyPct = 100) {
  const [base, notes] = cell;
  if (base === "NA") return {kind: "NA", limit: null, text: "NA"};
  if (base === "NL") return {kind: "NL", limit: Infinity, text: "Not limited"};
  if (typeof base !== "number") return {kind: "NOTE", limit: null, text: "Not tabulated"};
  let factor = 1;
  if (notes.includes("d") && sprinklered) factor *= 2;
  if (notes.includes("e") && cabinet) factor *= 2;
  if (notes.includes("f") && sprinklered) return {kind: "NL", limit: Infinity, text: "Not limited (sprinklered)"};
  const limit = base * factor * (storyPct / 100);
  return {kind: "num", limit, text: String(Math.round(limit * 1000) / 1000)};
}

export function evaluateGroup(key, storage, closed, open, project, opts = {}) {
  const m = MATERIALS.find(x => x.key === key);
  if (!m) return {matched: false, exceeded: false, storageMAQ: "Not matched", closedMAQ: "Not matched", openMAQ: "Not matched", exceededFlag: "Not assessed", hGroup: ""};
  const projectSprinklered = /yes|sprinkler/i.test(project.sprinkler || "");
  const sprinklered = opts.sprinkler !== undefined && opts.sprinkler !== null ? !!opts.sprinkler : projectSprinklered;
  const cabinet = !!opts.cabinet;
  const storyPct = 100;
  const sMAQ = cellMAQ(m.storage, sprinklered, cabinet, storyPct);
  const cMAQ = cellMAQ(m.closed, sprinklered, cabinet, storyPct);
  const oMAQ = cellMAQ(m.open, sprinklered, cabinet, storyPct);
  const sEx = sMAQ.limit != null && storage != null && storage > sMAQ.limit;
  const cEx = cMAQ.limit != null && closed != null && closed > cMAQ.limit;
  const oEx = oMAQ.limit != null && open != null && open > oMAQ.limit;
  const exceeded = sEx || cEx || oEx;
  return {
    matched: true,
    exceeded,
    storageMAQ: sMAQ.text,
    closedMAQ: cMAQ.text,
    openMAQ: oMAQ.text,
    exceededFlag: exceeded ? "YES" : "NO",
    hGroup: exceeded ? (m.hazard === "health" ? "H-4" : "See table") : "",
    usedCabinet: cabinet,
    usedSprinkler: sprinklered
  };
}
