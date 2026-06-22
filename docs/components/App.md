---
name: App
title: App Component
file: `frontend/src/App.jsx`
description: The root component that renders the entire application shell and owns all application state.
---

# App

## What it renders

A layout consisting of a collapsible sidebar, header bar, Kanban board main area, and the JobModal dialog overlay.

## Props

None — this is the top-level component.

## State

| State | Type | Purpose |
|---|---|---|
| `sidebarOpen` | `boolean` | Sidebar expanded/collapsed toggle — initialized from `window.matchMedia('(min-width: 1024px)').matches` and synced on breakpoint changes via a `useEffect` listener |
| `searchQuery` | `string` | Value of the header search input — case-insensitive substring filter applied to `company` and `position` fields |
| `hideOldApplications` | `boolean` | Toggles filtering out Applied jobs older than 30 days — defaults to `true` |
| `jobs` | `Job[]` | Full job list fetched from `/api/jobs` |
| `filteredJobs` | `Job[]` | Derived from `jobs` via `useMemo` — first filters out old applications (Applied status, older than 30 days) when `hideOldApplications` is enabled, then applies `searchQuery` filter (case-insensitive substring match on `company` OR `position`); returns all jobs when both filters are inactive |
| `loading` | `boolean` | Loading indicator shown on initial fetch |
| `modalOpen` | `boolean` | JobModal open/close toggle |
| `editingJob` | `Job \| null` | The job being edited, or `null` for create mode |
| `drawerOpen` | `boolean` | ReminderDrawer open/close toggle |
| `profileCardOpen` | `boolean` | JobProfileCard open/close toggle |
| `viewingJob` | `Job \| null` | The job being viewed in the profile card |

Reminders are derived state — computed from `jobs` on every render via the `computeReminders(jobs, today)` helper function above the `App` component. This ensures reminders always stay in sync with job data regardless of how jobs are modified (modal edit, drag-and-drop, delete, or dismiss).

## Side effects

- `useEffect([])` — calls `fetchJobs()` once on mount to load all jobs from the API.
- `useEffect([])` — registers a `matchMedia('(min-width: 1024px)')` change listener that syncs `sidebarOpen` to `e.matches` on breakpoint transitions.

## Key handlers

| Handler | Purpose |
|---|---|
| `fetchJobs()` | GET `/api/jobs`, sets `jobs` and `loading` (no longer computes reminders — that is handled by the derived `computeReminders()` helper) |
| `handleModalSubmit(data)` | POST or PUT `/api/jobs/{id}`, refreshes job list on success |
| `handleDeleteJob(id)` | DELETE `/api/jobs/{id}`, removes from local state on success (reminders recompute automatically from updated `jobs`) |
| `handleBoardUpdate(updatedJobs)` | Optimistic update of `jobs` array after drag-reorder |
| `handleAddJob()` | Opens modal in create mode (`editingJob = null`) |
| `handleEditJob(job)` | Opens modal in edit mode with job data pre-filled |
| `handleDismissReminder(id)` | Optimistically updates local `jobs` state (sets `follow_up_dismissed: 1`), then PUTs `/api/jobs/{id}` with `follow_up_dismissed: true`. Reverts optimistic update on API failure. |
| `handleDismissAllReminders()` | Optimistically updates local `jobs` state for all current reminders (sets `follow_up_dismissed: 1`), then PUTs each via API. Reverts all on API failure. |
| `handleViewJob(job)` | Opens the profile card modal with the given job (`viewingJob = job`, `profileCardOpen = true`) |

## Component tree

```
App
└── div.flex.h-screen.bg-gray-100.relative          // layout wrapper
    ├── aside.lg:hidden.relative.w-16.z-25           // placeholder for 16px gutter at < 1024px
    ├── aside (sidebar)
    │   └── Sidebar (isOpen, onToggle)
    └── div.flex-1.flex.flex-col.overflow-hidden     // main content area
        ├── Header (searchValue, onSearchChange, onAddJob, onToggleReminderDrawer, reminderCount)
        ├── KanbanBoard (filteredJobs, onBoardUpdate, onDeleteJob, onEditJob, onViewJob)
        ├── JobModal (isOpen, onClose, onSubmit, initialData)
        ├── JobProfileCard (isOpen, onClose, job)
        └── ReminderDrawer (isOpen, onClose, reminders, reminderCount, onDismiss, onDismissAll, onViewJob)
```

## State management pattern

All state is lifted to this single component and passed down via props. No React Context, custom hooks, or external state libraries are used. Callbacks flow upward for mutations.
