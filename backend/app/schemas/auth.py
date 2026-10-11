from typing import Literal

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import InputModel


class LoginInput(InputModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class RefreshInput(InputModel):
    refresh_token: str = Field(min_length=1, max_length=4096)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
