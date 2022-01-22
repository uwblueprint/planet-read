from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_comments_by_story_translation(
    root, info, story_translation_id, resolved=None
):
    return services["comment"].get_comments_by_story_translation(
        story_translation_id, resolved
    )
