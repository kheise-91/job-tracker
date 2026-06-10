---
name: JobProfileCard
title: Job Profile Card Component
file: `frontend/src/components/JobProfileCard.jsx`
description: A view-only modal displaying job details in a profile card layout with a hero header, icon-labeled field grid, and notes section.
---

# JobProfileCard

## What it renders

A modal overlay with a centered card (`max-w-lg`) containing:

- **Hero Header** — status-matched gradient background (dark-to-darker shade per status) with company name (large, bold), position name, and a status badge using the light variant of the matching status color.
- **Two-column field grid** — icon-labeled rows for Date Applied (CalendarIcon), Followed Up (BellIcon), Interview Date (UserIcon), Source (NewspaperIcon).
- **Full-width Hyperlink row** — LinkIcon with clickable URL that opens in a new tab.
- **Notes section** — light grey background (`bg-gray-50`), rounded, with PencilIcon and a divider above.
- **Close button** — positioned bottom-right with a divider above, includes XMarkIcon.
- Null/empty values display "Not Set" in italic (`text-gray-400`).

## Props

| Prop | Type | Purpose |
|---|---|---|
| `job` | `Job` | The job data object to display |
| `isOpen` | `boolean` | Modal visibility — component renders nothing when false |
| `onClose` | `() => void` | Callback to close the modal |

## State

None. Component is fully controlled via props.

## Side effects

- `useEffect([isOpen, onClose])` — listens for ESC key press to close the modal.
- `useEffect([isOpen])` — prevents body scroll when modal is open, restores on cleanup.

## Helper functions

| Function / Constant | Purpose |
|---|---|
| `formatDate(dateStr)` | Parses datetime string, formats as "Aug 29, 2025" |
| `formatDateTime(dateStr)` | Parses datetime string, formats as "Aug 29, 2025 at 2:30 PM" |
| `displayValue(val)` | Returns formatted value or `<em>Not Set</em>` for null/empty strings |
| `statusGradient` | Object mapping status strings to CSS `linear-gradient` values using `var(--color-*-status)` and `color-mix` for the dark-to-darker hero header effect |
| `statusBadgeStyle` | Object mapping status strings to inline style objects (backgroundColor, color, borderColor) using `var(--color-*-status-light)` and `var(--color-*-status)` CSS variables |
| `defaultBadgeStyle()` | Returns a neutral gray fallback style for unrecognized statuses |

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"` on the modal container.
- `aria-labelledby` references the company name heading.
- Backdrop click closes the modal.
- ESC key closes the modal.
- Body scroll is locked while modal is open.

## Notable patterns

- Conditional rendering — returns `null` when `isOpen` is false or `job` is absent.
- Uses HeroIcons from `@heroicons/react/24/outline` for all icons.
- Status gradient and badge colors are mapped per status to match the kanban column color scheme, using inline styles with CSS custom properties (`var(--color-*-status)`, `var(--color-*-status-light)`) and `color-mix()` rather than Tailwind utility classes.
- Date formatting uses `toLocaleString` for month names, consistent with JobCard's approach.
