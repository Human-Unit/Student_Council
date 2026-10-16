from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate
from app.services.common import commit_record, find_record


async def list_published(session: AsyncSession, limit: int, offset: int) -> list[Document]:
    result = await session.scalars(
        select(Document)
        .where(Document.is_published.is_(True))
        .order_by(Document.sort_order, Document.slug)
        .limit(limit)
        .offset(offset)
    )
    return list(result)


async def get_published(session: AsyncSession, slug: str) -> Document:
    document = await session.scalar(
        select(Document).where(Document.slug == slug, Document.is_published.is_(True))
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


async def create_document(session: AsyncSession, data: DocumentCreate) -> Document:
    document = Document(**data.model_dump())
    session.add(document)
    return await commit_record(session, document)


async def update_document(session: AsyncSession, record_id: UUID, data: DocumentUpdate) -> Document:
    values = data.model_dump(exclude_unset=True)
    if any(
        value is None for key, value in values.items() if key not in {"short_title", "template_url"}
    ):
        raise HTTPException(status_code=422, detail="Required document fields cannot be null")
    document = await find_record(session, Document, record_id)
    for key, value in values.items():
        setattr(document, key, value)
    return await commit_record(session, document)


async def delete_document(session: AsyncSession, record_id: UUID) -> None:
    document = await find_record(session, Document, record_id)
    await session.delete(document)
    await session.commit()
