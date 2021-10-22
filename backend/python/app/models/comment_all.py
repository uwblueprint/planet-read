from sqlalchemy import Boolean, inspect
from sqlalchemy.dialects.mysql import DATETIME, LONGTEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_translation_content_all import StoryTranslationContentAll


class CommentAll(db.Model):

    __tablename__ = "comments_all"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_translation_content_id = db.Column(
        db.Integer,
        db.ForeignKey("story_translation_contents_all.id"),
        index=True,
        nullable=False,
    )
    story_translation_content = db.relationship(StoryTranslationContentAll)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    comment_index = db.Column(db.Integer, nullable=False)
    time = db.Column(DATETIME, nullable=False)
    resolved = db.Column(db.Boolean, nullable=False)
    content = db.Column(LONGTEXT, nullable=False)
    is_deleted = db.Column(Boolean, default=0, nullable=False)

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
