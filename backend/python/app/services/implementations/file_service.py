import os
from base64 import b64encode

from werkzeug.utils import secure_filename

from ...graphql.types.file_type import DownloadFileDTO, FileDTO
from ...models import db
from ...models.file import File
from ..interfaces.file_service import IFileService
from .utils import handle_exceptions


class FileService(IFileService):
    def __init__(self, logger):
        self.logger = logger

    def get_file_path(self, id):
        try:
            file = File.query.get(id)

            if not file:
                self.logger.error(f"Invalid file id: {id}")
                raise Exception(f"Invalid file id: {id}")

            return file
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get file. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def download_file(self, file_path):
        try:  # encode file data as base64 string
            file_bytes = open(file_path, "rb").read()
            encoded = b64encode(file_bytes).decode("utf-8")

            # extract extension and path
            _, file_extension = os.path.splitext(file_path)
            return DownloadFileDTO(file=encoded, ext=file_extension[1:])
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

    def validate_file(self, filename, extension):
        split_filename = filename.split(".", 1)
        return split_filename[-1] == extension

    @handle_exceptions
    def create_file(self, file):
        try:
            upload_folder_path = os.getenv("UPLOAD_PATH")
            upload_path = os.path.join(
                upload_folder_path, secure_filename(file.filename)
            )
            if os.path.isfile(upload_path):
                upload_path = self.generate_file_name(secure_filename(file.filename))
            file.save(upload_path)
            file_dto = FileDTO(path=upload_path)

            self.logger.info(file_dto)
            new_file = File(**file_dto.__dict__)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_file)
        db.session.commit()

        return new_file.to_dict()

    @handle_exceptions
    def delete_file(self, file):
        try:
            os.remove(file)
            f = File.query.filter(File.path == file).order_by(File.id.desc()).first()
            if f:
                db.session.delete(f)
        except Exception as error:
            self.logger.error(str(error))
            raise error
        db.session.commit()
        return
