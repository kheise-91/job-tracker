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
├── KanbanBoard (components/KanbanBoard.jsx)
│   └── JobCard (components/JobCard.jsx, rendered per card)
└── JobModal (components/JobModal.jsx)
```

## Components

| Component | Description |
|-----------|-------------|
| [App](App.md) | Root component — renders the application shell and owns all application state. |
| [Sidebar](Sidebar.md) | Dark-themed vertical navigation panel with logo, title, and nav links. Fully controlled by parent. |
| [Header](Header.md) | White top bar with app title, search input, and "Add Job" button. Fully controlled by parent. |
| [KanbanBoard](KanbanBoard.md) | Horizontal-scrollable Kanban board using `react-kanban-kit` with seven status columns and drag-and-drop support. |
| [JobCard](JobCard.md) | White card showing job details, date badges, and action buttons. Uses `createPortal` for notes tooltip. |
| [JobModal](JobModal.md) | Dialog form for creating or editing a job entry, built with `@headlessui/react`. |
