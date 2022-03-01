from abc import ABC, abstractmethod


class IStoryService(ABC):
    """
    A class to handle CRUD functionality for stories, story_contents,
    story_translations, and story_translation_contents
    """

    @abstractmethod
    def get_stories(self, story_title, start_date, end_date):
        """Return a list of all stories

        :param story_title: optional title of story to filter by likeness and
        return
        :param start_date: optional start date to filter story upload date by
        :param end_date: optional end date to filter story upload date by
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
    def create_translation(self, translation):
        """Create a new StoryTranslation object

        :param translation: dictionary of story translation fields
        :return: dictionary of StoryTranslation object
        :rtype: dictionary
        :raises Exception: if story fields are invalid
        """
        pass

    @abstractmethod
    def create_translation_test(self, user_id, level, language, wants_reviewer):
        """Create a new StoryTranslation object that is_test=True

        :param user_id: ID target translator_id
        :param level: int Story test level
        :param language: String target test language
        :param wants_reviewer: Boolean indicating if user wants to be
                               assigned level for review
        :return: dictionary of StoryTranslation object
        :rtype: dictionary
        :raises Exception: if story fields are invalid
        """
        pass

    @abstractmethod
    def get_story_translations_by_user(self, user_id, is_translator, language, level):
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
    def get_story_translations(
        self,
        language,
        level,
        stage,
        story_title,
        story_id,
        role_filter,
        last_activity_ascending,
    ):
        """Return a list of story translations based on filters

        :param language: language of story translations to filter by and return
        :param level: level of story translations to filter by and return
        :param stage: stage of story translations to filter by and return
        :param story_title: story_title of story translations to filter by
        likeness and return
        :param story_id: story_id of story translation to filter by
        :param role_filter: filter to get story_translations by user_id/role
        :param last_activity_ascending: whether or not story translations are sorted by last activity
        :return: list of StoryTranslationNode's
        :rtype: list of StoryTranslationNode's
        """
        pass

    @abstractmethod
    def get_story_translation_tests(
        self, user, language, level, stage, story_title, submitted_only
    ):
        """Return a list of story translation tests based on filters

        :param user: UserDTO
        :param language: language of story translation tests to filter by
        :param level: level of story translation tests to filter by
        :param stage: stage of story translation tests to filter by
        :param story_title: story_title of story translation tests to filter by
        :param submitted_only: indicates whether to return only tests that have been submitted
        :return: list of StoryTranslationTestResponseDTO's
        :rtype: list of StoryTranslationTestResponseDTO's
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

    @abstractmethod
    def assign_user_as_reviewer(self, user, story_translation_id):
        """Assign a user as a reviewer of a story translation

        :param user: user object
        :param story_translation_id: id of the story translation
        :return: dictionary of StoryTranslation object
        :rtype: dictionary
        :raises Exception: if user can't be assigned as a reviewer
        """
        pass

    @abstractmethod
    def update_story(self, story_id, title, level, description, youtube_link):
        """Update a single story
        :param story_id: id of story to be updated
        :param title: updated title
        :param level: updated level
        :param description: updated description
        :param youtube_link: updated youtube_link
        :raises Exception: if the user is not authorized to update stories
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
    def get_stories_available_for_translation(self, language, level, user_id):
        """
        Return a list of stories available to be translated by user
        :param level: level of user
        :param language: language being searched for
        :param user_id: user_id looking for stories to translate
        :return: list of StoryDTO's
        :rtype: list of StoryDTO's
        """
        pass

    @abstractmethod
    def get_story_translations_available_for_review(self, language, level, user_id):
        """
        Return a list of story translations available to be reviewed by user
        :param level: level of user
        :param language: language being searched for
        :param user_id: user_id looking for stories to translate
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

    @abstractmethod
    def soft_delete_story_translation(self, id):
        """
        Soft delete a story translation by setting is_deleted=True
        :param id: id of the story translation
        """

    @abstractmethod
    def remove_user_from_story_translation(self, story_translation_id, user_id):
        """
        Remove a user from a story translation; if the user is a reviewer, set
        the reviewer_id=None, if the user is a translator, soft delete the story
        translation
        :param story_translation_id: id of the story translation
        :param user_id: id of the user to be removed
        """

    @abstractmethod
    def soft_delete_story(self, id):
        """
        Soft delete a story by setting is_deleted=True
        :param id: id of the story
        """

    @abstractmethod
    def import_story(self, details, file):
        """
        Import story from word doc and save as Story & StoryContents in db
        :param detail: details of story
        :param file: file information
        """

    @abstractmethod
    def process_story(self, story_file):
        """
        Process story from word doc for preview
        :param story_file: file information
        """
