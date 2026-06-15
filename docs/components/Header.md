---
name: Header
title: Header Component
file: `frontend/src/components/Header.jsx`
description: A white top bar with app title, search input, "Reminders" button, and "Add Job" button. Responsive layout collapses to icon-only buttons and moves search into the third column below 1200px. Fully controlled by parent state.
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

Uses Tailwind's `xl:` prefix (1200px breakpoint):
- `hidden xl:block` — hides the second column (search container) below 1200px
- `hidden xl:inline` — hides button text and badge below 1200px
- `w-[66%] xl:w-[30%]` — third column takes 66% below 1200px, reverts to 30% at desktop
- Search bar appears twice in the markup: once in the second column (desktop) and once in the third column (mobile), each toggled via `xl:hidden` / `hidden xl:block`

## Notes

Search state (`searchQuery`) is managed in App.jsx and applied via `filteredJobs` (a `useMemo` that filters by `company` and `position`). The filtered list is passed to `KanbanBoard` as the `jobs` prop.
