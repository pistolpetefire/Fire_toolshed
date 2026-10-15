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
TRAVEL_FLAG = ('IBC Table 1017.2 gives 250 ft (sprinklered) / 200 ft (not sprinklered) for S-1 and F-1; the app uses 400 / 300 ft for all of S and F, '
               'which is the S-2 / F-2 value (non-conservative for S-1 and F-1). The H and I rows also use one value for every subgroup (IBC: H-1 75 ft, H-2 100 ft, '
               'H-3 150 ft, H-4 175 ft; I-2, I-3, I-4 200 ft). Not changed; for Kevin to review.')
FACTOR_FLAG = ('Load factors: IBC Table 1004.5 lists warehouses at 500 gross (app "Storage / warehouse" uses 300, conservative). NFPA 101 (2018 and later) '
               'Table 7.3.1.2 lists business use at 150 gross; the app uses 100 (the pre-2018 value, conservative). Not changed; for Kevin to review.')
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
    {'id': 'nfpa-business', 'title': 'NFPA 101, business 1500 sf gross (app factor 100), two 36 in doors, sprinklered', 'source': 'NFPA 101 7.3.1.2, 7.3.3.1',
     'steps': [{'click': '#pickNfpa', 'wait': 400}],
     'reads': [{'sel': '#mLoad', 'label': 'Occupant load (NFPA 101-2018+ factor 150)', 'unit': 'occ', 'ref': round(1500 / 150), 'flag': FACTOR_FLAG},
               {'sel': '#mCap', 'label': 'Egress capacity', 'unit': 'occ', 'ref': 2 * cap(36, 0.15)}]},
    {'id': 'ibc-travel-s1', 'title': 'IBC travel limit, Group S (S-1), sprinklered', 'source': 'IBC Table 1017.2',
     'steps': [{'click': '#pickIbc', 'wait': 400}, {'set': '#occupancyGroup', 'value': 'S'}],
     'reads': [{'sel': '#allowBox', 'label': 'Max exit access travel (S-1)', 'unit': 'ft', 'ref': 250, 'flag': TRAVEL_FLAG},
               {'sel': '#allowBox', 'index': 1, 'label': 'Common path (S, sprinklered)', 'unit': 'ft', 'ref': 100}]},
]
write('occupant-egress', {'script': 'occupant_egress.py', 'app': 'Occupant Load & Egress Capacity', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/occupant_egress.py',
      'flags': [TRAVEL_FLAG, FACTOR_FLAG, 'Review note: occupant load is rounded to the nearest person; common practice is to round fractions up. Per project and AHJ.'], 'cases': cases})
