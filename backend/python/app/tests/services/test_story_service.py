import pytest
import random

from ...models.story import Story
from ...models.story_content import StoryContent
from ...models.story_translation import StoryTranslation
from ...models.story_translation_content import StoryTranslationContent
from ...models.user_all import UserAll
from ..helpers.db_helpers import db_session_add_commit_obj
from ..helpers.story_helpers import StoryRequestDTO, assert_story_equals_model
from ..helpers.story_translation_helpers import StoryTranslationRequestDTO


def test_get_story(app, db, services):
    obj = db_session_add_commit_obj(
        db, Story(title="title", description="description", youtube_link="", level=1)
    )

    resp = services["story"].get_story(obj.id)
    assert_story_equals_model(resp, obj, graphql_response=False)


def test_get_story_invalid_id(app, db, services):
    with pytest.raises(Exception) as e:
        _ = services["story"].get_story(-1)
        assert "Invalid id" in str(e.value)

    obj = db_session_add_commit_obj(
        db, Story(title="title", description="description", youtube_link="", level=1)
    )

    with pytest.raises(Exception) as e:
        _ = services["story"].get_story(obj.id + 1)
        assert "Invalid id" in str(e.value)


def test_get_stories(app, db, services):
    obj = db_session_add_commit_obj(
        db, Story(title="title", description="description", youtube_link="", level=1)
    )
    obj_1 = db_session_add_commit_obj(
        db,
        Story(title="title_1", description="description_1", youtube_link="", level=2),
    )

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
    assert len(content_objs) == len(resp.contents)
    for content_obj, resp_content in zip(content_objs, resp.contents):
        assert content_obj == resp_content


def test_get_stories_available_for_translation():
    pass


def test_create_translation(app, db, services):
    alphanumeric = 'abcdefghijklmnopqrstuvwxyz0123456789'

    translator_authId = ''.join(random.choice(alphanumeric) for i in range(10))
    translator_obj = db_session_add_commit_obj(
        db, UserAll(first_name="Translatorfirst", last_name="Translatorlast", email=f"{translator_authId}", is_deleted=False, auth_id=translator_authId)
    )

    reviewer_authId = ''.join(random.choice(alphanumeric) for i in range(10))
    reviewer_obj = db_session_add_commit_obj(
        db, UserAll(first_name="Reviewerfirst", last_name="Reviewerlast", email=f"{reviewer_authId}", is_deleted=False, auth_id=reviewer_authId)
    )

    story = StoryRequestDTO(
        title="Title",
        description="Description",
        youtube_link="",
        level=1,
        translated_languages=[],
    )
    content = ["Story content 1.", "Story content 2.", "Story content 3."]
    story_resp = services["story"].create_story(story, content)
    story_obj = Story.query.get(story_resp.id)

    story_translation = StoryTranslationRequestDTO(
        story_id=story_obj.id,
        language="English",
        stage="TRANSLATE",
        translator_id =translator_obj.id,
        reviewer_id=reviewer_obj.id,
    )
    story_translation_resp = services["story"].create_translation(story_translation)
    story_translation_obj = StoryTranslation.query.get(story_translation_resp.id)
    assert story_translation_resp == story_translation_obj

    get_story_translation_resp = services["story"].get_story_translation(story_translation_obj.id)
    content_objs = StoryContent.query.filter_by(story_id = story_resp.id).all()
    assert len(content_objs) == get_story_translation_resp["num_content_lines"]

def test_create_translation_raises_error_if_story_translation_commit_fails_and_nothing_saved():
    pass


def test_create_translation_raises_error_if_translation_content_commit_fails_and_nothing_saved():
    pass


def test_get_story_translation(app, db, services):
    alphanumeric = 'abcdefghijklmnopqrstuvwxyz0123456789'

    translator_authId = ''.join(random.choice(alphanumeric) for i in range(10))
    translator_obj = db_session_add_commit_obj(
        db, UserAll(first_name="Translatorfirst", last_name="Translatorlast", email=f"{translator_authId}", is_deleted=False, auth_id=translator_authId)
    )

    reviewer_authId = ''.join(random.choice(alphanumeric) for i in range(10))
    reviewer_obj = db_session_add_commit_obj(
        db, UserAll(first_name="Reviewerfirst", last_name="Reviewerlast", email=f"{reviewer_authId}", is_deleted=False, auth_id=reviewer_authId)
    )

    story_obj = db_session_add_commit_obj(
        db, Story(title="Title", description="Description", youtube_link="", level=1)
    )

    story_translation_obj = db_session_add_commit_obj(
        db, StoryTranslation(story_id=story_obj.id, language="English", stage="TRANSLATE", translator_id=translator_obj.id, reviewer_id=reviewer_obj.id)
    )

    story_translation_content_obj_1 = db_session_add_commit_obj(
        db, StoryTranslationContent(story_translation_id=story_translation_obj.id, line_index=0, translation_content="Translation content 1.", status="APPROVED")
    )

    story_translation_content_obj_2 = db_session_add_commit_obj(
        db, StoryTranslationContent(story_translation_id=story_translation_obj.id, line_index=1, translation_content="", status="DEFAULT")
    )

    translation_contents = [
        {
            "id": story_translation_content_obj_1.id,
            "line_index": story_translation_content_obj_1.line_index,
            "translation_content": story_translation_content_obj_1.translation_content,
            "status": story_translation_content_obj_1.status,
        }, {
            "id": story_translation_content_obj_2.id,
            "line_index": story_translation_content_obj_2.line_index,
            "translation_content": story_translation_content_obj_2.translation_content,
            "status": story_translation_content_obj_2.status,
        },
    ]

    resp = services["story"].get_story_translation(story_translation_obj.id)

    assert resp["id"] == story_translation_obj.id
    assert resp["language"] == story_translation_obj.language
    assert resp["stage"] == story_translation_obj.stage
    assert resp["translation_contents"] == translation_contents
    assert resp["translator_id"] == story_translation_obj.translator_id
    assert resp["reviewer_id"] == story_translation_obj.reviewer_id
    assert resp["story_id"] == story_translation_obj.story_id
    assert resp["title"] == story_obj.title
    assert resp["description"] == story_obj.description
    assert resp["youtube_link"] == story_obj.youtube_link
    assert resp["level"] == story_obj.level
    assert resp["num_translated_lines"] == services["story"]._get_num_translated_lines(translation_contents)
    assert resp["num_approved_lines"] == services["story"]._get_num_approved_lines(translation_contents)
    assert resp["num_content_lines"] == len(translation_contents)


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
