from datetime import datetime

from sqlalchemy import Boolean, DateTime, inspect
from sqlalchemy.dialects.mysql import LONGTEXT, TEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_content import StoryContent


class Story(db.Model):
    __tablename__ = "stories"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(TEXT, nullable=False)
    description = db.Column(LONGTEXT, nullable=False)
    youtube_link = db.Column(TEXT, nullable=False)
    level = db.Column(db.Integer, nullable=False)
    # Note: translated_languages should be an enum array, but postgres
    # has a weird relationship with enums and we're going to switch to
    # mysql anyways.
    translated_languages = db.Column(db.JSON)
    contents = db.relationship(StoryContent)
    is_test = db.Column(Boolean, default=False, nullable=False)
    date_uploaded = db.Column(DateTime, default=datetime.utcnow(), nullable=False)

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
