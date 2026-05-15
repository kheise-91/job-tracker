# Job Tracker PWA Roadmap

## Phase 1: Project Setup & Architecture
- [x] **1.1 Define Tech Stack:** Confirm PHP (backend), SQLite (database), React (frontend), and Docker (deployment).
- [x] **1.2 Initialize Project Structure:** Create directories for `backend`, `frontend`, and `docker`.
- [x] **1.3 Create Dockerfile:** Build a single Docker image that includes PHP, SQLite, and the web server (Nginx).
- [x] **1.4 Configure Docker Compose:** Set up `docker-compose.yml` to mount the SQLite database file and frontend build output.

## Phase 2: Backend API (PHP + SQLite)
- [x] **2.1 Database Schema:** Design the SQLite schema for `jobs` table (id, company, position, status, date_applied, notes, etc.).
- [x] **2.2 API Endpoints:** Create PHP scripts for:
    - `GET /api/jobs` (List all jobs)
    - `POST /api/jobs` (Add a new job)
    - `PUT /api/jobs/{id}` (Update job status/details)
    - `DELETE /api/jobs/{id}` (Remove a job)
- [x] **2.3 API Testing:** Confirm API works through command line (CURL) and browser.
- [ ] **2.4 CORS Configuration:** Ensure the backend allows requests from the frontend (if running on different ports during dev).
- [ ] **2.5 Code Review:** Ensure all back-end code meets professional standards.

## Phase 3: Frontend (React + PWA)
- [ ] **3.1 UI Components:** Build basic components:
    - `LeftNav`: Left collapsible navigation menu with logo and app name (ATS) at the top
    - `JobList`: Kanban style with multiple columns depending on state of application
    - `JobForm`: Modal to add/edit jobs.
- [ ] **3.2 API Integration:** Connect React components to the PHP backend endpoints.
- [ ] **3.3 PWA Configuration:** Ensure PWA meets professional standards.
- [ ] **3.4 Code Review:** Ensure all front-end code meets professional standards.

## Phase 4: Testing & Deployment
- [ ] **4.1 Local Testing:** Run the app locally with `docker-compose up` and test all CRUD operations.
- [ ] **4.2 Mobile Testing:** Verify PWA functionality on a mobile device (add to home screen, offline access).
- [ ] **4.3 Production Build:** Optimize the React build and ensure the Docker image is minimal and secure. Package as a single image to deploy easily with a single `docker run` command.