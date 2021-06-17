import os

import graphene
from graphene_file_upload.scalars import Upload
from werkzeug.utils import secure_filename

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
            upload_folder_path = os.getenv("UPLOAD_PATH")
            upload_path = os.path.join(
                upload_folder_path, secure_filename(file.filename)
            )
            if os.path.isfile(upload_path):
                upload_path = services["file"].generate_file_name(
                    secure_filename(file.filename)
                )
            file.save(upload_path)
            file_dto = FileDTO(path=upload_path)
            res = services["file"].create_file(file_dto)
            return CreateFile(file=res, ok=True)
        except Exception as e:
            error_message = getattr(e, "message", None)
            raise Exception(error_message if error_message else str(e))
