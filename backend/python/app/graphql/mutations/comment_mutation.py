import graphene

from ...middlewares.auth import require_authorization_by_role_gql
from ..service import services
from ..types.comment_type import CommentResponseDTO, CreateCommentDTO, UpdateCommentDTO


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


class UpdateComment(graphene.Mutation):
    class Arguments:
        comment_data = UpdateCommentDTO(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(lambda: CommentResponseDTO)

    @require_authorization_by_role_gql({"User", "Admin"})
    def mutate(root, info, comment_data):
        comment_response = services["comment"].update_comment(
            updated_comment=comment_data
        )
        ok = True
        return UpdateComment(ok=ok, comment=comment_response)
