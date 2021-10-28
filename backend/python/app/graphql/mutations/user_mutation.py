import graphene

from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services
from ..types.user_type import CreateUserWithEmailDTO, UpdateUserDTO, UserDTO


class CreateUser(graphene.Mutation):
    class Arguments:
        user_data = CreateUserWithEmailDTO(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, user_data=None):
        user_response = services["user"].create_user(user_data).__dict__
        ok = True
        return CreateUser(user=user_response, ok=ok)


class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        user = UpdateUserDTO(required=True)

    user = graphene.Field(lambda: UserDTO)

    def mutate(root, info, id, user):
        """
        Update the user with the specified user_id
        """
        try:
            updated_user = services["user"].update_user_by_id(id, user)
            return UpdateUser(user=updated_user)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateUserApprovedLanguages(graphene.Mutation):
    class Arguments:
        user_id = graphene.ID(required=True)
        is_translate = graphene.Boolean(required=True)
        language = graphene.String(required=True)
        level = graphene.Int(required=True)

    user = graphene.Field(lambda: UserDTO)

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, user_id, is_translate, language, level):
        """
        Update approved languages of the specified user
        """
        try:
            updated_user = services["user"].update_approved_language(
                user_id, is_translate, language, level
            )
            return UpdateUserApprovedLanguages(user=updated_user)
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
