---
name: create-mockup
description: Reads a sub-phase from ROADMAP.md, extracts frontend design requirements using the `frontend-ux` subagent, and generates HTML mockup variants for comparison before implementation.
disable-model-invocation: true
effort: xhigh
arguments: [subPhase, numberOfMockups]
---

The subPhase number is: $subPhase. If no $subPhase number is passed, stop and 
ask the user for a sub-phase number before proceeding.

The number of mockups to create is: $numberOfMockups. If no $numberOfMockups is 
passed, default to creating 3 mockups.

---

## Step 1 - Read the sub-phase

Read @ROADMAP.md and find the sub-phase matching "$subPhase" (e.g. "3.10" matches
"- [ ] **3.10...**" or "**3.10**"). Extract the sub-phase title and the full 
sub-phase description including any implementation notes.

If no matching sub-phase is found, stop and alert the user.

---

## Step 2 - Extract frontend design requirements

From the sub-phase description, extract only the information relevant to UI and
frontend design:

**Include:**
- Component names and structure (examples: `ReminderPanel.jsx`, `JobCard.jsx`, etc.)
- Layout and positioning descriptions (sub-header, left/right alignment, widths)
- Visual elements (buttons, badges, icons, text content)
- Interaction and behavior (hover, click, toggle, slide-down, overlay)
- Display logic (what shows when, conditional rendering)
- Text content and labeling
- Styling details (color references, spacing, scroll behavior)

**Ignore:**
- Database schema changes
- API endpoint details and HTTP methods
- Query logic and SQL conditions
- Server-side implementation notes
- Anything inside an "Implementation note" callout that describes backend behavior

Summarize the extracted frontend requirements in plain language before proceeding.
If the sub-phase contains no meaningful frontend work, report that and stop.

---

## Step 3 - Delegate Style Extraction to Frontend Subagent

Spawn the `frontend-ux` subagent to analyze the existing frontend architecture. Do not use local file tools for this step; you must call the subagent tool. 

Provide the subagent with this exact prompt:
```text
Analyze the existing codebase inside `frontend/src/` to extract visual design conventions for a new mockup. 
1. Inspect the global stylesheet (e.g., `frontend/src/index.css`) for Tailwind patterns, CSS variables, and core theme colors.
2. Inspect the core components in `frontend/src/components/` to identify common spacing patterns, border radiuses, and layout structures.
3. Determine if the application defaults to a light or dark theme.

Return a markdown summary of these visual styles to the orchestrator. Do not attempt to read files outside your permitted directories or write any mockup files.
```

Await the subagent's markdown response before moving on to Step 4. Use the subagent's summary to assist with planning and generating the mockups.

---

## Step 4 - Plan $numberOfMockups distinct variants

Before writing any HTML, think through $numberOfMockups meaningfully different
approaches to the frontend design extracted in Step 2. Variants must differ in
**structure or interaction pattern** - not just color or size.

For each variant, decide:
- A short kebab-case name capturing what makes it distinct
  (e.g. `slide-panel`, `inline-list`, `modal-drawer`)
- One sentence describing its approach and tradeoff

Do not start writing HTML until all $numberOfMockups variants are planned.

---

## Step 5 - Generate each variant

For each planned variant, produce a complete, self-contained HTML file:

**Reference Warning**
- The first two lines of the HTML file should contain a warning to any model reading
  the mockup that let's it know not to just blindly copy the classes or inline styles:
  ```HTML
  <!-- VISUAL REFERENCE ONLY -->
  <!-- Do NOT blindly copy class names or styles from this file. Use this mockup for layout, structure, and interaction intent only. -->
  ```

**Structure requirements:**
- Use Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Include a reference bar at the top showing:
  - Sub-phase: $subPhase - [sub-phase title]
  - Variant: [variant name] - [one-sentence description]
- Show the component in enough surrounding context to be meaningful - a realistic
  section of the app UI, not the component in isolation
- Use realistic placeholder data from the job tracker context: company names,
  positions, dates, notes text

**Quality requirements:**
- Fully styled - no unstyled placeholders or TODO comments
- Match the color palette and Tailwind conventions from the existing codebase
- If the design involves interaction (hover, click, toggle, slide), implement it
  with vanilla JS so the mockup is interactive in the browser
- All frontend requirements extracted in Step 2 should be visibly addressed

---

## Step 6 - Save and report

Create the `frontend/mockups/` directory if it does not exist. For the filename, replace
the '.' character in the sub-phase number with '-'. Save each variant as:
```
frontend/mockups/phase-$subPhase-[variant-name].html
```

Example for sub-phase 3.10 with 3 variants:
```
frontend/mockups/phase-3-10-slide-panel.html
frontend/mockups/phase-3-10-inline-list.html
frontend/mockups/phase-3-10-modal-drawer.html
```

Print a summary table:

| File | Approach | Best suited for |
|---|---|---|
| `frontend/mockups/phase-3-10-slide-panel.html` | [description] | [when this wins] |
| `frontend/mockups/phase-3-10-inline-list.html` | [description] | [when this wins] |