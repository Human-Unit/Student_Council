from pydantic import EmailStr, Field

from app.models.user import Role
from app.schemas.common import InputModel, RecordRead


class UserCreate(InputModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    role: Role = Role.EDITOR
    is_active: bool = True


class UserUpdate(InputModel):
    role: Role | None = None
    is_active: bool | None = None


class UserRead(RecordRead):
    email: EmailStr
    role: Role
    is_active: bool
