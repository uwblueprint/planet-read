from ..service import services


def resolve_comments_by_story_translation(
    root, info, story_translation_id, resolved=None
):
    return services["comment"].get_comments_by_story_translation(
        story_translation_id, resolved
    )
