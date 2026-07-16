const FT_TO_M = 0.3048;
const FT2_TO_M2 = 0.09290304;
const CFM_PER_M3S = 2118.880003;
const FPM_PER_MS = 196.850394;
const PA_TO_IN_WG = 0.00401463;
const ATM_PA = 101300;
const GAS_CONSTANT_AIR = 287;
const CP_SMOKE = 1.0;
const PRESSURE_AIR_DENSITY = 1.2;
const APP_VERSION = "2026.07.16-team-beta";
const CALC_ENGINE_VERSION = "steady-axisymmetric-1.1";
const SCENARIO_SCHEMA_VERSION = 2;
const STORAGE_KEY = "smokeExhaustScenarioLab.v1";
const SOURCE_DOCUMENTS = [
  {
    id: "TSFPEWG-G-3-600-01.01-18-C1",
    title: "TSFPEWG G 3-600-01.01-18 with Change 1",
    date: "2021-04-21",
    role: "Mission continuity path, smoke exhaust triggers, controls, and pressure objective.",
  },
  {
    id: "HOSCE-CH16",
    title: "Handbook of Smoke Control Engineering, Chapter 16",
    date: "2012",
    role: "Steady axisymmetric plume, exhaust volume, plugholing, inlet separation, and makeup velocity equations.",
  },
  {
    id: "HOSCE-CH3",
    title: "Handbook of Smoke Control Engineering, Chapter 3",
    date: "2012",
    role: "Flow, leakage area, flow coefficient, and pressure-difference relationships.",
  },
  {
    id: "NFPA-92-2024",
    title: "NFPA 92 (2024)",
    date: "2024",
    role: "Rectangular inlet geometry and smoke control criteria cross-checks used by the source spreadsheet.",
  },
];

const designFirePresets = [
  {
    id: "detection-10kw",
    name: "Detection benchmark - 10 kW",
    shortName: "10 kW detection benchmark",
    hrrKw: 10,
    convectiveFraction: 0.7,
    basis: "10 kW propylene burner benchmark used for data center smoke detection transport testing.",
    evidence:
      "FM Global P14042 used a steady 10 kW propylene burner, plus foam, circuit-board, and cable smoke sources, to study detection response in data center airflow.",
    applicability:
      "Use for detection placement, airflow transport, and alarm response comparisons only.",
    limitations:
      "Not a credible smoke exhaust sizing fire because it was selected for repeatable detector testing.",
    sourceName: "FM Global P14042, Smoke Detection in Data Centers",
    sourceUrl:
      "https://www.fm.com/-/media/project/publicwebsites/fm/files/resources/research-technical-reports/p14042.pdf",
  },
  {
    id: "electronic-small-23kw",
    name: "Small electronic ignition - 23 kW",
    shortName: "23 kW small electronic item",
    hrrKw: 23,
    convectiveFraction: 0.7,
    basis: "Measured keyboard full-scale peak heat release rate from NIST electronic equipment testing.",
    evidence:
      "NIST TN 1461 reported a keyboard peak HRR of 23 +/- 3 kW in full-scale electronic equipment fire tests.",
    applicability:
      "Use for localized small-item ignition and early sensitivity checks near electronic equipment.",
    limitations:
      "Does not represent a server rack, packaging fire, UPS/Battery fire, or high-fuel transient storage condition.",
    sourceName: "NIST TN 1461, Full-Scale Flammability Measures for Electronic Equipment",
    sourceUrl: "https://nvlpubs.nist.gov/nistpubs/Legacy/TN/nbstechnicalnote1461.pdf",
  },
  {
    id: "electronic-enclosure-200kw",
    name: "Electronic enclosure/peripheral - 200 kW",
    shortName: "200 kW electronic enclosure",
    hrrKw: 200,
    convectiveFraction: 0.7,
    basis: "Measured monitor/electronic enclosure peak heat release rate from NIST testing.",
    evidence:
      "NIST TN 1461 reported a UL94 HB monitor enclosure peak HRR of 200 +/- 25 kW.",
    applicability:
      "Use for a measured electronic-equipment fire example or a moderate equipment/peripheral sensitivity case.",
    limitations:
      "Older peripheral test data; confirm relevance to listed modern server hardware and actual room fuel package.",
    sourceName: "NIST TN 1461, Full-Scale Flammability Measures for Electronic Equipment",
    sourceUrl: "https://nvlpubs.nist.gov/nistpubs/Legacy/TN/nbstechnicalnote1461.pdf",
  },
  {
    id: "packaging-carton-500kw",
    name: "Server packaging carton - 500 kW",
    shortName: "500 kW server packaging",
    hrrKw: 500,
    convectiveFraction: 0.7,
    basis: "Blade/server packaging carton with expanded polystyrene inserts used in data center water mist testing.",
    evidence:
      "FM Approval/IWMA data center fire protocols identify a corrugated carton with EPS inserts at approximately 500 kW per carton.",
    applicability:
      "Use for move-in, staging, unpacking, maintenance, and transient-combustible scenarios in data halls.",
    limitations:
      "Applies to packaging/transient combustibles, not normal listed server equipment operating in racks.",
    sourceName: "FM Approval/IWMA Data Center Water Mist Fire Test Protocols",
    sourceUrl: "https://iwma.net/fileadmin/user_upload/IWMC_2015/FMApproval_Carpenter_IWMC2015.pdf",
  },
  {
    id: "electrical-cabinet-300kw",
    name: "Electrical cabinet support-space - 300 kW",
    shortName: "300 kW electrical cabinet",
    hrrKw: 300,
    convectiveFraction: 0.7,
    basis: "Practical electrical cabinet/support-space fire sensitivity case based on full-scale enclosure testing.",
    evidence:
      "NRC/NIST HELEN-FIRE full-scale electrical enclosure tests included numerous cabinet fires, with a subset above 100 kW.",
    applicability:
      "Use for UPS rooms, electrical support spaces, switchgear/control cabinets, or cabinet-like fuel packages.",
    limitations:
      "Do not apply directly to ordinary server racks without matching fuel, ventilation, enclosure, and ignition assumptions.",
    sourceName: "NUREG/CR-7197, Heat Release Rates of Electrical Enclosure Fires",
    sourceUrl: "https://www.nrc.gov/docs/ML1611/ML16110A037.pdf",
  },
  {
    id: "electrical-cabinet-600kw",
    name: "Electrical cabinet upper-bound - 600 kW",
    shortName: "600 kW electrical upper bound",
    hrrKw: 600,
    convectiveFraction: 0.7,
    basis: "Rounded upper-bound sensitivity case for severe electrical enclosure fire behavior.",
    evidence:
      "NUREG/CR-7197 reported full-scale electrical enclosure peak HRRs up to approximately 576 kW; this preset rounds to 600 kW for sensitivity review.",
    applicability:
      "Use as a severe cabinet/support-space sensitivity case where the fuel package resembles tested electrical enclosures.",
    limitations:
      "A sensitivity case, not a universal data center design fire.",
    sourceName: "NUREG/CR-7197, Heat Release Rates of Electrical Enclosure Fires",
    sourceUrl: "https://www.nrc.gov/docs/ML1611/ML16110A037.pdf",
  },
  {
    id: "li-ion-bbu-project",
    name: "Li-ion BBU rack - project-specific",
    shortName: "Li-ion BBU project-specific",
    hrrKw: null,
    convectiveFraction: 0.7,
    basis: "Lithium-ion BBU rack scenario requiring project-specific large-scale test data.",
    evidence:
      "FM DS 5-32 treats lithium-ion BBU cabinets/racks as higher-severity hazards with thermal runaway and reignition concerns; rack capacity and listing details govern the design basis.",
    applicability:
      "Use only when project UL 9540A, manufacturer, insurer, or other large-scale test data defines the HRR or equivalent design curve.",
    limitations:
      "The app will not assign a generic HRR to lithium-ion BBU racks; enter a justified equivalent steady HRR or custom curve basis.",
    sourceName: "FM DS 5-32, Data Centers and Related Facilities",
    sourceUrl:
      "https://www.fm.com/FMAApi/data/ApprovalStandardsDownload?isGated=false&itemId=%7B2D62FBAB-83CA-4B26-A447-72D7EF6D574D%7D",
  },
  {
    id: "transient-custom-curve",
    name: "Extreme transient combustibles - custom curve",
    shortName: "Custom transient curve",
    hrrKw: null,
    convectiveFraction: 0.7,
    basis: "Custom measured HRR curve or equivalent steady HRR for transient combustible loading.",
    evidence:
      "NIST TN 2102 and related NRC/EPRI testing show transient combustibles can vary widely and multiple-item fires do not always scale linearly from single items.",
    applicability:
      "Use for construction, move-in, storage, carts, packaging clusters, or housekeeping-failure scenarios when a measured curve or documented equivalent HRR is available.",
    limitations:
      "Requires project-specific fuel description, quantity, arrangement, and growth/decay curve or documented steady equivalent.",
    sourceName: "NIST TN 2102, Heat Release Rates of Multiple Transient Combustibles",
    sourceUrl: "https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.2102.pdf",
  },
  {
    id: "custom-steady",
    name: "Custom steady HRR - user justified",
    shortName: "Custom steady HRR",
    hrrKw: null,
    convectiveFraction: 0.7,
    basis: "User selected steady design fire with project-specific justification.",
    evidence:
      "The engineer must document the source, fuel package, assumptions, and why the equivalent steady HRR is appropriate.",
    applicability:
      "Use when the design basis comes from project testing, insurer direction, AHJ direction, or another documented source.",
    limitations:
      "No external source is assigned by the app; report must include the user justification.",
    sourceName: "Project design basis",
    sourceUrl: "",
  },
];

const reviewerBasisDefaults = {
  reviewerBasisAudit: {},
  fuelPackageDescription: "",
  designFireSourceRef: "",
  hrrCurveBasis: "",
  approvalBasis: "",
  equationApplicability: "",
  plumeLimitationReview: "",
  tsfpewgSectionRefs: "",
  ahjAssumptions: "",
  activationSequence: "",
  leakageBasis: "",
  hvacStateBasis: "",
  validationReference: "",
  confirmsAxisymmetricPlume: false,
  confirmsSteadyEquivalent: false,
  confirmsNoWallOrRackPlume: false,
  confirmsNoSuppressionInteraction: false,
};

let scenarios = [
  {
    ...reviewerBasisDefaults,
    id: "base",
    name: "Packaging transient",
    revision: 1,
    parentId: null,
    missionClass: "Mission-essential",
    macCategory: "MAC II",
    facilityType: "Typical",
    operationMode: "Occupied",
    cleanAgent: false,
    directExteriorDoor: false,
    designFirePresetId: "packaging-carton-500kw",
    designFireBasis: "Blade/server packaging carton with EPS inserts during move-in or staging.",
    hrrKw: 500,
    convectiveFraction: 0.7,
    ambientTempC: 21,
    roomLengthFt: 60,
    roomWidthFt: 40,
    roomHeightFt: 18,
    smokeInterfaceFt: 8,
    makeupRatio: 0.95,
    makeupFreeAreaFt2: 260,
    leakageAreaFt2: 9,
    flowCoefficient: 0.65,
    exhaustLocationFactor: 1,
    selectedInletCount: 2,
    exhaustInletLengthIn: 24,
    exhaustInletWidthIn: 24,
    exhaustMarginPercent: 0,
    targetPressurePa: 12,
    maxMakeupVelocityFpm: 200,
  },
  {
    ...reviewerBasisDefaults,
    id: "higher-hrr",
    name: "Electrical cabinet upper",
    revision: 1,
    parentId: "base",
    missionClass: "Mission-essential",
    macCategory: "MAC II",
    facilityType: "Typical",
    operationMode: "Occupied",
    cleanAgent: false,
    directExteriorDoor: false,
    designFirePresetId: "electrical-cabinet-600kw",
    designFireBasis: "Severe electrical enclosure sensitivity case rounded from full-scale cabinet testing.",
    hrrKw: 600,
    convectiveFraction: 0.7,
    ambientTempC: 21,
    roomLengthFt: 60,
    roomWidthFt: 40,
    roomHeightFt: 18,
    smokeInterfaceFt: 8,
    makeupRatio: 0.95,
    makeupFreeAreaFt2: 260,
    leakageAreaFt2: 9,
    flowCoefficient: 0.65,
    exhaustLocationFactor: 1,
    selectedInletCount: 3,
    exhaustInletLengthIn: 24,
    exhaustInletWidthIn: 24,
    exhaustMarginPercent: 0,
    targetPressurePa: 12,
    maxMakeupVelocityFpm: 200,
  },
  {
    ...reviewerBasisDefaults,
    id: "mac-i-clean-agent",
    name: "Clean agent electronics",
    revision: 1,
    parentId: "base",
    missionClass: "Mission-critical",
    macCategory: "MAC I",
    facilityType: "Typical",
    operationMode: "Occupied",
    cleanAgent: true,
    directExteriorDoor: false,
    designFirePresetId: "electronic-enclosure-200kw",
    designFireBasis: "Measured electronic enclosure/peripheral fire used as a moderate sensitivity case.",
    hrrKw: 200,
    convectiveFraction: 0.7,
    ambientTempC: 21,
    roomLengthFt: 60,
    roomWidthFt: 40,
    roomHeightFt: 18,
    smokeInterfaceFt: 8,
    makeupRatio: 0.9,
    makeupFreeAreaFt2: 260,
    leakageAreaFt2: 9,
    flowCoefficient: 0.65,
    exhaustLocationFactor: 1,
    selectedInletCount: 2,
    exhaustInletLengthIn: 24,
    exhaustInletWidthIn: 24,
    exhaustMarginPercent: 0,
    targetPressurePa: 12,
    maxMakeupVelocityFpm: 200,
  },
];

let activeId = "base";
let appMode = "standard";
let saveTimer = null;
let lastSaveNote = "";

