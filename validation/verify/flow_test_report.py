"""Hydrant Flow Test Report: worked independently in Python.
Outlet flow: NFPA 291, Q = 29.83 c d^2 sqrt(Pp) (gpm, in, psi). Available flow at the rating residual (20 psi default):
Q_R = Q_F x ((Ps - Pr_rating) / (Ps - Pr))^(1/1.85) (NFPA 291 N^1.85 capacity method). Pressure drop % = (Ps - Pr) / Ps.
Hydrant class (NFPA 291 color code): AA >= 1500, A 1000-1499, B 500-999, C < 500 gpm."""
import math
from ftverify import write, r
def q20(ps, pr, qf, rr=20): return qf * ((ps - rr) / (ps - pr)) ** (1 / 1.85)
cases = []
for cid, title, ps, pr, qf, rr, steps in [
    ('defaults', 'Defaults: static 72, residual 48 psi at 1256 gpm', 72, 48, 1256, 20, []),
    ('case2', 'Static 85, residual 60 psi at 1500 gpm, rating at 20 psi', 85, 60, 1500, 20,
     [{'set': '#staticPressure', 'value': '85'}, {'set': '#residualPressure', 'value': '60'}, {'set': '#flowAtResidual', 'value': '1500'}]),
    ('case3', 'Static 60, residual 30 psi at 900 gpm, rating at 25 psi', 60, 30, 900, 25,
     [{'set': '#staticPressure', 'value': '60'}, {'set': '#residualPressure', 'value': '30'}, {'set': '#flowAtResidual', 'value': '900'}, {'set': '#minResidual', 'value': '25'}]),
]:
    cases.append({'id': cid, 'title': title, 'source': 'NFPA 291 (see script header)', 'steps': steps,
                  'reads': [{'sel': '#mFireFlow20', 'label': 'Available flow at rating residual', 'unit': 'gpm', 'ref': r(q20(ps, pr, qf, rr), 0)},
                            {'sel': '#mDrop', 'label': 'Pressure drop', 'unit': 'psi', 'ref': r(ps - pr, 1)},
                            {'sel': '#mDropPct', 'label': 'Pressure drop', 'unit': '%', 'ref': r(100 * (ps - pr) / ps, 1)}]})
qp = 29.83 * 0.9 * 2.5 ** 2 * math.sqrt(20)
cases.append({'id': 'pitot', 'title': 'Pitot 20 psi, 2.5 in outlet, c 0.90, one hydrant', 'source': 'NFPA 291 Q = 29.83 c d^2 sqrt(P)',
              'steps': [{'set': '#pitotPressure', 'value': '20'}, {'set': '#outletDiameter', 'value': '2.5'}, {'set': '#dischargeCoefficient', 'value': '0.90'},
                        {'set': '#extraHydrants', 'value': '0'}, {'click': '#btnCalcPitot', 'wait': 300}],
              'reads': [{'sel': '#flowAtResidual', 'prop': 'value', 'label': 'Outlet flow from pitot', 'unit': 'gpm', 'ref': r(qp, 0)}]})
write('flow-test-report', {'script': 'flow_test_report.py', 'app': 'Hydrant Flow Test Report', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/flow_test_report.py', 'flags': [], 'cases': cases})
for c in cases: print(c['id'], [x['ref'] for x in c['reads']])
