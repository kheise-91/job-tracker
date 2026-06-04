---
name: claude-skills
title: Claude Skills Guide
description: A comprehensive list of custom skills used with Claude Code in this project, and how to use each skill.
---

# Claude Skills Guide

Custom Claude Code slash commands for Gitea-integrated development workflows.

All skill files live in `/.claude/skills/`. Clicking the skill name will take you to that skill file.

---

## Prerequisites

- Gitea MCP v1.3.0+ configured in Claude Code (`GITEA_ACCESS_TOKEN` and `GITEA_HOST` set as MCP env vars)
- `ROADMAP.md` in the project root (required by `/create-sub-phase` and `/create-issues`)
- `master` branch as the base for all sub-phase branches

---

## Scoping Skills

### [`/create-project-roadmap [projectDetails]`](/.claude/skills/create-project-roadmap/SKILL.md)

Generates a high-level project roadmap from labeled input and saves it to `ROADMAP.md`. The roadmap will contain 4-6 top-level phases for working on the project. A list of required and optional inputs is shown below.

| Field | Required | Notes |
| ----- | -------- | ----- |
| `Description` | Yes | 2–4 sentences: what the app does, who uses it, what problem it solves |
| `Frontend` | No | e.g. React + Tailwind, Vue, plain HTML |
| `Backend` | No | e.g. PHP, Node, Python/FastAPI, none |
| `Database` | No | e.g. SQLite, PostgreSQL, none |
| `Other` | No | Auth providers, external APIs, third-party services |
| `Features` | Yes | List of MVP features |
| `Constraints` | No | Team size, deadlines, deployment target, out-of-scope items |

**Use when:** Starting a new project.

---

### [`/expand-project-roadmap [phaseNumber]`](/.claude/skills/expand-project-roadmap/SKILL.md)

Reads `ROADMAP.md` and expands each selected phase into sub-phases with descriptions and done definitions. Each phase will be broken down in 3-6 sub-phases. This skill should be invoked in the same session with the same model as the `/create-project-roadmap` skill.

This skill includes an optional `phaseNumber` argument. If a phase number is passed, only that phase will be expanded upon. If no phase number is passed, then every phase will be scoped.

**Use when:** After creating a project roadmap using the `/create-project-roadmap` skill.

---

### [`/review-project-roadmap`](/.claude/skills/review-project-roadmap/SKILL.md)

Critically reviews `ROADMAP.md` as an independent pass, flagging gaps, sequencing problems, and anything misscoped. Does not modify any files. This review includes:
- Missing or underestimated work
- Sequencing problems*
- Phases or sub-phases doing too much
- Decisions deferred too late
- Tasks masquerading as sub-phases
- Scope and naming accuracy

**Use when:** After creating and expanding a project roadmap.

---

### [`/create-mockup [subPhase] [numberOfMockups]`](/.claude/skills/create-mockup/SKILL.md)

Reads the description from a sub-phase in the roadmap, spawns the `frontend-ux` subagent
to summarize the frontend code and styling conventions, creates the specified number of
plans (defaults to 3), and utilizes the subagent's summary to generate mockups for
implementing the sub-phase's UI changes.

Returns a summary table of all mockup HTML files created, with a description of each variation.

**Use when:** You need ideas of how to implement new, complex UI/UX changes (must run before creating Gitea issues)

---

### [`/create-sub-phase [subPhase]`](/.claude/skills/create-sub-phase/SKILL.md)

Full sub-phase setup in one command. Reads the sub-phase from `ROADMAP.md`, creates the
`phase-X-Y` branch off `master`, creates the `Phase X.Y` milestone in Gitea (with the
roadmap description as the milestone description), then generates 4–8 issues and a
pre-created branch for each one. Posts a `Branch: 'name'` comment on every issue for
downstream skills to reference.

Returns a summary table of all issues and their branches when done.

**Use when:** Starting a new sub-phase. Run once before any development begins.

---

### [`/create-issues [subPhase]`](/.claude/skills/create-issues/SKILL.md)

Creates issues only - no branch or milestone setup. Reads the sub-phase from `ROADMAP.md`
and generates issues with the same rules as `/create-sub-phase`. Use when you want
manual control over branch naming or need to add issues to an existing sub-phase. 

**Use when:** The sub-phase branch and milestone already exist and you need more issues,
or you prefer to manage branches yourself.

---

## Development Skills

### [`/create-issue-plan [issue]`](/.claude/skills/create-issue-plan/SKILL.md)

Reads issue from Gitea, analyzes the required work, builds a multi-agent plan, and asks
for approval. After approval, saves the plan to `.claude/plans/issue-N.md` - this file
is the handoff to `/execute-issue-plan`.

Plan includes: issue and target branch, which agents are needed, mockup file if one exists, 
per-agent file list and acceptance criteria, execution order.

**Use when:** The issue is complex enough to warrant reviewing the plan before writing
any code. Pair with `/execute-issue-plan` to switch to a faster model for execution.

---

### [`/execute-issue-plan [issue]`](/.claude/skills/execute-issue-plan/SKILL.md)

Reads `.claude/plans/issue-N.md`, checks out and rebases the issue branch, spawns
implementation agents, runs QA review, then pauses for user confirmation before
committing and opening a PR into the sub-phase branch.

