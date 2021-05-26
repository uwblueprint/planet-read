from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db

stages_enum = db.Enum("START", "TRANSLATE", "REVIEW", "PUBLISH", name="stages" )

class Story(db.Model):
    __tablename__ = "stories"
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    stage = db.Column(stages_enum, nullable=False)
