from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.deps import SessionDep
from app.api.v1 import auth, documents, events, feedback, news, projects, users

router = APIRouter(prefix="/api/v1")


async def health(session: SessionDep) -> dict[str, str]:
    try:
        await session.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {"status": "ok"}


router.add_api_route(
    "/health",
    health,
    methods=["GET"],
    tags=["Health"],
    response_model=dict[str, str],
    summary="Check API and database readiness",
)
for child in (
    auth.router,
    users.router,
    feedback.router,
    news.router,
    events.router,
    projects.router,
    documents.router,
):
    router.include_router(child)
