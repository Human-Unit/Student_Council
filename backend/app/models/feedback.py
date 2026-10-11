from enum import StrEnum

from sqlalchemy import Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, RecordMixin


class FeedbackCategory(StrEnum):
    IDEA = "IDEA"
    PROBLEM = "PROBLEM"
    EVENT = "EVENT"
    CLUB = "CLUB"
    ACADEMIC = "ACADEMIC"
    OTHER = "OTHER"


class FeedbackStatus(StrEnum):
    NEW = "NEW"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"


class Feedback(RecordMixin, Base):
    __tablename__ = "feedback"

    category: Mapped[FeedbackCategory] = mapped_column(
        Enum(FeedbackCategory, native_enum=False, create_constraint=True, name="feedback_category")
    )
    name: Mapped[str | None] = mapped_column(String(120))
    contact: Mapped[str | None] = mapped_column(String(254))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[FeedbackStatus] = mapped_column(
        Enum(FeedbackStatus, native_enum=False, create_constraint=True, name="feedback_status"),
        default=FeedbackStatus.NEW,
    )
