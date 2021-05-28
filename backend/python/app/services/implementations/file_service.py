import os

from ...models.file import File
from ...models import db
from ..interfaces.file_service import IFileService


class FileService(IFileService):
    def __init__(self, logger):
        self.logger = logger

    def get_file(self, id):
        file = File.query.get(id)
        if file is None:
            self.logger.error(f"Invalid id {id}")
            raise Exception(f"Invalid id {id}")
        return file.to_dict()

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
