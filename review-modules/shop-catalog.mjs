// Additive modules: existing checklist IDs and saved review files remain unchanged.
export const shopIntake = ['Package and governing basis', [
 ['Package completeness and revisions','Inventory the full shop package: plans, calculations, product data, listings and required certifications. Record filenames, dates, revisions and missing attachments. Distinguish submitted documents from the original design baseline and governing criteria.'],
 ['Original design baseline','Identify issued design drawings, specifications, addenda, accepted RFIs and approved changes. Record revision precedence and scope. Do not treat an unapproved substitution as an accepted change.'],
 ['Applicable requirements register','Extract standards, editions, amendments, jurisdiction, owner, UFC and specific FM data sheet numbers/revisions from design documents with page references. Identify applicability and missing source text. Do not assume the latest edition or that the most stringent requirement automatically governs.'],
 ['Conflicting or unavailable requirements','Flag missing editions, conflicting requirements and inaccessible criteria for reviewer resolution. Evaluate available evidence and mark affected checks unable to verify; do not invent section numbers or limits.'],
 ['Baseline and criteria comparison','For each discrepancy identify the shop sheet/page, baseline sheet/specification, applicable criterion and requested correction. Distinguish deviation from design, criterion discrepancy, missing evidence and potential baseline design error. Agreement with design alone is not evidence of code compliance.'],
 ['Resubmittal and reviewer validation','Identify review round, previous comments, submitter responses and changed sheets. Recheck affected calculations and interfaces. AI proposes dispositions; the reviewer verifies each closure. Do not silently close unanswered comments.']
]];
const extinguisherGroups = [
 ['Selection and distribution',[
  ['Hazards and extinguisher selection','Identify actual fire hazards and applicable extinguisher class, rating, agent and listing from the selected NFPA 10 edition, project criteria and product data.'],
  ['Coverage and travel distance','Evaluate quantity, distribution and actual accessible travel routes against supplied criteria using legible drawings and verified dimensions. Do not infer travel distance from text extraction.'],
  ['Placement and accessibility','Check mounting, visibility, identification, cabinets, access and environmental suitability against the selected requirements and manufacturer data.'],
  ['Special hazards and coordination','Review special agents, equipment hazards and interfaces with other protection systems. Record scope boundaries and unresolved conditions.']]],
 ['Documents and turnover',[
  ['Schedule and product coordination','Reconcile plans, schedules, quantities, ratings, brackets and cabinets with specifications and submitted product data.'],
  ['Inspection and maintenance provisions','Identify required installation/acceptance records, inspection and maintenance responsibilities, instructions and applicable personnel qualifications.']]]
];
export function shopModules(base) {
 const definitions = [
  ['sprinkler-shop-review','Sprinkler Shop Submittal Review','Sprinkler shops','sprinkler-review','NFPA 13'],
  ['fire-alarm-shop-review','Fire Alarm Shop Submittal Review','Alarm shops','fire-alarm-review','NFPA 72'],
  ['standpipe-shop-review','Standpipe Shop Submittal Review','Standpipe shops','standpipe-review','NFPA 14'],
  ['extinguisher-shop-review','Fire Extinguisher Submittal Review','Extinguishers',null,'NFPA 10']
 ];
 return Object.fromEntries(definitions.map(([id,name,short,source,standard])=>{
  const parent=source?structuredClone(base[source]):{discipline:'Portable fire extinguishers',basis:['Hazards / use','Extinguisher classes and ratings','Distribution and access'],documents:['Extinguisher plans and schedules','Product data, ratings, listings and mounting details'],tools:[],matrixName:'Location and requirement comparison',matrixHint:'One row per area or special hazard. Record evidence and unresolved requirements.',matrixFields:['Area / hazard','Submitted extinguisher / rating','Baseline requirement','Criterion / edition / section','Plan / product reference','Discrepancy / response'],groups:extinguisherGroups};
  return [id,{...parent,name,short,intro:`Compare the full submittal with issued design documents and project-selected ${standard}, UFC, FM and other applicable requirements. Reviewer validation is required.`,basis:[...parent.basis,'Baseline revisions / approved changes','Applicable standards / editions / UFC / FM sheets','Review round / prior comment references'],documents:['Original design drawings and specifications','Addenda, accepted RFIs and approved changes','Governing criteria text and requirements register','Submittal index and prior comment responses',...parent.documents],groups:[structuredClone(shopIntake),...parent.groups]}];
 }));
}
