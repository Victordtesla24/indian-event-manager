"""update_admin_enum_names_and_defaults

Revision ID: 49761405c97a
Revises: f719632b92be
Create Date: 2025-01-24 20:47:34.758940

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '49761405c97a'
down_revision = 'f719632b92be'
branch_labels = None
depends_on = None

# Create new enum types
adminpermission = postgresql.ENUM(
    'MANAGE_USERS',
    'MANAGE_EVENTS',
    'MANAGE_SPONSORS',
    'MANAGE_CONTENT',
    'VIEW_ANALYTICS',
    'MANAGE_SETTINGS',
    name='adminpermission'
)


def upgrade() -> None:
    # Create new enum type
    adminpermission.create(op.get_bind(), checkfirst=True)

    # Create new adminauditlog table
    op.create_table(
        'adminauditlog',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('admin_id', sa.String(), nullable=False),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=False),
        sa.Column('entity_id', sa.String(), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
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
    op.create_index(op.f('ix_adminauditlog_admin_id'), 'adminauditlog', ['admin_id'], unique=False)
    op.create_index(op.f('ix_adminauditlog_id'), 'adminauditlog', ['id'], unique=False)

    # Drop old audit log table and indexes
    op.drop_index('ix_admin_audit_log_admin_id', table_name='admin_audit_log')
    op.drop_index('ix_admin_audit_log_created_at', table_name='admin_audit_log')
    op.drop_table('admin_audit_log')

    # Update user permissions column
    # First, drop the old array type
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions DROP DEFAULT')
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions TYPE varchar[] USING permissions::varchar[]')
    
    # Then create the new array type with the new enum
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions TYPE adminpermission[] USING permissions::adminpermission[]')
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions SET DEFAULT \'{}\'')

    # Drop old indexes
    op.drop_index('ix_user_admin_level', table_name='user')
    op.drop_index('ix_user_last_active', table_name='user')
    op.drop_index('ix_user_last_login', table_name='user')

    # Recreate indexes
    op.create_index(op.f('ix_user_admin_level'), 'user', ['admin_level'], unique=False)
    op.create_index(op.f('ix_user_last_active'), 'user', ['last_active'], unique=False)
    op.create_index(op.f('ix_user_last_login'), 'user', ['last_login'], unique=False)


def downgrade() -> None:
    # Drop new indexes
    op.drop_index(op.f('ix_user_last_login'), table_name='user')
    op.drop_index(op.f('ix_user_last_active'), table_name='user')
    op.drop_index(op.f('ix_user_admin_level'), table_name='user')

    # Revert permissions column
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions DROP DEFAULT')
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions TYPE varchar[] USING permissions::varchar[]')
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions TYPE adminpermissions[] USING permissions::adminpermissions[]')
    op.execute('ALTER TABLE "user" ALTER COLUMN permissions SET DEFAULT \'{}\'')

    # Recreate old audit log table
    op.create_table(
        'admin_audit_log',
        sa.Column(
            'id',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=False
        ),
        sa.Column(
            'admin_id',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=False
        ),
        sa.Column(
            'action',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=False
        ),
        sa.Column(
            'entity_type',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=False
        ),
        sa.Column(
            'entity_id',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True
        ),
        sa.Column(
            'details',
            postgresql.JSONB(astext_type=sa.Text()),
            autoincrement=False,
            nullable=True
        ),
        sa.Column(
            'ip_address',
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True
        ),
        sa.Column(
            'created_at',
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text('now()'),
            autoincrement=False,
            nullable=False
        ),
        sa.ForeignKeyConstraint(
            ['admin_id'],
            ['user.id'],
            name='admin_audit_log_admin_id_fkey'
        ),
        sa.PrimaryKeyConstraint('id', name='admin_audit_log_pkey')
    )
    op.create_index('ix_admin_audit_log_created_at', 'admin_audit_log', ['created_at'], unique=False)
    op.create_index('ix_admin_audit_log_admin_id', 'admin_audit_log', ['admin_id'], unique=False)

    # Drop new audit log table
    op.drop_index(op.f('ix_adminauditlog_id'), table_name='adminauditlog')
    op.drop_index(op.f('ix_adminauditlog_admin_id'), table_name='adminauditlog')
    op.drop_table('adminauditlog')

    # Drop new enum type
    adminpermission.drop(op.get_bind(), checkfirst=True)
