/**
 * FA Power Extenders — engine golden cases.
 * Run from this folder or repo: node fa-power-extenders/validation/run-tests.mjs
 */
import { readFileSync } from "fs";
import { createContext, runInContext } from "vm";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadUmd(rel) {
  const sandbox = { module: { exports: {} }, exports: {}, console };
  sandbox.globalThis = sandbox;
  createContext(sandbox);
  runInContext(readFileSync(join(__dirname, rel), "utf8"), sandbox);
  return sandbox.module.exports;
}

const E = loadUmd("../assets/engine.js");
const C = loadUmd("../assets/catalog.js");

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log("  OK  ", msg);
  } else {
    failed++;
    console.error("  FAIL", msg);
  }
}

function almost(a, b, tol, msg) {
  const ok = Math.abs(a - b) <= tol;
  assert(ok, `${msg} (got ${a}, expected ${b} ± ${tol})`);
}

console.log("\n=== FA Power Extenders — validation ===\n");

console.log("Catalog currents");
almost(C.typicalCurrent("horn", 75), 0.035, 1e-9, "horn is 35 mA");
almost(C.typicalCurrent("strobe", 75), 0.165, 1e-9, "75 cd strobe is 165 mA");
almost(C.typicalCurrent("horn-strobe", 75), 0.2, 1e-9, "75 cd horn-strobe is 200 mA");

console.log("\nWire / voltage drop");
almost(E.wireOf(16).ohmPerKft, 4.99, 1e-9, "16 AWG 4.99 Ω/kft");
almost(E.wireOf(12).ohmPerKft, 1.98, 1e-9, "12 AWG 1.98 Ω/kft");

const vd16 = E.voltageDropV({
  currentA: 2,
  oneWayFt: 100,
  awg: 16,
  classType: "B",
  placement: "end",
});
almost(vd16, 1.996, 1e-6, "2 A · 16 AWG · 100 ft Class B end → 1.996 V");

const vdDist = E.voltageDropV({
  currentA: 2,
  oneWayFt: 100,
  awg: 16,
  classType: "B",
  placement: "distributed",
});
almost(vdDist, 0.998, 1e-6, "distributed uses half the run");

const vdA = E.voltageDropV({
  currentA: 2,
  oneWayFt: 100,
  returnFt: 100,
  awg: 16,
  classType: "A",
  placement: "end",
});
almost(vdA, 3.992, 1e-6, "Class A outgoing + return doubles Class B end drop");

const vlast = E.lastDeviceVoltage({
  sourceV: 20.4,
  currentA: 2,
  oneWayFt: 100,
  awg: 16,
  classType: "B",
  placement: "end",
});
almost(vlast, 18.404, 1e-6, "20.4 − 1.996 = 18.404 V at last device");

console.log("\nStatus helpers");
assert(E.currentStatus(2.1, 2, 0.2) === "fail", "overcurrent fails");
assert(E.currentStatus(1.7, 2, 0.2) === "marginal", "above 80% of rating is marginal");
assert(E.currentStatus(1.5, 2, 0.2) === "pass", "at or under spare target passes");
assert(E.dropStatus(15.5, 16) === "fail", "below Vmin fails");
assert(E.dropStatus(16.4, 16) === "marginal", "within 1 V of Vmin is marginal");
assert(E.dropStatus(18, 16) === "pass", "comfortable margin passes");

console.log("\nLong homerun — 16 AWG fails, 12 AWG still fails, 10 AWG would pass");
const long = {
  id: "c2",
  name: "NAC 2 — Bldg 1442A",
  classType: "B",
  ratingA: 2,
  poweredBy: "facp",
  devices: [
    {
      id: "d2",
      type: "horn-strobe",
      candela: 75,
      qty: 9,
      currentA: 0.2,
      vmin: 16,
      oneWayFt: 620,
      returnFt: 620,
      awg: 16,
      placement: "end",
      zone: "1442A",
    },
  ],
};
const proj = { sourceVoltage: 20.4, spareFraction: 0.2, criteria: "nfpa72" };
const a2 = E.analyzeCircuit(long, proj);
almost(a2.I, 1.8, 1e-9, "9 × 0.200 A = 1.800 A");
assert(a2.dropStatus === "fail", "620 ft / 16 AWG fails drop");
assert(a2.status === "fail", "circuit fails");
const w12 = E.whatIfAwg(long, proj, 12);
assert(w12.dropStatus === "fail", "12 AWG still below 16 V");
assert(w12.drop.vlast < 16, "12 AWG Vlast < 16");
const w10 = E.whatIfAwg(long, proj, 10);
assert(w10.dropStatus !== "fail", "10 AWG would pass drop (not offered as a fix)");
const passAwg = E.smallestPassingAwg(long, proj);
assert(passAwg == null, "decision engine will not treat 10 AWG as a wire fix");

