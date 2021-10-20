from . import db
from sqlalchemy_utils import create_view
from sqlalchemy import select, inspect
from sqlalchemy.orm.properties import ColumnProperty

from .story_translation import StoryTranslation

# from sqlalchemy.ext.declarative import declarative_base


# Base = declarative_base(metadata=db.metadata)

stmt = select([StoryTranslation]).where(StoryTranslation.is_deleted == False)
story_translations_active = create_view(
    "story_translations_active", stmt, db.Model.metadata
)


class StoryTranslationView(db.Model):
    # print(db.Model.metadata.tables)
    __table__ = story_translations_active
    # __tablename__ = "story_translations_active"
    # __table_args__ = (
    #     db.PrimaryKeyConstraint("id"),
    #     db.ForeignKeyConstraint(["story_id"], ["stories.id"]),
    # {"autoload": True},
    # {"autoload_with": db.engine}
    # )
    # __table__ = db.Table(
    #     "story_translations_active",
    #     Base.metadata,
    #     autoload=True,
    #     # autoload_with=db.engine,
    # )
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
