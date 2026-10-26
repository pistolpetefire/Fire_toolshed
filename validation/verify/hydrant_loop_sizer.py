"""Hydrant Loop Sizer: worked independently in Python (it never calls the app's JavaScript).
Method (NFPA 291 / NFPA 24 s11.1, hydrant-only supply):
  NFPA 291 available flow  Q_R = Q_F ((Ps - Pmin)/(Ps - Pr))^0.54
  supply curve             P(Q) = Ps - (Ps - Pr)(Q/Q_F)^1.85            (the app draws and reads this curve)
  Hazen-Williams           p = 4.52 Q^1.85 / (C^1.85 d^4.87) psi/ft, actual internal diameter d, so  v = 0.4085 Q / d^2
  Ring network             solved TWO independent ways here and asserted equal: (1) node-head nonlinear solve (scipy root on the junction
                           heads, flows from the head differences), (2) loop-closure with brentq. Sources are at equal head (the single
                           combined test curve evaluated at the total flow). The app uses a bisection on loop closure; these differ.
  Single break             "far" placement: open path of length L / sources carrying the break flow (spec 5.1 convention, conservative);
                           "even" placement: every segment is removed in turn and the worst case is kept.
  Hydrant residual         node pressure - arm friction (arm flow, arm size, arm length) - hydrant loss - 0.433 x elevation difference.
Pipe IDs: DI = OD - 2 x wall - 2 x lining (C151 PC 350 walls; C104 lining 1/16 in. up to 12 in., 3/32 in. at 16 in.), PVC/HDPE = OD (1 - 2/DR).
IFC Table B105.1(2) is retyped below as lo..hi area bands (not the app's upper-bound arrays) and tested at every band edge.
Conversions: 1 in. = 25.4 mm, 1 ft = 0.3048 m, 1 gpm = 3.785411784 L/min, 1 psi = 6.894757293 kPa."""
import math
from scipy.optimize import root, brentq
from ftverify import write, r

# ---------- pipe tables ----------
OD = {6: 6.90, 8: 9.05, 10: 11.10, 12: 13.20, 16: 17.40}
WALL350 = {6: 0.25, 8: 0.25, 10: 0.26, 12: 0.28, 16: 0.34}
LINING = {6: 1 / 16, 8: 1 / 16, 10: 1 / 16, 12: 1 / 16, 16: 3 / 32}
DI_ID_TABLE = {6: 6.28, 8: 8.43, 10: 10.46, 12: 12.52, 16: 16.53}   # published to 2 decimals
for n in OD:
    calc = OD[n] - 2 * WALL350[n] - 2 * LINING[n]
    assert abs(calc - DI_ID_TABLE[n]) < 0.006, (n, calc)
    assert abs(OD[n] * (1 - 2 / 18) - {6: 6.13, 8: 8.04, 10: 9.87, 12: 11.73, 16: 15.47}[n]) < 0.006
    assert abs(OD[n] * (1 - 2 / 11) - {6: 5.65, 8: 7.4, 10: 9.08, 12: 10.8, 16: 14.24}[n]) < 0.006
NOMINAL = {n: float(n) for n in OD}
DN = {6: 150, 8: 200, 10: 250, 12: 300, 16: 400}

# ---------- hydraulics ----------
def hw_rate(q, c, d):  # psi per ft
    return 4.52 * q ** 1.85 / (c ** 1.85 * d ** 4.87) if q > 0 else 0.0
def vel(q, d): return 0.4085 * q / d ** 2
def avail(ps, pr, qf, pmin): return qf * ((ps - pmin) / (ps - pr)) ** 0.54
def supply_p(ps, pr, qf, q): return ps - (ps - pr) * (q / qf) ** 1.85

def layout(L, nsrc, nh, placement):
    nodes = [(0.0, 'S', [])]
    if nsrc == 2: nodes.append((L / 2, 'S', []))
    if placement == 'even':
        for i in range(nh):
            hp = (i + 0.5) / nh * L
            # a hydrant that falls exactly on a connection is fed by that connection (no zero-length pipe); v1.0.1
            on = [k for k, nd in enumerate(nodes) if nd[1] == 'S' and abs(nd[0] - hp) < 1e-9 * L]
            if on: nodes[on[0]][2].append(i)
            else: nodes.append((hp, 'H', [i]))
    else:
        nodes.append((L / 4 if nsrc == 2 else L / 2, 'H', list(range(nh))))
    nodes.sort(key=lambda t: (t[0], t[1] != 'S'))
    return nodes

