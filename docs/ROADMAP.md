# Job Tracker PWA Roadmap

## File Instructions
'[ ]' = Not completed
'[-]' = In progress
'[x]' = Completed

## Phase 1: Project Setup & Architecture
- [x] **1.1 Define Tech Stack:** Confirm PHP (backend), SQLite (database), React (frontend), and Docker (deployment).
- [x] **1.2 Initialize Project Structure:** Create directories for `backend`, `frontend`, and `docker`.
- [x] **1.3 Create Dockerfile:** Build a single Docker image that includes PHP, SQLite, and the web server (Nginx).
- [x] **1.4 Configure Docker Compose:** Set up `docker-compose.yml` to mount the SQLite database file and frontend build output.

## Phase 2: Backend API (PHP + SQLite)
- [x] **2.1 Database Schema:** Design the SQLite schema for `jobs` table (id, company, position, status, date_applied, interview_date, order, notes, updated_at).
- [x] **2.2 API Endpoints:** Create PHP scripts for:
    - `GET /api/jobs` (List all jobs)
    - `POST /api/jobs` (Add a new job)
    - `PUT /api/jobs/{id}` (Update job status/details)
    - `DELETE /api/jobs/{id}` (Remove a job)
- [x] **2.3 API Testing:** Confirm API works through command line (CURL) and browser.
- [x] **2.4 CORS Configuration:** Nginx-level CORS headers + preflight handling for dev server compatibility.
- [x] **2.5 Code Review:** Ensure all back-end code meets professional standards.
- [x] **2.6 Database Migration:** Add `interview_date` and `order` columns with backward-compatible ALTER TABLE.

