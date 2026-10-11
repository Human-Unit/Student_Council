from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.core.config import Settings

password_hash = PasswordHash.recommended()
# A dummy hash keeps unknown-email and wrong-password paths comparable.
DUMMY_HASH = password_hash.hash("unused-dummy-password")


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hash.verify(password, encoded)


def create_token(user_id: UUID, token_type: str, settings: Settings) -> str:
    now = datetime.now(UTC)
    lifetime = (
        timedelta(minutes=settings.access_token_expire_minutes)
        if token_type == "access"
        else timedelta(days=settings.refresh_token_expire_days)
    )
    return jwt.encode(
        {
            "sub": str(user_id),
            "type": token_type,
            "iat": now,
            "exp": now + lifetime,
            "jti": str(uuid4()),
            "iss": "student-council-api",
        },
        settings.jwt_secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str, expected_type: str, settings: Settings) -> UUID:
    claims = jwt.decode(
        token,
        settings.jwt_secret_key.get_secret_value(),
        algorithms=[settings.jwt_algorithm],
        issuer="student-council-api",
        options={"require": ["sub", "type", "iat", "exp", "jti", "iss"]},
    )
    if claims["type"] != expected_type:
        raise InvalidTokenError("Incorrect token type")
    try:
        return UUID(claims["sub"])
    except (ValueError, TypeError, AttributeError) as exc:
        raise InvalidTokenError("Invalid subject") from exc
