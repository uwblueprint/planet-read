from sqlalchemy import Boolean, inspect
from sqlalchemy.dialects.mysql import TEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_translation_content_all import StoryTranslationContentAll

stages_enum = db.Enum("TRANSLATE", "REVIEW", "PUBLISH", name="stages")


class StoryTranslationAll(db.Model):

    __tablename__ = "story_translations_all"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    language = db.Column(TEXT, nullable=False)
    stage = db.Column(stages_enum, nullable=False)
    translator_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    translation_contents = db.relationship(StoryTranslationContentAll)
    is_deleted = db.Column(Boolean, default=False, nullable=False)

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
