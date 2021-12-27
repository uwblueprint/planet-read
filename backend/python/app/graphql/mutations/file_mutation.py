import os

import graphene
from graphene_file_upload.scalars import Upload

from ..service import services
from ..types.file_type import CreateFileDTO, FileDTO


# TODO: require User or Admin role
class CreateFile(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()
    file = graphene.Field(lambda: FileDTO)

    def mutate(root, info, file=None):
        try:
            res = services["file"].create_file(file)
            return CreateFile(file=res, ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
