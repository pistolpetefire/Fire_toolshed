/* Ms. Pac Maze v4 — Fire Toolshed Games (fan tribute)
   Always-on rAF · center-cross grid move · 4 ghosts · neon maze */
(function () {
  "use strict";

  var STORAGE = "ft.mspac.v4";
  var RAW = [
    "###################",
    "#........#........#",
    "#o##.###.#.###.##o#",
    "#.................#",
    "#.##.#.#####.#.##.#",
    "#....#...#...#....#",
    "####.###.#.###.####",
    "   #.#.......#.#   ",
    "####.#.##=##.#.####",
    "T....#.#   #.#....T",
    "####.#.#####.#.####",
    "   #.#.......#.#   ",
    "####.#.#####.#.####",
    "#........#........#",
    "#.##.###.#.###.##.#",
    "#o.#.....P.....#.o#",
    "##.#.#.#####.#.#.##",
    "#....#...#...#....#",
    "#.######.#.######.#",
    "#.................#",
    "###################",
  ];
  var ROWS = RAW.length;
  var COLS = RAW[0].length;
  var T = 16;
  var W = COLS * T;
  var H = ROWS * T + 28;
  var DIR = { U: { x: 0, y: -1 }, D: { x: 0, y: 1 }, L: { x: -1, y: 0 }, R: { x: 1, y: 0 } };
  var OPP = { U: "D", D: "U", L: "R", R: "L" };
  var KEYS = ["U", "D", "L", "R"];
  var GDEF = [
    { col: "#ef4444", hi: "#fecaca", scC: 17, scR: 0, name: "Blink" },
    { col: "#f9a8d4", hi: "#fce7f3", scC: 1, scR: 0, name: "Pinky" },
    { col: "#22d3ee", hi: "#a5f3fc", scC: 17, scR: 20, name: "Inky" },
    { col: "#fb923c", hi: "#ffedd5", scC: 1, scR: 20, name: "Clyde" },
  ];

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d", { alpha: false });
  canvas.width = W;
  canvas.height = H;

  var wall = [], dots = [], totalDots = 0, startC = 9, startR = 15;
  var muted = false, audioCtx = null, playing = false, last = 0, frame = 0;
  var score = 0, hi = 0, lives = 3, level = 1, dotsLeft = 0;
  var fright = 0, eatCombo = 0, ready = 0, dying = 0, clearing = 0, gotExtra = false;
  var pac = null, ghosts = [];
  var fruit = null, fruitTimer = 0, fruitScorePop = 0;

  try {
    var sv = JSON.parse(localStorage.getItem(STORAGE) || localStorage.getItem("ft.mspac.v3") || "{}");
    if (sv.hi) hi = sv.hi | 0;
    if (sv.muted) muted = true;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify({ hi: hi, muted: muted })); } catch (e) {}
  }
  function pad(n) {
    n = Math.max(0, n | 0);
    var s = String(n);
    while (s.length < 6) s = "0" + s;
    return s;
  }
  function sndInit() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(function () {});
  }
  function beep(f, d, type, v) {
    if (muted || !audioCtx) return;
    try {
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type || "square";
      o.frequency.value = f;
      g.gain.value = v || 0.05;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
      o.stop(audioCtx.currentTime + d + 0.02);
    } catch (e) {}
  }

  function parseMaze() {
    wall = [];
    dots = [];
    totalDots = 0;
    for (var r = 0; r < ROWS; r++) {
      wall[r] = [];
      dots[r] = [];
      for (var c = 0; c < COLS; c++) {
        var ch = RAW[r][c];
        if (ch === "P") {
          startC = c;
          startR = r;
          ch = " ";
        }
        if (ch === "#") {
          wall[r][c] = 1;
          dots[r][c] = 0;
        } else {
          wall[r][c] = 0;
          if (ch === ".") {
            dots[r][c] = 1;
            totalDots++;
          } else if (ch === "o") {
            dots[r][c] = 2;
            totalDots++;
          } else {
            dots[r][c] = 0;
          }
        }
      }
    }
  }

  function isWall(c, r, ghost) {
    if (r < 0 || r >= ROWS) return true;
    if (c < 0 || c >= COLS) return r !== 9;
    if (wall[r][c]) return true;
    if (!ghost && RAW[r][c] === "=") return true;
    return false;
  }

  function canDir(a, name, ghost) {
    var d = DIR[name];
    if (!d) return false;
    var nc = a.c + d.x;
    var nr = a.r + d.y;
    if (a.r === 9 && (nc < 0 || nc >= COLS)) return true;
    return !isWall(nc, nr, ghost);
  }

  function cellCenter(c, r) {
    return { x: c * T + T / 2, y: r * T + T / 2 };
  }

  function snapToCell(a) {
    a.c = Math.max(0, Math.min(COLS - 1, Math.floor(a.x / T)));
    a.r = Math.max(0, Math.min(ROWS - 1, Math.floor(a.y / T)));
    var ctr = cellCenter(a.c, a.r);
    a.x = ctr.x;
    a.y = ctr.y;
  }

  /** Distance along current axis from entity to current-cell center. */
  function distToCenter(a) {
    var ctr = cellCenter(Math.floor(a.x / T), Math.floor(a.y / T));
    return Math.abs(a.x - ctr.x) + Math.abs(a.y - ctr.y);
  }

  /**
   * Reliable grid move: only decide at cell centers; never snap-back mid-step.
   * When a step would reach/cross center, land on center, turn, then spend remainder.
   */
  function gridMove(a, speed, ghost, want) {
    if (!DIR[a.dir]) a.dir = "L";
    var remain = speed;
    var guard = 0;
    while (remain > 0.0001 && guard++ < 4) {
      a.c = Math.floor(a.x / T);
      a.r = Math.floor(a.y / T);
      if (a.c < 0) a.c = COLS - 1;
      if (a.c >= COLS) a.c = 0;
      if (a.r < 0) a.r = 0;
      if (a.r >= ROWS) a.r = ROWS - 1;

      var ctr = cellCenter(a.c, a.r);
      var d = DIR[a.dir];
      var dx = ctr.x - a.x;
      var dy = ctr.y - a.y;
      var towardCenter =
        (d.x !== 0 && dx * d.x > 0) || (d.y !== 0 && dy * d.y > 0);
      var atCenter = Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05;

      if (atCenter || towardCenter) {
        var need = atCenter ? 0 : Math.abs(d.x ? dx : dy);
        if (need <= remain + 0.001) {
          // Reach center this sub-step
          a.x = ctr.x;
          a.y = ctr.y;
          remain -= need;
          // Tunnel wrap at row 9
          if (a.r === 9) {
            if (a.x < -T / 2) {
              a.x = W + T / 2;
              a.c = COLS - 1;
            } else if (a.x > W + T / 2) {
              a.x = -T / 2;
              a.c = 0;
            }
          }
          // Turn / stop decisions only at center
          if (want && canDir(a, want, ghost)) a.dir = want;
          if (!canDir(a, a.dir, ghost)) {
            // try opposite of want? stay stopped at center
            a.dir = a.dir;
            return;
          }
          d = DIR[a.dir];
          if (remain <= 0) return;
          // leave center with remainder
          if (!canDir(a, a.dir, ghost)) return;
          a.x += d.x * remain;
          a.y += d.y * remain;
          remain = 0;
          break;
        }
      }

      // Mid-corridor: check if next cell is wall before entering
      var look = T / 2 + 0.5;
      var ntc = Math.floor((a.x + d.x * look) / T);
      var ntr = Math.floor((a.y + d.y * look) / T);
      var tc = Math.floor(a.x / T);
      var tr = Math.floor(a.y / T);
      if (ntc !== tc || ntr !== tr) {
        if (!(tr === 9 && (ntc < 0 || ntc >= COLS)) && isWall(ntc, ntr, ghost)) {
          a.x = tc * T + T / 2;
          a.y = tr * T + T / 2;
          a.c = tc;
          a.r = tr;
          return;
        }
      }

      // Tunnel wrap while mid-move
      if (Math.floor(a.y / T) === 9) {
        if (a.x + d.x * remain < -T / 2) {
          a.x = W + T / 2;
          a.c = COLS - 1;
          remain = 0;
          break;
        }
        if (a.x + d.x * remain > W + T / 2) {
          a.x = -T / 2;
          a.c = 0;
          remain = 0;
          break;
        }
      }

      a.x += d.x * remain;
      a.y += d.y * remain;
      remain = 0;
    }

    a.c = Math.floor(a.x / T);
    a.r = Math.floor(a.y / T);
    if (a.c < 0) a.c = COLS - 1;
    if (a.c >= COLS) a.c = 0;
    if (a.r < 0) a.r = 0;
    if (a.r >= ROWS) a.r = ROWS - 1;
  }

  function spawnAll() {
    pac = {
      c: startC,
      r: startR,
      x: startC * T + T / 2,
      y: startR * T + T / 2,
      dir: "L",
      want: "L",
      mouth: 0,
    };
    ghosts = [];
    var spots = [
      { c: 9, r: 9, d: "L", exit: 0 },
      { c: 8, r: 10, d: "U", exit: 40 },
      { c: 9, r: 10, d: "U", exit: 90 },
      { c: 10, r: 10, d: "U", exit: 140 },
    ];
    for (var i = 0; i < 4; i++) {
      ghosts.push({
        id: i,
        c: spots[i].c,
        r: spots[i].r,
        x: spots[i].c * T + T / 2,
        y: spots[i].r * T + T / 2,
        dir: spots[i].d,
        mode: "scatter",
        exit: spots[i].exit,
        want: null,
      });
    }
    fruit = null;
    fruitTimer = 0;
    fruitScorePop = 0;
  }

  function startGame() {
    parseMaze();
    score = 0;
    lives = 3;
    level = 1;
    gotExtra = false;
    fright = 0;
    eatCombo = 0;
    dying = 0;
    clearing = 0;
    dotsLeft = totalDots;
    spawnAll();
    ready = 100;
    playing = true;
    document.getElementById("title").classList.add("hide");
    document.getElementById("how").classList.add("hide");
    document.getElementById("end").classList.add("hide");
    document.getElementById("pad").classList.add("show");
    fit();
    requestAnimationFrame(fit);
  }

  function toTitle() {
    playing = false;
    document.getElementById("title").classList.remove("hide");
    document.getElementById("how").classList.add("hide");
    document.getElementById("end").classList.add("hide");
    document.getElementById("pad").classList.remove("show");
  }

  function endGame() {
    playing = false;
    if (score > hi) {
      hi = score;
      save();
    }
    document.getElementById("pad").classList.remove("show");
    document.getElementById("end").classList.remove("hide");
    document.getElementById("endTitle").textContent = "GAME OVER";
    document.getElementById("endTitle").style.color = "#f87171";
    document.getElementById("endMsg").innerHTML =
      "Score " + pad(score) + "<br>High " + pad(hi);
  }

  function setWant(d) {
    if (!playing || !pac || dying > 0) return;
    // Allow buffering want during READY so first input sticks
    pac.want = d;
  }

  function chooseGhost(g) {
    var opts = [], i, k;
    for (i = 0; i < 4; i++) {
      k = KEYS[i];
      if (g.mode !== "fright" && OPP[g.dir] === k) continue;
      if (canDir(g, k, true)) opts.push(k);
    }
    if (!opts.length) {
      for (i = 0; i < 4; i++) if (canDir(g, KEYS[i], true)) opts.push(KEYS[i]);
    }
    if (!opts.length) return g.dir;
    if (g.mode === "fright") return opts[(Math.random() * opts.length) | 0];

    var tc = pac.c, tr = pac.r;
    if (g.mode === "eyes") {
      tc = 9;
      tr = 9;
    } else if (g.mode === "scatter") {
      tc = GDEF[g.id].scC;
      tr = GDEF[g.id].scR;
    } else if (g.id === 1) {
      // Pinky: 4 ahead
      var pd = DIR[pac.dir] || DIR.L;
      tc = pac.c + pd.x * 4;
      tr = pac.r + pd.y * 4;
    } else if (g.id === 2) {
      // Inky: vector from red through pac*2
      var red = ghosts[0];
      var pd2 = DIR[pac.dir] || DIR.L;
      var ax = pac.c + pd2.x * 2;
      var ay = pac.r + pd2.y * 2;
      tc = ax + (ax - red.c);
      tr = ay + (ay - red.r);
    } else if (g.id === 3) {
      // Clyde: scatter when close
      var ddx = g.c - pac.c, ddy = g.r - pac.r;
      if (ddx * ddx + ddy * ddy < 64) {
        tc = GDEF[3].scC;
        tr = GDEF[3].scR;
      }
    }

    var best = opts[0], bestD = 1e9;
    for (i = 0; i < opts.length; i++) {
      var dd = DIR[opts[i]];
      var nc = g.c + dd.x, nr = g.r + dd.y;
      var dist = (nc - tc) * (nc - tc) + (nr - tr) * (nr - tr);
      if (dist < bestD) {
        bestD = dist;
        best = opts[i];
      }
    }
    return best;
  }

  function ghostAI(g, speed) {
    if (ready > 0) return;
    if (g.exit > 0) {
      g.exit--;
      g.x = g.c * T + T / 2;
      g.y = g.r * T + T / 2 + Math.sin(frame * 0.12 + g.id) * 1.5;
      return;
    }

    var sp = speed;
    if (g.mode === "fright") sp *= 0.55;
    if (g.mode === "eyes") sp *= 1.85;

    // Pick turn only at cell centers (same center-cross model as pac)
    var ctrX = Math.floor(g.x / T) * T + T / 2;
    var ctrY = Math.floor(g.y / T) * T + T / 2;
    if (Math.abs(g.x - ctrX) < 0.6 && Math.abs(g.y - ctrY) < 0.6) {
      snapToCell(g);
      // Leave house via door
      if (g.mode !== "eyes" && g.r >= 9 && g.r <= 10 && g.c >= 8 && g.c <= 10) {
        if (g.r === 10) g.dir = "U";
        else if (g.r === 9 && g.c !== 9) g.dir = g.c < 9 ? "R" : "L";
        else if (g.r === 9 && g.c === 9) g.dir = "U";
        else g.dir = chooseGhost(g);
      } else {
        g.dir = chooseGhost(g);
      }
    }

    gridMove(g, sp, true, null);

    if (g.mode === "eyes" && g.c >= 8 && g.c <= 10 && g.r >= 9 && g.r <= 10) {
      g.mode = fright > 0 ? "fright" : "chase";
      g.exit = 20;
      g.c = 9;
      g.r = 9;
      snapToCell(g);
    }
  }

  function tryEat() {
    if (distToCenter(pac) > 6) return;
    var c = pac.c, r = pac.r;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    var p = dots[r][c];
    if (p === 1) {
      dots[r][c] = 0;
      dotsLeft--;
      score += 10;
      beep(620, 0.018, "square", 0.03);
      if (score > hi) {
        hi = score;
        save();
      }
      if (!gotExtra && score >= 10000) {
        gotExtra = true;
        lives++;
        beep(880, 0.12, "square", 0.06);
      }
      // Fruit after clearing ~70 / ~170 pellets
      var eaten = totalDots - dotsLeft;
      if (eaten === 70 || eaten === 140) {
        fruit = { c: 9, r: 15, timer: 480, kind: level % 5 };
        fruitTimer = 480;
      }
      if (dotsLeft <= 0) clearing = 100;
    } else if (p === 2) {
      dots[r][c] = 0;
      dotsLeft--;
      score += 50;
      fright = Math.max(160, 320 - level * 14);
      eatCombo = 0;
      for (var gi = 0; gi < ghosts.length; gi++) {
        if (ghosts[gi].mode !== "eyes") {
          ghosts[gi].mode = "fright";
          ghosts[gi].dir = OPP[ghosts[gi].dir] || ghosts[gi].dir;
        }
      }
      beep(280, 0.09);
      if (score > hi) {
        hi = score;
        save();
      }
      if (dotsLeft <= 0) clearing = 100;
    }

    // Fruit pickup
    if (fruit && fruit.timer > 0 && pac.c === fruit.c && pac.r === fruit.r) {
      var pts = [100, 200, 500, 700, 1000][fruit.kind] || 100;
      score += pts;
      fruitScorePop = 60;
      fruit = null;
      fruitTimer = 0;
      beep(740, 0.1, "triangle", 0.06);
      if (score > hi) {
        hi = score;
        save();
      }
    }
  }

  function step() {
    frame++;
    if (!playing) {
      if (pac) pac.mouth += 0.08;
      return;
    }
    if (clearing > 0) {
      clearing--;
      if (clearing === 0) {
        level++;
        parseMaze();
        dotsLeft = totalDots;
        spawnAll();
        ready = 90;
        fright = 0;
      }
      return;
    }
    if (ready > 0) {
      ready--;
      return;
    }
    if (dying > 0) {
      dying--;
      if (dying === 0) {
        if (lives <= 0) {
          endGame();
          return;
        }
        spawnAll();
        ready = 80;
        fright = 0;
      }
      return;
    }

    if (fright > 0) {
      fright--;
      if (fright === 0) {
        for (var i = 0; i < ghosts.length; i++) {
          if (ghosts[i].mode === "fright") ghosts[i].mode = "chase";
        }
      }
    } else {
      // Scatter/chase waves
      var wave = frame % 720;
      var scatter = wave < 140;
      for (var j = 0; j < ghosts.length; j++) {
        if (ghosts[j].mode === "eyes" || ghosts[j].mode === "fright") continue;
        ghosts[j].mode = scatter ? "scatter" : "chase";
      }
    }

    if (fruit) {
      fruit.timer--;
      fruitTimer = fruit.timer;
      if (fruit.timer <= 0) fruit = null;
    }
    if (fruitScorePop > 0) fruitScorePop--;

    pac.mouth += 0.32;
    var sp = Math.min(2.5, 1.55 + level * 0.08);
    // Instant reverse anywhere (classic arcade feel)
    if (pac.want && OPP[pac.dir] === pac.want && canDir(pac, pac.want, false)) {
      pac.dir = pac.want;
    }
    gridMove(pac, sp, false, pac.want);
    tryEat();

    var gsp = Math.min(2.25, 1.15 + level * 0.08);
    for (var g = 0; g < ghosts.length; g++) ghostAI(ghosts[g], gsp);

    // Collisions
    for (g = 0; g < ghosts.length; g++) {
      var gh = ghosts[g];
      if (gh.mode === "eyes") continue;
      var dx = gh.x - pac.x, dy = gh.y - pac.y;
      if (dx * dx + dy * dy < 90) {
        if (gh.mode === "fright") {
          gh.mode = "eyes";
          eatCombo++;
          score += 200 * Math.pow(2, Math.min(eatCombo - 1, 3));
          if (score > hi) {
            hi = score;
            save();
          }
          beep(400 + eatCombo * 90, 0.12);
        } else {
          // Death anim + respawn driven by frame loop (no setTimeout races)
          if (dying > 0 || lives <= 0) return;
          dying = 80;
          lives = Math.max(0, lives - 1);
          beep(140, 0.22, "sawtooth", 0.08);
          return;
        }
      }
    }
  }

  /* ───────────── Super-sharpened draw ───────────── */
  function drawFloor() {
    var g = ctx.createRadialGradient(W / 2, H * 0.35, 20, W / 2, H * 0.4, W * 0.7);
    g.addColorStop(0, "#0c0c22");
    g.addColorStop(1, "#050510");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, ROWS * T);

    // subtle tile grid on walkable
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (wall[r][c]) continue;
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = "rgba(99,102,241,0.04)";
          ctx.fillRect(c * T, r * T, T, T);
        }
      }
    }
  }

  function drawWalls() {
    var r, c, x, y;
    // soft outer glow
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        if (!wall[r][c]) continue;
        x = c * T;
        y = r * T;
        ctx.fillStyle = "rgba(99,102,241,0.18)";
        ctx.fillRect(x - 1, y - 1, T + 2, T + 2);
      }
    }
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        if (!wall[r][c]) continue;
        x = c * T;
        y = r * T;
        var body = ctx.createLinearGradient(x, y, x + T, y + T);
        body.addColorStop(0, "#1e1b4b");
        body.addColorStop(0.5, "#312e81");
        body.addColorStop(1, "#1e1b4b");
        ctx.fillStyle = body;
        ctx.fillRect(x + 1, y + 1, T - 2, T - 2);

        // neon edges only on open faces
        ctx.strokeStyle = "#a5b4fc";
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        if (r === 0 || !wall[r - 1][c]) {
          ctx.moveTo(x + 2.5, y + 2.5);
          ctx.lineTo(x + T - 2.5, y + 2.5);
        }
        if (r === ROWS - 1 || !wall[r + 1][c]) {
          ctx.moveTo(x + 2.5, y + T - 2.5);
          ctx.lineTo(x + T - 2.5, y + T - 2.5);
        }
        if (c === 0 || !wall[r][c - 1]) {
          ctx.moveTo(x + 2.5, y + 2.5);
          ctx.lineTo(x + 2.5, y + T - 2.5);
        }
        if (c === COLS - 1 || !wall[r][c + 1]) {
          ctx.moveTo(x + T - 2.5, y + 2.5);
          ctx.lineTo(x + T - 2.5, y + T - 2.5);
        }
        ctx.stroke();

        // inner highlight
        ctx.strokeStyle = "rgba(224,231,255,0.35)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        if (r === 0 || !wall[r - 1][c]) {
          ctx.moveTo(x + 3.5, y + 4);
          ctx.lineTo(x + T - 3.5, y + 4);
        }
        if (c === 0 || !wall[r][c - 1]) {
          ctx.moveTo(x + 4, y + 3.5);
          ctx.lineTo(x + 4, y + T - 3.5);
        }
        ctx.stroke();
      }
    }
    // Ghost door
    for (r = 0; r < ROWS; r++) {
      for (c = 0; c < COLS; c++) {
        if (RAW[r][c] !== "=") continue;
        x = c * T;
        y = r * T + T / 2;
        var dg = ctx.createLinearGradient(x, y, x + T, y);
        dg.addColorStop(0, "#f472b6");
        dg.addColorStop(0.5, "#fce7f3");
        dg.addColorStop(1, "#f472b6");
        ctx.fillStyle = dg;
        ctx.fillRect(x + 1, y - 1.5, T - 2, 3);
        ctx.fillStyle = "rgba(251,113,133,0.35)";
        ctx.fillRect(x + 1, y - 3, T - 2, 6);
      }
    }
  }

  function drawPellets() {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var p = dots[r][c];
        var cx = c * T + T / 2;
        var cy = r * T + T / 2;
        if (p === 1) {
          ctx.fillStyle = "#fef3c7";
          ctx.beginPath();
          ctx.arc(cx, cy, 1.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(253,224,71,0.45)";
          ctx.beginPath();
          ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p === 2) {
          var rad = 4.4 + Math.sin(frame * 0.2 + c + r) * 1.15;
          var gg = ctx.createRadialGradient(cx, cy, 0.5, cx, cy, rad + 2);
          gg.addColorStop(0, "#fffbeb");
          gg.addColorStop(0.4, "#fbbf24");
          gg.addColorStop(0.85, "#d97706");
          gg.addColorStop(1, "rgba(180,83,9,0)");
          ctx.fillStyle = gg;
          ctx.beginPath();
          ctx.arc(cx, cy, rad + 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fde68a";
          ctx.beginPath();
          ctx.arc(cx, cy, rad * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  function drawFruit() {
    if (!fruit || fruit.timer <= 0) return;
    var x = fruit.c * T + T / 2;
    var y = fruit.r * T + T / 2;
    var bob = Math.sin(frame * 0.15) * 1.2;
    var kind = fruit.kind | 0;
    ctx.save();
    ctx.translate(x, y + bob);
    if (kind === 0) {
      // cherry
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(-3, 2, 3.5, 0, Math.PI * 2);
      ctx.arc(3, 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.quadraticCurveTo(0, -6, 3, 0);
      ctx.stroke();
    } else if (kind === 1) {
      // strawberry
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.quadraticCurveTo(7, 2, 5, -2);
      ctx.quadraticCurveTo(0, -5, -5, -2);
      ctx.quadraticCurveTo(-7, 2, 0, 6);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(3, -8);
      ctx.lineTo(-3, -8);
      ctx.fill();
    } else if (kind === 2) {
      // orange
      var og = ctx.createRadialGradient(-1, -1, 1, 0, 0, 6);
      og.addColorStop(0, "#fdba74");
      og.addColorStop(1, "#ea580c");
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(-1, -7, 2, 3);
    } else if (kind === 3) {
      // pretzel
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(-2, 0, 3.5, 0.2, Math.PI * 1.8);
      ctx.arc(2, 0, 3.5, Math.PI * 0.2, Math.PI * 1.8);
      ctx.stroke();
    } else {
      // apple
      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.arc(0, 1, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#854d0e";
      ctx.fillRect(-0.5, -6, 1.2, 3);
    }
    ctx.restore();
    if (fruit.timer < 90 && (frame % 10 < 5)) {
      /* blink near end — skip draw half the time via early return would flash; already drawn */
    }
  }

  function drawPac() {
    if (!pac) return;
    var x = pac.x, y = pac.y, ang = 0;
    if (pac.dir === "R") ang = 0;
    else if (pac.dir === "D") ang = Math.PI / 2;
    else if (pac.dir === "L") ang = Math.PI;
    else if (pac.dir === "U") ang = -Math.PI / 2;

    if (dying > 0) {
      // death spin
      var t = 1 - dying / 80;
      ang += t * Math.PI * 4;
      var mouth = 0.15 + t * 1.2;
      ctx.globalAlpha = 1 - t * 0.3;
      var grd = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 9);
      grd.addColorStop(0, "#fecdd3");
      grd.addColorStop(0.5, "#fb7185");
      grd.addColorStop(1, "#be123c");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, 8 * (1 - t * 0.4), ang + mouth, ang - mouth + Math.PI * 2, false);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.globalAlpha = 1;
      return;
    }

    var mouth = 0.18 + Math.abs(Math.sin(pac.mouth)) * 0.42;
    // body glow
    ctx.fillStyle = "rgba(251,113,133,0.22)";
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();

    var grd = ctx.createRadialGradient(x - 2.5, y - 2.5, 1, x, y, 9);
    grd.addColorStop(0, "#ffe4e6");
    grd.addColorStop(0.35, "#fb7185");
    grd.addColorStop(0.75, "#e11d48");
    grd.addColorStop(1, "#9f1239");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, 8.2, ang + mouth, ang - mouth + Math.PI * 2, false);
    ctx.lineTo(x, y);
    ctx.fill();

    // eye
    var ex = x + Math.cos(ang - 0.95) * 3.4;
    var ey = y + Math.sin(ang - 0.95) * 3.4;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, ey, 1.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(ex + Math.cos(ang) * 0.4, ey + Math.sin(ang) * 0.4, 0.75, 0, Math.PI * 2);
    ctx.fill();

    // bow
    var bx = x + Math.cos(ang - 2.35) * 6.2;
    var by = y + Math.sin(ang - 2.35) * 6.2 - 1.2;
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(bx - 2.2, by, 2.4, 0, Math.PI * 2);
    ctx.arc(bx + 2.2, by, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(bx, by, 1.35, 0, Math.PI * 2);
    ctx.fill();
    // lashes
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(ex + 1.2, ey - 1.4);
    ctx.lineTo(ex + 2.2, ey - 2.4);
    ctx.moveTo(ex + 0.2, ey - 1.6);
    ctx.lineTo(ex + 0.5, ey - 2.8);
    ctx.stroke();
  }

  function drawGhost(gh) {
    var x = gh.x, y = gh.y, def = GDEF[gh.id];
    var bob = Math.sin(frame * 0.18 + gh.id) * 0.8;
    y += bob;

    if (gh.mode === "eyes") {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - 3.2, y - 1, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 3.2, y - 1, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1d4ed8";
      var edx = gh.dir === "L" ? -1.2 : gh.dir === "R" ? 1.2 : 0;
      var edy = gh.dir === "U" ? -1.2 : gh.dir === "D" ? 1.2 : 0;
      ctx.beginPath();
      ctx.arc(x - 3.2 + edx, y - 1 + edy, 1.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 3.2 + edx, y - 1 + edy, 1.25, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    var body = def.col, lite = def.hi;
    if (gh.mode === "fright") {
      var blink = fright < 100 && frame % 14 < 7;
      body = blink ? "#e2e8f0" : "#1e40af";
      lite = blink ? "#fff" : "#93c5fd";
    }

    // soft shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 7, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    var grd = ctx.createRadialGradient(x - 2, y - 4, 1, x, y, 11);
    grd.addColorStop(0, lite);
    grd.addColorStop(0.55, body);
    grd.addColorStop(1, body);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y - 1.5, 8.2, Math.PI, 0, false);
    ctx.lineTo(x + 8.2, y + 7.5);
    for (var i = 0; i < 4; i++) {
      var sx = x + 8.2 - i * 5.47;
      var wave = Math.sin(frame * 0.25 + i + gh.id) * 1.2;
      ctx.quadraticCurveTo(sx - 2.7, y + 3 + wave, sx - 5.47, y + 7.5);
    }
    ctx.closePath();
    ctx.fill();

    // eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 3.1, y - 2.2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 3.1, y - 2.2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (gh.mode === "fright") {
      ctx.fillStyle = blink ? "#0f172a" : "#93c5fd";
      ctx.beginPath();
      ctx.arc(x - 3.1, y - 2.2, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 3.1, y - 2.2, 1, 0, Math.PI * 2);
      ctx.fill();
      // wavy mouth
      ctx.strokeStyle = blink ? "#0f172a" : "#93c5fd";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 2.5);
      ctx.lineTo(x - 2, y + 4);
      ctx.lineTo(x, y + 2.5);
      ctx.lineTo(x + 2, y + 4);
      ctx.lineTo(x + 4, y + 2.5);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#1e3a8a";
      var lx = gh.dir === "L" ? -1.1 : gh.dir === "R" ? 1.1 : 0;
      var ly = gh.dir === "U" ? -1.1 : gh.dir === "D" ? 1.1 : 0;
      ctx.beginPath();
      ctx.arc(x - 3.1 + lx, y - 2.2 + ly, 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 3.1 + lx, y - 2.2 + ly, 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHUD() {
    var y0 = ROWS * T;
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, y0, W, 28);
    ctx.fillStyle = "rgba(129,140,248,0.4)";
    ctx.fillRect(0, y0, W, 1);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.fillText(pad(score), 4, y0 + 12);
    ctx.fillStyle = "#fde047";
    ctx.fillText("HI " + pad(hi), 4, y0 + 23);
    ctx.fillStyle = "#f9a8d4";
    ctx.textAlign = "right";
    ctx.fillText("LV" + level, W - 4, y0 + 12);

    for (var i = 0; i < lives; i++) {
      var lx = W - 12 - i * 14, ly = y0 + 20;
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0.45, Math.PI * 2 - 0.45);
      ctx.lineTo(lx, ly);
      ctx.fill();
    }

    if (fruitScorePop > 0) {
      ctx.fillStyle = "#fde047";
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("FRUIT!", W / 2, y0 - 8);
    }

    if (ready > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(W / 2 - 52, H / 2 - 28, 104, 28);
      ctx.fillStyle = "#fde047";
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("READY!", W / 2, H / 2 - 8);
    }
    if (clearing > 0) {
      ctx.fillStyle = "#4ade80";
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("CLEAR!", W / 2, H / 2 - 8);
    }
    if (fright > 0 && fright < 100) {
      ctx.fillStyle = "#60a5fa";
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillText("HURRY", W / 2, y0 - 4);
    }
  }

  function draw() {
    drawFloor();
    drawWalls();
    drawPellets();
    drawFruit();
    for (var i = 0; i < ghosts.length; i++) drawGhost(ghosts[i]);
    if (pac && (dying === 0 || dying < 75)) drawPac();
    drawHUD();
  }

  function loop(now) {
    requestAnimationFrame(loop);
    if (!last) last = now || 0;
    var t = now || 0;
    var dt = (t - last) / 1000;
    if (dt > 0.05) dt = 0.05;
    if (!(dt > 0)) dt = 0.016;
    last = t;
    var steps = Math.min(3, Math.max(1, Math.round(dt * 60)));
    for (var s = 0; s < steps; s++) {
      try {
        step();
      } catch (e) {
        console.error(e);
        break;
      }
    }
    try {
      draw();
    } catch (e) {
      console.error(e);
    }
  }

  function fit() {
    var stage = document.getElementById("stage");
    var maxW = Math.max(200, (stage && stage.clientWidth) || window.innerWidth || 400);
    var maxH = Math.max(200, (stage && stage.clientHeight) || window.innerHeight * 0.55 || 400);
    var sc = Math.min(maxW / W, maxH / H, 2.4);
    canvas.style.width = Math.max(160, Math.floor(W * sc)) + "px";
    canvas.style.height = Math.max(180, Math.floor(H * sc)) + "px";
  }

  // Input
  window.addEventListener("keydown", function (e) {
    if (e.repeat) return;
    if (e.code === "KeyM") {
      muted = !muted;
      document.getElementById("muteBtn").textContent = muted ? "🔇" : "🔊";
      document.getElementById("muteBtn").classList.toggle("on", muted);
      save();
      return;
    }
    var map = {
      ArrowUp: "U",
      KeyW: "U",
      ArrowDown: "D",
      KeyS: "D",
      ArrowLeft: "L",
      KeyA: "L",
      ArrowRight: "R",
      KeyD: "R",
    };
    if (map[e.code]) {
      e.preventDefault();
      sndInit();
      setWant(map[e.code]);
    }
  });

  document.querySelectorAll(".db[data-d]").forEach(function (btn) {
    var d = btn.getAttribute("data-d");
    function go(ev) {
      ev.preventDefault();
      sndInit();
      btn.classList.add("on");
      setWant(d);
    }
    function up(ev) {
      ev.preventDefault();
      btn.classList.remove("on");
    }
    btn.addEventListener("touchstart", go, { passive: false });
    btn.addEventListener("touchend", up, { passive: false });
    btn.addEventListener("mousedown", go);
    btn.addEventListener("mouseup", up);
    btn.addEventListener("mouseleave", up);
  });

  document.getElementById("startBtn").onclick = function () {
    sndInit();
    startGame();
  };
  document.getElementById("howBtn").onclick = function () {
    document.getElementById("title").classList.add("hide");
    document.getElementById("how").classList.remove("hide");
  };
  document.getElementById("backBtn").onclick = function () {
    document.getElementById("how").classList.add("hide");
    document.getElementById("title").classList.remove("hide");
  };
  document.getElementById("againBtn").onclick = function () {
    sndInit();
    startGame();
  };
  document.getElementById("menuBtn").onclick = toTitle;
  document.getElementById("muteBtn").onclick = function () {
    muted = !muted;
    this.textContent = muted ? "🔇" : "🔊";
    this.classList.toggle("on", muted);
    save();
    if (!muted) sndInit();
  };
  window.addEventListener("resize", fit);
  if (typeof window.ResizeObserver === "function") {
    try {
      new window.ResizeObserver(fit).observe(document.getElementById("stage"));
    } catch (e) {}
  }
  document.body.addEventListener(
    "touchmove",
    function (e) {
      if (!e.target.closest || (!e.target.closest("#pad") && !e.target.closest(".bar"))) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.getElementById("muteBtn").textContent = muted ? "🔇" : "🔊";
  document.getElementById("muteBtn").classList.toggle("on", muted);
  parseMaze();
  spawnAll();
  fit();
  requestAnimationFrame(function (t) {
    last = t;
    requestAnimationFrame(loop);
  });

  window.__MSPAC__ = {
    startGame: startGame,
    step: step,
    setWant: setWant,
    tick: function (n) {
      for (var i = 0; i < n; i++) step();
      draw();
    },
    getState: function () {
      return {
        playing: playing,
        score: score,
        dotsLeft: dotsLeft,
        ready: ready,
        dying: dying,
        lives: lives,
        level: level,
        fright: fright,
        pac: pac
          ? { c: pac.c, r: pac.r, x: pac.x, y: pac.y, dir: pac.dir, want: pac.want }
          : null,
        ghosts: ghosts.map(function (g) {
          return { c: g.c, r: g.r, x: g.x, y: g.y, mode: g.mode, dir: g.dir };
        }),
      };
    },
  };
})();
