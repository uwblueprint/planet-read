from abc import ABC, abstractmethod


class IFileService(ABC):
    """
    A class to handle CRUD functionality for file entities
    """

    @abstractmethod
    def get_file(self, id):
        """Return a File and its contents based on id

        :param id: File id
        :return: DownloadFileDTO containing file data
        :rtype: DownloadFileDTO
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
