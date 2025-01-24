"""add banner table

Revision ID: 52bcda9fdac2
Revises: add_event_city_and_image
Create Date: 2025-01-24 03:33:33.467957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52bcda9fdac2'
down_revision = 'add_event_city_and_image'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create banner table
    op.create_table(
        'banner',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('sponsor_id', sa.String(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('link_url', sa.String(), nullable=False),
        sa.Column('position', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('views_count', sa.Integer(), nullable=True),
        sa.Column('clicks_count', sa.Integer(), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.ForeignKeyConstraint(['sponsor_id'], ['sponsor.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(
        op.f('ix_banner_id'),
        'banner',
        ['id'],
        unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_banner_id'), table_name='banner')
    op.drop_table('banner')