def edges_of(nodes, L, skip=None):
    n = len(nodes); out = []
    for i in range(n):
        j = (i + 1) % n
        ln = (nodes[j][0] - nodes[i][0]) if j else (L - nodes[i][0] + nodes[0][0])
        if i != skip: out.append((i, j, ln))
    return out

def solve_heads(nodes, edges, qh, k, head0):
    """Node-head method. Unknown: head of every non-source node. Returns heads and edge flows (positive i -> j)."""
    unk = [i for i, nd in enumerate(nodes) if nd[1] == 'H']
    dem = {i: len(nodes[i][2]) * qh for i in unk}
    if not unk: return [head0] * len(nodes), [0.0] * len(edges)   # every node is a connection: equal heads, no flow in the pipes
    def flows(h):
        f = []
        for (i, j, ln) in edges:
            dh = h[i] - h[j]
            f.append(math.copysign((abs(dh) / (k * ln)) ** (1 / 1.85), dh) if ln > 0 else 0.0)
        return f
    def resid(x):
        h = [head0] * len(nodes)
        for a, i in enumerate(unk): h[i] = x[a]
        f = flows(h); out = []
        for i in unk:
            net = sum(fl for (a, b, _), fl in zip(edges, f) if b == i) - sum(fl for (a, b, _), fl in zip(edges, f) if a == i)
            out.append(net - dem[i])
        return out
    best = None
    for method in ('hybr', 'lm'):
        for guess in (2, 10, 0.5, 5, 20, 40, 60, 120, 250, 800, 3000):
            sol = root(resid, [head0 - guess] * len(unk), method=method, tol=1e-13)
            if max(abs(v) for v in resid(sol.x)) < 1e-6: best = sol; break
        if best is not None: break
    assert best is not None, 'node-head solve failed'
    h = [head0] * len(nodes)
    for a, i in enumerate(unk): h[i] = best.x[a]
    return h, flows(h)

def solve_loop(nodes, L, qh, k):
    """Loop-closure method for the intact ring (flow in each arc found with brentq). Returns the head drop of every node."""
    n = len(nodes); src = [i for i, nd in enumerate(nodes) if nd[1] == 'S']; drop = {}
    for a_i, a in enumerate(src):
        b = src[(a_i + 1) % len(src)]
        idx = [a]; j = (a + 1) % n
        while True:
            idx.append(j)
            if j == b: break
            j = (j + 1) % n
        if len(src) == 1: idx = [(a + t) % n for t in range(n + 1)]
        segs = []
        for p, q2 in zip(idx[:-1], idx[1:]):
            segs.append((nodes[q2][0] - nodes[p][0]) if q2 != 0 else (L - nodes[p][0] + nodes[0][0]))
        dem = [len(nodes[i][2]) * qh for i in idx[1:-1]]
        def closure(x0):
            f = x0; g = 0
            for t, ln in enumerate(segs):
                g += math.copysign(hw_rate(abs(f), *k) * ln, f)
                if t < len(dem): f -= dem[t]
            return g
        D = sum(dem)
        x0 = brentq(closure, -D - 1, 2 * D + 1, xtol=1e-12)
        f = x0; acc = 0
        for t, ln in enumerate(segs[:-1]):
            acc += math.copysign(hw_rate(abs(f), *k) * ln, f); drop[idx[t + 1]] = acc; f -= dem[t]
    return drop

