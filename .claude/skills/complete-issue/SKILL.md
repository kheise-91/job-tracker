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

This agent MUST update relevant documentation after making changes:
- After adding, modifying, or removing any API endpoint, update `docs/api/README.md`
- After making any database changes, update `docs/database/README.md`
- **Documentation update checklist:**
  - Add new columns in the same order they appear in `CREATE TABLE` in `backend/db.php`
  - Update all response examples to include new columns
  - Update request body tables to include new columns
  - Mark nullable columns and default values appropriately

Instructions to pass: the full issue body, the specific backend-related acceptance criteria, the files expected to change, and the requirement to signal completion only when all backend acceptance criteria pass and documentation has been updated.

**`frontend-ux` agent**
Handles all work inside `frontend/`: React components, Tailwind styling, state management, and client-side API integration. Spawn after the backend-engineer if both layers are needed.

Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file.

This agent MUST update relevant documentation after making changes:
- After making any component changes, update `docs/components/`
- **Documentation update checklist:**
  - If a new component is added, create a `[ComponentName].md` file in `docs/components/` that summarizes the component (use existing files as examples)
  - Add new components to the list of components found in `docs/components/README.md` with a 1 sentence description of that component, and a link to the component's markdown summary
  - When modifying an existing component in any way, update the relevant `docs/components/[ComponentName].md` file to reflect those changes, and update the component description in `docs/components/README.md` if necessary

Instructions to pass: the full issue body, the specific frontend-related acceptance criteria, the files expected to change, and the requirement to signal completion only when all frontend acceptance criteria pass and documentation has been updated. 

If a mockup file is found, treat it as the visual reference for frontend work. Pass the file name and path to the `frontend-ux` agent with the following instructions:
> A reference mockup exists at [path]. Use it for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the implementation. Before writing any code, read the project's global stylesheet (`frontend/src/index.css`) to understand the available CSS custom properties, utility classes, and component patterns. This takes precedence over the mockup's use of styling, followed by Tailwind CSS. The mockup communicates layout, hierarchy, and interaction intent. Your code communicates it using the project's own design system.

Spawn only the agents the issue actually requires. A frontend-only issue skips the backend-engineer. A backend-only issue skips frontend-ux.

---

## Step 5 - Spawn code reviewer agent

Spawn a **`code-reviewer`** agent with the following context and instructions:
 
**Context to pass:**
- The list of all files changed during implementation
- The issue title and acceptance criteria

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
  - Navigate to the app at https://dev-server.heise.home
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

If verdict is **NEEDS FIXES** and/or the code-reviewer flags blocking issues, address them before proceeding to Step 6. Specify which upstream agent is responsible for each issue and spawn that agent to make the necessary corrections:
- **`backend-engineer` agent**: code changes to `backend/` directory and documentation from `docs/api/` and `docs/database/`
- **`frontend-ux` agent**: code changes to `frontend/` directory and documentation from `docs/components/`

Non-blocking observations can be noted in the PR body.

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