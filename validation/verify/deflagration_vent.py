"""Deflagration Vent Sizing: NFPA 68-2023 vent-area equations worked independently in Python (SI: m, m2, m3, bar-g, bar-m/s).
Dust, Eq. 8.2.1.1: Av0 = 1e-4 (1 + 1.54 Pstat^(4/3)) KSt V^(3/4) sqrt(Pmax/Pred - 1), Pmax = unvented dust Pmax.
Dust, Eq. 8.2.2.3 (2 < L/D <= 6, Pinitial = 0): Av1 = Av0 [1 + 0.6 (L/D - 2)^0.75 exp(-0.95 Pred^2)].
Gas, Eq. 7.2.1a/b (Pred <= 0.5 bar-g): Av0 = As C / sqrt(Pred), C = Su rho lam / (2 Gu Cd) [((Pmax+1)/(P0+1))^(1/gb) - 1] (P0+1)^0.5.
Gas, Eq. 7.2.2a/b (Pred > 0.5 bar-g): Av0 = As (1 - r)/(r - delta) (Su rho / Gu)(lam / Cd), r = ((Pred+1)/(Pmax+1))^(1/gb),
    delta = [((Pstat+1)/(P0+1))^(1/gb) - 1] / [((Pmax+1)/(P0+1))^(1/gb) - 1].
lam per 7.2.6.1a-f (phi1 from Re_f on Dhe/2, phi2 from Re_v on Dv/2 with uv = min(sqrt(2e5 Pred/rho), au)), 7.2.6.7 for L/D >= 2.5.
Defaults 7.2.3.3-7.2.3.7 and 7.2.4.1: rho 1.2, Gu 230.1, gb 1.15, mu 1.8e-5, au 343, Cd 0.70, P0 0.
Process vessels are modeled as cylinders (flat ends) from V and L/D: D = (4V/(pi L/D))^(1/3), As = pi D L + pi D^2/2, Dhe = D."""
import math
from ftverify import write, r

RHO, GU, GB, MU, AU, CD = 1.2, 230.1, 1.15, 1.8e-5, 343.0, 0.70

def dust(V, Kst, Pstat, Pred, Pmax, LD=1.0):
    a0 = 1e-4 * (1 + 1.54 * Pstat ** (4 / 3)) * Kst * V ** 0.75 * math.sqrt(Pmax / Pred - 1)
    return a0 * (1 + 0.6 * (LD - 2) ** 0.75 * math.exp(-0.95 * Pred ** 2)) if LD > 2 else a0

def cyl(V, LD):
    D = (4 * V / (math.pi * LD)) ** (1 / 3)
    L = LD * D
    return math.pi * D * L + math.pi * D ** 2 / 2, D

def gas(V, LD, Su, Pstat, Pred, Pmax, P0=0.0):
    As, Dhe = cyl(V, LD)
    Ref = RHO * Su * (Dhe / 2) / MU
    phi1 = 1.0 if Ref < 4000 else (Ref / 4000) ** 0.39
    uv = min(math.sqrt(2e5 * Pred / RHO), AU)
    ldf = 1.0 if LD < 2.5 else 1 + (LD / 2.5 - 1) ** 2
    def area(lam):
        if Pred <= 0.5:
            C = Su * RHO * lam / (2 * GU * CD) * (((Pmax + 1) / (P0 + 1)) ** (1 / GB) - 1) * (P0 + 1) ** 0.5
            return As * C / math.sqrt(Pred)
        rr = ((Pred + 1) / (Pmax + 1)) ** (1 / GB)
        delta = (((Pstat + 1) / (P0 + 1)) ** (1 / GB) - 1) / (((Pmax + 1) / (P0 + 1)) ** (1 / GB) - 1)
        return As * (1 - rr) / (rr - delta) * (Su * RHO / GU) * (lam / CD)
    lam = phi1 * ldf
    for _ in range(500):  # fixed-point iteration on the vent diameter
        Dv = math.sqrt(4 * area(lam) / math.pi)
        Rev = RHO * uv * (Dv / 2) / MU
        phi2 = max(1.0, 1.23 * (Rev / 1e6) ** math.sqrt(2.37e-3 / Su))
        new = phi1 * phi2 * ldf
        if abs(new - lam) < 1e-12:
            break
        lam = new
    return area(lam), lam

def steps(pick, vals):
    st = [{'click': pick, 'wait': 300}, {'set': '#units', 'value': 'si', 'wait': 200}]
    return st + [{'set': k, 'value': str(v)} for k, v in vals]

