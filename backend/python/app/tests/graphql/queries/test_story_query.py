from ....models.story import Story
from ....models.story_content import StoryContent
from ...helpers.story_helpers import (
    assert_story_equals_model,
    guarantee_story_table_not_empty,
)

GET_STORIES = """
    query GetStories {
        stories {
            id
            title
            description
            level
            youtubeLink
            translatedLanguages
            contents  {
                id
                storyId
                lineIndex
                content
            }      
        }
    }
"""


def test_stories(app, db, client):
    guarantee_story_table_not_empty(db)

    result = client.execute(GET_STORIES)
    returned_arr = result["data"]["stories"]

    stories_db = Story.query.all()
    story_contents_db = StoryContent.query.all()
    story_contents_db_dict = {sc.id: sc for sc in story_contents_db}
    assert len(returned_arr) == len(stories_db)

    for story_dict, story_model in zip(returned_arr, stories_db):
        story_db_id = story_dict["id"]

        assert_story_equals_model(story_dict, story_model)

        for content_dict in story_dict["contents"]:
            content_db = story_contents_db_dict[content_dict["id"]]
            # type mismatch
            assert str(content_db.story_id) == content_dict["storyId"]
            assert content_db.line_index == content_dict["lineIndex"]
            assert content_db.content == content_dict["content"]

    db.session.query(StoryContent).delete()
    db.session.query(Story).delete()
    assert db.session.commit() == None


def test_story_by_id(db, client):
    pass


def test_story_by_id_invalid_id(db, client):
    pass


def test_stories_available_for_translation(db, client):
    pass


def test_stories_available_for_translation_invalid_language_string(db, client):
    pass


def test_stories_available_for_translation_negative_or_too_large_level(db, client):
    pass


def test_stories_available_for_translation_invalid_language_and_level_for_given_user(
    db, client
):
    pass


def test_story_translaiton_by_id(db, client):
    pass


def test_story_translation_by_id_invalid_id(db, client):
    pass


def test_stories_available_for_review(db, client):
    pass


def test_stories_available_for_review_invalid_language_string(db, client):
    pass


def test_stories_available_for_review_negative_or_too_large_level(db, client):
    pass


def test_stories_available_for_review_invalid_language_and_level_for_given_user(
    db, client
):
    pass


def test_not_authenticated_for_endpoint(db, client):
    pass
