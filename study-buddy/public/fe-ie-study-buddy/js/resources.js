/**
 * Free public-domain / open-licensed readings for FE Industrial non-math topics.
 * US government works are public domain. MIT OCW and OpenIntro are CC-licensed.
 * Not NCEES. Not a substitute for the FE Reference Handbook on exam day.
 */
window.IE_RESOURCES = {
  note: 'Read these free sources for the industrial topics that are not just plug-and-chug. US .gov pages are public domain. MIT OCW and OpenIntro are Creative Commons. These are study readings — the exam still uses the NCEES handbook.',
  byTopic: {
    econ: {
      primer: [
        'Draw the cash-flow diagram first. Every arrow is P, F, or A.',
        'i and n must use the same period (year vs month). Convert before any factor.',
        'PW or AW of alternatives at the same i. Highest PW wins for equal-life mutually exclusive options.',
        'B/C uses equivalent worth of benefits over costs — not “revenue minus cost” in mixed-year dollars.',
      ],
      links: [
        { title: 'MIT OCW 1.011 Project Evaluation', org: 'MIT OpenCourseWare', license: 'CC BY-NC-SA', url: 'https://ocw.mit.edu/courses/1-011-project-evaluation-spring-2011/', why: 'NPV, life-cycle cost, and B/C from a civil/industrial project-evaluation course.' },
        { title: 'NIST/SEMATECH e-Handbook — measurement economics context', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/', why: 'Free engineering-statistics handbook; use with economy when a study needs sample size or capability cost.' },
      ],
    },
    modeling: {
      primer: [
        'Name λ (arrival rate) and μ (service rate) with matching units.',
        'Single-server utilization ρ = λ/μ. If ρ ≥ 1 the queue is unstable — do not apply M/M/1 formulas.',
        'Little’s law L = λW always, if units match. M/M/1 Lq = ρ²/(1−ρ) is a special case.',
        'LP: the optimum of a linear program sits at a corner. Slack 0 means the constraint is binding.',
      ],
      links: [
        { title: 'MIT OCW 15.053 Optimization Methods in Management Science', org: 'MIT OpenCourseWare', license: 'CC BY-NC-SA', url: 'https://ocw.mit.edu/courses/15-053-optimization-methods-in-management-science-spring-2013/', why: 'Linear programming, formulation, and sensitivity — the modeling side of the afternoon exam.' },
        { title: 'NIST/SEMATECH — time series / smoothing', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc4.htm', why: 'Moving average and exponential smoothing used in both modeling and production forecasts.' },
      ],
    },
    management: {
      primer: [
        'PERT te = (a+4m+b)/6. Critical path is the longest path, not the shortest.',
        'Slack = LS − ES. Zero slack activities are critical.',
        'Earned value: SV = EV − PV (schedule), CV = EV − AC (cost). Negative is behind or over budget.',
        'Decision trees: EMV = Σ (payoff × probability). Include the lose branch.',
      ],
      links: [
        { title: 'NASA Systems Engineering Handbook (SP-6105)', org: 'NASA', license: 'Public domain (U.S. government)', url: 'https://www.nasa.gov/reference/systems-engineering-handbook/', why: 'Project life cycle, technical management, risk, and decision process — free government handbook.' },
        { title: 'NASA SEH 6.0 Crosscutting Technical Management', org: 'NASA', license: 'Public domain (U.S. government)', url: 'https://www.nasa.gov/reference/6-0-crosscutting-technical-management/', why: 'Planning, control, and technical decision-making used on earned-value / risk items.' },
      ],
    },
    production: {
      primer: [
        'EOQ Q* = √(2DS/H). D and H must share a time base (usually per year).',
        'ROP = demand during lead time (+ safety stock if they give it).',
        'Cycle time CT = available time / demand. Stations = ceil(Σ task times / CT). Always round stations up.',
        'Exponential smoothing: F_new = F + α(A − F). α near 1 chases the latest actual.',
      ],
      links: [
        { title: 'MIT OCW 2.854 Introduction to Manufacturing Systems', org: 'MIT OpenCourseWare', license: 'CC BY-NC-SA', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', why: 'Factory physics, flow, and production-system models.' },
        { title: 'NIST/SEMATECH — moving average and exponential smoothing', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc42.htm', why: 'The same forecast tools that show up on EOQ / production items.' },
      ],
    },
    facilities: {
      primer: [
        'Plant aisles are usually rectilinear: |Δx|+|Δy|, not the air-line √(Δx²+Δy²).',
        'Load-distance score = Σ (flow × distance). Lower is better for a layout.',
        'Machines = (demand × time per unit) / (available × utilization × efficiency). Round up.',
        'Center of gravity is a weighted average of coordinates, not the unweighted midpoint.',
      ],
      links: [
        { title: 'OSHA Walking-Working Surfaces (29 CFR 1910 Subpart D)', org: 'OSHA', license: 'Public domain (U.S. government)', url: 'https://www.osha.gov/walking-working-surfaces', why: 'Aisles, floors, and clearance — facilities questions sit next to these rules.' },
        { title: 'MIT OCW 2.854 Manufacturing Systems', org: 'MIT OpenCourseWare', license: 'CC BY-NC-SA', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', why: 'Capacity and flow used when you size machines and layouts.' },
      ],
    },
    human: {
      primer: [
        'Reach / access: design to a small percentile (typically 5th). Clearance / fit-through: large percentile (typically 95th).',
        'Hierarchy of controls (most to least effective): elimination → substitution → engineering → administrative → PPE.',
        'NIOSH lifting index LI = load / RWL. LI > 1 means increased risk — redesign before relying on training.',
        'Digital display for an exact number. Analog / trend display for rate or direction. E-stops are large and reachable with a palm.',
      ],
      links: [
        { title: 'NIOSH Hierarchy of Controls', org: 'NIOSH / CDC', license: 'Public domain (U.S. government)', url: 'https://www.cdc.gov/niosh/hierarchy-of-controls/about/', why: 'The five-level control hierarchy used on almost every HF/safety item.' },
        { title: 'OSHA Hazard Prevention and Control', org: 'OSHA', license: 'Public domain (U.S. government)', url: 'https://www.osha.gov/safety-management/hazard-prevention', why: 'How OSHA expects hazards to be controlled in a safety-management program.' },
        { title: 'OSHA Ergonomics', org: 'OSHA', license: 'Public domain (U.S. government)', url: 'https://www.osha.gov/ergonomics', why: 'Work-related MSDs, job design, and lifting risk — pairs with NIOSH LI items.' },
        { title: 'Revised NIOSH Lifting Equation (RNLE)', org: 'NIOSH / CDC', license: 'Public domain (U.S. government)', url: 'https://www.cdc.gov/niosh/ergonomics/about/RNLE.html', why: 'RWL and lifting index LI = load/RWL — the official NIOSH lifting page.' },
        { title: 'NIOSH Ergonomics and Musculoskeletal Disorders', org: 'NIOSH / CDC', license: 'Public domain (U.S. government)', url: 'https://www.cdc.gov/niosh/ergonomics/index.html', why: 'Workplace design research that sits behind HF and work-design items.' },
      ],
    },
    work: {
      primer: [
        'Normal time NT = observed time × rating. Rating 1.10 means 10% faster than the 100% pace.',
        'If allowance A is a fraction of the shift: ST = NT / (1 − A). If A is added to the work: ST = NT(1 + A). Read the stem.',
        'Learning: T_n = T1 × n^b with b = ln(learning rate) / ln 2. 80% learning ⇒ each doubling of units takes 80% as long.',
        'Work sampling: p̂ = count / n. Sample size n = z² p(1−p) / E², then round up.',
      ],
      links: [
        { title: 'OSHA Ergonomics — work practices', org: 'OSHA', license: 'Public domain (U.S. government)', url: 'https://www.osha.gov/ergonomics', why: 'Job design and work methods sit next to time study and allowances.' },
        { title: 'NIOSH Ergonomics', org: 'NIOSH / CDC', license: 'Public domain (U.S. government)', url: 'https://www.cdc.gov/niosh/ergonomics/index.html', why: 'How long, how often, and in what posture people can work — the “why” behind standard time.' },
      ],
    },
    quality: {
      primer: [
        'Cp = (USL − LSL) / (6σ) ignores centering. Cpk uses the nearer spec and is ≤ Cp.',
        'x̄ chart: UCL = x̄ + A2 R̄. R chart: UCL = D4 R̄. A2, D3, D4, d2 come from the subgroup-size table.',
        'σ̂ ≈ R̄ / d2. Do not invent R̄/6 unless the problem says so.',
        'A point outside the control limits (or a run rule) is a signal. Capability is a separate question from “in control.”',
      ],
      links: [
        { title: 'NIST/SEMATECH Ch. 6 — Process or Product Monitoring and Control', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/pmc/pmc.htm', why: 'The open SPC / acceptance-sampling chapter: control charts, capability, sampling plans.' },
        { title: 'NIST — What is process capability?', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm', why: 'Cp / Cpk language matching FE-style capability items.' },
        { title: 'NIST — Variables control charts', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm', why: 'x̄ and R charts, including why we use A2 and D4.' },
      ],
    },
    systems: {
      primer: [
        'Series: multiply reliabilities. Parallel: 1 − Π(1 − Ri). Never add R’s (that can exceed 1).',
        'Constant failure rate: R(t) = e^{−λt}. MTTF = 1/λ.',
        'Availability A = MTTF / (MTTF + MTTR). That is the uptime fraction.',
        'FMEA RPN = severity × occurrence × detection. Higher RPN is higher priority, not a probability.',
      ],
      links: [
        { title: 'NIST/SEMATECH Ch. 8 — Assessing Product Reliability', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/apr/apr.htm', why: 'Exponential reliability, MTTF, and system models — the open reliability chapter.' },
        { title: 'NASA Systems Engineering Handbook', org: 'NASA', license: 'Public domain (U.S. government)', url: 'https://www.nasa.gov/reference/systems-engineering-handbook/', why: 'FMEA, risk, and verification language used on systems items.' },
      ],
    },
    'ie-stats': {
      primer: [
        'z = (x − μ) / σ. SE of the mean is σ/√n, not σ and not σ/n.',
        'Sample size for a mean: n = (zσ/E)², then always round up.',
        'Unknown σ and small n → t with df = n − 1. We fail to reject H0; we do not “prove” H0.',
        'ANOVA compares means of 3+ groups. A 2³ factorial is 8 runs in one replicate.',
      ],
      links: [
        { title: 'NIST/SEMATECH e-Handbook of Statistical Methods', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/', why: 'The full free engineering-stats book: estimation, tests, ANOVA, DOE.' },
        { title: 'NIST Ch. 7 — Product and Process Comparisons', org: 'NIST', license: 'Public domain (U.S. government)', url: 'https://www.itl.nist.gov/div898/handbook/prc/prc.htm', why: 'Hypothesis tests and comparisons used on IE statistics items.' },
        { title: 'OpenIntro Statistics', org: 'OpenIntro', license: 'CC BY-SA', url: 'https://www.openintro.org/book/os/', why: 'Free textbook for z, t, CI, and regression if you need a slower walkthrough.' },
      ],
    },
  },
};

window.IE_RESOURCES_FOR = function (topicId) {
  return (window.IE_RESOURCES && window.IE_RESOURCES.byTopic && window.IE_RESOURCES.byTopic[topicId]) || { primer: [], links: [] };
};
