from ..service import services


def resolve_stories(root, info, **kwargs):
    return services["story"].get_stories()


def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)


def resolve_stories_available_for_translation(root, info, id):
    user = services["user"].get_user_by_id(id)
    return services["story"].get_stories_available_for_translation(user)
