// Pure workspace operations. Source documents, product analysis and located
// inventory have independent identities; an SDS is never a quantity statement.
import {validateSources} from './databases.mjs';
export const WORKSPACE_SCHEMA = 'fireToolshed.sdsWorkspace.v1';
export const OWNER_COLUMNS = {
  inventoryId:'Inventory ID', materialId:'Material ID', product:'Product', manufacturer:'Manufacturer', productNumber:'Product number', sdsRevision:'SDS revision',
  onSite:'On site', building:'Building', room:'Room', controlArea:'Control area', process:'Process / use', quantityBasis:'Quantity basis',
  containerCount:'Container count', containerSize:'Container size', containerUnit:'Container unit', contentsBasis:'Contents basis', containerAllocation:'Container allocation',
  storage:'Storage quantity', closedUse:'Closed-use quantity', openUse:'Open-use quantity', totalQuantity:'Owner total', unit:'Quantity unit', confirmedBy:'Confirmed by', confirmedAt:'Confirmation date', notes:'Notes'
};
const copy = x => structuredClone(x);
const text = x => String(x ?? '').trim();
const norm = x => text(x).toLowerCase().replace(/\s+/g,' ');
const keyText = x => norm(x);
const fail = message => { throw Error(message); };
export const now = () => new Date().toISOString();
export const uid = prefix => prefix + '-' + crypto.randomUUID();
export function hashKey(s) { let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0'); }
export function freshWorkspace(project={}) {
  return {schema:WORKSPACE_SCHEMA,id:uid('WS'),revision:0,createdAt:now(),project:{name:'',number:'',basis:'IBC Chapter 3',edition:'',reviewer:'',jurisdiction:'',occupancy:'',stories:'',sprinkler:'',floor:'',controlAreaNotes:'',...project},sources:[],products:[],inventory:[],receipts:[],packages:[],batches:[],imports:[],audit:[]};
}
export function touch(w,type,detail) { w.revision++;w.audit.push({id:uid('EVENT'),at:now(),type,detail}); }
export function validateWorkspace(w) {
  if(w?.schema!==WORKSPACE_SCHEMA||!w.id||!Number.isSafeInteger(w.revision)||w.revision<0||!w.project)fail('Unsupported SDS workspace.');
  for(const k of ['sources','products','inventory','receipts','packages','batches','imports','audit'])if(!Array.isArray(w[k]))fail('Missing workspace '+k+'.');
  const unique=(rows,label)=>{const ids=new Set();for(const r of rows){if(typeof r.id!=='string'||!r.id||ids.has(r.id))fail('Invalid or duplicate '+label+' ID.');ids.add(r.id);}return ids;};
  for(const k of Object.keys(freshWorkspace().project))if(typeof w.project[k]!=='string')fail('Invalid project '+k);
  if(!['IBC Chapter 3','NFPA 400'].includes(w.project.basis))fail('Invalid code basis.');
  const sources=unique(w.sources,'source'),products=unique(w.products,'material');unique(w.inventory,'inventory');unique(w.receipts,'receipt');unique(w.packages,'package');unique(w.batches,'batch');
  for(const s of w.sources){if(!/^[a-f0-9]{64}$/.test(s.sha256)||!Array.isArray(s.pages)||!Array.isArray(s.segments)||typeof s.name!=='string'||!Number.isFinite(s.bytes)||s.bytes<0||!Number.isSafeInteger(s.pageCount)||s.pageCount<0)fail('Invalid source fingerprint or pages.');}
  for(const p of w.products){for(const k of Object.keys(newProduct('',''))){if(typeof newProduct('','')[k]==='string'&&typeof p[k]!=='string')fail('Invalid material '+k);}for(const h of p.hazards||[]){validateSources(h);for(const k of ['type','classification','sdsEvidence','codeReference','rationale'])if(typeof h[k]!=='string')fail('Invalid hazard '+k);}if(!Array.isArray(p.sdsIds)||p.sdsIds.some(id=>!sources.has(id))||!Array.isArray(p.hazards)||!Array.isArray(p.questions))fail('Material has invalid sources/analysis.');if(p.sourceId&&!sources.has(p.sourceId))fail('Unknown material source.');}
  for(const r of w.inventory){if(!products.has(r.materialId))fail('Inventory refers to an unknown material.');for(const k of ['storage','closedUse','openUse','totalQuantity'])if(r[k]!==null&&(typeof r[k]!=='number'||!Number.isFinite(r[k])||r[k]<0))fail('Inventory quantity must be nonnegative or unknown.');}
  return w;
}
export function newProduct(id,name,sdsIds=[]) {
  return {id,name,manufacturer:'',productNumber:'',sdsRevision:'',cas:'',physicalState:'',components:'',concentration:'',ph:'',incompatibilities:'',generalNotes:'',storageInformation:'',sdsIds,hazards:[],questions:[],reviewedBy:'',reviewedAt:'',identityStatus:'Proposed',readingStatus:'Needs reading',sourceId:'',pageStart:null,pageEnd:null};
}
export function newPackage(w,name) {const p={id:uid('PKG'),name:text(name)||'SDS package',at:now(),status:'Receiving'};w.packages.push(p);touch(w,'Package received',p.id);return p;}
export function receipt(w,packageId,path,outcome,reason='',sourceId='') {
  const r={id:uid('RECEIPT'),packageId,path,outcome,reason,sourceId,at:now()};w.receipts.push(r);return r;
}
export function registerSource(w,meta,packageId,path) {
  const existing=w.sources.find(s=>s.sha256===meta.sha256);
  if(existing){receipt(w,packageId,path,'Exact duplicate','Same SHA-256; original source retained.',existing.id);touch(w,'Duplicate received',existing.id);return {source:existing,duplicate:true};}
  const source={id:uid('SDS'),name:meta.name,sha256:meta.sha256,bytes:meta.bytes,packageId,path,pageCount:0,pages:[],segments:[],status:'Received',error:'',at:now()};
  w.sources.push(source);receipt(w,packageId,path,'Registered','Source saved; reading pending.',source.id);touch(w,'Source registered',source.id);return {source,duplicate:false};
}
export function setExtractedPages(w,sourceId,pages) {
  const s=w.sources.find(s=>s.id===sourceId);if(!s)fail('Unknown source.');
  s.pages=pages.map((p,i)=>({number:i+1,text:text(p.text),needsOcr:!text(p.text)||text(p.text).length<60}));s.pageCount=pages.length;
  s.status=s.pages.some(p=>p.needsOcr)?'Needs OCR / range review':'Review page ranges';s.error='';touch(w,'Source text extracted',sourceId);
}
export function extractIdentity(value) {
  const lines=String(value??'').split('\n').map(text).filter(Boolean);
  const after=patterns=>{for(let i=0;i<lines.length;i++)for(const re of patterns){const m=lines[i].match(re);if(m){const v=text(m[1]);if(v)return v;const next=lines[i+1]||'';if(!/^(?:\d[.:]|SECTION|SAFETY DATA|ADDRESS|TELEPHONE)/i.test(next))return next;}}return '';};
  return {name:after([/^(?:1\.1\.?\s*)?(?:Product (?:identifier|name)|Trade Name)\s*:?\s*(.*)$/i]),manufacturer:after([/^(?:Company name|MANUFACTURER|Manufacturer\/Supplier)\s*:\s*(.*)$/i,/^Company name\s{1,}(.*)$/i]),productNumber:after([/^(?:Product code|Product number|Product No\.)\s*:?\s*(.*)$/i]),sdsRevision:after([/^(?:Issue Date|Revision date|SDS Date of Preparation|SDS Revision Date)\s*:?\s*(.*)$/i]),physicalState:after([/^(?:General Physical Form|Physical state)\s*:\s*(.*)$/i]),cas:[...new Set(String(value).match(/\b\d{2,7}-\d{2}-\d\b/g)||[])].join('; ')};
}
export function suggestSegments(source) {
  const starts=[1];
  for(const p of source.pages){const t=p.text;if(p.number===1||/table of contents/i.test(t))continue;
    if(/^\s*(?:SECTION\s+)?1[\s.:\-]+(?:IDENTIFICATION|PRODUCT AND COMPANY)/im.test(t)&&/product (?:identifier|name)|trade name/i.test(t))starts.push(p.number);
  }
  return starts.map((start,i)=>{const end=(starts[i+1]||source.pageCount+1)-1;return {start,end,kind:'SDS',reason:'',...extractIdentity(source.pages.slice(start-1,end).map(p=>p.text).join('\n'))};});
}
export function confirmSegments(w,sourceId,segments) {
  const s=w.sources.find(s=>s.id===sourceId);if(!s||!s.pageCount)fail('Read this PDF before confirming its page ranges.');
  let next=1;for(const seg of segments){if(!Number.isSafeInteger(seg.start)||!Number.isSafeInteger(seg.end)||seg.start!==next||seg.end<seg.start||seg.end>s.pageCount)fail('Ranges must cover every page once, in order, without gaps or overlaps.');if(!['SDS','Not an SDS'].includes(seg.kind))fail('Choose SDS or Not an SDS.');if(seg.kind==='SDS'&&!text(seg.name))fail('Enter a product name for every SDS range.');if(seg.kind==='Not an SDS'&&!text(seg.reason))fail('Explain every non-SDS range.');next=seg.end+1;}
  if(next!==s.pageCount+1)fail('Every PDF page must be accounted for.');
  const linked=new Set();for(const seg of segments){if(seg.kind!=='SDS'||!seg.materialId)continue;const p=w.products.find(p=>p.id===seg.materialId);if(!p||!p.sdsIds.includes(s.id))fail('Selected existing material is not linked to this source.');if(linked.has(p.id))fail('One material cannot be assigned to two different source ranges.');linked.add(p.id);}
  const existing=w.products.filter(p=>p.sourceId===sourceId);
  for(const seg of segments){const owner=existing.find(p=>p.pageStart===seg.start&&p.pageEnd===seg.end);if(seg.materialId&&owner&&owner.id!==seg.materialId)fail('This range already belongs to another material. Keep its existing identity.');}
  if(existing.some(p=>!segments.some(a=>a.kind==='SDS'&&a.start===p.pageStart&&a.end===p.pageEnd)))fail('This source already has linked material records. Restore the existing ranges or start a separate source revision; analysis/inventory will not be discarded.');
  for(const seg of segments.filter(s=>s.kind==='SDS')){
    let p=seg.materialId?w.products.find(p=>p.id===seg.materialId):existing.find(p=>p.pageStart===seg.start&&p.pageEnd===seg.end);
    if(seg.materialId&&(!p||!p.sdsIds.includes(s.id)))fail('Selected existing material is not linked to this source.');
    if(!p){p=newProduct(uid('MAT'),seg.name,[s.id]);p.sourceId=s.id;p.pageStart=seg.start;p.pageEnd=seg.end;w.products.push(p);}
    p.sourceId=s.id;p.pageStart=seg.start;p.pageEnd=seg.end;
    for(const k of ['name','manufacturer','productNumber','sdsRevision','physicalState','cas'])if(seg[k]!==undefined&&text(seg[k]))p[k]=text(seg[k]);
    p.identityStatus='Confirmed';p.readingStatus=s.pages.slice(seg.start-1,seg.end).some(p=>p.needsOcr)?'Needs OCR':'Text available';p.reviewedBy='';p.reviewedAt='';
  }
  s.segments=copy(segments);s.status='Ranges confirmed';touch(w,'Source ranges confirmed',sourceId);
  return w.products.filter(p=>p.sourceId===sourceId);
}
export function revisionCandidates(w,p) {return w.products.filter(x=>x.id!==p.id&&x.sourceId!==p.sourceId&&((p.productNumber&&keyText(p.productNumber)===keyText(x.productNumber)&&keyText(p.manufacturer)===keyText(x.manufacturer))||keyText(p.name)===keyText(x.name))).map(x=>x.id);}
export function progress(w) {
  return {received:w.receipts.length,registered:w.sources.length,duplicates:w.receipts.filter(r=>r.outcome==='Exact duplicate').length,failed:w.sources.filter(s=>s.status==='Failed').length,unresolvedSources:w.sources.filter(s=>s.status!=='Ranges confirmed').length,materials:w.products.length,needsOcr:w.products.filter(p=>p.readingStatus==='Needs OCR').length,analyzed:w.products.filter(p=>p.hazards.length).length,reviewed:w.products.filter(p=>p.reviewedBy).length,inventory:w.inventory.length,missingInventory:w.products.filter(p=>!w.inventory.some(r=>r.materialId===p.id)).length};
}
export function makeBatch(w,ids) {
  const products=ids.map(id=>w.products.find(p=>p.id===id));if(!products.length||products.some(p=>!p))fail('Select known material records.');
  const b={id:uid('BATCH'),at:now(),materialIds:products.map(p=>p.id),status:'Exported for analysis',basis:copy(w.project)};w.batches.push(b);touch(w,'AI batch exported',b.id);return b;
}
export function analysisPackage(w,batch) {
  return {schema:'fireToolshed.sdsAnalysisBatch.v1',workspaceId:w.id,batchId:batch.id,project:copy(w.project),documents:w.sources.filter(s=>batch.materialIds.some(id=>w.products.find(p=>p.id===id).sdsIds.includes(s.id))).map(({pages,...s})=>({...s})),materials:batch.materialIds.map(id=>{const p=copy(w.products.find(p=>p.id===id));return {...p,storage:null,closedUse:null,openUse:null,totalQuantity:null,unit:'',location:'',process:'',inventorySource:'',roomId:''};})};
}
const ANALYSIS_KEYS=['components','cas','concentration','ph','physicalState','incompatibilities','generalNotes','storageInformation','hazards','questions'];
export function previewAnalysis(w,incoming) {
  const errors=[],rows=[];const seen=new Set();
  if(incoming.workspaceId!==w.id)errors.push('Analysis belongs to another workspace.');
  if(!Array.isArray(incoming.materials))fail('Expected an analysis JSON with a materials array.');
  if(!incoming.project||incoming.project.basis!==w.project.basis||incoming.project.edition!==w.project.edition)errors.push('Analysis code basis/edition does not match this workspace.');
  const batch=incoming.batchId?w.batches.find(b=>b.id===incoming.batchId):null;if(incoming.batchId&&!batch)errors.push('Unknown analysis batch.');
  for(const r of incoming.materials){const p=w.products.find(p=>p.id===r.id),problems=[];if(seen.has(r.id))problems.push('Duplicate result ID.');seen.add(r.id);if(!p)problems.push('Unknown material ID.');if(batch&&!batch.materialIds.includes(r.id))problems.push('Material not in this batch.');
    if(p&&JSON.stringify([...(Array.isArray(r.sdsIds)?r.sdsIds:[])].sort())!==JSON.stringify([...p.sdsIds].sort()))problems.push('Linked SDS IDs changed.');
    if(!Array.isArray(r.hazards)||!Array.isArray(r.questions)||r.questions?.some(x=>typeof x!=='string'))problems.push('Invalid hazards or questions.');
    const hazardKeys=new Set();for(const h of Array.isArray(r.hazards)?r.hazards:[]){if(!h||typeof h!=='object'){problems.push('Invalid hazard.');continue;}for(const k of ['type','classification','sdsEvidence','codeReference','rationale'])if(typeof h[k]!=='string')problems.push('Hazard missing '+k);if(!['Physical','Health','Not applicable','Unassigned'].includes(h.category))problems.push('Assign each hazard category.');try{validateSources(h);}catch(e){problems.push(e.message);}const key=norm(h.type)+'|'+norm(h.classification);if(hazardKeys.has(key))problems.push('Duplicate hazard classification.');hazardKeys.add(key);}
    for(const k of ANALYSIS_KEYS.filter(k=>!['hazards','questions'].includes(k)))if(r[k]!==undefined&&typeof r[k]!=='string')problems.push('Analysis '+k+' must be text.');
    for(const id of Array.isArray(r.sdsIds)?r.sdsIds:[]){const original=w.sources.find(s=>s.id===id),doc=Array.isArray(incoming.documents)?incoming.documents.find(d=>d.id===id):null;if(!doc||!original||doc.sha256!==original.sha256)problems.push('Source fingerprint missing or changed.');}
    rows.push({id:r.id,name:p?.name||r.name||r.id,problems,result:copy(r)});
  }
  const missing=batch?batch.materialIds.filter(id=>!seen.has(id)):[];
  return {kind:'analysis',baseRevision:w.revision,workspaceId:w.id,batchId:batch?.id||'',errors,rows,missing};
}
export function applyAnalysis(w,preview) {
  if(preview.baseRevision!==w.revision||preview.workspaceId!==w.id)fail('Workspace changed. Rebuild the import preview.');
  if(preview.errors.length||preview.rows.some(r=>r.problems.length))fail('Resolve all analysis import errors first.');
  const next=copy(w);
  for(const row of preview.rows){const p=next.products.find(p=>p.id===row.id);for(const k of ANALYSIS_KEYS)if(row.result[k]!==undefined)p[k]=copy(row.result[k]);p.reviewedBy='';p.reviewedAt='';}
  if(preview.batchId){const b=next.batches.find(b=>b.id===preview.batchId);b.status=preview.missing.length?'Partial results - '+preview.missing.length+' missing':'Results imported - review required';}
  touch(next,'Analysis merged',{ids:preview.rows.map(r=>r.id),missing:preview.missing});validateWorkspace(next);return next;
}
const UNITS={gal:['volume',1],gallon:['volume',1],gallons:['volume',1],l:['volume',0.2641720523581484],liter:['volume',0.2641720523581484],liters:['volume',0.2641720523581484],litre:['volume',0.2641720523581484],ml:['volume',0.0002641720523581484],qt:['volume',0.25],pt:['volume',0.125],'fl oz':['volume',1/128],lb:['mass',1],lbs:['mass',1],pound:['mass',1],kg:['mass',2.2046226218487757],g:['mass',0.0022046226218487757],oz:['mass',1/16],each:['count',1],ea:['count',1]};
export function numberOrUnknown(v,label) {if(v===null||v===undefined||text(v)===''||/^unknown$/i.test(text(v)))return null;if(typeof v==='number'){if(Number.isFinite(v)&&v>=0)return v;fail(label+' must be nonnegative.');}const s=text(v);if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(s))fail(label+' must be a number without units or formulas.');return Number(s.replaceAll(',',''));}
export function convertQuantity(value,unit) {const info=UNITS[norm(unit)];if(!info)fail('Unknown unit "'+text(unit)+'". Use gal, L, mL, qt, pt, fl oz, lb, kg, g, oz or each. Mass/volume conversion requires density and is not inferred.');return {value:value===null?null:value*info[1],unit:{volume:'gal',mass:'lb',count:'each'}[info[0]],dimension:info[0]};}
export function ownerRows(w) {
  const rows=[];for(const p of w.products){const inv=w.inventory.filter(r=>r.materialId===p.id);for(const r of inv.length?inv:[{id:'INV-'+p.id+'-01',materialId:p.id}]){
    const o={};for(const k of Object.keys(OWNER_COLUMNS))o[k]='';Object.assign(o,{inventoryId:r.id,materialId:p.id,product:p.name,manufacturer:p.manufacturer,productNumber:p.productNumber,sdsRevision:p.sdsRevision});
    for(const k of Object.keys(OWNER_COLUMNS))if(!['inventoryId','materialId','product','manufacturer','productNumber','sdsRevision'].includes(k)&&r[k]!==undefined)o[k]=r[k];rows.push(o);
  }}return rows;
}
function matchProduct(w,row) {
  if(text(row.materialId)){const p=w.products.find(p=>p.id===text(row.materialId));return p?{id:p.id,method:'Material ID',suggestions:[]}:{id:'',method:'Unknown material ID',suggestions:[]};}
  let hits=w.products.filter(p=>keyText(row.productNumber)&&keyText(row.manufacturer)&&keyText(p.productNumber)===keyText(row.productNumber)&&keyText(p.manufacturer)===keyText(row.manufacturer));
  if(hits.length===1)return {id:hits[0].id,method:'Exact manufacturer + product number',suggestions:[]};
  if(keyText(row.productNumber)&&keyText(row.manufacturer))return {id:'',method:hits.length?'Product number matches multiple revisions — confirm':'Product number not found — confirm',suggestions:hits.map(p=>({id:p.id,name:p.name}))};
  hits=w.products.filter(p=>keyText(row.product)&&keyText(row.manufacturer)&&keyText(p.name)===keyText(row.product)&&keyText(p.manufacturer)===keyText(row.manufacturer));
  if(hits.length===1)return {id:hits[0].id,method:'Exact manufacturer + product name',suggestions:[]};
  const words=norm(row.product).split(/\W+/).filter(x=>x.length>2);const suggestions=w.products.map(p=>({id:p.id,name:p.name,score:words.filter(x=>norm(p.name).includes(x)).length})).filter(p=>p.score).sort((a,b)=>b.score-a.score).slice(0,5);
  return {id:'',method:'Confirm a material match',suggestions};
}
export function previewInventory(w,rows,{name='Owner inventory',fingerprint='',overrides={}}={}) {
  if(fingerprint&&w.imports.some(i=>i.fingerprint===fingerprint))fail('This exact inventory file was already imported. No quantities were applied again.');
  const results=[],seen=new Set();
  for(let index=0;index<rows.length;index++){
    const raw=rows[index],row=Object.fromEntries(Object.keys(OWNER_COLUMNS).map(k=>[k,['storage','closedUse','openUse','totalQuantity','containerCount','containerSize'].includes(k)?raw[k]??'':text(raw[k])])),errors=[],warnings=[];
    const match=matchProduct(w,row);if(Object.hasOwn(overrides,index)){match.id=overrides[index];match.method='Reviewer selected';}
    if(!w.products.some(p=>p.id===match.id))errors.push('Select the correct material; product names and CAS alone are not unique.');
    const statusMap={'yes':'Yes','no':'No longer used','no longer used':'No longer used','duplicate':'Duplicate','unknown':'Unknown','':'Unknown'};const onSite=statusMap[norm(row.onSite)];if(!onSite)errors.push('On site must be Yes, No longer used, Duplicate or Unknown.');
    const id=text(row.inventoryId)||'INV-AUTO-'+encodeURIComponent(JSON.stringify([match.id,norm(row.building),norm(row.room),norm(row.controlArea),norm(row.process)]));
    if(seen.has(id))errors.push('Duplicate inventory ID/location key in this file. Give separate locations/processes distinct Inventory IDs.');seen.add(id);
    const existing=w.inventory.find(r=>r.id===id);if(existing&&existing.materialId!==match.id)errors.push('An existing Inventory ID cannot be reassigned to a different material.');
    const values={};let canonicalUnit='';
    try{
      for(const k of ['storage','closedUse','openUse','totalQuantity'])values[k]=numberOrUnknown(row[k],OWNER_COLUMNS[k]);
      const hasQuantity=Object.values(values).some(v=>v!==null);
      if(hasQuantity&&!text(row.unit))fail('Quantity unit is required for entered quantities.');
      if(text(row.unit)){for(const k of Object.keys(values)){const c=convertQuantity(values[k],row.unit);values[k]=c.value;canonicalUnit=c.unit;}}
      const count=numberOrUnknown(row.containerCount,'Container count'),size=numberOrUnknown(row.containerSize,'Container size');
      if((count===null)!==(size===null))warnings.push('Container count/size is incomplete; contents not calculated.');
      if(count!==null&&size!==null){
        if(!Number.isInteger(count))fail('Container count must be a whole number.');
        if(norm(row.contentsBasis)==='full containers'&&norm(row.quantityBasis)==='maximum expected'){
          const c=convertQuantity(count*size,row.containerUnit),allocation={'storage':'storage','closed use':'closedUse','open use':'openUse'}[norm(row.containerAllocation)];
          if(!allocation)warnings.push('Choose a container allocation before calculated contents can populate storage/use.');
          else{if(canonicalUnit&&canonicalUnit!==c.unit)fail('Container contents and entered quantities have incompatible units; density is not inferred.');canonicalUnit=c.unit;if(values[allocation]===null)values[allocation]=c.value;else if(Math.abs(values[allocation]-c.value)>1e-8)warnings.push('Container calculation differs from the entered '+OWNER_COLUMNS[allocation]+'; entered value retained.');}
        }else warnings.push('Container capacity is not assumed to be actual or maximum contents. Confirm Full containers and Maximum expected before calculation.');
      }
      if(['No longer used','Duplicate'].includes(onSite)&&Object.values(values).some(v=>v!==null&&v!==0))fail('Excluded inventory has positive quantities. Resolve this conflict before import.');
    }catch(e){errors.push(e.message);}
    if(raw._formulaError)errors.push('Spreadsheet formula found in quantity/container cells. Replace it with confirmed numeric values.');
    if(!text(row.building)||!text(row.room))warnings.push('Building/room is missing.');
    if(norm(row.quantityBasis)!=='maximum expected')warnings.push('Quantity basis is not confirmed as Maximum expected.');
    if(!text(row.confirmedBy)||!text(row.confirmedAt))warnings.push('Owner confirmation name/date missing.');
    if(onSite==='Unknown')warnings.push('Owner has not confirmed whether this product is present.');
    if(onSite==='Duplicate'&&!text(row.notes))errors.push('Explain the duplicate and identify the retained inventory record in Notes.');
    const after={...row,...values,id,materialId:match.id,onSite:onSite||'Unknown',quantityBasis:norm(row.quantityBasis)==='maximum expected'?'Maximum expected':text(row.quantityBasis)||'Unknown',unit:canonicalUnit,source:name,importedAt:'',original:copy(row),reviewedBy:'',reviewedAt:''};
    results.push({index,rowNumber:raw._sourceRow||index+2,match,errors,warnings,before:existing?copy(existing):null,after,action:existing?'Update':'Add'});
  }
  return {kind:'inventory',workspaceId:w.id,baseRevision:w.revision,name,fingerprint,rows:results,absent:w.inventory.filter(i=>!results.some(r=>r.after.id===i.id)).map(i=>i.id)};
}
export function applyInventory(w,preview) {
  if(preview.workspaceId!==w.id||preview.baseRevision!==w.revision)fail('Workspace changed. Rebuild the inventory preview.');
  if(preview.rows.some(r=>r.errors.length))fail('Resolve every import error. No inventory rows have been applied.');
  if(preview.fingerprint&&w.imports.some(i=>i.fingerprint===preview.fingerprint))fail('File already imported.');
  const next=copy(w),changes=[];
  for(const row of preview.rows){const after=copy(row.after);after.importedAt=now();const old=next.inventory.findIndex(i=>i.id===after.id);if(old<0)next.inventory.push(after);else next.inventory[old]=after;changes.push({id:after.id,before:row.before,after});}
  const id=uid('IMPORT');next.imports.push({id,at:now(),source:preview.name,fingerprint:preview.fingerprint,rows:preview.rows.length,changes,absentRetained:preview.absent});
  touch(next,'Owner inventory imported',{id,rows:preview.rows.length,absentRetained:preview.absent});validateWorkspace(next);return next;
}
export function assessmentFromWorkspace(w) {
  const materials=[],rooms=[],roomKeys=new Map();
  const roomFor=r=>{if(!r.building||!r.room)return '';const key=JSON.stringify([r.building,r.room,r.controlArea]);if(!roomKeys.has(key)){const id='ROOM-'+encodeURIComponent(key);roomKeys.set(key,id);rooms.push({id,number:r.room,name:r.building,controlArea:r.controlArea||'',sheet:'',notes:'[Complete room, control-area and building review.]',references:'',reviewedBy:'',reviewedAt:'',reviewBasis:''});}return roomKeys.get(key);};
  for(const p of w.products){const all=w.inventory.filter(i=>i.materialId===p.id),active=all.filter(i=>!['No longer used','Duplicate'].includes(i.onSite));
    const located=active.length?active:all.length?[]:[null];
    for(const r of located){materials.push({...copy(p),id:r?r.id:p.id,bulkProductId:p.id,bulkInventoryId:r?.id||'',location:r?[r.building,r.room,r.controlArea].filter(Boolean).join(' / '):'',process:r?.process||'',storage:r?.storage??null,closedUse:r?.closedUse??null,openUse:r?.openUse??null,totalQuantity:r?.totalQuantity??null,unit:r?.unit||'',inventorySource:r?r.source+'; '+r.confirmedBy+'; '+r.confirmedAt:'',roomId:r?roomFor(r):'',questions:[...p.questions,...(r&&r.quantityBasis!=='Maximum expected'?['Inventory is not confirmed as maximum expected.']:[]),...(r?.onSite==='Unknown'?['Owner presence confirmation pending.']:[])],reviewedBy:'',reviewedAt:''});}
  }
  return {schema:'fireToolshed.hazardousMaterials.v1',project:copy(w.project),documents:w.sources.map(s=>({id:s.id,name:s.name,sha256:s.sha256})),materials,hmis:{rooms,changes:[]},bulkWorkspaceId:w.id,bulkInventoryAudit:copy(w.imports),bulkExcludedInventory:w.inventory.filter(r=>['No longer used','Duplicate'].includes(r.onSite))};
}
export function workspaceFromAssessment(m) {
  const w=freshWorkspace(m.project);for(const d of m.documents)w.sources.push({...d,bytes:0,pageCount:0,pages:[],segments:[],status:'Original PDF needed',error:'Import source PDFs to restore local originals.',packageId:'',path:d.name,at:now()});
  for(const r of m.materials){const id=r.bulkProductId||r.id;if(!w.products.some(p=>p.id===id))w.products.push({...newProduct(id,r.name,r.sdsIds),...copy(r),id,sourceId:'',identityStatus:'Confirmed',readingStatus:'Imported analysis - source reading not tracked'});
    if(r.bulkInventoryId||r.location||[r.storage,r.closedUse,r.openUse,r.totalQuantity].some(v=>v!==null&&v!==undefined))w.inventory.push({id:r.bulkInventoryId||'INV-'+r.id,materialId:id,onSite:'Unknown',building:'',room:r.location||'',controlArea:'',process:r.process||'',quantityBasis:'Unknown',storage:r.storage??null,closedUse:r.closedUse??null,openUse:r.openUse??null,totalQuantity:r.totalQuantity??null,unit:r.unit||'',source:r.inventorySource||'Imported assessment',confirmedBy:'',confirmedAt:'',notes:'Check building/room, inventory basis and owner presence after migration.'});
  }
  validateWorkspace(w);return w;
}
