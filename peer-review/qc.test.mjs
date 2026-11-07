import assert from 'node:assert/strict';
import {fresh,add,parseCase} from './core.mjs';
import {ensureCaseIdentity,recordResponse,recordDecision,responsePackage,previewResponses,events,queueFor} from './qc.mjs';
const make=()=>{const c=fresh();c.project.name='QC regression';c.project.number='TEST';ensureCaseIdentity(c);add(c,'findings','PR',{title:'Circuit return',description:'Return missing',correction:'Show return',source:'FA-110',citation:'Design note 1',status:'Open',validated:'2026-11-06',owner:'Designer'});return c;};
const c=make(),d=structuredClone(c),id=c.findings[0].id;
recordResponse(d,id,{actor:'Designer',action:'Corrected—ready for review',note:'Added return',drawing:'FA-110 rev B'});
assert.equal(d.findings[0].status,'Response received');assert.equal(queueFor(d.findings[0]),'EOR');assert.equal(c.findings[0].status,'Open');
const p=responsePackage(d),preview=previewResponses(c,p),merged=preview.caseFile;
assert.equal(preview.accepted.length,1);assert.equal(merged.findings[0].validated,c.findings[0].validated);assert.equal(merged.findings[0].correction,'Show return');assert.equal(previewResponses(merged,p).duplicates.length,1);
assert.equal(parseCase(JSON.stringify(merged)).findings[0].qcHistory,merged.findings[0].qcHistory);
assert.throws(()=>recordDecision(merged,id,{actor:'EOR',action:'Close',note:'Checked'}),/evidence/);
recordDecision(merged,id,{actor:'EOR',action:'Close',note:'Verified return',evidence:'FA-110 rev B'});assert.equal(queueFor(merged.findings[0]),'Closed');
recordResponse(d,id,{actor:'Designer',action:'In progress',note:'Another change'});
assert.equal(previewResponses(merged,responsePackage(d)).conflicts.length,1);assert.equal(merged.findings[0].status,'Closed');
recordDecision(merged,id,{actor:'EOR',action:'Reopen',note:'Design revision affects this circuit'});assert.equal(queueFor(merged.findings[0]),'Designer');
assert.throws(()=>previewResponses(make(),p),/identity/);
const edited=structuredClone(c);edited.findings[0].correction='New correction';assert.equal(previewResponses(edited,p).conflicts.length,1);
const concurrent=structuredClone(c);recordResponse(concurrent,id,{actor:'Other designer',action:'Need EOR direction',note:'Please clarify'});assert.equal(previewResponses(concurrent,p).conflicts.length,1);
const tampered=structuredClone(p);tampered.responses[0].note='Changed old response';assert.equal(previewResponses(preview.caseFile,tampered).conflicts.length,1);
const duplicate=structuredClone(p);duplicate.responses.push(duplicate.responses[0]);assert.throws(()=>previewResponses(c,duplicate),/duplicate/);
const invalid=structuredClone(p);invalid.responses[0].type='eor';assert.throws(()=>previewResponses(c,invalid),/Invalid/);
const incomplete=make();assert.throws(()=>recordResponse(incomplete,id,{actor:'Designer',action:'Corrected—ready for review',note:'Done'}),/drawing/);assert.equal(events(incomplete.findings[0]).length,0);
// Multiple sequential responses preserve order; replays are idempotent.
const sequential=previewResponses(c,responsePackage(d));assert.equal(sequential.accepted.length,2);assert.equal(events(sequential.caseFile.findings[0]).length,2);
assert.equal(previewResponses(sequential.caseFile,responsePackage(d)).duplicates.length,2);
// Legacy data still imports without migration or invented reviewer identity.
const legacy=fresh();delete legacy.project.qcCaseId;const imported=parseCase(JSON.stringify(legacy));assert.equal(imported.version,'1.0.0');assert.equal(imported.project.qcCaseId,undefined);
console.log('QC workflow tests passed: legacy import, history round-trip, designer/EOR separation, evidence requirements, replay, conflicts, and case isolation.');
