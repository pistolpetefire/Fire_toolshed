import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const base=fileURLToPath(new URL('.',import.meta.url)),tmp=mkdtempSync(join(tmpdir(),'toolshed-cli-'));
try{
 const dest=join(tmp,'case.json');const args=[join(base,'review.mjs'),'finish',join(base,'demo/assignment.json'),join(base,'demo/results.json'),dest];
 let r=spawnSync(process.execPath,args,{encoding:'utf8'});assert.equal(r.status,0,r.stderr);const c=JSON.parse(readFileSync(dest,'utf8'));assert.equal(c.candidateItems.length,1);assert.equal(c.findings.length,0);assert.equal(c.checklistItems.length,21);
 r=spawnSync(process.execPath,args,{encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/EEXIST/);
 r=spawnSync(process.execPath,[join(base,'run.mjs')],{input:JSON.stringify({tool:'storage_demand',arguments:{flowGpm:500,durationMinutes:60}}),encoding:'utf8'});assert.equal(JSON.parse(r.stdout).result.usableGallons,30000);
 console.log('PASS executable result-to-case handoff, overwrite protection and tool runner.');
}finally{rmSync(tmp,{recursive:true,force:true});}
