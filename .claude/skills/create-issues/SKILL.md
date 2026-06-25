---
name: create-issues
description: Creates Gitea issues based on sub-phase in project roadmap.
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

## Step 2 - Create the milestone using subagent

Spawn a **gitea-git-ops** subagent with the following instructions.

**Instructions:**
Using the Gitea MCP, detect the repo from the current git remote. Create a milestone with:
- **Title:** `Phase X.Y` (e.g. "Phase 3.9")
- **Description:** The full sub-phase description from the roadmap, including the done definition and any implementation notes, formatted as markdown

If the milestone already exists, skip creation and use the existing one. 

Return the milestone title.

---

## Step 3 - Plan the tasks

Break the sub-phase into 4–8 discrete tasks (more if the scope genuinely requires it, less is okay too if not that many are needed). Each task must be completable in a single focused session - roughly half a day to two days of work.

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

## Step 4 - Create issues

Spawn a **gitea-git-ops** subagent with the complete list of tasks and the following instructions.

**Instructions:**
Detect the repo from the current git remote. For each task in sequence:

**4a.** Create any missing labels via the Gitea MCP.

**4b.** Create the issue via the Gitea MCP with: title, project, milestone, label(s), and body as planned in Step 3.

**4c.** Confirm the issue number, and title before moving to the next task.

---

## Step 5 - Return and summarize

Print a summary table:

| # | Issue |
|---|-------|
| 1 | #N - Issue title |
| 2 | #N - Issue title |