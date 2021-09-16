"""differentiate approved languages translation and review

Revision ID: e59c40e297d1
Revises: c29196f789b5
Create Date: 2021-09-11 20:04:28.013850

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "e59c40e297d1"
down_revision = "c29196f789b5"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "users",
        "approved_languages",
        existing_type=sa.JSON(),
        new_column_name="approved_languages_translation",
    )
    op.add_column(
        "users", sa.Column("approved_languages_review", sa.JSON(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "approved_languages_review")
    op.alter_column(
        "users",
        "approved_languages_translation",
        existing_type=sa.JSON(),
        new_column_name="approved_languages",
    )
    # ### end Alembic commands ###