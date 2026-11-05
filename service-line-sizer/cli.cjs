#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),engine=require('./engine.js');
try {const raw=JSON.parse(fs.readFileSync(process.argv[2]||0,'utf8'));const out=engine.evaluate(raw.input||raw);console.log(JSON.stringify(out,null,2));process.exitCode=out.status==='invalid'?2:0;}
catch(e){console.error(JSON.stringify({status:'invalid',errors:[e.message]}));process.exitCode=2;}
