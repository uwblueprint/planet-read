from abc import ABC, abstractmethod


class IFileService(ABC):
    """
    A class to handle CRUD functionality for file entities
    """

    @abstractmethod
    def get_file_path(self, id):
        """Return a File and its contents based on id

        :param id: File id
        :return: FileDTO, contains path and id of file
        :rtype: FileDTO
        :raises Exception: id retrieval fails or base64 encoding fails
        """
        pass

    @abstractmethod
    def create_file(self, file):
        """Create a new File object

        :param file: dictionary of file fields
        :return: dictionary of File object
        :rtype: dictionary
        :raises Exception: if file fields are invalid
        """
        pass
