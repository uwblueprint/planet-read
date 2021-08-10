import enum


class StoryTranslationContentStatus(enum.Enum):
    name = "story_translation_content_status"
    DEFAULT = "DEFAULT"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    APPROVED = "APPROVED"
