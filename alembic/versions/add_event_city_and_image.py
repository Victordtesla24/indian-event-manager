"""add event city and image

Revision ID: add_event_city_and_image
Revises: 609fd58e57bc
Create Date: 2024-01-24 03:16:04.000000

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = 'add_event_city_and_image'
down_revision: Union[str, None] = '609fd58e57bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Skip adding columns as they already exist
    pass


def downgrade() -> None:
    # Skip removing columns as they were added in a previous migration
    pass
