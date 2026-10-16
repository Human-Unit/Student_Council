from uuid import UUID

from fastapi import APIRouter, Response

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import EditorDep
from app.schemas.document import DocumentCreate, DocumentRead, DocumentUpdate
from app.services import documents as service

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("", response_model=list[DocumentRead], summary="List published documents")
async def list_documents(session: SessionDep, page: PaginationDep):
    return await service.list_published(session, *page)


@router.get("/{slug}", response_model=DocumentRead, summary="Read a published document")
async def get_document(slug: str, session: SessionDep):
    return await service.get_published(session, slug)


@router.post(
    "", response_model=DocumentRead, status_code=201, summary="Create document (ADMIN/EDITOR)"
)
async def create_document(data: DocumentCreate, session: SessionDep, editor: EditorDep):
    return await service.create_document(session, data)


@router.patch("/{record_id}", response_model=DocumentRead, summary="Update document (ADMIN/EDITOR)")
async def update_document(
    record_id: UUID, data: DocumentUpdate, session: SessionDep, editor: EditorDep
):
    return await service.update_document(session, record_id, data)


@router.delete("/{record_id}", status_code=204, summary="Delete document (ADMIN/EDITOR)")
async def delete_document(record_id: UUID, session: SessionDep, editor: EditorDep):
    await service.delete_document(session, record_id)
    return Response(status_code=204)
