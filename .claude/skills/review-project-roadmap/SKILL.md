---
name: review-project-roadmap
description: Critically reviews `ROADMAP.md` as an independent pass, flagging gaps, sequencing problems, and anything misscoped. Does not modify any files.
disable-model-invocation: true
effort: xhigh
---

## Step 1 - Read the roadmap

Read @ROADMAP.md in the current directory. If it does not exist, stop and report:
> "No ROADMAP.md found - run `/create-project-roadmap` and `/expand-project-roadmap` first."

---

## Step 2 - Review critically

You are a senior engineer reviewing this roadmap for the first time with no prior
context. You did not write it. Your job is to find problems, not to validate it.

Review for each of the following. For every issue found, state it directly and suggest
a specific fix - do not soften, do not pad, do not summarize what the roadmap already
says.

**1. Missing or underestimated work**
Is anything that the app clearly needs absent from the roadmap entirely? Are any
sub-phases glossed over in a way that hides significant work?

**2. Sequencing problems**
Are any sub-phases or phases in the wrong order? Does any piece of work depend on
something that comes after it? Would a developer hit a blocker following this sequence?

**3. Phases or sub-phases doing too much**
Is any single phase or sub-phase trying to cover too many concerns at once? If splitting
it would produce clearer, more testable deliverables, flag it.

**4. Decisions deferred too late**
Are there architectural decisions, infrastructure choices, or technical unknowns buried
in a later phase that would derail earlier work if left unresolved? These should surface
in Phase 1 or 2.

**5. Tasks masquerading as sub-phases**
Does anything in the roadmap belong in a Gitea issue rather than the roadmap itself?
Sub-phases should describe a coherent deliverable, not individual file changes or
implementation steps.

**6. Scope and naming accuracy**
Do phase and sub-phase titles accurately reflect what they contain? If a sub-phase
touches both backend and frontend, does its title say so? If a phase is labelled
"Frontend" but sub-phases modify `db.php` or `api.php`, flag it.

---

## Step 3 - Report findings

Structure your output as:

```
## Roadmap review

### Critical (would cause blockers or missing features)
- [Issue]: [Specific fix]

### Sequencing
- [Issue]: [Specific fix]

### Scope / naming
- [Issue]: [Specific fix]

### Minor
- [Issue]: [Specific fix]

### No issues found in
- [Area that looks solid]
```

If a category has no issues, omit it. Do not write a summary of the roadmap. Do not
compliment it. Only report problems and fixes.

Do not modify `ROADMAP.md`. The user will decide which feedback to incorporate.