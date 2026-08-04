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
    calendly = "calendly"


class Appointment(db.Model):
    __tablename__ = "appointment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus), nullable=False)
    source: Mapped[AppointmentSource] = mapped_column(
        Enum(AppointmentSource), nullable=False, default=AppointmentSource.manual)

    service_id: Mapped[int] = mapped_column(
        ForeignKey("service.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("client.id"), nullable=False)

    calendly_event_uri: Mapped[str] = mapped_column(String(255))
    calendly_invitee_uri: Mapped[str] = mapped_column(String(255))
    google_calendar_event_id: Mapped[str] = mapped_column(String(255))
    cancel_url: Mapped[str] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    update_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
            "calendly_event_uri": self.calendly_event_uri,
            "calendly_invitee_uri": self.calendly_invitee_uri,
            "google_calendar_event_id": self.google_calendar_event_id,
            "cancel_url": self.cancel_url,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }
