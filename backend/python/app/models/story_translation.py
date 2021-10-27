from sqlalchemy import inspect, select
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from . import db
from .story_translation_all import StoryTranslationAll
from .user import User  # unused import required for foreign key

stmt = select([StoryTranslationAll]).where(StoryTranslationAll.is_deleted == False)
story_translations_active = create_view("story_translations", stmt, db.Model.metadata)


class StoryTranslation(db.Model):
    def __init__(self, **kwargs):
        super(StoryTranslation, self).__init__(**kwargs)
        self.is_deleted = False

    __table__ = story_translations_active

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