const scenarioDefaults = { ...scenarios[0] };
const numericFields = [
  "revision",
  "hrrKw",
  "convectiveFraction",
  "ambientTempC",
  "roomLengthFt",
  "roomWidthFt",
  "roomHeightFt",
  "smokeInterfaceFt",
  "makeupRatio",
  "makeupFreeAreaFt2",
  "leakageAreaFt2",
  "flowCoefficient",
  "exhaustLocationFactor",
  "selectedInletCount",
  "exhaustInletLengthIn",
  "exhaustInletWidthIn",
  "exhaustMarginPercent",
  "targetPressurePa",
  "maxMakeupVelocityFpm",
];
const booleanFields = [
  "cleanAgent",
  "directExteriorDoor",
  "confirmsAxisymmetricPlume",
  "confirmsSteadyEquivalent",
  "confirmsNoWallOrRackPlume",
  "confirmsNoSuppressionInteraction",
];
const reviewerTextFields = [
  "fuelPackageDescription",
  "designFireSourceRef",
  "hrrCurveBasis",
  "approvalBasis",
  "equationApplicability",
  "plumeLimitationReview",
  "tsfpewgSectionRefs",
  "ahjAssumptions",
  "activationSequence",
  "leakageBasis",
  "hvacStateBasis",
  "validationReference",
];
const stringFields = ["id", "name", "parentId", "designFireBasis", ...reviewerTextFields];
const reviewerAuditStatuses = ["Predictive", "Engineer reviewed", "AHJ/insurer accepted"];
const reviewerAuditSourceTypes = [
  "App prediction",
  "Hand calculation",
  "Published test",
  "Manufacturer data",
  "AHJ direction",
  "Insurer direction",
  "Project document",
];
const reviewerAuditConfidence = ["Low", "Medium", "High"];
const reviewerBasisDefinitions = [
  { field: "fuelPackageDescription", label: "Fuel package", category: "Design fire" },
  { field: "designFireSourceRef", label: "Design fire source/page", category: "Design fire" },
  { field: "hrrCurveBasis", label: "HRR curve / steady basis", category: "Design fire" },
  { field: "approvalBasis", label: "Approval basis", category: "Acceptance" },
  { field: "equationApplicability", label: "Equation applicability", category: "Equation path" },
  { field: "plumeLimitationReview", label: "Plume limitations", category: "Equation path" },
  { field: "tsfpewgSectionRefs", label: "TSFPEWG sections", category: "Code path" },
  { field: "ahjAssumptions", label: "AHJ assumptions", category: "Code path" },
  { field: "activationSequence", label: "Activation sequence", category: "Controls" },
  { field: "leakageBasis", label: "Leakage basis", category: "Pressure" },
  { field: "hvacStateBasis", label: "HVAC/fire mode", category: "Pressure" },
  { field: "validationReference", label: "Validation reference", category: "Validation" },
];
const reviewerConfirmationDefinitions = [
  { field: "confirmsAxisymmetricPlume", label: "Axisymmetric plume valid" },
  { field: "confirmsSteadyEquivalent", label: "Steady equivalent justified" },
  { field: "confirmsNoWallOrRackPlume", label: "Not wall/rack plume" },
  { field: "confirmsNoSuppressionInteraction", label: "Suppression interaction addressed" },
];
const enumOptions = {
  missionClass: ["Mission-essential", "Mission-critical"],
  macCategory: ["MAC III", "MAC II", "MAC I"],
  facilityType: ["Typical", "Remote", "Modular"],
  operationMode: ["Occupied", "Unoccupied"],
  designFirePresetId: designFirePresets.map((preset) => preset.id),
};
const importFieldNames = new Set([
  ...numericFields,
  ...booleanFields,
  ...stringFields,
  "reviewerBasisAudit",
  ...Object.keys(enumOptions),
]);
const expectedImportUnits = {
  hrrKw: "kW",
  ambientTempC: "deg C",
  roomLengthFt: "ft",
  roomWidthFt: "ft",
  roomHeightFt: "ft",
  smokeInterfaceFt: "ft",
  makeupRatio: "decimal",
  makeupFreeAreaFt2: "ft2",
  leakageAreaFt2: "ft2",
  flowCoefficient: "decimal",
  targetPressurePa: "Pa",
  maxMakeupVelocityFpm: "fpm",
  convectiveFraction: "decimal",
  exhaustInletLengthIn: "in",
  exhaustInletWidthIn: "in",
  exhaustLocationFactor: "decimal",
  selectedInletCount: "count",
  exhaustMarginPercent: "percent",
};

const scenarioSchema = {
  schemaVersion: SCENARIO_SCHEMA_VERSION,
  requiredFields: [
    ...Object.keys(enumOptions),
    ...numericFields.filter((field) => field !== "revision"),
    ...booleanFields,
    "name",
    "designFireBasis",
  ],
  enumOptions,
  units: expectedImportUnits,
  wholeNumberFields: ["revision", "selectedInletCount"],
  decimalRatioFields: ["convectiveFraction", "makeupRatio", "flowCoefficient", "exhaustLocationFactor"],
  percentFields: ["exhaustMarginPercent"],
  importLimit: 25,
};

const tsfpewgRequirements = [
  {
    id: "TSF-001",
    section: "1-5 and Appendix A",
    requirement: "Classify the information technology equipment mission and mission assurance category before selecting the protection path.",
    trigger: "All scenarios",
    appField: "missionClass, macCategory",
    appResponse: "Decision Path step 1 selects Chapter 2, 3, 4, 5, or 6 based on mission, MAC, and facility type.",
  },
  {
    id: "TSF-002",
    section: "2-13.1",
    requirement: "Provide smoke exhaust from the information technology equipment room to the exterior unless a direct outside door supports a pre-positioned portable fan approach.",
    trigger: "Chapter 2 baseline and paths that inherit Chapter 2",
    appField: "directExteriorDoor",
    appResponse: "Decision Path identifies permanent exhaust or the MAC III portable fan exception path.",
  },
  {
    id: "TSF-003",
    section: "2-13.2",
    requirement: "Size exhaust for a smoke layer interface or concentration objective and keep makeup less than exhaust to limit spread to adjacent spaces.",
    trigger: "Smoke exhaust calculation path",
    appField: "smokeInterfaceFt, hrrKw, convectiveFraction, makeupRatio",
    appResponse: "Trace steps F-001 through F-007 calculate exhaust; Compliance Checklist checks makeup less than exhaust.",
  },
  {
    id: "TSF-004",
    section: "2-13.2",
    requirement: "Evaluate the referenced 12 Pa / 0.05 in. w.g. pressure-differential objective with respect to adjacent spaces.",
    trigger: "Smoke exhaust calculation path",
    appField: "makeupRatio, leakageAreaFt2, flowCoefficient, targetPressurePa",
    appResponse: "Pressure Helper and trace steps F-011/F-012 estimate pressure and solve required imbalance/helper values.",
  },
  {
    id: "TSF-005",
    section: "2-13.3",
    requirement: "Use dedicated smoke exhaust separate from normal IT room air handling; makeup may be dedicated or normal HVAC and brought in below the design smoke layer interface.",
    trigger: "Permanent smoke exhaust path",
    appField: "hvacStateBasis, activationSequence",
    appResponse: "Reviewer Basis requires HVAC/fire-mode and activation-sequence evidence before a final calculation package.",
  },
  {
    id: "TSF-006",
    section: "2-13.4 and 2-13.4.1",
    requirement: "Control smoke exhaust from the fire alarm system, include required smoke/fire damper isolation, manual deactivation, and fire-protection power supply features.",
    trigger: "Permanent smoke exhaust path without clean agent manual-only override",
    appField: "cleanAgent, activationSequence",
    appResponse: "Decision Path and Reviewer Basis require the activation sequence and control basis to be documented.",
  },
  {
    id: "TSF-007",
    section: "3-1, 3-3.3.2, 3-3.4.2",
    requirement: "MAC II facilities follow Chapter 2 as modified by Chapter 3; Alarm detection level activates smoke exhaust except where otherwise indicated.",
    trigger: "MAC II, typical occupied or unoccupied facilities",
    appField: "macCategory, operationMode",
    appResponse: "Decision Path routes MAC II to Chapter 3 and records Alarm-level activation basis.",
  },
  {
    id: "TSF-008",
    section: "4-3.1, 4-3.1.8, 4-4",
    requirement: "Mission-critical/MAC I spaces require clean agent supplemental fire suppression; clean-agent activation does not activate smoke exhaust; smoke exhaust is manual-only from outside the IT room.",
    trigger: "Mission-critical / MAC I or clean-agent scenario",
    appField: "missionClass, macCategory, cleanAgent",
    appResponse: "Decision Path routes MAC I to Chapter 4 and forces the report to document manual-only smoke exhaust activation.",
  },
  {
    id: "TSF-009",
    section: "5-1.1, 5-1.2, 5-5.1",
    requirement: "Remote continuously occupied facilities follow the appropriate Chapter 2/3/4 path; remote unoccupied facilities follow Chapter 4 as modified, and Alarm detection activates smoke exhaust unless clean agent is provided.",
    trigger: "Remote facilities",
    appField: "facilityType, operationMode, cleanAgent",
    appResponse: "Decision Path routes Remote selections to Chapter 5 and flags clean-agent/activation evidence in Reviewer Basis.",
  },
  {
    id: "TSF-010",
    section: "6-1, 6-4.1, 6-4.2, 6-5.1, 6-5.2",
    requirement: "Modular data centers follow Chapter 2 as modified by Chapter 6; mission-critical modular facilities use Chapter 3 detection and clean agent in accordance with Chapter 4.",
    trigger: "Modular data centers",
    appField: "facilityType, missionClass, macCategory",
    appResponse: "Decision Path routes Modular selections to Chapter 6 and leaves clean-agent/detection proof in Reviewer Basis.",
  },
  {
    id: "CALC-001",
    section: "TSFPEWG 2-13.2; Handbook Ch. 16; NFPA 92",
    requirement: "Show all variables, formulas, substitutions, and limitations for the selected smoke exhaust calculation path.",
    trigger: "All calculated smoke exhaust scenarios",
    appField: "all calculation inputs",
    appResponse: "Variable Register, Formula Register, Calculation Trace, Excel Mode formula path, and Raw JSON are included in the report.",
  },
  {
    id: "CALC-002",
    section: "Engineering review limitation",
    requirement: "Document equation applicability, design fire basis, AHJ/insurer assumptions, and independent validation before submittal.",
    trigger: "All scenarios intended for project use",
    appField: "reviewerBasisAudit and confirmation toggles",
    appResponse: "Data Quality remains Review or Blocked until reviewer-basis entries and confirmations are completed.",
  },
];

const formulas = [
  {
    id: "DF-001",
    name: "Design fire selection",
    formula: "Q = selected preset HRR or user-entered equivalent steady HRR",
    source: "Scenario design-fire library; citation and applicability shown in report.",
  },
  {
    id: "F-001",
    name: "Convective heat release rate",
    formula: "Qc = chi_c * Q",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.1",
  },
  {
    id: "F-002",
    name: "Limiting elevation",
    formula: "zl = 0.166 * Qc^(2/5)",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.13, SI form",
  },
  {
    id: "F-003",
    name: "Simplified axisymmetric plume mass flow",
    formula: "m = 0.071 * Qc^(1/3) * z^(5/3) + 0.0018 * Qc, when z >= zl",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.11, SI form",
  },
  {
    id: "F-004",
    name: "Flame region plume mass flow",
    formula: "m = 0.032 * Qc^(3/5) * z, when z < zl",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.12, SI form",
  },
  {
    id: "F-005",
    name: "Smoke layer temperature",
    formula: "Ts = To + (K * Qc) / (m * cp)",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.24",
  },
  {
    id: "F-006",
    name: "Smoke density",
    formula: "rho = patm / (R * Ts)",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.29, SI form",
  },
  {
    id: "F-007",
    name: "Volumetric smoke exhaust",
    formula: "V = m / rho",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.28, SI form",
  },
  {
    id: "F-008A",
    name: "Rectangular inlet equivalent diameter",
    formula: "Di = 2ab / (a + b); ratio = d / Di",
    source: "NFPA 92 (2024), 5.6.8 and 5.6.7, inch-pound inlet geometry check",
  },
  {
    id: "F-008",
    name: "Plugholing limit per inlet",
    formula: "Vmax = 4.16 * gamma * d^(5/2) * ((Ts - To) / To)^(1/2)",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.25, SI form",
  },
  {
    id: "F-009",
    name: "Minimum inlet separation",
    formula: "Smin = 0.9 * Ve^(1/2)",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.27, SI form",
  },
  {
    id: "F-010",
    name: "Makeup air velocity",
    formula: "Umu = Vmu / Afv",
    source: "Handbook of Smoke Control Engineering, Ch. 16, Eq. 16.30",
  },
  {
    id: "F-011",
    name: "Pressure from imbalance through leakage",
    formula: "DeltaP = rho * (V / (C * A))^2 / 2",
    source: "Handbook of Smoke Control Engineering, Ch. 3, Eq. 3.4 rearranged",
  },
  {
    id: "F-012",
    name: "Pressure target helper",
    formula: "Vtarget = C * A * (2 * DeltaPtarget / rho)^(1/2); Rmu,max = (Vsel - Vtarget) / Vsel; Amax = Vimb / (C * (2 * DeltaPtarget / rho)^(1/2))",
    source: "Algebraic rearrangement of F-011 for target-pressure design checks",
  },
];

const fields = [
  {
    title: "TSFPEWG Path",
    controls: [
      { type: "select", field: "missionClass", label: "Mission", options: ["Mission-essential", "Mission-critical"] },
      { type: "select", field: "macCategory", label: "MAC", options: ["MAC III", "MAC II", "MAC I"] },
      { type: "select", field: "facilityType", label: "Facility", options: ["Typical", "Remote", "Modular"] },
      { type: "select", field: "operationMode", label: "Operation", options: ["Occupied", "Unoccupied"] },
      { type: "toggle", field: "cleanAgent", label: "Clean agent" },
      { type: "toggle", field: "directExteriorDoor", label: "Direct exterior door" },
    ],
  },
  {
    title: "Design Fire",
    controls: [
      {
        type: "firePreset",
        field: "designFirePresetId",
        label: "Preset",
      },
      { type: "textarea", field: "designFireBasis", label: "Project basis / justification" },
      { type: "number", field: "hrrKw", label: "HRR", unit: "kW", step: 50, min: 0 },
      { type: "number", field: "convectiveFraction", label: "Convective fraction", unit: "-", step: 0.05, min: 0 },
      { type: "number", field: "ambientTempC", label: "Ambient temp", unit: "deg C", step: 1 },
    ],
  },
  {
    title: "Reviewer Basis",
    controls: [
      { type: "reviewerBasis" },
      { type: "toggle", field: "confirmsAxisymmetricPlume", label: "Axisymmetric plume valid" },
      { type: "toggle", field: "confirmsSteadyEquivalent", label: "Steady equivalent justified" },
      { type: "toggle", field: "confirmsNoWallOrRackPlume", label: "Not wall/rack plume" },
      { type: "toggle", field: "confirmsNoSuppressionInteraction", label: "Suppression interaction addressed" },
    ],
  },
  {
    title: "Room and Exhaust",
    controls: [
      { type: "number", field: "roomLengthFt", label: "Room length", unit: "ft", min: 0 },
      { type: "number", field: "roomWidthFt", label: "Room width", unit: "ft", min: 0 },
      { type: "number", field: "roomHeightFt", label: "Room height", unit: "ft", min: 0 },
      { type: "number", field: "smokeInterfaceFt", label: "Smoke interface", unit: "ft", min: 0 },
      { type: "number", field: "exhaustMarginPercent", label: "Exhaust margin", unit: "%", min: 0 },
      { type: "number", field: "selectedInletCount", label: "Selected inlets", unit: "count", step: 1, min: 1 },
      { type: "number", field: "exhaustInletLengthIn", label: "Inlet length", unit: "in", min: 0 },
      { type: "number", field: "exhaustInletWidthIn", label: "Inlet width", unit: "in", min: 0 },
      { type: "number", field: "exhaustLocationFactor", label: "Exhaust location factor", unit: "-", step: 0.5, min: 0 },
    ],
  },
  {
    title: "Makeup Air and Leakage",
    controls: [
      { type: "number", field: "makeupRatio", label: "Makeup ratio", unit: "Vmu/V", step: 0.01, min: 0 },
      { type: "number", field: "makeupFreeAreaFt2", label: "Makeup free area", unit: "ft2", min: 0 },
      { type: "number", field: "leakageAreaFt2", label: "Leakage area", unit: "ft2", min: 0 },
      { type: "number", field: "flowCoefficient", label: "Flow coefficient", unit: "-", step: 0.05, min: 0 },
      { type: "number", field: "targetPressurePa", label: "Pressure target", unit: "Pa", min: 0 },
      { type: "number", field: "maxMakeupVelocityFpm", label: "Velocity limit", unit: "fpm", min: 0 },
    ],
  },
];

