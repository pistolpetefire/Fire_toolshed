"""Fire Pump Sizer v2.5.0: the built-in DoD example plus diesel, breaker and churn cases, worked independently in Python.
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
               {'sel': '#fla', 'label': 'Motor full-load current', 'unit': 'A', 'ref': r(fla, 0)},
               {'sel': '#highPressureMessage', 'label': 'Churn shown at the 140% limit when no shutoff is entered', 'unit': 'psi', 'ref': r(1.4 * Pr_rated, 0)},
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

write('fire-pump-sizer', {'script': 'fire_pump_sizer.py', 'app': 'Fire Pump Sizer', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/fire_pump_sizer.py', 'flags': [], 'cases': cases})
print(avail, net, motor, fla, diesel, tank_hp, tank_rate, ocpd(363), ocpd(407.4))
