from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_by_role_gql,
)
from ..service import services


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_stories(root, info, story_title, start_date, end_date, **kwargs):
    return services["story"].get_stories(story_title, start_date, end_date)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_by_id(root, info, id):
    return services["story"].get_story(id)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_stories_available_for_translation(root, info, language, level, user_id):
    target_user_id = _select_user_id_for_available_translations_query(user_id)

    return services["story"].get_stories_available_for_translation(
        language, level, user_id=target_user_id
    )


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translations_by_user(
    root, info, user_id, is_translator, language, level
):
    return services["story"].get_story_translations_by_user(
        user_id, is_translator, language, level
    )


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translation_by_id(root, info, id):
    return services["story"].get_story_translation(id)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translations_available_for_review(
    root, info, language, level, user_id=None
):
    target_user_id = _select_user_id_for_available_translations_query(user_id)

    return services["story"].get_story_translations_available_for_review(
        language, level, user_id=target_user_id
    )


@require_authorization_by_role_gql({"Admin"})
def resolve_story_translation_statistics(root, info):
    return services["story"].get_story_translation_statistics()


@require_authorization_by_role_gql({"Admin"})
def resolve_export_story_translation(root, info, id):
    res = services["story"].export_story_translation(id)
    file = services["file"].download_file(res["path"])
    services["file"].delete_file(res["path"])
    return file


@require_authorization_by_role_gql({"Admin"})
def resolve_story_translations(
    root, info, language, level, stage, story_title, story_id, last_activity_ascending
):
    return services["story"].get_story_translations(
        language, level, stage, story_title, story_id, True
    )


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_story_translation_tests(
    root, info, language, level, stage, story_title, submitted_only
):
    user_id = get_user_id_from_request()
    user = services["user"].get_user_by_id(user_id)
    return services["story"].get_story_translation_tests(
        user, language, level, stage, story_title, submitted_only
    )


def _select_user_id_for_available_translations_query(user_id):
    # if caller is admin, use param use_id. Else, use caller id
    calling_user_id = get_user_id_from_request()
    isAdmin = services["user"].get_user_by_id(calling_user_id).role == "Admin"
    return user_id if isAdmin else calling_user_id
