from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

connect_args = (
    {'sslmode': 'require'} if settings.ENVIRONMENT == "production" else {}
)
engine = create_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
