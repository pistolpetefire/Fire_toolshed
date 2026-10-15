"""Sprinkler System Estimator (criteria mode): worked independently in Python.
Sprinkler flow = density x design area (NFPA 13 density/area method; OH-1 0.15 gpm/sf over 1,500 sf, EH-1 0.30 over 2,500 sf).
Hose allowance added (NFPA 13 hose stream table: OH 250 gpm, EH 500 gpm). Remote head flow = density x coverage;
required end pressure P = (Q/K)^2 (K-factor relation Q = K sqrt(P)), not less than the 7 psi minimum (NFPA 13).
Elevation = ft x 0.433 psi/ft. Preliminary tank volume = flow x duration."""
from ftverify import write, r
def steps(d, a, h, K, cov, elev, dur):
    return [{'set': 'input[name="mode"][value="criteria"]', 'value': True, 'wait': 300},
            {'set': '#durationAuto', 'value': False}, {'set': '#density', 'value': str(d)}, {'set': '#designArea', 'value': str(a)},
            {'set': '#includeHose', 'value': True}, {'set': '#hoseGpm', 'value': str(h)}, {'set': '#kFactor', 'value': str(K)},
            {'set': '#sprinklerCoverageSf', 'value': str(cov)}, {'set': '#remoteHeadGpm', 'value': ''}, {'set': '#minResidualFloor', 'value': '7'},
            {'set': '#autoRemoteFromK', 'value': True}, {'set': '#elevFt', 'value': str(elev)}, {'set': '#durationMin', 'value': str(dur), 'wait': 300}]
cases = []
for cid, title, d, a, h, K, cov, elev, dur in [
    ('oh1', 'OH-1 wet: 0.15/1,500, 250 gpm hose, K5.6, 130 sf/head, 30 ft, 60 min', 0.15, 1500, 250, 5.6, 130, 30, 60),
    ('eh1', 'EH-1 wet: 0.30/2,500, 500 gpm hose, K11.2, 100 sf/head, 45 ft, 120 min', 0.30, 2500, 500, 11.2, 100, 45, 120),
    ('light', 'Light wet: 0.10/1,500, 100 gpm hose, K5.6, 225 sf/head, 12 ft, 30 min', 0.10, 1500, 100, 5.6, 225, 12, 30),
]:
    q = d * a + h
    pk = max(7.0, (d * cov / K) ** 2)
    cases.append({'id': cid, 'title': title, 'source': 'NFPA 13 density/area (see script header)', 'steps': steps(d, a, h, K, cov, elev, dur),
                  'reads': [{'sel': '#resultFlow', 'label': 'Total demand (sprinklers + hose)', 'unit': 'gpm', 'ref': r(q, 0)},
                            {'sel': '#metricRemote', 'label': 'Remote head pressure max(7, (Q/K)^2)', 'unit': 'psi', 'ref': r(pk, 1)},
                            {'sel': '#metricElev', 'label': 'Elevation pressure', 'unit': 'psi', 'ref': r(elev * 0.433, 1)},
                            {'sel': '#resultTank', 'label': 'Preliminary tank volume', 'unit': 'gal', 'ref': r(q * dur, 0)}]})
write('sprinkler-system-estimator', {'script': 'sprinkler_system_estimator.py', 'app': 'Sprinkler System Estimator', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/sprinkler_system_estimator.py', 'flags': [], 'cases': cases})
for c in cases: print(c['id'], [x['ref'] for x in c['reads']])