const excelFields = [
  {
    title: "Excel Inputs - Fire and Layer",
    controls: [
      {
        type: "firePreset",
        field: "designFirePresetId",
        label: "Preset",
      },
      { type: "number", field: "hrrKw", label: "HRR", unit: "kW", step: 50, min: 0 },
      { type: "number", field: "convectiveFraction", label: "Convective fraction", unit: "-", step: 0.05, min: 0 },
      { type: "number", field: "ambientTempC", label: "Ambient temp", unit: "deg C", step: 1 },
      { type: "number", field: "roomHeightFt", label: "Ceiling height", unit: "ft", min: 0 },
      { type: "number", field: "smokeInterfaceFt", label: "Smoke interface", unit: "ft", min: 0 },
    ],
  },
  {
    title: "Excel Inputs - Exhaust Pickup",
    controls: [
      { type: "number", field: "selectedInletCount", label: "Exhaust points", unit: "count", step: 1, min: 1 },
      { type: "number", field: "exhaustInletLengthIn", label: "Inlet length", unit: "in", min: 0 },
      { type: "number", field: "exhaustInletWidthIn", label: "Inlet width", unit: "in", min: 0 },
      { type: "number", field: "exhaustLocationFactor", label: "Location factor", unit: "-", step: 0.5, min: 0 },
      { type: "number", field: "exhaustMarginPercent", label: "Exhaust margin", unit: "%", min: 0 },
    ],
  },
  {
    title: "App Added Checks",
    controls: [
      { type: "number", field: "makeupRatio", label: "Makeup ratio", unit: "Vmu/V", step: 0.01, min: 0 },
      { type: "number", field: "makeupFreeAreaFt2", label: "Makeup free area", unit: "ft2", min: 0 },
      { type: "number", field: "leakageAreaFt2", label: "Leakage area", unit: "ft2", min: 0 },
      { type: "number", field: "flowCoefficient", label: "Flow coefficient", unit: "-", step: 0.05, min: 0 },
      { type: "number", field: "targetPressurePa", label: "Pressure target", unit: "Pa", min: 0 },
      { type: "number", field: "maxMakeupVelocityFpm", label: "Velocity limit", unit: "fpm", min: 0 },
    ],
  },
];

function activeScenario() {
  return scenarios.find((scenario) => scenario.id === activeId) || scenarios[0];
}

function baselineScenario(active) {
  return (
    scenarios.find((scenario) => scenario.id === active.parentId) ||
    scenarios.find((scenario) => scenario.id !== active.id) ||
    active
  );
}

function designFirePresetFor(scenario) {
  return (
    designFirePresets.find((preset) => preset.id === scenario.designFirePresetId) ||
    designFirePresets.find((preset) => preset.id === "custom-steady")
  );
}

function issue(severity, field, message) {
  return { severity, field, message };
}

function cleanId(value, fallback, usedIds = new Set()) {
  const base = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || fallback;
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

function coerceBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(normalized)) return true;
    if (["false", "no", "n", "0"].includes(normalized)) return false;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  return null;
}

function coerceFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const cleaned = value.replace(/,/g, "").trim();
    const number = Number(cleaned);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function hasMeaningfulText(value) {
  const text = String(value || "").trim();
  return text.length >= 8 && !["tbd", "n/a", "na", "none", "unknown"].includes(text.toLowerCase());
}

function predictiveReviewerAnswers(scenario) {
  const preset = designFirePresetFor(scenario);
  const path = decisionPath(scenario)
    .map((step) => `${step.criteria}: ${step.result}`)
    .join(" | ");
  const cleanAgentText = scenario.cleanAgent
    ? "clean-agent interlock and manual exhaust activation must be confirmed"
    : "automatic exhaust/makeup/HVAC fire-mode sequence must be confirmed";
  const steadyText =
    preset.hrrKw === null
      ? "Project-specific HRR curve or equivalent steady HRR is required before this scenario can be accepted."
      : `${whole(preset.hrrKw)} kW steady-equivalent preset is used as a predictive draft; replace with measured growth/decay data or a documented steady-equivalent basis if required.`;

  return {
    fuelPackageDescription: `Predictive draft: ${preset.shortName} selected for a ${scenario.macCategory} ${scenario.facilityType.toLowerCase()} data center scenario; confirm actual combustible package, location, quantity, and arrangement.`,
    designFireSourceRef: `Predictive draft: ${preset.sourceName}${preset.sourceUrl ? ` (${preset.sourceUrl})` : ""}; add page/table/test ID used by the project reviewer.`,
    hrrCurveBasis: `Predictive draft: ${steadyText}`,
    approvalBasis: `Predictive draft: basis is pending engineer review and AHJ/insurer acceptance for ${scenario.missionClass}, ${scenario.macCategory}, ${scenario.facilityType}.`,
    equationApplicability: "Predictive draft: simplified axisymmetric plume path is assumed; confirm the fire is open to the smoke layer and not governed by rack, wall, confined, or shielded plume behavior.",
    plumeLimitationReview: "Predictive draft: wall plume, rack plume, shielded fire, cabinet fire, multiple-source fire, suppression-controlled fire, and transient growth limitations require documented review.",
    tsfpewgSectionRefs: `Predictive draft: ${path}; add exact TSFPEWG paragraphs, edition assumptions, and exception path.`,
    ahjAssumptions: "Predictive draft: AHJ acceptance criteria, NFPA 92 edition, insurer criteria, and unresolved interpretations must be listed before submittal.",
    activationSequence: `Predictive draft: ${cleanAgentText}; document detection level, exhaust start, makeup opening, HVAC state, clean-agent/sprinkler interactions, and manual overrides.`,
    leakageBasis: `Predictive draft: leakage area ${fmt(scenario.leakageAreaFt2, 1)} ft2 and flow coefficient ${fmt(scenario.flowCoefficient, 2)} are user inputs; add door/damper/envelope basis or commissioning test method.`,
    hvacStateBasis: "Predictive draft: document fire-mode fan status, damper states, wind/stack assumptions, CRAC/CRAH operation, and smoke exhaust control sequence.",
    validationReference: "Predictive draft: no independent validation is linked; add hand calculation, handbook worked example, benchmark case, or peer-check ID.",
  };
}

function predictiveAuditForField(scenario, field) {
  const preset = designFirePresetFor(scenario);
  const sourceRef =
    field === "designFireSourceRef" || field === "hrrCurveBasis" || field === "fuelPackageDescription"
      ? preset.sourceName
      : "Derived from current scenario inputs and reviewer-basis checklist";
  return {
    status: "Predictive",
    sourceType: "App prediction",
    sourceRef,
    evidenceId: "PREDICTIVE-DRAFT",
    confidence: field === "validationReference" || field === "approvalBasis" ? "Low" : "Medium",
  };
}

function reviewerAuditFor(scenario, field) {
  return {
    ...predictiveAuditForField(scenario, field),
    ...((scenario.reviewerBasisAudit && scenario.reviewerBasisAudit[field]) || {}),
  };
}

function applyPredictiveReviewerBasis(scenario, options = {}) {
  const predictions = predictiveReviewerAnswers(scenario);
  const force = Boolean(options.force);
  const nextAudit = { ...(scenario.reviewerBasisAudit || {}) };
  const next = { ...scenario };

  reviewerBasisDefinitions.forEach((definition) => {
    if (force || !hasMeaningfulText(next[definition.field])) {
      next[definition.field] = predictions[definition.field];
      nextAudit[definition.field] = predictiveAuditForField(next, definition.field);
    } else if (!nextAudit[definition.field]) {
      nextAudit[definition.field] = predictiveAuditForField(next, definition.field);
    }
  });

  next.reviewerBasisAudit = nextAudit;
  return next;
}

function auditStatusRank(status) {
  return reviewerAuditStatuses.includes(status) ? reviewerAuditStatuses.indexOf(status) : 0;
}

function reviewerBasisRows(scenario) {
  return [
    ...reviewerBasisDefinitions.map((definition) => {
      const audit = reviewerAuditFor(scenario, definition.field);
      return {
        item: definition.label,
        category: definition.category,
        basis: scenario[definition.field],
        status: audit.status,
        sourceType: audit.sourceType,
        sourceRef: audit.sourceRef,
        evidenceId: audit.evidenceId,
        confidence: audit.confidence,
      };
    }),
    ...reviewerConfirmationDefinitions.map((definition) => ({
      item: definition.label,
      category: "Confirmation",
      basis: yesNo(scenario[definition.field]),
      status: scenario[definition.field] ? "Engineer reviewed" : "Predictive",
      sourceType: "Project confirmation",
      sourceRef: "Reviewer Basis confirmation toggle",
      evidenceId: scenario[definition.field] ? "CONFIRMED" : "MISSING",
      confidence: scenario[definition.field] ? "Medium" : "Low",
    })),
  ];
}

function dataQualityForScenario(scenario, calc) {
  const preset = designFirePresetFor(scenario);
  const issues = [];
  const requiredPositive = [
    ["roomLengthFt", "Room length must be greater than 0 ft."],
    ["roomWidthFt", "Room width must be greater than 0 ft."],
    ["roomHeightFt", "Room height must be greater than 0 ft."],
    ["smokeInterfaceFt", "Smoke interface must be greater than 0 ft."],
    ["makeupFreeAreaFt2", "Makeup free area must be greater than 0 ft2."],
    ["leakageAreaFt2", "Leakage area must be greater than 0 ft2."],
    ["flowCoefficient", "Flow coefficient must be greater than 0."],
    ["selectedInletCount", "Selected inlet count must be at least 1."],
    ["exhaustInletLengthIn", "Exhaust inlet length must be greater than 0 in."],
    ["exhaustInletWidthIn", "Exhaust inlet width must be greater than 0 in."],
    ["targetPressurePa", "Pressure target must be greater than 0 Pa."],
    ["maxMakeupVelocityFpm", "Makeup velocity limit must be greater than 0 fpm."],
  ];

  requiredPositive.forEach(([field, message]) => {
    if (!(Number(scenario[field]) > 0)) issues.push(issue("error", field, message));
  });
  if (!(Number(scenario.hrrKw) > 0)) {
    issues.push(
      issue(
        "error",
        "hrrKw",
        preset.hrrKw === null ? "Project-specific design fire must include a nonzero HRR." : "HRR must be greater than 0 kW.",
      ),
    );
  }

  reviewerBasisDefinitions.forEach((definition) => {
    const audit = reviewerAuditFor(scenario, definition.field);
    if (!hasMeaningfulText(scenario[definition.field])) {
      issues.push(issue("error", definition.field, `${definition.label} basis is required.`));
    }
    if (auditStatusRank(audit.status) === 0) {
      issues.push(issue("warning", definition.field, `${definition.label} is predictive; mark engineer-reviewed or accepted before submittal.`));
    }
    if (auditStatusRank(audit.status) > 0 && !hasMeaningfulText(audit.sourceRef)) {
      issues.push(issue("error", definition.field, `${definition.label} needs source/page/test ID for audit.`));
    }
    if (auditStatusRank(audit.status) > 0 && audit.sourceType === "App prediction") {
      issues.push(issue("warning", definition.field, `${definition.label} is marked reviewed but still uses App prediction as the source type.`));
    }
    if (auditStatusRank(audit.status) > 0 && !hasMeaningfulText(audit.evidenceId)) {
      issues.push(issue("warning", definition.field, `${definition.label} should include an evidence ID or link.`));
    }
    if (auditStatusRank(audit.status) > 0 && audit.evidenceId === "PREDICTIVE-DRAFT") {
      issues.push(issue("warning", definition.field, `${definition.label} is marked reviewed but still uses predictive draft evidence.`));
    }
  });

  reviewerConfirmationDefinitions.forEach((definition) => {
    if (!scenario[definition.field]) issues.push(issue("warning", definition.field, `${definition.label} is not confirmed.`));
  });

  if (scenario.smokeInterfaceFt >= scenario.roomHeightFt) {
    issues.push(issue("error", "smokeInterfaceFt", "Smoke interface must be below the ceiling height."));
  }
  if (!Number.isInteger(Number(scenario.selectedInletCount))) {
    issues.push(issue("error", "selectedInletCount", "Selected inlet count must be a whole number."));
  }
  if (scenario.convectiveFraction > 1) {
    issues.push(issue("error", "convectiveFraction", "Convective fraction uses a decimal; enter 0.70 instead of 70."));
  } else if (scenario.convectiveFraction <= 0) {
    issues.push(issue("error", "convectiveFraction", "Convective fraction must be greater than 0."));
  }
  if (scenario.makeupRatio > 1) {
    issues.push(issue("error", "makeupRatio", "Makeup ratio uses a decimal; enter 0.95 instead of 95."));
  } else if (scenario.makeupRatio < 0) {
    issues.push(issue("error", "makeupRatio", "Makeup ratio cannot be negative."));
  } else if (scenario.makeupRatio >= 1) {
    issues.push(issue("warning", "makeupRatio", "Makeup air should be less than exhaust for this pressure check."));
  }
  if (scenario.flowCoefficient > 1) {
    issues.push(issue("warning", "flowCoefficient", "Flow coefficient above 1.0 is unusual; confirm imported units/source."));
  }
  if (scenario.exhaustLocationFactor <= 0) {
    issues.push(issue("error", "exhaustLocationFactor", "Exhaust location factor must be greater than 0."));
  }
  if (scenario.exhaustLocationFactor > 1) {
    issues.push(issue("warning", "exhaustLocationFactor", "Exhaust location factor above 1.0 is unusual for the current plugholing check."));
  }
  if (preset.id === "detection-10kw") {
    issues.push(issue("warning", "designFirePresetId", "10 kW detector benchmark is not an exhaust-sizing design fire."));
  }
  if (preset.hrrKw === null) {
    issues.push(issue("warning", "designFirePresetId", "Project-specific design fire requires a documented HRR source."));
  }
  if (calc) {
    if (!Number.isFinite(calc.outputs.pressurePa)) {
      issues.push(issue("error", "leakageAreaFt2", "Pressure cannot be evaluated until leakage area and flow coefficient are valid."));
    } else if (!calc.outputs.pressurePass) {
      issues.push(issue("warning", "targetPressurePa", "Pressure target is not met with current makeup and leakage inputs."));
    }
    if (!calc.outputs.flowPlugholingPass) {
      issues.push(issue("warning", "selectedInletCount", "Plugholing flow check does not pass with current inlet count/depth."));
    }
    if (!calc.outputs.inletGeometryPass) {
      issues.push(issue("warning", "exhaustInletLengthIn", "Smoke depth to equivalent inlet diameter ratio must be greater than 2 for the rectangular inlet plugholing basis."));
    }
    if (!calc.outputs.makeupVelocityPass) {
      issues.push(issue("warning", "makeupFreeAreaFt2", "Makeup velocity exceeds the selected limit."));
    }
  }

  const errorCount = issues.filter((item) => item.severity === "error").length;
  const warningCount = issues.filter((item) => item.severity === "warning").length;
  return {
    issues,
    errorCount,
    warningCount,
    status: errorCount > 0 ? "Blocked" : warningCount > 0 ? "Review" : "Ready",
  };
}

function scenarioTemplatePayload() {
  const templateScenario = applyPredictiveReviewerBasis({
    ...scenarioDefaults,
    id: "imported-packaging-scenario",
    name: "Imported packaging scenario",
    missionClass: "Mission-essential",
    macCategory: "MAC II",
    facilityType: "Typical",
    operationMode: "Occupied",
    cleanAgent: false,
    directExteriorDoor: false,
    designFirePresetId: "packaging-carton-500kw",
    designFireBasis: "Project basis for imported scenario.",
    hrrKw: 500,
    convectiveFraction: 0.7,
    ambientTempC: 21,
    roomLengthFt: 60,
    roomWidthFt: 40,
    roomHeightFt: 18,
    smokeInterfaceFt: 8,
    makeupRatio: 0.95,
    makeupFreeAreaFt2: 260,
    leakageAreaFt2: 9,
    flowCoefficient: 0.65,
    exhaustLocationFactor: 1,
    selectedInletCount: 2,
    exhaustInletLengthIn: 24,
    exhaustInletWidthIn: 24,
    exhaustMarginPercent: 0,
    targetPressurePa: 12,
    maxMakeupVelocityFpm: 200,
  }, { force: true });

  return {
    version: 1,
    schemaVersion: SCENARIO_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    calculationEngineVersion: CALC_ENGINE_VERSION,
    sourceDocuments: SOURCE_DOCUMENTS,
    schema: scenarioSchema,
    units: expectedImportUnits,
    scenarios: [templateScenario],
  };
}

