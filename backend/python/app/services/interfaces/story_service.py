from abc import ABC, abstractmethod


class IStoryService(ABC):
    """
    A class to handle CRUD functionality for stories, story_contents,
    story_translations, and story_translation_contents
    """

    @abstractmethod
    def get_stories(self):
        """Return a list of all stories

        :return: A list of dictionaries from Story objects
        :rtype: list of dictionaries
        """
        pass

    @abstractmethod
    def get_story(self, id):
        """Return a dictionary from the Story object based on id

        :param id: Story id
        :return: dictionary of Story object
        :rtype: dictionary
        :raises Exception: id retrieval fails
        """
        pass

    @abstractmethod
    def create_story(self, story, content):
        """Create a new Story object

        :param story: dictionary of story fields
        :param content: array of strings representing story content
        :return: dictionary of Story object
        :rtype: dictionary
        :raises Exception: if entity fields are invalid
        """
        pass

    @abstractmethod
    def get_story_translations(self, user_id, translate):
        """Return a list of stories currently being translated/reviewed

        :param user_id: id of the user
        :param translator: boolean; if True will return a list of stories
        being translated by the user, else a list of stories being reviewed
        :return: list of StoryTranslationResponseDTO's
        :rtype: list of StoryTranslationResponseDTO's
        """
        pass

    @abstractmethod
    def get_story_translations_available_for_review(self, language, level):
        """
        Return a list of stories available to be reviewed by user
        :param level: level of user
        :param language: language being searched for
        :return: list of StoryTranslationResponseDTO's
        :rtype: list of StoryTranslationResponseDTO's
        """
        pass
