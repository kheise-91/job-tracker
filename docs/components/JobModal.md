---
name: JobModal
title: Job Modal Component
file: `frontend/src/components/JobModal.jsx`
description: A dialog form for creating or editing a job entry, built with `@headlessui/react`.
---

# JobModal

## What it renders

Form fields: Company (required), Position (required), Salary (optional text input), Status (select dropdown), Followed Up Date (date input + clear button), Interview Date (datetime-local input + clear button), Source, Job Posting URL (text input), Notes (textarea).

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Close callback (App sets modalOpen=false, editingJob=null) |
| `onSubmit` | `(data: object) => void` | Form submission handler (App's `handleModalSubmit`) |
| `initialData` | `Job \| null` | If present, pre-fills form for edit mode; if null, creates fresh form with placeholder notes |

## State

| State | Type | Purpose |
|---|---|---|
| `formData` | `object` | Form field values: company, position, salary, status, followed_up_date, interview_date, notes, hyperlink, source |

## Side effects

- `useEffect([initialData])` — when `initialData` changes, populates `formData` from it (editing mode). When `initialData` is null, resets to a fresh form with placeholder divider lines in the notes field.

## Form submission behavior

Filters out empty-string values from `formData`, preserves null date fields, and passes the cleaned object to `onSubmit`. The parent component then dispatches POST or PUT to the appropriate API endpoint.
