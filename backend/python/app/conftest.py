import os

import pytest
from graphene.test import Client
from sqlalchemy.engine import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from . import create_app

# https://github.com/apryor6/flask_testing_examples/tree/master/fte

my_app = None


@pytest.fixture(scope="session")
def app():
    """
    Returns app configured for testing
    """
    global my_app
    if my_app is None:
        my_app = create_app("testing")
    return my_app


@pytest.fixture(scope="function")
def db(app):
    """
    Yields db instance
    """
    from .models import db
    from .models.comment_all import CommentAll
    from .models.story_all import StoryAll
    from .models.story_content_all import StoryContentAll
    from .models.story_translation_all import StoryTranslationAll
    from .models.story_translation_content_all import StoryTranslationContentAll
    from .models.user_all import UserAll

    yield db

    db.session.query(CommentAll).delete()
    db.session.commit()
    db.session.query(StoryTranslationContentAll).delete()
    db.session.commit()
    db.session.query(StoryContentAll).delete()
    db.session.commit()
    db.session.query(StoryTranslationAll).delete()
    db.session.commit()
    db.session.query(StoryAll).delete()
    db.session.commit()
    db.session.query(UserAll).delete()
    db.session.commit()
    db.session.close()


@pytest.fixture(scope="session")
def services(app):
    """
    Returns model services
    """
    from .services.implementations.comment_service import CommentService
    from .services.implementations.story_service import StoryService
    from .services.implementations.user_service import UserService

    return {
        "comment": CommentService(),
        "story": StoryService(),
        "user": UserService(),
    }


@pytest.fixture(scope="session")
def client(app):
    """
    Returns graphene client for test query/mutation
    """
    from .graphql.schema import schema

    return Client(schema)
