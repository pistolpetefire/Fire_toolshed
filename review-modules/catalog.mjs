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
Object.assign(catalog,{
  "life-safety-review": {
    "name": "Life Safety & Egress Plan Review",
    "short": "Life safety",
    "discipline": "Occupant load, egress, and life safety",
    "intro": "Trace occupant loads and exit routes from each occupied space through final discharge, with documented criteria and plan evidence.",
    "basis": [
      "Occupancy / actual uses / population",
      "Governing life-safety and building-code editions",
      "New / existing / alteration scope",
      "Evacuation strategy / accessibility / special occupants"
    ],
    "documents": [
      "Life-safety plans and occupant-load schedule",
      "Architectural plans, sections and door/stair schedules",
      "G-sheet code analysis and adopted criteria",
      "Emergency lighting and exit-sign plans",
      "Accessibility, locking and special-use narratives"
    ],
    "tools": [
      [
        "Occupant Load & Egress",
        "occupant-egress"
      ],
      [
        "Travel Distance",
        "travel-distance"
      ],
      [
        "G-Sheet Code Review",
        "g-sheet-review"
      ]
    ],
    "matrixName": "Space / exit-route review",
    "matrixHint": "Use one row per space or route. Record units, criteria citations and actual provided values; do not combine incompatible code methods. This is a review record, not an automatic compliance calculation.",
    "matrixFields": [
      "Space / floor / route / plan revision",
      "Use / area / load factor / calculated occupants",
      "Required vs provided exits / capacity / width",
      "Travel / common path / dead end: measured vs permitted",
      "Door / stair / accessible route / discharge",
      "Governing citations / G-sheet reference"
    ],
    "groups": [
      [
        "Basis & population",
        [
          [
            "Governing criteria and scope",
            "Record applicable editions, amendments, existing-building provisions and review boundaries."
          ],
          [
            "Actual use and occupancy",
            "Compare the room labels with intended activities, occupant characteristics and occupancy basis."
          ],
          [
            "Occupant-load calculation",
            "Trace net/gross areas, factors, fixed seating and rounding to the selected criteria and current plans."
          ],
          [
            "Cumulative and shared loads",
            "Track occupants joining shared routes, stairs and discharge paths; reconcile floor and building totals."
          ],
          [
            "Special occupant needs",
            "Review assisted evacuation, sleeping, detention, healthcare or other special-use assumptions where applicable."
          ]
        ]
      ],
      [
        "Routes & capacity",
        [
          [
            "Exit number and availability",
            "Compare required and provided independent exits for each space and story under documented criteria."
          ],
          [
            "Exit separation and arrangement",
            "Review remoteness, route choice and loss of a single route using actual plan geometry."
          ],
          [
            "Travel distance",
            "Trace the actual walking path and measurement endpoints; compare measured distance with the applicable limit and basis."
          ],
          [
            "Common path of travel",
            "Identify where independent choices become available and document the measurement and applicable limit."
          ],
          [
            "Dead-end corridors",
            "Identify dead ends and verify length, configuration and any claimed allowance."
          ],
          [
            "Egress width and capacity",
            "Compare required and clear provided widths by component, including pinch points and permitted capacity factors."
          ],
          [
            "Stair and discharge convergence",
            "Trace combined loads at converging routes and changes in available capacity."
          ]
        ]
      ],
      [
        "Components & protection",
        [
          [
            "Doors and hardware",
            "Review clear opening, swing, maneuvering, hardware and operation for the actual occupant load and use."
          ],
          [
            "Locks and access control",
            "Review release conditions, power-loss behavior, emergency operation and fire-alarm interfaces."
          ],
          [
            "Stairs and ramps",
            "Review geometry, landings, headroom, guards and handrails against the governing provisions."
          ],
          [
            "Accessible means of egress",
            "Review the required accessible routes, refuge/assistance provisions and communication arrangements."
          ],
          [
            "Exit enclosures and continuity",
            "Follow rated enclosures, openings and penetrations through each floor to termination."
          ],
          [
            "Exit discharge",
            "Verify continuity to the required safe destination, capacity, exterior conditions and any interior-discharge basis."
          ]
        ]
      ],
      [
        "Coordination & evidence",
        [
          [
            "Emergency lighting",
            "Review coverage, power arrangements and acceptance evidence along required routes."
          ],
          [
            "Exit signs and wayfinding",
            "Review sign placement, visibility, directional changes and consistency with exit routes."
          ],
          [
            "Special arrangements and phased work",
            "Review atriums, assembly layouts, temporary routes, phased occupancy and approved alternative strategies."
          ],
          [
            "G-sheet and discipline consistency",
            "Reconcile loads, exit counts, sprinkler assumptions and rated routes with the code summary and other disciplines."
          ]
        ]
      ]
    ]
  },
  "g-sheet-review": {
    "name": "G-Sheet Building & Fire Code Analysis Review",
    "short": "G-sheet",
    "discipline": "Occupant load, egress, and life safety",
    "intro": "Reconcile the building code summary with the actual building, life-safety plans, specifications and fire-protection design.",
    "basis": [
      "Jurisdiction / adopted editions / amendments",
      "Project type / scope / existing-building approach",
      "Occupancies / mixed-use strategy",
      "Construction type / sprinkler basis / special conditions"
    ],
    "documents": [
      "G-sheet building and fire code summary",
      "Architectural plans, elevations and area schedules",
      "Life-safety plans and occupant/egress schedules",
      "Rated assemblies, opening and penetration details",
      "Fire-protection specifications and special-condition analyses"
    ],
    "tools": [
      [
        "Life Safety & Egress Review",
        "life-safety-review"
      ],
      [
        "Hazard Screening",
        "ibc-ifc-hazard"
      ],
      [
        "MAQ / Control Areas",
        "maq-control-area"
      ],
      [
        "Sprinkler Review",
        "sprinkler-review"
      ]
    ],
    "matrixName": "Code-summary / drawing reconciliation",
    "matrixHint": "Use one row per code claim, building portion or floor. Record the permitted criterion and actual proposed condition separately, with citations and document revisions. No automatic approval is implied.",
    "matrixFields": [
      "Building / story / code-summary topic",
      "G-sheet claim / proposed value / units",
      "Permitted criterion / edition / section / exceptions",
      "Plan / elevation / specification evidence and revision",
      "Reconciled actual condition / discrepancy",
      "Related life-safety or protection-system record"
    ],
    "groups": [
      [
        "Jurisdiction & occupancy",
        [
          [
            "Authority and governing editions",
            "Identify the reviewing authorities, adopted building/fire codes, referenced editions and local amendments."
          ],
          [
            "Project and existing-building scope",
            "Reconcile new construction, addition, alteration or change-of-use scope with the selected compliance approach."
          ],
          [
            "Occupancy classification and actual use",
            "Check each classification against intended activities, operations and occupant characteristics."
          ],
          [
            "Mixed occupancy strategy",
            "Document separated, nonseparated or other applicable treatment and verify its implementation across drawings."
          ],
          [
            "Accessory and incidental uses",
            "Review each claimed allowance and required separation or protection against the selected criteria."
          ]
        ]
      ],
      [
        "Height, area & construction",
        [
          [
            "Construction type",
            "Reconcile declared type with actual structural materials, assemblies and permitted uses."
          ],
          [
            "Building height and stories",
            "Compare proposed height, grade-plane assumptions and story counts with permitted values and cited allowances."
          ],
          [
            "Allowable building area",
            "Trace tabular basis, proposed floor areas and applicable adjustments without duplicating allowances."
          ],
          [
            "Frontage basis",
            "Review qualifying perimeter, open-space dimensions and supporting site measurements for claimed increases."
          ],
          [
            "Sprinkler-dependent allowances",
            "Confirm the required protection extent and system basis supporting height, area or other allowances."
          ],
          [
            "Fire areas and building boundaries",
            "Reconcile fire walls, fire barriers and fire-area boundaries with the area analysis and actual continuity."
          ]
        ]
      ],
      [
        "Ratings & protection",
        [
          [
            "Structural fire-resistance ratings",
            "Compare required member and assembly ratings with schedules, details and specified systems."
          ],
          [
            "Occupancy separations",
            "Trace required separation ratings and continuity through plans, sections and openings."
          ],
          [
            "Shafts and vertical openings",
            "Review shaft/enclosure requirements, permitted openings and protection of vertical connections."
          ],
          [
            "Exterior walls and openings",
            "Reconcile separation-distance assumptions, wall ratings and opening protection with site and elevation evidence."
          ],
          [
            "Opening and penetration protection",
            "Coordinate doors, glazing, dampers, joints and penetration systems with rated construction."
          ],
          [
            "Required protection systems",
            "Reconcile sprinkler, standpipe, alarm, detection, smoke-control and emergency-power triggers with discipline designs."
          ]
        ]
      ],
      [
        "Life safety & special triggers",
        [
          [
            "Occupant loads and exits",
            "Reconcile G-sheet loads and exit counts with room uses, floor totals and life-safety schedules."
          ],
          [
            "Travel and egress dimensions",
            "Cross-check travel, common paths, dead ends, widths, stairs and discharge with measured plan evidence."
          ],
          [
            "Lighting and signage",
            "Verify the summary requirements appear in emergency-lighting and exit-sign documentation."
          ],
          [
            "High-rise and atrium conditions",
            "Review geometry and selected definitions for applicable special requirements and supporting analyses."
          ],
          [
            "Assembly and ambulatory conditions",
            "Review actual uses and occupants for special provisions rather than relying solely on sheet labels."
          ],
          [
            "Industrial and hazardous conditions",
            "Reconcile process/material inventories, storage and control-area assumptions with special-use triggers."
          ],
          [
            "Cross-document consistency",
            "Resolve conflicts between the G-sheet, plans, elevations, life-safety drawings, specifications and fire-protection records."
          ]
        ]
      ]
    ]
  }
});
catalog["standpipe-review"]={
  "name": "Standpipe Plan & Hydraulic Review",
  "short": "Standpipes",
  "discipline": "Sprinklers, standpipes, and hydraulics",
  "intro": "Trace standpipe coverage, hydraulic demand and pressure zones through supply, fire-department operations and acceptance evidence.",
  "basis": [
    "System class / automatic or manual / wet or dry",
    "Building height / elevations / pressure zones",
    "Required flow / pressure / simultaneous demand basis",
    "Fire-department operations / supply and FDC strategy"
  ],
  "documents": [
    "Standpipe plans, risers and hose-connection schedules",
    "Hydraulic calculations and supply / pump curves",
    "Pressure-zone and regulating-device schedules / listings",
    "FDC details and fire-department operating requirements",
    "Acceptance tests, commissioning and maintenance records"
  ],
  "tools": [
    [
      "Standpipe Calculator",
      "standpipe-calc"
    ],
    [
      "Water Supply Review",
      "water-supply-review"
    ],
    [
      "Sprinkler Review",
      "sprinkler-review"
    ],
    [
      "Pump + Supply Overlay",
      "pump-overlay"
    ]
  ],
  "matrixName": "Zone / hose-connection scenario review",
  "matrixHint": "Record one hydraulic scenario per row. Include units, elevation datum and calculation references. Separate required residual pressure, static pressure and device settings; this worksheet does not calculate compliance.",
  "matrixFields": [
    "System / zone / class / scenario",
    "Controlling outlets / elevations / reference datum",
    "Required flow / residual pressure / criteria citation",
    "Available pressure at demand / losses / calculation reference",
    "Maximum static or operating pressure / device rating and setting",
    "Supply / pump / FDC operating condition / test reference"
  ],
  "groups": [
    [
      "Basis & system arrangement",
      [
        [
          "Governing criteria and system class",
          "Record adopted editions, amendments, project criteria and the Class I, II or III basis."
        ],
        [
          "Automatic or manual system basis",
          "Reconcile system type with the building use, height, required operation and approved fire-department strategy."
        ],
        [
          "Wet or dry service",
          "Review environmental conditions, freezing protection, air supply and delivery/operating assumptions where applicable."
        ],
        [
          "System boundaries and existing conditions",
          "Identify protected portions, existing equipment evidence, phased work and impairment responsibilities."
        ]
      ]
    ],
    [
      "Hose connections & coverage",
      [
        [
          "Connection locations and coverage",
          "Check required locations and actual hose routes against geometry, obstructions and selected criteria."
        ],
        [
          "Access and mounting",
          "Review mounting, clearances, cabinet arrangements and unobstructed operation in the installed condition."
        ],
        [
          "Valve and hose equipment",
          "Verify sizes, connections, threads, listings and compatibility with intended users and responding equipment."
        ],
        [
          "Stair, floor and roof coordination",
          "Reconcile hose connections with stairs, floor access, roof access and the fire-department operating approach."
        ],
        [
          "Identification and signage",
          "Verify zone, connection and operating labels match plans, schedules and required instructions."
        ]
      ]
    ],
    [
      "Hydraulic demand & supply",
      [
        [
          "Required flow and residual pressure",
          "Trace minimum demand criteria to the selected class, adopted edition and controlling hose outlets."
        ],
        [
          "Simultaneous standpipe demand",
          "Review the number and location of operating outlets and standpipes used in each required scenario."
        ],
        [
          "Combined sprinkler demand",
          "Review how combined systems and simultaneous demands are treated under the selected criteria; avoid unsupported additions or omissions."
        ],
        [
          "Elevation and reference point",
          "Align outlet elevations, supply datum and required/available pressure at matching physical points."
        ],
        [
          "Pipe and device losses",
          "Verify inside diameters, materials, fittings, lengths and equipment loss data against current drawings."
        ],
        [
          "Pump and source performance",
          "Review demand against applicable pump/source curves, suction conditions and reliability scenarios."
        ],
        [
          "FDC supply scenario",
          "Review connection arrangement, required inlet pressure, achievable apparatus supply and the documented operating strategy."
        ]
      ]
    ],
    [
      "Pressure zones & components",
      [
        [
          "Maximum system pressure",
          "Check static and operating scenarios, pump conditions and component pressure ratings at relevant elevations."
        ],
        [
          "Zone boundaries and isolation",
          "Trace zone breaks, interconnections, isolation and supervision; identify unintended pressure exposure or loss of coverage."
        ],
        [
          "Pressure-regulating devices",
          "Review listing, inlet/outlet operating ranges, flow conditions, settings and manufacturer evidence."
        ],
        [
          "Regulating-device test provisions",
          "Verify suitable test flow paths, drainage, access and the ability to test settings under required conditions."
        ],
        [
          "Sprinkler, tank and pump interfaces",
          "Coordinate shared equipment, check valves, backflow, controls and responsibilities across system boundaries."
        ]
      ]
    ],
    [
      "Acceptance & operations",
      [
        [
          "Acceptance and commissioning",
          "Record required flow/pressure tests, witnesses, outlet selection, equipment setup and deficiency resolution."
        ],
        [
          "Records and maintenance",
          "Review as-built zones, settings, test records, instructions and inspection/maintenance responsibilities."
        ],
        [
          "Operational and impairment plan",
          "Review fire-department instructions, outages, temporary protection and restoration procedures."
        ]
      ]
    ]
  ]
};
export const paths=Object.keys(catalog);