function scenarioExportPayload() {
  return JSON.stringify(
    {
      version: 1,
      schemaVersion: SCENARIO_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      calculationEngineVersion: CALC_ENGINE_VERSION,
      sourceDocuments: SOURCE_DOCUMENTS,
      schema: scenarioSchema,
      units: expectedImportUnits,
      scenarios,
    },
    null,
    2,
  );
}

function scenarioRecordsFromPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.scenarios)) return payload.scenarios;
  if (payload && payload.scenario && typeof payload.scenario === "object") return [payload.scenario];
  if (payload && (payload.version || payload.units)) return null;
  if (payload && typeof payload === "object") return [payload];
  return null;
}

function validateImportUnits(payload) {
  const issues = [];
  if (!payload || Array.isArray(payload) || !payload.units) {
    issues.push(issue("warning", "units", "No units block found; app units are assumed."));
    return issues;
  }
  Object.entries(expectedImportUnits).forEach(([field, unit]) => {
    if (payload.units[field] && payload.units[field] !== unit) {
      issues.push(issue("error", field, `Imported ${field} unit must be ${unit}.`));
    }
  });
  return issues;
}

function normalizeReviewerAudit(rawAudit) {
  const normalized = {};
  if (!rawAudit || typeof rawAudit !== "object" || Array.isArray(rawAudit)) return normalized;

  reviewerBasisDefinitions.forEach((definition) => {
    const imported = rawAudit[definition.field];
    if (!imported || typeof imported !== "object" || Array.isArray(imported)) return;
    normalized[definition.field] = {
      status: reviewerAuditStatuses.includes(imported.status) ? imported.status : "Predictive",
      sourceType: reviewerAuditSourceTypes.includes(imported.sourceType) ? imported.sourceType : "App prediction",
      sourceRef: imported.sourceRef == null ? "" : String(imported.sourceRef),
      evidenceId: imported.evidenceId == null ? "" : String(imported.evidenceId),
      confidence: reviewerAuditConfidence.includes(imported.confidence) ? imported.confidence : "Medium",
    };
  });

  return normalized;
}

function normalizeScenarioRecord(record, index, usedIds) {
  const issues = [];
  const imported = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  const scenario = {
    ...scenarioDefaults,
    reviewerBasisAudit: {},
    id: cleanId(imported.id || imported.name, `imported-${index + 1}`, usedIds),
    name: typeof imported.name === "string" && imported.name.trim() ? imported.name.trim() : `Imported ${index + 1}`,
    revision: 1,
    parentId: null,
  };

  Object.keys(imported)
    .filter((field) => !importFieldNames.has(field))
    .forEach((field) => {
      issues.push(issue("warning", field, `Ignored unknown field: ${field}.`));
    });

  if (imported.reviewerBasisAudit !== undefined) {
    scenario.reviewerBasisAudit = normalizeReviewerAudit(imported.reviewerBasisAudit);
  }

  Object.entries(enumOptions).forEach(([field, options]) => {
    if (imported[field] === undefined) return;
    if (options.includes(imported[field])) {
      scenario[field] = imported[field];
    } else {
      issues.push(issue("error", field, `${field} must be one of: ${options.join(", ")}.`));
    }
  });

  numericFields.forEach((field) => {
    if (imported[field] === undefined) return;
    const number = coerceFiniteNumber(imported[field]);
    if (number === null) {
      issues.push(issue("error", field, `${field} must be a finite number.`));
      return;
    }
    scenario[field] = field === "revision" ? Math.round(number) : number;
  });

  booleanFields.forEach((field) => {
    if (imported[field] === undefined) return;
    const boolean = coerceBoolean(imported[field]);
    if (boolean === null) {
      issues.push(issue("error", field, `${field} must be true or false.`));
      return;
    }
    scenario[field] = boolean;
  });

  stringFields.forEach((field) => {
    if (field === "id" || field === "name") return;
    if (imported[field] === undefined || imported[field] === null) return;
    scenario[field] = String(imported[field]);
  });

  const preset = designFirePresetFor(scenario);
  if (imported.hrrKw === undefined && preset.hrrKw !== null) {
    scenario.hrrKw = preset.hrrKw;
  }
  if (imported.convectiveFraction === undefined && preset.convectiveFraction !== undefined) {
    scenario.convectiveFraction = preset.convectiveFraction;
  }
  if (imported.designFireBasis === undefined) {
    scenario.designFireBasis = preset.basis;
  }

  const normalizedScenario = applyPredictiveReviewerBasis(scenario);
  const calc = calculate(normalizedScenario);
  const quality = dataQualityForScenario(normalizedScenario, calc);
  return {
    scenario: normalizedScenario,
    issues: [...issues, ...quality.issues],
  };
}

function parseScenarioImport(raw) {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { scenarios: [], issues: [issue("error", "json", "Import must be valid JSON.")] };
  }

  const records = scenarioRecordsFromPayload(payload);
  if (!records || records.length === 0) {
    return { scenarios: [], issues: [issue("error", "scenarios", "Import must include at least one scenario.")] };
  }

  const usedIds = new Set();
  const recordLimit = 25;
  const unitIssues = validateImportUnits(payload);
  const limitIssues =
    records.length > recordLimit
      ? [issue("warning", "scenarios", `Import includes ${records.length} scenarios; only the first ${recordLimit} were imported.`)]
      : [];
  const normalized = records.slice(0, recordLimit).map((record, index) => normalizeScenarioRecord(record, index, usedIds));
  const importedScenarios = normalized.map((item) => item.scenario);
  const validIds = new Set(importedScenarios.map((scenario) => scenario.id));
  const parentIssues = [];

  importedScenarios.forEach((scenario) => {
    if (scenario.parentId && !validIds.has(scenario.parentId)) {
      parentIssues.push(issue("warning", "parentId", `${scenario.name}: parentId was cleared because it did not match an imported scenario id.`));
      scenario.parentId = null;
    }
  });

  return {
    scenarios: importedScenarios,
    issues: [
      ...unitIssues,
      ...limitIssues,
      ...parentIssues,
      ...normalized.flatMap((item) =>
        item.issues.map((itemIssue) => ({
          ...itemIssue,
          message: `${item.scenario.name}: ${itemIssue.message}`,
        })),
      ),
    ],
  };
}

function renderImportStatus(issues, importedCount = 0) {
  const status = document.getElementById("importStatus");
  if (!status) return;
  const errorCount = issues.filter((item) => item.severity === "error").length;
  const warningCount = issues.filter((item) => item.severity === "warning").length;
  status.className = `importStatus ${errorCount ? "error" : warningCount ? "warning" : "success"}`;
  if (errorCount) {
    status.innerHTML = `Import blocked: ${errorCount} error${errorCount === 1 ? "" : "s"}. ${html(
      issues.find((item) => item.severity === "error").message,
    )}`;
    return;
  }
  if (importedCount > 0) {
    const firstWarning = issues.find((item) => item.severity === "warning");
    status.innerHTML = `Imported ${importedCount} scenario${importedCount === 1 ? "" : "s"}${
      warningCount ? ` with ${warningCount} warning${warningCount === 1 ? "" : "s"}` : ""
    }.${firstWarning ? ` ${html(firstWarning.message)}` : ""}`;
    return;
  }
  status.innerHTML = "";
}

function setImportStatus(message, tone = "success") {
  const status = document.getElementById("importStatus");
  if (!status) return;
  status.className = `importStatus ${tone}`;
  status.innerHTML = html(message);
}

