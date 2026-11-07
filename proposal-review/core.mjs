export const SCHEMA='fireToolshed.proposalReview.v1';
export const TOPICS=[
 ['facility','Facility and occupancy','Uses, areas, height, stories, construction and special hazards.'],
 ['jurisdiction','Jurisdiction and governing requirements','Codes, editions, amendments, owner requirements, UFC and specific FM sheets.'],
 ['water','Water supply','Test data, reliability, available flow/pressure, datum and utility restrictions.'],
 ['suppression','Fire suppression','Anticipated system types, hazard classifications and design scenarios.'],
 ['alarm','Fire alarm and reporting','Notification, interfaces, supervising station, reporting method and signal destination.'],
 ['standpipes','Standpipe needs','Applicable height, story, occupancy and access triggers; system type and scope.'],
 ['stairs','Occupant loads exits stairs and widths','Recalculate loads by room/use and floor using sourced gross/net areas and factors. Record required/provided exit counts, stair counts, total exit widths and stair/door/corridor capacity separately, including separation, travel and configuration. Exit count is not automatically stair count.'],
 ['pump','Fire pump','Demand versus supply at matching datum, elevation and equipment losses; conditional pump duty.'],
 ['storage','Rack storage and ESFR','Commodity, arrangement, heights and listing constraints. Prefer ESFR where suitable; identify potential in-rack needs.'],
 ['tank','Fire-water storage','Credible controlling flow/duration scenario, simultaneous allowances, refill, unusable water and nominal volume.'],
 ['hydrants','Hydrant quantity and locations','Fire flow, spacing, access and distribution supported by jurisdiction requirements and geometry.'],
 ['access','Fire department access','Required sides/perimeter, apparatus routes, aerial access, turning, loads and gates.'],
 ['loop','Fire-water loop arrangement','Specified versus anticipated loop; combined hydrant/suppression versus separate supplies and reliability.'],
 ['loop-sizing','Preliminary loop sizing','Concurrent demand, inside diameter, losses, elevations, flow distribution and operating scenarios; distinguish arithmetic from network analysis.']
];
export const CLASSIFICATIONS=['Stated requirement','Calculated estimate','Planning assumption','Unresolved'];
export function fresh(){return {schema:SCHEMA,version:'1.0.0',id:crypto.randomUUID(),project:{name:'',number:'',analyst:'',date:new Date().toISOString().slice(0,10),summary:'',limitations:''},documents:[],requirements:[],topics:TOPICS.map(([id,title])=>({id,title,classification:'Unresolved',conclusion:'',source:'',basis:'',calculation:'',assumptions:'',reviewerNote:'',reviewedBy:'',reviewedAt:''})),rfis:[]};}
function strings(row,keys){if(!row||typeof row!=='object'||Array.isArray(row)||keys.some(k=>typeof row[k]!=='string'))throw Error('Record contains missing or invalid text fields: '+keys.join(', '));}
export function validate(m){
 if(m?.schema!==SCHEMA||m.version!=='1.0.0'||typeof m.id!=='string'||!m.id)throw Error('Unsupported proposal file or missing identity.');
 strings(m.project,['name','number','analyst','date','summary','limitations']);
 for(const k of ['documents','requirements','topics','rfis']){if(!Array.isArray(m[k]))throw Error('Missing '+k);const ids=new Set();for(const x of m[k]){if(!x||typeof x.id!=='string'||!x.id||ids.has(x.id))throw Error('Missing or duplicate '+k+' ID.');ids.add(x.id);}}
 if(m.topics.length!==TOPICS.length||TOPICS.some(([id])=>!m.topics.some(t=>t.id===id)))throw Error('Every proposal topic is required exactly once.');
 for(const d of m.documents){strings(d,['id','name','revision','role','sha256']);if(!Number.isInteger(d.pages)||d.pages<0||!['RFP','drawing','specification','criteria','addendum'].includes(d.role)||(d.sha256!==''&&!/^[a-f0-9]{64}$/.test(d.sha256)))throw Error('Document needs page count, valid role and SHA-256.');}
 for(const r of m.requirements){strings(r,['id','name','edition','applicability','source','status']);if(!['Proposed','Confirmed','Unresolved'].includes(r.status))throw Error('Invalid requirement status.');if(r.status==='Confirmed'&&[r.name,r.edition,r.applicability,r.source].some(v=>!v.trim()))throw Error('Confirmed requirement needs edition, applicability and source.');}
 for(const t of m.topics){strings(t,['id','title','classification','conclusion','source','basis','calculation','assumptions','reviewerNote','reviewedBy','reviewedAt']);if(!CLASSIFICATIONS.includes(t.classification))throw Error('Invalid topic classification.');
  if(t.classification!=='Unresolved'&&!t.conclusion.trim())throw Error('A classified conclusion needs an explanation.');
  if(t.classification==='Stated requirement'&&!t.source.trim())throw Error('Stated requirement needs a source.');
  if(t.classification==='Calculated estimate'&&[t.source,t.basis,t.calculation,t.assumptions].some(v=>!v.trim()))throw Error('Estimate needs sources, basis, calculation with units and assumptions.');
  if(t.classification==='Planning assumption'&&!t.assumptions.trim())throw Error('Planning assumption needs its rationale and limitations.');
  if(Boolean(t.reviewedBy.trim())!==Boolean(t.reviewedAt.trim())||t.reviewedAt&&!Number.isFinite(Date.parse(t.reviewedAt)))throw Error('Incomplete reviewer validation.');
  if(t.reviewedBy&&(!t.conclusion.trim()||!t.reviewerNote.trim()))throw Error('Reviewer needs a conclusion and validation note.');
 }
 for(const r of m.rfis){strings(r,['id','topicId','question','reason','source','priority','owner','status','response']);if(!TOPICS.some(([id])=>id===r.topicId)||!['High','Normal','Low'].includes(r.priority)||!['Open','Answered','Closed'].includes(r.status)||!r.question.trim()||!r.reason.trim())throw Error('RFI needs a valid topic, question, reason, priority and status.');if(r.status!=='Open'&&!r.response.trim())throw Error('Answered or closed RFI needs a response.');}
 if(m.revisions!==undefined){if(!Array.isArray(m.revisions))throw Error('Invalid revision history.');const ids=new Set();for(const r of m.revisions){strings(r,['id','at','note','documentId']);if(ids.has(r.id)||!r.id||!Number.isFinite(Date.parse(r.at))||!r.previous||r.previous.revisions!==undefined||r.previous.id!==m.id)throw Error('Invalid revision snapshot.');ids.add(r.id);validate(r.previous);}}
 for(const t of m.topics)if(t.needsRecheck!==undefined&&typeof t.needsRecheck!=='boolean')throw Error('Invalid revision recheck state.');
 return m;
}
export const parse=text=>validate(JSON.parse(text.replace(/^\uFEFF/,'')));
export function readiness(m){validate(m);const unresolved=m.topics.filter(t=>t.classification==='Unresolved').length,open=m.rfis.filter(r=>r.status!=='Closed').length,reviewed=m.topics.filter(t=>t.reviewedBy).length;
 const recheck=m.topics.filter(t=>t.needsRecheck).length;
 const ready=!!m.project.name.trim()&&!!m.project.summary.trim()&&m.documents.length>0&&m.documents.every(d=>d.name.trim()&&d.pages>0&&d.sha256)&&m.requirements.length>0&&m.requirements.every(r=>r.status==='Confirmed')&&reviewed===TOPICS.length&&recheck===0;
 return {ready,reviewed,unresolved,open,recheck,label:ready?'Reviewer-validated preliminary scope':'Draft — reviewer validation pending'};
}
export function reviewTopic(m,id,name,note){const t=m.topics.find(t=>t.id===id);if(!t||!name.trim()||!note.trim()||!t.conclusion.trim())throw Error('Provide a reviewer name, conclusion and validation note.');t.reviewedBy=name.trim();t.reviewedAt=new Date().toISOString();t.reviewerNote=note.trim();t.needsRecheck=false;validate(m);}
export function clearReview(m){for(const t of m.topics){t.reviewedBy='';t.reviewedAt='';}}
export function beginRevision(m,document,note){
 validate(m);if(!note?.trim())throw Error('Describe what changed in this revision.');
 if(m.documents.some(d=>d.id===document.id))throw Error('Use a new document ID for a revised plan.');
 const next=structuredClone(m),previous=structuredClone(m);delete previous.revisions;
 next.documents.push(document);next.revisions??=[];
 next.revisions.push({id:crypto.randomUUID(),at:new Date().toISOString(),note:note.trim(),documentId:document.id,previous});
 clearReview(next);for(const t of next.topics){t.needsRecheck=true;t.reviewerNote='';}
 for(const r of next.requirements)if(r.status==='Confirmed')r.status='Proposed';
 for(const r of next.rfis)if(r.status==='Closed'){r.status='Answered';r.response+='\nPrior closure requires confirmation against revised plan.';}
 next.project.date=new Date().toISOString().slice(0,10);
 return validate(next);
}
