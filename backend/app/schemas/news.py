from datetime import datetime

from pydantic import AwareDatetime

from app.schemas.common import Body, InputModel, RecordRead, Slug, Summary, Title


class NewsCreate(InputModel):
    title: Title
    slug: Slug
    summary: Summary = ""
    content: Body
    is_published: bool = False
    published_at: AwareDatetime | None = None


class NewsUpdate(InputModel):
    title: Title | None = None
    slug: Slug | None = None
    summary: Summary | None = None
    content: Body | None = None
    is_published: bool | None = None
    published_at: AwareDatetime | None = None


class NewsRead(RecordRead):
    title: str
    slug: str
    summary: str
    content: str
    is_published: bool
    published_at: datetime | None
