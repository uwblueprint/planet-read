import pytest

from ...models.story import Story
from ...models.story_content import StoryContent
from ..helpers.story_helpers import StoryRequestDTO, assert_story_equals_model


def test_get_story(app, db, services):
    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    assert db.session.commit() == None

    resp = services["story"].get_story(obj.id)
    assert_story_equals_model(resp, obj, graphql_response=False)


def test_get_story_invalid_id(app, db, services):
    with pytest.raises(Exception) as e:
        _ = services["story"].get_story(-1)
        assert "Invalid id" in str(e.value)

    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    assert db.session.commit() == None

    with pytest.raises(Exception) as e:
        _ = services["story"].get_story(obj.id + 1)
        assert "Invalid id" in str(e.value)


def test_get_stories(app, db, services):
    obj = Story(title="title", description="description", youtube_link="", level=1)
    db.session.add(obj)
    assert db.session.commit() == None

    obj_1 = Story(
        title="title_1", description="description_1", youtube_link="", level=2
    )
    db.session.add(obj_1)
    assert db.session.commit() == None

    resp = services["story"].get_stories()
    assert_story_equals_model(resp[0], obj, graphql_response=False)
    assert_story_equals_model(resp[1], obj_1, graphql_response=False)


def test_create_story(app, db, services):
    story = StoryRequestDTO(
        title="title",
        description="description",
        youtube_link="",
        level=1,
        translated_languages=[],
    )
    content = ["line1", "line2", "line3"]
    resp = services["story"].create_story(story, content)
    story_obj = Story.query.get(resp.id)
    assert resp == story_obj
    content_objs = StoryContent.query.filter_by(story_id=resp.id).all()
    for content_obj, resp_content in zip(content_objs, resp.contents):
        assert content_obj == resp_content
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
