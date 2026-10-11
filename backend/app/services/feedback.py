from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackUpdate
from app.services.common import commit_record, find_record


async def submit_feedback(session: AsyncSession, data: FeedbackCreate) -> Feedback:
    record = Feedback(**data.model_dump())
    session.add(record)
    return await commit_record(session, record)


async def list_feedback(session: AsyncSession, limit: int, offset: int) -> list[Feedback]:
    result = await session.scalars(
        select(Feedback)
        .order_by(Feedback.created_at.desc(), Feedback.id)
        .limit(limit)
        .offset(offset)
    )
    return list(result)


async def get_feedback(session: AsyncSession, feedback_id: UUID) -> Feedback:
    return await find_record(session, Feedback, feedback_id)


async def update_feedback(
    session: AsyncSession, feedback_id: UUID, data: FeedbackUpdate
) -> Feedback:
    record = await get_feedback(session, feedback_id)
    record.status = data.status
    return await commit_record(session, record)
