from uuid import UUID

from fastapi import APIRouter

from app.api.deps import PaginationDep, SessionDep
from app.core.permissions import EditorDep
from app.schemas.feedback import FeedbackCreate, FeedbackRead, FeedbackReceipt, FeedbackUpdate
from app.services import feedback as service

router = APIRouter(prefix="/feedback", tags=["Student Voice"])


@router.post("", response_model=FeedbackReceipt, status_code=201, summary="Submit private feedback")
async def submit_feedback(data: FeedbackCreate, session: SessionDep):
    return await service.submit_feedback(session, data)


@router.get("", response_model=list[FeedbackRead], summary="List private feedback (ADMIN/EDITOR)")
async def list_feedback(session: SessionDep, editor: EditorDep, page: PaginationDep):
    return await service.list_feedback(session, *page)


@router.get("/{feedback_id}", response_model=FeedbackRead, summary="Read private feedback")
async def get_feedback(feedback_id: UUID, session: SessionDep, editor: EditorDep):
    return await service.get_feedback(session, feedback_id)


@router.patch("/{feedback_id}", response_model=FeedbackRead, summary="Update feedback status")
async def update_feedback(
    feedback_id: UUID, data: FeedbackUpdate, session: SessionDep, editor: EditorDep
):
    return await service.update_feedback(session, feedback_id, data)