console.log("\nExample project verdict");
function exampleProject() {
  const hs = C.typicalCurrent("horn-strobe", 75);
  function row(zone, qty, ft, place) {
    return {
      id: zone,
      type: "horn-strobe",
      candela: 75,
      qty,
      currentA: hs,
      vmin: 16,
      oneWayFt: ft,
      returnFt: ft,
      awg: 16,
      placement: place,
      zone,
    };
  }
  return {
    sourceVoltage: 20.4,
    spareFraction: 0.2,
    criteria: "nfpa72",
    batteryAging: 1.25,
    batteryTemp: 1,
    batterySpare: 1.2,
    panel: {
      name: "Generic 24 V — 4 × 2.0 A (6 A budget)",
      voltage: 24,
      budgetA: 6,
      circuits: [
        { id: "c1", name: "NAC 1 — Floor 1", classType: "B", ratingA: 2, poweredBy: "facp", devices: [row("Floor 1", 8, 85, "distributed")] },
        { id: "c2", name: "NAC 2 — Bldg 1442A", classType: "B", ratingA: 2, poweredBy: "facp", devices: [row("1442A", 9, 620, "end")] },
        { id: "c3", name: "NAC 3 — Floor 2", classType: "B", ratingA: 2, poweredBy: "facp", devices: [row("Floor 2", 9, 140, "distributed")] },
        { id: "c4", name: "NAC 4 — Stairs / core", classType: "B", ratingA: 2, poweredBy: "facp", devices: [row("Core", 8, 100, "distributed")] },
      ],
    },
    extenders: [],
  };
}

const ex = E.analyzeProject(exampleProject());
assert(ex.rec.verdict === "extender-required", "example verdict is extender-required (got " + ex.rec.verdict + ")");
assert(ex.totals.failN >= 1, "at least one circuit fails");
almost(ex.panel.loadA, 6.8, 0.05, "panel load 8+9+9+8 devices × 0.2 A = 6.8 A");
assert(ex.panel.status === "fail", "6.8 A exceeds 6 A budget");
assert(ex.rec.wireCannot.length >= 1, "wire upsize does not clear the 620 ft run");
assert(ex.rec.extenderSize.ratingA >= 6, "recommended extender has a size band");

console.log("\nShort circuit that 12 AWG can save");
const shortDrop = {
  id: "s",
  name: "NAC short",
  classType: "B",
  ratingA: 2,
  poweredBy: "facp",
  devices: [
    {
      id: "ds",
      qty: 8,
      currentA: 0.2,
      vmin: 16,
      oneWayFt: 280,
      returnFt: 280,
      awg: 16,
      placement: "end",
    },
  ],
};
const sd = E.analyzeCircuit(shortDrop, proj);
const sd12 = E.whatIfAwg(shortDrop, proj, 12);
assert(sd.dropStatus === "fail", "280 ft / 1.6 A / 16 AWG fails at 20.4 V");
assert(sd12.dropStatus === "pass", "12 AWG clears the 280 ft run");
assert(sd.currentStatus !== "fail", "1.6 A is not overcurrent on a 2 A NAC");

console.log("\nBattery NFPA vs UFC");
const batN = E.batteryAh({
  iStandby: 0.09,
  iAlarm: 1.89,
  standbyH: 24,
  alarmMin: 5,
  aging: 1.25,
  temp: 1,
  spare: 1.2,
});
almost(batN.rawAh, 2.3175, 1e-6, "NFPA raw Ah");
almost(batN.requiredAh, 3.47625, 1e-6, "NFPA required Ah with 1.25 × 1.2");
assert(C.pickBattery(batN.requiredAh).ah === 7, "NFPA pair is 7 Ah");

const durU = E.durations("ufc");
assert(durU.standbyH === 60 && durU.alarmMin === 5, "UFC is 60 h + 5 min");
const batU = E.batteryAh({
  iStandby: 0.09,
  iAlarm: 1.89,
  standbyH: durU.standbyH,
  alarmMin: durU.alarmMin,
  aging: 1.25,
  temp: 1,
  spare: 1.2,
});
almost(batU.requiredAh, 8.33625, 1e-5, "UFC required Ah");
assert(C.pickBattery(batU.requiredAh).ah === 12, "UFC pair is 12 Ah");

console.log("\nSpeakers — tap current, drop, 15 min, remote amp");
almost(C.typicalCurrent("speaker", 75), 0, 1e-9, "speaker has no 24 V NAC current");
almost(C.typicalCurrent("speaker-strobe", 75), 0.165, 1e-9, "speaker-strobe NAC current is strobe-only");
almost(C.audioVmin(25), 21.25, 1e-9, "25 V Vmin is 85%");
almost(C.audioVmin(70.7), 60.095, 1e-6, "70.7 V Vmin is 85%");

