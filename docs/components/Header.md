---
name: Header
title: Header Component
file: `frontend/src/components/Header.jsx`
description: A white top bar with app title, search input, "Reminders" button, and "Add Job" button. Responsive layout: icon-only buttons below 1200px, title hidden below 768px, search full-width below 768px. Fully controlled by parent state.
---

# Header

## What it renders

### Desktop (>= 1200px / `xl` breakpoint)

Three-column flex layout (30% / 40% / 30%):

- **Section 1 (30% width):** Title text "Job Tracking Board"
- **Section 2 (40% width):** Search input with magnifying glass icon, spans full section width
- **Section 3 (30% width, right-aligned):** "Reminders" button with a badge pill showing `reminderCount`, and "Add Job" button, spaced with `gap-2`

### Below 1200px

Two-column flex layout (30% / 66%):

- **Section 1 (30% width):** Title text "Job Tracking Board"
- **Section 2:** Removed entirely (hidden via `hidden xl:block`)
- **Section 3 (66% width):** Search input as the first element (full-width, flex-1), followed by two icon-only buttons of equal square size (`p-2`):
  - **Reminders button:** BellIcon only — text and badge are hidden (`hidden xl:inline`)
  - **Add Job button:** PlusIcon only — text is hidden (`hidden xl:inline`)

Both buttons use `flex items-center justify-center` with `p-2` padding below 1200px to ensure identical square sizing.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `searchValue` | `string` | Current search text (controlled by App) |
| `onSearchChange` | `(val: string) => void` | Setter for search text (App's `setSearchQuery`) |
| `onAddJob` | `() => void` | Opens the modal in create mode (App's `handleAddJob`) |
| `onToggleReminderDrawer` | `() => void` | Toggles the reminder drawer open/close state (App's `handleToggleReminderDrawer`) |
| `reminderCount` | `number` | Number of pending follow-up reminders, shown as a badge pill on the Reminders button (desktop only) |

## State managed

None — fully controlled.

## Side effects

None.

## Responsive behavior

Uses Tailwind's `xl:` prefix (1200px breakpoint) and `md:` prefix (768px breakpoint):

### Desktop (>= 1200px / `xl`)

Three-column flex layout (30% / 40% / 30%) with full title, search bar, and labeled buttons.

### Below 1200px but >= 768px (`md` – `xl`)

Two-column flex layout (30% / 66%):
- Second column hidden (`hidden xl:block`)
- Search bar appears in third column (`hidden xl:block`)
- Button text and badge hidden (`hidden xl:inline`), icon-only buttons
- Third column takes 66% width (`w-[66%] xl:w-[30%]`)

### Below 768px (`md`)

- Title text hidden (`md:hidden`), leaving only search bar and icon-only buttons
- Search bar takes full width (`w-[100%] md:w-[66%]`)
- Button text and badge remain hidden

## Notes

Search state (`searchQuery`) is managed in App.jsx and applied via `filteredJobs` (a `useMemo` that filters by `company` and `position`). The filtered list is passed to `KanbanBoard` as the `jobs` prop.
