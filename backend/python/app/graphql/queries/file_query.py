from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_file_by_id(root, info, id):
    file = services["file"].get_file_path(id)
    return services["file"].download_file(file.path)
