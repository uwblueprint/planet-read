from abc import ABC, abstractmethod


class IFileService(ABC):
    """
    A class to handle CRUD functionality for entities
    """

    @abstractmethod
    def get_file(self, id):
        """Return a dictionary from the File object based on id

        :param id: File id
        :return: dictionary of File object
        :rtype: dictionary
        :raises Exception: id retrieval fails
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
