from enum import StrEnum

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, RecordMixin


class Role(StrEnum):
    ADMIN = "ADMIN"
    EDITOR = "EDITOR"


class User(RecordMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(512))
    role: Mapped[Role] = mapped_column(
        Enum(Role, native_enum=False, create_constraint=True, name="user_role"),
        default=Role.EDITOR,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