def run(c):
    """c: dict of inputs in US units. Returns per-size results."""
    ps, pr, qf, nh, qh0, L = c['ps'], c['pr'], c['qf'], c['nh'], c['qh'], c['L']
    nsrc, placement, bm = c.get('sources', 1), c.get('placement', 'far'), c.get('brk', 0.5)
    ids, C, rating = c['ids'], c['C'], c['rating']
    minres, arms = c.get('minres', 20.0), c.get('arms') or [(6, 0.0)] * nh
    hydl, fit = c.get('hydloss', 0.0), 1 + c.get('fit', 0) / 100
    he, ce, te = c.get('hydElev', 0.0), c.get('connElev', 0.0), c.get('testElev', 0.0)
    stat = 0.433 * (he - ce)
    out = {'qr': avail(ps, pr, qf, minres), 'Q': nh * qh0, 'sizes': {}}
    out['maxwork'] = ps + 0.433 * (te - min(ce, he, te))
    def hyd_res(nodeP_of_h, qh):
        res = []
        for h in range(nh):
            asz, alen = arms[h]; ad = ids[asz]
            res.append(nodeP_of_h[h] - hw_rate(qh, C, ad) * alen * fit - hydl - stat)
        return res
    for n in OD:
        d = ids[n]; k = 4.52 / (C ** 1.85 * d ** 4.87); kk = (C, d)
        nodes = layout(L, nsrc, nh, placement)
        def case(scale, brk_edge):
            qh = qh0 * scale; Qc = qh * nh
            pc = supply_p(ps, pr, qf, Qc) + 0.433 * (te - ce)
            edges = edges_of(nodes, L, brk_edge)
            h, f = solve_heads(nodes, edges, qh, k * fit, pc)
            node_of = {}
            for i, nd in enumerate(nodes):
                for hh in nd[2]: node_of[hh] = i
            # cross-check intact case with the loop-closure method (independent of the head solve)
            if brk_edge is None:
                dr = solve_loop(nodes, L, qh, (C, d))
                for i in dr:
                    if nodes[i][1] == 'H':
                        # loop method has no fit multiplier; rescale friction by fit (rate is linear in length)
                        assert abs((pc - h[i]) - dr[i] * fit) < 1e-5 * max(1, dr[i] * fit), (n, i, pc - h[i], dr[i] * fit)
            mv = max(vel(abs(fl), d) for fl in f)
            P = [h[node_of[hh]] for hh in range(nh)]
            return {'minres': min(hyd_res(P, qh)), 'maxvel': mv, 'P': P, 'h': h, 'f': f, 'edges': edges, 'res': hyd_res(P, qh), 'pc': pc}
        try: intact = case(1.0, None)
        except AssertionError: out['sizes'][n] = None; continue  # absurd heads (kilo-psi losses): the size fails by a wide margin
        row = {'id': d, 'vel': intact['maxvel'], 'res': intact['minres'], 'intact': intact}
        if bm > 0:
            if placement == 'even':
                cases = [case(bm, e) for e in range(len(nodes)) if edges_of(nodes, L)[e][2] > 1e-9]
                row['bres'] = min(x['minres'] for x in cases); row['bvel'] = max(x['maxvel'] for x in cases)
            else:
                plen = L / nsrc; Qc = nh * qh0 * bm; pc = supply_p(ps, pr, qf, Qc) + 0.433 * (te - ce)
                P = pc - hw_rate(Qc, C, d) * plen * fit
                row['bres'] = min(hyd_res([P] * nh, qh0 * bm)); row['bvel'] = vel(Qc, d)
        out['sizes'][n] = row
    out['arms'] = [(vel(qh0, ids[a]), hw_rate(qh0, C, ids[a]) * l * fit) for a, l in arms]
    return out

