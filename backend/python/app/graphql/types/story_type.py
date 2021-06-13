import graphene

from .language_enum import LanguageEnum


class StageEnum(graphene.Enum):
    START = "START"
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


class StoryRequestDTO(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    translated_languages = graphene.List(LanguageEnum)


class CreateStoryTranslationResponseDTO(graphene.ObjectType):
    id = graphene.Int(required=True)
    translator_id = graphene.Int(required=True)
    story_id = graphene.String(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum)


class CreateStoryTranslationRequestDTO(graphene.InputObjectType):
    translator_id = graphene.Int(required=True)
    story_id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, default_value="TRANSLATE")
