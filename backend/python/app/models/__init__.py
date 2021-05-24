from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
erase_db_and_sync = False


def init_app(app):
    from .entity import Entity
    from .user import User
    from .story import Story

    app.app_context().push()
    db.init_app(app)

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
