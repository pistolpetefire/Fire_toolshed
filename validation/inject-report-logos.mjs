/**
 * Embed brand PNGs as data URLs into shared/report-logo.js
 *   - shared/logos/benham.png → BENHAM_DATA_URL
 *   - shared/logos/meadhunt-jv.png → MEADHUNT_DATA_URL
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsPath = path.join(root, "shared/report-logo.js");

function dataUrlFor(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error("Missing", p);
    process.exit(1);
  }
  const buf = fs.readFileSync(p);
  return "data:image/png;base64," + buf.toString("base64");
}

let js = fs.readFileSync(jsPath, "utf8");

function inject(varName, dataUrl) {
  const re = new RegExp("var " + varName + ' = "(?:[^"\\\\]|\\\\.)*";');
  const reEmpty = new RegExp("var " + varName + ' = "";');
  const line = "var " + varName + ' = "' + dataUrl + '";';
  if (reEmpty.test(js)) {
    js = js.replace(reEmpty, line);
    return true;
  }
  if (re.test(js)) {
    js = js.replace(re, line);
    return true;
  }
  return false;
}

const benham = dataUrlFor("shared/logos/benham.png");
const meadhunt = dataUrlFor("shared/logos/meadhunt-jv.png");

if (!inject("BENHAM_DATA_URL", benham)) {
  console.error("Could not inject BENHAM_DATA_URL");
  process.exit(1);
}
if (!inject("MEADHUNT_DATA_URL", meadhunt)) {
  console.error("Could not inject MEADHUNT_DATA_URL");
  process.exit(1);
}

fs.writeFileSync(jsPath, js);
console.log("OK inject-report-logos");
console.log("  benham", benham.length);
console.log("  meadhunt", meadhunt.length);
console.log("  report-logo.js", fs.statSync(jsPath).size);
