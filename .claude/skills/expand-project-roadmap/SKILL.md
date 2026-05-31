---
name: expand-project-roadmap
description: Reads `ROADMAP.md` and expands each phase into sub-phases with descriptions and done definitions.
disable-model-invocation: true
effort: max
---

## Step 1 - Read the roadmap

Read @ROADMAP.md in the current directory. If the file does not exist, stop and report:
> "No ROADMAP.md found - run `/create-project-roadmap` first."

If $ARGUMENTS contains a phase number (e.g. "3" or "Phase 3"), expand only that phase.
If $ARGUMENTS is empty, expand all phases that have not been expanded yet (phases that
contain no sub-phases).

---

## Step 2 - Expand each phase into sub-phases

For each phase being expanded, produce 3–6 sub-phases (more or less is fine if absolutely necessary). 

Each sub-phase must have:

- **A short title** that describes what is being built (not a generic label like
  "Frontend work" - be specific: "JWT auth endpoints", "Notes preview tooltip", etc.)
- **A prose description** (3–5 sentences) covering:
  - What gets built or decided
  - Which specific files, components, tables, or APIs are involved
    (name them explicitly - this is what drives accurate issue generation later)
  - How it fits into the phase goal
- **A "Done when" definition** - one concrete, testable statement

**Rules:**
- Sub-phases must be sequenced so each one has a working foundation from the previous
- If a sub-phase touches multiple layers (database + API + UI), say so explicitly -
  don't split it by layer unless the layers are genuinely independent
- If expanding all phases, maintain consistent granularity across the whole roadmap
- Do not create tasks or checklists - sub-phases only

---

## Step 3 - Review for gaps and sequencing problems

Before writing to disk, check the full expanded roadmap for:
- Missing pieces not covered by any sub-phase
- Sub-phases in the wrong order
- Any phase trying to do too much (flag it, don't silently split it)
- Anything that looks like a task rather than a sub-phase

Report any issues found. If they are minor, fix them automatically. If they are
significant (e.g. a missing phase or major sequencing problem), describe them and
ask before proceeding.

---

## Step 4 - Update ROADMAP.md

Write the expanded sub-phases into `ROADMAP.md` under their respective phases,
using this structure (phase description and "done when" should be tab indented):

```markdown
## [ ] Phase 3 - Feature Development

  [Existing phase description]

  Done when: [existing definition]

- [ ] **3.1 - [Sub-phase title]**

  [Description - including specific file names, components, tables mentioned]

  Done when: [concrete, testable definition]

- [ ] **3.2 - [Sub-phase title]**

[Description]

Done when: [definition]
```

Preserve all existing content in `ROADMAP.md` exactly - only add sub-phases under
phases that were expanded. Do not modify phase titles, descriptions, or completion
status markers.

Confirm the file was updated and print a one-line summary of each sub-phase added.