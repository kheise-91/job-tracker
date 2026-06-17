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
```

## Components

| Component | Description |
|-----------|-------------|
| [App](App.md) | Root component — renders the application shell and owns all application state. |
| [Sidebar](Sidebar.md) | Dark-themed vertical navigation panel with logo, title, and nav links. Fully controlled by parent. Overlays content at tablet sizes (< 1024px) instead of pushing layout, and defaults to collapsed. |
| [Header](Header.md) | White top bar with title, search input, "Reminders" button, and "Add Job" button. Responsive: collapses to icon-only buttons and moves search into the third column below 1200px. Fully controlled by parent. |
| [KanbanBoard](KanbanBoard.md) | Horizontal-scrollable Kanban board using `react-kanban-kit` with six status columns and drag-and-drop support. |
| [JobCard](JobCard.md) | White card showing job details, date badges, and action buttons. Uses `createPortal` for notes tooltip. |
| [JobModal](JobModal.md) | Dialog form for creating or editing a job entry, built with `@headlessui/react`, includes fields for company, position, salary, status, dates, source, URL, and notes. |
| [JobProfileCard](JobProfileCard.md) | View-only modal displaying job details in a profile card layout with a status-matched gradient hero header, icon-labeled field grid, notes section, and ESC/backdrop close handling. |
| [ReminderDrawer](ReminderDrawer.md) | Right-side sliding drawer panel for displaying and managing follow-up reminder alerts, with expand/collapse pagination (5-item default), slide-out dismiss animation (200ms opacity + translateX), and clickable reminder items that open the JobProfileCard — receives reminder data as props from App component. |
