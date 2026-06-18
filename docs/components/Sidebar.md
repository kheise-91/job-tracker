---
name: Sidebar
title: Sidebar Component
file: `frontend/src/components/Sidebar.jsx`
description: A dark-themed vertical navigation panel with logo, title, and nav links. Fully controlled by parent. Overlays content at tablet sizes (< 1024px) instead of pushing layout; fills full viewport width on mobile (< 768px) when expanded.
---

# Sidebar

## What it renders

- Logo and app title (hidden when collapsed)
- Three navigation links: "Job Tracking Board", "Interview Prep", "Resources"
- When collapsed, shows only a slim icon-only bar

## Props

| Prop | Type | Purpose |
|---|---|---|
| `isOpen` | `boolean` | Whether sidebar is expanded |
| `onToggle` | `() => void` | Callback to toggle sidebar state (defined in App) |

## State managed

None — fully controlled by parent.

## Responsive Behavior

### Desktop (>= 1024px)
- Sidebar is positioned `lg:relative` (and `lg:hidden` placeholder aside preserves the 16px gutter), sitting within the flex layout.
- Expands/collapses normally, pushing content when toggled.
- Default state: **open** (expanded).

### Tablet (< 1024px)
- Sidebar uses `absolute` positioning with `inset-0 z-50`, overlaying the main content instead of pushing it.
- No backdrop or dim layer is shown behind the overlay sidebar.
- All other elements remain stationary when the sidebar expands or collapses.
- Default state: **collapsed** (icon-only bar).
- Sidebar maintains its normal width (`w-72` = 288px) when expanded in overlay mode.

### Mobile (< 768px)
- Sidebar uses `w-0` when collapsed, `w-full` when expanded — fills the entire viewport width.
- `h-full` ensures the sidebar fills the viewport height.

## Side effects

None — the sidebar component itself is stateless. Its default open/collapsed state responds to window resize via a `matchMedia` breakpoint listener (`(min-width: 1024px)`) defined in the parent `App` component.

## Notes

The "Interview Prep" and "Resources" links are currently placeholders (`<a href="#">`). The sidebar is a presentational component with no internal logic. Default open/closed state is determined by `window.matchMedia('(min-width: 1024px)')` in the App component.
