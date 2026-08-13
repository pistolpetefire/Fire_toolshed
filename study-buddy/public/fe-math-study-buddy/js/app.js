/**
 * FE General Math Practice — diagnostic then targeted reps.
 */
(function () {
  'use strict';
  const STORAGE_KEY = 'study-buddy:fe-math-study-buddy:progress-v1';
  const VERSION = '1.2.0';
  const HB_DB = 'fe-math-handbook-v1';
  const LETTERS = ['A', 'B', 'C', 'D'];

  let state = loadState();
  let session = null;
  let timerId = null;
  let mathFilterId = 'all';

  const el = {
    home: document.getElementById('view-home'),
    topics: document.getElementById('view-topics'),
    quiz: document.getElementById('view-quiz'),
    math: document.getElementById('view-math'),
    missed: document.getElementById('view-missed'),
    formulas: document.getElementById('view-formulas'),
    manual: document.getElementById('view-manual'),
    settings: document.getElementById('view-settings'),
    homeStats: document.getElementById('home-stats'),
    strengthMap: document.getElementById('strength-map'),
    topicGrid: document.getElementById('topic-grid'),
    quizMeta: document.getElementById('quiz-meta'),
    quizStem: document.getElementById('quiz-stem'),
    quizChoices: document.getElementById('quiz-choices'),
    quizFeedback: document.getElementById('quiz-feedback'),
    quizToolbar: document.getElementById('quiz-toolbar'),
    quizProgress: document.getElementById('quiz-progress-fill'),
    quizTimer: document.getElementById('quiz-timer'),
    mathList: document.getElementById('math-list'),
    mathFilter: document.getElementById('math-filter'),
    missedList: document.getElementById('missed-list'),
    formulaList: document.getElementById('formula-list'),
    explainToggle: document.getElementById('explain-toggle'),
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return {
          answered: p.answered || {},
          missed: p.missed || [],
          diag: p.diag || { a: null, b: null },
          settings: { showExplainAfter: p.settings?.showExplainAfter !== false },
        };
      }
    } catch (_) { /* ignore */ }
    return { answered: {}, missed: [], diag: { a: null, b: null }, settings: { showExplainAfter: true } };
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function questions() { return window.FE_QUESTIONS || []; }
  function topics() { return window.FE_TOPICS || []; }
  function mathProblems() { return window.FE_MATH || []; }
  function formulas() { return window.FE_FORMULAS || []; }
  function topicLabel(id) { return topics().find((t) => t.id === id)?.label || id; }

  function pool(kind, topicId) {
    return questions().filter((q) => q.pool === kind && (!topicId || (q.topics || []).includes(topicId)));
  }

  function showView(name) {
    for (const key of ['home', 'topics', 'quiz', 'math', 'missed', 'formulas', 'manual', 'settings']) {
      el[key]?.classList.toggle('hidden', key !== name);
    }
    window.scrollTo(0, 0);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function band(pct) {
    const w = (window.FE_STRENGTH && window.FE_STRENGTH.weak) || 50;
    const s = (window.FE_STRENGTH && window.FE_STRENGTH.strong) || 80;
    if (pct == null) return 'not-taken';
    if (pct < w) return 'weak';
    if (pct >= s) return 'strong';
    return 'ok';
  }

  function topicScoresFromDiag(which) {
    const rec = state.diag[which];
    if (!rec || !rec.byTopic) return {};
    return rec.byTopic;
  }

  function latestTopicScore(tid) {
    const b = topicScoresFromDiag('b')[tid];
    const a = topicScoresFromDiag('a')[tid];
    return b || a || null;
  }

  function renderHome() {
    const n = questions().length;
    const drill = questions().filter((q) => q.pool === 'drill').length;
    el.homeStats.innerHTML = `
      <div class="stats-row">
        <span>Question bank: <b>${n}</b></span>
        <span>Drill pool: <b>${drill}</b></span>
        <span>Missed: <b>${state.missed.length}</b></span>
        <span>Diagnostic A: <b>${state.diag.a ? state.diag.a.pct + '%' : 'not taken'}</b></span>
        <span>Diagnostic B: <b>${state.diag.b ? state.diag.b.pct + '%' : 'not taken'}</b></span>
      </div>`;
    if (el.explainToggle) el.explainToggle.checked = state.settings.showExplainAfter;

    const rows = topics()
      .map((t) => {
        const sc = latestTopicScore(t.id);
        const pct = sc ? sc.pct : null;
        const b = band(pct);
        const label = pct == null ? 'not taken' : `${pct}%`;
        return `<button type="button" class="topic-card band-${b}" data-topic="${t.id}">
          <strong>${escapeHtml(t.label)}</strong>
          <span>${escapeHtml(t.blurb)}</span>
          <span class="stat"><span class="strength-badge ${b}">${b.replace('-', ' ')}</span>${label}</span>
        </button>`;
      })
      .join('');
    el.strengthMap.innerHTML = `
      <h3 style="margin:1rem 0 0.4rem;font-size:1rem">Your map (weak / ok / strong)</h3>
      <p class="lead" style="margin-bottom:0.5rem">After a diagnostic: under 50% is weak, 80%+ is strong. Tap a topic to drill it.</p>
      <div class="grid topics">${rows}</div>`;
    el.strengthMap.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => startTopic(btn.getAttribute('data-topic')));
    });
  }

  function renderTopics() {
    const scored = topics().slice().sort((a, b) => {
      const pa = latestTopicScore(a.id);
      const pb = latestTopicScore(b.id);
      const sa = pa ? pa.pct : 101;
      const sb = pb ? pb.pct : 101;
      return sa - sb;
    });
    el.topicGrid.innerHTML = scored
      .map((t) => {
        const sc = latestTopicScore(t.id);
        const n = pool('drill', t.id).length;
        const b = band(sc ? sc.pct : null);
        const label = sc ? `${sc.pct}%` : 'no diagnostic yet';
        return `<button type="button" class="topic-card band-${b}" data-topic="${t.id}">
          <strong>${escapeHtml(t.label)}</strong>
          <span>${escapeHtml(t.blurb)}</span>
          <span class="stat"><span class="strength-badge ${b}">${b.replace('-', ' ')}</span>${n} drill · ${label}</span>
        </button>`;
      })
      .join('');
    el.topicGrid.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => startTopic(btn.getAttribute('data-topic')));
    });
  }

  function startTopic(tid) {
    const q = shuffle(pool('drill', tid).filter((x) => !String(x.id).startsWith('PAD')));
    if (!q.length) { alert('No drill questions for this topic.'); return; }
    session = { mode: 'topic', topicId: tid, queue: q.slice(0, 20), index: 0, correct: 0, wrong: 0 };
    showView('quiz');
    renderQuizItem();
  }

  function weakestTopicId() {
    let best = null;
    let bestPct = 101;
    for (const t of topics()) {
      const sc = latestTopicScore(t.id);
      if (sc && typeof sc.pct === 'number' && sc.pct < bestPct) {
        bestPct = sc.pct;
        best = t.id;
      }
    }
    return best;
  }

  function startDiag(form) {
    form = form === 'diag-b' ? 'diag-b' : 'diag-a';
    const key = form === 'diag-a' ? 'a' : 'b';
    if (state.diag[key] && !confirm(`Retake diagnostic ${key.toUpperCase()}? Previous scores for that form will be replaced.`)) return;
    const queue = [];
    for (const t of topics()) {
      const slice = shuffle(pool(form, t.id)).slice(0, 3);
      queue.push(...slice);
    }
    session = { mode: 'diag', form, queue: shuffle(queue), index: 0, correct: 0, wrong: 0, byTopic: {} };
    showView('quiz');
    renderQuizItem();
  }

  function startTimed() {
    const q = shuffle(questions().filter((x) => x.pool === 'drill' && !String(x.id).startsWith('PAD'))).slice(0, 20);
    session = {
      mode: 'timed',
      queue: q,
      index: 0,
      correct: 0,
      wrong: 0,
      secLeft: 20 * 150,
    };
    showView('quiz');
    renderQuizItem();
    tickTimer();
  }

  function tickTimer() {
    clearInterval(timerId);
    if (!session || session.mode !== 'timed') return;
    const paint = () => {
      if (!session || session.mode !== 'timed') return;
      const m = Math.floor(session.secLeft / 60);
      const s = session.secLeft % 60;
      if (el.quizTimer) {
        el.quizTimer.hidden = false;
        el.quizTimer.textContent = `Time left ${m}:${String(s).padStart(2, '0')}`;
      }
      session.secLeft -= 1;
      if (session.secLeft < 0) {
        clearInterval(timerId);
        renderQuizDone();
      }
    };
    paint();
    timerId = setInterval(paint, 1000);
  }

  function startMissed() {
    const q = questions().filter((x) => state.missed.includes(x.id));
    if (!q.length) { alert('No missed items yet.'); return; }
    session = { mode: 'missed', queue: shuffle(q), index: 0, correct: 0, wrong: 0 };
    showView('quiz');
    renderQuizItem();
  }

  function renderQuizItem() {
    if (!session || session.index >= session.queue.length) {
      renderQuizDone();
      return;
    }
    const q = session.queue[session.index];
    if (el.quizProgress) el.quizProgress.style.width = (100 * session.index) / session.queue.length + '%';
    const title =
      session.mode === 'diag' ? `Diagnostic ${session.form === 'diag-a' ? 'A' : 'B'}` :
      session.mode === 'timed' ? 'Timed mixed' :
      session.mode === 'missed' ? 'Review missed' : topicLabel(session.topicId);
    el.quizMeta.innerHTML = `<span>${escapeHtml(title)} · ${escapeHtml(topicLabel((q.topics || [])[0]))}</span>
      <span>Q ${session.index + 1} / ${session.queue.length} · ${session.correct}/${session.correct + session.wrong}</span>`;
    el.quizStem.textContent = q.stem;
    el.quizFeedback.className = 'feedback hidden';
    el.quizFeedback.innerHTML = '';
    el.quizChoices.innerHTML = q.choices
      .map((c, i) => `<button type="button" class="choice" data-letter="${LETTERS[i]}"><strong>${LETTERS[i]}.</strong> ${escapeHtml(c)}</button>`)
      .join('');
    const choose = (letter, btn) => onAnswer(q, letter, btn);
    el.quizChoices.querySelectorAll('.choice').forEach((btn) => {
      btn.addEventListener('click', () => choose(btn.getAttribute('data-letter'), btn));
    });
    if (session._quizKey) window.removeEventListener('keydown', session._quizKey);
    session._quizKey = (e) => {
      if (e.key === 'Escape') {
        closeHandbookOverlay();
        return;
      }
      if (!document.getElementById('hb-overlay')?.classList.contains('hidden')) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SEARCH') return;
      const buttons = [...el.quizChoices.querySelectorAll('.choice')];
      if (!buttons.length || buttons[0].disabled) return;
      let letter = null;
      const k = e.key.toUpperCase();
      if (LETTERS.includes(k)) letter = k;
      else if (['1', '2', '3', '4'].includes(e.key)) letter = LETTERS[parseInt(e.key, 10) - 1];
      if (!letter) return;
      e.preventDefault();
      const btn = buttons.find((b) => b.getAttribute('data-letter') === letter);
      if (btn) choose(letter, btn);
    };
    window.addEventListener('keydown', session._quizKey);
    el.quizToolbar.innerHTML = `<button type="button" class="btn btn-primary" id="btn-quiz-hb">Handbook (Ctrl+F)</button>
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>
      <label class="toggle"><input type="checkbox" id="sess-explain" ${state.settings.showExplainAfter ? 'checked' : ''}/> Full tutoring</label>
      <span class="sub">Keys A–D · Handbook stays open while you work</span>`;
    document.getElementById('btn-quiz-hb')?.addEventListener('click', openHandbookOverlay);
    document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
      if (confirm('Leave this session?')) {
        clearInterval(timerId);
        session = null;
        renderHome();
        showView('home');
      }
    });
  }

  function onAnswer(q, letter, btnEl) {
    const buttons = [...el.quizChoices.querySelectorAll('.choice')];
    if (buttons.some((b) => b.disabled)) return;
    if (session?._quizKey) {
      window.removeEventListener('keydown', session._quizKey);
      session._quizKey = null;
    }
    const correct = letter === q.answer;
    buttons.forEach((b) => {
      b.disabled = true;
      const L = b.getAttribute('data-letter');
      if (L === q.answer) b.classList.add('correct');
      else if (L === letter && !correct) b.classList.add('wrong');
    });
    if (correct) session.correct += 1;
    else session.wrong += 1;
    if (session.mode === 'diag') {
      const tid = (q.topics || [])[0];
      if (!session.byTopic[tid]) session.byTopic[tid] = { tried: 0, correct: 0 };
      session.byTopic[tid].tried += 1;
      if (correct) session.byTopic[tid].correct += 1;
    }
    state.answered[q.id] = { correct, at: new Date().toISOString() };
    if (!correct) {
      if (!state.missed.includes(q.id)) state.missed.push(q.id);
    } else {
      state.missed = state.missed.filter((id) => id !== q.id);
    }
    saveState();

    const showExp = document.getElementById('sess-explain')?.checked ?? true;
    const showTutor = !correct || showExp;
    el.quizFeedback.className = 'feedback tutor-feedback ' + (correct ? 'ok' : 'no');
    if (!showTutor) {
      el.quizFeedback.innerHTML = `<span class="label">Correct — ${q.answer}</span>`;
    } else {
      const pack = window.FE_TUTORING?.buildMcqTutor(q, letter, correct);
      el.quizFeedback.innerHTML = pack ? renderTutor(pack, correct) : `<p>${escapeHtml(q.explanation)}</p>`;
    }
    el.quizToolbar.innerHTML = `<button type="button" class="btn btn-primary" id="btn-next-q">${
      session.index + 1 >= session.queue.length ? 'See results' : 'Next'
    }</button>
      <button type="button" class="btn" id="btn-quiz-hb">Handbook (Ctrl+F)</button>
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>`;
    document.getElementById('btn-quiz-hb')?.addEventListener('click', openHandbookOverlay);
    document.getElementById('btn-next-q')?.addEventListener('click', () => {
      session.index += 1;
      renderQuizItem();
    });
    document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
      clearInterval(timerId);
      session = null;
      renderHome();
      showView('home');
    });
    document.getElementById('btn-next-q')?.focus();
  }

  function renderTutor(pack, correct) {
    const autopsy = (pack.autopsy || [])
      .map((row) => `<li class="autopsy-${row.ok ? 'ok' : 'no'}"><strong>${escapeHtml(row.letter)}.</strong> ${escapeHtml(row.text)}
        <span class="autopsy-tag">${row.ok ? 'Correct' : 'Trap'}</span>
        <div class="autopsy-why">${escapeHtml(row.why)}</div></li>`)
      .join('');
    return `
      <span class="label">${escapeHtml(pack.headline)}</span>
      ${!correct ? '<p class="tutor-forced">Missed items always open the full path.</p>' : ''}
      <p class="tutor-correct"><strong>Correct:</strong> ${escapeHtml(pack.correctChoice)}</p>
      <div class="tutor-block start-here"><strong>1 · Start here</strong><p>${escapeHtml(pack.startHere || '')}</p></div>
      <div class="tutor-block"><strong>2 · Method</strong><ol class="tutor-steps">${(pack.recipe || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol></div>
      <div class="tutor-block"><strong>3 · This problem</strong><p>${escapeHtml(pack.explanation || '')}</p>
        <ol class="tutor-steps">${(pack.workSteps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol></div>
      <div class="tutor-block autopsy"><strong>4 · Why each choice</strong><ul class="autopsy-list">${autopsy}</ul></div>
      <div class="tutor-block writeup"><strong>5 · Write this / check</strong>
        <p>${escapeHtml(pack.writeOnExam || '')}</p>
        <p class="tutor-tip"><strong>Check:</strong> ${escapeHtml(pack.howToCheck || '')}</p>
        <p class="sub"><strong>Handbook:</strong> ${escapeHtml(pack.handbook || '')}</p></div>`;
  }

  function renderQuizDone() {
    clearInterval(timerId);
    if (el.quizProgress) el.quizProgress.style.width = '100%';
    const total = session.correct + session.wrong;
    const pct = total ? Math.round((100 * session.correct) / total) : 0;
    if (session.mode === 'diag') {
      const byTopic = {};
      for (const [tid, v] of Object.entries(session.byTopic || {})) {
        byTopic[tid] = { tried: v.tried, correct: v.correct, pct: v.tried ? Math.round((100 * v.correct) / v.tried) : 0 };
      }
      const key = session.form === 'diag-a' ? 'a' : 'b';
      state.diag[key] = { pct, correct: session.correct, total, byTopic, at: new Date().toISOString() };
      saveState();
    }
    el.quizMeta.innerHTML = `<span>Session complete</span><span>${session.correct}/${total} (${pct}%)</span>`;
    el.quizStem.textContent = session.mode === 'diag'
      ? 'Diagnostic saved. Weak topics first — drill those next.'
      : 'Practice complete.';
    el.quizChoices.innerHTML = '';
    let breakdown = '';
    if (session.mode === 'diag' && state.diag[session.form === 'diag-a' ? 'a' : 'b']?.byTopic) {
      const rec = state.diag[session.form === 'diag-a' ? 'a' : 'b'];
      breakdown = `<ul class="manual-list">${topics()
        .map((t) => {
          const sc = rec.byTopic[t.id];
          const p = sc ? sc.pct : null;
          const b = band(p);
          return `<li><span class="strength-badge ${b}">${b.replace('-', ' ')}</span> ${escapeHtml(t.short)} · ${sc ? sc.correct + '/' + sc.tried + ' (' + p + '%)' : '—'}</li>`;
        })
        .join('')}</ul>`;
    }
    el.quizFeedback.className = 'feedback ok';
    el.quizFeedback.innerHTML = `<span class="label">Results</span> ${session.correct} correct · ${session.wrong} missed · ${pct}%${breakdown}`;
    if (el.quizTimer) el.quizTimer.hidden = true;
    const weak = session.mode === 'diag' ? weakestTopicId() : null;
    el.quizToolbar.innerHTML = `
      ${weak ? `<button type="button" class="btn btn-primary" id="btn-drill-weak">Drill weakest: ${escapeHtml(topicLabel(weak))}</button>` : ''}
      <button type="button" class="btn ${weak ? '' : 'btn-primary'}" id="btn-home">Home</button>`;
    document.getElementById('btn-drill-weak')?.addEventListener('click', () => {
      session = null;
      startTopic(weak);
    });
    document.getElementById('btn-home')?.addEventListener('click', () => {
      session = null;
      renderHome();
      showView('home');
    });
  }

  function renderMath() {
    if (el.mathFilter) {
      const chips = [{ id: 'all', label: 'All' }].concat(topics().map((t) => ({ id: t.id, label: t.short })));
      el.mathFilter.innerHTML = chips
        .map((c) => `<button type="button" class="chip ${c.id === mathFilterId ? 'active' : ''}" data-mf="${c.id}">${escapeHtml(c.label)}</button>`)
        .join('');
      el.mathFilter.querySelectorAll('[data-mf]').forEach((btn) => {
        btn.addEventListener('click', () => {
          mathFilterId = btn.getAttribute('data-mf');
          renderMath();
        });
      });
    }
    const list = mathProblems().filter((p) => mathFilterId === 'all' || (p.topics || []).includes(mathFilterId));
    el.mathList.innerHTML = list.map((p, i) => {
      const pack = window.FE_TUTORING?.buildWorkshopTutor(p) || {};
      return `<article class="card math-card">
        <span class="pill">${escapeHtml((p.topics || []).map(topicLabel).join(', '))}</span>
        <h3>${i + 1}. ${escapeHtml(p.title)}</h3>
        <p class="math-prompt">${escapeHtml(p.prompt)}</p>
        <p class="sub math-try-first">Paper first.</p>
        <div class="toolbar">
          <button type="button" class="btn" data-act="hints">Hints</button>
          <button type="button" class="btn" data-act="method">Method</button>
          <button type="button" class="btn btn-primary" data-act="sol">Solution</button>
          <button type="button" class="btn" data-act="coach">Write-up / check</button>
        </div>
        <div class="hints hidden" data-box="hints"><ol>${(p.hints || []).map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ol></div>
        <div class="solution hidden" data-box="method"><p>${escapeHtml(pack.startHere || '')}</p>
          <ol class="tutor-steps">${(pack.recipe || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol></div>
        <div class="solution hidden" data-box="sol"><ol class="tutor-steps">${(p.solution || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
          <p class="answer-line">${escapeHtml(p.answerLine || '')}</p></div>
        <div class="solution hidden" data-box="coach"><p>${escapeHtml(pack.writeOnExam || '')}</p>
          <p class="tutor-tip">${escapeHtml(pack.howToCheck || '')}</p></div>
      </article>`;
    }).join('');
    el.mathList.querySelectorAll('.math-card').forEach((card) => {
      card.querySelectorAll('[data-act]').forEach((btn) => {
        btn.addEventListener('click', () => card.querySelector(`[data-box="${btn.getAttribute('data-act')}"]`)?.classList.toggle('hidden'));
      });
    });
  }

  function renderMissed() {
    const poolQ = questions().filter((q) => state.missed.includes(q.id));
    if (!poolQ.length) {
      el.missedList.innerHTML = '<p class="lead">No missed items.</p>';
      return;
    }
    el.missedList.innerHTML = `<p class="lead">${poolQ.length} item(s).</p>
      <div class="toolbar"><button type="button" class="btn btn-primary" id="btn-start-missed">Practice these</button></div>`;
    document.getElementById('btn-start-missed')?.addEventListener('click', startMissed);
  }

  function handbookSectionsHtml() {
    const secs = (window.FE_HANDBOOK && window.FE_HANDBOOK.sections) || [];
    return secs
      .map(
        (s) => `<section class="hb-sec card" data-hb="${s.id}">
        <h3>${escapeHtml(s.title)}</h3>
        ${(s.body || []).map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
      </section>`
      )
      .join('');
  }

  function highlightFind(root, q, statusEl) {
    if (!root) return;
    root.querySelectorAll('mark.hb-hit').forEach((m) => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    const needle = String(q || '').trim();
    if (!needle) {
      if (statusEl) statusEl.textContent = 'Press Ctrl+F or ⌘F to search this text, same as the FE computer.';
      return;
    }
    let n = 0;
    const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    root.querySelectorAll('p, h3, h2, li').forEach((node) => {
      const text = node.textContent;
      if (!re.test(text)) return;
      node.innerHTML = text.replace(re, (m) => {
        n += 1;
        return '<mark class="hb-hit">' + escapeHtml(m) + '</mark>';
      });
    });
    if (statusEl) statusEl.textContent = n ? n + ' match(es). Ctrl+F / ⌘F also searches this page.' : 'No match.';
    root.querySelector('mark.hb-hit')?.scrollIntoView({ block: 'center' });
  }

  function renderFormulas() {
    if (el.formulaList) el.formulaList.innerHTML = handbookSectionsHtml();
    refreshPdfFrame();
    const find = document.getElementById('hb-find');
    const status = document.getElementById('hb-find-status');
    if (find && !find._bound) {
      find._bound = true;
      find.addEventListener('input', () => highlightFind(el.formulaList, find.value, status));
    }
  }

  function openHandbookOverlay() {
    const ov = document.getElementById('hb-overlay');
    const body = document.getElementById('hb-ov-body');
    if (!ov || !body) {
      window.open('./handbook.html', 'fe-handbook', 'width=720,height=900');
      return;
    }
    body.innerHTML = handbookSectionsHtml();
    ov.classList.remove('hidden');
    const find = document.getElementById('hb-ov-find');
    const status = document.getElementById('hb-ov-status');
    if (find) {
      find.value = '';
      find.oninput = () => highlightFind(body, find.value, status);
      queueMicrotask(() => find.focus());
    }
    if (status) status.textContent = 'Ctrl+F / ⌘F searches this handbook panel.';
  }

  function closeHandbookOverlay() {
    document.getElementById('hb-overlay')?.classList.add('hidden');
  }

  function openHandbookWindow() {
    window.open('./handbook.html', 'fe-handbook', 'width=720,height=900,scrollbars=yes');
  }

  function hbDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(HB_DB, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains('pdf')) req.result.createObjectStore('pdf');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveOfficialPdf(file) {
    const db = await hbDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('pdf', 'readwrite');
      tx.objectStore('pdf').put(file, 'ncees');
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadOfficialPdf() {
    try {
      const db = await hbDb();
      return await new Promise((resolve) => {
        const tx = db.transaction('pdf', 'readonly');
        const g = tx.objectStore('pdf').get('ncees');
        g.onsuccess = () => resolve(g.result || null);
        g.onerror = () => resolve(null);
      });
    } catch (_) {
      return null;
    }
  }

  async function clearOfficialPdf() {
    const db = await hbDb();
    await new Promise((resolve) => {
      const tx = db.transaction('pdf', 'readwrite');
      tx.objectStore('pdf').delete('ncees');
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  }

  let pdfUrl = null;
  async function refreshPdfFrame() {
    const wrap = document.getElementById('hb-pdf-wrap');
    const frame = document.getElementById('hb-pdf-frame');
    const status = document.getElementById('hb-pdf-status');
    const file = await loadOfficialPdf();
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      pdfUrl = null;
    }
    if (!file) {
      wrap?.classList.add('hidden');
      if (status) status.textContent = 'No official PDF attached. Download from NCEES, then Attach official NCEES PDF.';
      return;
    }
    pdfUrl = URL.createObjectURL(file);
    if (frame) frame.src = pdfUrl;
    wrap?.classList.remove('hidden');
    if (status) status.textContent = 'Official PDF on this device: ' + (file.name || 'handbook.pdf') + '. Click the PDF, then Ctrl+F.';
  }

  document.getElementById('btn-diag-a')?.addEventListener('click', () => startDiag('diag-a'));
  document.getElementById('btn-diag-b')?.addEventListener('click', () => startDiag('diag-b'));
  document.getElementById('btn-topics')?.addEventListener('click', () => { renderTopics(); showView('topics'); });
  document.getElementById('btn-math')?.addEventListener('click', () => { renderMath(); showView('math'); });
  document.getElementById('btn-missed')?.addEventListener('click', () => { renderMissed(); showView('missed'); });
  document.getElementById('btn-timed')?.addEventListener('click', startTimed);
  document.getElementById('btn-formulas')?.addEventListener('click', () => { renderFormulas(); showView('formulas'); });
  document.getElementById('btn-handbook')?.addEventListener('click', () => { renderFormulas(); showView('formulas'); });
  document.getElementById('btn-hb-window')?.addEventListener('click', openHandbookWindow);
  document.getElementById('btn-hb-ov-window')?.addEventListener('click', openHandbookWindow);
  document.getElementById('btn-hb-close')?.addEventListener('click', closeHandbookOverlay);
  document.getElementById('hb-overlay')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'hb-overlay') closeHandbookOverlay();
  });
  document.getElementById('hb-pdf-file')?.addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    await saveOfficialPdf(f);
    e.target.value = '';
    await refreshPdfFrame();
  });
  document.getElementById('btn-hb-pdf-clear')?.addEventListener('click', async () => {
    await clearOfficialPdf();
    await refreshPdfFrame();
  });
  document.getElementById('btn-manual')?.addEventListener('click', () => showView('manual'));
  document.getElementById('btn-settings')?.addEventListener('click', () => showView('settings'));
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (!confirm('Reset all FE math progress on this device?')) return;
    state = { answered: {}, missed: [], diag: { a: null, b: null }, settings: state.settings };
    saveState();
    renderHome();
    showView('home');
  });
  document.querySelectorAll('[data-go-home]').forEach((b) =>
    b.addEventListener('click', () => { renderHome(); showView('home'); })
  );
  el.explainToggle?.addEventListener('change', () => {
    state.settings.showExplainAfter = el.explainToggle.checked;
    saveState();
  });

  const ver = document.getElementById('app-version');
  if (ver) ver.textContent = 'v' + VERSION;
  renderHome();
  showView('home');
})();