# ---------- IFC Table B105.1(2): lo..hi bands per construction group (retyped from the table text, not from the app) ----------
IFC_B105 = {  # gpm, hours, then (lo, hi) per column [I, IIA, IV, IIB, VB]; hi None = "greater than lo"
 1500: (2, [(0, 22700), (0, 12700), (0, 8200), (0, 5900), (0, 3600)]),
 1750: (2, [(22701, 30200), (12701, 17000), (8201, 10900), (5901, 7900), (3601, 4800)]),
 2000: (2, [(30201, 38700), (17001, 21800), (10901, 12900), (7901, 9800), (4801, 6200)]),
 2250: (2, [(38701, 48300), (21801, 24200), (12901, 17400), (9801, 12600), (6201, 7700)]),
 2500: (2, [(48301, 59000), (24201, 33200), (17401, 21300), (12601, 15400), (7701, 9400)]),
 2750: (2, [(59001, 70900), (33201, 39700), (21301, 25500), (15401, 18400), (9401, 11300)]),
 3000: (3, [(70901, 83700), (39701, 47100), (25501, 30100), (18401, 21800), (11301, 13400)]),
 3250: (3, [(83701, 97700), (47101, 54900), (30101, 35200), (21801, 25900), (13401, 15600)]),
 3500: (3, [(97701, 112700), (54901, 63400), (35201, 40600), (25901, 29300), (15601, 18000)]),
 3750: (3, [(112701, 128700), (63401, 72400), (40601, 46400), (29301, 33500), (18001, 20600)]),
 4000: (4, [(128701, 145900), (72401, 82100), (46401, 52500), (33501, 37900), (20601, 23300)]),
 4250: (4, [(145901, 164200), (82101, 92400), (52501, 59100), (37901, 42700), (23301, 26300)]),
 4500: (4, [(164201, 183400), (92401, 103100), (59101, 66000), (42701, 47700), (26301, 29300)]),
 4750: (4, [(183401, 203700), (103101, 114600), (66001, 73300), (47701, 53000), (29301, 32600)]),
 5000: (4, [(203701, 225200), (114601, 126700), (73301, 81100), (53001, 58600), (32601, 36000)]),
 5250: (4, [(225201, 247700), (126701, 139400), (81101, 89200), (58601, 65400), (36001, 39600)]),
 5500: (4, [(247701, 271200), (139401, 152600), (89201, 97700), (65401, 70600), (39601, 43400)]),
 5750: (4, [(271201, 295900), (152601, 166500), (97701, 106500), (70601, 77000), (43401, 47400)]),
 6000: (4, [(295901, None), (166501, None), (106501, 115800), (77001, 83700), (47401, 51500)]),
 6250: (4, [None, None, (115801, 125500), (83701, 90600), (51501, 55700)]),
 6500: (4, [None, None, (125501, 135500), (90601, 97900), (55701, 60200)]),
 6750: (4, [None, None, (135501, 145800), (97901, 106800), (60201, 64800)]),
 7000: (4, [None, None, (145801, 156700), (106801, 113200), (64801, 69600)]),
 7250: (4, [None, None, (156701, 167900), (113201, 121300), (69601, 74600)]),
 7500: (4, [None, None, (167901, 179400), (121301, 129600), (74601, 79800)]),
 7750: (4, [None, None, (179401, 191400), (129601, 138300), (79801, 85100)]),
 8000: (4, [None, None, (191401, None), (138301, None), (85101, None)]),
}
COLS = ['I', 'IIA', 'IV', 'IIB', 'VB']
def table_lookup(col, area):
    ci = COLS.index(col)
    for gpm, (hrs, bands) in IFC_B105.items():
        b = bands[ci]
        if b is None: continue
        lo, hi = b
        if area >= lo and (hi is None or area <= hi): return gpm, hrs
    return None
def ifc_reduced(table_gpm, kind):
    red = 0.25 * table_gpm
    return max(red, 1500 if kind == 'r' else 1000)
def dod_hydrants(q): return math.ceil(q / 1250 - 1e-12)

def cs(c):  # app state (US units) for a case, as a JS object literal
    import json
    return json.dumps(c)

cases = []
def add(cid, title, steps, reads, source='See script header'):
    cases.append({'id': cid, 'title': title, 'source': source, 'steps': steps, 'reads': reads})
def rd(sel, label, unit, ref, digits=4, **kw):
    d = {'sel': sel, 'label': label, 'unit': unit, 'ref': r(ref, digits)}; d.update(kw); return d

DI = dict(ids=DI_ID_TABLE, C=140, rating=350)
def state(app_extra):
    base = {'basis': 'dod', 'edition': 'c6', 'ps': 68.3, 'pr': 61.2, 'qf': 1250, 'qreq': 5000, 'nHyd': 4, 'qh': 1250, 'loopLen': 2000, 'sources': 1,
            'placement': 'far', 'material': 'di', 'breakMode': '50', 'maxVel': 10}
    base.update(app_extra); return base

