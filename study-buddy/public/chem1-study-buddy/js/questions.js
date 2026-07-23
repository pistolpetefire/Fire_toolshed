/**
 * Chemistry I Final Study Buddy — MCQ bank (includes modest electrochemistry)
 * Edit freely. Keep id unique. answer is "A"|"B"|"C"|"D".
 * topics: string[] matching data/topics.js ids.
 */
window.CHEM1_QUESTIONS = [
  {
    "id": "m01",
    "topics": [
      "measurement"
    ],
    "stem": "How many significant figures are in 0.00450?",
    "choices": [
      "2",
      "3",
      "4",
      "5"
    ],
    "answer": "B",
    "explanation": "Leading zeros are not significant; trailing zero after the decimal is significant → three sig figs."
  },
  {
    "id": "m02",
    "topics": [
      "measurement"
    ],
    "stem": "Which measurement is reported with the greatest precision as written?",
    "choices": [
      "12 m",
      "12.0 m",
      "12.00 m",
      "1.2 x 10^1 m"
    ],
    "answer": "C",
    "explanation": "12.00 m has four significant figures."
  },
  {
    "id": "m03",
    "topics": [
      "measurement"
    ],
    "stem": "Convert 2.5 km to meters.",
    "choices": [
      "0.0025 m",
      "25 m",
      "250 m",
      "2500 m"
    ],
    "answer": "D",
    "explanation": "1 km = 1000 m → 2.5 x 1000 = 2500 m."
  },
  {
    "id": "m04",
    "topics": [
      "measurement"
    ],
    "stem": "Round 0.003456 to three significant figures.",
    "choices": [
      "0.003",
      "0.00346",
      "0.00345",
      "0.346"
    ],
    "answer": "B",
    "explanation": "Three sig figs → 0.00346 (or 3.46 x 10^-3)."
  },
  {
    "id": "m05",
    "topics": [
      "measurement"
    ],
    "stem": "In dimensional analysis, conversion factors are set up so that unwanted units:",
    "choices": [
      "add together",
      "cancel between numerator and denominator",
      "multiply the answer by 10",
      "become mass"
    ],
    "answer": "B",
    "explanation": "Place units diagonally so they cancel."
  },
  {
    "id": "m06",
    "topics": [
      "measurement"
    ],
    "stem": "Which is a derived quantity (not a base SI unit)?",
    "choices": [
      "meter",
      "kilogram",
      "second",
      "density"
    ],
    "answer": "D",
    "explanation": "Density = mass/volume is derived."
  },
  {
    "id": "m07",
    "topics": [
      "measurement"
    ],
    "stem": "Scientific notation for 45,200 with three significant figures is:",
    "choices": [
      "4.52 x 10^3",
      "4.52 x 10^4",
      "4.5 x 10^4",
      "45.2 x 10^3"
    ],
    "answer": "B",
    "explanation": "4.52 x 10^4."
  },
  {
    "id": "m08",
    "topics": [
      "measurement"
    ],
    "stem": "When multiplying 2.5 x 3.42, the product should have how many significant figures?",
    "choices": [
      "1",
      "2",
      "3",
      "4"
    ],
    "answer": "B",
    "explanation": "Multiplication is limited by the fewest sig figs (2.5 has two)."
  },
  {
    "id": "m09",
    "topics": [
      "measurement"
    ],
    "stem": "If 1.00 in = 2.54 cm, how many cm are in 5.00 in?",
    "choices": [
      "2.54 cm",
      "7.62 cm",
      "12.7 cm",
      "5.00 cm"
    ],
    "answer": "C",
    "explanation": "5.00 x 2.54 = 12.7 cm."
  },
  {
    "id": "m10",
    "topics": [
      "measurement"
    ],
    "stem": "The prefix milli- means:",
    "choices": [
      "10^3",
      "10^-2",
      "10^-3",
      "10^-6"
    ],
    "answer": "C",
    "explanation": "milli- = 10^-3."
  },
  {
    "id": "a01",
    "topics": [
      "atomic"
    ],
    "stem": "The atomic number of an element equals the number of:",
    "choices": [
      "neutrons",
      "protons",
      "protons + neutrons",
      "neutrons + electrons"
    ],
    "answer": "B",
    "explanation": "Atomic number Z = protons; it identifies the element."
  },
  {
    "id": "a02",
    "topics": [
      "atomic"
    ],
    "stem": "Mass number equals:",
    "choices": [
      "protons only",
      "neutrons only",
      "protons + neutrons",
      "protons + electrons"
    ],
    "answer": "C",
    "explanation": "A = p + n."
  },
  {
    "id": "a03",
    "topics": [
      "atomic"
    ],
    "stem": "Isotopes of an element have the same number of ___ and different numbers of ___.",
    "choices": [
      "neutrons; protons",
      "protons; neutrons",
      "electrons; protons",
      "neutrons; electrons only"
    ],
    "answer": "B",
    "explanation": "Same Z, different neutron counts."
  },
  {
    "id": "a04",
    "topics": [
      "atomic"
    ],
    "stem": "A neutral atom of carbon-14 has how many electrons?",
    "choices": [
      "6",
      "8",
      "14",
      "20"
    ],
    "answer": "A",
    "explanation": "Carbon Z = 6; neutral atom has 6 electrons."
  },
  {
    "id": "a05",
    "topics": [
      "atomic"
    ],
    "stem": "Which subatomic particle has a charge of -1?",
    "choices": [
      "proton",
      "neutron",
      "electron",
      "alpha particle"
    ],
    "answer": "C",
    "explanation": "Electrons are negatively charged."
  },
  {
    "id": "a06",
    "topics": [
      "atomic"
    ],
    "stem": "The electron configuration of neon (Z = 10) is best written as ending in:",
    "choices": [
      "2s2",
      "2p6",
      "3s2",
      "3p6"
    ],
    "answer": "B",
    "explanation": "Ne: 1s2 2s2 2p6."
  },
  {
    "id": "a07",
    "topics": [
      "atomic"
    ],
    "stem": "After the 3s subshell fills, electrons next enter:",
    "choices": [
      "3p",
      "3d",
      "4s",
      "2p"
    ],
    "answer": "A",
    "explanation": "Aufbau: 3s then 3p."
  },
  {
    "id": "a08",
    "topics": [
      "atomic"
    ],
    "stem": "How many valence electrons does a neutral oxygen atom have?",
    "choices": [
      "2",
      "4",
      "6",
      "8"
    ],
    "answer": "C",
    "explanation": "Group 16 → six valence electrons."
  },
  {
    "id": "a09",
    "topics": [
      "atomic"
    ],
    "stem": "A cation forms when an atom:",
    "choices": [
      "gains protons",
      "gains electrons",
      "loses electrons",
      "loses neutrons"
    ],
    "answer": "C",
    "explanation": "Losing electrons makes a positive ion."
  },
  {
    "id": "a10",
    "topics": [
      "atomic"
    ],
    "stem": "A neutral argon atom (Z = 18) has how many electrons?",
    "choices": [
      "8",
      "10",
      "18",
      "36"
    ],
    "answer": "C",
    "explanation": "Neutral atom: electrons = protons = 18."
  },
  {
    "id": "p01",
    "topics": [
      "periodic"
    ],
    "stem": "Across a period left to right, atomic radius generally:",
    "choices": [
      "increases",
      "decreases",
      "stays the same",
      "becomes undefined"
    ],
    "answer": "B",
    "explanation": "Greater effective nuclear charge pulls electrons closer."
  },
  {
    "id": "p02",
    "topics": [
      "periodic"
    ],
    "stem": "Down a group, first ionization energy generally:",
    "choices": [
      "increases",
      "decreases",
      "stays constant",
      "is zero"
    ],
    "answer": "B",
    "explanation": "Valence electrons are farther from the nucleus and easier to remove."
  },
  {
    "id": "p03",
    "topics": [
      "periodic"
    ],
    "stem": "Which element is most electronegative among these?",
    "choices": [
      "Na",
      "Cl",
      "C",
      "Si"
    ],
    "answer": "B",
    "explanation": "Cl is highly electronegative (F is highest overall)."
  },
  {
    "id": "p04",
    "topics": [
      "periodic"
    ],
    "stem": "Metals tend to form ions by:",
    "choices": [
      "gaining electrons",
      "losing electrons",
      "sharing neutrons",
      "gaining protons"
    ],
    "answer": "B",
    "explanation": "Metals typically form cations."
  },
  {
    "id": "p05",
    "topics": [
      "periodic"
    ],
    "stem": "Which element is a halogen?",
    "choices": [
      "Na",
      "Mg",
      "Cl",
      "Ar"
    ],
    "answer": "C",
    "explanation": "Halogens are Group 17."
  },
  {
    "id": "p06",
    "topics": [
      "periodic"
    ],
    "stem": "Noble gases are relatively unreactive mainly because they have:",
    "choices": [
      "empty valence shells",
      "full valence shells",
      "no electrons",
      "only protons"
    ],
    "answer": "B",
    "explanation": "ns2 np6 (He: 1s2) is especially stable."
  },
  {
    "id": "p07",
    "topics": [
      "periodic"
    ],
    "stem": "Which element is a metalloid?",
    "choices": [
      "Na",
      "Fe",
      "Si",
      "O"
    ],
    "answer": "C",
    "explanation": "Silicon is a classic metalloid."
  },
  {
    "id": "p08",
    "topics": [
      "periodic"
    ],
    "stem": "Compared with Na, Mg generally has a ___ first ionization energy.",
    "choices": [
      "lower",
      "higher",
      "identical",
      "zero"
    ],
    "answer": "B",
    "explanation": "Mg is farther right; harder to remove an electron."
  },
  {
    "id": "n01",
    "topics": [
      "nomenclature"
    ],
    "stem": "The correct formula for aluminum oxide is:",
    "choices": [
      "AlO",
      "Al2O",
      "AlO3",
      "Al2O3"
    ],
    "answer": "D",
    "explanation": "Al3+ and O2- combine as Al2O3."
  },
  {
    "id": "n02",
    "topics": [
      "nomenclature"
    ],
    "stem": "The name of Na2SO4 is:",
    "choices": [
      "sodium sulfite",
      "sodium sulfate",
      "disodium sulfur oxide",
      "sodium sulfide"
    ],
    "answer": "B",
    "explanation": "SO4^2- is sulfate."
  },
  {
    "id": "n03",
    "topics": [
      "nomenclature"
    ],
    "stem": "Using the Stock system, FeCl3 is named:",
    "choices": [
      "iron chloride",
      "iron(I) chloride",
      "iron(II) chloride",
      "iron(III) chloride"
    ],
    "answer": "D",
    "explanation": "Three Cl- imply Fe3+ → iron(III) chloride."
  },
  {
    "id": "n04",
    "topics": [
      "nomenclature"
    ],
    "stem": "The formula for calcium nitrate is:",
    "choices": [
      "CaNO3",
      "Ca2NO3",
      "Ca(NO3)2",
      "CaN"
    ],
    "answer": "C",
    "explanation": "Ca2+ needs two nitrate ions."
  },
  {
    "id": "n05",
    "topics": [
      "nomenclature"
    ],
    "stem": "Which is a molecular (covalent) compound?",
    "choices": [
      "NaCl",
      "MgO",
      "CO2",
      "CaF2"
    ],
    "answer": "C",
    "explanation": "Two nonmetals: carbon dioxide."
  },
  {
    "id": "n06",
    "topics": [
      "nomenclature"
    ],
    "stem": "The name of N2O5 is:",
    "choices": [
      "nitrogen oxide",
      "dinitrogen pentoxide",
      "nitrogen pentoxide",
      "nitrous oxide"
    ],
    "answer": "B",
    "explanation": "Binary molecular naming: dinitrogen pentoxide."
  },
  {
    "id": "n07",
    "topics": [
      "nomenclature"
    ],
    "stem": "The ammonium ion is:",
    "choices": [
      "NH3",
      "NH4+",
      "NO3-",
      "NO2-"
    ],
    "answer": "B",
    "explanation": "Ammonium is NH4+."
  },
  {
    "id": "n08",
    "topics": [
      "nomenclature"
    ],
    "stem": "Ionic bonds typically form between:",
    "choices": [
      "two nonmetals",
      "a metal and a nonmetal",
      "two metals",
      "two noble gases"
    ],
    "answer": "B",
    "explanation": "Metal + nonmetal is the classic ionic pair."
  },
  {
    "id": "n09",
    "topics": [
      "nomenclature"
    ],
    "stem": "A shared pair of electrons is characteristic of a:",
    "choices": [
      "ionic bond",
      "metallic bond only",
      "covalent bond",
      "nuclear force"
    ],
    "answer": "C",
    "explanation": "Covalent bonds share electron pairs."
  },
  {
    "id": "n10",
    "topics": [
      "nomenclature"
    ],
    "stem": "Which molecule is linear?",
    "choices": [
      "H2O",
      "CO2",
      "NH3",
      "CH4"
    ],
    "answer": "B",
    "explanation": "CO2 is O=C=O and linear; water is bent."
  },
  {
    "id": "n11",
    "topics": [
      "nomenclature"
    ],
    "stem": "VSEPR predicts the shape of CH4 as:",
    "choices": [
      "linear",
      "trigonal planar",
      "tetrahedral",
      "octahedral"
    ],
    "answer": "C",
    "explanation": "Four bonding pairs → tetrahedral."
  },
  {
    "id": "n12",
    "topics": [
      "nomenclature"
    ],
    "stem": "Aqueous HCl is named:",
    "choices": [
      "hydrogen chloride gas",
      "hydrochloric acid",
      "chloric acid",
      "hypochlorous acid"
    ],
    "answer": "B",
    "explanation": "Binary aqueous acid: hydrochloric acid."
  },
  {
    "id": "s01",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Avogadro number is approximately:",
    "choices": [
      "6.02 x 10^21",
      "6.02 x 10^23",
      "3.00 x 10^8",
      "1.66 x 10^-24"
    ],
    "answer": "B",
    "explanation": "1 mol contains about 6.02 x 10^23 particles."
  },
  {
    "id": "s02",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Molar mass of H2O is closest to:",
    "choices": [
      "10 g/mol",
      "18 g/mol",
      "32 g/mol",
      "44 g/mol"
    ],
    "answer": "B",
    "explanation": "2(1) + 16 = 18 g/mol."
  },
  {
    "id": "s03",
    "topics": [
      "stoichiometry"
    ],
    "stem": "How many moles are in 36 g of H2O?",
    "choices": [
      "1.0 mol",
      "2.0 mol",
      "0.50 mol",
      "18 mol"
    ],
    "answer": "B",
    "explanation": "36 g / 18 g/mol = 2.0 mol."
  },
  {
    "id": "s04",
    "topics": [
      "stoichiometry"
    ],
    "stem": "For 2 H2 + O2 → 2 H2O, moles of H2O from 3.0 mol O2 (excess H2):",
    "choices": [
      "2.0",
      "3.0",
      "6.0",
      "1.5"
    ],
    "answer": "C",
    "explanation": "1 mol O2 produces 2 mol H2O → 6.0 mol H2O."
  },
  {
    "id": "s05",
    "topics": [
      "stoichiometry"
    ],
    "stem": "The limiting reactant is the reactant that:",
    "choices": [
      "has the largest mass",
      "is used up first",
      "has the highest molar mass",
      "is always the product"
    ],
    "answer": "B",
    "explanation": "It runs out first and limits product amount."
  },
  {
    "id": "s06",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Percent yield equals:",
    "choices": [
      "(actual/theoretical) x 100%",
      "(theoretical/actual) x 100%",
      "actual - theoretical",
      "moles x 100"
    ],
    "answer": "A",
    "explanation": "Standard definition of percent yield."
  },
  {
    "id": "s07",
    "topics": [
      "stoichiometry"
    ],
    "stem": "If theoretical yield is 10.0 g and actual yield is 8.0 g, percent yield is:",
    "choices": [
      "80%",
      "125%",
      "8%",
      "18%"
    ],
    "answer": "A",
    "explanation": "(8.0/10.0) x 100% = 80%."
  },
  {
    "id": "s08",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Mass of 0.50 mol CO2 (M = 44 g/mol) is:",
    "choices": [
      "22 g",
      "44 g",
      "88 g",
      "11 g"
    ],
    "answer": "A",
    "explanation": "0.50 x 44 = 22 g."
  },
  {
    "id": "s09",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Number of He atoms in 2.0 mol He is about:",
    "choices": [
      "6.0 x 10^23",
      "1.2 x 10^24",
      "3.0 x 10^23",
      "2"
    ],
    "answer": "B",
    "explanation": "2.0 x 6.0 x 10^23 = 1.2 x 10^24."
  },
  {
    "id": "s10",
    "topics": [
      "stoichiometry"
    ],
    "stem": "In a balanced equation, coefficients represent:",
    "choices": [
      "masses in grams only",
      "mole ratios",
      "densities",
      "temperatures"
    ],
    "answer": "B",
    "explanation": "Coefficients give mole ratios of species."
  },
  {
    "id": "s11",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Typical path from grams of A to grams of B is:",
    "choices": [
      "g A → mol A → mol B → g B",
      "g A → g B in one step always",
      "atoms only",
      "volume only"
    ],
    "answer": "A",
    "explanation": "Use molar masses and the mole ratio from the balanced equation."
  },
  {
    "id": "s12",
    "topics": [
      "stoichiometry"
    ],
    "stem": "Reaction needs 2 mol A per 1 mol B. You mix 4 mol A with 1 mol B. Limiting reactant is:",
    "choices": [
      "A",
      "B",
      "neither",
      "both equally"
    ],
    "answer": "B",
    "explanation": "4 mol A would need 2 mol B; only 1 mol B is available."
  },
  {
    "id": "s13",
    "topics": [
      "stoichiometry"
    ],
    "stem": "An empirical formula is the:",
    "choices": [
      "actual molecular formula always",
      "simplest whole-number ratio of atoms",
      "percent composition alone",
      "balanced equation"
    ],
    "answer": "B",
    "explanation": "Simplest ratio of atoms in the compound."
  },
  {
    "id": "s14",
    "topics": [
      "stoichiometry"
    ],
    "stem": "To get a molecular formula from an empirical formula you need the:",
    "choices": [
      "color",
      "molar mass of the compound",
      "density of water",
      "boiling point only"
    ],
    "answer": "B",
    "explanation": "n = M_molecular / M_empirical."
  },
  {
    "id": "r01",
    "topics": [
      "reactions"
    ],
    "stem": "The correctly balanced equation for hydrogen + oxygen → water is:",
    "choices": [
      "H2 + O2 → H2O",
      "2 H2 + O2 → 2 H2O",
      "2 H2 + 2 O2 → 2 H2O",
      "H2 + O2 → 2 H2O"
    ],
    "answer": "B",
    "explanation": "2 H2 + O2 → 2 H2O balances atoms."
  },
  {
    "id": "r02",
    "topics": [
      "reactions"
    ],
    "stem": "2 Na + Cl2 → 2 NaCl is best classified as:",
    "choices": [
      "decomposition",
      "single replacement",
      "synthesis (combination)",
      "double replacement"
    ],
    "answer": "C",
    "explanation": "Elements combine to form one compound."
  },
  {
    "id": "r03",
    "topics": [
      "reactions"
    ],
    "stem": "2 HgO → 2 Hg + O2 is:",
    "choices": [
      "synthesis",
      "decomposition",
      "combustion",
      "acid-base"
    ],
    "answer": "B",
    "explanation": "One compound breaks into simpler substances."
  },
  {
    "id": "r04",
    "topics": [
      "reactions"
    ],
    "stem": "Zn + CuSO4 → ZnSO4 + Cu is:",
    "choices": [
      "double replacement",
      "single replacement",
      "synthesis",
      "combustion"
    ],
    "answer": "B",
    "explanation": "Zn displaces Cu."
  },
  {
    "id": "r05",
    "topics": [
      "reactions"
    ],
    "stem": "AgNO3 + NaCl → AgCl + NaNO3 is:",
    "choices": [
      "single replacement",
      "double replacement",
      "decomposition",
      "combustion"
    ],
    "answer": "B",
    "explanation": "Ions exchange partners."
  },
  {
    "id": "r06",
    "topics": [
      "reactions"
    ],
    "stem": "Complete combustion of a hydrocarbon produces:",
    "choices": [
      "CO2 and H2O",
      "only CO",
      "only H2",
      "N2 and O2"
    ],
    "answer": "A",
    "explanation": "Complete combustion yields carbon dioxide and water."
  },
  {
    "id": "r07",
    "topics": [
      "reactions"
    ],
    "stem": "When balancing equations you may change:",
    "choices": [
      "subscripts in formulas",
      "coefficients only",
      "element identities freely",
      "nothing at all"
    ],
    "answer": "B",
    "explanation": "Only coefficients; formulas stay intact."
  },
  {
    "id": "r08",
    "topics": [
      "reactions"
    ],
    "stem": "A precipitate most often forms in:",
    "choices": [
      "all gas reactions",
      "double-replacement aqueous reactions",
      "nuclear reactions",
      "every combustion"
    ],
    "answer": "B",
    "explanation": "An insoluble solid can form when ions swap in solution."
  },
  {
    "id": "r09",
    "topics": [
      "reactions"
    ],
    "stem": "The balanced equation for Fe + O2 → Fe2O3 uses which Fe : O2 : Fe2O3 coefficients?",
    "choices": [
      "2 : 3 : 1",
      "4 : 3 : 2",
      "1 : 1 : 1",
      "2 : 1 : 1"
    ],
    "answer": "B",
    "explanation": "4 Fe + 3 O2 → 2 Fe2O3."
  },
  {
    "id": "r10",
    "topics": [
      "reactions"
    ],
    "stem": "A balanced chemical equation always conserves:",
    "choices": [
      "volume of all gases",
      "mass (number of each type of atom)",
      "temperature",
      "color"
    ],
    "answer": "B",
    "explanation": "Balancing keeps atom counts equal on both sides, so mass is conserved."
  },
  {
    "id": "g01",
    "topics": [
      "gases"
    ],
    "stem": "Boyle law (constant T): pressure and volume are:",
    "choices": [
      "directly proportional",
      "inversely proportional",
      "unrelated",
      "always equal"
    ],
    "answer": "B",
    "explanation": "P1V1 = P2V2."
  },
  {
    "id": "g02",
    "topics": [
      "gases"
    ],
    "stem": "Charles law (constant P): volume and absolute temperature are:",
    "choices": [
      "inversely proportional",
      "directly proportional",
      "equal",
      "undefined"
    ],
    "answer": "B",
    "explanation": "V/T is constant when P and n are fixed."
  },
  {
    "id": "g03",
    "topics": [
      "gases"
    ],
    "stem": "The ideal gas law is written:",
    "choices": [
      "PV = nRT",
      "P = nRT",
      "V = nRT",
      "n = PVT"
    ],
    "answer": "A",
    "explanation": "PV = nRT."
  },
  {
    "id": "g04",
    "topics": [
      "gases"
    ],
    "stem": "A common definition of STP is:",
    "choices": [
      "0 C and 1 atm",
      "25 C and 2 atm",
      "100 C and 1 atm",
      "0 K and 1 atm"
    ],
    "answer": "A",
    "explanation": "Often 0 C (273 K) and 1 atm — confirm your course table."
  },
  {
    "id": "g05",
    "topics": [
      "gases"
    ],
    "stem": "Molar volume of an ideal gas at classic STP is about:",
    "choices": [
      "1.0 L",
      "11.2 L",
      "22.4 L",
      "44.8 L"
    ],
    "answer": "C",
    "explanation": "About 22.4 L/mol at classic STP."
  },
  {
    "id": "g06",
    "topics": [
      "gases"
    ],
    "stem": "If absolute temperature doubles at constant n and P, volume:",
    "choices": [
      "halves",
      "doubles",
      "stays the same",
      "goes to zero"
    ],
    "answer": "B",
    "explanation": "Charles: V proportional to T."
  },
  {
    "id": "g07",
    "topics": [
      "gases"
    ],
    "stem": "A common Chem I value of R is:",
    "choices": [
      "0.0821 L·atm/(mol·K)",
      "1.00 L/mol",
      "22.4 atm",
      "273 L/mol"
    ],
    "answer": "A",
    "explanation": "0.0821 L·atm·mol^-1·K^-1 is widely used."
  },
  {
    "id": "g08",
    "topics": [
      "gases"
    ],
    "stem": "The combined gas law relates which variables (n fixed)?",
    "choices": [
      "P, V, and T",
      "only P and n",
      "only moles",
      "only density"
    ],
    "answer": "A",
    "explanation": "P1V1/T1 = P2V2/T2."
  },
  {
    "id": "g09",
    "topics": [
      "gases"
    ],
    "stem": "Temperature in gas-law equations must be in:",
    "choices": [
      "Celsius",
      "Fahrenheit",
      "Kelvin",
      "any unit without conversion"
    ],
    "answer": "C",
    "explanation": "Convert C to K: T(K) = T(C) + 273."
  },
  {
    "id": "g10",
    "topics": [
      "gases"
    ],
    "stem": "At constant T and n, if volume is halved, pressure:",
    "choices": [
      "halves",
      "doubles",
      "is unchanged",
      "becomes zero"
    ],
    "answer": "B",
    "explanation": "Boyle: inverse relation."
  },
  {
    "id": "sol01",
    "topics": [
      "solutions"
    ],
    "stem": "Molarity (M) is defined as:",
    "choices": [
      "moles solute / liters solution",
      "moles solute / kg solvent",
      "grams / mL",
      "percent by mass only"
    ],
    "answer": "A",
    "explanation": "M = mol/L of solution."
  },
  {
    "id": "sol02",
    "topics": [
      "solutions"
    ],
    "stem": "Moles of NaCl in 2.0 L of 0.50 M NaCl:",
    "choices": [
      "0.25",
      "1.0",
      "2.5",
      "0.50"
    ],
    "answer": "B",
    "explanation": "mol = M x V = 0.50 x 2.0 = 1.0 mol."
  },
  {
    "id": "sol03",
    "topics": [
      "solutions"
    ],
    "stem": "The dilution equation is:",
    "choices": [
      "M1V1 = M2V2",
      "M1 + V1 = M2 + V2",
      "M1/V1 = M2/V2",
      "P1V1 = P2V2"
    ],
    "answer": "A",
    "explanation": "Moles of solute stay the same on dilution."
  },
  {
    "id": "sol04",
    "topics": [
      "solutions"
    ],
    "stem": "To prepare 1.0 L of 0.10 M from 1.0 M stock, measure:",
    "choices": [
      "1.0 L of stock",
      "0.10 L of stock and dilute to 1.0 L",
      "10 L of stock",
      "0.010 L with no water"
    ],
    "answer": "B",
    "explanation": "V1 = M2V2/M1 = 0.10 L."
  },
  {
    "id": "sol05",
    "topics": [
      "solutions"
    ],
    "stem": "The solute is the:",
    "choices": [
      "substance always present in greater amount",
      "substance that is dissolved",
      "container",
      "pure solvent only"
    ],
    "answer": "B",
    "explanation": "Solute dissolves in the solvent."
  },
  {
    "id": "sol06",
    "topics": [
      "solutions"
    ],
    "stem": "Aqueous means dissolved in:",
    "choices": [
      "alcohol",
      "water",
      "oil",
      "air"
    ],
    "answer": "B",
    "explanation": "(aq) means water solution."
  },
  {
    "id": "sol07",
    "topics": [
      "solutions"
    ],
    "stem": "If you dilute a solution, its molarity generally:",
    "choices": [
      "increases",
      "decreases",
      "stays exactly the same",
      "becomes infinite"
    ],
    "answer": "B",
    "explanation": "Same moles in larger volume → lower M."
  },
  {
    "id": "sol08",
    "topics": [
      "solutions"
    ],
    "stem": "Mass of NaOH (40 g/mol) needed for 0.50 L of 1.0 M solution:",
    "choices": [
      "20 g",
      "40 g",
      "10 g",
      "80 g"
    ],
    "answer": "A",
    "explanation": "mol = 0.50; mass = 0.50 x 40 = 20 g."
  },
  {
    "id": "sol09",
    "topics": [
      "solutions"
    ],
    "stem": "In solution stoichiometry, volume of solution is often converted to moles using:",
    "choices": [
      "density of air",
      "molarity",
      "color",
      "boiling point"
    ],
    "answer": "B",
    "explanation": "moles = M x liters."
  },
  {
    "id": "sol10",
    "topics": [
      "solutions"
    ],
    "stem": "Which is a homogeneous mixture?",
    "choices": [
      "sand in water (settling)",
      "oil layered on water",
      "well-mixed salt water",
      "granite rock"
    ],
    "answer": "C",
    "explanation": "Uniform composition throughout."
  },
  {
    "id": "t01",
    "topics": [
      "thermo"
    ],
    "stem": "An exothermic process:",
    "choices": [
      "absorbs heat from the surroundings",
      "releases heat to the surroundings",
      "always has positive delta H",
      "never involves energy"
    ],
    "answer": "B",
    "explanation": "Heat leaves the system; surroundings warm."
  },
  {
    "id": "t02",
    "topics": [
      "thermo"
    ],
    "stem": "For an endothermic process, delta H is typically:",
    "choices": [
      "negative",
      "positive",
      "always zero",
      "undefined"
    ],
    "answer": "B",
    "explanation": "System gains heat; delta H > 0 by convention."
  },
  {
    "id": "t03",
    "topics": [
      "thermo"
    ],
    "stem": "In q = mcΔT, if ΔT of the sample is positive, the sample:",
    "choices": [
      "lost heat",
      "gained heat",
      "did not change energy",
      "must have boiled"
    ],
    "answer": "B",
    "explanation": "Temperature rise means the sample absorbed heat."
  },
  {
    "id": "t04",
    "topics": [
      "thermo"
    ],
    "stem": "Specific heat capacity is the heat needed to raise the temperature of:",
    "choices": [
      "1 g by 1 C",
      "1 mol by 100 C always",
      "any mass by 1 C",
      "1 L by 1 C always"
    ],
    "answer": "A",
    "explanation": "c is energy per gram per degree (common Chem I definition)."
  },
  {
    "id": "t05",
    "topics": [
      "thermo"
    ],
    "stem": "In an ideal calorimeter experiment, heat lost by a hot metal equals heat gained by water because:",
    "choices": [
      "the system is well insulated (approx.)",
      "metal is always wood",
      "pressure is zero",
      "mass is ignored"
    ],
    "answer": "A",
    "explanation": "Assume q_metal + q_water ≈ 0."
  },
  {
    "id": "t06",
    "topics": [
      "thermo"
    ],
    "stem": "Enthalpy change ΔH is commonly reported in:",
    "choices": [
      "joules or kilojoules",
      "liters",
      "atmospheres only",
      "mol/L"
    ],
    "answer": "A",
    "explanation": "Energy units."
  },
  {
    "id": "t07",
    "topics": [
      "thermo"
    ],
    "stem": "Breaking chemical bonds typically:",
    "choices": [
      "releases energy",
      "requires energy input",
      "needs no energy",
      "always cools the lab to 0 C"
    ],
    "answer": "B",
    "explanation": "Bond breaking is endothermic; bond forming releases energy."
  },
  {
    "id": "t08",
    "topics": [
      "thermo"
    ],
    "stem": "If a reaction flask feels cold to the touch, the reaction is likely:",
    "choices": [
      "exothermic",
      "endothermic",
      "impossible",
      "at absolute zero"
    ],
    "answer": "B",
    "explanation": "The system absorbs heat from the surroundings (your hand)."
  },
  {
    "id": "ac01",
    "topics": [
      "acids"
    ],
    "stem": "An Arrhenius acid produces ___ in water.",
    "choices": [
      "OH-",
      "H+ (as H3O+)",
      "Na+",
      "electrons"
    ],
    "answer": "B",
    "explanation": "Arrhenius acids increase H+ in aqueous solution."
  },
  {
    "id": "ac02",
    "topics": [
      "acids"
    ],
    "stem": "An Arrhenius base produces ___ in water.",
    "choices": [
      "H+",
      "OH-",
      "Cl2",
      "only CO2"
    ],
    "answer": "B",
    "explanation": "Arrhenius bases increase OH-."
  },
  {
    "id": "ac03",
    "topics": [
      "acids"
    ],
    "stem": "Which is a strong acid that fully ionizes in water?",
    "choices": [
      "acetic acid (CH3COOH)",
      "HCl",
      "water",
      "ammonia"
    ],
    "answer": "B",
    "explanation": "HCl is a strong acid."
  },
  {
    "id": "ac04",
    "topics": [
      "acids"
    ],
    "stem": "A weak acid:",
    "choices": [
      "fully ionizes",
      "partially ionizes",
      "never dissolves",
      "is always a base"
    ],
    "answer": "B",
    "explanation": "Only a fraction of molecules ionize."
  },
  {
    "id": "ac05",
    "topics": [
      "acids"
    ],
    "stem": "At 25 C, aqueous solution with pH < 7 is:",
    "choices": [
      "neutral",
      "acidic",
      "basic",
      "nonionic"
    ],
    "answer": "B",
    "explanation": "Lower pH means more acidic."
  },
  {
    "id": "ac06",
    "topics": [
      "acids"
    ],
    "stem": "A Bronsted-Lowry acid is a proton:",
    "choices": [
      "acceptor",
      "donor",
      "neutron donor",
      "electron-pair donor only"
    ],
    "answer": "B",
    "explanation": "Bronsted acid = H+ donor."
  },
  {
    "id": "ac07",
    "topics": [
      "acids"
    ],
    "stem": "In HCl + H2O → H3O+ + Cl-, water acts as a:",
    "choices": [
      "Bronsted acid",
      "Bronsted base",
      "precipitate",
      "noble gas"
    ],
    "answer": "B",
    "explanation": "Water accepts the proton."
  },
  {
    "id": "ac08",
    "topics": [
      "acids"
    ],
    "stem": "Neutralization of a strong acid with a strong base typically yields:",
    "choices": [
      "salt + water",
      "only a gas",
      "only a pure metal",
      "oxygen gas only"
    ],
    "answer": "A",
    "explanation": "Classic acid-base neutralization products."
  },
  {
    "id": "ec01",
    "topics": ["electrochem"],
    "stem": "Oxidation is best defined as:",
    "choices": [
      "gain of electrons",
      "loss of electrons",
      "gain of protons only",
      "loss of neutrons"
    ],
    "answer": "B",
    "explanation": "Oxidation = loss of electrons (OIL: oxidation is loss). Reduction is gain."
  },
  {
    "id": "ec02",
    "topics": ["electrochem"],
    "stem": "Reduction is best defined as:",
    "choices": [
      "loss of electrons",
      "gain of electrons",
      "increase in oxidation number only with no e− change",
      "formation of a precipitate always"
    ],
    "answer": "B",
    "explanation": "Reduction = gain of electrons (RIG: reduction is gain)."
  },
  {
    "id": "ec03",
    "topics": ["electrochem"],
    "stem": "What is the oxidation number of oxygen in most compounds (e.g., H₂O, CO₂)?",
    "choices": ["0", "+1", "−1", "−2"],
    "answer": "D",
    "explanation": "Oxygen is usually −2 (except peroxides, OF₂, etc.)."
  },
  {
    "id": "ec04",
    "topics": ["electrochem"],
    "stem": "What is the oxidation number of elemental O₂?",
    "choices": ["−2", "−1", "0", "+2"],
    "answer": "C",
    "explanation": "Any free element has oxidation number 0."
  },
  {
    "id": "ec05",
    "topics": ["electrochem"],
    "stem": "In Zn → Zn²⁺ + 2 e⁻, zinc is being:",
    "choices": [
      "reduced",
      "oxidized",
      "neither",
      "precipitated only"
    ],
    "answer": "B",
    "explanation": "Zn loses electrons → oxidation. Zn is the reducing agent overall when it reduces something else."
  },
  {
    "id": "ec06",
    "topics": ["electrochem"],
    "stem": "An oxidizing agent is a substance that:",
    "choices": [
      "is always a metal",
      "is reduced (causes oxidation of something else)",
      "is oxidized",
      "never contains oxygen"
    ],
    "answer": "B",
    "explanation": "The oxidizing agent gains electrons (is reduced) while oxidizing another species."
  },
  {
    "id": "ec07",
    "topics": ["electrochem"],
    "stem": "A reducing agent is a substance that:",
    "choices": [
      "is reduced",
      "is oxidized (causes reduction of something else)",
      "always has oxidation number 0",
      "only forms gases"
    ],
    "answer": "B",
    "explanation": "The reducing agent loses electrons (is oxidized) while reducing another species."
  },
  {
    "id": "ec08",
    "topics": ["electrochem"],
    "stem": "In a galvanic (voltaic) cell, spontaneous redox produces:",
    "choices": [
      "only heat, never electricity",
      "electrical energy",
      "only light",
      "a nuclear reaction"
    ],
    "answer": "B",
    "explanation": "Galvanic cells convert chemical energy of a spontaneous redox reaction into electrical energy."
  },
  {
    "id": "ec09",
    "topics": ["electrochem"],
    "stem": "In a galvanic cell, oxidation occurs at the:",
    "choices": ["cathode", "anode", "salt bridge only", "wire only"],
    "answer": "B",
    "explanation": "Anode = oxidation; cathode = reduction (AN OX, RED CAT)."
  },
  {
    "id": "ec10",
    "topics": ["electrochem"],
    "stem": "In a galvanic cell, reduction occurs at the:",
    "choices": ["anode", "cathode", "battery casing", "voltmeter only"],
    "answer": "B",
    "explanation": "Electrons flow toward the cathode where reduction occurs."
  },
  {
    "id": "ec11",
    "topics": ["electrochem"],
    "stem": "Electrons in an external circuit of a galvanic cell flow from:",
    "choices": [
      "cathode to anode",
      "anode to cathode",
      "salt bridge to voltmeter only",
      "nowhere; ions carry all charge outside"
    ],
    "answer": "B",
    "explanation": "Electrons leave the anode (oxidation) and travel through the wire to the cathode."
  },
  {
    "id": "ec12",
    "topics": ["electrochem"],
    "stem": "The main job of a salt bridge is to:",
    "choices": [
      "supply electrons to the anode",
      "allow ion flow to maintain charge balance",
      "heat the cell",
      "block all ion movement"
    ],
    "answer": "B",
    "explanation": "The salt bridge keeps solutions electrically neutral by letting ions migrate as the cell runs."
  }
];
