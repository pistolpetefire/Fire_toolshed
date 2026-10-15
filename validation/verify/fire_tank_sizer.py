"""Fire Tank Sizer: worked independently in Python.
Base volume = flow x duration. Usable target = base x (1 + planning %), shell = usable / (1 - unusable %) (the app's stated planning method;
confirm NFPA 22 effective capacity and the governing duration per project and AHJ).
Shell capacity = pi/4 D^2 H x 7.48052 gal/ft3. Selection: smallest catalog tank (diameters 11 to 48 ft, heights 8 to 32 ft) whose computed
volume covers the required shell within the height and diameter limits. Pad diameter = D + 2 x offset."""
import math
from ftverify import write, r
G = 7.48052
dias = [11, 13.5, 15.5, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48]
hts = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32]
def cyl(d, h): return math.pi * (d / 2) ** 2 * h * G
cat = []
for d in dias:
    for h in hts:
        nom = round(cyl(d, h) / 500) * 500
        if 4000 <= nom <= 400000: cat.append((nom, h, d, round(cyl(d, h))))
cat.sort(key=lambda t: (t[0], t[1]))
def solve(flow, dur, pct, unus, maxH, maxD, beyond):
    base = flow * dur; req = base * (1 + pct / 100) / (1 - unus / 100)
    t = next(t for t in cat if t[1] <= maxH and t[2] <= maxD and t[3] >= req)
    return base, req, t[3], t[2] + 2 * beyond
cases = []
for cid, title, steps, args in [
    ('defaults', 'Defaults: 1250 gpm x 60 min, NFPA planning +5%, 5% unusable, max 24 ft H x 40 ft D', [], (1250, 60, 5, 5, 24, 40, 2)),
    ('custom', '1000 gpm x 90 min, +10%, 8% unusable, max 20 ft H x 48 ft D, pad 3 ft beyond',
     [{'set': '#flowGpm', 'value': '1000'}, {'set': '#durationMin', 'value': '90'}, {'set': '#safetyPct', 'value': '10'}, {'set': '#unusablePct', 'value': '8'},
      {'set': '#maxHeightFt', 'value': '20'}, {'set': '#maxDiaFt', 'value': '48'}, {'set': '#padBeyondFt', 'value': '3'}], (1000, 90, 10, 8, 20, 48, 3)),
]:
    base, req, tank, pad = solve(*args)
    cases.append({'id': cid, 'title': title, 'source': 'See script header', 'steps': steps,
                  'reads': [{'sel': '#metricBase', 'label': 'Base volume', 'unit': 'gal', 'ref': r(base, 0)},
                            {'sel': '#metricRequired', 'label': 'Required shell volume', 'unit': 'gal', 'ref': r(req, 0)},
                            {'sel': '#metricTank', 'label': 'Selected tank shell', 'unit': 'gal', 'ref': r(tank, 0)},
                            {'sel': '#metricPad', 'label': 'Pad diameter', 'unit': 'ft', 'ref': r(pad, 1)}]})
    print(cid, base, req, tank, pad)
write('fire-tank-sizer', {'script': 'fire_tank_sizer.py', 'app': 'Fire Tank Sizer', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/fire_tank_sizer.py', 'flags': [], 'cases': cases})
