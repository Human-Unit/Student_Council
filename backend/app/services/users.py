from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.core.security import hash_password
from app.models.user import Role, User
from app.schemas.user import UserCreate, UserUpdate
from app.services.common import commit_record, find_record


async def list_users(session: AsyncSession, limit: int, offset: int) -> list[User]:
    result = await session.scalars(
        select(User).order_by(User.created_at.desc(), User.id).limit(limit).offset(offset)
    )
    return list(result)


async def create_user(session: AsyncSession, data: UserCreate) -> User:
    encoded = await run_in_threadpool(hash_password, data.password)
    user = User(
        email=str(data.email).lower(),
        password_hash=encoded,
        role=data.role,
        is_active=data.is_active,
    )
    session.add(user)
    return await commit_record(session, user)


async def protect_last_admin(session: AsyncSession, user: User) -> None:
    if user.role == Role.ADMIN and user.is_active:
        count = await session.scalar(
            select(func.count())
            .select_from(User)
            .where(User.role == Role.ADMIN, User.is_active.is_(True))
        )
        if count == 1:
            raise HTTPException(
                status_code=409, detail="Cannot remove the last active administrator"
            )


async def update_user(session: AsyncSession, user_id: UUID, data: UserUpdate) -> User:
    user = await find_record(session, User, user_id)
    values = data.model_dump(exclude_unset=True)
    if any(v is None for v in values.values()):
        raise HTTPException(status_code=422, detail="User fields cannot be null")
    if values.get("role", user.role) != Role.ADMIN or not values.get("is_active", user.is_active):
        await protect_last_admin(session, user)
    for key, value in values.items():
        setattr(user, key, value)
    return await commit_record(session, user)


async def delete_user(session: AsyncSession, user_id: UUID) -> None:
    user = await find_record(session, User, user_id)
    await protect_last_admin(session, user)
    await session.delete(user)
    await session.commit()
