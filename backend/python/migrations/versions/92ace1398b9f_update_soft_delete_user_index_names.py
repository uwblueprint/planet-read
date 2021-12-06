"""update soft delete user index names

Revision ID: 92ace1398b9f
Revises: 08f4eaf160d3
Create Date: 2021-12-01 03:35:16.710285

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "92ace1398b9f"
down_revision = "08f4eaf160d3"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(
        op.f("ix_comments_all_story_translation_content_id"),
        "comments_all",
        ["story_translation_content_id"],
        unique=False,
    )
    op.drop_index("ix_comments_story_translation_content_id", table_name="comments_all")
    op.create_index(
        op.f("ix_story_translation_contents_all_story_translation_id"),
        "story_translation_contents_all",
        ["story_translation_id"],
        unique=False,
    )
    op.drop_index(
        "ix_story_translation_contents_story_translation_id",
        table_name="story_translation_contents_all",
    )
    op.create_index(
        op.f("ix_story_translations_all_reviewer_id"),
        "story_translations_all",
        ["reviewer_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_story_translations_all_translator_id"),
        "story_translations_all",
        ["translator_id"],
        unique=False,
    )
    op.drop_index(
        "ix_story_translations_reviewer_id", table_name="story_translations_all"
    )
    op.drop_index(
        "ix_story_translations_translator_id", table_name="story_translations_all"
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(
        "ix_story_translations_translator_id",
        "story_translations_all",
        ["translator_id"],
        unique=False,
    )
    op.create_index(
        "ix_story_translations_reviewer_id",
        "story_translations_all",
        ["reviewer_id"],
        unique=False,
    )
    op.drop_index(
        op.f("ix_story_translations_all_translator_id"),
        table_name="story_translations_all",
    )
    op.drop_index(
        op.f("ix_story_translations_all_reviewer_id"),
        table_name="story_translations_all",
    )
    op.create_index(
        "ix_story_translation_contents_story_translation_id",
        "story_translation_contents_all",
        ["story_translation_id"],
        unique=False,
    )
    op.drop_index(
        op.f("ix_story_translation_contents_all_story_translation_id"),
        table_name="story_translation_contents_all",
    )
    op.create_index(
        "ix_comments_story_translation_content_id",
        "comments_all",
        ["story_translation_content_id"],
        unique=False,
    )
    op.drop_index(
        op.f("ix_comments_all_story_translation_content_id"), table_name="comments_all"
    )
    # ### end Alembic commands ###