# Case 1: SEA ATCT flow test, DI, 4 hydrants x 1,250 gpm. The supply cannot deliver 5,000 gpm (supply-limited).
sea = dict(ps=68.3, pr=61.2, qf=1250, nh=4, qh=1250, L=2000, **DI)
R = run(sea)
assert abs(R['qr'] - 3520.16) < 0.01
add('sea', 'SEA flow test 68.3 / 61.2 psi at 1,250 gpm; 4 hydrants x 1,250 gpm, 2,000 ft DI loop (illustrative); supply-limited', [{'click': '#btnExSea'}],
    [rd('#mQr', 'Available flow at 20 psi (NFPA 291, exponent 0.54)', 'gpm', R['qr'], 1), rd('#mDemand', 'Demand', 'gpm', R['Q'], 0),
     rd('#mDropPct', 'Test drop', '%', 100 * (68.3 - 61.2) / 68.3, 2), rd('#mWork', 'Max working pressure', 'psi', R['maxwork'], 2),
     rd('#sz-12-vel', 'Intact velocity, 12 in. DI (ID 12.52), 2,500 gpm each way', 'ft/s', R['sizes'][12]['vel'], 3),
     rd('#sz-10-vel', 'Intact velocity, 10 in. DI (ID 10.46)', 'ft/s', R['sizes'][10]['vel'], 3),
     rd('#hy-1-av', 'Arm velocity, 6 in. DI arm at 1,250 gpm', 'ft/s', R['arms'][0][0], 3)])
print('SEA qr', R['qr'], 'v12', R['sizes'][12]['vel'], 'arm v', R['arms'][0][0])

# Case 2: spec 5.1 loop (nominal IDs, C 140): 2 hydrants x 1,250 gpm, 1,000 ft each way, 50% break on a 2,000 ft path
nom = dict(ps=68.3, pr=61.2, qf=1250, nh=2, qh=1250, L=2000, ids=NOMINAL, C=140, rating=150)
R = run(nom); s8 = R['sizes'][8]
st = state({'nHyd': 2, 'qreq': 2500, 'material': 'custom', 'displaySize': 8, 'custom': {'c': 140, 'rating': 150, 'ids': {'6': 6, '8': 8, '10': 10, '12': 12, '16': 16}}})
add('spec51', 'Spec 5.1 loop: nominal IDs, C 140, 2 hydrants x 1,250 gpm at the far point, 1,000 ft each way, 50% break on the 2,000 ft path',
    [{'call': 'HLSApp.load(%s)' % cs(st)}],
    [rd('#sz-8-vel', '8 in. intact velocity', 'ft/s', s8['vel'], 3), rd('#sz-8-res', '8 in. intact min residual', 'psi', s8['res'], 3),
     rd('#sz-8-bvel', '8 in. break velocity (1,250 gpm)', 'ft/s', s8['bvel'], 3), rd('#sz-8-bres', '8 in. break min residual', 'psi', s8['bres'], 3),
     rd('#sz-6-vel', '6 in. intact velocity (over the 10 ft/s limit)', 'ft/s', R['sizes'][6]['vel'], 3), rd('#sz-6-bres', '6 in. break min residual (fails)', 'psi', R['sizes'][6]['bres'], 3),
     rd('#sz-10-res', '10 in. intact min residual', 'psi', R['sizes'][10]['res'], 3), rd('#sz-12-bres', '12 in. break min residual', 'psi', R['sizes'][12]['bres'], 3),
     rd('#sg-1-loss', '8 in. segment 1 loss, 1,250 gpm over 1,000 ft', 'psi', hw_rate(1250, 140, 8) * 1000, 3)])
print('spec51 8in', s8['vel'], s8['res'], s8['bvel'], s8['bres'], '6in', R['sizes'][6]['res'], R['sizes'][6]['bres'])

# Case 3: two connections, hydrants evenly spaced, arms with length, 100% break, DI
big = dict(ps=90, pr=80, qf=3000, nh=6, qh=1000, L=4000, sources=2, placement='even', brk=1.0, minres=20.0,
           arms=[(6, 50.0), (6, 100.0), (8, 150.0), (6, 0.0), (6, 100.0), (8, 40.0)], **DI)
