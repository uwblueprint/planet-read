from sqlalchemy import inspect, select
from sqlalchemy_utils import create_view

from . import db
from .story_content_all import StoryContentAll

stmt = select([StoryContentAll]).where(StoryContentAll.is_deleted == False)
story_contents_active = create_view("story_contents", stmt, db.Model.metadata)


class StoryContent(db.Model):
    def __init__(self, **kwargs):
        super(StoryContent, self).__init__(**kwargs)
        self.is_deleted = False

    __table__ = story_contents_active

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
