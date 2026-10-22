"""Fire Pump Sizer v2.6.0: the built-in DoD example plus diesel, breaker and churn cases, worked independently in Python.
Supply curve: NFPA 291 N^1.85 form, P(Q) = Ps - (Ps - Pr)(Q/Qt)^1.85. Head: ft = psi x 2.31.
Pump power: water hp = Q H / 3960; brake hp = water hp / efficiency, with the app's stated 0.75 pump efficiency,
then the app's stated 1.15 (electric) or 1.2 (diesel) driver margin.
Motor full-load current, 3-phase: I = hp x 746 / (sqrt(3) V eff pf), with the app's stated eff 0.90 and pf 0.85.
Diesel fuel tank: NFPA 20 (2022) 11.4.1.3.1, 12 h x manufacturer consumption rate + 5% expansion + 5% sump;
11.4.1.3.1.1, when the rate is unknown, 1 gal per hp + 5% + 5%. Rounded up to the next gallon.
Breaker (OCPD): NEC (2023) 695.4(B)(2)(a)(1), locked-rotor current of the largest fire pump motor plus FLC of the other
pump motors and accessories, next standard size per 240.6(A). LRC 363 A (50 hp, 480 V) is the EC&M worked
example (Design Guidelines for Electric Fire Pump Power Services, Part 2); that article gives 375 A, which is not a 240.6(A)
   standard rating, so the next standard size is 400 A. 404 A -> 450 A matches the EC&M Code Q&A example. 240.6(A) list per NEC 2023.
Churn: NFPA 20 (2022) 6.2.2, shutoff head shall not exceed 140% of rated head; checked against the entered shutoff."""
import math
from ftverify import write, r
Ps, Pr, Qt, Q, Psys, Qr, Pr_rated, V = 58, 35, 1500, 1750, 105, 2000, 125, 480
avail = Ps - (Ps - Pr) * (Q / Qt) ** 1.85
net = Psys - avail
bhp = Qr * Pr_rated * 2.31 / (3960 * 0.75)
motor = bhp * 1.15
fla = motor * 746 / (math.sqrt(3) * V * 0.90 * 0.85)
diesel = bhp * 1.2
STD_240_6A = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450,
              500, 600, 700, 800, 1000, 1200, 1600, 2000, 2500, 3000, 4000, 5000, 6000]
def ocpd(a):
    return next(x for x in STD_240_6A if x >= a)
tank_hp = math.ceil(diesel * 1.0 * 1.10)
tank_rate = math.ceil(6.0 * 12 * 1.10)
def dod(extra):
    return [{'click': '#btnDoD', 'wait': 600}] + extra + [{'click': '#btnRecalc', 'wait': 400}]