Stops with an error if no plan file is found - run `/create-issue-plan` first.

**Use when:** Following up a `/create-issue-plan` session, especially when you want to
use a different model for execution than for planning.

---

### [`/complete-issue [issue]`](/.claude/skills/complete-issue/SKILL.md)

Fully autonomous. Reads the issue from Gitea, checks out and rebases the pre-created
branch, spawns agents, performs code review, commits, and opens a PR into the sub-phase branch -
all without user input. Safe because all work stays in the issue's isolated branch.

Stops with an error if no pre-created branch comment is found on the issue.

**Use when:** The issue is straightforward and you want zero interruptions.

---

### [`/qa-review`](/.claude/skills/qa-review/SKILL.md)

Runs a comprehensive read-only QA review of all changes in the current sub-phase branch 
compared to master. Verifies all acceptance criteria across every issue in the milestone. 
Optionally tests in browser if Playwright MCP is available.

Returns a summary report of the review.

**Use when:** Completing a sub-phase implementation before opening a pull request.

---

## Documentation Skills

### [`/update-documentation`](/.claude/skills/update-documentation/SKILL.md)

Spawns three agents in parallel - `backend-engineer`, `frontend-ux`, and `infra-devops` - each summarizing 
their area of the codebase. Uses those summaries to write and update `README.md` and any 
relevant documentation found in `docs/api/`, `docs/database/`, and `docs/components`. 
Preserves existing README content that is still accurate.

**Use when:** All sub-phases are merged into `master` and the project is feature-complete.
Can also be run after any major phase to keep docs current.

---

## Reference

### Available Skills

| Skill Name | Description | Recommended Models |
| ---------- | ----------- | ------------------ |
| `/create-project-roadmap` | Generates a high-level project roadmap from labeled input and saves it to `ROADMAP.md` | **Deep-Reasoner** / Swift-Reasoner | 
| `/expand-project-roadmap` | Reads `ROADMAP.md` and expands each phase into sub-phases with descriptions and done definitions | **Deep-Reasoner** / Swift-Reasoner | 
| `/review-project-roadmap` | Critically reviews `ROADMAP.md` as an independent pass, flagging gaps, sequencing problems, and anything misscoped. Does not modify any files | **Swift-Reasoner** / Precise-Coder | 
| `/create-mockup` | Reads a sub-phase from ROADMAP.md, extracts frontend design requirements using the `frontend-ux` subagent, and generates HTML mockup variants for comparison before implementation | **Precise-Coder** / Swift-Reasoner |
| `/create-sub-phase` | Sets up sub-phase - create Gitea issues and branches based on sub-phase in project roadmap | **Deep-Reasoner** / Swift-Reasoner | 
| `/create-issues` | Creates Gitea issues based on sub-phase in project roadmap | **Deep-Reasoner** / Swift-Reasoner | 
| `/create-issue-plan` | Reads an issue from Gitea and creates a plan for implementation | **Swift-Reasoner** / Deep-Reasoner | 
| `/execute-issue-plan` | Executes the saved plan for a Gitea issue | **Quick-Coder** / Precise-Coder | 
| `/complete-issue` | Fully autonomous mode - works on a Gitea issue from start to finish without pausing for user confirmation | **Precise-Coder** / Quick-Coder | 
| `/qa-review` | Runs a comprehensive read-only QA review of all changes in the current sub-phase branch compared to master | **Precise-Coder** / Deep-Reasoner |
| `/update-documentation` | Updates project `README.md` and documentation based on current code base | **Quick-Coder** / Coder-Agent | 

### Naming Conventions

| Name | Format | Example |
| ---- | ------ | ------- |
| Sub-phase branch | `phase-X-Y` | `phase-3-9` |
| Issue branch | `YYYY-MM-DD-short-summary` | `2026-05-25-add-notes-tooltip` |
| Milestone | `Phase X.Y` | `Phase 3.9` |
| Issue → PR target | Sub-phase branch | `phase-3-9` |
| Sub-phase → final merge | `phase-X-Y` → `master` | Done manually |

### Workflow

1. **Scoping:** start with `/create-project-roadmap`, `/expand-project-roadmap`, and `/review-project-roadmap` to build ROADMAP.md. All development work will come from this file.
2. **UI/UX Mockup (optional):** use `/create-mockup` to create one or more HTML mockups for ideas on implementing more complex UI features.
3. **Task Creation:**
    - Use `/create-sub-phase` to create Gitea issues, branches, and milestones. 
    - Use `/create-issues` to only create the issues.
4. **Development:**
    - Use `/complete-issue` to have Claude work an issue from start to finish and open a PR.
    - Use `/create-issue-plan` followed by `/execute-issue-plan` to work an issue in steps (for more complex tasks).
    - Use `/qa-review` in the sub-phase branch when all issues have been completed and merged.
5. **Document Changes:** use the `/update-documentation` after each phase or sub-phase to keep documentation files up-to-date.

---

## Resources

- [AI Models Guide](/docs/guides/ai-models.md)
- [Claude Subagents Guide](/docs/guides/claude-subagents.md)
- [Project Roadmap Guide](/docs/guides/project-roadmap.md)