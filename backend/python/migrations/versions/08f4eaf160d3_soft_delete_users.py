"""soft delete users

Revision ID: 08f4eaf160d3
Revises: 1729015196af
Create Date: 2021-11-01 01:38:35.818282

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "08f4eaf160d3"
down_revision = "1729015196af"
branch_labels = None
depends_on = None


def upgrade():
    ### Update users
    op.add_column(
        "users",
        sa.Column("is_deleted", sa.Boolean(), default=False, nullable=False),
    )
    op.rename_table("users", "users_all")
    active_users_view = """
        CREATE VIEW users
        AS        
        SELECT * from users_all
        WHERE is_deleted=0;
    """
    op.execute(active_users_view)

    ### Update foreign key for story_translations
    op.drop_constraint(
        u"story_translations_all_ibfk_1", "story_translations_all", type_="foreignkey"
    )
    op.drop_constraint(
        u"story_translations_all_ibfk_2", "story_translations_all", type_="foreignkey"
    )
    op.create_foreign_key(
        u"story_translations_all_ibfk_1",
        "story_translations_all",
        "users_all",
        ["reviewer_id"],
        ["id"],
    )
    op.create_foreign_key(
        u"story_translations_all_ibfk_2",
        "story_translations_all",
        "users_all",
        ["translator_id"],
        ["id"],
    )

    ### Update foreign key for users
    op.drop_constraint(
        u"comments_all_ibfk_2",
        "comments_all",
        type_="foreignkey",
    )
    op.create_foreign_key(
        u"comments_all_ibfk_2",
        "comments_all",
        "users_all",
        ["user_id"],
        ["id"],
    )


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    ### foreign keys
    op.drop_constraint(
        u"comments_all_ibfk_2",
        "comments_all",
        type_="foreignkey",
    )
    op.create_foreign_key(
        u"comments_all_ibfk_2",
        "comments_all",
        "users",
        ["user_id"],
        ["id"],
    )

    op.drop_constraint(
        u"story_translations_all_ibfk_1", "story_translations_all", type_="foreignkey"
    )
    op.drop_constraint(
        u"story_translations_all_ibfk_2", "story_translations_all", type_="foreignkey"
    )
    op.create_foreign_key(
        u"story_translations_all_ibfk_1",
        "story_translations_all",
        "users",
        ["reviewer_id"],
        ["id"],
    )
    op.create_foreign_key(
        u"story_translations_all_ibfk_2",
        "story_translations_all",
        "users",
        ["translator_id"],
        ["id"],
    )
    op.execute("DROP VIEW users")
    op.rename_table("users_all", "users")
    op.drop_column("users", "is_deleted")
    # ### end Alembic commands ###