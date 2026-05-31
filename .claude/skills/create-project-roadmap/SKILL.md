---
name: create-project-roadmap
description: Generates a high-level project roadmap from labeled input and saves it to `ROADMAP.md`.
disable-model-invocation: true
effort: xhigh
---

## Step 1 - Parse the input

Extract the following labeled fields from $ARGUMENTS. Fields follow the format
`Label: value` and run until the next label. Field names are case-insensitive.

| Field | Required | Notes |
|---|---|---|
| `Description` | Yes | 2–4 sentences: what the app does, who uses it, what problem it solves |
| `Frontend` | No | e.g. React + Tailwind, Vue, plain HTML |
| `Backend` | No | e.g. PHP, Node, Python/FastAPI, none |
| `Database` | No | e.g. SQLite, PostgreSQL, none |
| `Other` | No | Auth providers, external APIs, third-party services |
| `Features` | Yes | List of MVP features |
| `Constraints` | No | Team size, deadlines, deployment target, out-of-scope items |

If `Description` or `Features` are missing, ask for them before proceeding.
Use sensible defaults for any missing optional fields (e.g. omit a tech stack
section entirely if no stack fields were provided).

---

## Step 2 - Generate the roadmap

You are a senior software architect. Using the parsed fields, produce a project
roadmap with 4–6 phases (more or less is fine if absolutely necessary). 

Each phase must have:
- A short title that accurately reflects what layer(s) it touches (avoid labeling
  a phase "Frontend" if it also requires backend or database work - use names like
  "Feature Development" or "Auth & User Management" instead)
- A 2–3 sentence description of its goals and deliverables
- A "Done when" definition (one concrete, testable statement)

Sequence phases so each one builds a working, testable foundation for the next.

Flag any architectural decisions or cross-cutting dependencies that should be
resolved early to avoid derailing later phases.

Do not break phases into sub-phases yet - that is a separate step.

---

## Step 3 - Save to ROADMAP.md

Write the roadmap to `ROADMAP.md` in the current project root directory using this structure:

```markdown
# [Project name] - Roadmap

## Key
`[ ]` Not started · `[-]` In progress · `[x]` Complete

---

## [ ] Phase 1 - [Title]

[Description]

Done when: [definition]

---

## [ ] Phase 2 - [Title]

[Description]

Done when: [definition]

---
[...continue for all phases]
```

If `ROADMAP.md` already exists, ask before overwriting it.

Confirm the file was saved and print a one-line summary of each phase.