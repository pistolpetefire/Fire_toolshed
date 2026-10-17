"""Occupant Load & Egress Capacity: worked independently in Python.
Occupant load: area / load factor (IBC Table 1004.5; NFPA 101 Table 7.3.1.2), app rounds to the nearest whole person.
Egress capacity: IBC 1005.3.1 / 1005.3.2 and NFPA 101 7.3.3.1: stairs 0.3 in/occ (0.2 sprinklered), other components 0.2 in/occ (0.15 sprinklered);
capacity = floor(clear width / factor) per component.
Travel limits: IBC 2024 Table 1017.2 / 1017.2.2; common path IBC 2024 Table 1006.2.1 (nonsprinklered = OL > 30 column); dead ends IBC 2024 1020.5.
Occupant load factors: IBC 2024 Table 1004.5. Minimum exits: IBC 2024 Table 1006.3.3; distribution: 1005.5 (UpCodes IBC 2024, 2026-10-17). All checked on ICC Digital Codes free access (IBC2024V2.0), 2026-10-15."""
import math
from ftverify import write, r
SP = '#spaceBody tr[data-space] '
EG = '#egressBody tr[data-egress]'
def cap(w, f): return math.floor(w / f + 1e-9)
def min_exits(n): return 0 if n <= 0 else 2 if n <= 500 else 3 if n <= 1000 else 4  # IBC 2024 Table 1006.3.3
SRC = 'IBC 2024 Table 1017.2, 1017.2.2, Table 1004.5, Table 1006.2.1, 1020.5; NFPA 101 (2018+) Table 7.3.1.2'
FIXED = ('v1.3.0: rechecked against IBC 2024 (travel and load factors unchanged); common path per IBC 2024 Table 1006.2.1 and dead ends per 1020.5 by subgroup (M and U common path 75 ft, H-1/H-2/H-3 25 ft, H-4/H-5/I/R-1 75 ft, R-2 to R-4 125 ft, not permitted unsprinklered for H, I, R; I-1 dead end 50 ft, I-2/I-3/I-4 and R-3/R-4 20 ft); R split into R-1, R-2, R-3/R-4 (saved R migrates to R-1). Fixed in v1.2.0: IBC travel limits by subgroup per IBC 2021 Table 1017.2 (S-1/F-1 250/200, S-2/F-2/U 400/300, H-1..H-5 75/100/150/175/200 '
         'sprinklered only, I-1 250 and I-2/I-3 200 sprinklered only, I-4 200/150), opt-in IBC 1017.2.2 F-1/S-1 400 ft; IBC warehouses 500 gross added '
         '(storage/stock/shipping stays 300); NFPA 101 business 150 gross (2018+). Saved v1.1.0 groups F/S/H/I migrate to F-1/S-1/H-1/I-2/I-3 (most restrictive).')
