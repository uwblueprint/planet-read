from ..service import services


def resolve_stories(root, info, **kwargs):
    return services["story"].get_stories()


def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)
