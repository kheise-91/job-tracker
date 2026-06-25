---
name: JobModal
title: Job Modal Component
file: `frontend/src/components/JobModal.jsx`
description: A compact grid dialog form for creating or editing a job entry, built with `@headlessui/react`.
---

# JobModal

## What it renders

A modal dialog with a fixed header (title + close button), scrollable form content organized into sections, and a fixed footer (Cancel + Submit buttons). The form uses a compact grid layout: single column on mobile (< 768px), two columns on tablet+ (768px). Modal container is `max-w-5xl` with `max-h-[95vh]`.

### Form Sections

- **Basic Information** — Company (required), Position (required), Salary (optional text input), Status (select dropdown using `STATUSES` array)
- **Dates** — Followed Up Date (date input + clear button), Interview Date (datetime-local input + clear button)
- **Additional Details** — Source, Job Posting URL, Notes (textarea, full-width spanning both columns)

### Layout Details

| Breakpoint | Layout |
|---|---|
| Mobile (< 768px) | Single column for all fields; `p-4` padding, `gap-3` grid spacing |
| Tablet+ (768px+) | Two-column grid where logical (Company/Position, Salary/Status, Dates side-by-side, Source/URL side-by-side); Notes spans both columns. `p-6` padding, `gap-4` grid spacing |

### Styling

- **Inputs:** `text-sm`, `px-3 py-2`, rounded-lg
- **Labels:** `text-xs font-medium`, `mb-1`
- **Section headers:** `text-sm font-semibold text-gray-700 border-b pb-2 mb-3`
- **Focus ring:** `accent-dark` (project design system color) instead of blue-500
- **Footer:** `bg-gray-50` background with top border; Cancel button is gray, Submit uses `bg-accent hover:bg-accent-dark`
- **Scrollable body:** `overflow-y-auto flex-1` between fixed header and footer

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Close callback (App sets modalOpen=false, editingJob=null) |
| `onSubmit` | `(data: object) => void` | Form submission handler (App's `handleModalSubmit`) |
| `initialData` | `Job \| null` | If present, pre-fills form for edit mode; if null, creates fresh form |

## State

| State | Type | Purpose |
|---|---|---|
| `formData` | `object` | Form field values: company, position, salary, status, followed_up_date, interview_date, notes, hyperlink, source |

## Side effects

- `useEffect([isOpen, initialData])` — when the modal opens (`isOpen=true`) or `initialData` changes, populates `formData` from it (editing mode). When opening for a new job (`isOpen=true` and `initialData=null`), resets to a fresh form with empty fields.
- `useEffect([formData.followed_up_date, formData.interview_date])` — auto-updates the status field when date fields are filled while status is "Applied". If `interview_date` is set, status changes to "Interviewing" (takes precedence). If only `followed_up_date` is set, status changes to "Followed Up". Users can still manually override the status after any auto-change.

## Form submission behavior

Filters out empty-string values from `formData`, preserves null date fields, and passes the cleaned object to `onSubmit`. The parent component then dispatches POST or PUT to the appropriate API endpoint.