cases = [
    # v1.4.0: IBC 2024 Table 1006.3.3 minimum exits and 1005.5 loss of one exit. Required width = OL x factor, rounded UP to the inch.
    {'id': 'ibc-exits-1521', 'title': 'IBC, not sprinklered, 1,521 occupants (fixed), four 78 in doors', 'source': 'IBC 2024 Table 1006.3.3, 1005.3.2, 1005.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': SP + '[data-f="fixedOl"]', 'value': '1521'},
               {'set': EG + ':nth-child(1) [data-f="clearWidthIn"]', 'value': '78'}, {'set': EG + ':nth-child(1) [data-f="qty"]', 'value': '4'},
               {'set': EG + ':nth-child(2) [data-f="clearWidthIn"]', 'value': '0'}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': 1521},
               {'sel': '#exitCheck [data-x="req"]', 'label': 'Minimum exits (more than 1,000 -> 4)', 'refText': str(min_exits(1521))},
               {'sel': '#exitCheck [data-x="wOther"]', 'label': 'Required width, other components 1521 x 0.2 = 304.2 in, rounded up', 'unit': 'in', 'ref': math.ceil(round(1521 * 0.2, 6))},
               {'sel': '#exitCheck [data-x="count"]', 'label': 'Exit count check (4 provided)', 'refText': 'PASS'},
               {'sel': '#exitCheck [data-x="loss"]', 'label': 'Loss of one exit: 3 x 390 = 1170 >= 760.5', 'refText': 'PASS' if 2 * (3 * cap(78, 0.2)) >= 1521 else 'FAIL'}]},
    {'id': 'ibc-exits-600', 'title': 'IBC, not sprinklered, 600 occupants, two exits (100 in + 36 in)', 'source': 'IBC 2024 Table 1006.3.3, 1005.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': SP + '[data-f="fixedOl"]', 'value': '600'},
               {'set': EG + ':nth-child(1) [data-f="clearWidthIn"]', 'value': '100'}],
     'reads': [{'sel': '#exitCheck [data-x="req"]', 'label': 'Minimum exits (501-1,000 -> 3)', 'refText': str(min_exits(600))},
               {'sel': '#exitCheck [data-x="count"]', 'label': 'Exit count check (2 < 3)', 'refText': 'FAIL'},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': cap(100, 0.2) + cap(36, 0.2)},
               {'sel': '#exitCheck [data-x="loss"]', 'label': 'Loss of one exit: 180 remain < 300', 'refText': 'PASS' if 2 * cap(36, 0.2) >= 600 else 'FAIL'}]},
    {'id': 'ibc-exits-500', 'title': 'IBC, sprinklered, 500 occupants, two 44 in doors', 'source': 'IBC 2024 Table 1006.3.3, 1005.3.2, 1005.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': SP + '[data-f="fixedOl"]', 'value': '500'},
               {'set': EG + ':nth-child(1) [data-f="clearWidthIn"]', 'value': '44'}, {'set': EG + ':nth-child(2) [data-f="clearWidthIn"]', 'value': '44'}],
     'reads': [{'sel': '#exitCheck [data-x="req"]', 'label': 'Minimum exits (1-500 -> 2)', 'refText': str(min_exits(500))},
               {'sel': '#exitCheck [data-x="wOther"]', 'label': 'Required width 500 x 0.15 = 75 in', 'unit': 'in', 'ref': math.ceil(round(500 * 0.15, 6))},
               {'sel': '#exitCheck [data-x="loss"]', 'label': 'Loss of one exit: 293 >= 250', 'refText': 'PASS' if 2 * cap(44, 0.15) >= 500 else 'FAIL'}]},
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
    {'id': 'ibc-travel-s2-nonspr', 'title': 'IBC travel limit, S-2, not sprinklered', 'source': 'IBC 2024 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': '#occupancyGroup', 'value': 'S-2'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (S-2, nonsprinklered)', 'unit': 'ft', 'ref': 300}]},
    {'id': 'ibc-travel-f1-inc', 'title': 'IBC 1017.2.2 increase, F-1, sprinklered, conditions met', 'source': 'IBC 2024 1017.2.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'F-1'}, {'click': '#inc10172', 'wait': 200}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (F-1, 1017.2.2)', 'unit': 'ft', 'ref': 400}]},
    {'id': 'ibc-travel-h', 'title': 'IBC travel limits H-1 and H-4, sprinklered', 'source': 'IBC 2024 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'H-4'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (H-4)', 'unit': 'ft', 'ref': 175}]},
    {'id': 'ibc-travel-i23-nonspr', 'title': 'IBC I-2/I-3 without sprinklers: not permitted', 'source': 'IBC 2024 Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': '#occupancyGroup', 'value': 'I-2/I-3'}],
     'reads': [{'sel': '#allowBox strong', 'label': 'Travel limit text', 'refText': 'Not permitted without sprinklers'}]},
    {'id': 'ibc-warehouse', 'title': 'IBC warehouse 10000 sf gross', 'source': 'IBC Table 1004.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': SP + '[data-f="useId"]', 'value': 'warehouse', 'wait': 200}, {'set': SP + '[data-f="areaSf"]', 'value': '10000'}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load', 'unit': 'occ', 'ref': round(10000 / 500)}]},
    {'id': 'ibc-common-m', 'title': 'IBC 2024 common path, M, sprinklered', 'source': 'IBC 2024 Table 1006.2.1',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'M'}],
     'reads': [{'sel': '#allowBox', 'index': 1, 'label': 'Common path (M, sprinklered)', 'unit': 'ft', 'ref': 75}]},
    {'id': 'ibc-common-h1', 'title': 'IBC 2024 common path, H-1, sprinklered', 'source': 'IBC 2024 Table 1006.2.1',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'H-1'}],
     'reads': [{'sel': '#allowBox', 'index': 1, 'label': 'Common path (H-1, sprinklered)', 'unit': 'ft', 'ref': 25}]},
    {'id': 'ibc-r2', 'title': 'IBC 2024 R-2, sprinklered: common path and dead end', 'source': 'IBC 2024 Table 1006.2.1, 1020.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'R-2'}],
     'reads': [{'sel': '#allowBox', 'index': 1, 'label': 'Common path (R-2)', 'unit': 'ft', 'ref': 125},
               {'sel': '#allowBox', 'index': 2, 'label': 'Dead end (R-2, sprinklered)', 'unit': 'ft', 'ref': 50}]},
    {'id': 'ibc-i4-dead', 'title': 'IBC 2024 dead end, I-4, sprinklered', 'source': 'IBC 2024 1020.5',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'I-4'}],
     'reads': [{'sel': '#allowBox', 'index': 2, 'label': 'Dead end (I-4, not in the 50 ft exception)', 'unit': 'ft', 'ref': 20}]},
    {'id': 'ibc-r1-nonspr', 'title': 'IBC 2024 R-1 without sprinklers: common path not permitted', 'source': 'IBC 2024 Table 1006.2.1',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#sprinklered', 'value': 'no'}, {'set': '#occupancyGroup', 'value': 'R-1'}],
     'reads': [{'expr': "document.querySelectorAll('#allowBox strong')[1].textContent", 'label': 'Common path text', 'refText': 'Not permitted without sprinklers'}]},
]
write('occupant-egress', {'script': 'occupant_egress.py', 'app': 'Occupant Load & Egress Capacity', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/occupant_egress.py',
      'flags': [FIXED, 'Review note: occupant load is rounded to the nearest person; common practice is to round fractions up. Per project and AHJ.'], 'cases': cases})
