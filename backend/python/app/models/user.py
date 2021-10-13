from sqlalchemy import inspect
from sqlalchemy.dialects.mysql import TEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db

roles_enum = db.Enum("User", "Admin", name="roles")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(TEXT, nullable=False)
    last_name = db.Column(TEXT, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    auth_id = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(roles_enum)
    resume = db.Column(db.Integer, db.ForeignKey("files.id"))
    profile_pic = db.Column(db.Integer, db.ForeignKey("files.id"))
    # format for approved_languages_translation and approved_languages_review
    # should be language: highest approved level
    approved_languages_translation = db.Column(db.JSON)
    approved_languages_review = db.Column(db.JSON)

    def to_dict(self, include_relationships=False):
        # define the entities table
        cls = type(self)

        mapper = inspect(cls)
        formatted = {}
        for column in mapper.attrs:
            field = column.key
            attr = getattr(self, field)
            # if it's a regular column, extract the value
            if isinstance(column, ColumnProperty):
                formatted[field] = attr
            # otherwise, it's a relationship field
            # (currently not applicable, but may be useful for entity groups)
            elif include_relationships:
                # recursively format the relationship
                # don't format the relationship's relationships
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted
