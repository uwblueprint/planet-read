import graphene

from .language_enum import LanguageEnum


class StageEnum(graphene.Enum):
    TRANSLATE = "TRANSLATE"
    REVIEW = "REVIEW"
    PUBLISH = "PUBLISH"


class StoryContentsResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    story_id = graphene.String(required=True)
    line_index = graphene.Int(required=True)
    content = graphene.String(required=True)


class StoryResponseDTO(graphene.ObjectType):
    id = graphene.Int()
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(LanguageEnum)
    contents = graphene.List(StoryContentsResponseDTO)
    date_uploaded = graphene.DateTime()


class StoryRequestDTO(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(LanguageEnum)


class CreateStoryTranslationResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    translator_id = graphene.Int(required=True)
    reviewer_id = graphene.Int()
    story_id = graphene.String(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translator_last_activity = graphene.DateTime()
    reviewer_last_activity = graphene.DateTime()


class CreateStoryTranslationRequestDTO(graphene.InputObjectType):
    translator_id = graphene.Int(required=True)
    story_id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, default_value="TRANSLATE")


class StoryTranslationContentRequestDTO(graphene.InputObjectType):
    id = graphene.Int(required=True)
    translation_content = graphene.String(required=True)


class StoryTranslationContentResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    line_index = graphene.Int(required=True)
    status = graphene.String(required=True)
    translation_content = graphene.String(required=True)


class StoryTranslationResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, required=True)
    translation_contents = graphene.List(StoryTranslationContentResponseDTO)
    translator_id = graphene.Int()
    reviewer_id = graphene.Int()
    story_id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    is_test = graphene.Boolean()
    num_translated_lines = graphene.Int()
    num_approved_lines = graphene.Int()
    num_content_lines = graphene.Int()
    translator_name = graphene.String()
    reviewer_name = graphene.String()
    translator_last_activity = graphene.DateTime()
    reviewer_last_activity = graphene.DateTime()


class StoryTranslationTestResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, required=True)
    translator_id = graphene.Int()
    story_id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translator_name = graphene.String()
    test_grade = graphene.Int()
    test_result = graphene.JSONString(required=False)
    test_feedback = graphene.String()
    date_submitted = graphene.DateTime()


class StoryTranslationNode(graphene.ObjectType):
    story_translation_id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, required=True)
    translator_id = graphene.Int()
    reviewer_id = graphene.Int()
    story_id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translator_name = graphene.String()
    reviewer_name = graphene.String()
    translator_last_activity = graphene.DateTime()
    reviewer_last_activity = graphene.DateTime()

    class Meta:
        interfaces = (graphene.relay.Node,)


class StoryTranslationConnection(graphene.relay.Connection):
    total_count = graphene.Int()

    class Meta:
        node = StoryTranslationNode

    def resolve_total_count(root, info):
        return len(root.iterable)


class StoryTranslationUpdateStatusResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    line_index = graphene.Int(required=True)
    status = graphene.String(required=True)


class UpdateStoryTranslationStageRequestDTO(graphene.InputObjectType):
    id = graphene.Int(required=True)
    stage = graphene.Field(StageEnum, required=True)


class StoryTranslationStatisticsResponseDTO(graphene.ObjectType):
    num_translations_in_translation = graphene.Int(required=True)
    num_translations_in_review = graphene.Int(required=True)
    num_translations_completed = graphene.Int(required=True)
