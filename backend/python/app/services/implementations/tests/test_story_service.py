import pytest

from ....models.story import Story


def test_answer():
    assert 5 == 5


# https://github.com/apryor6/flask_testing_examples/tree/master/fte
def test_add_story(app, db):  # noqa

    # This is not a very useful test, as it basically is testing SqlAlchemy; however,
    # I leave it here as a reference for how to create objects
    with app.app_context():
        obj = Story(title="title", description="description", youtube_link="", level=1)
        db.session.add(obj)
        db.session.commit()
        fetched = Story.query.all()
        assert len(fetched) == 1
        assert fetched[0].title == "title"


def test_get_story(app, db, services):

    with app.app_context():
        obj = Story(title="title", description="description", youtube_link="", level=1)
        db.session.add(obj)
        assert db.session.commit() == None

        assert_story_equals_model(services["story"].get_story(obj.id), obj)


def assert_story_equals_model(story_response, story_model):
    assert story_response["title"] == story_model.title
    assert story_response["description"] == story_model.description
    assert story_response["youtube_link"] == story_model.youtube_link
    assert story_response["level"] == story_model.level


# https://itnext.io/setting-up-transactional-tests-with-pytest-and-sqlalchemy-b2d726347629
"""

def test_user_created(db_session):
    db_session.add(Story("title", "description", "yt", 3))
    db_session.commit()
"""
