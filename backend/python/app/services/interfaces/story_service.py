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
        :raises Exception: if story fields are invalid
        """
        pass

    @abstractmethod
    def get_story_translations(self, user_id, is_translator, language, level):
        """Return a list of stories currently being translated/reviewed

        :param user_id: id of the user
        :param is_translator: if True will return a list of stories being
        translated by the user, if False a list of stories being reviewed; if
        null returns story translations being either translated/reviewed by user
        :param language: language of story translations to filter by and return
        :param level: level of story translations to filter by and return
        :return: list of StoryTranslationResponseDTO's
        :rtype: list of StoryTranslationResponseDTO's
        """
        pass

    @abstractmethod
    def get_story_translation(self, id):
        """Return a story currently being translated/reviewed
        :param id: id of the story translation
        :return: StoryTranslationResponseDTO
        :rtype: StoryTranslationResponseDTO
        :raises Exception: id retrieval fails
        """
        pass

    # Deprecated: function is not currently in use (story translation stage logic has not been tested)
    @abstractmethod
    def update_story_translation_content(self, story_translation_content):
        """Update a single story translation content entry
        :param story_translation_content: StoryTranslationContentRequestDTO id and updated
        translation for story translation
        :return: StoryTranslationContentResponseDTO
        :rtype: StoryTranslationContentResponseDTO
        """
        pass

    @abstractmethod
    def update_story_translation_contents(self, story_translations):
        """Batch update story translation content entries
        :param story_translations: list of StoryTranslationContentRequestDTO objects
        :return: list of StoryTranslationContentResponseDTO objects
        :rtype: [StoryTranslationContentResponseDTO]
        """
        pass

    @abstractmethod
    def update_story_translation_stage(self, story_translation_data):
        """Update the stage of a story translation
        :param story_translation_data: UpdateStoryTranslationStageRequestDTO
        :raises Exception: if the user is not authorized to move the translation to the given stage
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

    @abstractmethod
    def update_story_translation_content_status(
        self, story_translation_content_id, status
    ):
        """
        Update a single story translation content status
        :param story_translation_content: StoryTranslationContentRequestDTO id and updated
        status for story translation
        :return: StoryTranslationContentResponseDTO
        :rtype: StoryTranslationContentResponseDTO
        """
        pass

    @abstractmethod
    def approve_all_story_translation_content(self, story_translation_id):
        """
        Set all story translation content statuses to approved
        :param story_translation_id: id of story translation
        """
        pass
