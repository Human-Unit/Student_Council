from uuid import UUID

from fastapi import APIRouter, Response

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import AdminDep
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import users as service
from app.services.common import find_record

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserRead], summary="List users (ADMIN only)")
async def list_users(session: SessionDep, admin: AdminDep, page: PaginationDep):
    return await service.list_users(session, *page)


@router.post("", response_model=UserRead, status_code=201, summary="Create a user (ADMIN only)")
async def create_user(data: UserCreate, session: SessionDep, admin: AdminDep):
    return await service.create_user(session, data)


@router.get("/{user_id}", response_model=UserRead, summary="Read a user (ADMIN only)")
async def get_user(user_id: UUID, session: SessionDep, admin: AdminDep):
    return await find_record(session, User, user_id)


@router.patch("/{user_id}", response_model=UserRead, summary="Change role or activity (ADMIN only)")
async def update_user(user_id: UUID, data: UserUpdate, session: SessionDep, admin: AdminDep):
    return await service.update_user(session, user_id, data)


@router.delete("/{user_id}", status_code=204, summary="Delete a user (ADMIN only)")
async def delete_user(user_id: UUID, session: SessionDep, admin: AdminDep):
    await service.delete_user(session, user_id)
    return Response(status_code=204)
