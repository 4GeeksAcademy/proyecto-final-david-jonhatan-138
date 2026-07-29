"""empty message

Revision ID: 833d79b3ec63
Revises: 0763d677d453
Create Date: 2026-07-28 07:30:38.115915
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Enum
from api.models.user import UserRole

# revision identifiers, used by Alembic.
revision = '833d79b3ec63'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None


def upgrade():

    # ============================
    # 1. Crear ENUM userrole
    # ============================
    userrole = Enum(UserRole, name="userrole")
    userrole.create(op.get_bind(), checkfirst=True)

    # ============================
    # 2. Crear tablas nuevas
    # ============================

    op.create_table(
        'client',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('notes', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('update_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'service',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=50), nullable=False),
        sa.Column('duration', sa.Integer(), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('update_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # appointmentstatus se crea automáticamente aquí
    op.create_table(
        'appointment',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'confirm', 'denied', name='appointmentstatus'), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('token_calendly', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('update_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['client.id']),
        sa.ForeignKeyConstraint(['service_id'], ['service.id']),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # ============================
    # 3. Alterar tabla user
    # ============================
    with op.batch_alter_table('user') as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=30), nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.String(length=30), nullable=False))
        batch_op.add_column(sa.Column('biografi', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('category', sa.String(length=120), nullable=False))
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('update_at', sa.DateTime(), nullable=False))
        batch_op.drop_column('is_active')

    # Añadir columna role (solo una vez)
    op.add_column('user', sa.Column('role', userrole, nullable=False))


def downgrade():

    op.drop_column('user', 'role')

    userrole = Enum(UserRole, name="userrole")
    userrole.drop(op.get_bind(), checkfirst=True)

    op.drop_table('appointment')
    op.drop_table('service')
    op.drop_table('client')

    with op.batch_alter_table('user') as batch_op:
        batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=False))
        batch_op.drop_column('update_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('category')
        batch_op.drop_column('biografi')
        batch_op.drop_column('last_name')
        batch_op.drop_column('name')
