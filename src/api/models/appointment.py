import enum
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, String, Enum, ForeignKey
from api.models import db

class AppointmentStatus(enum.Enum):
    pending = "pending"
    confirm = "confirm"
    denied = "denied"

class Appointment(db.Model):
    __tablename__ = "appointment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[AppointmentStatus] = mapped_column(Enum(AppointmentStatus), nullable=False)

    service_id: Mapped[int] = mapped_column(ForeignKey("service.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    client_id: Mapped[int] = mapped_column(ForeignKey("client.id"), nullable=False)

    token_calendly: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    update_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    user: Mapped["User"] = relationship(back_populates="appointments")
    client: Mapped["Client"] = relationship(back_populates="appointments")
    service: Mapped["Service"] = relationship(back_populates="appointments")

    def serialize(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "status": self.status.value,
            "service_id": self.service_id,
            "user_id": self.user_id,
            "client_id": self.client_id,
            "token_calendly": self.token_calendly,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }
