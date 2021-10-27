from sqlalchemy import inspect, select
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from . import db
from .comment_all import CommentAll
from .user import User  # unused import required for foreign key

stmt = select([CommentAll]).where(CommentAll.is_deleted == False)
comments_active = create_view("comments", stmt, db.Model.metadata)


class Comment(db.Model):
    def __init__(self, **kwargs):
        super(Comment, self).__init__(**kwargs)
        self.is_deleted = False

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
