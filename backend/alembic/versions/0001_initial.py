"""Initial users, feedback, news, events and projects.

Revision ID: 0001
Revises: none
"""

import sqlalchemy as sa

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def record_columns() -> list[sa.Column]:
    return [
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    ]


def enum(*values: str, name: str) -> sa.Enum:
    return sa.Enum(*values, name=name, native_enum=False, create_constraint=True)


def upgrade() -> None:
    op.create_table(
        "users",
        *record_columns(),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("password_hash", sa.String(512), nullable=False),
        sa.Column("role", enum("ADMIN", "EDITOR", name="user_role"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_users"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table(
        "feedback",
        *record_columns(),
        sa.Column(
            "category",
            enum("IDEA", "PROBLEM", "EVENT", "CLUB", "ACADEMIC", "OTHER", name="feedback_category"),
            nullable=False,
        ),
        sa.Column("name", sa.String(120), nullable=True),
        sa.Column("contact", sa.String(254), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column(
            "status",
            enum("NEW", "IN_REVIEW", "RESOLVED", "REJECTED", name="feedback_status"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_feedback"),
    )
    op.create_table(
        "news",
        *record_columns(),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(160), nullable=False),
        sa.Column("summary", sa.String(1000), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id", name="pk_news"),
    )
    op.create_index("ix_news_slug", "news", ["slug"], unique=True)
    op.create_index("ix_news_is_published", "news", ["is_published"])
    op.create_table(
        "events",
        *record_columns(),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("location", sa.String(300), nullable=False),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("registration_url", sa.String(2048), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_events"),
    )
    op.create_index("ix_events_is_published", "events", ["is_published"])
    op.create_table(
        "projects",
        *record_columns(),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(160), nullable=False),
        sa.Column("summary", sa.String(1000), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("url", sa.String(2048), nullable=True),
        sa.Column(
            "status",
            enum("ACTIVE", "IN_DEVELOPMENT", "COMPLETED", "ARCHIVED", name="project_status"),
            nullable=False,
        ),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_projects"),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)
    op.create_index("ix_projects_is_published", "projects", ["is_published"])


def downgrade() -> None:
    for table in ("projects", "events", "news", "feedback", "users"):
        op.drop_table(table)
