import os

import pytest
from sqlalchemy.engine import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from graphene.test import Client

from . import create_app

# https://github.com/apryor6/flask_testing_examples/tree/master/fte

my_app = None


@pytest.fixture
def app():
    """
    Returns app configured for testing
    """
    global my_app
    if my_app is None:
        my_app = create_app("testing")
    return my_app


@pytest.fixture
def client(app):
    """
    Returns app test client
    """
    return app.test_client()


@pytest.fixture
def db(app):
    """
    Yields db instance
    """
    from .models import db

    from .models.comment import Comment
    from .models.entity import Entity
    from .models.file import File
    from .models.story import Story
    from .models.story_content import StoryContent
    from .models.story_translation import StoryTranslation
    from .models.story_translation_content import StoryTranslationContent
    from .models.user import User
    
    app.app_context().push()
    db.init_app(app)

    db.drop_all()
    db.create_all()

    yield db
    
    db.session.close()


@pytest.fixture
def services(app):
    """
    Returns model services
    """
    with app.app_context():
        from .services.implementations.comment_service import CommentService
        from .services.implementations.entity_service import EntityService
        from .services.implementations.story_service import StoryService
        from .services.implementations.user_service import UserService

        return {
            "comment": CommentService(),
            "entity": EntityService(),
            "story": StoryService(),
            "user": UserService(),
        }

@pytest.fixture
def client(app):
    with app.app_context():
        from .graphql.schema import schema

        return Client(schema)


# https://itnext.io/setting-up-transactional-tests-with-pytest-and-sqlalchemy-b2d726347629
"""
@pytest.fixture(scope="session")
def connection():
    engine = create_engine(
       "postgres://{username}:{password}@{host}:5432/{db}".format(
            username=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            db=os.getenv("POSTGRES_DB"),
        )
    )
    return engine.connect()


@pytest.fixture(scope="session")
def setup_database(connection):
    #do nothing
    print('hi')


@pytest.fixture
def db_session(setup_database, connection):
    transaction = connection.begin()
    yield scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=connection)
    )
    transaction.rollback()

"""
