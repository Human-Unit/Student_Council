import pytest
from pydantic import ValidationError

from app.core.config import Settings
from app.schemas.project import ProjectCreate


def test_production_rejects_example_secrets():
    with pytest.raises(ValidationError):
        Settings(
            _env_file=None,
            app_env="production",
            database_url="postgresql+asyncpg://test:test@localhost/test",
            jwt_secret_key="change-me",
            first_admin_email=None,
            first_admin_password=None,
        )


def test_non_test_application_requires_postgres():
    with pytest.raises(ValidationError):
        Settings(
            _env_file=None,
            app_env="development",
            jwt_secret_key="test",
            database_url="sqlite+aiosqlite:///:memory:",
        )


def test_cors_rejects_wildcard():
    with pytest.raises(ValidationError):
        Settings(_env_file=None, app_env="test", jwt_secret_key="test", cors_origins="*")


def test_url_limit_matches_database():
    with pytest.raises(ValidationError):
        ProjectCreate(
            title="Synthetic project",
            slug="synthetic-project",
            description="Validation only, not stored.",
            url="https://example.com/" + "a" * 2040,
        )


async def test_production_disables_documentation():
    from httpx import ASGITransport, AsyncClient

    from app.main import create_app

    settings = Settings(
        _env_file=None,
        app_env="production",
        database_url="postgresql+asyncpg://test:test@localhost/isolated_test",
        jwt_secret_key="unique-test-only-production-validation-key",
        first_admin_email=None,
        first_admin_password=None,
    )
    application = create_app(settings)
    async with AsyncClient(
        transport=ASGITransport(app=application), base_url="http://test"
    ) as http:
        for path in ("/docs", "/openapi.json"):
            assert (await http.get(path)).status_code == 404
    await application.state.engine.dispose()
