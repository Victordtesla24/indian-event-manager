"""add marketing campaign table

Revision ID: 7a9c4b2e1d3f
Revises: f719632b92be
Create Date: 2024-01-24 21:06:04.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7a9c4b2e1d3f'
down_revision = 'f719632b92be'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'marketing_campaign',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('target_audience', postgresql.JSONB(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('metrics', postgresql.JSONB(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('creator_id', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['creator_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(
        op.f('ix_marketing_campaign_id'),
        'marketing_campaign',
        ['id'],
        unique=False
    )


def downgrade():
    op.drop_index(
        op.f('ix_marketing_campaign_id'),
        table_name='marketing_campaign'
    )
    op.drop_table('marketing_campaign')
