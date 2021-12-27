import graphene
from graphene_file_upload.scalars import Upload

from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_by_role_gql,
    require_authorization_by_user_id_not_equal,
)
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


class UpdateMe(graphene.Mutation):
    class Arguments:
        user = UpdateUserDTO(required=True)
        resume = Upload(required=True)

    user = graphene.Field(lambda: UserDTO)

    def mutate(root, info, user, resume=None):
        """
        Update the user that made the request
        """
        try:
            user_id = get_user_id_from_request()
            res = services["file"].create_file(resume)
            updated_user = services["user"].update_me(user_id, user, res)
            return UpdateMe(user=updated_user)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateUserByID(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        user = UpdateUserDTO(required=True)

    user = graphene.Field(lambda: UserDTO)

    @require_authorization_by_role_gql({"Admin"})
    def mutate(root, info, id, user):
        """
        Update the user with the specified user_id
        """
        try:
            updated_user = services["user"].update_user_by_id(id, user)
            return UpdateUserByID(user=updated_user)
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


class SoftDeleteUser(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @require_authorization_by_role_gql({"Admin"})
    @require_authorization_by_user_id_not_equal()
    def mutate(root, info, id):
        try:
            services["user"].soft_delete_user(id)
            return SoftDeleteUser(ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
