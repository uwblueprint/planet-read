from ..service import services


def resolve_users(root, info, **kwargs):
    return services["user"].get_users()


def resolve_user_by_id(root, info, id):
    return services["user"].get_user_by_id(id)


def resolve_user_by_email(root, info, email):
    return services["user"].get_user_by_email(email)


"""
Required queries:
 userById(id: ID!): UserDTO!
 userByEmail(email: String!): UserDTO!
 users: [UserDTO!]!user
"""
