from functools import lru_cache
from typing import Literal

from pydantic import EmailStr, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    app_env: Literal["development", "test", "production"] = "development"
    app_name: str = "Student Council API"
    database_url: str = (
        "postgresql+asyncpg://student_council:student_council@localhost:5432/student_council"
    )
    jwt_secret_key: SecretStr
    jwt_algorithm: Literal["HS256", "HS384", "HS512"] = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    cors_origins: str = "http://localhost:3000"
    first_admin_email: EmailStr | None = None
    first_admin_password: SecretStr | None = None

    @field_validator("access_token_expire_minutes", "refresh_token_expire_days")
    @classmethod
    def positive_expiration(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Token expiration must be positive")
        return value

    @model_validator(mode="after")
    def validate_environment(self) -> "Settings":
        if self.app_env != "test" and not self.database_url.startswith("postgresql+asyncpg://"):
            raise ValueError("Application DATABASE_URL must use PostgreSQL with asyncpg")
        if "*" in self.allowed_origins:
            raise ValueError("CORS_ORIGINS must contain explicit origins")
        if bool(self.first_admin_email) != bool(self.first_admin_password):
            raise ValueError("Set both FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD or neither")
        if self.app_env == "production":
            secret = self.jwt_secret_key.get_secret_value()
            if len(secret) < 32 or secret.startswith(("change-me", "development-only")):
                raise ValueError(
                    "Production requires a unique JWT secret of at least 32 characters"
                )
            if self.first_admin_password and len(self.first_admin_password.get_secret_value()) < 12:
                raise ValueError("Production bootstrap password must have at least 12 characters")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [
            origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
