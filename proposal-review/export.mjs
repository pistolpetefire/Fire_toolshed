#!/usr/bin/env node
import {readFile,writeFile,access} from 'node:fs/promises';
import {parse,readiness} from './core.mjs';
import {documentBytes} from './docx.mjs';
const [command,input,prefix]=process.argv.slice(2);
try{const m=parse(await readFile(input,'utf8'));if(command==='check')console.log(JSON.stringify(readiness(m),null,2));else if(command==='export'&&prefix){const paths=['summary','rfis'].map(k=>`${prefix}-${k}.docx`);for(const p of paths){let exists=true;try{await access(p);}catch(e){if(e.code!=='ENOENT')throw e;exists=false;}if(exists)throw Error('Refusing to overwrite '+p);}for(const [i,kind] of ['summary','rfis'].entries())await writeFile(paths[i],documentBytes(m,kind),{flag:'wx'});console.log(paths.join('\n'));}else throw Error('Usage: node proposal-review/export.mjs check input.json | export input.json output-prefix');}catch(e){console.error(e.message);process.exitCode=1;}
