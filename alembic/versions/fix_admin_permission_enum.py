"""fix_admin_permission_enum

Revision ID: fix_admin_permission_enum
Revises: ab9365c79339
Create Date: 2025-01-24 22:13:50.000000

"""
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = 'fix_admin_permission_enum'
down_revision = 'ab9365c79339'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Check if the old enum exists
    conn = op.get_bind()
    result = conn.execute(text("""
        SELECT EXISTS (
            SELECT 1 
            FROM pg_type 
            WHERE typname = 'adminpermissions'
        );
    """))
    has_old_enum = result.scalar()

    if has_old_enum:
        # Rename old enum if it exists
        op.execute("ALTER TYPE adminpermissions RENAME TO adminpermission")

        # Update the column to use the new enum
        op.execute("""
            ALTER TABLE "user"
            ALTER COLUMN permissions TYPE adminpermission[]
            USING permissions::text[]::adminpermission[]
        """)


def downgrade() -> None:
    # Check if the new enum exists
    conn = op.get_bind()
    result = conn.execute(text("""
        SELECT EXISTS (
            SELECT 1 
            FROM pg_type 
            WHERE typname = 'adminpermission'
        );
    """))
    has_new_enum = result.scalar()

    if has_new_enum:
        # Revert the changes
        op.execute("""
            ALTER TABLE "user"
            ALTER COLUMN permissions TYPE adminpermissions[]
            USING permissions::text[]::adminpermissions[]
        """)
        op.execute("ALTER TYPE adminpermission RENAME TO adminpermissions")
