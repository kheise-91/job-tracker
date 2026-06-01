---
name: complete-issue
description: Fully autonomous mode. Works on a Gitea issue from start to finish without pausing for user confirmation. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

You are in `accept edits` mode. Do not request permission for any of the steps below. All work is isolated to a pre-created branch so it is safe to proceed without verification since nothing merges to master automatically.

The issue number is: $issueNumber.

---

## Step 1 - Fetch the issue

Using the Gitea MCP, detect the repo from the current git remote. Retrieve issue #$issueNumber and read its full content: title, body, acceptance criteria, notes, labels, and milestone.

---

## Step 2 - Find the branch name and mockup file

Read the issue's comments. 

Find the branch comment in the format:
```
Branch: `branch-name`
```

This is the pre-created issue branch for this issue. If no branch comment exists, stop and report the problem. Do not create a new branch.

Check out the pre-created issue branch AND rebase on the sub-phase branch:
```bash
git fetch origin
git checkout branch-name
git rebase origin/phase-X-Y
```

Find the mockup comment (if present) in the format:
```
Mockup: `frontend/mockups/phase-[X-Y]-*.html`
```

Note any mockup `path/filename.html` found, it will be included in the plan.

---

## Step 3 - Determine the target branch

Derive the sub-phase branch from the issue's milestone:
- Milestone `Phase 3.9` → target branch `phase-3-9`
- Replace `.` with `-`, prepend `phase-`

This is where the PR will merge into.

---

## Step 4 - Spawn implementation agents

Based on what the issue requires, spawn the appropriate agents:

**`backend-engineer` agent**
Handles all work inside `backend/`: schema changes in `db.php`, API logic in `api.php`, and any other server-side PHP work. Spawn this agent first when the issue touches the backend - frontend work may depend on the API being ready.

Instructions to pass: the full issue body, the specific backend-related acceptance criteria, the files expected to change, and the requirement to signal completion only when all backend acceptance criteria pass.

**`frontend-ux` agent**
Handles all work inside `frontend/`: React components, Tailwind styling, state management, and client-side API integration. Spawn after the backend-engineer if both layers are needed.

Instructions to pass: the full issue body, the specific frontend-related acceptance criteria, the files expected to change, and the requirement to signal completion only when all frontend acceptance criteria pass.

If a mockup file was found in Step 2, pass it to the `frontend-ux` agent with the instruction to read the file before writing any code and implement to match its layout, component structure, and interaction patterns.

Spawn only the agents the issue actually requires. A frontend-only issue skips the backend-engineer. A backend-only issue skips frontend-ux.

---

## Step 5 - QA review

After all implementation agents complete, spawn the **`qa-reviewer` agent**:

Instructions to pass:
- The original issue (title, body, full acceptance criteria)
- The list of all files changed
- Task: read each changed file, verify every acceptance criterion is met, identify any bugs, missed edge cases, or inconsistencies, and produce a written QA report with a clear pass/fail status per criterion

If the qa-reviewer flags blocking issues, address them before proceeding to Step 6. Non-blocking observations can be noted in the PR body.

---

## Step 6 - Commit and push

Stage all changes and commit:
```
feat: [short description matching issue title]

Closes #$issueNumber

- [File or change, one line each]
```

Push the branch:
```bash
git push origin branch-name
```

---

## Step 7 - Open pull request

Open a pull request via the Gitea MCP:
- **From:** issue branch (`YYYY-MM-DD-task-summary`)
- **Into:** sub-phase branch (`phase-X-Y`)
- **Title:** the issue title
- **Milestone:** Phase X.Y
- **Body:**
  ```
  Closes #$issueNumber

  ## QA summary
  [Pass/fail status per acceptance criterion from the qa-reviewer report]

  ## Files changed
  - [list]
  ```

Report the PR URL when done.