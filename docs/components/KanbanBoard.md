---
name: KanbanBoard
title: Kanban Board Component
file: `frontend/src/components/KanbanBoard.jsx`
description: A horizontal-scrollable Kanban board using the `react-kanban-kit` library with six status columns and drag-and-drop support.
---

# KanbanBoard

## What it renders

Six status columns (Wishlist, Applied, Followed Up, Interviewing, Offer, Rejected) with draggable job cards. Built on top of `react-kanban-kit`.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `jobs` | `Job[]` | Full job list (from App) |
| `onBoardUpdate` | `(updatedJobs: Job[]) => void` | Called with updated jobs after drag reorder (App's `handleBoardUpdate`) |
| `onDeleteJob` | `(id: number) => void` | Delete handler passed through to JobCard config |
| `onEditJob` | `(job: Job) => void` | Edit handler passed through to JobCard config |
| `onViewJob` | `(job: Job) => void` | View handler passed through to JobCard for opening the profile card |

## State managed

None. All derived from props via `useMemo`.

## Key internal functions

| Function | Purpose |
|---|---|
| `buildDataSource(jobs)` | Transforms flat `Job[]` into the nested node-map structure expected by `react-kanban-kit`. Groups jobs by status, sorts by `order` then `id`, wraps each job as `card-{id}` node. |
| `handleCardMove(cardId, fromType, toType)` | Optimistically updates local state, then calls `PUT /api/jobs/reorder` with the new column mapping. |

## Dead code

- `dataSourceToJobs(dataSource, existingJobs)` — reverse transform, defined but never called.
- `persistBoardState(updatedJobs)` — serializes job IDs by column and sends reorder API call; logic is duplicated inline in `handleCardMove`.

## Notable patterns

Uses `useMemo` to build a `configMap` that maps column type strings to rendering configs. Status columns are non-draggable with colored headers; job-card nodes are draggable and render `<JobCard>`.
