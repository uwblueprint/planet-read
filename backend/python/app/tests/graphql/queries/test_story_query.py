from ....models.story import Story
from ....models.story_content import StoryContent


def test_stories(app, db, client):
    result = client.execute(
        """
        {
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
    )

    stories_db = Story.query.all()
    story_contents_db = StoryContent.query.all()
    story_contents_db_dict = {sc.id: sc for sc in story_contents_db}
    returned_arr = result["data"]["stories"]
    assert len(stories_db) == len(returned_arr)

    for story_model, story_dict in zip(stories_db, returned_arr):
        story_db_id = story_dict["id"]

        print(story_dict)
        assert story_dict["title"] == story_model.title
        assert story_dict["description"] == story_model.description
        assert story_dict["youtubeLink"] == story_model.youtube_link
        assert story_dict["translatedLanguages"] == None
        assert story_dict["level"] == story_model.level

        for content_dict in story_dict["contents"]:
            content_db = story_contents_db_dict[content_dict["id"]]
            # type mismatch
            assert str(content_db.story_id) == content_dict["storyId"]
            assert content_db.line_index == content_dict["lineIndex"]
            assert content_db.content == content_dict["content"]


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
