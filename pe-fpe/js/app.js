/**
 * PE Fire Protection CBT chrome — exam / coach / drill.
 */
(function () {
  "use strict";
  const SESSION_KEY = "study-buddy:pe-fpe:session-v1";
  const RESULT_KEY = "study-buddy:pe-fpe:results-v1";
  const SKILL_KEY = "study-buddy:pe-fpe:skills-v1";
  const PDF_DB = "pe-fpe-refs-v1";
  const params = new URLSearchParams(location.search);
  const instructorUnlock = params.get("unlock") === "1";

  const views = {
    home: document.getElementById("view-home"),
    nda: document.getElementById("view-nda"),
    tutorial: document.getElementById("view-tutorial"),
    exam: document.getElementById("view-exam"),
    break: document.getElementById("view-break"),
    review: document.getElementById("view-review"),
    results: document.getElementById("view-results"),
    manual: document.getElementById("view-manual"),
    refs: document.getElementById("view-refs"),
  };

  let pdfUrls = [];

  let session = null;
  let tickId = null;
  let lastItemEntered = 0;

  function items() { return window.PE_FPE_ITEMS || []; }
  function meta() { return window.PE_FPE_META || {}; }
  function paintFormCount() {
    const m = meta();
    const n = items().length;
    const el = document.getElementById("form-count");
    const badge = document.getElementById("form-badge");
    if (el) el.textContent = n ? `${n} of 85 items on Form ${m.form || "A"} · timed clock ${Math.round((m.scaled_clock_s || n * 360) / 360)} min.` : "This form is empty.";
    if (badge) badge.textContent = `Form ${m.form || "A"} · ${n}/85`;
  }
  function domains() { return window.PE_FPE_DOMAINS || {}; }
  function itemById(id) { return items().find((it) => it.id === id); }

  function show(name) {
    Object.entries(views).forEach(([k, el]) => el && el.classList.toggle("hidden", k !== name));
    window.scrollTo(0, 0);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStem(text) {
    const raw = String(text || "").replace(/\r\n/g, "\n");
    const blocks = raw.split(/\n\n+/);
    return blocks.map((block) => {
      const lines = block.split("\n");
      if (lines.length >= 2 && lines[0].includes("|") && /---/.test(lines[1] || "")) {
        const rows = lines.filter((ln) => ln.trim() && !/^[\s|:-]+$/.test(ln.replace(/\|/g, "")));
        const cells = rows.map((ln) => ln.split("|").map((c) => c.trim()).filter((c, i, a) => !(i === 0 && c === "") && !(i === a.length - 1 && c === "")));
        if (!cells.length) return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
        const head = cells[0];
        const body = cells.slice(1);
        return `<table><thead><tr>${head.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      }
      const html = escapeHtml(block)
        .replace(/^• /gm, "• ")
        .replace(/\n/g, "<br>");
      return `<p>${html}</p>`;
    }).join("");
  }

  function fmtClock(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
  }

  function save() {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (_) { /* ignore */ }
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (s && s.itemIds && s.itemIds.length && !s.submitted) return s;
    } catch (_) { /* ignore */ }
    return null;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadSkills() {
    try {
      const raw = localStorage.getItem(SKILL_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.byId) return s;
      }
    } catch (_) { /* ignore */ }
    return { byId: {} };
  }

  function saveSkills(sk) {
    try { localStorage.setItem(SKILL_KEY, JSON.stringify(sk)); } catch (_) { /* ignore */ }
  }

  function recordSkill(id, ok) {
    const sk = loadSkills();
    const cur = sk.byId[id] || { attempts: 0, correct: 0, streak: 0, lastOk: false, lastAt: 0 };
    cur.attempts += 1;
    if (ok) {
      cur.correct += 1;
      cur.streak += 1;
      cur.lastOk = true;
    } else {
      cur.streak = 0;
      cur.lastOk = false;
    }
    cur.lastAt = Date.now();
    sk.byId[id] = cur;
    saveSkills(sk);
  }

  function isStrong(s) {
    if (!s || !s.attempts) return false;
    return s.lastOk && (s.correct / s.attempts) >= 0.7;
  }

  function strongIds() {
    const sk = loadSkills();
    const fromSkills = items().filter((it) => isStrong(sk.byId[it.id])).map((it) => it.id);
    const last = window.__lastResult;
    const fromLast = last && last.rows ? last.rows.filter((r) => r.ok).map((r) => r.id) : [];
    return [...new Set([...fromSkills, ...fromLast])];
  }

  function weakIds() {
    const sk = loadSkills();
    const fromSkills = items().filter((it) => {
      const s = sk.byId[it.id];
      return s && s.attempts && !isStrong(s);
    }).map((it) => it.id);
    const last = window.__lastResult;
    const fromLast = last && last.rows ? last.rows.filter((r) => !r.ok).map((r) => r.id) : [];
    return [...new Set([...fromSkills, ...fromLast])];
  }

  function startQueue(kind) {
    const ids = kind === "sharp" ? strongIds() : weakIds();
    if (!ids.length) {
      alert(kind === "sharp"
        ? "No strong topics yet. Take a coach or exam first, then reinforce the items you got right."
        : "No struggling items yet. Misses from exam or coach land here.");
      return;
    }
    startSession({
      mode: "coach",
      skipNda: true,
      untimed: true,
      ids: shuffle(ids),
      queue: kind,
    });
  }

  function paintSharpStatus() {
    const el = document.getElementById("sharp-status");
    if (!el) return;
    const s = strongIds().length;
    const w = weakIds().length;
    if (!s && !w) {
      el.textContent = "No history yet — take a coach or exam first, then keep those hits sharp.";
      return;
    }
    el.textContent = s
      ? `${s} item${s === 1 ? "" : "s"} ready to reinforce (not struggling). ${w} on the repair list.`
      : `No strong items yet. ${w} on the repair list.`;
  }

  function blankAnswers(ids) {
    const o = {};
    ids.forEach((id) => { o[id] = { value: null, flagged: false, strike: {}, timeMs: 0, seen: false }; });
    return o;
  }

  function startSession(opts) {
    const ids = (opts.ids || items().map((it) => it.id));
    session = {
      mode: opts.mode,
      clockMode: opts.clockMode || "scaled",
      untimed: !!opts.untimed,
      itemIds: ids,
      index: 0,
      answers: blankAnswers(ids),
      workingMs: (opts.workingS ?? meta().scaled_clock_s) * 1000,
      breakMs: (meta().break_s || 3000) * 1000,
      ndaMs: (meta().nda_s || 120) * 1000,
      tutMs: (meta().tutorial_s || 480) * 1000,
      breakUsed: false,
      onBreak: false,
      ndaDone: opts.skipNda || false,
      tutDone: opts.skipNda || false,
      submitted: false,
      showSolutions: opts.mode !== "exam" || instructorUnlock,
      pacing: opts.mode === "coach",
      queue: opts.queue || null,
      startedAt: Date.now(),
      lastTick: Date.now(),
    };
    lastItemEntered = Date.now();
    save();
    if (session.mode === "exam" && !session.ndaDone) {
      show("nda");
      startTick();
      return;
    }
    enterExam();
  }

  function enterExam() {
    session.ndaDone = true;
    session.tutDone = true;
    session.lastTick = Date.now();
    lastItemEntered = Date.now();
    show("exam");
    window.PE_FPE_CALC.render(document.getElementById("ref-calc"));
    renderSearch("");
    refreshExamPdf();
    renderExam();
    startTick();
  }

  function startTick() {
    if (tickId) clearInterval(tickId);
    tickId = setInterval(tick, 250);
    tick();
  }

  function creditItemTime() {
    if (!session || session.submitted || session.onBreak) return;
    const id = session.itemIds[session.index];
    if (!id) return;
    const now = Date.now();
    session.answers[id].timeMs += now - lastItemEntered;
    lastItemEntered = now;
  }

  function tick() {
    if (!session || session.submitted) return;
    const now = Date.now();
    const dt = now - session.lastTick;
    session.lastTick = now;
    const vis = document.visibilityState === "hidden" ? 0 : dt;

    if (!session.ndaDone && !views.nda.classList.contains("hidden")) {
      session.ndaMs -= vis;
      document.getElementById("nda-clock").textContent = fmtClock(session.ndaMs);
      if (session.ndaMs <= 0) document.getElementById("nda-continue").disabled = !document.getElementById("nda-agree").checked;
    } else if (!session.tutDone && !views.tutorial.classList.contains("hidden")) {
      session.tutMs -= vis;
      document.getElementById("tut-clock").textContent = fmtClock(session.tutMs);
    } else if (session.onBreak) {
      session.breakMs -= vis;
      document.getElementById("break-clock").textContent = fmtClock(session.breakMs);
      if (session.breakMs <= 0) endBreak();
    } else if (!session.untimed && !views.exam.classList.contains("hidden")) {
      session.workingMs -= vis;
      const el = document.getElementById("exam-clock");
      el.textContent = fmtClock(session.workingMs);
      el.classList.toggle("warn", session.workingMs < 15 * 60 * 1000);
      if (session.workingMs <= 0) submitForm(true);
    }
    save();
  }

  function answersOf(id) { return session.answers[id]; }

  function isAnswered(id) {
    const a = answersOf(id);
    if (!a || a.value == null || a.value === "") return false;
    if (Array.isArray(a.value)) return a.value.length > 0;
    if (typeof a.value === "object") return Object.keys(a.value).length > 0;
    return true;
  }

  function sameSet(a, b) {
    const A = (a || []).slice().sort().join(",");
    const B = (b || []).slice().sort().join(",");
    return A === B;
  }

  function scoreItem(it, value) {
    if (it.type === "mcq4") return value === it.answer;
    if (it.type === "multi") return sameSet(value, it.answer);
    return false;
  }

  function renderExam() {
    const id = session.itemIds[session.index];
    const it = itemById(id);
    const a = answersOf(id);
    a.seen = true;
    document.getElementById("exam-meta").textContent =
      `${session.queue === "sharp" ? "KEEP SHARP" : session.queue === "repair" ? "REPAIR" : session.mode.toUpperCase()} · Item ${session.index + 1} of ${session.itemIds.length}` +
      (session.clockMode === "full" ? " · 8:30 chrome" : "");
    document.getElementById("btn-flag").classList.toggle("on", a.flagged);
    document.getElementById("btn-break").disabled = session.breakUsed || session.mode === "drill";
    document.getElementById("exam-clock").textContent = session.untimed ? "Untimed" : fmtClock(session.workingMs);
    document.getElementById("item-pane").innerHTML = itemHtml(it, a);
    bindItem(it, a);
    renderNav();
    maybePacing();
  }

  function itemHtml(it, a) {
    const kicker = [
      `Item ${it.number}`,
      `Domain ${it.domain} · ${it.subdomain}`,
      it.units !== "none" ? it.units : "",
      "MCQ",
      it.edition_lock || "",
    ].filter(Boolean).map((t) => `<span>${escapeHtml(t)}</span>`).join("");
    let body = `<div class="item-kicker">${kicker}</div><div class="stem">${renderStem(it.stem)}</div>`;
    if (it.figure) {
      body += `<div class="figure-wrap"><img src="${escapeHtml(it.figure)}" alt="Item figure"></div>`;
    }
    body += `<div class="choices">${(it.choices || []).map((c) => {
      const selected = a.value === c.key;
      const isKey = it.answer === c.key;
      const struck = !!a.strike[c.key];
      let cls = "choice";
      let tag = "";
      if (session.showSolutions && a.revealed) {
        cls += " revealed";
        if (isKey && selected) {
          cls += " correct-pick";
          tag = '<span class="tag">Your answer · correct</span>';
        } else if (isKey) {
          cls += " correct-key";
          tag = '<span class="tag">Correct answer</span>';
        } else if (selected) {
          cls += " wrong-pick";
          tag = '<span class="tag">Your answer · incorrect</span>';
        } else {
          cls += " wrong-other";
          tag = '<span class="tag">Incorrect</span>';
        }
      } else {
        if (selected) cls += " selected";
        if (struck) cls += " struck";
      }
      return `<button type="button" class="${cls}" data-choice="${c.key}"><span class="letter">${c.key}</span><span>${escapeHtml(c.text)}</span>${tag}</button>`;
    }).join("")}</div>
    <p class="legal">Four-option multiple choice. Right-click or long-press a choice to strike it without selecting.</p>`;
    if (session.showSolutions && a.revealed) {
      const ok = scoreItem(it, a.value);
      const why = it.solution.whyWrong || {};
      const whyList = Object.keys(why).map((k) => {
        const picked = a.value === k ? ' class="picked"' : "";
        return `<li${picked}><strong>${k}.</strong> ${escapeHtml(why[k])}${a.value === k ? " (your choice)" : ""}</li>`;
      }).join("");
      const sfpeMap = (window.PE_FPE_REFERENCES || {}).itemReading || {};
      const byDom = (window.PE_FPE_REFERENCES || {}).sfpeByDomain || {};
      const sfpe = sfpeMap[it.id] || byDom[it.domain] || [];
      const sfpeHtml = sfpe.length
        ? `<p><strong>Further reading (not exam-day)</strong> — SFPE Handbook of Fire Protection Engineering. Not supplied at Pearson. Score the item from the NCEES handbook locus / listed code, then read:</p><ul class="why-wrong">${sfpe.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
        : "";
      body += `<div class="feedback ${ok ? "ok" : "bad"}"><strong>${ok ? "Correct" : "Incorrect"}</strong> — key is ${escapeHtml(it.answer)}.\n${escapeHtml(it.solution.outline)}<p><strong>Why the other choices are wrong</strong></p><ul class="why-wrong">${whyList}</ul>${sfpeHtml}</div>`;
    } else if (session.mode === "coach" || session.mode === "drill") {
      body += `<p><button class="ghost" type="button" id="btn-check">Check this item</button></p>`;
    }
    return body;
  }

  function bindItem(it, a) {
    document.querySelectorAll(".choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        a.value = btn.dataset.choice;
        save();
        renderExam();
      });
      btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        a.strike[btn.dataset.choice] = !a.strike[btn.dataset.choice];
        save();
        renderExam();
      });
    });
    const chk = document.getElementById("btn-check");
    if (chk) chk.addEventListener("click", () => {
      a.revealed = true;
      if (a.value != null && a.value !== "") recordSkill(it.id, scoreItem(it, a.value));
      save();
      renderExam();
    });
  }

  function renderNav() {
    const strip = document.getElementById("nav-strip");
    strip.innerHTML = session.itemIds.map((id, i) => {
      const a = answersOf(id);
      let cls = "nav-dot";
      if (i === session.index) cls += " current";
      if (a.flagged) cls += " flagged";
      else if (isAnswered(id)) cls += " answered";
      else cls += " incomplete";
      return `<button type="button" class="${cls}" data-i="${i}">${i + 1}</button>`;
    }).join("");
    strip.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => go(+b.dataset.i)));
  }

  function go(i) {
    creditItemTime();
    session.index = Math.max(0, Math.min(session.itemIds.length - 1, i));
    lastItemEntered = Date.now();
    save();
    if (views.review && !views.review.classList.contains("hidden")) show("exam");
    renderExam();
  }

  function maybePacing() {
    if (!session.pacing) return;
    const n = session.index + 1;
    if (![5, 10, 20, 40, 60].includes(n)) return;
    const spent = session.itemIds.slice(0, n).reduce((s, id) => s + (answersOf(id).timeMs || 0), 0);
    const avg = spent / n / 60000;
    if (avg > 7) {
      const t = document.getElementById("pacing-toast");
      t.textContent = `Pacing: average ${avg.toFixed(1)} min/item at item ${n} (rail is 6.0).`;
      t.classList.remove("hidden");
      setTimeout(() => t.classList.add("hidden"), 6000);
    }
  }

  function renderSearch(q) {
    const box = document.getElementById("search-results");
    const all = window.PE_FPE_SEARCH || [];
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hits = !terms.length ? all.slice(0, 18) : all.filter((e) => {
      const hay = `${e.locus} ${e.title} ${e.keywords} ${e.source}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).slice(0, 40);
    box.innerHTML = hits.map((e) => `<div class="search-hit"><div class="locus">${escapeHtml(e.locus)}</div><div>${escapeHtml(e.title)}</div><div class="src">${escapeHtml(e.source)}</div></div>`).join("") || `<p class="legal">No loci match.</p>`;
  }

  function openReview() {
    creditItemTime();
    show("review");
    const g = document.getElementById("review-grid");
    g.innerHTML = session.itemIds.map((id, i) => {
      const a = answersOf(id);
      let cls = "nav-dot";
      if (a.flagged) cls += " flagged";
      else if (isAnswered(id)) cls += " answered";
      else cls += " incomplete";
      return `<button type="button" class="${cls}" data-i="${i}" title="${id}">${i + 1}</button>`;
    }).join("");
    g.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { show("exam"); go(+b.dataset.i); }));
  }

  function submitForm(timeUp) {
    if (!session || session.submitted) return;
    creditItemTime();
    if (!timeUp && !confirm("Submit this form? You cannot return.")) return;
    session.submitted = true;
    session.showSolutions = true;
    const result = grade();
    try {
      const prev = JSON.parse(localStorage.getItem(RESULT_KEY) || "[]");
      prev.unshift(result);
      localStorage.setItem(RESULT_KEY, JSON.stringify(prev.slice(0, 20)));
    } catch (_) { /* ignore */ }
    localStorage.removeItem(SESSION_KEY);
    result.rows.forEach((row) => recordSkill(row.id, row.ok));
    renderResults(result);
    show("results");
    if (tickId) clearInterval(tickId);
  }

  function grade() {
    const rows = session.itemIds.map((id) => {
      const it = itemById(id);
      const a = answersOf(id);
      const ok = scoreItem(it, a.value);
      return {
        id, number: it.number, domain: it.domain, type: it.type,
        ok, miss_type: ok ? null : it.solution.miss_type,
        timeMs: a.timeMs, repair: it.solution.repair_loci || [],
        sfpe: ((window.PE_FPE_REFERENCES || {}).itemReading || {})[id] || [],
        handbook: it.handbook, code: it.code,
      };
    });
    const correct = rows.filter((r) => r.ok).length;
    const n = rows.length;
    const byDom = {};
    rows.forEach((r) => {
      byDom[r.domain] = byDom[r.domain] || { n: 0, ok: 0, time: 0 };
      byDom[r.domain].n++;
      if (r.ok) byDom[r.domain].ok++;
      byDom[r.domain].time += r.timeMs;
    });
    const miss = { "handbook-search": 0, "code-edition": 0, arithmetic: 0, concept: 0 };
    rows.forEach((r) => { if (r.miss_type) miss[r.miss_type] = (miss[r.miss_type] || 0) + 1; });
    const slow = rows.filter((r) => r.timeMs > 9 * 60 * 1000);
    const repair = [];
    const sfpeRepair = [];
    const seen = new Set();
    const seenSfpe = new Set();
    rows.filter((r) => !r.ok).forEach((r) => {
      (r.repair || []).forEach((loc) => {
        if (!seen.has(loc) && repair.length < 15) { seen.add(loc); repair.push(loc); }
      });
      (r.sfpe || []).forEach((loc) => {
        if (!seenSfpe.has(loc) && sfpeRepair.length < 15) { seenSfpe.add(loc); sfpeRepair.push(loc); }
      });
    });
    return {
      at: new Date().toISOString(), form: "A", n, correct, pct: n ? Math.round((1000 * correct) / n) / 10 : 0,
      rows, byDom, miss, slow: slow.map((r) => r.number), repair, sfpeRepair, timedOut: session.workingMs <= 0,
    };
  }

  function renderResults(r) {
    document.getElementById("res-headline").textContent = `${r.correct} / ${r.n}  (${r.pct}%)`;
    document.getElementById("res-sub").textContent = r.timedOut
      ? "Working time expired. This is a raw score, not an NCEES pass/fail."
      : "Raw score only. NCEES does not publish a PE Fire Protection cut score; this tool does not invent one.";
    const D = domains();
    document.getElementById("res-heat").innerHTML = `<h2>Domain heat map</h2>` + Object.keys(r.byDom).map((d) => {
      const x = r.byDom[d];
      const pct = x.n ? Math.round((100 * x.ok) / x.n) : 0;
      const avg = x.n ? (x.time / x.n / 60000) : 0;
      const sink = avg > 7;
      return `<div class="row"><div><strong>${d}. ${escapeHtml(D[d]?.name || "")}</strong><div class="bar"><span style="width:${pct}%"></span></div></div><div>${x.ok}/${x.n} · ${avg.toFixed(1)} min/item${sink ? " · time-sink" : ""}</div></div>`;
    }).join("");
    document.getElementById("res-miss").innerHTML = `<h2>Miss types</h2><p>Handbook-search ${r.miss["handbook-search"] || 0} · Code-edition ${r.miss["code-edition"] || 0} · Arithmetic ${r.miss.arithmetic || 0} · Concept ${r.miss.concept || 0}</p>`;
    document.getElementById("res-time").innerHTML = `<h2>Items over 9 minutes</h2><p>${r.slow.length ? r.slow.map((n) => "#" + n).join(", ") : "None on this run."}</p>`;
    document.getElementById("res-repair").innerHTML = `<h2>Repair list (≤ 15 exam-day loci)</h2><ul>${r.repair.map((x) => `<li>${escapeHtml(x)}</li>`).join("") || "<li>No misses.</li>"}</ul>
      <h2>SFPE Handbook further reading (not in the exam room)</h2>
      <p class="legal">SFPE Handbook of Fire Protection Engineering — 5th Ed. chapter numbers and 6th Ed. section titles. Read these after a miss, then re-work from the NCEES handbook / listed NFPA.</p>
      <ul>${(r.sfpeRepair || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("") || "<li>No misses.</li>"}</ul>`;
    const hits = r.rows.filter((row) => row.ok);
    const hitDom = {};
    hits.forEach((row) => { hitDom[row.domain] = (hitDom[row.domain] || 0) + 1; });
    document.getElementById("res-reinforce").innerHTML = `<h2>Keep sharp — topics you are not struggling with</h2>
      <p>Do not drop these. Reinforcement re-asks the ${hits.length} item${hits.length === 1 ? "" : "s"} you already got right (shuffled, coach feedback). A miss here sends the item to repair.</p>
      <ul>${Object.keys(hitDom).map((d) => `<li>Domain ${d} ${escapeHtml(D[d]?.name || "")}: ${hitDom[d]} hit${hitDom[d] === 1 ? "" : "s"}</li>`).join("") || "<li>No hits this run.</li>"}</ul>`;
    window.__lastResult = r;
  }

  function endBreak() {
    session.onBreak = false;
    session.lastTick = Date.now();
    lastItemEntered = Date.now();
    show("exam");
    renderExam();
  }

  // home buttons
  document.getElementById("form-select")?.addEventListener("change", (e) => {
    if (window.PE_FPE_SELECT_FORM) window.PE_FPE_SELECT_FORM(e.target.value);
    paintFormCount();
    paintSharpStatus();
  });
  document.getElementById("btn-exam-scaled").addEventListener("click", () => startSession({ mode: "exam", clockMode: "scaled", workingS: meta().scaled_clock_s }));
  document.getElementById("btn-exam-full").addEventListener("click", () => startSession({ mode: "exam", clockMode: "full", workingS: meta().full_clock_s }));
  document.getElementById("btn-coach").addEventListener("click", () => startSession({ mode: "coach", skipNda: true, workingS: meta().scaled_clock_s }));
  document.getElementById("btn-drill").addEventListener("click", () => {
    const d = document.getElementById("drill-domain").value;
    const ids = items().filter((it) => d === "all" || String(it.domain) === d).map((it) => it.id);
    startSession({ mode: "drill", skipNda: true, untimed: true, ids });
  });
  document.getElementById("btn-keep-sharp").addEventListener("click", () => startQueue("sharp"));
  document.getElementById("btn-repair-weak").addEventListener("click", () => startQueue("repair"));

  document.getElementById("nda-agree").addEventListener("change", (e) => {
    document.getElementById("nda-continue").disabled = !e.target.checked;
  });
  document.getElementById("nda-continue").addEventListener("click", () => {
    session.ndaDone = true;
    show("tutorial");
  });
  document.getElementById("tut-continue").addEventListener("click", enterExam);

  document.getElementById("btn-flag").addEventListener("click", () => {
    const a = answersOf(session.itemIds[session.index]);
    a.flagged = !a.flagged;
    save();
    renderExam();
  });
  document.getElementById("btn-break").addEventListener("click", () => {
    if (session.breakUsed) return;
    if (!confirm("Start the optional 50:00 break? Working clock pauses. You can take this once.")) return;
    creditItemTime();
    session.breakUsed = true;
    session.onBreak = true;
    session.lastTick = Date.now();
    show("break");
  });
  document.getElementById("break-end").addEventListener("click", endBreak);
  document.getElementById("btn-review").addEventListener("click", openReview);
  document.getElementById("review-back").addEventListener("click", () => { show("exam"); renderExam(); });
  document.getElementById("review-submit").addEventListener("click", () => submitForm(false));
  document.getElementById("btn-prev").addEventListener("click", () => go(session.index - 1));
  document.getElementById("btn-next").addEventListener("click", () => {
    if (session.index === session.itemIds.length - 1) openReview();
    else go(session.index + 1);
  });
  document.getElementById("res-home").addEventListener("click", () => { session = null; show("home"); paintResume(); paintSharpStatus(); });
  document.getElementById("res-keep-sharp").addEventListener("click", () => startQueue("sharp"));
  document.getElementById("res-repair-weak").addEventListener("click", () => startQueue("repair"));
  document.getElementById("res-review-items").addEventListener("click", () => {
    if (!session) {
      const ids = (window.__lastResult?.rows || []).map((r) => r.id);
      startSession({ mode: "coach", skipNda: true, untimed: true, ids: ids.length ? ids : undefined });
      session.itemIds.forEach((id) => { session.answers[id].revealed = true; });
      session.showSolutions = true;
    } else {
      session.showSolutions = true;
      session.itemIds.forEach((id) => { session.answers[id].revealed = true; });
    }
    show("exam");
    renderExam();
  });

  document.getElementById("search-q").addEventListener("input", (e) => renderSearch(e.target.value));
  document.querySelectorAll(".ref-tabs button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".ref-tabs button").forEach((x) => x.classList.toggle("on", x === b));
      const which = b.dataset.ref;
      document.getElementById("ref-search").classList.toggle("hidden", which !== "search");
      document.getElementById("ref-pdf").classList.toggle("hidden", which !== "pdf");
      document.getElementById("ref-calc").classList.toggle("hidden", which !== "calc");
      if (which === "pdf") refreshExamPdf();
    });
  });

  function pdfDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(PDF_DB, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains("pdfs")) req.result.createObjectStore("pdfs", { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function listPdfs() {
    try {
      const db = await pdfDb();
      return await new Promise((resolve) => {
        const tx = db.transaction("pdfs", "readonly");
        const g = tx.objectStore("pdfs").getAll();
        g.onsuccess = () => resolve(g.result || []);
        g.onerror = () => resolve([]);
      });
    } catch (_) {
      return [];
    }
  }

  async function savePdfs(files) {
    const db = await pdfDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("pdfs", "readwrite");
      const store = tx.objectStore("pdfs");
      [...files].forEach((f) => {
        store.put({ id: f.name + ":" + f.size + ":" + f.lastModified, name: f.name, blob: f, added: Date.now() });
      });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearPdfs() {
    const db = await pdfDb();
    await new Promise((resolve) => {
      const tx = db.transaction("pdfs", "readwrite");
      tx.objectStore("pdfs").clear();
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  }

  function revokePdfUrls() {
    pdfUrls.forEach((u) => URL.revokeObjectURL(u));
    pdfUrls = [];
  }

  async function paintPdfStatus() {
    const list = await listPdfs();
    const names = list.map((p) => p.name).join(", ");
    const el = document.getElementById("pdf-status");
    if (el) el.textContent = list.length ? ("On this device: " + names) : "No PDF attached yet.";
  }

  async function refreshExamPdf() {
    const list = await listPdfs();
    const status = document.getElementById("exam-pdf-status");
    const pick = document.getElementById("exam-pdf-pick");
    const frame = document.getElementById("exam-pdf-frame");
    revokePdfUrls();
    if (!list.length) {
      if (status) status.textContent = "No PDF uploaded. Use Home → Your reference PDFs.";
      pick.classList.add("hidden");
      frame.hidden = true;
      frame.removeAttribute("src");
      return;
    }
    status.textContent = "Click in the PDF, then Ctrl+F / ⌘F. Files stay on this device.";
    pick.classList.remove("hidden");
    pick.innerHTML = list.map((p, i) => `<option value="${i}">${escapeHtml(p.name)}</option>`).join("");
    const show = (i) => {
      const rec = list[i] || list[0];
      const url = URL.createObjectURL(rec.blob);
      pdfUrls.push(url);
      frame.hidden = false;
      frame.src = url;
    };
    pick.onchange = () => show(+pick.value);
    show(0);
  }

  function renderRefs() {
    const R = window.PE_FPE_REFERENCES || {};
    const hb = R.handbook || {};
    const codes = R.listedCodes || [];
    const retired = R.retiredDoNotKey || [];
    const cite = R.citation || {};
    const sfpe = R.furtherStudy || {};
    const readings = R.itemReading || {};
    const index = (window.PE_FPE_SEARCH || []).filter((e) => e.source === "HB");
    document.getElementById("refs-body").innerHTML = `
      <h2>NCEES handbook</h2>
      <p><strong>${escapeHtml(hb.name || "")}</strong> — cited as ${escapeHtml(hb.short || "HB")}.</p>
      <p>${escapeHtml(hb.what || "")}</p>
      <p>${escapeHtml(hb.howToUse || "")}</p>
      <p><a href="${escapeHtml(hb.download || "#")}" target="_blank" rel="noopener">Download from MyNCEES</a></p>
      <h2>Further reading — SFPE Handbook of Fire Protection Engineering</h2>
      <p><strong>${escapeHtml(sfpe.name || "")}</strong> (${escapeHtml(sfpe.editions || "")})</p>
      <p>${escapeHtml(sfpe.what || "")}</p>
      <p>${escapeHtml(sfpe.notTheSameAs || "")}</p>
      <p>${escapeHtml(sfpe.howToUse || "")}</p>
      <p><a href="${escapeHtml(sfpe.buy || "#")}" target="_blank" rel="noopener">SFPE handbook page</a></p>
      <table class="ref-table"><thead><tr><th>Form A item</th><th>Read in SFPE HFPE after a miss</th></tr></thead>
      <tbody>${Object.keys(readings).map((id) => `<tr><td><code>${escapeHtml(id)}</code></td><td>${readings[id].map((s) => escapeHtml(s)).join("<br>")}</td></tr>`).join("")}</tbody></table>
      <h2>Locked codes (April 2027 spec sheet)</h2>
      <p>${escapeHtml(cite.rule || "")}</p>
      <table class="ref-table"><thead><tr><th>Lock key</th><th>Title</th><th>What it is for</th></tr></thead>
      <tbody>${codes.map((c) => `<tr><td><code>${escapeHtml(c.key)}</code></td><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.use)}</td></tr>`).join("")}</tbody></table>
      <h2>Do not key new items to these</h2>
      <ul>${retired.map((r) => `<li><code>${escapeHtml(r.key)}</code> — ${escapeHtml(r.note)}</li>`).join("")}</ul>
      <h2>Citation format</h2>
      <p>Correct: ${ (cite.correct || []).map((x) => `<code>${escapeHtml(x)}</code>`).join(" · ") }</p>
      <p>Wrong: ${ (cite.wrong || []).map((x) => `<code>${escapeHtml(x)}</code>`).join(" · ") }</p>
      <h2>Handbook locus index (titles only)</h2>
      <table class="ref-table"><thead><tr><th>Locus</th><th>Title</th></tr></thead>
      <tbody>${index.map((e) => `<tr><td><code>${escapeHtml(e.locus)}</code></td><td>${escapeHtml(e.title)}</td></tr>`).join("")}</tbody></table>
      <p class="legal">${escapeHtml((R.upload || {}).note || "")}</p>`;
  }

  async function resetSite() {
    if (!confirm("Reset this page? This clears the saved exam session and results in this browser.")) return;
    const dropPdf = confirm("Also remove uploaded PDFs from this browser? Files on your disk are not deleted.");
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(RESULT_KEY);
    localStorage.removeItem(SKILL_KEY);
    window.__lastResult = null;
    if (dropPdf) await clearPdfs();
    session = null;
    if (tickId) clearInterval(tickId);
    await paintPdfStatus();
    paintResume();
    show("home");
    alert("This page’s saved exam and results were cleared" + (dropPdf ? ", including uploaded PDFs." : ". Uploaded PDFs were kept."));
  }

  document.getElementById("btn-manual").addEventListener("click", () => show("manual"));
  document.getElementById("btn-refs").addEventListener("click", () => { renderRefs(); show("refs"); });
  document.getElementById("btn-reset-home").addEventListener("click", () => resetSite());
  document.querySelectorAll("[data-go-home]").forEach((b) => b.addEventListener("click", () => { show("home"); paintResume(); paintPdfStatus(); paintSharpStatus(); }));
  document.getElementById("pdf-file").addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    await savePdfs(files);
    e.target.value = "";
    await paintPdfStatus();
  });
  document.getElementById("btn-pdf-clear").addEventListener("click", async () => {
    if (!confirm("Remove uploaded PDFs from this browser? Files on your disk are not deleted.")) return;
    await clearPdfs();
    await paintPdfStatus();
    await refreshExamPdf();
  });

  function paintResume() {
    const slot = document.getElementById("resume-slot");
    const s = loadSession();
    if (!s) { slot.innerHTML = ""; return; }
    slot.innerHTML = `<div class="card" style="margin-top:1rem"><h2>Resume session</h2><p>Saved ${s.mode} run · item ${(s.index || 0) + 1} of ${s.itemIds.length}.</p><button class="primary" type="button" id="btn-resume">Resume</button> <button class="ghost" type="button" id="btn-discard">Discard</button></div>`;
    document.getElementById("btn-resume").addEventListener("click", () => {
      session = s;
      session.lastTick = Date.now();
      lastItemEntered = Date.now();
      if (!session.ndaDone) { show("nda"); startTick(); }
      else if (!session.tutDone) { show("tutorial"); startTick(); }
      else if (session.onBreak) { show("break"); startTick(); }
      else enterExam();
    });
    document.getElementById("btn-discard").addEventListener("click", () => { localStorage.removeItem(SESSION_KEY); paintResume(); });
  }

  paintResume();
  paintPdfStatus();
  paintSharpStatus();
  paintFormCount();
})();
