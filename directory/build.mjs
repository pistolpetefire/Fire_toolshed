import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),catalog=JSON.parse(await readFile(new URL('catalog.json',import.meta.url),'utf8'));
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
const tasks=[...new Set(catalog.tools.map(t=>t.task))],disciplines=[...new Set(catalog.tools.flatMap(t=>t.disciplines))].sort();
const option=x=>`<option>${esc(x)}</option>`;
const badgeClass=task=>{
  if(task==='Calculate')return 'badge-calculate';
  if(task==='Review')return 'badge-review';
  if(task==='Collect field information')return 'badge-field';
  if(task==='Prepare a report')return 'badge-report';
  if(task==='Learn')return 'badge-learn';
  return '';
};
const cardClass=task=>{
  if(task==='Calculate')return 'card-calculate';
  if(task==='Review')return 'card-review';
  if(task==='Collect field information')return 'card-field';
  if(task==='Prepare a report')return 'card-report';
  if(task==='Learn')return 'card-learn';
  return '';
};

const featuredIds = ['water-supply','hazardous-materials'];
const featured = featuredIds.map(id => catalog.tools.find(t => t.id === id)).filter(Boolean);
const featuredHtml = featured.length ? `<section class="featured-section" aria-label="Featured workflows"><h2>Start here</h2><p class="section-desc">The two workflows most people need first. Everything else is below.</p><div class="grid featured-grid">${featured.map(t => `<article class="card featured-card ${cardClass(t.task)}" id="featured-${esc(t.id)}"><span class="badge ${badgeClass(t.task)}">Featured · ${esc(t.task)}</span><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><a href="${esc(t.url)}">Open ${esc(t.name)} →</a></article>`).join('')}</div></section>` : '';

const card=t=>`<article class="card ${cardClass(t.task)}" id="tool-${esc(t.id)}"><span class="badge ${badgeClass(t.task)}">${esc(t.task)} · ${esc(t.status)}</span><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><a href="${esc(t.url)}">Open ${esc(t.name)} →</a></article>`;
const group=(task,title,desc)=>{
  const items=catalog.tools.filter(t=>t.task===task);
  if(!items.length)return '';
  return `<section class="category-section" data-task="${esc(task)}"><h2>${esc(title)} <span class="badge ${badgeClass(task)}">${items.length}</span></h2><p class="section-desc">${esc(desc)}</p><div class="grid">${items.map(card).join('\n')}</div></section>`;
};
const sections=[
  group('Calculate','Calculators','Number tools for sizing, demand, hydraulics, egress, and screening. Enter values, get results, export a report.'),
  group('Review','Review workflows','Structured checklists and case files for design QC, shop submittals, hazardous materials, and proposal review. Evidence stays with your documents.'),
  group('Collect field information','Field data collection','Forms for requesting and recording hydrant flow tests and other site information.'),
  group('Prepare a report','Report tools','Assemble findings, summaries, and deliverable packages from completed work.'),
  group('Learn','Learning & practice','Study aids, games, and practice materials.')
].join('');
const shell=(title,depth,body,script='')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Fire protection tools and evidence-based workflows for people and AI."><link rel="alternate" type="application/json" href="${depth}directory/catalog.json" title="Shared tool catalog"><link rel="stylesheet" href="${depth}directory/style.css"><title>${title} · Fire Toolshed</title></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="${depth}">FIRE TOOLSHED</a><nav aria-label="Main navigation"><a href="${depth}">Find a tool</a><a href="${depth}automation/">AI & Automation</a><a href="${depth}peer-review/">Review case</a><a href="${depth}?task=Learn">Learning</a></nav></header><main id="main">${body}</main><footer>Shared tools. Human judgment. Project-selected requirements govern. Files stay in your browser or your chosen AI environment; export files for backup.</footer>${script}</body></html>`;
await writeFile(new URL('index.html',root),shell('Find a tool','./',`<section class="hero"><span class="eyebrow">Fire protection engineering</span><h1>Find the right tool.<br>Move the project forward.</h1><p>Calculators for numbers. Review workflows for checklists and case files. Search or jump to a category.</p><div class="quick-links"><a href="#calculators">Calculators</a><a href="#review">Review</a><a href="#field">Field data</a><a href="./automation/">AI & Automation</a></div></section>${featuredHtml}<div class="workflow-nav" aria-label="Start a workflow"><a href="./water-supply/" style="background:#dbeafe;border-color:#3b82f6">Combined Water Supply Path</a><a href="./hazardous-materials/" style="background:#fef3c7;border-color:#d97706">Hazmat SDS to HMIS</a><a href="./proposal-review/">Review an RFP</a><a href="./shop-review/">Review shop submittals</a><a href="./peer-review/">Manage design QC</a><a href="#calculators">Run a calculation</a></div><form class="filters" id="filters" role="search"><label>Search<input id="query" name="query" type="search" placeholder="Try battery, tank, sprinkler, QC or proposal"></label><label>Type<select name="task"><option value="">All types</option>${tasks.map(option).join('')}</select></label><label>Focus area<select name="discipline"><option value="">All focus areas</option>${disciplines.map(option).join('')}</select></label></form><div class="actions"><span id="count" role="status">${catalog.tools.length} tools</span><button class="secondary" id="reset" type="button">Clear filters</button><a href="./tools-guide.html">Detailed tools guide</a></div><noscript><p>Search requires JavaScript. All tools are listed below.</p></noscript><p id="empty" hidden>No matches. Try fewer words or clear the filters.</p><div id="tool-sections">${sections}</div>`,`<script id="catalog-data" type="application/json">${JSON.stringify(catalog).replace(/</g,'\\u003c')}</script><script type="module" src="./directory/search.mjs"></script>`));
const workflows=JSON.parse(await readFile(new URL('automation/workflows.json',root),'utf8'));
await writeFile(new URL('automation/index.html',root),shell('AI and Automation','../',`<section class="hero"><span class="eyebrow">The AI entrance</span><h1>Same tools.<br>Explicit workflows.</h1><p>Give your AI the start instructions below. Choose a workflow, supply the complete document package, and return evidence for reviewer validation.</p><a class="button" href="./START-HERE.md">Start here for AI</a></section><section class="panel"><h2>What is available</h2><p>Review checklists and proposal records support AI-assisted work. The existing calculation runner exposes selected arithmetic tools. Reading this page does not execute a review: your AI environment must read documents and run the required tools. This site has no hosted AI service, API or shared file storage.</p><div class="actions"><a href="../directory/catalog.json">Shared tool catalog</a><a href="./workflows.json">Workflow manifest</a><a href="../ai-review/tool-directory.json">Executable calculation tools</a><a href="../ai-review/pilot-kit.zip">Download execution kit</a></div></section><h2>Choose a workflow</h2><div class="grid">${workflows.workflows.map(w=>`<article class="card"><span class="badge">${esc(w.status)} · ${esc(w.execution)}</span><h3>${esc(w.name)}</h3><p>${esc(w.description)}</p><a href="${esc(w.instructions)}">Read workflow instructions →</a><a href="${esc(w.humanUrl)}">Open human workspace →</a></article>`).join('')}</div><h2>Available to people and AI</h2><p>These entries come from the same catalog as the human directory. Browser tools are references unless an execution adapter is explicitly listed.</p><ul>${catalog.tools.filter(t=>t.automation.mode!=='browser').map(t=>`<li><a href=".${esc(t.url)}">${esc(t.name)}</a> — ${esc(t.automation.mode)}</li>`).join('')}</ul>`));
console.log(`Built human and AI entrances from ${catalog.tools.length} shared entries.`);
