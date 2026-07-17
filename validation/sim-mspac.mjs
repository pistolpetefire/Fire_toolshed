import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "games/ms-pac/game.js"), "utf8");

let pass = 0, fail = 0;
function ok(n, c, d) {
  if (c) {
    pass++;
    console.log("  OK ", n);
  } else {
    fail++;
    console.log("  FAIL", n, d || "");
  }
}

const els = {};
function classList() {
  const s = new Set();
  return {
    add: (x) => s.add(x),
    remove: (x) => s.delete(x),
    toggle: (x, on) =>
      on === undefined ? (s.has(x) ? s.delete(x) : s.add(x)) : on ? s.add(x) : s.delete(x),
    contains: (x) => s.has(x),
  };
}
function el(id) {
  if (!els[id]) {
    els[id] = {
      id,
      classList: classList(),
      style: {},
      textContent: "",
      innerHTML: "",
      onclick: null,
      width: 304,
      height: 364,
      clientWidth: 900,
      clientHeight: 500,
      getContext: () => mockCtx,
    };
  }
  return els[id];
}
const mockCtx = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  font: "",
  textAlign: "",
  globalAlpha: 1,
  lineCap: "",
  fillRect() {},
  strokeRect() {},
  beginPath() {},
  closePath() {},
  moveTo() {},
  lineTo() {},
  arc() {},
  quadraticCurveTo() {},
  stroke() {},
  fill() {},
  createRadialGradient() {
    return { addColorStop() {} };
  },
  createLinearGradient() {
    return { addColorStop() {} };
  },
  setLineDash() {},
  save() {},
  restore() {},
  fillText() {},
  ellipse() {},
  translate() {},
};

const store = {};
function raf() {
  return 1;
}
const sandbox = {
  console,
  Math,
  JSON,
  String,
  Number,
  Array,
  Object,
  parseInt,
  isNaN,
  setTimeout() {},
  requestAnimationFrame: raf,
  localStorage: {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => {
      store[k] = String(v);
    },
  },
  window: {
    AudioContext: function () {
      this.state = "running";
      this.currentTime = 0;
      this.destination = {};
      this.resume = () => Promise.resolve();
      this.createOscillator = () => ({
        type: "",
        frequency: { value: 0 },
        connect() {},
        start() {},
        stop() {},
      });
      this.createGain = () => ({
        gain: { value: 0, exponentialRampToValueAtTime() {} },
        connect() {},
      });
    },
    webkitAudioContext: null,
    requestAnimationFrame: raf,
    addEventListener() {},
    innerWidth: 900,
    innerHeight: 700,
    ResizeObserver: function () {
      this.observe = () => {};
    },
  },
  document: {
    getElementById: (id) => el(id),
    querySelectorAll: () => [],
    body: { addEventListener() {} },
  },
};
sandbox.window = Object.assign(sandbox.window, {
  document: sandbox.document,
  localStorage: sandbox.localStorage,
});
sandbox.globalThis = sandbox.window;
sandbox.self = sandbox.window;

try {
  vm.runInNewContext(code, sandbox, { timeout: 3000 });
  ok("loads", !!sandbox.window.__MSPAC__);
} catch (e) {
  ok("loads", false, e.message);
  console.error(e);
  process.exit(1);
}

const API = sandbox.window.__MSPAC__;

console.log("\n=== CYCLE 1: boot + motion ===");
API.startGame();
let st = API.getState();
ok("playing", st.playing);
ok("ready > 0", st.ready > 0, String(st.ready));
ok("pac spawned", !!st.pac);
ok("4 ghosts", st.ghosts.length === 4);
ok("many dots", st.dotsLeft > 80, String(st.dotsLeft));

API.tick(st.ready + 2);
st = API.getState();
ok("ready done", st.ready === 0);

const x0 = st.pac.x,
  y0 = st.pac.y;
