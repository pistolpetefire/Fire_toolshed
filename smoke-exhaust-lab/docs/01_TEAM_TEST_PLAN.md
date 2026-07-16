# Two-Week Team Test Plan

Suggested test window: July 5, 2026 through July 19, 2026.

## Goals

- Confirm the app runs reliably for teammates.
- Find confusing inputs, labels, workflows, or report language.
- Test whether reviewers can follow the TSFPEWG path and calculation path.
- Identify calculation gaps before any formal engineering review.
- Confirm Excel mode is simple enough for spreadsheet-style comparison.

## What Each Tester Should Do

1. Open `app/index.html` or run `app/Start-Local-App.ps1`.
2. Read the first two pages of `app/smoke-exhaust-user-manual.pdf`.
3. Run at least three scenarios from `test-cases/team-test-scenarios.md`.
4. Include at least one Full mode scenario and one Excel mode scenario.
5. Export the scenario JSON once and re-import it.
6. Review the report sections for traceability and clarity.
7. Fill out `docs/02_TESTER_FEEDBACK_FORM.md`.

## Week 1 Focus

- App launch and basic navigation.
- Full mode input clarity.
- Excel mode comparison to the provided calculator.
- Design-fire selection and HRR editing.
- Import/export behavior.
- Help manual usefulness.

## Week 2 Focus

- Reviewer defensibility.
- TSFPEWG Requirement Trace.
- Submittal Readiness Gate.
- Formula/variable/calculation trace clarity.
- Edge cases and bad inputs.
- Gaps that would let a reviewer reject the package.

## Minimum Test Coverage Target

Across the team, try to cover:

- MAC III typical permanent exhaust.
- MAC III direct exterior door / portable fan path.
- MAC II typical occupied case.
- MAC II unoccupied case.
- MAC I clean-agent case.
- Remote unoccupied facility.
- Modular mission-critical facility.
- Li-ion/project-specific HRR case.
- Detection benchmark warning case.
- Invalid smoke interface above ceiling.
- Plugholing failure.
- Import unit mistake.

## How To Report Findings

Use this severity scale:

| Severity | Meaning |
|---|---|
| Critical | Wrong result, missing required TSFPEWG path, app crash, or report could mislead a reviewer. |
| High | User can easily enter or import bad data without realizing it. |
| Medium | Confusing workflow, unclear report language, missing explanation, or manual gap. |
| Low | Cosmetic issue, typo, layout issue, or convenience request. |

Send completed feedback forms to the Teams repository or channel thread.
