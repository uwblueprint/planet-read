import graphene

from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services
from ..types.comment_type import (
    CommentResponseDTO,
    CreateCommentDTO,
    UpdateCommentDTO,
    UpdateCommentsResponseDTO,
)


class CreateComment(graphene.Mutation):
    class Arguments:
        comment_data = CreateCommentDTO(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comment_data):
        comment_response = services["comment"].create_comment(comment=comment_data)
        ok = True
        return CreateComment(ok=ok, comment=comment_response)


class UpdateCommentById(graphene.Mutation):
    class Arguments:
        comment_data = UpdateCommentDTO(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comment_data):
        try:
            comment_response = services["comment"].update_comment(
                updated_comment=comment_data
            )
            ok = True
            return UpdateCommentById(ok=ok, comment=comment_response)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))


class UpdateComments(graphene.Mutation):
    class Arguments:
        comments_data = graphene.List(UpdateCommentDTO)

    ok = graphene.Boolean()
    comments = graphene.Field(lambda: graphene.List(UpdateCommentsResponseDTO))

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comments_data):
        try:
            comments_response = services["comment"].update_comments(
                updated_comments=comments_data
            )
            ok = True
            return UpdateComments(ok=ok, comments=comments_response)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
