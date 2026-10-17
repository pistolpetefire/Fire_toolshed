"""Smoke Exhaust Scenario Lab: steady axisymmetric path (NFPA 92 Ch. 5 SI equations) worked independently in Python.
zl = 0.166 Qc^(2/5); z > zl: m = 0.071 Qc^(1/3) z^(5/3) + 0.0018 Qc; z <= zl: m = 0.032 Qc^(3/5) z.
Ts = T0 + Qc / (m cp), cp = 1.0 kJ/kg K. rho = 101300 / (287 Ts). V = m / rho (1 m3/s = 2118.88 cfm).
Plugholing: NFPA 92 Eq. 5.6.3b Vmax = 4.16 gamma d^(5/2) ((Ts - T0)/T0)^(1/2), with Ts from Eq. 5.5.5 using Ks = 0.5 (5.5.5.2;
Ks = 1.0 only for the exhaust volume, 5.5.5.1). Rectangular inlet Di = 2ab/(a+b). Inlet spacing Smin = 0.9 Ve^(1/2).
Pressure: dP = (rho_a / 2) (V_imb / (C A))^2, rho_a = 1.2 kg/m3."""
import math
from ftverify import write, r
FT = 0.3048; CFM = 2118.880003; FT2 = 0.09290304
BASE = dict(hrrKw=500, convectiveFraction=0.7, ambientTempC=21, roomHeightFt=18, smokeInterfaceFt=8, makeupRatio=0.95, makeupFreeAreaFt2=260,
            leakageAreaFt2=9, flowCoefficient=0.65, exhaustLocationFactor=1, selectedInletCount=2, exhaustInletLengthIn=24, exhaustInletWidthIn=24, exhaustMarginPercent=0)
def calc(s, plug_fraction=0.5):  # Ks for plugholing, NFPA 92 5.5.5.2
    Qc = s['hrrKw'] * s['convectiveFraction']; z = s['smokeInterfaceFt'] * FT; zl = 0.166 * Qc ** 0.4
    m = 0.071 * Qc ** (1 / 3) * z ** (5 / 3) + 0.0018 * Qc if z >= zl else 0.032 * Qc ** 0.6 * z
    T0 = s['ambientTempC'] + 273.15; Ts = T0 + Qc / m; rho = 101300 / (287 * Ts)
    V = m / rho; Vsel = V * (1 + s['exhaustMarginPercent'] / 100)
    d = (s['roomHeightFt'] - s['smokeInterfaceFt']) * FT
    Tplug = T0 + plug_fraction * Qc / m
    vmax = 4.16 * s['exhaustLocationFactor'] * d ** 2.5 * math.sqrt((Tplug - T0) / T0)
    a, b = s['exhaustInletLengthIn'] / 12, s['exhaustInletWidthIn'] / 12
    imb = Vsel * (1 - s['makeupRatio'])
    dp = 1.2 / 2 * (imb / (s['flowCoefficient'] * s['leakageAreaFt2'] * FT2)) ** 2
    sep = 0.9 * math.sqrt(Vsel / s['selectedInletCount']) / FT
    return dict(massFlowKgs=m, smokeTempC=Ts - 273.15, requiredCfm=V * CFM, selectedCfm=Vsel * CFM, vmaxCfm=vmax * CFM,
                equivalentInletDiameterFt=2 * a * b / (a + b), pressurePa=dp, inletSeparationFt=sep)
PLUG_NOTE = ('Resolved: the earlier flag compared Vmax against Ts with Ks = 1.0. NFPA 92 5.5.5.2 requires Ks = 0.5 for the plugholing limit '
             '(Ks = 1.0 is only for the exhaust volume, 5.5.5.1), which is what the app does, so the reference now uses Ks = 0.5. App math unchanged.')
cases = []
for cid, title, over in [('base', 'Built-in base scenario (500 kW packaging, z 8 ft, H 18 ft)', {}),
                         ('tall', 'Base scenario with 2500 kW, H 40 ft, z 20 ft, 10% margin', {'hrrKw': 2500, 'roomHeightFt': 40, 'smokeInterfaceFt': 20, 'exhaustMarginPercent': 10}),
                         ('low', 'Base scenario with 3000 kW and z 4 ft (below the flame-height limit)', {'hrrKw': 3000, 'smokeInterfaceFt': 4})]:
    s = dict(BASE, **over); out = calc(s)
    js = "calculate(Object.assign({}, scenarios.find(function(s){return s.id==='base'}), %s)).outputs." % (str(over).replace("'", '"') if over else '{}')
    reads = [{'expr': js + k, 'label': lab, 'unit': u, 'ref': r(out[k], 4)} for k, lab, u in [
        ('massFlowKgs', 'Plume mass flow', 'kg/s'), ('smokeTempC', 'Smoke layer temperature', 'C'), ('requiredCfm', 'Required exhaust', 'cfm'),
        ('selectedCfm', 'Selected exhaust incl. margin', 'cfm'), ('equivalentInletDiameterFt', 'Equivalent inlet diameter', 'ft'),
        ('pressurePa', 'Pressure difference', 'Pa'), ('inletSeparationFt', 'Minimum inlet separation', 'ft')]]
    reads.append({'expr': js + 'vmaxCfm', 'label': 'Plugholing limit per inlet (NFPA 92 Eq. 5.6.3b, Ks = 0.5)', 'unit': 'cfm', 'ref': r(out['vmaxCfm'], 1)})
    cases.append({'id': cid, 'title': title, 'source': 'NFPA 92-2024 Ch. 5 (see script header). ' + PLUG_NOTE, 'steps': [], 'reads': reads})
    print(cid, {k: round(v, 3) for k, v in out.items()}, 'Ks=1 vmax', round(calc(s, 1.0)['vmaxCfm'], 1))
# NFPA 92 edition picker (default 2021, Florida 9th Edition). Ch. 5 equations and Ks are the same in 2021 and 2024, so the
# displayed results must be identical with either edition selected.
b = calc(BASE)
for ed, steps in [('2021', []), ('2024', [{'set': '#nfpa92Edition', 'value': '2024', 'wait': 300}])]:
    cases.append({'id': 'edition-' + ed, 'title': 'Base scenario with NFPA 92-%s selected (results unchanged)' % ed + (' (default)' if ed == '2021' else ''),
                  'source': 'NFPA 92-2021 / 2024 Ch. 5 (same equations and Ks)', 'steps': steps,
                  'reads': [{'sel': '#nfpa92Label', 'label': 'Edition shown on screen', 'refText': 'NFPA 92-' + ed},
                            {'sel': '#summaryStrip div:nth-child(2) strong', 'label': 'Required exhaust (displayed)', 'unit': 'cfm', 'ref': r(b['requiredCfm'], 0)},
                            {'expr': "calculate(scenarios.find(function(s){return s.id==='base'})).outputs.vmaxCfm", 'label': 'Plugholing limit per inlet', 'unit': 'cfm', 'ref': r(b['vmaxCfm'], 1)}]})
write('smoke-exhaust-lab/app', {'script': 'smoke_exhaust_lab.py', 'app': 'Smoke Exhaust Scenario Lab', 'appVersion': '2026.07.16-team-beta (engine steady-axisymmetric-1.1)',
      'handcalc': 'validation/verify/smoke_exhaust_lab.py', 'flags': [], 'cases': cases})
