from ...models.story import Story


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
