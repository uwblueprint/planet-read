from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_languages(root, info):
    return services["language"].get_languages()


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_is_rtl(root, info, language):
    return services["language"].get_is_rtl(language)
