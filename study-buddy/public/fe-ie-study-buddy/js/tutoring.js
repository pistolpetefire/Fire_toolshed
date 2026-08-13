window.IE_TUTORING = {
  coaches: {
    econ: {
      title: 'Engineering economy coach',
      howToThink: 'Draw the cash-flow timeline. Pick P, F, A, i, n. Use the factor that converts what you have into what you want. Same i and n for every term.',
      commonMistake: 'Common mistake: mixing i per year with n in months, or treating costs as benefits in B/C.',
      examTip: 'Exam tip: Handbook has (P/F,i,n), (P/A,i,n), etc. Write the factor name before punching the calculator.',
      firstMove: 'Label each arrow P, F, or A. Write i and n in matching periods.',
      recipe: ['Draw cash flows.', 'Choose the factor (P/F, F/P, P/A, A/P, P/G).', 'PW or AW all alternatives at the same i.', 'Highest PW (or AW) wins for equal-life mutually exclusive options.'],
      writeOnExam: 'Show the factor and the arithmetic. Box the equivalent worth.',
      howToCheck: 'A future amount must be larger than P at positive i. Signs: costs negative if PW of profit.',
      traps: [{ re: /forgot i|period/i, why: 'i and n must use the same period (year vs month).' }],
    },
    modeling: {
      title: 'Modeling coach',
      howToThink: 'LP: write decision vars, objective, constraints. Queues: identify λ, μ, utilization ρ=λ/μ. Little: L=λW.',
      commonMistake: 'Common mistake: using service time as μ instead of 1/μ, or forgetting ρ must be < 1.',
      examTip: 'Exam tip: Handbook queue tables assume stable ρ<1. If λ≥μ the line blows up.',
      firstMove: 'Is this LP, a queue, or Little’s law? Write the symbols first.',
      recipe: ['Name λ (arrival rate) and μ (service rate).', 'ρ=λ/μ. If ρ≥1, unstable.', 'Little: L=λW, Lq=λWq.', 'LP: graph or simplex — binding constraints have zero slack.'],
      writeOnExam: 'Box ρ or L or the optimal corner. State units (jobs/hour).',
      howToCheck: 'Utilization is between 0 and 1. Wait time ≥ service time.',
      traps: [{ re: /unstable|ρ > 1/i, why: 'If arrivals are faster than service, the queue grows without bound.' }],
    },
    management: {
      title: 'Management / PERT coach',
      howToThink: 'PERT te=(a+4m+b)/6. Critical path is the longest path. Slack = LS−ES. EV = %complete × BAC (or PV×% if they define it that way).',
      commonMistake: 'Common mistake: treating the shortest path as critical, or using (a+m+b)/3.',
      examTip: 'Exam tip: Handbook lists te and σ=(b−a)/6. Variance of a path is the sum of critical-activity variances.',
      firstMove: 'List activities, compute te, then forward pass for ES/EF.',
      recipe: ['te=(a+4m+b)/6.', 'Forward pass ES/EF, backward LS/LF.', 'Critical path: slack 0, longest duration.', 'Decision tree: EMV = Σ (payoff × probability).'],
      writeOnExam: 'Show te for each activity and the path sums. Box the critical path and length.',
      howToCheck: 'Project duration equals the critical-path sum, not the sum of all activities.',
      traps: [{ re: /shortest path|average a\+m\+b/i, why: 'Critical path is longest. PERT uses (a+4m+b)/6, not the simple average.' }],
    },
    production: {
      title: 'Production / inventory coach',
      howToThink: 'EOQ = √(2DS/H). Cycle time = available time / demand. Stations ≥ total work / cycle time.',
      commonMistake: 'Common mistake: using daily D with yearly H, or forgetting holding cost is per unit per year.',
      examTip: 'Exam tip: Handbook has EOQ and ROP = dL + SS. Match units before you square-root.',
      firstMove: 'Write D, S, H in the same time unit. For line balance, write cycle time first.',
      recipe: ['EOQ=√(2DS/H). Orders/year=D/Q. TCmin = √(2DSH) roughly + PD.', 'ROP = demand during lead time (+ safety stock).', 'Forecast: MA or F_t = F_{t−1}+α(A−F).', 'Line: CT = T_available / demand. Nmin = Σt / CT.'],
      writeOnExam: 'Show the EOQ or CT formula with numbers. Box Q* or number of stations (round up).',
      howToCheck: 'Stations must be an integer ≥ Nmin. EOQ should make order cost ≈ hold cost.',
      traps: [{ re: /round down stations|mixed units/i, why: 'Always round stations up. D and H must share a time base.' }],
    },
    facilities: {
      title: 'Facilities / supply chain coach',
      howToThink: 'Rectilinear distance |Δx|+|Δy|. Capacity: machines = (demand × time per unit) / (available × utilization × efficiency).',
      commonMistake: 'Common mistake: Euclidean distance when the problem is aisle/rectilinear, or ignoring utilization.',
      examTip: 'Exam tip: from-to charts and CRAFT/SLP are Handbook ideas. Compute load×distance for a layout score.',
      firstMove: 'Layout, capacity, or shipping cost? Sketch the grid.',
      recipe: ['Rectilinear: |x2−x1|+|y2−y1|.', 'Load-distance = Σ flow × distance.', 'Machines needed = DT / (Aηu), round up.', 'Center of gravity uses weighted x̄, ȳ.'],
      writeOnExam: 'Show the distance metric and the capacity fraction. Box the integer machine count.',
      howToCheck: 'Machine count is an integer. Distance is nonnegative.',
      traps: [{ re: /straight line|forgot utilization/i, why: 'Plant aisles are usually rectilinear. Available hours must include utilization.' }],
    },
    human: {
      title: 'Human factors / safety coach',
      howToThink: 'Fit the workplace to the person (5th–95th percentile). Displays: analog for trend, digital for precise readout. OSHA/NIOSH are regulatory hooks.',
      commonMistake: 'Common mistake: designing for the average only, or confusing noise doubling (≈3 dB) with intensity doubling.',
      examTip: 'Exam tip: Handbook has NIOSH lifting and anthropometry notes. Name the hazard control hierarchy: eliminate, engineer, admin, PPE.',
      firstMove: 'Is this a display/control question, a lifting/ergonomics calc, or a regulation/hazard ID?',
      recipe: ['Match display type to the task.', 'Use percentiles, not the mean, for reach/clearance.', 'Hierarchy of controls.', 'Rest allowance and fatigue sit in work-design too.'],
      writeOnExam: 'State the principle (percentile, hierarchy, display type) and the number if there is one.',
      howToCheck: 'PPE is last, not first. Clearance uses large percentile; reach uses small.',
      traps: [{ re: /average person|PPE first/i, why: 'Do not design only for the mean. PPE is the last control, not the first.' }],
    },
    work: {
      title: 'Work design coach',
      howToThink: 'Observed time → normal time = OT × rating. Standard time = NT / (1 − allowance) if allowance is a fraction of shift, or NT×(1+allow) if added to work.',
      commonMistake: 'Common mistake: applying the allowance the wrong way (multiply vs divide).',
      examTip: 'Exam tip: Handbook shows both allowance conventions. Read the problem: “percent of work time” vs “percent of shift.”',
      firstMove: 'Write OT, rating, allowance. Confirm how allowance is defined.',
      recipe: ['NT = OT × (rating/100) if rating is percent of 100%.', 'If allowance is of clock time: ST = NT / (1−A).', 'Work sampling: p̂=x/n, interval uses √(p(1−p)/n).', 'Learning: T_n = T1 n^b, b=ln(rate)/ln 2.'],
      writeOnExam: 'Show NT then ST. For learning, show the exponent b.',
      howToCheck: 'ST > NT when allowances exist. 80% learning is faster improvement than 90%.',
      traps: [{ re: /ST < NT|wrong allowance/i, why: 'Standard time is longer than normal time once allowances are added.' }],
    },
    quality: {
      title: 'Quality / SPC coach',
      howToThink: 'x̄ chart: center line x̄, UCL = x̄ + A2 R̄. Range chart uses D3, D4. Cp = (USL−LSL)/(6σ). Cpk uses the nearer spec.',
      commonMistake: 'Common mistake: using 6σ with the wrong σ (s vs R̄/d2), or treating Cp as Cpk when the process is off-center.',
      examTip: 'Exam tip: Handbook has A2, D3, D4 factors. Capability ≥ 1.33 is a common bar; the exam will state what it wants.',
      firstMove: 'Control chart or capability? In-control comes before Cp.',
      recipe: ['Compute x̄ and R̄.', 'UCL/LCL from Handbook factors.', 'σ̂ ≈ R̄/d2 if needed.', 'Cp=(USL−LSL)/6σ. Cpk=min(USL−μ, μ−LSL)/(3σ).'],
      writeOnExam: 'Write CL, UCL, LCL or Cp/Cpk with the formula. Box the number.',
      howToCheck: 'UCL > CL > LCL. Cpk ≤ Cp always.',
      traps: [{ re: /Cpk > Cp|swapped USL LSL/i, why: 'Cpk cannot exceed Cp. USL must be the upper spec.' }],
    },
    systems: {
      title: 'Reliability coach',
      howToThink: 'Series: Rs = Π Ri. Parallel: Rp = 1 − Π(1−Ri). Exponential: R(t)=e^{−λt}, MTTF=1/λ. Availability = up / (up+down).',
      commonMistake: 'Common mistake: adding reliabilities, or using MTTF as MTTR.',
      examTip: 'Exam tip: Handbook has series/parallel and the exponential reliability function. Sketch the block diagram first.',
      firstMove: 'Sketch series vs parallel blocks. Write each Ri or λ.',
      recipe: ['Series: multiply R.', 'Parallel: 1 − product of unreliabilities.', 'R(t)=e^{−λt}. MTTF=1/λ for exponential.', 'A = MTTF / (MTTF+MTTR).'],
      writeOnExam: 'Show the block formula. Box R or availability (0 to 1).',
      howToCheck: 'System R is between 0 and 1. Parallel R ≥ any single component.',
      traps: [{ re: /add reliabilities|R > 1/i, why: 'Never add R’s. A reliability greater than 1 is impossible.' }],
    },
    'ie-stats': {
      title: 'IE statistics coach',
      howToThink: 'Hypothesis: H0 vs Ha, test statistic z or t, compare to critical value or p. Sample size for mean: n=(zσ/E)². DOE: factors and levels.',
      commonMistake: 'Common mistake: two-tail vs one-tail critical value, or using z when n is small and σ unknown (use t).',
      examTip: 'Exam tip: Handbook has z and t tables. State H0 before computing.',
      firstMove: 'Estimation, test, or experiment? Known σ or not?',
      recipe: ['Write H0/Ha.', 'SE = σ/√n or s/√n.', 'z=(x̄−μ0)/SE.', 'n=(zσ/E)² for a mean. Round up.'],
      writeOnExam: 'Show H0, the statistic, and reject/fail-to-reject. Box n if it is a sample-size problem.',
      howToCheck: 'n is an integer. p-value < α means reject H0.',
      traps: [{ re: /accept H0|z when t/i, why: 'We fail to reject H0, we do not “prove” it. Unknown σ and small n → t.' }],
    },
  },
  getCoach(topic) { return this.coaches[topic] || this.coaches.econ; },
  topicResources(topic) {
    const pack = typeof window.IE_RESOURCES_FOR === 'function' ? window.IE_RESOURCES_FOR(topic) : { primer: [], links: [] };
    return pack;
  },
  autopsyChoices(q) {
    const L = ['A', 'B', 'C', 'D'];
    const coach = this.getCoach((q.topics || [])[0]);
    const whyAll = (q.tutoring && q.tutoring.whyNotOthers) || '';
    return (q.choices || []).map((text, i) => {
      const letter = L[i];
      const ok = letter === q.answer;
      if (ok) return { letter, text, ok: true, why: q.explanation || 'Matches the method.' };
      const trap = (coach.traps || []).find((t) => t.re.test(String(text)));
      return { letter, text, ok: false, why: trap ? trap.why : whyAll || 'Wrong formula or units. See the method above.' };
    });
  },
  buildMcqTutor(q, userLetter, correct) {
    const coach = this.getCoach((q.topics || [])[0]);
    const ansIdx = String(q.answer || 'A').charCodeAt(0) - 65;
    return {
      headline: correct ? 'Correct — full solve path' : 'Not quite — full solve path',
      correctChoice: `${q.answer}. ${(q.choices || [])[ansIdx] || ''}`,
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      workSteps: (q.tutoring && q.tutoring.steps) || [],
      explanation: q.explanation,
      autopsy: this.autopsyChoices(q),
      trapNotes: (q.tutoring && q.tutoring.whyNotOthers) || '',
      writeOnExam: coach.writeOnExam,
      howToCheck: coach.howToCheck,
      handbook: q.handbook || 'FE Reference Handbook — Industrial / economy / quality sections',
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
      resources: this.topicResources((q.topics || [])[0]),
    };
  },
  buildWorkshopTutor(p) {
    const coach = this.getCoach((p.topics || [])[0]);
    return {
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      writeOnExam: p.examWriteup || coach.writeOnExam,
      howToCheck: p.check || coach.howToCheck,
      handbook: p.handbook || coach.examTip,
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
      resources: this.topicResources((p.topics || [])[0]),
    };
  },
};
