import enum


class StoryTranslationContentStatus(enum.Enum):
    name = "story_translation_content_status"
    DEFAULT = "DEFAULT"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    READY_FOR_REVIEW = "READY_FOR_REVIEW"
    APPROVED = "APPROVED"
    