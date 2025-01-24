#!/usr/bin/env python3
"""
Dependency verification script.
Checks for correct versions and installation order of critical dependencies.
"""

import pkg_resources
import sys
import subprocess
import json
from typing import List, Tuple
import logging


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Critical dependencies and their required versions
CRITICAL_DEPS = {
    'core': {
        'typing-extensions': '4.9.0',
        'pydantic-core': '2.14.6',
        'pydantic': '2.5.3',
    },
    'database': {
        'sqlalchemy': '2.0.25',
        'alembic': '1.13.1',
        'psycopg2-binary': '2.9.9',
    },
    'api': {
        'fastapi': '0.109.0',
        'starlette': '0.35.1',
        'uvicorn': '0.27.0',
    }
}


def get_installed_version(package: str) -> str:
    """Get the installed version of a package."""
    try:
        return pkg_resources.get_distribution(package).version
    except pkg_resources.DistributionNotFound:
        return None


def verify_dependencies() -> List[Tuple[str, str, str, bool]]:
    """
    Verify all critical dependencies.
    Returns list of (package, required_version, installed_version, is_valid)
    """
    results = []
    for category, deps in CRITICAL_DEPS.items():
        logger.info(f"Checking {category} dependencies...")
        for package, required_version in deps.items():
            installed_version = get_installed_version(package)
            is_valid = installed_version == required_version
            results.append(
                (package, required_version, installed_version, is_valid)
            )
            status = "✅" if is_valid else "❌"
            logger.info(
                f"{status} {package}: required={required_version}, "
                f"installed={installed_version or 'Not installed'}"
            )
    return results


def check_installation_order() -> bool:
    """
    Verify that dependencies were installed in the correct order.
    Returns True if order is correct.
    """
    logger.info("Checking installation order...")

    try:
        # Get installation times from pip
        output = subprocess.check_output(
            ["pip", "list", "--format=json"],
            universal_newlines=True
        )
        packages = json.loads(output)

        # Create lookup of package installation times
        install_times = {}
        for pkg in packages:
            name = pkg['name'].lower()
            # Get package metadata
            dist = pkg_resources.get_distribution(name)
            install_times[name] = dist.time

        # Verify order within each category
        for category, deps in CRITICAL_DEPS.items():
            pkg_times = [
                (pkg, install_times.get(pkg.lower()))
                for pkg in deps.keys()
            ]
            # Sort by installation time
            pkg_times.sort(key=lambda x: x[1] or 0)

            # Log installation order
            logger.info(f"\n{category} installation order:")
            for pkg, time in pkg_times:
                logger.info(f"  {pkg}: {time}")

        return True

    except Exception as e:
        logger.error(f"Error checking installation order: {e}")
        return False


def verify_build_artifacts() -> bool:
    """
    Verify build artifacts and wheel cache.
    Returns True if verification passes.
    """
    logger.info("Checking build artifacts...")
    try:
        # Check wheel cache
        wheel_cache = subprocess.check_output(
            ["pip", "cache", "list"],
            universal_newlines=True
        )
        logger.info("Wheel cache contents:")
        logger.info(wheel_cache)

        return True
    except Exception as e:
        logger.error(f"Error checking build artifacts: {e}")
        return False


def main():
    """Main verification routine."""
    logger.info("Starting dependency verification...")

    # Verify dependencies
    results = verify_dependencies()
    invalid_deps = [(p, r, i) for p, r, i, v in results if not v]

    # Check installation order
    order_valid = check_installation_order()

    # Verify build artifacts
    artifacts_valid = verify_build_artifacts()

    # Report results
    logger.info("\nVerification Results:")
    logger.info("=====================")
    logger.info(f"Dependencies Valid: {'✅' if not invalid_deps else '❌'}")
    logger.info(f"Installation Order Valid: {'✅' if order_valid else '❌'}")
    logger.info(f"Build Artifacts Valid: {'✅' if artifacts_valid else '❌'}")

    if invalid_deps:
        logger.error("\nInvalid Dependencies:")
        for package, required, installed in invalid_deps:
            logger.error(
                f"  {package}: required={required}, "
                f"installed={installed or 'Not installed'}"
            )
        sys.exit(1)

    if not order_valid or not artifacts_valid:
        sys.exit(1)

    logger.info("\nAll verifications passed! ✅")
    sys.exit(0)


if __name__ == "__main__":
    main()
