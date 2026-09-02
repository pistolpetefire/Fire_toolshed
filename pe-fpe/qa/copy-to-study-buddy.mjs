/** Recopy the CBT into Study Buddy public/. Run from pe-fpe/: node qa/copy-to-study-buddy.mjs */
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dst = join(root, "..", "study-buddy", "public", "pe-fpe-study-buddy");
mkdirSync(dst, { recursive: true });
for (const rel of ["index.html", "css", "js", "figures"]) {
  cpSync(join(root, rel), join(dst, rel), { recursive: true });
}
console.log("copied CBT into", dst);
