# Sprinkler System Estimator changelog

- **1.6.2-prelim.** New "Submittal mode" checkbox next to Print (shared module `shared/submittal-mode.js`, default OFF, per printout, not saved). ON leaves the blank sign-off block (Prepared by / Reviewed by / AHJ discussion notes) out of the printout. Everything else on the printout is unchanged. OFF is identical to 1.6.1-prelim. This app has no "Items to confirm" list, confirm-with-AHJ tags or Criteria Status column, so only the sign-off block applies.
- **1.6.1-prelim.** Report logo list gains a built-in option **AI&P + Benham (a Haskell Company)** (AI&P Alberti Ozzo & Partners + Benham). It is added once in the shared `shared/report-logo.js` (source key `aip`, image `shared/logos/aip-benham.png`), so it shows in this tool's Report logo list and preview and in the printout header. The default logo (Benham) and a saved choice (`fireToolshed.reportLogo.v1`) are unchanged. No layout changes.
- Previous version: 1.6.0-prelim.
