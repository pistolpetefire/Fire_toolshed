#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {workOrder,validateJob,inspectResult,toCase} from './core.mjs';
const [command,input,second,output]=process.argv.slice(2);
const read=async p=>JSON.parse((await readFile(p,'utf8')).replace(/^\uFEFF/,''));
try{
 let result,target;
 if(command==='prepare'){const config=await read(input);result=workOrder(config);result.returnFormat={workOrderId:result.id,model:'Actual provider/model',limitations:['Document limitations'],results:[{checkId:'One entry per assigned check',status:'supported | proposed finding | needs information | unable to verify | not applicable',explanation:'Evidence-based determination',evidence:[{documentId:'D1',page:1,description:'Location and observed condition'}],criteria:[{documentId:'C1',page:1,description:'Edition, section, applicable requirement'}],correction:'Required for a proposed finding',severity:'Critical | Major | Moderate | Minor | Advisory'}]};target=second;}
 else if(command==='finish'){const job=validateJob(await read(input)),r=await read(second);const summary=inspectResult(job,r);result=toCase(job,r);target=output;process.stderr.write(JSON.stringify(summary)+'\n');}
 else if(command==='check'){result=inspectResult(validateJob(await read(input)),await read(second));}
 else throw Error('Usage: node review.mjs prepare config.json assignment.json | finish assignment.json results.json case.json | check assignment.json results.json');
 if(target)await writeFile(target,JSON.stringify(result,null,2),{flag:'wx'});else console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
