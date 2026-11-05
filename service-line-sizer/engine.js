/* Fire Toolshed Service Line Sizer. Pure, deterministic calculation interface. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FireServiceSizer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const version = '1.3.0';
  const sizes = [2.5, 3, 4, 6, 8, 10, 12];
  const ids = { sch40: [2.469,3.068,4.026,6.065,7.981,10.020,11.938], sch10: [2.635,3.260,4.260,6.357,8.249,10.420,12.390] };
  const defaults = {
    schemaVersion: 1, project: '', preparedBy: '', basis: 'ufc', system: 'wet', pump: false, sizingMode: 'known',
    demandGpm: 500, upstreamHoseGpm: 250, leadHoseGpm: 0, requiredPsi: 40,
    supplyMode: 'fixed', availablePsi: 85, staticPsi: 100, residualPsi: 80, testGpm: 1000,
    leadLengthFt: 100, leadFittingsFt: 30, leadElevationFt: 0, leadC: 120, leadMaterial: 'sch40', minLeadIn: 6,
    riserLengthFt: 20, riserFittingsFt: 30, riserElevationFt: 20, riserC: 120, riserMaterial: 'sch40', minRiserIn: 3,
    leadTargetFps: 10, riserTargetFps: 15, marginPsi: 5, valveLossPsi: 3,
    bfpType: 'dc', bfpLossPsi: 8, bfpCurve: null, bfpLocation: 'indoor', bfpOrientation: 'horizontal',
    pumpRatedGpm: 750, pumpDischargePsi: 100, suctionMinPsi: 20,
    notes: '', hazardEstimate: null
  };
  const velocity = (q,d) => 0.4085*q/(d*d);
  const friction = (q,c,d,l) => 4.52*Math.pow(q,1.85)*l/(Math.pow(c,1.85)*Math.pow(d,4.87));
  function pipeId(size, material) {
    if (material === 'pvc18') {
      const od = {4:4.8,6:6.9,8:9.05,10:11.1,12:13.2}[size];
      return od ? od*(1-2/18) : null;
    }
    return ids[material]?.[sizes.indexOf(size)] || null;
  }
  function validate(x) {
    const e = [];
    if (!x || typeof x !== 'object' || Array.isArray(x)) return ['Input must be a JSON object.'];
    for (const k of Object.keys(x)) if (!Object.hasOwn(defaults,k)) e.push('Unknown field: '+k);
    for (const k of Object.keys(defaults)) if (!(k in x) && !['bfpLocation','bfpOrientation','sizingMode','hazardEstimate'].includes(k)) e.push('Missing field: '+k);
    if(x.hazardEstimate != null && x.sizingMode==='quick') {try {hazardDemand(x.basis,x.system,x.hazardEstimate);}catch(err){e.push(err.message);}}
    if(x.sizingMode !== undefined && !['quick','known'].includes(x.sizingMode)) e.push('Invalid sizing mode.');
    if(x.bfpLocation !== undefined && !['indoor','outdoor'].includes(x.bfpLocation)) e.push('Invalid BFP location.');
    if(x.bfpOrientation !== undefined && !['horizontal','vertical'].includes(x.bfpOrientation)) e.push('Invalid BFP orientation.');
    if (x.schemaVersion !== 1) e.push('schemaVersion must be 1.');
    for (const [k,list] of Object.entries({basis:['nfpa','ufc'],system:['wet','dry','single','double','non','deluge'],supplyMode:['fixed','test'],leadMaterial:['sch40','sch10','pvc18'],riserMaterial:['sch40','sch10'],bfpType:['dc','rp']}))
      if (!list.includes(x[k])) e.push('Invalid '+k+'.');
    if (typeof x.pump !== 'boolean') e.push('pump must be true or false.');
    for (const k of ['project','preparedBy','notes']) if (typeof x[k] !== 'string' || x[k].length > 4000) e.push(k+' must be text, at most 4000 characters.');
    const positive = ['demandGpm','testGpm','leadC','riserC','leadTargetFps','riserTargetFps','pumpRatedGpm'];
    for (const k of Object.keys(defaults).filter(k => typeof defaults[k] === 'number' && k !== 'schemaVersion')) {
      if(k==='demandGpm' && x.sizingMode==='quick' && x.hazardEstimate) continue;
      if (typeof x[k] !== 'number' || !Number.isFinite(x[k])) {e.push(k+' must be a finite number.');continue;}
      if (positive.includes(k) ? x[k] <= 0 : !['leadElevationFt','riserElevationFt'].includes(k) && x[k] < 0) e.push(k+' is outside its allowed range.');
      if (Math.abs(x[k]) > 1000000) e.push(k+' is too large.');
    }
    for (const k of ['leadC','riserC']) if (x[k] < 80 || x[k] > 150) e.push(k+' must be 80–150.');
    for (const k of ['minLeadIn','minRiserIn']) if (!sizes.includes(x[k])) e.push(k+' must be an available nominal size.');
    if (x.supplyMode === 'test' && !(x.staticPsi > x.residualPsi && x.residualPsi > 0)) e.push('Flow test requires static > residual > 0.');
    if (x.bfpCurve !== null) {
      const c=x.bfpCurve;
      if (!c || typeof c !== 'object' || typeof c.model !== 'string' || !c.model.trim() || !sizes.includes(c.sizeIn) || !Array.isArray(c.points) || c.points.length < 2 || c.points.length > 100) e.push('BFP curve requires model, sizeIn, and 2–100 [gpm, psi] points.');
      else c.points.forEach((p,i) => { if (!Array.isArray(p) || p.length !== 2 || p.some(v=>typeof v !== 'number'||!Number.isFinite(v)||v<0) || (i>0 && (!Array.isArray(c.points[i-1]) || p[0]<=c.points[i-1][0]))) e.push('BFP curve points must be nonnegative, strictly increasing in flow.'); });
    }
    return e;
  }
  function curveLoss(c,q) {
    const p=c.points;
    if(q<p[0][0]||q>p[p.length-1][0]) return null;
    for(let i=1;i<p.length;i++) if(q<=p[i][0]) return p[i-1][1]+(p[i][1]-p[i-1][1])*(q-p[i-1][0])/(p[i][0]-p[i-1][0]);
    return null;
  }
  function evaluate(x) {
    const errors=validate(x);
    if(errors.length) return {version,status:'invalid',errors};
    x={bfpLocation:'indoor',bfpOrientation:'horizontal',sizingMode:'known',...x};
    const quick=x.sizingMode==='quick';
    const hazardCalculation=quick && x.hazardEstimate ? hazardDemand(x.basis,x.system,x.hazardEstimate) : null;
    if(hazardCalculation) x={...x,demandGpm:hazardCalculation.estimatedRiserGpm};
    if(hazardCalculation?.hoseGpm) x.upstreamHoseGpm=Math.max(x.upstreamHoseGpm,hazardCalculation.hoseGpm-x.leadHoseGpm);
    const warnings = ['Company sizing rule: lead-in and BFP match; lead-in is one catalog size above the riser until the lead-in reaches 10 inches. Pairs above that cutoff are 10/10 or 12/12; hydraulic checks still govern.', 'Preliminary sizing only. Complete hydraulic design, listed equipment selection, maximum working pressure and applicable project criteria remain required.'];
    const ufc=x.basis==='ufc';
    if(!x.pump){
      warnings.push('BFP arrangement: '+x.bfpLocation+', '+x.bfpOrientation+'. Use a model listed for this orientation and accepted by the water authority. Arrangement choices do not automatically change entered lengths, elevations or device losses.');
      if(x.bfpLocation==='outdoor') warnings.push('Outdoor BFP: provide freeze protection where required, service access and protection from flooding/physical damage. A drawn enclosure does not establish suitability.');
      if(x.bfpType==='rp') warnings.push('RP assembly: provide an approved air gap and drainage sized for the manufacturer’s relief discharge; do not submerge the relief outlet.');
    }
    if(hazardCalculation?.storage) warnings.push(hazardCalculation.notes);
    const riserQ=x.demandGpm;
    const fireLeadQ=riserQ+x.leadHoseGpm;
    const leadQ=x.pump ? Math.max(fireLeadQ,1.5*x.pumpRatedGpm) : fireLeadQ;
    const supplyQ=leadQ+x.upstreamHoseGpm;
    const available=x.supplyMode==='fixed' ? x.availablePsi : x.staticPsi-(x.staticPsi-x.residualPsi)*Math.pow(supplyQ/x.testGpm,1.85);
    if(!quick && x.supplyMode==='test' && supplyQ>x.testGpm) warnings.push('Supply curve is extrapolated beyond tested flow. Obtain a test supporting the evaluated flow before relying on this estimate.');
    if(quick) warnings.unshift('EARLY ESTIMATE — sizes use estimated flow, pipe inside diameter and velocity targets only. No pressure adequacy, supply capacity or final hydraulic demand has been established.');
    if(hazardCalculation&&!hazardCalculation.storage) warnings.push('Hazard estimate uses rounded whole-head coverage, a remote-head pressure floor and '+hazardCalculation.allowancePct+'% estimating allowance. This is not a balanced sprinkler-network calculation. Remote-head pressure is NOT riser demand pressure. Hose distribution remains an independent project input.');
    const floor=ufc ? (x.bfpType==='rp'?12:8) : 0;
    let bfpLoss=x.pump ? 0 : Math.max(floor,x.bfpLossPsi);
    if(!x.pump && x.bfpCurve) {
      const measured=curveLoss(x.bfpCurve,riserQ);
      if(measured===null) return {version,status:'invalid',errors:['Demand is outside the BFP curve. Extrapolation is not allowed.']};
      bfpLoss=Math.max(floor,measured);
    }
    if(!x.pump && !x.bfpCurve) warnings.push('BFP size is a provisional connection size matching the lead-in; entered loss is an allowance, not a manufacturer rating. Verify the selected assembly at this flow.');
    if(x.pump) warnings.push('Pump mode excludes BFP selection and pump performance. Riser supply is the entered discharge pressure at demand, after any discharge-side BFP. Verify NFPA 20 arrangement and certified pump curve separately.');
    if(['dry','double','deluge'].includes(x.system)) warnings.push('Dry/double-interlock/deluge demand and delivery requirements must be established separately. This modeled riser ends on the water-filled side of the system valve; it does not model downstream dry piping or water delivery time.');
    if(['single','non'].includes(x.system)) warnings.push('Preaction release, supervision and delivery requirements are outside this water-filled service estimate.');
    warnings.push('Required outlet pressure must exclude the lead-in, BFP, riser, valve loss and reserve modeled here. Exterior hose flow branches at the selected location.');
    if(ufc) warnings.push('UFC 2026 is applied with the requested NFPA 13 (2022) project basis. Confirm the adopted edition and service-specific/project exceptions.');
    const leadLimit=ufc?Math.min(10,x.leadTargetFps):x.leadTargetFps;
    const inletMin=ufc?Math.max(20,x.pump?x.suctionMinPsi:0):(x.pump?x.suctionMinPsi:0);
    const leads=sizes.filter(s=>s>=x.minLeadIn && pipeId(s,x.leadMaterial)).map(s=>({sizeIn:s,idIn:pipeId(s,x.leadMaterial)}));
    const risers=sizes.filter(s=>s>=x.minRiserIn).map(s=>({sizeIn:s,idIn:pipeId(s,x.riserMaterial)}));
    let candidates=[];
    for(const l of leads) for(const r of risers) {
      const lv=velocity(leadQ,l.idIn),rv=velocity(riserQ,r.idIn);
      const ll=friction(leadQ,x.leadC,l.idIn,x.leadLengthFt+x.leadFittingsFt);
      const rl=friction(riserQ,x.riserC,r.idIn,x.riserLengthFt+x.riserFittingsFt);
      const inlet=available-ll-.433*x.leadElevationFt;
      const outlet=(x.pump?x.pumpDischargePsi:inlet-bfpLoss)-rl-.433*x.riserElevationFt-x.valveLossPsi;
      const margin=outlet-x.requiredPsi-x.marginPsi;
      const policyLead=r.sizeIn>=10?r.sizeIn:sizes[sizes.indexOf(r.sizeIn)+1];
      const pass=l.sizeIn===policyLead && (!x.bfpCurve || x.pump || x.bfpCurve.sizeIn===l.sizeIn) && r.sizeIn<=l.sizeIn && lv<=leadLimit+1e-9 && rv<=x.riserTargetFps+1e-9 && (quick || (inlet>=inletMin-1e-9 && margin>=-1e-9)) && (!ufc || !x.pump || riserQ<=1.4*x.pumpRatedGpm);
      candidates.push({leadIn:l.sizeIn,riserIn:r.sizeIn,bfpIn:x.pump?null:(x.bfpCurve?.sizeIn||l.sizeIn),leadIdIn:l.idIn,riserIdIn:r.idIn,leadFps:lv,riserFps:rv,leadLossPsi:quick?null:ll,riserLossPsi:quick?null:rl,inletPsi:quick?null:inlet,outletPsi:quick?null:outlet,remainingPsi:quick?null:margin,pass});
    }
    // Smallest lead first, then smallest riser. Explicit ordering avoids implying installed-cost optimization.
    const selected=candidates.find(c=>c.pass)||null;
    const staticBudget=(x.pump?x.pumpDischargePsi:available-.433*x.leadElevationFt-bfpLoss)-.433*x.riserElevationFt-x.valveLossPsi-x.requiredPsi-x.marginPsi;
    let status=selected?(quick?'quick-estimate':'estimate'):'no-fit';
    if(!quick && !selected && (staticBudget<0 || available-.433*x.leadElevationFt<inletMin)) status='insufficient-supply';
    if(!quick && !selected && Math.abs(staticBudget)<1e-8) status='no-friction-budget';
    if(ufc && x.pump && riserQ>1.4*x.pumpRatedGpm) {status='pump-demand-limit';warnings.push('Suppression demand exceeds 140% of rated pump capacity (UFC 9-5.4).');}
    return {version,status,errors:[],selected,candidates,flow:{riserGpm:riserQ,leadGpm:leadQ,supplyGpm:supplyQ},hazardCalculation,storageSupply:hazardCalculation?.durationMin?{hoseGpm:x.upstreamHoseGpm+x.leadHoseGpm,durationMin:hazardCalculation.durationMin,volumeGal:(riserQ+x.upstreamHoseGpm+x.leadHoseGpm)*hazardCalculation.durationMin}:null,pressureChecked:!quick,availablePsi:quick?null:available,bfpLossPsi:bfpLoss,leadLimitFps:leadLimit,inletMinimumPsi:inletMin,staticBudgetPsi:quick?null:staticBudget,warnings};
  }
  // UFC 2026 Table 9-1 nonstorage planning demand; user must establish applicability.
  function ufcDemand(hazard,system,height) {
    if(!['light','ordinary','extra'].includes(hazard)||!['wet','dry','single','double','non','deluge'].includes(system)||!Number.isFinite(height)||height<=0||height>100) throw Error('Select a nonstorage hazard and a ceiling height above 0 and at most 100 ft.');
    const dry=['dry','double','deluge'].includes(system), extra=hazard==='extra';
    if(height>60 && dry) throw Error('UFC Table 9-1 provides no dry-system criterion above 60 ft.');
    let density,area;
    if(height>60) {density=.6;area=1200;}
    else if(extra && height>45) {density=.5;area=dry?4000:3000;}
    else if(extra && height>30) {density=.3;area=dry?4600:3600;}
    else if(extra) {density=.3;area=dry?3500:2500;}
    else if(hazard==='light' && height<=30) {density=.1;area=1500;}
    else {density=.2;area=dry?3500:2500;}
    return {density,area,sprinklerGpm:density*area,hoseGpm:extra||height>60?500:250,durationMin:extra?90:60};
  }
  function hazardDemand(basis,system,h) {
    if(!h || typeof h!=='object' || Array.isArray(h)) throw Error('Hazard estimate must be an object.');
    if(['budget1100','budget1300','budget1400','esfr40'].includes(h.hazard)) return storageDemand(basis,system,h);
    const names={light:'Light hazard',oh1:'Ordinary hazard Group 1',oh2:'Ordinary hazard Group 2',eh1:'Extra hazard Group 1',eh2:'Extra hazard Group 2'};
    if(!names[h.hazard] || !['nfpa','ufc'].includes(basis) || !['wet','dry','single','double','non','deluge'].includes(system)) throw Error('Choose a supported hazard, criteria and system type.');
    for(const k of ['heightFt','minPressurePsi','allowancePct']) if(typeof h[k]!=='number'||!Number.isFinite(h[k])) throw Error('Hazard '+k+' must be a finite number.');
    if(h.heightFt<=0||h.heightFt>100||h.minPressurePsi<7||h.minPressurePsi>175||h.allowancePct<0||h.allowancePct>100) throw Error('Hazard inputs: height >0 to 100 ft, pressure floor 7–175 psi, allowance 0–100%.');
    const extra=h.hazard.startsWith('eh'),group=h.hazard==='light'?'light':extra?'extra':'ordinary';
    let density,area,kDefault,kMinimum=null,areaFactor=1;
    if(basis==='ufc') {
      const d=ufcDemand(group,system,h.heightFt);density=d.density;area=d.area;
      kMinimum=h.heightFt>60?14:h.heightFt>30?11.2:extra?11.2:group==='ordinary'?8:5.6;
      kDefault=kMinimum;
    } else {
      if(h.heightFt>30) throw Error('NFPA preset scope is ceilings up to 30 ft. Use project-specific criteria and manual demand above this height.');
      if(system==='deluge') throw Error('NFPA deluge demand requires the actual open-sprinkler area. Use manual demand for this system.');
      const preset={light:[.1,1500,5.6],oh1:[.15,1500,5.6],oh2:[.2,1500,8],eh1:[.3,2500,11.2],eh2:[.4,2500,11.2]}[h.hazard];
      [density,area,kDefault]=preset;
      areaFactor=['dry','double'].includes(system)?1.3:1;
      area*=areaFactor;
    }
    const k=h.kFactor==null?kDefault:h.kFactor,coverage=h.coverageFt2==null?(extra?100:group==='ordinary'?130:150):h.coverageFt2;
    if(typeof k!=='number'||!Number.isFinite(k)||k<=0||k>40)throw Error('K-factor must be above 0 and at most 40.');
    if(kMinimum!==null&&k<kMinimum)throw Error('UFC Table 9-1 requires at least K'+kMinimum+' for this hazard/height.');
    if(typeof coverage!=='number'||!Number.isFinite(coverage)||coverage<=0||coverage>225)throw Error('Coverage must be above 0 and at most 225 ft²/head; confirm the actual listing and spacing rules.');
    const heads=Math.ceil(area/coverage),headFlow=Math.max(density*coverage,k*Math.sqrt(h.minPressurePsi));
    const remotePressurePsi=(headFlow/k)**2,unadjustedGpm=heads*headFlow;
    return {hazard:h.hazard,label:names[h.hazard],basis,density,designAreaFt2:area,areaFactor,kFactor:k,kMinimum,coverageFt2:coverage,headCount:heads,roundedAreaFt2:heads*coverage,headFlowGpm:headFlow,remotePressurePsi,minPressurePsi:h.minPressurePsi,densityAreaGpm:density*area,unadjustedGpm,allowancePct:h.allowancePct,estimatedRiserGpm:Math.ceil(unadjustedGpm*(1+h.allowancePct/100)),notes: h.heightFt>60?'UFC high-ceiling response/listing requirements remain applicable. No quick-response area reduction applied.':'No quick-response or room-design reduction applied; coverage and allowance are estimating inputs.'};
  }
  function storageDemand(basis,system,h) {
    if(!['nfpa','ufc'].includes(basis)) throw Error('Unsupported service criteria.');
    if(system!=='wet') throw Error('Storage examples support wet systems only. Use project-calculated demand for dry/preaction storage.');
    if(!Number.isFinite(h.allowancePct)||h.allowancePct<0||h.allowancePct>100) throw Error('Allowance must be 0–100%.');
    if(h.fm!==undefined && typeof h.fm!=='boolean') throw Error('FM comparison must be true or false.');
    const esfr=h.hazard==='esfr40',fm=esfr&&h.fm===true;
    const heads=esfr?(fm?9:12):null,k=esfr?25.2:null,pressure=esfr?(fm?40:25):null;
    const base=esfr?heads*k*Math.sqrt(pressure):Number(h.hazard.slice(6));
    return {storage:true,hazard:h.hazard,label:esfr?(fm?'FM storage · 40 ft roof':'ESFR planning example · 40 ft roof'):'Planning flow band · '+base+' gpm',basis:fm?'FM DS 8-9 Table 8':'Planning assumption',density:null,designAreaFt2:null,coverageFt2:null,roundedAreaFt2:null,headCount:heads,kFactor:k,headFlowGpm:esfr?k*Math.sqrt(pressure):null,remotePressurePsi:pressure,unadjustedGpm:base,allowancePct:h.allowancePct,estimatedRiserGpm:Math.ceil(base*(1+h.allowancePct/100)),hoseGpm:esfr?250:null,durationMin:esfr?60:null,
      notes:esfr?(fm?'FM DS 8-9 Table 8: Class 4/cartoned unexpanded plastic, open-frame racks, aisles at least 4 ft; wet, nominal 160°F QR pendent K25.2. Confirm full table applicability, flues and sprinkler approval.':'Budget assumption: 12 K25.2 heads at 25 psi, roof up to 40 ft and storage up to 35 ft; Class I–IV/cartoned unexpanded plastics in qualifying open racks or piles. Confirm NFPA 13 (2022) storage criteria and selected listing before design.')+' Hose allowance is a minimum total, allocated upstream unless assigned to the lead-in. Inside hose and simultaneous in-rack demand are NOT included; use Known demand for those combined calculations. Volume is gross demand × duration, not tank capacity.': 'Planning flow allowance only; this is not a hazard classification or an approved storage design. Identify commodity, storage arrangement and final sprinkler criteria.'};
  }
  return {version,defaults,sizes,pipeId,velocity,friction,validate,evaluate,ufcDemand,hazardDemand};
});
