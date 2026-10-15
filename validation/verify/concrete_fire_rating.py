"""Concrete Fire Rating Thickness: values typed here independently from the code tables.
IBC Table 722.2.1.1 (= ACI/TMS 216.1 Table 4.2) for solid walls and slabs; IBC Table 722.3.2 (= ACI/TMS 216.1 Table 3.1) for CMU."""
from ftverify import write, r
IBC_722_2_1_1 = {'siliceous': {1: 3.5, 2: 5.0, 3: 6.2, 4: 7.0}, 'carbonate': {1: 3.2, 2: 4.6, 3: 5.7, 4: 6.6},
                 'sand_lw': {1: 2.7, 2: 3.8, 3: 4.6, 4: 5.4}, 'lightweight': {1: 2.5, 2: 3.6, 3: 4.4, 4: 5.1}}
IBC_722_3_2 = {'cmu_gravel': {1: 2.8, 2: 4.2, 3: 5.3, 4: 6.2}, 'cmu_limestone': {1: 2.7, 2: 4.0, 3: 5.0, 4: 5.9},
               'cmu_expanded_clay': {1: 2.6, 2: 3.6, 3: 4.4, 4: 5.1}, 'cmu_pumice': {1: 2.1, 2: 3.2, 3: 4.0, 4: 4.7}}
FLAG = 'App table shows 2.2 in for 1 hr; IBC Table 722.3.2 and ACI/TMS 216.1 Table 3.1 give 2.6 in (2.2 in is the 3/4 hr value). Not changed; for Kevin to review.'
cases = []
def case(cid, asm, mat, hr, table, flag=None):
    te = table[mat][hr]
    reads = [{'sel': '#metricIn', 'label': 'Minimum equivalent thickness Te', 'unit': 'in', 'ref': te},
             {'sel': '#metricMm', 'label': 'Te in SI', 'unit': 'mm', 'ref': r(te * 25.4, 1)}]
    if flag:
        for x in reads: x['flag'] = flag
    cases.append({'id': cid, 'title': f'{asm} / {mat} / {hr} h', 'source': 'IBC Table 722.2.1.1' if table is IBC_722_2_1_1 else 'IBC Table 722.3.2',
                  'steps': [{'set': '#assemblyType', 'value': asm}, {'set': '#materialId', 'value': mat}, {'set': '#ratingHr', 'value': str(hr)}], 'reads': reads})
case('wall-sil-2', 'wall_cip', 'siliceous', 2, IBC_722_2_1_1)
case('slab-carb-4', 'floor_slab', 'carbonate', 4, IBC_722_2_1_1)
case('wall-slw-3', 'wall_cip', 'sand_lw', 3, IBC_722_2_1_1)
case('slab-lw-1', 'floor_slab', 'lightweight', 1, IBC_722_2_1_1)
case('cmu-gravel-2', 'cmu_wall', 'cmu_gravel', 2, IBC_722_3_2)
case('cmu-lime-4', 'cmu_wall', 'cmu_limestone', 4, IBC_722_3_2)
case('cmu-clay-1', 'cmu_wall', 'cmu_expanded_clay', 1, IBC_722_3_2, FLAG)
case('cmu-pumice-3', 'cmu_wall', 'cmu_pumice', 3, IBC_722_3_2)
write('concrete-fire-rating', {'script': 'concrete_fire_rating.py', 'app': 'Concrete Fire Rating Thickness', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/concrete_fire_rating.py', 'flags': ['CMU, expanded clay, shale or slate, 1 hour: ' + FLAG], 'cases': cases})
