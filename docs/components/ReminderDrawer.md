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
| `reminders` | `Array<{ id: number, company: string, position: string, daysAgo: number, date_applied: string }>` | List of reminder items to display (derived from jobs state in App.jsx via `computeReminders()`) |
| `reminderCount` | `number` | Total count of reminders (used to disable "Dismiss All" when zero) |
| `onDismiss` | `(id: number) => void` | Dismiss a single reminder — App.jsx handler optimistically updates local state immediately, then makes a PUT call to set `follow_up_dismissed: true` (called by X button on each item, wrapped in `handleDismiss` which triggers a 200ms slide-out animation before calling the API). Reverts optimistic update on API failure. |
| `onDismissAll` | `() => void` | Dismiss all reminders at once — App.jsx handler optimistically updates local state for all reminders immediately, then makes PUT calls to set `follow_up_dismissed: true` on each (called by Dismiss All button via `handleDismissAll`, which staggers animations at 50ms intervals then calls this after the last animation completes). Reverts all on API failure. |
| `onViewJob` | `(job: object) => void` | Open the JobProfileCard for a given job — called when a reminder list item is clicked (not the dismiss button). App.jsx passes `handleViewJob` which sets `viewingJob` and `profileCardOpen` state. |

## Layout

- **Backdrop**: `fixed inset-0 bg-black/20 z-[100]` — semi-transparent overlay, clickable to close
- **Drawer panel**: `fixed top-0 right-0 h-full w-96 z-[110]` — white background, left border, shadow, slides in with CSS transition
- **Header**: flex row with BellIcon + title (left), Dismiss All button (right), border-bottom divider
- **List**: `flex-1 overflow-y-auto` — maps reminders or shows empty state; each reminder item is clickable (calls `onViewJob` with the reminder job object) with `hover:bg-gray-50` and `cursor-pointer` visual feedback; the dismiss X button uses `e.stopPropagation()` to prevent the click from bubbling to the parent
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

## Derived State (App.jsx)

Reminders are computed on every render as derived state, not fetched independently:
- `computeReminders(jobs, today)` filters the `jobs` array for Applied-status jobs where `follow_up_dismissed` is false and the application date falls within the 7–14 day window
- Computes `daysAgo` for each matching job
- Returns the array directly to `ReminderDrawer` — no separate state variable or API call

## Animation

**Drawer panel**: Uses inline `style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}` with `transition-transform duration-200 ease-out`. When `isOpen` is `false`, the drawer panel animates out via `translateX(100%)` rather than being removed from the DOM.

**Reminder item dismiss**: When a single reminder is dismissed via its X button, the item animates out with `opacity → 0` and `translateX(20px)` over 200ms before being removed from the DOM. This is handled by a `useState(new Set())` (`animatingIds`) that triggers a re-render when an ID is added, causing the `.animate-exit` CSS class to be applied. The `handleDismiss` function adds the ID to the set via `setAnimatingIds`, and after a 200ms `setTimeout` calls `onDismiss` (which optimistically updates App state immediately, then persists via API). IDs are not removed from the set after dismissal — once added they stay, since the element is removed from the DOM by the parent's state update anyway. "Dismiss All" uses `handleDismissAll`, which staggers adding each reminder ID to the animating set at 50ms intervals (item 1 at 0ms, item 2 at 50ms, etc.), then calls `onDismissAll` after `(n-1) * 50 + 200ms` — ensuring all animations complete before state is cleared. The `.animate-exit` class and `@keyframes slideOutRight` are defined in `index.css`.

## Keyboard interactions

Listens for the `Escape` key and calls `onClose` when pressed while the drawer is open. Uses `useCallback` + `useEffect` with proper cleanup.

## Empty state

When `reminders` array is empty, displays a centered `CheckCircleIcon` (gray-300, 48px) above the text "No pending follow-up reminders."

## Dependencies

- `@heroicons/react/24/outline` — `BellIcon`, `XMarkIcon`, `CheckCircleIcon`, `BriefcaseIcon`
- Tailwind CSS v4 custom colors (`--color-primary`, `--color-primary-dark`)
