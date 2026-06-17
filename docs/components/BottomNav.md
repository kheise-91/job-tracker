---
name: BottomNav
title: BottomNav Component
file: `frontend/src/components/BottomNav.jsx`
description: Fixed bottom navigation bar visible only below 768px with three action buttons: Menu (opens sidebar), Add Job (opens create modal), and Reminders (opens reminder drawer with badge count).
---

# BottomNav

## What it renders

A fixed bottom navigation bar (`fixed bottom-0 left-0 right-0`) with three evenly-spaced buttons, visible only on screens below 768px (`md:hidden`). Uses `bg-sidebar` for the dark theme matching the sidebar.

### Buttons (left to right)

1. **Menu** — `Bars3Icon` with "Menu" label below. Calls `onToggle` which toggles `sidebarOpen` in App, opening the sidebar overlay on mobile.
2. **Add Job** — `PlusIcon` inside a circular `bg-primary` button with white icon and `shadow-lg`. Calls `onAddJob` which opens the JobModal in create mode.
3. **Reminders** — `BellIcon` with an optional red badge pill showing `reminderCount` (only rendered when count > 0). Calls `onToggleReminderDrawer` which toggles the ReminderDrawer.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `onToggle` | `() => void` | Opens the sidebar overlay (App's `() => setSidebarOpen(!sidebarOpen)`) |
| `onAddJob` | `() => void` | Opens the create-job modal (App's `handleAddJob`) |
| `onToggleReminderDrawer` | `() => void` | Opens/toggles the reminder drawer (App's `handleToggleReminderDrawer`) |
| `reminderCount` | `number` | Number of pending reminders, shown as a badge on the Reminders button |

## State managed

None — fully controlled by parent.

## Responsive behavior

- Visible only below 768px via `md:hidden` on the `<nav>` element.
- Tablet (>= 768px) and desktop (>= 1024px) see no bottom nav; they use the Header buttons and desktop sidebar instead.

## Side effects

None.

## Notes

The component mirrors the three primary actions available in the Header on desktop. The Add Job button uses a prominent circular style (`w-9 h-9 rounded-full bg-primary`) to stand out as the primary action, consistent with the mockup's design intent.
