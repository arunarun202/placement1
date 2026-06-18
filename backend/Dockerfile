FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (needed for pdfplumber, psycopg2, and healthcheck)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Make the DB init script executable
RUN chmod +x /app/init_db.sh

# Expose port
EXPOSE 8000

# Apply schema.sql (idempotent) then start the server
CMD ["/app/init_db.sh"]
