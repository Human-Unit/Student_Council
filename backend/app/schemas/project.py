from app.models.project import ProjectStatus
from app.schemas.common import Body, InputModel, RecordRead, Slug, Summary, Title, WebUrl


class ProjectCreate(InputModel):
    title: Title
    slug: Slug
    summary: Summary = ""
    description: Body
    url: WebUrl | None = None
    status: ProjectStatus = ProjectStatus.IN_DEVELOPMENT
    is_published: bool = False


class ProjectUpdate(InputModel):
    title: Title | None = None
    slug: Slug | None = None
    summary: Summary | None = None
    description: Body | None = None
    url: WebUrl | None = None
    status: ProjectStatus | None = None
    is_published: bool | None = None


class ProjectRead(RecordRead):
    title: str
    slug: str
    summary: str
    description: str
    url: str | None
    status: ProjectStatus
    is_published: bool
