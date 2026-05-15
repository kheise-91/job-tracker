# ATS Session Summary

## AI Prompt
Summarize all important architectural decisions and current implementation details from this session.

***

## API Issues
Here's a summary of the important architectural decisions and implementation details from this session:

### Port Configuration
- **Host port 9000** maps to **container port 80** (nginx)
- **PHP-FPM** listens internally on **127.0.0.1:9000** inside the container
- **Vite dev proxy** targets `http://localhost:9000` for API calls during development
- No conflict between host port 9000 and internal PHP-FPM port 9000 (different network namespaces)

### Database Persistence
- **SQLite database** stored at `/var/www/html/data/jobs.db` inside container
- **Volume mount** in docker-compose.yml: `./data:/var/www/html/data`
- **Purpose**: Persists data across container rebuilds/destructions
- **`data/` folder** is in `.gitignore` to avoid committing database files
- Each developer maintains their own local database

### Permission Handling
- **Problem**: Volume mounts overwrite container directory permissions
- **Solution**: Startup script (`/start.sh`) fixes permissions on every container start
- Script runs: `chown -R www-data:www-data /var/www/html/data` and `chmod -R 755 /var/www/html/data`
- PHP-FPM runs as `www-data` user, which needs write access to create/modify the SQLite database

### Docker Setup
- **Single container** running both nginx and PHP-FPM
- **nginx.conf** proxies `/api/` requests to PHP-FPM via FastCGI on TCP port 9000
- **Frontend** served from `/var/www/html/frontend/` (built with Vite, outputs to `dist/`)
- **Backend** PHP files located in `/var/www/html/backend/`

### Key Files
- `docker/Dockerfile`: Builds PHP-FPM + nginx image with startup script
- `docker/nginx.conf`: Nginx configuration for SPA routing and API proxying
- `docker-compose.yml`: Service definition with volume mount for data persistence
- `backend/api.php`: REST API endpoints for CRUD operations on jobs
- `backend/db.php`: SQLite database connection and table creation
- `frontend/vite.config.js`: Development server proxy configuration