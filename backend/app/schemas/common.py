from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, StringConstraints

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Slug = Annotated[
    str, StringConstraints(min_length=1, max_length=160, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
]
Body = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50000)]
Summary = Annotated[str, StringConstraints(strip_whitespace=True, max_length=1000)]
WebUrl = Annotated[HttpUrl, Field(max_length=2048)]


class InputModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RecordRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime
    updated_at: datetime
