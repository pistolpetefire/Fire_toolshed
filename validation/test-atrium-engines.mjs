import { evaluateVerification, fdsSnippet } from '../shared/atrium-calc.mjs'
import { blankProject } from '../shared/atrium-project.mjs'

const rows = evaluateVerification()
let failed = 0
for (const row of rows) {
  const mark = row.pass ? 'PASS' : 'FAIL'
  if (!row.pass) failed += 1
  console.log(`${mark} ${row.id}: actual ${row.actual} ${row.unit}, expected ${row.expected}, diff ${row.diffPct}%`)
}

const project = blankProject()
const fds = fdsSnippet(project)
if (!fds.text.includes('&HEAD') || !fds.text.includes('&RAMP') || !fds.text.includes('EXHAUST') || !fds.text.includes('SI units') || !fds.text.includes('Location: floor')) {
  failed += 1
  console.log('FAIL fds snippet missing required records')
} else {
  console.log('PASS fds snippet has head, ramp, exhaust, SI note, and location')
}
const failedFan = blankProject()
failedFan.failures.fanOut = true
failedFan.fire.location = 'balcony'
const fanFds = fdsSnippet(failedFan)
if (!fanFds.text.includes('VOLUME_FLOW=7.5') || !fanFds.text.includes('Location: balcony')) {
  failed += 1
  console.log('FAIL fan-out balcony snippet')
  console.log(fanFds.text)
} else {
  console.log('PASS fan-out snippet halves two fans and records the balcony')
}

const memory = new Map()
globalThis.localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null },
  setItem(key, value) { memory.set(key, String(value)) },
  removeItem(key) { memory.delete(key) },
}
const { publishEgressHandoff, renderChecklistMarkdown } = await import('../shared/atrium-pages.mjs')
const checklistMd = await import('node:fs').then((fs) => fs.readFileSync(new URL('../atrium-path/CHECKLIST.md', import.meta.url), 'utf8'))
const checklistHtml = renderChecklistMarkdown(checklistMd)
const checkCount = (checklistHtml.match(/data-check="/g) || []).length
if (checkCount < 30 || !checklistHtml.includes('https://pages.nist.gov/fds-smv/') || !checklistHtml.includes('https://pages.nist.gov/cfast/') || !checklistHtml.includes('Phase 2')) {
  failed += 1
  console.log('FAIL checklist render', checkCount)
} else if (checklistHtml.includes('| --- |')) {
  failed += 1
  console.log('FAIL checklist table separator was left in the page')
} else {
  console.log(`PASS checklist renders ${checkCount} checks and the NIST links`)
}
const handed = publishEgressHandoff({
  projectName: 'Handoff check',
  codePath: 'nfpa101',
  totalOccupantLoad: 42,
  totalExitWidth_m: 1.5,
  spaces: [{ id: 'lvl1', name: 'Atrium floor', occupantLoad: 42 }],
  exits: [],
})
if (!handed || !handed.locations[0] || handed.locations[0].occupantLoad !== 42 || handed.locations[0].exitWidth_m !== 1.5) {
  failed += 1
  console.log('FAIL egress handoff did not store the occupant load and width')
} else {
  console.log('PASS egress handoff stores occupant load and total exit width')
}

console.log(failed ? `${failed} failed` : 'all atrium engine checks passed')
process.exit(failed ? 1 : 0)
