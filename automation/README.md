# Shared discovery and review workflows

The human homepage and AI entrance are generated from `directory/catalog.json`. Add a stable catalog ID, concise purpose, task, disciplines, search terms, human URL and explicit automation availability for each new tool. Keep existing URLs. The AI workflow registry is `automation/workflows.json`; executable arithmetic contracts remain in `ai-review/tool-directory.json`.

Regenerate from the repository root:

```
node directory/build.mjs
node proposal-review/build.mjs
node ai-review/build.mjs
python ai-review/build-kit.py
```

The catalogs are readable without JavaScript. The homepage enhances static cards with search and filters. Individual AI module JSON avoids loading every checklist into model context; the combined manifest remains for compatibility.

Shop modules are additive IDs. Existing review module IDs, prompts and saved records are unchanged. The Case File adds Portable fire extinguishers to its discipline list; existing schema and JSON imports remain compatible. Older deployed app versions cannot recognize this new discipline until refreshed.

Proposal files use their own `fireToolshed.proposalReview.v1` schema. They do not replace or merge Peer Review Case JSON. A proposal preserves all 14 review topics, source inventory, requirement register, RFIs and optional revision history. The revision action preserves the preceding snapshot without recursively copying history, adds the new drawing fingerprint, clears reviewer decisions, flags all topics, resets confirmed criteria to Proposed and reopens closed RFIs for confirmation. Imported first-version proposal files without history remain valid. Save/export the continuing JSON for the next review.

Word summary and RFI exports are generated locally as OOXML ZIP files with no network dependencies. The CLI and browser share the same exporter. Reports retain draft/recheck labels and unresolved counts. Structural validation does not verify whether evidence supports a technical conclusion. Typed identities are not authenticated signatures, and imported JSON is not tamper-evident.

No PDF interpretation, copyrighted code library, model connection, shared storage, automatic review-round merge or full hydraulic network adapter is claimed. The AI must have source documents and execution tools; humans validate the results. Proposal JSON can be retained as a future design baseline, but automatic conversion to a QC case is not implemented.

Run the tests in `.github/workflows/review-workflows.yml`. Proposal tests cover round trips, estimate evidence, revision preservation/recheck, RFI closure and XML escaping. Catalog tests verify every tool link, searches and all shop checks through the existing AI-to-Case File path. Existing QC tests guard older file imports and response merging.
