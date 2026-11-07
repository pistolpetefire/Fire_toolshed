// Windows-safe, readable filenames. File naming never changes the JSON schema.
export function exportName(project,workflow,extension='json'){
 const clean=value=>String(value??'').replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().replace(/[. ]+$/g,'').slice(0,120).trim();
 const name=clean(project?.name)||clean(project?.number)||'Unnamed Project';
 return `${name} - ${clean(workflow)||'Review'}.${extension}`;
}
export function reviewKind(record){
 const ids=[record?.moduleId,...(record?.moduleReceipts||[]).map(r=>r.moduleId)].filter(Boolean);
 if(ids.length)return ids.every(id=>id.endsWith('-shop-review'))?'Shop Submittal':'Review';
 return record?.project?.reviewWorkflow==='Shop Submittal'?'Shop Submittal':'Review';
}
export function moduleLabel(record){
 const id=record.moduleId||'',system=({'fire-alarm':'Fire Alarm',sprinkler:'Sprinkler',standpipe:'Standpipe',extinguisher:'Fire Extinguisher','water-supply':'Water Supply','life-safety':'Life Safety','g-sheet':'Building Code'})[id.replace(/-shop-review$|-review$/g,'')];
 return reviewKind(record)+(system?' - '+system:'');
}
