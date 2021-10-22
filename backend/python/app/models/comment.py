from . import db

from sqlalchemy import select, inspect
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from .comment_all import CommentAll

stmt = select([CommentAll]).where(CommentAll.is_deleted == False)
comments_active = create_view("comments", stmt, db.Model.metadata)


class Comment(db.Model):
    __table__ = comments_active

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
