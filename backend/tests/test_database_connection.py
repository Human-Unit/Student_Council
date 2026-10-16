import ssl
from unittest.mock import patch

import pytest
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import Settings
from app.db.connection import database_connect_args
from app.db.session import session_factory


def production_settings():
    return Settings(
        _env_file=None,
        app_env="production",
        database_url="postgresql+asyncpg://test:test@localhost/isolated_test",
        jwt_secret_key="unique-test-only-production-validation-key",
        first_admin_email=None,
        first_admin_password=None,
    )


def test_production_requires_verified_tls_with_system_trust():
    context = database_connect_args(production_settings())["ssl"]
    assert isinstance(context, ssl.SSLContext)
    assert context.verify_mode == ssl.CERT_REQUIRED
    assert context.check_hostname is True


@pytest.mark.parametrize("environment", ["development", "test"])
def test_non_production_keeps_existing_local_connection_behavior(environment):
    settings = Settings(
        _env_file=None,
        app_env=environment,
        jwt_secret_key="isolated-test-only-secret",
        database_url="postgresql+asyncpg://test:test@localhost/isolated_test",
        first_admin_email=None,
        first_admin_password=None,
    )
    assert database_connect_args(settings) == {}


async def test_application_engine_receives_production_tls_context():
    with patch("app.db.session.create_async_engine", wraps=create_async_engine) as create:
        engine, _ = session_factory(production_settings())
    try:
        context = create.call_args.kwargs["connect_args"]["ssl"]
        assert context.verify_mode == ssl.CERT_REQUIRED
        assert context.check_hostname is True
        assert create.call_args.kwargs["pool_pre_ping"] is True
    finally:
        await engine.dispose()
