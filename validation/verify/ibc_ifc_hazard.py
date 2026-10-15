"""IBC / IFC Hazard Impacts: the hazard-family to Group H mapping, checked against IBC (2024) Section 307 typed independently here
(verified against ICC Digital Codes IBC2024V2.0 Chapter 3, 2026-10-14).
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
FIXED = ('v1.6.0: explosives default to H-1; per IBC (2024) 307.3.1 the user can select Division 1.3 (confinement/configuration will not elevate a mass fire to a mass explosion hazard) for H-2, or Division 1.4 / item 3 articles for H-3. Fixed in v1.5.0: oxidizers map to H-1/H-2/H-3 (Class 4 is H-1) and pyrophorics to H-1/H-2 (detonable H-1, nondetonable H-2) '
         'per IBC (2024) 307.3 and 307.4.')
cases = []
for hz, exp in EXPECT.items():
    rd = {'expr': "(document.querySelector('[data-haz=\"%s\"]').parentNode.textContent.match(/often (H-[0-9](?:\\/H-[0-9])*)/)||[])[1]" % hz,
          'label': 'Suggested Group H', 'refText': exp}
    cases.append({'id': 'map-' + hz, 'title': 'Hazard family: ' + hz, 'source': 'IBC (2024) 307.3 to 307.7', 'steps': [], 'reads': [rd]})
EXP = "(document.querySelector('[data-haz=\"explosives\"]').parentNode.textContent.match(/often (H-[0-9](?:\\/H-[0-9])*)/)||[])[1]"
for cid, val, exp in [('expl-default', None, 'H-1'), ('expl-div13', 'div13_h2', 'H-2'), ('expl-div14', 'div14_h3', 'H-3')]:
    steps = [{'click': '[data-haz="explosives"]', 'wait': 200}]
    if val: steps.append({'set': '#explosivesClass', 'value': val, 'wait': 200})
    cases.append({'id': cid, 'title': 'Explosives classification: ' + (val or 'default'), 'source': 'IBC (2024) 307.3, 307.3.1',
                  'steps': steps, 'reads': [{'expr': EXP, 'label': 'Suggested Group H (explosives)', 'refText': exp}]})
write('ibc-ifc-hazard', {'script': 'ibc_ifc_hazard.py', 'app': 'IBC / IFC Hazard Impacts', 'versionSel': '#appVersion',
      'handcalc': 'validation/verify/ibc_ifc_hazard.py', 'flags': [FIXED], 'cases': cases})
