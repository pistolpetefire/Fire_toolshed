import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {fresh,material,validate,review,invalidate} from './core.mjs';
import {newRoom,recordQuantities,roomStatus,reviewRoom,notesText} from './hmis.mjs';

const m=validate(fresh());assert.deepEqual(m.hmis,{rooms:[],changes:[]});
m.project.edition='Synthetic test criteria';m.project.reviewer='Test reviewer';
m.documents.push({id:'D1',name:'Synthetic SDS',sha256:'a'.repeat(64)});
for(const [id,area] of [['R1','CA1'],['R2','CA1'],['R3','CA2']]){
 const room=newRoom(id);Object.assign(room,{number:id,name:'Synthetic '+id,controlArea:area,notes:'Synthetic safeguards reviewed for test only.',references:'Synthetic criteria and calculation reference.'});m.hmis.rooms.push(room);
 const r=material('M'+id);Object.assign(r,{name:'Synthetic '+id,roomId:id,location:id,physicalState:'Liquid',unit:'gal',storage:55,closedUse:0,openUse:0,totalQuantity:55,inventorySource:'Test inventory',sdsIds:['D1'],hazards:[{type:'Synthetic hazard',classification:'Test class',category:'Physical',sdsEvidence:'D1 p1 test',codeReference:'Synthetic criteria',rationale:'Test only',databaseChecks:[{database:'Test',url:'https://example.org/test',accessed:'2026-01-01',identity:'Test material',evidence:'Synthetic evidence',result:'Supports hazard'}]}]});m.materials.push(r);
}
validate(m);m.materials.forEach(r=>review(m,r,'Test reviewer'));
assert.throws(()=>reviewRoom(m,'R1','Test reviewer',false));
m.hmis.rooms.forEach(r=>reviewRoom(m,r.id,'Test reviewer',true));
assert.ok(notesText(m,{approved:true}).includes('REVIEWER-VALIDATED RECORD'));
const values={storage:110,closedUse:0,openUse:0,totalQuantity:110,unit:'gal'};
const saved=JSON.stringify(m);
assert.throws(()=>recordQuantities(m,'MR1',values,'','Revision B','C1'));
assert.throws(()=>recordQuantities(m,'MR1',{...values,storage:-1},'Change','Revision B','C1'));
assert.equal(JSON.stringify(m),saved,'Failed transactions must not mutate the assessment.');
recordQuantities(m,'MR1',values,'Late owner increase','Revision B dated 2026-01-02','C1');
assert.equal(m.hmis.changes[0].snapshot.materials[0].storage,55);
assert.equal(m.hmis.changes[0].snapshot.hmis.rooms[0].reviewedBy,'Test reviewer');
assert.equal(m.materials[0].reviewedBy,'');
assert.equal(m.hmis.rooms[0].notes,'Synthetic safeguards reviewed for test only.');
assert.ok(m.hmis.rooms.every(r=>roomStatus(m,r).startsWith('Recheck required')),'Shared area and other building rooms must be rechecked.');
assert.throws(()=>notesText(m,{approved:true}));
assert.ok(notesText(m).includes('Storage: 110 gal'));
assert.ok(notesText(m).includes('closed-system use: 0 gal'));
review(m,m.materials[0],'Test reviewer');m.hmis.rooms.forEach(r=>reviewRoom(m,r.id,'Test reviewer',true));
assert.ok(notesText(m,{approved:true}));
recordQuantities(m,'MR1',{...values,storage:null},'Quantity unconfirmed','Owner notice','C2');
assert.equal(m.hmis.changes[1].snapshot.materials[0].storage,110);
assert.equal(m.hmis.changes[1].snapshot.hmis.changes.length,0,'Snapshots must not grow recursively.');
assert.equal(m.hmis.changes[0].snapshot.materials[0].storage,55);
assert.ok(notesText(m).includes('Storage: UNKNOWN'));
assert.throws(()=>reviewRoom(m,'R1','Test reviewer',true));
const roundtrip=validate(JSON.parse(JSON.stringify(m)));assert.equal(roundtrip.hmis.changes.length,2);
recordQuantities(roundtrip,'MR1',{storage:55,closedUse:0,openUse:0,totalQuantity:55,unit:'gal'},'Return to original amount','Test inventory','C3');
assert.ok(roundtrip.hmis.rooms.every(r=>roomStatus(roundtrip,r).startsWith('Recheck required')),'Returning to an earlier quantity must not resurrect its approval.');
invalidate(roundtrip);assert.ok(roundtrip.hmis.rooms.every(r=>roomStatus(roundtrip,r)==='Pending review'));
const legacy=material('LEGACY');delete legacy.roomId;const old=fresh();old.materials.push(legacy);validate(old);assert.equal(legacy.roomId,'');
const malformed=structuredClone(m);malformed.materials[0].roomId='UNKNOWN';assert.throws(()=>validate(malformed));
const duplicate=structuredClone(m);duplicate.hmis.rooms.push(duplicate.hmis.rooms[0]);assert.throws(()=>validate(duplicate));
// Direct edits from AI files cannot retain current approval merely by keeping a revision number.
const direct=JSON.parse(saved);direct.materials[0].storage=500;assert.throws(()=>notesText(direct,{approved:true}));
const edited=JSON.parse(saved);edited.hmis.rooms[0].notes+=' Changed safeguard.';assert.throws(()=>notesText(edited,{approved:true}));
const reassigned=JSON.parse(saved);reassigned.materials[0].roomId='R2';assert.throws(()=>notesText(reassigned,{approved:true}));
const unknown=JSON.parse(saved);unknown.materials.push(material('Unassigned'));assert.throws(()=>reviewRoom(unknown,'R1','Test reviewer',true));
console.log('PASS legacy compatibility, quantity transaction history, unknown versus zero, shared-area/building recheck, stale export gate, immutable snapshots, review reset and portable JSON.');
const temp=await mkdtemp(join(tmpdir(),'toolshed-hmis-'));
try{
 const input=join(temp,'review.json');await writeFile(input,saved);
 execFileSync(process.execPath,[fileURLToPath(new URL('run.mjs',import.meta.url)),'export',input,temp]);
 const text=await readFile(join(temp,'Unnamed Project - HMIS Draft Room Notes.txt'),'utf8');assert.ok(text.includes('DRAFT — NOT FOR ISSUE'));assert.ok(text.includes('Status: Pending review'));assert.ok(!text.includes('REVIEWER-VALIDATED RECORD'));
 console.log('PASS CLI draft room-note handoff clears approval claims.');
}finally{await rm(temp,{recursive:true,force:true});}
