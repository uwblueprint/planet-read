from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db


class File(db.Model):
    __tablename__ = "files"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    path = db.Column(db.String(255), nullable=False)

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
