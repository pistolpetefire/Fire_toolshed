// Synthetic layout fixture only. Contains no project information or engineering determination.
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fresh,beginRevision} from './core.mjs';
import {documentBytes} from './docx.mjs';
const out=process.argv[2];if(!out)throw Error('Supply an output directory.');await mkdir(out,{recursive:true});
let m=fresh();Object.assign(m.project,{name:'Synthetic warehouse proposal QA',number:'TEST ONLY',analyst:'Software fixture',summary:'This synthetic package tests report layout. It is not a project review or engineering determination. Missing source evidence remains unresolved.',limitations:'No actual RFP, drawings, adopted code text or water-supply records were used. These records test formatting only.'});
m.documents=[{id:'D1',name:'Synthetic RFP.pdf',revision:'A',role:'RFP',pages:2,sha256:'a'.repeat(64)}];
m.requirements=[{id:'C1',name:'Project requirements pending',edition:'Not supplied',applicability:'Confirm jurisdiction and project requirements before estimating scope.',source:'Synthetic fixture only',status:'Unresolved'}];
for(const t of m.topics){t.conclusion='Insufficient source information to establish the preliminary requirement. Obtain the applicable design criteria and drawing evidence before assigning a quantity or system size.';t.source='D1, PDF page 1 — synthetic placeholder only';}
Object.assign(m.topics.find(t=>t.id==='storage'),{classification:'Planning assumption',conclusion:'Evaluate ESFR as the preferred approach if the eventual commodity, storage configuration and listing permit it.',assumptions:'ESFR suitability and any in-rack protection remain unresolved until storage data is supplied.'});
m.rfis=[{id:'RFI-001',topicId:'water',question:'Provide the current flow test and utility operating limitations, identifying the test locations and elevations.',reason:'Available supply is needed to evaluate pump duty and preliminary distribution sizing.',source:'D1, PDF page 2 — synthetic placeholder',priority:'High',owner:'Owner / utility',status:'Open',response:''},{id:'RFI-002',topicId:'storage',question:'Confirm commodity, packaging, storage and ceiling heights, rack arrangement and anticipated changes in operations.',reason:'The protection arrangement and ESFR suitability cannot be established without the storage basis.',source:'D1, PDF page 1 — synthetic placeholder',priority:'High',owner:'Owner',status:'Open',response:''}];
m=beginRevision(m,{id:'D2',name:'Synthetic plan.pdf',revision:'B',role:'drawing',pages:1,sha256:'b'.repeat(64)},'Synthetic revised floor plan; all topics require recheck.');
for(const kind of ['summary','rfis'])await writeFile(join(out,`synthetic-${kind}.docx`),documentBytes(m,kind));
