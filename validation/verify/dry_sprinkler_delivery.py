"""Dry Sprinkler Water Delivery: the built-in example (Load example), worked independently in Python.
Pipe ID: Schedule 40 steel (ASME B36.10M). Fitting equivalent lengths: NFPA 13 (2025) Table 28.2.3.1.1 (Schedule 40, C = 120). Delivery times: NFPA 13 (2025) Table 8.2.4.3.2.
Volume: pi/4 d^2 L x 7.48052 gal/ft3, plus the app's stated planning allowance of fitting volume = 15% of EL as pipe.
Design flow: Q = n K sqrt(P). Fill rate: inverse Hazen-Williams, Q = (P_res / sum k)^(1/1.85), k = 4.52 Le / (C^1.85 d^4.87).
Transit: t = 60 V_remote / Q_fill. Trip: SFPE Handbook / FM equation t = 0.0352 (V_T / (A_n sqrt(T0))) ln(pa0/pa)
with V_T in ft3, A_n in ft2, T0 in deg R, p in psia (as quoted in ASPE Pipeline, 'Physics, Hydraulics, and Code Requirements
Behind Water Delivery Time'). A_n uses the app's stated orifice relation d = sqrt(K/29.83)."""
import math
from ftverify import write, r
ID = {'4': 4.026, '3': 3.068, '1.5': 1.610}
EL = {'4': {'elbow90': 10, 'teeBranch': 20, 'gate': 2, 'check': 22}, '3': {'elbow90': 7, 'teeBranch': 15}, '1.5': {'elbow90': 4}}
segs = [('4', 80, {'elbow90': 2, 'teeBranch': 1, 'gate': 1, 'check': 1}), ('3', 120, {'elbow90': 4, 'teeBranch': 2}), ('1.5', 40, {'elbow90': 2})]
n, K, P, Pres, air, trip, TF, C = 2, 8.0, 7.0, 75.0, 40.0, 15.0, 70.0, 120.0
def vol(d, L): return math.pi / 4 * (d / 12) ** 2 * L * 7.48052
V = 0.0; sumk = 0.0
for nom, L, fit in segs:
    d = ID[nom]; el = sum(EL[nom][k] * c for k, c in fit.items())
    V += vol(d, L) + vol(d, 0.15 * el)
    sumk += 4.52 * (L + el) / (C ** 1.85 * d ** 4.87)
Q = n * K * math.sqrt(P)
Qfill = (Pres / sumk) ** (1 / 1.85)
transit = 60 * V / Qfill
An_ft2 = n * math.pi / 4 * (K / 29.83) / 144
ttrip = 0.0352 * (V / 7.48052) / (An_ft2 * math.sqrt(TF + 459.67)) * math.log((air + 14.7) / (trip + 14.7))
# Published worked example (ASPE Pipeline): V 106.944 ft3, An 0.001364 ft2, T0 471 R, 48.34/28.34 psia -> 67.94 s
aspe = 0.0352 * 106.944 / (0.001364 * math.sqrt(471)) * math.log(48.34 / 28.34)
assert abs(aspe - 67.94) / 67.94 < 0.005, aspe
FIXED = ('Fixed in v1.4.0: trip time now converts V_T to ft3 and A_n to ft2 before the SFPE/FM equation (was gal and in2, about 19 times short); '
         'fitting equivalent lengths updated to NFPA 13 (2025) Table 28.2.3.1.1 (swing check, 45 deg elbow 6-12 in, butterfly 10/12 in, 12 in elbow, 1-1/2 in tee). '
         'Blank table cells keep the app planning values.')
FILL_NOTE = ('Method note, not a math error: the fill rate lets the full DPV residual drive pipe friction only, with no loss through the open sprinklers, so the fill flow '
             'and transit time are optimistic.')
cases = [{'id': 'example', 'title': 'Built-in example (Load example)', 'source': 'See validation/verify/dry_sprinkler_delivery.py header',
          'steps': [{'click': '#btnExample', 'wait': 600}],
          'reads': [
              {'sel': '#metricVolTotal', 'label': 'Total system volume', 'unit': 'gal', 'ref': r(V, 2)},
              {'sel': '#metricVolRemote', 'label': 'Volume to most remote', 'unit': 'gal', 'ref': r(V, 2)},
              {'sel': '#metricFlow', 'label': 'Design flow n K sqrt(P)', 'unit': 'gpm', 'ref': r(Q, 2)},
              {'sel': '#metricTransit', 'label': 'Transit time 60 V / Q_fill', 'unit': 's', 'ref': r(transit, 1)},
              {'sel': '#metricTrip', 'label': 'Trip time (SFPE/FM equation)', 'unit': 's', 'ref': r(ttrip, 1)},
              {'sel': '#metricDelivery', 'label': 'Water delivery time (trip + transit)', 'unit': 's', 'ref': r(ttrip + transit, 1)}]},
         # NFPA 13-2022 option: same delivery-time limits and equivalent lengths, so the same example must give the same numbers.
         {'id': 'example-2022', 'title': 'Built-in example with NFPA 13-2022 selected (results unchanged)',
          'source': 'NFPA 13-2022 Sec. 8.2.3 / Table 8.2.3.6.1 carries the same delivery-time values as 2025 Table 8.2.4.3.2',
          'steps': [{'click': '#btnExample', 'wait': 600}, {'set': '#nfpa13Edition', 'value': '2022', 'wait': 400}],
          'reads': [
              {'sel': '#codeEdition [data-nfpa13-label]', 'label': 'Edition shown on screen', 'refText': 'NFPA 13-2022'},
              {'sel': '#metricVolTotal', 'label': 'Total system volume', 'unit': 'gal', 'ref': r(V, 2)},
              {'sel': '#metricTransit', 'label': 'Transit time 60 V / Q_fill', 'unit': 's', 'ref': r(transit, 1)},
              {'sel': '#metricTrip', 'label': 'Trip time (SFPE/FM equation)', 'unit': 's', 'ref': r(ttrip, 1)},
              {'sel': '#metricDelivery', 'label': 'Water delivery time (trip + transit)', 'unit': 's', 'ref': r(ttrip + transit, 1)}]}]
write('dry-sprinkler-delivery', {'script': 'dry_sprinkler_delivery.py', 'app': 'Dry Sprinkler Water Delivery', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/dry_sprinkler_delivery.py', 'flags': [FIXED, FILL_NOTE], 'cases': cases})
print(V, Q, Qfill, transit, ttrip, 'aspe', aspe)
