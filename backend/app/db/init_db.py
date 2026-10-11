import asyncio

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from starlette.concurrency import run_in_threadpool

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.session import session_factory
from app.models.user import Role, User


async def bootstrap_admin() -> bool:
    settings = get_settings()
    if not settings.first_admin_email:
        return False
    engine, sessions = session_factory(settings)
    try:
        async with sessions() as session:
            email = str(settings.first_admin_email).lower()
            existing = await session.scalar(select(User).where(User.email == email))
            if existing:
                return False  # Never change an existing password, role, or activity.
            encoded = await run_in_threadpool(
                hash_password, settings.first_admin_password.get_secret_value()
            )
            session.add(User(email=email, password_hash=encoded, role=Role.ADMIN))
            try:
                await session.commit()
            except IntegrityError:
                await session.rollback()  # Another bootstrap may have won the race.
                return False
            return True
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(bootstrap_admin())
