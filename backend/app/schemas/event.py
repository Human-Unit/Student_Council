from datetime import datetime
from typing import Annotated

from pydantic import AwareDatetime, StringConstraints

from app.schemas.common import Body, InputModel, RecordRead, Title, WebUrl


class EventCreate(InputModel):
    title: Title
    description: Body
    location: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)]
    starts_at: AwareDatetime
    ends_at: AwareDatetime | None = None
    registration_url: WebUrl | None = None
    is_published: bool = False


class EventUpdate(InputModel):
    title: Title | None = None
    description: Body | None = None
    location: (
        Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)]
        | None
    ) = None
    starts_at: AwareDatetime | None = None
    ends_at: AwareDatetime | None = None
    registration_url: WebUrl | None = None
    is_published: bool | None = None


class EventRead(RecordRead):
    title: str
    description: str
    location: str
    starts_at: datetime
    ends_at: datetime | None
    registration_url: str | None
    is_published: bool
