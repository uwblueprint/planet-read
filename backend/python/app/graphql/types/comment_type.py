import graphene


class CreateCommentDTO(graphene.InputObjectType):
    story_translation_content_id = graphene.Int(required=True)
    user_id = graphene.Int(required=True)
    content = graphene.String(required=True)


class UpdateCommentRequestDTO(graphene.InputObjectType):
    id = graphene.Int(required=True)
    resolved = graphene.Boolean()
    content = graphene.String()


class CommentResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    story_translation_content_id = graphene.Int(required=True)
    user_id = graphene.Int(required=True)
    comment_index = graphene.Int()
    time = graphene.DateTime(required=True)
    resolved = graphene.Boolean(required=True)
    content = graphene.String(required=True)


class UpdateCommentResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    resolved = graphene.Boolean()
    content = graphene.String()
