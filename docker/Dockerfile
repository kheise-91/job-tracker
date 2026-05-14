FROM php:8.2-fpm

# Install system dependencies including SQLite dev headers
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

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

# Copy frontend build output (Vite outputs to 'dist' by default)
COPY frontend/dist/ ./frontend/

# Expose port 80
EXPOSE 80

# Start PHP-FPM and nginx
CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]