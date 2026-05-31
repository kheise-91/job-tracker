---
name: ai-agent-guide
title: AI Agent Guide
description: A guide for working with AI agents (including agent rules and project overview/architecture).
---

## Agent Rules

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

### 4. Subagent Execution

**Always spawn subagents for generating code. Always ask if you don't know which subagent to spawn.**

When spawning subagents:
- ALWAYS run subagents sequentially, never in parallel
- Wait for each subagent to fully complete before spawning the next
- This is a hard requirement due to local GPU memory constraints
- All agents must read the following relevant docs before starting work
  - `docs/api/index.md`
  - `docs/database/index.md`
  - `docs/components/index.md`
- Subagents MUST update the relevant docs listed above when related changes have been made

## Project Overview

Application Tracking System (ATS) - a self-hosted PWA for tracking job applications. Built as a single Docker container serving a React frontend and PHP backend with SQLite.

## Commands

**Frontend development:**
```bash
cd frontend && npm install && npm run dev
```
Dev server runs on port 5173 with `/api` proxied to `http://192.168.0.91:5000`.

**Build frontend:**
```bash
cd frontend && npm run build
```

**Run via Docker:**
```bash
docker-compose up --build
```
Serves on port 5000. Database stored in `data/jobs.db` (volume-mounted).

## Architecture

### Single-container deployment
- **Dockerfile** (`docker/Dockerfile`) - PHP 8.2-FPM + Nginx in one image
- **nginx.conf** (`docker/nginx.conf`) - serves static frontend from `/var/www/html/frontend/`, proxies `/api/*` to PHP-FPM on TCP 9000
- **docker-compose.yml** - mounts `./data` and `./backend` volumes, maps port 5000:80

### Backend (`backend/`)
- **db.php** - PDO connection to SQLite at `/var/www/html/data/jobs.db`. Creates `jobs` table on first run.
- **api.php** - Single-file router handling all CRUD for the `jobs` resource:
  - `GET /api/jobs` - list all jobs (ordered by status then `order`)
  - `POST /api/jobs` - create job (validates company, position, status)
  - `PUT /api/jobs/{id}` - update job (partial updates supported)
  - `DELETE /api/jobs/{id}` - delete job
  - `PUT /api/jobs/reorder` - bulk-reorder jobs across columns

### Frontend (`frontend/`)
- **React 18 + Vite** with Tailwind CSS v4
- **App.jsx** - single component managidng jobs state, modal state, and layout (Sidebar + Header + KanbanBoard + JobModal)
- **Components:** `Sidebar.jsx`, `Header.jsx`, `KanbanBoard.jsx`, `JobCard.jsx`, `JobModal.jsx`

### Database schema (`jobs` table)
See `docs/database/index.md` for the full schema reference.

### API
See `docs/api/index.md` for a full list of API endpoints.

### Components
See `docs/components/index.md` for a full list of React components.

## Key files and directories to know

- `backend/api.php` - all API routing logic
- `backend/db.php` - database init + PDO singleton
- `frontend/src/App.jsx` - main React component (layout orchestration)
- `frontend/src/components/` - UI components
- `docker/nginx.conf` - SPA fallback + PHP routing rules
- `docs/` - source of truth for the project (includes Databse schemas, API endpoints, and React components)
- `ROADMAP.md` - project development roadmap

## External Sources

- [Documentation for react-kanban-kit](https://github.com/braiekhazem/react-kanban-kit/)