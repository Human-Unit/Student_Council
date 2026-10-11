from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, RecordMixin


class News(RecordMixin, Base):
    __tablename__ = "news"

    title: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    summary: Mapped[str] = mapped_column(String(1000))
    content: Mapped[str] = mapped_column(Text)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
