/** One-shot generator — node scripts/gen-questions.mjs */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'js', 'questions.js');

function q(id, topic, stem, choices, answer, explanation) {
  return { id, topics: [topic], stem, choices, answer, explanation };
}

const all = [
  // measurement (10)
  q('m01', 'measurement', 'How many significant figures are in 0.00450?', ['2', '3', '4', '5'], 'B', 'Leading zeros are not significant; trailing zero after the decimal is significant → three sig figs.'),
  q('m02', 'measurement', 'Which measurement is reported with the greatest precision as written?', ['12 m', '12.0 m', '12.00 m', '1.2 x 10^1 m'], 'C', '12.00 m has four significant figures.'),
  q('m03', 'measurement', 'Convert 2.5 km to meters.', ['0.0025 m', '25 m', '250 m', '2500 m'], 'D', '1 km = 1000 m → 2.5 x 1000 = 2500 m.'),
  q('m04', 'measurement', 'Round 0.003456 to three significant figures.', ['0.003', '0.00346', '0.00345', '0.346'], 'B', 'Three sig figs → 0.00346 (or 3.46 x 10^-3).'),
  q('m05', 'measurement', 'In dimensional analysis, conversion factors are set up so that unwanted units:', ['add together', 'cancel between numerator and denominator', 'multiply the answer by 10', 'become mass'], 'B', 'Place units diagonally so they cancel.'),
  q('m06', 'measurement', 'Which is a derived quantity (not a base SI unit)?', ['meter', 'kilogram', 'second', 'density'], 'D', 'Density = mass/volume is derived.'),
  q('m07', 'measurement', 'Scientific notation for 45,200 with three significant figures is:', ['4.52 x 10^3', '4.52 x 10^4', '4.5 x 10^4', '45.2 x 10^3'], 'B', '4.52 x 10^4.'),
  q('m08', 'measurement', 'When multiplying 2.5 x 3.42, the product should have how many significant figures?', ['1', '2', '3', '4'], 'B', 'Multiplication is limited by the fewest sig figs (2.5 has two).'),
  q('m09', 'measurement', 'If 1.00 in = 2.54 cm, how many cm are in 5.00 in?', ['2.54 cm', '7.62 cm', '12.7 cm', '5.00 cm'], 'C', '5.00 x 2.54 = 12.7 cm.'),
  q('m10', 'measurement', 'The prefix milli- means:', ['10^3', '10^-2', '10^-3', '10^-6'], 'C', 'milli- = 10^-3.'),

  // atomic (10)
  q('a01', 'atomic', 'The atomic number of an element equals the number of:', ['neutrons', 'protons', 'protons + neutrons', 'neutrons + electrons'], 'B', 'Atomic number Z = protons; it identifies the element.'),
  q('a02', 'atomic', 'Mass number equals:', ['protons only', 'neutrons only', 'protons + neutrons', 'protons + electrons'], 'C', 'A = p + n.'),
  q('a03', 'atomic', 'Isotopes of an element have the same number of ___ and different numbers of ___.', ['neutrons; protons', 'protons; neutrons', 'electrons; protons', 'neutrons; electrons only'], 'B', 'Same Z, different neutron counts.'),
  q('a04', 'atomic', 'A neutral atom of carbon-14 has how many electrons?', ['6', '8', '14', '20'], 'A', 'Carbon Z = 6; neutral atom has 6 electrons.'),
  q('a05', 'atomic', 'Which subatomic particle has a charge of -1?', ['proton', 'neutron', 'electron', 'alpha particle'], 'C', 'Electrons are negatively charged.'),
  q('a06', 'atomic', 'The electron configuration of neon (Z = 10) is best written as ending in:', ['2s2', '2p6', '3s2', '3p6'], 'B', 'Ne: 1s2 2s2 2p6.'),
  q('a07', 'atomic', 'After the 3s subshell fills, electrons next enter:', ['3p', '3d', '4s', '2p'], 'A', 'Aufbau: 3s then 3p.'),
  q('a08', 'atomic', 'How many valence electrons does a neutral oxygen atom have?', ['2', '4', '6', '8'], 'C', 'Group 16 → six valence electrons.'),
  q('a09', 'atomic', 'A cation forms when an atom:', ['gains protons', 'gains electrons', 'loses electrons', 'loses neutrons'], 'C', 'Losing electrons makes a positive ion.'),
  q('a10', 'atomic', 'A neutral argon atom (Z = 18) has how many electrons?', ['8', '10', '18', '36'], 'C', 'Neutral atom: electrons = protons = 18.'),

  // periodic (8)
  q('p01', 'periodic', 'Across a period left to right, atomic radius generally:', ['increases', 'decreases', 'stays the same', 'becomes undefined'], 'B', 'Greater effective nuclear charge pulls electrons closer.'),
  q('p02', 'periodic', 'Down a group, first ionization energy generally:', ['increases', 'decreases', 'stays constant', 'is zero'], 'B', 'Valence electrons are farther from the nucleus and easier to remove.'),
  q('p03', 'periodic', 'Which element is most electronegative among these?', ['Na', 'Cl', 'C', 'Si'], 'B', 'Cl is highly electronegative (F is highest overall).'),
  q('p04', 'periodic', 'Metals tend to form ions by:', ['gaining electrons', 'losing electrons', 'sharing neutrons', 'gaining protons'], 'B', 'Metals typically form cations.'),
  q('p05', 'periodic', 'Which element is a halogen?', ['Na', 'Mg', 'Cl', 'Ar'], 'C', 'Halogens are Group 17.'),
  q('p06', 'periodic', 'Noble gases are relatively unreactive mainly because they have:', ['empty valence shells', 'full valence shells', 'no electrons', 'only protons'], 'B', 'ns2 np6 (He: 1s2) is especially stable.'),
  q('p07', 'periodic', 'Which element is a metalloid?', ['Na', 'Fe', 'Si', 'O'], 'C', 'Silicon is a classic metalloid.'),
  q('p08', 'periodic', 'Compared with Na, Mg generally has a ___ first ionization energy.', ['lower', 'higher', 'identical', 'zero'], 'B', 'Mg is farther right; harder to remove an electron.'),

  // nomenclature (12)
  q('n01', 'nomenclature', 'The correct formula for aluminum oxide is:', ['AlO', 'Al2O', 'AlO3', 'Al2O3'], 'D', 'Al3+ and O2- combine as Al2O3.'),
  q('n02', 'nomenclature', 'The name of Na2SO4 is:', ['sodium sulfite', 'sodium sulfate', 'disodium sulfur oxide', 'sodium sulfide'], 'B', 'SO4^2- is sulfate.'),
  q('n03', 'nomenclature', 'Using the Stock system, FeCl3 is named:', ['iron chloride', 'iron(I) chloride', 'iron(II) chloride', 'iron(III) chloride'], 'D', 'Three Cl- imply Fe3+ → iron(III) chloride.'),
  q('n04', 'nomenclature', 'The formula for calcium nitrate is:', ['CaNO3', 'Ca2NO3', 'Ca(NO3)2', 'CaN'], 'C', 'Ca2+ needs two nitrate ions.'),
  q('n05', 'nomenclature', 'Which is a molecular (covalent) compound?', ['NaCl', 'MgO', 'CO2', 'CaF2'], 'C', 'Two nonmetals: carbon dioxide.'),
  q('n06', 'nomenclature', 'The name of N2O5 is:', ['nitrogen oxide', 'dinitrogen pentoxide', 'nitrogen pentoxide', 'nitrous oxide'], 'B', 'Binary molecular naming: dinitrogen pentoxide.'),
  q('n07', 'nomenclature', 'The ammonium ion is:', ['NH3', 'NH4+', 'NO3-', 'NO2-'], 'B', 'Ammonium is NH4+.'),
  q('n08', 'nomenclature', 'Ionic bonds typically form between:', ['two nonmetals', 'a metal and a nonmetal', 'two metals', 'two noble gases'], 'B', 'Metal + nonmetal is the classic ionic pair.'),
  q('n09', 'nomenclature', 'A shared pair of electrons is characteristic of a:', ['ionic bond', 'metallic bond only', 'covalent bond', 'nuclear force'], 'C', 'Covalent bonds share electron pairs.'),
  q('n10', 'nomenclature', 'Which molecule is linear?', ['H2O', 'CO2', 'NH3', 'CH4'], 'B', 'CO2 is O=C=O and linear; water is bent.'),
  q('n11', 'nomenclature', 'VSEPR predicts the shape of CH4 as:', ['linear', 'trigonal planar', 'tetrahedral', 'octahedral'], 'C', 'Four bonding pairs → tetrahedral.'),
  q('n12', 'nomenclature', 'Aqueous HCl is named:', ['hydrogen chloride gas', 'hydrochloric acid', 'chloric acid', 'hypochlorous acid'], 'B', 'Binary aqueous acid: hydrochloric acid.'),

  // stoichiometry (14)
  q('s01', 'stoichiometry', 'Avogadro number is approximately:', ['6.02 x 10^21', '6.02 x 10^23', '3.00 x 10^8', '1.66 x 10^-24'], 'B', '1 mol contains about 6.02 x 10^23 particles.'),
  q('s02', 'stoichiometry', 'Molar mass of H2O is closest to:', ['10 g/mol', '18 g/mol', '32 g/mol', '44 g/mol'], 'B', '2(1) + 16 = 18 g/mol.'),
  q('s03', 'stoichiometry', 'How many moles are in 36 g of H2O?', ['1.0 mol', '2.0 mol', '0.50 mol', '18 mol'], 'B', '36 g / 18 g/mol = 2.0 mol.'),
  q('s04', 'stoichiometry', 'For 2 H2 + O2 → 2 H2O, moles of H2O from 3.0 mol O2 (excess H2):', ['2.0', '3.0', '6.0', '1.5'], 'C', '1 mol O2 produces 2 mol H2O → 6.0 mol H2O.'),
  q('s05', 'stoichiometry', 'The limiting reactant is the reactant that:', ['has the largest mass', 'is used up first', 'has the highest molar mass', 'is always the product'], 'B', 'It runs out first and limits product amount.'),
  q('s06', 'stoichiometry', 'Percent yield equals:', ['(actual/theoretical) x 100%', '(theoretical/actual) x 100%', 'actual - theoretical', 'moles x 100'], 'A', 'Standard definition of percent yield.'),
  q('s07', 'stoichiometry', 'If theoretical yield is 10.0 g and actual yield is 8.0 g, percent yield is:', ['80%', '125%', '8%', '18%'], 'A', '(8.0/10.0) x 100% = 80%.'),
  q('s08', 'stoichiometry', 'Mass of 0.50 mol CO2 (M = 44 g/mol) is:', ['22 g', '44 g', '88 g', '11 g'], 'A', '0.50 x 44 = 22 g.'),
  q('s09', 'stoichiometry', 'Number of He atoms in 2.0 mol He is about:', ['6.0 x 10^23', '1.2 x 10^24', '3.0 x 10^23', '2'], 'B', '2.0 x 6.0 x 10^23 = 1.2 x 10^24.'),
  q('s10', 'stoichiometry', 'In a balanced equation, coefficients represent:', ['masses in grams only', 'mole ratios', 'densities', 'temperatures'], 'B', 'Coefficients give mole ratios of species.'),
  q('s11', 'stoichiometry', 'Typical path from grams of A to grams of B is:', ['g A → mol A → mol B → g B', 'g A → g B in one step always', 'atoms only', 'volume only'], 'A', 'Use molar masses and the mole ratio from the balanced equation.'),
  q('s12', 'stoichiometry', 'Reaction needs 2 mol A per 1 mol B. You mix 4 mol A with 1 mol B. Limiting reactant is:', ['A', 'B', 'neither', 'both equally'], 'B', '4 mol A would need 2 mol B; only 1 mol B is available.'),
  q('s13', 'stoichiometry', 'An empirical formula is the:', ['actual molecular formula always', 'simplest whole-number ratio of atoms', 'percent composition alone', 'balanced equation'], 'B', 'Simplest ratio of atoms in the compound.'),
  q('s14', 'stoichiometry', 'To get a molecular formula from an empirical formula you need the:', ['color', 'molar mass of the compound', 'density of water', 'boiling point only'], 'B', 'n = M_molecular / M_empirical.'),

  // reactions (10)
  q('r01', 'reactions', 'The correctly balanced equation for hydrogen + oxygen → water is:', ['H2 + O2 → H2O', '2 H2 + O2 → 2 H2O', '2 H2 + 2 O2 → 2 H2O', 'H2 + O2 → 2 H2O'], 'B', '2 H2 + O2 → 2 H2O balances atoms.'),
  q('r02', 'reactions', '2 Na + Cl2 → 2 NaCl is best classified as:', ['decomposition', 'single replacement', 'synthesis (combination)', 'double replacement'], 'C', 'Elements combine to form one compound.'),
  q('r03', 'reactions', '2 HgO → 2 Hg + O2 is:', ['synthesis', 'decomposition', 'combustion', 'acid-base'], 'B', 'One compound breaks into simpler substances.'),
  q('r04', 'reactions', 'Zn + CuSO4 → ZnSO4 + Cu is:', ['double replacement', 'single replacement', 'synthesis', 'combustion'], 'B', 'Zn displaces Cu.'),
  q('r05', 'reactions', 'AgNO3 + NaCl → AgCl + NaNO3 is:', ['single replacement', 'double replacement', 'decomposition', 'combustion'], 'B', 'Ions exchange partners.'),
  q('r06', 'reactions', 'Complete combustion of a hydrocarbon produces:', ['CO2 and H2O', 'only CO', 'only H2', 'N2 and O2'], 'A', 'Complete combustion yields carbon dioxide and water.'),
  q('r07', 'reactions', 'When balancing equations you may change:', ['subscripts in formulas', 'coefficients only', 'element identities freely', 'nothing at all'], 'B', 'Only coefficients; formulas stay intact.'),
  q('r08', 'reactions', 'A precipitate most often forms in:', ['all gas reactions', 'double-replacement aqueous reactions', 'nuclear reactions', 'every combustion'], 'B', 'An insoluble solid can form when ions swap in solution.'),
  q('r09', 'reactions', 'The balanced equation for Fe + O2 → Fe2O3 uses which Fe : O2 : Fe2O3 coefficients?', ['2 : 3 : 1', '4 : 3 : 2', '1 : 1 : 1', '2 : 1 : 1'], 'B', '4 Fe + 3 O2 → 2 Fe2O3.'),
  q('r10', 'reactions', 'A balanced chemical equation always conserves:', ['volume of all gases', 'mass (atoms of each element)', 'temperature', 'color'], 'A', 'Same number of each atom on both sides → mass conserved. Wait - answer should be B. Fix.'),
];