DIESEL = {'set': 'input[name="driverType"][value="diesel"]', 'value': True, 'wait': 300}
CARD = '#checksGrid .check-card:nth-child(3)'
cases = [
    {'id': 'dod-electric', 'title': 'DoD example (electric, 480 V)', 'source': 'See script header', 'steps': dod([]),
     'reads': [{'sel': '#availableAtFlow', 'label': 'Available supply at 1750 gpm', 'unit': 'psi', 'ref': r(avail, 1)},
               {'sel': '#netPumpPressure', 'label': 'Pressure the pump must add', 'unit': 'psi', 'ref': r(net, 1)},
               {'sel': '#motorHP', 'label': 'Motor hp (incl. 1.15)', 'unit': 'hp', 'ref': r(motor, 1)},
               {'sel': '#fla', 'label': 'Motor FLC, NEC Table 430.250 (223.6 hp -> 250 hp, 480 V -> 460 V column)', 'unit': 'A', 'ref': 302.0},
               {'sel': '#highPressureMessage', 'label': 'Max discharge = churn at the 140% limit + hydrant static 58', 'unit': 'psi', 'ref': r(1.4 * Pr_rated + Ps, 1)},
               {'sel': '#availablePressure', 'label': 'Summary card, one decimal', 'refText': f'{avail:.1f}'},
               {'sel': '#pumpMustAdd', 'label': 'Summary card, one decimal', 'refText': f'{net:.1f}'},
               {'sel': '#resultHead', 'label': 'Summary card, one decimal', 'refText': '105.0'},
               {'sel': CARD, 'attr': 'class', 'label': 'Churn check with no shutoff entered (not a pass)', 'refText': 'check-card fail'}]},
    {'id': 'ocpd-363', 'title': 'OCPD: LRC 363 A, no other loads (EC&M 50 hp, 480 V example)', 'source': 'NEC (2023) 695.4(B)(2)(a)(1), 240.6(A)',
     'steps': dod([{'set': '#lockedRotorA', 'value': '363'}, {'set': '#otherFlaA', 'value': ''}]),
     'reads': [{'sel': '#breaker', 'label': 'Minimum OCPD rating', 'unit': 'A', 'ref': float(ocpd(363))}]},
    {'id': 'ocpd-404-other', 'title': 'OCPD: LRC 404 A plus 3.4 A other FLC', 'source': 'NEC (2023) 695.4(B)(2)(a)(1), 240.6(A)',
     'steps': dod([{'set': '#lockedRotorA', 'value': '404'}, {'set': '#otherFlaA', 'value': '3.4'}]),
     'reads': [{'sel': '#breaker', 'label': 'Minimum OCPD rating', 'unit': 'A', 'ref': float(ocpd(407.4))}]},
    {'id': 'dod-diesel', 'title': 'DoD example switched to diesel, rate not known', 'source': 'NFPA 20 (2022) 11.4.1.3.1.1',
     'steps': dod([DIESEL, {'set': '#fuelRateGph', 'value': ''}]),
     'reads': [{'sel': '#dieselHP', 'label': 'Engine hp (incl. 1.2)', 'unit': 'hp', 'ref': r(diesel, 1)},
               {'sel': '#fuelTank', 'label': 'Minimum fuel tank (1 gal/hp + 10%)', 'unit': 'gal', 'ref': float(tank_hp)}]},
    {'id': 'diesel-rate', 'title': 'Diesel with an entered consumption rate of 6.0 gal/h, 12 h', 'source': 'NFPA 20 (2022) 11.4.1.3.1',
     'steps': dod([DIESEL, {'set': '#fuelRateGph', 'value': '6.0'}, {'set': '#dieselRuntime', 'value': '12'}]),
     'reads': [{'sel': '#fuelTank', 'label': 'Minimum fuel tank (12 h x rate + 10%)', 'unit': 'gal', 'ref': float(tank_rate)}]},
    {'id': 'churn-pass', 'title': 'Churn 170 psi entered, rated 125 psi (limit 175)', 'source': 'NFPA 20 (2022) 6.2.2',
     'steps': dod([{'set': '#churnPSIIn', 'value': '170'}]),
     'reads': [{'sel': CARD, 'attr': 'class', 'label': 'Churn check', 'refText': 'check-card pass'}]},
    {'id': 'churn-fail', 'title': 'Churn 180 psi entered, rated 125 psi (limit 175)', 'source': 'NFPA 20 (2022) 6.2.2',
     'steps': dod([{'set': '#churnPSIIn', 'value': '180'}]),
     'reads': [{'sel': CARD, 'attr': 'class', 'label': 'Churn check', 'refText': 'check-card fail'}]},

]
# v2.5.0 (NFPA 20-2022): direct suction, multiple demand points, minimum shutoff by the straight line shutoff -> rated.
# Line: P(Q) = S - (S - Pr) Q/Qr  ->  S = (Pnet - Pr Q/Qr) / (1 - Q/Qr). Beyond rated: rated -> 150% Qr at 65% Pr.
RQ, RP, CH = 750, 160, 224.0
def shut(q, pnet):
    f = q / RQ
    return max(RP, (pnet - RP * f) / (1 - f))
def pump(q, s):
    return s - (s - RP) * q / RQ if q <= RQ else RP - 0.35 * RP * (q - RQ) / (0.5 * RQ)
netA55, netA61 = 225.6 - 55, 225.6 - 61
mA, mB = pump(500, CH) + 55 - 225.6, pump(783.8, CH) + 55 - 94.6
assert mA < mB
PTS = [{'set': '#ratedGPM', 'value': '750'}, {'set': '#ratedPSI', 'value': '160'}, {'set': '#churnPSIIn', 'value': '224'},
       {'set': '#systemFlow', 'value': '500'}, {'set': '#systemPressure', 'value': '225.6'}, {'set': '#suctionMode', 'value': 'direct'},
       {'set': '#dpName2', 'value': 'B'}, {'set': '#dpFlow2', 'value': '783.8'}, {'set': '#dpPress2', 'value': '94.6'}]
