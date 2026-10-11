import os

# Set explicit test values before importing the application. Never load a real .env.
os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-only-jwt-key-unique-to-the-isolated-pytest-suite"
os.environ.pop("FIRST_ADMIN_EMAIL", None)
os.environ.pop("FIRST_ADMIN_PASSWORD", None)

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.config import Settings
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import get_session
from app.main import create_app
from app.models import Role, User


@pytest.fixture
def settings():
    return Settings(
        _env_file=None,
        app_env="test",
        database_url="sqlite+aiosqlite:///:memory:",
        jwt_secret_key="test-only-jwt-key-unique-to-the-isolated-pytest-suite",
        first_admin_email=None,
        first_admin_password=None,
    )


@pytest_asyncio.fixture
async def database():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as connection:
        # Tests only. Production schema creation is exclusively Alembic.
        await connection.run_sync(Base.metadata.create_all)
    sessions = async_sessionmaker(engine, expire_on_commit=False)
    async with sessions() as session:
        session.add_all(
            [
                User(
                    email="admin@example.com",
                    password_hash=hash_password("Admin-test-password"),
                    role=Role.ADMIN,
                ),
                User(
                    email="editor@example.com",
                    password_hash=hash_password("Editor-test-password"),
                    role=Role.EDITOR,
                ),
            ]
        )
        await session.commit()
    yield sessions
    await engine.dispose()


@pytest_asyncio.fixture
async def client(database, settings):
    application = create_app(settings)

    async def isolated_session():
        async with database() as session:
            yield session

    application.dependency_overrides[get_session] = isolated_session
    async with AsyncClient(
        transport=ASGITransport(app=application), base_url="http://test"
    ) as http:
        yield http
    await application.state.engine.dispose()


@pytest_asyncio.fixture
async def admin_headers(client):
    response = await client.post(
        "/api/v1/auth/login", json={"email": "admin@example.com", "password": "Admin-test-password"}
    )
    assert response.status_code == 200
    return {"Authorization": "Bearer " + response.json()["access_token"]}


@pytest_asyncio.fixture
async def editor_headers(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "editor@example.com", "password": "Editor-test-password"},
    )
    assert response.status_code == 200
    return {"Authorization": "Bearer " + response.json()["access_token"]}
