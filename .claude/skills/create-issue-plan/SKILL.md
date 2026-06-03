---
name: create-issue-plan
description: Reads an issue from Gitea and creates a plan for implementation.
disable-model-invocation: true
effort: xhigh
arguments: [issueNumber]
---

You are in `plan` mode. Do not write, modify, or delete any files.

The issue number is: $issueNumber.

---

## Step 1 - Fetch the issue

Using the Gitea MCP, detect the repo from the current git remote. Retrieve 
issue #$issueNumber and read its full content: title, body, acceptance c
riteria, notes, labels, and milestone.

---

## Step 2 - Find the branch name

Read the branch name from the issue. If none was found, read the issue's comments and find the branch comment in the format:
```
Branch: `branch-name`
```

This is the pre-created issue branch for this issue. Note the branch name - it 
will be checked out after approval. If no branch comment exists, report this to 
the user and stop. Do not proceed.

---

## Step 3 - Determine the target branch

Derive the sub-phase branch from the issue's milestone:
- Milestone `Phase 3.9` -> target branch `phase-3-9`
- Replace `.` with `-`, prepend `phase-`

This is the branch the eventual PR will merge into (not `master`).

---

## Step 4 - Analyze the work

Read the issue carefully and determine:
- Which files need to be created or modified
- Whether work touches the backend (`backend/` - PHP/SQLite), frontend (`frontend/` - React/Tailwind), or both
- The correct sequence of changes (schema changes -> API -> frontend is the standard order when all three layers are involved)
- Any risks, unknowns, or ambiguities worth flagging before starting

---

## Step 5 - Build the plan

Write a structured implementation plan. Delegate work to the appropriate agents:

**`backend-engineer` agent**
Handles all work inside `backend/`: database schema changes in `db.php`, API endpoint logic in `api.php`, and any other server-side PHP. Only spawned if the issue requires backend changes. 

This agent MUST update relevant documentation after making changes:
- After adding, modifying, or removing any API endpoint, update `docs/api/README.md`
- After making any database changes, update `docs/database/README.md`
- **Documentation update checklist:**
  - Add new columns in the same order they appear in `CREATE TABLE` in `backend/db.php`
  - Update all response examples to include new columns
  - Update request body tables to include new columns
  - Mark nullable columns and default values appropriately

Must satisfy all backend-related acceptance criteria and update documentation before signaling completion.

**`frontend-ux` agent**
Handles all work inside `frontend/`: React component creation and modification, Tailwind styling, state wiring, and API integration from the client side. Only spawned if the issue requires frontend changes. 

Derive the mockup pattern from the issue milestone: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file.

This agent MUST update relevant documentation after making changes:
- After making any component changes, update `docs/components/`
- **Documentation update checklist:**
  - If a new component is added, create a `[ComponentName].md` file in `docs/components/` that summarizes the component (use existing files as examples)
  - Add new components to the list of components found in `docs/components/README.md` with a 1 sentence description of that component, and a link to the component's markdown summary
  - When modifying an existing component in any way, update the relevant `docs/components/[ComponentName].md` file to reflect those changes, and update the component description in `docs/components/README.md` if necessary
  
Must satisfy all frontend-related acceptance criteria and update documentation before signaling completion.

**`code-reviewer` agent**
Reviews the completed work from all agents. Reads the original issue, checks acceptance criterion, identifies obvious issues and inconsistencies, tests features directly in the browser using Playwright MCP and generates a summary report. Always runs after the implementation agents.

The plan must include:
- The branch to check out and the target branch for eventual Pull Request
- Which agents are needed and why
- Which specific files each agent touches
- The order of agent execution (backend-engineer -> frontend-ux -> code-reviewer)
- Which specific acceptance criteria each agent is responsible for
- Any risks or questions to resolve before starting

---

## Step 6 - Present and request approval
 
Show the plan clearly. Ask:
 
> "Does this plan look correct? Reply 'yes' to approve and save, or tell me what to change."
 
Do not save anything until the user explicitly approves.
 
---

## Step 7 - Save the approved plan
 
Create the directory if needed and save the plan to `.claude/plans/issue-$issueNumber.md` using exactly this structure (fill in all bracketed values):
 
```markdown
# Issue Plan - #$issueNumber
 
## Metadata
- **Issue Title:** [issue title]
- **Issue Milestone:** [issue milestone]
- **Issue Branch:** [issue branch name]
- **Target Branch:** [target branch name]
 
## Agents
- **backend-engineer:** [yes / no]
- **frontend-ux:** [yes / no]
- **code-reviewer:** yes
 
## backend-engineer instructions
[Only include this section if backend-engineer is needed]

Files to modify:
- [file path - what changes and why]
 
Acceptance criteria to satisfy:
- [ ] [criterion from the issue]
 
## frontend-ux instructions
[Only include this section if frontend-ux is needed]

Files to modify:
- [file path - what changes and why]
 
Acceptance criteria to satisfy:
- [ ] [criterion from the issue]

If a mockup file is found, treat it as the visual reference for frontend work. Pass the file name and path to the `frontend-ux` agent with the following instructions:
> A reference mockup exists at [path]. Use it for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the implementation. Before writing any code, read the project's global stylesheet (`frontend/src/index.css`) to understand the available CSS custom properties, utility classes, and component patterns. This takes precedence over the mockup's use of styling, followed by Tailwind CSS. The mockup communicates layout, hierarchy, and interaction intent. Your code communicates it using the project's own design system.
 
## Full acceptance criteria
[Every acceptance criterion from the original issue, unmodified]
- [ ] [criterion]
 
## Execution order
1. [backend-engineer - if needed]
2. [frontend-ux - if needed]
3. [code-reviewer - does not make any changes, only gives feedback]
```
 
Confirm the file was saved and print its path.