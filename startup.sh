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
from sqlalchemy import create_engine
import os

try:
    engine = create_engine(os.environ['DATABASE_URL'])
    connection = engine.connect()
    connection.close()
    print("Database connection successful")
    sys.exit(0)
except Exception as e:
    print(f"Database connection failed: {e}")
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
