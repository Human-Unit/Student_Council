from typing import Annotated

from fastapi import Depends, HTTPException

from app.api.deps import CurrentUser
from app.models.user import Role, User


def require_admin(user: CurrentUser) -> User:
    if user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Administrator permission required")
    return user


def require_editor(user: CurrentUser) -> User:
    if user.role not in {Role.ADMIN, Role.EDITOR}:
        raise HTTPException(status_code=403, detail="Editor permission required")
    return user


AdminDep = Annotated[User, Depends(require_admin)]
EditorDep = Annotated[User, Depends(require_editor)]
