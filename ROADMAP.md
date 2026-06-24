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

- [x] **[3.10 - Follow-up reminder alerts](https://gitea.heise.home/kheise/ats/milestone/5)**
    
    > **Implementation note:** Reminders require no new table. The query driving them is:
    > `status = 'Applied' AND date_applied <= today - 7 days AND follow_up_dismissed = false`.
    > Dismissing a reminder sets `follow_up_dismissed = true` on that job via a PUT to the
    > existing jobs API. When a job moves to "Followed Up" (status changes), it drops out
    > of the reminder query automatically. A separate `follow_up_reminders` table is not
    > needed.

    In the frontend, modify the header to have 3 flex items. The first will still contain the 
    text "Job Tracking Board". The second section will contain the search bar. The third section 
    will contain the  "Add Job" button, positioned at the end of the container (right-side). 
    The first and third section will have 30% width. The 2nd (middle) section will have 40% width. 
    These will be separated by "justify-content: space-between" so they are spaced nicely. Make 
    sure the header also has "align-items: center" so they are centered vertically. 
    The search bar should take up the entire space of the middle section of the header.

    Create a new button, with the primary background and white text, same as the "Add Job" button.
    This button's text should read "Follow-up Reminders" with a heroicon (alert or notification icon - outline style)
    before the text. Place this button in the third header section, to the left. of the "Add Job" button. Clicking
    this button will open the Reminder Drawer. If the drawer is already open, clicking this button will cause the
    drawer to slide off the screen.

    Add a new component: `ReminderDrawer.jsx`. This is a fixed-width, full height drawer that slides in 
    from the right edge of the screen. It should overlap the existing element, and NOT move them in any way. 
    
    In this component, there should be a header that reads "Follow-Up Reminders" positioned left, with a 
    badge to the right of the text containing the total number of reminders in the list. This badge should have
    the primary background color with white text. There should be a button that reads "Dismiss All" positioned all
    the way to the right inside the drawer header, on the same line as the text and badge.

    This component should fetch jobs matching the reminder criteria and render a list of reminders. 
    The list items should contain: `[HeroIcon] bold:[CompanyName - JobTitle]` on the left, a button with "X" to the right that
    will dismiss the reminder, and a sub-text line underneath the company name and job title that
    contains: `Applied [DateApplied dot N days ago]`.

    At the bottom of the drawer is a button that reads 'Close'. This will collapse the drawer, causing it to
    slide to the right off the screen. The button should always be positioned at the bottom of the drawer.

    Cap visible alerts at 5; show a "+ N more" link that expands the list to reveal the rest.

    Clicking the 'X' button sends a PUT to `api.php` setting `follow_up_dismissed = true` for 
    that job, then removes the alert from the UI. Clicking the 'Dismiss All' button will do the same, 
    but for all the jobs in the list. When a job gets dismissed, the number in the header badge should
    also update.

    Done when: Reminder indicator button appear above the board to the left of the "Add Job" button. 
    Clicking the new button will show the drawer and list of Applied jobs where `date_applied` was 7+
    days ago and `follow_up_dismissed` is false. Only 5 show by default. Expanding reveals
    the rest. Dismissing persists and the reminders do not reappear on reload. Jobs moved to
    any other status than "Applied" do not show up in the list.

- [x] **[3.11 - View-only job modal](https://gitea.heise.home/kheise/ats/milestone/6)**
    
    Create a new component, `JobProfileCard`, that opens when clicking anywhere on a `JobCard` (excluding action buttons).
    This component will contain all the information from the `JobModal` form. A close/dismiss button is the only action.

    Component layout:
    - A header section with a gradient background using the primary theme color
        - A header on the left with the company name
        - A subheader underneath the company name with the position 
        - A badge in the upper right corner with the status of the job
    - A row with two columns:
        - First column: calendar heroicon with the text "Date Applied" and the actual date applied directly underneath
        - Second column: notification icon (same icon as follow-up reminder button) with the text "Followed Up" and the actualy followed up date underneath
    - A second row with two columns:
        - First column: a user heroicon with the text "Interview Date" and the actual interview date underneath
        - Second column: a newspaper heroicon with the text "Source' and the actual source underneath
    - A third row with only one full-width column:
        - A link heroicon with the text "Hyperlink" and the actual hyperlink underneath that takes the user to the URL
    - A light grey divider
    - A fourth row with only one full-width column:
        - A notes heroicon with the text "Notes", with the job's notes underneath. These notes should have a light grey background.
    - A light grey divider
    - A close button, position to the bottom right corner

    If any value for the job is null/empty/not set - print the text "Not Set" in italic

    Clicking a reminder item from the list in the `ReminderDrawer.jsx` component should also open the `JobProfileCard`
    component for that job id.

    Done when: Clicking a card body opens the modal in read-only mode with all fields
    visible as text. The close button dismisses without changes. Clicking action buttons
    still triggers their respective actions, not the view modal. Clicking an item from the 
    reminder drawer will open that job in the view-only mode modal.

- [x] **[3.12 - Search and filter](https://gitea.heise.home/kheise/ats/milestone/7)**
    
    Add search state to `App.jsx` that filters the kanban board by company or position
    name (case-insensitive substring match). Wire `Header.jsx`'s existing search input
    to this state. Filtering applies across all columns simultaneously.

    Done when: Typing in the search box filters visible cards across all columns in real
    time. Clearing the input restores all cards. Empty search shows all jobs.

- [x] **[3.13 - Add salary field (and remove from notes)](https://gitea.heise.home/kheise/ats/milestone/8)**
    
    Add a new `salary` TEXT column to `jobs` in `db.php`. Expose it in all API read/write
    operations in `api.php`. Text input added to `JobModal.jsx`. Add salary to the list
    of fields that can be searched using the search bar in `Header.jsx`.

    Done when: The `salary` column exists and is read/written via the API. The modal has a
    salary text input. Kanaban board can be searched by salary value.

- [x] **[3.14 - Mobile UI improvements](https://gitea.heise.home/kheise/ats/milestone/9)**

    Make the app look and work well on mobile/tablet screens while keeping the 
    desktop layout unchanged. All changes are gated behind Tailwind responsive 
    breakpoints (e.g. `md:`, `sm:`) so desktop behaviour is unaffected. The very
    first change that should happen: change "Follow-up reminders" button to only 
    say "Reminders" (keep icon and badge) in the header. Then, the following visual 
    changes should happen at the specified breakpoints.

    **Laptops / Small desktops**
    When the screen width gets to be **< 1200px**: Modify the "Reminders" button
    in the header to only have the icon. Remove the text and badge. Modify the
    "New Job" button to only have a plus sign icon from heroicons (no circle or
    anything, just the icon). Make sure both buttons are exactly the same size.
    Move the search bar to be the first element in the third column, set the third
    column's width to be 66%, and delete the second column.

    **Tablets**
    When the screen width gets to **< 992px**: The left menu should no longer push
    other elements over. The menu should overlay the elements instead and sit on top,
    while keeping the same width as normal No backdrop is necessary. This will be the
    tablet view, which is too big for the bottom nav with full screen menu, but too 
    small to have elements squished from a menu that's opening. At this screen-width,
    kanban columns should take up 33% of the screen (not including the collapsed side
    nav).

    **Smartphones (Landscape and Portrait)**
    When the screen gets to **< 768px**: Implement a bottom nav bar (mobile-style). 
    This new nav bar should have the same background color as the current navbar, 
    and will have 3 buttons. The first (left) button will be "Menu" (with icon). 
    This will open the left side menu now. The second (middle) button will be the 
    "Add Job" button, with a plus icon in a cirlce (background primary with white 
    font). This button should have primary colored text. The third (right) button 
    will be the "Reminders" button. This should have a bell icon with a badge 
    implemented in the icon (or sitting over the icon if necessary) with the number 
    of reminders. The left nav should be hidden, and the left side menu will be 
    fullscreen when expanded from the bottom nav. The "Follow-up Reminders" drawer 
    should also be  fullscreen when it's expanded in this view. The text and the 
    buttons in the header should be hidden. Only the search bar should show at 
    this screen-width, and the search bar should be full-width. At this screen-width,
    kanban columns should take up 50% of the screen.

    **Smartphones (Portrait)**
    When the screen gets to **< 576px**: Kanban columns should be 100% of the screen.

    Done when: All visual criteria listed above are met at the correct breakpoints.

- [x] **[3.15 - Add toggle to hide applications older than 1 month](https://gitea.heise.home/kheise/ats/milestone/10)**

    In `Sidebar.jsx`, add a new "Filters" section at the bottom of the expanded sidebar 
    menu (below the existing nav links, above the footer). This section should only be 
    visible when the sidebar is expanded (`isOpen` is true). It must NOT appear in the 
    collapsed sidebar or on the mobile bottom nav.

    The section contains a single toggle labeled "Hide Old Applications" with subtext 
    "Hides jobs in 'Applied' older than 30 days." Use a switch-style toggle control. When 
    enabled, any job card with `status = 'Applied'` and `date_applied` older than 30 days 
    should be hidden from the Kanban board.

    Jobs hidden by this toggle should also remain hidden when searching - the filter
    applies before search filtering. If the toggle is disabled, all jobs are visible
    regardless of age. The toggle should be enabled by default.

    Done when: The toggle exists in the expanded sidebar's Filters section at the bottom.
    Applied jobs older than 30 days disappear from the board when enabled. Re-disabling 
    shows them again. Search results respect the toggle - hidden jobs don't appear in 
    search either. Toggle is enabled by default. The filter section does not appear in 
    the collapsed sidebar or on the mobile bottom nav.

- [-] **[3.16 - Auto-update fields on related changes](https://gitea.heise.home/kheise/ats/milestone/11)**
    
    In `JobModal.jsx`, implement logic that auto-updates the status dropdown when certain
    date fields are set: if `followed_up_date` is filled and status is "Applied", switch
    status to "Followed Up"; if `interview_date` is filled and status is "Applied", switch
    status to "Interviewing". The auto-change happens in the modal before save - the user
    can still override it before submitting.

    Additionally, implement a backend-only rule in `api.php`: when a card's status changes
    to "Followed Up" via drag-and-drop and `followed_up_date` is not already set, auto-set
    it to the current date on save. This is the only scenario where `followed_up_date`
    should be auto-set - specifically when the current `status` is "Applied" and
    `followed_up_date` is null/empty. If a date already exists, it must not be overwritten.

    > **Implementation note:** The drag-to-update feature requires backend work only. No
    > frontend changes are needed beyond what's already in place for drag-and-drop status
    > updates.

    Done when: Setting a followed-up date on an Applied job auto-selects "Followed Up" in
    the dropdown. Setting an interview date on an Applied job auto-selects "Interviewing".
    Dragging an Applied card to "Followed Up" with no existing `followed_up_date` auto-sets
    it to today's date. Manual override works for all cases. Other status transitions are
    unaffected.

- [ ] **3.17 - PWA configuration**
    
    Add and validate the web app manifest (name, short name, icons, theme color, display
    mode). Verify the app passes PWA installability criteria on desktop and mobile via a Lighthouse audit.

    Done when: The app installs to a mobile home screen via "Add to Home Screen".
    Lighthouse PWA audit shows no blocking issues.

- [ ] **3.18 - Full code review**

    Review all frontend and backend code against professional standards: consistent naming
    conventions, no dead imports or unused variables, no `console.log` statements, component
    responsibilities clearly separated, styling consistent across all components, clean PHP
    code with proper error handling, and no security vulnerabilities (SQL injection, XSS,
    CSRF). Check that the API follows RESTful conventions and the database schema is properly
    indexed.

    Done when: Review is complete and all identified issues are resolved. No linting errors
    remain. No obvious security or code quality issues persist.

---

## [ ] Phase 4 - Testing & Deployment

Validate the full application locally, then produce a minimal, secure production Docker image 
deployable with a single `docker run` command.

Done when: All CRUD operations verified, PWA works on mobile, and the production image
runs cleanly with a single command.

- [ ] **4.1 - Local testing**

    Run the app with `docker-compose up` and verify all CRUD operations, drag-to-reorder,
    modal add/edit/view, search filtering, reminder alerts, and dismissal.

    Done when: All features work end-to-end in the local Docker environment with no
    console errors or broken interactions.

- [ ] **4.2 - Production build and packaging**

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
    `GET /api/interview-prep` - list all prep entries with a JOIN on the jobs table to
    include company, position, and status; `POST /api/interview-prep` - create entry
    (validates `job_id` references an existing job and that `prep_questions` is valid JSON);
    `PUT /api/interview-prep/{id}` - partial update; `DELETE /api/interview-prep/{id}`.

    Done when: The `interview_prep` table is created on app startup. All 4 endpoints work
    correctly via curl or browser dev tools. GET returns prep entries with linked job data.
    POST validates that the referenced job exists and that `prep_questions` is valid JSON.

- [ ] **5.2 - Interview Prep: Frontend**

    Wire the existing "Interview Prep" sidebar link in `Sidebar.jsx` to be clickable with
    active-state highlighting. Add a `currentPage` state (`'board'` or `'prep'`) to
    `App.jsx` that conditionally renders the KanbanBoard or the Interview Prep page.

    Create `InterviewPrep.jsx` - a page component that fetches prep entries from the API
    and displays them as full-width accordion cards showing company + position in the
    header. Expanding a card reveals a 3-column layout: **Col 1** - job info (company,
    position, status, date applied, source, hyperlink); **Col 2** - notes from the linked
    job (read-only display); **Col 3** - Q&A section with expand/collapse per question/answer
    pair and an "Add Q&A" button. Empty state shows a message and "Add Prep" button when
    no entries exist.

    Create `InterviewPrepModal.jsx` - a modal for creating/editing prep entries. Contains
    a dropdown to select a job, a textarea for prep notes, and a dynamic Q&A builder where
    users can add/remove question-answer pairs. On submit, the Q&A array is JSON-serialized
    into the `prep_questions` column.

    Done when: Clicking "Interview Prep" in the sidebar loads the page. Prep entries display
    as accordion cards with a 3-column expand view. Users can create, edit, and delete prep
    entries via the modal. Q&A pairs are rendered as expandable items. Empty state displays
    correctly when no entries exist. The "Resources" link remains a non-functional placeholder.

- [ ] **5.3 - Resources Page**

- [ ] **5.4 - Database Admin Page**