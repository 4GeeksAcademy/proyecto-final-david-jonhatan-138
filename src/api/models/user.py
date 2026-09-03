import enum
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, Enum, Boolean
from api.models import db

class UserRole(enum.Enum):
    admin = "admin"
    professional = "professional"

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    last_name: Mapped[str] = mapped_column(String(30), nullable=False)
    biografi: Mapped[str] = mapped_column(String(255), nullable=True)
    category: Mapped[str] = mapped_column(String(120), nullable=True)
    id_stripe_user: Mapped[str] = mapped_column(String(255), nullable=True)
    id_stripe_subscription: Mapped[str] = mapped_column(String(255), nullable=True)
    payment: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    update_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="user")
    clients: Mapped[list["Client"]] = relationship(back_populates="user")
    services: Mapped[list["Service"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "role": self.role.value,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "biografi": self.biografi,
            "category": self.category,
            "id_stripe_user": self.id_stripe_user,
            "id_stripe_subscription": self.id_stripe_subscription,  # 👉 añadido al JSON
            "payment": self.payment,
            "created_at": self.created_at.isoformat(),
            "update_at": self.update_at.isoformat()
        }
