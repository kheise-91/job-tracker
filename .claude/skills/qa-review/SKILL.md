---
name: qa-review
description: Runs a comprehensive read-only QA review of all changes in the current sub-phase branch compared to master. Verifies all acceptance criteria across every issue in the milestone. Optionally tests in browser if Playwright MCP is available.
disable-model-invocation: true
effort: max
---

## Step 1 - Determine the sub-phase

Read the current branch name:
```bash
git branch --show-current
```
Derive the sub-phase number: `phase-3-10` → `3.10`. If not on a sub-phase branch,
stop and report: "Checkout the sub-phase branch before running /qa-review."

---

## Step 2 - Read the sub-phase context

Read @ROADMAP.md. Find the sub-phase matching the derived number. Extract the full
description and "Done when" definition - this is the acceptance bar for the whole review.

---

## Step 3 - Gather all changes

```bash
git diff master...HEAD --stat
git diff master...HEAD
```

Note every file changed, added, or deleted.

---

## Step 4 - Gather all issue acceptance criteria

Using the Gitea MCP, detect the repo from the current git remote. List all issues
in the milestone `Phase X.Y`. For each issue, read the full body and extract every
acceptance criterion checkbox. Compile a single flat list of all criteria across
all issues - this is the complete test checklist for this sub-phase.

---

## Step 5 - Spawn the qa-reviewer agent

Spawn a **`qa-reviewer`** agent with the following context and instructions:

**Context:**
- Sub-phase title and "Done when" definition from ROADMAP.md
- Full git diff (all changed files and their contents)
- Complete acceptance criteria checklist from all issues
- List of all changed filenames
- App URL: https://dev-server.heise.home

**Instructions:**

You are a senior QA engineer reviewing a completed sub-phase of development.
Your job is to find problems, not to validate. Be direct and specific. Do not change
any files. Only review changes according to your instructions and generate a report.

**Code review:**
- Read every changed file in the diff
- Verify each acceptance criterion is concretely satisfied in the code - not
  just present but actually working based on the implementation
- Flag any criterion that appears incomplete, partially implemented, or untested
- Check for: logic errors, missed edge cases, unhandled null/empty states,
  console.log statements left in, dead code introduced, broken imports

**Visual and interaction review (if Playwright MCP is available):**
- Navigate to the App URL (https://dev-server.heise.home)
- For each UI-related acceptance criterion, test it directly in the browser: navigate to the relevant page, interact with the component, verify the behavior
- Take a screenshot for any criterion that fails or looks visually incorrect

**Report format:**
```
## QA Report - Phase X.Y

### Sub-phase done definition
[Restate it]

### Acceptance criteria results

#### Issue #N - [title]
- [x] [criterion] - PASS
- [ ] [criterion] - FAIL: [specific reason and file/line if known]

#### Issue #N - [title]
...

### Additional findings
- [Bug or issue not covered by a criterion]

### Verdict
PASS / FAIL - [one sentence summary]
```

Do not produce a passing verdict unless every checkbox criterion is satisfied.
If Playwright is not available, note "Browser testing skipped - Playwright MCP
not configured" and proceed with code-only review.

---

## Step 6 - Report

Print the full QA report. If the verdict is FAIL, list the specific issues that
need to be addressed before the sub-phase branch can be merged into master.