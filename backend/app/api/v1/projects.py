from uuid import UUID

from fastapi import APIRouter, Response

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import EditorDep
from app.models import Project
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services import content as service

router = APIRouter(prefix="/projects", tags=["Project"])


@router.get("", response_model=list[ProjectRead], summary="List published projects")
async def list_items(session: SessionDep, page: PaginationDep):
    return await service.list_published(session, Project, *page)


@router.get("/{slug}", response_model=ProjectRead, summary="Read published project")
async def get_item(slug: str, session: SessionDep):
    return await service.get_published(session, Project, slug)


@router.post(
    "", response_model=ProjectRead, status_code=201, summary="Create project (ADMIN/EDITOR)"
)
async def create_item(data: ProjectCreate, session: SessionDep, editor: EditorDep):
    return await service.create_content(session, Project, data)


@router.patch("/{record_id}", response_model=ProjectRead, summary="Update project (ADMIN/EDITOR)")
async def update_item(record_id: UUID, data: ProjectUpdate, session: SessionDep, editor: EditorDep):
    return await service.update_content(session, Project, record_id, data)


@router.delete("/{record_id}", status_code=204, summary="Delete project (ADMIN/EDITOR)")
async def delete_item(record_id: UUID, session: SessionDep, editor: EditorDep):
    await service.delete_content(session, Project, record_id)
    return Response(status_code=204)
