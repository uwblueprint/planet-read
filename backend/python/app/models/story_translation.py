from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_translation_content import StoryTranslationContent


class StoryTranslation(db.Model):
    __tablename__ = "story_translations"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id"), nullable=False)
    language = db.Column(db.String, nullable=False)  # TODO replace with Enum
    translator_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    translation_contents = db.relationship(StoryTranslationContent)

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
