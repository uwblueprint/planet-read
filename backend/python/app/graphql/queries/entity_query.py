from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_entities(root, info, **kwargs):
    return services["entity"].get_entities()
