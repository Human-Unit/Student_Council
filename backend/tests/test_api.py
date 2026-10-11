from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import jwt
import pytest
from sqlalchemy import select

from app.models import Feedback, User


async def test_database_unavailability_is_not_healthy(client, monkeypatch):
    from sqlalchemy.exc import SQLAlchemyError
    from sqlalchemy.ext.asyncio import AsyncSession

    async def unavailable(*args, **kwargs):
        raise SQLAlchemyError("Synthetic database outage")

    monkeypatch.setattr(AsyncSession, "execute", unavailable)
    response = await client.get("/health")
    assert response.status_code == 503
    assert "Synthetic database outage" not in response.text


async def test_current_database_role_controls_existing_token(client, admin_headers, editor_headers):
    editor = (await client.get("/api/v1/auth/me", headers=editor_headers)).json()
    path = "/api/v1/users/" + editor["id"]
    assert (
        await client.patch(path, headers=admin_headers, json={"role": "ADMIN"})
    ).status_code == 200
    assert (await client.get("/api/v1/users", headers=editor_headers)).status_code == 200
    assert (
        await client.patch(path, headers=admin_headers, json={"role": "EDITOR"})
    ).status_code == 200
    assert (await client.get("/api/v1/users", headers=editor_headers)).status_code == 403


@pytest.mark.parametrize("path", ["/health", "/api/v1/health", "/docs", "/openapi.json"])
async def test_health_and_documentation(client, path):
    response = await client.get(path)
    assert response.status_code == 200
    if "health" in path:
        assert response.json() == {"status": "ok"}


async def test_login_me_and_refresh(client):
    response = await client.post(
        "/api/v1/auth/login", json={"email": "ADMIN@example.com", "password": "Admin-test-password"}
    )
    assert response.status_code == 200
    tokens = response.json()
    assert tokens["token_type"] == "bearer"
    headers = {"Authorization": "Bearer " + tokens["access_token"]}
    me = await client.get("/api/v1/auth/me", headers=headers)
    assert me.json()["email"] == "admin@example.com"
    assert "password_hash" not in me.json()
    refresh = await client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert refresh.status_code == 200
    assert refresh.json()["refresh_token"] != tokens["refresh_token"]


@pytest.mark.parametrize("email", ["admin@example.com", "missing@example.com"])
async def test_wrong_credentials(client, email):
    response = await client.post("/api/v1/auth/login", json={"email": email, "password": "wrong"})
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == "Bearer"


@pytest.mark.parametrize("path", ["/api/v1/auth/me", "/api/v1/users", "/api/v1/feedback"])
async def test_anonymous_protected_access(client, path):
    assert (await client.get(path)).status_code == 401


async def test_token_types_cannot_be_swapped(client):
    tokens = (
        await client.post(
            "/api/v1/auth/login",
            json={"email": "editor@example.com", "password": "Editor-test-password"},
        )
    ).json()
    assert (
        await client.get(
            "/api/v1/auth/me", headers={"Authorization": "Bearer " + tokens["refresh_token"]}
        )
    ).status_code == 401
    assert (
        await client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["access_token"]})
    ).status_code == 401


async def test_expired_and_tampered_tokens(client, settings):
    expired = jwt.encode(
        {
            "sub": str(uuid4()),
            "type": "access",
            "iat": datetime.now(UTC) - timedelta(hours=2),
            "exp": datetime.now(UTC) - timedelta(hours=1),
            "jti": str(uuid4()),
            "iss": "student-council-api",
        },
        settings.jwt_secret_key.get_secret_value(),
        algorithm="HS256",
    )
    for token in (expired, "invalid.token.signature"):
        assert (
            await client.get("/api/v1/auth/me", headers={"Authorization": "Bearer " + token})
        ).status_code == 401


