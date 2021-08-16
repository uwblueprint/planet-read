import re

from ....models.story import Story


def test_create_story(app, db, client):
    result = client.execute(
        """
        mutation {
            createStory(
                contents: [
                    "line 1", "line 2", "line 3",
                ],
                storyData: {
                    title: "title test",
                    description: "this should explain things",
                    youtubeLink: "don't think we validate this yet",
                    level: 10001
                }
            ) {
                ok
                story {
                    id
                    title
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
    )

    assert dict(result["data"]) == {
        "createStory": {
            "ok": True,
            "story": {
                "id": 1,
                "title": "title test",
                "description": "this should explain things",
                "youtubeLink": "don't think we validate this yet",
                "translatedLanguages": None,
                "level": 10001,
                "contents": [
                    {"id": 1, "storyId": "1", "lineIndex": 0, "content": "line 1"},
                    {"id": 2, "storyId": "1", "lineIndex": 1, "content": "line 2"},
                    {"id": 3, "storyId": "1", "lineIndex": 2, "content": "line 3"},
                ],
            },
        }
    }

    test_db_obj = (
        Story.query.order_by(Story.id.desc())
        .first()
        .to_dict(include_relationships=True)
    )
    # will want this somewhere globally i assume
    pattern = re.compile(r"(?<!^)(?=[A-Z])")

    for field_name, value in result["data"]["createStory"]["story"].items():
        if field_name == "contents":
            value = [
                {to_snake_case(pattern, k): v for k, v in content.items()}
                for content in value
            ]

        assert value == test_db_obj[to_snake_case(pattern, field_name)]


def test_create_story_exception(db, client):
    pass


def test_create_story_translation(db, client):
    pass


def test_create_story_translation_exception(db, client):
    pass


def test_create_story_translation_translation_already_created(db, client):
    pass


def test_assign_user_as_reviewer(db, client):
    pass


def test_assign_user_as_reviewer_exception(db, client):
    pass


def test_assign_user_as_reviewer_invalid_user_id(db, client):
    pass


def test_assign_user_as_reviewer_user_not_approved(db, client):
    pass


def test_assign_user_as_reviewer_user_invalid_language_level_for_user(db, client):
    pass


def test_assign_user_as_reviewer_story_already_assigned(db, client):
    pass


def test_update_story_translation_by_id(db, client):
    pass


def test_update_story_translation_by_id_exception(db, client):
    pass


def test_update_story_translation_by_id_invalid_id(db, client):
    pass


def test_update_story_translation_by_id_story_translation_not_assigned_to_user(
    db, client
):
    pass


def test_update_story_translation_by_id_story_translation_not_created(db, client):
    pass


def update_story_translation_contents(db, client):
    pass


def update_story_translation_contents_exception(db, client):
    pass


def update_story_translation_contents_invalid_ids(db, client):
    pass


def test_update_story_translation_contents_story_translation_not_assigned_to_user(
    db, client
):
    pass


def test_update_story_translation_contents_story_translation_not_created(db, client):
    pass


def to_snake_case(pattern, string):
    return pattern.sub("_", string).lower()
