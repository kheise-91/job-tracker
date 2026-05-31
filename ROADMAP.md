# Job Tracker PWA - Roadmap

## Key
`[ ]` Not started · `[-]` In progress · `[x]` Complete

---

## [x] Phase 1 - Project Setup & Architecture

Confirmed tech stack, initialized project directory structure, and built the Docker
environment that runs PHP, SQLite, and Nginx in a single container.

- [x] 1.1 - Confirm tech stack (PHP, SQLite, React, Docker)
- [x] 1.2 - Initialize project directory structure (`backend/`, `frontend/`, `docker/`)
- [x] 1.3 - Create Dockerfile (PHP + SQLite + Nginx, single image)
- [x] 1.4 - Configure Docker Compose (SQLite volume mount, frontend build output)

---

## [x] Phase 2 - Backend API (PHP + SQLite)

Designed the SQLite schema, implemented all CRUD endpoints, and hardened the API with
CORS handling and a backward-compatible migration for schema additions.

- [x] 2.1 - Database schema (`jobs` table: id, company, position, status, date_applied, interview_date, order, notes, updated_at)
- [x] 2.2 - API endpoints (GET, POST, PUT, DELETE for `/api/jobs` and `/api/jobs/{id}`)
- [x] 2.3 - API testing via curl and browser
- [x] 2.4 - CORS configuration (Nginx-level headers + preflight handling)
- [x] 2.5 - Backend code review
- [x] 2.6 - Database migration (`interview_date` and `order` columns via backward-compatible ALTER TABLE)

---

## [-] Phase 3 - Feature Development

Full-stack feature work building the React frontend and extending the backend schema
and API as each feature requires. Covers all kanban UI, data fields, secondary features,
PWA configuration, and a final code review.

Done when: The app runs end-to-end in Docker with all kanban columns, full CRUD via
modal, drag-to-reorder, all data fields stored and displayed correctly, reminder alerts
working and dismissable, and PWA criteria met.

- [x] **3.1 - Layout skeleton (Sidebar + Header)**
    
    `Sidebar.jsx` with collapsible toggle and "Job ATS" logo text. `Header.jsx` with page
    title and search input stub. Both wired into `App.jsx` as a flex-row layout.

- [x] **3.2 - Kanban board columns**
    
    `KanbanBoard.jsx` rendering five columns (Wishlist → Applied → Interviewing → Offer →
    Rejected) using `react-kanban-kit`, each displaying job cards.

- [x] **3.3 - Job card component**
    
    `JobCard.jsx` displaying company, position, status badge, and edit/delete buttons.
    Styled with Tailwind using the existing palette from `index.css`.

- [x] **3.4 - Modal form (add and edit)**
    
    `JobModal.jsx` with fixed backdrop overlay and centered card. Fields: company,
    position, status dropdown, date_applied, interview_date, notes. Handles both add
    (blank) and edit (pre-filled) modes.

- [x] **3.5 - Drag-to-reorder cards**
    
    `KanbanBoard.jsx` supports drag-and-drop within and across columns. On drop, the API
    re-sequences all cards in the affected column to sequential `order` integers. Frontend
    re-fetches the full job list after every reorder for consistency.

- [x] **3.6 - Hyperlink field**
    
    `hyperlink` TEXT column added to `jobs` in `db.php`. Exposed in all API read/write
    operations in `api.php`. Text input added to `JobModal.jsx`. Link icon button on
    `JobCard.jsx` opens URL in a new tab; hidden when no hyperlink is set.

