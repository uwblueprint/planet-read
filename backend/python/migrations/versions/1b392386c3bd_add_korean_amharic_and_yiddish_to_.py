"""add Korean, Amharic and Yiddish to languages

Revision ID: 1b392386c3bd
Revises: 26b7c9ffcb2b
Create Date: 2022-04-02 17:06:51.489927

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "1b392386c3bd"
down_revision = "26b7c9ffcb2b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute("INSERT INTO languages (language, is_rtl) VALUES ('Korean', false);")
    op.execute("INSERT INTO languages (language, is_rtl) VALUES ('Amharic', false);")
    op.execute("INSERT INTO languages (language, is_rtl) VALUES ('Yiddish', true);")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute("DELETE FROM languages WHERE language = 'Korean';")
    op.execute("DELETE FROM languages WHERE language = 'Amharic';")
    op.execute("DELETE FROM languages WHERE language = 'Yiddish';")
    # ### end Alembic commands ###
