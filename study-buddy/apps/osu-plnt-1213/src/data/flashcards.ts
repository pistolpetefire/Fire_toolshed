import type { Flashcard, UnitId } from '../types';

export const builtInFlashcards: Flashcard[] = [
  // Ch 1
  { id: 'fc-1-01', unitId: 'unit-1', tags: ['process'], front: 'List the scientific inquiry steps in order.', back: 'Observation → question → hypothesis → experiment → data/conclusion → (peer review). Revise if the hypothesis fails.' },
  { id: 'fc-1-02', unitId: 'unit-1', tags: ['hypothesis'], front: 'What makes a statement a scientific hypothesis?', back: 'It is a testable, falsifiable prediction. “Hybrid A yields more than Hybrid B at this site” is; “sorghum is nice” is not.' },
  { id: 'fc-1-03', unitId: 'unit-1', tags: ['vocab'], front: 'Hypothesis vs theory vs law?', back: 'Hypothesis: specific testable prediction. Theory: well-supported explanation of why. Law: describes a consistent pattern, often math, not necessarily the mechanism.' },
  { id: 'fc-1-04', unitId: 'unit-1', tags: ['variables'], front: 'Independent vs dependent variable in a fertilizer trial?', back: 'Independent (treatment): N rate. Dependent (measured): yield, protein, lodging. Controlled: variety, planting date, irrigation.' },
  { id: 'fc-1-05', unitId: 'unit-1', tags: ['variables'], front: 'Is grain yield usually an independent or dependent variable?', back: 'Dependent — it is the response you measure, not the treatment you apply.' },
  { id: 'fc-1-06', unitId: 'unit-1', tags: ['control'], front: 'What is a control / check treatment?', back: 'The baseline comparison: untreated, zero fertilizer, or standard grower practice.' },
  { id: 'fc-1-07', unitId: 'unit-1', tags: ['design'], front: 'Why replicate treatments in a field trial?', back: 'Fields are variable. Replication estimates error so you can tell a real treatment effect from a sand streak or low spot.' },
  { id: 'fc-1-08', unitId: 'unit-1', tags: ['design'], front: 'Why randomize treatments?', back: 'So soil gradients and edge effects do not line up with one treatment. Assignment without a repeating pattern.' },
  { id: 'fc-1-09', unitId: 'unit-1', tags: ['design'], front: 'Is one unreplicated strip an experiment?', back: 'No — it is a demonstration. An experiment needs replication (and usually randomization).' },
  { id: 'fc-1-10', unitId: 'unit-1', tags: ['trials'], front: 'Field trial vs greenhouse trial — one strength of each?', back: 'Field: real weather and soil (relevant to the southern Great Plains). Greenhouse: more control, faster, less realism.' },
  { id: 'fc-1-11', unitId: 'unit-1', tags: ['trials'], front: 'What do you need to establish a basic field trial?', back: 'A question/hypothesis, treatments + check, replicated plots, randomization (often in blocks), a measured response, and a harvest/sampling protocol. Multiple site-years are better.' },
  { id: 'fc-1-12', unitId: 'unit-1', tags: ['vocab'], front: 'What is peer review?', back: 'Other scientists evaluate methods and claims before (or after) publication. It is not a substitute for replication.' },
  { id: 'fc-1-13', unitId: 'unit-1', tags: ['data'], front: 'A treatment “looks higher.” Can you claim it is better?', back: 'Not from looks alone. Variation may swallow the difference. Report means, include a check, and do not over-generalize from one year/site.' },
  { id: 'fc-1-14', unitId: 'unit-1', tags: ['design'], front: 'What is blocking in a field experiment?', back: 'Grouping similar soil/slope together, then randomizing treatments inside each block so each treatment sees each environment.' },
  { id: 'fc-1-15', unitId: 'unit-1', tags: ['vocab'], front: 'Controlled variable vs control treatment?', back: 'Controlled variable: a factor you hold constant (same hybrid). Control treatment: a plot that gets the baseline/check level of the independent variable.' },

  // Ch 2
  { id: 'fc-2-01', unitId: 'unit-2', tags: ['plants'], front: 'Name five roles of plants in society.', back: 'Food, feed, fiber, fuel/industrial, pharmaceuticals/ornamentals — plus ecosystem services (cover, carbon, water).' },
  { id: 'fc-2-02', unitId: 'unit-2', tags: ['domestication'], front: 'What is domestication in crop plants?', back: 'Genetic change under human care. Farmers kept seed from plants with useful traits (non-shattering, larger seed, less dormancy). Artificial selection.' },
  { id: 'fc-2-03', unitId: 'unit-2', tags: ['selection'], front: 'Artificial vs natural selection?', back: 'Artificial: humans set the fitness criteria (what gets planted). Natural: wild environment (pests, climate) sets it. Weeds still experience natural selection.' },
  { id: 'fc-2-04', unitId: 'unit-2', tags: ['history'], front: 'Where did wheat and barley originate?', back: 'Fertile Crescent (Near East), among the earliest domesticated cereals ~10,000 years before present.' },
  { id: 'fc-2-05', unitId: 'unit-2', tags: ['history'], front: 'Name three independent centers of domestication and a crop from each.', back: 'Fertile Crescent — wheat/barley. China — rice/soybean. Mesoamerica — maize. Andes — potato. Africa — sorghum. (Any three.)' },
  { id: 'fc-2-06', unitId: 'unit-2', tags: ['history'], front: 'What was maize domesticated from?', back: 'Teosinte (Mesoamerica). Modern ears are the product of long artificial selection.' },
  { id: 'fc-2-07', unitId: 'unit-2', tags: ['green'], front: 'What was the Green Revolution?', back: '1960s–70s yield jump from semi-dwarf wheat (Borlaug), IR8 rice, fertilizer, irrigation, and pesticides. Higher output, more input dependence.' },
  { id: 'fc-2-08', unitId: 'unit-2', tags: ['green'], front: 'Who is Norman Borlaug associated with?', back: 'Green Revolution wheat breeding — semi-dwarf, rust-resistant wheats that responded to fertilizer without lodging.' },
  { id: 'fc-2-09', unitId: 'unit-2', tags: ['fertilizer'], front: 'Why does Haber–Bosch matter to agronomy?', back: 'Industrial ammonia → cheap synthetic N fertilizer. Huge yield increase and a major environmental footprint (later chapters).' },
  { id: 'fc-2-10', unitId: 'unit-2', tags: ['food'], front: 'Four pillars of food security?', back: 'Availability, access, utilization, stability. Production alone is not enough.' },
  { id: 'fc-2-11', unitId: 'unit-2', tags: ['food'], front: 'Can a country export grain and still have hungry people?', back: 'Yes. Access (income, markets, conflict) or utilization/stability can fail even if availability looks fine on paper.' },
  { id: 'fc-2-12', unitId: 'unit-2', tags: ['history'], front: 'Name one pre-industrial way farmers restored nitrogen.', back: 'Legumes in rotation (clover, beans), manure, fallow, or shifting cultivation. Synthetic N is Haber–Bosch era.' },
  { id: 'fc-2-13', unitId: 'unit-2', tags: ['plains'], front: 'How does the Dust Bowl connect to this course?', back: 'Prairie converted to cropland + drought + unsustainable tillage → erosion. Later tillage/OM chapters are the agronomic response.' },
  { id: 'fc-2-14', unitId: 'unit-2', tags: ['food'], front: 'Hunger vs malnutrition?', back: 'Hunger is not getting enough food. Malnutrition also includes micronutrient deficiency and obesity — diet quality, not only calories.' },
  { id: 'fc-2-15', unitId: 'unit-2', tags: ['systems'], front: 'How have agronomic systems evolved in one sentence?', back: 'From subsistence and long fallows → settled rotations and animal power → mechanization and synthetic fertilizer → Green Revolution and precision/conservation ag.' },
  { id: 'fc-2-16', unitId: 'unit-2', tags: ['plants'], front: 'Feed vs food vs fiber — give one crop each.', back: 'Feed: alfalfa or corn silage. Food: wheat. Fiber: cotton. (Soybean can be food or feed.)' },

  // Ch 3
  { id: 'fc-3-01', unitId: 'unit-3', tags: ['roots'], front: 'Taproot vs fibrous root — who has which?', back: 'Taproot: many dicots (alfalfa, cotton, carrot). Fibrous: grasses/monocots (wheat, corn).' },
  { id: 'fc-3-02', unitId: 'unit-3', tags: ['roots'], front: 'Three functions of roots.', back: 'Anchorage, water/nutrient absorption, storage (sometimes vegetative spread via adventitious roots on rhizomes).' },
  { id: 'fc-3-03', unitId: 'unit-3', tags: ['stems'], front: 'What are nodes and internodes?', back: 'Nodes: where leaves and buds attach. Internodes: stem segments between nodes. Eyes on a potato are nodes.' },
  { id: 'fc-3-04', unitId: 'unit-3', tags: ['stems'], front: 'Xylem vs phloem?', back: 'Xylem: water and minerals up. Phloem: sugars from source to sink.' },
  { id: 'fc-3-05', unitId: 'unit-3', tags: ['mod'], front: 'What is a rhizome? Why are rhizomatous weeds hard?', back: 'Underground stem with nodes and buds (johnsongrass, quackgrass, bermuda). Tillage fragments multiply plants; they persist winter.' },
  { id: 'fc-3-06', unitId: 'unit-3', tags: ['mod'], front: 'Rhizome vs stolon?', back: 'Rhizome: underground horizontal stem. Stolon (runner): aboveground horizontal stem (strawberry). Bermuda can do both.' },
  { id: 'fc-3-07', unitId: 'unit-3', tags: ['mod'], front: 'Potato vs sweet potato — stem or root?', back: 'Irish potato = tuber = swollen underground STEM (eyes = nodes). Sweet potato = storage ROOT.' },
  { id: 'fc-3-08', unitId: 'unit-3', tags: ['mod'], front: 'Bulb vs corm vs tuber?', back: 'Bulb: short stem + fleshy leaves (onion). Corm: swollen stem base (taro). Tuber: swollen underground stem with nodes (potato).' },
  { id: 'fc-3-09', unitId: 'unit-3', tags: ['leaf'], front: 'Monocot vs dicot leaf venation?', back: 'Monocot: parallel. Dicot: netted / reticulate.' },
  { id: 'fc-3-10', unitId: 'unit-3', tags: ['leaf'], front: 'What is a ligule and why care?', back: 'Membrane or fringe at the grass blade–sheath junction. Shape/presence is a grass and weed ID tool.' },
  { id: 'fc-3-11', unitId: 'unit-3', tags: ['flower'], front: 'Four floral whorls, outside in.', back: 'Sepals (calyx), petals (corolla), stamens (androecium), pistil/carpels (gynoecium).' },
  { id: 'fc-3-12', unitId: 'unit-3', tags: ['flower'], front: 'Parts of a stamen and a pistil.', back: 'Stamen: anther + filament (pollen). Pistil: stigma + style + ovary (ovules → seeds; ovary → fruit).' },
  { id: 'fc-3-13', unitId: 'unit-3', tags: ['flower'], front: 'Complete vs incomplete flower.', back: 'Complete: all four whorls. Incomplete: missing at least one (grass florets lack showy petals).' },
  { id: 'fc-3-14', unitId: 'unit-3', tags: ['flower'], front: 'Perfect vs imperfect flower.', back: 'Perfect: stamens and pistil in the same flower. Imperfect: male or female only.' },
  { id: 'fc-3-15', unitId: 'unit-3', tags: ['sex'], front: 'Monoecious vs dioecious vs synoecious.', back: 'Monoecious: male and female flowers on the SAME plant (corn). Dioecious: sexes on SEPARATE plants (hemp, hops). Synoecious: perfect flowers (wheat, soybean).' },
  { id: 'fc-3-16', unitId: 'unit-3', tags: ['sex'], front: 'Is corn monoecious or dioecious? How do you know?', back: 'Monoecious. Tassel (male) and ear (female) on one plant. You do not plant separate male and female corn fields for grain.' },
  { id: 'fc-3-17', unitId: 'unit-3', tags: ['sex'], front: 'Why does dioecy matter in production?', back: 'Only females make fruit/seed. You need pollenizers, or you plant sexed stands (all-female hemp; hops harvest female cones).' },
  { id: 'fc-3-18', unitId: 'unit-3', tags: ['inflo'], front: 'Spike vs panicle vs head — one crop each.', back: 'Spike: wheat/barley. Panicle: rice, oats, sorghum, johnsongrass. Head/capitulum: sunflower.' },
  { id: 'fc-3-19', unitId: 'unit-3', tags: ['mono'], front: 'Four monocot vs dicot differences.', back: 'Cotyledons 1 vs 2; parallel vs netted veins; fibrous vs often taproot; floral parts in 3s vs 4s/5s; scattered vs ringed vascular bundles.' },
  { id: 'fc-3-20', unitId: 'unit-3', tags: ['mod'], front: 'Name two weedy species that use rhizomes.', back: 'Johnsongrass, quackgrass, bermudagrass (any two). Fragments resprout.' },
  { id: 'fc-3-21', unitId: 'unit-3', tags: ['flower'], front: 'Can a flower be incomplete and perfect?', back: 'Yes. Wheat florets lack a showy corolla (incomplete) but have stamens and pistil (perfect).' },
  { id: 'fc-3-22', unitId: 'unit-3', tags: ['stems'], front: 'What is a tiller?', back: 'A grass stem arising from a basal node. Wheat and rice tiller; it affects stand and yield.' },

  // Ch 4
  { id: 'fc-4-01', unitId: 'unit-4', tags: ['cycle'], front: 'Summer annual vs winter annual?', back: 'Summer: spring/summer germinate, seed and die same year (corn, soybean). Winter: fall establish, overwinter, flower in spring (winter wheat, rye).' },
  { id: 'fc-4-02', unitId: 'unit-4', tags: ['cycle'], front: 'What is a biennial? Example.', back: 'Vegetative year 1, flowers year 2, then dies. Sugarbeet, carrot, sweet clover. Often harvested in year 1 for the root.' },
  { id: 'fc-4-03', unitId: 'unit-4', tags: ['cycle'], front: 'Perennial crop examples.', back: 'Alfalfa, tall fescue, bermudagrass, switchgrass, fruit trees. Survive via crowns, rhizomes, or woody structure.' },
  { id: 'fc-4-04', unitId: 'unit-4', tags: ['c3c4'], front: 'C3 vs C4 in one physiological sentence.', back: 'C3: Calvin cycle + Rubisco, photorespiration in heat. C4: PEP carboxylase + Kranz anatomy concentrates CO2, little photorespiration, better in hot high-light.' },
  { id: 'fc-4-05', unitId: 'unit-4', tags: ['c3c4'], front: 'Is wheat C3 or C4? Corn? Soybean? Sorghum?', back: 'Wheat C3, corn C4, soybean C3, sorghum C4.' },
  { id: 'fc-4-06', unitId: 'unit-4', tags: ['c3c4'], front: 'Name three C4 agronomic plants.', back: 'Corn, sorghum, sugarcane, millet, bermudagrass, johnsongrass (any three).' },
  { id: 'fc-4-07', unitId: 'unit-4', tags: ['c3c4'], front: 'Name three C3 agronomic plants.', back: 'Wheat, rice, barley, soybean, cotton, alfalfa, peanut, potato (any three).' },
  { id: 'fc-4-08', unitId: 'unit-4', tags: ['c3c4'], front: 'Why is C4 useful in the southern Great Plains summer?', back: 'High light and heat; C4 avoids photorespiration and generally has higher water-use efficiency than C3 in those conditions.' },
  { id: 'fc-4-09', unitId: 'unit-4', tags: ['c3c4'], front: 'If C4 is so efficient, why grow wheat in Oklahoma?', back: 'Wheat is a cool-season C3 that occupies fall–spring when corn is not growing. Pathway and season go together.' },
  { id: 'fc-4-10', unitId: 'unit-4', tags: ['use'], front: 'Classify corn, soybean, alfalfa, cotton by primary use.', back: 'Corn: starch grain (also silage). Soybean: protein + oil. Alfalfa: forage/feed. Cotton: fiber (seed is oil/feed).' },
  { id: 'fc-4-11', unitId: 'unit-4', tags: ['family'], front: 'Poaceae vs Fabaceae — one sentence and two crops each.', back: 'Poaceae = grasses (wheat, corn, rice, sorghum). Fabaceae = legumes, many N-fixing (soybean, alfalfa, peanut, clover).' },
  { id: 'fc-4-12', unitId: 'unit-4', tags: ['names'], front: 'Binomial names: corn, wheat, soybean, alfalfa.', back: 'Zea mays, Triticum aestivum, Glycine max, Medicago sativa.' },
  { id: 'fc-4-13', unitId: 'unit-4', tags: ['combo'], front: 'Tag corn: life cycle, pathway, family, use, sex system.', back: 'Summer annual, C4, Poaceae, starch/silage, monoecious.' },
  { id: 'fc-4-14', unitId: 'unit-4', tags: ['combo'], front: 'Tag winter wheat: life cycle, pathway, family, use.', back: 'Winter annual, C3, Poaceae, starch grain (also forage).' },
  { id: 'fc-4-15', unitId: 'unit-4', tags: ['combo'], front: 'Tag alfalfa: life cycle, pathway, family, use, root type.', back: 'Perennial, C3, Fabaceae, forage, taproot.' },
  { id: 'fc-4-16', unitId: 'unit-4', tags: ['combo'], front: 'Tag johnsongrass: why is it a problem?', back: 'Perennial C4 grass weed with rhizomes (and a panicle). Fragments and seed both spread it.' },
  { id: 'fc-4-17', unitId: 'unit-4', tags: ['cam'], front: 'What is CAM photosynthesis? Major field crop in OK?', back: 'Stomata open at night (pineapple, agave). Not a major Oklahoma field-crop pathway.' },
  { id: 'fc-4-18', unitId: 'unit-4', tags: ['use'], front: 'Sugarcane vs sugarbeet — pathway and life cycle.', back: 'Sugarcane: C4 perennial grass (often ratooned). Sugarbeet: C3 biennial, harvested year 1 for the root.' },
  { id: 'fc-4-19', unitId: 'unit-4', tags: ['family'], front: 'Cotton family and photosynthetic pathway?', back: 'Malvaceae, C3, grown as a summer annual, fiber (+ oilseed).' },
  { id: 'fc-4-20', unitId: 'unit-4', tags: ['cycle'], front: 'Is a crop harvested the first year always an annual?', back: 'No. Biennials like sugarbeet and carrot are often harvested in the vegetative year. Perennials are harvested many years.' },
];

export function getFlashcardsForUnit(unitId: UnitId, extras: Flashcard[] = []): Flashcard[] {
  return [...builtInFlashcards, ...extras].filter((c) => c.unitId === unitId);
}

export function unitFlashcardCount(unitId: UnitId): number {
  return builtInFlashcards.filter((c) => c.unitId === unitId).length;
}
