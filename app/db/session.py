from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

connect_args = {}
if settings.ENVIRONMENT == "test":
    connect_args["check_same_thread"] = False

engine = create_engine(
    str(settings.DATABASE_URL),
    connect_args=connect_args,
    pool_pre_ping=True,
    future=True  # Enable SQLAlchemy 2.0 features
)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Prevent expired objects after commit
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
