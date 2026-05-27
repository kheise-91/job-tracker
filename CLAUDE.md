# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Application Tracking System (ATS) — a self-hosted PWA for tracking job applications. Built as a single Docker container serving a React frontend and PHP backend with SQLite.

## Documentation

The `/docs` folder is the source of truth for the project.

## Commands

**Frontend development:**
```bash
cd frontend && npm install && npm run dev
```
Dev server runs on port 5173 with `/api` proxied to `http://192.168.0.91:9000`.

**Build frontend:**
```bash
cd frontend && npm run build
```

**Run via Docker:**
```bash
docker-compose up --build
```
Serves on port 9000. Database stored in `data/jobs.db` (volume-mounted).

## Agent Execution Rules

- ALWAYS run sub-agents sequentially, never in parallel
- Wait for each sub-agent to fully complete before spawning the next
- This is a hard requirement due to local GPU memory constraints
- All agents must read relevant docs from the `docs/` folder before starting work
- Make sure relevant docs are also updated when related changes have been made

## Architecture

### Single-container deployment
- **Dockerfile** (`docker/Dockerfile`) — PHP 8.2-FPM + Nginx in one image
- **nginx.conf** (`docker/nginx.conf`) — serves static frontend from `/var/www/html/frontend/`, proxies `/api/*` to PHP-FPM on TCP 9000
- **docker-compose.yml** — mounts `./data` and `./backend` volumes, maps port 9000:80

### Backend (`backend/`)
- **db.php** — PDO connection to SQLite at `/var/www/html/data/jobs.db`. Creates `jobs` table on first run.
- **api.php** — Single-file router handling all CRUD for the `jobs` resource:
  - `GET /api/jobs` — list all jobs
  - `POST /api/jobs` — create job (validates company, position, status)
  - `PUT /api/jobs/{id}` — update job (partial updates supported)
  - `DELETE /api/jobs/{id}` — delete job
- Allowed statuses: Wishlist, Applied, Interviewing, Offer, Rejected

### Frontend (`frontend/`)
- **React 18 + Vite** with Tailwind CSS v4
- **Current state**: Basic form + list view (Phase 2 complete)
- **Planned** (per roadmap): Kanban board via `react-kanban-kit`, sidebar navigation, modal form, PWA polish
- **App.jsx** — single component managing jobs state and the add-job form
- **index.css** — Tailwind import + custom styles for forms, job cards, status badges

### Database schema (`jobs` table)
| Column | Type | Notes |
|---|---|---|
| id | INTEGER AUTOINCREMENT | PK |
| company | TEXT NOT NULL | |
| position | TEXT NOT NULL | |
| status | TEXT DEFAULT 'Applied' | |
| date_applied | DATETIME | |
| interview_date | DATETIME DEFAULT NULL | |
| notes | TEXT | |
| updated_at | DATETIME | |

### Key files to know
- `backend/api.php` — all API routing logic
- `backend/db.php` — database init + PDO singleton
- `frontend/src/App.jsx` — only React component
- `docker/nginx.conf` — SPA fallback + PHP routing rules
- `docs/ROADMAP.md` — Phase 3 (Kanban UI) is incomplete

#### External source
- [Documentation for react-kanban-kit](https://github.com/braiekhazem/react-kanban-kit/)