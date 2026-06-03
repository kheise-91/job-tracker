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

## Step 2 - Find the branch name

Read the branch name from the issue. If none was found, read the issue's comments and find the branch comment in the format:
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

Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file.

Instructions to pass: the full issue body, the specific frontend-related acceptance criteria, the files expected to change, and the requirement to signal completion only when all frontend acceptance criteria pass. If a mockup file is found, treat it as the visual reference for frontend work. Pass the file name and path to the `frontend-ux` agent with the following instructions:
> A reference mockup exists at [path]. Use it for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the implementation. Before writing any code, read the project's global stylesheet (`frontend/src/index.css`) to understand the available CSS custom properties, utility classes, and component patterns. This takes precedence over the mockup's use of styling, followed by Tailwind CSS. The mockup communicates layout, hierarchy, and interaction intent. Your code communicates it using the project's own design system.

Spawn only the agents the issue actually requires. A frontend-only issue skips the backend-engineer. A backend-only issue skips frontend-ux.

---

## Step 5 - Spawn code reviewer agent

Spawn a **`code-reviewer`** agent with the following context and instructions:
 
**Context to pass:**
- The list of all files changed during implementation
- The issue title and acceptance criteria

**Instructions:** 
You are doing a code review on the changed files:
- Read only the changed files
- Perform code checks
- Perform visual and interaction review (if Playwright MCP is available and frontend code changes were made)
- Perform documentation checks
- Return a short report, maximum 8 bullet points.
- Be direct and specific

**Report format:**
```
## Code review
 
- [ISSUE] [filename]: [specific problem]
- [ISSUE] [filename]: [specific problem]
- PASS - no issues found
```
 
If no issues are found, return "PASS - no issues found" and nothing else. If issues are found, list them. If the code-reviewer flags blocking issues, address them before proceeding to Step 6. Non-blocking observations can be noted in the PR body.

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

  ## Code review summary
  [report generated from code-reviewer agent]

  ## Files changed
  - [list]
  ```

Report the PR URL when done.