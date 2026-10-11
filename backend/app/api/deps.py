from typing import Annotated

from fastapi import Depends, Query, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.db.session import get_session
from app.models.user import User
from app.services.auth import unauthenticated, user_from_token

SessionDep = Annotated[AsyncSession, Depends(get_session)]
bearer = HTTPBearer(auto_error=False)


def request_settings(request: Request) -> Settings:
    return request.app.state.settings


SettingsDep = Annotated[Settings, Depends(request_settings)]


async def get_current_user(
    session: SessionDep,
    settings: SettingsDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> User:
    if credentials is None:
        raise unauthenticated()
    return await user_from_token(session, credentials.credentials, "access", settings)


CurrentUser = Annotated[User, Depends(get_current_user)]


def pagination(
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> tuple[int, int]:
    return limit, offset


PaginationDep = Annotated[tuple[int, int], Depends(pagination)]
