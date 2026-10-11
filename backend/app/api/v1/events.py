from uuid import UUID

from fastapi import APIRouter, Response

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import EditorDep
from app.models import Event
from app.schemas.event import EventCreate, EventRead, EventUpdate
from app.services import content as service

router = APIRouter(prefix="/events", tags=["Event"])


@router.get("", response_model=list[EventRead], summary="List published events")
async def list_items(session: SessionDep, page: PaginationDep):
    return await service.list_published(session, Event, *page)


@router.get("/{event_id}", response_model=EventRead, summary="Read published event")
async def get_item(event_id: UUID, session: SessionDep):
    return await service.get_published(session, Event, event_id)


@router.post("", response_model=EventRead, status_code=201, summary="Create event (ADMIN/EDITOR)")
async def create_item(data: EventCreate, session: SessionDep, editor: EditorDep):
    return await service.create_content(session, Event, data)


@router.patch("/{record_id}", response_model=EventRead, summary="Update event (ADMIN/EDITOR)")
async def update_item(record_id: UUID, data: EventUpdate, session: SessionDep, editor: EditorDep):
    return await service.update_content(session, Event, record_id, data)


@router.delete("/{record_id}", status_code=204, summary="Delete event (ADMIN/EDITOR)")
async def delete_item(record_id: UUID, session: SessionDep, editor: EditorDep):
    await service.delete_content(session, Event, record_id)
    return Response(status_code=204)
