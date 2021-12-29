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
    def get_comments_by_story_translation(self, story_translation_id):
        """Return a list of Comments from a given StoryTranslation

        :param story_translation_id: story translation id
        :return: list of comments
        :rtype: list of CommentResponseDTO
        :raises Exception: if id of comment to be updated does not exist
        """
        pass

    @abstractmethod
    def update_comment(self, updated_comment):
        """Update an existing Comment object

        :param updated_comment: UpdateCommentRequestDTO
        :return: updated comment object
        :rtype: CommentResponseDTO
        :raises Exception: if id of comment to be updated does not exist
        """
        pass