const audioCkt = {
  id: "a2",
  name: "Audio 2 — 1442A",
  kind: "audio",
  audioV: 25,
  ratingW: 50,
  classType: "B",
  poweredBy: "facp",
  devices: [
    {
      id: "s2",
      type: "speaker",
      tapW: 2,
      qty: 20,
      vmin: 21.25,
      oneWayFt: 620,
      returnFt: 620,
      awg: 16,
      placement: "end",
      zone: "1442A voice",
    },
  ],
};
almost(E.circuitWatts(audioCkt), 40, 1e-9, "20 × 2 W = 40 W");
almost(E.circuitCurrentA(audioCkt), 1.6, 1e-9, "40 W / 25 V = 1.6 A pair current");
const aAna = E.analyzeCircuit(audioCkt, proj);
assert(aAna.kind === "audio", "analyzed as audio");
assert(aAna.dropStatus === "fail", "620 ft / 25 V / 16 AWG fails 85% Vmin");
const a12 = E.whatIfAwg(audioCkt, proj, 12);
assert(a12.drop.vlast < 21.25, "12 AWG still below 21.25 V");
assert(a12.dropStatus === "fail", "12 AWG is not a speaker-circuit fix at 620 ft / 40 W");

const voiceDur = E.durations("nfpa72", { hasAudio: true });
assert(voiceDur.alarmMin === 15, "speaker circuits switch alarm to 15 min");
assert(E.durations("ufc").alarmMin === 5, "no speakers → 5 min unchanged");
const ufcMns = E.durations("ufc", { hasAudio: true });
assert(ufcMns.alarmMin === 60, "UFC 4-021-01 MNS alarm is 60 min");
assert(ufcMns.standbyH === 60, "UFC MNS keeps 60 h standby");
assert(ufcMns.mns === true, "UFC + speakers is flagged as MNS");
assert(/4-021-01/.test(ufcMns.label), "UFC MNS label cites 4-021-01");

const ampI = E.ampSupplyCurrentA(40, { idleA: 0.15, efficiency: 0.55 });
almost(ampI, 0.15 + 40 / (0.55 * 24), 1e-6, "remote amp 24 V current is idle + W/(η×24)");

const voiceProj = exampleProject();
voiceProj.panel.ampBudgetW = 50;
voiceProj.panel.circuits.push(audioCkt);
const voice = E.analyzeProject(voiceProj);
assert(voice.totals.hasAudio, "project reports audio");
assert(voice.durations.alarmMin === 15, "NFPA project with speakers uses 15 min");
const voiceUfcProj = JSON.parse(JSON.stringify(voiceProj));
voiceUfcProj.criteria = "ufc";
const voiceUfc = E.analyzeProject(voiceUfcProj);
assert(voiceUfc.durations.alarmMin === 60, "UFC project with speakers uses 60 min MNS");
assert(voice.rec.audioExtenderRequired, "remote amplifier required for 1442A voice");
assert(voice.rec.nacExtenderRequired, "NAC extender still required for strobe homerun");
assert(voice.rec.verdict === "extender-required", "combined verdict stays extender-required");
almost(voice.panel.ampLoadW, 40, 0.05, "onboard amp sees 40 W");
almost(voice.panel.loadA, 6.8, 0.05, "speaker pair current is not added to the NAC budget");

const movedAudio = JSON.parse(JSON.stringify(voiceProj));
movedAudio.extenders = [
  { id: "x1", name: "EXT-1", kind: "nac", ratingA: 8, circuitCount: 4, ampsPerCircuit: 3, idleA: 0.09 },
  { id: "amp1", name: "AMP-1", kind: "amp", ratingW: 50, circuitCount: 2, idleA: 0.15, efficiency: 0.55 },
];
movedAudio.panel.circuits[1].poweredBy = "x1";
movedAudio.panel.circuits[movedAudio.panel.circuits.length - 1].poweredBy = "amp1";
const afterA = E.analyzeProject(movedAudio);
const remAmp = afterA.extenders.filter(function (e) { return e.kind === "amp"; })[0];
assert(remAmp && remAmp.loadW > 39, "remote amp carries speaker watts");
assert(remAmp.battery.alarmMin === 15, "remote amp battery uses 15 min");
assert(remAmp.battery.iAlarm > remAmp.battery.iStandby, "amp alarm current exceeds idle");

console.log("\nEmpty circuit passes");
const empty = E.analyzeCircuit(
  { id: "e", name: "Spare", classType: "B", ratingA: 2, poweredBy: "facp", devices: [] },
  proj
);
assert(empty.status === "pass" && empty.I === 0, "empty spare NAC passes");

console.log("\nMove long run onto extender clears FACP budget");
const moved = exampleProject();
moved.extenders = [{ id: "x1", name: "EXT-1", location: "1442A", ratingA: 8, circuitCount: 4, ampsPerCircuit: 3, idleA: 0.09 }];
moved.panel.circuits[1].poweredBy = "x1";
const after = E.analyzeProject(moved);
almost(after.panel.loadA, 5.0, 0.05, "FACP load after moving 1.8 A off-panel");
assert(after.panel.status !== "fail", "panel budget passes after the move");
assert(after.extenders[0].loadA > 1.7, "extender carries the remote NAC");
assert(after.extenders[0].battery.requiredAh > 0, "extender battery is sized");

console.log("\n=== " + passed + " passed, " + failed + " failed ===\n");
process.exit(failed ? 1 : 0);