cases += [
    {'id': 'pump-req-55-61', 'title': 'Rated 750 gpm @ 160 psi; A 500 gpm @ 225.6 psi, B 783.8 gpm @ 94.6 psi; suction 55-61 psi',
     'source': 'NFPA 20-2022 6.2.2 (straight-line conservative curve); churn + max suction vs component rating',
     'steps': dod(PTS + [{'set': '#suctionMin', 'value': '55'}, {'set': '#suctionMax', 'value': '61'}]),
     'reads': [{'sel': '#reqNet', 'label': 'Required net, A at 55 psi suction', 'unit': 'psi', 'ref': r(netA55, 1)},
               {'sel': '#minShutoff', 'label': 'Minimum shutoff (55 psi)', 'unit': 'psi', 'ref': r(shut(500, netA55), 1)},
               {'sel': '#minShutoffMax', 'index': 1, 'label': 'Required net at 61 psi', 'unit': 'psi', 'ref': r(netA61, 1)},
               {'sel': '#minShutoffMax', 'index': 2, 'label': 'Minimum shutoff (61 psi)', 'unit': 'psi', 'ref': r(shut(500, netA61), 1)},
               {'sel': '#maxDischarge', 'label': 'Max discharge = churn + 61', 'unit': 'psi', 'ref': CH + 61},
               {'sel': '#demandPointsBody tr:nth-child(1)', 'attr': 'data-governing', 'label': 'A governs', 'refText': 'true'},
               {'sel': '#demandPointsBody tr:nth-child(2) .dp-result', 'label': 'B check', 'refText': 'PASS'},
               {'sel': '#checksGrid .check-card:nth-child(2)', 'attr': 'class', 'label': 'Duty check uses net 170.6 > 160 rated', 'refText': 'check-card fail'}]},
    {'id': 'pump-cert-point', 'title': 'Certified point 500 gpm @ 175 psi net vs 170.6 psi required', 'source': 'NFPA 20-2022',
     'steps': dod(PTS + [{'set': '#suctionMin', 'value': '55'}, {'set': '#certFlow', 'value': '500'}, {'set': '#certPSI', 'value': '175'}]),
     'reads': [{'sel': '#certResult', 'label': 'Certified point check', 'refText': 'PASS (500 gpm @ 175 psi vs 500 gpm @ 170.6 psi)'}]},
    {'id': 'pump-curve-loss', 'title': 'DoD hydrant curve minus 5 psi backflow + 2 psi pipe', 'source': 'NFPA 291 N^1.85 less entered losses',
     'steps': dod([{'set': '#lossBackflow', 'value': '5'}, {'set': '#lossPipe', 'value': '2'}]),
     'reads': [{'sel': '#availableAtFlow', 'label': 'Suction at 1750 gpm after losses', 'unit': 'psi', 'ref': r(avail - 7, 1)}]},
]
# v2.6.0: max static suction for churn + static; certified curve mode (linear interpolation); duty REVIEW reason; past-rated label.
def interp(c, q):
    for (f0, p0), (f1, p1) in zip(c, c[1:]):
        if f0 <= q <= f1:
            return p0 + (p1 - p0) * (q - f0) / (f1 - f0)
CURVE_OK = [(0, 205), (500, 185), (750, 165), (1125, 120)]
CURVE_LOW = [(0, 190), (500, 165), (750, 150), (1125, 110)]
aOk, bOk = interp(CURVE_OK, 500) + 55, interp(CURVE_OK, 783.8) + 55
aLow = interp(CURVE_LOW, 500) + 55
assert aOk >= 225.6 and bOk >= 94.6 and aLow < 225.6
txt = lambda c: '\n'.join(f'{f}, {p}' for f, p in c)
BEYOND = ('Assumption: past rated flow the pump curve is taken as a straight line from the rated point to 150% flow at 65% rated pressure '
          '(NFPA 20-2022 minimum). Use the certified curve to confirm.')
DUTY = ('Duty ≤ Rated Pressure: REVIEW — required net 170.6 psi > 168 psi (rated 160 + 5% tolerance): pump runs left of rated; '
        'confirm the certified curve covers the demand')