R = run(big); s10 = R['sizes'][10]; s8b = R['sizes'][8]
armsApp = [{'size': a, 'len': l} for a, l in big['arms']]
st3 = state({'ps': 90, 'pr': 80, 'qf': 3000, 'qreq': 6000, 'nHyd': 6, 'qh': 1000, 'loopLen': 4000, 'sources': 2, 'placement': 'even', 'breakMode': '100', 'arms': armsApp, 'displaySize': 10})
reads3 = [rd('#mQr', 'Available flow at 20 psi', 'gpm', R['qr'], 1), rd('#sz-8-vel', '8 in. intact velocity', 'ft/s', s8b['vel'], 3), rd('#sz-8-res', '8 in. intact min residual', 'psi', s8b['res'], 3),
          rd('#sz-8-bvel', '8 in. worst single-break velocity', 'ft/s', s8b['bvel'], 3), rd('#sz-8-bres', '8 in. worst single-break min residual', 'psi', s8b['bres'], 3),
          rd('#sz-10-res', '10 in. intact min residual', 'psi', s10['res'], 3), rd('#sz-10-bres', '10 in. worst single-break min residual', 'psi', s10['bres'], 3),
          rd('#hy-2-al', 'Arm loss H2 (6 in. x 100 ft, 1,000 gpm)', 'psi', R['arms'][1][1], 3), rd('#hy-3-al', 'Arm loss H3 (8 in. x 150 ft)', 'psi', R['arms'][2][1], 3),
          rd('#hy-3-av', 'Arm velocity H3 (8 in.)', 'ft/s', R['arms'][2][0], 3),
          rd('#hy-1-np', 'Main pressure at H1 (10 in. loop)', 'psi', s10['intact']['P'][0], 3), rd('#hy-1-res', 'Residual at H1', 'psi', s10['intact']['res'][0], 3),
          rd('#hy-5-res', 'Residual at H5 (10 in. loop, 100 ft arm)', 'psi', s10['intact']['res'][4], 3)]
add('even2', '6 hydrants x 1,000 gpm evenly spaced on a 4,000 ft DI loop, 2 connections, arms with lengths, 100% single break', [{'call': 'HLSApp.load(%s)' % cs(st3)}], reads3)
print('even2 8in', s8b['vel'], s8b['res'], s8b['bvel'], s8b['bres'], '10in', s10['res'], s10['bres'])

# Case 4: the same case in metric (DN, m, L/min, kPa): every displayed value must equal the US value converted
KPA, LPM, FT = 6.894757293, 3.785411784, 0.3048
reads4 = [rd('#mQr', 'Available flow (L/min)', 'L/min', R['qr'] * LPM, 0), rd('#sz-8-vel', '8 in. (DN200) intact velocity', 'm/s', s8b['vel'] * FT, 3),
          rd('#sz-8-res', 'DN200 intact min residual', 'kPa', s8b['res'] * KPA, 1), rd('#sz-8-bres', 'DN200 worst single-break min residual', 'kPa', s8b['bres'] * KPA, 1),
          rd('#sz-10-res', 'DN250 intact min residual', 'kPa', s10['res'] * KPA, 1), rd('#sz-10-bres', 'DN250 worst single-break min residual', 'kPa', s10['bres'] * KPA, 1),
          rd('#hy-2-al', 'Arm loss H2', 'kPa', R['arms'][1][1] * KPA, 1), rd('#hy-3-av', 'Arm velocity H3', 'm/s', R['arms'][2][0] * FT, 3),
          rd('#hy-1-np', 'Main pressure at H1', 'kPa', s10['intact']['P'][0] * KPA, 1), rd('#hy-1-q', 'Flow per hydrant', 'L/min', 1000 * LPM, 0)]
add('even2-metric', 'Same loop switched to metric (DN, m, L/min, kPa): values equal the US results converted', [{'call': 'HLSApp.load(%s)' % cs(st3)}, {'set': '#unitSystem', 'value': 'metric'}], reads4)
# bar and m3/h
reads5 = [rd('#mQr', 'Available flow (m3/h)', 'm3/h', R['qr'] * 0.2271247070, 1), rd('#sz-10-res', 'DN250 intact min residual', 'bar', s10['res'] * 0.06894757293, 2), rd('#hy-1-q', 'Flow per hydrant', 'm3/h', 1000 * 0.2271247070, 1)]
add('even2-m3h-bar', 'Same loop with m3/h and bar', [{'call': 'HLSApp.load(%s)' % cs(st3)}, {'set': '#unitSystem', 'value': 'metric'}, {'set': '#flowUnit', 'value': 'm3h'}, {'set': '#pressUnit', 'value': 'bar'}], reads5)

