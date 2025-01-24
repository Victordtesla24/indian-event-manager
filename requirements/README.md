# Dependency Management

## Directory Structure

```bash
requirements/
├── README.md
├── core.txt       # Core system and runtime dependencies
├── database.txt   # Database and migration dependencies
├── api.txt        # FastAPI and server dependencies
├── test.txt       # Testing and development tools
└── production.txt # Production-specific dependencies
```

## Installation Order

To ensure correct dependency resolution, install packages in this order:

1. Core System Dependencies:

```bash
python -m pip install --upgrade pip setuptools wheel
pip install --no-deps -r requirements/core.txt
```

2.Database Dependencies:

```bash
pip install --no-deps -r requirements/database.txt
```

3.API Dependencies:

```bash
pip install --no-deps -r requirements/api.txt
```

4.Production Dependencies (for production environment):

```bash
pip install -r requirements/production.txt
```

5.Test Dependencies (for development environment):

```bash
pip install -r requirements/test.txt
```

## Version Management

- All direct dependencies are strictly pinned to specific versions
- Transitive dependencies are managed through --no-deps installation
- Version updates should be managed through Dependabot
- Security updates are automatically prioritized

## Dependency Groups

### Core Dependencies

- Basic Python utilities
- Pydantic and validation
- Cryptography and security
- Configuration management

### Database Dependencies

- SQLAlchemy ORM
- PostgreSQL driver
- Migration tools
- Connection pooling

### API Dependencies

- FastAPI framework
- ASGI servers
- HTTP utilities
- WebSocket support

### Production Dependencies

- Monitoring tools
- Performance optimizations
- Security enhancements
- Logging utilities

### Test Dependencies

- Testing frameworks
- Coverage tools
- Development utilities
- Type checking

## Verification

Use the dependency verification script:

```bash
./scripts/verify_deps.py
```

This script checks:

- Installed versions match requirements
- Installation order is correct
- Build artifacts are present
- Security vulnerabilities

## Updating Dependencies

1. Dependabot will create PRs for updates
2. CI will run tests and dependency verification
3. Review changes and potential impacts
4. Merge updates after successful testing

## Troubleshooting

If you encounter dependency conflicts:

1. Clear pip cache:

```bash
pip cache purge
```

2.Remove existing packages:

```bash
pip uninstall -r requirements/production.txt -y
pip uninstall -r requirements/test.txt -y
```

3.Reinstall in correct order:

```bash
python -m pip install --upgrade pip setuptools wheel
pip install --no-deps -r requirements/core.txt
pip install --no-deps -r requirements/database.txt
pip install --no-deps -r requirements/api.txt
pip install -r requirements/production.txt  # or test.txt for development
```

## Best Practices

1. Never use `pip install -r requirements.txt` directly
2. Always install dependencies in the correct order
3. Use `--no-deps` for core packages to prevent conflicts
4. Keep dependencies organized by functionality
5. Document any manual version pins or conflicts
6. Regularly run security audits
7. Maintain a clean dependency tree
8. Use virtual environments for isolation
