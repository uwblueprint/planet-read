import os
from base64 import b64encode

from ...graphql.types.file_type import DownloadFileDTO
from ...models import db
from ...models.file import File
from ..interfaces.file_service import IFileService


class FileService(IFileService):
    def __init__(self, logger):
        self.logger = logger

    def get_file(self, id):
        try:
            file = File.query.get(id)

            if not file:
                self.logger.error(f"Invalid file id: {id}")
                raise Exception(f"Invalid file id: {id}")

            # encode file data as base64 string
            file_bytes = open(file.path, "rb").read()
            encoded = b64encode(file_bytes).decode("utf-8")

            # extract extension and path
            _, file_extension = os.path.splitext(file.path)
            return DownloadFileDTO(id=id, file=encoded, ext=file_extension[1:])
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get file. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def generate_file_name(self, filename):
        # append number to the filename if duplicate filename found
        suffix = 0
        upload_folder_path = os.getenv("UPLOAD_PATH")
        file = os.path.join(upload_folder_path, filename)
        while os.path.isfile(file):
            split_filename = filename.split(".", 1)
            name = f"{split_filename[0]}_{suffix}"
            new_filename = ".".join([name, split_filename[1]])
            file = os.path.join(upload_folder_path, new_filename)
            suffix += 1
        return file

    def create_file(self, file):
        try:
            self.logger.info(file)
            new_file = File(**file.__dict__)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_file)
        db.session.commit()

        return new_file.to_dict()
