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

    @abstractmethod
    def update_comment(self, updated_comment):
        """Update an existing Comment object

        :param updated_comment: UpdateCommentDTO with comment id, resolved status and content
        :return: updated comment object
        :rtype: CommentResponseDTO
        :raises Exception: if id of comment to be updated does not exist
        """
        pass

    @abstractmethod
    def update_comments(self, updated_comments):
        """Bulk update existing Comment objects

        :param updated_comments: list of UpdateCommentDTO's
        :return: list of UpdateCommentsResponseDTO's
        :rtype: UpdateCommentsResponseDTO
        :raises Exception: if id of comment to be updated does not exist
        """
        pass
