from sqlalchemy import inspect, select
from sqlalchemy.dialects.mysql import TEXT
from sqlalchemy.orm.properties import ColumnProperty
from sqlalchemy_utils import create_view

from . import db
from .file import File  # unused import required for foreign key
from .user_all import UserAll

query = select([UserAll]).where(UserAll.is_deleted == False)
users_active = create_view("users", query, db.Model.metadata)


class User(db.Model):
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.is_deleted = False

    __table__ = users_active

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
