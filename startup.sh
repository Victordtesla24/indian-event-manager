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
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL environment variable is not set")
        sys.exit(1)
    
    print(f"Using database URL: {db_url}")
    
    # Create engine with SSL mode
    engine = create_engine(
        db_url,
        connect_args={'sslmode': 'verify-full'},
        pool_size=5,
        max_overflow=10
    )
    
    # Test connection
    with engine.connect() as connection:
        result = connection.execute("SELECT 1")
        print(f"Connection test result: {result.scalar()}")
    
    print("Database connection successful")
    sys.exit(0)
except Exception as e:
    print(f"Database connection failed with error: {str(e)}")
    print("Environment variables:")
    for key in ['DATABASE_URL', 'SQLALCHEMY_DATABASE_URI', 'ENVIRONMENT']:
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
