from fastapi import APIRouter

from app.api.deps import CurrentUser, SessionDep, SettingsDep
from app.schemas.auth import LoginInput, RefreshInput, TokenPair
from app.schemas.user import UserRead
from app.services import auth as service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenPair, summary="Sign in with email and password")
async def login(data: LoginInput, session: SessionDep, settings: SettingsDep):
    return await service.login(session, str(data.email), data.password, settings)


@router.post(
    "/refresh", response_model=TokenPair, summary="Exchange a refresh token for token pair"
)
async def refresh(data: RefreshInput, session: SessionDep, settings: SettingsDep):
    return await service.refresh(session, data.refresh_token, settings)


@router.get("/me", response_model=UserRead, summary="Get the active authenticated user")
async def me(user: CurrentUser):
    return user
