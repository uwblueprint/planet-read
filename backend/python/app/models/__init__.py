import os

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate(compare_type=True)
erase_db_and_sync = False


def init_app(app):
    from .comment import Comment
    from .comment_all import CommentAll
    from .file import File
    from .language import Language
    from .story import Story
    from .story_all import StoryAll
    from .story_content import StoryContent
    from .story_content_all import StoryContentAll
    from .story_translation import StoryTranslation
    from .story_translation_all import StoryTranslationAll
    from .story_translation_content import StoryTranslationContent
    from .story_translation_content_all import StoryTranslationContentAll
    from .user import User
    from .user_all import UserAll

    app.app_context().push()
    db.init_app(app)
    migrate.init_app(app, db)

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
