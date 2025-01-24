"""add_admin_permissions_and_audit_fields

Revision ID: f719632b92be
Revises: 52bcda9fdac2
Create Date: 2025-01-24 20:39:50.095440

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f719632b92be'
down_revision = '52bcda9fdac2'
branch_labels = None
depends_on = None

# Create AdminLevel enum
admin_level = postgresql.ENUM(
    'SUPER_ADMIN',
    'ADMIN',
    'MODERATOR',
    name='adminlevel'
)


# Create AdminPermissions enum
admin_permissions = postgresql.ENUM(
    'MANAGE_USERS',
    'MANAGE_EVENTS',
    'MANAGE_SPONSORS',
    'MANAGE_CONTENT',
    'VIEW_ANALYTICS',
    'MANAGE_SETTINGS',
    name='adminpermissions'
)


def upgrade() -> None:  # noqa: C901
    # Create new enums
    admin_level.create(op.get_bind())
    admin_permissions.create(op.get_bind())

    # Add new columns to user table
    op.add_column(
        'user',
        sa.Column(
            'admin_level',
            sa.Enum('SUPER_ADMIN', 'ADMIN', 'MODERATOR', name='adminlevel'),
            nullable=True
        )
    )
    op.add_column(
        'user',
        sa.Column(
            'permissions',
            postgresql.ARRAY(
                sa.Enum(
                    'MANAGE_USERS',
                    'MANAGE_EVENTS',
                    'MANAGE_SPONSORS',
                    'MANAGE_CONTENT',
                    'VIEW_ANALYTICS',
                    'MANAGE_SETTINGS',
                    name='adminpermissions'
                )
            ),
            nullable=True
        )
    )
    op.add_column(
        'user',
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column(
        'user',
        sa.Column('last_active', sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column(
        'user',
        sa.Column(
            'login_count',
            sa.Integer(),
            nullable=False,
            server_default='0'
        )
    )
    
    # Create audit log table
    op.create_table(
        'admin_audit_log',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('admin_id', sa.String(), nullable=False),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=False),
        sa.Column('entity_id', sa.String(), nullable=True),
        sa.Column(
            'details',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True
        ),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),
        sa.ForeignKeyConstraint(['admin_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )
    # Create indexes for admin audit log
    op.create_index(
        op.f('ix_admin_audit_log_admin_id'),
        'admin_audit_log',
        ['admin_id'],
        unique=False
    )
    op.create_index(
        op.f('ix_admin_audit_log_created_at'),
        'admin_audit_log',
        ['created_at'],
        unique=False
    )

    # Add indexes for new user columns
    op.create_index(
        op.f('ix_user_admin_level'),
        'user',
        ['admin_level'],
        unique=False
    )
    op.create_index(
        op.f('ix_user_last_login'),
        'user',
        ['last_login'],
        unique=False
    )
    op.create_index(
        op.f('ix_user_last_active'),
        'user',
        ['last_active'],
        unique=False
    )


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_user_last_active'), table_name='user')
    op.drop_index(op.f('ix_user_last_login'), table_name='user')
    op.drop_index(op.f('ix_user_admin_level'), table_name='user')
    
    # Drop audit log table and indexes
    op.drop_index(
        op.f('ix_admin_audit_log_created_at'),
        table_name='admin_audit_log'
    )
    op.drop_index(
        op.f('ix_admin_audit_log_admin_id'),
        table_name='admin_audit_log'
    )
    op.drop_table('admin_audit_log')
    
    # Drop columns from user table
    op.drop_column('user', 'login_count')
    op.drop_column('user', 'last_active')
    op.drop_column('user', 'last_login')
    op.drop_column('user', 'permissions')
    op.drop_column('user', 'admin_level')
    
    # Drop enums
    admin_permissions.drop(op.get_bind())
    admin_level.drop(op.get_bind())
