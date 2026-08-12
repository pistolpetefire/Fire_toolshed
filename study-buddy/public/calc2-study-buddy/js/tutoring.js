/**
 * Calculus II tutoring layer
 *
 * Three instruction upgrades (v1.2):
 *  1. Full solve recipe on every item (how to start any problem of this type).
 *  2. Choice-by-choice autopsy (why A/B/C/D each work or fail).
 *  3. Exam write-up + check block (what to put on paper, how to verify).
 */
window.CALC2_TUTORING = {
  coaches: {
    ibp: {
      title: 'Integration by parts coach',
      howToThink:
        'You are undoing a product rule. Pick u so du is simpler (LIATE). Everything else is dv — you must be able to integrate dv. Write the box: u, dv, du, v. Then uv − ∫ v du.',
      commonMistake:
        'Common mistake: swapping u and dv (so you differentiate the exponential and integrate the log), or dropping the minus when you move I back to the left on circular IBP.',
      examTip:
        'Exam tip: ∫ ln x, ∫ arctan x, and ∫ x^n e^{ax} / sin / cos are the usual IBP prompts. For polynomials, tabular is faster and graders still accept it if the table is clear.',
      firstMove:
        'Ask: is this a product I cannot u-sub? If yes, write the four-line IBP box before integrating anything.',
      recipe: [
        'Name the product: one factor should get simpler when differentiated (LIATE: Log, Inverse trig, Algebraic, Trig, Exponential).',
        'Set u = that factor and dv = everything else · dx. You must be able to integrate dv in one step.',
        'Fill the box: u, dv, du, v. Do not skip v (include constants like 1/2 from ∫ e^{2x}).',
        'Write uv − ∫ v du. Integrate the leftover (plain, u-sub, another IBP, or tabular).',
        'Circular case (e^{ax} sin bx or cos bx): IBP twice, move I to the left, divide.',
        'Add +C on indefinite integrals. Differentiate the finished answer — you must recover the original integrand.',
      ],
      writeOnExam:
        'Draw the u / dv / du / v box. Write uv − ∫ v du with the leftover integral. Box the final antiderivative and +C.',
      howToCheck:
        'Differentiate your answer (product rule). Every term must cancel down to the original integrand.',
      traps: [
        { re: /chain|u-sub|substitution/i, why: 'u-sub needs an inside function whose derivative is sitting outside. A bare product is IBP, not chain/u-sub.' },
        { re: /quotient/i, why: 'Quotient rule is a derivative rule. IBP is the reverse of the product rule, not the quotient rule.' },
        { re: /power rule/i, why: 'Power rule handles x^n alone. A product with ln, arctan, e^{ax}, or sin needs IBP.' },
        { re: /does not exist|cannot/i, why: 'These IBP integrals are elementary. If you picked the wrong u they only look impossible.' },
      ],
    },
    'trig-int': {
      title: 'Trig integrals coach',
      howToThink:
        'Look at the powers. Odd sin? Save one sin, convert the rest with sin² = 1 − cos², u = cos. Odd cos? Symmetric. Both even? Power-reduce. tan/sec: aim for u = tan or u = sec so du appears.',
      commonMistake:
        'Common mistake: power-reducing when a simple u-sub works, or forgetting the 2 in sin 2θ identities when you expand sin² / cos².',
      examTip:
        'Exam tip: write the identity you are using before integrating. ∫ sec³ x is the famous IBP+identity combo — know it if your instructor listed it.',
      firstMove:
        'Count the powers of sin and cos (or tan and sec). Odd leftover → save-one + u-sub. Both even → power-reduce. tan/sec → build du = sec² or sec tan.',
      recipe: [
        'Write the integrand as powers of sin/cos or tan/sec. Do not mix strategies in the first line.',
        'Odd sine: factor one sin x, convert leftover sin² → 1−cos², u = cos x (du = −sin x dx). Watch the minus.',
        'Odd cosine: symmetric, u = sin x.',
        'Both even: sin² = (1−cos 2x)/2 and cos² = (1+cos 2x)/2. Reduce until you can integrate.',
        'tan/sec: peel the derivative of tan (sec²) or of sec (sec tan), convert the leftover with 1+tan²=sec².',
        'Integrate the resulting polynomial in u (or the reduced double-angle). Convert back. +C.',
      ],
      writeOnExam:
        'First sentence: “odd sine, so save one sin, u = cos.” Write the identity, the substitution, the u-integral, then back-sub +C.',
      howToCheck:
        'Differentiate. Or plug a number (e.g. x=0.3) into original vs derivative of your answer on a calculator if allowed for a check — the exam itself wants the algebra.',
      traps: [
        { re: /IBP|parts/i, why: 'Save-one + u-sub is faster than IBP when a power is odd. IBP is the tool for sec³ or products with x.' },
        { re: /power-reduce both|both even/i, why: 'Power-reduce only when there is no odd leftover. An odd factor is a gift — use it.' },
        { re: /trig sub/i, why: 'Trig sub is for algebraic radicals √(a²±x²), not for powers of sin and cos.' },
      ],
    },
    'trig-sub': {
      title: 'Trig sub coach',
      howToThink:
        'Match the radical to a triangle: a²−x² (sin), a²+x² (tan), x²−a² (sec). Substitute x and dx, simplify the radical to a trig function, integrate, then convert θ back with the triangle.',
      commonMistake:
        'Common mistake: substituting x but forgetting to replace dx, or leaving the answer in θ when the problem was in x.',
      examTip:
        'Exam tip: draw the triangle every time (label opposite/adjacent/hypotenuse from x/a). That drawing is how you get sin θ = x/a etc. after integrating.',
      firstMove:
        'Name the radical: a²−x², a²+x², or x²−a². That pick locks the substitution. Write x = … and dx = … on the same line.',
      recipe: [
        'Identify a and the pattern. √(a²−x²) → x=a sin θ; √(a²+x²) → x=a tan θ; √(x²−a²) → x=a sec θ.',
        'Replace both x and dx. Forgetting dx is the usual crash.',
        'Simplify the radical to a single trig function (use 1−sin²=cos², 1+tan²=sec², sec²−1=tan²). Track the domain so the root is positive.',
        'Integrate in θ (may need a trig-integral or sec³ step).',
        'Definite integral: change the limits to θ and stop. Indefinite: draw the triangle and convert every leftover sin/tan/sec back to x.',
        'If you recognize an inverse-trig template (arcsin, arctan), you may use it — but still be able to derive it with the sub.',
      ],
      writeOnExam:
        'Line 1: “√(a²−x²) so x = a sin θ, dx = a cos θ dθ.” Sketch the triangle. Show the simplified integrand, then the back-substitution.',
      howToCheck:
        'Differentiate the x-answer, or plug a convenient x (inside the domain) into both the original integrand numerically and your F′(x).',
      traps: [
        { re: /tan θ/i, why: 'tan is the a²+x² family. a²−x² is sine; x²−a² is secant.' },
        { re: /sin θ/i, why: 'sine is only for a²−x². Plus signs or x²−a² need tan or sec.' },
        { re: /leave|θ only|in θ/i, why: 'An indefinite problem in x is unfinished if the answer is still in θ.' },
      ],
    },
    partial: {
      title: 'Partial fractions coach',
      howToThink:
        'Factor the denominator completely. If the fraction is improper, long-divide first. Write the template (A/linear, repeats, (Bx+C)/quadratic). Clear the denominator and solve by plugging roots or equating coefficients.',
      commonMistake:
        'Common mistake: skipping the long division when degrees are equal, or writing only A/(x²+1) instead of (Bx+C)/(x²+1).',
      examTip:
        'Exam tip: cover-up (Heaviside) is legal and fast for distinct linear factors. Show the cleared-denominator equation so the grader sees the setup.',
      firstMove:
        'Compare degrees. If deg(num) ≥ deg(den), divide first. Then factor the remaining denominator completely over the reals.',
      recipe: [
        'Reduce: cancel common factors; long-divide if improper.',
        'Factor: distinct linear (x−r), repeated (x−r)^k, irreducible quadratic x²+px+q.',
        'Write the template: A/(x−r); for repeats every power 1…k; for quadratics (Bx+C)/(quad).',
        'Clear the denominator. Solve by cover-up at each root and/or matching coefficients.',
        'Integrate termwise: A/(x−r) → A ln|x−r|; 1/(x−r)² → −1/(x−r); (Bx+C)/(x²+a²) splits into ln + arctan.',
        'Add +C. Differentiate or recombine the PF to check coefficients.',
      ],
      writeOnExam:
        'Show the template and the cleared equation. Box each coefficient, then the term-by-term integral with ln / arctan / power, and +C.',
      howToCheck:
        'Add the decomposed pieces back over a common denominator. You must recover the (proper) numerator you started with.',
      traps: [
        { re: /arctan/i, why: 'Arctan is for an irreducible quadratic (complete-the-square). Factored linears integrate to logs.' },
        { re: /IBP|parts/i, why: 'A rational function is partial fractions (after division), not IBP.' },
        { re: /only A\/\(x/i, why: 'Repeated factors need every lower power. Quadratics need a linear numerator Bx+C.' },
      ],
    },
    improper: {
      title: 'Improper integrals coach',
      howToThink:
        'An integral is improper if a limit of integration is infinite or the integrand blows up on the interval. Replace the bad spot with a variable, integrate, then take the limit. Finite limit = converges.',
      commonMistake:
        'Common mistake: plugging ∞ in like a number, or using the [1,∞) p-test cutoff on (0,1] (those cutoffs are opposite).',
      examTip:
        'Exam tip: write lim (b→∞) explicitly. Comparison: if 0 ≤ f ≤ g and ∫ g converges, so does ∫ f; if f ≥ g ≥ 0 and ∫ g diverges, so does ∫ f.',
      firstMove:
        'Circle the bad place: ∞, −∞, or a vertical asymptote inside [a,b]. Rewrite as an explicit limit before integrating.',
      recipe: [
        'Classify: infinite interval, interior blow-up, or both (split into two limits).',
        'Replace the bad end by t and write lim (t→…) ∫ of a proper integral.',
        'Find the antiderivative (or name a comparison / p-test if you cannot).',
        'p-test: on [1,∞) converge ⇔ p>1; on (0,1] converge ⇔ p<1. Harmonic p=1 diverges at both ends.',
        'Comparison / limit-comparison if the antiderivative is ugly. State the partner g and the inequality or limit.',
        'Conclude “converges to L” (give L if you have it) or “diverges.” A missing limit sentence is an incomplete solution.',
      ],
      writeOnExam:
        '“Improper at ___, so = lim (t→___) ∫ …” Evaluate the proper integral, then the limit. Last sentence: converges to ___ / diverges.',
      howToCheck:
        'Confirm you split at every singularity. A finite-looking F(b)−F(a) that walked through a blow-up is illegal.',
      traps: [
        { re: /p > 1.*\(0,\s*1\]|p < 1.*\[1/i, why: 'The two p-test cutoffs are opposite. Do not reuse the infinity-end rule on (0,1].' },
        { re: /not improper|just plug/i, why: 'A finite interval is still improper if f blows up inside it. You must split and take limits.' },
        { re: /no antiderivative|cannot find/i, why: 'No elementary antiderivative is not divergence. Use comparison (e.g. Gaussian).' },
      ],
    },
    'apps-int': {
      title: 'Applications coach',
      howToThink:
        'Arc length and surface are “pythagorean on a tiny piece of curve.” Write ds = √(1+(y′)²) dx. Surface multiplies by 2π·radius. Work/pumping: slice, write distance each slice travels, integrate force×distance.',
      commonMistake:
        'Common mistake: forgetting to square y′ under the root, or using the radius as x when you revolved around the y-axis (radius is the distance to the axis).',
      examTip:
        'Exam tip: many OSU exams ask for a correct integral setup even if they do not force you to evaluate a nasty radical. Box the integrand and the limits.',
      firstMove:
        'Sketch. Label the axis of rotation or the lift direction. Write ds or the slice first, then multiply by radius or distance.',
      recipe: [
        'Differentiate y (or x=g(y)) and form 1+(y′)². Simplify under the root if it is a perfect square or linear.',
        'Arc length: ∫_a^b √(1+(y′)²) dx (or dy version).',
        'Surface: 2π ∫ (radius) ds. Radius = distance to the axis (y about x-axis; x about y-axis).',
        'Spring work: convert units, find k from F=kx, then W=∫_a^b kx dx.',
        'Pumping: slice volume A(y)Δy, times density, times the distance that slice travels. Integrate over the liquid.',
        'If the problem says “set up,” box the simplified integrand and limits. Evaluate only if asked.',
      ],
      writeOnExam:
        'Picture + “radius = …” or “ds = …” + the definite integral with simplified integrand. Box the setup even if you do not finish the antiderivative.',
      howToCheck:
        'Units and geometry: radius must be the distance to the stated axis; limits must match the interval of the curve or the liquid.',
      traps: [
        { re: /π \[f\]²|volume|disk/i, why: 'π R² is volume (disk). Surface area is 2π r ds. Length has no 2π.' },
        { re: /∫ f\(x\) dx/i, why: 'Bare ∫ f is area under the curve, not arc length or surface.' },
        { re: /force times 8|no integral/i, why: 'Variable force or variable travel distance must be an integral, not one multiplication.' },
      ],
    },
    sequences: {
      title: 'Sequences coach',
      howToThink:
        'A sequence is a list a_1, a_2, …  Ask only: does a_n approach a finite number? Algebra like limits in Calc I (divide by n^k, L’Hôpital if allowed, squeeze). Alternating lists like (−1)^n do not converge.',
      commonMistake:
        'Common mistake: saying a sequence converges because it is bounded, without monotonicity — or confusing “a_n → 0” with “the series Σ a_n converges.”',
      examTip:
        'Exam tip: monotone + bounded ⇒ converges (you may not know the limit). Growth: ln n ≪ n^p ≪ c^n ≪ n! ≪ n^n (c>1).',
      firstMove:
        'This is a sequence, not a series. You only need lim a_n. Divide by the highest power, or name a growth race, or squeeze.',
      recipe: [
        'Write lim (n→∞) a_n. Treat n like a real variable if you need L’Hôpital or a standard limit.',
        'Rational: divide top and bottom by n^{deg den}. Equal degree → ratio of lead coefficients.',
        'Oscillation: (−1)^n or cos(nπ) diverges unless the amplitude → 0.',
        'Monotone + bounded ⇒ converges (MCT). Bounded alone is not enough.',
        'If the question is really about Σ a_n, stop and switch to series tools. a_n → L ≠ 0 already kills a series.',
        'State the limit or “diverges.” Do not leave “looks like 1” without the number.',
      ],
      writeOnExam:
        '“Consider lim a_n = …” Show the algebra (divide by n^k / conjugate / squeeze). Conclude converges to L or diverges.',
      howToCheck:
        'Plug a huge n (n=1000) mentally: does a_n sit near your L? If it still flips sign with size 1, it diverges.',
      traps: [
        { re: /series|Σ/i, why: 'A sequence limit is not a series sum. a_n → 0 is necessary for a series, not the same as the sequence question.' },
        { re: /bounded so converge/i, why: 'Bounded + monotone converges. Bounded alone ((−1)^n) can diverge.' },
        { re: /∞|diverges because n²/i, why: 'Equal-degree rationals go to the lead-coefficient ratio, not ∞.' },
      ],
    },
    'series-basic': {
      title: 'Series basics coach',
      howToThink:
        'A series is an infinite sum. Look at the partial sums s_n. Geometric: factor out a and read r. Telescoping: write partial sums and cancel. Always check a_n → 0 first — if not, it diverges and you are done.',
      commonMistake:
        'Common mistake: using |r| ≤ 1 for geometric (r = ±1 diverges), or concluding convergence just because a_n → 0 (harmonic counterexample).',
      examTip:
        'Exam tip: state the sum formula only after you have |r| < 1. Harmonic Σ 1/n diverges; p-series needs p > 1.',
      firstMove:
        'Look at a_n. If a_n ↛ 0, diverge and stop. If it is a r^n, name a and r. If it is a difference of terms, telescope.',
      recipe: [
        'Write a_n and compute lim a_n. Nonzero or DNE ⇒ diverges (n-th term test).',
        'Geometric: factor to a r^{n} or a r^{n−1}. Converges iff |r|<1, sum a/(1−r) (mind the starting index).',
        'p-series Σ 1/n^p : converge ⇔ p>1. Harmonic p=1 diverges.',
        'Telescoping: PF if needed, write s_N, cancel, take N→∞.',
        'Positive terms + s_n bounded ⇒ converges (used later by comparison).',
        'A complete answer names the type, shows |r| or p or s_N, and states the sum or “diverges.”',
      ],
      writeOnExam:
        '“Geometric with a=__, r=__. |r|<1 so sum = a/(1−r) = __.” Or “a_n → __ ≠ 0, diverges by n-th term.” Or show s_N and lim s_N.',
      howToCheck:
        'For a geometric sum, add the first four terms on a calculator and see if you are approaching your closed form. For divergence, confirm a_n is not going to 0.',
      traps: [
        { re: /terms → 0|goes to 0 so converge/i, why: 'a_n → 0 is necessary, not sufficient. Harmonic is the counterexample.' },
        { re: /\|r\| ≤ 1|r = 1 converge/i, why: 'Geometric needs |r|<1 strictly. r=±1 diverges.' },
        { re: /p ≥ 1/i, why: 'p-series cutoff is p>1, not p≥1. p=1 is harmonic.' },
      ],
    },
    'series-tests': {
      title: 'Convergence tests coach',
      howToThink:
        'Name a test, check its hypotheses, compute the limit/integral, conclude. Factorials or a^n → ratio. Positive decreasing like 1/(n ln n) → integral. Looks like a p-series → limit comparison. Alternating with decreasing to 0 → AST.',
      commonMistake:
        'Common mistake: applying AST without showing a_n is eventually decreasing, or treating a ratio limit of 1 as conclusive.',
      examTip:
        'Exam tip: graders want the sentence “by the ___ test, the series converges/diverges because ….” Write the limit. Absolute vs conditional is a common last part.',
      firstMove:
        'Signs? Alternating → plan AST + a separate absolute check. Factorials / c^n → ratio. Looks like 1/n^p → limit comparison. ln in the denominator → integral.',
      recipe: [
        'Check a_n → 0. If not, diverge. Done.',
        'Classify: positive vs alternating; factorial/exponential vs rational vs log.',
        'Pick one test and write its hypotheses (positive/decreasing for integral and AST; 0<L<∞ for limit comparison).',
        'Compute the limit, integral, or ratio L. Show the algebra.',
        'Conclude: converges / diverges / L=1 inconclusive (then switch tests).',
        'If alternating: also test Σ |a_n|. Absolute / conditional / divergent are three different sentences.',
      ],
      writeOnExam:
        '“Use the ___ test. Hypotheses: __. Compute __ = __. Therefore the series converges/diverges.” If asked to classify: “conditionally convergent because AST applies and Σ |a_n| is a divergent p-series.”',
      howToCheck:
        'Could another cheap test give the same yes/no? If ratio gave L=1 you are not done. If you used AST, confirm b_n is decreasing, not just →0.',
      traps: [
        { re: /L = 1 so diverge|L = 1 so converge/i, why: 'Ratio/root L=1 is inconclusive. Switch tests. p-series all give L=1 and they disagree.' },
        { re: /AST.*absolute|absolutely.*AST/i, why: 'AST never proves absolute convergence. You must test Σ |a_n| separately.' },
        { re: /smaller than a divergent/i, why: 'Direct comparison: smaller than a divergent series proves nothing.' },
      ],
    },
    power: {
      title: 'Power series coach',
      howToThink:
        'Use ratio (or root) on |a_{n+1}/a_n| to get |x−a| < R. The open interval always works. Each endpoint is a brand-new numeric series — test it with Exam 2 tools. Do not assume endpoints match.',
      commonMistake:
        'Common mistake: forgetting endpoint checks, or using the radius formula but writing a closed interval automatically.',
      examTip:
        'Exam tip: start from 1/(1−x) = Σ x^n. To get 1/(1+4x²), substitute −4x², then maybe differentiate. Track the new radius after every substitution.',
      firstMove:
        'Center a from (x−a)^n. Ratio on consecutive terms for |x−a|<R. Then, separately, plug each endpoint into the series and name an Exam 2 test.',
      recipe: [
        'Write the general term. Identify the center a.',
        'Ratio (or root): L = lim |c_{n+1}/c_n| · |x−a|. Need L<1 ⇒ |x−a|<R.',
        'Open interval (a−R, a+R) always converges. Outside, diverges.',
        'Left endpoint: substitute x=a−R, get a numeric series, test it (harmonic, AST, p-series, …).',
        'Right endpoint: same, independently. Do not copy the left conclusion.',
        'State R and the interval with the correct brackets. If you differentiated/integrated, recheck ends (R stays the same).',
      ],
      writeOnExam:
        'Show the ratio limit and “|x−a|<R.” Then two mini-writeups: “At x=__: the series is __, which ___ by ___.” Final: interval = ___.',
      howToCheck:
        'Pick a test point inside, on an end, and outside. Inside must converge; outside must diverge; ends match your tests.',
      traps: [
        { re: /automatically closed|\[a−R, a\+R\] always/i, why: 'Never close the interval until both endpoints are tested.' },
        { re: /R = ∞|all x/i, why: 'R=∞ only when the ratio → 0 for every x (n! in the denominator). n! in the numerator is R=0.' },
        { re: /center 0|Maclaurin only/i, why: 'Read (x−a). (x+3)^n is centered at −3, not 0.' },
      ],
    },
    taylor: {
      title: 'Taylor coach',
      howToThink:
        'Prefer known series over computing many derivatives. Substitute, multiply, differentiate, or integrate a memorized series. The degree-n Taylor polynomial is the partial sum through (x−a)^n.',
      commonMistake:
        'Common mistake: writing sin x with even powers, or forgetting n! in the denominator of e^x / sin / cos.',
      examTip:
        'Exam tip: the six Maclaurin series are free points if you can write them with the correct interval. Remainder problems: Lagrange form |R_n| ≤ M|x−a|^{n+1}/(n+1)!.',
      firstMove:
        'Can this come from e^x, sin, cos, 1/(1−x), ln(1+x), or arctan by substituting? If yes, do not start taking derivatives.',
      recipe: [
        'List the known series you will use, with its interval.',
        'Substitute (x → −x², x → x−1, …), or multiply by a polynomial, or differentiate/integrate term by term.',
        'If you must build from derivatives: a_n = f^{(n)}(a)/n!. Include n! every time.',
        'Write enough terms for the requested degree. For a full series, include the general n-term and the interval.',
        'Remainder / “how many terms”: |R_n| ≤ M|x−a|^{n+1}/(n+1)! (or next alternating term). Solve for n.',
        'State the interval of validity after every substitution (it can shrink).',
      ],
      writeOnExam:
        '“Start from e^x = Σ x^n/n! (all x). Replace x by ___. First terms: ___ . Interval: ___.” For T_n, show the derivative table and /n!.',
      howToCheck:
        'Plug x=0 (or x=a): you must recover f(a). Parity: odd f should have only odd powers. Differentiate your series and compare to f′’s series.',
      traps: [
        { re: /even powers.*sin|odd.*cos/i, why: 'sin is odd (odd powers). cos is even (even powers, starts at 1).' },
        { re: /n! in the numerator/i, why: 'e^x, sin, and cos have n! in the denominator, never the numerator.' },
        { re: /all x.*ln|all x.*1\/\(1−x\)/i, why: 'Geometric and ln(1+x) are not entire. Track |x|<1 and the endpoints.' },
      ],
    },
    parametric: {
      title: 'Parametric coach',
      howToThink:
        'Think of t as time. Slope is rise/run = (dy/dt)/(dx/dt). Horizontal tangent when dy/dt = 0 and dx/dt ≠ 0; vertical when dx/dt = 0 and dy/dt ≠ 0. Second derivative needs d/dt of the first derivative, divided by dx/dt again.',
      commonMistake:
        'Common mistake: computing (d²y/dt²)/(d²x/dt²) and calling it d²y/dx² — that is wrong.',
      examTip:
        'Exam tip: simplify dy/dx before differentiating again. Arc length is the speed integral √(x′²+y′²).',
      firstMove:
        'Compute x′(t) and y′(t) first. Slope is y′/x′ wherever x′≠0. Do not form y″/x″.',
      recipe: [
        'Differentiate x(t) and y(t) with respect to t.',
        'dy/dx = y′(t)/x′(t), x′≠0. Simplify.',
        'Horizontal: y′=0 and x′≠0. Vertical: x′=0 and y′≠0. If both 0, take a limit or name a cusp/rest point.',
        'Report the point (x(t),y(t)), not just t.',
        'd²y/dx² = [d/dt (dy/dx)] / x′(t). Differentiate the simplified slope, then divide by x′ again.',
        'Arc length / distance traveled: ∫_α^β √(x′²+y′²) dt over one trace (do not double-count).',
      ],
      writeOnExam:
        'Show x′ and y′. “dy/dx = … . Horizontal when …, point ( , ).” For d²y/dx² show the extra /x′. For length, write the speed integrand and limits.',
      howToCheck:
        'If you can eliminate t (y in terms of x), compare dy/dx and y″ to the parametric formulas. They must match.',
      traps: [
        { re: /y″\/x″|d²y\/dt² over d²x/i, why: 'd²y/dx² is not y″(t)/x″(t). Divide d/dt(dy/dx) by x′ again.' },
        { re: /both zero.*horizontal|both zero.*vertical/i, why: 'x′=y′=0 is not automatically horizontal or vertical. Analyze the limit or the picture.' },
        { re: /displacement|straight/i, why: 'Path length is the speed integral, not the straight-line distance from start to end.' },
      ],
    },
    polar: {
      title: 'Polar coach',
      howToThink:
        'r is distance from the origin, θ is the angle. Convert with x = r cos θ, y = r sin θ. Sketch by testing θ = 0, π/2, π and where r = 0 (passes through the pole). Area is (1/2)∫ r² — like pizza slices.',
      commonMistake:
        'Common mistake: integrating r instead of r² for area, or using 0 to 2π on a rose that already traced all petals earlier.',
      examTip:
        'Exam tip: find petal / loop limits by solving r = 0. Cardioid a(1−cos θ) is 0 to 2π once. Rose r = a cos(2θ) has 4 petals; r = a cos(3θ) has 3.',
      firstMove:
        'What is asked — convert, sketch, slope, area, or length? For area or a petal, solve r=0 first to get θ-limits. Area integrand is (1/2)r², never r.',
      recipe: [
        'Convert if needed: x=r cos θ, y=r sin θ, r²=x²+y².',
        'Sketch: test θ=0, π/2, π, 3π/2 and the zeros of r. Name the type (circle, cardioid, limaçon, rose, spiral).',
        'Petals: r=a cos(nθ) or sin(nθ) has n petals if n odd, 2n if n even. Odd roses finish in [0,π].',
        'Area: A = (1/2) ∫_α^β [r(θ)]² dθ. Limits from adjacent r=0 (one petal) or 0 to 2π (cardioid once).',
        'Length: ∫ √(r² + (dr/dθ)²) dθ. Slope: (r′ sin θ + r cos θ)/(r′ cos θ − r sin θ).',
        'Intersections: solve r1=r2 and the (−r, θ+π) pairing; check the pole separately.',
      ],
      writeOnExam:
        'Name the curve. “r=0 when θ=__, so one petal is __ to __.” Write (1/2)∫ r² with those limits, expand r², integrate, box the number.',
      howToCheck:
        'Full-cardioid area of r=a(1−cos θ) is (3/2)π a². Odd-rose 0-to-2π is double-counting. A negative area means you dropped 1/2 or used r instead of r².',
      traps: [
        { re: /∫ r dθ|without square|not squared/i, why: 'Polar area is (1/2)∫ r² dθ, not ∫ r dθ.' },
        { re: /0 to 2π.*odd|3θ.*2π/i, why: 'An odd rose is fully traced on [0,π]. 0 to 2π double-counts every petal.' },
        { re: /2 petals|n even.*n petals/i, why: 'Even n gives 2n petals (cos 2θ has 4). Odd n gives n petals.' },
      ],
    },
  },

  getCoach(topic) {
    return this.coaches[topic] || this.coaches['series-tests'];
  },

  /**
   * Label every choice: correct with the real reason, traps with a specific why.
   */
  autopsyChoices(q) {
    const letters = ['A', 'B', 'C', 'D'];
    const topic = (q.topics && q.topics[0]) || 'series-tests';
    const coach = this.getCoach(topic);
    const whyAll = (q.tutoring && q.tutoring.whyNotOthers) || '';
    const sentences = whyAll
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return (q.choices || []).map((text, i) => {
      const letter = letters[i];
      const ok = letter === q.answer;
      if (ok) {
        return { letter, text, ok: true, why: q.explanation || 'This is the option that matches the method above.' };
      }
      const tokens = String(text)
        .split(/[\s,;:()]+/)
        .filter((w) => w.length > 4)
        .slice(0, 6);
      const hit =
        sentences.find((s) => tokens.some((w) => s.toLowerCase().includes(w.toLowerCase()))) ||
        sentences.find((s) => new RegExp(`(?:^|\\b)${letter}(?:\\b|[.:,])`).test(s));
      const trap = (coach.traps || []).find((t) => t.re.test(String(text)));
      const why =
        (hit && hit) ||
        (trap && trap.why) ||
        (whyAll
          ? whyAll
          : 'This option uses the wrong tool or skips a required step. Work the method above and you will not land here.');
      return { letter, text, ok: false, why };
    });
  },

  buildMcqTutor(q, userLetter, correct) {
    const topic = (q.topics && q.topics[0]) || 'series-tests';
    const coach = this.getCoach(topic);
    const ansIdx = q.answer.charCodeAt(0) - 65;
    const correctText = q.choices[ansIdx];
    const userIdx = userLetter ? userLetter.charCodeAt(0) - 65 : -1;
    const userText = userIdx >= 0 ? q.choices[userIdx] : null;
    const autopsy = this.autopsyChoices(q);

    const workSteps = [];
    if (q.tutoring && Array.isArray(q.tutoring.steps)) {
      for (const s of q.tutoring.steps) workSteps.push(s);
    }
    if (!workSteps.length && q.explanation) workSteps.push(q.explanation);

    const walkthrough = [];
    if (correct) {
      walkthrough.push('You picked the right answer. Still walk the full method — the exam will change the numbers.');
    } else if (userLetter) {
      walkthrough.push(
        `You chose ${userLetter}: “${userText}”. That is not correct. The correct choice is ${q.answer}: “${correctText}”.`
      );
    } else {
      walkthrough.push(`Correct choice: ${q.answer} — ${correctText}.`);
    }
    walkthrough.push(`This-problem reason: ${q.explanation}`);
    for (const s of workSteps) walkthrough.push(s);

    return {
      headline: correct ? 'Correct — full solve path' : 'Not quite — full solve path',
      correctChoice: `${q.answer}. ${correctText}`,
      walkthrough,
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      workSteps,
      explanation: q.explanation,
      autopsy,
      trapNotes: (q.tutoring && q.tutoring.whyNotOthers) || '',
      writeOnExam: coach.writeOnExam,
      howToCheck: coach.howToCheck,
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
    };
  },

  buildWorkshopTutor(p) {
    const topic = (p.topics && p.topics[0]) || 'series-tests';
    const coach = this.getCoach(topic);
    return {
      startHere: coach.firstMove,
      recipe: coach.recipe || [],
      writeOnExam: p.examWriteup || coach.writeOnExam,
      howToCheck: p.check || coach.howToCheck,
      coachTitle: coach.title,
      howToThink: coach.howToThink,
      commonMistake: coach.commonMistake,
      examTip: coach.examTip,
    };
  },
};
