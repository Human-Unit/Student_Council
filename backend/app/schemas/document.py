from pathlib import PurePosixPath
from typing import Annotated
from urllib.parse import unquote, urlsplit

from pydantic import AfterValidator, Field, HttpUrl, TypeAdapter

from app.models.document import DocumentCategory
from app.schemas.common import InputModel, RecordRead, Slug, Summary, Title


def validate_template_url(value: str) -> str:
    if "\\" in value or any(ord(character) < 32 for character in value):
        raise ValueError("Use a stable DOCX path or HTTPS URL")
    parsed = urlsplit(value)
    path = unquote(parsed.path)
    if "%" in path:
        raise ValueError("Template paths must not contain nested percent encoding")
    if ".." in PurePosixPath(path).parts or not path.lower().endswith(".docx"):
        raise ValueError("Template must reference a DOCX file without path traversal")
    if value.startswith("/documents/templates/") and not parsed.scheme and not parsed.netloc:
        if parsed.query or parsed.fragment:
            raise ValueError("Static templates require a stable path")
        return value
    url = TypeAdapter(HttpUrl).validate_python(value)
    if url.scheme != "https" or url.username or url.password or parsed.fragment:
        raise ValueError("External templates require HTTPS without credentials or fragments")
    return str(url)


TemplateUrl = Annotated[str, Field(max_length=2048), AfterValidator(validate_template_url)]
SortOrder = Annotated[int, Field(strict=True, ge=0, le=2147483647)]


class DocumentCreate(InputModel):
    title: Title
    short_title: Title | None = None
    slug: Slug
    summary: Summary
    category: DocumentCategory
    template_url: TemplateUrl | None = None
    sort_order: SortOrder = 0
    is_published: bool = False


class DocumentUpdate(InputModel):
    title: Title | None = None
    short_title: Title | None = None
    slug: Slug | None = None
    summary: Summary | None = None
    category: DocumentCategory | None = None
    template_url: TemplateUrl | None = None
    sort_order: SortOrder | None = None
    is_published: bool | None = None


class DocumentRead(RecordRead):
    title: str
    short_title: str | None
    slug: str
    summary: str
    category: DocumentCategory
    template_url: str | None
    sort_order: int
    is_published: bool
