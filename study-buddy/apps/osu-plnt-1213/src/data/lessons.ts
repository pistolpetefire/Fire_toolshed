import type { UnitId } from '../types';

export interface LessonSection {
  heading: string;
  body?: string;
  bullets?: string[];
  examTip?: string;
}

export interface UnitLesson {
  unitId: UnitId;
  intro: string;
  sections: LessonSection[];
  mustKnow: string[];
  traps: string[];
}

const STUB: Omit<UnitLesson, 'unitId'> = {
  intro:
    'This chapter is on a later exam. The tutorial, flashcards, and quiz bank will land after Exam 1. Use the syllabus map so you know what is coming.',
  sections: [
    {
      heading: 'Coming after Exam 1',
      body: 'Exam 1 (Friday Sept 4) is Chapters 1–4 only. Later chapters are stubbed so the semester path is visible.',
    },
  ],
  mustKnow: [],
  traps: [],
};

export const unitLessons: Record<UnitId, UnitLesson> = {
  'unit-1': {
    unitId: 'unit-1',
    intro:
      'Agronomy is an applied science. Before you memorize crop names, you have to be able to ask a testable question, run a fair trial, and read the result. Chapter 1 is the language of every later lab, homework, and field-trial example in this course.',
    sections: [
      {
        heading: 'The inquiry process',
        body: 'Science is a loop, not a one-way recipe. You observe something in a field or greenhouse, ask a question, propose a testable hypothesis, design an experiment, collect data, draw a conclusion, and (in real research) submit it to peer review. If the data kill the hypothesis, you revise — you do not “prove” a hypothesis true forever.',
        bullets: [
          'Observation — “Sorghum on the west side of the plot looks drought-stressed.”',
          'Question — “Does planting date change sorghum yield under late-summer heat?”',
          'Hypothesis — a testable, directional prediction: “Planting two weeks earlier will increase grain yield compared with the standard date.”',
          'Experiment — treatments, a control or comparison, measured response, replication.',
          'Conclusion — accept or reject the hypothesis based on the data, with limits (one year, one soil, one hybrid).',
        ],
        examTip:
          'A hypothesis must be falsifiable. “Sorghum is nice” is not a hypothesis. “Hybrid A yields more than Hybrid B at this site” is.',
      },
      {
        heading: 'Hypothesis vs theory vs law',
        body: 'Intro courses love this vocabulary trap. A hypothesis is a testable prediction for a specific experiment. A theory is a well-supported explanation of why something happens, built from many tests (cell theory, evolution by selection). A law describes a consistent pattern, often mathematically, without explaining the mechanism (e.g. a gas law). In agronomy you will almost always be writing hypotheses, not theories.',
        bullets: [
          'Hypothesis — specific, testable, often “if / then” or a comparison of treatments.',
          'Theory — broad, explanatory, supported by a large body of evidence. Not “just a guess.”',
          'Law — describes what happens; does not have to explain why.',
        ],
      },
      {
        heading: 'Variables, treatments, and controls',
        body: 'The independent variable is what the researcher changes (planting date, nitrogen rate, hybrid, tillage). The dependent variable is what is measured (yield, plant height, soil moisture, weed counts). Everything else you try to hold constant is a controlled variable (same soil type, same irrigation, same harvest date). A control or check treatment is the baseline you compare against — untreated, standard practice, or zero fertilizer.',
        bullets: [
          'Independent (treatment) — N rate: 0, 50, 100, 150 lb N/acre.',
          'Dependent (response) — grain yield in bu/acre, protein %, lodging.',
          'Controlled — same variety, same planting date, same row spacing.',
          'Experimental group gets the treatment; control/check does not (or gets the standard).',
        ],
        examTip:
          'If the prompt gives a trial, be ready to name IV, DV, and at least one controlled variable. Yield is almost always a dependent variable, not a treatment.',
      },
      {
        heading: 'Replication and randomization',
        body: 'Fields are never uniform. A low spot, a compacted headland, or a sand streak can fake a treatment effect. Replication means each treatment appears more than once so you can estimate variation. Randomization means treatments are assigned to plots without a pattern so soil gradients do not line up with one treatment. Together they are the minimum for a trustworthy field trial.',
        bullets: [
          'Replication — usually 3–6 plots (reps) per treatment in agronomic trials.',
          'Randomization — treatments shuffled within each block or across the field.',
          'Blocking — group similar soil together, then randomize treatments inside each block.',
          'One unreplicated strip is a demonstration, not an experiment.',
        ],
      },
      {
        heading: 'Field trials vs greenhouse vs lab',
        body: 'Haggard’s N-designation goal is that you can say what it takes to establish a field trial and how management decisions show up in data. Greenhouse trials control weather and let you isolate a factor (nutrient, pathogen) but they do not capture Oklahoma heat, hail, or spatial soil variation. Lab work (soil tests, germination tests) measures a sample, not a whole production system. Field trials are messy and essential: they are how agronomists pick planting rates, hybrids, and fertilizer rates for the southern Great Plains.',
        bullets: [
          'Field trial — real weather and soil; needs replication, plot size, border rows, a harvest protocol.',
          'Greenhouse — faster, more control, less realism.',
          'On-farm trial — grower equipment, larger plots, still needs a check strip and more than one year.',
        ],
      },
      {
        heading: 'Reading the result',
        body: 'A mean (average) yield per treatment is the first number you will see. Treatments that “look different” may not be statistically different if variation is large. Intro courses usually want you to: (1) state which treatment was highest/lowest, (2) notice if a control was included, (3) not over-claim (“this always works in Oklahoma”). Multiple years and sites beat one pretty graph.',
      },
    ],
    mustKnow: [
      'hypothesis',
      'independent variable',
      'dependent variable',
      'control / check',
      'replication',
      'randomization',
      'field trial',
      'theory vs law',
      'peer review',
    ],
    traps: [
      'Calling a hypothesis a theory.',
      'Treating yield as the independent variable.',
      'Calling an unreplicated demo an experiment.',
    ],
  },
  'unit-2': {
    unitId: 'unit-2',
    intro:
      'Chapter 2 is why agronomy exists: people selected plants, settled, and then spent 10,000 years trying not to starve. Know domestication, how production systems changed, and the modern definition of food security — including the country-data homework style of thinking (imports, exports, farm labor).',
    sections: [
      {
        heading: 'Role of plants in society',
        body: 'Plants are not just “food.” Agronomy tracks several end uses at once because they compete for land and policy.',
        bullets: [
          'Food — grains, pulses, oilseeds, fruits, vegetables, sugar.',
          'Feed — forage, silage, grain for livestock (corn, sorghum, alfalfa).',
          'Fiber — cotton, flax, hemp.',
          'Fuel / industrial — ethanol, biodiesel, oils, starches.',
          'Pharmaceuticals and ornamentals.',
          'Ecosystem services — soil cover, carbon, habitat, water infiltration. Every fertilizer and tillage decision hits atmosphere, soil, and water (Haggard’s N-course theme).',
        ],
      },
      {
        heading: 'Domestication = artificial selection',
        body: 'Wild plants were not waiting to be crops. Humans kept seed from plants with traits they liked — non-shattering heads, larger seed, less bitterness, synchronous ripening, loss of seed dormancy. That is artificial selection: humans, not the wild environment, set the fitness criteria. Natural selection still happens in weeds and feral populations. Domestication happened independently in several regions, not just the Fertile Crescent.',
        bullets: [
          'Fertile Crescent — wheat, barley, lentil, chickpea (~10,000 years before present).',
          'China — rice, soybean, millet.',
          'Mesoamerica — maize (corn), beans, squash.',
          'Andes — potato, quinoa.',
          'Africa — sorghum, pearl millet, cowpea.',
          'Eastern North America — sunflower, squash (later maize arrived from the south).',
        ],
        examTip:
          'Artificial selection is the exam phrase. “Farmers picked the plants they wanted and planted those seeds.” Corn’s ancestor is teosinte; it did not look like a modern ear.',
      },
      {
        heading: 'How agronomic systems evolved',
        body: 'Once people farmed, they had to manage soil fertility, weeds, and labor. Systems shifted from shifting cultivation and subsistence plots toward settled crop rotations, draft animals, then mechanization, then industrial inputs.',
        bullets: [
          'Subsistence / shifting cultivation — long fallows to restore fertility.',
          'Settled rotations — e.g. Norfolk four-course (wheat–turnip–barley–clover) that fed people and livestock and put N back via legumes.',
          'Mechanization — steel plow, reaper, tractor: less labor per acre, larger farms.',
          'Haber–Bosch process (early 20th century) — synthetic ammonia, cheap nitrogen fertilizer, huge yield jump and environmental cost.',
          'Green Revolution (1960s–70s) — Norman Borlaug’s semi-dwarf wheat, IR8 rice, fertilizer, irrigation, pesticides. Yields soared; dependence on inputs and water increased; traditional varieties were displaced in many regions.',
          'Late 20th–21st century — hybrids, GM traits, conservation tillage, precision ag, cover crops.',
        ],
      },
      {
        heading: 'Food security and hunger',
        body: 'Hunger is not only “not enough grain in the world.” FAO-style food security has four pillars. A country can export grain and still have hungry people if access (income, markets, conflict) fails.',
        bullets: [
          'Availability — is enough food produced or imported?',
          'Access — can households buy or grow it? Poverty, roads, war.',
          'Utilization — can bodies use it? Sanitation, diet quality, cooking fuel, nutrition knowledge.',
          'Stability — is it reliable across seasons and years? Drought, price spikes, conflict.',
          'Malnutrition includes undernutrition, micronutrient deficiency, and obesity — not only empty calories.',
        ],
        examTip:
          'The week-1 country assignment (top imports/exports, % of population in agriculture, economy) is this chapter applied. Be able to say: production ≠ food security.',
      },
      {
        heading: 'Great Plains context',
        body: 'Oklahoma sits in a region shaped by the Dust Bowl, soil conservation, and wheat–cattle systems. Native prairie was converted to cropland; unsustainable tillage plus drought produced the 1930s dust storms. That history is why later chapters on tillage, residue, and soil organic matter are not optional trivia — they are the course’s environmental argument.',
      },
    ],
    mustKnow: [
      'artificial selection',
      'domestication',
      'Fertile Crescent',
      'Green Revolution',
      'Haber–Bosch',
      'food security pillars',
      'feed vs food vs fiber',
      'Norman Borlaug',
    ],
    traps: [
      'Saying food security is only about producing more calories.',
      'Calling the Green Revolution “organic” or “low input.”',
      'Confusing natural selection with farmer-driven domestication.',
    ],
  },
  'unit-3': {
    unitId: 'unit-3',
    intro:
      'Morphology is the highest-volume Exam 1 chapter. If you can name a part, say what it does, and spot the modification (especially rhizomes), you can also start identifying crops and weeds — which is a listed learning goal.',
    sections: [
      {
        heading: 'Roots — form and function',
        body: 'Roots anchor the plant, absorb water and nutrients, and often store carbohydrates. Two architectural types show up on every exam.',
        bullets: [
          'Taproot — one dominant primary root, typical of dicots (alfalfa, cotton, carrot, dandelion). Good for deep water; the taproot itself may be the harvest (carrot, sugarbeet).',
          'Fibrous root system — many similar roots from the stem base, typical of monocots / grasses (wheat, corn, rice). Excellent for holding soil and exploring the topsoil.',
          'Root hairs massively increase surface area for absorption.',
          'Adventitious roots form from stem tissue (brace roots on corn, roots on a rhizome node).',
        ],
        examTip:
          'Sweet potato is a storage root. Irish potato is a stem (tuber). That distinction is a classic trap.',
      },
      {
        heading: 'Stems — nodes, internodes, meristems',
        body: 'A stem has nodes (where leaves and buds attach) and internodes (the segments between). The shoot apical meristem adds new growth. Axillary buds at nodes can become branches, tillers, or flowers. Xylem moves water and minerals up; phloem moves sugars from sources to sinks.',
        bullets: [
          'Tillers in grasses are stems from basal nodes (wheat, rice, sorghum).',
          'Culm = grass stem.',
          'Woody vs herbaceous is less tested than modifications, but know that alfalfa crowns persist while corn stalks do not.',
        ],
      },
      {
        heading: 'Leaves',
        body: 'Typical leaf: blade (lamina) + petiole + sometimes stipules. Grasses have a blade, sheath wrapping the stem, and a ligule at the junction — ligule shape is a weed-ID tool.',
        bullets: [
          'Simple leaf — one blade (soybean leaflet is part of a compound leaf; cotton is simple).',
          'Compound — multiple leaflets (soybean, alfalfa, locust).',
          'Parallel venation — monocots. Netted (reticulate) venation — dicots.',
          'Functions: photosynthesis, transpiration, sometimes storage or protection.',
        ],
      },
      {
        heading: 'Modifications — especially weedy rhizomes',
        body: 'Haggard calls out stem and leaf modifications and “how rhizomes can cause issues as weedy species.” A rhizome is an underground stem (nodes, internodes, scale leaves, buds) — not a root. Chopping it with tillage often multiplies the weed.',
        bullets: [
          'Rhizome — underground stem. Johnsongrass, quackgrass, bermudagrass. Perennial weeds that resprout from fragments.',
          'Stolon (runner) — aboveground horizontal stem. Strawberry, bermudagrass (uses both).',
          'Tuber — swollen underground stem with “eyes” = nodes. Potato.',
          'Bulb — short stem + fleshy storage leaves. Onion, garlic.',
          'Corm — swollen stem base. Taro, gladiolus.',
          'Tendrils — climbing (pea leaflets, grape stems).',
          'Spines — modified leaves (cactus); thorns are stems.',
          'Storage root — carrot, sweet potato, sugarbeet.',
        ],
        examTip:
          'If it has nodes and can sprout a shoot, it is a stem. Rhizomes survive winter and tillage; annual weeds that only seed are a different problem.',
      },
      {
        heading: 'Flower parts',
        body: 'Four whorls from outside in: calyx (sepals), corolla (petals), androecium (stamens), gynoecium (pistil/carpel). A stamen is anther + filament (pollen). A pistil is stigma + style + ovary (ovules become seeds; ovary becomes fruit).',
        bullets: [
          'Complete flower — all four whorls present.',
          'Incomplete — missing at least one whorl (grasses lack showy petals).',
          'Perfect (bisexual) — stamens and pistil in the same flower.',
          'Imperfect (unisexual) — staminate (male) or pistillate (female) only.',
          'A flower can be incomplete and still perfect (wheat). A flower can be complete and perfect (soybean, tomato).',
        ],
      },
      {
        heading: 'Monoecious, dioecious, synoecious — production impact',
        body: 'This is the morphology item most likely to show up as an application question.',
        bullets: [
          'Synoecious (or hermaphroditic crops) — perfect flowers. Wheat, rice, soybean, tomato. One plant can self or outcross depending on the species.',
          'Monoecious — separate male and female flowers on the SAME plant. Corn: tassel (male) at the top, ear (female) at the leaf axil. Cucurbits often too. You do not need a second sex of plant in the field for grain set, but pollen must still reach silks (wind).',
          'Dioecious — male and female plants are SEPARATE individuals. Hemp, spinach, holly, buffalo grass, hops. Fruit/seed only on females, so production systems must include pollenizers or plant sexed stands (all-female hemp for cannabinoids; hops harvest female cones).',
        ],
        examTip:
          'Corn is monoecious, not dioecious. “Need both sexes in the field” is the dioecious production hook.',
      },
      {
        heading: 'Inflorescences and ID',
        body: 'How flowers are arranged is a classification and ID tool.',
        bullets: [
          'Spike — sessile spikelets on a central axis (wheat, barley, rye).',
          'Panicle — branched (oats, rice, sorghum, johnsongrass).',
          'Raceme — flowers on short stalks along an axis.',
          'Umbel — like an umbrella (carrot family).',
          'Head / capitulum — many florets on a disk (sunflower, safflower).',
        ],
      },
      {
        heading: 'Monocot vs dicot cheat sheet',
        bullets: [
          'Monocot (Poaceae and others): one cotyledon, parallel veins, fibrous roots, floral parts in 3s, scattered vascular bundles (can’t “girdle”), often grasses.',
          'Dicot: two cotyledons, netted veins, taproot common, floral parts in 4s or 5s, vascular bundles in a ring.',
        ],
      },
    ],
    mustKnow: [
      'taproot vs fibrous',
      'node / internode',
      'rhizome',
      'stolon',
      'tuber vs storage root',
      'stamen (anther + filament)',
      'pistil (stigma, style, ovary)',
      'perfect vs imperfect',
      'monoecious / dioecious / synoecious',
      'ligule',
    ],
    traps: [
      'Calling a potato a root.',
      'Calling corn dioecious.',
      'Calling a rhizome a root.',
      'Mixing complete (whorls) with perfect (sexes).',
    ],
  },
  'unit-4': {
    unitId: 'unit-4',
    intro:
      'Chapter 4 is the sorting hat for the rest of the semester. Given a crop, you should be able to tag life cycle, photosynthetic pathway, and agronomic use — and often the plant family. Wednesday’s in-person quiz and the Ch 4 homework both live here, then Exam 1 Friday.',
    sections: [
      {
        heading: 'Life cycles',
        body: 'Life cycle is about how many seasons the plant uses to go seed-to-seed, not how long a product sits in a bin.',
        bullets: [
          'Summer annual — germinates spring/summer, dies after seed set the same year. Corn, soybean, cotton, sorghum, peanut, rice.',
          'Winter annual — planted/germinates in fall, vernalizes over winter, flowers in spring. Winter wheat, rye, winter canola, henbit (weed).',
          'Biennial — vegetative rosette year 1, flowers and dies year 2. Sugarbeet, carrot, onion (often grown as annuals for the vegetative product), sweet clover.',
          'Perennial — lives multiple years, often via crowns, rhizomes, or stolons. Alfalfa, fescue, bermudagrass, switchgrass, fruit trees, johnsongrass (weed).',
        ],
        examTip:
          'Wheat in Oklahoma is typically a winter annual. Corn is a summer annual. Alfalfa is a perennial. Sugarbeet is a biennial harvested in year 1 for the root.',
      },
      {
        heading: 'Photosynthetic pathways — C3 vs C4',
        body: 'This is a listed classification axis and it matters in Oklahoma heat. C3 plants use Rubisco in the Calvin cycle and suffer photorespiration when it is hot and stomata close (O2 competes with CO2). C4 plants concentrate CO2 around Rubisco using PEP carboxylase and Kranz anatomy (bundle sheath), so they keep photosynthesizing in heat and generally use water more efficiently.',
        bullets: [
          'C3 crops — wheat, rice, barley, soybean, cotton, alfalfa, peanut, potato. Often cool-season or shade-tolerant; many higher-protein forages/grains.',
          'C4 crops — corn, sorghum, sugarcane, millet, bermudagrass, johnsongrass. Warm-season, high light, high WUE, southern Great Plains summer workhorses.',
          'CAM — stomata open at night (pineapple, agave, many succulents). Rare as a major Oklahoma field crop.',
        ],
        examTip:
          'Corn = C4. Wheat = C3. Soybean = C3. Sorghum = C4. Bermudagrass = C4 perennial. Alfalfa = C3 perennial.',
      },
      {
        heading: 'Why C4 wins Oklahoma summers (and C3 still matters)',
        body: 'C4 is not “better” in every environment. Wheat is C3 and it is Oklahoma’s signature grain because it grows in the cool season when C4 corn is not in the field. C3 soybeans fill a protein/oil niche corn cannot. Pathway + season + use is the full classification, not pathway alone.',
      },
      {
        heading: 'Agronomic / nutritional use',
        body: 'Haggard lists feed vs protein vs starch, and the overview also includes how we use crops. One crop can wear two hats (soybean is oil + protein).',
        bullets: [
          'Cereal / starch grain — wheat, corn, rice, sorghum, barley, oats, rye, millet.',
          'Pulse / protein legume — dry bean, pea, lentil, chickpea; soybean is a protein+oil giant.',
          'Oilseed — soybean, canola, sunflower, peanut, cottonseed, flax.',
          'Forage / feed — alfalfa, clover, bermudagrass, corn silage, sorghum-sudan.',
          'Fiber — cotton, flax, hemp.',
          'Sugar — sugarcane (C4), sugarbeet (C3 biennial).',
          'Specialty — tobacco, hops, guar.',
        ],
      },
      {
        heading: 'Botanical classification (just enough)',
        body: 'Binomial names are Genus species (italicized). Family is the useful agronomic bucket.',
        bullets: [
          'Poaceae (grass family) — wheat (Triticum aestivum), corn (Zea mays), rice (Oryza sativa), sorghum (Sorghum bicolor), barley, oats, rye, sugarcane, fescue, bermuda, johnsongrass.',
          'Fabaceae (legume family) — soybean (Glycine max), alfalfa (Medicago sativa), peanut, clover, dry bean, pea. Many fix N via Rhizobium.',
          'Malvaceae — cotton (Gossypium).',
          'Solanaceae — potato, tomato, tobacco.',
          'Asteraceae — sunflower, safflower.',
          'Amaranthaceae (incl. former Chenopodiaceae) — sugarbeet, quinoa, pigweed (weed).',
          'Cannabaceae — hemp, hops.',
        ],
      },
      {
        heading: 'Putting the tags together',
        body: 'Exam items often give a crop and ask for two or three tags, or give tags and ask which crop fits.',
        bullets: [
          'Corn — summer annual, C4, Poaceae, starch grain (also silage feed), monoecious.',
          'Winter wheat — winter annual, C3, Poaceae, starch grain, synoecious/perfect flowers in spikelets.',
          'Soybean — summer annual, C3, Fabaceae, protein + oil, perfect flowers.',
          'Alfalfa — perennial, C3, Fabaceae, forage/protein, taproot.',
          'Cotton — summer annual (grown as), C3, Malvaceae, fiber (+ oilseed), taproot.',
          'Johnsongrass — perennial rhizomatous C4 grass weed, panicle.',
        ],
      },
    ],
    mustKnow: [
      'summer vs winter annual',
      'biennial',
      'perennial',
      'C3 vs C4',
      'photorespiration',
      'Kranz anatomy / PEP carboxylase (C4)',
      'Poaceae',
      'Fabaceae',
      'starch vs protein vs oil vs forage vs fiber',
    ],
    traps: [
      'Calling wheat C4 because it is a grass.',
      'Calling alfalfa an annual.',
      'Assuming C4 = always higher yielding (not in a cool spring).',
      'Forgetting soybean is both protein and oil.',
    ],
  },
  'unit-5': { unitId: 'unit-5', ...STUB },
  'unit-6': { unitId: 'unit-6', ...STUB },
  'unit-7': { unitId: 'unit-7', ...STUB },
  'unit-8': { unitId: 'unit-8', ...STUB },
  'unit-9': { unitId: 'unit-9', ...STUB },
  'unit-10': { unitId: 'unit-10', ...STUB },
  'unit-11': { unitId: 'unit-11', ...STUB },
  'unit-12': { unitId: 'unit-12', ...STUB },
  'unit-13': { unitId: 'unit-13', ...STUB },
  'unit-14': { unitId: 'unit-14', ...STUB },
  'unit-15': { unitId: 'unit-15', ...STUB },
  'unit-16': { unitId: 'unit-16', ...STUB },
};

export function getLesson(unitId: UnitId): UnitLesson {
  return unitLessons[unitId];
}
