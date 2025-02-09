import sys
from alembic import command
from alembic.config import Config

def main(argv):
    alembic_cfg = Config("alembic.ini")
    if len(argv) > 1:
        command.revision(alembic_cfg, argv[1], autogenerate=True)
    else:
        command.revision(alembic_cfg, "New migration", autogenerate=True)

if __name__ == "__main__":
    main(sys.argv) 