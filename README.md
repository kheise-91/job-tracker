# Application Tracking System

A simple, self-hosted Job Application Tracker designed to replace spreadsheets. Built with AI assistance, it lets you track job applications, update statuses, and manage application details.

I built this app for two reasons: to keep track of the jobs I'm actively applying for, and to learn how to use Claude Code and other AI-assisted development tools.

The original repository is on my self-hosted Gitea server. This repository is a mirror of that.

## Features
- **Add/Update/Delete Jobs**: Track company, position, status, and more.
- **Simple Deployment**: Runs in a single Docker container for easy setup.
- **Kanban Style**: After adding a job, simply drag it to the corresponding column whenever there are status updates.

## Tech Stack
- **Frontend**: React 18 (with Vite) and Tailwind CSS v4
- **Backend**: PHP 8.2 (Native, single-file router)
- **Database**: SQLite (Embedded in the container)
- **Infrastructure**: Docker & Docker Compose (single container with Nginx + PHP-FPM)

## AI Tools
- **Claude Code** - Primary coding assistant for development, debugging, and architecture decisions
- **Qwen3.6-27B** - Locally hosted model on RTX 5080 for rapid prototyping and code generation
- **Qwen3.6-35B-A3B** - Locally hosted model on RTX 5080 for complex reasoning and code review
- **llama.cpp** - Inference engine for running local models
- **llama-swap** - Model serving layer for swapping between local models on the fly
- **ComfyUI** - Node-based graphical user interface that allows users to generate images using advanced AI generation pipelines (used to create the logo for this app)

## Claude Code Ecosystem

This project was built using Claude Code with a few tools and plugins:

- **[Gitea MCP Server](https://gitea.com/gitea/gitea-mcp)** - Gitea integration for issue tracking, PR management, and repository operations
- **[Feature Dev Plugin](https://claude.com/plugins/feature-dev)** - Guided feature development with specialized agents for exploration, architecture, and review
- **[Frontend Design Plugin](https://claude.com/plugins/frontend-design)** - Production-grade frontend design with distinctive visual output
- **[Playwright MCP Plugin](https://claude.com/plugins/playwright)** - Browser automation and end-to-end testing MCP server by Microsoft

I've also built custom Claude Code skills and subagents specifically for this project. See the guides:
- [Custom Skills Guide](/docs/guides/claude-skills.md)
- [Custom Subagents Guide](/docs/guides/claude-subagents.md)

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18+) and npm — required for building the frontend

## Setup and running locally

First, set the `APP_USER` environment variable (your name/identifier used to namespace the database):

```bash
export APP_USER=dev   # or your preferred identifier
```

Then:

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
  -v /home/admin/Projects/ats/data/${APP_USER}:/var/www/html/data/${APP_USER}:rw \
  -e APP_USER=${APP_USER} \
  ats:latest
```

**Volume mounts:**
| Host Path | Container Path | Purpose |
|---|---|---|
| `./data/${APP_USER}` | `/var/www/html/data/${APP_USER}` | SQLite database (`jobs.db`) - the only persistent data |

**Environment variables:**
| Variable | Required | Default | Description |
|---|---|---|---|
| `APP_USER` | Yes | *(none)* | Set to first name of user. |

The frontend is baked into the Docker image at build time - changes to the React frontend require rebuilding the image (`docker compose build ats`).

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
├── ROADMAP.md         # Project development roadmap
├── docker-compose.yml # Orchestration config
├── .gitignore         # Git ignore rules
└── README.md
```

## Project Documentation

See [`docs/README.md`](docs/README.md) for project related documentation (including API endpoints, React components, database schema, AI/Claude guides, and the project development workflow).
