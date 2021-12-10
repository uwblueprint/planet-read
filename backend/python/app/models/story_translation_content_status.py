import enum


class StoryTranslationContentStatus(enum.Enum):
    name = "story_translation_content_status"
    DEFAULT = "DEFAULT"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    APPROVED = "APPROVED"
    TEST_CORRECT = "TEST_CORRECT"
    TEST_INCORRECT = "TEST_INCORRECT"
    TEST_PARTIALLY_CORRECT = "TEST_PARTIALLY_CORRECT"
