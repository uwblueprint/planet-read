import graphene

from ..service import services
from ..types.user_type import CreateUserDTO, UserDTO


class CreateUser(graphene.Mutation):
    class Arguments:
        user_data = CreateUserDTO(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserDTO)

    def mutate(root, info, user_data=None):
        user_response = services["user"].create_user(user_data).__dict__
        ok = True
        return CreateUser(user=user_response, ok=ok)


"""
TODO mutations:
 updateUser(id: ID!, user: UpdateUserDTO!): UserDTO!
 deleteUserById(id: ID!): ID
 deleteUserByEmail(email: String!): IDdeleteUserById
 deleteUserByEmail
"""
