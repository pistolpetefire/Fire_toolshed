"""MAQ & Control Area Calculator: independent Python check of IFC 2024 Table 5003.1.1(1)/(2) MAQs and Table 5003.8.3.2.
Base values typed from the 2024 IFC tables (same in 2021 except the 2024 flammable-gas Category 1B Low BV rows):
  Flammable liquid IB/IC: storage 120 gal (d, e), use-closed 120 (d), use-open 30 (d); IA 30 / 30 / 10.
  Combustible liquid IIIB: 13,200 (e, f) / 13,200 (f) / 3,300 (f); note f = not limited when sprinklered throughout.
  Corrosive liquid (health): 500 / 500 / 100 gal, Group H-4 when exceeded (IBC 307.6).
  Note d = x2 sprinklered (903.3.1.1); note e = x2 approved cabinets; cumulative.
Table 5003.8.3.2: story 1 = 100 % / 4 control areas; story 3 = 50 % / 2; story 2 below grade = 50 % / 2."""
import json
from ftverify import write

def maq(base, notes, sprk, cab, pct):
    if 'f' in notes and sprk:
        return 'Not limited'
    f = (2 if ('d' in notes and sprk) else 1) * (2 if ('e' in notes and cab) else 1)
    return base * f * pct / 100

def num_or_text(v):
    return v if isinstance(v, str) else float(v)

def case(cid, title, proj, reads):
    return {'id': cid, 'title': title, 'source': 'IFC 2024 Tables 5003.1.1(1)/(2), 5003.8.3.2 (see script header)',
            'steps': [{'call': 'MAQApp.load(' + json.dumps(proj) + ')', 'wait': 300}], 'reads': reads}

def rd(sel, label, v, unit='gal'):
    if isinstance(v, str):
        return {'sel': sel, 'label': label, 'refText': v}
    return {'sel': sel, 'label': label, 'unit': unit, 'ref': float(v)}

S = {'edition': '2024', 'sprinklered': True, 'story': 'A1', 'controlAreas': 1}
cases = [
    case('ib-220', 'Class IB, sprinklered, no cabinets, 220 gal storage', dict(S, materials=[{'key': 'fl-IBIC', 'storage': 220}]),
         [rd('#r-fl-IBIC-storage-maq', 'Storage MAQ', maq(120, 'de', True, False, 100)), rd('#r-fl-IBIC-storage-res', 'Result', 'PASS'),
          rd('#hDecision', 'Decision', 'Group H not required')]),
    case('ib-275', 'Class IB, sprinklered, no cabinets, 275 gal storage', dict(S, materials=[{'key': 'fl-IBIC', 'storage': 275}]),
         [rd('#r-fl-IBIC-storage-res', 'Result', 'FAIL'), rd('#hDecision', 'Decision', 'Group H required: H-3')]),
    case('ib-cab', 'Class IB, sprinklered, in approved cabinets', dict(S, materials=[{'key': 'fl-IBIC', 'storage': 470, 'cabinet': True}]),
         [rd('#r-fl-IBIC-storage-maq', 'Storage MAQ', maq(120, 'de', True, True, 100)), rd('#r-fl-IBIC-storage-res', 'Result', 'PASS')]),
    case('used-oil', 'Used oil, Class IIIB, sprinklered', dict(S, materials=[{'key': 'cl-IIIB', 'storage': 20000}]),
         [rd('#r-cl-IIIB-storage-maq', 'Storage MAQ', maq(13200, 'ef', True, False, 100)), rd('#r-cl-IIIB-storage-res', 'Result', 'PASS')]),
    case('corrosive', 'Corrosive liquid 1,200 gal, sprinklered, no cabinets (health hazard)', dict(S, materials=[{'key': 'cor-l', 'storage': 1200}]),
         [rd('#r-cor-l-storage-maq', 'Storage MAQ', maq(500, 'de', True, False, 100)), rd('#hDecision', 'Decision', 'Group H required: H-4')]),
    case('story3', 'Class IB on story 3, sprinklered, 2 control areas', dict(S, story='A3', controlAreas=2, materials=[{'key': 'fl-IBIC', 'storage': 100}]),
         [rd('#r-fl-IBIC-storage-maq', 'Storage MAQ', maq(120, 'de', True, False, 50)), rd('#caPct', '% of MAQ', '50%')]),
    case('report', 'Printable report carries PASS/FAIL per material and the H-3 call (275 gal IB)', dict(S, materials=[{'key': 'fl-IBIC', 'storage': 275}]),
         [{'expr': "(function(h){return /<td>FAIL<\\/td>/.test(h) && h.indexOf('Exceeds MAQ \u2192 H-3')>=0 ? 'yes' : 'no'})(MAQApp.reportHtml())", 'label': 'Report shows FAIL and H-3', 'refText': 'yes'}]),
    case('unsprk', 'Class IB, not sprinklered, no cabinets', dict(S, sprinklered=False, materials=[{'key': 'fl-IBIC', 'storage': 100}]),
         [rd('#r-fl-IBIC-storage-maq', 'Storage MAQ', maq(120, 'de', False, False, 100))]),
]
write('maq-control-area', {'script': 'maq_control_area.py', 'app': 'MAQ & Control Area Calculator', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/maq_control_area.py', 'flags': [], 'cases': cases})
for c in cases:
    print(c['id'], [r.get('ref', r.get('refText')) for r in c['reads']])
