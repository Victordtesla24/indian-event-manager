# Indian Event Manager

A centralized platform for managing and discovering Indian cultural events across Australia.

## Project Overview

The Indian Event Manager serves as a unified platform for:

- Discovering Indian cultural events
- Managing event organization
- Connecting sponsors with the community
- Streamlining event logistics

## Tech Stack

### Backend

- FastAPI (Python)
- PostgreSQL
- SQLAlchemy ORM
- Alembic Migrations

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

## Local Development Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Git

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Victordtesla24/indian-event-manager.git
cd indian-event-manager
```

2.Create and activate virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3.Install dependencies:

```bash
pip install -r requirements.txt
```

4.Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

5.Run database migrations:

```bash
python scripts/migrate.py
```

6.Start the backend server:

```bash
python scripts/start.py
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2.Install dependencies:

```bash
npm install
```

3.Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4.Start the development server:

```bash
npm run dev
```

## Deployment

### Backend Deployment (Railway)

1. Create a new project on Railway
2. Link your GitHub repository
3. Set up the following environment variables in Railway:
   - DATABASE_URL
   - SECRET_KEY
   - ENVIRONMENT=production
   - ALLOWED_HOSTS
   - CORS_ORIGINS
   - ACCESS_TOKEN_EXPIRE_MINUTES

4. Deploy using GitHub Actions:
   - Add RAILWAY_TOKEN to GitHub repository secrets
   - Push to main branch to trigger deployment

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Link your GitHub repository
3. Set up the following environment variables in Vercel:
   - VITE_API_URL (Railway backend URL)
   - VITE_ENV=production

4. Deploy using GitHub Actions:
   - Add VERCEL_TOKEN to GitHub repository secrets
   - Push to main branch to trigger deployment

## GitHub Actions Setup

### Required Secrets

Backend (Railway):

- RAILWAY_TOKEN
- RAILWAY_SERVICE_NAME

Frontend (Vercel):

- VERCEL_TOKEN
- VITE_API_URL

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## License

[MIT License](LICENSE)

## Contact

For any queries, please reach out to the project maintainers.
