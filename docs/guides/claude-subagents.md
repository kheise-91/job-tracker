---
name: claude-subagents-guide
title: Claude Subagents Guide
description: A comprehensive list of subagents used with Claude Code in this project, and the roles each agent plays.
---

# Claude Subagents Guide

Subagents are specialized instances of Claude Code configured with custom system prompts via `.claude/agents/*.md`. Each agent is tailored for a specific domain of work - backend development, frontend UX, QA review, or infrastructure.

---

## Prerequisites

- Subagent files live in `./.claude/agents/`
- All agents run sequentially (never in parallel) due to local GPU memory constraints
- All agents must update relevant docs from the `docs/` folder after making changes
- Agents inherit the parent model by default (`model: inherit`)

---

## Available Agents

### [`backend-engineer`](/.claude/agents/backend-engineer.md)

Develops and modifies all server-side functionality including API endpoints, database schema, business logic, and data integrity. Owns `backend/api.php` and `backend/db.php`.

**Key Responsibilities:**
- RESTful API development in `backend/api.php`
- SQLite schema management in `backend/db.php`
- Input validation, sanitization, and error handling
- Status transition validation
- Updates `docs/api/index.md` and `docs/database/index.md` after relevant changes

**Use when:** Adding or changing API endpoints, modifying the database schema, implementing business rules, optimizing queries, or any PHP/backend task.

---

### [`frontend-ux`](/.claude/agents/frontend-ux.md)

Implements, modifies, and debugs all frontend UI components, styling, state management, and client-side logic. Owns the React frontend built with Vite and Tailwind CSS v4.

**Key Responsibilities:**
- React component development with hooks and modern patterns
- Tailwind CSS v4 styling and responsive design
- WCAG 2.1 AA accessibility compliance
- API integration against `/api/jobs` endpoints
- State management and loading/error states
- Updates `docs/components/` after relevant changes

**Use when:** Creating or modifying React components, updating Tailwind styles, fixing accessibility issues, integrating frontend with backend APIs, or implementing client-side routing.

---

### [`infra-devops`](/.claude/agents/infra-devops.md)

Works on infrastructure, deployment, and DevOps-related tasks including Docker, NGINX, CI/CD pipelines, secrets management, monitoring, and backup strategies.

**Key Responsibilities:**
- Docker image and container management (`docker/Dockerfile`, `docker-compose.yml`)
- NGINX reverse proxy and SPA routing (`docker/nginx.conf`)
- CI/CD pipeline design and maintenance
- Secrets management and security hardening
- Backup strategies for SQLite database
- Updates `docker/`, `docs/`, and `infra/` directories only

**Use when:** Modifying Dockerfiles, docker-compose configs, NGINX configs, setting up CI/CD, managing secrets, configuring reverse proxies, or implementing monitoring/logging.

---

### [`qa-reviewer`](/.claude/agents/qa-reviewer.md)

Performs comprehensive PR-like code reviews, security audits, test generation, lint/type validation, and architectural drift detection. Acts as a senior QA engineer - never writes code, only reviews and reports.

**Key Responsibilities:**
- Code correctness, readability, and maintainability review
- Security audit (SQL injection, XSS, input validation, CSRF)
- Test generation (placed in `/tests` directory)
- Lint and type validation
- Architectural drift detection against established patterns
- Requirements verification against roadmap

**Use when:** Reviewing completed changes before merging, checking for security vulnerabilities, generating tests for new code, or validating architectural compliance.

---

## Reference

### Available Subagents
| Agent Name | Description |
| ---------- | ----------- |
| `backend-engineer` | Develops and modifies all server-side functionality including API endpoints, database schema, business logic, and data integrity. Owns `backend/api.php` and `backend/db.php`. |
| `frontend-ux` | Implements, modifies, and debugs all frontend UI components, styling, state management, and client-side logic. Owns the React frontend built with Vite and Tailwind CSS v4. |
| `infra-devops` | Works on infrastructure, deployment, and DevOps-related tasks including Docker, NGINX, CI/CD pipelines, secrets management, monitoring, and backup strategies. |
| `qa-reviewer` | Performs comprehensive PR-like code reviews, security audits, test generation, lint/type validation, and architectural drift detection. Acts as a senior QA engineer - never writes code, only reviews and reports. |

### Key Context Shared By All Subagents
- `docs/api/`
- `docs/database/`
- `docs/components/`

### Workflow

When working on a feature that touches multiple areas:

1. **Backend changes first** - `backend-engineer` runs to completion
2. **Frontend changes next** - `frontend-ux` runs to completion
3. **QA review last** - `qa-reviewer` reviews all changes

Agents must always run **sequentially** - never in parallel - due to local GPU memory constraints.