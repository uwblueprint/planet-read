import pytest

from ...models.story import Story
from ...models.story_all import StoryAll
from ...models.story_content import StoryContent
from ...models.story_content_all import StoryContentAll
from ...models.story_translation import StoryTranslation
from ...models.story_translation_all import StoryTranslationAll
from ...models.user import User
from ...models.user_all import UserAll
from ..helpers.db_helpers import db_session_add_commit_obj
from ..helpers.story_helpers import StoryRequestDTO, assert_story_equals_model
from ..helpers.story_translation_helpers import (
    StoryTranslationRequestDTO,
    assert_story_translation_equals_model,
    create_admin,
    create_reviewer,
    create_story_translation,
    create_story_translation_contents,
    create_translator,
)


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

    story_obj = StoryAll.query.get(resp.id)
    assert resp == story_obj

    content_objs = StoryContentAll.query.filter_by(story_id=resp.id).all()
    assert len(content_objs) == len(resp.contents)
    for content_obj, resp_content in zip(content_objs, resp.contents):
        assert content_obj == resp_content


def test_get_stories_available_for_translation(app, db, services):
    translator_obj = create_translator(db)
    translation_language = "ENGLISH_US"
    translation_level = 3

    # create stories
    story_obj_1 = db_session_add_commit_obj(
        db,
        Story(
            title="Title",
            description="Description",
            youtube_link="",
            level=translation_level,
            translated_languages=[],
        ),
    )
    story_obj_2 = db_session_add_commit_obj(
        db,
        Story(
            title="Title",
            description="Description",
            youtube_link="",
            level=translation_level,
            translated_languages=[],
        ),
    )

    # test service method
    all_resp = services["story"].get_stories_available_for_translation(
        translation_language, translation_level, translator_obj.id
    )
    assert len(all_resp) == 2
    assert all_resp[0] == story_obj_1.to_dict(include_relationships=True)
    assert all_resp[1] == story_obj_2.to_dict(include_relationships=True)

    # update translated languages for story 2
    story_obj_2.translated_languages = [translation_language]
    db.session.commit()

    # test service method
    partial_resp = services["story"].get_stories_available_for_translation(
        translation_language, translation_level, translator_obj.id
    )
    assert len(partial_resp) == 1
    assert partial_resp[0] == story_obj_1.to_dict(include_relationships=True)

    # assign story translation to translator
    story_translation = StoryTranslationRequestDTO(
        story_id=story_obj_1.id,
        language=translation_language,
        stage="TRANSLATE",
        translator_id=translator_obj.id,
        reviewer_id=None,
    )
    services["story"].create_translation(story_translation)

    # test service method
    empty_resp = services["story"].get_stories_available_for_translation(
        translation_language, translation_level, translator_obj.id
    )
    assert len(empty_resp) == 0


def test_create_translation(app, db, services):
    translator_obj = create_translator(db)
    reviewer_obj = create_reviewer(db)

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
        translator_id=translator_obj.id,
        reviewer_id=reviewer_obj.id,
    )
    story_translation_resp = services["story"].create_translation(story_translation)
    story_translation_obj = StoryTranslation.query.get(story_translation_resp["id"])
    assert_story_translation_equals_model(
        story_translation_resp, story_obj, story_translation_obj
    )

    get_story_translation_resp = services["story"].get_story_translation(
        story_translation_obj.id
    )
    content_objs = StoryContent.query.filter_by(story_id=story_resp.id).all()
    assert len(content_objs) == get_story_translation_resp["num_content_lines"]
    assert len(content_objs) == len(get_story_translation_resp["translation_contents"])


def test_create_translation_test(app, db, services):
    translator_obj = create_translator(db)

    story = StoryRequestDTO(
        title="Title",
        description="Description",
        youtube_link="",
        level=2,
        translated_languages=[],
    )
    content = ["Story content 1.", "Story content 2.", "Story content 3."]
    story_resp = services["story"].create_story(story, content)
    story_obj = Story.query.get(story_resp.id)
    # Hacky way to make a test story since theres no service to make one
    story_obj.is_test = True
    db.session.commit()

    story_translation_resp = services["story"].create_translation_test(
        translator_obj.id, 2, "ENGLISH"
    )
    story_translation_obj = StoryTranslation.query.get(story_translation_resp.id)
    assert story_translation_resp == story_translation_obj
    assert story_translation_obj.is_test

    get_story_translation_resp = services["story"].get_story_translation(
        story_translation_obj.id
    )
    content_objs = StoryContent.query.filter_by(story_id=story_resp.id).all()
    assert len(content_objs) == get_story_translation_resp["num_content_lines"]
    assert len(content_objs) == len(get_story_translation_resp["translation_contents"])


