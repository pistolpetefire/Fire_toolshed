"""IBC / IFC Hazard Impacts: the hazard-family to Group H mapping, checked against IBC Section 307 typed independently here.
IBC 307.3 H-1: detonable pyrophorics, explosives (most divisions), unclassified detonable organic peroxides, Class 4 oxidizers,
Class 4 and Class 3 detonable unstable (reactive) materials. 307.4 H-2: flammable gases and cryogenics, Class I/II/IIIA liquids in open or
pressurized use, combustible dusts, Class I organic peroxides, Class 3 oxidizers (open use), nondetonable pyrophorics, Class 3 nondetonable
unstable, Class 3 water-reactive. 307.5 H-3: Class I/II/IIIA liquids in closed use, flammable solids, Class II/III organic peroxides,
Class 2 and 3 oxidizers, oxidizing gases and cryogenics, Class 2 unstable, Class 2 water-reactive, pyroxylin, Level 2/3 aerosols.
307.6 H-4: corrosives, highly toxic, toxic. 307.7 H-5: HPM in semiconductor fabrication."""
from ftverify import write
EXPECT = {'flammable_gas': 'H-2', 'combustible_dust': 'H-2', 'flammable_solid': 'H-3', 'aerosols': 'H-3', 'pyroxylin': 'H-3',
          'organic_peroxide': 'H-1/H-2/H-3', 'unstable': 'H-1/H-2/H-3', 'water_reactive': 'H-2/H-3',
          'highly_toxic': 'H-4', 'toxic': 'H-4', 'corrosive': 'H-4', 'hpm': 'H-5',
          'oxidizer': 'H-1/H-2/H-3', 'pyrophoric': 'H-1/H-2'}
FLAG = ('IBC 307.3 puts Class 4 oxidizers and detonable pyrophoric materials in Group H-1. The app maps oxidizers to H-2/H-3 and pyrophorics to H-2 only, '
        'so it will not suggest H-1 for them. Not changed; for Kevin to review.')
cases = []
for hz, exp in EXPECT.items():
    rd = {'expr': "(document.querySelector('[data-haz=\"%s\"]').parentNode.textContent.match(/often (H-[0-9](?:\\/H-[0-9])*)/)||[])[1]" % hz,
          'label': 'Suggested Group H', 'refText': exp}
    if hz in ('oxidizer', 'pyrophoric'): rd['flag'] = FLAG
    cases.append({'id': 'map-' + hz, 'title': 'Hazard family: ' + hz, 'source': 'IBC 307.3 to 307.7', 'steps': [], 'reads': [rd]})
write('ibc-ifc-hazard', {'script': 'ibc_ifc_hazard.py', 'app': 'IBC / IFC Hazard Impacts', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/ibc_ifc_hazard.py', 'flags': [FLAG, 'Review note: explosives are mapped to H-1 only; IBC 307.5 places Division 1.4 (including consumer fireworks 1.4G) in H-3.'], 'cases': cases})
