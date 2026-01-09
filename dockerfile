

# Use the official PHP Apache image
FROM php:8.2-apache

# Install PostgreSQL driver dependencies
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Copy your project files into the container
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

