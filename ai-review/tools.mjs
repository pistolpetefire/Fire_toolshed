// Pure tools: callers retain documents and supply provenance-tagged inputs.
export const VERSION='1.0.0';
function positive(x,name){if(!Number.isFinite(x)||x<=0)throw Error(name+' must be positive and finite.');}
function point(p){if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite))throw Error('Coordinates must be finite [x,y] pairs.');return p;}
function distance(a,b){point(a);point(b);return Math.hypot(b[0]-a[0],b[1]-a[1]);}
export function measureRoute({documentId,page,viewport,unitsPerCoordinate,unit,verification,points}){
 if(!documentId||!Number.isInteger(page)||page<1||!viewport?.id||!['ft','m','in','mm'].includes(unit))throw Error('Document, page, viewport and supported output unit required.');
 positive(unitsPerCoordinate,'Scale');if(!Array.isArray(viewport.bounds)||viewport.bounds.length!==4||!viewport.bounds.every(Number.isFinite))throw Error('Viewport requires [xmin,ymin,xmax,ymax].');
 const [xmin,ymin,xmax,ymax]=viewport.bounds;if(xmax<=xmin||ymax<=ymin)throw Error('Invalid viewport bounds.');
 const within=p=>{point(p);if(p[0]<xmin||p[0]>xmax||p[1]<ymin||p[1]>ymax)throw Error('Point outside selected viewport; split mixed-scale routes.');};
 if(!verification?.source?.trim()||!Array.isArray(verification.points)||verification.points.length!==2)throw Error('A labeled-dimension reference and its endpoints are required.');
 positive(verification.length,'Known dimension');verification.points.forEach(within);
 const checked=distance(...verification.points)*unitsPerCoordinate,error=Math.abs(checked-verification.length)/verification.length;
 // Numerical consistency gate, not an engineering/code tolerance.
 if(error>0.01)throw Error('Scale differs from the labeled dimension by more than 1%; resolve calibration.');
 if(!Array.isArray(points)||points.length<2)throw Error('At least two route points required.');points.forEach(within);
 const segments=points.slice(1).map((p,i)=>distance(points[i],p)*unitsPerCoordinate);
 return {tool:'measure_route',version:VERSION,documentId,page,viewportId:viewport.id,unit,length:segments.reduce((a,b)=>a+b,0),segments,scaleCheckRelativeError:error,limitations:['Measures supplied polyline only; does not identify walls, legal routes, obstacles or code compliance.','Caller must extract digital scale and use one coordinate system for viewport, calibration and route.']};
}
export function compareValues({quantity,unit,observations,tolerance=0}){
 if(!quantity||!unit||!Number.isFinite(tolerance)||tolerance<0||!Array.isArray(observations)||observations.length<2)throw Error('Quantity, common unit, nonnegative tolerance and two observations required.');
 for(const x of observations)if(!Number.isFinite(x.value)||x.unit!==unit||!x.documentId||!Number.isInteger(x.page)||x.page<1||!x.reference)throw Error('Each observation needs a finite value, matching unit, document/page and location reference.');
 const values=observations.map(x=>x.value),spread=Math.max(...values)-Math.min(...values);
 return {tool:'compare_values',version:VERSION,quantity,unit,spread,tolerance,conflict:spread>tolerance,observations,limitation:'Difference detection only; caller must establish same system, scenario, revision and datum. No source is automatically authoritative.'};
}
export function coverage({expectedIds,results}){
 if(!Array.isArray(expectedIds)||!expectedIds.length||expectedIds.some(x=>typeof x!=='string')||new Set(expectedIds).size!==expectedIds.length||!Array.isArray(results))throw Error('Unique expected checks and results required.');
 const seen=new Set();for(const r of results){if(!expectedIds.includes(r.checkId)||seen.has(r.checkId))throw Error('Unknown or duplicate check.');if(!['supported','proposed finding','needs information','unable to verify','not applicable'].includes(r.status)||!r.explanation?.trim())throw Error('Document a valid status and explanation.');seen.add(r.checkId);}
 const missing=expectedIds.filter(x=>!seen.has(x));const unresolved=results.filter(x=>['needs information','unable to verify'].includes(x.status)).map(x=>x.checkId);
 return {tool:'review_coverage',version:VERSION,total:expectedIds.length,returned:seen.size,missing,unresolved,allChecksAddressed:!missing.length,allChecksResolved:!missing.length&&!unresolved.length,notice:'Coverage is not compliance or FPE approval.'};
}
export const tools={measure_route:measureRoute,compare_values:compareValues,review_coverage:coverage};
