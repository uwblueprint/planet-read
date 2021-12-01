from ...models.story import Story
from ...models.story_translation_all import StoryTranslationAll
from ...models.user_all import UserAll
from .db_helpers import db_session_add_commit_obj


class StoryRequestDTO:
    def __init__(
        self,
        title,
        description,
        youtube_link,
        level,
        translated_languages,
    ):
        self.title = title
        self.description = description
        self.youtube_link = youtube_link
        self.level = level
        self.translated_languages = translated_languages


def assert_story_equals_model(story_response, story_model, graphql_response=True):
    assert story_response["title"] == story_model.title
    assert story_response["description"] == story_model.description
    assert story_response["level"] == story_model.level

    if graphql_response:
        assert story_response["youtubeLink"] == story_model.youtube_link
        # TODO: expected translatedLanguages?
        assert story_response["translatedLanguages"] == None
    else:
        assert story_response["youtube_link"] == story_model.youtube_link
        # TODO: expected translated_languages?
        assert story_response["translated_languages"] == None


def guarantee_story_table_not_empty(db):
    if Story.query.count() == 0:
        obj = Story(
            title="East of Eden",
            description="Follow the intertwined destinies of two families whose generations reenact the poisonous rivalry of Cain and Abel.",
            youtube_link="https://www.youtube.com/watch?v=redECmF7wh8",
            level=4,
        )
        db.session.add(obj)
        assert db.session.commit() == None


def create_story_translation(db):
    story = db_session_add_commit_obj(
        db,
        Story(
            title="East of Eden",
            description="Follow the intertwined destinies of two families whose generations reenact the poisonous rivalry of Cain and Abel.",
            youtube_link="https://www.youtube.com/watch?v=redECmF7wh8",
            level=4,
        ),
    )
    translator = db_session_add_commit_obj(
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
    reviewer = db_session_add_commit_obj(
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
    story_translation = db_session_add_commit_obj(
        db,
        StoryTranslationAll(
            story_id=story.id,
            language="ENGLISH_US",
            stage="TRANSLATE",
            translator_id=translator.id,
            reviewer_id=reviewer.id,
        ),
    )
    return story_translation