SRC = 'NFPA 68-2023 (see script header)'
DEF = [('#efficiency', 1), ('#asOverride', ''), ('#aobs', ''), ('#p0', 0), ('#cd', '0.7')]
CASES = [
    # The repo's original four verification cases (gas cases re-based from KG to the 2023 Su method; see README).
    ('dust-compact', 'Process dust, V 10 m3, KSt 200, Pstat 0.1, Pred 0.5, Pmax 8 bar, L/D 1.5', '#pickProcess',
     [('#volume', 10), ('#ldRatio', 1.5), ('#kst', 200), ('#pstat', 0.1), ('#pred', 0.5), ('#pmaxMat', 8), ('#pmax', 8)], dust(10, 200, 0.1, 0.5, 8)),
    ('dust-elongated', 'Process dust, V 25 m3, KSt 150, Pstat 0.1, Pred 0.4, Pmax 8 bar, L/D 4', '#pickProcess',
     [('#volume', 25), ('#ldRatio', 4), ('#kst', 150), ('#pstat', 0.1), ('#pred', 0.4), ('#pmaxMat', 8), ('#pmax', 8)], dust(25, 150, 0.1, 0.4, 8, 4)),
    ('gas-compact', 'Process gas, V 10 m3, propane Su 46 cm/s, Pmax 7.9, Pstat 0.1, Pred 0.5 bar (Eq. 7.2.1), L/D 1.5', '#pickGas',
     [('#volume', 10), ('#ldRatio', 1.5), ('#su', 46), ('#pstat', 0.1), ('#pred', 0.5), ('#pmaxMat', 7.9), ('#pmax', 2)], gas(10, 1.5, 0.46, 0.1, 0.5, 7.9)[0]),
    ('gas-pstat', 'Process gas, V 50 m3, methane Su 40 cm/s, Pmax 7.1, Pstat 0.2, Pred 1.0 bar (Eq. 7.2.2), L/D 1', '#pickGas',
     [('#volume', 50), ('#ldRatio', 1), ('#su', 40), ('#pstat', 0.2), ('#pred', 1.0), ('#pmaxMat', 7.1), ('#pmax', 3)], gas(50, 1, 0.40, 0.2, 1.0, 7.1)[0]),
    # Three cross-check cases requested with the 2026-10-17 fix.
    ('x-propane-721', 'Cross-check: 10 m3, propane Su 46, Pmax 7.9, Pstat 0.1, Pred 0.5 (Eq. 7.2.1), L/D 1.5', '#pickGas',
     [('#volume', 10), ('#ldRatio', 1.5), ('#su', 46), ('#pstat', 0.1), ('#pred', 0.5), ('#pmaxMat', 7.9), ('#pmax', '')], gas(10, 1.5, 0.46, 0.1, 0.5, 7.9)[0]),
    ('x-propane-722', 'Cross-check: 10 m3, propane Su 46, Pmax 7.9, Pstat 0.1, Pred 1.0 (Eq. 7.2.2), L/D 3', '#pickGas',
     [('#volume', 10), ('#ldRatio', 3), ('#su', 46), ('#pstat', 0.1), ('#pred', 1.0), ('#pmaxMat', 7.9), ('#pmax', '')], gas(10, 3, 0.46, 0.1, 1.0, 7.9)[0]),
    ('x-aluminum', 'Cross-check: 10 m3, aluminum KSt 400, Pmax 11.2, Pstat 0.1, Pred 0.5, L/D 1.5', '#pickProcess',
     [('#volume', 10), ('#ldRatio', 1.5), ('#kst', 400), ('#pstat', 0.1), ('#pred', 0.5), ('#pmaxMat', 11.2), ('#pmax', '')], dust(10, 400, 0.1, 0.5, 11.2)),
]

if __name__ == '__main__':
    cases = []
    for cid, title, pick, vals, ref in CASES:
        cases.append({'id': cid, 'title': title, 'source': SRC, 'steps': steps(pick, vals + DEF),
                      'reads': [{'sel': '#mAv', 'label': 'Vent area Av', 'unit': 'm2', 'ref': r(ref)}]})
    write('deflagration-vent', {'script': 'deflagration_vent.py', 'app': 'Deflagration Vent Sizing', 'versionSel': '#appVersion',
          'handcalc': 'validation/verify/deflagration_vent.py', 'flags': [], 'cases': cases})
    for c in cases: print(c['id'], c['reads'][0]['ref'])
