from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey
from api.models import db

class Service(db.Model):
    __tablename__ = "service"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(50), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    update_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship(
        back_populates="services",
        passive_deletes=True
    )

    appointments: Mapped[list["Appointment"]] = relationship(
        back_populates="service",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "duration": self.duration,
            "price": self.price,
            "is_active": self.is_active,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }
