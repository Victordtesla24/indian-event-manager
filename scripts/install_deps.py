#!/usr/bin/env python3
"""
Dependency installation script.
Installs dependencies in the correct order to prevent conflicts.
"""

import argparse
import logging
import subprocess
import sys
from typing import List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_command(command: List[str], check: bool = True) -> Optional[str]:
    """Run a command and return its output."""
    try:
        result = subprocess.run(
            command,
            check=check,
            capture_output=True,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed: {' '.join(command)}")
        logger.error(f"Error output: {e.stderr}")
        if check:
            sys.exit(1)
        return None


def install_packages(packages: List[str], no_deps: bool = False):
    """Install specific packages."""
    cmd = ["pip", "install"]
    if no_deps:
        cmd.append("--no-deps")
    cmd.extend(packages)
    run_command(cmd)


def install_core_deps():
    """Install core system packages."""
    logger.info("Installing core system packages...")

    # System packages first
    run_command([
        "python", "-m", "pip", "install", "--upgrade",
        "pip", "setuptools", "wheel"
    ])

    # Core dependencies in order
    install_packages([
        "typing-extensions==4.9.0",
        "annotated-types==0.6.0"
    ])

    # Install pydantic stack together to resolve dependencies
    install_packages([
        "pydantic==1.10.13",  # Last version before Rust requirement
        "pydantic-settings==1.2.2"  # Compatible with pydantic v1
    ])

    # Environment and config
    install_packages([
        "python-dotenv==1.0.0",
        "email-validator==2.1.0.post1"
    ])


def install_database_deps():
    """Install database dependencies."""
    logger.info("Installing database dependencies...")

    # Core database packages
    install_packages([
        "greenlet==3.0.3",
        "SQLAlchemy==2.0.25"
    ])

    # Database drivers and migrations
    install_packages([
        "psycopg2-binary==2.9.9",
        "alembic==1.13.1"
    ])


def install_api_deps():
    """Install API dependencies."""
    logger.info("Installing API dependencies...")

    # Core API packages
    install_packages([
        "starlette==0.35.1",
        "fastapi==0.109.0"
    ])

    # ASGI server
    install_packages([
        "h11==0.14.0",
        "click==8.1.7",
        "uvicorn==0.27.0"
    ])


def install_test_deps():
    """Install test dependencies."""
    logger.info("Installing test dependencies...")

    # Core test packages
    install_packages([
        "packaging==24.2",
        "iniconfig==2.0.0",
        "pluggy==1.5.0",
        "pytest==8.3.4"
    ])

    # Async testing
    install_packages([
        "pytest-asyncio==0.25.2"
    ])

    # HTTP testing (compatible versions)
    install_packages([
        "certifi==2024.12.14",
        "sniffio==1.3.0",
        "h11==0.14.0",
        "anyio==4.2.0",
        "httpcore==0.18.0",
        "httpx==0.25.2"
    ])

    # Test utilities
    install_packages([
        "coverage==7.4.1",
        "pytest-cov==4.1.0",
        "pytest-mock==3.12.0"
    ])

    # Development tools
    install_packages([
        "pipdeptree==2.24.0",
        "safety==2.3.5",
        "mypy==1.8.0"
    ])


def install_production_deps():
    """Install production dependencies."""
    logger.info("Installing production dependencies...")

    # Performance packages
    install_packages([
        "ujson==5.9.0",
        "orjson==3.9.10",
        "cachetools==5.3.2"
    ])

    # Monitoring and logging
    install_packages([
        "python-json-logger==2.0.7",
        "structlog==24.1.0",
        "prometheus-client==0.19.0"
    ])

    # Security
    install_packages([
        "secure==0.3.0",
        "python-decouple==3.8"
    ])


def verify_installation():
    """Verify the installation."""
    logger.info("Verifying installation...")
    run_command(["python", "scripts/verify_deps.py"])


def main():
    """Main installation routine."""
    parser = argparse.ArgumentParser(
        description="Install dependencies in the correct order."
    )
    parser.add_argument(
        "--env",
        choices=["dev", "prod"],
        default="dev",
        help="Environment to install dependencies for"
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Run verification after installation"
    )
    args = parser.parse_args()

    try:
        # Core installation steps
        install_core_deps()
        install_database_deps()
        install_api_deps()

        # Environment-specific installation
        if args.env == "prod":
            install_production_deps()
        else:
            install_test_deps()

        # Verification
        if args.verify:
            verify_installation()

        logger.info("Installation completed successfully! ✅")

    except Exception as e:
        logger.error(f"Installation failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
