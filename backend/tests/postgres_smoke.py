"""Explicit opt-in HTTP/database smoke test for a fresh isolated Compose database.

Not a pytest test: run inside the backend container with its API already running.
Refuses nonempty databases and leaves no synthetic records on a successful run.
"""

import asyncio
import json
import os
import subprocess
import sys
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from uuid import UUID

from sqlalchemy import delete, func, select

from app.core.config import get_settings
from app.db.session import session_factory
from app.models import Event, Feedback, News, Project, User

MODELS = (User, Feedback, News, Event, Project)
API_URL = os.environ.get("SMOKE_API_URL", "http://backend:8000")


async def assert_empty() -> None:
    engine, sessions = session_factory(get_settings())
    try:
        async with sessions() as session:
            for model in MODELS:
                count = await session.scalar(select(func.count()).select_from(model))
                if count:
                    raise RuntimeError("Smoke tests require an empty isolated database")
    finally:
        await engine.dispose()


def request(method: str, path: str, expected: int, data=None, token: str | None = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    payload = json.dumps(data).encode() if data is not None else None
    req = Request(API_URL + path, data=payload, headers=headers, method=method)
    try:
        response = urlopen(req, timeout=15)
    except HTTPError as exc:
        response = exc
    with response:
        if response.status != expected:
            raise AssertionError(f"{method} {path}: expected {expected}, got {response.status}")
        body = response.read()
        return json.loads(body) if body else None


async def remove_fixture(model, record_id: str) -> None:
    engine, sessions = session_factory(get_settings())
    try:
        async with sessions() as session:
            await session.execute(delete(model).where(model.id == UUID(record_id)))
            await session.commit()
    finally:
        await engine.dispose()


def main() -> None:
    if os.environ.get("SMOKE_ISOLATED_DATABASE") != "1":
        raise RuntimeError("Set SMOKE_ISOLATED_DATABASE=1 only for disposable QA databases")
    asyncio.run(assert_empty())
    bootstrap_env = dict(
        os.environ,
        FIRST_ADMIN_EMAIL="smoke-admin@example.com",
        FIRST_ADMIN_PASSWORD="Synthetic-admin-password",
    )
    subprocess.run([sys.executable, "-m", "app.db.init_db"], env=bootstrap_env, check=True)
    bootstrap_env["FIRST_ADMIN_PASSWORD"] = "Changed-password-must-not-apply"
    subprocess.run([sys.executable, "-m", "app.db.init_db"], env=bootstrap_env, check=True)
    tokens = request(
        "POST",
        "/api/v1/auth/login",
        200,
        {"email": "smoke-admin@example.com", "password": "Synthetic-admin-password"},
    )
    admin = tokens["access_token"]
    admin_id = request("GET", "/api/v1/auth/me", 200, token=admin)["id"]
    request("POST", "/api/v1/auth/refresh", 200, {"refresh_token": tokens["refresh_token"]})
    request("GET", "/api/v1/auth/me", 401, token=tokens["refresh_token"])
    editor_record = request(
        "POST",
        "/api/v1/users",
        201,
        {"email": "smoke-editor@example.com", "password": "Synthetic-editor-password"},
        admin,
    )
    editor_tokens = request(
        "POST",
        "/api/v1/auth/login",
        200,
        {"email": "smoke-editor@example.com", "password": "Synthetic-editor-password"},
    )
    editor = editor_tokens["access_token"]
    request("GET", "/api/v1/users", 403, token=editor)
    request("GET", "/api/v1/users", 200, token=admin)
    fixtures = (
        ("news", {"title": "Synthetic QA", "slug": "synthetic-qa", "content": "QA only."}),
        (
            "projects",
            {
                "title": "Synthetic QA",
                "slug": "synthetic-qa",
                "description": "QA only.",
                "url": "https://example.com/",
            },
        ),
        (
            "events",
            {
                "title": "Synthetic QA",
                "description": "QA only.",
                "location": "QA",
                "starts_at": "2030-01-01T10:00:00+05:00",
                "ends_at": "2030-01-01T11:00:00+05:00",
            },
        ),
    )
    for resource, payload in fixtures:
        path = "/api/v1/" + resource
        item = request("POST", path, 201, payload, editor)
        item_id = item["id"]
        public_key = item.get("slug", item_id)
        assert request("GET", path, 200) == []
        request("GET", path + "/" + public_key, 404)
        request("PATCH", path + "/" + item_id, 200, {"is_published": True}, editor)
        assert len(request("GET", path + "?limit=1&offset=0", 200)) == 1
        request("GET", path + "/" + public_key, 200)
        if "slug" in payload:
            request("POST", path, 409, payload, editor)
        request("DELETE", path + "/" + item_id, 204, token=editor)
    feedback = request(
        "POST",
        "/api/v1/feedback",
        201,
        {"category": "OTHER", "message": "Synthetic smoke feedback only."},
    )
    assert set(feedback) == {"id", "status"}
    request("GET", "/api/v1/feedback", 401)
    request("GET", "/api/v1/feedback", 200, token=editor)
    request("PATCH", "/api/v1/feedback/" + feedback["id"], 200, {"status": "RESOLVED"}, editor)
    request("PATCH", "/api/v1/users/" + editor_record["id"], 200, {"is_active": False}, admin)
    request("GET", "/api/v1/auth/me", 401, token=editor)
    request("POST", "/api/v1/auth/refresh", 401, {"refresh_token": editor_tokens["refresh_token"]})
    request("DELETE", "/api/v1/users/" + editor_record["id"], 204, token=admin)
    asyncio.run(remove_fixture(Feedback, feedback["id"]))
    asyncio.run(remove_fixture(User, admin_id))
    asyncio.run(assert_empty())
    print("PASS: PostgreSQL bootstrap, auth, RBAC, feedback, content CRUD; fixtures removed")


if __name__ == "__main__":
    main()
