from ...models.story import Story
from ..helpers.story_helpers import assert_story_equals_model


def test_get_story(app, db, services):
    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    assert db.session.commit() == None

    resp = services["story"].get_story(obj.id)
    assert_story_equals_model(resp, obj, graphql_response=False)

    db.session.query(Story).delete()
    assert db.session.commit() == None


def test_get_story_invalid_id():
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


def test_assign_user_as_reviewer_not_approved_for_language():
    pass


def test_assign_user_as_reviewer_insufficient_level_for_language():
    pass


def test_assign_user_as_reviewer_story_translation_not_in_TRANSLATE_stage():
    pass


def test_assign_user_as_reviewer_reviewer_id_already_exists_on_translation():
    pass


def test_update_story_translation_content():
    pass


def test_update_story_translation_content_invalid_content_id():
    # and saves nothing
    pass


def test_update_story_translation_contents():
    pass


def test_update_story_translation_content_invalid_translation_id():
    pass


def test_update_story_translation_content_invalid_content_id():
    pass


def test_get_story_translations_available_for_review():
    pass
