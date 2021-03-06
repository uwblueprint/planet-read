from sqlalchemy import Boolean, inspect
from sqlalchemy.dialects.mysql import TEXT
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class Language(db.Model):
    __tablename__ = "languages"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    language = db.Column(TEXT, nullable=False)
    is_rtl = db.Column(Boolean, default=False)

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
