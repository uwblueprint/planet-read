import os

import pytest
from sqlalchemy.engine import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from . import create_app

# https://github.com/apryor6/flask_testing_examples/tree/master/fte

my_app = None


@pytest.fixture
def app():
    """
    a
    """
    global my_app
    if my_app is None:
        my_app = create_app("development")
    return my_app


@pytest.fixture
def client(app):
    """
    a
    """
    return app.test_client()


@pytest.fixture
def db(app):
    """
    a
    """
    from .models import db

    with app.app_context():
        db.create_all()
        yield db
        db.drop_all()
        db.session.commit()


@pytest.fixture
def services(app):
    """
    a
    """
    with app.app_context():
        from .services.implementations.story_service import StoryService
        from .services.implementations.user_service import UserService

        return {
            "story": StoryService(),
            "user": UserService(),
        }


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
