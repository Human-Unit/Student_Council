"""Document metadata, without content seeding or binary file storage.

Revision ID: 0002
Revises: 0001
"""

import sqlalchemy as sa

from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "documents",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("short_title", sa.String(200), nullable=True),
        sa.Column("slug", sa.String(160), nullable=False),
        sa.Column("summary", sa.String(1000), nullable=False),
        sa.Column(
            "category",
            sa.Enum(
                "EXPLANATION",
                "APPLICATION",
                "CERTIFICATE",
                "OTHER",
                name="document_category",
                native_enum=False,
                create_constraint=True,
            ),
            nullable=False,
        ),
        sa.Column("template_url", sa.String(2048), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.CheckConstraint("sort_order >= 0", name=op.f("ck_documents_nonnegative_sort_order")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_documents")),
    )
    op.create_index("ix_documents_slug", "documents", ["slug"], unique=True)
    op.create_index(
        "ix_documents_public_order", "documents", ["is_published", "sort_order", "slug"]
    )


def downgrade() -> None:
    op.drop_index("ix_documents_public_order", table_name="documents")
    op.drop_index("ix_documents_slug", table_name="documents")
    op.drop_table("documents")
