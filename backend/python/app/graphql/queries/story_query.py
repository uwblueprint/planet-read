from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_by_role_gql,
)
from ..service import services


def resolve_stories(root, info, **kwargs):
    return services["story"].get_stories()


def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)


def resolve_stories_available_for_translation(root, info, language, level, user_id):
    target_user_id = _select_user_id_for_available_translations_query(user_id)

    return services["story"].get_stories_available_for_translation(
        language, level, user_id=target_user_id
    )


def resolve_story_translations_by_user(
    root, info, user_id, is_translator, language, level
):
    return services["story"].get_story_translations_by_user(
        user_id, is_translator, language, level
    )


def resolve_story_translation_by_id(root, info, id):
    return services["story"].get_story_translation(id)


def resolve_story_translations_available_for_review(
    root, info, language, level, user_id=None
):
    target_user_id = _select_user_id_for_available_translations_query(user_id)

    return services["story"].get_story_translations_available_for_review(
        language, level, user_id=target_user_id
    )


@require_authorization_by_role_gql({"Admin"})
def resolve_story_translations(
    root, info, language, level, stage, story_title, story_id
):
    return services["story"].get_story_translations(
        language, level, stage, story_title, story_id
    )


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translation_tests(root, info, language, level, stage, story_title):
    user_id = get_user_id_from_request()
    user = services["user"].get_user_by_id(user_id)
    return services["story"].get_story_translation_tests(
        user, language, level, stage, story_title
    )


def _select_user_id_for_available_translations_query(user_id):
    # if caller is admin, use param use_id. Else, use caller id
    calling_user_id = get_user_id_from_request()
    isAdmin = services["user"].get_user_by_id(calling_user_id).role == "Admin"
    return user_id if isAdmin else calling_user_id
