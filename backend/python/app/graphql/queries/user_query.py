from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services


@require_authorization_by_role_gql({"Admin"})
def resolve_users(root, info, isTranslators, language, level, name_or_email):
    return services["user"].get_users(isTranslators, language, level, name_or_email)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_user_by_id(root, info, id):
    return services["user"].get_user_by_id(id)


@require_authorization_by_role_gql({"User", "Admin"})
def resolve_user_by_email(root, info, email):
    return services["user"].get_user_by_email(email)


"""
Required queries:
 userById(id: ID!): UserDTO!
 userByEmail(email: String!): UserDTO!
 users: [UserDTO!]!user
"""
