from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .story_content import StoryContent


class Story(db.Model):
    __tablename__ = "stories"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    youtube_link = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)
    # Note: translated_languages should be an enum array, but postgres
    # has a weird relationship with enums and we're going to switch to
    # mysql anyways.
    translated_languages = db.Column(db.ARRAY(db.String))
    contents = db.relationship(StoryContent)

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
