---
name: execute-issue-plan
description: Executes the saved plan for a Gitea issue.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

Execute the saved plan for issue #$issueNumber. Read the plan file, check out the branch, spawn agents, and then ask user to review the work before running any git operations.

---

## Step 1 — Read the plan
 
Read `.claude/plans/issue-$issueNumber.md`. Extract:
- All metadata fields and values
- Which agents are needed
- Per-agent file list and instructions
- Full acceptance criteria list

If the file does not exist, stop and report:
> "No plan found at .claude/plans/issue-$issueNumber.md — run `/create-issue-plan $issueNumber` first."
 
---


## Step 2 — Check out and rebase the branch
 
```bash
git fetch origin
git checkout [issue branch]
git rebase origin/[target branch]
```
 
If the rebase has conflicts, stop and report them. Do not attempt to resolve conflicts automatically.
 
---

## Step 3 — Spawn implementation agents
 
Spawn only the agents listed as "yes" in the plan. Pass each agent its specific instructions and file list from the plan file.
 
**`backend-engineer`** — spawn first if needed. Handles all `backend/` work. Must satisfy its listed acceptance criteria before signaling completion.
 
**`frontend-ux`** — spawn after backend-engineer if needed. Handles all `frontend/` work. Must satisfy its listed acceptance criteria before signaling completion.
 
---

## Step 4 — QA review
 
Spawn the **`qa-reviewer`** agent with:
- The full acceptance criteria list from the plan
- The list of all files changed by the implementation agents
- Task: verify every criterion, identify any bugs or missed edge cases, produce a written pass/fail report per criterion

If the qa-reviewer flags blocking issues, address them before continuing.
 
---

## Step 5 — Commit and push

*Do NOT proceed to this step until the user confirms the task has been completed successfully and requests a PR.*
 
Stage all changes and commit:
```
feat: [issue title]
 
Closes #$issueNumber2
 
- [changed file or logical change, one line each]
```
 
Push the branch:
```bash
git push origin [issue branch]
```
 
---

## Step 6 — Open pull request
 
Open a PR via the Gitea MCP:
- **From:** issue branch
- **Into:** target branch
- **Title:** issue title
- **Milestone:** issue milestone
- **Body:**
  ```
  Closes #$issueNumber
 
  ## QA summary
  [Pass/fail per acceptance criterion from the qa-reviewer report]
 
  ## Files changed
  - [list]
  ```

Report the PR URL when done.