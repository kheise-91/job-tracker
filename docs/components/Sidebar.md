---
name: Sidebar
title: Sidebar Component
file: `frontend/src/components/Sidebar.jsx`
description: A dark-themed vertical navigation panel with logo, title, and nav links. Fully controlled by parent.
---

# Sidebar

## What it renders

- Logo and app title (hidden when collapsed)
- Three navigation links: "Job Tracking Board", "Interview Prep", "Resources"
- When collapsed, shows only a slim icon-only bar

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Whether sidebar is expanded |
| `onToggle` | `() => void` | Callback to toggle sidebar state (defined in App) |

## State managed

None — fully controlled by parent.

## Side effects

None.

## Notes

The "Interview Prep" and "Resources" links are currently placeholders (`<a href="#">`). The sidebar is a presentational component with no internal logic.