def test_get_story_translation(app, db, services):
    (
        _trans,
        _rev,
        story_obj,
        story_translation_obj,
    ) = create_story_translation(db)
    story_translation_contents = create_story_translation_contents(
        db, story_translation_obj
    )

    story_translation_response = services["story"].get_story_translation(
        story_translation_obj.id
    )
    num_translated_lines = services["story"]._get_num_translated_lines(
        story_translation_contents
    )
    num_approved_lines = services["story"]._get_num_approved_lines(
        story_translation_contents
    )

    assert_story_translation_equals_model(
        story_translation_response,
        story_obj,
        story_translation_obj,
        story_translation_contents,
        num_translated_lines,
        num_approved_lines,
    )


def test_get_story_translation_raises_error_for_invalid_id():
    pass


def test_get_story_translations():
    # includes all fields
    pass


def test_get_story_translation_tests(app, db, services):
    first_translator_obj = create_translator(db)
    second_translator_obj = create_reviewer(db)
    admin_obj = create_admin(db)

    # Create test story
    story = StoryRequestDTO(
        title="Title",
        description="Description",
        youtube_link="",
        level=2,
        translated_languages=[],
    )
    content = ["Story content 1.", "Story content 2.", "Story content 3."]
    story_resp = services["story"].create_story(story, content)
    story_obj = Story.query.get(story_resp.id)
    story_obj.is_test = True
    db.session.commit()

    # Create story translation tests
    first_story_translation_resp = services["story"].create_translation_test(
        first_translator_obj.id, 2, "ENGLISH"
    )
    second_story_translation_resp = services["story"].create_translation_test(
        second_translator_obj.id, 2, "ENGLISH"
    )

    # Test for admin
    tests = [first_story_translation_resp, second_story_translation_resp]
    admin_get_story_translation_tests_resp = services[
        "story"
    ].get_story_translation_tests(admin_obj)
    assert len(admin_get_story_translation_tests_resp) == 2
    for test_resp, test in zip(admin_get_story_translation_tests_resp, tests):
        assert_story_translation_equals_model(test_resp, story, test)

    # Test for user
    user_get_story_translation_tests_resp = services[
        "story"
    ].get_story_translation_tests(first_translator_obj)
    assert len(user_get_story_translation_tests_resp) == 1

    user_story_translation_test = user_get_story_translation_tests_resp[0]
    assert user_story_translation_test["translator_id"] == first_translator_obj.id
    assert_story_translation_equals_model(
        user_story_translation_test, story, first_story_translation_resp
    )


def test_assign_user_as_reviewer(app, db, services):
    translator_obj = create_translator(db)
    reviewer_obj = create_reviewer(db)
    story_obj = db_session_add_commit_obj(
        db,
        Story(
            title="Title",
            description="Description",
            youtube_link="",
            level=4,
        ),
    )
    story_translation_obj = db_session_add_commit_obj(
        db,
        StoryTranslationAll(
            story_id=story_obj.id,
            language="ENGLISH_US",
            stage="TRANSLATE",
            translator_id=translator_obj.id,
            reviewer_id=None,
        ),
    )
    create_story_translation_contents(db, story_translation_obj)
    story_translation = services["story"].get_story_translation(
        story_translation_obj.id
    )

    assert story_translation_obj.reviewer_id == None
    resp = services["story"].assign_user_as_reviewer(
        user=reviewer_obj, story_translation=story_translation
    )
    assert resp["stage"] == "REVIEW"
    assert resp["reviewer_id"] == reviewer_obj.id
    assert resp["level"] == story_translation["level"]


def test_assign_user_as_reviewer_not_approved_for_language(app, db, services):
    translator_obj = create_translator(db)
    reviewer_obj = db_session_add_commit_obj(
        db,
        UserAll(
            first_name="Dwight",
            last_name="D. Eisenhower",
            email="dwight.d.eisenhower@uwblueprint.org",
            auth_id="anothersecret",
            role="User",
            approved_languages_translation={"ENGLISH_US": 2},
            approved_languages_review={"ENGLISH_US": 2},
        ),
    )
    story_obj = db_session_add_commit_obj(
        db,
        Story(
            title="Title",
            description="Description",
            youtube_link="",
            level=4,
        ),
    )
    story_translation_obj = db_session_add_commit_obj(
        db,
        StoryTranslationAll(
            story_id=story_obj.id,
            language="ENGLISH_US",
            stage="TRANSLATE",
            translator_id=translator_obj.id,
            reviewer_id=None,
        ),
    )
    create_story_translation_contents(db, story_translation_obj)
    story_translation = services["story"].get_story_translation(
        story_translation_obj.id
    )

    assert "GERMAN" not in reviewer_obj.approved_languages_review
    with pytest.raises(Exception) as e:
        services["story"].assign_user_as_reviewer(
            user=reviewer_obj, story_translation=story_translation
        )
    assert "User can't be assigned as a reviewer" in str(e.value)


