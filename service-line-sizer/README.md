# Fire Toolshed — Service Line Sizer 1.3.0

Buildless, client-side preliminary lead-in / BFP / riser sizing. US customary units. Includes the shared Toolshed logo module, printable report, human guide and deterministic bot engine.

## Install in the existing Toolshed

Copy this folder to the repository root as `service-line-sizer/`. Add a portal link to `./service-line-sizer/`. No build or server API is needed. Keep all files and `assets/` together. The vendored logo module is copied unchanged from Toolshed's shared module and uses its existing storage key. Update that copy when the shared branding module changes.

For local review, serve the folder through a static HTTP server. Use HTTPS GitHub Pages on iPad/phone. No service worker or offline-install promise is included.

## Interfaces

- `index.html`: app and printable report
- `guide.html`: printable human guide, equations and scope
- `engine.js`: browser global `FireServiceSizer` and CommonJS export
- `schema.json`: versioned input contract
- `sample-input.json`: complete sample (not project data)
- `tests.cjs`: run `node tests.cjs`
- `cli.cjs`: run `node cli.cjs sample-input.json`

Export files contain `{app, version, input, result}`. Import accepts this envelope or a raw input. The shared Toolshed project envelope is not implemented. Sprinkler demand handoff is read-only; pressure is cleared to prevent double counting.

## Basis and limitations

Requested basis: NFPA 13 (2022), UFC 3-600-01 (September 30, 2026). Frozen UFC source: https://digital.wbdg.org/versions/f404c8e2-7174-444f-bac5-615e96f575ad

Applied UFC checks are described in the guide. NFPA hydraulic sizing is not a comprehensive NFPA compliance validator. Project criteria, NFPA 24 minimum sizes, dry delivery time, riser coverage area, special hazards, manufacturer equipment data and final hydraulic design remain outside scope. BFP connection size is provisional without a supplied manufacturer curve.

## Lessons incorporated from existing apps

- Actual pipe IDs; no fictitious extra piping segments or duplicate loss stacks.
- Distinguish supply shortfall from pipe friction and no remaining friction allowance.
- Reject BFP-curve extrapolation, invalid/blank numbers and incompatible JSON.
- Preserve assumptions on every printed report and JSON output.
- Shared embedded logos; responsive labels; single calculation engine for bots and UI.
- No cache worker that could serve mismatched UI/engine versions.

Existing references: `hydrant-loop-sizer/README.md`, `tests/hydrant-loop-sizer.test.mjs`, `tests/fire-pump-sizer.test.mjs`, `tests/report-logo-aip.test.mjs` in the public Fire_toolshed repository.

Prepared for review and integration; not deployed by this delivery. See VALIDATION.md for completed checks and outstanding device verification.

## Version 1.1 workflow update

- Quick estimate: flow/velocity-based preliminary sizes, with no pressure adequacy claim.
- Known demand: calculated demand and pressure budget; demand-only JSON loading requires an explicit system-side-riser pressure reference.
- Main panel reduced to essential inputs; detailed settings under Advanced.
- Parametric equipment illustration with indoor/outdoor and horizontal/vertical BFP arrangements, wall, grade, flanges, check bodies, handwheels and RP relief depiction.
- Code guidance beside the result; arrangement selections do not invent hydraulic geometry.
- `diagram.js` is required alongside `app.js`; `demand-template.json` documents the new demand loader.

Browser file loading was not retried after the earlier permission denial. Manual entry and mode switching were tested; file-picker operation remains unverified.

## Version 1.2

NFPA 13 and UFC hazard-derived quick demand now use density, adjusted design area, rounded head count, K-factor, minimum head pressure and an explicit estimating allowance. Remote-head pressure is never used as riser pressure. The company size rule is lead-in = BFP, one nominal size above riser until lead-in reaches 10 inches; 10/10 and 12/12 pairs follow. A supplied BFP curve constrains the matching lead-in size. See the updated guide and schema.