assert round(160 * 1.05, 1) == 168 and 170.6 > 168
BASE = PTS + [{'set': '#suctionMin', 'value': '55'}, {'set': '#suctionMax', 'value': '61'}]
cases += [
    {'id': 'pump-max-static', 'title': 'Churn 224 psi + max static suction 68.3 psi = 292.3 psi (300 psi components, under 300)',
     'source': 'NFPA 20-2022: churn + maximum static suction vs component rating', 'steps': dod(BASE + [{'set': '#maxStaticSuction', 'value': '68.3'}]),
     'reads': [{'sel': '#maxDischarge', 'label': 'Max discharge', 'unit': 'psi', 'ref': r(224 + 68.3, 1)},
               {'sel': '#dutyStatus', 'label': 'Duty REVIEW with reason (5% tolerance kept)', 'refText': DUTY},
               {'sel': '#beyondRatedNote', 'label': 'Past-rated assumption labeled (B is past rated)', 'refText': BEYOND},
               {'sel': '#demandPointsBody tr:nth-child(2) td:nth-child(5)', 'label': 'B pump net + suction (assumed)', 'unit': 'psi', 'ref': r(pump(783.8, CH) + 55, 1)}]},
    {'id': 'pump-curve-mode', 'title': 'Certified curve 0/500/750/1125 gpm, linear interpolation + 55 psi suction', 'source': 'Certified curve, linear interpolation',
     'steps': dod(BASE + [{'set': '#certMode', 'value': 'curve'}, {'set': '#certCurve', 'value': txt(CURVE_OK)}]),
     'reads': [{'sel': '#demandPointsBody tr:nth-child(1) .dp-curve', 'label': 'A vs curve', 'refText': f'PASS ({aOk:.1f} psi)'},
               {'sel': '#demandPointsBody tr:nth-child(2) .dp-curve', 'label': 'B vs curve', 'refText': f'PASS ({bOk:.1f} psi)'},
               {'sel': '#certResult', 'label': 'Curve overall', 'refText': 'PASS (curve, all points)'}]},
    {'id': 'pump-curve-low', 'title': 'Certified curve too low at 500 gpm (165 psi net + 55 < 225.6)', 'source': 'Certified curve, linear interpolation',
     'steps': dod(BASE + [{'set': '#certMode', 'value': 'curve'}, {'set': '#certCurve', 'value': txt(CURVE_LOW)}]),
     'reads': [{'sel': '#demandPointsBody tr:nth-child(1) .dp-curve', 'label': 'A vs curve', 'refText': f'FAIL ({aLow:.1f} psi)'},
               {'sel': '#certResult', 'label': 'Curve overall', 'refText': 'FAIL (curve)'}]},
    {'id': 'pump-curve-invalid', 'title': 'Certified curve validation: descending flows', 'source': 'Input validation',
     'steps': dod(BASE + [{'set': '#certMode', 'value': 'curve'}, {'set': '#certCurve', 'value': '0, 205\n750, 165\n500, 185'}]),
     'reads': [{'sel': '#certCurveMsg', 'label': 'Descending flows rejected', 'refText': 'Curve invalid: Flows must be ascending (750 then 500 gpm)'}]},
    {'id': 'pump-curve-short', 'title': 'Certified curve with 2 points', 'source': 'Input validation',
     'steps': dod(BASE + [{'set': '#certMode', 'value': 'curve'}, {'set': '#certCurve', 'value': '0, 205\n750, 165'}]),
     'reads': [{'sel': '#certCurveMsg', 'label': 'Fewer than 3 points rejected', 'refText': 'Curve invalid: At least 3 points required (2 entered)'}]},
]

# Items 5-8. NEC (2023) Table 430.250 FLC (three-phase induction); motor hp = Q P 2.31 / (3960 x 0.75) x 1.15 -> next standard hp.
hp100 = 750 * 145 * 2.31 / (3960 * 0.75) * 1.15
assert 75 < hp100 <= 100
RELIEF_E = 'Electric constant-speed: pressure relief valves are not permitted unless specifically required (NFPA 20-2022 4.20.1.1); select components rated for the maximum discharge.'
cases += [
    {'id': 'flc-100hp-480', 'title': f'Rated 750 gpm @ 145 psi -> {hp100:.1f} hp -> 100 hp at 480 V', 'source': 'NEC (2023) 430.6(A)(1), Table 430.250: 100 hp, 460 V = 124 A',
     'steps': dod([{'set': '#ratedGPM', 'value': '750'}, {'set': '#ratedPSI', 'value': '145'}, {'set': '#voltage', 'value': '480'}]),
     'reads': [{'sel': '#fla', 'label': 'FLC 100 hp, 460 V column', 'unit': 'A', 'ref': 124.0}]},
    {'id': 'flc-100hp-208', 'title': '100 hp at 208 V', 'source': 'NEC (2023) Table 430.250: 100 hp, 208 V = 273 A',
     'steps': dod([{'set': '#ratedGPM', 'value': '750'}, {'set': '#ratedPSI', 'value': '145'}, {'set': '#voltage', 'value': '208'}]),
     'reads': [{'sel': '#fla', 'label': 'FLC 100 hp, 208 V column', 'unit': 'A', 'ref': 273.0}]},
    {'id': 'hp-warn-static', 'title': 'Warning: churn 210 + max static 68.3 = 278.3 psi, electric (no relief valve suggestion)', 'source': 'NFPA 20-2022 4.20.1.1',
     'steps': dod(BASE + [{'set': '#churnPSIIn', 'value': '210'}, {'set': '#maxStaticSuction', 'value': '68.3'}]),
     'reads': [{'sel': '#highPressureMessage', 'label': 'Churn + max static suction', 'unit': 'psi', 'ref': 278.3},
               {'sel': '#highPressureMessage', 'label': 'Relief guidance (electric)', 'prop': 'textContent', 'refText':
                'Maximum discharge ≈ 278.3 PSI (churn 210.0 + max static suction 68.3). Exceeds 175 psi standard components: 300 psi rated components required. ' + RELIEF_E}]},
]

write('fire-pump-sizer', {'script': 'fire_pump_sizer.py', 'app': 'Fire Pump Sizer', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/fire_pump_sizer.py', 'flags': [], 'cases': cases})
print(avail, net, motor, fla, diesel, tank_hp, tank_rate, ocpd(363), ocpd(407.4))