API.setWant("L");
API.tick(40);
st = API.getState();
const movedPac = Math.abs(st.pac.x - x0) + Math.abs(st.pac.y - y0);
ok("pac moves", movedPac > 8, "d=" + movedPac.toFixed(1));

const g0 = st.ghosts.map((g) => g.x.toFixed(1) + g.y.toFixed(1)).join("|");
API.tick(50);
st = API.getState();
const g1 = st.ghosts.map((g) => g.x.toFixed(1) + g.y.toFixed(1)).join("|");
ok("ghosts move", g0 !== g1);

console.log("\n=== CYCLE 2: pellets, reverse, stress, modes ===");
// Restart clean for pellet path along open corridor left of spawn
API.startGame();
st = API.getState();
API.tick(st.ready + 2);
API.setWant("L");
const dots0 = API.getState().dotsLeft;
for (let i = 0; i < 120; i++) API.tick(1);
st = API.getState();
ok("ate pellets moving left", st.dotsLeft < dots0 && st.score > 0, "dots " + st.dotsLeft + " score " + st.score);

// Instant reverse
const xBefore = st.pac.x;
API.setWant("R");
API.tick(30);
st = API.getState();
ok("instant reverse right", st.pac.x > xBefore + 4, "x " + st.pac.x + " was " + xBefore);

// Vertical corridor near spawn: move up if possible
API.setWant("U");
const yB = st.pac.y;
API.tick(80);
st = API.getState();
const movedY = Math.abs(st.pac.y - yB);
ok("can change axis / keep moving", movedY > 4 || Math.abs(st.pac.x - xBefore) > 10, "dy=" + movedY.toFixed(1));

// Long stress — horizontal patrol on open row (safer than random thrash into ghosts)
const dots1 = st.dotsLeft;
const score1 = st.score;
let flip = 0;
for (let i = 0; i < 2500; i++) {
  if (i % 40 === 0) {
    flip = 1 - flip;
    API.setWant(flip ? "L" : "R");
  }
  if (i % 200 === 100) API.setWant("U");
  if (i % 200 === 140) API.setWant("D");
  API.tick(1);
}
st = API.getState();
ok("survived 2500 ticks", !!st.pac && Number.isFinite(st.pac.x));
ok("score non-negative", st.score >= 0);
ok(
  "progress or clean game-over",
  st.dotsLeft < dots1 || st.score > score1 || (!st.playing && st.lives === 0),
  "dots " + st.dotsLeft + "/" + dots1 + " score " + st.score + " lives " + st.lives
);
ok(
  "ghost modes ok",
  st.ghosts.every((g) => ["scatter", "chase", "fright", "eyes"].includes(g.mode)),
  st.ghosts.map((g) => g.mode).join(",")
);
ok("lives sane", st.lives >= 0 && st.lives <= 5, String(st.lives));
ok("level >= 1", st.level >= 1);

// Force power-pellet path: teleport-ish via many left then up to power at (1,15) is o at row 15
// Power pellets at (1,2), (17,2), (1,15), (17,15) from maze
// Just check fright can activate by eating via simulated path if still alive
console.log("  score=", st.score, "dotsLeft=", st.dotsLeft, "lives=", st.lives, "level=", st.level);

// restart stability
API.startGame();
st = API.getState();
ok("restart works", st.playing && st.ready > 0 && st.score === 0);
API.tick(st.ready + 5);
API.setWant("L");
API.tick(20);
st = API.getState();
ok("moves after restart", Math.abs(st.pac.x - (9 * 16 + 8)) > 5, "x=" + st.pac.x);

// Buffer want during ready
API.startGame();
API.setWant("R");
st = API.getState();
API.tick(st.ready + 25);
st = API.getState();
ok("want buffered during ready", st.pac.want === "R" && st.pac.x > 152, "want=" + st.pac.want + " x=" + st.pac.x);

console.log("\n=== SUMMARY ===");
console.log("Passed:", pass, "Failed:", fail);
process.exit(fail ? 1 : 0);
