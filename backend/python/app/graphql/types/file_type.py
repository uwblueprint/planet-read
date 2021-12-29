import graphene


class FileDTO(graphene.ObjectType):
    id = graphene.Int()
    path = graphene.String(required=True)


class CreateFileDTO(graphene.InputObjectType):
    path = graphene.String(required=True)


class DownloadFileDTO(graphene.ObjectType):
    file = graphene.String(required=True)
    ext = graphene.String(required=True)
