import graphene


class CreateCommentDTO(graphene.InputObjectType):
    story_translation_content_id = graphene.Int(required=True)
    user_id = graphene.Int(required=True)
    content = graphene.String(required=True)


class UpdateCommentDTO(graphene.InputObjectType):
    id = graphene.Int(required=True)
    resolved = graphene.Boolean(required=True)
    content = graphene.String(required=True)


class CommentResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    story_translation_content_id = graphene.Int(required=True)
    user_id = graphene.Int(required=True)
    comment_index = graphene.Int()
    time = graphene.DateTime(required=True)
    resolved = graphene.Boolean(required=True)
    content = graphene.String(required=True)
