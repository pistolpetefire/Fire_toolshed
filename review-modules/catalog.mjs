// Original review prompts. Project-selected editions and record documents govern.
export const catalog={
 'fire-alarm-review':{name:'Fire Alarm & Emergency Communications Review',short:'Fire alarm',discipline:'Fire alarm and notification',intro:'Trace detection, notification, power and equipment interfaces from the design basis to acceptance evidence.',basis:['System purpose / protected areas','Occupancy and emergency communication needs','Panel / network architecture','Monitoring and response organization'],documents:['Fire alarm plans, riser and device schedule','Sequence of operations / cause-and-effect matrix','Battery and voltage-drop calculations','Product data, compatibility and listings','Acceptance plan and monitoring requirements'],tools:[['Power extenders & voltage drop','fa-power-extenders']],matrixName:'Cause-and-effect review',matrixHint:'Record one initiating event and expected response per row. Separate actual documented behavior from your review determination.',matrixFields:['Initiating event / condition','Affected equipment / output','Expected operation / response','Delay / priority','Reset / restoration','Drawing / sequence reference'],groups:[
 ['Basis & scope',[
 ['Purpose and governing criteria','Identify adopted editions, amendments, occupancy-specific needs, owner criteria and the system purpose. Record boundaries of this review.'],
 ['Protected areas and system boundaries','Reconcile the protected premises, phased areas, building interfaces and exclusions with plans and specifications.'],
 ['Equipment listing and compatibility','Check submitted devices, panels, modules and software against listing and manufacturer compatibility evidence.']]],
 ['Initiation & detection',[
 ['Detector selection and environment','Review the chosen detection technology against the actual hazard, ambient conditions and manufacturer limitations.'],
 ['Placement and coverage','Check plans and sections for geometry, ceilings, obstructions, air movement and applicable location/spacing criteria.'],
 ['Manual initiation and sprinkler inputs','Coordinate manual initiation, waterflow and supervisory inputs with locations, accessibility and system zoning.']]],
 ['Notification & communications',[
 ['Audibility and acoustic basis','Review room use, ambient sound assumptions, sleeping areas where applicable, acoustic evidence and test method.'],
 ['Visible notification','Review appliance location, room and corridor geometry, candela selection, synchronization and obstructions.'],
 ['Voice intelligibility and coverage','Review acoustically distinguishable spaces, speaker zoning, intelligibility basis, test locations and exclusions.'],
 ['Emergency message priority','Reconcile fire alarm, mass notification and other emergency messages with the approved priority and response strategy.']]],
 ['Power & pathways',[
 ['Battery and secondary power','Trace standby/alarm loads, durations, derating and allowances to selected equipment and governing criteria.'],
 ['Voltage drop and end-device performance','Verify conductor data, circuit loading, source voltage and the limiting appliance operating conditions using submitted calculations.'],
 ['Panel, NAC and SLC capacity','Reconcile device counts, output loading, module capacity, addressing and specified spare capacity.'],
 ['Pathway class and survivability','Review routes, separation, survivability basis, fault isolation and common-mode vulnerabilities.'],
 ['Supervision, grounding and surge protection','Check supervision boundaries, fault annunciation, grounding and surge provisions against the project basis.']]],
 ['Interfaces & sequences',[
 ['Cause-and-effect coordination','Compare the sequence matrix with plans, programming narrative and each interfacing discipline. Use the worksheet below.'],
 ['HVAC, smoke control and dampers','Verify commanded states, feedback, override priorities, failure modes and integrated test responsibilities.'],
 ['Elevators and doors','Coordinate elevator interfaces, door release/locking, power loss behavior and reset responsibilities.'],
 ['Pumps, suppression and emergency power','Coordinate pump signals, suppression releasing/supervision, generator status and emergency power interfaces.']]],
 ['Monitoring & acceptance',[
 ['Monitoring and annunciation','Review signal routing, supervising station, remote annunciation, point identification and response instructions.'],
 ['Record drawings and configuration','Verify device/circuit records, final sequence, software/configuration retention and operation instructions.'],
 ['Acceptance and integrated testing','Identify test methods, witnessing, responsible parties, interface tests, deficiency resolution and turnover evidence.']]]]},
 'sprinkler-review':{name:'Sprinkler & Suppression Submittal Review',short:'Sprinklers',discipline:'Sprinklers, standpipes, and hydraulics',intro:'Follow the hazard and storage basis through drawings, hydraulics, equipment and acceptance requirements.',basis:['Occupancy / hazard classification','Commodity, packaging and storage configuration','System types / protected areas','Design criteria and calculation reference point'],documents:['Sprinkler plans, sections and riser diagrams','Hydraulic calculations and water-supply basis','Commodity / storage / hazard design basis','Product data and installation limitations','Bracing, hanger details and acceptance requirements'],tools:[['Sprinkler estimator','sprinkler-system-estimator'],['Service Line Sizer','service-line-sizer'],['Dry delivery','dry-sprinkler-delivery'],['Seismic bracing','seismic-brace'],['Hanger helper','hanger-helper']],matrixName:'System / design-area review',matrixHint:'Use one row per system, remote area or special storage condition. This records submitted design criteria; it does not calculate or approve them.',matrixFields:['System / remote area','Hazard / commodity / storage','System type / sprinkler model / K-factor','Density / area or listed design basis','Calculated flow / pressure / reference point','Supply scenario / calculation reference'],groups:[
 ['Hazard & criteria',[
 ['Occupancy and hazard basis','Reconcile actual operations and room uses with the submitted classification; identify mixed or changing hazards.'],
 ['Commodity and storage configuration','Record commodity, packaging, plastics, racks/shelves, aisle arrangement, storage height and ceiling geometry.'],
 ['System type and environmental conditions','Review wet, dry, preaction or deluge selection against freezing, operational and project constraints.'],
 ['Design criteria and duration','Trace density/area or listed criteria, hose allowance, duration and any permitted adjustments to selected editions and approvals.'],
 ['ESFR, CMSA and in-rack applications','Review the specific protection arrangement, storage/ceiling limitations, obstructions and required supplementary protection.']]],
 ['Hydraulic review',[
 ['Remote-area selection','Review the hydraulically demanding scenarios, operating sprinkler selection and area shape with the actual layout.'],
 ['Sprinkler flow and pressure','Check model, K-factor, coverage and applicable minimums/limitations against the calculation inputs and listing.'],
 ['Pipe inputs and friction','Verify actual pipe size/material/inside diameter, C values, fittings, equivalent lengths and elevation data.'],
 ['Supply curve and reference point','Reconcile the supply test or pump source with calculation datum, elevation and included upstream losses.'],
 ['Hose allowance and demand margin','Track where hose demand is added; compare supply and required pressure at matching flows and reference points.'],
 ['Backflow and equipment losses','Use applicable device performance data and ensure each loss is included once.'],
 ['Calculation-to-drawing coordination','Check pipe labels, nodes, elevations, valves and sprinkler data between calculations and the current drawing revision.']]],
 ['Layout & installation',[
 ['Coverage, spacing and obstructions','Review plans and sections including beams, ducts, storage, equipment, concealed spaces and omissions.'],
 ['Riser, valves, drains and tests','Review isolation, supervision, drainage, test connections and maintenance/inspection access.'],
 ['FDC and underground interfaces','Coordinate connection arrangement, pressure, signage, underground handoff and fire-department operations.'],
 ['Dry and preaction details','Review trip/delivery basis, air supply, pitch/drainage, detection/releasing logic and failure modes.'],
 ['Hangers, restraints and seismic','Review loads, attachments, seismic basis, bracing/restraints, clearance and structural coordination.'],
 ['Product listing and installation limits','Verify sprinkler, valve and component compatibility, orientation and installation restrictions.']]],
 ['Special conditions & closeout',[
 ['Existing system modifications','Identify existing condition evidence, impairment plan and reuse restrictions. Do not assume former dry pipe can be converted to wet service.'],
 ['Inspection and acceptance tests','Record flushing, testing, witnessing, documentation and project-specific acceptance responsibilities.'],
 ['Turnover and operating limitations','Review record drawings, signage, spare components and any storage/operational limitations needing owner acknowledgment.']]]]},
 'water-supply-review':{name:'Water Supply & Site Fire-Water Review',short:'Water supply',discipline:'Water supply, fire pumps, and tanks',intro:'Review the reliability of the source and trace the supply through underground piping, pumps, storage and fire-department access.',basis:['Supply source / utility / installation','Required demand scenarios and datum','Pump / tank / site-water arrangement','Reliability, impairment and redundancy criteria'],documents:['Flow-test report, layout and utility information','Site utility / hydrant / FDC / valve plans','Supply-demand analysis and hydraulic calculations','Pump curves, driver and controller data','Tank usable-volume basis and acceptance records'],tools:[['Water Supply Path','water-supply'],['Flow test report','flow-test-report'],['Pump + supply overlay','pump-overlay'],['Hydrant loop','hydrant-loop-sizer'],['Fire pump sizing','fire-pump-sizer'],['Tank sizing','fire-tank-sizer'],['Velocity / suction','velocity-suction']],matrixName:'Supply / demand scenario review',matrixHint:'Record units and the same physical reference point for every comparison. Include normal, adverse or impairment scenarios required by the project.',matrixFields:['Scenario / source condition','Test date / source record','Demand flow and included hose','Required pressure / datum','Available pressure at demand / datum','Reliability / margin / evidence reference'],groups:[
 ['Source & test validity',[
 ['Authority and source reliability','Identify utility or installation source, operational restrictions, outages and reliability information supporting the design.'],
 ['Test date and representative conditions','Review age of test, seasonal/operating conditions, known changes and acceptance of the selected supply basis.'],
 ['Hydrant selection and layout','Verify flow and residual hydrant locations, relevant mains, elevations, valves and flow path.'],
 ['Gauges, readings and method','Check equipment records, static/residual pairing, discharge measurements, pitot coefficients and test method documentation.'],
 ['Curve assumptions and extrapolation','Review curve construction, adjustments, extrapolated ranges and uncertainty; distinguish field readings from derived values.']]],
 ['Demand & available pressure',[
 ['Applicable demand scenarios','Identify sprinkler, standpipe, hydrant and other demands required to operate together under the project criteria.'],
 ['Common reference point','Align source and demand elevations, datum and flow; show which main, device and equipment losses are included.'],
 ['Demand-versus-supply margin','Review margin at relevant operating points, adverse conditions and any required reserve without double-counting allowances.'],
 ['Operational limits and reliability','Review minimum/maximum pressures, source operating limits, single-break or redundancy conditions and impairment consequences.']]],
 ['Pumps & storage',[
 ['Pump duty and full curve','Review selected rating and manufacturer curve against demand, suction conditions, applicable flow-range checks and discharge limits.'],
 ['Driver, controller and power','Coordinate driver loading, power/fuel availability, controllers, monitoring and emergency operating needs.'],
 ['Suction arrangement','Review source geometry, pipe arrangement, velocities, air/vortex issues and equipment installation requirements.'],
 ['Pressure maintenance','Review jockey/pressure-maintenance basis, controls, setpoints and interaction with fire-pump operation.'],
 ['Usable water and duration','Reconcile demand, required duration, unusable volume, refill assumptions and tank nominal capacity.'],
 ['Tank siting and environmental conditions','Review access, freezing, structural/site coordination, level monitoring and maintenance provisions.']]],
 ['Site-water interfaces',[
 ['Underground mains and lead-ins','Review materials, sizes, routing, loop connections, restraints and building connection details.'],
 ['Isolation and backflow','Review valve arrangement/supervision, sectional isolation, backflow location, orientation and loss basis.'],
 ['Hydrants and FDCs','Coordinate locations, access, supply paths, identification, protection and fire-department operational requirements.'],
 ['Civil and apparatus access coordination','Reconcile utilities and water facilities with access roads, turning, building approach and site constraints.'],
 ['Impairment and single-break scenarios','Identify isolation consequences, unavailable protection areas and required redundancy/mitigation evidence.'],
 ['Acceptance and turnover','Review flushing/testing, pump/tank acceptance, utility coordination, witness requirements and record documents.']]]]}
};
export const paths=Object.keys(catalog);
