/** Short FE Industrial strategy cards. Not the NCEES Handbook. */
window.IE_FORMULAS = [
  { id: 'ec', topic: 'econ', title: 'Engineering economics', items: ['F=P(1+i)^n', 'P=A(P/A,i,n)', 'SL dep=(B−S)/N', 'B/C=PW(B)/PW(C)'] },
  { id: 'md', topic: 'modeling', title: 'Models & queues', items: ['ρ=λ/μ < 1', 'L=λW', 'M/M/1 Lq=ρ²/(1−ρ)', 'LP slack = capacity − used'] },
  { id: 'mg', topic: 'management', title: 'PERT / EV', items: ['te=(a+4m+b)/6', 'σ=(b−a)/6', 'Critical = longest path', 'SV=EV−PV, CV=EV−AC'] },
  { id: 'pr', topic: 'production', title: 'Inventory & lines', items: ['EOQ=√(2DS/H)', 'ROP=dL', 'F=F+α(A−F)', 'Nmin=Σt/CT (round up)'] },
  { id: 'fc', topic: 'facilities', title: 'Facilities', items: ['Rectilinear |Δx|+|Δy|', 'LD=Σ f·d', 'Machines=(D t)/(avail·u)', 'COG weighted average'] },
  { id: 'hf', topic: 'human', title: 'HF / safety', items: ['Reach → 5th; clearance → 95th', 'Hierarchy: eliminate → engineer → admin → PPE', 'LI = load/RWL', 'Digital = precise; analog = trend'] },
  { id: 'wk', topic: 'work', title: 'Work design', items: ['NT=OT×rating', 'ST=NT/(1−A) or NT(1+A)', 'T_n=T1 n^b', 'p̂=x/N'] },
  { id: 'ql', topic: 'quality', title: 'Quality', items: ['Cp=(USL−LSL)/(6σ)', 'Cpk=min(USL−μ,μ−LSL)/(3σ)', 'UCL_x̄=x̄+A2 R̄', 'σ̂≈R̄/d2'] },
  { id: 'rl', topic: 'systems', title: 'Reliability', items: ['Series Π R_i', 'Parallel 1−Π(1−R_i)', 'R(t)=e^{−λt}', 'A=MTTF/(MTTF+MTTR)'] },
  { id: 'is', topic: 'ie-stats', title: 'IE statistics', items: ['z=(x−μ)/σ', 'SE=σ/√n', 'n=(zσ/E)²', 'Unknown σ, small n → t'] },
];
