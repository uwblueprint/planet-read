import pytest

from ....models.story import Story


def test_answer():
    assert 5 == 5


# https://github.com/apryor6/flask_testing_examples/tree/master/fte
def test_add_story(app, db):  # noqa
    with app.app_context():
        # This is not a very useful test, as it basically is testing SqlAlchemy; however,
        # I leave it here as a reference for how to create objects
        obj = Story(title="title", description="description", youtube_link="", level=1)
        db.session.add(obj)
        db.session.commit()
        fetched = Story.query.all()
        assert len(fetched) == 1
        assert fetched[0].title == "title"


def assert_story_equals_model(story_response, story_model):
    assert story_response["title"] == story_model.title
    assert story_response["description"] == story_model.description
    assert story_response["youtube_link"] == story_model.youtube_link
    assert story_response["level"] == story_model.level


def test_get_story(app, db, services):
    with app.app_context():
        obj = Story(title="title", description="description", youtube_link="", level=1)
        db.session.add(obj)
        assert db.session.commit() == None

    assert_story_equals_model(services["story"].get_story(obj.id), obj)


def test_get_story_raises_exception_for_invalid_id():
    pass


def test_get_stories():
    pass


def test_create_story():
    pass


def test_create_story_raises_error_if_story_commit_fails_and_nothing_saved():
    pass


def test_create_story_raises_error_if_story_content_commit_fails_and_nothing_saved():
    pass


def test_get_stories_available_for_translation():
    pass


def test_create_translation():
    pass


def test_create_translation_raises_error_if_story_translation_commit_fails_and_nothing_saved():
    pass


def test_create_translation_raises_error_if_translation_conteny_commit_fails_and_nothing_saved():
    pass


def test_get_story_translation():
    # includes all fields, including num_translated_lines
    pass


def test_get_story_translation_raises_error_for_invalid_id():
    pass


def test_get_story_translations():
    # includes all fields, including num_translated_lines
    pass


def test_assign_user_as_reviewer():
    pass


def test_assign_user_as_reviewer_raises_exception_when_not_approved_for_language():
    pass


def test_assign_user_as_reviewer_raises_exception_when_insufficient_level_for_language():
    pass


def test_assign_user_as_reviewer_raises_exception_when_story_translation_not_in_TRANSLATE_stage():
    pass


def test_assign_user_as_reviewer_raises_exception_when_reviewer_id_already_exists_on_translation():
    pass


def test_update_story_translation_content():
    pass


def test_update_story_translation_content_raises_exception_for_invalid_content_id():
    # and saves nothing
    pass


def test_update_story_translation_contents():
    pass


def test_update_story_translation_content_raises_exception_for_invalid_translation_id():
    pass


def test_update_story_translation_content_raises_exception_for_invalid_content_id():
    pass


def test_get_story_translations_available_for_review():
    pass


# https://itnext.io/setting-up-transactional-tests-with-pytest-and-sqlalchemy-b2d726347629
"""

def test_user_created(db_session):
    db_session.add(Story("title", "description", "yt", 3))
    db_session.commit()
"""
