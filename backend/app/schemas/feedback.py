from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints

from app.models.feedback import FeedbackCategory, FeedbackStatus
from app.schemas.common import InputModel, RecordRead


class FeedbackCreate(InputModel):
    category: FeedbackCategory
    name: (
        Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
        | None
    ) = None
    contact: (
        Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=254)]
        | None
    ) = None
    message: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=10, max_length=5000)
    ]


class FeedbackUpdate(InputModel):
    status: FeedbackStatus


class FeedbackReceipt(BaseModel):
    id: UUID
    status: FeedbackStatus


class FeedbackRead(RecordRead):
    category: FeedbackCategory
    name: str | None
    contact: str | None
    message: str
    status: FeedbackStatus
