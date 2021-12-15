from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_by_role_gql,
)
from ..service import services


def resolve_stories(root, info, **kwargs):
    return services["story"].get_stories()


def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)


def resolve_stories_available_for_translation(root, info, language, level):
    return services["story"].get_stories_available_for_translation(language, level)


def resolve_story_translations_by_user(
    root, info, user_id, is_translator, language, level
):
    return services["story"].get_story_translations_by_user(
        user_id, is_translator, language, level
    )


def resolve_story_translation_by_id(root, info, id):
    return services["story"].get_story_translation(id)


def resolve_story_translations_available_for_review(root, info, language, level):
    return services["story"].get_story_translations_available_for_review(
        language, level
    )


@require_authorization_by_role_gql({"Admin"})
def resolve_story_translations(root, info, language, level, stage, story_title):
    return services["story"].get_story_translations(language, level, stage, story_title)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translation_tests(root, info, language, level, stage, story_title):
    user_id = int(get_user_id_from_request())
    user = services["user"].get_user_by_id(user_id)
    return services["story"].get_story_translation_tests(
        user, language, level, stage, story_title
    )
