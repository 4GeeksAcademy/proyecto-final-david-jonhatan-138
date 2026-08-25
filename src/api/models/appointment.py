from __future__ import annotations

import enum
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Enum, ForeignKey
from api.models import db

if TYPE_CHECKING:
    from api.models.user import User
    from api.models.client import Client
    from api.models.service import Service


class AppointmentStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"


class AppointmentSource(enum.Enum):
    manual = "manual"


class Appointment(db.Model):
    __tablename__ = "appointment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # ENUM con nombre explícito (obligatorio en PostgreSQL)
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus, name="appointmentstatus"),
        nullable=False
    )

    # ENUM con nombre + server_default para PostgreSQL
    source: Mapped[AppointmentSource] = mapped_column(
        Enum(AppointmentSource, name="appointmentsource"),
        nullable=False,
        server_default="manual"
    )

    service_id: Mapped[int] = mapped_column(
        ForeignKey("service.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )
    client_id = mapped_column(
        ForeignKey("client.id", ondelete="CASCADE"),
        nullable=False
    )

    # CAMPOS EXTERNOS CONFIGURADOS COMO OPCIONALES (nullable=True)
    calendly_event_uri: Mapped[str | None] = mapped_column(String(255), nullable=True)
    calendly_invitee_uri: Mapped[str | None] = mapped_column(String(255), nullable=True)
    google_calendar_event_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cancel_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow
    )
    update_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relaciones
    user: Mapped[User] = relationship(back_populates="appointments")
    client: Mapped[Client] = relationship(back_populates="appointments")
    service: Mapped[Service] = relationship(back_populates="appointments")

    def serialize(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "status": self.status.value,
            "source": self.source.value,
            "service_id": self.service_id,
            "user_id": self.user_id,
            "client_id": self.client_id,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }