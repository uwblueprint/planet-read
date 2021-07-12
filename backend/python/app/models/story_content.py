from sqlalchemy import inspect
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class StoryContent(db.Model):
    __tablename__ = "story_contents"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    story_id = db.Column(
        db.Integer, db.ForeignKey("stories.id"), index=True, nullable=False
    )
    line_index = db.Column(db.Integer, nullable=False)
    content = db.Column(LONGTEXT, nullable=False)

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
