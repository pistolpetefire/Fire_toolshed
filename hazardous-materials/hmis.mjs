import {issues} from './core.mjs';

export const QUANTITIES=['storage','closedUse','openUse','totalQuantity'];
export const TOPICS=['Scope and operations','Inventory and hazard classifications','Control area / occupancy and MAQ evaluation','Containers and liquid transfer','Incompatible materials and separation','Spill control and secondary containment','Ventilation','Signage and identification','Fire protection and alarms','Egress and other safeguards'];
const nonblank=x=>typeof x==='string'&&!!x.trim();
const bad=message=>{throw Error(message);};
export function normalizeHmis(m){
 m.hmis??={rooms:[],changes:[]};
 if(!m.hmis||!Array.isArray(m.hmis.rooms)||!Array.isArray(m.hmis.changes))bad('Invalid HMIS room / change register.');
 const ids=new Set();
 for(const room of m.hmis.rooms){
  if(!nonblank(room.id)||ids.has(room.id))bad('Room IDs must be unique.');ids.add(room.id);
  for(const k of ['number','name','controlArea','sheet','notes','references','reviewedBy','reviewedAt','reviewBasis'])if(typeof room[k]!=='string')bad('Invalid room '+k);
 }
 for(const r of m.materials){r.roomId??='';if(typeof r.roomId!=='string'||(r.roomId&&!ids.has(r.roomId)))bad('Material refers to an unknown room.');}
 const changes=new Set();
 for(const c of m.hmis.changes){
  if(!nonblank(c.id)||changes.has(c.id)||!nonblank(c.at)||!nonblank(c.reason)||!nonblank(c.source)||!nonblank(c.materialId)||!c.before||!c.after||!c.snapshot)bad('Invalid quantity change record.');changes.add(c.id);
  for(const values of [c.before,c.after]){for(const k of QUANTITIES)if(values[k]!==null&&(typeof values[k]!=='number'||!Number.isFinite(values[k])||values[k]<0))bad('Invalid change quantity.');if(typeof values.unit!=='string')bad('Invalid change unit.');}
 }
 return m.hmis;
}
export function newRoom(id){return {id,number:'',name:'',controlArea:'',sheet:'',notes:TOPICS.map(t=>t+'\n[Complete or explain why not applicable.]').join('\n\n'),references:'',reviewedBy:'',reviewedAt:'',reviewBasis:''};}
// Compare the actual current record, not a caller-supplied revision counter. Any
// inventory or room change invalidates all rooms, including shared-area effects.
export function basis(m){
 const omitReview=o=>Object.fromEntries(Object.entries(o).filter(([k])=>!['reviewedBy','reviewedAt','reviewBasis'].includes(k)));
 const project={...m.project};delete project.reviewer;
 return JSON.stringify({project,documents:m.documents,materials:m.materials.map(omitReview),rooms:m.hmis.rooms.map(omitReview)});
}
export function roomStatus(m,room){return !room.reviewedBy?'Pending review':room.reviewBasis===basis(m)?'Reviewer validated':'Recheck required — record changed';}
export function roomIssues(m,room){
 const assigned=m.materials.filter(r=>r.roomId===room.id);
 return [!nonblank(room.number)&&'Enter room number',!nonblank(room.name)&&'Enter room name',!nonblank(room.controlArea)&&'Identify control area / occupancy grouping',!nonblank(room.notes)&&'Prepare room notes',room.notes.includes('[Complete')&&'Complete every note topic or explain why not applicable',!nonblank(room.references)&&'Provide source documents, code editions / sections and calculation references',!assigned.length&&'Assign the room inventory',m.materials.some(r=>!r.roomId)&&'Assign all materials to rooms before validating building dependencies',...assigned.flatMap(r=>issues(m,r).length?[r.name+': resolve material information']:!r.reviewedBy?[r.name+': validate material']:[])].filter(Boolean);
}
export function reviewRoom(m,id,name,confirmed){
 const room=m.hmis.rooms.find(r=>r.id===id);if(!room)bad('Unknown room.');
 const missing=roomIssues(m,room);if(!nonblank(name)||!confirmed||missing.length)bad(missing.join('; ')||'Identify reviewer and confirm room, control-area and building-level checks.');
 room.reviewedBy=name.trim();room.reviewedAt=new Date().toISOString();room.reviewBasis=basis(m);
}
export function recordQuantities(m,materialId,values,reason,source,id,at=new Date().toISOString()){
 normalizeHmis(m);const r=m.materials.find(r=>r.id===materialId);if(!r)bad('Unknown material.');
 if(!nonblank(reason)||!nonblank(source)||!nonblank(id)||m.hmis.changes.some(c=>c.id===id))bad('Provide a reason, source and unique change ID.');
 for(const k of QUANTITIES)if(values[k]!==null&&(typeof values[k]!=='number'||!Number.isFinite(values[k])||values[k]<0))bad('Quantities must be nonnegative numbers or blank for unknown.');
 if(!nonblank(values.unit))bad('Enter quantity unit.');
 const before=Object.fromEntries([...QUANTITIES,'unit'].map(k=>[k,r[k]]));
 const after=Object.fromEntries([...QUANTITIES,'unit'].map(k=>[k,values[k]]));
 if(JSON.stringify(before)===JSON.stringify(after))bad('No quantity or unit change to record.');
 const snapshot=structuredClone({...m,hmis:{rooms:m.hmis.rooms,changes:[]}});
 m.hmis.changes.push({id,at,materialId,reason:reason.trim(),source:source.trim(),before,after,snapshot});
 Object.assign(r,after,{inventorySource:source.trim(),reviewedBy:'',reviewedAt:''});
 for(const room of m.hmis.rooms)room.reviewBasis='';
 return m.hmis.changes.at(-1);
}
const quantity=(v,unit)=>v===null?'UNKNOWN':v+' '+(unit||'UNIT UNRESOLVED');
export function inventoryText(m,room){
 return m.materials.filter(r=>r.roomId===room.id).map(r=>`${r.id} — ${r.name}\nStorage: ${quantity(r.storage,r.unit)}; closed-system use: ${quantity(r.closedUse,r.unit)}; open-system use: ${quantity(r.openUse,r.unit)}; owner total: ${quantity(r.totalQuantity,r.unit)}.\nHazards: ${r.hazards.map(h=>h.type+' — '+h.classification).join('; ')||'UNRESOLVED'}.\nInventory source: ${r.inventorySource||'UNRESOLVED'}. SDS: ${r.sdsIds.join(', ')||'UNRESOLVED'}.`).join('\n\n')||'NO INVENTORY ASSIGNED';
}
export function notesText(m,{approved=false}={}){
 normalizeHmis(m);
 if(approved&&(!m.hmis.rooms.length||m.hmis.rooms.some(r=>roomStatus(m,r)!=='Reviewer validated'||roomIssues(m,r).length)))bad('Validate all current room notes and resolve outstanding items before exporting reviewed notes.');
 return [`${m.project.name||'Unnamed project'} — HMIS room notes`,approved?'REVIEWER-VALIDATED RECORD — verify placement in Revit':'DRAFT — NOT FOR ISSUE',`Basis: ${m.project.basis}, ${m.project.edition||'EDITION UNRESOLVED'}`,`Quantity change records: ${m.hmis.changes.length}. Latest: ${m.hmis.changes.at(-1)?.id||'none'}`,`Generated: ${new Date().toISOString()}`,'Quantities are not automatic code compliance determinations. Do not sum repeated hazard rows or assume owner total equals storage plus use.',...m.hmis.rooms.map(r=>`\nROOM ${r.number} — ${r.name}\nStable ID: ${r.id}\nControl area / grouping: ${r.controlArea||'UNRESOLVED'}; Revit sheet: ${r.sheet||'NOT ASSIGNED'}\nStatus: ${roomStatus(m,r)}${roomStatus(m,r)==='Reviewer validated'?' — '+r.reviewedBy+' at '+r.reviewedAt:''}\n\nCURRENT INVENTORY\n${inventoryText(m,r)}\n\nREVIEWER NOTES\n${r.notes}\n\nREFERENCES\n${r.references||'UNRESOLVED'}\n\nOPEN ITEMS\n${roomIssues(m,r).join('\n')||'None recorded.'}`)].join('\n');
}
