from uuid import uuid4

import pytest

BASE = "/api/v1/documents"


def payload(slug="test-document", **changes):
    return {
        "title": "Isolated test document",
        "slug": slug,
        "summary": "Synthetic metadata used only by isolated tests.",
        "category": "APPLICATION",
        **changes,
    }


@pytest.mark.parametrize("role", ["admin", "editor"])
async def test_documents_rbac_and_publication(client, admin_headers, editor_headers, role):
    headers = admin_headers if role == "admin" else editor_headers
    assert (await client.get(BASE)).json() == []
    created = await client.post(BASE, headers=headers, json=payload())
    assert created.status_code == 201
    document = created.json()
    assert document["is_published"] is False
    assert document["template_url"] is None
    assert document["created_at"] and document["updated_at"]
    assert (await client.get(BASE)).json() == []
    assert (await client.get(BASE + "/test-document")).status_code == 404
    updated = await client.patch(
        BASE + "/" + document["id"],
        headers=headers,
        json={"is_published": True, "short_title": "Test", "sort_order": 2},
    )
    assert updated.status_code == 200
    assert updated.json()["sort_order"] == 2
    public = await client.get(BASE + "/test-document")
    assert public.status_code == 200
    assert public.json()["short_title"] == "Test"
    assert len((await client.get(BASE)).json()) == 1
    assert (
        await client.patch(
            BASE + "/" + document["id"], headers=headers, json={"is_published": False}
        )
    ).status_code == 200
    assert (await client.get(BASE + "/test-document")).status_code == 404
    assert (await client.get(BASE)).json() == []
    assert (await client.delete(BASE + "/" + document["id"], headers=headers)).status_code == 204
    assert (await client.delete(BASE + "/" + document["id"], headers=headers)).status_code == 404


async def test_anonymous_document_writes_are_rejected(client):
    assert (await client.post(BASE, json=payload())).status_code == 401
    record = str(uuid4())
    assert (await client.patch(BASE + "/" + record, json={"title": "Test"})).status_code == 401
    assert (await client.delete(BASE + "/" + record)).status_code == 401


async def test_ordering_pagination_and_hidden_records(client, editor_headers):
    for slug, order, published in [
        ("z-last", 2, True),
        ("b-tied", 0, True),
        ("a-tied", 0, True),
        ("hidden", 0, False),
    ]:
        assert (
            await client.post(
                BASE,
                headers=editor_headers,
                json=payload(slug, sort_order=order, is_published=published),
            )
        ).status_code == 201
    listed = (await client.get(BASE)).json()
    assert [document["slug"] for document in listed] == ["a-tied", "b-tied", "z-last"]
    assert [
        document["slug"] for document in (await client.get(BASE + "?limit=1&offset=1")).json()
    ] == ["b-tied"]
    assert (await client.get(BASE + "/hidden")).status_code == 404
    for query in ("limit=0", "limit=101", "offset=-1"):
        assert (await client.get(BASE + "?" + query)).status_code == 422


async def test_slug_conflicts_and_nullable_patch(client, editor_headers):
    first = await client.post(BASE, headers=editor_headers, json=payload())
    assert (await client.post(BASE, headers=editor_headers, json=payload())).status_code == 409
    second = await client.post(
        BASE, headers=editor_headers, json=payload("second-document", is_published=True)
    )
    record = second.json()["id"]
    assert (
        await client.patch(
            BASE + "/" + record, headers=editor_headers, json={"slug": first.json()["slug"]}
        )
    ).status_code == 409
    for field in ("title", "summary", "slug", "category", "sort_order", "is_published"):
        assert (
            await client.patch(BASE + "/" + record, headers=editor_headers, json={field: None})
        ).status_code == 422
    attached = await client.patch(
        BASE + "/" + record,
        headers=editor_headers,
        json={"template_url": "/documents/templates/test.docx", "short_title": "Test"},
    )
    assert attached.status_code == 200
    detached = await client.patch(
        BASE + "/" + record,
        headers=editor_headers,
        json={"template_url": None, "short_title": None},
    )
    assert detached.status_code == 200
    assert detached.json()["template_url"] is None and detached.json()["short_title"] is None
    assert (await client.get(BASE + "/missing-slug")).status_code == 404
    assert (
        await client.patch(
            BASE + "/" + str(uuid4()), headers=editor_headers, json={"title": "Test"}
        )
    ).status_code == 404


@pytest.mark.parametrize(
    "changes",
    [
        {"title": " "},
        {"slug": "Bad Slug"},
        {"slug": "x" * 161},
        {"summary": "x" * 1001},
        {"short_title": "x" * 201},
        {"category": "INVALID"},
        {"sort_order": -1},
        {"sort_order": 1.5},
        {"sort_order": True},
        {"sort_order": 2147483648},
        {"unrecognized": "not allowed"},
        {"template_url": "javascript:alert(1)"},
        {"template_url": "http://example.com/file.docx"},
        {"template_url": "https://user:password@example.com/file.docx"},
        {"template_url": "/documents/templates/../private.docx"},
        {"template_url": "/documents/templates/%2e%2e/private.docx"},
        {"template_url": "/documents/templates/%252e%252e/private.docx"},
        {"template_url": "//example.com/file.docx"},
        {"template_url": "/other/file.docx"},
        {"template_url": "/documents/templates/file.pdf"},
    ],
)
async def test_document_validation(client, editor_headers, changes):
    assert (
        await client.post(BASE, headers=editor_headers, json=payload(**changes))
    ).status_code == 422


async def test_external_https_template_url(client, editor_headers):
    response = await client.post(
        BASE, headers=editor_headers, json=payload(template_url="https://example.com/approved.docx")
    )
    assert response.status_code == 201
    assert response.json()["template_url"] == "https://example.com/approved.docx"