function fmt(value, digits = 1) {
  if (!Number.isFinite(value)) return "Needs input";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function whole(value) {
  if (!Number.isFinite(value)) return "Needs input";
  return Math.round(value).toLocaleString("en-US");
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pressureMakeupRatioLabel(calc) {
  if (!Number.isFinite(calc.outputs.maxMakeupRatioForPressure)) return "Needs input";
  if (!calc.outputs.pressurePossibleWithSelectedExhaust) return "Not possible";
  return fmt(calc.outputs.maxMakeupRatioForPressure, 2);
}

function pressureHelperMessage(calc) {
  if (!Number.isFinite(calc.outputs.pressurePa)) {
    return "Enter a valid leakage area and flow coefficient to evaluate pressure.";
  }
  if (calc.outputs.pressurePass) {
    return "Current pressure target passes with the selected makeup ratio and leakage area.";
  }
  if (!calc.outputs.pressurePossibleWithSelectedExhaust) {
    return "Increase selected exhaust, reduce leakage area, or lower the pressure target; makeup reduction alone cannot satisfy the target.";
  }
  return `Reduce makeup ratio to ${pressureMakeupRatioLabel(calc)} or lower, or reduce leakage area to ${fmt(
    calc.outputs.maxLeakageFt2ForPressure,
    1,
  )} ft2 or lower.`;
}

function requirementApplies(requirement, scenario) {
  if (requirement.trigger === "All scenarios" || requirement.trigger === "All calculated smoke exhaust scenarios") return true;
  if (requirement.id === "TSF-002") return scenario.facilityType !== "Remote" || scenario.operationMode === "Occupied";
  if (requirement.id === "TSF-003" || requirement.id === "TSF-004") return !(scenario.directExteriorDoor && scenario.macCategory === "MAC III");
  if (requirement.id === "TSF-005" || requirement.id === "TSF-006") return !(scenario.directExteriorDoor && scenario.macCategory === "MAC III");
  if (requirement.id === "TSF-007") return scenario.macCategory === "MAC II" && scenario.facilityType === "Typical";
  if (requirement.id === "TSF-008") return scenario.macCategory === "MAC I" || scenario.cleanAgent;
  if (requirement.id === "TSF-009") return scenario.facilityType === "Remote";
  if (requirement.id === "TSF-010") return scenario.facilityType === "Modular";
  if (requirement.id === "CALC-002") return true;
  return true;
}

function traceabilityForScenario(scenario, calc, quality) {
  return tsfpewgRequirements.map((requirement) => {
    const applies = requirementApplies(requirement, scenario);
    let status = applies ? "Addressed by app path" : "Not applicable";
    let evidence = applies ? requirement.appResponse : "Scenario inputs do not trigger this requirement.";

    if (requirement.id === "TSF-002" && scenario.directExteriorDoor && scenario.macCategory === "MAC III") {
      status = "Portable fan path";
      evidence = "Direct exterior door selected for MAC III; document fan staging, capacity, activation, and AHJ acceptance if permanent exhaust is omitted.";
    }
    if (requirement.id === "TSF-003" && applies && !(calc.outputs.requiredCfm > 0)) {
      status = "Blocked";
      evidence = "Required exhaust cannot be relied on until HRR, interface height, and plume inputs are valid.";
    }
    if (requirement.id === "TSF-004" && applies && !calc.outputs.pressurePass) {
      status = "Review";
      evidence = pressureHelperMessage(calc);
    }
    if ((requirement.id === "TSF-005" || requirement.id === "TSF-006") && applies) {
      status = hasMeaningfulText(scenario.activationSequence) && hasMeaningfulText(scenario.hvacStateBasis) ? "Requires reviewer source" : "Needs project basis";
      evidence = "Enter fire-mode sequence, damper/fan states, smoke exhaust controls, power source, and source/page/test evidence in Reviewer Basis.";
    }
    if (requirement.id === "TSF-008" && applies) {
      status = scenario.cleanAgent || scenario.macCategory === "MAC I" ? "Manual-only activation required" : status;
      evidence = "Document clean-agent interface and confirm smoke exhaust activation is manual-only outside the IT room.";
    }
    if (requirement.id === "CALC-002") {
      status = quality.status === "Ready" ? "App-ready pending external approval" : quality.status;
      evidence = quality.status === "Ready"
        ? "All app data-quality checks are clear; licensed FPE/AHJ/insurer acceptance remains outside the app."
        : "Resolve Data Quality items before submittal.";
    }

    return {
      id: requirement.id,
      section: requirement.section,
      requirement: requirement.requirement,
      trigger: requirement.trigger,
      appField: requirement.appField,
      applies: applies ? "Yes" : "No",
      status,
      evidence,
    };
  });
}

function submittalReadinessForScenario(scenario, calc, quality) {
  const reviewerRows = reviewerBasisRows(scenario);
  const reviewedRows = reviewerRows.filter((row) => row.category !== "Confirmation");
  const predictiveRows = reviewedRows.filter((row) => auditStatusRank(row.status) === 0);
  const missingSourceRows = reviewedRows.filter((row) => !hasMeaningfulText(row.sourceRef) || !hasMeaningfulText(row.evidenceId));
  const confirmationRows = reviewerConfirmationDefinitions.filter((definition) => !scenario[definition.field]);
  const rows = [
    ["No blocking input errors", quality.errorCount === 0, quality.errorCount ? `${quality.errorCount} blocking issue(s) remain.` : "No blocking input errors.", true],
    ["Reviewer basis accepted", predictiveRows.length === 0, predictiveRows.length ? `${predictiveRows.length} reviewer-basis item(s) still predictive.` : "Reviewer-basis items are no longer predictive.", true],
    ["Reviewer sources/evidence entered", missingSourceRows.length === 0, missingSourceRows.length ? `${missingSourceRows.length} reviewer-basis item(s) need source and evidence IDs.` : "Source and evidence metadata are populated.", true],
    ["Applicability confirmations complete", confirmationRows.length === 0, confirmationRows.length ? `${confirmationRows.length} confirmation toggle(s) remain unset.` : "Applicability confirmations are checked.", true],
    ["Smoke exhaust calculation valid", calc.outputs.requiredCfm > 0 && Number.isFinite(calc.outputs.requiredCfm), `Required exhaust = ${whole(calc.outputs.requiredCfm)} cfm.`, true],
    ["Plugholing checks pass", calc.outputs.plugholingPass, `Geometry ${calc.outputs.inletGeometryPass ? "passes" : "fails"}; flow ${calc.outputs.flowPlugholingPass ? "passes" : "fails"}.`, true],
    ["Makeup velocity passes", calc.outputs.makeupVelocityPass, `${fmt(calc.outputs.makeupVelocityFpm, 1)} fpm vs ${fmt(scenario.maxMakeupVelocityFpm, 1)} fpm limit.`, true],
    ["Pressure objective passes", calc.outputs.pressurePass, `${fmt(calc.outputs.pressurePa, 1)} Pa vs ${fmt(scenario.targetPressurePa, 1)} Pa target.`, true],
    ["Design fire suitable", designFirePresetFor(scenario).id !== "detection-10kw", designFirePresetFor(scenario).id === "detection-10kw" ? "Detection benchmark is not an exhaust-sizing design fire." : "Design fire is not the detector benchmark.", true],
    ["External FPE/AHJ approval", false, "Required outside this app before project use; attach signed review, AHJ direction, or insurer acceptance.", false],
  ];
  const blockingCount = rows.filter((row) => !row[1] && row[3]).length;
  return {
    status: blockingCount === 0 ? "App-ready pending external approval" : quality.errorCount > 0 ? "Blocked" : "Draft / review required",
    blockingCount,
    rows: rows.map(([item, pass, note, blocksApp]) => ({
      item,
      status: pass ? "Pass" : blocksApp ? "Needs action" : "External required",
      note,
    })),
  };
}

function decisionPath(scenario) {
  const chapter =
    scenario.facilityType === "Remote"
      ? "Chapter 5 remote facility path"
      : scenario.facilityType === "Modular"
        ? "Chapter 6 modular data center path"
        : scenario.missionClass === "Mission-critical" && scenario.macCategory === "MAC I"
          ? "Chapter 4 mission-critical/MAC I path"
          : scenario.macCategory === "MAC II"
            ? "Chapter 3 MAC II path"
            : "Chapter 2 mission-essential/MAC III path";

  const exhaustRequirement =
    scenario.directExteriorDoor && scenario.macCategory === "MAC III"
      ? "Permanent exhaust may be replaced by pre-positioned portable fans."
      : "Smoke exhaust system required for the selected path.";

  const activation = scenario.cleanAgent
    ? "Smoke exhaust activation is manual-only from outside the IT room."
    : scenario.macCategory === "MAC III"
      ? "Automatic activation on two smoke detectors, sprinkler activation, or manual station."
      : "Activation follows Alarm detection level unless modified by clean agent criteria.";

  return [
    {
      step: "1",
      decision: "Mission classification",
      input: `${scenario.missionClass} / ${scenario.macCategory}`,
      criteria: "TSFPEWG 1-5, Appendix A, Chapters 2 through 6",
      result: chapter,
    },
    {
      step: "2",
      decision: "Facility type",
      input: scenario.facilityType,
      criteria: "TSFPEWG Chapters 5 and 6",
      result:
        scenario.facilityType === "Typical"
          ? "No remote or modular modifier selected."
          : `${scenario.facilityType} requirements modify the base path.`,
    },
    {
      step: "3",
      decision: "Exterior door",
      input: yesNo(scenario.directExteriorDoor),
      criteria: "TSFPEWG 2-13.1",
      result: exhaustRequirement,
    },
    {
      step: "4",
      decision: "Clean agent",
      input: yesNo(scenario.cleanAgent),
      criteria: "TSFPEWG 2-13.4, 4-3.1.8, and 4-4",
      result: activation,
    },
  ];
}

function calculate(scenario) {
  const firePreset = designFirePresetFor(scenario);
  const Q = Math.max(0, Number(scenario.hrrKw) || 0);
  const chi = Math.max(0, Number(scenario.convectiveFraction) || 0);
  const Qc = Q * chi;
  const interfaceM = scenario.smokeInterfaceFt * FT_TO_M;
  const smokeDepthFt = Math.max(0, scenario.roomHeightFt - scenario.smokeInterfaceFt);
  const smokeDepthM = smokeDepthFt * FT_TO_M;
  const exhaustInletLengthFt = Math.max(0, Number(scenario.exhaustInletLengthIn) || 0) / 12;
  const exhaustInletWidthFt = Math.max(0, Number(scenario.exhaustInletWidthIn) || 0) / 12;
  const equivalentInletDiameterFt =
    exhaustInletLengthFt > 0 && exhaustInletWidthFt > 0
      ? (2 * exhaustInletLengthFt * exhaustInletWidthFt) / (exhaustInletLengthFt + exhaustInletWidthFt)
      : 0;
  const equivalentInletDiameterM = equivalentInletDiameterFt * FT_TO_M;
  const smokeDepthToDiameterRatio =
    equivalentInletDiameterFt > 0 ? smokeDepthFt / equivalentInletDiameterFt : Number.NaN;
  const inletGeometryPass = Number.isFinite(smokeDepthToDiameterRatio) && smokeDepthToDiameterRatio > 2;
  const zl = 0.166 * Math.pow(Math.max(Qc, 0), 2 / 5);
  const useUpperPlume = interfaceM >= zl;
  const massFlowKgs =
    Qc > 0 && interfaceM > 0
      ? useUpperPlume
        ? 0.071 * Math.pow(Qc, 1 / 3) * Math.pow(interfaceM, 5 / 3) + 0.0018 * Qc
        : 0.032 * Math.pow(Qc, 3 / 5) * interfaceM
      : 0;
  const smokeTempC =
    massFlowKgs > 0
      ? scenario.ambientTempC + Qc / (massFlowKgs * CP_SMOKE)
      : scenario.ambientTempC;
  const smokeTempK = smokeTempC + 273.15;
  const ambientK = scenario.ambientTempC + 273.15;
  const smokeDensity = smokeTempK > 0 ? ATM_PA / (GAS_CONSTANT_AIR * smokeTempK) : 0;
  const requiredM3s = smokeDensity > 0 ? massFlowKgs / smokeDensity : 0;
  const requiredCfm = requiredM3s * CFM_PER_M3S;
  const selectedCfm = requiredCfm * (1 + scenario.exhaustMarginPercent / 100);
  const selectedM3s = selectedCfm / CFM_PER_M3S;

  const plugSmokeTempC =
    massFlowKgs > 0
      ? scenario.ambientTempC + (0.5 * Qc) / (massFlowKgs * CP_SMOKE)
      : scenario.ambientTempC;
  const plugSmokeTempK = plugSmokeTempC + 273.15;
  const tempRatio = Math.max(0, (plugSmokeTempK - ambientK) / ambientK);
  const vmaxM3s =
    smokeDepthM > 0
      ? 4.16 *
        scenario.exhaustLocationFactor *
        Math.pow(smokeDepthM, 2.5) *
        Math.sqrt(tempRatio)
      : 0;
  const vmaxCfm = vmaxM3s * CFM_PER_M3S;
  const requiredInlets =
    vmaxCfm > 0 ? Math.max(1, Math.ceil(selectedCfm / vmaxCfm)) : Number.POSITIVE_INFINITY;
  const selectedInletCount = Math.max(1, scenario.selectedInletCount);
  const flowPerInletCfm = selectedCfm / selectedInletCount;
  const flowPerInletM3s = selectedM3s / selectedInletCount;
  const flowPlugholingPass = vmaxCfm > 0 && flowPerInletCfm <= vmaxCfm;
  const plugholingPass = flowPlugholingPass && inletGeometryPass;
  const inletSeparationM = 0.9 * Math.sqrt(Math.max(0, flowPerInletM3s));
  const inletSeparationFt = inletSeparationM / FT_TO_M;

  const makeupCfm = selectedCfm * scenario.makeupRatio;
  const makeupM3s = makeupCfm / CFM_PER_M3S;
  const makeupAreaM2 = scenario.makeupFreeAreaFt2 * FT2_TO_M2;
  const makeupVelocityMs = makeupAreaM2 > 0 ? makeupM3s / makeupAreaM2 : Number.POSITIVE_INFINITY;
  const makeupVelocityFpm = makeupVelocityMs * FPM_PER_MS;
  const makeupVelocityPass = makeupVelocityFpm <= scenario.maxMakeupVelocityFpm;

  const imbalanceCfm = Math.max(0, selectedCfm - makeupCfm);
  const imbalanceM3s = imbalanceCfm / CFM_PER_M3S;
  const leakageM2 = scenario.leakageAreaFt2 * FT2_TO_M2;
  const pressurePa =
    leakageM2 > 0 && scenario.flowCoefficient > 0
      ? (PRESSURE_AIR_DENSITY * Math.pow(imbalanceM3s / (scenario.flowCoefficient * leakageM2), 2)) / 2
      : Number.NaN;
  const pressureInWg = pressurePa * PA_TO_IN_WG;
  const pressurePass = Number.isFinite(pressurePa) && pressurePa >= scenario.targetPressurePa;
  const pressureTargetValid = scenario.targetPressurePa > 0 && scenario.flowCoefficient > 0;
  const pressureTargetVelocity =
    pressureTargetValid ? Math.sqrt((2 * scenario.targetPressurePa) / PRESSURE_AIR_DENSITY) : 0;
  const requiredImbalanceM3s =
    pressureTargetValid && leakageM2 > 0 ? scenario.flowCoefficient * leakageM2 * pressureTargetVelocity : Number.NaN;
  const requiredImbalanceCfm = requiredImbalanceM3s * CFM_PER_M3S;
  const maxMakeupCfmForPressure = selectedCfm - requiredImbalanceCfm;
  const maxMakeupRatioForPressure =
    selectedCfm > 0 && Number.isFinite(maxMakeupCfmForPressure)
      ? maxMakeupCfmForPressure / selectedCfm
      : Number.NaN;
  const pressurePossibleWithSelectedExhaust = Number.isFinite(maxMakeupRatioForPressure)
    ? maxMakeupRatioForPressure >= 0
    : false;
  const maxLeakageM2ForPressure =
    pressureTargetValid && imbalanceM3s > 0
      ? imbalanceM3s / (scenario.flowCoefficient * pressureTargetVelocity)
      : Number.NaN;
  const maxLeakageFt2ForPressure = maxLeakageM2ForPressure / FT2_TO_M2;

  const warnings = [
    "Design fire HRR remains an engineering assumption; confirm the selected preset matches the project fuel package and approval path.",
    "Prototype currently implements the simplified axisymmetric plume path only.",
    "NFPA 92 edition, AHJ criteria, and qualified FPE review are required before design use.",
  ];
  if (firePreset.hrrKw === null) {
    warnings.push("Selected design-fire preset requires project-specific HRR or measured curve data.");
  }
  if (firePreset.id === "detection-10kw") {
    warnings.push("The 10 kW detection benchmark is not intended for smoke exhaust sizing.");
  }
  if (scenario.smokeInterfaceFt >= scenario.roomHeightFt) warnings.push("Smoke layer interface must be below the ceiling height.");
  if (smokeDepthFt <= 0) warnings.push("Smoke layer depth is zero or negative; plugholing cannot be evaluated.");
  if (!inletGeometryPass) warnings.push("Smoke depth to equivalent inlet diameter ratio must be greater than 2 for the rectangular inlet plugholing basis.");
  if (!flowPlugholingPass) warnings.push("Selected exhaust inlet count does not pass the prototype plugholing flow check.");
  if (!makeupVelocityPass) warnings.push("Makeup air velocity exceeds the selected criterion.");
  if (!Number.isFinite(pressurePa)) {
    warnings.push("Pressure differential cannot be evaluated until leakage area and flow coefficient are valid.");
  } else if (!pressurePass && !pressurePossibleWithSelectedExhaust) {
    warnings.push(
      "Selected exhaust cannot reach the pressure target with the current leakage area, even with makeup reduced to zero.",
    );
  } else if (!pressurePass) {
    warnings.push(
      `Calculated pressure differential is below target; makeup ratio must be ${fmt(maxMakeupRatioForPressure, 2)} or lower with the current leakage area.`,
    );
  }

  const variables = [
    ["Qbasis", "Design fire preset", firePreset.name, "-", "User selection", firePreset.applicability],
    ["Qsrc", "Design fire evidence source", firePreset.sourceName, "-", "Reference", firePreset.limitations],
    ["Q", "Design heat release rate", whole(Q), "kW", "Preset/user input", scenario.designFireBasis],
    ["chi_c", "Convective fraction", fmt(chi, 2), "-", "User input/default", "Confirm for selected design fire."],
    ["Qc", "Convective heat release rate", whole(Qc), "kW", "Calculated", "Formula F-001."],
    ["To", "Ambient temperature", fmt(scenario.ambientTempC, 1), "deg C", "User input", "Used for smoke density and plugholing."],
    ["H", "Room height", fmt(scenario.roomHeightFt, 1), "ft", "User input", "Ceiling assumed exhaust inlet elevation."],
    ["z", "Fire base to smoke interface", fmt(scenario.smokeInterfaceFt, 1), "ft", "User input", "Converted to SI for plume equations."],
    ["d", "Smoke layer depth below inlet", fmt(smokeDepthFt, 1), "ft", "Calculated", "Room height minus interface height."],
    ["a", "Exhaust inlet length", fmt(scenario.exhaustInletLengthIn, 1), "in", "User input", "Used for rectangular inlet equivalent diameter."],
    ["b", "Exhaust inlet width", fmt(scenario.exhaustInletWidthIn, 1), "in", "User input", "Used for rectangular inlet equivalent diameter."],
    ["Di", "Equivalent inlet diameter", fmt(equivalentInletDiameterFt, 2), "ft", "Calculated", "Formula F-008A."],
    ["d/Di", "Smoke depth to inlet diameter ratio", fmt(smokeDepthToDiameterRatio, 2), "-", "Calculated", "Must be greater than 2 for plugholing equation basis."],
    ["zl", "Limiting elevation", fmt(zl, 2), "m", "Calculated", "Formula F-002."],
    ["m", "Plume mass flow", fmt(massFlowKgs, 2), "kg/s", "Calculated", useUpperPlume ? "Formula F-003." : "Formula F-004."],
    ["Ts", "Smoke layer temperature", fmt(smokeTempC, 1), "deg C", "Calculated", "Formula F-005, K = 1.0."],
    ["rho", "Smoke density", fmt(smokeDensity, 3), "kg/m3", "Calculated", "Formula F-006."],
    ["V", "Required exhaust", whole(requiredCfm), "cfm", "Calculated", "Formula F-007."],
    ["Vsel", "Selected/design exhaust", whole(selectedCfm), "cfm", "Calculated", `${fmt(scenario.exhaustMarginPercent, 1)}% margin.`],
    ["gamma", "Exhaust location factor", fmt(scenario.exhaustLocationFactor, 2), "-", "User input", "1.0 centered ceiling inlet; 0.5 wall/near-wall inlet."],
    ["Vmax", "Plugholing limit per inlet", whole(vmaxCfm), "cfm", "Calculated", "Formula F-008."],
    ["Vmu", "Makeup air flow", whole(makeupCfm), "cfm", "Calculated", "Selected ratio times exhaust."],
    ["Afv", "Makeup free area", fmt(scenario.makeupFreeAreaFt2, 1), "ft2", "User input", "Formula F-010."],
    ["Vimb", "Exhaust-minus-makeup imbalance", whole(imbalanceCfm), "cfm", "Calculated", "Used for pressure target check."],
    ["DeltaP", "Pressure differential estimate", fmt(pressurePa, 1), "Pa", "Calculated", "Formula F-011."],
    ["Vtarget", "Imbalance required for target pressure", whole(requiredImbalanceCfm), "cfm", "Calculated", "Formula F-012."],
    [
      "Rmu,max",
      "Maximum makeup ratio for target",
      pressurePossibleWithSelectedExhaust ? fmt(maxMakeupRatioForPressure, 2) : "Not possible",
      "Vmu/Vsel",
      "Calculated",
      "Formula F-012.",
    ],
    ["Amax", "Maximum leakage area for target", fmt(maxLeakageFt2ForPressure, 1), "ft2", "Calculated", "Formula F-012."],
  ].map(([symbol, description, value, unit, source, note]) => ({ symbol, description, value, unit, source, note }));

  const trace = [
    {
      id: "0",
      purpose: "Select design fire basis.",
      formulaId: "DF-001",
      symbolic: "Q = selected preset HRR or equivalent steady HRR",
      substitution: `${firePreset.name}; Q = ${whole(Q)} kW`,
      result: `Design fire basis = ${scenario.designFireBasis}`,
      use: `${firePreset.applicability} Limitation: ${firePreset.limitations}`,
    },
    {
      id: "1",
      purpose: "Calculate convective heat release rate.",
      formulaId: "F-001",
      symbolic: "Qc = chi_c * Q",
      substitution: `Qc = ${fmt(chi, 2)} * ${whole(Q)} kW`,
      result: `Qc = ${whole(Qc)} kW`,
      use: "Used in plume mass flow and smoke temperature equations.",
    },
    {
      id: "2",
      purpose: "Calculate limiting elevation.",
      formulaId: "F-002",
      symbolic: "zl = 0.166 * Qc^(2/5)",
      substitution: `zl = 0.166 * ${whole(Qc)}^(2/5)`,
      result: `zl = ${fmt(zl, 2)} m`,
      use: `The selected z is ${fmt(interfaceM, 2)} m, so ${useUpperPlume ? "F-003" : "F-004"} is used.`,
    },
    {
      id: "3",
      purpose: "Calculate plume mass flow.",
      formulaId: useUpperPlume ? "F-003" : "F-004",
      symbolic: useUpperPlume
        ? "m = 0.071 * Qc^(1/3) * z^(5/3) + 0.0018 * Qc"
        : "m = 0.032 * Qc^(3/5) * z",
      substitution: useUpperPlume
        ? `m = 0.071 * ${whole(Qc)}^(1/3) * ${fmt(interfaceM, 2)}^(5/3) + 0.0018 * ${whole(Qc)}`
        : `m = 0.032 * ${whole(Qc)}^(3/5) * ${fmt(interfaceM, 2)}`,
      result: `m = ${fmt(massFlowKgs, 2)} kg/s`,
      use: "Mass flow is used to determine smoke layer temperature and exhaust volume.",
    },
    {
      id: "4",
      purpose: "Calculate smoke layer temperature for exhaust sizing.",
      formulaId: "F-005",
      symbolic: "Ts = To + (K * Qc) / (m * cp)",
      substitution: `Ts = ${fmt(scenario.ambientTempC, 1)} + (1.0 * ${whole(Qc)}) / (${fmt(massFlowKgs, 2)} * 1.0)`,
      result: `Ts = ${fmt(smokeTempC, 1)} deg C`,
      use: "Temperature is used for smoke density.",
    },
    {
      id: "5",
      purpose: "Calculate smoke density.",
      formulaId: "F-006",
      symbolic: "rho = patm / (R * Ts)",
      substitution: `rho = 101300 / (287 * ${fmt(smokeTempK, 1)})`,
      result: `rho = ${fmt(smokeDensity, 3)} kg/m3`,
      use: "Density converts mass exhaust to volumetric exhaust.",
    },
    {
      id: "6",
      purpose: "Calculate required exhaust volume.",
      formulaId: "F-007",
      symbolic: "V = m / rho",
      substitution: `V = ${fmt(massFlowKgs, 2)} / ${fmt(smokeDensity, 3)}`,
      result: `V = ${fmt(requiredM3s, 2)} m3/s = ${whole(requiredCfm)} cfm`,
      use: "Required exhaust is the basis for selected/design exhaust.",
    },
    {
      id: "7",
      purpose: "Check rectangular exhaust inlet geometry basis.",
      formulaId: "F-008A",
      symbolic: "Di = 2ab / (a + b); ratio = d / Di",
      substitution: `Di = 2 * ${fmt(exhaustInletLengthFt, 2)} * ${fmt(exhaustInletWidthFt, 2)} / (${fmt(exhaustInletLengthFt, 2)} + ${fmt(exhaustInletWidthFt, 2)}); ratio = ${fmt(smokeDepthFt, 1)} / ${fmt(equivalentInletDiameterFt, 2)}`,
      result: `Di = ${fmt(equivalentInletDiameterFt, 2)} ft; d/Di = ${fmt(smokeDepthToDiameterRatio, 2)}`,
      use: inletGeometryPass ? "Rectangular inlet ratio check passes." : "Increase smoke layer depth or reduce inlet equivalent diameter before relying on the plugholing equation.",
    },
    {
      id: "8",
      purpose: "Check plugholing limit per exhaust inlet.",
      formulaId: "F-008",
      symbolic: "Vmax = 4.16 * gamma * d^(5/2) * ((Ts - To) / To)^(1/2)",
      substitution: `Vmax = 4.16 * ${fmt(scenario.exhaustLocationFactor, 2)} * ${fmt(smokeDepthM, 2)}^(5/2) * ratio^(1/2)`,
      result: `Vmax = ${whole(vmaxCfm)} cfm per inlet; selected = ${whole(flowPerInletCfm)} cfm per inlet`,
      use: flowPlugholingPass ? "Plugholing flow check passes." : "Increase inlet count or smoke layer depth.",
    },
    {
      id: "9",
      purpose: "Calculate minimum inlet separation.",
      formulaId: "F-009",
      symbolic: "Smin = 0.9 * Ve^(1/2)",
      substitution: `Smin = 0.9 * ${fmt(flowPerInletM3s, 2)}^(1/2)`,
      result: `Smin = ${fmt(inletSeparationFt, 1)} ft`,
      use: "Used for exhaust inlet layout review.",
    },
    {
      id: "10",
      purpose: "Calculate makeup air velocity.",
      formulaId: "F-010",
      symbolic: "Umu = Vmu / Afv",
      substitution: `Umu = ${whole(makeupCfm)} cfm / ${fmt(scenario.makeupFreeAreaFt2, 1)} ft2`,
      result: `Umu = ${fmt(makeupVelocityFpm, 1)} fpm`,
      use: makeupVelocityPass ? "Makeup velocity check passes." : "Increase free area or reduce makeup flow.",
    },
    {
      id: "11",
      purpose: "Estimate pressure differential from exhaust imbalance.",
      formulaId: "F-011",
      symbolic: "DeltaP = rho * (V / (C * A))^2 / 2",
      substitution: `DeltaP = ${fmt(PRESSURE_AIR_DENSITY, 1)} * (${fmt(imbalanceM3s, 2)} / (${fmt(scenario.flowCoefficient, 2)} * ${fmt(leakageM2, 2)}))^2 / 2`,
      result: `DeltaP = ${fmt(pressurePa, 1)} Pa (${fmt(pressureInWg, 3)} in. w.g.)`,
      use: pressurePass ? "Pressure target passes." : "Adjust makeup ratio, leakage area, or exhaust balance.",
    },
    {
      id: "12",
      purpose: "Solve target-pressure helper values.",
      formulaId: "F-012",
      symbolic: "Vtarget = C * A * (2 * DeltaPtarget / rho)^(1/2); Rmu,max = (Vsel - Vtarget) / Vsel; Amax = Vimb / (C * (2 * DeltaPtarget / rho)^(1/2))",
      substitution: `Vtarget = ${fmt(scenario.flowCoefficient, 2)} * ${fmt(leakageM2, 2)} * sqrt(2 * ${fmt(scenario.targetPressurePa, 1)} / ${fmt(PRESSURE_AIR_DENSITY, 1)})`,
      result: `Required imbalance = ${whole(requiredImbalanceCfm)} cfm; max makeup ratio = ${
        pressurePossibleWithSelectedExhaust ? fmt(maxMakeupRatioForPressure, 2) : "not possible"
      }; max leakage area = ${fmt(maxLeakageFt2ForPressure, 1)} ft2`,
      use: pressurePass
        ? "Current pressure target passes."
        : "Use these values to adjust makeup ratio, selected exhaust, or leakage assumptions.",
    },
  ];

  const compliance = [
    ["Design fire basis documented", firePreset.sourceName, firePreset.hrrKw === null ? "Project-specific" : "Cited", firePreset.evidence],
    [
      "Reviewer basis documented",
      "Submittal-quality review gate",
      dataQualityForScenario(scenario).status,
      "Predictive answers must be engineer-reviewed or AHJ/insurer accepted and include source/page/test evidence before submittal.",
    ],
    ["Smoke exhaust path selected", "TSFPEWG Chapters 2 through 6", "Evaluated", "Decision path steps 1 through 4."],
    ["Exhaust sized to smoke layer objective", "TSFPEWG 2-13.2 and NFPA 92 reference", requiredCfm > 0 ? "Calculated" : "Not evaluated", "Trace steps 1 through 6."],
    ["Makeup air less than exhaust", "TSFPEWG 2-13.2", makeupCfm < selectedCfm ? "Pass" : "Fail", `Makeup ratio = ${fmt(scenario.makeupRatio, 2)}.`],
    [
      "Pressure differential target",
      "TSFPEWG 2-13.2 reference to 12 Pa / 0.05 in. w.g.",
      pressurePass ? "Pass" : "Fail",
      `Calculated DeltaP = ${fmt(pressurePa, 1)} Pa; required imbalance = ${whole(requiredImbalanceCfm)} cfm; max makeup ratio = ${
        pressurePossibleWithSelectedExhaust ? fmt(maxMakeupRatioForPressure, 2) : "not possible"
      }.`,
    ],
    [
      "Plugholing inlet geometry",
      "NFPA 92 (2024) 5.6.7 and 5.6.8",
      inletGeometryPass ? "Pass" : "Fail",
      `Equivalent diameter = ${fmt(equivalentInletDiameterFt, 2)} ft; d/Di = ${fmt(smokeDepthToDiameterRatio, 2)}.`,
    ],
    [
      "Plugholing flow check",
      "Handbook Ch. 16 Eq. 16.25",
      flowPlugholingPass ? "Pass" : "Fail",
      `Required inlets = ${Number.isFinite(requiredInlets) ? requiredInlets : "Needs input"}; selected inlets = ${selectedInletCount}.`,
    ],
  ].map(([item, source, status, evidence]) => ({ item, source, status, evidence }));

  return {
    decisionPath: decisionPath(scenario),
    designFire: firePreset,
    variables,
    trace,
    compliance,
    warnings,
    outputs: {
      Qc,
      massFlowKgs,
      smokeTempC,
      smokeDensity,
      requiredCfm,
      selectedCfm,
      makeupCfm,
      makeupVelocityFpm,
      imbalanceCfm,
      pressurePa,
      pressureInWg,
      requiredImbalanceCfm,
      maxMakeupCfmForPressure,
      maxMakeupRatioForPressure,
      pressurePossibleWithSelectedExhaust,
      maxLeakageFt2ForPressure,
      requiredInlets,
      flowPerInletCfm,
      vmaxCfm,
      flowPlugholingPass,
      inletGeometryPass,
      equivalentInletDiameterFt,
      equivalentInletDiameterM,
      smokeDepthToDiameterRatio,
      plugholingPass,
      makeupVelocityPass,
      pressurePass,
      smokeDepthFt,
      inletSeparationFt,
    },
  };
}

function changedFields(active, compare) {
  const labels = {
    missionClass: "Mission",
    macCategory: "MAC",
    facilityType: "Facility",
    operationMode: "Operation",
    cleanAgent: "Clean agent",
    directExteriorDoor: "Exterior door",
    designFirePresetId: "Design fire preset",
    designFireBasis: "Design fire basis",
    hrrKw: "HRR",
    convectiveFraction: "Convective fraction",
    ambientTempC: "Ambient temp",
    roomLengthFt: "Length",
    roomWidthFt: "Width",
    roomHeightFt: "Height",
    smokeInterfaceFt: "Interface",
    makeupRatio: "Makeup ratio",
    makeupFreeAreaFt2: "Makeup area",
    leakageAreaFt2: "Leakage area",
    flowCoefficient: "Flow coefficient",
    exhaustLocationFactor: "Exhaust location",
    selectedInletCount: "Inlet count",
    exhaustInletLengthIn: "Inlet length",
    exhaustInletWidthIn: "Inlet width",
    exhaustMarginPercent: "Exhaust margin",
    targetPressurePa: "Pressure target",
    maxMakeupVelocityFpm: "Makeup velocity limit",
  };
  return Object.entries(labels)
    .filter(([key]) => active[key] !== compare[key])
    .map(([key, label]) => ({ label, from: compare[key], to: active[key] }));
}

function renderTable(headers, rows) {
  return `
    <table>
      <thead><tr>${headers.map((header) => `<th>${html(header)}</th>`).join("")}</tr></thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

function renderScenarioList(active) {
  document.getElementById("scenarioList").innerHTML = scenarios
    .map(
      (scenario) => {
        const quality = dataQualityForScenario(scenario, calculate(scenario));
        return `
        <button type="button" class="scenarioButton ${scenario.id === active.id ? "active" : ""} ${quality.status.toLowerCase()}" data-scenario="${html(scenario.id)}">
          <span>${html(scenario.name)}</span>
          <b>Rev ${scenario.revision} · ${html(quality.status)}${quality.issues.length ? ` ${quality.issues.length}` : ""}</b>
        </button>
      `;
      },
    )
    .join("");
}

function renderOptions(options, selected) {
  return options
    .map((option) => `<option value="${html(option)}" ${selected === option ? "selected" : ""}>${html(option)}</option>`)
    .join("");
}

function renderReviewerBasisInputs(active) {
  return `
    <div class="auditBasisList">
      ${reviewerBasisDefinitions
        .map((definition) => {
          const audit = reviewerAuditFor(active, definition.field);
          return `
            <article class="auditBasisItem">
              <div class="auditBasisHeader">
                <div>
                  <b>${html(definition.label)}</b>
                  <span>${html(definition.category)}</span>
                </div>
                <select data-audit-field="${html(definition.field)}" data-audit-prop="status">
                  ${renderOptions(reviewerAuditStatuses, audit.status)}
                </select>
              </div>
              <label class="field">
                <span>Answer</span>
                <textarea data-field="${html(definition.field)}" rows="3">${html(active[definition.field] || "")}</textarea>
              </label>
              <div class="auditMetaGrid">
                <label class="field">
                  <span>Source type</span>
                  <select data-audit-field="${html(definition.field)}" data-audit-prop="sourceType">
                    ${renderOptions(reviewerAuditSourceTypes, audit.sourceType)}
                  </select>
                </label>
                <label class="field">
                  <span>Source / page / test ID</span>
                  <input type="text" data-audit-field="${html(definition.field)}" data-audit-prop="sourceRef" value="${html(audit.sourceRef || "")}" />
                </label>
                <label class="field">
                  <span>Evidence ID / link</span>
                  <input type="text" data-audit-field="${html(definition.field)}" data-audit-prop="evidenceId" value="${html(audit.evidenceId || "")}" />
                </label>
                <label class="field">
                  <span>Confidence</span>
                  <select data-audit-field="${html(definition.field)}" data-audit-prop="confidence">
                    ${renderOptions(reviewerAuditConfidence, audit.confidence)}
                  </select>
                </label>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderInputs(active) {
  const inputGroups = appMode === "excel" ? excelFields : fields;
  document.getElementById("inputs").innerHTML = inputGroups
    .map(
      (group) => `
        <div class="fieldGroup">
          <h3>${html(group.title)}</h3>
          ${group.controls
            .map((control) => {
              if (control.type === "reviewerBasis") {
                return renderReviewerBasisInputs(active);
              }
              if (control.type === "firePreset") {
                const preset = designFirePresetFor(active);
                return `
                  <label class="field firePresetField">
                    <span>${html(control.label)}</span>
                    <select data-fire-preset="${html(control.field)}">
                      ${designFirePresets
                        .map(
                          (option) =>
                            `<option value="${html(option.id)}" ${active[control.field] === option.id ? "selected" : ""}>${html(option.name)}</option>`,
                        )
                        .join("")}
                    </select>
                  </label>
                  <div class="firePresetNote">
                    <div>
                      <b>${html(preset.shortName)}</b>
                      <span>${preset.hrrKw === null ? "User HRR required" : `${whole(preset.hrrKw)} kW preset`}</span>
                    </div>
                    <p>${html(preset.evidence)}</p>
                    <small>${html(preset.applicability)}</small>
                  </div>
                `;
              }
              if (control.type === "select") {
                return `
                  <label class="field">
                    <span>${html(control.label)}</span>
                    <select data-field="${html(control.field)}">
                      ${control.options
                        .map(
                          (option) =>
                            `<option value="${html(option)}" ${active[control.field] === option ? "selected" : ""}>${html(option)}</option>`,
                        )
                        .join("")}
                    </select>
                  </label>
                `;
              }
              if (control.type === "textarea") {
                return `
                  <label class="field">
                    <span>${html(control.label)}</span>
                    <textarea data-field="${html(control.field)}" rows="3">${html(active[control.field] || "")}</textarea>
                  </label>
                `;
              }
              if (control.type === "toggle") {
                return `
                  <label class="toggleField">
                    <span>${html(control.label)}</span>
                    <button type="button" class="toggle ${active[control.field] ? "on" : ""}" data-toggle="${html(control.field)}" aria-pressed="${active[control.field]}">
                      ${active[control.field] ? "Yes" : "No"}
                    </button>
                  </label>
                `;
              }
              return `
                <label class="field">
                  <span>${html(control.label)}</span>
                  <div class="inputWrap">
                    <input type="number" data-field="${html(control.field)}" value="${active[control.field]}" ${control.min !== undefined ? `min="${control.min}"` : ""} step="${control.step || 1}" />
                    <b>${html(control.unit)}</b>
                  </div>
                </label>
              `;
            })
            .join("")}
        </div>
      `,
    )
    .join("");
}

function renderCalculationView(active, baseline, calc, baselineCalc) {
  const activePreset = designFirePresetFor(active);
  const baselinePreset = designFirePresetFor(baseline);
  const quality = dataQualityForScenario(active, calc);
  const smokePct = Math.min(
    100,
    Math.max(0, (calc.outputs.smokeDepthFt / Math.max(active.roomHeightFt, 1)) * 100),
  );
  const rows = [
    ["Design fire preset", html(baselinePreset.shortName), html(activePreset.shortName)],
    ["Design fire basis", html(baseline.designFireBasis), html(active.designFireBasis)],
    ["HRR", `${whole(baseline.hrrKw)} kW`, `${whole(active.hrrKw)} kW`],
    ["Required exhaust", `${whole(baselineCalc.outputs.requiredCfm)} cfm`, `${whole(calc.outputs.requiredCfm)} cfm`],
    ["Makeup velocity", `${fmt(baselineCalc.outputs.makeupVelocityFpm, 1)} fpm`, `${fmt(calc.outputs.makeupVelocityFpm, 1)} fpm`],
    ["Pressure", `${fmt(baselineCalc.outputs.pressurePa, 1)} Pa`, `${fmt(calc.outputs.pressurePa, 1)} Pa`],
    ["Inlet equivalent diameter", `${fmt(baselineCalc.outputs.equivalentInletDiameterFt, 2)} ft`, `${fmt(calc.outputs.equivalentInletDiameterFt, 2)} ft`],
    ["Smoke depth / inlet diameter", fmt(baselineCalc.outputs.smokeDepthToDiameterRatio, 2), fmt(calc.outputs.smokeDepthToDiameterRatio, 2)],
    ["Plugholing", baselineCalc.outputs.plugholingPass ? "Pass" : "Fail", calc.outputs.plugholingPass ? "Pass" : "Fail"],
  ];
  const changes = changedFields(active, baseline);
  document.getElementById("calculationView").innerHTML = `
    <div class="roomVisual" aria-label="Smoke layer diagram">
      <div class="roomBox">
        <div class="smokeLayer" style="height:${smokePct}%"></div>
        <div class="exhaustArrow">Exhaust</div>
        <div class="makeupArrow">Makeup</div>
        <div class="interfaceLine">Interface ${fmt(active.smokeInterfaceFt, 1)} ft</div>
      </div>
      <div class="visualStats">
        <span>Layer depth</span>
        <strong>${fmt(calc.outputs.smokeDepthFt, 1)} ft</strong>
        <span>Smoke temp</span>
        <strong>${fmt(calc.outputs.smokeTempC, 1)} deg C</strong>
        <span>Min inlet spacing</span>
        <strong>${fmt(calc.outputs.inletSeparationFt, 1)} ft</strong>
        <span>Inlet diameter</span>
        <strong>${fmt(calc.outputs.equivalentInletDiameterFt, 2)} ft</strong>
        <span>d / Di</span>
        <strong>${fmt(calc.outputs.smokeDepthToDiameterRatio, 2)}</strong>
      </div>
    </div>
    <div class="statusGrid">
      <div class="status ${calc.outputs.plugholingPass ? "pass" : "fail"}"><span>Plugholing</span><b>${calc.outputs.plugholingPass ? "Pass" : "Fail"}</b></div>
      <div class="status ${calc.outputs.makeupVelocityPass ? "pass" : "fail"}"><span>Makeup velocity</span><b>${calc.outputs.makeupVelocityPass ? "Pass" : "Fail"}</b></div>
      <div class="status ${calc.outputs.pressurePass ? "pass" : "fail"}"><span>Pressure target</span><b>${calc.outputs.pressurePass ? "Pass" : "Fail"}</b></div>
    </div>
    <section class="subsection dataQuality">
      <div class="sectionTitleRow">
        <h3>Data Quality</h3>
        <span class="${quality.status.toLowerCase()}">${html(quality.status)}</span>
      </div>
      ${
        quality.issues.length === 0
          ? '<p class="mutedLine">No data-quality issues found.</p>'
          : `<ul class="qualityList">${quality.issues
              .map(
                (item) => `
                  <li class="${html(item.severity)}">
                    <b>${html(item.field)}</b>
                    <span>${html(item.message)}</span>
                  </li>
                `,
              )
              .join("")}</ul>`
      }
    </section>
    <section class="subsection pressureHelper">
      <div class="sectionTitleRow">
        <h3>Pressure Helper</h3>
        <span>${fmt(active.targetPressurePa, 1)} Pa target</span>
      </div>
      <div class="helperGrid">
        <div>
          <span>Current imbalance</span>
          <b>${whole(calc.outputs.imbalanceCfm)} cfm</b>
        </div>
        <div>
          <span>Needed imbalance</span>
          <b>${whole(calc.outputs.requiredImbalanceCfm)} cfm</b>
        </div>
        <div>
          <span>Max makeup ratio</span>
          <b>${html(pressureMakeupRatioLabel(calc))}</b>
        </div>
        <div>
          <span>Max leakage area</span>
          <b>${fmt(calc.outputs.maxLeakageFt2ForPressure, 1)} ft2</b>
        </div>
      </div>
      <p class="helperNote">${html(pressureHelperMessage(calc))}</p>
    </section>
    <section class="subsection">
      <h3>Comparison</h3>
      ${renderTable(["Item", baseline.name, active.name], rows)}
    </section>
    <section class="subsection">
      <h3>Changed Values</h3>
      ${
        changes.length === 0
          ? '<p class="mutedLine">No changed values against the comparison scenario.</p>'
          : `<div class="changeList">${changes
              .slice(0, 12)
              .map(
                (change) => `
                  <div>
                    <b>${html(change.label)}</b>
                    <span>${html(change.from)} to ${html(change.to)}</span>
                  </div>
                `,
              )
              .join("")}</div>`
      }
    </section>
    <section class="subsection">
      <h3>Warnings</h3>
      <ul class="warningList">${calc.warnings.map((warning) => `<li>${html(warning)}</li>`).join("")}</ul>
    </section>
  `;
}

function renderSheetStatus(pass) {
  return `<span class="sheetStatus ${pass ? "pass" : "fail"}">${pass ? "Pass" : "Fail"}</span>`;
}

function renderExcelMode(active, calc) {
  const fire = calc.designFire;
  const quality = dataQualityForScenario(active, calc);
  const prioritizedQualityIssues = [
    ...quality.issues.filter((item) => item.severity === "error"),
    ...quality.issues.filter((item) => item.severity !== "error"),
  ];
  const qualityRows =
    quality.issues.length === 0
      ? [["Status", "Ready", "No data-quality issues found."]]
      : prioritizedQualityIssues
          .slice(0, 10)
          .map((item) => [html(item.severity), html(item.field), html(item.message)]);
  const coreInputRows = [
    ["Q", "Design fire HRR", `${whole(active.hrrKw)} kW`, "Fire input"],
    ["chi_c", "Convective fraction", fmt(active.convectiveFraction, 2), "Fire input"],
    ["Qc", "Convective HRR", `${whole(calc.outputs.Qc)} kW`, "Qc = chi_c * Q"],
    ["H", "Ceiling / exhaust height", `${fmt(active.roomHeightFt, 1)} ft`, "Room input"],
    ["z", "Smoke interface height", `${fmt(active.smokeInterfaceFt, 1)} ft`, "Room input"],
    ["d", "Smoke depth below inlet", `${fmt(calc.outputs.smokeDepthFt, 1)} ft`, "H - z"],
    ["To", "Ambient temperature", `${fmt(active.ambientTempC, 1)} deg C`, "Fire input"],
    ["a", "Rectangular inlet length", `${fmt(active.exhaustInletLengthIn, 1)} in`, "Inlet input"],
    ["b", "Rectangular inlet width", `${fmt(active.exhaustInletWidthIn, 1)} in`, "Inlet input"],
    ["Di", "Equivalent inlet diameter", `${fmt(calc.outputs.equivalentInletDiameterFt, 2)} ft`, "2ab / (a + b)"],
    ["gamma", "Exhaust location factor", fmt(active.exhaustLocationFactor, 2), "Inlet input"],
    ["N", "Selected exhaust points", String(Math.max(1, active.selectedInletCount)), "Inlet input"],
  ].map((row) => row.map(html));

  const outputRows = [
    ["Required exhaust", `${whole(calc.outputs.requiredCfm)} cfm`, "From plume mass flow and smoke density"],
    ["Selected exhaust", `${whole(calc.outputs.selectedCfm)} cfm`, "Required exhaust plus margin"],
    ["Flow per exhaust point", `${whole(calc.outputs.flowPerInletCfm)} cfm`, "Selected exhaust / N"],
    ["Plugholing limit per point", `${whole(calc.outputs.vmaxCfm)} cfm`, "Handbook Ch. 16 Eq. 16.25"],
    ["Required exhaust points", Number.isFinite(calc.outputs.requiredInlets) ? String(calc.outputs.requiredInlets) : "Needs input", "Ceiling of selected exhaust / plugholing limit"],
    ["Minimum point spacing", `${fmt(calc.outputs.inletSeparationFt, 1)} ft`, "Handbook Ch. 16 Eq. 16.27"],
  ].map((row) => row.map(html));

  const checkRows = [
    [
      "Smoke interface below ceiling",
      "z < H",
      `${fmt(active.smokeInterfaceFt, 1)} ft < ${fmt(active.roomHeightFt, 1)} ft`,
      renderSheetStatus(active.smokeInterfaceFt < active.roomHeightFt),
    ],
    [
      "Rectangular inlet basis",
      "d / Di > 2",
      `${fmt(calc.outputs.smokeDepthFt, 1)} / ${fmt(calc.outputs.equivalentInletDiameterFt, 2)} = ${fmt(calc.outputs.smokeDepthToDiameterRatio, 2)}`,
      renderSheetStatus(calc.outputs.inletGeometryPass),
    ],
    [
      "Plugholing flow",
      "Flow per point <= Vmax",
      `${whole(calc.outputs.flowPerInletCfm)} cfm <= ${whole(calc.outputs.vmaxCfm)} cfm`,
      renderSheetStatus(calc.outputs.flowPlugholingPass),
    ],
    [
      "Selected exhaust points",
      "N >= required points",
      `${Math.max(1, active.selectedInletCount)} >= ${
        Number.isFinite(calc.outputs.requiredInlets) ? calc.outputs.requiredInlets : "Needs input"
      }`,
      renderSheetStatus(calc.outputs.flowPlugholingPass),
    ],
    [
      "Overall plugholing",
      "Geometry and flow pass",
      `${calc.outputs.inletGeometryPass ? "Geometry pass" : "Geometry fail"}; ${
        calc.outputs.flowPlugholingPass ? "flow pass" : "flow fail"
      }`,
      renderSheetStatus(calc.outputs.plugholingPass),
    ],
  ];

  const formulaRows = calc.trace
    .filter((step) => Number(step.id) <= 9)
    .map((step) => [
      html(step.formulaId),
      html(step.purpose),
      `<code>${html(step.symbolic)}</code>`,
      html(step.substitution),
      `<strong>${html(step.result)}</strong>`,
    ]);

  const appAddedRows = [
    ["Makeup airflow", `${whole(calc.outputs.makeupCfm)} cfm`, `Ratio = ${fmt(active.makeupRatio, 2)}`],
    [
      "Makeup velocity",
      `${fmt(calc.outputs.makeupVelocityFpm, 1)} fpm`,
      `${calc.outputs.makeupVelocityPass ? "Pass" : "Fail"} vs ${fmt(active.maxMakeupVelocityFpm, 1)} fpm limit`,
    ],
    ["Pressure estimate", `${fmt(calc.outputs.pressurePa, 1)} Pa`, calc.outputs.pressurePass ? "Pass" : "Fail"],
    ["Required imbalance", `${whole(calc.outputs.requiredImbalanceCfm)} cfm`, "For pressure target"],
    ["Max makeup ratio", pressureMakeupRatioLabel(calc), "For pressure target"],
  ].map((row) => row.map(html));

  const summaryCards = [
    ["Required exhaust", `${whole(calc.outputs.requiredCfm)} cfm`],
    ["Required points", Number.isFinite(calc.outputs.requiredInlets) ? String(calc.outputs.requiredInlets) : "Needs input"],
    ["d / Di", fmt(calc.outputs.smokeDepthToDiameterRatio, 2)],
    ["Plugholing", calc.outputs.plugholingPass ? "Pass" : "Fail"],
  ];

  document.getElementById("excelMode").innerHTML = `
    <section class="excelSheet">
      <div class="excelTitle">
        <div>
          <h3>${html(active.name)}</h3>
          <span>${html(fire.shortName)}</span>
        </div>
        <strong>Rev ${html(active.revision)}</strong>
      </div>
      <div class="excelSummaryGrid">
        ${summaryCards
          .map(
            ([label, value]) => `
              <div>
                <span>${html(label)}</span>
                <b>${html(value)}</b>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="sheetSection dataQualitySheet">
        <div class="sectionTitleRow">
          <h3>Data Quality</h3>
          <span class="${quality.status.toLowerCase()}">${html(quality.status)}</span>
        </div>
        ${renderTable(["Severity", "Field", "Message"], qualityRows)}
      </div>
      <div class="sheetSection">
        <h3>Input Cells</h3>
        ${renderTable(["Symbol", "Description", "Value", "Basis"], coreInputRows)}
      </div>
      <div class="sheetSection">
        <h3>Output Cells</h3>
        ${renderTable(["Item", "Value", "Basis"], outputRows)}
      </div>
      <div class="sheetSection">
        <h3>Pass / Fail Cells</h3>
        ${renderTable(["Check", "Criterion", "Substitution", "Status"], checkRows)}
      </div>
      <div class="sheetSection">
        <h3>Formula Path</h3>
        ${renderTable(["ID", "Purpose", "Formula", "Substitution", "Result"], formulaRows)}
      </div>
      <div class="sheetSection appAddedSheet">
        <h3>App Added Checks</h3>
        ${renderTable(["Item", "Value", "Basis"], appAddedRows)}
      </div>
    </section>
  `;
}

function sourceLinkCell(preset) {
  if (!preset.sourceUrl) return html(preset.sourceName);
  return `<a href="${html(preset.sourceUrl)}" target="_blank" rel="noopener">${html(preset.sourceName)}</a>`;
}

function renderReport(active, calc) {
  const fire = calc.designFire;
  const quality = dataQualityForScenario(active, calc);
  const traceability = traceabilityForScenario(active, calc, quality);
  const readiness = submittalReadinessForScenario(active, calc, quality);
  const sourceRows = [
    ["App version", html(APP_VERSION)],
    ["Calculation engine", html(CALC_ENGINE_VERSION)],
    ["Scenario schema", `v${SCENARIO_SCHEMA_VERSION}`],
    ["Source documents", html(SOURCE_DOCUMENTS.map((item) => `${item.id} (${item.date})`).join("; "))],
    ["Report status", html(readiness.status)],
  ];
  const fireRows = [
    ["Preset", html(fire.name)],
    ["Scenario HRR", `${whole(active.hrrKw)} kW`],
    ["Project basis", html(active.designFireBasis)],
    ["Evidence", html(fire.evidence)],
    ["Applicability", html(fire.applicability)],
    ["Limitations", html(fire.limitations)],
    ["Source", sourceLinkCell(fire)],
  ];
  const pressureRows = [
    ["Target pressure", `${fmt(active.targetPressurePa, 1)} Pa`],
    ["Calculated pressure", `${fmt(calc.outputs.pressurePa, 1)} Pa`],
    ["Current exhaust-minus-makeup imbalance", `${whole(calc.outputs.imbalanceCfm)} cfm`],
    ["Required imbalance for target", `${whole(calc.outputs.requiredImbalanceCfm)} cfm`],
    ["Maximum makeup ratio for target", html(pressureMakeupRatioLabel(calc))],
    ["Maximum leakage area for target", `${fmt(calc.outputs.maxLeakageFt2ForPressure, 1)} ft2`],
    ["Recommended adjustment", html(pressureHelperMessage(calc))],
  ];
  const plugholingRows = [
    ["Inlet length", `${fmt(active.exhaustInletLengthIn, 1)} in`],
    ["Inlet width", `${fmt(active.exhaustInletWidthIn, 1)} in`],
    ["Equivalent inlet diameter", `${fmt(calc.outputs.equivalentInletDiameterFt, 2)} ft`],
    ["Smoke layer depth below inlet", `${fmt(calc.outputs.smokeDepthFt, 1)} ft`],
    ["Depth / equivalent diameter", fmt(calc.outputs.smokeDepthToDiameterRatio, 2)],
    ["Geometry ratio check", calc.outputs.inletGeometryPass ? "Pass" : "Fail"],
    ["Plugholing limit per inlet", `${whole(calc.outputs.vmaxCfm)} cfm`],
    ["Selected flow per inlet", `${whole(calc.outputs.flowPerInletCfm)} cfm`],
    ["Required inlet count", Number.isFinite(calc.outputs.requiredInlets) ? String(calc.outputs.requiredInlets) : "Needs input"],
    ["Selected inlet count", String(Math.max(1, active.selectedInletCount))],
    ["Minimum inlet separation", `${fmt(calc.outputs.inletSeparationFt, 1)} ft`],
    ["Overall plugholing status", calc.outputs.plugholingPass ? "Pass" : "Fail"],
  ];
  const reviewerRows = reviewerBasisRows(active).map((row) => [
    html(row.item),
    html(row.category),
    html(row.basis || "Missing"),
    html(row.status),
    html(row.sourceType),
    html(row.sourceRef || "Missing"),
    html(row.evidenceId || "Missing"),
    html(row.confidence),
  ]);
  const qualityRows =
    quality.issues.length === 0
      ? [["Status", "Ready", "No data-quality issues found."]]
      : quality.issues.map((item) => [html(item.severity), html(item.field), html(item.message)]);
  const traceabilityRows = traceability.map((row) => [
    html(row.id),
    html(row.section),
    html(row.applies),
    html(row.status),
    html(row.requirement),
    html(row.evidence),
  ]);
  const readinessRows = readiness.rows.map((row) => [
    html(row.item),
    html(row.status),
    html(row.note),
  ]);
  const variableRows = calc.variables.map((row) => [
    html(row.symbol),
    html(row.description),
    html(row.value),
    html(row.unit),
    html(row.source),
    html(row.note),
  ]);
  const formulaRows = formulas.map((row) => [
    html(row.id),
    html(row.name),
    `<code>${html(row.formula)}</code>`,
    html(row.source),
  ]);
  const decisionRows = calc.decisionPath.map((row) => [
    html(row.step),
    html(row.decision),
    html(row.input),
    html(row.criteria),
    html(row.result),
  ]);
  const complianceRows = calc.compliance.map((row) => [
    html(row.item),
    html(row.source),
    html(row.status),
    html(row.evidence),
  ]);
  const reportJson = JSON.stringify(
    {
      scenario: active,
      appVersion: APP_VERSION,
      calculationEngineVersion: CALC_ENGINE_VERSION,
      scenarioSchemaVersion: SCENARIO_SCHEMA_VERSION,
      sourceDocuments: SOURCE_DOCUMENTS,
      decisionPath: calc.decisionPath,
      traceability,
      submittalReadiness: readiness,
      designFire: calc.designFire,
      dataQuality: quality,
      variables: calc.variables,
      formulas,
      trace: calc.trace,
      compliance: calc.compliance,
      warnings: calc.warnings,
      outputs: calc.outputs,
    },
    null,
    2,
  );

  document.getElementById("reportPreview").innerHTML = `
    <section class="reportBlock">
      <h3>Version and Source Control</h3>
      ${renderTable(["Item", "Value"], sourceRows)}
    </section>
    <section class="reportBlock">
      <h3>Decision Path</h3>
      ${renderTable(["Step", "Decision", "Input", "Criteria", "Result"], decisionRows)}
    </section>
    <section class="reportBlock">
      <h3>TSFPEWG Requirement Trace</h3>
      ${renderTable(["ID", "Section", "Applies", "Status", "Requirement", "Evidence / App Response"], traceabilityRows)}
    </section>
    <section class="reportBlock">
      <h3>Submittal Readiness Gate</h3>
      ${renderTable(["Item", "Status", "Note"], readinessRows)}
    </section>
    <section class="reportBlock">
      <h3>Design Fire Basis</h3>
      ${renderTable(["Item", "Value"], fireRows)}
    </section>
    <section class="reportBlock">
      <h3>Pressure Helper</h3>
      ${renderTable(["Item", "Value"], pressureRows)}
    </section>
    <section class="reportBlock">
      <h3>Plugholing and Inlet Geometry</h3>
      ${renderTable(["Item", "Value"], plugholingRows)}
    </section>
    <section class="reportBlock">
      <h3>Reviewer Basis</h3>
      ${renderTable(["Item", "Category", "Basis", "Status", "Source Type", "Source/Page/Test", "Evidence", "Confidence"], reviewerRows)}
    </section>
    <section class="reportBlock">
      <h3>Data Quality</h3>
      ${renderTable(["Severity", "Field", "Message"], qualityRows)}
    </section>
    <section class="reportBlock">
      <h3>Variable Register</h3>
      ${renderTable(["Symbol", "Description", "Value", "Unit", "Source", "Note"], variableRows)}
    </section>
    <section class="reportBlock">
      <h3>Formula Register</h3>
      ${renderTable(["ID", "Name", "Formula", "Source"], formulaRows)}
    </section>
    <section class="reportBlock">
      <h3>Calculation Trace</h3>
      <div class="traceList">
        ${calc.trace
          .map(
            (step) => `
              <article class="traceStep">
                <div><b>Step ${html(step.id)}</b><span>${html(step.formulaId)}</span></div>
                <h4>${html(step.purpose)}</h4>
                <p><code>${html(step.symbolic)}</code></p>
                <p>${html(step.substitution)}</p>
                <strong>${html(step.result)}</strong>
                <small>${html(step.use)}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="reportBlock">
      <h3>Compliance Checklist</h3>
      ${renderTable(["Item", "Source", "Status", "Evidence"], complianceRows)}
    </section>
    <details class="jsonBlock">
      <summary>Raw calculation JSON</summary>
      <pre>${html(reportJson)}</pre>
    </details>
  `;
}

function renderSummary(active, calc) {
  const quality = dataQualityForScenario(active, calc);
  const requiredInlets = Number.isFinite(calc.outputs.requiredInlets)
    ? calc.outputs.requiredInlets
    : "Needs input";
  const items = [
    ["Data quality", quality.status],
    ["Required exhaust", `${whole(calc.outputs.requiredCfm)} cfm`],
    ["Selected exhaust", `${whole(calc.outputs.selectedCfm)} cfm`],
    ["Makeup velocity", `${fmt(calc.outputs.makeupVelocityFpm, 1)} fpm`],
    ["Pressure estimate", `${fmt(calc.outputs.pressurePa, 1)} Pa`],
    ["Needed imbalance", `${whole(calc.outputs.requiredImbalanceCfm)} cfm`],
    ["Inlets required", requiredInlets],
  ];
  document.getElementById("summaryStrip").innerHTML = items
    .map(([label, value]) => `<div><span>${html(label)}</span><strong>${html(value)}</strong></div>`)
    .join("");
}

function versionLabel() {
  return `v${APP_VERSION} · engine ${CALC_ENGINE_VERSION}`;
}

function renderVersionChips() {
  const label = versionLabel();
  const rail = document.getElementById("versionChip");
  const top = document.getElementById("versionChipTop");
  if (rail) rail.textContent = label;
  if (top) top.textContent = label;
}

function schedulePersist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistState, 250);
}

function persistState() {
  try {
    const payload = {
      appVersion: APP_VERSION,
      calcEngineVersion: CALC_ENGINE_VERSION,
      schemaVersion: SCENARIO_SCHEMA_VERSION,
      activeId,
      appMode,
      scenarios,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    lastSaveNote = `Autosaved ${new Date().toLocaleTimeString()}`;
    const el = document.getElementById("saveStatus");
    if (el) el.textContent = lastSaveNote;
  } catch (_) {
    const el = document.getElementById("saveStatus");
    if (el) el.textContent = "Autosave unavailable in this browser.";
  }
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.scenarios) || data.scenarios.length === 0) return false;
    scenarios = data.scenarios.map((scenario) => applyPredictiveReviewerBasis(scenario));
    if (data.activeId && scenarios.some((scenario) => scenario.id === data.activeId)) {
      activeId = data.activeId;
    } else {
      activeId = scenarios[0].id;
    }
    if (data.appMode === "excel" || data.appMode === "standard") {
      appMode = data.appMode;
    }
    lastSaveNote = data.savedAt
      ? `Restored autosave from ${new Date(data.savedAt).toLocaleString()}`
      : "Restored autosaved scenarios.";
    return true;
  } catch (_) {
    return false;
  }
}

function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    /* ignore */
  }
  lastSaveNote = "Local autosave cleared.";
  const el = document.getElementById("saveStatus");
  if (el) el.textContent = lastSaveNote;
}

function render() {
  const active = activeScenario();
  const baseline = baselineScenario(active);
  const calc = calculate(active);
  const baselineCalc = calculate(baseline);

  document.body.dataset.appMode = appMode;
  document.querySelectorAll(".modeSwitch [data-app-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.appMode === appMode);
    button.setAttribute("aria-pressed", String(button.dataset.appMode === appMode));
  });
  renderVersionChips();
  renderScenarioList(active);
  document.getElementById("scenarioName").value = active.name;
  document.getElementById("comparisonNote").innerHTML = `Active design scenario compared with <strong>${html(baseline.name)}</strong>`;
  document.getElementById("deleteScenario").disabled = scenarios.length === 1;
  renderSummary(active, calc);
  renderInputs(active);
  renderCalculationView(active, baseline, calc, baselineCalc);
  renderExcelMode(active, calc);
  renderReport(active, calc);
  schedulePersist();
}

function updateActive(field, value) {
  scenarios = scenarios.map((scenario) =>
    scenario.id === activeId ? { ...scenario, [field]: value, revision: scenario.revision + 1 } : scenario,
  );
  render();
}

function updateActiveAudit(field, prop, value) {
  scenarios = scenarios.map((scenario) => {
    if (scenario.id !== activeId) return scenario;
    const currentAudit = reviewerAuditFor(scenario, field);
    return {
      ...scenario,
      reviewerBasisAudit: {
        ...(scenario.reviewerBasisAudit || {}),
        [field]: {
          ...currentAudit,
          [prop]: value,
        },
      },
      revision: scenario.revision + 1,
    };
  });
  render();
}

function applyDesignFirePreset(presetId) {
  const preset = designFirePresets.find((item) => item.id === presetId);
  if (!preset) return;
  scenarios = scenarios.map((scenario) => {
    if (scenario.id !== activeId) return scenario;
    return applyPredictiveReviewerBasis({
      ...scenario,
      ...reviewerBasisDefaults,
      designFirePresetId: preset.id,
      designFireBasis: preset.basis,
      hrrKw: preset.hrrKw === null ? 0 : preset.hrrKw,
      convectiveFraction: preset.convectiveFraction,
      revision: scenario.revision + 1,
    }, { force: true });
  });
  render();
}

document.getElementById("scenarioList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-scenario]");
  if (!button) return;
  activeId = button.dataset.scenario;
  render();
});

document.getElementById("clearLocalSave")?.addEventListener("click", () => {
  if (
    !confirm(
      "Clear autosaved scenarios from this browser?\n\nCurrent on-screen scenarios stay until you refresh. After refresh, factory sample scenarios load again unless you re-import.",
    )
  ) {
    return;
  }
  clearPersistedState();
});

document.getElementById("inputs").addEventListener("input", (event) => {
  const auditInput = event.target.closest("[data-audit-field]");
  if (auditInput) {
    updateActiveAudit(auditInput.dataset.auditField, auditInput.dataset.auditProp, auditInput.value);
    return;
  }

  const input = event.target.closest("[data-field]");
  if (!input) return;
  const field = input.dataset.field;
  const value = input.type === "number" ? Number(input.value) : input.value;
  updateActive(field, value);
});

document.getElementById("inputs").addEventListener("change", (event) => {
  const auditInput = event.target.closest("[data-audit-field]");
  if (auditInput) {
    updateActiveAudit(auditInput.dataset.auditField, auditInput.dataset.auditProp, auditInput.value);
    return;
  }

  const presetSelect = event.target.closest("[data-fire-preset]");
  if (presetSelect) {
    applyDesignFirePreset(presetSelect.value);
    return;
  }

  const select = event.target.closest("select[data-field]");
  if (!select) return;
  updateActive(select.dataset.field, select.value);
});

document.getElementById("inputs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-toggle]");
  if (!button) return;
  const active = activeScenario();
  const field = button.dataset.toggle;
  updateActive(field, !active[field]);
});

document.getElementById("scenarioName").addEventListener("input", (event) => {
  updateActive("name", event.target.value);
});

document.getElementById("duplicateScenario").addEventListener("click", () => {
  const active = activeScenario();
  const id = `scenario-${Date.now()}`;
  scenarios = [
    ...scenarios,
    {
      ...active,
      id,
      name: `${active.name} copy`,
      revision: 1,
      parentId: active.id,
    },
  ];
  activeId = id;
  render();
});

document.getElementById("deleteScenario").addEventListener("click", () => {
  if (scenarios.length === 1) return;
  const active = activeScenario();
  const label = active?.name ? `"${active.name}"` : "this scenario";
  if (!confirm(`Delete ${label}?\n\nThis cannot be undone (except from an Export JSON backup).`)) {
    return;
  }
  scenarios = scenarios.filter((scenario) => scenario.id !== activeId);
  activeId = scenarios[0].id;
  render();
});

document.getElementById("exportScenarios").addEventListener("click", () => {
  const payload = scenarioExportPayload();
  document.getElementById("scenarioImport").value = payload;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(payload).catch(() => {});
  }
  setImportStatus(`Exported ${scenarios.length} scenario${scenarios.length === 1 ? "" : "s"}.`);
});

document.getElementById("loadTemplate").addEventListener("click", () => {
  document.getElementById("scenarioImport").value = JSON.stringify(scenarioTemplatePayload(), null, 2);
  setImportStatus("Template loaded.");
});

document.getElementById("importScenarios").addEventListener("click", () => {
  const raw = document.getElementById("scenarioImport").value;
  const parsed = parseScenarioImport(raw);
  const errorCount = parsed.issues.filter((item) => item.severity === "error").length;
  if (errorCount > 0) {
    renderImportStatus(parsed.issues, 0);
    return;
  }
  scenarios = parsed.scenarios;
  activeId = scenarios[0].id;
  render();
  renderImportStatus(parsed.issues, scenarios.length);
});

document.querySelector(".modeSwitch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-app-mode]");
  if (!button) return;
  appMode = button.dataset.appMode === "excel" ? "excel" : "standard";
  render();
});

document.getElementById("printReport").addEventListener("click", () => window.print());

scenarios = scenarios.map((scenario) => applyPredictiveReviewerBasis(scenario));

const restoredFromBrowser = loadPersistedState();
render();
if (restoredFromBrowser) {
  const el = document.getElementById("saveStatus");
  if (el) el.textContent = lastSaveNote;
  setImportStatus("Restored scenarios from this browser's autosave.");
}
