from fastapi import HTTPException
from jwt.exceptions import InvalidTokenError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.core.config import Settings
from app.core.security import DUMMY_HASH, create_token, decode_token, verify_password
from app.models.user import User
from app.schemas.auth import TokenPair


def unauthenticated() -> HTTPException:
    return HTTPException(
        status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"}
    )


def token_pair(user: User, settings: Settings) -> TokenPair:
    return TokenPair(
        access_token=create_token(user.id, "access", settings),
        refresh_token=create_token(user.id, "refresh", settings),
    )


async def login(session: AsyncSession, email: str, password: str, settings: Settings) -> TokenPair:
    user = await session.scalar(select(User).where(User.email == email.lower()))
    valid = await run_in_threadpool(
        verify_password, password, user.password_hash if user else DUMMY_HASH
    )
    if not user or not valid or not user.is_active:
        raise unauthenticated()
    return token_pair(user, settings)


async def user_from_token(
    session: AsyncSession, token: str, token_type: str, settings: Settings
) -> User:
    try:
        user_id = decode_token(token, token_type, settings)
    except InvalidTokenError as exc:
        raise unauthenticated() from exc
    user = await session.get(User, user_id)
    if not user or not user.is_active:
        raise unauthenticated()
    return user


async def refresh(session: AsyncSession, token: str, settings: Settings) -> TokenPair:
    user = await user_from_token(session, token, "refresh", settings)
    return token_pair(user, settings)
