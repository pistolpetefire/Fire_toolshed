#!/usr/bin/env node
// No file hosting, network access or credentials. One JSON request on stdin.
import {tools} from './tools.mjs';
let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>2000000)throw Error('Request too large.');}
try{const request=JSON.parse(input);if(!Object.hasOwn(tools,request.tool))throw Error('Unknown tool');console.log(JSON.stringify({ok:true,result:tools[request.tool](request.arguments)}));}catch(e){console.log(JSON.stringify({ok:false,error:e.message}));process.exitCode=1;}
