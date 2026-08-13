window.IE_HANDBOOK = {
  nceesDownload: 'https://account.ncees.org/reference-handbooks/',
  note: 'Search this sheet with Ctrl+F like the FE CBT handbook. Attach the official NCEES PDF (free MyNCEES download) for exam-identical pages. This text is an industrial-topic extract — not a reprint of the copyrighted Handbook.',
  sections: [
    { id: 'econ', title: 'Engineering economics', keywords: 'P/F F/P P/A A/P PW AW IRR depreciation MACRS',
      body: ['F = P(1+i)^n    P = F(1+i)^{-n}', '(P/A,i,n) = [(1+i)^n − 1] / [i(1+i)^n]', '(A/P,i,n) = i(1+i)^n / [(1+i)^n − 1]', 'PW of alternatives at the same i. Highest PW preferred (equal lives).', 'SL depreciation: (B − S) / N', 'B/C = PW(benefits) / PW(costs). Choose B/C > 1 when that is the criterion.'] },
    { id: 'mod', title: 'Modeling and queues', keywords: 'utilization Little LP slack Markov lambda mu',
      body: ['ρ = λ / μ    must be < 1 for a stable single server', 'Little’s law: L = λ W    Lq = λ Wq', 'W = Wq + 1/μ', 'M/M/1: Lq = ρ² / (1−ρ)    Wq = ρ / (μ−λ)', 'LP: optimal at a corner of the feasible region. Slack 0 ⇒ binding.'] },
    { id: 'mgmt', title: 'PERT / CPM / decisions', keywords: 'PERT te slack critical path EMV earned value',
      body: ['te = (a + 4m + b) / 6    σ = (b − a) / 6', 'Critical path = longest path. Slack = LS − ES = LF − EF', 'Project variance ≈ sum of variances on the critical path', 'EMV = Σ (payoff × probability)', 'EV = earned value; SV = EV − PV; CV = EV − AC'] },
    { id: 'prod', title: 'Inventory, forecast, lines', keywords: 'EOQ ROP moving average exponential smoothing cycle time',
      body: ['EOQ Q* = √(2DS / H)', 'Orders per year = D / Q    ROP ≈ d × L (+ safety stock)', 'Moving average: average of last n actuals', 'Exponential smoothing: F_t = F_{t−1} + α (A_{t−1} − F_{t−1})', 'Cycle time CT = available time / demand    Nmin = (Σ task times) / CT  (round stations up)'] },
    { id: 'fac', title: 'Facilities and supply chain', keywords: 'rectilinear load-distance capacity machines center of gravity',
      body: ['Rectilinear distance = |Δx| + |Δy|', 'Load-distance score = Σ (flow × distance)', 'Machines = (D × t) / (available × utilization × efficiency)  — round up', 'Center of gravity: weighted average of coordinates'] },
    { id: 'hf', title: 'Human factors and safety', keywords: 'percentile NIOSH OSHA hierarchy PPE display',
      body: ['Clearance: large percentile (95th). Reach: small percentile (5th).', 'Hierarchy: elimination → engineering → administrative → PPE (last).', 'Digital display for precise reading; analog for trend/rate.', 'Fit the job to the person, not the average person only.'] },
    { id: 'work', title: 'Work measurement and learning', keywords: 'normal time standard time allowance work sampling learning curve',
      body: ['Normal time NT = (observed time) × (rating)', 'If allowance A is a fraction of shift: ST = NT / (1 − A)', 'If allowance is added to work: ST = NT (1 + A)', 'Learning: T_n = T1 × n^b    b = ln(learning rate) / ln 2', '80% learning ⇒ b = ln(0.8)/ln 2 ≈ −0.322'] },
    { id: 'qual', title: 'Quality and SPC', keywords: 'x-bar R chart Cp Cpk A2 D3 D4 Six Sigma',
      body: ['x̄ chart: UCL = x̄ + A2 R̄    LCL = x̄ − A2 R̄', 'R chart: UCL = D4 R̄    LCL = D3 R̄', 'σ̂ ≈ R̄ / d2', 'Cp = (USL − LSL) / (6σ)    Cpk = min(USL−μ, μ−LSL) / (3σ)', 'Cpk ≤ Cp. Centered process ⇒ Cpk ≈ Cp.'] },
    { id: 'rel', title: 'Reliability and availability', keywords: 'series parallel MTTF MTTR exponential availability FMEA',
      body: ['Series: Rs = R1 R2 R3 …', 'Parallel: Rp = 1 − (1−R1)(1−R2)…', 'Exponential: R(t) = e^{−λt}    MTTF = 1/λ', 'Availability A = MTTF / (MTTF + MTTR)', 'FMEA: severity × occurrence × detection (RPN)'] },
    { id: 'stat', title: 'Applied IE statistics', keywords: 'hypothesis z t sample size ANOVA DOE',
      body: ['z = (x̄ − μ0) / (σ/√n)', 'Sample size for mean: n = (z σ / E)²   round up', 'Unknown σ, small n → t distribution', 'Fail to reject H0 if |stat| < critical (do not “accept H0”)', 'ANOVA compares means of 3+ groups. DOE: factors and levels.'] },
  ],
};
window.IE_HANDBOOK_TEXT = function () {
  return (window.IE_HANDBOOK.sections || []).map((s) => s.title + '\n' + s.body.join('\n')).join('\n\n');
};
window.FE_HANDBOOK = window.IE_HANDBOOK;
