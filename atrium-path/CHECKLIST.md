# Atrium smoke control — staff checklist

The browser tools set up and screen the analysis. Free NIST software produces the results you submit.

Screening only. Not the submittal basis. A licensed fire protection engineer confirms the inputs, the applicability of each equation, and the FDS analysis before any of this goes to an AHJ.

Do Phase 1 in one browser, from the [Fire Toolshed portal](https://pistolpetefire.github.io/Fire_toolshed/). The atrium pages share one project file (`fireToolshed.atriumProject.v1`). Download that JSON from the project bar before you switch computers. Pages opened with `file://` do not share the file across folders.

The toolshed saves the most time in steps 1–7. The AHJ agrees to scenarios you have already narrowed, and you do not build FDS models you do not need.

Open this list from the Checklist step on any atrium page. Checked boxes are saved in the shared project in this browser. If a toolshed link does not open, serve the repo from its root until the next deploy.

## Phase 1 — Set up and get the AHJ on board

### 1. Occupant load and egress capacity

- [ ] Open [Occupant Load & Egress Capacity](https://pistolpetefire.github.io/Fire_toolshed/occupant-egress/).
- [ ] Select the code path and enter every space.
- [ ] Record occupant load by floor or balcony, exit clear widths, and travel distances. These feed RSET.
- [ ] Save. The app publishes occupant load by space and the total clear width into the shared project.

Travel distance per floor is entered again on the RSET screen. The egress app checks travel against the code limit. It does not copy a distance onto each balcony.

### 2. Prescriptive baseline

- [ ] Open the [Atrium Smoke Exhaust hub](https://pistolpetefire.github.io/Fire_toolshed/atrium-smoke-exhaust/).
- [ ] Size the baseline with the NFPA 92 algebraic method.
- [ ] Record the required exhaust rate, makeup air, and smoke-layer height.
- [ ] Enter the makeup velocity limit and cite the edition you are using. The limit is blank until you enter it.
- [ ] Print the one-page baseline.

This exhaust rate is the number the alternative has to beat. It goes in the report as the comparison. Check the algebra on the [verification page](https://pistolpetefire.github.io/Fire_toolshed/atrium-smoke-exhaust/verify.html) before you quote it. The axisymmetric rows are NFPA 92 Annex K.

### 3. Screen the design fires

- [ ] Open the [atrium scenario matrix](https://pistolpetefire.github.io/Fire_toolshed/smoke-exhaust-lab/app/atrium-matrix.html). The [Scenario Lab home](https://pistolpetefire.github.io/Fire_toolshed/smoke-exhaust-lab/app/) is the IT-room workbook. Use **Atrium matrix** on that page for the atrium list.
- [ ] Try atrium-floor, balcony, and kiosk fires at more than one size and growth rate.
- [ ] Check makeup-air velocity on the matrix. The warning uses the limit you entered on the hub.
- [ ] Check plugholing in the [Scenario Lab workbook](https://pistolpetefire.github.io/Fire_toolshed/smoke-exhaust-lab/app/). The atrium matrix does not run the plugholing equation.
- [ ] Turn on the failure cases you may need later: one exhaust fan out, one makeup opening blocked, sprinkler not controlling.
- [ ] Narrow the list to 4–6 credible worst cases. Name each kiosk as its own row. A kiosk on the floor uses the floor plume unless you have a reason to call it a balcony spill or a window plume.

### 4. First-pass ASET

- [ ] Open the [Atrium Zone Model](https://pistolpetefire.github.io/Fire_toolshed/atrium-zone-model/).
- [ ] Run each of the 4–6 scenarios. On the matrix, **Run zone results** does this pass across the list.
- [ ] Mark which scenarios are tight and which clearly pass.
- [ ] Read layer height, layer temperature, visibility, and CO separately on the zone page for any scenario that is close. Visibility and CO stay blank until you enter yields, heat of combustion, and a citation.

This screen is a two-zone fill. It is not CFAST. The [zone verification page](https://pistolpetefire.github.io/Fire_toolshed/atrium-zone-model/verify.html) is an integration check of the plume equation.

### 5. Height sensitivity

- [ ] Open the [Atrium Field Model](https://pistolpetefire.github.io/Fire_toolshed/atrium-field-model/).
- [ ] Compare the tall section with the zone model for the same scenario.
- [ ] Set the disagreement percent. If the two differ by more than that percent, that scenario goes to FDS.
- [ ] Leave the label “Not FDS. Sensitivity only.” on the printout.

### 6. Preliminary RSET

- [ ] Open the [Transparent RSET Tool](https://pistolpetefire.github.io/Fire_toolshed/rset-tool/).
- [ ] Reload the egress handoff.
- [ ] Fill detection, notification, pre-movement, and movement.
- [ ] Use a pre-movement value only when its citation is on the page. Cite walking speed and specific flow the same way.
- [ ] Calculate RSET for the atrium floor and each balcony. Identify the controlling location.
- [ ] Fill the assumptions log.
- [ ] Export the session JSON.
- [ ] Send RSET to the screening package.

### 7. AHJ kickoff

- [ ] Open the [screening package](https://pistolpetefire.github.io/Fire_toolshed/atrium-report/).
- [ ] Print the package and the AHJ handout. The Word download is HTML that Word opens.
- [ ] Bring the baseline, the proposed scenarios, the draft tenability criteria, and the preliminary ASET versus RSET.
- [ ] Get written agreement on the criteria, the scenarios, the safety factor, and whether peer review is required.

Stop here until that agreement is in the file. Do not build the FDS model before the kickoff.

## Phase 2 — Analysis for the submittal

Free NIST software. The toolshed screens stay in the file as the screening record.

### 8. Build the FDS model

- [ ] Install [FDS and Smokeview](https://pages.nist.gov/fds-smv/) from the [FDS-SMV downloads](https://pages.nist.gov/fds-smv/downloads.html). Record the version.
- [ ] Start from the FDS snippet on the scenario row (fire location, heat-release ramp, exhaust flow, makeup opening). The file is SI.
- [ ] Replace that coarse mesh with the real atrium: geometry, openings, exhaust, and makeup air.
- [ ] Watch the first run in Smokeview, which is in the same NIST bundle.

### 9. Grid sensitivity

- [ ] Run one agreed scenario at two or three mesh sizes.
- [ ] Show that visibility, temperature, and carbon monoxide at the measurement points do not change meaningfully.
- [ ] Put the table in the report. Reviewers ask for this.

### 10. Agreed scenarios and sensitivity cases

- [ ] Run the scenarios the AHJ agreed to in step 7.
- [ ] Add the sensitivity cases: a larger fire, faster growth, and a failed vent or fan.
- [ ] Place measurement devices at head height on every balcony and on every egress path.
- [ ] Record visibility, temperature, and carbon monoxide at those points.

### 11. ASET from FDS

- [ ] For each location, record the first time each tenability limit is exceeded. That time is the ASET for that criterion.
- [ ] Optionally cross-check the simple cases in [CFAST](https://pages.nist.gov/cfast/), NIST’s free zone model, against the toolshed zone screen from step 4. Downloads are on the [CFAST releases](https://github.com/firemodels/cfast/releases) page. NIST describes both codes on the [fire modeling programs](https://www.nist.gov/el/fire/fire-modeling-programs) page.

Use CFAST to support the screening. The submitted smoke results are the FDS runs.

### 12. Final RSET

- [ ] If the AHJ accepted the hand method at kickoff, finalize it in the [Transparent RSET Tool](https://pistolpetefire.github.io/Fire_toolshed/rset-tool/).
- [ ] If they want a computer egress model, have it under contract before this phase. The usual ones are commercial.
- [ ] Cite a source for every pre-movement time and every walking speed.
- [ ] Export the final session and keep the assumptions log.

### 13. Margin

- [ ] Show that ASET exceeds RSET by the agreed safety factor in every scenario and every sensitivity case.
- [ ] Type the FDS ASET into the RSET screen, or put the same table in the report.
- [ ] Use the toolshed zone results only as a secondary check that the trends match.

## Phase 3 — Report, approval, and construction

### 14. Fire protection engineering report

- [ ] Prescriptive baseline from step 2, and the statement that the alternative beats that exhaust rate.
- [ ] Scenarios and why those 4–6 were kept, from steps 3 and 7, including the written AHJ agreement.
- [ ] FDS inputs, grid study, and results from steps 8–11, with the FDS version.
- [ ] RSET from step 12, with citations.
- [ ] ASET versus RSET comparison from step 13, with the safety factor.
- [ ] Limitations.
- [ ] Toolshed pages only as screening and cross-checks. Stamp them with the version, the date, the input summary, and the screening note.

### 15. Review and approval

- [ ] Complete peer review if step 7 required it.
- [ ] Answer comments with FDS re-runs where the comment changes a result.
- [ ] File the AHJ approval letter with the report.

### 16. Construction documents

- [ ] Lock fan sizes, vents, makeup air, sequences of operation, and detection zoning to the approved model.
- [ ] Send any value-engineering change back through FDS before it is issued.

### 17. Commissioning and the owner

- [ ] Support acceptance testing against the approved sequences and flows.
- [ ] Give the owner an operations and maintenance manual.
- [ ] Include a management-of-change rule tied to fuel load, so a later kiosk, display, or furnishing change comes back to the approved fire.

## What to have in the project folder

| When | File |
| --- | --- |
| End of step 1 | Egress printout, and the shared project JSON after the handoff |
| End of step 2 | One-page baseline |
| End of step 3 | Matrix reduced to 4–6 rows, plugholing sheet from the Scenario Lab, FDS start file for each kept row |
| End of step 6 | RSET session JSON and assumptions log |
| Meeting, step 7 | Screening package PDF and AHJ handout |
| End of step 11 | FDS input, Smokeview figures, grid table, ASET table; CFAST file only if you ran the cross-check |
| Step 15 | Signed report and AHJ letter |
| Step 17 | O&M manual with the fuel-load change rule |
