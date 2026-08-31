import type { UnitId } from '../types';

export interface StudyGuideItem {
  id: string;
  number: string;
  prompt: string;
  answer: string;
  unitId: UnitId;
}

export const EXAM1_STUDY_GUIDE: StudyGuideItem[] = [
  {
    id: 'sg-01',
    number: '1',
    unitId: 'unit-1',
    prompt: 'Walk the scientific inquiry process from observation to conclusion.',
    answer:
      'Observe → ask a question → write a testable hypothesis → design an experiment (treatments, check, replication, randomization) → collect data → conclude and, in research, peer review. Revise if the hypothesis fails.',
  },
  {
    id: 'sg-02',
    number: '2',
    unitId: 'unit-1',
    prompt: 'Distinguish hypothesis, theory, and law.',
    answer:
      'Hypothesis: specific, testable prediction. Theory: well-supported explanation of why. Law: describes a consistent pattern, often mathematically, without having to explain mechanism.',
  },
  {
    id: 'sg-03',
    number: '3',
    unitId: 'unit-1',
    prompt: 'In a fertilizer rate trial measuring yield, name the independent variable, dependent variable, and a control.',
    answer:
      'IV = fertilizer rate. DV = yield (and maybe protein, lodging). Control/check = zero fertilizer or the standard grower rate. Controlled variables: same hybrid, planting date, irrigation.',
  },
  {
    id: 'sg-04',
    number: '4',
    unitId: 'unit-1',
    prompt: 'Why replicate and randomize a field trial?',
    answer:
      'Replication estimates variation so one weird plot cannot fake a winner. Randomization (often inside blocks) keeps soil gradients from lining up with one treatment. One unreplicated strip is a demonstration, not an experiment.',
  },
  {
    id: 'sg-05',
    number: '5',
    unitId: 'unit-1',
    prompt: 'What is needed to establish a field trial vs a greenhouse study?',
    answer:
      'Field: hypothesis, treatments + check, replicated plots, randomization, a measured response, harvest protocol; real weather/soil, messier. Greenhouse: more control, faster, less realism for Oklahoma production.',
  },
  {
    id: 'sg-06',
    number: '6',
    unitId: 'unit-2',
    prompt: 'List roles of plants in society.',
    answer:
      'Food, feed, fiber, fuel/industrial, pharmaceuticals/ornamentals, plus ecosystem services (cover, carbon, water). Fertilizer and tillage decisions hit atmosphere, soil, and water.',
  },
  {
    id: 'sg-07',
    number: '7',
    unitId: 'unit-2',
    prompt: 'What is domestication / artificial selection? Give two independent centers and a crop from each.',
    answer:
      'Humans kept seed from plants with useful traits (non-shattering, larger seed). Fertile Crescent — wheat/barley; China — rice/soy; Mesoamerica — maize; Andes — potato; Africa — sorghum.',
  },
  {
    id: 'sg-08',
    number: '8',
    unitId: 'unit-2',
    prompt: 'What was the Green Revolution, and who is Borlaug?',
    answer:
      '1960s–70s yield jump from semi-dwarf wheat (Borlaug), IR8 rice, fertilizer, irrigation, pesticides. Higher output and higher input dependence. Haber–Bosch made cheap synthetic N possible earlier in the century.',
  },
  {
    id: 'sg-09',
    number: '9',
    unitId: 'unit-2',
    prompt: 'Define food security. Why can a grain exporter still have hungry people?',
    answer:
      'Four pillars: availability, access, utilization, stability. Exports speak to availability. Poverty, markets, or conflict can break access. Diet quality is utilization. Drought/war break stability.',
  },
  {
    id: 'sg-10',
    number: '10',
    unitId: 'unit-2',
    prompt: 'How have agronomic systems evolved? Mention one pre-industrial fertility tool.',
    answer:
      'Subsistence/fallow → settled rotations (legumes/manure) → mechanization → synthetic N and Green Revolution → conservation/precision ag. Legumes in rotation fixed N before Haber–Bosch.',
  },
  {
    id: 'sg-11',
    number: '11',
    unitId: 'unit-3',
    prompt: 'Contrast taproot and fibrous roots with examples and functions.',
    answer:
      'Taproot (many dicots: alfalfa, cotton, carrot) — deep water, storage. Fibrous (grasses: wheat, corn) — topsoil exploration, holding soil. Functions: anchorage, absorption, storage.',
  },
  {
    id: 'sg-12',
    number: '12',
    unitId: 'unit-3',
    prompt: 'Define node, internode, xylem, and phloem.',
    answer:
      'Node: where leaves/buds attach. Internode: stem between nodes. Xylem: water and minerals up. Phloem: sugars source → sink. Potato “eyes” are nodes (it is a stem).',
  },
  {
    id: 'sg-13',
    number: '13',
    unitId: 'unit-3',
    prompt: 'Rhizome vs stolon vs tuber vs bulb vs storage root. Why do rhizomes make weeds hard?',
    answer:
      'Rhizome: underground stem (johnsongrass). Stolon: aboveground runner (strawberry). Tuber: swollen stem, eyes = nodes (potato). Bulb: fleshy leaves (onion). Storage root: sweet potato, carrot. Tillage chops rhizomes into new plants.',
  },
  {
    id: 'sg-14',
    number: '14',
    unitId: 'unit-3',
    prompt: 'Label a flower: sepal, petal, stamen, pistil. What do anther and stigma do?',
    answer:
      'Outside in: sepals (calyx), petals (corolla), stamens (anther + filament = pollen), pistil (stigma + style + ovary). Anther produces pollen; stigma receives it. Ovary → fruit; ovules → seeds.',
  },
  {
    id: 'sg-15',
    number: '15',
    unitId: 'unit-3',
    prompt: 'Complete vs incomplete; perfect vs imperfect. Can a flower be both incomplete and perfect?',
    answer:
      'Complete = four whorls. Incomplete = missing a whorl. Perfect = both sexes in one flower. Imperfect = unisexual. Yes: wheat florets are incomplete (no showy petals) and perfect.',
  },
  {
    id: 'sg-16',
    number: '16',
    unitId: 'unit-3',
    prompt: 'Monoecious vs dioecious vs synoecious — examples and production impact.',
    answer:
      'Monoecious: male and female flowers on one plant (corn tassel + ear) — no separate sexed fields, but pollen must reach silks. Dioecious: separate plants (hemp, hops) — need females for harvest, often pollenizers. Synoecious: perfect flowers (wheat, soybean).',
  },
  {
    id: 'sg-17',
    number: '17',
    unitId: 'unit-3',
    prompt: 'Spike vs panicle vs head. Monocot vs dicot morphological keys.',
    answer:
      'Spike: wheat. Panicle: rice, sorghum, johnsongrass. Head: sunflower. Monocot: 1 cotyledon, parallel veins, fibrous roots, parts in 3s. Dicot: 2 cotyledons, netted veins, often taproot, parts in 4s/5s.',
  },
  {
    id: 'sg-18',
    number: '18',
    unitId: 'unit-4',
    prompt: 'Classify annual (summer/winter), biennial, perennial with one crop each.',
    answer:
      'Summer annual: corn, soybean. Winter annual: winter wheat, rye. Biennial: sugarbeet, carrot (often harvested year 1). Perennial: alfalfa, bermudagrass, johnsongrass (weed).',
  },
  {
    id: 'sg-19',
    number: '19',
    unitId: 'unit-4',
    prompt: 'C3 vs C4: physiology in one sentence each, and tag wheat, corn, soybean, sorghum, alfalfa, bermuda.',
    answer:
      'C3: Calvin cycle + Rubisco, photorespiration in heat. C4: PEP carboxylase + Kranz anatomy, little photorespiration, better in hot high light. Wheat C3, corn C4, soybean C3, sorghum C4, alfalfa C3, bermudagrass C4.',
  },
  {
    id: 'sg-20',
    number: '20',
    unitId: 'unit-4',
    prompt: 'Why grow C3 wheat in a C4-friendly Oklahoma summer climate?',
    answer:
      'Wheat is cool-season: it occupies fall–spring when corn is not growing. C4 is not universally better. Match pathway to season and use.',
  },
  {
    id: 'sg-21',
    number: '21',
    unitId: 'unit-4',
    prompt: 'Classify by agronomic use: wheat, corn, soybean, alfalfa, cotton, sugarcane.',
    answer:
      'Wheat/corn/rice: starch cereals (corn also silage). Soybean: protein + oil. Alfalfa: forage. Cotton: fiber. Sugarcane: sugar. One crop can wear two hats.',
  },
  {
    id: 'sg-22',
    number: '22',
    unitId: 'unit-4',
    prompt: 'Poaceae vs Fabaceae vs Malvaceae — two crops each (cotton for mallow). Binomials for corn, wheat, soybean, alfalfa.',
    answer:
      'Poaceae: wheat, corn, rice, sorghum. Fabaceae: soybean, alfalfa, peanut. Malvaceae: cotton. Zea mays, Triticum aestivum, Glycine max, Medicago sativa.',
  },
  {
    id: 'sg-23',
    number: '23',
    unitId: 'unit-4',
    prompt: 'Stack tags for corn, winter wheat, alfalfa, and johnsongrass.',
    answer:
      'Corn: summer annual, C4, Poaceae, starch/silage, monoecious. Winter wheat: winter annual, C3, Poaceae, starch. Alfalfa: perennial, C3, Fabaceae, forage, taproot. Johnsongrass: perennial C4 rhizomatous grass weed, panicle.',
  },
  {
    id: 'sg-24',
    number: '24',
    unitId: 'unit-3',
    prompt: 'Exam traps — list four morphology mistakes.',
    answer:
      'Potato is a stem not a root. Sweet potato is a root. Corn is monoecious not dioecious. Rhizome is a stem not a root. Complete (whorls) ≠ perfect (sexes).',
  },
];
