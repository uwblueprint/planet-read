def assert_story_equals_model(story_response, story_model):
    assert story_response["title"] == story_model.title
    assert story_response["description"] == story_model.description
    assert story_response["youtube_link"] == story_model.youtube_link
    assert story_response["level"] == story_model.level
    # translatedLanguages?
