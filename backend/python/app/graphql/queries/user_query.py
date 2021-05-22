from ..service import services

def resolve_users(root, info, **kwargs):
    return services['user'].get_users()

'''
Required queries:
 userById(id: ID!): UserDTO!
 userByEmail(email: String!): UserDTO!
 users: [UserDTO!]!user
'''