- [x] **[3.7 - Source field](https://gitea.heise.home/kheise/ats/milestone/1)**
    
    `source` TEXT column added to `jobs` in `db.php`. Exposed in all API read/write
    operations in `api.php`. Text input added to `JobModal.jsx`. Field intentionally
    not displayed on `JobCard.jsx` - edit modal only.

- [x] **[3.8 - Notes preview on hover](https://gitea.heise.home/kheise/ats/milestone/2)**

    In `JobCard.jsx`, add a notes icon button next to the hyperlink button, rendered only
    when the job's `notes` field is non-empty. On hover (desktop) or tap (mobile), display
    a floating Tailwind-styled tooltip showing the notes text. No modal - lightweight
    tooltip only, no third-party popover library.

    Done when: The notes icon appears only on cards with notes. Hovering reveals the text
    in a floating tooltip. Tapping works on mobile. Cards without notes are unchanged.

- [x] **[3.9 - Followed-up date and "Followed Up" kanban column](https://gitea.heise.home/kheise/ats/milestone/3)**
    
    > **Implementation note:** Only `followed_up_date` is needed - not a separate
    > `follow_up_date` field. The reminder trigger (7 days after applied) is fully
    > calculable from the existing `date_applied` column, so there is nothing to store.
    > `followed_up_date` records when the user actually followed up, which is the only
    > meaningful data point. See 3.10 for how reminders use this.

    Add a `followed_up_date` DATETIME column to `jobs` in `db.php`. Expose it in all API
    read/write operations in `api.php`. Add a date input for it in `JobModal.jsx`.

    In `KanbanBoard.jsx`, add a "Followed Up" column positioned between "Applied" and
    "Interviewing". Cards in this column display the `followed_up_date` value the same
    way the Interviewing column displays `interview_date`.

    Also add a `follow_up_dismissed` BOOLEAN DEFAULT FALSE column to `jobs` in `db.php`
    and expose it in the API. This flag is used by the reminder system in 3.10 to persist
    dismissals without a separate table.

    Done when: The "Followed Up" column exists and renders correctly. Cards can be dragged
    into it. `followed_up_date` stores and retrieves correctly via the API. The date input
    works in the modal. `follow_up_dismissed` is stored and returned by the API.

- [ ] **3.10 - Follow-up reminder alerts**
    
    > **Implementation note:** Reminders require no new table. The query driving them is:
    > `status = 'Applied' AND date_applied <= today - 7 days AND follow_up_dismissed = false`.
    > Dismissing a reminder sets `follow_up_dismissed = true` on that job via a PUT to the
    > existing jobs API. When a job moves to "Followed Up" (status changes), it drops out
    > of the reminder query automatically. A separate `follow_up_reminders` table is not
    > needed.

    In the frontend, fetch jobs matching the reminder criteria and render alert banners
    above the kanban board. Cap visible alerts at 3; show a "+ N more" link that expands
    to reveal the rest. Each alert shows the company name, position, and days since applied.
    Each alert has a dismiss button that sends a PUT to `api.php` setting
    `follow_up_dismissed = true` for that job, then removes the alert from the UI.

    Done when: Alerts appear above the board for Applied jobs where `date_applied` was 7+
    days ago and `follow_up_dismissed` is false. Only 3 show by default. Expanding reveals
    the rest. Dismissing persists and the alert does not reappear on reload. Jobs moved to
    "Followed Up" no longer appear in alerts.

- [ ] **3.11 - View-only job modal**
    
    When clicking anywhere on a `JobCard` (excluding action buttons), open `JobModal.jsx`
    in read-only mode. All fields render as plain text with the same layout and styling as
    the edit form. Edit/delete buttons are hidden. A close/dismiss button is the only action.

    Done when: Clicking a card body opens the modal in read-only mode with all fields
    visible as text. The close button dismisses without changes. Clicking action buttons
    still triggers their respective actions, not the view modal.

- [ ] **3.12 - Search and filter**
    
    Add search state to `App.jsx` that filters the kanban board by company or position
    name (case-insensitive substring match). Wire `Header.jsx`'s existing search input
    to this state. Filtering applies across all columns simultaneously.

    Done when: Typing in the search box filters visible cards across all columns in real
    time. Clearing the input restores all cards. Empty search shows all jobs.

- [ ] **3.13 - Auto-update fields on related changes**
    
    In `JobModal.jsx`, implement logic that auto-updates the status dropdown when certain
    date fields are set: if `followed_up_date` is filled and status is "Applied", switch
    status to "Followed Up"; if `interview_date` is filled and status is "Applied", switch
    status to "Interviewing". The auto-change happens in the modal before save - the user
    can still override it before submitting.

    Additionally, implement a backend-only rule in `api.php`: when a card's status changes
    to "Followed Up" via drag-and-drop and `followed_up_date` is not already set, auto-set
    it to the current date on save. This is the only scenario where `followed_up_date`
    should be auto-set — specifically when the current `status` is "Applied" and
    `followed_up_date` is null/empty. If a date already exists, it must not be overwritten.

    > **Implementation note:** The drag-to-update feature requires backend work only. No
    > frontend changes are needed beyond what's already in place for drag-and-drop status
    > updates.

    Done when: Setting a followed-up date on an Applied job auto-selects "Followed Up" in
    the dropdown. Setting an interview date on an Applied job auto-selects "Interviewing".
    Dragging an Applied card to "Followed Up" with no existing `followed_up_date` auto-sets
    it to today's date. Manual override works for all cases. Other status transitions are
    unaffected.

- [ ] **3.14 - Cleanup and polish**
    
    Remove old flat list and form code from `App.jsx` superseded by the kanban. Review
    all components for consistent Tailwind styling and no visual rough edges. Verify the
    sidebar collapse/expand works correctly at all viewport sizes. Fix any issues found.

    Done when: No dead code remains in `App.jsx`. All components are visually consistent.
    Sidebar toggle works at all screen sizes. No obvious UI bugs remain.

- [ ] **3.15 - PWA configuration**
    
    Add and validate the web app manifest (name, short name, icons, theme color, display
    mode). Implement a service worker for basic offline access. Verify the app passes PWA
    installability criteria on desktop and mobile via a Lighthouse audit.

    Done when: The app installs to a mobile home screen via "Add to Home Screen". Basic
    offline access works. Lighthouse PWA audit shows no blocking issues.

- [ ] **3.16 - Frontend code review**
    
    Review all frontend code against professional standards: consistent naming conventions,
    no dead imports, no `console.log` statements, component responsibilities clearly
    separated, and styling consistent across all components.

    Done when: Review is complete and all identified issues are resolved. No linting
    errors remain.

---

## [ ] Phase 4 - Testing & Deployment

Validate the full application locally and on mobile, then produce a minimal, secure
production Docker image deployable with a single `docker run` command.

Done when: All CRUD operations verified, PWA works on mobile, and the production image
runs cleanly with a single command.

- [ ] **4.1 - Local testing**

    Run the app with `docker-compose up` and verify all CRUD operations, drag-to-reorder,
    modal add/edit/view, search filtering, reminder alerts, and dismissal. Fix any bugs
    found before mobile testing.

    Done when: All features work end-to-end in the local Docker environment with no
    console errors or broken interactions.

- [ ] **4.2 - Mobile testing**

    Verify PWA functionality on a physical mobile device: install to home screen, test
    offline access, verify touch interactions (drag-to-reorder, tooltip tap, modal open).

    Done when: App installs and runs from home screen. Offline mode works. All touch
    interactions behave correctly on a real device.

- [ ] **4.3 - Production build and packaging**

    Optimize the React build. Minimize the Docker image (remove dev dependencies, use a
    minimal base). Ensure the app runs correctly with a single `docker run` command with
    only the SQLite volume mount needed.

    Done when: `docker run` with the production image starts the app. The image contains
    no unnecessary build tools. The SQLite database persists correctly via the volume mount.

---

## [ ] Phase 5 - Additional Features

This phase introduces high-value updates to enrich user experience. It builds on core
functionality based on continuous user feedback.

- [ ] **5.1 - Interview Prep: Backend**

    Create a new `interview_prep` table in SQLite (`backend/db.php`) with columns:
    `id`, `job_id` (FK to `jobs.id`), `prep_notes` (TEXT), `prep_questions` (TEXT,
    stores JSON array of `{question, answer}` objects, defaults to `'[]'`), `created_at`,
    `updated_at`.

    Add CRUD endpoints in `backend/api.php`:
    `GET /api/interview-prep` — list all prep entries with a JOIN on the jobs table to
    include company, position, and status; `POST /api/interview-prep` — create entry
    (validates `job_id` references an existing job and that `prep_questions` is valid JSON);
    `PUT /api/interview-prep/{id}` — partial update; `DELETE /api/interview-prep/{id}`.

    Done when: The `interview_prep` table is created on app startup. All 4 endpoints work
    correctly via curl or browser dev tools. GET returns prep entries with linked job data.
    POST validates that the referenced job exists and that `prep_questions` is valid JSON.

- [ ] **5.2 - Interview Prep: Frontend**

    Wire the existing "Interview Prep" sidebar link in `Sidebar.jsx` to be clickable with
    active-state highlighting. Add a `currentPage` state (`'board'` or `'prep'`) to
    `App.jsx` that conditionally renders the KanbanBoard or the Interview Prep page.

    Create `InterviewPrep.jsx` — a page component that fetches prep entries from the API
    and displays them as full-width accordion cards showing company + position in the
    header. Expanding a card reveals a 3-column layout: **Col 1** — job info (company,
    position, status, date applied, source, hyperlink); **Col 2** — notes from the linked
    job (read-only display); **Col 3** — Q&A section with expand/collapse per question/answer
    pair and an "Add Q&A" button. Empty state shows a message and "Add Prep" button when
    no entries exist.

    Create `InterviewPrepModal.jsx` — a modal for creating/editing prep entries. Contains
    a dropdown to select a job, a textarea for prep notes, and a dynamic Q&A builder where
    users can add/remove question-answer pairs. On submit, the Q&A array is JSON-serialized
    into the `prep_questions` column.

    Done when: Clicking "Interview Prep" in the sidebar loads the page. Prep entries display
    as accordion cards with a 3-column expand view. Users can create, edit, and delete prep
    entries via the modal. Q&A pairs are rendered as expandable items. Empty state displays
    correctly when no entries exist. The "Resources" link remains a non-functional placeholder.

- [ ] **5.2 - Resources Page**