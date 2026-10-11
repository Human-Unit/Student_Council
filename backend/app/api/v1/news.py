from uuid import UUID

from fastapi import APIRouter, Response

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import EditorDep
from app.models import News
from app.schemas.news import NewsCreate, NewsRead, NewsUpdate
from app.services import content as service

router = APIRouter(prefix="/news", tags=["News"])


@router.get("", response_model=list[NewsRead], summary="List published news")
async def list_items(session: SessionDep, page: PaginationDep):
    return await service.list_published(session, News, *page)


@router.get("/{slug}", response_model=NewsRead, summary="Read published news")
async def get_item(slug: str, session: SessionDep):
    return await service.get_published(session, News, slug)


@router.post("", response_model=NewsRead, status_code=201, summary="Create news (ADMIN/EDITOR)")
async def create_item(data: NewsCreate, session: SessionDep, editor: EditorDep):
    return await service.create_content(session, News, data)


@router.patch("/{record_id}", response_model=NewsRead, summary="Update news (ADMIN/EDITOR)")
async def update_item(record_id: UUID, data: NewsUpdate, session: SessionDep, editor: EditorDep):
    return await service.update_content(session, News, record_id, data)


@router.delete("/{record_id}", status_code=204, summary="Delete news (ADMIN/EDITOR)")
async def delete_item(record_id: UUID, session: SessionDep, editor: EditorDep):
    await service.delete_content(session, News, record_id)
    return Response(status_code=204)