## Phase 3: Frontend (React + Tailwind)
- [-] **3.1 UI Components:** Build basic React components and style with Tailwind:

    - [x] **3.1.1: Layout skeleton — Sidebar + Header** *Why first: Everything else lives inside this shell. Get the structure down before adding interactivity.*
        - [x] Create components/Sidebar.jsx — left nav with "ATS" logo (just text for now: "Job ATS"), collapsible toggle button
        - [x] Create components/Header.jsx — page title "Application Tracking System" + search input
        - [x] Wire them into App.jsx so the layout is a flex row (sidebar on left, header + content on right)
        <br /><br />

    - [x] **3.1.2: Kanban board columns** *Why second: This is the core visual of Phase 3. It replaces the current flat list view.*
        - [x] Install/verify react-kanban-kit is in dependencies
        - [x] Create components/KanbanBoard.jsx — renders 5 columns: Wishlist → Applied → Interviewing → Offer → Rejected
        - [x] Each column shows job cards as cards within the kanban framework
        <br /><br />

    - [x] **3.1.3: Job card component** *Why third: The kanban board needs a card component to render per job.*
        - [x] Create components/JobCard.jsx — displays company, position, status badge, and action buttons (edit/delete)
        - [x] Style with Tailwind (reuse the existing color palette from index.css)
        <br /><br />

    - [x] **3.1.4: Modal form for add/edit** *Why fourth: The modal is the most complex React pattern (state lifting, props drilling). Do it after the simpler components.*
        - [x] Create components/JobModal.jsx — pop-up form with fields: company, position, status dropdown, date_applied, interview_date, notes
        - [x] Uses a backdrop overlay pattern (fixed div + centered card)
        <br /><br />

    - [x] **3.1.5: Reorder cards within columns** *Why fifth: The kanban board needs persistent ordering before adding more card features.*
        - [x] Update `KanbanBoard.jsx` to allow re-ordering cards within their columns and other columns
        - [x] Ensure the kanban library emits the new order index on drop
        - [x] Backend re-sequences all cards in the affected column to sequential `order` values (0, 1, 2, 3...) after any move
        - [x] Frontend re-fetches the full job list after every reorder to get consistent `order` values from the server
        <br /><br />

    - [ ] **3.1.6: Add `hyperlink` field** *Why sixth: A core piece of job tracking data that many postings already include.*
        - [ ] Add `hyperlink` TEXT column to `jobs` table in `backend/db.php` schema
        - [ ] Include `hyperlink` in all API read/write responses in `backend/api.php`
        - [ ] Add a text input for `hyperlink` in `JobModal.jsx` (add/edit mode)
        - [ ] In `JobCard.jsx`, add a link icon button next to the existing action buttons that opens the URL in a new tab (`target="_blank" rel="noopener noreferrer"`)
        <br /><br />

    - [ ] **3.1.7: Add `source` field** *Why seventh: Provides useful context about where the job was found without cluttering the card.*
        - [ ] Add `source` TEXT column to `jobs` table in `backend/db.php` schema
        - [ ] Include `source` in all API read/write responses in `backend/api.php`
        - [ ] Add a text input for `source` in `JobModal.jsx`
        - [ ] Display the source value on `JobCard.jsx`
        <br /><br />

    - [ ] **3.1.8: Notes preview on hover** *Why eighth: Quick access to notes without opening the full modal.*
        - [ ] In `JobCard.jsx`, add a notes icon button next to the hyperlink button (only shown when notes exist)
        - [ ] On hover (or click, for mobile), display a small tooltip/popover showing the job's `notes` text
        - [ ] Keep it lightweight — no modal, just a floating tooltip styled with Tailwind
        <br /><br />

    - [ ] **3.1.9: Follow-up date field and column** *Why ninth: Automates the common practice of following up a week after applying.*
        - [ ] Add `follow_up_date` DATETIME column to `jobs` table in `backend/db.php` schema
        - [ ] Include `follow_up_date` in all API read/write responses in `backend/api.php`
        - [ ] Auto-populate `follow_up_date` to `date_applied + 7 days` when a new job is created (or when status is set to Applied in the modal)
        - [ ] Add a date input for `follow_up_date` in `JobModal.jsx` (editable by user)
        - [ ] Add a new kanban column `Follow Up` between `Applied` and `Interviewing` in `KanbanBoard.jsx`
        - [ ] Cards in this column display the `follow_up_date` value (similar to how `interview_date` is shown in the Interviewing column)
        <br /><br />

    - [ ] **3.1.10: Follow-up reminders** *Why tenth: Ensures jobs don't fall through the cracks while the Applied column fills up.*
        - [ ] In `KanbanBoard.jsx` (or a small wrapper component), compute which jobs are overdue for follow-up
            - A job is overdue when: `follow_up_date` is set AND `today >= follow_up_date` AND `status` is Applied
        - [ ] Render a list of reminder alerts above the kanban board
        - [ ] Cap visible alerts at 3; show "+ N more" text to expand and reveal the rest
        - [ ] Pure frontend logic — no API changes needed
        <br /><br />

    - [ ] **3.1.11: View job modal (non-edit mode)** *Why eleventh: Lets users quickly review details without triggering an edit.*
        - [ ] When clicking anywhere on a `JobCard` (except the action buttons), open `JobModal.jsx` in read-only mode
        - [ ] In read-only mode, render fields as plain text (not inputs) with the same layout and styling
        - [ ] Hide all edit/delete buttons; show only a close/dismiss button
        <br /><br />

    - [ ] **3.1.12: Search/filter functionality** *Why twelfth: It's a small feature built on top of everything else already in place.*
        - [ ] Add search state to App.jsx that filters jobs displayed in the Kanban board by company or position name
        - [ ] Connect Header's search input to this filter
        <br /><br />

    - [ ] **3.1.13: Cleanup and polish** *Why last: Tidy up once the pieces are working.*
        - [ ] Remove old form/list code from App.jsx (the flat list is replaced by Kanban)
        - [ ] Ensure consistent styling across all components
        - [ ] Verify the sidebar collapses/expand works properly
        <br /><br />

- [ ] **3.2 PWA Configuration:** Ensure PWA meets professional standards (manifest, service worker).
- [ ] **3.3 Code Review:** Ensure all front-end code meets professional standards.

## Phase 4: Testing & Deployment
- [ ] **4.1 Local Testing:** Run the app locally with `docker-compose up` and test all CRUD operations.
- [ ] **4.2 Mobile Testing:** Verify PWA functionality on a mobile device (add to home screen, offline access).
- [ ] **4.3 Production Build:** Optimize the React build and ensure the Docker image is minimal and secure. Package as a single image to deploy easily with a single `docker run` command.
