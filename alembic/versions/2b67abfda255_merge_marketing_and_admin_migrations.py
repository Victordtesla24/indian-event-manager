"""merge marketing and admin migrations

Revision ID: 2b67abfda255
Revises: 49761405c97a, 7a9c4b2e1d3f
Create Date: 2025-01-24 21:10:10.686877

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b67abfda255'
down_revision = ('49761405c97a', '7a9c4b2e1d3f')
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass 