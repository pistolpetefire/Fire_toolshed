"""Occupant Load & Egress Capacity: worked independently in Python.
Occupant load: area / load factor (IBC Table 1004.5; NFPA 101 Table 7.3.1.2), app rounds to the nearest whole person.
Egress capacity: IBC 1005.3.1 / 1005.3.2 and NFPA 101 7.3.3.1: stairs 0.3 in/occ (0.2 sprinklered), other components 0.2 in/occ (0.15 sprinklered);
capacity = floor(clear width / factor) per component.
Travel limits: IBC Table 1017.2."""
import math
from ftverify import write, r
SP = '#spaceBody tr[data-space] '
EG = '#egressBody tr[data-egress]'
def cap(w, f): return math.floor(w / f + 1e-9)
SRC = 'IBC 2021 Table 1017.2; IBC 1017.2.2; IBC Table 1004.5; NFPA 101 (2018+) Table 7.3.1.2'
FIXED = ('Fixed in v1.2.0: IBC travel limits by subgroup per IBC 2021 Table 1017.2 (S-1/F-1 250/200, S-2/F-2/U 400/300, H-1..H-5 75/100/150/175/200 '
         'sprinklered only, I-1 250 and I-2/I-3 200 sprinklered only, I-4 200/150), opt-in IBC 1017.2.2 F-1/S-1 400 ft; IBC warehouses 500 gross added '
         '(storage/stock/shipping stays 300); NFPA 101 business 150 gross (2018+). Saved v1.1.0 groups F/S/H/I migrate to F-1/S-1/H-1/I-2/I-3 (most restrictive).')
cases = [
    {'id': 'ibc-spr', 'title': 'IBC, B, sprinklered: 1500 sf business, two 36 in doors', 'source': 'IBC 1004.5, 1005.3.2', 'steps': [{'click': '#pickIbc', 'wait': 400}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': round(1500 / 150)},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': 2 * cap(36, 0.15)}]},
    {'id': 'ibc-nonspr', 'title': 'IBC, not sprinklered: 6000 sf business, one 36 in door + one 44 in stair', 'source': 'IBC 1004.5, 1005.3.1, 1005.3.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': SP + '[data-f="areaSf"]', 'value': '6000'},
               {'set': '#egressBody tr[data-egress]:nth-child(2) [data-f="typeId"]', 'value': 'stair', 'wait': 200},
               {'set': '#egressBody tr[data-egress]:nth-child(2) [data-f="clearWidthIn"]', 'value': '44'}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': round(6000 / 150)},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': cap(36, 0.2) + cap(44, 0.3)}]},
    {'id': 'ibc-assembly', 'title': 'IBC, assembly standing 2000 sf net, three 72 in doors, sprinklered', 'source': 'IBC 1004.5, 1005.3.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': SP + '[data-f="useId"]', 'value': 'assembly_standing', 'wait': 200}, {'set': SP + '[data-f="areaSf"]', 'value': '2000'},
               {'set': '#egressBody tr[data-egress]:nth-child(1) [data-f="clearWidthIn"]', 'value': '72'}, {'set': '#egressBody tr[data-egress]:nth-child(1) [data-f="qty"]', 'value': '3'},
               {'set': '#egressBody tr[data-egress]:nth-child(2) [data-f="clearWidthIn"]', 'value': '0'}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': round(2000 / 5)},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': 3 * cap(72, 0.15)}]},
    {'id': 'nfpa-business', 'title': 'NFPA 101, business 1500 sf gross (factor 150), two 36 in doors, sprinklered', 'source': 'NFPA 101 7.3.1.2, 7.3.3.1',
     'steps': [{'click': '#pickNfpa', 'wait': 400}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load (NFPA 101-2018+ factor 150)', 'unit': 'occ', 'ref': round(1500 / 150)},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': 2 * cap(36, 0.15)}]},
    {'id': 'ibc-travel-s1', 'title': 'IBC travel limit, S-1, sprinklered', 'source': 'IBC Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'S-1'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (S-1)', 'unit': 'ft', 'ref': 250},
               {'sel': '#allowBox', 'index': 1, 'label': 'Common path (S, sprinklered)', 'unit': 'ft', 'ref': 100}]},
    {'id': 'ibc-travel-s2-nonspr', 'title': 'IBC travel limit, S-2, not sprinklered', 'source': 'IBC 2021 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': '#occupancyGroup', 'value': 'S-2'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (S-2, nonsprinklered)', 'unit': 'ft', 'ref': 300}]},
    {'id': 'ibc-travel-f1-inc', 'title': 'IBC 1017.2.2 increase, F-1, sprinklered, conditions met', 'source': 'IBC 2021 1017.2.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'F-1'}, {'click': '#inc10172', 'wait': 200}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (F-1, 1017.2.2)', 'unit': 'ft', 'ref': 400}]},
    {'id': 'ibc-travel-h', 'title': 'IBC travel limits H-1 and H-4, sprinklered', 'source': 'IBC 2021 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'H-4'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (H-4)', 'unit': 'ft', 'ref': 175}]},
    {'id': 'ibc-travel-i23-nonspr', 'title': 'IBC I-2/I-3 without sprinklers: not permitted', 'source': 'IBC 2021 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': '#occupancyGroup', 'value': 'I-2/I-3'}],
     'reads': [{'sel': '#allowBox strong', 'label': 'Travel limit text', 'refText': 'Not permitted without sprinklers'}]},
    {'id': 'ibc-warehouse', 'title': 'IBC warehouse 10000 sf gross', 'source': 'IBC Table 1004.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': SP + '[data-f="useId"]', 'value': 'warehouse', 'wait': 200}, {'set': SP + '[data-f="areaSf"]', 'value': '10000'}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': round(10000 / 500)}]},
]
write('occupant-egress', {'script': 'occupant_egress.py', 'app': 'Occupant Load & Egress Capacity', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/occupant_egress.py',
      'flags': [FIXED, 'Review note: occupant load is rounded to the nearest person; common practice is to round fractions up. Per project and AHJ.'], 'cases': cases})
