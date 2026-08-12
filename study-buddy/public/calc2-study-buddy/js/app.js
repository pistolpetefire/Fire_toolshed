/**
 * Calculus II Semester Study Buddy — app logic
 * Storage key namespaced for Study Buddy multi-class isolation.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'study-buddy:calc2-study-buddy:progress-v1';
  const VERSION = '1.2.0';
  const LETTERS = ['A', 'B', 'C', 'D'];
  const WEEK_COUNT = 16;

  let state = loadState();

  const el = {
    home: document.getElementById('view-home'),
    exam: document.getElementById('view-exam'),
    topics: document.getElementById('view-topics'),
    quiz: document.getElementById('view-quiz'),
    math: document.getElementById('view-math'),
    missed: document.getElementById('view-missed'),
    formulas: document.getElementById('view-formulas'),
    syllabus: document.getElementById('view-syllabus'),
    settings: document.getElementById('view-settings'),
    manual: document.getElementById('view-manual'),
    homeStats: document.getElementById('home-stats'),
    examGrid: document.getElementById('exam-grid'),
    examDetail: document.getElementById('exam-detail'),
    topicGrid: document.getElementById('topic-grid'),
    topicFilter: document.getElementById('topic-filter'),
    quizMeta: document.getElementById('quiz-meta'),
    quizStem: document.getElementById('quiz-stem'),
    quizChoices: document.getElementById('quiz-choices'),
    quizFeedback: document.getElementById('quiz-feedback'),
    quizToolbar: document.getElementById('quiz-toolbar'),
    quizProgress: document.getElementById('quiz-progress-fill'),
    mathList: document.getElementById('math-list'),
    mathFilter: document.getElementById('math-filter'),
    missedList: document.getElementById('missed-list'),
    missedFilter: document.getElementById('missed-filter'),
    formulaList: document.getElementById('formula-list'),
    formulaFilter: document.getElementById('formula-filter'),
    syllabusBody: document.getElementById('syllabus-body'),
    finalCount: document.getElementById('final-count'),
    explainToggle: document.getElementById('explain-toggle'),
    semesterPlan: document.getElementById('semester-plan'),
    planExamNote: document.getElementById('plan-exam-note'),
    planSaveStatus: document.getElementById('plan-save-status'),
  };

  let session = null;
  let planDirty = false;
  let topicFilterId = 'all';
  let mathFilterId = 'all';
  let missedFilterId = 'all';
  let formulaFilterId = 'all';

  function defaultWeeks() {
    const src = window.CALC2_SEMESTER_WEEKS || [];
    return src.slice(0, WEEK_COUNT).map((w) => ({
      label: w.label,
      text: w.text,
      exam: w.exam || '',
      done: false,
    }));
  }

  function defaultPlan() {
    return {
      examNote: '',
      activeWeek: 0,
      weeks: defaultWeeks(),
    };
  }

  function normalizePlan(plan) {
    const base = defaultPlan();
    if (!plan) return base;
    const srcWeeks = Array.isArray(plan.weeks) ? plan.weeks : plan.days;
    if (!Array.isArray(srcWeeks)) return base;
    const weeks = [];
    for (let i = 0; i < WEEK_COUNT; i++) {
      const fallback = base.weeks[i] || { label: 'Week ' + (i + 1), text: '', exam: '', done: false };
      const src = srcWeeks[i] || fallback;
      weeks.push({
        label: String(src.label || fallback.label).slice(0, 80),
        text: String(src.text || fallback.text).slice(0, 500),
        exam: String(src.exam || fallback.exam || ''),
        done: !!src.done,
      });
    }
    let activeWeek = Number.isFinite(plan.activeWeek)
      ? Math.floor(plan.activeWeek)
      : Number.isFinite(plan.activeDay)
        ? Math.floor(plan.activeDay)
        : 0;
    if (activeWeek < 0 || activeWeek > WEEK_COUNT - 1) activeWeek = 0;
    return {
      examNote: String(plan.examNote || '').slice(0, 120),
      activeWeek,
      weeks,
    };
  }

  function defaultSyllabusState() {
    return {
      paste: '',
      sourceName: '',
      examFocus: { exam1: '', exam2: '', exam3: '', final: '' },
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
          syllabus: {
            ...defaultSyllabusState(),
            ...(parsed.syllabus || {}),
            examFocus: {
              ...defaultSyllabusState().examFocus,
              ...((parsed.syllabus && parsed.syllabus.examFocus) || {}),
            },
          },
        };
      }
    } catch (_) {
      /* ignore */
    }
    return {
      answered: {},
      missed: [],
      settings: { showExplainAfter: true },
      plan: defaultPlan(),
      syllabus: defaultSyllabusState(),
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function questions() {
    return window.CALC2_QUESTIONS || [];
  }
  function topics() {
    return window.CALC2_TOPICS || [];
  }
  function exams() {
    return window.CALC2_EXAMS || [];
  }
  function mathProblems() {
    return window.CALC2_MATH || [];
  }
  function formulas() {
    return window.CALC2_FORMULAS || [];
  }
  function syllabusMeta() {
    return window.CALC2_SYLLABUS || {};
  }

  function showView(name) {
    const keys = ['home', 'exam', 'topics', 'quiz', 'math', 'missed', 'formulas', 'syllabus', 'settings', 'manual'];
    for (const key of keys) {
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

  function topicById(id) {
    return topics().find((t) => t.id === id);
  }
  function topicLabel(id) {
    return topicById(id)?.label || id;
  }
  function examById(id) {
    return exams().find((e) => e.id === id);
  }
  function examLabel(id) {
    return examById(id)?.label || id;
  }

  function questionsForExam(examId) {
    const exam = examById(examId);
    if (!exam) return [];
    const set = new Set(exam.topicIds || []);
    return questions().filter((q) => (q.topics || []).some((t) => set.has(t)));
  }

  function syllabusLoaded() {
    const meta = syllabusMeta();
    const local = (state.syllabus?.paste || '').trim().length > 0;
    const fileLoaded = meta.status === 'loaded';
    return fileLoaded || local;
  }

  function focusList(examId) {
    const meta = syllabusMeta();
    const typed = (state.syllabus?.examFocus && state.syllabus.examFocus[examId] || '').trim();
    if (typed) {
      return typed
        .split(/\n+/)
        .map((s) => s.replace(/^\s*[-*•]\s*/, '').trim())
        .filter(Boolean);
    }
    const instructor = (meta.instructorExamFocus && meta.instructorExamFocus[examId]) || [];
    if (instructor.length) return instructor.slice();
    const fallback = (meta.defaultExamFocus && meta.defaultExamFocus[examId]) || [];
    return fallback.slice();
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
      for (const tid of q.topics || []) {
        if (!byTopic[tid]) byTopic[tid] = { tried: 0, correct: 0 };
        byTopic[tid].tried += 1;
        if (rec.correct) byTopic[tid].correct += 1;
      }
    }
    const byExam = {};
    for (const exam of exams()) {
      let tried = 0;
      let ok = 0;
      const set = new Set(exam.topicIds || []);
      const seen = new Set();
      for (const q of questions()) {
        if (!state.answered[q.id]) continue;
        if (!(q.topics || []).some((t) => set.has(t))) continue;
        if (seen.has(q.id)) continue;
        seen.add(q.id);
        tried += 1;
        if (state.answered[q.id].correct) ok += 1;
      }
      byExam[exam.id] = { tried, correct: ok };
    }
    return { total, correct, accuracy: total ? Math.round((100 * correct) / total) : 0, byTopic, byExam };
  }

  function renderHome() {
    const s = scoreStats();
    const bank = questions().length;
    const plan = state.plan || defaultPlan();
    const weeksDone = plan.weeks.filter((w) => w.done).length;
    const syl = syllabusLoaded();
    el.homeStats.innerHTML = `
      <div class="stats-row">
        <span>Question bank: <b>${bank}</b></span>
        <span>Answered: <b>${s.total}</b></span>
        <span>Correct: <b>${s.correct}</b></span>
        <span>Accuracy: <b>${s.accuracy}%</b></span>
        <span>Missed list: <b>${state.missed.length}</b></span>
        <span>Weeks done: <b>${weeksDone}/${WEEK_COUNT}</b></span>
        <span>Syllabus: <b>${syl ? 'on device' : 'placeholder'}</b></span>
      </div>
      <div class="progress-bar" aria-hidden="true"><i style="width:${bank ? Math.min(100, (100 * s.total) / bank) : 0}%"></i></div>
      <p class="sub" style="margin-top:0.35rem">Progress bar ≈ fraction of the bank you have touched (not a grade).</p>
    `;
    if (el.finalCount) {
      el.finalCount.max = String(Math.max(5, bank));
      if (!el.finalCount.value) el.finalCount.value = '25';
    }
    if (el.explainToggle) el.explainToggle.checked = state.settings.showExplainAfter;
    renderExamGrid();
    renderSemesterPlan();
  }

  function renderExamGrid() {
    if (!el.examGrid) return;
    const s = scoreStats();
    el.examGrid.innerHTML = exams()
      .map((exam) => {
        const st = s.byExam[exam.id] || { tried: 0, correct: 0 };
        const n = questionsForExam(exam.id).length;
        const acc = st.tried ? Math.round((100 * st.correct) / st.tried) : null;
        const cls = ['exam-card', exam.id === 'final' ? 'exam-final' : ''].filter(Boolean).join(' ');
        return `
          <button type="button" class="${cls}" data-exam="${exam.id}">
            <div class="exam-kicker">${escapeHtml(exam.weeks)} · ${escapeHtml(exam.typical)}</div>
            <strong>${escapeHtml(exam.label)} — ${escapeHtml(exam.title)}</strong>
            <span>${escapeHtml(exam.blurb)}</span>
            <span class="stat">${n} MCQs · ${st.tried ? acc + '% of ' + st.tried + ' tried' : 'not started'}</span>
          </button>`;
      })
      .join('');
    el.examGrid.querySelectorAll('[data-exam]').forEach((btn) => {
      btn.addEventListener('click', () => openExam(btn.getAttribute('data-exam')));
    });
  }

  function openExam(examId) {
    const exam = examById(examId);
    if (!exam || !el.examDetail) return;
    const s = scoreStats();
    const focus = focusList(examId);
    const usingCustom = !!(state.syllabus?.examFocus && state.syllabus.examFocus[examId] || '').trim()
      || ((syllabusMeta().instructorExamFocus && syllabusMeta().instructorExamFocus[examId]) || []).length;
    const topicCards = (exam.topicIds || [])
      .map((tid) => {
        const t = topicById(tid);
        if (!t) return '';
        const st = s.byTopic[tid] || { tried: 0, correct: 0 };
        const n = questions().filter((q) => (q.topics || []).includes(tid)).length;
        const acc = st.tried ? Math.round((100 * st.correct) / st.tried) : null;
        return `
          <button type="button" class="topic-card" data-topic="${t.id}">
            <strong>${escapeHtml(t.label)}</strong>
            <span>${escapeHtml(t.blurb)}</span>
            <span class="stat">${n} MCQs · ${st.tried ? acc + '% of ' + st.tried + ' tried' : 'not started'}</span>
          </button>`;
      })
      .join('');

    el.examDetail.innerHTML = `
      <span class="pill">${escapeHtml(exam.weeks)}</span>
      <h2 style="margin-top:0.35rem">${escapeHtml(exam.label)} — ${escapeHtml(exam.title)}</h2>
      <p class="lead">${escapeHtml(exam.blurb)}</p>
      <p class="sub">Stewart (older OSU custom): <strong>${escapeHtml(exam.stewart)}</strong><br/>
      Rogawski (many current Stillwater sections): <strong>${escapeHtml(exam.rogawski)}</strong></p>
      <div class="focus-box">
        <h3>Key focus for this test</h3>
        <ul>${focus.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
        <p class="placeholder-note">${
          usingCustom
            ? 'Using your syllabus / locker notes for this exam.'
            : 'Using common-OSU defaults. Replace these in the Syllabus locker when you have your section’s coverage list.'
        }</p>
      </div>
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="btn-exam-start">Practice this exam</button>
        <button type="button" class="btn" id="btn-exam-math">Workshop for this exam</button>
        <button type="button" class="btn" id="btn-exam-missed">Missed in this exam</button>
      </div>
      <h3 style="margin:1.1rem 0 0.5rem;font-size:1rem">Topics</h3>
      <div class="grid topics">${topicCards}</div>
    `;
    el.examDetail.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => startTopic(btn.getAttribute('data-topic')));
    });
    document.getElementById('btn-exam-start')?.addEventListener('click', () => startExamPractice(examId));
    document.getElementById('btn-exam-math')?.addEventListener('click', () => {
      mathFilterId = examId;
      renderMath();
      showView('math');
    });
    document.getElementById('btn-exam-missed')?.addEventListener('click', () => {
      missedFilterId = examId;
      renderMissed();
      showView('missed');
    });
    showView('exam');
  }

  function renderFilterChips(container, activeId, onPick, includeAll) {
    if (!container) return;
    const chips = [];
    if (includeAll) chips.push({ id: 'all', label: 'All exams' });
    for (const exam of exams()) chips.push({ id: exam.id, label: exam.short || exam.label });
    container.innerHTML = chips
      .map(
        (c) =>
          `<button type="button" class="chip ${c.id === activeId ? 'active' : ''}" data-filter="${c.id}">${escapeHtml(c.label)}</button>`
      )
      .join('');
    container.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => onPick(btn.getAttribute('data-filter')));
    });
  }

  function renderTopics() {
    renderFilterChips(el.topicFilter, topicFilterId, (id) => {
      topicFilterId = id;
      renderTopics();
    }, true);
    const s = scoreStats();
    const list = topics().filter((t) => topicFilterId === 'all' || t.exam === topicFilterId);
    el.topicGrid.innerHTML = list
      .map((t) => {
        const st = s.byTopic[t.id] || { tried: 0, correct: 0 };
        const n = questions().filter((q) => (q.topics || []).includes(t.id)).length;
        const acc = st.tried ? Math.round((100 * st.correct) / st.tried) : null;
        const exam = examLabel(t.exam);
        return `
          <button type="button" class="topic-card" data-topic="${t.id}">
            <strong>${escapeHtml(t.label)}</strong>
            <span>${escapeHtml(t.blurb)}</span>
            <span class="stat">${escapeHtml(exam)} · ${n} MCQs · ${st.tried ? acc + '% of ' + st.tried + ' tried' : 'not started'}</span>
          </button>`;
      })
      .join('');
    el.topicGrid.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => startTopic(btn.getAttribute('data-topic')));
    });
  }

  function startTopic(topicId) {
    const pool = questions().filter((q) => (q.topics || []).includes(topicId));
    if (!pool.length) {
      alert('No questions for this topic yet.');
      return;
    }
    session = { mode: 'topic', topicId, queue: shuffle(pool), index: 0, correct: 0, wrong: 0 };
    showView('quiz');
    renderQuizItem();
  }

  function startExamPractice(examId) {
    const exam = examById(examId) || examById('final');
    let pool = exam ? questionsForExam(exam.id) : questions();
    if (exam && exam.comprehensive) pool = questions();
    if (!pool.length) {
      alert('No questions in this exam unit yet.');
      return;
    }
    let n = parseInt(el.finalCount?.value || '25', 10);
    if (!Number.isFinite(n) || n < 1) n = 10;
    n = Math.min(n, pool.length);
    session = {
      mode: 'exam',
      examId: exam ? exam.id : 'final',
      queue: shuffle(pool).slice(0, n),
      index: 0,
      correct: 0,
      wrong: 0,
    };
    showView('quiz');
    renderQuizItem();
  }

  function promptExamThenStart() {
    const overlay = document.getElementById('exam-picker');
    const list = document.getElementById('picker-list');
    if (!overlay || !list) {
      startExamPractice('final');
      return;
    }
    list.innerHTML = exams()
      .map((exam) => {
        const n = exam.comprehensive ? questions().length : questionsForExam(exam.id).length;
        return `<button type="button" class="picker-choice ${exam.id === 'final' ? 'is-final' : ''}" data-pick="${exam.id}">
          <strong>${escapeHtml(exam.label)}</strong>
          <span>${escapeHtml(exam.title)} · ${n} MCQs in bank</span>
        </button>`;
      })
      .join('');
    list.querySelectorAll('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeExamPicker();
        startExamPractice(btn.getAttribute('data-pick'));
      });
    });
    overlay.classList.remove('hidden');
    document.body.classList.add('picker-open');
    queueMicrotask(() => list.querySelector('[data-pick]')?.focus());
  }

  function closeExamPicker() {
    document.getElementById('exam-picker')?.classList.add('hidden');
    document.body.classList.remove('picker-open');
  }

  function startMissedReview(filterExamId) {
    const fid = filterExamId || missedFilterId;
    let pool = questions().filter((q) => state.missed.includes(q.id));
    if (fid && fid !== 'all') {
      const allowed = new Set(questionsForExam(fid).map((q) => q.id));
      pool = pool.filter((q) => allowed.has(q.id));
    }
    if (!pool.length) {
      alert('No missed questions in this filter. Practice first!');
      return;
    }
    session = { mode: 'missed', examId: fid, queue: shuffle(pool), index: 0, correct: 0, wrong: 0 };
    showView('quiz');
    renderQuizItem();
  }

  function sessionTitle() {
    if (!session) return '';
    if (session.mode === 'topic') return topicLabel(session.topicId);
    if (session.mode === 'missed') return 'Review missed';
    return examLabel(session.examId) + ' practice';
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
      <span>${escapeHtml(sessionTitle())} · ${escapeHtml(topicLabel((q.topics || [])[0]))}</span>
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
    if (session._quizKeyHandler) window.removeEventListener('keydown', session._quizKeyHandler);
    session._quizKeyHandler = onQuizKey;
    window.addEventListener('keydown', onQuizKey);

    el.quizToolbar.innerHTML = `
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>
      <label class="toggle"><input type="checkbox" id="sess-explain" ${state.settings.showExplainAfter ? 'checked' : ''}/> Show full tutoring after answer</label>
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
    queueMicrotask(() => el.quizChoices.querySelector('.choice')?.focus());
  }

  function onAnswer(q, letter, btnEl) {
    if (!session) return;
    const buttons = [...el.quizChoices.querySelectorAll('.choice')];
    if (buttons.some((b) => b.disabled)) return;
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
    const showTutor = !correct || showExp;
    el.quizFeedback.className = 'feedback tutor-feedback ' + (correct ? 'ok' : 'no');

    const relatedMath = findRelatedWorkshop(q);
    if (!showTutor) {
      el.quizFeedback.innerHTML = `
        <span class="label">Correct — answer ${q.answer}</span>
        <em>Full tutoring is hidden for correct answers — enable the toggle to review coaching every time.</em>
        ${relatedMathBlock(relatedMath)}`;
    } else {
      const tutorApi = window.CALC2_TUTORING;
      const pack = tutorApi?.buildMcqTutor ? tutorApi.buildMcqTutor(q, letter, correct) : null;
      if (pack) {
        el.quizFeedback.innerHTML = renderMcqTutorHtml(pack, correct) + relatedMathBlock(relatedMath);
      } else {
        el.quizFeedback.innerHTML = `
          <span class="label">${correct ? 'Correct' : 'Not quite'} — answer ${q.answer}</span>
          <p>${escapeHtml(q.explanation)}</p>
          ${relatedMathBlock(relatedMath)}`;
      }
    }
    el.quizFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    el.quizToolbar.innerHTML = `
      <button type="button" class="btn btn-primary" id="btn-next-q">${session.index + 1 >= session.queue.length ? 'See results' : 'Next question'}</button>
      ${relatedMath ? `<button type="button" class="btn" id="btn-related-math">Open related workshop</button>` : ''}
      <button type="button" class="btn btn-ghost" id="btn-quit-quiz">Exit</button>
    `;
    document.getElementById('btn-next-q')?.addEventListener('click', () => {
      session.index += 1;
      renderQuizItem();
    });
    document.getElementById('btn-next-q')?.focus();
    document.getElementById('btn-related-math')?.addEventListener('click', () => {
      if (session?._quizKeyHandler) window.removeEventListener('keydown', session._quizKeyHandler);
      session = null;
      openRelatedWorkshop(relatedMath);
    });
    document.getElementById('btn-quit-quiz')?.addEventListener('click', () => {
      if (session?._quizKeyHandler) window.removeEventListener('keydown', session._quizKeyHandler);
      session = null;
      renderHome();
      showView('home');
    });
  }

  function renderMcqTutorHtml(pack, correct) {
    const autopsy = (pack.autopsy || [])
      .map((row) => {
        const cls = row.ok ? 'ok' : 'no';
        const tag = row.ok ? 'Correct' : 'Trap';
        return `<li class="autopsy-${cls}"><strong>${escapeHtml(row.letter)}.</strong> ${escapeHtml(row.text)}
          <span class="autopsy-tag">${tag}</span>
          <div class="autopsy-why">${escapeHtml(row.why)}</div></li>`;
      })
      .join('');
    const recipe = (pack.recipe || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('');
    const work = (pack.workSteps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('');
    return `
      <span class="label">${escapeHtml(pack.headline)}</span>
      ${!correct ? '<p class="tutor-forced">Missed items always open the full solve path so you can finish the problem on paper.</p>' : ''}
      <p class="tutor-correct"><strong>Correct answer:</strong> ${escapeHtml(pack.correctChoice)}</p>
      <div class="tutor-block start-here">
        <strong>1 · Start here</strong>
        <p>${escapeHtml(pack.startHere || '')}</p>
      </div>
      <div class="tutor-block">
        <strong>2 · Method for this type of problem</strong>
        <ol class="tutor-steps">${recipe}</ol>
      </div>
      <div class="tutor-block">
        <strong>3 · This problem, step by step</strong>
        <p>${escapeHtml(pack.explanation || '')}</p>
        <ol class="tutor-steps">${work}</ol>
      </div>
      <div class="tutor-block autopsy">
        <strong>4 · Why each choice</strong>
        <ul class="autopsy-list">${autopsy}</ul>
        ${pack.trapNotes ? `<p class="trap-notes"><strong>Trap notes:</strong> ${escapeHtml(pack.trapNotes)}</p>` : ''}
      </div>
      <div class="tutor-block writeup">
        <strong>5 · Write this on the exam</strong>
        <p>${escapeHtml(pack.writeOnExam || '')}</p>
        <p class="tutor-tip"><strong>Check:</strong> ${escapeHtml(pack.howToCheck || '')}</p>
      </div>
      <div class="tutor-block coach">
        <strong>${escapeHtml(pack.coachTitle || 'Topic coach')}</strong>
        <p><strong>How to think:</strong> ${escapeHtml(pack.howToThink || '')}</p>
        <p><strong>${escapeHtml(pack.commonMistake || '')}</strong></p>
        <p class="tutor-tip"><strong>Exam tip:</strong> ${escapeHtml(pack.examTip || '')}</p>
      </div>`;
  }

  function findRelatedWorkshop(q) {
    const topic = q.topics && q.topics[0];
    if (!topic) return null;
    const list = mathProblems().filter((p) => (p.topics || []).includes(topic));
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function relatedMathBlock(p) {
    if (!p) return '';
    return `<div class="tutor-block related-workshop">
      <strong>Related workshop practice</strong>
      <p>Try a free-response problem on the same topic: <em>${escapeHtml(p.title)}</em></p>
      <p class="sub">Use the button below — write on paper first, then open the tutor solution.</p>
    </div>`;
  }

  function openRelatedWorkshop(p) {
    if (!p) return;
    const t = topicById((p.topics || [])[0]);
    mathFilterId = t?.exam || 'all';
    renderMath();
    showView('math');
    queueMicrotask(() => {
      const card = document.querySelector(`[data-math="${p.id}"]`);
      if (card) {
        card.classList.add('math-highlight');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.querySelector('[data-act="sol"]')?.focus();
      }
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
    const examId = session.examId;
    document.getElementById('btn-home')?.addEventListener('click', () => {
      session = null;
      renderHome();
      showView('home');
    });
    document.getElementById('btn-again')?.addEventListener('click', () => {
      if (mode === 'topic') startTopic(topicId);
      else if (mode === 'missed') startMissedReview(examId);
      else startExamPractice(examId);
    });
  }

  function renderMath() {
    renderFilterChips(el.mathFilter, mathFilterId, (id) => {
      mathFilterId = id;
      renderMath();
    }, true);
    const list = mathProblems().filter((p) => {
      if (mathFilterId === 'all') return true;
      return (p.topics || []).some((tid) => topicById(tid)?.exam === mathFilterId || mathFilterId === 'final');
    });
    if (!list.length) {
      el.mathList.innerHTML = '<div class="card"><p class="lead">No workshop problems in this filter yet.</p></div>';
      return;
    }
    el.mathList.innerHTML = list
      .map((p, i) => {
        const tags = (p.topics || []).map(topicLabel).join(', ');
        const topicId = (p.topics && p.topics[0]) || 'series-tests';
        const pack = window.CALC2_TUTORING?.buildWorkshopTutor
          ? window.CALC2_TUTORING.buildWorkshopTutor(p)
          : { recipe: [], startHere: '', writeOnExam: '', howToCheck: '', coachTitle: 'Topic coach' };
        return `
        <article class="card math-card" data-math="${p.id}">
          <span class="pill">${escapeHtml(tags || 'Math')}</span>
          <h3>${i + 1}. ${escapeHtml(p.title)}</h3>
          <p class="math-prompt">${escapeHtml(p.prompt)}</p>
          <p class="sub math-try-first">Write a full solution on paper first — then open the solve path below.</p>
          <div class="toolbar">
            <button type="button" class="btn" data-act="hints">1 · Hints</button>
            <button type="button" class="btn" data-act="method">2 · How to start any like this</button>
            <button type="button" class="btn btn-primary" data-act="sol">3 · Full worked solution</button>
            <button type="button" class="btn" data-act="coach">4 · Write-up + check</button>
          </div>
          <div class="hints hidden" data-box="hints">
            <strong>Hints (try before the full solution)</strong>
            <ol>${(p.hints || []).map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ol>
          </div>
          <div class="solution hidden" data-box="method">
            <strong>1 · Start here</strong>
            <p>${escapeHtml(pack.startHere || '')}</p>
            <strong>2 · Method for this type</strong>
            <ol class="tutor-steps">${(pack.recipe || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
          </div>
          <div class="solution hidden" data-box="sol">
            <strong>This problem, step by step</strong>
            <ol class="tutor-steps">${(p.solution || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
            ${(p.commonMistakes || []).length ? `<div class="tutor-block"><strong>Common mistakes</strong><ul>${p.commonMistakes.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}</ul></div>` : ''}
            ${p.whyItWorks ? `<div class="tutor-block"><strong>Why this works</strong><p>${escapeHtml(p.whyItWorks)}</p></div>` : ''}
            <p class="answer-line">Final answer: ${escapeHtml(p.answerLine || '')}</p>
          </div>
          <div class="solution coach hidden" data-box="coach">
            <strong>Write this on the exam</strong>
            <p>${escapeHtml(pack.writeOnExam || '')}</p>
            <p class="tutor-tip"><strong>Check:</strong> ${escapeHtml(pack.howToCheck || '')}</p>
            <p><strong>${escapeHtml(pack.coachTitle || 'Topic coach')}</strong> — ${escapeHtml(pack.howToThink || '')}</p>
            <p><strong>${escapeHtml(pack.commonMistake || '')}</strong></p>
            <p class="tutor-tip"><strong>Exam tip:</strong> ${escapeHtml(pack.examTip || '')}</p>
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
    renderFilterChips(el.missedFilter, missedFilterId, (id) => {
      missedFilterId = id;
      renderMissed();
    }, true);
    let pool = questions().filter((q) => state.missed.includes(q.id));
    if (missedFilterId !== 'all') {
      const allowed = new Set(questionsForExam(missedFilterId).map((q) => q.id));
      pool = pool.filter((q) => allowed.has(q.id));
    }
    if (!pool.length) {
      el.missedList.innerHTML = '<p class="lead">No missed questions in this filter. Keep practicing!</p>';
      return;
    }
    el.missedList.innerHTML = `
      <ul class="list-missed">
        ${pool
          .map(
            (q) =>
              `<li><strong>${escapeHtml(q.id)}</strong> · ${escapeHtml(topicLabel((q.topics || [])[0]))}<br/>${escapeHtml(q.stem)}</li>`
          )
          .join('')}
      </ul>
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="btn-start-missed">Practice these</button>
      </div>`;
    document.getElementById('btn-start-missed')?.addEventListener('click', () => startMissedReview(missedFilterId));
  }

  function renderFormulas() {
    renderFilterChips(el.formulaFilter, formulaFilterId, (id) => {
      formulaFilterId = id;
      renderFormulas();
    }, true);
    const list = formulas().filter((f) => formulaFilterId === 'all' || f.exam === formulaFilterId || formulaFilterId === 'final');
    el.formulaList.innerHTML = list
      .map(
        (f) => `
        <article class="card formula-card">
          <span class="pill">${escapeHtml(examLabel(f.exam))}</span>
          <h3>${escapeHtml(f.title)}</h3>
          <ul>${(f.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </article>`
      )
      .join('');
  }

  function renderSyllabus() {
    const meta = syllabusMeta();
    const loaded = syllabusLoaded();
    const rows = exams()
      .map((exam) => {
        return `<tr>
          <td><strong>${escapeHtml(exam.label)}</strong></td>
          <td>${escapeHtml(exam.stewart)}</td>
          <td>${escapeHtml(exam.rogawski)}</td>
        </tr>`;
      })
      .join('');
    const focusEditors = exams()
      .map((exam) => {
        const current = (state.syllabus.examFocus && state.syllabus.examFocus[exam.id]) || '';
        return `
          <label class="field" style="margin-top:0.85rem">
            Key focus override — ${escapeHtml(exam.label)} (one bullet per line; leave blank to use defaults)
            <textarea class="textarea-block" data-focus="${exam.id}" rows="5" maxlength="2000">${escapeHtml(current)}</textarea>
          </label>`;
      })
      .join('');

    el.syllabusBody.innerHTML = `
      <div class="syllabus-status">
        <span class="pill ${loaded ? 'ready' : 'waiting'}">${loaded ? 'Syllabus notes on this device' : 'Waiting for your syllabus copy'}</span>
        <span class="sub">${escapeHtml(meta.school || '')} · ${(meta.courseCodes || []).join(' / ')}</span>
      </div>
      <p class="lead">${escapeHtml(meta.textbookNote || '')}</p>
      <div class="drop-hint">
        <strong>Room for a future syllabus copy.</strong>
        <p style="margin:0.4rem 0 0">
          Paste exam-coverage text below (from Canvas, a PDF extract, or an email).
          Or drop a text extract into <code>syllabus/EXTRACT.md</code> in the repo and copy the “key focus” bullets into
          <code>js/syllabus.js</code> → <code>instructorExamFocus</code>.
        </p>
        <ol style="margin:0.55rem 0 0;padding-left:1.2rem">
          ${(meta.howToAdd || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </div>
      <label class="field" style="margin-top:1rem">
        Optional label (section / term / instructor)
        <input type="text" id="syl-source" maxlength="120" placeholder="e.g. OSU-OKC MATH 2153 Fall 2026 — online" value="${escapeHtml(state.syllabus.sourceName || '')}" />
      </label>
      <label class="field" style="margin-top:0.75rem">
        Paste syllabus / exam-coverage notes
        <textarea class="textarea-block" id="syl-paste" maxlength="20000" placeholder="Paste Exam 1 / 2 / 3 / Final coverage here when you have it…">${escapeHtml(state.syllabus.paste || '')}</textarea>
      </label>
      <h3 style="margin:1.25rem 0 0.4rem;font-size:1rem">Key focus per test</h3>
      <p class="lead">These override the common-OSU defaults on each exam card. Use them to match your instructor.</p>
      ${focusEditors}
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="btn-syl-save">Save syllabus notes</button>
        <button type="button" class="btn" id="btn-syl-clear">Clear locker (keep defaults)</button>
      </div>
      <p class="sub" id="syl-status" aria-live="polite"></p>
      <h3 style="margin:1.35rem 0 0.45rem;font-size:1rem">Section-number mapping</h3>
      <div style="overflow:auto">
        <table class="mapping-table">
          <thead><tr><th>Unit</th><th>Stewart (older OSU)</th><th>Rogawski (many current)</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    document.getElementById('btn-syl-save')?.addEventListener('click', saveSyllabusFromDom);
    document.getElementById('btn-syl-clear')?.addEventListener('click', () => {
      if (!confirm('Clear pasted syllabus notes and focus overrides on this device?')) return;
      state.syllabus = defaultSyllabusState();
      saveState();
      renderSyllabus();
    });
  }

  function saveSyllabusFromDom() {
    const paste = document.getElementById('syl-paste');
    const source = document.getElementById('syl-source');
    state.syllabus.paste = String(paste?.value || '').slice(0, 20000);
    state.syllabus.sourceName = String(source?.value || '').slice(0, 120);
    state.syllabus.examFocus = state.syllabus.examFocus || {};
    document.querySelectorAll('[data-focus]').forEach((ta) => {
      state.syllabus.examFocus[ta.getAttribute('data-focus')] = String(ta.value || '').slice(0, 2000);
    });
    saveState();
    const status = document.getElementById('syl-status');
    if (status) status.textContent = 'Saved on this device.';
  }

  function renderSemesterPlan() {
    if (!el.semesterPlan) return;
    state.plan = normalizePlan(state.plan);
    if (el.planExamNote) el.planExamNote.value = state.plan.examNote || '';
    const active = state.plan.activeWeek ?? 0;
    const groups = [
      { exam: 'exam1', title: 'Exam 1 block' },
      { exam: 'exam2', title: 'Exam 2 block' },
      { exam: 'exam3', title: 'Exam 3 block' },
      { exam: 'final', title: 'Final block' },
    ];
    el.semesterPlan.innerHTML = groups
      .map((g) => {
        const weeks = state.plan.weeks
          .map((w, i) => ({ w, i }))
          .filter((x) => x.w.exam === g.exam);
        const inner = weeks
          .map(({ w, i }) => {
            const isToday = i === active;
            const classes = ['plan-week', w.done ? 'done' : '', isToday ? 'current' : ''].filter(Boolean).join(' ');
            return `
              <div class="${classes}" data-week="${i}">
                <input type="checkbox" class="plan-day-check" data-plan-check="${i}" ${w.done ? 'checked' : ''} aria-label="Mark week ${i + 1} done" />
                <div class="plan-day-body">
                  <div class="plan-day-top">
                    <span class="plan-day-badge">${isToday ? 'This week · W' + (i + 1) : 'Week ' + (i + 1)}</span>
                    <button type="button" class="plan-day-today-btn ${isToday ? 'is-today' : ''}" data-plan-today="${i}">
                      ${isToday ? 'This week ✓' : 'Set as this week'}
                    </button>
                  </div>
                  <input type="text" class="plan-day-label" data-plan-label="${i}" maxlength="80" value="${escapeHtml(w.label)}" aria-label="Week ${i + 1} title" />
                  <textarea class="plan-day-text" data-plan-text="${i}" maxlength="500" rows="2" aria-label="Week ${i + 1} tasks">${escapeHtml(w.text)}</textarea>
                </div>
              </div>`;
          })
          .join('');
        return `<div class="week-group"><h3>${escapeHtml(g.title)}</h3>${inner}</div>`;
      })
      .join('');

    el.semesterPlan.querySelectorAll('[data-plan-check]').forEach((box) => {
      box.addEventListener('change', () => {
        const i = parseInt(box.getAttribute('data-plan-check'), 10);
        state.plan.weeks[i].done = box.checked;
        box.closest('.plan-week')?.classList.toggle('done', box.checked);
        saveState();
        planDirty = false;
        updatePlanStatus('Saved');
        renderHomeStatsOnly();
      });
    });
    el.semesterPlan.querySelectorAll('[data-plan-today]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.getAttribute('data-plan-today'), 10);
        state.plan.activeWeek = i;
        saveState();
        planDirty = false;
        renderSemesterPlan();
        updatePlanStatus('This week set to Week ' + (i + 1));
      });
    });
    el.semesterPlan.querySelectorAll('[data-plan-label], [data-plan-text]').forEach((input) => {
      input.addEventListener('input', markPlanDirty);
      input.addEventListener('change', readPlanFromDomAndSave);
      input.addEventListener('blur', readPlanFromDomAndSave);
    });
  }

  function renderHomeStatsOnly() {
    if (!el.homeStats) return;
    const s = scoreStats();
    const bank = questions().length;
    const weeksDone = (state.plan?.weeks || []).filter((w) => w.done).length;
    const b = el.homeStats.querySelectorAll('.stats-row b');
    if (b.length >= 6) b[5].textContent = `${weeksDone}/${WEEK_COUNT}`;
    void s;
    void bank;
  }

  function markPlanDirty() {
    planDirty = true;
    updatePlanStatus('Unsaved changes');
  }

  function readPlanFromDom(save) {
    if (!el.semesterPlan || !state.plan) return;
    for (let i = 0; i < WEEK_COUNT; i++) {
      const labelEl = el.semesterPlan.querySelector(`[data-plan-label="${i}"]`);
      const textEl = el.semesterPlan.querySelector(`[data-plan-text="${i}"]`);
      const checkEl = el.semesterPlan.querySelector(`[data-plan-check="${i}"]`);
      if (labelEl) state.plan.weeks[i].label = String(labelEl.value || '').slice(0, 80);
      if (textEl) state.plan.weeks[i].text = String(textEl.value || '').slice(0, 500);
      if (checkEl) state.plan.weeks[i].done = !!checkEl.checked;
    }
    if (el.planExamNote) state.plan.examNote = String(el.planExamNote.value || '').slice(0, 120);
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
    if (msg === 'Saved' || /^This week set/.test(msg)) {
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
      app: 'calc2-study-buddy',
      version: VERSION,
      exported: new Date().toISOString(),
      plan: state.plan,
      syllabus: state.syllabus,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calc2-semester-plan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updatePlanStatus('Plan exported');
  }

  function importPlan(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || ''));
        const plan = data.plan || data;
        if (!plan || !(Array.isArray(plan.weeks) || Array.isArray(plan.days))) {
          throw new Error('File needs a plan.weeks array (export from this app).');
        }
        state.plan = normalizePlan(plan);
        if (data.syllabus) {
          state.syllabus = { ...defaultSyllabusState(), ...data.syllabus, examFocus: { ...defaultSyllabusState().examFocus, ...(data.syllabus.examFocus || {}) } };
        }
        planDirty = false;
        saveState();
        renderHome();
        updatePlanStatus('Plan imported');
      } catch (err) {
        alert('Could not import plan: ' + (err instanceof Error ? err.message : String(err)));
        updatePlanStatus('Import failed');
      }
    };
    reader.onerror = () => alert('Failed to read file.');
    reader.readAsText(file);
  }

  function resetWeekPlan() {
    if (!confirm('Restore the default 16-week plan? Edited week text will be replaced. Quiz progress is kept.')) return;
    state.plan = defaultPlan();
    planDirty = false;
    saveState();
    renderHome();
    updatePlanStatus('Default plan restored');
  }

  function resetProgress() {
    if (!confirm('Reset all Calc II quiz progress on this device? Your semester plan and syllabus notes are kept. Continue?')) return;
    const plan = state.plan || defaultPlan();
    const syllabus = state.syllabus || defaultSyllabusState();
    state = {
      answered: {},
      missed: [],
      settings: { showExplainAfter: state.settings?.showExplainAfter !== false },
      plan,
      syllabus,
    };
    saveState();
    renderHome();
    alert('Quiz progress cleared. Semester plan and syllabus locker kept.');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.getElementById('btn-topics')?.addEventListener('click', () => {
    renderTopics();
    showView('topics');
  });
  document.getElementById('btn-exam-practice')?.addEventListener('click', promptExamThenStart);
  document.getElementById('picker-cancel')?.addEventListener('click', closeExamPicker);
  document.getElementById('exam-picker')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'exam-picker') closeExamPicker();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeExamPicker();
  });
  document.getElementById('btn-math')?.addEventListener('click', () => {
    renderMath();
    showView('math');
  });
  document.getElementById('btn-missed')?.addEventListener('click', () => {
    renderMissed();
    showView('missed');
  });
  document.getElementById('btn-formulas')?.addEventListener('click', () => {
    renderFormulas();
    showView('formulas');
  });
  document.getElementById('btn-syllabus')?.addEventListener('click', () => {
    renderSyllabus();
    showView('syllabus');
  });
  document.getElementById('btn-settings')?.addEventListener('click', () => showView('settings'));
  document.getElementById('btn-manual')?.addEventListener('click', () => showView('manual'));
  document.querySelectorAll('[data-go-home]').forEach((b) =>
    b.addEventListener('click', () => {
      renderHome();
      showView('home');
    })
  );
  document.getElementById('btn-reset')?.addEventListener('click', resetProgress);
  document.getElementById('btn-plan-save')?.addEventListener('click', readPlanFromDomAndSave);
  document.getElementById('btn-plan-export')?.addEventListener('click', exportPlan);
  document.getElementById('btn-plan-import')?.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importPlan(f);
    e.target.value = '';
  });
  document.getElementById('btn-plan-reset')?.addEventListener('click', resetWeekPlan);
  el.planExamNote?.addEventListener('input', markPlanDirty);
  el.planExamNote?.addEventListener('change', readPlanFromDomAndSave);
  el.planExamNote?.addEventListener('blur', readPlanFromDomAndSave);
  el.explainToggle?.addEventListener('change', () => {
    state.settings.showExplainAfter = el.explainToggle.checked;
    saveState();
  });

  document.getElementById('app-version') && (document.getElementById('app-version').textContent = 'v' + VERSION);
  if (!state.plan) state.plan = defaultPlan();
  if (!questions().length) {
    el.homeStats.innerHTML = '<p class="lead">Question bank failed to load. Check js/questions.js.</p>';
    renderExamGrid();
    renderSemesterPlan();
  } else {
    renderHome();
  }
  showView('home');
})();
