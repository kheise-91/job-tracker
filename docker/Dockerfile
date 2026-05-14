FROM php:8.2-fpm

# Install required PHP extensions for SQLite
RUN docker-php-ext-install pdo pdo_sqlite

# Install nginx
RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Set working directory
WORKDIR /var/www/html

# Create data directory for SQLite database
RUN mkdir -p /var/www/html/data

# Copy backend files
COPY backend/ ./backend/

# Copy frontend build output (must be built before docker build)
COPY frontend/build/ ./frontend/

# Expose port 80
EXPOSE 80

# Start PHP-FPM and nginx
CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]