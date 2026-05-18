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
    
    - [-] **3.1.1: Layout skeleton — Sidebar + Header**
        *Why first: Everything else lives inside this shell. Get the structure down before adding interactivity.*
        - [ ] Create components/Sidebar.jsx — left nav with "ATS" logo (just text for now: "Job ATS"), collapsible toggle button
        - [ ] Create components/Header.jsx — page title "Application Tracking System" + search input
        - [ ] Wire them into App.jsx so the layout is a flex row (sidebar on left, header + content on right)
    
    - [ ] **3.1.2: Kanban board columns**
        *Why second: This is the core visual of Phase 3. It replaces the current flat list view.*
        - [ ] Install/verify react-kanban-kit is in dependencies (it is)
        - [ ] Create components/KanbanBoard.jsx — renders 5 columns: Wishlist → Applied → Interviewing → Offer → Rejected
        - [ ] Each column shows job cards as cards within the kanban framework
    
    - [ ] **3.1.3: Job card component**
        *Why third: The kanban board needs a card component to render per job.*
        - [ ] Create components/JobCard.jsx — displays company, position, status badge, and action buttons (edit/delete)
        - [ ] Style with Tailwind (reuse the existing color palette from index.css)
    
    - [ ] **3.1.4: Modal form for add/edit**
        *Why fourth: The modal is the most complex React pattern (state lifting, props drilling). Do it after the simpler components.*
        - [ ] Create components/JobModal.jsx — pop-up form with fields: company, position, status dropdown, date_applied, interview_date, notes
        - [ ] Uses a backdrop overlay pattern (fixed div + centered card)
    
    - [ ] **3.1.5: Search/filter functionality**
        *Why fifth: It's a small feature built on top of everything else already in place.*
        - [ ] Add search state to App.jsx that filters jobs displayed in the Kanban board by company or position name
        - [ ] Connect Header's search input to this filter

    - [ ] **3.1.6: Cleanup and polish**
        *Why last: Tidy up once the pieces are working.*
        - [ ] Remove old form/list code from App.jsx (the flat list is replaced by Kanban)
        - [ ] Ensure consistent styling across all components
        - [ ] Verify the sidebar collapses/expand works properly

- [ ] **3.2 API Integration:** Connect React components to the PHP backend endpoints.
- [ ] **3.3 PWA Configuration:** Ensure PWA meets professional standards (manifest, service worker).
- [ ] **3.4 Code Review:** Ensure all front-end code meets professional standards.

## Phase 4: Testing & Deployment
- [ ] **4.1 Local Testing:** Run the app locally with `docker-compose up` and test all CRUD operations.
- [ ] **4.2 Mobile Testing:** Verify PWA functionality on a mobile device (add to home screen, offline access).
- [ ] **4.3 Production Build:** Optimize the React build and ensure the Docker image is minimal and secure. Package as a single image to deploy easily with a single `docker run` command.
