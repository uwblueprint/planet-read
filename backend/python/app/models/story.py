from datetime import datetime

from sqlalchemy import inspect, select
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from . import db
from .story_all import StoryAll

stmt = select([StoryAll]).where(StoryAll.is_deleted == False)
stories_active = create_view("stories", stmt, db.Model.metadata)


class Story(db.Model):
    def __init__(self, **kwargs):
        super(Story, self).__init__(**kwargs)
        self.is_deleted = False
        if self.is_test is None:
            self.is_test = False
        if self.date_uploaded is None:
            self.date_uploaded = datetime.utcnow()

    __table__ = stories_active

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