def test_assign_user_as_reviewer_insufficient_level_for_language(app, db, services):
    translator_obj = create_translator(db)
    reviewer_obj = db_session_add_commit_obj(
        db,
        UserAll(
            first_name="Dwight",
            last_name="D. Eisenhower",
            email="dwight.d.eisenhower@uwblueprint.org",
            auth_id="anothersecret",
            role="User",
            approved_languages_translation={"ENGLISH_US": 2},
            approved_languages_review={"ENGLISH_US": 2},
        ),
    )
    story_obj = db_session_add_commit_obj(
        db,
        Story(
            title="Title",
            description="Description",
            youtube_link="",
            level=4,
        ),
    )
    story_translation_obj = db_session_add_commit_obj(
        db,
        StoryTranslationAll(
            story_id=story_obj.id,
            language="ENGLISH_US",
            stage="TRANSLATE",
            translator_id=translator_obj.id,
            reviewer_id=None,
        ),
    )
    create_story_translation_contents(db, story_translation_obj)
    story_translation = services["story"].get_story_translation(
        story_translation_obj.id
    )

    assert reviewer_obj.approved_languages_review["ENGLISH_US"] < story_obj.level
    with pytest.raises(Exception) as e:
        services["story"].assign_user_as_reviewer(
            user=reviewer_obj, story_translation=story_translation
        )
    assert "User can't be assigned as a reviewer" in str(e.value)


def test_assign_user_as_reviewer_reviewer_id_already_exists_on_translation(
    app, db, services
):
    _trans, _reviewer_1, _story, story_translation_obj = create_story_translation(db)
    reviewer_2 = db_session_add_commit_obj(
        db,
        UserAll(
            first_name="first",
            last_name="last",
            email="test@gmail.com",
            auth_id="anothersecret2",
            role="User",
            approved_languages_translation={"ENGLISH_US": 2},
            approved_languages_review={"ENGLISH_US": 2},
        ),
    )
    create_story_translation_contents(db, story_translation_obj)
    story_translation = services["story"].get_story_translation(
        story_translation_obj.id
    )

    assert story_translation_obj.reviewer_id != None
    with pytest.raises(Exception) as e:
        services["story"].assign_user_as_reviewer(
            user=reviewer_2, story_translation=story_translation
        )
    assert "User can't be assigned as a reviewer" in str(e.value)


def test_update_story_translation_content(app, db, services):
    pass


def test_update_story_translation_content_invalid_content_id(app, db, services):
    # and saves nothing
    pass


def test_update_story_translation_contents(app, db, services):
    pass


def test_update_story_translation_content_invalid_translation_id(app, db, services):
    pass


def test_update_story_translation_content_invalid_content_id(app, db, services):
    pass


def test_get_story_translations_available_for_review(app, db, services):
    pass


def test_remove_reviewer_from_story_translation(app, db, services):
    _trans, _rev, _story, story_translation = create_story_translation(db)
    assert StoryTranslation.query.get(story_translation.id).reviewer_id != None
    services["story"].remove_user_from_story_translation(
        story_translation_id=story_translation.id, user_id=story_translation.reviewer_id
    )
    assert StoryTranslation.query.get(story_translation.id).reviewer_id == None


def test_remove_translator_from_story_translation(app, db, services):
    _trans, _rev, _story, story_translation = create_story_translation(db)
    assert StoryTranslation.query.get(story_translation.id).translator_id != None
    services["story"].remove_user_from_story_translation(
        story_translation_id=story_translation.id,
        user_id=story_translation.translator_id,
    )
    assert StoryTranslation.query.get(story_translation.id) == None
    assert StoryTranslationAll.query.get(story_translation.id).is_deleted == True


def test_remove_user_from_invalid_story_translation(app, db, services):
    st_id = -31415
    assert StoryTranslation.query.get(st_id) == None
    with pytest.raises(Exception) as e:
        services["story"].remove_user_from_story_translation(
            story_translation_id=st_id, user_id=1
        )
    assert "Error. Story translation does not exist." in str(e.value)


def test_remove_invalid_user_from_story_translation(app, db, services):
    _trans, _rev, _story, story_translation = create_story_translation(db)
    user_id = -92653
    assert User.query.get(user_id) == None
    with pytest.raises(Exception) as e:
        services["story"].remove_user_from_story_translation(
            story_translation_id=story_translation.id, user_id=user_id
        )
    assert (
        "Error. User is not a translator or reviewer of this story translation."
        in str(e.value)
    )
