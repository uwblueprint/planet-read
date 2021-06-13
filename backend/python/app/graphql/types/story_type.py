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


class StoryTranslationResponseDTO(graphene.ObjectType):
    story_id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    youtube_link = graphene.String(required=True)
    level = graphene.Int(required=True)
    story_translation_id = graphene.Int(required=True)
    language = graphene.String(required=True)
    stage = graphene.Field(StageEnum, required=True)
    translator_id = graphene.Int()
    reviewer_id = graphene.Int()
