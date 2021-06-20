from ..service import services


def resolve_stories(root, info, **kwargs):
    return services["story"].get_stories()


def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)


def resolve_stories_available_for_translation(root, info, language, level):
    return services["story"].get_stories_available_for_translation(language, level)


def resolve_story_translations_by_user(root, info, user_id, translator):
    return services["story"].get_story_translations(user_id, translator)


def resolve_story_translation_by_id(root, info, id):
    return services["story"].get_story_translation(id)


def resolve_story_translations_available_for_review(root, info, language, level):
    return services["story"].get_story_translations_available_for_review(
        language, level
    )
