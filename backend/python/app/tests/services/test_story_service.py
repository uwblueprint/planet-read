from ...models.story import Story
from ..helpers.story_helpers import assert_story_equals_model


# https://github.com/apryor6/flask_testing_examples/tree/master/fte
def test_add_story(app, db):  # noqa
    # This is not a very useful test, as it basically is testing SqlAlchemy; however,
    # I leave it here as a reference for how to create objects
    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    db.session.commit()
    fetched = Story.query.all()
    assert fetched[-1].title == "title"


def test_get_story(app, db, services):
    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    assert db.session.commit() == None

    resp = services["story"].get_story(obj.id)
    assert_story_equals_model(resp, obj)


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


def test_create_translation_raises_error_if_translation_content_commit_fails_and_nothing_saved():
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
