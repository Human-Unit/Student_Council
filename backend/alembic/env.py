import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

import app.models  # noqa: F401 -- register every mapped table
from alembic import context
from app.core.config import get_settings
from app.db.base import Base
from app.db.connection import database_connect_args

config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)
target_metadata = Base.metadata


def offline() -> None:
    context.configure(
        url=get_settings().database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def migrate(connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()


async def online() -> None:
    settings = get_settings()
    engine = create_async_engine(
        settings.database_url,
        poolclass=pool.NullPool,
        connect_args=database_connect_args(settings),
    )
    async with engine.connect() as connection:
        await connection.run_sync(migrate)
    await engine.dispose()


if context.is_offline_mode():
    offline()
else:
    asyncio.run(online())
