from setuptools import setup, find_packages

setup(
    name="indian-event-manager",
    version="0.1.0",
    packages=find_packages(include=["app", "app.*"]),
    python_requires=">=3.11.11,<3.12",
    install_requires=[
        "fastapi==0.115.7",
        "uvicorn==0.34.0",
        "sqlalchemy==2.0.37",
        "pydantic==2.10.6",
        "pydantic-settings==2.7.1",
        "alembic==1.14.1",
        "psycopg2-binary==2.9.10",
        "python-jose==3.3.0",
        "passlib==1.7.4",
        "python-multipart==0.0.20",
        "email-validator==2.2.0",
        "python-dotenv==1.0.1",
    ],
    extras_require={
        'test': [
            'pytest==8.3.4',
            'pytest-asyncio==0.25.2',
            'httpx==0.28.1',
            'SQLAlchemy[asyncio]>=2.0.25,<2.1.0',
        ],
        'dev': [
            'pytest==8.3.4',
            'pytest-asyncio==0.25.2',
            'httpx==0.28.1',
            'SQLAlchemy[asyncio]>=2.0.25,<2.1.0',
            'pipdeptree==2.25.0',
            'safety==3.2.14',
            'mypy==1.14.1',
        ],
        'prod': [
            'python-json-logger==3.2.1',
            'structlog==25.1.0',
            'prometheus-client==0.21.1',
            'ujson==5.10.0',
            'orjson==3.10.15',
            'cachetools==5.5.1',
            'secure==1.0.1',
            'python-decouple==3.8',
        ]
    },
    entry_points={
        'console_scripts': [
            'verify-deps=scripts.verify_deps:main',
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'Programming Language :: Python :: 3.11',
        'Operating System :: OS Independent',
        'Framework :: FastAPI',
        'Framework :: Pydantic',
        'Topic :: Internet :: WWW/HTTP :: HTTP Servers',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
)
