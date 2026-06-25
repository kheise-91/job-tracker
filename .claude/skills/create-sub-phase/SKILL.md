---
name: create-sub-phase
description: Sets up sub-phase - create Gitea milestone, issues and branches based on sub-phase in project roadmap.
disable-model-invocation: true
effort: xhigh
arguments: [subPhase]
---

The sub-phase number is: $subPhase.

---

## Step 1 - Read the roadmap

Read @ROADMAP.md. Find the sub-phase matching "$subPhase" (e.g. "3.9" matches "- [x] **3.9 ...**" or "**3.9**"). Extract:
- The parent phase and title
- The sub-phase title
- The full description
- The "Done when" definition
- Any implementation notes (especially specific file names and components mentioned)

---

## Step 2 - Create the sub-phase branch and milestone using agent

Spawn a **gitea-git-ops** agent with the following instructions.

**Instructions:**
Derive the branch name from the argument: replace the `.` with `-` and prepend `phase-`. Example: `3.9` → `phase-3-9`

Create the branch off of `master` and push it:

```bash
git checkout master
git pull origin master
git checkout -b phase-[X-Y]
git push -u origin phase-[X-Y]
```

Using the Gitea MCP, detect the repo from the current git remote. Create a milestone with:
- **Title:** `Phase X.Y` (e.g. "Phase 3.9")
- **Description:** The full sub-phase description from the roadmap, including the done definition and any implementation notes, formatted as markdown

If the milestone already exists, skip creation and use the existing one.

Return the new branch name and milestone title.

---

## Step 4 - Plan the tasks

Break the sub-phase into 4–8 discrete tasks (more if the scope genuinely requires it, less is okay too if not that many are needed). Each task must be completable in a single focused session - roughly half a day to two days of work. 

Derive the mockup pattern from the $subPhase number: replace `.` with `-`, prepend `phase-`, append `-*.html`. Check `frontend/mockups/` for a matching file. If a mockup file is found, treat it as the visual reference for frontend work. Find which parts of the mockup file are related to the sub-phase, and use them for visual and structural reference only - do not blindly copy its class names, inline styles, or CSS from the mockup into the tasks created. For styling: the project's existing stylesheets and components take precedence, followed by Tailwind CSS, and finally the mockup file. For structure: the sub-phase description in the project roadmap takes precedence over the mockup if they conflict.

For each task, determine:
- **title:** Short imperative phrase (e.g. "Add followed_up_date column to jobs schema")
- **project:** `Phase X - Parent Phase Title`
- **milestone:** `Phase X.Y`
- **labels:** `Task`
- **body:** Markdown with these sections:
  ```
  ## What
  [What this task builds or decides]

  ## Why
  [Why it's needed and how it fits the sub-phase goal]

  ## Acceptance criteria
  - [ ] [Concrete, testable condition]
  - [ ] [Another condition]

  ## Notes
  [Implementation hints, dependencies on other tasks in this set, files to touch]
  ```

**Rules:**
- Sequence tasks so earlier ones don't depend on later ones
- If a task has a hard dependency on another in this list, note it in the Notes section
- Acceptance criteria must be concrete and testable - never vague
- Do not invent scope beyond what the sub-phase description states
- If the description mentions specific files (`db.php`, `api.php`, `JobModal.jsx`, etc.), generate a separate task for each distinct file or layer touched

---

## Step 5 - Create branches, issues, and comments

Spawn a **gitea-git-ops** agent with the complete list of tasks and the following instructions.

**Instructions:**
For each task in sequence, perform these steps **one task at a time** - complete all steps for one task before moving to the next:

**5a. Generate the branch name**
Format: `YYYY-MM-DD-short-task-summary`
- Use today's date
- Derive the summary from the task title: lowercase, hyphens, max 5 words, no special characters, no articles (a/an/the)
- Example: `2026-05-25-add-followed-up-column`

**5b. Create the branch** off of the sub-phase branch (not master) and push it:
```bash
git checkout phase-[X-Y]
git checkout -b YYYY-MM-DD-short-task-summary
git push -u origin YYYY-MM-DD-short-task-summary
git checkout phase-[X-Y]
```

**5c. Create any missing labels** via the Gitea MCP if the label doesn't already exist.

**5d. Create the issue** via the Gitea MCP with: title, project, milestone, branch, label(s), and body as planned in Step 4.

**5e. Add a comment to the issue** immediately after creation:
```
Branch: `YYYY-MM-DD-short-task-summary`
```
This is how `/start-issue` and `/complete-issue` will find the branch later.

**5f. Confirm** the issue number, title, and branch name before proceeding to the next task.

---

## Step 6 - Return and summarize

After all tasks are created, check out the sub-phase branch:
```bash
git checkout phase-[X-Y]
```

Print a summary table:

| # | Issue | Branch |
|---|-------|--------|
| 1 | #N - Issue title | `branch-name` |
| 2 | #N - Issue title | `branch-name` |