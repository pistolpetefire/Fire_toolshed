import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {fresh,material,validate,invalidate,workbookRows} from './core.mjs';
import {xlsxBytes} from './xlsx.mjs';
import {notesText} from './hmis.mjs';
import {exportName} from '../shared/export-name.mjs';
const [command,input,...rest]=process.argv.slice(2);
try{
 if(command==='prepare'){
  if(!input||!rest.length)throw Error('Usage: node hazardous-materials/run.mjs prepare assessment.json SDS1.pdf SDS2.pdf ...');
  const m=fresh();for(const path of rest){const bytes=await readFile(path);if(bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Expected PDF: '+path);const sha256=createHash('sha256').update(bytes).digest('hex');if(m.documents.some(d=>d.sha256===sha256))continue;const id='SDS-'+String(m.documents.length+1).padStart(3,'0');m.documents.push({id,name:basename(path),sha256});const r=material('MAT-'+String(m.materials.length+1).padStart(3,'0'));r.name=basename(path);r.sdsIds=[id];m.materials.push(r);}await writeFile(input,JSON.stringify(m,null,2),{flag:'wx'});console.log('Prepared '+m.documents.length+' SDS documents. Complete project basis and assess using automation/HAZARDOUS-MATERIALS.md.');
 }else if(command==='check'||command==='export'){
  const m=validate(JSON.parse(await readFile(input,'utf8')));invalidate(m);
  if(command==='export'){const dir=resolve(rest[0]||'.');await mkdir(dir,{recursive:true});await writeFile(join(dir,exportName(m.project,'Hazardous Materials Assessment','xlsx')),xlsxBytes(m));await writeFile(join(dir,exportName(m.project,'Hazardous Materials Assessment')),JSON.stringify(m,null,2));if(m.hmis.rooms.length)await writeFile(join(dir,exportName(m.project,'HMIS Draft Room Notes','txt')),notesText(m));}
  console.log(JSON.stringify({materials:m.materials.length,hazardRows:workbookRows(m)[1].rows.length-1,outstanding:workbookRows(m)[3].rows.length-1,review:'Human validation required'}));
 }else throw Error('Commands: prepare <new.json> <SDS PDFs...> | check <assessment.json> | export <assessment.json> <output-directory>');
}catch(e){console.error(e.message);process.exitCode=1;}
