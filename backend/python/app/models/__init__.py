import os

from flask_sqlalchemy import SQLAlchemy

from .insert_test_data import insert_test_data

db = SQLAlchemy()
erase_db_and_sync = os.getenv("ERASE_DB_AND_SYNC", "False") == "True"


def init_app(app):
    from .comment import Comment
    from .file import File
    from .story import Story
    from .story_content import StoryContent
    from .story_translation import StoryTranslation
    from .story_translation_content import StoryTranslationContent
    from .user import User

    app.app_context().push()
    db.init_app(app)

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
        insert_test_data(db)
