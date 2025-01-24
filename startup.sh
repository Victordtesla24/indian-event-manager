#!/bin/bash

set -e  # Exit on error

echo "Starting deployment process..."

# Create necessary directories
echo "Creating static directories..."
mkdir -p /opt/render/project/src/static/uploads
ln -sf /opt/render/project/src/static/uploads static/uploads
echo "Static directories created successfully"

# Function to check database connection
check_db_connection() {
    echo "Checking database connection..."
    python3 << END
import sys
import os
import psycopg2
from urllib.parse import urlparse

try:
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL environment variable is not set")
        sys.exit(1)
    
    print(f"Using database URL: {db_url}")
    
    # Parse the URL
    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port or 5432
    
    # Connect with psycopg2
    conn = psycopg2.connect(
        dbname=database,
        user=username,
        password=password,
        host=hostname,
        port=port,
        sslmode='verify-full'
    )
    
    # Test connection
    with conn.cursor() as cur:
        cur.execute('SELECT 1')
        result = cur.fetchone()
        print(f"Connection test result: {result[0]}")
    
    conn.close()
    print("Database connection successful")
    sys.exit(0)
except Exception as e:
    print(f"Database connection failed with error: {str(e)}")
    print("Environment variables:")
    for key in ['DATABASE_URL', 'ENVIRONMENT']:
        print(f"{key}: {os.environ.get(key, 'Not set')}")
    sys.exit(1)
END
}

# Wait for database to be ready
max_retries=5
counter=0
until check_db_connection || [ $counter -eq $max_retries ]; do
    echo "Waiting for database to be ready..."
    sleep 5
    counter=$((counter + 1))
done

if [ $counter -eq $max_retries ]; then
    echo "Failed to connect to database after $max_retries attempts"
    exit 1
fi

# Run database migrations
echo "Running database migrations..."
alembic upgrade head
echo "Database migrations completed successfully"

# Start the application
echo "Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