# Case 4b (v1.0.1): hydrants that fall exactly on a connection (even placement). A hydrant on a connection is fed by it directly:
# no zero-length pipe segment, no flow in the main for 1 hydrant / 2 connections.
for cid, nh_, qreq_, title in [('src-hyd-1h2s', 1, 1250, '1 hydrant x 1,250 gpm, 2 connections, even placement: the hydrant sits on connection 2 (SEA test, 2,000 ft DI loop)'),
                               ('src-hyd-3h2s', 3, 3750, '3 hydrants x 1,250 gpm, 2 connections, even placement: the middle hydrant sits on connection 2 (SEA test, 2,000 ft DI loop)')]:
    cfg = dict(ps=68.3, pr=61.2, qf=1250, nh=nh_, qh=1250, L=2000, sources=2, placement='even', **DI)
    Rs = run(cfg); s6 = Rs['sizes'][6]; s8_ = Rs['sizes'][8]
    sts = state({'nHyd': nh_, 'qreq': qreq_, 'sources': 2, 'placement': 'even', 'displaySize': 6})
    rds = [rd('#sz-6-vel', '6 in. intact velocity (max over live pipe segments)', 'ft/s', s6['vel'], 3), rd('#sz-6-res', '6 in. intact min residual', 'psi', s6['res'], 3),
           rd('#sz-6-bvel', '6 in. break velocity', 'ft/s', s6['bvel'], 3), rd('#sz-6-bres', '6 in. break min residual', 'psi', s6['bres'], 3),
           rd('#sz-8-vel', '8 in. intact velocity', 'ft/s', s8_['vel'], 3), rd('#sz-8-res', '8 in. intact min residual', 'psi', s8_['res'], 3),
           rd('#hy-1-av', 'Arm velocity H1 (6 in. DI arm, 1,250 gpm)', 'ft/s', Rs['arms'][0][0], 3)]
    add(cid, title, [{'call': 'HLSApp.load(%s)' % cs(sts)}], rds)
    print(cid, '6in vel', s6['vel'], 'res', s6['res'], 'bvel', s6['bvel'], 'bres', s6['bres'], '| 8in vel', s8_['vel'], 'res', s8_['res'])

# Case 5: SEA in metric: displayed metric values equal the US values converted
Rsea = run(sea)
add('sea-metric', 'SEA case in metric: 470.9 / 422.0 kPa at 4,732 L/min', [{'click': '#btnExSea'}, {'set': '#unitSystem', 'value': 'metric'}],
    [rd('#mQr', 'Available flow at 138 kPa (20 psi)', 'L/min', Rsea['qr'] * LPM, 0), rd('#mDemand', 'Demand', 'L/min', 5000 * LPM, 0),
     rd('#mWork', 'Max working pressure', 'kPa', 68.3 * KPA, 0), rd('#sz-12-vel', 'DN300 intact velocity', 'm/s', Rsea['sizes'][12]['vel'] * FT, 3),
     rd('#hy-1-av', 'Arm velocity (DN150 arm)', 'm/s', Rsea['arms'][0][0] * FT, 3)])

# Case 6: code-table lookups (engine reads typed independently above). Every band edge of every column.
lookups = []
for col in COLS:
    ci = COLS.index(col)
    for gpm, (hrs, bands) in IFC_B105.items():
        b = bands[ci]
        if b is None: continue
        lo, hi = b
        if hi is not None: lookups.append((col, hi, gpm))
checks = []
for col, area, gpm in lookups:
    assert table_lookup(col, area)[0] == gpm
    checks.append({'expr': "HLSEngine.tableFlow('%s', %d).gpm" % (col, area), 'label': 'IFC B105.1(2) %s, %s sq ft' % (col, f'{area:,}'), 'unit': 'gpm', 'ref': float(gpm)})
# a few more explicit edges: one above each upper band edge goes to the next row
for col, area, gpm in [('I', 22701, 1750), ('IIB', 5901, 1750), ('VB', 85101, 8000), ('IV', 191401, 8000), ('IIA', 166501, 6000), ('I', 295901, 6000)]:
    assert table_lookup(col, area)[0] == gpm
    checks.append({'expr': "HLSEngine.tableFlow('%s', %d).gpm" % (col, area), 'label': 'IFC B105.1(2) %s, %s sq ft (one above an upper edge)' % (col, f'{area:,}'), 'unit': 'gpm', 'ref': float(gpm)})
