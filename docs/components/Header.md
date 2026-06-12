---
name: Header
title: Header Component
file: `frontend/src/components/Header.jsx`
description: A white top bar with app title, search input, "Follow-up Reminders" button, and "Add Job" button. Fully controlled by parent state.
---

# Header

## What it renders

- Section 1 (30% width): Title text "Job Tracking Board"
- Section 2 (40% width): Search input with magnifying glass icon, spans full section width
- Section 3 (30% width, right-aligned): "Follow-up Reminders" button with a badge pill showing `reminderCount`, and "Add Job" button, spaced with `gap-2`

## Props

| Prop | Type | Purpose |
|---|---|---|
| `searchValue` | `string` | Current search text (controlled by App) |
| `onSearchChange` | `(val: string) => void` | Setter for search text (App's `setSearchQuery`) |
| `onAddJob` | `() => void` | Opens the modal in create mode (App's `handleAddJob`) |
| `onToggleReminderDrawer` | `() => void` | Toggles the reminder drawer open/close state (App's `handleToggleReminderDrawer`) |
| `reminderCount` | `number` | Number of pending follow-up reminders, shown as a badge pill on the reminders button |

## State managed

None — fully controlled.

## Side effects

None.

## Notes

Search state (`searchQuery`) is managed in App.jsx and applied via `filteredJobs` (a `useMemo` that filters by `company` and `position`). The filtered list is passed to `KanbanBoard` as the `jobs` prop.
