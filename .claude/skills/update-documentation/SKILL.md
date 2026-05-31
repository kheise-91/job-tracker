---
name: update-documentation
description: Updates project `README.md` and documentation based on current code base. Run this after each phase to keep documentation current.
---

You are the orchestrator for a documentation update. All development work is complete. Spawn three sub-agents to summarize each area of the codebase, then use their output to update the project documentation.

---

## Step 1 - Spawn the summary agents

Start by spawn the three agents listed below, one afer the other.

---

**`backend-engineer` agent**

Read all files in `backend/`. Produce two structured summaries:

**API summary** - for each endpoint:
- Route and HTTP method
- Description of what it does
- Request format (query params, body fields with types)
- Response format (fields returned, types)
- Possible error codes and their meaning

**Database summary** - for each table:
- Table name and purpose
- Every column: name, type, constraints (NOT NULL, DEFAULT, etc.)
- Any relationships or foreign keys
- Migration history if evident from the code

Output both summaries as clean markdown, ready to paste directly into documentation files.

---

**`frontend-ux` agent**

Read all files in `frontend/src/`. Produce a structured summary:

- **Component tree:** the parent-child hierarchy of all components
- **Key components:** for each significant component, its file path, what it renders, what props it accepts, and what state or side effects it manages
- **State management:** how application state is handled (local state, context, etc.)
- **API integration:** which components make API calls and to which endpoints
- **Notable patterns:** any reusable patterns, hooks, or utilities worth documenting

Output as clean markdown, ready to paste into documentation.

---

**`infra-devops` agent**

Read `docker/Dockerfile`, `docker/nginx.conf`, `docker-compose.yml`, any other Nginx config files, and any scripts in the project root or a `scripts/` directory. Produce a structured summary:

- **Services:** what each service/container does
- **Environment variables:** all variables required, with descriptions
- **Volume mounts:** what is persisted and where
- **Port mappings:** what is exposed and on which ports
- **Build steps:** how to build the production image
- **Run command:** the exact `docker run` command for production deployment

Output as clean markdown, ready to paste into README.md setup instructions.

---

## Step 2 - Update Component Docs

Using the frontend-ux's summary, create/update an individaul markdown file to sumamrize the `frontend/src/App.jsx` component and
each component in the `frontend/src/components/` directory. Each markdown file should be named after the component.
For example: `App.jsx` would have `App.md` that summarizes the component.

These markdown summaries should be placed in the `docs/components/` directory.

When all components from the subagent's summary have been created/updated, update the `docs/components/index.md` file to 
list each component, along with a 1 sentence description and link to the component's `.md` file.

---

## Step 3 - Update API Docs

Using the backend-engineer's API summary, update the `docs/api/index.md` with:
- A brief intro line (what API this is, base URL)
- One section per endpoint using this structure:
  ```markdown
  ## METHOD /path
  Description.

  **Request**
  | Field | Type | Required | Description |
  ...

  **Response**
  | Field | Type | Description |
  ...

  **Errors**
  | Code | Meaning |
  ...
  ```

Overwrite the file entirely - this is a generated reference document.

---

## Step 4 - Update Database Docs

Using the backend-engineer's database summary, update `docs/database/index.md` with:
- A brief intro (what database engine, file location)
- One section per table:
  ```markdown
  ## table_name
  Description of what this table stores.

  | Column | Type | Constraints | Description |
  ...
  ```

Overwrite the file entirely.

---

## Step 5 - Update README.md

Update `README.md` using all three agent summaries. Preserve any existing content that is still accurate. Replace or add the following sections:

- **Project Description** - what the app does and who it's for (infer from codebase if absent)
- **Tech Stack** - languages, frameworks, database, infrastructure
- **Prerequisites** - what must be installed to run the project
- **Setup and running locally** - from the infra-devops summary; exact commands
- **Production Deployment** - the `docker run` command and any required env vars
- **Project Documentation** - One sentence that reads "See `docs/index.md` for project related documentation (including API endpoints, React components, database schema, AI/Claude guides, and the project development workflow)

Do not delete sections that exist in the current README.md unless they are clearly outdated or directly contradicted by the codebase.

---

## Step 6 - Confirm

Report which files were updated and a one-line summary of what changed in each.