"""fix_admin_permissions_values

Revision ID: fix_admin_permissions_values
Revises: fix_admin_permission_enum
Create Date: 2025-01-24 22:16:50.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fix_admin_permissions_values'
down_revision = 'fix_admin_permission_enum'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create a temporary column
    op.add_column('user', sa.Column('temp_permissions', sa.ARRAY(sa.String), nullable=True))
    
    # Copy data to temporary column
    op.execute('UPDATE "user" SET temp_permissions = permissions::text[]')
    
    # Drop the old permissions column
    op.drop_column('user', 'permissions')
    
    # Drop and recreate the enum with all values
    op.execute('DROP TYPE adminpermission')
    op.execute("""
        CREATE TYPE adminpermission AS ENUM (
            'MANAGE_USERS',
            'MANAGE_EVENTS',
            'MANAGE_SPONSORS',
            'MANAGE_CONTENT',
            'VIEW_ANALYTICS',
            'MANAGE_SETTINGS',
            'MANAGE_MARKETING'
        )
    """)
    
    # Add new permissions column
    op.add_column('user', sa.Column('permissions', 
        sa.ARRAY(sa.Enum('MANAGE_USERS', 'MANAGE_EVENTS', 'MANAGE_SPONSORS', 
                        'MANAGE_CONTENT', 'VIEW_ANALYTICS', 'MANAGE_SETTINGS',
                        'MANAGE_MARKETING', name='adminpermission')), 
        nullable=True))
    
    # Copy data back
    op.execute('UPDATE "user" SET permissions = temp_permissions::adminpermission[]')
    
    # Drop temporary column
    op.drop_column('user', 'temp_permissions')


def downgrade() -> None:
    # Create a temporary column
    op.add_column('user', sa.Column('temp_permissions', sa.ARRAY(sa.String), nullable=True))
    
    # Copy data to temporary column
    op.execute('UPDATE "user" SET temp_permissions = permissions::text[]')
    
    # Drop the permissions column
    op.drop_column('user', 'permissions')
    
    # Drop and recreate the original enum
    op.execute('DROP TYPE adminpermission')
    op.execute("""
        CREATE TYPE adminpermission AS ENUM (
            'MANAGE_USERS',
            'MANAGE_EVENTS',
            'MANAGE_SPONSORS',
            'MANAGE_CONTENT',
            'VIEW_ANALYTICS',
            'MANAGE_SETTINGS'
        )
    """)
    
    # Add permissions column back
    op.add_column('user', sa.Column('permissions', 
        sa.ARRAY(sa.Enum('MANAGE_USERS', 'MANAGE_EVENTS', 'MANAGE_SPONSORS',
                        'MANAGE_CONTENT', 'VIEW_ANALYTICS', 'MANAGE_SETTINGS',
                        name='adminpermission')), 
        nullable=True))
    
    # Copy data back, excluding MANAGE_MARKETING
    op.execute("""
        UPDATE "user" 
        SET permissions = ARRAY(
            SELECT unnest(temp_permissions) 
            WHERE unnest != 'MANAGE_MARKETING'
        )::adminpermission[]
    """)
    
    # Drop temporary column
    op.drop_column('user', 'temp_permissions')
