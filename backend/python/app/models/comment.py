from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy.dialects.mysql import LONGTEXT

from . import db


class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_translation_content_id = db.Column(
        db.Integer,
        db.ForeignKey("story_translation_contents.id"),
        index=True,
        nullable=False,
    )

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    comment_index = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Integer, nullable=False)
    resolved = db.Column(db.Boolean, nullable=False)
    content = db.Column(LONGTEXT, nullable=False)

    def to_dict(self, include_relationships=False):
        cls = type(self)
        mapper = inspect(cls)
        formatted = {}
        for column in mapper.attrs:
            field = column.key
            attr = getattr(self, field)
            if isinstance(column, ColumnProperty):
                formatted[field] = attr
            elif include_relationships:
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted
