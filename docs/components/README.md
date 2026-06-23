---
name: component-documentation
title: Component Documentation
description: A list of custom React components used in this project.
---

# React Components

The ATS uses a single-page architecture with no client-side routing. All state is lifted to the `App` component and passed down via props.

## Component Tree

```
App (App.jsx)
├── Sidebar (components/Sidebar.jsx)
├── Header (components/Header.jsx)
├── KanbanBoard (components/KanbanBoard.jsx) — receives filteredJobs from App
│   └── JobCard (components/JobCard.jsx, rendered per card)
├── JobModal (components/JobModal.jsx)
├── JobProfileCard (components/JobProfileCard.jsx)
└── ReminderDrawer (components/ReminderDrawer.jsx)
└── BottomNav (components/BottomNav.jsx) — fixed bottom bar with Menu, Add Job, and Reminders buttons, visible only below 768px
```

## Components

| Component | Description |
|-----------|-------------|
| [App](App.md) | Root component — renders the application shell and owns all application state. |
| [Sidebar](Sidebar.md) | Dark-themed vertical navigation panel with logo, title, nav links, and Filters section with "Hide old applications" toggle. Receives `hideOldApplications` state and `onHideOldApplicationsChange` callback as props. Fully controlled by parent. Overlays content at tablet sizes (< 1024px) instead of pushing layout; fills full viewport width on mobile (< 768px) when expanded. |
| [Header](Header.md) | White top bar with title, search input, "Reminders" button, and "Add Job" button. Responsive: icon-only buttons below 1200px, title hidden below 768px, search full-width below 768px. Fully controlled by parent. |
| [KanbanBoard](KanbanBoard.md) | Horizontal-scrollable Kanban board using `react-kanban-kit` with six status columns and drag-and-drop support. |
| [JobCard](JobCard.md) | White card showing job details, date badges, and action buttons. Uses `createPortal` for notes tooltip. |
| [JobModal](JobModal.md) | Compact grid dialog form for creating or editing a job entry, built with `@headlessui/react`. Fixed header/footer with scrollable body, organized into Basic Information, Dates, and Additional Details sections. Two-column grid on tablet+ (768px), single column on mobile. |
| [JobProfileCard](JobProfileCard.md) | View-only modal displaying job details in a profile card layout with a status-matched gradient hero header, icon-labeled field grid, notes section, and ESC/backdrop close handling. |
| [ReminderDrawer](ReminderDrawer.md) | Right-side sliding drawer panel for displaying and managing follow-up reminder alerts, with expand/collapse pagination (5-item default), slide-out dismiss animation (200ms opacity + translateX), full-width on mobile (< 768px), and clickable reminder items that open the JobProfileCard — receives reminder data as props from App component. |
| [BottomNav](BottomNav.md) | Fixed bottom navigation bar visible only below 768px with three action buttons: Menu (opens sidebar), Add Job (opens create modal), and Reminders (opens reminder drawer with badge count). |
