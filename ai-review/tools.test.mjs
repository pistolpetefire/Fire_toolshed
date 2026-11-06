import assert from 'node:assert/strict';
import {measureRoute,compareValues,coverage} from './tools.mjs';
const q={documentId:'D1',page:2,viewport:{id:'plan-A',bounds:[0,0,200,200]},unitsPerCoordinate:0.1,unit:'ft',verification:{points:[[0,0],[100,0]],length:10,source:'Dimension A-B'},points:[[0,0],[30,0],[30,40]]};
assert.equal(measureRoute(q).length,7);assert.equal(measureRoute({...q,points:[[0,0],[30,40]]}).length,5);
assert.throws(()=>measureRoute({...q,unitsPerCoordinate:0.2}),/Scale differs/);assert.throws(()=>measureRoute({...q,points:[[0,0],[201,0]]}),/viewport/);assert.throws(()=>measureRoute({...q,verification:null}),/dimension/);
const o=[{value:100,unit:'gpm',documentId:'D1',page:1,reference:'Schedule'},{value:120,unit:'gpm',documentId:'D2',page:1,reference:'Calculation'}];assert.equal(compareValues({quantity:'Flow',unit:'gpm',observations:o}).conflict,true);assert.throws(()=>compareValues({quantity:'Flow',unit:'psi',observations:o}),/matching unit/);
const r=coverage({expectedIds:['A','B'],results:[{checkId:'A',status:'unable to verify',explanation:'No legible plan'}]});assert.deepEqual(r.missing,['B']);assert.equal(r.allChecksResolved,false);assert.throws(()=>coverage({expectedIds:['A'],results:[{checkId:'B',status:'supported',explanation:'x'}]}),/Unknown/);
console.log('PASS route geometry, calibration rejection, viewport boundary, missing scale, unit mismatch and incomplete review coverage.');
