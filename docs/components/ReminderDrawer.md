---
name: ReminderDrawer
title: Reminder Drawer Component
file: `frontend/src/components/ReminderDrawer.jsx`
description: A right-side sliding drawer panel for displaying and managing follow-up reminder alerts, with expand/collapse pagination (5-item default) and API-backed data fetching from App.jsx.
---

# ReminderDrawer

## What it renders

A fixed-position, full-height drawer that slides in from the right edge of the screen as an overlay. Contains a header with title and "Dismiss All" button; a scrollable list of reminder items (each showing briefcase icon, company + position, and formatted application date); an expand/collapse toggle ("+ N more" / "Show less") when more than 5 reminders exist; an empty state when no reminders match the Applied/follow_up_dismissed=false criteria; and a "Close" footer button.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Drawer visibility — when `false`, component stays in DOM with `translateX(100%)` for closing animation |
| `onClose` | `() => void` | Close callback (called by backdrop click, footer Close button, and Escape key press) |
| `reminders` | `Array<{ id: number, company: string, position: string, daysAgo: number, date_applied: string }>` | List of reminder items to display (fetched by App.jsx via `/api/jobs?status=Applied&follow_up_dismissed=false`) |
| `reminderCount` | `number` | Total count of reminders (used to disable "Dismiss All" when zero) |
| `onDismiss` | `(id: number) => void` | Dismiss a single reminder (local-only, no API call yet — called by X button on each item) |
| `onDismissAll` | `() => void` | Dismiss all reminders at once (local-only, no API call yet — called by Dismiss All button) |

## Layout

- **Backdrop**: `fixed inset-0 bg-black/20 z-[100]` — semi-transparent overlay, clickable to close
- **Drawer panel**: `fixed top-0 right-0 h-full w-96 z-[110]` — white background, left border, shadow, slides in with CSS transition
- **Header**: flex row with BellIcon + title (left), Dismiss All button (right), border-bottom divider
- **List**: `flex-1 overflow-y-auto` — maps reminders or shows empty state
- **Expand/Collapse**: "+ N more" button (when collapsed and >5 items) or "Show less" button (when expanded) centered below the list
- **Footer**: `border-t` divider + full-width Close button (gray styling)

## Expand/Collapse Logic

- Default view shows maximum 5 reminder items (`MAX_VISIBLE = 5`)
- When `reminderList.length > 5` and not expanded: shows "+ N more" button after the 5th item
- Clicking "+ N more" sets `expanded = true`, revealing all remaining items
- When expanded and there are more than 5 items: shows "Show less" button
- Clicking "Show less" resets to the collapsed 5-item view
- Expand state resets to `false` whenever `isOpen` changes (drawer opens)

## Date Formatting

Each reminder displays `"Applied {formattedDate} · N days ago"` where:
- `formattedDate` uses the project's existing date formatting pattern from `JobCard.jsx` (`formatFollowedUpDate`): parses the `date_applied` string as a local date and formats as `toLocaleString('en-US', { month: 'short' })` + day number (e.g., "May 24")
- `daysAgo` is pre-computed in `App.jsx` by subtracting `date_applied` from today

## Data Fetching (App.jsx)

`App.jsx` owns the `reminders` state and fetches data when the drawer opens:
- Fetches `/api/jobs?status=Applied&follow_up_dismissed=false`
- Filters to jobs applied 7-14 days ago
- Computes `daysAgo` for each result
- Stores in `reminders` state and passes to `ReminderDrawer`

## Animation

Uses inline `style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}` with `transition-transform duration-200 ease-out` on the drawer panel. When `isOpen` is `false`, the drawer panel animates out via `translateX(100%)` rather than being removed from the DOM.

## Keyboard interactions

Listens for the `Escape` key and calls `onClose` when pressed while the drawer is open. Uses `useCallback` + `useEffect` with proper cleanup.

## Empty state

When `reminders` array is empty, displays a centered `CheckCircleIcon` (gray-300, 48px) above the text "No pending follow-up reminders."

## Dependencies

- `@heroicons/react/24/outline` — `BellIcon`, `XMarkIcon`, `CheckCircleIcon`, `BriefcaseIcon`
- Tailwind CSS v4 custom colors (`--color-primary`, `--color-primary-dark`)
