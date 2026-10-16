import os
import sqlite3
import subprocess
import sys
from pathlib import Path


def test_documents_migration_round_trip_in_isolated_sqlite(tmp_path):
    backend = Path(__file__).resolve().parents[1]
    database = tmp_path / "migration-only.sqlite"
    environment = {
        **os.environ,
        "APP_ENV": "test",
        "DATABASE_URL": "sqlite+aiosqlite:///" + database.as_posix(),
        "JWT_SECRET_KEY": "isolated-migration-test-only-key",
        "PYTHONPATH": str(backend),
    }

    def alembic(*arguments, env=environment):
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "-c", str(backend / "alembic.ini"), *arguments],
            cwd=tmp_path,
            env=env,
            text=True,
            capture_output=True,
            timeout=60,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        return result.stdout + result.stderr

    alembic("upgrade", "head")
    alembic("upgrade", "head")
    assert "0002 (head)" in alembic("current")
    assert "No new upgrade operations detected" in alembic("check")
    with sqlite3.connect(database) as connection:
        assert connection.execute("SELECT count(*) FROM documents").fetchone()[0] == 0
        indexes = {row[1] for row in connection.execute("PRAGMA index_list('documents')")}
        assert {"ix_documents_slug", "ix_documents_public_order"} <= indexes
    # This target is a newly created pytest-local file, never a real database.
    alembic("downgrade", "0001")
    with sqlite3.connect(database) as connection:
        assert not connection.execute(
            "SELECT name FROM sqlite_master WHERE name='documents'"
        ).fetchall()
        assert connection.execute("SELECT version_num FROM alembic_version").fetchone()[0] == "0001"
    alembic("upgrade", "head")
    assert "0002 (head)" in alembic("current")
    sql = alembic(
        "upgrade",
        "head",
        "--sql",
        env={
            **environment,
            "DATABASE_URL": "postgresql+asyncpg://test:test@localhost/isolated_test",
        },
    )
    assert "CREATE TABLE documents" in sql
    assert "CREATE INDEX ix_documents_public_order" in sql
    assert "ck_documents_document_category" in sql
