from enum import StrEnum

from sqlalchemy import Boolean, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, RecordMixin


class ProjectStatus(StrEnum):
    ACTIVE = "ACTIVE"
    IN_DEVELOPMENT = "IN_DEVELOPMENT"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


class Project(RecordMixin, Base):
    __tablename__ = "projects"

    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    summary: Mapped[str] = mapped_column(String(1000))
    description: Mapped[str] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(String(2048))
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, native_enum=False, create_constraint=True, name="project_status"),
        default=ProjectStatus.IN_DEVELOPMENT,
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
