import graphene


class FileDTO(graphene.ObjectType):
    id = graphene.Int()
    path = graphene.String(required=True)


class CreateFileDTO(graphene.InputObjectType):
    path = graphene.String(required=True)
