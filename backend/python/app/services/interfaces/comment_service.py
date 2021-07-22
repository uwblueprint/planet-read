from abc import ABC, abstractmethod


class ICommentService(ABC):
    """
    A class to handle CRUD functionality for comments
    """

    @abstractmethod
    def create_comment(self, comment):
        """Create a new Comment object

        :param comment: dictionary of comment fields
        :return: dictionary of Comment object
        :rtype: dictionary
        :raises Exception: if comment fields are invalid
        """
        pass
