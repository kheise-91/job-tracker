---
name: execute-issue-plan
description: Executes the saved plan for a Gitea issue.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

Execute the saved plan for issue #$issueNumber. Read the plan file, check out the branch, spawn agents, and then ask user to review the work before running any git operations.

---

## Step 1 - Read the plan
 
Read `.claude/plans/issue-$issueNumber.md`. Extract:
- All metadata fields and values
- Which agents are needed
- Per-agent file list and instructions
- Full acceptance criteria list

If the file does not exist, stop and report:
> "No plan found at .claude/plans/issue-$issueNumber.md - run `/create-issue-plan $issueNumber` first."
 
---


## Step 2 - Check out and rebase the branch
 
```bash
git fetch origin
git checkout [issue branch]
git rebase origin/[target branch]
```
 
If the rebase has conflicts, stop and report them. Do not attempt to resolve conflicts automatically.
 
---

## Step 3 - Spawn implementation agents
 
Spawn only the agents listed as "yes" in the plan. Pass each agent its specific instructions and file list from the plan file.
 
**`backend-engineer`** - spawn first if needed. Handles all `backend/` work. Must satisfy its listed acceptance criteria and update documentation before signaling completion.
 
**`frontend-ux`** - spawn after backend-engineer if needed. Handles all `frontend/` work. Must satisfy its listed acceptance criteria and update documentation before signaling completion.
 
---

## Step 4 - Spawn code reviewer agent
 
Spawn a **`code-reviewer`** agent with the following context and instructions:
 
**Context:**
- The list of all files changed during implementation
- The issue title and acceptance criteria
- App URL: https://dev-server.heise.home

**Instructions:** 
You are doing a code review on the changed files.
- Read only the changed files
- Perform code checks:
  - Logic errors or off-by-one mistakes
  - Unhandled null, undefined, or empty states for data the component receives
  - Console.log statements or debug code left in
  - Values that are hardcoded but should reference a CSS variable, constant, or config value
  - Imports that are unused or incorrectly referenced
  - Style inconsistencies with surrounding code in the same file (naming conventions, spacing patterns, component structure)
- Perform visual and interaction review (if Playwright MCP is available and changes affect frontend/UI/UX):
  - Navigate to the App URL (https://dev-server.heise.home)
  - For each UI-related acceptance criterion, test it directly in the browser: navigate to the relevant page, interact with the component, verify the behavior
  - Take a screenshot for any criterion that fails or looks visually incorrect
- Perform documentation checks - cross-reference the changed files against the project documentation. For each of the following conditions, read the relevant doc file and verify it reflects the changes made:
  - `backend/db.php` was modified - check `docs/database/README.md` reflects any schema changes (new columns, new tables, altered types or constraints, etc.)
  - `backend/api.php` was modified - check `docs/api/README.md` reflects any endpoint changes (new routes, changed request/response shapes, new error codes, etc.)
  - A new component was created - check `docs/components/[ComponentName].md` was created and the component was added to `docs/components/README.md` with short description and link to the `[ComponentName].md` file.
  - An existing component was modified - check `docs/components/[ComponentName].md` was updated to reflect these changes.
  - A component was removed - check `docs/component/[ComponentName].md` was also removed and the component reference in `docs/components/README.md` was removed.
- Return a short report, maximum 8 bullet points.
- Be direct and specific

**Report format:**
```
## Code review
 
### Code issues
- [ISSUE] filename - specific problem
- [PASS] No code issues found
 
### Documentation gaps
- [GAP] docs/api/README.md - missing: [what endpoint or change is not reflected]
- [GAP] docs/database/README.md - missing: [what schema change is not reflected]
- [GAP] ComponentName.jsx - missing update (or entire file/reference) in `docs/components/[ComponentName].md` and `docs/components/README.md`
- [PASS] Documentation is current

### Verdict
PASS / NEEDS FIXES
``` 

If verdict is **NEEDS FIXES** and/or the code-reviewer flags blocking issues, address them before proceeding to Step 5. Specify which upstream agent is responsible for each issue and spawn that agent to make the necessary corrections:
- **`backend-engineer` agent**: code changes to `backend/` directory and documentation from `docs/api/` and `docs/database/`
- **`frontend-ux` agent**: code changes to `frontend/` directory and documentation from `docs/components/`

Non-blocking observations can be noted in the PR body.

---

## Step 5 - Commit, push, and open pull request using subagent

*Do NOT proceed to this step until the user confirms the task has been completed successfully and requests a PR.*

Spawn a **gitea-git-ops** subagent with the code review summary and the following instructions.

**Instructions:**
 
Stage ONLY the changes made for this issue and commit:
```
feat: [issue title]
 
Closes #$issueNumber2
 
- [changed file or logical change, one line each]
```
 
Push the branch:
```bash
git push origin [issue branch]
```
 
Open a PR via the Gitea MCP:
- **From:** issue branch
- **Into:** target branch
- **Title:** issue title
- **Milestone:** issue milestone
- **Body:**
  ```
  Closes #$issueNumber

  ## Code review summary
  [report generated from code-reviewer agent]
 
  ## Files changed
  - [list]
  ```

Report the PR URL when done.