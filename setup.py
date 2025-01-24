from setuptools import setup, find_packages

setup(
    name="indian-event-manager",
    version="0.1.0",
    packages=find_packages(include=["app", "app.*"]),
    install_requires=[
        "fastapi>=0.109.0",
        "uvicorn>=0.27.0",
        "sqlalchemy>=2.0.25",
        "pydantic>=2.5.3",
        "pydantic-settings>=2.1.0",
        "alembic>=1.13.1",
        "psycopg2-binary>=2.9.9",
        "python-jose>=3.3.0",
        "passlib>=1.7.4",
        "python-multipart>=0.0.6",
        "email-validator>=2.1.0",
        "python-dotenv>=1.0.0",
    ],
)
