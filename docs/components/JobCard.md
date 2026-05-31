---
name: JobCard
title: Job Card Component
file: `frontend/src/components/JobCard.jsx`
description: A white card displaying job details (company, position) with action buttons for notes, hyperlink, edit, and delete, plus a date badge when applicable.
---

# JobCard

## What it renders

- Company name and position
- Date badge in top-right corner (interview date or followed-up date, depending on status)
- Action buttons: notes tooltip, hyperlink, edit, delete

## Props

| Prop | Type | Purpose |
|---|---|---|
| `job` | `Job` | The job data object (from kanban card node `content`) |
| `status` | `string` | Current column/status of the job |
| `onEdit` | `(job: Job) => void` | Edit callback (from parent via KanbanBoard configMap) |
| `onDelete` | `(id: number) => void` | Delete callback (from parent via KanbanBoard configMap) |

## State

| State | Type | Purpose |
|---|---|---|
| `showNotes` | `boolean` | Whether the notes tooltip is visible |
| `tooltipPosition` | `{ top: number, left: number }` | Position for the portal-rendered notes tooltip |

## Side effects

- `useEffect([showNotes])` — when `showNotes` becomes true, calculates the button's viewport rect via `getBoundingClientRect` and sets `tooltipPosition`.

## Helper functions

| Function | Purpose |
|---|---|
| `formatInterviewDate(dateStr)` | Parses ISO datetime string, formats as "May 27, 2:30 PM" |
| `formatFollowedUpDate(dateStr)` | Parses date-only string as local date (avoids UTC shift), formats as "May 27" |

## Notable patterns

Notes tooltip is rendered via `createPortal(..., document.body)` to escape all parent `overflow: hidden` containers from the kanban library. `formatFollowedUpDate` uses `new Date(year, month - 1, day)` instead of passing the string directly to `new Date()` to avoid UTC shift in negative-offset timezones.
