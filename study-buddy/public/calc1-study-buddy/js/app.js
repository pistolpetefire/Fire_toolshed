/**
 * Calculus I Final Study Buddy — app logic
 * Storage key namespaced for Study Buddy multi-class isolation.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'study-buddy:calc1-study-buddy:progress-v1';
  const VERSION = '1.0.2';

  const LETTERS = ['A', 'B', 'C', 'D'];

  /** Default 7-day crunch plan for a final next week (editable). */
  const DEFAULT_WEEK_PLAN = [
    {
      label: 'Day 1 — Foundations',
      text: 'Big ideas MCQs (20 min). Limits topic MCQs. 2 worked limit problems on paper before revealing solutions.',
    },
    {
      label: 'Day 2 — Derivative rules',
      text: 'Derivative definition + rules MCQs. Drill product/quotient/chain. 3 worked derivatives on paper.',
    },
    {
      label: 'Day 3 — Applications',
      text: 'Related rates + optimization MCQs. 2 related-rates and 1 optimization workshop problem. Mark misses.',
    },
    {
      label: 'Day 4 — Integrals',
      text: 'Antiderivatives + FTC MCQs. 3 definite/indefinite workshop problems. Keep +C on indefinite.',
    },
    {
      label: 'Day 5 — u-sub + area',
      text: 'u-substitution + area/volume intro MCQs. 3 u-sub workshop problems (change limits on definite).',
    },
    {
      label: 'Day 6 — Mixed practice final',
      text: 'Practice final (30–40 MCQs). Review every miss the same day. Light workshop only on weak spots.',
    },
    {
      label: 'Day 7 — Exam eve / exam day',
      text: 'Clear Review missed list. Short 15-question mixed set. Skim formula sheet (power/chain/FTC/u-sub). Sleep.',
    },
  ];

  /** @type {{ answered: Record<string, {correct:boolean, at:string}>, missed: string[], settings: { showExplainAfter: boolean }, plan?: { examNote: string, days: {label:string,text:string,done:boolean}[] } }} */
  let state = loadState();

  const el = {
    home: document.getElementById('view-home'),
    topics: document.getElementById('view-topics'),
    quiz: document.getElementById('view-quiz'),
    math: document.getElementById('view-math'),
    missed: document.getElementById('view-missed'),
    settings: document.getElementById('view-settings'),
    homeStats: document.getElementById('home-stats'),
    topicGrid: document.getElementById('topic-grid'),
    quizMeta: document.getElementById('quiz-meta'),
    quizStem: document.getElementById('quiz-stem'),
    quizChoices: document.getElementById('quiz-choices'),
    quizFeedback: document.getElementById('quiz-feedback'),
    quizToolbar: document.getElementById('quiz-toolbar'),
    quizProgress: document.getElementById('quiz-progress-fill'),
    mathList: document.getElementById('math-list'),
    missedList: document.getElementById('missed-list'),
    finalCount: document.getElementById('final-count'),
    explainToggle: document.getElementById('explain-toggle'),
    weekPlan: document.getElementById('week-plan'),
    planExamNote: document.getElementById('plan-exam-note'),
    planSaveStatus: document.getElementById('plan-save-status'),
  };

  let session = null; // { mode, queue, index, correct, wrong, topicId? }

  /** Tracks unsaved edits in the plan form (dirty UX). */
  let planDirty = false;

  function defaultPlan() {
    return {
      examNote: '',
      activeDay: 0,
      days: DEFAULT_WEEK_PLAN.map((d) => ({ label: d.label, text: d.text, done: false })),
    };
  }

  function normalizePlan(plan) {
    const base = defaultPlan();
    if (!plan || !Array.isArray(plan.days)) return base;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const src = plan.days[i] || base.days[i];
      days.push({
        label: String(src.label || base.days[i].label).slice(0, 80),
        text: String(src.text || base.days[i].text).slice(0, 500),
        done: !!src.done,
      });
    }
    let activeDay = Number.isFinite(plan.activeDay) ? Math.floor(plan.activeDay) : 0;
    if (activeDay < 0 || activeDay > 6) activeDay = 0;
    return {
      examNote: String(plan.examNote || '').slice(0, 80),
      activeDay,
      days,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          answered: parsed.answered || {},
          missed: parsed.missed || [],
          settings: {
            showExplainAfter: parsed.settings?.showExplainAfter !== false,
          },
          plan: normalizePlan(parsed.plan),
        };
      }
    } catch (_) { /* ignore */ }
    return { answered: {}, missed: [], settings: { showExplainAfter: true }, plan: defaultPlan() };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function questions() {
    return window.CALC1_QUESTIONS || [];
  }

  function topics() {
    return window.CALC1_TOPICS || [];
  }

  function mathProblems() {
    return window.CALC1_MATH || [];
  }

  function showView(name) {
    for (const key of ['home', 'topics', 'quiz', 'math', 'missed', 'settings']) {
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

  function topicLabel(id) {
    return topics().find((t) => t.id === id)?.label || id;
  }

  function scoreStats() {
    const entries = Object.values(state.answered);
    const total = entries.length;
    const correct = entries.filter((e) => e.correct).length;
    const byTopic = {};
    for (const t of topics()) byTopic[t.id] = { tried: 0, correct: 0 };
    for (const q of questions()) {
      const rec = state.answered[q.id];
      if (!rec) continue;
      for (const tid of q.topics) {
        if (!byTopic[tid]) byTopic[tid] = { tried: 0, correct: 0 };
        byTopic[tid].tried += 1;
        if (rec.correct) byTopic[tid].correct += 1;
      }
    }
    return { total, correct, accuracy: total ? Math.round((100 * correct) / total) : 0, byTopic };
  }

  function renderHome() {
    const s = scoreStats();
    const bank = questions().length;
    const plan = state.plan || defaultPlan();
    const daysDone = plan.days.filter((d) => d.done).length;
    el.homeStats.innerHTML = `
      <div class="stats-row">
        <span>Question bank: <b>${bank}</b></span>
        <span>Answered: <b>${s.total}</b></span>
        <span>Correct: <b>${s.correct}</b></span>
        <span>Accuracy: <b>${s.accuracy}%</b></span>
        <span>Missed list: <b>${state.missed.length}</b></span>
        <span>Plan days done: <b>${daysDone}/7</b></span>
      </div>
      <div class="progress-bar" aria-hidden="true"><i style="width:${bank ? Math.min(100, (100 * s.total) / bank) : 0}%"></i></div>
      <p class="sub" style="margin-top:0.35rem">Progress bar ≈ fraction of bank you’ve touched (not a grade).</p>
    `;
    if (el.finalCount) {
      el.finalCount.max = String(bank);
      if (!el.finalCount.value) el.finalCount.value = String(Math.min(40, bank));
    }
    if (el.explainToggle) {
      el.explainToggle.checked = state.settings.showExplainAfter;
    }
    renderWeekPlan();
  }

  function renderWeekPlan() {
    if (!el.weekPlan) return;
    state.plan = normalizePlan(state.plan);
    if (el.planExamNote) el.planExamNote.value = state.plan.examNote || '';
    const active = state.plan.activeDay ?? 0;

    el.weekPlan.innerHTML = state.plan.days
      .map((day, i) => {
        const isToday = i === active;
        const classes = ['plan-day', day.done ? 'done' : '', isToday ? 'today' : '', isToday ? 'plan-day-today' : '']
          .filter(Boolean)
          .join(' ');
        return `
      <div class="${classes}" data-day="${i}">
        <input type="checkbox" class="plan-day-check" data-plan-check="${i}" ${day.done ? 'checked' : ''} aria-label="Mark day ${i + 1} done" />
        <div class="plan-day-body">
          <div class="plan-day-top">
            <span class="plan-day-badge">${isToday ? 'Today · Day ' + (i + 1) : 'Day ' + (i + 1)}</span>
            <button type="button" class="plan-day-today-btn ${isToday ? 'is-today' : ''}" data-plan-today="${i}">
              ${isToday ? 'Today ✓' : 'Set as today'}
            </button>
          </div>
          <input type="text" class="plan-day-label" data-plan-label="${i}" maxlength="80" value="${escapeHtml(day.label)}" aria-label="Day ${i + 1} title" />
          <textarea class="plan-day-text" data-plan-text="${i}" maxlength="500" rows="2" aria-label="Day ${i + 1} tasks">${escapeHtml(day.text)}</textarea>
        </div>
      </div>`;
      })
      .join('');

    el.weekPlan.querySelectorAll('[data-plan-check]').forEach((box) => {
      box.addEventListener('change', () => {
        const i = parseInt(box.getAttribute('data-plan-check'), 10);
        state.plan.days[i].done = box.checked;
        box.closest('.plan-day')?.classList.toggle('done', box.checked);
        saveState();
        planDirty = false;
        updatePlanStatus('Saved');
        const done = state.plan.days.filter((d) => d.done).length;
        const span = el.homeStats?.querySelector('.stats-row span:last-child b');
        if (span) span.textContent = `${done}/7`;
      });
    });

    el.weekPlan.querySelectorAll('[data-plan-today]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-plan-today'), 10);
        state.plan.activeDay = i;
        saveState();
        planDirty = false;
        renderWeekPlan();
        updatePlanStatus('Today set to Day ' + (i + 1));
      });
    });

    el.weekPlan.querySelectorAll('[data-plan-label], [data-plan-text]').forEach((input) => {
      input.addEventListener('input', markPlanDirty);
      input.addEventListener('change', readPlanFromDomAndSave);
      input.addEventListener('blur', readPlanFromDomAndSave);
    });
  }

  function markPlanDirty() {
    planDirty = true;
    updatePlanStatus('Unsaved changes');
  }

  function readPlanFromDom(save) {
    if (!el.weekPlan || !state.plan) return;
    for (let i = 0; i < 7; i++) {
      const labelEl = el.weekPlan.querySelector(`[data-plan-label="${i}"]`);
      const textEl = el.weekPlan.querySelector(`[data-plan-text="${i}"]`);
      const checkEl = el.weekPlan.querySelector(`[data-plan-check="${i}"]`);
      if (labelEl) state.plan.days[i].label = String(labelEl.value || '').slice(0, 80);
      if (textEl) state.plan.days[i].text = String(textEl.value || '').slice(0, 500);
      if (checkEl) state.plan.days[i].done = !!checkEl.checked;
    }
    if (el.planExamNote) state.plan.examNote = String(el.planExamNote.value || '').slice(0, 80);
    state.plan = normalizePlan(state.plan);
    if (save) {
      saveState();
      planDirty = false;
      updatePlanStatus('Saved');
    }
  }

  function readPlanFromDomAndSave() {
    readPlanFromDom(true);
  }

  function updatePlanStatus(msg) {
    if (!el.planSaveStatus) return;
    el.planSaveStatus.textContent = msg;
    el.planSaveStatus.classList.toggle('plan-status-unsaved', /Unsaved/i.test(msg));
    if (msg === 'Saved' || /^Today set/.test(msg)) {
      window.clearTimeout(updatePlanStatus._t);
      updatePlanStatus._t = window.setTimeout(() => {
        if (el.planSaveStatus && !planDirty) {
          el.planSaveStatus.textContent = '';
          el.planSaveStatus.classList.remove('plan-status-unsaved');
        }
      }, 1600);
    }
  }

  function exportPlan() {
    readPlanFromDom(true);
    const payload = {
      app: 'calc1-study-buddy',
      version: VERSION,
      exported: new Date().toISOString(),
      plan: state.plan,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calc1-7day-plan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updatePlanStatus('Plan exported');
  }

  function resetWeekPlan() {
    if (!confirm('Restore the default 7-day plan? Your edited day text will be replaced. Quiz progress is kept.')) return;
    state.plan = defaultPlan();
    planDirty = false;
    saveState();
    renderWeekPlan();
    updatePlanStatus('Default plan restored');
    renderHome();
  }

  function renderTopics() {
    const s = scoreStats();
    el.topicGrid.innerHTML = topics()
      .map((t) => {
        const st = s.byTopic[t.id] || { tried: 0, correct: 0 };
        const n = questions().filter((q) => q.topics.includes(t.id)).length;
        const acc = st.tried ? Math.round((100 * st.correct) / st.tried) : null;
        return `
          <button type="button" class="topic-card" data-topic="${t.id}">
            <strong>${escapeHtml(t.label)}</strong>
            <span>${escapeHtml(t.blurb)}</span>
            <span class="stat">${n} MCQs · ${st.tried ? acc + '% of ' + st.tried + ' tried' : 'not started'}</span>
          </button>`;
      })
      .join('');
    el.topicGrid.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => startTopic(btn.getAttribute('data-topic')));
    });
  }

  function startTopic(topicId) {
    const pool = questions().filter((q) => q.topics.includes(topicId));
    if (!pool.length) {
      alert('No questions for this topic yet.');
      return;
    }
    session = {
      mode: 'topic',
      topicId,
      queue: shuffle(pool),
      index: 0,
      correct: 0,
      wrong: 0,
    };
    showView('quiz');
    renderQuizItem();
  }

  function startFinal() {
    const bank = questions();
    let n = parseInt(el.finalCount?.value || '50', 10);
    if (!Number.isFinite(n) || n < 1) n = 10;
    n = Math.min(n, bank.length);
    session = {
      mode: 'final',
      queue: shuffle(bank).slice(0, n),
      index: 0,
      correct: 0,
      wrong: 0,
    };
    showView('quiz');
    renderQuizItem();
  }

  function startMissedReview() {
    const pool = questions().filter((q) => state.missed.includes(q.id));
    if (!pool.length) {
      alert('No missed questions yet. Practice first!');
      return;
    }
    session = {
      mode: 'missed',
      queue: shuffle(pool),
      index: 0,
      correct: 0,
      wrong: 0,
    };
    showView('quiz');
    renderQuizItem();
  }

  function renderQuizItem() {
    if (!session || session.index >= session.queue.length) {
      renderQuizDone();
      return;
    }
    const q = session.queue[session.index];
    const pct = (100 * session.index) / session.queue.length;
    if (el.quizProgress) el.quizProgress.style.width = pct + '%';

    el.quizMeta.innerHTML = `
      <span>${session.mode === 'topic' ? escapeHtml(topicLabel(session.topicId)) : session.mode === 'final' ? 'Practice final' : 'Review missed'}</span>
      <span>Q ${session.index + 1} / ${session.queue.length} · score ${session.correct}/${session.correct + session.wrong}</span>
    `;
    el.quizStem.textContent = q.stem;
    el.quizFeedback.className = 'feedback hidden';
    el.quizFeedback.innerHTML = '';

    el.quizChoices.innerHTML = q.choices
      .map(
        (c, i) =>
          `<button type="button" class="choice" data-letter="${LETTERS[i]}" data-index="${i}"><strong>${LETTERS[i]}.</strong> ${escapeHtml(c)}</button>`
      )
      .join('');

    const choose = (letter, btn) => onAnswer(q, letter, btn);

    el.quizChoices.querySelectorAll('.choice').forEach((btn) => {
      btn.addEventListener('click', () => choose(btn.getAttribute('data-letter'), btn));
      // Keyboard: Enter/Space activate focused button (native); also arrow keys between choices
      btn.addEventListener('keydown', (e) => {
        const buttons = [...el.quizChoices.querySelectorAll('.choice')];
        const idx = buttons.indexOf(btn);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          buttons[Math.min(buttons.length - 1, idx + 1)]?.focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          buttons[Math.max(0, idx - 1)]?.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          choose(btn.getAttribute('data-letter'), btn);
        }
      });
    });

    // Global letter/number shortcuts while this question is active (A–D or 1–4)
    el.quizChoices.onkeydown = null;
    const onQuizKey = (e) => {
      if (!session) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
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
    // Remove previous listener if re-rendering
    if (session._quizKeyHandler) {
      window.removeEventListener('keydown', session._quizKeyHandler);
    }
    session._quizKeyHandler = onQuizKey;
    window.addEventListener('keydown', onQuizKey);

    el.quizToolbar.innerHTML = `
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>
      <label class="toggle"><input type="checkbox" id="sess-explain" ${state.settings.showExplainAfter ? 'checked' : ''}/> Show explanation after answer</label>
      <span class="sub" style="font-size:0.78rem">Keys: A–D or 1–4 · arrows move · Enter selects</span>
    `;
    document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
      if (confirm('Leave this practice session?')) {
        if (session?._quizKeyHandler) window.removeEventListener('keydown', session._quizKeyHandler);
        session = null;
        renderHome();
        showView('home');
      }
    });
    document.getElementById('sess-explain')?.addEventListener('change', (e) => {
      state.settings.showExplainAfter = e.target.checked;
      saveState();
    });

    // Focus first choice for keyboard users
    queueMicrotask(() => el.quizChoices.querySelector('.choice')?.focus());
  }

  function onAnswer(q, letter, btnEl) {
    if (!session) return;
    const buttons = [...el.quizChoices.querySelectorAll('.choice')];
    if (buttons.some((b) => b.disabled)) return;

    // Stop letter shortcuts until next question
    if (session._quizKeyHandler) {
      window.removeEventListener('keydown', session._quizKeyHandler);
      session._quizKeyHandler = null;
    }

    const correct = letter === q.answer;
    buttons.forEach((b) => {
      b.disabled = true;
      const L = b.getAttribute('data-letter');
      if (L === q.answer) b.classList.add('correct');
      else if (L === letter && !correct) b.classList.add('wrong');
    });
    btnEl.classList.add(correct ? 'correct' : 'selected');

    if (correct) session.correct += 1;
    else session.wrong += 1;

    state.answered[q.id] = { correct, at: new Date().toISOString() };
    if (!correct) {
      if (!state.missed.includes(q.id)) state.missed.push(q.id);
    } else {
      state.missed = state.missed.filter((id) => id !== q.id);
    }
    saveState();

    const showExp = document.getElementById('sess-explain')?.checked ?? state.settings.showExplainAfter;
    el.quizFeedback.className = 'feedback ' + (correct ? 'ok' : 'no');
    el.quizFeedback.innerHTML = `
      <span class="label">${correct ? 'Correct' : 'Not quite'} — answer ${q.answer}</span>
      ${showExp ? escapeHtml(q.explanation) : '<em>Explanation hidden — enable the toggle to show next time.</em>'}
    `;
    // Ensure live region announces even if class was already set
    el.quizFeedback.setAttribute('aria-live', 'polite');

    el.quizToolbar.innerHTML = `
      <button type="button" class="btn btn-primary" id="btn-next-q">${session.index + 1 >= session.queue.length ? 'See results' : 'Next question'}</button>
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>
    `;
    document.getElementById('btn-next-q')?.addEventListener('click', () => {
      session.index += 1;
      renderQuizItem();
    });
    document.getElementById('btn-next-q')?.focus();
    document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
      if (session?._quizKeyHandler) window.removeEventListener('keydown', session._quizKeyHandler);
      session = null;
      renderHome();
      showView('home');
    });
  }

  function renderQuizDone() {
    if (el.quizProgress) el.quizProgress.style.width = '100%';
    const total = session.correct + session.wrong;
    const pct = total ? Math.round((100 * session.correct) / total) : 0;
    el.quizMeta.innerHTML = `<span>Session complete</span><span>${session.correct}/${total} (${pct}%)</span>`;
    el.quizStem.textContent = 'Nice work — practice complete.';
    el.quizChoices.innerHTML = '';
    el.quizFeedback.className = 'feedback ok';
    el.quizFeedback.innerHTML = `
      <span class="label">Results</span>
      Correct: ${session.correct} · Incorrect: ${session.wrong} · Accuracy: ${pct}%
      <br/>Missed items stay in Review missed until you get them right.
    `;
    el.quizToolbar.innerHTML = `
      <button type="button" class="btn btn-primary" id="btn-home">Back to home</button>
      <button type="button" class="btn" id="btn-again">Practice again</button>
    `;
    const mode = session.mode;
    const topicId = session.topicId;
    document.getElementById('btn-home')?.addEventListener('click', () => {
      session = null;
      renderHome();
      showView('home');
    });
    document.getElementById('btn-again')?.addEventListener('click', () => {
      if (mode === 'topic') startTopic(topicId);
      else if (mode === 'missed') startMissedReview();
      else startFinal();
    });
  }

  function renderMath() {
    const list = mathProblems();
    el.mathList.innerHTML = list
      .map((p, i) => {
        const tags = (p.topics || []).map(topicLabel).join(', ');
        return `
        <article class="card math-card" data-math="${p.id}">
          <span class="pill">${escapeHtml(tags || 'Math')}</span>
          <h3>${i + 1}. ${escapeHtml(p.title)}</h3>
          <p class="math-prompt">${escapeHtml(p.prompt)}</p>
          <div class="toolbar">
            <button type="button" class="btn" data-act="hints">Show hints</button>
            <button type="button" class="btn btn-primary" data-act="sol">Show worked solution</button>
          </div>
          <div class="hints hidden" data-box="hints">
            <strong>Hints</strong>
            <ol>${(p.hints || []).map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ol>
          </div>
          <div class="solution hidden" data-box="sol">
            <strong>Worked solution</strong>
            <ol>${(p.solution || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
            <p class="answer-line">Answer: ${escapeHtml(p.answerLine || '')}</p>
          </div>
        </article>`;
      })
      .join('');

    el.mathList.querySelectorAll('[data-math]').forEach((card) => {
      card.querySelectorAll('[data-act]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const box = card.querySelector(`[data-box="${btn.getAttribute('data-act')}"]`);
          box?.classList.toggle('hidden');
        });
      });
    });
  }

  function renderMissed() {
    const pool = questions().filter((q) => state.missed.includes(q.id));
    if (!pool.length) {
      el.missedList.innerHTML = '<p class="lead">No missed questions on your list. Keep practicing!</p>';
      return;
    }
    el.missedList.innerHTML = `
      <ul class="list-missed">
        ${pool
          .map(
            (q) =>
              `<li><strong>${escapeHtml(q.id)}</strong> · ${escapeHtml(topicLabel(q.topics[0]))}<br/>${escapeHtml(q.stem)}</li>`
          )
          .join('')}
      </ul>
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="btn-start-missed">Practice these</button>
      </div>`;
    document.getElementById('btn-start-missed')?.addEventListener('click', startMissedReview);
  }

  function resetProgress() {
    if (!confirm('Reset all Calc I quiz progress on this device? Your 7-day plan is kept. Continue?')) return;
    const plan = state.plan || defaultPlan();
    state = {
      answered: {},
      missed: [],
      settings: { showExplainAfter: state.settings?.showExplainAfter !== false },
      plan,
    };
    saveState();
    renderHome();
    alert('Quiz progress cleared. Study plan kept.');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Wire home buttons
  document.getElementById('btn-topics')?.addEventListener('click', () => {
    renderTopics();
    showView('topics');
  });
  document.getElementById('btn-final')?.addEventListener('click', startFinal);
  document.getElementById('btn-math')?.addEventListener('click', () => {
    renderMath();
    showView('math');
  });
  document.getElementById('btn-missed')?.addEventListener('click', () => {
    renderMissed();
    showView('missed');
  });
  document.getElementById('btn-settings')?.addEventListener('click', () => showView('settings'));
  document.querySelectorAll('[data-go-home]').forEach((b) =>
    b.addEventListener('click', () => {
      renderHome();
      showView('home');
    })
  );
  document.getElementById('btn-reset')?.addEventListener('click', resetProgress);
  document.getElementById('btn-plan-save')?.addEventListener('click', () => {
    readPlanFromDomAndSave();
  });
  document.getElementById('btn-plan-export')?.addEventListener('click', exportPlan);
  document.getElementById('btn-plan-reset')?.addEventListener('click', resetWeekPlan);
  el.planExamNote?.addEventListener('input', markPlanDirty);
  el.planExamNote?.addEventListener('change', readPlanFromDomAndSave);
  el.planExamNote?.addEventListener('blur', readPlanFromDomAndSave);
  el.explainToggle?.addEventListener('change', () => {
    state.settings.showExplainAfter = el.explainToggle.checked;
    saveState();
  });

  // Boot
  document.getElementById('app-version') && (document.getElementById('app-version').textContent = 'v' + VERSION);
  if (!state.plan) state.plan = defaultPlan();
  if (!questions().length) {
    el.homeStats.innerHTML = '<p class="lead">Question bank failed to load. Check js/questions.js.</p>';
    renderWeekPlan();
  } else {
    renderHome();
  }
  showView('home');
})();
