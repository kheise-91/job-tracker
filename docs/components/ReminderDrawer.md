---
name: ReminderDrawer
title: Reminder Drawer Component
file: `frontend/src/components/ReminderDrawer.jsx`
description: A right-side sliding drawer panel for displaying and managing follow-up reminder alerts.
---

# ReminderDrawer

## What it renders

A fixed-position, full-height drawer that slides in from the right edge of the screen as an overlay. Contains a header with title, reminder count badge, and "Dismiss All" button; a scrollable list of reminder items (each showing company, position, and days ago); an empty state when no reminders exist; and a "Close" footer button.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Drawer visibility — when `false`, component returns `null` |
| `onClose` | `() => void` | Close callback (called by backdrop click, footer Close button, and Escape key press) |
| `reminders` | `Array<{ id: number, company: string, position: string, daysAgo: number }>` | List of reminder items to display |
| `onDismiss` | `(id: number) => void` | Dismiss a single reminder (called by X button on each item) |
| `onDismissAll` | `() => void` | Dismiss all reminders at once (called by Dismiss All button) |

## Layout

- **Backdrop**: `fixed inset-0 bg-black/20 z-[100]` — semi-transparent overlay, clickable to close
- **Drawer panel**: `fixed top-0 right-0 h-full w-96 z-[110]` — white background, left border, shadow, slides in with CSS transition
- **Header**: flex row with BellIcon + title (left), Dismiss All button (right), border-bottom divider
- **List**: `flex-1 overflow-y-auto` — maps reminders or shows empty state
- **Footer**: `border-t` divider + full-width Close button (gray styling)

## Animation

Uses inline `style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}` with `transition-transform duration-200 ease-out` on the drawer panel. When `isOpen` is `false`, the component returns `null` (not rendered in DOM).

## Keyboard interactions

Listens for the `Escape` key and calls `onClose` when pressed while the drawer is open. Uses `useCallback` + `useEffect` with proper cleanup.

## Empty state

When `reminders` array is empty, displays a centered `CheckCircleIcon` (gray-300, 48px) above the text "No pending follow-up reminders."

## Dependencies

- `@heroicons/react/24/outline` — `BellIcon`, `XMarkIcon`, `CheckCircleIcon`
- Tailwind CSS v4 custom colors (`--color-primary`, `--color-primary-dark`)
