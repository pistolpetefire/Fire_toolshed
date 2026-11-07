export function matches(tool,{query='',task='',discipline=''}={}) {
 const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const text=[tool.name,tool.description,...tool.keywords,...tool.disciplines,tool.task].join(' ').toLowerCase();
 return (!task||tool.task===task)&&(!discipline||tool.disciplines.includes(discipline))&&words.every(w=>text.includes(w));
}
if(typeof document!=='undefined'){
 const data=JSON.parse(document.querySelector('#catalog-data').textContent),form=document.querySelector('#filters');
 const params=new URLSearchParams(location.search);for(const key of ['query','task','discipline'])if(params.has(key))form.elements[key].value=params.get(key);
 function render(){const filters=Object.fromEntries(new FormData(form));let n=0;for(const tool of data.tools){const show=matches(tool,filters);document.getElementById('tool-'+tool.id).hidden=!show;if(show)n++;}document.querySelector('#count').textContent=`${n} tools and workflows`;document.querySelector('#empty').hidden=n!==0;const query=new URLSearchParams(Object.entries(filters).filter(([,v])=>v));history.replaceState(null,'',location.pathname+(query.size?'?'+query:'')+location.hash);}
 form.addEventListener('input',render);form.addEventListener('submit',e=>e.preventDefault());document.querySelector('#reset').onclick=()=>{form.reset();render();};
 document.querySelectorAll('[data-task]').forEach(a=>a.onclick=e=>{e.preventDefault();form.elements.task.value=a.dataset.task;render();document.querySelector('#query').focus();});render();
}