// Fix r10 answer/explanation (script error above)
const r10 = all.find((x) => x.id === 'r10');
r10.choices = ['volume of all gases', 'mass (number of each type of atom)', 'temperature', 'color'];
r10.answer = 'B';
r10.explanation = 'Balancing keeps atom counts equal on both sides, so mass is conserved.';

all.push(
  // gases (10)
  q('g01', 'gases', 'Boyle law (constant T): pressure and volume are:', ['directly proportional', 'inversely proportional', 'unrelated', 'always equal'], 'B', 'P1V1 = P2V2.'),
  q('g02', 'gases', 'Charles law (constant P): volume and absolute temperature are:', ['inversely proportional', 'directly proportional', 'equal', 'undefined'], 'B', 'V/T is constant when P and n are fixed.'),
  q('g03', 'gases', 'The ideal gas law is written:', ['PV = nRT', 'P = nRT', 'V = nRT', 'n = PVT'], 'A', 'PV = nRT.'),
  q('g04', 'gases', 'A common definition of STP is:', ['0 C and 1 atm', '25 C and 2 atm', '100 C and 1 atm', '0 K and 1 atm'], 'A', 'Often 0 C (273 K) and 1 atm — confirm your course table.'),
  q('g05', 'gases', 'Molar volume of an ideal gas at classic STP is about:', ['1.0 L', '11.2 L', '22.4 L', '44.8 L'], 'C', 'About 22.4 L/mol at classic STP.'),
  q('g06', 'gases', 'If absolute temperature doubles at constant n and P, volume:', ['halves', 'doubles', 'stays the same', 'goes to zero'], 'B', 'Charles: V proportional to T.'),
  q('g07', 'gases', 'A common Chem I value of R is:', ['0.0821 L·atm/(mol·K)', '1.00 L/mol', '22.4 atm', '273 L/mol'], 'A', '0.0821 L·atm·mol^-1·K^-1 is widely used.'),
  q('g08', 'gases', 'The combined gas law relates which variables (n fixed)?', ['P, V, and T', 'only P and n', 'only moles', 'only density'], 'A', 'P1V1/T1 = P2V2/T2.'),
  q('g09', 'gases', 'Temperature in gas-law equations must be in:', ['Celsius', 'Fahrenheit', 'Kelvin', 'any unit without conversion'], 'C', 'Convert C to K: T(K) = T(C) + 273.'),
  q('g10', 'gases', 'At constant T and n, if volume is halved, pressure:', ['halves', 'doubles', 'is unchanged', 'becomes zero'], 'B', 'Boyle: inverse relation.'),

  // solutions (10)
  q('sol01', 'solutions', 'Molarity (M) is defined as:', ['moles solute / liters solution', 'moles solute / kg solvent', 'grams / mL', 'percent by mass only'], 'A', 'M = mol/L of solution.'),
  q('sol02', 'solutions', 'Moles of NaCl in 2.0 L of 0.50 M NaCl:', ['0.25', '1.0', '2.5', '0.50'], 'B', 'mol = M x V = 0.50 x 2.0 = 1.0 mol.'),
  q('sol03', 'solutions', 'The dilution equation is:', ['M1V1 = M2V2', 'M1 + V1 = M2 + V2', 'M1/V1 = M2/V2', 'P1V1 = P2V2'], 'A', 'Moles of solute stay the same on dilution.'),
  q('sol04', 'solutions', 'To prepare 1.0 L of 0.10 M from 1.0 M stock, measure:', ['1.0 L of stock', '0.10 L of stock and dilute to 1.0 L', '10 L of stock', '0.010 L with no water'], 'B', 'V1 = M2V2/M1 = 0.10 L.'),
  q('sol05', 'solutions', 'The solute is the:', ['substance always present in greater amount', 'substance that is dissolved', 'container', 'pure solvent only'], 'B', 'Solute dissolves in the solvent.'),
  q('sol06', 'solutions', 'Aqueous means dissolved in:', ['alcohol', 'water', 'oil', 'air'], 'B', '(aq) means water solution.'),
  q('sol07', 'solutions', 'If you dilute a solution, its molarity generally:', ['increases', 'decreases', 'stays exactly the same', 'becomes infinite'], 'B', 'Same moles in larger volume → lower M.'),
  q('sol08', 'solutions', 'Mass of NaOH (40 g/mol) needed for 0.50 L of 1.0 M solution:', ['20 g', '40 g', '10 g', '80 g'], 'A', 'mol = 0.50; mass = 0.50 x 40 = 20 g.'),
  q('sol09', 'solutions', 'In solution stoichiometry, volume of solution is often converted to moles using:', ['density of air', 'molarity', 'color', 'boiling point'], 'B', 'moles = M x liters.'),
  q('sol10', 'solutions', 'Which is a homogeneous mixture?', ['sand in water (settling)', 'oil layered on water', 'well-mixed salt water', 'granite rock'], 'C', 'Uniform composition throughout.'),

  // thermo (8)
  q('t01', 'thermo', 'An exothermic process:', ['absorbs heat from the surroundings', 'releases heat to the surroundings', 'always has positive delta H', 'never involves energy'], 'B', 'Heat leaves the system; surroundings warm.'),
  q('t02', 'thermo', 'For an endothermic process, delta H is typically:', ['negative', 'positive', 'always zero', 'undefined'], 'B', 'System gains heat; delta H > 0 by convention.'),
  q('t03', 'thermo', 'In q = mcΔT, if ΔT of the sample is positive, the sample:', ['lost heat', 'gained heat', 'did not change energy', 'must have boiled'], 'B', 'Temperature rise means the sample absorbed heat.'),
  q('t04', 'thermo', 'Specific heat capacity is the heat needed to raise the temperature of:', ['1 g by 1 C', '1 mol by 100 C always', 'any mass by 1 C', '1 L by 1 C always'], 'A', 'c is energy per gram per degree (common Chem I definition).'),
  q('t05', 'thermo', 'In an ideal calorimeter experiment, heat lost by a hot metal equals heat gained by water because:', ['the system is well insulated (approx.)', 'metal is always wood', 'pressure is zero', 'mass is ignored'], 'A', 'Assume q_metal + q_water ≈ 0.'),
  q('t06', 'thermo', 'Enthalpy change ΔH is commonly reported in:', ['joules or kilojoules', 'liters', 'atmospheres only', 'mol/L'], 'A', 'Energy units.'),
  q('t07', 'thermo', 'Breaking chemical bonds typically:', ['releases energy', 'requires energy input', 'needs no energy', 'always cools the lab to 0 C'], 'B', 'Bond breaking is endothermic; bond forming releases energy.'),
  q('t08', 'thermo', 'If a reaction flask feels cold to the touch, the reaction is likely:', ['exothermic', 'endothermic', 'impossible', 'at absolute zero'], 'B', 'The system absorbs heat from the surroundings (your hand).'),

  // acids (8)
  q('ac01', 'acids', 'An Arrhenius acid produces ___ in water.', ['OH-', 'H+ (as H3O+)', 'Na+', 'electrons'], 'B', 'Arrhenius acids increase H+ in aqueous solution.'),
  q('ac02', 'acids', 'An Arrhenius base produces ___ in water.', ['H+', 'OH-', 'Cl2', 'only CO2'], 'B', 'Arrhenius bases increase OH-.'),
  q('ac03', 'acids', 'Which is a strong acid that fully ionizes in water?', ['acetic acid (CH3COOH)', 'HCl', 'water', 'ammonia'], 'B', 'HCl is a strong acid.'),
  q('ac04', 'acids', 'A weak acid:', ['fully ionizes', 'partially ionizes', 'never dissolves', 'is always a base'], 'B', 'Only a fraction of molecules ionize.'),
  q('ac05', 'acids', 'At 25 C, aqueous solution with pH < 7 is:', ['neutral', 'acidic', 'basic', 'nonionic'], 'B', 'Lower pH means more acidic.'),
  q('ac06', 'acids', 'A Bronsted-Lowry acid is a proton:', ['acceptor', 'donor', 'neutron donor', 'electron-pair donor only'], 'B', 'Bronsted acid = H+ donor.'),
  q('ac07', 'acids', 'In HCl + H2O → H3O+ + Cl-, water acts as a:', ['Bronsted acid', 'Bronsted base', 'precipitate', 'noble gas'], 'B', 'Water accepts the proton.'),
  q('ac08', 'acids', 'Neutralization of a strong acid with a strong base typically yields:', ['salt + water', 'only a gas', 'only a pure metal', 'oxygen gas only'], 'A', 'Classic acid-base neutralization products.'),
);

const header = `/**
 * Chemistry I Final Study Buddy — MCQ bank (${all.length} questions)
 * Edit freely. Keep id unique. answer is "A"|"B"|"C"|"D".
 * topics: string[] matching data/topics.js ids.
 */
window.CHEM1_QUESTIONS = `;

writeFileSync(outPath, header + JSON.stringify(all, null, 2) + ';\n', 'utf8');
console.log('Wrote', all.length, 'questions to', outPath);

const counts = {};
for (const item of all) {
  const t = item.topics[0];
  counts[t] = (counts[t] || 0) + 1;
}
console.log(counts);
