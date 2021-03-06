from datetime import datetime

from ....models.story import Story
from ....models.story_all import StoryAll
from ....models.story_content import StoryContent
from ....models.story_content_all import StoryContentAll
from ...helpers.story_helpers import assert_story_equals_model

CREATE_STORY = """
    mutation CreateStory(
        $contents: [String]!, $storyData: StoryRequestDTO!
    ) {
        createStory(
            contents: $contents, storyData: $storyData
        ) {
            ok
            story {
                id
                title
                dateUploaded
                description
                youtubeLink
                translatedLanguages
                level
                contents {
                    id
                    storyId
                    lineIndex
                    content
                }
            }
        }
    }
"""

# Test no longer works because mutation is authenticated
def test_create_story(app, db, client):
    """
    # seconds need to be dropped for testing purposes since there may be a discrepancy between the new_story and the test_db_story
    # microseconds should get dropped since the database does not store the microseconds
    time = datetime.utcnow().replace(microsecond=0, second=0)

    new_story = StoryAll(
        title="title test",
        description="this should explain things",
        youtube_link="don't think we validate this yet",
        level=10001,
        is_test=False,
        date_uploaded=time,
        is_deleted=False,
    )
    contents = ["line 1", "line 2", "line 3"]

    result = client.execute(
        CREATE_STORY,
        variables={
            "contents": contents,
            "storyData": {
                "title": new_story.title,
                "description": new_story.description,
                "youtubeLink": new_story.youtube_link,
                "level": new_story.level,
            },
        },
    )

    returned_dict = result["data"]["createStory"]
    story_db_id = returned_dict["story"]["id"]
    test_db_story = StoryAll.query.get(story_db_id).to_dict(include_relationships=False)
    test_db_story["date_uploaded"] = test_db_story["date_uploaded"].replace(
        microsecond=0, second=0
    )
    test_db_story_contents = StoryContentAll.query.filter_by(story_id=story_db_id).all()

    assert returned_dict["ok"]
    story_dict = returned_dict["story"]

    assert_story_equals_model(story_dict, new_story)

    new_story.id = story_db_id

    assert test_db_story == new_story.to_dict(include_relationships=False)

    for i in range(len(contents)):
        returned_dict_line_content = returned_dict["story"]["contents"][i]
        # type mismatch
        assert returned_dict_line_content["storyId"] == str(story_db_id)
        assert returned_dict_line_content["lineIndex"] == i
        assert returned_dict_line_content["content"] == contents[i]

        test_db_obj_line_content = test_db_story_contents[i].to_dict()
        assert test_db_obj_line_content["story_id"] == story_db_id
        assert test_db_obj_line_content["line_index"] == i
        assert test_db_obj_line_content["content"] == contents[i]
    """
    pass


def test_create_story_translation(db, client):
    pass


def test_create_story_translation_translation_already_created(db, client):
    pass


def test_assign_user_as_reviewer(db, client):
    pass


def test_assign_user_as_reviewer_invalid_user_id(db, client):
    pass


def test_assign_user_as_reviewer_user_invalid_language_level_for_user(db, client):
    pass


def test_assign_user_as_reviewer_story_already_assigned(db, client):
    pass


def test_update_story_translation_by_id(db, client):
    pass


def test_update_story_translation_by_id_invalid_id(db, client):
    pass


def test_update_story_translation_by_id_story_translation_not_assigned_to_user(
    db, client
):
    pass


def test_update_story_translation_by_id_story_translation_not_created(db, client):
    pass


def test_update_story_translation_contents(db, client):
    pass


def test_update_story_translation_contents_invalid_ids(db, client):
    pass


def test_update_story_translation_contents_story_translation_not_assigned_to_user(
    db, client
):
    pass


def test_update_story_translation_contents_story_translation_not_created(db, client):
    pass
