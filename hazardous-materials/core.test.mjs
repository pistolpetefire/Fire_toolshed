import assert from 'node:assert/strict';
import {fresh,material,validate,issues,review,invalidate,workbookRows} from './core.mjs';
import {xlsxBytes} from './xlsx.mjs';
import {databaseStatus} from './databases.mjs';
import {mkdtemp,writeFile,readFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const m=fresh();m.project.name='Synthetic software fixture';m.project.edition='TEST — not engineering criteria';m.documents=[{id:'D1',name:'Synthetic SDS.pdf',sha256:'a'.repeat(64)}];const r=material('M1');Object.assign(r,{name:'Synthetic multi-hazard material',physicalState:'Liquid',location:'Test room',process:'Test process',storage:10,closedUse:0,openUse:2,unit:'gal',inventorySource:'Synthetic inventory',sdsIds:['D1'],hazards:[{type:'Test hazard B',classification:'Synthetic class',sdsEvidence:'D1, section 2, p.1; synthetic evidence',codeReference:'Test criteria only',rationale:'Software fixture only'},{type:'Test hazard A',classification:'Synthetic class',sdsEvidence:'D1, section 9, p.2; synthetic evidence',codeReference:'Test criteria only',rationale:'Software fixture only'}]});m.materials.push(r);
for(const h of r.hazards)h.databaseChecks=[{database:'Synthetic database',url:'https://example.org/test-record',accessed:'2026-01-01',identity:'Synthetic identity match',evidence:'Synthetic supporting properties, not chemical data',result:'Supports hazard'}];validate(m);assert.equal(issues(m,r).length,0);review(m,r,'Test reviewer');assert.equal(r.reviewedBy,'Test reviewer');const rows=workbookRows(m);assert.equal(rows[1].rows.length,3);assert.equal(rows[1].rows[1][0],'Test hazard A');assert.equal(rows[2].rows.length,2);assert.equal(rows[1].rows[1][7],10);assert.equal(rows[1].rows[2][7],10);assert.equal(rows[1].rows[1][8],0);
r.hazards[0].databaseChecks[0].result='Conflicts with hazard';assert.throws(()=>review(m,r,'Test reviewer'));r.hazards[0].databaseChecks[0].result='Supports hazard';r.hazards[0].databaseChecks[0].url='javascript:alert(1)';assert.throws(()=>review(m,r,'Test reviewer'));r.hazards[0].databaseChecks[0].url='https://example.org/test-record';invalidate(m);assert.equal(r.reviewedBy,'');r.storage=null;assert.ok(issues(m,r).some(x=>x.includes('storage quantity')));assert.throws(()=>review(m,r,'Test reviewer'));r.storage=-1;assert.throws(()=>validate(m));r.storage=10;r.sdsIds=['missing'];assert.throws(()=>validate(m));r.sdsIds=['D1'];r.hazards.push({...r.hazards[0]});assert.throws(()=>validate(m));r.hazards.pop();
r.name='=HYPERLINK("https://invalid.example")';const bytes=xlsxBytes(m);const text=new TextDecoder().decode(bytes);assert.ok(text.includes('t="inlineStr"'));assert.ok(!text.includes('<f>'));assert.ok(text.includes('autoFilter'));assert.ok(text.includes('state="frozen"'));assert.ok(text.includes('Hazard register'));assert.equal(bytes[0],80);assert.equal(bytes[1],75);
const unknown=material('M2');m.materials.push(unknown);assert.ok(workbookRows(m)[1].rows.some(x=>x[0]==='UNCLASSIFIED'));m.project.basis='NFPA 400';validate(m);m.project.basis='made up';assert.throws(()=>validate(m));
console.log('PASS hazard duplication, unique inventory, unknown versus zero, review gating, source integrity, both bases and safe XLSX strings.');
const safeConclusion={type:'No applicable code hazard identified',databaseChecks:[{...r.hazards[0].databaseChecks[0],result:'Not found'}]};assert.equal(databaseStatus(safeConclusion),'Not corroborated');safeConclusion.databaseChecks[0].result='Supports no-hazard conclusion';assert.equal(databaseStatus(safeConclusion),'Corroborated');safeConclusion.type='Test hazard A';assert.equal(databaseStatus(safeConclusion),'Not corroborated');
const temp=await mkdtemp(join(tmpdir(),'toolshed-sds-'));
try{
 const cli=fileURLToPath(new URL('run.mjs',import.meta.url)),a=join(temp,'a.pdf'),b=join(temp,'b.pdf'),file=join(temp,'assessment.json');
 await writeFile(a,'%PDF-1.4\nSynthetic file A');await writeFile(b,'%PDF-1.4\nSynthetic file B');
 execFileSync(process.execPath,[cli,'prepare',file,a,b,a]);
 const intake=JSON.parse(await readFile(file,'utf8'));assert.equal(intake.documents.length,2);assert.equal(intake.materials.length,2);validate(intake);
 const duplicate=structuredClone(intake);duplicate.materials.push(duplicate.materials[0]);assert.throws(()=>validate(duplicate));
 assert.throws(()=>execFileSync(process.execPath,[cli,'prepare',file,a],{stdio:'pipe'}));
 execFileSync(process.execPath,[cli,'export',file,join(temp,'out')]);await access(join(temp,'out','Unnamed Project - Hazardous Materials Assessment.xlsx'));
 console.log('PASS batch PDF intake, fingerprint deduplication, duplicate material rejection, overwrite protection and CLI export.');
}finally{await rm(temp,{recursive:true,force:true});}
