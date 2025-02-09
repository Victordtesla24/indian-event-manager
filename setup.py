from setuptools import setup, find_packages

setup(
    name="indian-event-manager",
    version="0.1.0",
    packages=find_packages(include=["app", "app.*"]),
    python_requires=">=3.11.11",
    install_requires=[
        "fastapi==0.109.0",
        "uvicorn==0.27.0",
        "sqlalchemy>=2.0.25",
        "pydantic>=2.5.3",
        "pydantic-settings>=2.1.0",
        "python-decouple==3.8",
        "alembic==1.13.1",
        "python-jose==3.3.0",
        "passlib==1.7.4",
        "python-multipart==0.0.6",
        "email-validator==2.1.0.post1",
        "python-dotenv==1.0.0",
    ],
    extras_require={
        'test': [
            'pytest==8.3.4',
            'pytest-asyncio==0.25.2',
            'httpx==0.28.1',
            'SQLAlchemy[asyncio]>=2.0.25',
        ],
        'dev': [
            'pytest==8.3.4',
            'pytest-asyncio==0.25.2',
            'httpx==0.28.1',
            'SQLAlchemy[asyncio]>=2.0.25',
            'pipdeptree==2.24.0',
            'safety==2.3.5',
            'mypy==1.8.0',
        ],
        'prod': [
            'python-json-logger==2.0.7',
            'structlog==24.1.0',
            'prometheus-client==0.19.0',
            'ujson==5.9.0',
            'orjson==3.9.10',
            'cachetools==5.3.2',
            'secure==0.3.0',
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
