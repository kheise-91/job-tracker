# Application Tracking System

A simple, self-hosted Job Application Tracker designed to replace spreadsheets. This Progressive Web App (PWA) allows you to track your job applications, update statuses, and manage details across all your devices, including mobile.

## Features
- **Add/Update/Delete Jobs**: Track company, position, status, and notes.
- **Mobile Friendly**: Works as a PWA on iOS and Android.
- **Simple Deployment**: Runs in a single Docker container for easy setup.

## Tech Stack
- **Frontend**: React (with Vite)
- **Backend**: PHP (Native)
- **Database**: SQLite (Embedded in the container)
- **Deployment**: Docker & Docker Compose
- **Styling**: Tailwind CSS (or plain CSS, depending on preference)

## Project Structure
```
.
├── backend/          # PHP API logic
├── frontend/         # React application
├── docker/           # Docker configuration files
├── docker-compose.yml # Orchestration config
├── .gitignore        # Git ignore rules
└── README.md
```