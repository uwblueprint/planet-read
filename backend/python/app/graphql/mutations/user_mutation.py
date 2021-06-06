import graphene

from ..service import services
from ..types.user_type import CreateUserDTO, UserDTO, UpdateUserDTO


class CreateUser(graphene.Mutation):
    class Arguments:
        user_data = CreateUserDTO(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserDTO)

    def mutate(root, info, user_data=None):
        user_response = services["user"].create_user(user_data).__dict__
        ok = True
        return CreateUser(user=user_response, ok=ok)

class UpdateUser(graphene.Mutation):
    class Arguments:
        id  = graphene.ID(required=True)
        user = UpdateUserDTO(required=True)
    
    updated_user = graphene.Field(lambda: UserDTO)

    def mutate(root, info, id, user):
        """
        Update the user with the specified user_id
        """
        try:
            updated_user = services["user"].update_user_by_id(id, user)
            return UpdateUser(updated_user=updated_user)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))

"""
TODO mutations:
 updateUser(id: ID!, user: UpdateUserDTO!): UserDTO!
 deleteUserById(id: ID!): ID
 deleteUserByEmail(email: String!): IDdeleteUserById
 deleteUserByEmail
"""
