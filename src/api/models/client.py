from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey
from api.models import db

class Client(db.Model):
    __tablename__ = "client"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    notes: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[int] = mapped_column(Integer)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    update_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship(
        back_populates="clients",
        passive_deletes=True
    )

    appointments: Mapped[list["Appointment"]] = relationship(
        back_populates="client",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "notes": self.notes,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }
