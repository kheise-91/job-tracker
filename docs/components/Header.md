---
name: Header
title: Header Component
file: `frontend/src/components/Header.jsx`
description: A white top bar with app title, search input, and "Add Job" button. Fully controlled by parent state.
---

# Header

## What it renders

- Title text: "Job Tracking Board"
- Search input with magnifying glass icon
- "Add Job" button that opens the modal in create mode

## Props

| Prop | Type | Purpose |
|---|---|---|
| `searchValue` | `string` | Current search text (controlled by App) |
| `onSearchChange` | `(val: string) => void` | Setter for search text (App's `setSearchQuery`) |
| `onAddJob` | `() => void` | Opens the modal in create mode (App's `handleAddJob`) |

## State managed

None — fully controlled.

## Side effects

None.

## Notes

The search state is passed from App but not yet consumed by any downstream component (KanbanBoard, JobCard). The search input is currently cosmetic.
