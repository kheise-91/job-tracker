# Job Tracker PWA Roadmap

## Phase 1: Project Setup & Architecture
- [ ] **1.1 Define Tech Stack:** Confirm PHP (backend), SQLite (database), React (frontend), and Docker (deployment).
- [ ] **1.2 Initialize Project Structure:** Create directories for `backend`, `frontend`, and `docker`.
- [ ] **1.3 Create Dockerfile:** Build a single Docker image that includes PHP, SQLite, and the web server (Nginx/Apache).
- [ ] **1.4 Configure Docker Compose:** Set up `docker-compose.yml` to mount the SQLite database file and frontend build output.

## Phase 2: Backend API (PHP + SQLite)
- [ ] **2.1 Database Schema:** Design the SQLite schema for `jobs` table (id, company, position, status, date_applied, notes, etc.).
- [ ] **2.2 API Endpoints:** Create PHP scripts for:
    - `GET /api/jobs` (List all jobs)
    - `POST /api/jobs` (Add a new job)
    - `PUT /api/jobs/{id}` (Update job status/details)
    - `DELETE /api/jobs/{id}` (Remove a job)
- [ ] **2.3 CORS Configuration:** Ensure the backend allows requests from the frontend (if running on different ports during dev).

## Phase 3: Frontend (React + PWA)
- [ ] **3.1 Initialize React App:** Use Vite or Create React App with PWA plugin.
- [ ] **3.2 UI Components:** Build basic components:
    - `JobList`: Table or card view of jobs.
    - `JobForm`: Modal or page to add/edit jobs.
    - `StatusFilter`: Filter by status (Applied, Interview, Rejected, etc.).
- [ ] **3.3 API Integration:** Connect React components to the PHP backend endpoints.
- [ ] **3.4 PWA Configuration:** Add `manifest.json` and service worker for offline capability and "Add to Home Screen" support.

## Phase 4: Testing & Deployment
- [ ] **4.1 Local Testing:** Run the app locally with `docker-compose up` and test all CRUD operations.
- [ ] **4.2 Mobile Testing:** Verify PWA functionality on a mobile device (add to home screen, offline access).
- [ ] **4.3 Production Build:** Optimize the React build and ensure the Docker image is minimal and secure.
- [ ] **4.4 Server Deployment:** Deploy to your server using `docker-compose pull && docker-compose up -d`.