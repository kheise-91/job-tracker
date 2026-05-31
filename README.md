# Application Tracking System

A simple, self-hosted Job Application Tracker designed to replace spreadsheets. This Progressive Web App (PWA) was built with AI assistance and allows you to track your job applications, update statuses, and manage details across all your devices, including mobile.

## Features
- **Add/Update/Delete Jobs**: Track company, position, status, and more.
- **Mobile Friendly**: Works as a PWA on iOS and Android.
- **Simple Deployment**: Runs in a single Docker container for easy setup.
- **Kanban Style**: After adding a job, simply drag it to the corresponding column whenever there are status updates.

## Tech Stack
- **Frontend**: React 18 (with Vite) and Tailwind CSS v4
- **Backend**: PHP 8.2 (Native, single-file router)
- **Database**: SQLite (Embedded in the container)
- **Infrastructure**: Docker & Docker Compose (single container with Nginx + PHP-FPM)

## AI Tools
- **Claude Code** — Primary coding assistant for development, debugging, and architecture decisions
- **Qwen3.6-27B** — Locally hosted model on RTX 5080 for rapid prototyping and code generation
- **Qwen3.6-35B-A3B** — Locally hosted model on RTX 5080 for complex reasoning and code review
- **llama.cpp** — Inference engine for running local models
- **llama-swap** — Model serving layer for swapping between local models on the fly

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

## Setup and running locally

```bash
# Clone the repository, then:
cd frontend && npm run build
cd ../ && docker-compose up --build
```

Serves on `http://localhost:5000`. For frontend development with hot-reload and API proxying (port 5173):

```bash
cd frontend && npm install && npm run dev
```

## Production Deployment

```bash
docker compose up -d
```

Or with a bare `docker run`:

```bash
docker run -d \
  --name ats \
  --restart unless-stopped \
  -p 5000:80 \
  -v /home/admin/Projects/ats/data:/var/www/html/data:rw \
  -v /home/admin/Projects/ats/backend:/var/www/html/backend:rw \
  -e APP_ENV=production \
  ats:latest
```

**Volume mounts:**
| Host Path | Container Path | Purpose |
|---|---|---|
| `./data` | `/var/www/html/data` | SQLite database (`jobs.db`) — the only persistent data |
| `./backend` | `/var/www/html/backend` | Application source code (hot-reload for PHP files) |

**Environment variables:**
| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_ENV` | No | *(none)* | Set to `production`. Currently only a marker; no conditional logic reads it. |

The frontend is baked into the Docker image at build time — changes to the React frontend require rebuilding the image (`docker compose build ats`).

## Project Structure
```
.
├── backend/           # PHP API logic (api.php, db.php)
├── data/              # SQLite database (jobs.db)
├── docker/            # Docker configuration files
│   ├── Dockerfile     # PHP 8.2-FPM + Nginx image
│   └── nginx.conf     # Nginx routing rules
├── frontend/          # React application (Vite)
├── docs/              # Project documentation
├── docker-compose.yml # Orchestration config
├── .gitignore         # Git ignore rules
└── README.md
```

## Project Documentation

See [`docs/README.md`](/docs/README.md) for project related documentation (including API endpoints, React components, database schema, AI/Claude guides, and the project development workflow).
