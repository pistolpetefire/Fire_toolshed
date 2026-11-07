import assert from 'node:assert/strict';
import {fresh,parse,validate,readiness,reviewTopic,clearReview,beginRevision,TOPICS} from './core.mjs';
import {documentBytes} from './docx.mjs';
const m=fresh();assert.equal(readiness(m).ready,false);assert.deepEqual(parse(JSON.stringify(m)),m);
const bad=structuredClone(m);bad.topics.pop();assert.throws(()=>validate(bad),/Every proposal topic/);
const est=structuredClone(m);est.topics[0].classification='Calculated estimate';est.topics[0].conclusion='Test';assert.throws(()=>validate(est),/Estimate needs/);
const wrong=structuredClone(m);wrong.schema='fireToolshed.peerReview.v1';assert.throws(()=>validate(wrong),/Unsupported/);
Object.assign(m.project,{name:'Synthetic proposal QA',summary:'Synthetic fixture only; no engineering conclusions.',analyst:'Test runner'});
m.documents=[{id:'D1',name:'Synthetic RFP.pdf',revision:'A',role:'RFP',pages:2,sha256:'a'.repeat(64)}];
m.requirements=[{id:'C1',name:'Synthetic owner criterion',edition:'Test revision A',applicability:'Test only',source:'D1 p. 1',status:'Confirmed'}];
for(const t of m.topics){t.conclusion='Not determined from synthetic documents.';reviewTopic(m,t.id,'QA reviewer','Reviewed as unresolved; this is not an approved design.');}
assert.equal(readiness(m).ready,true);assert.equal(readiness(m).unresolved,TOPICS.length);
m.rfis=[{id:'RFI-1',topicId:'water',question:'Provide supply evidence.',reason:'Pump and tank scope cannot be established.',source:'D1 p. 2',priority:'High',owner:'Owner',status:'Open',response:''}];
assert.equal(readiness(m).open,1);const closed=structuredClone(m);closed.rfis[0].status='Closed';assert.throws(()=>validate(closed),/needs a response/);
const estimate=structuredClone(m);Object.assign(estimate.topics[0],{classification:'Calculated estimate',source:'D1 p. 1',basis:'Synthetic arithmetic only',calculation:'2 × 3 = 6 test units',assumptions:'Not an engineering result.'});validate(estimate);
for(const kind of ['summary','rfis']){const bytes=documentBytes(m,kind);assert.equal(new DataView(bytes.buffer).getUint32(0,true),0x04034b50);const text=new TextDecoder().decode(bytes);assert.ok(text.includes('word/document.xml'));assert.ok(text.includes(kind==='summary'?'Fire Protection Proposal Summary':'Fire Protection Requests for Information'));assert.ok(text.includes('unresolved topics'));}
const injection=structuredClone(m);injection.project.name='<script>&"';assert.ok(new TextDecoder().decode(documentBytes(injection)).includes('&lt;script&gt;&amp;&quot;'));
const revision=beginRevision(m,{id:'D2',name:'Revised plan.pdf',revision:'B',role:'drawing',pages:3,sha256:'b'.repeat(64)},'Architect changed room uses and exit layout.');
assert.equal(revision.id,m.id);assert.equal(revision.revisions.length,1);assert.deepEqual(revision.revisions[0].previous,m);assert.ok(revision.topics.every(t=>t.needsRecheck&&!t.reviewedBy&&!t.reviewerNote));assert.equal(revision.requirements[0].status,'Proposed');assert.equal(readiness(revision).ready,false);assert.equal(readiness(revision).recheck,14);assert.deepEqual(parse(JSON.stringify(revision)),revision);
assert.ok(new TextDecoder().decode(documentBytes(revision)).includes('PRIOR CONCLUSION'));
assert.throws(()=>beginRevision(m,m.documents[0],'Same document'),/new document ID/);
const revision2=beginRevision(revision,{id:'D3',name:'Revised plan.pdf',revision:'C',role:'drawing',pages:3,sha256:'c'.repeat(64)},'Second plan change');assert.equal(revision2.revisions.length,2);assert.equal(revision2.revisions[1].previous.revisions,undefined);parse(JSON.stringify(revision2));
clearReview(m);assert.equal(readiness(m).ready,false);assert.ok(m.topics.every(t=>!t.reviewedBy&&!t.reviewedAt));
console.log('PASS proposal round-trip, completeness, estimate evidence, unresolved counts, reviewer reset, RFI closure and OOXML escaping.');