async def test_rbac_user_management(client, admin_headers, editor_headers):
    assert (await client.get("/api/v1/users", headers=editor_headers)).status_code == 403
    assert (
        await client.post(
            "/api/v1/users",
            headers=editor_headers,
            json={"email": "new@example.com", "password": "Strong-test-password", "role": "ADMIN"},
        )
    ).status_code == 403
    response = await client.get("/api/v1/users", headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert all("password_hash" not in user for user in response.json())


async def test_user_crud_duplicates_and_password_hash(client, admin_headers, database):
    payload = {"email": "new@example.com", "password": "Strong-test-password", "role": "EDITOR"}
    created = await client.post("/api/v1/users", headers=admin_headers, json=payload)
    assert created.status_code == 201
    record_id = created.json()["id"]
    assert (
        await client.post("/api/v1/users", headers=admin_headers, json=payload)
    ).status_code == 409
    async with database() as session:
        user = await session.scalar(select(User).where(User.email == "new@example.com"))
        assert user.password_hash.startswith("$argon2")
        assert payload["password"] not in user.password_hash
    assert (
        await client.patch(
            f"/api/v1/users/{record_id}", headers=admin_headers, json={"role": "ADMIN"}
        )
    ).json()["role"] == "ADMIN"
    assert (
        await client.delete(f"/api/v1/users/{record_id}", headers=admin_headers)
    ).status_code == 204


async def test_inactive_user_loses_access_and_refresh(client, admin_headers):
    tokens = (
        await client.post(
            "/api/v1/auth/login",
            json={"email": "editor@example.com", "password": "Editor-test-password"},
        )
    ).json()
    user = (
        await client.get(
            "/api/v1/auth/me", headers={"Authorization": "Bearer " + tokens["access_token"]}
        )
    ).json()
    assert (
        await client.patch(
            f"/api/v1/users/{user['id']}", headers=admin_headers, json={"is_active": False}
        )
    ).status_code == 200
    assert (
        await client.get(
            "/api/v1/auth/me", headers={"Authorization": "Bearer " + tokens["access_token"]}
        )
    ).status_code == 401
    assert (
        await client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    ).status_code == 401


async def test_last_active_admin_is_preserved(client, admin_headers):
    admin = (await client.get("/api/v1/auth/me", headers=admin_headers)).json()
    assert (
        await client.patch(
            f"/api/v1/users/{admin['id']}", headers=admin_headers, json={"role": "EDITOR"}
        )
    ).status_code == 409
    assert (
        await client.delete(f"/api/v1/users/{admin['id']}", headers=admin_headers)
    ).status_code == 409


async def test_private_feedback_workflow(client, editor_headers, database):
    response = await client.post(
        "/api/v1/feedback",
        json={
            "category": "IDEA",
            "name": "Test sender",
            "contact": "private@example.com",
            "message": "A deterministic synthetic test idea.",
        },
    )
    assert response.status_code == 201
    assert set(response.json()) == {"id", "status"}
    record_id = response.json()["id"]
    assert (await client.get(f"/api/v1/feedback/{record_id}")).status_code == 401
    assert (await client.get("/api/v1/feedback")).status_code == 401
    listing = await client.get("/api/v1/feedback", headers=editor_headers)
    assert listing.status_code == 200
    assert listing.json()[0]["contact"] == "private@example.com"
    updated = await client.patch(
        f"/api/v1/feedback/{record_id}", headers=editor_headers, json={"status": "IN_REVIEW"}
    )
    assert updated.json()["status"] == "IN_REVIEW"
    async with database() as session:
        feedback = await session.get(Feedback, UUID(record_id))
        assert feedback is not None


@pytest.mark.parametrize(
    "payload",
    [
        {"category": "OTHER", "message": "short"},
        {"category": "INVALID", "message": "Enough length to test category."},
        {"category": "IDEA", "message": " " * 20},
        {"category": "IDEA", "message": "x" * 5001},
        {"category": "IDEA", "message": "A valid message.", "status": "RESOLVED"},
    ],
)
async def test_feedback_validation(client, payload):
    assert (await client.post("/api/v1/feedback", json=payload)).status_code == 422


@pytest.mark.parametrize(
    "resource,payload,key",
    [
        (
            "news",
            {"title": "Test news", "slug": "test-news", "content": "Synthetic news."},
            "test-news",
        ),
        (
            "projects",
            {"title": "Test project", "slug": "test-project", "description": "Synthetic project."},
            "test-project",
        ),
        (
            "events",
            {
                "title": "Test event",
                "description": "Synthetic event.",
                "location": "Test room",
                "starts_at": "2030-01-01T10:00:00Z",
            },
            None,
        ),
    ],
)
async def test_content_crud_and_draft_visibility(client, editor_headers, resource, payload, key):
    base = "/api/v1/" + resource
    assert (await client.get(base)).json() == []
    assert (await client.post(base, json=payload)).status_code == 401
    created = await client.post(base, json=payload, headers=editor_headers)
    assert created.status_code == 201
    record_id = created.json()["id"]
    public_key = key or record_id
    assert (await client.get(base)).json() == []
    assert (await client.get(f"{base}/{public_key}")).status_code == 404
    assert (
        await client.patch(
            f"{base}/{record_id}", headers=editor_headers, json={"is_published": True}
        )
    ).status_code == 200
    assert len((await client.get(base)).json()) == 1
    assert (await client.get(f"{base}/{public_key}")).status_code == 200
    assert (await client.delete(f"{base}/{record_id}", headers=editor_headers)).status_code == 204
    assert (await client.get(base)).json() == []


async def test_slug_conflict_pagination_and_nullable_patch(client, editor_headers):
    base = "/api/v1/projects"
    payload = {
        "title": "Synthetic",
        "slug": "synthetic",
        "description": "Synthetic description.",
        "is_published": True,
        "url": "https://example.com/",
    }
    created = await client.post(base, headers=editor_headers, json=payload)
    assert created.status_code == 201
    assert (await client.post(base, headers=editor_headers, json=payload)).status_code == 409
    assert (await client.get(base + "?limit=1&offset=1")).json() == []
    for query in ("limit=101", "limit=0", "offset=-1"):
        assert (await client.get(base + "?" + query)).status_code == 422
    record_id = created.json()["id"]
    assert (
        await client.patch(f"{base}/{record_id}", headers=editor_headers, json={"title": None})
    ).status_code == 422
    assert (
        await client.patch(f"{base}/{record_id}", headers=editor_headers, json={"url": None})
    ).json()["url"] is None


async def test_invalid_event_window(client, editor_headers):
    response = await client.post(
        "/api/v1/events",
        headers=editor_headers,
        json={
            "title": "Invalid window",
            "description": "Synthetic event.",
            "location": "Test room",
            "starts_at": "2030-01-02T10:00:00Z",
            "ends_at": "2030-01-01T10:00:00Z",
        },
    )
    assert response.status_code == 422


async def test_cors_and_validation_privacy(client):
    response = await client.options(
        "/api/v1/feedback",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert "access-control-allow-credentials" not in response.headers
    response = await client.options(
        "/api/v1/feedback",
        headers={
            "Origin": "https://unapproved.example",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert "access-control-allow-origin" not in response.headers
    secret = "test-secret-that-must-not-be-echoed"
    response = await client.post(
        "/api/v1/auth/login", json={"email": "invalid", "password": secret}
    )
    assert response.status_code == 422
    assert secret not in response.text
