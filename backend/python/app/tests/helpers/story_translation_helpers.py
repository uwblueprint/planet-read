from ...models.story import Story
from ...models.story_translation_all import StoryTranslationAll
from ...models.story_translation_content import StoryTranslationContent
from ...models.user_all import UserAll
from .db_helpers import db_session_add_commit_obj


class StoryTranslationRequestDTO:
    def __init__(
        self,
        story_id,
        language,
        stage,
        translator_id,
        reviewer_id,
    ):
        self.story_id = story_id
        self.language = language
        self.stage = stage
        self.translator_id = translator_id
        self.reviewer_id = reviewer_id


def assert_story_translation_equals_model(
    story_translation_response,
    story_model,
    story_translation_model,
    translation_contents=[],
    num_translated_lines=0,
    num_approved_lines=0,
):
    assert story_translation_response["id"] == story_translation_model.id
    assert story_translation_response["language"] == story_translation_model.language
    assert story_translation_response["stage"] == story_translation_model.stage
    for translation_content_response, translation_content in zip(
        story_translation_response.get("translation_contents", []), translation_contents
    ):
        assert translation_content_response["id"] == translation_content["id"]
        assert (
            translation_content_response["line_index"]
            == translation_content["line_index"]
        )
        assert (
            translation_content_response["translation_content"]
            == translation_content["translation_content"]
        )
        assert translation_content_response["status"] == translation_content["status"]
    assert (
        story_translation_response["translator_id"]
        == story_translation_model.translator_id
    )
    assert (
        story_translation_response["reviewer_id"] == story_translation_model.reviewer_id
    )
    assert story_translation_response["story_id"] == story_translation_model.story_id
    assert story_translation_response["title"] == story_model.title
    assert story_translation_response["description"] == story_model.description
    assert story_translation_response["youtube_link"] == story_model.youtube_link
    assert story_translation_response["level"] == story_model.level
    assert (
        story_translation_response.get("num_translated_lines", 0)
        == num_translated_lines
    )
    assert story_translation_response.get("num_approved_lines", 0) == num_approved_lines
    assert story_translation_response.get("num_content_lines", 0) == len(
        translation_contents
    )


def create_story(db):
    return db_session_add_commit_obj(
        db,
        Story(
            title="East of Eden",
            description="Follow the intertwined destinies of two families whose generations reenact the poisonous rivalry of Cain and Abel.",
            youtube_link="https://www.youtube.com/watch?v=redECmF7wh8",
            level=4,
        ),
    )


def create_translator(db):
    return db_session_add_commit_obj(
        db,
        UserAll(
            first_name="Carl",
            last_name="Sagan",
            email="carl.sagan@uwblueprint.org",
            auth_id="secret",
            role="User",
            approved_languages_translation={"ENGLISH_US": 4, "ENGLISH_UK": 4},
            approved_languages_review={"ENGLISH_US": 4, "ENGLISH_UK": 4},
        ),
    )


def create_reviewer(db):
    return db_session_add_commit_obj(
        db,
        UserAll(
            first_name="Dwight",
            last_name="D. Eisenhower",
            email="dwight.d.eisenhower@uwblueprint.org",
            auth_id="anothersecret",
            role="User",
            approved_languages_translation={"ENGLISH_US": 4, "ENGLISH_UK": 4},
            approved_languages_review={"ENGLISH_US": 4, "ENGLISH_UK": 4},
        ),
    )


def create_admin(db):
    return db_session_add_commit_obj(
        db,
        UserAll(
            first_name="Angela",
            last_name="Merkel",
            email="planetread+angelamerkel@uwblueprint.org",
            auth_id="thirdsecret",
            role="Admin",
            approved_languages_translation={"GERMAN": 4},
            approved_languages_review={"GERMAN": 4},
        ),
    )


def _create_story_translation(db, story, translator, reviewer):
    return db_session_add_commit_obj(
        db,
        StoryTranslationAll(
            story_id=story.id,
            language="ENGLISH_US",
            stage="TRANSLATE",
            translator_id=translator.id,
            reviewer_id=reviewer.id,
        ),
    )


def create_story_translation_contents(db, story_translation):
    story_translation_content_1 = db_session_add_commit_obj(
        db,
        StoryTranslationContent(
            story_translation_id=story_translation.id,
            line_index=0,
            translation_content="Translation content 1.",
            status="APPROVED",
        ),
    )
    story_translation_content_2 = db_session_add_commit_obj(
        db,
        StoryTranslationContent(
            story_translation_id=story_translation.id,
            line_index=1,
            translation_content="",
            status="DEFAULT",
        ),
    )
    story_translation_contents = [
        story_translation_content_1.to_dict(),
        story_translation_content_2.to_dict(),
    ]
    return story_translation_contents


def create_story_translation(db):
    """Wrapper function to create translator, reviewer, story and story
    translation objects.
    :return: Tuple of translator, reviewer, story and story translation objects"""
    translator_obj = create_translator(db)
    reviewer_obj = create_reviewer(db)
    story_obj = create_story(db)
    story_translation_obj = _create_story_translation(
        db, story_obj, translator_obj, reviewer_obj
    )
    return translator_obj, reviewer_obj, story_obj, story_translation_obj