add('ifc-table', 'IFC Table B105.1(2) (also NFPA 1 Table 18.4.5.2.1 numbers, flag S): lookup at every band edge (upper edge of every row, all five columns)', [], checks, 'IFC 2024 Table B105.1(2); flag S')

# Case 7: reductions, DoD hydrant count, IFC C102
red = []
for area, col, kind in [(203701, 'I', 's13'), (59000, 'I', 's13'), (59000, 'I', 's13r'), (295901, 'I', 's13r'), (12000, 'IV', 's13')]:
    tg = table_lookup(col, area)[0]
    red.append({'expr': "HLSEngine.requiredFireFlow('ifc','%s',%d,'%s').gpm" % (col, area, kind), 'label': 'IFC %s %s sq ft, %s: 25%% of %s gpm, floor %s' % (col, f'{area:,}', kind, f'{tg:,}', '1,500' if kind == 's13r' else '1,000'), 'unit': 'gpm', 'ref': float(ifc_reduced(tg, 'r' if kind == 's13r' else 's'))})
for q in (1250, 2500, 2501, 3750, 3751, 5000):
    red.append({'expr': "HLSEngine.hydrantsFor('dod',%d).n" % q, 'label': 'DoD hydrants for %s gpm at 1,250 gpm each' % f'{q:,}', 'unit': 'hydrants', 'ref': float(dod_hydrants(q))})
C102 = [(1750, 1), (2250, 2), (2750, 3), (3250, 3), (4000, 4), (5000, 5), (5500, 6), (6000, 6), (7000, 7)]
def c102(q):
    for hi, n in C102:
        if q <= hi: return n
    return max(8, math.ceil(q / 1000))
for q in (1750, 1751, 2250, 2251, 4000, 4001, 5000, 5001, 7000, 7001, 9500):
    red.append({'expr': "HLSEngine.hydrantsFor('ifc',%d).n" % q, 'label': 'IFC C102.1 hydrants for %s gpm' % f'{q:,}', 'unit': 'hydrants', 'ref': float(c102(q))})
add('reductions', 'Sprinkler reduction (IFC B105.2), DoD hydrant count, IFC Table C102.1 hydrant count', [], red, 'IFC B105.2, C102.1; UFC 3-600-01')

# Case 8: hand checks of the Hazen-Williams rate and velocity table (spec 4.4 style, nominal IDs, C 140)
hwc = []
for n in (6, 8, 10, 12, 16):
    hwc.append({'expr': "HLSEngine.hwRate(1250,140,%d)" % n, 'label': 'H-W rate, 1,250 gpm, C 140, %d in. nominal ID' % n, 'unit': 'psi/ft', 'ref': r(hw_rate(1250, 140, n), 6)})
    hwc.append({'expr': "HLSEngine.velocity(1250,%d)" % n, 'label': 'Velocity, 1,250 gpm, %d in. nominal ID' % n, 'unit': 'ft/s', 'ref': r(vel(1250, n), 4)})
for n in (6, 8, 10, 12, 16):
    hwc.append({'expr': "HLSEngine.hwRate(1250,140,%s)" % DI_ID_TABLE[n], 'label': 'H-W rate, 1,250 gpm, C 140, DI ID %s in.' % DI_ID_TABLE[n], 'unit': 'psi/ft', 'ref': r(hw_rate(1250, 140, DI_ID_TABLE[n]), 6)})
for q in (1500, 2500, 3500):
    hwc.append({'expr': "HLSEngine.supplyPressure(68.3,61.2,1250,%d)" % q, 'label': 'Supply curve pressure at %d gpm' % q, 'unit': 'psi', 'ref': r(supply_p(68.3, 61.2, 1250, q), 4)})
add('hw', 'Hazen-Williams rates, velocities and the supply curve (engine read, independent Python values)', [], hwc, 'NFPA 24 s11.1; NFPA 291')

write('hydrant-loop-sizer', {'script': 'hydrant_loop_sizer.py', 'app': 'Hydrant Loop Sizer', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/hydrant_loop_sizer.py', 'flags': [], 'cases': cases})
