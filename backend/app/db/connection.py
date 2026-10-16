import ssl

from app.core.config import Settings


def database_connect_args(settings: Settings) -> dict[str, ssl.SSLContext]:
    """Use the system trust store and verify the server identity in production."""
    if settings.app_env == "production":
        return {"ssl": ssl.create_default_context()}
    return {}
