import secrets
from typing import List, Optional
from decouple import config, Csv  # type: ignore


class Settings:
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = config("SECRET_KEY", default=secrets.token_urlsafe(32))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        default=60 * 24 * 8,
        cast=int
    )
    BACKEND_CORS_ORIGINS: List[str] = config(
        "BACKEND_CORS_ORIGINS",
        default=(
            "http://localhost:3000,"
            "https://frontend-ten-alpha-50.vercel.app"
        ),
        cast=Csv()
    )

    PROJECT_NAME: str = config(
        "PROJECT_NAME",
        default="Indian Event Manager"
    )
    ENVIRONMENT: str = config("ENVIRONMENT", default="development")

    # Database
    DATABASE_URL: str = config("DATABASE_URL", default="sqlite:///:memory:")

    # Email
    SMTP_TLS: bool = config("SMTP_TLS", default=True, cast=bool)
    SMTP_PORT: Optional[int] = config(
        "SMTP_PORT",
        default=None,
        cast=lambda v: int(v) if v else None
    )
    SMTP_HOST: Optional[str] = config("SMTP_HOST", default=None)
    SMTP_USER: Optional[str] = config("SMTP_USER", default=None)
    SMTP_PASSWORD: Optional[str] = config("SMTP_PASSWORD", default=None)
    EMAILS_FROM_EMAIL: Optional[str] = config(
        "EMAILS_FROM_EMAIL",
        default=None
    )
    EMAILS_FROM_NAME: Optional[str] = config(
        "EMAILS_FROM_NAME",
        default=config(
            "PROJECT_NAME",
            default="Indian Event Manager"
        )
    )

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = config(
        "EMAIL_RESET_TOKEN_EXPIRE_HOURS",
        default=48,
        cast=int
    )
    EMAIL_TEMPLATES_DIR: str = config(
        "EMAIL_TEMPLATES_DIR",
        default=(
            "/app/app/email-templates/build"
        )
    )
    EMAILS_ENABLED: bool = config("EMAILS_ENABLED", default=False, cast=bool)

    EMAIL_TEST_USER: str = config(
        "EMAIL_TEST_USER",
        default="test@example.com"
    )
    FIRST_SUPERUSER: str = config(
        "FIRST_SUPERUSER",
        default="admin@example.com"
    )
    FIRST_SUPERUSER_PASSWORD: str = config(
        "FIRST_SUPERUSER_PASSWORD",
        default="admin"
    )
    USERS_OPEN_REGISTRATION: bool = config(
        "USERS_OPEN_REGISTRATION",
        default=True,
        cast=bool
    )


settings = Settings()
