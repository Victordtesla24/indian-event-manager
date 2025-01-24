#!/bin/bash

# Create necessary directories
mkdir -p static/uploads

# Run database migrations
alembic upgrade head

# Start the application
uvicorn app.main:app --host 0.0.0.0 --port $PORT
