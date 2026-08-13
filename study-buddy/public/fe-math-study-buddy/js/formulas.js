/** Short FE-style strategy cards. Not the NCEES Handbook. */
window.FE_FORMULAS = [
  { id: 'at', topic: 'alg-trig', title: 'Algebra & trig', items: ['log(ab)=log a+log b', 'a^x = e^{x ln a}', 'sin²+cos²=1', 'Law of cosines: c²=a²+b²−2ab cos C'] },
  { id: 'ag', topic: 'analytic', title: 'Analytic geometry', items: ['Distance: √((x2−x1)²+(y2−y1)²)', 'Circle: (x−h)²+(y−k)²=r²', 'Slope: (y2−y1)/(x2−x1)', 'Midpoint: averages of coords'] },
  { id: 've', topic: 'vectors', title: 'Vectors', items: ['|a|=√(ax²+ay²+az²)', 'a·b = |a||b|cosθ = ax bx+…', 'a×b perpendicular to both; |a×b|=|a||b|sinθ', 'proj_b a = ((a·b)/|b|²) b'] },
  { id: 'mx', topic: 'matrices', title: 'Matrices', items: ['2×2 det = ad−bc', 'A A^{-1}=I', 'Cramer: x_i = det(A_i)/det A', 'Eigen: det(A−λI)=0'] },
  { id: 'dc', topic: 'diff-calc', title: 'Derivatives', items: ['Product / quotient / chain', 'd(x^n)=n x^{n−1}', 'Critical points: f′=0 or DNE', '∂f/∂x treats y as constant'] },
  { id: 'ic', topic: 'int-calc', title: 'Integrals', items: ['∫x^n = x^{n+1}/(n+1) (n≠−1)', 'FTC: ∫_a^b f = F(b)−F(a)', 'Trapezoid: (h/2)(y0+2y1+…+yn)', 'Average value = (1/(b−a))∫f'] },
  { id: 'de', topic: 'diffeq', title: 'DEs', items: ['Separable: dy/g(y)=f(x)dx', '1st linear: μ=e^{∫P dx}', 'y″+ω²y=0 → sin/cos ωt', 'Characteristic r²+br+c=0'] },
  { id: 'pr', topic: 'probability', title: 'Probability', items: ['P(A∪B)=P(A)+P(B)−P(A∩B)', 'Bayes: P(A|B)=P(B|A)P(A)/P(B)', 'E[X]=Σ x p(x)', 'Binomial: C(n,k) p^k (1−p)^{n−k}'] },
  { id: 'st', topic: 'statistics', title: 'Statistics', items: ['s² = Σ(x−x̄)²/(n−1)', 'z=(x−μ)/σ', 'CI for mean (known σ): x̄ ± z σ/√n', 'Normal: about 68% within 1σ'] },
];
