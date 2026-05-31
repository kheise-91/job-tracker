---
name: project-roadmap
title: Project Roadmap Guide
description: A guide to creating a project roadmap - split into phases and sub-phases. To streamline the process, Claude Code skills can be used.
---

# Project roadmap guide

A guide for planning apps from scratch to completion using local AI models and Claude skills, ending with auto-generated Gitea issues on a kanban board.

---

## Before Starting - Build Feature List

Your feature list must exist before you run any prompts or use any skills. The roadmap's job is to figure out *how* and *when* to implement your features - it can't do that if the features aren't defined yet. A roadmap generated without one will invent scope for you.

```
## Features
- Feature A - one sentence description
- Feature B
- Feature C
```

The model will distribute these across phases when you run Prompt 1. When you expand sub-phases in Prompt 2, each sub-phase already knows which features it's responsible for - you're drilling into the *how*, not deciding the *what*.

---

## Roadmap Structure

### Number of Phases

4–6 phases is the right range for most apps. A typical structure:

```
Phase 1 - Foundation
Phase 2 - Core Features
Phase 3 - Polish & Testing
Phase 4 - Deployment
Phase 5 - Post-launch (optional.. can be added later for additional features)
```

Fewer than 4 usually means you're glossing over something. More than 6 usually means you're splitting hairs.

### Number of Levels

**Two levels in the roadmap. Stop there.**

```
Phase 1 - Foundation
  1.1 - Project scaffolding and dev environment
  1.2 - Database schema and data models
  1.3 - Auth system
```

Three levels (1.1.1) crosses from roadmap into task management. At that point you're writing tickets, not a plan. The roadmap answers *what and in what order* - tasks answer *how*. Tasks live in Gitea issues, not in the roadmap document.

---

## Prompting Workflow

Three prompts - more than that and you lose coherence between sessions; fewer and you skip detail that matters.

| # | What it produces | Session |
|---|---|---|
| Prompt 1 | Project brief + high-level phases | New session |
| Prompt 2 | Sub-phase expansion for all phases | Same session as Prompt 1 |
| Prompt 3 | Cross-cutting review - gaps, risks, sequencing | Fresh session, different model |

**Keep Prompts 1 and 2 in the same session.** The model needs the full reasoning behind the phase structure while it drills down. Splitting them across sessions is what causes inconsistency - the model in the second session fills gaps with assumptions instead of the actual decisions made in the first.

**Use a fresh session and a different model for Prompt 3.** A model critiquing its own output in the same session will be sycophantic. A fresh session genuinely catches blind spots.

---

## The Prompts

Click on each skill name to view the prompts being used.

### Prompt 1 - High-level Roadmap

Start a new session and invoke the [`/create-project-roadmap`](/.claude/skills/create-project-roadmap/SKILL.md) skill, passing the information from the example below.

This will build the first level of the project roadmap.

*Follow the format in the example below.*

```
/create-project-roadmap
Description: A job tracker PWA for managing job applications across different stages of the hiring process.
Frontend: React + Tailwind CSS
Backend: PHP
Database: SQLite
Other: None
Features: Kanban board, CRUD for jobs, notes preview on hover, follow-up reminders, search and filter
Constraints: Solo developer, Docker deployment
```

---

### Prompt 2 - Sub-phase Expansion

While in the same session, invoke the [`/expand-project-roadmap`](/.claude/skills/expand-project-roadmap/SKILL.md) skill (no arguments   needed).

This will build the second level of the project roadmap

---

### Prompt 3 - Independent Review

Start a fresh session using a different model and invoke the [`/review-project-roadmap`](/.claude/skills/review-project-roadmap/SKILL.md) skill (no arguments).

This will review the created roadmap, and provide any feedback. This skill will *not* edit the roadmap.

---

## Breaking sub-phases into Gitea issues

Once the roadmap is finalized, expand each sub-phase into tasks one at a time.

Invoke one of the following skills to split a sub-phase into actionable Gitea issues:
- [/`create-sub-phase`](/.claude/skills/create-sub-phase/SKILL.md) - Creates a branch for the sub-phase, milestone to match the sub-phase, issues for required work and a branch for each issue 
- [/`create-issues`](/.claude/skills/create-issues/SKILL.md) - Only breaks up the sub-phase into Gitea issues, leaving more room for user control over milestones, branches, etc.

---

## Adding new features mid-development

1. Update `ROADMAP.md` to add create a new Phase after the existing phases titled `Additional Features` (if it doesn't already exist)
2. Add new sub-phases with titles and descriptions of the feature
2. Invoke one of the task breakdown skills to create necessary Gitea issues

**Always update the roadmap before creating issues, not after.** The roadmap is the source of truth. If it doesn't reflect what you're actually building, it's useless.

---

## Keeping the roadmap as a navigation document

Name your Gitea milestones to match your sub-phase numbering exactly. Then link each sub-phase in `ROADMAP.md` to its milestone:

```markdown
- [ ] **[Phase 1.3 - Auth System](http://your-gitea/owner/repo/milestones/3)**

Sets up JWT-based authentication, refresh tokens, and session management.
Done when: users can register, log in, receive a JWT, refresh it, and log out.
All endpoints return appropriate 401/403 responses for invalid or missing tokens.
```

This makes the roadmap a living navigation document. You can jump from any sub-phase to its open issues without switching contexts.

---

## Resources

- [Claude Skills Guide](/docs/guides/claude-skills.md)