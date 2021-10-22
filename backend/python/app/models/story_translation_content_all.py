from sqlalchemy import Boolean, Enum, inspect
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_translation_content_status import StoryTranslationContentStatus


class StoryTranslationContentAll(db.Model):
    __tablename__ = "story_translation_contents_all"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_translation_id = db.Column(
        db.Integer,
        db.ForeignKey("story_translations_all.id"),
        index=True,
        nullable=False,
    )
    line_index = db.Column(db.Integer, nullable=False)
    status = db.Column(
        Enum(StoryTranslationContentStatus),
        server_default=StoryTranslationContentStatus.DEFAULT.value,
        nullable=False,
    )
    translation_content = db.Column(LONGTEXT, nullable=False)
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
