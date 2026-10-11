from datetime import UTC, datetime
from uuid import UUID

from fastapi import HTTPException
from pydantic import BaseModel, HttpUrl
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Event, News, Project
from app.services.common import commit_record, find_record

ContentModel = type[News] | type[Event] | type[Project]


async def list_published(
    session: AsyncSession, model: ContentModel, limit: int, offset: int
) -> list:
    result = await session.scalars(
        select(model)
        .where(model.is_published.is_(True))
        .order_by(model.created_at.desc(), model.id)
        .limit(limit)
        .offset(offset)
    )
    return list(result)


async def get_published(
    session: AsyncSession, model: ContentModel, key: UUID | str
) -> News | Event | Project:
    condition = model.id == key if isinstance(key, UUID) else model.slug == key
    record = await session.scalar(select(model).where(condition, model.is_published.is_(True)))
    if record is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return record


def values_from(data: BaseModel, *, partial: bool = False) -> dict:
    values = data.model_dump(exclude_unset=partial)
    for key, value in values.items():
        if isinstance(value, HttpUrl):
            values[key] = str(value)
    if partial:
        nullable = {"ends_at", "published_at", "registration_url", "url"}
        if any(v is None for k, v in values.items() if k not in nullable):
            raise HTTPException(status_code=422, detail="Required content fields cannot be null")
    return values


def validate_record(record: News | Event | Project) -> None:
    if isinstance(record, Event) and record.ends_at:
        start = (
            record.starts_at.replace(tzinfo=UTC)
            if record.starts_at.tzinfo is None
            else record.starts_at
        )
        end = (
            record.ends_at.replace(tzinfo=UTC) if record.ends_at.tzinfo is None else record.ends_at
        )
        if end < start:
            raise HTTPException(status_code=422, detail="ends_at must be at or after starts_at")
    if isinstance(record, News) and record.is_published and not record.published_at:
        record.published_at = datetime.now(UTC)


async def create_content(
    session: AsyncSession, model: ContentModel, data: BaseModel
) -> News | Event | Project:
    record = model(**values_from(data))
    validate_record(record)
    session.add(record)
    return await commit_record(session, record)


async def update_content(
    session: AsyncSession, model: ContentModel, record_id: UUID, data: BaseModel
) -> News | Event | Project:
    record = await find_record(session, model, record_id)
    for key, value in values_from(data, partial=True).items():
        setattr(record, key, value)
    validate_record(record)
    return await commit_record(session, record)


async def delete_content(session: AsyncSession, model: ContentModel, record_id: UUID) -> None:
    record = await find_record(session, model, record_id)
    await session.delete(record)
    await session.commit()
