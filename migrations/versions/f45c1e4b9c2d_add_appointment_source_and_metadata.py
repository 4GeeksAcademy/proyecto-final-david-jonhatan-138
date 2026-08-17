"""Add source and metadata columns to appointment

Revision ID: f45c1e4b9c2d
Revises: 28944bef3352
Create Date: 2026-08-12 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f45c1e4b9c2d'
down_revision = '28944bef3352'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE appointmentstatus RENAME TO appointmentstatus_old")
    op.execute(
        "CREATE TYPE appointmentstatus AS ENUM ('pending', 'confirmed', 'canceled')")
    op.execute(
        "ALTER TABLE appointment "
        "ALTER COLUMN status TYPE appointmentstatus "
        "USING CASE "
        "WHEN status::text = 'pending' THEN 'pending'::appointmentstatus "
        "WHEN status::text = 'confirm' THEN 'confirmed'::appointmentstatus "
        "WHEN status::text = 'denied' THEN 'canceled'::appointmentstatus "
        "ELSE 'pending'::appointmentstatus "
        "END"
    )
    op.execute("DROP TYPE appointmentstatus_old")

    with op.batch_alter_table('appointment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('source', sa.Enum(
            'manual', 'calendly', name='appointmentsource'), nullable=False, server_default='manual'))
        batch_op.add_column(sa.Column('calendly_event_uri',
                            sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('calendly_invitee_uri',
                            sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('google_calendar_event_id',
                            sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('cancel_url',
                            sa.String(length=255), nullable=True))

    with op.batch_alter_table('appointment', schema=None) as batch_op:
        batch_op.alter_column('source', server_default=None)


def downgrade():
    bind = op.get_bind()
    op.execute("ALTER TYPE appointmentstatus RENAME TO appointmentstatus_old")
    op.execute(
        "CREATE TYPE appointmentstatus AS ENUM ('pending', 'confirm', 'denied')")
    op.execute(
        "ALTER TABLE appointment "
        "ALTER COLUMN status TYPE appointmentstatus "
        "USING CASE "
        "WHEN status::text = 'pending' THEN 'pending'::appointmentstatus "
        "WHEN status::text = 'confirmed' THEN 'confirm'::appointmentstatus "
        "WHEN status::text = 'canceled' THEN 'denied'::appointmentstatus "
        "ELSE 'pending'::appointmentstatus "
        "END"
    )
    op.execute("DROP TYPE appointmentstatus_old")

    with op.batch_alter_table('appointment', schema=None) as batch_op:
        batch_op.drop_column('cancel_url')
        batch_op.drop_column('google_calendar_event_id')
        batch_op.drop_column('calendly_invitee_uri')
        batch_op.drop_column('calendly_event_uri')
        batch_op.drop_column('source')
