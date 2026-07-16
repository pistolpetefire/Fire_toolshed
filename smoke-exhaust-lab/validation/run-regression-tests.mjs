import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const appPath = fileURLToPath(new URL("../app/app.js", import.meta.url));
const goldenPath = fileURLToPath(new URL("./golden-cases.json", import.meta.url));
const appSource = fs.readFileSync(appPath, "utf8");
const domMarker = 'document.getElementById("scenarioList").addEventListener';
const markerIndex = appSource.indexOf(domMarker);

if (markerIndex < 0) {
  throw new Error(`Cannot find DOM startup marker in ${appPath}.`);
}

const context = { console };
vm.createContext(context);
vm.runInContext(
  `${appSource.slice(0, markerIndex)}
globalThis.engine = {
  APP_VERSION,
  CALC_ENGINE_VERSION,
  SCENARIO_SCHEMA_VERSION,
  SOURCE_DOCUMENTS,
  expectedImportUnits,
  scenarioSchema,
  tsfpewgRequirements,
  calculate,
  dataQualityForScenario,
  decisionPath,
  traceabilityForScenario,
  submittalReadinessForScenario
};`,
  context,
);

const golden = JSON.parse(fs.readFileSync(goldenPath, "utf8"));
const failures = [];

function fail(caseId, field, expected, actual) {
  failures.push({ caseId, field, expected, actual });
}

function near(actual, expected, tolerance) {
  return Math.abs(Number(actual) - Number(expected)) <= Number(tolerance);
}

for (const item of golden.cases) {
  const calc = context.engine.calculate(item.scenario);
  const quality = context.engine.dataQualityForScenario(item.scenario, calc);
  const readiness = context.engine.submittalReadinessForScenario(item.scenario, calc, quality);
  const actual = {
    path: context.engine.decisionPath(item.scenario).map((step) => step.result).join(" | "),
    dataQualityStatus: quality.status,
    requiredCfm: Math.round(calc.outputs.requiredCfm),
    selectedCfm: Math.round(calc.outputs.selectedCfm),
    requiredInlets: Number.isFinite(calc.outputs.requiredInlets) ? calc.outputs.requiredInlets : "Needs input",
    plugholingPass: calc.outputs.plugholingPass,
    makeupVelocityPass: calc.outputs.makeupVelocityPass,
    pressurePass: calc.outputs.pressurePass,
    pressurePa: Number.isFinite(calc.outputs.pressurePa) ? Number(calc.outputs.pressurePa.toFixed(1)) : null,
    appReadinessStatus: readiness.status,
  };

  for (const [field, expected] of Object.entries(item.expected)) {
    const tolerance = item.tolerance?.[field];
    if (tolerance !== undefined) {
      if (!near(actual[field], expected, tolerance)) fail(item.id, field, expected, actual[field]);
    } else if (actual[field] !== expected) {
      fail(item.id, field, expected, actual[field]);
    }
  }

  const traceability = context.engine.traceabilityForScenario(item.scenario, calc, quality);
  if (traceability.length !== context.engine.tsfpewgRequirements.length) {
    fail(item.id, "traceability row count", context.engine.tsfpewgRequirements.length, traceability.length);
  }
}

const requiredUnits = [
  "hrrKw",
  "convectiveFraction",
  "makeupRatio",
  "flowCoefficient",
  "exhaustLocationFactor",
  "selectedInletCount",
  "exhaustMarginPercent",
  "targetPressurePa",
];
for (const field of requiredUnits) {
  if (!context.engine.expectedImportUnits[field]) {
    fail("schema", `unit for ${field}`, "defined", "missing");
  }
}

if (context.engine.tsfpewgRequirements.length < 10) {
  fail("traceability", "requirement count", ">= 10", context.engine.tsfpewgRequirements.length);
}

const result = {
  passed: failures.length === 0,
  appVersion: context.engine.APP_VERSION,
  calculationEngineVersion: context.engine.CALC_ENGINE_VERSION,
  schemaVersion: context.engine.SCENARIO_SCHEMA_VERSION,
  cases: golden.cases.length,
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
