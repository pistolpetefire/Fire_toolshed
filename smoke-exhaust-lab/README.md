# Smoke Exhaust Scenario Lab - Team Testing Package

Package date: 2026-07-05

This folder contains the current beta/testing build of the Smoke Exhaust Scenario Lab and the documents needed for a two-week team review.

## What To Open First

1. Open `app/index.html` in a browser.
2. Open `app/smoke-exhaust-user-manual.pdf`.
3. Read `docs/01_TEAM_TEST_PLAN.md`.
4. Use `docs/02_TESTER_FEEDBACK_FORM.md` to record findings.

If opening `index.html` directly is blocked by local browser settings, run `app/Start-Local-App.ps1` from PowerShell and open the URL it prints.

## Package Contents

| Folder | Contents |
|---|---|
| `app/` | Runnable static app, stylesheet, JavaScript, help PDF, and optional local start script. |
| `docs/` | Release notes, test plan, feedback form, limitations, and Teams post draft. |
| `validation/` | Traceability matrix, schema, golden regression cases, acceptance criteria, reviewer checklist, and regression runner. |
| `test-cases/` | Scenario checklist for teammate testing. |

## Important Boundary

This beta is for testing workflow, usability, traceability, and calculation behavior. It is not approved for project design use until a qualified FPE, AHJ, insurer, or owner acceptance path is completed and documented.

## Regression Check

If Node.js is available, run this from the package root:

```powershell
node .\validation\run-regression-tests.mjs
```

Expected result: `"passed": true`.
