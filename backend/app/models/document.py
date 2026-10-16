from enum import StrEnum

from sqlalchemy import Boolean, CheckConstraint, Enum, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, RecordMixin


class DocumentCategory(StrEnum):
    EXPLANATION = "EXPLANATION"
    APPLICATION = "APPLICATION"
    CERTIFICATE = "CERTIFICATE"
    OTHER = "OTHER"


class Document(RecordMixin, Base):
    __tablename__ = "documents"
    __table_args__ = (
        CheckConstraint("sort_order >= 0", name="nonnegative_sort_order"),
        Index("ix_documents_public_order", "is_published", "sort_order", "slug"),
    )

    title: Mapped[str] = mapped_column(String(200))
    short_title: Mapped[str | None] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    summary: Mapped[str] = mapped_column(String(1000))
    category: Mapped[DocumentCategory] = mapped_column(
        Enum(DocumentCategory, native_enum=False, create_constraint=True, name="document_category")
    )
    template_url: Mapped[str | None] = mapped_column(String(2048))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
