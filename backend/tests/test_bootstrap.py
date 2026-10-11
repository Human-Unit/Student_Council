from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.config import Settings
from app.core.security import verify_password
from app.db import init_db
from app.db.base import Base
from app.models import Role, User


async def test_bootstrap_is_idempotent_and_never_overwrites(tmp_path, monkeypatch):
    url = "sqlite+aiosqlite:///" + (tmp_path / "bootstrap-test.db").as_posix()
    settings = Settings(
        _env_file=None,
        app_env="test",
        database_url=url,
        jwt_secret_key="test-only-bootstrap-key-at-least-32-characters",
        first_admin_email="bootstrap@example.com",
        first_admin_password="First-test-password",
    )
    monkeypatch.setattr(init_db, "get_settings", lambda: settings)
    engine = create_async_engine(url)
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    assert await init_db.bootstrap_admin() is True
    settings.first_admin_password = type(settings.first_admin_password)("Different-test-password")
    assert await init_db.bootstrap_admin() is False
    sessions = async_sessionmaker(engine, expire_on_commit=False)
    async with sessions() as session:
        records = list(await session.scalars(select(User)))
        assert len(records) == 1
        assert records[0].role == Role.ADMIN
        assert verify_password("First-test-password", records[0].password_hash)
        assert not verify_password("Different-test-password", records[0].password_hash)
    await engine.dispose()
