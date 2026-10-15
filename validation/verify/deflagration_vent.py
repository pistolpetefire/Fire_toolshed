"""Deflagration Vent Sizing: NFPA 68 vent-area equations worked independently in Python (SI: m3, bar-g, bar-m/s).
Dust, L/D <= 2: NFPA 68 (2013) Eq. 8.2.2  Av0 = 1e-4 (1 + 1.54 Pstat^(4/3)) Kst V^(3/4) sqrt(Pmax/Pred - 1), Pmax = unvented dust Pmax.
Dust, 2 < L/D <= 6: Av1 = Av0 [1 + 0.6 (L/D - 2)^0.75 exp(-0.95 Pred^2)].
Gas, L/D <= 2: Av = [(0.1265 log10 KG - 0.0567) Pred^-0.5817 + 0.1754 Pred^-0.5722 (Pstat - 0.1)] V^(2/3)
(Bartknecht 1993 correlation used in NFPA 68 and EN 14994; quoted in VTT-R-02755-11 Eq. 33)."""
import math
from ftverify import write, r
def dust(V, Kst, Pstat, Pred, Pmax, LD=1.0):
    a0 = 1e-4 * (1 + 1.54 * Pstat ** (4 / 3)) * Kst * V ** 0.75 * math.sqrt(Pmax / Pred - 1)
    return a0 * (1 + 0.6 * (LD - 2) ** 0.75 * math.exp(-0.95 * Pred ** 2)) if LD > 2 else a0
def gas(V, KG, Pstat, Pred):
    return ((0.1265 * math.log10(KG) - 0.0567) * Pred ** -0.5817 + 0.1754 * Pred ** -0.5722 * (Pstat - 0.1)) * V ** (2 / 3)
FLAG = ('App equations differ from NFPA 68. Dust: app uses V^(2/3) x Pred^(-1/2) and no Pmax term; NFPA 68 Eq. 8.2.2 uses V^(3/4) x sqrt(Pmax/Pred - 1), '
        'with Pmax the unvented dust pressure, while the app treats "Pmax" as enclosure strength. Gas: app puts the exponents on Pstat and (Pred - 1.005 Pstat); '
        'the published correlation puts them on Pred with a (Pstat - 0.1) term. Not changed; for Kevin to review before this app is relied on.')
def steps(pick, vals):
    st = [{'click': pick, 'wait': 300}, {'set': '#units', 'value': 'si', 'wait': 200}]
    return st + [{'set': k, 'value': str(v)} for k, v in vals]
cases = []
for cid, title, pick, vals, ref in [
    ('dust-compact', 'Process dust, V 10 m3, Kst 200, Pstat 0.1, Pred 0.5, Pmax 8 bar, L/D 1.5', '#pickProcess',
     [('#volume', 10), ('#ldRatio', 1.5), ('#kst', 200), ('#pstat', 0.1), ('#pred', 0.5), ('#pmax', 8), ('#efficiency', 1)], dust(10, 200, 0.1, 0.5, 8)),
    ('dust-elongated', 'Process dust, V 25 m3, Kst 150, Pstat 0.1, Pred 0.4, Pmax 8 bar, L/D 4', '#pickProcess',
     [('#volume', 25), ('#ldRatio', 4), ('#kst', 150), ('#pstat', 0.1), ('#pred', 0.4), ('#pmax', 8), ('#efficiency', 1)], dust(25, 150, 0.1, 0.4, 8, 4)),
    ('gas-compact', 'Process gas, V 10 m3, KG 100, Pstat 0.1, Pred 0.5 bar, L/D 1.5', '#pickGas',
     [('#volume', 10), ('#ldRatio', 1.5), ('#kg', 100), ('#pstat', 0.1), ('#pred', 0.5), ('#pmax', 2), ('#efficiency', 1)], gas(10, 100, 0.1, 0.5)),
    ('gas-pstat', 'Process gas, V 50 m3, KG 75, Pstat 0.2, Pred 1.0 bar, L/D 1', '#pickGas',
     [('#volume', 50), ('#ldRatio', 1), ('#kg', 75), ('#pstat', 0.2), ('#pred', 1.0), ('#pmax', 3), ('#efficiency', 1)], gas(50, 75, 0.2, 1.0)),
]:
    cases.append({'id': cid, 'title': title, 'source': 'NFPA 68 (see script header)', 'steps': steps(pick, vals),
                  'reads': [{'sel': '#mAv', 'label': 'Vent area Av', 'unit': 'm2', 'ref': r(ref), 'flag': FLAG}]})
write('deflagration-vent', {'script': 'deflagration_vent.py', 'app': 'Deflagration Vent Sizing', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/deflagration_vent.py', 'flags': [FLAG], 'cases': cases})
for c in cases: print(c['id'], c['reads'][0]['ref'])
