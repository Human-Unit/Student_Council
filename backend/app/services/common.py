from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base


async def commit_record(session: AsyncSession, record: Base) -> Base:
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(status_code=409, detail="Record conflicts with existing data") from exc
    await session.refresh(record)
    return record


async def find_record(session: AsyncSession, model: type[Base], record_id: UUID) -> Base:
    record = await session.get(model, record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return record
