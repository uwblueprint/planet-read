import graphene

from ...middlewares.auth import (
    get_user_id_from_request,
    require_authorization_by_role_gql,
)
from ..service import services
from ..types.comment_type import (
    CommentResponseDTO,
    CreateCommentDTO,
    UpdateCommentRequestDTO,
    UpdateCommentResponseDTO,
)


class CreateComment(graphene.Mutation):
    class Arguments:
        comment_data = CreateCommentDTO(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comment_data):
        user_id = get_user_id_from_request()
        comment_response = services["comment"].create_comment(
            comment=comment_data, user_id=user_id
        )
        ok = True
        return CreateComment(ok=ok, comment=comment_response)


class UpdateCommentById(graphene.Mutation):
    class Arguments:
        comment_data = UpdateCommentRequestDTO(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comment_data):
        try:
            user_id = get_user_id_from_request()
            comment_response = services["comment"].update_comment(
                updated_comment=comment_data, user_id=user_id
            )
            ok = True
            return UpdateCommentById(ok=ok, comment=comment_response)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
