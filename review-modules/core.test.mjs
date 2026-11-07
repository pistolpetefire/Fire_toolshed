import assert from 'node:assert/strict';
import {catalog,paths} from './catalog.mjs';
import {fresh,parse,validate,transfer,summary} from './core.mjs';
import {metrics,parseCase} from '../peer-review/core.mjs';
for(const path of paths){
 const m=fresh(path);Object.assign(m.project,{name:'Training review',number:'QA-001',reviewer:'Reviewer A',basis:'Project-selected editions and amendments',scope:'Test scope'});
 assert.equal(m.items.length,catalog[path].groups.reduce((n,[,rows])=>n+rows.length,0));assert.ok(m.items.length>0);assert.equal(summary(m).coverage,0);assert.deepEqual(parse(JSON.stringify(m)),m);
 const initial=transfer(m,null);assert.equal(initial.counts.checklists,m.items.length);assert.equal(metrics(initial.caseFile).ready,false);assert.equal(initial.caseFile.findings.length,0);assert.equal(transfer(m,initial.caseFile).duplicate,true);assert.deepEqual(parseCase(JSON.stringify(initial.caseFile)),initial.caseFile);
 const x=m.items[0];Object.assign(x,{applicability:'Applicable',result:'Candidate concern',notes:'Observed concern',source:'Drawing Rev B',citation:'Owner criterion 4',action:'Revise detail',owner:'Designer'});
 const pending=transfer(m,initial.caseFile);assert.equal(pending.caseFile.candidateItems.length,1);assert.equal(pending.caseFile.findings.length,0);assert.equal(pending.caseFile.checklistItems.filter(x=>!x.superseded).length,m.items.length);
 validate(m,x);const issued=transfer(m,pending.caseFile);assert.equal(issued.caseFile.findings.length,1);assert.equal(issued.caseFile.findings[0].validatedBy,'Reviewer A');assert.equal(issued.caseFile.findings[0].status,'Open');
 const y=m.items[1];Object.assign(y,{applicability:'Applicable',result:'Needs information',notes:'Cannot verify design without sequence',action:'Submit sequence',owner:'Designer'});const need=transfer(m,issued.caseFile);assert.equal(need.caseFile.outstandingRequirements.length,1);assert.equal(need.caseFile.findings.length,1);assert.equal(metrics(need.caseFile).blockers.length,1);
 m.project.limitations='Updated limitation';const revised=transfer(m,need.caseFile);assert.equal(revised.caseFile.findings.length,1);assert.equal(revised.caseFile.outstandingRequirements.length,1);assert.equal(revised.caseFile.candidateItems.length,2);assert.equal(revised.caseFile.checklistItems.filter(x=>!x.superseded).length,m.items.length);assert.equal(transfer(m,revised.caseFile).duplicate,true);
 const mismatch=structuredClone(revised.caseFile);mismatch.project.name='Different job';assert.throws(()=>transfer(m,mismatch),/Project name/);
 const invalid=structuredClone(m);invalid.items[0].validatedBy='';assert.throws(()=>parse(JSON.stringify(invalid)),/validation/);
 const missing=structuredClone(m);missing.items.pop();assert.throws(()=>parse(JSON.stringify(missing)),/missing starter/);
 const na=structuredClone(m);na.items[0].applicability='Not applicable';assert.throws(()=>parse(JSON.stringify(na)),/Only applicable/);
 assert.equal(catalog[path].discipline,revised.caseFile.disciplines[0]);
 console.log('PASS',path,': standalone, round-trip, candidates, validation, final blockers, repeat/revised handoff and project mismatch.');
}
const clean=fresh(paths[0]);Object.assign(clean.project,{name:'Ready case',number:'1',reviewer:'R',basis:'Selected code basis',scope:'Agreed scope'});for(const x of clean.items)Object.assign(x,{applicability:'Applicable',result:'Appears acceptable',notes:'Reviewed',source:'Drawing A'});for(const d of clean.documents)Object.assign(d,{status:'Reviewed',reference:'Rev A',notes:'Reviewed revision'});let ready=transfer(clean,null).caseFile;assert.equal(metrics(ready).coverage,100);assert.equal(metrics(ready).ready,true);clean.project.limitations='Updated';ready=transfer(clean,ready).caseFile;assert.equal(metrics(ready).coverage,100);assert.equal(metrics(ready).total,clean.items.length+clean.documents.length);assert.equal(metrics(ready).ready,true);
console.log('PASS superseded snapshots do not inflate coverage denominator.');
