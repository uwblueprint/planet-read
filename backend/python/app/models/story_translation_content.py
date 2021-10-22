from . import db

from sqlalchemy import select, inspect
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from .story_translation_content_all import StoryTranslationContentAll

stmt = select([StoryTranslationContentAll]).where(
    StoryTranslationContentAll.is_deleted == False
)
story_translation_contents_active = create_view(
    "story_translation_contents", stmt, db.Model.metadata
)


class StoryTranslationContent(db.Model):
    __table__ = story_translation_contents_active

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
