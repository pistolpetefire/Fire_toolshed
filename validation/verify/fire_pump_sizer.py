"""Fire Pump Sizer: the built-in DoD example plus a diesel variant, worked independently in Python.
Supply curve: NFPA 291 N^1.85 form, P(Q) = Ps - (Ps - Pr)(Q/Qt)^1.85. Head: ft = psi x 2.31.
Pump power: water hp = Q H / 3960; brake hp = water hp / efficiency, with the app's stated 0.75 pump efficiency,
then the app's stated 1.15 (electric) or 1.2 (diesel) driver margin.
Motor full-load current, 3-phase: I = hp x 746 / (sqrt(3) V eff pf), with the app's stated eff 0.90 and pf 0.85.
Churn: shutoff at the NFPA 20 limit of 140% of rated pressure (the app's assumed curve).
Diesel fuel tank: NFPA 20 11.4.1.2, at least 1 gal per engine hp plus 5% for expansion and 5% for sump."""
import math
from ftverify import write, r
Ps, Pr, Qt, Q, Psys, Qr, Pr_rated, V = 58, 35, 1500, 1750, 105, 2000, 125, 480
avail = Ps - (Ps - Pr) * (Q / Qt) ** 1.85
net = Psys - avail
bhp = Qr * Pr_rated * 2.31 / (3960 * 0.75)
motor = bhp * 1.15
fla = motor * 746 / (math.sqrt(3) * V * 0.90 * 0.85)
diesel = bhp * 1.2
tank_nfpa20 = diesel * 1.10
FUEL_FLAG = ('Diesel fuel tank: the app sizes 0.055 gal/hp-h x runtime x 1.2 (about 0.53 gal per hp at 8 h). NFPA 20 11.4.1.2 requires at least 1 gal per hp '
             'plus 5% expansion and 5% sump, so the app shows about half the required capacity (non-conservative). Not changed; for Kevin to review.')
BRK_FLAG = ('Motor breaker: the app shows 125% of FLA rounded up to 5 A. NEC 695.4(B)(2) sizes fire pump overcurrent devices to carry the locked-rotor current '
            'indefinitely, so this value is not an NEC 695 basis. Not checked here; for Kevin to review.')
CHURN_FLAG = ('The Performance tab "Churn <= 140% rated" check always passes: churn is assumed to be exactly 1.4 x rated, so it is not a computed check. Not changed.')
cases = [
    {'id': 'dod-electric', 'title': 'DoD example (electric, 480 V)', 'source': 'See script header', 'steps': [{'click': '#btnDoD', 'wait': 600}],
     'reads': [{'sel': '#availableAtFlow', 'label': 'Available supply at 1750 gpm', 'unit': 'psi', 'ref': r(avail, 1)},
               {'sel': '#netPumpPressure', 'label': 'Pressure the pump must add', 'unit': 'psi', 'ref': r(net, 1)},
               {'sel': '#motorHP', 'label': 'Motor hp (incl. 1.15)', 'unit': 'hp', 'ref': r(motor, 1)},
               {'sel': '#fla', 'label': 'Motor full-load current', 'unit': 'A', 'ref': r(fla, 0)},
               {'sel': '#highPressureMessage', 'label': 'Churn pressure (140% rated)', 'unit': 'psi', 'ref': r(1.4 * Pr_rated, 0)}]},
    {'id': 'dod-diesel', 'title': 'DoD example switched to diesel, 8 h', 'source': 'See script header; NFPA 20 11.4.1.2',
     'steps': [{'click': '#btnDoD', 'wait': 600}, {'set': 'input[name="driverType"][value="diesel"]', 'value': True, 'wait': 300}, {'click': '#btnRecalc', 'wait': 300}],
     'reads': [{'sel': '#dieselHP', 'label': 'Engine hp (incl. 1.2)', 'unit': 'hp', 'ref': r(diesel, 1)},
               {'sel': '#fuelTank', 'label': 'Minimum fuel tank (NFPA 20: 1 gal/hp + 10%)', 'unit': 'gal', 'ref': r(tank_nfpa20, 0), 'flag': FUEL_FLAG}]},
]
write('fire-pump-sizer', {'script': 'fire_pump_sizer.py', 'app': 'Fire Pump Sizer', 'appVersion': '2.3.0',
      'handcalc': 'validation/verify/fire_pump_sizer.py', 'flags': [FUEL_FLAG, BRK_FLAG, CHURN_FLAG], 'cases': cases})
print(avail, net, motor, fla, diesel, tank_nfpa20)
